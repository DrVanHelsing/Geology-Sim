// ================================================================
//  HYDRAULIC EROSION SIMULATOR
//  Particle-based droplet erosion applied to the heightmap before
//  geometry construction.  Creates realistic valleys & channels.
// ================================================================

/**
 * Erode a flat heightmap in-place.
 * @param {Float32Array} hm   - heightmap (size × size)
 * @param {number}       size - grid dimension (SEGMENTS + 1)
 * @param {number}       iterations - number of droplets
 */
export function erodeHeightmap(hm, size, iterations = 22000) {
  const inertia     = 0.05;
  const capacity    = 4.0;
  const depositionR = 0.3;
  const erosionR    = 0.3;
  const evaporation = 0.012;
  const gravity     = 4.0;
  const minSlope    = 0.01;
  const radius      = 3;
  const maxLife     = 30;

  for (let iter = 0; iter < iterations; iter++) {
    let px = Math.random() * (size - 3) + 1;
    let pz = Math.random() * (size - 3) + 1;
    let dx = 0, dz = 0, speed = 1, water = 1, sediment = 0;

    for (let life = 0; life < maxLife; life++) {
      const x0 = px | 0, z0 = pz | 0;
      const fx = px - x0, fz = pz - z0;
      const idx00 = z0 * size + x0;

      // bilinear height
      const h00 = hm[idx00],              h10 = hm[idx00 + 1];
      const h01 = hm[idx00 + size],       h11 = hm[idx00 + size + 1];
      const h = h00*(1-fx)*(1-fz) + h10*fx*(1-fz) + h01*(1-fx)*fz + h11*fx*fz;

      // gradient
      const gx = (h10-h00)*(1-fz) + (h11-h01)*fz;
      const gz = (h01-h00)*(1-fx) + (h11-h10)*fx;

      // update direction with inertia
      dx = dx * inertia - gx * (1 - inertia);
      dz = dz * inertia - gz * (1 - inertia);
      const len = Math.sqrt(dx*dx + dz*dz);
      if (len > 1e-6) { dx /= len; dz /= len; }

      px += dx;  pz += dz;
      if (px < 1 || px >= size - 2 || pz < 1 || pz >= size - 2) break;

      // new height
      const nx0 = px | 0, nz0 = pz | 0;
      const nfx = px - nx0, nfz = pz - nz0;
      const nIdx = nz0 * size + nx0;
      const nh = hm[nIdx]*(1-nfx)*(1-nfz) + hm[nIdx+1]*nfx*(1-nfz)
               + hm[nIdx+size]*(1-nfx)*nfz + hm[nIdx+size+1]*nfx*nfz;

      const dh = nh - h;
      const cap = Math.max(-dh * speed * water * capacity, minSlope);

      if (sediment > cap || dh > 0) {
        // deposit
        const dep = dh > 0 ? Math.min(dh, sediment) : (sediment - cap) * depositionR;
        sediment -= dep;
        hm[idx00]          += dep * (1-fx) * (1-fz);
        hm[idx00 + 1]      += dep * fx     * (1-fz);
        hm[idx00 + size]   += dep * (1-fx) * fz;
        hm[idx00 + size+1] += dep * fx     * fz;
      } else {
        // erode
        const ero = Math.min((cap - sediment) * erosionR, -dh);
        for (let ez = -radius; ez <= radius; ez++)
          for (let ex = -radius; ex <= radius; ex++) {
            const ix = x0 + ex, iz = z0 + ez;
            if (ix < 0 || ix >= size || iz < 0 || iz >= size) continue;
            const d = Math.sqrt(ex*ex + ez*ez);
            if (d > radius) continue;
            const w = Math.max(0, 1 - d / radius);
            hm[iz * size + ix] -= ero * w * 0.1;
          }
        sediment += ero;
      }

      speed = Math.sqrt(Math.max(0, speed * speed + dh * gravity));
      water *= (1 - evaporation);
    }
  }
}
