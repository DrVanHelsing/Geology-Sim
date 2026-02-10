// ================================================================
//  TERRAIN GENERATOR
//  Procedural heightmap → erosion → geometry with per-vertex
//  layer index + colour for the custom terrain shader.
//  Features: mountain ranges, rolling hills, river valleys,
//  lake basins, and a flattened farm plateau.
// ================================================================
import * as THREE from 'three';
import { LAYERS, TERRAIN_SIZE, SEGMENTS, getLayerAtElevation, WATER_LEVEL } from '../config/geology';
import { fbm, ridgeNoise } from './noise';

const S = SEGMENTS + 1; // grid dimension
const HALF = TERRAIN_SIZE / 2; // 1000

/* ─── Lake definitions (world-space centres + radii) ─── *
 * Lakes are placed in valley floors / low basins.
 * rx, rz = semi-axes of the elliptical basin.              */
export const LAKES = [
  { cx: -320, cz:  180, rx: 160, rz: 110, depth: 24, name: 'Mirror Lake' },
  { cx:  260, cz: -280, rx: 130, rz: 150, depth: 22, name: 'Crystal Pond' },
  { cx: -140, cz: -420, rx: 100, rz:  80, depth: 18, name: 'Emerald Tarn' },
  { cx:  550, cz:  200, rx: 140, rz: 100, depth: 20, name: 'Sapphire Lake' },
  { cx: -560, cz: -120, rx:  90, rz: 110, depth: 56, name: 'Hidden Pool' },
];

/* ─── River path — control points the river follows (world coords) ─── *
 * The Serpent River flows from the NW mountains down through the       *
 * central valley to the SE low-lands. Points are placed in the        *
 * valley floor so the channel carving follows natural drainage.       */
export const RIVERS = [
  {
    name: 'Serpent River',
    width: 30,
    depth: 16,
    points: [
      { x: -850, z: -650 },
      { x: -620, z: -480 },
      { x: -400, z: -300 },
      { x: -220, z: -120 },
      { x:  -60, z:   30 },
      { x:   80, z:  130 },
      { x:  230, z:   80 },
      { x:  380, z:   10 },
      { x:  530, z: -100 },
      { x:  680, z: -180 },
      { x:  850, z: -140 },
    ],
  },
];

/* ─── Farm compound — a flat plateau in gentle terrain ─── */
export const FARM = {
  cx: 380, cz: 320, radius: 160,
  elevation: 95,          // target flat elevation (lower plain area)
};

/* ── Catmull-Rom interpolation for smooth river carving path ── */
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t
    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

function subdivideRiverPath(pts, subsPerSeg = 8) {
  const result = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < subsPerSeg; j++) {
      const t = j / subsPerSeg;
      result.push({
        x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
        z: catmullRom(p0.z, p1.z, p2.z, p3.z, t),
      });
    }
  }
  result.push({ x: pts[pts.length - 1].x, z: pts[pts.length - 1].z });
  return result;
}

// Pre-computed dense river paths for terrain carving (cached)
const _denseRiverPaths = new Map();
function getDenseRiverPath(river) {
  if (_denseRiverPaths.has(river.name)) return _denseRiverPaths.get(river.name);
  const dense = subdivideRiverPath(river.points, 8);
  _denseRiverPaths.set(river.name, dense);
  return dense;
}

/* ==============================================================
 *  generateHeight — multi-octave terrain with geological realism
 *
 *  Height range: ~25 – 280 m
 *  • Mountains:  NW and NE ranges via directional ridge noise
 *  • Hills:      rolling mid-frequency noise across the map
 *  • Valleys:    abs-noise carved drainage through the centre
 *  • Plateaus:   broad mesa shapes
 *  • Lake bowls: subtractive carving
 *  • River:      subtractive channel carving
 *  • Farm:       Hermite flattening
 * ============================================================== */
export function generateHeight(noise, noiseB, x, z) {
  // ── 1. Base continental terrain ──
  const base = fbm(noise, x * 0.00045, z * 0.00045, 6) * 55;

  // ── 2. Mountain ranges ──
  // NW–SE oriented ridge belt (high peaks in NW quadrant)
  const mtnMask1 = Math.max(0, 1 - ((x + 400) * (x + 400) + (z + 300) * (z + 300)) / (650 * 650));
  const ridge1 = ridgeNoise(noiseB, x * 0.0008, z * 0.0008, 5) * 120 * mtnMask1;

  // NE ridge cluster (secondary range)
  const mtnMask2 = Math.max(0, 1 - ((x - 500) * (x - 500) + (z + 400) * (z + 400)) / (500 * 500));
  const ridge2 = ridgeNoise(noise, x * 0.001 + 5, z * 0.001 + 5, 4) * 80 * mtnMask2;

  // ── 3. Rolling hills (everywhere, gentler) ──
  const hills = fbm(noiseB, x * 0.0012, z * 0.0012, 4) * 30;

  // ── 4. Valley / drainage carving ──
  // |noise| creates V-shaped valleys that rivers could follow
  const valleyNoise = Math.abs(noise(x * 0.0008, z * 0.0008));
  const valley = valleyNoise * 25; // subtracted later

  // ── 5. Detail and micro ──
  const detail = fbm(noise, x * 0.004, z * 0.004, 3) * 8;
  const micro  = fbm(noise, x * 0.012, z * 0.012, 2) * 2.5;

  // ── 6. Plateau / mesa shapes ──
  const plateau = Math.max(0, fbm(noiseB, x * 0.00025, z * 0.00025, 3)) * 18;

  // ── 7. Edge falloff — terrain lowers towards map edges like an island ──
  const ex = x / HALF, ez = z / HALF;
  const edgeDist = Math.max(Math.abs(ex), Math.abs(ez));
  const edgeFalloff = edgeDist > 0.85 ? (edgeDist - 0.85) / 0.15 : 0;
  const edgeDrop = edgeFalloff * edgeFalloff * 60;

  // ── Compose ──
  //   Base floor of ~80 m ensures most terrain is well above WATER_LEVEL (38)
  let h = 80 + base + ridge1 + ridge2 + hills + detail + micro + plateau - valley - edgeDrop;

  // Clamp to minimum (ocean floor)
  h = Math.max(h, 18);

  // ── Flatten for farm compound ──
  {
    const fdx = (x - FARM.cx) / FARM.radius;
    const fdz = (z - FARM.cz) / FARM.radius;
    const fd2 = fdx * fdx + fdz * fdz;
    if (fd2 < 2.5) {
      const fd = Math.sqrt(fd2);
      const ft = Math.max(0, 1 - fd / 1.4);
      const fs = ft * ft * (3 - 2 * ft); // Hermite smoothstep
      const farmTarget = FARM.elevation + fbm(noiseB, x * 0.003, z * 0.003, 2) * 1.5;
      h = h * (1 - fs) + farmTarget * fs;
    }
  }

  // ── Carve lake basins ──
  for (const lake of LAKES) {
    const dx = (x - lake.cx) / lake.rx;
    const dz = (z - lake.cz) / lake.rz;
    const d2 = dx * dx + dz * dz;
    if (d2 < 2.25) {
      const dist = Math.sqrt(d2);
      const t = Math.max(0, 1 - dist / 1.5);
      const s = t * t * (3 - 2 * t);
      const depthCurve = Math.max(0, 1 - dist * dist) * lake.depth;
      h -= s * (depthCurve + 8); // +8 ensures a definite bowl
    }
  }

  // ── Carve river channels (Catmull-Rom subdivided path) ──
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
      // Smooth Hermite channel — wide blend zone for natural river banks
      const t3 = Math.max(0, 1 - dist / (rw * 3.5));
      const s3 = t3 * t3 * (3 - 2 * t3);
      // Channel depth — parabolic cross-section, deepest at centre
      const channelDepth = river.depth * Math.max(0, 1 - (dist / rw) * (dist / rw));
      h -= s3 * (channelDepth + 12);
    }
  }

  return h;
}

/* ─── Bedding perturbation (fold + noise) ───── */

export function getBeddingPerturbation(noise, wx, wz) {
  // Regional fold axis (~NE-SW, λ ≈ 600 m)
  const fold = Math.sin((wx + wz) * 0.004 + noise(wx * 0.001, wz * 0.001) * 2) * 12;
  // Broad noise
  const n1 = noise(wx * 0.0003, wz * 0.0003) * 14;
  // Medium noise
  const n2 = noise(wx * 0.001 + 50, wz * 0.001 + 50) * 6;
  return fold + n1 + n2;
}

/* ─── Fault offset (N-S normal fault) ────────── */

export function getFaultOffset(wx) {
  const faultX   = 200;
  const width    = 40;
  const displacement = -28; // 28 m down-throw to the east
  const t = 1 / (1 + Math.exp(-(wx - faultX) / (width * 0.25)));
  return t * displacement;
}

/* ─── Layer lookup with structural features ──── */

export function getLayerAtPosition(noise, wx, elev, wz) {
  const perturb = getBeddingPerturbation(noise, wx, wz) + getFaultOffset(wx);
  return getLayerAtElevation(elev - perturb);
}

/* ─── Smooth fractional layer index for blending */

function computeLayerIndex(noise, wx, h, wz) {
  const perturb = getBeddingPerturbation(noise, wx, wz) + getFaultOffset(wx);
  const adjElev = h - perturb;
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

/* ─── Heightmap build ────────────────────────── */

export function buildHeightMap(noise, noiseB) {
  const hm = new Float32Array(S * S);
  for (let gz = 0; gz < S; gz++)
    for (let gx = 0; gx < S; gx++) {
      const wx = (gx / SEGMENTS - 0.5) * TERRAIN_SIZE;
      const wz = (gz / SEGMENTS - 0.5) * TERRAIN_SIZE;
      hm[gz * S + gx] = generateHeight(noise, noiseB, wx, wz);
    }
  return hm;
}

/* ─── Heightmap interpolation ────────────────── */

export function getTerrainHeight(hm, wx, wz) {
  const gx = (wx + TERRAIN_SIZE / 2) / TERRAIN_SIZE * SEGMENTS;
  const gz = (wz + TERRAIN_SIZE / 2) / TERRAIN_SIZE * SEGMENTS;
  const x0 = Math.max(0, Math.min(SEGMENTS - 1, gx | 0));
  const z0 = Math.max(0, Math.min(SEGMENTS - 1, gz | 0));
  const x1 = Math.min(x0 + 1, SEGMENTS);
  const z1 = Math.min(z0 + 1, SEGMENTS);
  const fx = gx - x0, fz = gz - z0;
  return hm[z0*S+x0]*(1-fx)*(1-fz) + hm[z0*S+x1]*fx*(1-fz)
       + hm[z1*S+x0]*(1-fx)*fz     + hm[z1*S+x1]*fx*fz;
}

/* ─── Geometry construction from heightmap ───── */

export function buildTerrainGeometry(noise, hm) {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, SEGMENTS, SEGMENTS);
  geo.rotateX(-Math.PI / 2);

  const pos    = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const layers = new Float32Array(pos.count);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const h = getTerrainHeight(hm, x, z);
    pos.setY(i, h);

    // smooth fractional layer index
    layers[i] = computeLayerIndex(noise, x, h, z);

    // vertex colour (macro tint for shader)
    const layer = getLayerAtPosition(noise, x, h, z);
    const c = new THREE.Color(layer.hex);
    const nv  = noise(x * 0.015, z * 0.015) * 0.08;
    const nv2 = noise(x * 0.06 + 100, z * 0.06 + 100) * 0.04;
    c.offsetHSL(nv2 * 0.1, nv * 0.2, nv + nv2);
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute('aVertColor',  new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('aLayerIndex', new THREE.Float32BufferAttribute(layers, 1));
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  return geo;
}
