// ================================================================
//  TERRAIN GENERATOR — generic engine utilities
//
//  All island-specific data (LAKES, RIVERS, FARM, noise seeds,
//  water level, height formula, structural geology) lives in
//  src/islands/<name>.js and is passed in via an `islandDef`
//  argument.  This file is island-agnostic.
// ================================================================
import * as THREE from 'three';

// ── Catmull-Rom spline utilities (exported for island defs to use) ──

export function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t
    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export function subdivideRiverPath(pts, subsPerSeg = 8) {
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

// ── Heightmap construction ────────────────────────────────────

/**
 * Build a Float32Array heightmap for the given island.
 * @param {function} noise  - 2D noise function
 * @param {function} noiseB - secondary 2D noise function
 * @param {object}   islandDef - island definition (see src/islands/)
 */
export function buildHeightMap(noise, noiseB, islandDef) {
  const { size, segments } = islandDef.terrain;
  const S = segments + 1;
  const hm = new Float32Array(S * S);
  for (let gz = 0; gz < S; gz++)
    for (let gx = 0; gx < S; gx++) {
      const wx = (gx / segments - 0.5) * size;
      const wz = (gz / segments - 0.5) * size;
      hm[gz * S + gx] = islandDef.generateHeight(noise, noiseB, wx, wz);
    }
  return hm;
}

// ── Heightmap bilinear interpolation ─────────────────────────

/**
 * Sample terrain height at any world-space (wx, wz) position.
 * @param {Float32Array} hm
 * @param {number} wx - world X
 * @param {number} wz - world Z
 * @param {object} islandDef
 */
export function getTerrainHeight(hm, wx, wz, islandDef) {
  const { size, segments } = islandDef.terrain;
  const gx = (wx + size / 2) / size * segments;
  const gz = (wz + size / 2) / size * segments;
  const x0 = Math.max(0, Math.min(segments - 1, gx | 0));
  const z0 = Math.max(0, Math.min(segments - 1, gz | 0));
  const x1 = Math.min(x0 + 1, segments);
  const z1 = Math.min(z0 + 1, segments);
  const fx = gx - x0, fz = gz - z0;
  const S = segments + 1;
  return hm[z0*S+x0]*(1-fx)*(1-fz) + hm[z0*S+x1]*fx*(1-fz)
       + hm[z1*S+x0]*(1-fx)*fz     + hm[z1*S+x1]*fx*fz;
}

// ── Geometry construction ─────────────────────────────────────

/**
 * Build the Three.js PlaneGeometry with per-vertex colours and
 * layer index attributes, ready for the terrain shader.
 * @param {function} noise
 * @param {Float32Array} hm
 * @param {object} islandDef
 */
export function buildTerrainGeometry(noise, hm, islandDef) {
  const { size, segments } = islandDef.terrain;
  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  geo.rotateX(-Math.PI / 2);

  const pos       = geo.attributes.position;
  const colors    = new Float32Array(pos.count * 3);
  const layerAttr = new Float32Array(pos.count);
  const lavaMask  = new Float32Array(pos.count);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const h = getTerrainHeight(hm, x, z, islandDef);
    pos.setY(i, h);

    layerAttr[i] = islandDef.computeLayerIndex(noise, x, h, z);
    lavaMask[i] = islandDef.getLavaFlowMask ? islandDef.getLavaFlowMask(x, z) : 0;

    const layer = islandDef.getLayerAt(noise, x, h, z);
    const c = new THREE.Color(layer.hex);
    const nv  = noise(x * 0.015, z * 0.015) * 0.08;
    const nv2 = noise(x * 0.06 + 100, z * 0.06 + 100) * 0.04;
    c.offsetHSL(nv2 * 0.1, nv * 0.2, nv + nv2);
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute('aVertColor',  new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('aLayerIndex', new THREE.Float32BufferAttribute(layerAttr, 1));
  geo.setAttribute('aLavaMask',   new THREE.Float32BufferAttribute(lavaMask, 1));
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  return geo;
}