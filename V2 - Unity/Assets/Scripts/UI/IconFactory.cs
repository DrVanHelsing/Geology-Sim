// ================================================================
//  ICON FACTORY — Procedural icon textures matching V2-React SVGs
//  Creates crisp anti-aliased 64×64 RGBA textures via Canvas2D-style
//  line/circle drawing, then wraps them as UI Sprites.
// ================================================================
using UnityEngine;
using System.Collections.Generic;

namespace GeologySim
{
    public static class IconFactory
    {
        const int SZ = 128;    // texture size (high-res for crisp UI)
        const int PAD = 16;    // padding from edge
        static readonly Dictionary<string, Sprite> _cache = new();

        public static Sprite Get(string name)
        {
            if (_cache.TryGetValue(name, out var cached)) return cached;
            var tex = name switch
            {
                "navigate"     => DrawNavigate(),
                "identify"     => DrawIdentify(),
                "drill"        => DrawDrill(),
                "measure"      => DrawMeasure(),
                "strikeDip"    => DrawStrikeDip(),
                "crossSection" => DrawCrossSection(),
                "legend"       => DrawLegend(),
                "notebook"     => DrawNotebook(),
                "settings"     => DrawSettings(),
                _              => DrawFallback(),
            };
            tex.filterMode = FilterMode.Bilinear;
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.Apply();
            var sprite = Sprite.Create(tex, new Rect(0, 0, SZ, SZ), new Vector2(0.5f, 0.5f), SZ);
            _cache[name] = sprite;
            return sprite;
        }

        // ──────────────────────────────────────────
        //  DRAWING PRIMITIVES (anti-aliased)
        // ──────────────────────────────────────────

        static Color32[] Clear()
        {
            var px = new Color32[SZ * SZ];
            for (int i = 0; i < px.Length; i++) px[i] = new Color32(0, 0, 0, 0);
            return px;
        }

        static Texture2D Bake(Color32[] px)
        {
            var t = new Texture2D(SZ, SZ, TextureFormat.RGBA32, false);
            t.SetPixels32(px);
            return t;
        }

        static void Blend(Color32[] px, int x, int y, Color32 c, float alpha)
        {
            if (x < 0 || x >= SZ || y < 0 || y >= SZ) return;
            int i = y * SZ + x;
            byte a = (byte)(c.a * Mathf.Clamp01(alpha));
            if (a == 0) return;
            float sa = a / 255f;
            float da = px[i].a / 255f;
            float outA = sa + da * (1 - sa);
            if (outA < 0.001f) return;
            px[i] = new Color32(
                (byte)((c.r * sa + px[i].r * da * (1 - sa)) / outA),
                (byte)((c.g * sa + px[i].g * da * (1 - sa)) / outA),
                (byte)((c.b * sa + px[i].b * da * (1 - sa)) / outA),
                (byte)(outA * 255));
        }

        // Xiaolin Wu anti-aliased line
        static void Line(Color32[] px, float x0, float y0, float x1, float y1, Color32 c, float w = 1.8f)
        {
            float dx = x1 - x0, dy = y1 - y0;
            float dist = Mathf.Sqrt(dx * dx + dy * dy);
            if (dist < 0.01f) return;
            int steps = (int)(dist * 2) + 1;
            for (int s = 0; s <= steps; s++)
            {
                float t = s / (float)steps;
                float cx = x0 + dx * t;
                float cy = y0 + dy * t;
                float hw = w * 0.5f;
                int minX = Mathf.Max(0, (int)(cx - hw - 1));
                int maxX = Mathf.Min(SZ - 1, (int)(cx + hw + 1));
                int minY = Mathf.Max(0, (int)(cy - hw - 1));
                int maxY = Mathf.Min(SZ - 1, (int)(cy + hw + 1));
                for (int py = minY; py <= maxY; py++)
                    for (int qx = minX; qx <= maxX; qx++)
                    {
                        float d = Mathf.Sqrt((qx + 0.5f - cx) * (qx + 0.5f - cx) +
                                             (py + 0.5f - cy) * (py + 0.5f - cy));
                        float a = Mathf.Clamp01(1 - (d - hw + 0.5f));
                        Blend(px, qx, py, c, a);
                    }
            }
        }

        // Anti-aliased circle outline
        static void Circle(Color32[] px, float cx, float cy, float r, Color32 c, float w = 1.6f)
        {
            int steps = (int)(r * 8) + 16;
            for (int s = 0; s < steps; s++)
            {
                float a0 = (s / (float)steps) * Mathf.PI * 2;
                float a1 = ((s + 1) / (float)steps) * Mathf.PI * 2;
                Line(px,
                    cx + Mathf.Cos(a0) * r, cy + Mathf.Sin(a0) * r,
                    cx + Mathf.Cos(a1) * r, cy + Mathf.Sin(a1) * r,
                    c, w);
            }
        }

        // Filled circle
        static void FillCircle(Color32[] px, float cx, float cy, float r, Color32 c)
        {
            int minX = Mathf.Max(0, (int)(cx - r - 1));
            int maxX = Mathf.Min(SZ - 1, (int)(cx + r + 1));
            int minY = Mathf.Max(0, (int)(cy - r - 1));
            int maxY = Mathf.Min(SZ - 1, (int)(cy + r + 1));
            for (int y = minY; y <= maxY; y++)
                for (int x = minX; x <= maxX; x++)
                {
                    float d = Mathf.Sqrt((x + 0.5f - cx) * (x + 0.5f - cx) +
                                         (y + 0.5f - cy) * (y + 0.5f - cy));
                    float a = Mathf.Clamp01(r - d + 0.5f);
                    Blend(px, x, y, c, a);
                }
        }

        // Filled triangle
        static void FillTriangle(Color32[] px, Vector2 a, Vector2 b, Vector2 cc, Color32 col)
        {
            float minX = Mathf.Max(0, Mathf.Min(a.x, Mathf.Min(b.x, cc.x)) - 1);
            float maxX = Mathf.Min(SZ - 1, Mathf.Max(a.x, Mathf.Max(b.x, cc.x)) + 1);
            float minY = Mathf.Max(0, Mathf.Min(a.y, Mathf.Min(b.y, cc.y)) - 1);
            float maxY = Mathf.Min(SZ - 1, Mathf.Max(a.y, Mathf.Max(b.y, cc.y)) + 1);
            for (int y = (int)minY; y <= (int)maxY; y++)
                for (int x = (int)minX; x <= (int)maxX; x++)
                {
                    float px2 = x + 0.5f, py2 = y + 0.5f;
                    // Barycentric check
                    float d1 = (px2 - b.x) * (a.y - b.y) - (a.x - b.x) * (py2 - b.y);
                    float d2 = (px2 - cc.x) * (b.y - cc.y) - (b.x - cc.x) * (py2 - cc.y);
                    float d3 = (px2 - a.x) * (cc.y - a.y) - (cc.x - a.x) * (py2 - a.y);
                    bool neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
                    bool pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
                    if (!(neg && pos)) Blend(px, x, y, col, 1f);
                }
        }

        // Rounded rectangle outline
        static void RoundRect(Color32[] px, float x, float y, float w, float h, float r, Color32 c, float lw = 2.8f)
        {
            // Top
            Line(px, x + r, y + h, x + w - r, y + h, c, lw);
            // Bottom
            Line(px, x + r, y, x + w - r, y, c, lw);
            // Left
            Line(px, x, y + r, x, y + h - r, c, lw);
            // Right
            Line(px, x + w, y + r, x + w, y + h - r, c, lw);
            // Corners (arcs)
            int steps = 8;
            for (int i = 0; i < steps; i++)
            {
                float a0 = Mathf.PI * 0.5f * i / steps;
                float a1 = Mathf.PI * 0.5f * (i + 1) / steps;
                // Top-right
                Line(px, x + w - r + Mathf.Cos(a0) * r, y + h - r + Mathf.Sin(a0) * r,
                         x + w - r + Mathf.Cos(a1) * r, y + h - r + Mathf.Sin(a1) * r, c, lw);
                // Top-left
                Line(px, x + r - Mathf.Cos(a0) * r, y + h - r + Mathf.Sin(a0) * r,
                         x + r - Mathf.Cos(a1) * r, y + h - r + Mathf.Sin(a1) * r, c, lw);
                // Bottom-left
                Line(px, x + r - Mathf.Cos(a0) * r, y + r - Mathf.Sin(a0) * r,
                         x + r - Mathf.Cos(a1) * r, y + r - Mathf.Sin(a1) * r, c, lw);
                // Bottom-right
                Line(px, x + w - r + Mathf.Cos(a0) * r, y + r - Mathf.Sin(a0) * r,
                         x + w - r + Mathf.Cos(a1) * r, y + r - Mathf.Sin(a1) * r, c, lw);
            }
        }

        static Color32 W = new(230, 237, 243, 255); // TEXT_1 white
        static Color32 A = new(88, 166, 255, 255);  // ACCENT blue
        static Color32 D = new(139, 149, 158, 180);  // dim

        // ──────────────────────────────────────────
        //  ICON IMPLEMENTATIONS (coordinates scaled for 128×128)
        // ──────────────────────────────────────────

        // Navigate — mountain peak with arrow path
        static Texture2D DrawNavigate()
        {
            var px = Clear();
            Line(px, 16, 32, 44, 96, W, 3.5f);
            Line(px, 44, 96, 60, 76, W, 3.5f);
            Line(px, 60, 76, 84, 104, W, 3.5f);
            Line(px, 84, 104, 112, 32, W, 3.5f);
            Line(px, 12, 32, 116, 32, W, 2.8f);
            Line(px, 64, 20, 64, 56, A, 3.0f);
            FillTriangle(px, new Vector2(56, 54), new Vector2(72, 54), new Vector2(64, 20), A);
            return Bake(px);
        }

        // Identify — magnifying glass with sparkle
        static Texture2D DrawIdentify()
        {
            var px = Clear();
            Circle(px, 56, 72, 26, W, 3.5f);
            Line(px, 74, 54, 104, 24, W, 4.5f);
            FillCircle(px, 44, 84, 3.5f, A);
            FillCircle(px, 68, 88, 2.2f, A);
            return Bake(px);
        }

        // Drill — drill body with rotating bit
        static Texture2D DrawDrill()
        {
            var px = Clear();
            Line(px, 64, 108, 64, 52, W, 5.0f);
            Line(px, 52, 56, 76, 56, W, 3.5f);
            Line(px, 56, 52, 64, 24, W, 3.5f);
            Line(px, 72, 52, 64, 24, W, 3.5f);
            float cx = 64, cy = 40;
            for (int s = 0; s < 6; s++)
            {
                float a0 = (s / 6f) * Mathf.PI + 0.3f;
                float a1 = ((s + 1) / 6f) * Mathf.PI + 0.3f;
                Line(px, cx + Mathf.Cos(a0) * 16, cy + Mathf.Sin(a0) * 6,
                         cx + Mathf.Cos(a1) * 16, cy + Mathf.Sin(a1) * 6, D, 2.0f);
            }
            FillCircle(px, 64, 24, 4.5f, new Color32(255, 85, 51, 255));
            return Bake(px);
        }

        // Measure — ruler with tick marks and arrows
        static Texture2D DrawMeasure()
        {
            var px = Clear();
            RoundRect(px, 16, 44, 96, 40, 6, W, 3.0f);
            for (int i = 0; i < 5; i++)
            {
                float x = 32 + i * 20;
                float h = (i % 2 == 0) ? 20 : 12;
                Line(px, x, 84, x, 84 - h, W, 2.2f);
            }
            Line(px, 24, 28, 104, 28, A, 2.5f);
            FillTriangle(px, new Vector2(24, 22), new Vector2(24, 34), new Vector2(16, 28), A);
            FillTriangle(px, new Vector2(104, 22), new Vector2(104, 34), new Vector2(112, 28), A);
            return Bake(px);
        }

        // Strike & Dip — compass with strike line
        static Texture2D DrawStrikeDip()
        {
            var px = Clear();
            Circle(px, 64, 68, 36, W, 3.0f);
            FillCircle(px, 64, 106, 3.5f, new Color32(248, 81, 73, 255));
            Line(px, 28, 68, 100, 68, new Color32(255, 165, 0, 255), 3.5f);
            Line(px, 64, 68, 64, 40, new Color32(255, 102, 34, 255), 3.0f);
            FillCircle(px, 68, 44, 2.8f, new Color32(255, 102, 34, 255));
            return Bake(px);
        }

        // Cross Section — terrain profile with subsurface layers
        static Texture2D DrawCrossSection()
        {
            var px = Clear();
            float[] profile = { 40, 48, 60, 76, 88, 96, 92, 80, 68, 56, 44, 40 };
            for (int i = 0; i < profile.Length - 1; i++)
            {
                float x0 = 16 + i * 8.8f;
                float x1 = 16 + (i + 1) * 8.8f;
                Line(px, x0, profile[i], x1, profile[i + 1], W, 3.5f);
            }
            for (int i = 0; i < profile.Length - 1; i++)
            {
                float x0 = 16 + i * 8.8f;
                float x1 = 16 + (i + 1) * 8.8f;
                Line(px, x0, profile[i] - 20, x1, profile[i + 1] - 20, D, 2.0f);
            }
            for (int i = 0; i < profile.Length - 1; i++)
            {
                float x0 = 16 + i * 8.8f;
                float x1 = 16 + (i + 1) * 8.8f;
                float y0 = profile[i] - 36;
                float y1 = profile[i + 1] - 36;
                Line(px, x0, Mathf.Max(y0, 8), x1, Mathf.Max(y1, 8), D, 1.8f);
            }
            Line(px, 16, 16, 112, 16, D, 1.8f);
            return Bake(px);
        }

        // Legend — three stacked layers
        static Texture2D DrawLegend()
        {
            var px = Clear();
            Color32[] cols = {
                new(109, 139, 80, 200),
                new(160, 144, 128, 200),
                new(184, 160, 110, 200)
            };
            float y = 28;
            for (int i = 0; i < 3; i++)
            {
                for (int bx = 24; bx < 104; bx++)
                    for (int by = (int)y; by < (int)(y + 20); by++)
                        Blend(px, bx, by, cols[i], 0.8f);
                Line(px, 24, y, 104, y, W, 2.0f);
                Line(px, 24, y + 20, 104, y + 20, W, 2.0f);
                Line(px, 24, y, 24, y + 20, W, 2.0f);
                Line(px, 104, y, 104, y + 20, W, 2.0f);
                y += 24;
            }
            return Bake(px);
        }

        // Notebook — open book with lines
        static Texture2D DrawNotebook()
        {
            var px = Clear();
            RoundRect(px, 20, 24, 88, 80, 6, W, 3.0f);
            Line(px, 64, 24, 64, 104, W, 2.5f);
            Line(px, 30, 88, 56, 88, D, 1.8f);
            Line(px, 30, 76, 56, 76, D, 1.8f);
            Line(px, 30, 64, 56, 64, D, 1.8f);
            Line(px, 30, 52, 56, 52, D, 1.8f);
            Line(px, 72, 88, 98, 88, D, 1.8f);
            Line(px, 72, 76, 98, 76, D, 1.8f);
            Line(px, 72, 64, 98, 64, D, 1.8f);
            Line(px, 72, 52, 98, 52, D, 1.8f);
            return Bake(px);
        }

        // Settings — gear
        static Texture2D DrawSettings()
        {
            var px = Clear();
            float cx = 64, cy = 64;
            Circle(px, cx, cy, 16, W, 3.5f);
            for (int i = 0; i < 8; i++)
            {
                float a = i / 8f * Mathf.PI * 2;
                float r1 = 28, r2 = 38;
                float hw = 7f;
                float aMinus = a - hw / r1;
                float aPlus = a + hw / r1;
                Line(px, cx + Mathf.Cos(aMinus) * r1, cy + Mathf.Sin(aMinus) * r1,
                         cx + Mathf.Cos(aMinus) * r2, cy + Mathf.Sin(aMinus) * r2, W, 2.8f);
                Line(px, cx + Mathf.Cos(aPlus) * r1, cy + Mathf.Sin(aPlus) * r1,
                         cx + Mathf.Cos(aPlus) * r2, cy + Mathf.Sin(aPlus) * r2, W, 2.8f);
                Line(px, cx + Mathf.Cos(aMinus) * r2, cy + Mathf.Sin(aMinus) * r2,
                         cx + Mathf.Cos(aPlus) * r2, cy + Mathf.Sin(aPlus) * r2, W, 2.8f);
            }
            FillCircle(px, cx, cy, 6, A);
            return Bake(px);
        }

        static Texture2D DrawFallback()
        {
            var px = Clear();
            Circle(px, 64, 64, 32, W, 3.5f);
            Line(px, 56, 64, 72, 64, W, 3.5f);
            Line(px, 64, 56, 64, 72, W, 3.5f);
            return Bake(px);
        }
    }
}
