// ================================================================
//  VEGETATION & STRUCTURES SYSTEM
//  Realistic multi-type trees, rock scatter, houses, bushes, grass
//  placed procedurally on the terrain.  Uses InstancedMesh
//  for performance.
// ================================================================
import * as THREE from 'three';
import { TERRAIN_SIZE, SEGMENTS, WATER_LEVEL, getLayerAtElevation } from '../config/geology';
import { LAKES, RIVERS, FARM } from './TerrainGenerator';
import { createNoise2D } from './noise';

/* ── Dense Catmull-Rom river paths for accurate exclusion zones ── */
function _crVal(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t
    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
let _denseRivers = null;
function getDenseRivers() {
  if (_denseRivers) return _denseRivers;
  _denseRivers = RIVERS.map(river => {
    const pts = river.points;
    const dense = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i];
      const p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let j = 0; j < 8; j++) {
        const t = j / 8;
        dense.push({
          x: _crVal(p0.x, p1.x, p2.x, p3.x, t),
          z: _crVal(p0.z, p1.z, p2.z, p3.z, t),
        });
      }
    }
    dense.push({ x: pts[pts.length - 1].x, z: pts[pts.length - 1].z });
    return { ...river, densePoints: dense };
  });
  return _denseRivers;
}

const _m  = new THREE.Matrix4();
const _p  = new THREE.Vector3();
const _q  = new THREE.Quaternion();
const _s  = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

/* ── Heightmap interpolation helper ────────── */
function makeHeightFn(hm) {
  const s = SEGMENTS + 1;
  return (wx, wz) => {
    const gx = (wx + TERRAIN_SIZE / 2) / TERRAIN_SIZE * SEGMENTS;
    const gz = (wz + TERRAIN_SIZE / 2) / TERRAIN_SIZE * SEGMENTS;
    const x0 = Math.max(0, Math.min(SEGMENTS - 1, gx | 0));
    const z0 = Math.max(0, Math.min(SEGMENTS - 1, gz | 0));
    const fx = gx - x0, fz = gz - z0;
    return hm[z0 * s + x0] * (1 - fx) * (1 - fz) + hm[z0 * s + x0 + 1] * fx * (1 - fz)
         + hm[(z0 + 1) * s + x0] * (1 - fx) * fz + hm[(z0 + 1) * s + x0 + 1] * fx * fz;
  };
}

/* ── Slope calculation at point ─── */
function getSlope(getH, wx, wz) {
  const dx = 4;
  const hpx = getH(wx + dx, wz), hmx = getH(wx - dx, wz);
  const hpz = getH(wx, wz + dx), hmz = getH(wx, wz - dx);
  return Math.sqrt(((hpx - hmx) / (2 * dx)) ** 2 + ((hpz - hmz) / (2 * dx)) ** 2);
}

/* ── Check if point is in a lake ─── */
function isInLake(wx, wz, margin = 10) {
  for (const lake of LAKES) {
    const dx = (wx - lake.cx) / (lake.rx + margin);
    const dz = (wz - lake.cz) / (lake.rz + margin);
    if (dx * dx + dz * dz < 1) return true;
  }
  return false;
}

/* ── Check if point is inside a river channel (dense Catmull-Rom path) ─── */
function isInRiver(wx, wz, margin = 12) {
  for (const river of getDenseRivers()) {
    const hw = river.width / 2 + margin;
    const pts = river.densePoints;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i].x, az = pts[i].z;
      const bx = pts[i + 1].x, bz = pts[i + 1].z;
      const dx = bx - ax, dz = bz - az;
      const lenSq = dx * dx + dz * dz;
      let t = lenSq > 0 ? ((wx - ax) * dx + (wz - az) * dz) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = ax + t * dx, cz = az + t * dz;
      const dist = Math.sqrt((wx - cx) ** 2 + (wz - cz) ** 2);
      if (dist < hw) return true;
    }
  }
  return false;
}

/* ── Check if point is inside the farm compound ─── */
function isInFarm(wx, wz, margin = 10) {
  const dx = wx - FARM.cx;
  const dz = wz - FARM.cz;
  return Math.sqrt(dx * dx + dz * dz) < FARM.radius + margin;
}

/* ── Vegetation viability (uses geology vegetationDensity + slope) ─── *
 *  Higher density layers support more vegetation on steeper slopes.   *
 *  Returns true probabilistically — call once per placement attempt.  */
function vegetationCheck(layer, slope) {
  const density = layer.vegetationDensity ?? 0;
  // Slope strongly reduces viability: at slope 0 → full density,
  // at slope 0.6 → density × 0.1, above 0.7 → near zero
  const slopeFactor = Math.max(0, 1 - slope * 1.5);
  return Math.random() < density * slopeFactor;
}

/* ── Check proximity to any water body (lakes or river — dense path) ─── */
function nearWaterBody(wx, wz, range = 60) {
  for (const lake of LAKES) {
    const dx = (wx - lake.cx) / (lake.rx + range);
    const dz = (wz - lake.cz) / (lake.rz + range);
    if (dx * dx + dz * dz < 1) return true;
  }
  for (const river of getDenseRivers()) {
    const hw = river.width / 2 + range;
    const pts = river.densePoints;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i].x, az = pts[i].z;
      const bx = pts[i + 1].x, bz = pts[i + 1].z;
      const dx = bx - ax, dz = bz - az;
      const lenSq = dx * dx + dz * dz;
      let t = lenSq > 0 ? ((wx - ax) * dx + (wz - az) * dz) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = ax + t * dx, cz = az + t * dz;
      const dist = Math.sqrt((wx - cx) ** 2 + (wz - cz) ** 2);
      if (dist < hw) return true;
    }
  }
  return false;
}

/**
 * @param {Float32Array} hm
 * @param {Function} noise
 * @returns {THREE.Group}
 */
export function createVegetation(hm, noise) {
  const group = new THREE.Group();
  const scatter = createNoise2D(777);
  const getH = makeHeightFn(hm);

  addTrees(group, getH, noise, scatter);
  addBushes(group, getH, noise, scatter);
  addRocks(group, getH, noise, scatter);
  addFarmCompound(group, getH);
  addMountainVegetation(group, getH, noise, scatter);
  addRiparianVegetation(group, getH, noise, scatter);
  addGrass(group, getH, noise, scatter);

  // Expose windmill blades for animation
  group.userData.windmillBlades = group.userData.windmillBlades || null;
  // Search children for the farm compound windmill reference
  group.traverse((child) => {
    if (child.userData?.windmillBlades) {
      group.userData.windmillBlades = child.userData.windmillBlades;
    }
  });

  return group;
}

/* =============================================================
   TREES — 3 types: Pine, Oak, Birch
   Higher polygon counts for smooth appearance at close range.
   ============================================================= */
function addTrees(group, getH, noise, scatter) {
  // ── Pine trees (tall conifers — layered cones) ──
  const pineCount = 600;
  const pineTrunkGeo = new THREE.CylinderGeometry(0.3, 0.6, 8, 8);
  const pineTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x3d281a, roughness: 0.95, metalness: 0,
  });

  // 3 layered cone crowns for pine — 12 segments for smooth silhouette
  const pineCrown1 = new THREE.ConeGeometry(5, 7, 12);
  pineCrown1.translate(0, 10, 0);
  const pineCrown2 = new THREE.ConeGeometry(4, 6, 12);
  pineCrown2.translate(0, 13, 0);
  const pineCrown3 = new THREE.ConeGeometry(2.8, 5, 12);
  pineCrown3.translate(0, 15.5, 0);

  const mergedPineCrown = mergeBufferGeometries([pineCrown1, pineCrown2, pineCrown3]);
  const pineCrownMat = new THREE.MeshStandardMaterial({
    color: 0x1a4a1a, roughness: 0.85, metalness: 0,
  });

  const pineTrunkMesh = new THREE.InstancedMesh(pineTrunkGeo, pineTrunkMat, pineCount);
  const pineCrownMesh = new THREE.InstancedMesh(mergedPineCrown, pineCrownMat, pineCount);
  pineTrunkMesh.castShadow = true;
  pineCrownMesh.castShadow = true;
  pineCrownMesh.receiveShadow = true;

  let pi = 0;
  for (let attempt = 0; attempt < pineCount * 8 && pi < pineCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.9;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.9;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 4 || isInLake(wx, wz, 20) || isInRiver(wx, wz, 20) || isInFarm(wx, wz, 15)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.55) continue;
    const layer = getLayerAtElevation(h);
    if (!vegetationCheck(layer, slope)) continue;
    const density = scatter(wx * 0.006, wz * 0.006);
    if (density < -0.1) continue;
    // Pine prefers higher / cooler ground (mountains & ridges)
    if (h < 110 && Math.random() > 0.2) continue;

    const scale = 0.6 + Math.random() * 0.8;
    _p.set(wx, h - 0.5, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale * (0.85 + Math.random() * 0.3), scale);
    _m.compose(_p, _q, _s);
    pineTrunkMesh.setMatrixAt(pi, _m);
    pineCrownMesh.setMatrixAt(pi, _m);

    // Color variation — slight hue shift per instance
    const cv = 0.85 + Math.random() * 0.3;
    pineCrownMesh.setColorAt(pi, new THREE.Color(0.1 * cv, 0.29 * cv * (0.8 + Math.random() * 0.4), 0.1 * cv));
    pi++;
  }
  pineTrunkMesh.count = pi;
  pineCrownMesh.count = pi;
  pineTrunkMesh.instanceMatrix.needsUpdate = true;
  pineCrownMesh.instanceMatrix.needsUpdate = true;
  if (pineCrownMesh.instanceColor) pineCrownMesh.instanceColor.needsUpdate = true;
  group.add(pineTrunkMesh, pineCrownMesh);

  // ── Oak trees (round canopy — lumpy merged spheres) ──
  const oakCount = 450;
  const oakTrunkGeo = new THREE.CylinderGeometry(0.5, 0.9, 5, 8);
  const oakTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x4a3526, roughness: 0.92,
  });
  // Lumpy sphere crown — higher segments for smooth look
  const oakSphere1 = new THREE.SphereGeometry(5, 12, 8);
  oakSphere1.translate(0, 9, 0);
  const oakSphere2 = new THREE.SphereGeometry(3.5, 10, 7);
  oakSphere2.translate(2.5, 10.5, 1);
  const oakSphere3 = new THREE.SphereGeometry(3, 10, 7);
  oakSphere3.translate(-2, 10, -1.5);
  const oakSphere4 = new THREE.SphereGeometry(2.5, 8, 6);
  oakSphere4.translate(0.5, 11.5, 2);
  const mergedOakCrown = mergeBufferGeometries([oakSphere1, oakSphere2, oakSphere3, oakSphere4]);
  const oakCrownMat = new THREE.MeshStandardMaterial({
    color: 0x2d6b1a, roughness: 0.82,
  });

  const oakTrunkMesh = new THREE.InstancedMesh(oakTrunkGeo, oakTrunkMat, oakCount);
  const oakCrownMesh = new THREE.InstancedMesh(mergedOakCrown, oakCrownMat, oakCount);
  oakTrunkMesh.castShadow = true;
  oakCrownMesh.castShadow = true;
  oakCrownMesh.receiveShadow = true;

  let oi = 0;
  for (let attempt = 0; attempt < oakCount * 8 && oi < oakCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 3 || isInLake(wx, wz, 25) || isInRiver(wx, wz, 15) || isInFarm(wx, wz, 15)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.4) continue;
    const layer = getLayerAtElevation(h);
    if (!vegetationCheck(layer, slope)) continue;
    const density = scatter(wx * 0.008, wz * 0.008);
    if (density < 0.0) continue;
    // Oak prefers lower / warmer ground (valleys & plains)
    if (h > 170 && Math.random() > 0.2) continue;

    const scale = 0.5 + Math.random() * 0.7;
    _p.set(wx, h - 0.3, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale * (0.8 + Math.random() * 0.4), scale);
    _m.compose(_p, _q, _s);
    oakTrunkMesh.setMatrixAt(oi, _m);
    oakCrownMesh.setMatrixAt(oi, _m);

    const cv = 0.7 + Math.random() * 0.6;
    oakCrownMesh.setColorAt(oi, new THREE.Color(
      0.18 * cv * (0.7 + Math.random() * 0.6),
      0.42 * cv,
      0.1 * cv,
    ));
    oi++;
  }
  oakTrunkMesh.count = oi;
  oakCrownMesh.count = oi;
  oakTrunkMesh.instanceMatrix.needsUpdate = true;
  oakCrownMesh.instanceMatrix.needsUpdate = true;
  if (oakCrownMesh.instanceColor) oakCrownMesh.instanceColor.needsUpdate = true;
  group.add(oakTrunkMesh, oakCrownMesh);

  // ── Birch trees (thin white trunk, light green leaves) ──
  const birchCount = 250;
  const birchTrunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 9, 8);
  const birchTrunkMat = new THREE.MeshStandardMaterial({
    color: 0xe8dcc8, roughness: 0.6, metalness: 0,
  });
  const birchCrownGeo = new THREE.SphereGeometry(3.5, 10, 8);
  birchCrownGeo.translate(0, 11, 0);
  birchCrownGeo.scale(0.8, 1.2, 0.8);
  const birchCrownMat = new THREE.MeshStandardMaterial({
    color: 0x5aab35, roughness: 0.8, transparent: true, opacity: 0.92,
  });

  const birchTrunkMesh = new THREE.InstancedMesh(birchTrunkGeo, birchTrunkMat, birchCount);
  const birchCrownMesh = new THREE.InstancedMesh(birchCrownGeo, birchCrownMat, birchCount);
  birchTrunkMesh.castShadow = true;
  birchCrownMesh.castShadow = true;

  let bi = 0;
  for (let attempt = 0; attempt < birchCount * 8 && bi < birchCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.85;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.85;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 5 || isInLake(wx, wz, 18) || isInRiver(wx, wz, 15) || isInFarm(wx, wz, 10)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.35) continue;
    const layer = getLayerAtElevation(h);
    if (!vegetationCheck(layer, slope)) continue;
    // Birch near lakes or rivers
    const nearLake = LAKES.some((l) => {
      const dx = (wx - l.cx) / (l.rx * 2);
      const dz = (wz - l.cz) / (l.rz * 2);
      return dx * dx + dz * dz < 1;
    });
    if (!nearLake && Math.random() > 0.3) continue;

    const scale = 0.5 + Math.random() * 0.5;
    _p.set(wx, h - 0.3, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale * (0.9 + Math.random() * 0.3), scale);
    _m.compose(_p, _q, _s);
    birchTrunkMesh.setMatrixAt(bi, _m);
    birchCrownMesh.setMatrixAt(bi, _m);

    const cv = 0.8 + Math.random() * 0.4;
    birchCrownMesh.setColorAt(bi, new THREE.Color(0.35 * cv, 0.67 * cv, 0.2 * cv));
    bi++;
  }
  birchTrunkMesh.count = bi;
  birchCrownMesh.count = bi;
  birchTrunkMesh.instanceMatrix.needsUpdate = true;
  birchCrownMesh.instanceMatrix.needsUpdate = true;
  if (birchCrownMesh.instanceColor) birchCrownMesh.instanceColor.needsUpdate = true;
  group.add(birchTrunkMesh, birchCrownMesh);
}

/* =============================================================
   BUSHES — small shrubs for ground cover
   ============================================================= */
function addBushes(group, getH, noise, scatter) {
  const count = 2500;
  const geo = new THREE.SphereGeometry(2, 10, 6);
  geo.scale(1, 0.65, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x2e6e18, roughness: 0.9,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.castShadow = true;

  let idx = 0;
  for (let attempt = 0; attempt < count * 6 && idx < count; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 2 || isInLake(wx, wz, 8) || isInRiver(wx, wz, 10) || isInFarm(wx, wz, 5)) continue;
    const slope = getSlope(getH, wx, wz);
    const layer = getLayerAtElevation(h);
    if (!vegetationCheck(layer, slope)) continue;
    if (scatter(wx * 0.015, wz * 0.015) < -0.3) continue;

    const scale = 1.5 + Math.random() * 3;
    _p.set(wx, h - 0.3, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale * (0.5 + Math.random() * 0.5), scale * (0.8 + Math.random() * 0.4));
    _m.compose(_p, _q, _s);
    mesh.setMatrixAt(idx, _m);

    const cv = 0.6 + Math.random() * 0.8;
    mesh.setColorAt(idx, new THREE.Color(0.18 * cv, 0.43 * cv, 0.12 * cv));
    idx++;
  }
  mesh.count = idx;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  group.add(mesh);
}

/* =============================================================
   ROCKS — natural outcrops on steep slopes
   ============================================================= */
function addRocks(group, getH, noise, scatter) {
  const count = 500;
  const geo = new THREE.DodecahedronGeometry(1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x8a8380, roughness: 0.92, metalness: 0.02,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  let ri = 0;
  for (let attempt = 0; attempt < count * 6 && ri < count; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.9;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.9;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 1 || isInLake(wx, wz, 5) || isInRiver(wx, wz, 10) || isInFarm(wx, wz, 0)) continue;

    const slope = getSlope(getH, wx, wz);
    if (slope < 0.15 && Math.random() > 0.12) continue;

    const scale = 1.0 + Math.random() * 4;
    _p.set(wx, h - scale * 0.3, wz);
    _q.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    _s.set(scale, scale * (0.4 + Math.random() * 0.6), scale * (0.7 + Math.random() * 0.6));
    _m.compose(_p, _q, _s);
    mesh.setMatrixAt(ri, _m);

    const gray = 0.35 + Math.random() * 0.3;
    mesh.setColorAt(ri, new THREE.Color(gray * 0.95, gray * 0.93, gray * 0.88));
    ri++;
  }
  mesh.count = ri;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  group.add(mesh);
}

/* =============================================================
   FARM COMPOUND — organised buildings on the flattened FARM zone
   Includes: farmhouse, cottages, barn, silo, shed, fences,
   fields, hay bales, water trough, animal pen, windmill
   ============================================================= */
function addFarmCompound(group, getH) {
  const fcx = FARM.cx;
  const fcz = FARM.cz;
  const angle = Math.PI * 0.15;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  function local(lx, lz) {
    return { x: fcx + lx * cosA - lz * sinA, z: fcz + lx * sinA + lz * cosA };
  }
  function worldH(lx, lz) {
    const p = local(lx, lz);
    return getH(p.x, p.z);
  }

  /* ── Shared geometries ─── */
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-0.6, 0);
  roofShape.lineTo(0, 0.5);
  roofShape.lineTo(0.6, 0);
  roofShape.closePath();
  const baseRoofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 1.1, bevelEnabled: false });
  baseRoofGeo.translate(0, 0, -0.55);

  /* ── Buildings ─── */
  const buildings = [
    { lx:  0,  lz:  0,  w: 14, d: 11, h: 7.5, wallCol: 0xd4c4a8, roofCol: 0x7a3b2e, chimney: true,  label: 'Farmhouse' },
    { lx: -28, lz: 18,  w: 9,  d: 7,  h: 5.5, wallCol: 0xe0d5c0, roofCol: 0x5a463a, chimney: true,  label: 'Cottage A' },
    { lx: -28, lz: -8,  w: 8,  d: 6.5,h: 4.8, wallCol: 0xc8bfa8, roofCol: 0x6a4e3e, chimney: false, label: 'Cottage B' },
    { lx:  38, lz:  0,  w: 24, d: 15, h: 10,  wallCol: 0x8b4513, roofCol: 0x4a3020, chimney: false, label: 'Barn' },
    { lx:  18, lz:  32, w: 10, d: 7,  h: 4.2, wallCol: 0xa0906a, roofCol: 0x5c5040, chimney: false, label: 'Workshop' },
    { lx: -14, lz: -32, w: 9,  d: 6,  h: 3.8, wallCol: 0x9e8d6e, roofCol: 0x5a5040, chimney: false, label: 'Storage' },
  ];

  const windowMat = new THREE.MeshStandardMaterial({ color: 0x88bbdd, roughness: 0.25, metalness: 0.15 });
  const doorMat   = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.88 });

  for (const b of buildings) {
    const pos = local(b.lx, b.lz);
    const gh = getH(pos.x, pos.z);

    // Walls
    const wallGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const wallMat = new THREE.MeshStandardMaterial({ color: b.wallCol, roughness: 0.82 });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(pos.x, gh + b.h / 2, pos.z);
    wallMesh.rotation.y = angle;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    group.add(wallMesh);

    // Foundation strip
    const foundGeo = new THREE.BoxGeometry(b.w + 0.8, 0.6, b.d + 0.8);
    const foundMat = new THREE.MeshStandardMaterial({ color: 0x6b6860, roughness: 0.9 });
    const foundMesh = new THREE.Mesh(foundGeo, foundMat);
    foundMesh.position.set(pos.x, gh + 0.3, pos.z);
    foundMesh.rotation.y = angle;
    foundMesh.receiveShadow = true;
    group.add(foundMesh);

    // Roof
    const roofGeo = baseRoofGeo.clone();
    const roofMat = new THREE.MeshStandardMaterial({ color: b.roofCol, roughness: 0.75 });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(pos.x, gh + b.h, pos.z);
    roofMesh.rotation.y = angle;
    roofMesh.scale.set(b.w * 1.15, b.h * 0.65, b.d * 1.08);
    roofMesh.castShadow = true;
    group.add(roofMesh);

    // Door
    const dGeo = new THREE.BoxGeometry(b.w * 0.14, b.h * 0.42, 0.2);
    const dMesh = new THREE.Mesh(dGeo, doorMat);
    dMesh.position.set(
      pos.x + cosA * b.d * 0.51,
      gh + b.h * 0.21,
      pos.z + sinA * b.d * 0.51,
    );
    dMesh.rotation.y = angle;
    group.add(dMesh);

    // Windows — front and back, 2 on each side
    for (let side = -1; side <= 1; side += 2) {
      for (let row = -1; row <= 1; row += 2) {
        const wGeo = new THREE.BoxGeometry(b.w * 0.09, b.h * 0.18, 0.12);
        const wMesh = new THREE.Mesh(wGeo, windowMat);
        const offX = sinA * (b.w * 0.25 * side);
        const offZ = -cosA * (b.w * 0.25 * side);
        const offFB = cosA * (b.d * 0.51 * row);
        const offFBZ = sinA * (b.d * 0.51 * row);
        wMesh.position.set(
          pos.x + offX + offFB * 0.3,
          gh + b.h * 0.62,
          pos.z + offZ + offFBZ * 0.3,
        );
        wMesh.rotation.y = angle + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
        group.add(wMesh);
      }
    }

    // Chimney
    if (b.chimney) {
      const cGeo = new THREE.BoxGeometry(1.1, 3.2, 1.1);
      const cMat = new THREE.MeshStandardMaterial({ color: 0x6b5b4f, roughness: 0.88 });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(
        pos.x + cosA * b.w * 0.25 - sinA * b.d * 0.2,
        gh + b.h + b.h * 0.3,
        pos.z + sinA * b.w * 0.25 + cosA * b.d * 0.2,
      );
      cMesh.castShadow = true;
      group.add(cMesh);
    }
  }

  /* ── Silos (2 next to barn) ─── */
  for (let si = 0; si < 2; si++) {
    const sp = local(52 + si * 10, -8);
    const sh = getH(sp.x, sp.z);
    const sGeo = new THREE.CylinderGeometry(3, 3.5, 13, 16);
    const sMat = new THREE.MeshStandardMaterial({ color: 0xaaa894, roughness: 0.65, metalness: 0.12 });
    const sMesh = new THREE.Mesh(sGeo, sMat);
    sMesh.position.set(sp.x, sh + 6.5, sp.z);
    sMesh.castShadow = true;
    group.add(sMesh);
    // Dome
    const dGeo = new THREE.SphereGeometry(3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dMat = new THREE.MeshStandardMaterial({ color: 0x888880, roughness: 0.55, metalness: 0.18 });
    const dMesh = new THREE.Mesh(dGeo, dMat);
    dMesh.position.set(sp.x, sh + 13, sp.z);
    group.add(dMesh);
  }

  /* ── Hay bales (scattered near barn) ─── */
  const hayMat = new THREE.MeshStandardMaterial({ color: 0xc8a848, roughness: 0.92 });
  const hayGeo = new THREE.CylinderGeometry(1.8, 1.8, 2.5, 12);
  hayGeo.rotateZ(Math.PI / 2);
  const hayPositions = [
    { lx: 30, lz: -22 }, { lx: 34, lz: -24 }, { lx: 32, lz: -18 },
    { lx: 28, lz: -26 }, { lx: 36, lz: -20 }, { lx: 38, lz: -26 },
    { lx: 26, lz: -22 }, { lx: 40, lz: -22 },
  ];
  for (const hp of hayPositions) {
    const pp = local(hp.lx, hp.lz);
    const hh = getH(pp.x, pp.z);
    const hMesh = new THREE.Mesh(hayGeo, hayMat);
    hMesh.position.set(pp.x, hh + 1.3, pp.z);
    hMesh.rotation.y = angle + (Math.random() - 0.5) * 0.4;
    hMesh.castShadow = true;
    group.add(hMesh);
  }

  /* ── Water trough / small pond ─── */
  const troughP = local(8, 20);
  const troughH = getH(troughP.x, troughP.z);
  const troughGeo = new THREE.BoxGeometry(6, 1.2, 3);
  const troughMat = new THREE.MeshStandardMaterial({ color: 0x5a5045, roughness: 0.85 });
  const troughMesh = new THREE.Mesh(troughGeo, troughMat);
  troughMesh.position.set(troughP.x, troughH + 0.6, troughP.z);
  troughMesh.rotation.y = angle;
  group.add(troughMesh);
  // Water inside trough
  const twGeo = new THREE.BoxGeometry(5.4, 0.3, 2.4);
  const twMat = new THREE.MeshStandardMaterial({
    color: 0x2a5a6a, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.8,
  });
  const twMesh = new THREE.Mesh(twGeo, twMat);
  twMesh.position.set(troughP.x, troughH + 1.0, troughP.z);
  twMesh.rotation.y = angle;
  group.add(twMesh);

  /* ── Animal pen (fenced rectangle) ─── */
  const penCx = 15, penCz = -25, penW = 30, penD = 20;
  const penPostGeo = new THREE.CylinderGeometry(0.12, 0.18, 2.2, 6);
  const penPostMat = new THREE.MeshStandardMaterial({ color: 0x6b5030, roughness: 0.9 });
  const penRailGeo = new THREE.BoxGeometry(1, 0.1, 0.08);

  const penCorners = [
    local(penCx - penW/2, penCz - penD/2),
    local(penCx + penW/2, penCz - penD/2),
    local(penCx + penW/2, penCz + penD/2),
    local(penCx - penW/2, penCz + penD/2),
  ];
  for (let c = 0; c < 4; c++) {
    const c1 = penCorners[c], c2 = penCorners[(c + 1) % 4];
    const numPosts = 6;
    for (let p = 0; p <= numPosts; p++) {
      const t = p / numPosts;
      const px = c1.x + (c2.x - c1.x) * t;
      const pz = c1.z + (c2.z - c1.z) * t;
      const ph = getH(px, pz);
      const pm = new THREE.Mesh(penPostGeo, penPostMat);
      pm.position.set(px, ph + 1.1, pz);
      pm.castShadow = true;
      group.add(pm);
    }
    // Rails (2 horizontal)
    const midX = (c1.x + c2.x) / 2, midZ = (c1.z + c2.z) / 2;
    const midH = getH(midX, midZ);
    const seg = Math.sqrt((c2.x - c1.x) ** 2 + (c2.z - c1.z) ** 2);
    const segAngle = Math.atan2(c2.z - c1.z, c2.x - c1.x);
    for (let rh = 0; rh < 2; rh++) {
      const rm = new THREE.Mesh(penRailGeo, penPostMat);
      rm.scale.set(seg, 1, 1);
      rm.position.set(midX, midH + 0.7 + rh * 0.7, midZ);
      rm.rotation.y = segAngle;
      group.add(rm);
    }
  }

  /* ── Fence around compound perimeter ─── */
  const fencePostGeo = new THREE.CylinderGeometry(0.15, 0.2, 2.5, 6);
  const fencePostMat = new THREE.MeshStandardMaterial({ color: 0x6b5030, roughness: 0.9 });
  const fenceRailGeo = new THREE.BoxGeometry(1, 0.1, 0.08);

  const fenceRadius = 80;
  const fenceSegs = 40;
  for (let i = 0; i < fenceSegs; i++) {
    const a1 = (i / fenceSegs) * Math.PI * 2;
    const a2 = ((i + 1) / fenceSegs) * Math.PI * 2;
    const fx = fcx + Math.cos(a1) * fenceRadius;
    const fz = fcz + Math.sin(a1) * fenceRadius;
    const fh = getH(fx, fz);

    const postMesh = new THREE.Mesh(fencePostGeo, fencePostMat);
    postMesh.position.set(fx, fh + 1.25, fz);
    postMesh.castShadow = true;
    group.add(postMesh);

    const fx2 = fcx + Math.cos(a2) * fenceRadius;
    const fz2 = fcz + Math.sin(a2) * fenceRadius;
    const fh2 = getH(fx2, fz2);
    const midX = (fx + fx2) / 2, midZ = (fz + fz2) / 2;
    const midH = (fh + fh2) / 2;
    const dist = Math.sqrt((fx2 - fx) ** 2 + (fz2 - fz) ** 2);
    const fAngle = Math.atan2(fz2 - fz, fx2 - fx);
    for (let rh = 0; rh < 2; rh++) {
      const rm = new THREE.Mesh(fenceRailGeo, fencePostMat);
      rm.scale.set(dist, 1, 1);
      rm.position.set(midX, midH + 0.8 + rh * 0.7, midZ);
      rm.rotation.y = fAngle;
      group.add(rm);
    }
  }

  /* ── Crop fields (realistic with furrows, ridges and varied crops) ─── */
  const fieldDefs = [
    { lx: -55, lz: -15, w: 32, d: 28, crop: 'wheat',   soilCol: 0x5e4a30, cropCol: 0xc8b040, cropH: 1.1 },
    { lx: -55, lz:  22, w: 28, d: 22, crop: 'barley',   soilCol: 0x604830, cropCol: 0xa0982a, cropH: 0.9 },
    { lx:  10, lz: -55, w: 36, d: 22, crop: 'corn',     soilCol: 0x564428, cropCol: 0x4a8830, cropH: 1.8 },
    { lx:  10, lz:  52, w: 30, d: 18, crop: 'hay',      soilCol: 0x6a5535, cropCol: 0x88a030, cropH: 0.5 },
  ];

  const furrowMat = new THREE.MeshStandardMaterial({ color: 0x4a3820, roughness: 0.95 });

  for (const f of fieldDefs) {
    const fp = local(f.lx, f.lz);
    const fh = getH(fp.x, fp.z);

    // Tilled soil base
    const soilGeo = new THREE.PlaneGeometry(f.w, f.d);
    soilGeo.rotateX(-Math.PI / 2);
    const soilMat = new THREE.MeshStandardMaterial({
      color: f.soilCol, roughness: 0.95, side: THREE.DoubleSide,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.set(fp.x, fh + 0.05, fp.z);
    soilMesh.rotation.y = angle;
    soilMesh.receiveShadow = true;
    group.add(soilMesh);

    // Field border — slight raised earth rim
    const borderGeo = new THREE.BoxGeometry(f.w + 1.2, 0.35, f.d + 1.2);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x5a4a30, roughness: 0.92 });
    const borderMesh = new THREE.Mesh(borderGeo, borderMat);
    borderMesh.position.set(fp.x, fh + 0.15, fp.z);
    borderMesh.rotation.y = angle;
    borderMesh.receiveShadow = true;
    group.add(borderMesh);

    // Row parameters
    const rowSpacing = f.crop === 'corn' ? 2.4 : 1.6;
    const numRows = Math.floor((f.d - 2) / rowSpacing);
    const cropColor = new THREE.Color(f.cropCol);

    for (let r = 0; r < numRows; r++) {
      const rlz = f.lz - f.d / 2 + 1 + (r + 0.5) * ((f.d - 2) / numRows);
      const rp = local(f.lx, rlz);
      const rh = getH(rp.x, rp.z);

      // Raised ridge (soil mound for each row)
      const ridgeGeo = new THREE.BoxGeometry(f.w * 0.90, 0.22, rowSpacing * 0.45);
      const ridgeMesh = new THREE.Mesh(ridgeGeo, furrowMat);
      ridgeMesh.position.set(rp.x, rh + 0.22, rp.z);
      ridgeMesh.rotation.y = angle;
      ridgeMesh.receiveShadow = true;
      group.add(ridgeMesh);

      // Crop plants per row — instanced along the row
      const plantCount = Math.floor(f.w / 1.2);
      for (let p = 0; p < plantCount; p++) {
        const plx = f.lx - f.w / 2 + 0.8 + p * ((f.w - 1.6) / plantCount);
        const pp = local(plx, rlz + (Math.random() - 0.5) * 0.3);
        const ph = getH(pp.x, pp.z);
        const jitter = 0.85 + Math.random() * 0.3;

        if (f.crop === 'wheat' || f.crop === 'barley') {
          // Wheat/barley: thin vertical stalk + small head
          const stalkH = f.cropH * jitter;
          const stalkGeo = new THREE.CylinderGeometry(0.03, 0.04, stalkH, 4);
          const stalkMat = new THREE.MeshStandardMaterial({
            color: cropColor.clone().multiplyScalar(0.7 + Math.random() * 0.2),
            roughness: 0.85,
          });
          const stalk = new THREE.Mesh(stalkGeo, stalkMat);
          stalk.position.set(pp.x, ph + 0.22 + stalkH / 2, pp.z);
          stalk.rotation.y = Math.random() * 0.3;
          stalk.rotation.z = (Math.random() - 0.5) * 0.08; // slight lean
          group.add(stalk);

          // Grain head at top
          const headGeo = new THREE.CylinderGeometry(0.06, 0.04, stalkH * 0.22, 4);
          const headMat = new THREE.MeshStandardMaterial({
            color: f.crop === 'wheat' ? 0xd4b840 : 0xb8a838,
            roughness: 0.8,
          });
          const head = new THREE.Mesh(headGeo, headMat);
          head.position.set(pp.x, ph + 0.22 + stalkH + stalkH * 0.11, pp.z);
          head.rotation.z = (Math.random() - 0.5) * 0.15;
          group.add(head);
        } else if (f.crop === 'corn') {
          // Corn: thick stalk + leaf planes
          const stalkH = f.cropH * jitter;
          const stalkGeo = new THREE.CylinderGeometry(0.06, 0.08, stalkH, 5);
          const stalkMat = new THREE.MeshStandardMaterial({
            color: 0x3a6e20, roughness: 0.82,
          });
          const stalk = new THREE.Mesh(stalkGeo, stalkMat);
          stalk.position.set(pp.x, ph + 0.22 + stalkH / 2, pp.z);
          group.add(stalk);

          // 2-3 leaves per stalk
          const leafMat = new THREE.MeshStandardMaterial({
            color: cropColor.clone().multiplyScalar(0.8 + Math.random() * 0.3),
            roughness: 0.8, side: THREE.DoubleSide,
          });
          const leafCount = 2 + Math.floor(Math.random() * 2);
          for (let l = 0; l < leafCount; l++) {
            const leafGeo = new THREE.PlaneGeometry(0.8, 0.12);
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            const leafY = ph + 0.22 + stalkH * (0.35 + l * 0.2);
            const leafAngle = Math.random() * Math.PI * 2;
            leaf.position.set(
              pp.x + Math.cos(leafAngle) * 0.35,
              leafY,
              pp.z + Math.sin(leafAngle) * 0.35,
            );
            leaf.rotation.y = leafAngle;
            leaf.rotation.z = 0.5 + Math.random() * 0.3; // droop
            group.add(leaf);
          }
        } else {
          // Hay/generic: low bushy tufts
          const tH = f.cropH * jitter;
          const tGeo = new THREE.SphereGeometry(0.3, 5, 3);
          tGeo.scale(1, tH / 0.3, 1);
          const tMat = new THREE.MeshStandardMaterial({
            color: cropColor.clone().multiplyScalar(0.75 + Math.random() * 0.25),
            roughness: 0.9,
          });
          const t = new THREE.Mesh(tGeo, tMat);
          t.position.set(pp.x, ph + 0.22 + tH * 0.5, pp.z);
          group.add(t);
        }
      }
    }

    // Headland paths (bare soil strips at field ends)
    for (const endOff of [-f.d / 2 - 0.3, f.d / 2 + 0.3]) {
      const hp = local(f.lx, f.lz + endOff);
      const hh = getH(hp.x, hp.z);
      const hpGeo = new THREE.PlaneGeometry(f.w + 1, 1.5);
      hpGeo.rotateX(-Math.PI / 2);
      const hpMat = new THREE.MeshStandardMaterial({ color: 0x8a7a5a, roughness: 0.95 });
      const hpMesh = new THREE.Mesh(hpGeo, hpMat);
      hpMesh.position.set(hp.x, hh + 0.08, hp.z);
      hpMesh.rotation.y = angle;
      hpMesh.receiveShadow = true;
      group.add(hpMesh);
    }
  }

  /* ── Dirt paths (cross pattern) ─── */
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xa09070, roughness: 0.95 });
  // Main path (farmhouse to gate)
  const paths = [
    { lx: 0, lz: 0, len: fenceRadius * 0.95, dir: 'forward' },
    { lx: 0, lz: 0, len: 50, dir: 'side' },
  ];
  for (const pd of paths) {
    const pGeo = new THREE.PlaneGeometry(3.5, pd.len);
    pGeo.rotateX(-Math.PI / 2);
    const pp = local(pd.lx, pd.lz + pd.len * 0.4);
    const ph = getH(pp.x, pp.z);
    const pMesh = new THREE.Mesh(pGeo, pathMat);
    pMesh.position.set(pp.x, ph + 0.06, pp.z);
    pMesh.rotation.y = angle + (pd.dir === 'side' ? 0 : Math.PI / 2);
    pMesh.receiveShadow = true;
    group.add(pMesh);
  }

  /* ── Windmill ─── */
  const wmP = local(-42, -30);
  const wmH = getH(wmP.x, wmP.z);
  // Tower — tapered stone/brick cylinder
  const wmTowerGeo = new THREE.CylinderGeometry(1.5, 2.8, 18, 12);
  const wmTowerMat = new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.82 });
  const wmTower = new THREE.Mesh(wmTowerGeo, wmTowerMat);
  wmTower.position.set(wmP.x, wmH + 9, wmP.z);
  wmTower.castShadow = true;
  group.add(wmTower);

  // Observation deck ring at top of tower
  const wmDeckGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.4, 12);
  const wmDeckMat = new THREE.MeshStandardMaterial({ color: 0x7a6a5a, roughness: 0.85 });
  const wmDeck = new THREE.Mesh(wmDeckGeo, wmDeckMat);
  wmDeck.position.set(wmP.x, wmH + 18.2, wmP.z);
  group.add(wmDeck);

  // Cap — conical roof
  const wmCapGeo = new THREE.ConeGeometry(2.5, 3.5, 12);
  const wmCapMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.85 });
  const wmCap = new THREE.Mesh(wmCapGeo, wmCapMat);
  wmCap.position.set(wmP.x, wmH + 20.2, wmP.z);
  wmCap.castShadow = true;
  group.add(wmCap);

  // ── Blade assembly (hub + 4 proper blades) — rotates as a unit ──
  const bladeAssembly = new THREE.Group();
  // Position at front of cap
  const hubOffX = Math.cos(angle) * 2.6;
  const hubOffZ = Math.sin(angle) * 2.6;
  bladeAssembly.position.set(wmP.x + hubOffX, wmH + 19.0, wmP.z + hubOffZ);
  // The assembly rotates around the axis pointing outward from the tower face
  // We set the rotation axis via the group's orientation
  bladeAssembly.rotation.y = angle;

  // Hub — central boss where blades meet
  const hubGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.2, 12);
  hubGeo.rotateX(Math.PI / 2); // orient along Z (forward-facing)
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x4a4035, roughness: 0.6, metalness: 0.2 });
  bladeAssembly.add(new THREE.Mesh(hubGeo, hubMat));

  // Hub cap (front dome)
  const hubCapGeo = new THREE.SphereGeometry(0.75, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  hubCapGeo.rotateX(Math.PI / 2);
  const hubCap = new THREE.Mesh(hubCapGeo, new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 0.5, metalness: 0.3 }));
  hubCap.position.z = 0.6;
  bladeAssembly.add(hubCap);

  // Build 4 proper blades — each has a sail frame (leading spar + lattice) and linen sail
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.75, side: THREE.DoubleSide });
  const sparMat = new THREE.MeshStandardMaterial({ color: 0x6b5030, roughness: 0.9 });

  for (let bi = 0; bi < 4; bi++) {
    const bladeGroup = new THREE.Group();
    const ba = (bi / 4) * Math.PI * 2;
    bladeGroup.rotation.z = ba;

    // Main spar (backbone of blade) — extends radially outward
    const sparLen = 9.5;
    const sparGeo = new THREE.BoxGeometry(0.25, sparLen, 0.15);
    const spar = new THREE.Mesh(sparGeo, sparMat);
    spar.position.y = sparLen / 2 + 0.7;
    spar.castShadow = true;
    bladeGroup.add(spar);

    // Sail (trapezoidal shape via custom geometry)
    // Wider at hub end, narrower at tip — realistic windmill sail
    const sailShape = new THREE.Shape();
    const sailBaseW = 2.2;  // width at root
    const sailTipW = 0.7;   // width at tip
    const sailLen = 8.5;
    sailShape.moveTo(0.15, 1.0);                         // root leading edge
    sailShape.lineTo(0.15 + sailBaseW, 1.0);             // root trailing edge
    sailShape.lineTo(0.15 + sailTipW * 0.7, 1.0 + sailLen); // tip trailing edge
    sailShape.lineTo(0.15, 1.0 + sailLen);               // tip leading edge
    sailShape.closePath();
    const sailGeo = new THREE.ShapeGeometry(sailShape);
    const sail = new THREE.Mesh(sailGeo, bladeMat);
    sail.castShadow = true;
    sail.receiveShadow = true;
    bladeGroup.add(sail);

    // Cross-battens on sail (3 horizontal bars)
    for (let cb = 0; cb < 3; cb++) {
      const t = (cb + 1) / 4;
      const barY = 1.0 + sailLen * t;
      const barW = sailBaseW * (1 - t) + sailTipW * 0.7 * t;
      const barGeo = new THREE.BoxGeometry(barW, 0.08, 0.08);
      const bar = new THREE.Mesh(barGeo, sparMat);
      bar.position.set(0.15 + barW / 2, barY, 0.05);
      bladeGroup.add(bar);
    }

    bladeAssembly.add(bladeGroup);
  }

  bladeAssembly.castShadow = true;
  group.add(bladeAssembly);

  // Store reference so we can animate it
  group.userData.windmillBlades = bladeAssembly;

  // Tail vane (small fin on the back for orientation)
  const vaneGeo = new THREE.BoxGeometry(0.1, 2.5, 4);
  const vaneMat = new THREE.MeshStandardMaterial({ color: 0x6b5a4a, roughness: 0.85, side: THREE.DoubleSide });
  const vane = new THREE.Mesh(vaneGeo, vaneMat);
  const vaneOffX = -Math.cos(angle) * 3.5;
  const vaneOffZ = -Math.sin(angle) * 3.5;
  vane.position.set(wmP.x + vaneOffX, wmH + 19.5, wmP.z + vaneOffZ);
  vane.rotation.y = angle;
  group.add(vane);
}

/* =============================================================
   MOUNTAIN VEGETATION — alpine shrubs, stunted conifers,
   mountain wildflowers on slopes above ~130 m
   ============================================================= */
function addMountainVegetation(group, getH, noise, scatter) {
  // ── Alpine Shrubs (low, wind-shaped bushes on high terrain) ──
  const shrubCount = 500;
  const shrubGeo = new THREE.SphereGeometry(1, 8, 6);
  shrubGeo.scale(1.2, 0.4, 1);
  const shrubMat = new THREE.MeshStandardMaterial({
    color: 0x3a5e28, roughness: 0.92,
  });
  const shrubMesh = new THREE.InstancedMesh(shrubGeo, shrubMat, shrubCount);
  shrubMesh.castShadow = true;

  let si = 0;
  for (let attempt = 0; attempt < shrubCount * 8 && si < shrubCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < 130 || h < WATER_LEVEL + 5) continue;
    if (isInLake(wx, wz, 10) || isInRiver(wx, wz, 10) || isInFarm(wx, wz, 10)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.7) continue;
    const density = scatter(wx * 0.01, wz * 0.01);
    if (density < -0.1) continue;

    const scale = 0.5 + Math.random() * 1.5;
    _p.set(wx, h - 0.15, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale * (0.3 + Math.random() * 0.4), scale * (0.8 + Math.random() * 0.4));
    _m.compose(_p, _q, _s);
    shrubMesh.setMatrixAt(si, _m);

    const cv = 0.5 + Math.random() * 0.6;
    shrubMesh.setColorAt(si, new THREE.Color(0.22 * cv, 0.37 * cv, 0.15 * cv));
    si++;
  }
  shrubMesh.count = si;
  shrubMesh.instanceMatrix.needsUpdate = true;
  if (shrubMesh.instanceColor) shrubMesh.instanceColor.needsUpdate = true;
  group.add(shrubMesh);

  // ── Mountain Wildflowers (small coloured tufts on high terrain) ──
  const flowerCount = 400;
  const flowerGeo = new THREE.SphereGeometry(0.3, 6, 4);
  flowerGeo.scale(1, 0.6, 1);
  const flowerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.8,
  });
  const flowerMesh = new THREE.InstancedMesh(flowerGeo, flowerMat, flowerCount);

  let fi = 0;
  for (let attempt = 0; attempt < flowerCount * 8 && fi < flowerCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.85;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.85;
    const h = getH(wx, wz);
    if (h < 120 || h < WATER_LEVEL + 5) continue;
    if (isInLake(wx, wz, 8) || isInRiver(wx, wz, 8) || isInFarm(wx, wz, 5)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.5) continue;

    const scale = 0.4 + Math.random() * 0.8;
    _p.set(wx, h + 0.1, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale, scale);
    _m.compose(_p, _q, _s);
    flowerMesh.setMatrixAt(fi, _m);

    // Random alpine colours: purple, yellow, white, pink, blue
    const colors = [
      new THREE.Color(0.6, 0.3, 0.7),
      new THREE.Color(0.9, 0.8, 0.2),
      new THREE.Color(0.9, 0.9, 0.85),
      new THREE.Color(0.8, 0.4, 0.5),
      new THREE.Color(0.3, 0.5, 0.8),
    ];
    flowerMesh.setColorAt(fi, colors[Math.floor(Math.random() * colors.length)]);
    fi++;
  }
  flowerMesh.count = fi;
  flowerMesh.instanceMatrix.needsUpdate = true;
  if (flowerMesh.instanceColor) flowerMesh.instanceColor.needsUpdate = true;
  group.add(flowerMesh);

  // ── Mountain Grass (short hardy tufts on rocky slopes) ──
  const mGrassCount = 800;
  const mGrassGeo = new THREE.PlaneGeometry(0.5, 1.2, 1, 2);
  const mgPos = mGrassGeo.attributes.position;
  for (let i = 0; i < mgPos.count; i++) {
    const y = mgPos.getY(i);
    if (y > 0.3) { mgPos.setZ(i, mgPos.getZ(i) + 0.1); mgPos.setY(i, y * 0.95); }
  }
  mGrassGeo.translate(0, 0.6, 0);
  const mGrassMat = new THREE.MeshStandardMaterial({
    color: 0x5a7a40, roughness: 0.88, side: THREE.DoubleSide,
  });
  const mGrassMesh = new THREE.InstancedMesh(mGrassGeo, mGrassMat, mGrassCount);
  mGrassMesh.receiveShadow = true;

  let mgi = 0;
  for (let attempt = 0; attempt < mGrassCount * 4 && mgi < mGrassCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < 125 || h < WATER_LEVEL + 4) continue;
    if (isInLake(wx, wz, 5) || isInRiver(wx, wz, 8) || isInFarm(wx, wz, 5)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.65) continue;

    const scale = 0.5 + Math.random() * 1.4;
    _p.set(wx, h, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale * (0.8 + Math.random() * 0.4), scale, scale * (0.8 + Math.random() * 0.4));
    _m.compose(_p, _q, _s);
    mGrassMesh.setMatrixAt(mgi, _m);

    const cv = 0.4 + Math.random() * 0.6;
    mGrassMesh.setColorAt(mgi, new THREE.Color(0.35 * cv, 0.5 * cv, 0.25 * cv));
    mgi++;
  }
  mGrassMesh.count = mgi;
  mGrassMesh.instanceMatrix.needsUpdate = true;
  if (mGrassMesh.instanceColor) mGrassMesh.instanceColor.needsUpdate = true;
  group.add(mGrassMesh);
}

/* =============================================================
   RIPARIAN VEGETATION — lush green patches near lakes & river
   Dense grass, wildflowers, reeds at the water's edge
   ============================================================= */
function addRiparianVegetation(group, getH, noise, scatter) {
  // ── Dense green grass patches near water ──
  const patchCount = 600;
  const patchGeo = new THREE.PlaneGeometry(1.2, 2.5, 1, 2);
  const pPos = patchGeo.attributes.position;
  for (let i = 0; i < pPos.count; i++) {
    const y = pPos.getY(i);
    if (y > 0.5) { pPos.setZ(i, pPos.getZ(i) + 0.2); pPos.setY(i, y * 0.9); }
  }
  patchGeo.translate(0, 1.25, 0);
  const patchMat = new THREE.MeshStandardMaterial({
    color: 0x3d9b2f, roughness: 0.85, side: THREE.DoubleSide,
  });
  const patchMesh = new THREE.InstancedMesh(patchGeo, patchMat, patchCount);
  patchMesh.receiveShadow = true;

  let pi2 = 0;
  for (let attempt = 0; attempt < patchCount * 6 && pi2 < patchCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 1.5 || isInLake(wx, wz, 5) || isInRiver(wx, wz, 8) || isInFarm(wx, wz, 5)) continue;
    if (!nearWaterBody(wx, wz, 55)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.4) continue;

    const scale = 0.5 + Math.random() * 1.2;
    _p.set(wx, h, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale * (0.8 + Math.random() * 0.4), scale, scale * (0.8 + Math.random() * 0.4));
    _m.compose(_p, _q, _s);
    patchMesh.setMatrixAt(pi2, _m);

    const cv = 0.6 + Math.random() * 0.5;
    patchMesh.setColorAt(pi2, new THREE.Color(0.24 * cv, 0.61 * cv, 0.18 * cv));
    pi2++;
  }
  patchMesh.count = pi2;
  patchMesh.instanceMatrix.needsUpdate = true;
  if (patchMesh.instanceColor) patchMesh.instanceColor.needsUpdate = true;
  group.add(patchMesh);

  // ── Wildflower clusters near water ──
  const flowerCount = 500;
  const flowerGeo = new THREE.SphereGeometry(0.25, 6, 4);
  flowerGeo.scale(1, 0.5, 1);
  const flowerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.75,
  });
  const flowerMesh = new THREE.InstancedMesh(flowerGeo, flowerMat, flowerCount);

  let fi2 = 0;
  for (let attempt = 0; attempt < flowerCount * 6 && fi2 < flowerCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 2 || isInLake(wx, wz, 8) || isInRiver(wx, wz, 10) || isInFarm(wx, wz, 5)) continue;
    if (!nearWaterBody(wx, wz, 45)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.35) continue;

    const scale = 0.3 + Math.random() * 0.6;
    _p.set(wx, h + 0.15, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale, scale);
    _m.compose(_p, _q, _s);
    flowerMesh.setMatrixAt(fi2, _m);

    // Colourful wildflower palette
    const colors = [
      new THREE.Color(0.85, 0.2, 0.3),   // red
      new THREE.Color(0.9, 0.75, 0.1),    // yellow
      new THREE.Color(0.95, 0.95, 0.9),   // white
      new THREE.Color(0.7, 0.3, 0.65),    // purple
      new THREE.Color(0.3, 0.4, 0.85),    // blue
      new THREE.Color(0.9, 0.5, 0.2),     // orange
    ];
    flowerMesh.setColorAt(fi2, colors[Math.floor(Math.random() * colors.length)]);
    fi2++;
  }
  flowerMesh.count = fi2;
  flowerMesh.instanceMatrix.needsUpdate = true;
  if (flowerMesh.instanceColor) flowerMesh.instanceColor.needsUpdate = true;
  group.add(flowerMesh);

  // ── Reeds at water edges ──
  const reedCount = 300;
  const reedGeo = new THREE.CylinderGeometry(0.08, 0.12, 3, 4);
  reedGeo.translate(0, 1.5, 0);
  const reedMat = new THREE.MeshStandardMaterial({
    color: 0x5a7a38, roughness: 0.9,
  });
  const reedMesh = new THREE.InstancedMesh(reedGeo, reedMat, reedCount);
  reedMesh.castShadow = true;

  let ri2 = 0;
  for (let attempt = 0; attempt < reedCount * 8 && ri2 < reedCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 0.5) continue;
    if (isInLake(wx, wz, 0) || isInRiver(wx, wz, 0)) continue;
    if (!nearWaterBody(wx, wz, 18)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.3) continue;

    const scale = 0.6 + Math.random() * 0.8;
    _p.set(wx, h, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale * 0.5, scale, scale * 0.5);
    _m.compose(_p, _q, _s);
    reedMesh.setMatrixAt(ri2, _m);

    const cv = 0.6 + Math.random() * 0.4;
    reedMesh.setColorAt(ri2, new THREE.Color(0.35 * cv, 0.48 * cv, 0.22 * cv));
    ri2++;
  }
  reedMesh.count = ri2;
  reedMesh.instanceMatrix.needsUpdate = true;
  if (reedMesh.instanceColor) reedMesh.instanceColor.needsUpdate = true;
  group.add(reedMesh);

  // ── Riparian shrubs (larger bushes near water) ──
  const rShrubCount = 300;
  const rShrubGeo = new THREE.SphereGeometry(1.3, 8, 6);
  rShrubGeo.scale(1, 0.7, 1);
  const rShrubMat = new THREE.MeshStandardMaterial({
    color: 0x2e7a1e, roughness: 0.88,
  });
  const rShrubMesh = new THREE.InstancedMesh(rShrubGeo, rShrubMat, rShrubCount);
  rShrubMesh.castShadow = true;

  let rsi = 0;
  for (let attempt = 0; attempt < rShrubCount * 6 && rsi < rShrubCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 2 || isInLake(wx, wz, 10) || isInRiver(wx, wz, 12) || isInFarm(wx, wz, 8)) continue;
    if (!nearWaterBody(wx, wz, 50)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.35) continue;

    const scale = 0.6 + Math.random() * 1.8;
    _p.set(wx, h - 0.2, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale, scale * (0.5 + Math.random() * 0.4), scale * (0.8 + Math.random() * 0.4));
    _m.compose(_p, _q, _s);
    rShrubMesh.setMatrixAt(rsi, _m);

    const cv = 0.6 + Math.random() * 0.5;
    rShrubMesh.setColorAt(rsi, new THREE.Color(0.18 * cv, 0.49 * cv, 0.12 * cv));
    rsi++;
  }
  rShrubMesh.count = rsi;
  rShrubMesh.instanceMatrix.needsUpdate = true;
  if (rShrubMesh.instanceColor) rShrubMesh.instanceColor.needsUpdate = true;
  group.add(rShrubMesh);
}

/* =============================================================
   GRASS BLADES — subtle ground cover tufts
   ============================================================= */
function addGrass(group, getH, noise, scatter) {
  /* ── Grass blades (thin plane tufts — same style as mountain grass) ── */
  const grassCount = 9000;
  const grassGeo = new THREE.PlaneGeometry(0.5, 1.2, 1, 2);
  const gPos = grassGeo.attributes.position;
  for (let i = 0; i < gPos.count; i++) {
    const y = gPos.getY(i);
    if (y > 0.3) { gPos.setZ(i, gPos.getZ(i) + 0.1); gPos.setY(i, y * 0.95); }
  }
  grassGeo.translate(0, 0.6, 0);
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x4a8530, roughness: 0.88, side: THREE.DoubleSide,
  });
  const grassMesh = new THREE.InstancedMesh(grassGeo, grassMat, grassCount);
  grassMesh.receiveShadow = true;

  let gi = 0;
  for (let attempt = 0; attempt < grassCount * 4 && gi < grassCount; attempt++) {
    const wx = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const wz = (Math.random() - 0.5) * TERRAIN_SIZE * 0.88;
    const h = getH(wx, wz);
    if (h < WATER_LEVEL + 2 || isInLake(wx, wz, 5) || isInRiver(wx, wz, 10) || isInFarm(wx, wz, 5)) continue;
    const slope = getSlope(getH, wx, wz);
    if (slope > 0.6) continue;
    // Thin out on very high bare rock
    if (h > 240 && Math.random() > 0.3) continue;

    const scale = 0.5 + Math.random() * 1.8;
    _p.set(wx, h, wz);
    _q.setFromAxisAngle(_up, Math.random() * Math.PI * 2);
    _s.set(scale * (0.8 + Math.random() * 0.4), scale, scale * (0.8 + Math.random() * 0.4));
    _m.compose(_p, _q, _s);
    grassMesh.setMatrixAt(gi, _m);

    const cv = 0.35 + Math.random() * 0.8;
    grassMesh.setColorAt(gi, new THREE.Color(0.28 * cv, 0.53 * cv, 0.18 * cv));
    gi++;
  }
  grassMesh.count = gi;
  grassMesh.instanceMatrix.needsUpdate = true;
  if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true;
  group.add(grassMesh);
}

/* =============================================================
   HELPER — merge multiple BufferGeometries
   ============================================================= */
function mergeBufferGeometries(geos) {
  let totalVerts = 0, totalIdx = 0;
  for (const g of geos) {
    totalVerts += g.attributes.position.count;
    totalIdx += g.index ? g.index.count : g.attributes.position.count;
  }
  const pos = new Float32Array(totalVerts * 3);
  const norm = new Float32Array(totalVerts * 3);
  const idx = new Uint32Array(totalIdx);

  let vOffset = 0, iOffset = 0;
  for (const g of geos) {
    g.computeVertexNormals();
    const gp = g.attributes.position.array;
    const gn = g.attributes.normal.array;
    pos.set(gp, vOffset * 3);
    norm.set(gn, vOffset * 3);
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) {
        idx[iOffset + i] = g.index.array[i] + vOffset;
      }
      iOffset += g.index.count;
    } else {
      for (let i = 0; i < gp.length / 3; i++) {
        idx[iOffset + i] = vOffset + i;
      }
      iOffset += gp.length / 3;
    }
    vOffset += gp.length / 3;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  merged.setIndex(new THREE.BufferAttribute(idx, 1));
  return merged;
}
