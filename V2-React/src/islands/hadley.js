// ================================================================
//  HADLEY ISLAND  ("survey")
//  Single source of truth for every island-specific value:
//    • terrain constants (size, segments, water level)
//    • noise seeds & erosion iterations
//    • camera defaults
//    • geological layers + processes
//    • lake / river / farm geometry
//    • height function, structural geology, layer lookup
//
//  Engine systems (TerrainGenerator, VegetationSystem, SceneManager)
//  consume the exported `hadleyIsland` object so they contain NO
//  hardcoded island data — making new islands trivial to add.
// ================================================================
import {
  LAYERS,
  GEOLOGICAL_PROCESSES,
  LAYER_INTERACTIONS,
  getLayerAtElevation,
} from '../config/geology';
import { fbm, ridgeNoise } from '../engine/noise';
import { catmullRom, subdivideRiverPath } from '../engine/TerrainGenerator';

// ── Terrain footprint ─────────────────────────────────────────
export const TERRAIN_SIZE = 2000;   // 2 km × 2 km
export const SEGMENTS     = 512;    // heightmap grid dimension
export const WATER_LEVEL  = 38;     // ocean base level (m)

// ── Lake definitions (world-space) ───────────────────────────
// Depths are relative to the carved basin centre; the water surface is
// determined at run-time by sampling the lowest rim point of each basin.
export const LAKES = [
  { cx: -320, cz:  180, rx: 160, rz: 110, depth:  55, name: 'Mirror Lake'   },
  { cx:  260, cz: -280, rx: 130, rz: 150, depth:  60, name: 'Crystal Pond'  },
  { cx: -140, cz: -420, rx: 100, rz:  80, depth:  25, name: 'Emerald Tarn'  },
  { cx:  550, cz:  200, rx: 140, rz: 100, depth:  75, name: 'Sapphire Lake' },
  { cx: -560, cz: -120, rx:  90, rz: 110, depth:  70, name: 'Hidden Pool'   },
];

// ── River path ────────────────────────────────────────────────
// Control points trace the Serpent River from the NW mountain
// foothills through the central valley to the SE coastal plain.
// All points are on land (within the island coastline).
export const RIVERS = [
  {
    name: 'Serpent River',
    width: 30,
    depth: 16,
    points: [
      { x: -620, z: -490 },  // NW mountain foothills (source)
      { x: -440, z: -350 },  // mountain slope
      { x: -270, z: -200 },  // upper valley
      { x: -100, z:  -70 },  // mid-valley floor
      { x:   50, z:   60 },  // central lowlands
      { x:  180, z:  130 },  // middle valley
      { x:  300, z:   80 },  // lower valley
      { x:  420, z:   10 },  // pre-coastal plain
      { x:  560, z: -100 },  // coastal slope
      { x:  700, z: -175 },  // near coast
      { x:  810, z: -135 },  // river mouth (coast)
    ],
  },
];

// ── Farm compound (flat plateau) ─────────────────────────────
export const FARM = {
  cx: 380, cz: 320, radius: 160,
  elevation: 95,
};

// ── Dense river path cache ────────────────────────────────────
const _denseCache = new Map();
export function getDenseRiverPath(river) {
  if (_denseCache.has(river.name)) return _denseCache.get(river.name);
  const dense = subdivideRiverPath(river.points, 8);
  _denseCache.set(river.name, dense);
  return dense;
}

// ── Terrain height formula ────────────────────────────────────
function generateHeight(noise, noiseB, x, z) {
  const HALF = TERRAIN_SIZE / 2;

  // 1. Base continental terrain
  const base = fbm(noise, x * 0.00045, z * 0.00045, 6) * 55;

  // 2. Mountain ranges
  const mtnMask1 = Math.max(0, 1 - ((x + 400) ** 2 + (z + 300) ** 2) / (650 * 650));
  const ridge1   = ridgeNoise(noiseB, x * 0.0008, z * 0.0008, 5) * 120 * mtnMask1;
  const mtnMask2 = Math.max(0, 1 - ((x - 500) ** 2 + (z + 400) ** 2) / (500 * 500));
  const ridge2   = ridgeNoise(noise, x * 0.001 + 5, z * 0.001 + 5, 4) * 80 * mtnMask2;

  // 3. Rolling hills
  const hills = fbm(noiseB, x * 0.0012, z * 0.0012, 4) * 30;

  // 4. Valley / drainage carving
  const valley = Math.abs(noise(x * 0.0008, z * 0.0008)) * 25;

  // 5. Detail and micro
  const detail = fbm(noise, x * 0.004, z * 0.004, 3) * 8;
  const micro  = fbm(noise, x * 0.012, z * 0.012, 2) * 2.5;

  // 6. Plateau / mesa shapes
  const plateau = Math.max(0, fbm(noiseB, x * 0.00025, z * 0.00025, 3)) * 18;

  // 7. Edge falloff — irregular island coastline
  const ex = x / HALF, ez = z / HALF;
  const rawDist = Math.sqrt(ex * ex * 0.85 + ez * ez * 1.05);
  const ang = Math.atan2(ez, ex);
  const coastWarp =
      0.14 * noise(Math.cos(ang) * 2.2 + 3.0, Math.sin(ang) * 2.2 + 3.0)
    + 0.07 * noise(Math.cos(ang) * 5.5 + 10,  Math.sin(ang) * 5.5 + 10)
    + 0.04 * noiseB(Math.cos(ang) * 11 + 20,  Math.sin(ang) * 11 + 20);
  const radialWarp = 0.08 * noise(x * 0.0015 + 50, z * 0.0015 + 50)
                   + 0.05 * noiseB(x * 0.003 + 80, z * 0.003 + 80);
  const coastThreshold = 0.78 + coastWarp + radialWarp;
  const edgeFalloff = rawDist > coastThreshold
    ? (rawDist - coastThreshold) / Math.max(0.08, 0.18 - Math.abs(coastWarp) * 0.3)
    : 0;
  const edgeDrop = edgeFalloff * edgeFalloff * 75;

  // Compose
  let h = 80 + base + ridge1 + ridge2 + hills + detail + micro + plateau - valley - edgeDrop;
  h = Math.max(h, 18);

  // Flatten farm compound
  {
    const fdx = (x - FARM.cx) / FARM.radius;
    const fdz = (z - FARM.cz) / FARM.radius;
    const fd2 = fdx * fdx + fdz * fdz;
    if (fd2 < 2.5) {
      const fd = Math.sqrt(fd2);
      const ft = Math.max(0, 1 - fd / 1.4);
      const fs = ft * ft * (3 - 2 * ft);
      const farmTarget = FARM.elevation + fbm(noiseB, x * 0.003, z * 0.003, 2) * 1.5;
      h = h * (1 - fs) + farmTarget * fs;
    }
  }

  // Carve lake basins
  for (const lake of LAKES) {
    const dx = (x - lake.cx) / lake.rx;
    const dz = (z - lake.cz) / lake.rz;
    const d2 = dx * dx + dz * dz;
    if (d2 < 2.25) {
      const dist = Math.sqrt(d2);
      const t = Math.max(0, 1 - dist / 1.5);
      const s = t * t * (3 - 2 * t);
      const depthCurve = Math.max(0, 1 - dist * dist) * lake.depth;
      h -= s * (depthCurve + 8);
    }
  }

  // Carve river channels
  for (const river of RIVERS) {
    const pts = getDenseRiverPath(river);
    let minD2 = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i].x, az = pts[i].z;
      const bx = pts[i + 1].x, bz = pts[i + 1].z;
      const abx = bx - ax, abz = bz - az;
      const apx = x - ax, apz = z - az;
      const lenSq = abx * abx + abz * abz;
      const t2 = lenSq > 0 ? Math.max(0, Math.min(1, (apx * abx + apz * abz) / lenSq)) : 0;
      const cx2 = ax + t2 * abx, cz2 = az + t2 * abz;
      const d2 = (x - cx2) ** 2 + (z - cz2) ** 2;
      if (d2 < minD2) minD2 = d2;
    }
    const dist = Math.sqrt(minD2);
    const rw = river.width;
    if (dist < rw * 4.5) {
      const t3 = Math.max(0, 1 - dist / (rw * 3.5));
      const s3 = t3 * t3 * (3 - 2 * t3);
      const channelDepth = river.depth * Math.max(0, 1 - (dist / rw) ** 2);
      h -= s3 * (channelDepth + 12);
    }
  }

  return h;
}

// ── Structural geology offset (bedding + fault) ───────────────
// Combined replacement for getBeddingPerturbation + getFaultOffset.
function getStructuralOffset(noise, wx, wz) {
  // Regional fold axis (~NE-SW, λ ≈ 600 m)
  const fold = Math.sin((wx + wz) * 0.004 + noise(wx * 0.001, wz * 0.001) * 2) * 12;
  const n1   = noise(wx * 0.0003, wz * 0.0003) * 14;
  const n2   = noise(wx * 0.001 + 50, wz * 0.001 + 50) * 6;
  // Normal fault: x = 200, 28 m down-throw east
  const faultT = 1 / (1 + Math.exp(-(wx - 200) / 10));
  return fold + n1 + n2 + faultT * -28;
}

// ── Layer lookup ──────────────────────────────────────────────
function getLayerAt(noise, wx, elev, wz) {
  return getLayerAtElevation(elev - getStructuralOffset(noise, wx, wz));
}

// ── Simple elevation-only layer lookup (for vegetation) ───────
function getLayerByElevation(elev) {
  return getLayerAtElevation(elev);
}

// ── Smooth fractional layer index (for terrain shader) ────────
function computeLayerIndex(noise, wx, h, wz) {
  const adjElev = h - getStructuralOffset(noise, wx, wz);
  const BLEND = 6; // metres of transition zone
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    if (adjElev >= LAYERS[i].baseElevation) {
      if (i < LAYERS.length - 1) {
        const next = LAYERS[i + 1].baseElevation;
        const dist = next - adjElev;
        if (dist < BLEND && dist > 0) return i + (1 - dist / BLEND);
      }
      return i;
    }
  }
  return 0;
}

// ── Island definition object ──────────────────────────────────
export const hadleyIsland = {
  id: 'survey',

  // Terrain configuration
  terrain: {
    size:              TERRAIN_SIZE,
    segments:          SEGMENTS,
    waterLevel:        WATER_LEVEL,
    noiseSeeds:        [42, 137],
    erosionIterations: 38000,
  },

  // Default camera view
  camera: {
    position: [-400, 350, 700],
    target:   [0, 80, 0],
  },

  // Geology
  layers:              LAYERS,
  geologicalProcesses: GEOLOGICAL_PROCESSES,
  layerInteractions:   LAYER_INTERACTIONS,

  // Geography
  lakes:   LAKES,
  rivers:  RIVERS,
  farm:    FARM,

  // Engine-facing functions (called by TerrainGenerator, VegetationSystem, SceneManager)
  generateHeight,
  getStructuralOffset,
  getLayerAt,
  getLayerByElevation,
  computeLayerIndex,
  getDenseRiverPath,
};
