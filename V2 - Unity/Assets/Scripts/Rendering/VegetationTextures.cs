// ================================================================
//  VEGETATION TEXTURES — Runtime-generated alpha-cutout textures
//  for grass blades, leaf clusters, pine needles, bark, stone,
//  and procedural normal maps. Dramatically improves vegetation
//  appearance when combined with VegetationLit shader.
// ================================================================
using UnityEngine;

namespace GeologySim
{
    public static class VegetationTextures
    {
        public static Texture2D GrassBlade  { get; private set; }
        public static Texture2D LeafCluster { get; private set; }
        public static Texture2D PineNeedle  { get; private set; }
        public static Texture2D BarkOak     { get; private set; }
        public static Texture2D StoneWall   { get; private set; }
        public static Texture2D StoneNormal { get; private set; }
        public static Texture2D RockDetail  { get; private set; }
        public static Texture2D FlowerPetal { get; private set; }

        public static void GenerateAll()
        {
            GrassBlade  = GenGrassBlade(64, 128);
            LeafCluster = GenLeafCluster(128, 128);
            PineNeedle  = GenPineNeedles(128, 128);
            BarkOak     = GenBark(256, 256);
            StoneWall   = GenStoneWall(256, 256);
            StoneNormal = DeriveNormalMap(StoneWall, 2.0f);
            RockDetail  = GenRockDetail(256, 256);
            FlowerPetal = GenFlowerPetal(64, 64);
        }

        // ── Grass blade alpha texture ───────────────────────

        static Texture2D GenGrassBlade(int w, int h)
        {
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var px = new Color[w * h];

            // Define 7 blades with slight variation
            var blades = new (float baseX, float width, float height, float curve, float hue)[] {
                (0.15f, 0.08f, 0.85f, -0.04f, 0.0f),
                (0.28f, 0.09f, 0.95f,  0.03f, 0.05f),
                (0.40f, 0.10f, 1.00f, -0.02f, -0.03f),
                (0.52f, 0.08f, 0.90f,  0.05f, 0.02f),
                (0.64f, 0.09f, 0.80f, -0.06f, -0.02f),
                (0.76f, 0.07f, 0.88f,  0.04f, 0.04f),
                (0.88f, 0.08f, 0.75f, -0.03f, -0.04f),
            };

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float u = (float)x / w;
                float v = (float)y / h;
                float alpha = 0;
                float r = 0, g = 0, b = 0;

                foreach (var blade in blades)
                {
                    float progress = v / blade.height;
                    if (progress > 1f) continue;

                    // Blade width tapers toward tip (quadratic)
                    float bw = blade.width * (1f - progress * progress) * Mathf.Lerp(1f, 0.3f, progress);
                    // Curve offset
                    float center = blade.baseX + blade.curve * progress * progress * 4f;
                    float dist = Mathf.Abs(u - center);

                    if (dist < bw)
                    {
                        float edgeSoft = Mathf.SmoothStep(bw, bw * 0.4f, dist);
                        // Color: darker base, lighter yellow-green tip
                        float br = Mathf.Lerp(0.12f, 0.28f, progress) + blade.hue * 0.3f;
                        float bg = Mathf.Lerp(0.30f, 0.52f, progress) + blade.hue * 0.2f;
                        float bb = Mathf.Lerp(0.06f, 0.12f, progress);

                        // Central vein (slightly lighter)
                        float vein = 1f + Mathf.Max(0, 1f - dist / (bw * 0.15f)) * 0.15f;
                        br *= vein; bg *= vein; bb *= vein;

                        if (edgeSoft > alpha)
                        {
                            alpha = edgeSoft;
                            r = br; g = bg; b = bb;
                        }
                    }
                }

                px[y * w + x] = new Color(
                    Mathf.Clamp01(r),
                    Mathf.Clamp01(g),
                    Mathf.Clamp01(b),
                    Mathf.Clamp01(alpha));
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Bilinear;
            tex.name = "GrassBlade";
            return tex;
        }

        // ── Leaf cluster alpha texture ──────────────────────

        static Texture2D GenLeafCluster(int w, int h)
        {
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var px = new Color[w * h];
            var rng = new System.Random(1234);

            // Generate 22 scattered leaf shapes
            int leafCount = 22;
            var leaves = new (float cx, float cy, float rx, float ry, float angle, float hShift)
                [leafCount];

            for (int i = 0; i < leafCount; i++)
            {
                leaves[i] = (
                    cx: (float)rng.NextDouble() * 0.8f + 0.1f,
                    cy: (float)rng.NextDouble() * 0.8f + 0.1f,
                    rx: (float)rng.NextDouble() * 0.06f + 0.04f,
                    ry: (float)rng.NextDouble() * 0.04f + 0.025f,
                    angle: (float)rng.NextDouble() * Mathf.PI,
                    hShift: (float)(rng.NextDouble() * 0.12 - 0.06)
                );
            }

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float u = (float)x / w;
                float v = (float)y / h;
                float alpha = 0;
                float cr = 0, cg = 0, cb = 0;

                foreach (var leaf in leaves)
                {
                    float du = u - leaf.cx;
                    float dv = v - leaf.cy;

                    // Rotate into leaf space
                    float cos = Mathf.Cos(leaf.angle);
                    float sin = Mathf.Sin(leaf.angle);
                    float lx = du * cos + dv * sin;
                    float ly = -du * sin + dv * cos;

                    // Elliptical distance
                    float d = (lx / leaf.rx) * (lx / leaf.rx) + (ly / leaf.ry) * (ly / leaf.ry);

                    if (d < 1f)
                    {
                        float leafAlpha = Mathf.SmoothStep(1f, 0.5f, d);

                        // Vein pattern (central line + branching)
                        float vein = Mathf.Abs(ly / leaf.ry) * 0.1f;

                        // Base green with variation per leaf
                        float lr = 0.16f + leaf.hShift * 0.5f;
                        float lg = 0.40f + leaf.hShift;
                        float lb = 0.10f;
                        lr -= vein; lg -= vein;

                        if (leafAlpha > alpha)
                        {
                            alpha = leafAlpha;
                            cr = lr; cg = lg; cb = lb;
                        }
                    }
                }

                px[y * w + x] = new Color(
                    Mathf.Clamp01(cr),
                    Mathf.Clamp01(cg),
                    Mathf.Clamp01(cb),
                    Mathf.Clamp01(alpha));
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Bilinear;
            tex.name = "LeafCluster";
            return tex;
        }

        // ── Pine needle cluster texture ────────────────────

        static Texture2D GenPineNeedles(int w, int h)
        {
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var px = new Color[w * h];
            var rng = new System.Random(5678);

            // Dense clusters of thin needle shapes
            int needleCount = 60;
            var needles = new (float bx, float by, float angle, float len, float hue)
                [needleCount];

            for (int i = 0; i < needleCount; i++)
            {
                needles[i] = (
                    bx: (float)rng.NextDouble(),
                    by: (float)rng.NextDouble(),
                    angle: (float)rng.NextDouble() * Mathf.PI - Mathf.PI * 0.5f,
                    len: (float)rng.NextDouble() * 0.12f + 0.06f,
                    hue: (float)(rng.NextDouble() * 0.08 - 0.04)
                );
            }

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float u = (float)x / w;
                float v = (float)y / h;
                float alpha = 0;
                float cr = 0, cg = 0, cb = 0;

                foreach (var n in needles)
                {
                    float dx = u - n.bx;
                    float dy = v - n.by;
                    float cos = Mathf.Cos(n.angle);
                    float sin = Mathf.Sin(n.angle);
                    float along = dx * cos + dy * sin;
                    float across = -dx * sin + dy * cos;

                    if (along > 0 && along < n.len && Mathf.Abs(across) < 0.008f)
                    {
                        float edge = Mathf.SmoothStep(0.008f, 0.003f, Mathf.Abs(across));
                        float tip = 1f - along / n.len;
                        float na = edge * tip;

                        if (na > alpha)
                        {
                            alpha = na;
                            cr = 0.10f + n.hue;
                            cg = 0.28f + n.hue * 0.5f;
                            cb = 0.06f;
                        }
                    }
                }

                px[y * w + x] = new Color(
                    Mathf.Clamp01(cr),
                    Mathf.Clamp01(cg),
                    Mathf.Clamp01(cb),
                    Mathf.Clamp01(alpha));
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Bilinear;
            tex.name = "PineNeedles";
            return tex;
        }

        // ── Bark texture (opaque, tileable) ─────────────────

        static Texture2D GenBark(int w, int h)
        {
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var px = new Color[w * h];

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float u = (float)x / w;
                float v = (float)y / h;

                // Vertical fibrous streaks
                float streak = Mathf.PerlinNoise(u * 30f + 0.5f, v * 4f + 0.5f);
                float microStreak = Mathf.PerlinNoise(u * 80f + 3f, v * 8f + 2f) * 0.3f;

                // Bark ridges (horizontal cracks)
                float ridge = Mathf.PerlinNoise(u * 6f + 1f, v * 25f + 1f);
                ridge = Mathf.Pow(ridge, 2f);

                // Knots
                float knotX = Mathf.Repeat(u * 3f, 1f) - 0.5f;
                float knotY = Mathf.Repeat(v * 5f, 1f) - 0.5f;
                float knot = 1f - Mathf.Clamp01(Mathf.Sqrt(knotX * knotX * 4f + knotY * knotY * 4f));
                knot = Mathf.Pow(knot, 4f) * 0.3f;

                float val = streak * 0.5f + microStreak + ridge * 0.3f + 0.25f - knot;
                val = Mathf.Clamp01(val);

                // Brown bark color
                float r = Mathf.Lerp(0.18f, 0.42f, val);
                float g = Mathf.Lerp(0.12f, 0.30f, val);
                float b = Mathf.Lerp(0.06f, 0.18f, val);

                px[y * w + x] = new Color(r, g, b, 1f);
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Repeat;
            tex.filterMode = FilterMode.Bilinear;
            tex.anisoLevel = 4;
            tex.name = "BarkOak";
            return tex;
        }

        // ── Stone wall texture (opaque, tileable) ───────────

        static Texture2D GenStoneWall(int w, int h)
        {
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var px = new Color[w * h];
            var rng = new System.Random(7890);

            // Pre-calculate stone color for each cell
            int stoneX = 6, stoneY = 8;
            var stoneColors = new float[stoneX * stoneY];
            for (int i = 0; i < stoneColors.Length; i++)
                stoneColors[i] = (float)rng.NextDouble() * 0.3f + 0.35f;

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float u = (float)x / w;
                float v = (float)y / h;

                // Grid of stones with offset rows
                float su = u * stoneX;
                float sv = v * stoneY;
                int row = Mathf.FloorToInt(sv);
                float rowOffset = (row % 2 == 0) ? 0f : 0.5f;
                float suOff = su + rowOffset;

                int col = Mathf.FloorToInt(suOff) % stoneX;
                if (col < 0) col += stoneX;
                int rowM = row % stoneY;
                if (rowM < 0) rowM += stoneY;

                float fu = Mathf.Repeat(suOff, 1f);
                float fv = Mathf.Repeat(sv, 1f);

                // Mortar lines (darker gaps between stones)
                float mortarX = Mathf.Min(fu, 1f - fu);
                float mortarY = Mathf.Min(fv, 1f - fv);
                float mortar = Mathf.Min(mortarX, mortarY);
                float isMortar = Mathf.SmoothStep(0f, 0.06f, mortar);

                // Stone surface noise
                float noise = Mathf.PerlinNoise(u * 40f + 2f, v * 40f + 2f) * 0.1f;
                float microNoise = Mathf.PerlinNoise(u * 120f + 5f, v * 120f + 5f) * 0.04f;

                float baseVal = stoneColors[rowM * stoneX + col];
                float val = baseVal + noise + microNoise;

                // Mortar is darker
                float mortarDarken = Mathf.Lerp(0.55f, 1f, isMortar);
                val *= mortarDarken;

                // Warm stone colors
                float r = val * 1.05f;
                float g = val * 0.98f;
                float b = val * 0.88f;

                px[y * w + x] = new Color(
                    Mathf.Clamp01(r),
                    Mathf.Clamp01(g),
                    Mathf.Clamp01(b), 1f);
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Repeat;
            tex.filterMode = FilterMode.Bilinear;
            tex.anisoLevel = 4;
            tex.name = "StoneWall";
            return tex;
        }

        // ── Rock detail texture (opaque, tileable) ──────────

        static Texture2D GenRockDetail(int w, int h)
        {
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var px = new Color[w * h];

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float u = (float)x / w;
                float v = (float)y / h;

                // Multi-scale rock surface noise
                float n1 = Mathf.PerlinNoise(u * 8f + 0.5f, v * 8f + 0.5f);
                float n2 = Mathf.PerlinNoise(u * 24f + 3f, v * 24f + 3f) * 0.4f;
                float n3 = Mathf.PerlinNoise(u * 64f + 7f, v * 64f + 7f) * 0.15f;
                float n4 = Mathf.PerlinNoise(u * 150f + 11f, v * 150f + 11f) * 0.06f;

                float val = n1 + n2 + n3 + n4;
                val = Mathf.Clamp01(val * 0.6f + 0.2f);

                // Mineral flecks
                float fleck = Mathf.PerlinNoise(u * 200f + 50f, v * 200f + 50f);
                float hasFleck = fleck > 0.85f ? 0.15f : 0f;

                float r = val * 0.55f + hasFleck;
                float g = val * 0.52f + hasFleck * 0.8f;
                float b = val * 0.48f + hasFleck * 0.5f;

                px[y * w + x] = new Color(
                    Mathf.Clamp01(r),
                    Mathf.Clamp01(g),
                    Mathf.Clamp01(b), 1f);
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Repeat;
            tex.filterMode = FilterMode.Bilinear;
            tex.anisoLevel = 4;
            tex.name = "RockDetail";
            return tex;
        }

        // ── Flower petal texture (alpha cutout) ─────────────

        static Texture2D GenFlowerPetal(int w, int h)
        {
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var px = new Color[w * h];

            // 5 petals arranged in a circle + center
            int petalCount = 5;
            float cx = 0.5f, cy = 0.5f;

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float u = (float)x / w;
                float v = (float)y / h;
                float alpha = 0;
                float cr = 0.9f, cg = 0.9f, cb = 0.85f;

                // Center disc
                float cDist = Mathf.Sqrt((u - cx) * (u - cx) + (v - cy) * (v - cy));
                if (cDist < 0.12f)
                {
                    alpha = Mathf.SmoothStep(0.12f, 0.06f, cDist);
                    cr = 0.85f; cg = 0.75f; cb = 0.15f; // yellow center
                }

                // Petals
                for (int p = 0; p < petalCount; p++)
                {
                    float angle = p * Mathf.PI * 2f / petalCount + Mathf.PI * 0.1f;
                    float pcx = cx + Mathf.Cos(angle) * 0.22f;
                    float pcy = cy + Mathf.Sin(angle) * 0.22f;

                    float du = u - pcx;
                    float dv = v - pcy;
                    // Rotate petal to align radially
                    float cos = Mathf.Cos(-angle);
                    float sin = Mathf.Sin(-angle);
                    float lx = du * cos + dv * sin;
                    float ly = -du * sin + dv * cos;

                    // Petal shape: elongated ellipse
                    float d = (lx * lx) / (0.06f * 0.06f) + (ly * ly) / (0.14f * 0.14f);
                    if (d < 1f)
                    {
                        float pa = Mathf.SmoothStep(1f, 0.5f, d);
                        if (pa > alpha)
                        {
                            alpha = pa;
                            cr = 0.95f; cg = 0.92f; cb = 0.88f;
                        }
                    }
                }

                px[y * w + x] = new Color(cr, cg, cb, Mathf.Clamp01(alpha));
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Bilinear;
            tex.name = "FlowerPetal";
            return tex;
        }

        // ── Normal map derivation from heightmap texture ────

        static Texture2D DeriveNormalMap(Texture2D source, float strength)
        {
            int w = source.width, h = source.height;
            var tex = new Texture2D(w, h, TextureFormat.RGBA32, true);
            var src = source.GetPixels();
            var px = new Color[w * h];

            for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                float hL = GetLum(src[y * w + ((x - 1 + w) % w)]);
                float hR = GetLum(src[y * w + ((x + 1) % w)]);
                float hD = GetLum(src[((y - 1 + h) % h) * w + x]);
                float hU = GetLum(src[((y + 1) % h) * w + x]);

                float dx = (hR - hL) * strength;
                float dy = (hU - hD) * strength;

                var n = new Vector3(-dx, -dy, 1f).normalized;
                px[y * w + x] = new Color(n.x * 0.5f + 0.5f, n.y * 0.5f + 0.5f, n.z * 0.5f + 0.5f, 1f);
            }

            tex.SetPixels(px);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Repeat;
            tex.filterMode = FilterMode.Bilinear;
            tex.anisoLevel = 4;
            tex.name = "StoneNormal";
            return tex;
        }

        static float GetLum(Color c) => c.r * 0.299f + c.g * 0.587f + c.b * 0.114f;
    }
}
