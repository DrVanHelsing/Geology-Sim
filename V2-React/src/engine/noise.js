// ================================================================
//  SIMPLEX NOISE 2D
//  Based on Stefan Gustavson's algorithm – compact ES‑module version
// ================================================================

function buildPerm(seed) {
  const p = new Uint8Array(512);
  const src = new Uint8Array(256);
  for (let i = 0; i < 256; i++) src[i] = i;
  let s = seed | 0 || 1;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [src[i], src[j]] = [src[j], src[i]];
  }
  for (let i = 0; i < 256; i++) p[i] = p[i + 256] = src[i];
  return p;
}

const G2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2F = (3.0 - Math.sqrt(3)) / 6.0;

/**
 * Create a seeded 2‑D simplex noise function.
 * @param {number} seed
 * @returns {(x:number,y:number)=>number} noise in range [−1, 1]
 */
export function createNoise2D(seed = 42) {
  const perm = buildPerm(seed);

  return function noise2D(xin, yin) {
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2F;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2F;
    const y1 = y0 - j1 + G2F;
    const x2 = x0 - 1.0 + 2.0 * G2F;
    const y2 = y0 - 1.0 + 2.0 * G2F;
    const ii = i & 255;
    const jj = j & 255;

    const dot = (gi, gx, gy) => {
      const g = G2[gi % 8];
      return g[0] * gx + g[1] * gy;
    };

    let n0 = 0, n1 = 0, n2 = 0;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * dot(perm[ii + perm[jj]], x0, y0); }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * dot(perm[ii + i1 + perm[jj + j1]], x1, y1); }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * dot(perm[ii + 1 + perm[jj + 1]], x2, y2); }

    return 70.0 * (n0 + n1 + n2);
  };
}

/**
 * Fractal Brownian Motion — layer multiple octaves of noise.
 */
export function fbm(noise, x, z, octaves = 6, lacunarity = 2.0, gain = 0.5) {
  let sum = 0, amp = 1, freq = 1, maxAmp = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise(x * freq, z * freq) * amp;
    maxAmp += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / maxAmp;
}

/**
 * Ridge noise — creates sharp ridge‑like features.
 */
export function ridgeNoise(noise, x, z, octaves = 4) {
  let sum = 0, amp = 1, freq = 1;
  for (let o = 0; o < octaves; o++) {
    let n = noise(x * freq, z * freq);
    n = 1.0 - Math.abs(n);
    n *= n;
    sum += n * amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}
