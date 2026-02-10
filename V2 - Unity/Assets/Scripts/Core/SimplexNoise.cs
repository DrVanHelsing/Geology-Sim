// ================================================================
//  SIMPLEX NOISE 2D + FBM + RIDGE NOISE
//  Direct port of V2-React/src/engine/noise.js
//  Same seeds produce identical output for terrain reproducibility.
// ================================================================
using UnityEngine;

namespace GeologySim
{
    public class SimplexNoise2D
    {
        readonly byte[] perm;

        static readonly int[][] Grad = {
            new[]{1,1}, new[]{-1,1}, new[]{1,-1}, new[]{-1,-1},
            new[]{1,0}, new[]{-1,0}, new[]{0,1},  new[]{0,-1},
        };

        static readonly float F2 = 0.5f * (Mathf.Sqrt(3f) - 1f);
        static readonly float G2 = (3f - Mathf.Sqrt(3f)) / 6f;

        public SimplexNoise2D(int seed = 42)
        {
            perm = BuildPerm(seed);
        }

        static byte[] BuildPerm(int seed)
        {
            var p = new byte[512];
            var src = new byte[256];
            for (int i = 0; i < 256; i++) src[i] = (byte)i;

            long s = seed == 0 ? 1 : seed;
            for (int i = 255; i > 0; i--)
            {
                s = (s * 16807) % 2147483647;
                int j = (int)(s % (i + 1));
                byte tmp = src[i]; src[i] = src[j]; src[j] = tmp;
            }
            for (int i = 0; i < 256; i++) p[i] = p[i + 256] = src[i];
            return p;
        }

        float Dot(int gi, float gx, float gy)
        {
            var g = Grad[gi % 8];
            return g[0] * gx + g[1] * gy;
        }

        /// <summary>Evaluate 2D simplex noise at (x,y). Returns [-1, 1].</summary>
        public float Evaluate(float xin, float yin)
        {
            float s = (xin + yin) * F2;
            int i = Mathf.FloorToInt(xin + s);
            int j = Mathf.FloorToInt(yin + s);
            float t = (i + j) * G2;
            float x0 = xin - (i - t);
            float y0 = yin - (j - t);

            int i1, j1;
            if (x0 > y0) { i1 = 1; j1 = 0; }
            else          { i1 = 0; j1 = 1; }

            float x1 = x0 - i1 + G2;
            float y1 = y0 - j1 + G2;
            float x2 = x0 - 1f + 2f * G2;
            float y2 = y0 - 1f + 2f * G2;

            int ii = i & 255;
            int jj = j & 255;

            float n0 = 0, n1 = 0, n2 = 0;

            float t0 = 0.5f - x0 * x0 - y0 * y0;
            if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * Dot(perm[ii + perm[jj]], x0, y0); }

            float t1 = 0.5f - x1 * x1 - y1 * y1;
            if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * Dot(perm[ii + i1 + perm[jj + j1]], x1, y1); }

            float t2 = 0.5f - x2 * x2 - y2 * y2;
            if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * Dot(perm[ii + 1 + perm[jj + 1]], x2, y2); }

            return 70f * (n0 + n1 + n2);
        }
    }

    public static class NoiseUtils
    {
        /// <summary>Fractal Brownian Motion — layers multiple octaves of noise.</summary>
        public static float FBM(SimplexNoise2D noise, float x, float z,
            int octaves = 6, float lacunarity = 2f, float gain = 0.5f)
        {
            float sum = 0, amp = 1, freq = 1, maxAmp = 0;
            for (int o = 0; o < octaves; o++)
            {
                sum += noise.Evaluate(x * freq, z * freq) * amp;
                maxAmp += amp;
                amp *= gain;
                freq *= lacunarity;
            }
            return sum / maxAmp;
        }

        /// <summary>Ridge noise — sharp ridge-like features.</summary>
        public static float RidgeNoise(SimplexNoise2D noise, float x, float z, int octaves = 4)
        {
            float sum = 0, amp = 1, freq = 1;
            for (int o = 0; o < octaves; o++)
            {
                float n = noise.Evaluate(x * freq, z * freq);
                n = 1f - Mathf.Abs(n);
                n *= n;
                sum += n * amp;
                amp *= 0.5f;
                freq *= 2f;
            }
            return sum;
        }
    }
}
