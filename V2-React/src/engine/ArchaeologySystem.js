import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

// ─── Terrain helpers ──────────────────────────────────────────────────────────

function terrainNormal(getH, x, z) {
  const d = 3;
  const hL = getH(x - d, z);
  const hR = getH(x + d, z);
  const hD = getH(x, z - d);
  const hU = getH(x, z + d);
  return new THREE.Vector3(hL - hR, 2 * d, hD - hU).normalize();
}

function snapToTerrain(mesh, getH, x, z, yOffset = 0, alignToSlope = true) {
  const y = getH(x, z) + yOffset;
  mesh.position.set(x, y, z);
  if (alignToSlope) {
    const n = terrainNormal(getH, x, z);
    mesh.quaternion.premultiply(new THREE.Quaternion().setFromUnitVectors(UP, n));
  }
}

// ─── Materials (no vertexColors — they were multiplying stone color to near-black) ──

function stoneMat(hex = 0x9e9a8e, roughness = 0.92) {
  return new THREE.MeshStandardMaterial({ color: hex, roughness, metalness: 0.02 });
}
function darkStoneMat(hex = 0x6e6b61) {
  return new THREE.MeshStandardMaterial({ color: hex, roughness: 0.96, metalness: 0 });
}
function waterMat(hex = 0x3e7a70) {
  return new THREE.MeshStandardMaterial({
    color: hex, roughness: 0.15, metalness: 0.12,
    transparent: true, opacity: 0.72,
  });
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function causewaySegment(a, b, width, y, mat) {
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  if (len < 0.1) return null;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, 2.4, width), mat || stoneMat());
  mesh.position.set((a.x + b.x) * 0.5, y, (a.z + b.z) * 0.5);
  mesh.rotation.y = Math.atan2(b.z - a.z, b.x - a.x);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

function canalStrip(a, b, width, y, mat) {
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  if (len < 0.1) return null;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, 0.6, width), mat || waterMat());
  mesh.position.set((a.x + b.x) * 0.5, y, (a.z + b.z) * 0.5);
  mesh.rotation.y = Math.atan2(b.z - a.z, b.x - a.x);
  return mesh;
}

/** Multi-segment terrain-conforming road — each sub-seg samples its own getH. */
function buildConformingRoad(getH, sx, sz, ex, ez, width, segs, mat, yBias = 0.7) {
  const out = [];
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs, t1 = (i + 1) / segs;
    const ax = sx + (ex - sx) * t0, az = sz + (ez - sz) * t0;
    const bx = sx + (ex - sx) * t1, bz = sz + (ez - sz) * t1;
    const y = getH((ax + bx) * 0.5, (az + bz) * 0.5) + yBias;
    const m = causewaySegment({ x: ax, z: az }, { x: bx, z: bz }, width, y, mat);
    if (m) out.push(m);
  }
  return out;
}

// ─── Statue factory ───────────────────────────────────────────────────────────

function makeStatue(variant = 'upright') {
  const g = new THREE.Group();
  const pedMat  = stoneMat(0xa09b90, 0.94);
  const bodyMat = stoneMat(0x8e8980, 0.92);
  const headMat = stoneMat(0x908b82, 0.90);
  const armMat  = stoneMat(0x8a8578, 0.93);

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8.5, 10, 12), pedMat);
  pedestal.position.y = 5;
  pedestal.castShadow = pedestal.receiveShadow = true;
  g.add(pedestal);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.8, 16, 12), bodyMat);
  torso.position.y = 18;
  torso.castShadow = true;
  g.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(3.8, 12, 12), headMat);
  head.position.y = 27;
  g.add(head);

  if (variant !== 'toppled' && variant !== 'half-buried') {
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.8, 10, 8), armMat);
      arm.position.set(side * 5, 18, 0);
      arm.rotation.z = side * 0.3;
      arm.castShadow = true;
      g.add(arm);
    }
    if (variant === 'broken-arm') g.children[g.children.length - 1].visible = false;
  }

  if (variant === 'toppled') { g.rotation.z = Math.PI * 0.47; g.position.y = -4; }
  else if (variant === 'half-buried') g.position.y = -9;
  return g;
}

// ─── Pylon gateway tower ──────────────────────────────────────────────────────

function makePylon(height, width, depth) {
  const g = new THREE.Group();
  const mat    = stoneMat(0xb0ab9f, 0.90);
  const capMat = stoneMat(0x7a7670, 0.95);
  for (const side of [-1, 1]) {
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(width * 0.42, height, depth), mat);
    shaft.position.set(side * width * 0.3, height * 0.5, 0);
    shaft.castShadow = shaft.receiveShadow = true;
    g.add(shaft);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(width * 0.44, height * 0.07, depth * 1.05), capMat);
    cap.position.set(side * width * 0.3, height * 1.038, 0);
    g.add(cap);
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(width * 0.85, height * 0.05, depth * 0.9), capMat);
  lintel.position.y = height * 1.025;
  g.add(lintel);
  return g;
}

// ─── Collapsed rubble field ───────────────────────────────────────────────────

function addCollapsedDistrict(group, getH, city) {
  const mats = [
    stoneMat(0x9a9388, 0.96),
    stoneMat(0x8b8780, 0.97),
    stoneMat(0x7e7b74, 0.98),
  ];
  for (let i = 0; i < 130; i++) {
    const ang = (i / 130) * Math.PI * 2 + Math.random() * 0.14;
    const rad = city.plateauRadius * 0.9 + Math.random() * (city.outerDistrictRadius - city.plateauRadius * 0.9);
    const x = city.cx + Math.cos(ang) * rad;
    const z = city.cz + Math.sin(ang) * rad;
    let geo;
    if (i % 3 === 0) geo = new THREE.BoxGeometry(6 + Math.random() * 9, 3 + Math.random() * 6, 5 + Math.random() * 11);
    else if (i % 3 === 1) geo = new THREE.CylinderGeometry(1.8, 2.8, 5 + Math.random() * 8, 8);
    else geo = new THREE.BoxGeometry(8 + Math.random() * 6, 1.5, 3 + Math.random() * 5);
    const mesh = new THREE.Mesh(geo, mats[i % mats.length]);
    snapToTerrain(mesh, getH, x, z, 0.3, false);
    mesh.rotation.y += Math.random() * Math.PI;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function createArchaeologySystem(islandDef, getH) {
  const group = new THREE.Group();
  group.name = 'ArchaeologySystem';
  group.frustumCulled = false;

  const city     = islandDef?.structures?.lostCity;
  const canals   = islandDef?.structures?.lostCityCanals;
  const bay      = islandDef?.structures?.nautilusBay;
  const causeway = islandDef?.structures?.submergedCauseway;
  const tower    = islandDef?.structures?.collapsingTower;
  const lagoon   = islandDef?.provinces?.lagoon;

  if (!city || !canals || !bay || !causeway || !lagoon) {
    console.warn('[ArchaeologySystem] Missing required data:', { city:!!city, canals:!!canals, bay:!!bay, causeway:!!causeway, lagoon:!!lagoon });
    return group;
  }

  const cityH = getH(city.cx, city.cz);
  console.log(`[ArchaeologySystem] city=(${city.cx.toFixed(0)},${city.cz.toFixed(0)}) terrainY=${cityH.toFixed(1)}`);

  // ── 1. Central plaza platform ─────────────────────────────────────────────
  const plazaR   = city.plazaRadius * 1.6;
  const plazaMat = stoneMat(0xb0ab9f, 0.88);
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(plazaR, plazaR * 1.1, 4, 80), plazaMat);
  snapToTerrain(plaza, getH, city.cx, city.cz, 1.8, false);
  plaza.castShadow = plaza.receiveShadow = true;
  group.add(plaza);

  // Concentric terrace rings
  const terraceMat = stoneMat(0xa8a39a, 0.92);
  for (const ring of city.terraces) {
    const r = (ring.inner + ring.outer) * 0.5;
    const h = getH(city.cx + r, city.cz) + ring.offset + 0.5;
    const tGeo = new THREE.TorusGeometry(r, (ring.outer - ring.inner) * 0.44, 6, 64);
    const tr = new THREE.Mesh(tGeo, terraceMat);
    tr.rotation.x = -Math.PI * 0.5;
    tr.position.set(city.cx, h, city.cz);
    tr.receiveShadow = true;
    group.add(tr);
  }

  // ── 2. Tall obelisk (60 units high — findable from anywhere) ─────────────
  const obeliskMat = stoneMat(0x7a7670, 0.86);
  const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 3.4, 60, 10), obeliskMat);
  snapToTerrain(obelisk, getH, city.cx, city.cz, 32, false);
  obelisk.castShadow = true;
  group.add(obelisk);

  const capMesh = new THREE.Mesh(new THREE.ConeGeometry(3.8, 7, 10), stoneMat(0x6a6760, 0.84));
  capMesh.position.set(city.cx, obelisk.position.y + 33.5, city.cz);
  group.add(capMesh);

  // ── 3. Four corner pylon gateways (38 units tall, dominant silhouette) ───
  const pylonOffsets = [
    [-1, -1], [1, -1], [-1, 1], [1, 1],
  ];
  const pylonR = city.plazaRadius * 1.25;
  for (const [ox, oz] of pylonOffsets) {
    const px = city.cx + ox * pylonR;
    const pz = city.cz + oz * pylonR;
    const pylon = makePylon(38, 20, 14);
    snapToTerrain(pylon, getH, px, pz, 0, false);
    group.add(pylon);
  }

  // ── 4. Radial stone avenues (multi-segment, terrain-conforming) ───────────
  const avenueMat = stoneMat(0x9c9890, 0.94);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const sx = city.cx + Math.cos(angle) * plazaR;
    const sz = city.cz + Math.sin(angle) * plazaR;
    const ex = city.cx + Math.cos(angle) * city.plateauRadius * 1.3;
    const ez = city.cz + Math.sin(angle) * city.plateauRadius * 1.3;
    for (const m of buildConformingRoad(getH, sx, sz, ex, ez, 7, 12, avenueMat)) group.add(m);
  }

  // ── 5. Monumental statues ─────────────────────────────────────────────────
  const variants = ['upright', 'broken-arm', 'toppled', 'half-buried'];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r = city.plateauRadius * 0.76;
    const statue = makeStatue(variants[i % variants.length]);
    snapToTerrain(statue, getH, city.cx + Math.cos(angle) * r, city.cz + Math.sin(angle) * r, 0, false);
    statue.rotation.y = angle + Math.PI;
    statue.scale.setScalar(1.1 + (i % 3) * 0.2);
    group.add(statue);
  }

  // ── 6. Canal waterways (terrain-sampled per segment) ──────────────────────
  const canalWater = new THREE.Group();
  canalWater.frustumCulled = false;
  const retainingMat = stoneMat(0x92918a, 0.96);

  for (const c of canals.radial) {
    const ex = city.cx + Math.cos(c.angle) * c.length;
    const ez = city.cz + Math.sin(c.angle) * c.length;
    const segs = 8;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs;
      const ax = city.cx + (ex - city.cx) * t0, az = city.cz + (ez - city.cz) * t0;
      const bx = city.cx + (ex - city.cx) * t1, bz = city.cz + (ez - city.cz) * t1;
      const wy = getH((ax + bx) * 0.5, (az + bz) * 0.5) + 0.2;
      const strip = canalStrip({ x: ax, z: az }, { x: bx, z: bz }, c.width, wy, waterMat(0x3e8a82));
      if (strip) canalWater.add(strip);
    }
    const nx = -Math.sin(c.angle), nz = Math.cos(c.angle);
    for (const side of [-1, 1]) {
      const wsx = city.cx + nx * side * c.width * 0.62;
      const wsz = city.cz + nz * side * c.width * 0.62;
      const wex = ex + nx * side * c.width * 0.62;
      const wez = ez + nz * side * c.width * 0.62;
      for (const m of buildConformingRoad(getH, wsx, wsz, wex, wez, 1.8, 6, retainingMat, 1.6)) group.add(m);
    }
  }
  group.add(canalWater);

  // ── 7. Lagoon inlet canal ─────────────────────────────────────────────────
  {
    const isx = city.cx + 95, isz = city.cz + 35;
    const iex = lagoon.cx + 20, iez = lagoon.cz - 22;
    const wm = waterMat(0x426e68);
    const segs = 10;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs;
      const ax = isx + (iex - isx) * t0, az = isz + (iez - isz) * t0;
      const bx = isx + (iex - isx) * t1, bz = isz + (iez - isz) * t1;
      const wy = getH((ax + bx) * 0.5, (az + bz) * 0.5) + 0.1;
      const strip = canalStrip({ x: ax, z: az }, { x: bx, z: bz }, 9, wy, wm);
      if (strip) canalWater.add(strip);
    }
  }

  // ── 8. Mechanical gate ────────────────────────────────────────────────────
  const gateX = lagoon.cx + 20, gateZ = lagoon.cz - 22;
  const gateGroup = new THREE.Group();
  const gm = darkStoneMat(0x5e5b54);
  const gear = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 2, 16), gm);
  gear.rotation.x = Math.PI * 0.5;
  gateGroup.add(gear);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(1, 2.4, 1.2), gm);
    tooth.position.set(Math.cos(a) * 6.3, Math.sin(a) * 6.3, 0);
    tooth.rotation.z = a;
    gateGroup.add(tooth);
  }
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.9, 10, 28), stoneMat(0x8f8b80, 0.92));
  wheel.rotation.y = Math.PI * 0.5;
  wheel.position.set(-10, 3, 0);
  gateGroup.add(wheel);
  const cw = new THREE.Mesh(new THREE.BoxGeometry(3, 7, 3), stoneMat(0x82807a, 0.95));
  cw.position.set(10, -4, 0);
  gateGroup.add(cw);
  snapToTerrain(gateGroup, getH, gateX, gateZ, 9, false);
  gateGroup.userData.rotor = gear;
  gateGroup.userData.wheel = wheel;
  group.add(gateGroup);

  // ── 9. Nautilus Bay quay ──────────────────────────────────────────────────
  const quayGeo = new THREE.RingGeometry(bay.harborRadius * 0.72, bay.harborRadius, 56, 1, Math.PI * 0.1, Math.PI * 0.9);
  const quay = new THREE.Mesh(quayGeo, stoneMat(0xa4a09a, 0.92));
  quay.rotation.x = -Math.PI * 0.5;
  quay.position.set(bay.cx, getH(bay.cx, bay.cz) + 0.9, bay.cz);
  quay.receiveShadow = true;
  group.add(quay);
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * (0.1 + (i / 9) * 0.9);
    const px = bay.cx + Math.cos(a) * bay.harborRadius * 0.88;
    const pz = bay.cz + Math.sin(a) * bay.harborRadius * 0.88;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 7, 8), darkStoneMat(0x4a4740));
    snapToTerrain(post, getH, px, pz, 3.5, false);
    group.add(post);
  }
  for (let i = 0; i < 8; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(9, 1.2, 3.2), stoneMat(0x9f9a92, 0.94));
    snapToTerrain(step, getH, bay.cx - 22 - i * 3.5, bay.cz + 40, 0.5 + i * 0.15, false);
    group.add(step);
  }

  // ── 10. Collapsed outer district ──────────────────────────────────────────
  addCollapsedDistrict(group, getH, city);

  // ── 11. Leaning tower ─────────────────────────────────────────────────────
  if (tower) {
    const towerMesh = new THREE.Mesh(new THREE.CylinderGeometry(7, 10, tower.height, 14), stoneMat(0x9a9590, 0.93));
    snapToTerrain(towerMesh, getH, tower.cx, tower.cz, tower.height * 0.5, false);
    towerMesh.rotation.z += THREE.MathUtils.degToRad(tower.leanDegrees);
    towerMesh.castShadow = true;
    group.add(towerMesh);
    const debris = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 3.5, 18), stoneMat(0x7e7b74, 0.97));
    snapToTerrain(debris, getH, tower.cx + 14, tower.cz + 9, 1.8, false);
    group.add(debris);
  }

  // ── 12. Submerged causeway road ────────────────────────────────────────────
  const cwMat = stoneMat(0x8a8680, 0.96);
  for (let i = 0; i < 20; i++) {
    const t0 = i / 20, t1 = (i + 1) / 20;
    const ax = THREE.MathUtils.lerp(causeway.startX, causeway.endX, t0);
    const az = THREE.MathUtils.lerp(causeway.startZ, causeway.endZ, t0);
    const bx = THREE.MathUtils.lerp(causeway.startX, causeway.endX, t1);
    const bz = THREE.MathUtils.lerp(causeway.startZ, causeway.endZ, t1);
    const y = getH((ax + bx) * 0.5, (az + bz) * 0.5) + 0.5;
    const seg = causewaySegment({ x: ax, z: az }, { x: bx, z: bz }, causeway.width, y, cwMat);
    if (seg) group.add(seg);
  }

  group.userData.mechanicalGate = gateGroup;
  group.userData.canalWater = canalWater;
  return group;
}

// ─── Per-frame update ─────────────────────────────────────────────────────────

export function updateArchaeologySystem(arch, time) {
  if (!arch) return;
  const gate = arch.userData?.mechanicalGate;
  if (gate?.userData?.rotor)  gate.userData.rotor.rotation.z  =  time * 0.35;
  if (gate?.userData?.wheel)  gate.userData.wheel.rotation.x  = -time * 0.21;
  const canals = arch.userData?.canalWater;
  if (canals) {
    const pulse = 0.62 + 0.1 * Math.sin(time * 0.7);
    canals.traverse((child) => {
      if (child.isMesh && child.material?.transparent) child.material.opacity = pulse;
    });
  }
}
