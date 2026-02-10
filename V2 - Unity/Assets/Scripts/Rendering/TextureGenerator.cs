// ================================================================
//  TEXTURE GENERATOR — Runtime tileable noise textures for terrain
//  Generates high-quality baked FBM, Worley, grass & normal-map
//  textures that the TerrainPBR shader samples for rich detail.
// ================================================================
using UnityEngine;

namespace GeologySim
{
    public static class TextureGenerator
    {
        // ── Public API ──────────────────────────

        /// <summary>
        /// Generates all terrain textures and assigns them to the material.
        /// Call after creating the terrain material.
        /// </summary>
        public static void GenerateAndAssign(Material terrainMat)
        {
            var noiseTex  = GenerateFBMTexture(512, 6, 4.0f, 0.48f);
            var worleyTex = GenerateWorleyTexture(512, 24f);
            var grassTex  = GenerateGrassTexture(512);
            var normalTex = GenerateNormalMap(noiseTex, 1.5f);

            noiseTex.name  = "TerrainNoise";
            worleyTex.name = "TerrainWorley";
            grassTex.name  = "TerrainGrass";
            normalTex.name = "TerrainNormal";

            // All textures tile seamlessly
            SetTiling(noiseTex);
            SetTiling(worleyTex);
            SetTiling(grassTex);
            SetTiling(normalTex);

            terrainMat.SetTexture("_NoiseTex",  noiseTex);
            terrainMat.SetTexture("_WorleyTex", worleyTex);
            terrainMat.SetTexture("_GrassTex",  grassTex);
            terrainMat.SetTexture("_NormalTex", normalTex);
        }

        static void SetTiling(Texture2D tex)
        {
            tex.wrapMode = TextureWrapMode.Repeat;
            tex.filterMode = FilterMode.Bilinear;
            tex.anisoLevel = 4;
        }

        // ── FBM Noise (tileable) ────────────────

        static Texture2D GenerateFBMTexture(int size, int octaves, float baseFreq, float persistence)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, true);
            var pixels = new Color[size * size];

            for (int y = 0; y < size; y++)
            for (int x = 0; x < size; x++)
            {
                float u = (float)x / size;
                float v = (float)y / size;

                // Tileable FBM via 4D -> 2D torus mapping
                float r1 = baseFreq, r2 = baseFreq;
                float nx = Mathf.Cos(u * Mathf.PI * 2f) * r1;
                float ny = Mathf.Sin(u * Mathf.PI * 2f) * r1;
                float nz = Mathf.Cos(v * Mathf.PI * 2f) * r2;
                float nw = Mathf.Sin(v * Mathf.PI * 2f) * r2;

                float val = 0, amp = 1f, freq = 1f, maxAmp = 0f;
                for (int o = 0; o < octaves; o++)
                {
                    val += amp * Perlin4D(nx * freq, ny * freq, nz * freq, nw * freq);
                    maxAmp += amp;
                    amp *= persistence;
                    freq *= 2.13f;
                }
                val = val / maxAmp * 0.5f + 0.5f;

                // Store FBM in R, derivative-like from higher freq in G, micro in B
                float detail = Perlin4D(nx * baseFreq * 8f, ny * baseFreq * 8f, nz * baseFreq * 8f, nw * baseFreq * 8f) * 0.5f + 0.5f;
                float micro = Perlin4D(nx * baseFreq * 24f, ny * baseFreq * 24f, nz * baseFreq * 24f, nw * baseFreq * 24f) * 0.5f + 0.5f;

                pixels[y * size + x] = new Color(val, detail, micro, 1f);
            }

            tex.SetPixels(pixels);
            tex.Apply(true);
            return tex;
        }

        // ── Worley / Cellular (tileable) ────────

        static Texture2D GenerateWorleyTexture(int size, float cellCount)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, true);
            var pixels = new Color[size * size];

            // Generate cell feature points (wrap-able via modulo)
            int cells = Mathf.RoundToInt(cellCount);
            var points = new Vector2[cells * cells];
            for (int cy = 0; cy < cells; cy++)
            for (int cx = 0; cx < cells; cx++)
            {
                float jitterX = Hash(cx * 127.1f + cy * 311.7f);
                float jitterY = Hash(cx * 269.5f + cy * 183.3f);
                points[cy * cells + cx] = new Vector2((cx + jitterX) / cells, (cy + jitterY) / cells);
            }

            for (int y = 0; y < size; y++)
            for (int x = 0; x < size; x++)
            {
                float u = (float)x / size;
                float v = (float)y / size;

                float d1 = 999f, d2 = 999f;
                // Check nearby cells with wrapping
                int cu = Mathf.FloorToInt(u * cells);
                int cv = Mathf.FloorToInt(v * cells);
                for (int dy = -2; dy <= 2; dy++)
                for (int dx = -2; dx <= 2; dx++)
                {
                    int ncx = ((cu + dx) % cells + cells) % cells;
                    int ncy = ((cv + dy) % cells + cells) % cells;
                    Vector2 pt = points[ncy * cells + ncx];
                    // Wrap the point position
                    float px = pt.x + (cu + dx - ncx) / (float)cells;
                    float py = pt.y + (cv + dy - ncy) / (float)cells;
                    float dist = Mathf.Sqrt((u - px) * (u - px) + (v - py) * (v - py));

                    if (dist < d1) { d2 = d1; d1 = dist; }
                    else if (dist < d2) { d2 = dist; }
                }

                float f1 = Mathf.Clamp01(d1 * cells * 0.7f);
                float f2 = Mathf.Clamp01(d2 * cells * 0.5f);
                float edge = Mathf.Clamp01((d2 - d1) * cells * 2f);

                pixels[y * size + x] = new Color(f1, f2, edge, 1f);
            }

            tex.SetPixels(pixels);
            tex.Apply(true);
            return tex;
        }

        // ── Grass Detail (tileable) ─────────────

        static Texture2D GenerateGrassTexture(int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, true);
            var pixels = new Color[size * size];

            for (int y = 0; y < size; y++)
            for (int x = 0; x < size; x++)
            {
                float u = (float)x / size;
                float v = (float)y / size;

                // Torus mapping for tileability
                float nx = Mathf.Cos(u * Mathf.PI * 2f) * 3f;
                float ny = Mathf.Sin(u * Mathf.PI * 2f) * 3f;
                float nz = Mathf.Cos(v * Mathf.PI * 2f) * 3f;
                float nw = Mathf.Sin(v * Mathf.PI * 2f) * 3f;

                // Grass-like vertical streaks
                float blade = Mathf.Abs(Perlin4D(nx * 4f, ny * 4f, nz * 12f, nw * 12f));
                blade = Mathf.Pow(blade, 0.6f);

                // Clumping pattern
                float clump = Perlin4D(nx * 1.5f, ny * 1.5f, nz * 1.5f, nw * 1.5f) * 0.5f + 0.5f;
                clump = Mathf.Pow(clump, 0.8f);

                // Dry patches
                float dry = Perlin4D(nx * 0.8f + 50f, ny * 0.8f + 50f, nz * 0.8f, nw * 0.8f) * 0.5f + 0.5f;

                // Flower/wildflower specks
                float speck = Perlin4D(nx * 16f, ny * 16f, nz * 16f, nw * 16f) * 0.5f + 0.5f;
                speck = speck > 0.85f ? 1f : 0f;

                pixels[y * size + x] = new Color(blade, clump, dry, speck);
            }

            tex.SetPixels(pixels);
            tex.Apply(true);
            return tex;
        }

        // ── Normal Map from heightmap texture ───

        static Texture2D GenerateNormalMap(Texture2D heightSource, float strength)
        {
            int size = heightSource.width;
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, true);
            var src = heightSource.GetPixels();
            var pixels = new Color[size * size];

            for (int y = 0; y < size; y++)
            for (int x = 0; x < size; x++)
            {
                // Sample neighboring heights (with wrap)
                float hL = src[y * size + ((x - 1 + size) % size)].r;
                float hR = src[y * size + ((x + 1) % size)].r;
                float hD = src[((y - 1 + size) % size) * size + x].r;
                float hU = src[((y + 1) % size) * size + x].r;

                float dx = (hR - hL) * strength;
                float dy = (hU - hD) * strength;

                Vector3 n = new Vector3(-dx, -dy, 1f).normalized;
                // Encode to 0..1 range
                pixels[y * size + x] = new Color(n.x * 0.5f + 0.5f, n.y * 0.5f + 0.5f, n.z * 0.5f + 0.5f, 1f);
            }

            tex.SetPixels(pixels);
            tex.Apply(true);
            return tex;
        }

        // ── Noise helpers ───────────────────────

        static float Hash(float n) => Mathf.Abs(Mathf.Sin(n) * 43758.5453f) % 1f;

        /// <summary>4D Perlin noise for seamless tileable generation</summary>
        static float Perlin4D(float x, float y, float z, float w)
        {
            // Simplex-like 4D via combined 2D Perlin
            float a = Mathf.PerlinNoise(x + 0.1f, y + 0.1f);
            float b = Mathf.PerlinNoise(z + 0.1f, w + 0.1f);
            float c = Mathf.PerlinNoise(x + z + 0.3f, y + w + 0.3f);
            float d = Mathf.PerlinNoise(y + z + 0.7f, x + w + 0.7f);
            return (a * 0.35f + b * 0.35f + c * 0.2f + d * 0.1f) * 2f - 1f;
        }
    }
}
