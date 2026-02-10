// ================================================================
//  TERRAIN GENERATOR — Heightmap + Erosion + Mesh Construction
//  Direct port of V2-React TerrainGenerator.js + ErosionSimulator.js
//  Produces a Unity Mesh with per-vertex color and layer index.
// ================================================================
using UnityEngine;
using System.Collections.Generic;

namespace GeologySim
{
    public static class TerrainGenerator
    {
        static readonly int S = GeologyConfig.GRID_DIM;
        static readonly float HALF = GeologyConfig.TERRAIN_SIZE / 2f;

        // Dense river path cache
        static Dictionary<string, Vector2[]> _denseRiverPaths = new();

        #region Catmull-Rom

        static float CatmullRom(float p0, float p1, float p2, float p3, float t)
        {
            float t2 = t * t, t3 = t2 * t;
            return 0.5f * ((2f * p1)
                + (-p0 + p2) * t
                + (2f * p0 - 5f * p1 + 4f * p2 - p3) * t2
                + (-p0 + 3f * p1 - 3f * p2 + p3) * t3);
        }

        static Vector2[] SubdivideRiverPath(Vector2[] pts, int subsPerSeg = 8)
        {
            var result = new List<Vector2>();
            for (int i = 0; i < pts.Length - 1; i++)
            {
                var p0 = pts[Mathf.Max(0, i - 1)];
                var p1 = pts[i];
                var p2 = pts[i + 1];
                var p3 = pts[Mathf.Min(pts.Length - 1, i + 2)];
                for (int j = 0; j < subsPerSeg; j++)
                {
                    float t = j / (float)subsPerSeg;
                    result.Add(new Vector2(
                        CatmullRom(p0.x, p1.x, p2.x, p3.x, t),
                        CatmullRom(p0.y, p1.y, p2.y, p3.y, t)));
                }
            }
            result.Add(pts[pts.Length - 1]);
            return result.ToArray();
        }

        static Vector2[] GetDenseRiverPath(RiverDefinition river)
        {
            if (_denseRiverPaths.TryGetValue(river.name, out var cached)) return cached;
            var dense = SubdivideRiverPath(river.points, 8);
            _denseRiverPaths[river.name] = dense;
            return dense;
        }

        #endregion

        #region Height Generation

        /// <summary>
        /// Generate terrain height at world position (wx, wz).
        /// Exact port of V2-React generateHeight().
        /// </summary>
        public static float GenerateHeight(SimplexNoise2D noise, SimplexNoise2D noiseB, float x, float z)
        {
            // 1. Base continental terrain
            float h = 80f + NoiseUtils.FBM(noise, x * 0.00045f, z * 0.00045f, 6) * 55f;

            // 2. Mountain ranges
            float mtnMask1 = Mathf.Max(0, 1f - ((x + 400) * (x + 400) + (z + 300) * (z + 300)) / (650f * 650f));
            h += NoiseUtils.RidgeNoise(noiseB, x * 0.0008f, z * 0.0008f, 5) * 120f * mtnMask1;

            float mtnMask2 = Mathf.Max(0, 1f - ((x - 500) * (x - 500) + (z + 400) * (z + 400)) / (500f * 500f));
            h += NoiseUtils.RidgeNoise(noise, x * 0.001f + 5, z * 0.001f + 5, 4) * 80f * mtnMask2;

            // 3. Rolling hills
            h += NoiseUtils.FBM(noiseB, x * 0.0012f, z * 0.0012f, 4) * 30f;

            // 4. Valley carving
            h -= Mathf.Abs(noise.Evaluate(x * 0.0008f, z * 0.0008f)) * 25f;

            // 5. Detail + micro
            h += NoiseUtils.FBM(noise, x * 0.004f, z * 0.004f, 3) * 8f;
            h += NoiseUtils.FBM(noise, x * 0.012f, z * 0.012f, 2) * 2.5f;

            // 6. Plateau
            h += Mathf.Max(0, NoiseUtils.FBM(noiseB, x * 0.00025f, z * 0.00025f, 3)) * 18f;

            // 7. Edge falloff
            float ex = x / HALF, ez = z / HALF;
            float edgeDist = Mathf.Max(Mathf.Abs(ex), Mathf.Abs(ez));
            float edgeFalloff = edgeDist > 0.85f ? (edgeDist - 0.85f) / 0.15f : 0;
            h -= edgeFalloff * edgeFalloff * 60f;

            h = Mathf.Max(h, 18f);

            // Farm flattening
            {
                var farm = GeologyConfig.FARM;
                float fdx = (x - farm.cx) / farm.radius;
                float fdz = (z - farm.cz) / farm.radius;
                float fd2 = fdx * fdx + fdz * fdz;
                if (fd2 < 2.5f)
                {
                    float fd = Mathf.Sqrt(fd2);
                    float ft = Mathf.Max(0, 1f - fd / 1.4f);
                    float fs = ft * ft * (3f - 2f * ft);
                    float farmTarget = farm.elevation + NoiseUtils.FBM(noiseB, x * 0.003f, z * 0.003f, 2) * 1.5f;
                    h = h * (1f - fs) + farmTarget * fs;
                }
            }

            // Lake basin carving — smooth transition + forced depth below water level
            foreach (var lake in GeologyConfig.LAKES)
            {
                float dx = (x - lake.cx) / lake.rx;
                float dz = (z - lake.cz) / lake.rz;
                float d2 = dx * dx + dz * dz;
                if (d2 < 2.25f)
                {
                    float dist = Mathf.Sqrt(d2);
                    float t = Mathf.Max(0, 1f - dist / 1.5f);
                    float s = t * t * (3f - 2f * t);
                    float depthCurve = Mathf.Max(0, 1f - dist * dist) * lake.depth;
                    h -= s * (depthCurve + 8f);

                    // Force terrain below water level inside the lake's actual elliptical boundary
                    if (d2 < 1.0f)
                    {
                        float innerT = 1f - Mathf.Sqrt(d2);
                        float lakeFloor = GeologyConfig.WATER_LEVEL - 3f - lake.depth * innerT;
                        h = Mathf.Min(h, lakeFloor);
                    }
                    // Transition ring (1.0 < d2 < 1.21) — smooth shore
                    else if (d2 < 1.21f)
                    {
                        float shore = (Mathf.Sqrt(d2) - 1f) / 0.1f; // 0→1 across shore ring
                        float shoreTarget = Mathf.Lerp(GeologyConfig.WATER_LEVEL - 1f, h, shore * shore);
                        h = Mathf.Min(h, shoreTarget);
                    }
                }
            }

            // River channel carving
            foreach (var river in GeologyConfig.RIVERS)
            {
                var pts = GetDenseRiverPath(river);
                float minD2 = float.MaxValue;
                for (int i = 0; i < pts.Length - 1; i++)
                {
                    float ax = pts[i].x,  az = pts[i].y;
                    float bx = pts[i+1].x, bz = pts[i+1].y;
                    float abx = bx - ax, abz = bz - az;
                    float apx = x - ax, apz = z - az;
                    float lenSq = abx * abx + abz * abz;
                    float t2 = lenSq > 0 ? Mathf.Clamp01((apx * abx + apz * abz) / lenSq) : 0;
                    float cx2 = ax + t2 * abx, cz2 = az + t2 * abz;
                    float d2 = (x - cx2) * (x - cx2) + (z - cz2) * (z - cz2);
                    if (d2 < minD2) minD2 = d2;
                }
                float rdist = Mathf.Sqrt(minD2);
                float rw = river.width;
                if (rdist < rw * 4.5f)
                {
                    float t3 = Mathf.Max(0, 1f - rdist / (rw * 3.5f));
                    float s3 = t3 * t3 * (3f - 2f * t3);
                    float channelDepth = river.depth * Mathf.Max(0, 1f - (rdist / rw) * (rdist / rw));
                    h -= s3 * (channelDepth + 12f);
                }
            }

            return h;
        }

        #endregion

        #region Bedding / Faults

        public static float GetBeddingPerturbation(SimplexNoise2D noise, float wx, float wz)
        {
            float fold = Mathf.Sin((wx + wz) * 0.004f + noise.Evaluate(wx * 0.001f, wz * 0.001f) * 2f) * 12f;
            float n1 = noise.Evaluate(wx * 0.0003f, wz * 0.0003f) * 14f;
            float n2 = noise.Evaluate(wx * 0.001f + 50, wz * 0.001f + 50) * 6f;
            return fold + n1 + n2;
        }

        public static float GetFaultOffset(float wx)
        {
            float faultX = 200f, width = 40f, displacement = -28f;
            float t = 1f / (1f + Mathf.Exp(-(wx - faultX) / (width * 0.25f)));
            return t * displacement;
        }

        public static GeologicalLayer GetLayerAtPosition(SimplexNoise2D noise, float wx, float elev, float wz)
        {
            float perturb = GetBeddingPerturbation(noise, wx, wz) + GetFaultOffset(wx);
            return GeologyConfig.GetLayerAtElevation(elev - perturb);
        }

        static float ComputeLayerIndex(SimplexNoise2D noise, float wx, float h, float wz)
        {
            float perturb = GetBeddingPerturbation(noise, wx, wz) + GetFaultOffset(wx);
            float adjElev = h - perturb;
            const float BLEND = 6f;
            for (int i = GeologyConfig.LAYERS.Length - 1; i >= 0; i--)
            {
                if (adjElev >= GeologyConfig.LAYERS[i].baseElevation)
                {
                    if (i < GeologyConfig.LAYERS.Length - 1)
                    {
                        float next = GeologyConfig.LAYERS[i + 1].baseElevation;
                        float dist = next - adjElev;
                        if (dist < BLEND && dist > 0) return i + (1f - dist / BLEND);
                    }
                    return i;
                }
            }
            return 0;
        }

        #endregion

        #region Heightmap Build

        public static float[] BuildHeightMap(SimplexNoise2D noise, SimplexNoise2D noiseB)
        {
            float[] hm = new float[S * S];
            for (int gz = 0; gz < S; gz++)
                for (int gx = 0; gx < S; gx++)
                {
                    float wx = ((float)gx / GeologyConfig.SEGMENTS - 0.5f) * GeologyConfig.TERRAIN_SIZE;
                    float wz = ((float)gz / GeologyConfig.SEGMENTS - 0.5f) * GeologyConfig.TERRAIN_SIZE;
                    hm[gz * S + gx] = GenerateHeight(noise, noiseB, wx, wz);
                }
            return hm;
        }

        public static float GetTerrainHeight(float[] hm, float wx, float wz)
        {
            float gx = (wx + HALF) / GeologyConfig.TERRAIN_SIZE * GeologyConfig.SEGMENTS;
            float gz = (wz + HALF) / GeologyConfig.TERRAIN_SIZE * GeologyConfig.SEGMENTS;
            int x0 = Mathf.Clamp(Mathf.FloorToInt(gx), 0, GeologyConfig.SEGMENTS - 1);
            int z0 = Mathf.Clamp(Mathf.FloorToInt(gz), 0, GeologyConfig.SEGMENTS - 1);
            int x1 = Mathf.Min(x0 + 1, GeologyConfig.SEGMENTS);
            int z1 = Mathf.Min(z0 + 1, GeologyConfig.SEGMENTS);
            float fx = gx - x0, fz = gz - z0;
            return hm[z0 * S + x0] * (1 - fx) * (1 - fz) + hm[z0 * S + x1] * fx * (1 - fz)
                 + hm[z1 * S + x0] * (1 - fx) * fz + hm[z1 * S + x1] * fx * fz;
        }

        #endregion

        #region Erosion

        /// <summary>
        /// Particle-based hydraulic erosion. Exact port of ErosionSimulator.js.
        /// </summary>
        public static void ErodeHeightmap(float[] hm, int size, int iterations = 38000)
        {
            const float inertia = 0.05f, capacity = 4f;
            const float depositionR = 0.3f, erosionR = 0.3f;
            const float evaporation = 0.012f, gravity = 4f;
            const float minSlope = 0.01f;
            const int radius = 3, maxLife = 30;

            System.Random rng = new System.Random(123);

            for (int iter = 0; iter < iterations; iter++)
            {
                float px = (float)(rng.NextDouble() * (size - 3) + 1);
                float pz = (float)(rng.NextDouble() * (size - 3) + 1);
                float dx = 0, dz = 0, speed = 1, water = 1, sediment = 0;

                for (int life = 0; life < maxLife; life++)
                {
                    int x0 = (int)px, z0 = (int)pz;
                    float fx = px - x0, fz = pz - z0;
                    int idx00 = z0 * size + x0;

                    if (idx00 < 0 || idx00 + size + 1 >= hm.Length) break;

                    float h00 = hm[idx00], h10 = hm[idx00 + 1];
                    float h01 = hm[idx00 + size], h11 = hm[idx00 + size + 1];
                    float h = h00 * (1 - fx) * (1 - fz) + h10 * fx * (1 - fz) + h01 * (1 - fx) * fz + h11 * fx * fz;

                    float gx = (h10 - h00) * (1 - fz) + (h11 - h01) * fz;
                    float gz2 = (h01 - h00) * (1 - fx) + (h11 - h10) * fx;

                    dx = dx * inertia - gx * (1 - inertia);
                    dz = dz * inertia - gz2 * (1 - inertia);
                    float len = Mathf.Sqrt(dx * dx + dz * dz);
                    if (len > 1e-6f) { dx /= len; dz /= len; }

                    px += dx; pz += dz;
                    if (px < 1 || px >= size - 2 || pz < 1 || pz >= size - 2) break;

                    int nx0 = (int)px, nz0 = (int)pz;
                    float nfx = px - nx0, nfz = pz - nz0;
                    int nIdx = nz0 * size + nx0;
                    if (nIdx < 0 || nIdx + size + 1 >= hm.Length) break;

                    float nh = hm[nIdx] * (1 - nfx) * (1 - nfz) + hm[nIdx + 1] * nfx * (1 - nfz)
                             + hm[nIdx + size] * (1 - nfx) * nfz + hm[nIdx + size + 1] * nfx * nfz;

                    float dh = nh - h;
                    float cap = Mathf.Max(-dh * speed * water * capacity, minSlope);

                    if (sediment > cap || dh > 0)
                    {
                        float dep = dh > 0 ? Mathf.Min(dh, sediment) : (sediment - cap) * depositionR;
                        sediment -= dep;
                        hm[idx00] += dep * (1 - fx) * (1 - fz);
                        hm[idx00 + 1] += dep * fx * (1 - fz);
                        hm[idx00 + size] += dep * (1 - fx) * fz;
                        hm[idx00 + size + 1] += dep * fx * fz;
                    }
                    else
                    {
                        float ero = Mathf.Min((cap - sediment) * erosionR, -dh);
                        for (int ez = -radius; ez <= radius; ez++)
                            for (int exx = -radius; exx <= radius; exx++)
                            {
                                int ix = x0 + exx, iz = z0 + ez;
                                if (ix < 0 || ix >= size || iz < 0 || iz >= size) continue;
                                float d = Mathf.Sqrt(exx * exx + ez * ez);
                                if (d > radius) continue;
                                float w = Mathf.Max(0, 1f - d / radius);
                                hm[iz * size + ix] -= ero * w * 0.1f;
                            }
                        sediment += ero;
                    }

                    speed = Mathf.Sqrt(Mathf.Max(0, speed * speed + dh * gravity));
                    water *= (1f - evaporation);
                }
            }
        }

        #endregion

        #region Mesh Construction

        /// <summary>
        /// Build a Unity Mesh from the heightmap. Uses 32-bit indices for large vertex counts.
        /// Vertex colors encode geological layer tint; UV2.x stores fractional layer index.
        /// </summary>
        public static Mesh BuildTerrainMesh(SimplexNoise2D noise, float[] hm)
        {
            int seg = GeologyConfig.SEGMENTS;
            int vertCount = S * S;
            int triCount = seg * seg * 6;

            var vertices = new Vector3[vertCount];
            var normals  = new Vector3[vertCount];
            var uv       = new Vector2[vertCount];
            var uv2      = new Vector2[vertCount]; // layer index in x
            var colors   = new Color[vertCount];
            var indices  = new int[triCount];

            float size = GeologyConfig.TERRAIN_SIZE;

            // Vertices
            for (int gz = 0; gz < S; gz++)
                for (int gx = 0; gx < S; gx++)
                {
                    int i = gz * S + gx;
                    float wx = ((float)gx / seg - 0.5f) * size;
                    float wz = ((float)gz / seg - 0.5f) * size;
                    float h = GetTerrainHeight(hm, wx, wz);

                    // Unity is Y-up, same as Three.js after rotation
                    vertices[i] = new Vector3(wx, h, wz);
                    uv[i] = new Vector2((float)gx / seg, (float)gz / seg);

                    // Layer index (fractional for blending)
                    float li = ComputeLayerIndex(noise, wx, h, wz);
                    uv2[i] = new Vector2(li, 0);

                    // Vertex color (macro tint)
                    var layer = GetLayerAtPosition(noise, wx, h, wz);
                    float nv = noise.Evaluate(wx * 0.015f, wz * 0.015f) * 0.08f;
                    float nv2 = noise.Evaluate(wx * 0.06f + 100, wz * 0.06f + 100) * 0.04f;
                    Color c = layer.color;
                    float hue, sat, val;
                    Color.RGBToHSV(c, out hue, out sat, out val);
                    hue += nv2 * 0.1f;
                    sat += nv * 0.2f;
                    val += nv + nv2;
                    colors[i] = Color.HSVToRGB(Mathf.Repeat(hue, 1f), Mathf.Clamp01(sat), Mathf.Clamp01(val));
                }

            // Triangles
            int ti = 0;
            for (int gz = 0; gz < seg; gz++)
                for (int gx = 0; gx < seg; gx++)
                {
                    int i00 = gz * S + gx;
                    int i10 = i00 + 1;
                    int i01 = i00 + S;
                    int i11 = i01 + 1;
                    indices[ti++] = i00; indices[ti++] = i01; indices[ti++] = i10;
                    indices[ti++] = i10; indices[ti++] = i01; indices[ti++] = i11;
                }

            var mesh = new Mesh();
            mesh.indexFormat = UnityEngine.Rendering.IndexFormat.UInt32;
            mesh.vertices = vertices;
            mesh.uv = uv;
            mesh.uv2 = uv2;
            mesh.colors = colors;
            mesh.triangles = indices;
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            mesh.name = "ProceduralTerrain";
            return mesh;
        }

        #endregion
    }
}
