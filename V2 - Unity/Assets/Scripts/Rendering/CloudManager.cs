// ================================================================
//  CLOUD MANAGER — Procedural billboard clouds with parallax
//  Creates layered soft-textured cloud billboards at multiple
//  altitudes, with slow drift animation and distance fade.
// ================================================================
using UnityEngine;
using System.Collections.Generic;

namespace GeologySim
{
    public class CloudManager : MonoBehaviour
    {
        readonly List<Transform> _clouds = new();
        readonly List<float> _driftSpeed = new();
        Material _cloudMat;
        Texture2D _cloudTex;

        public void Initialize()
        {
            _cloudTex = GenerateCloudTexture(256);
            _cloudMat = CreateCloudMaterial();
            SpawnClouds();
        }

        void Update()
        {
            // Slow drift
            for (int i = 0; i < _clouds.Count; i++)
            {
                var t = _clouds[i];
                if (t == null) continue;
                var pos = t.position;
                pos.x += _driftSpeed[i] * Time.deltaTime;
                // Wrap around terrain bounds
                float half = GeologyConfig.TERRAIN_SIZE * 2f;
                if (pos.x > half) pos.x -= half * 2f;
                if (pos.x < -half) pos.x += half * 2f;
                t.position = pos;

                // Billboard towards camera
                if (Camera.main != null)
                {
                    Vector3 camDir = Camera.main.transform.position - t.position;
                    camDir.y = 0; // only rotate on Y axis
                    if (camDir.sqrMagnitude > 0.01f)
                        t.rotation = Quaternion.LookRotation(camDir);
                }
            }
        }

        void SpawnClouds()
        {
            var rng = new System.Random(999);
            float terrainSize = GeologyConfig.TERRAIN_SIZE;

            // Layer 1: Low scattered clouds (cumulus-like)
            SpawnCloudLayer(rng, 30, 280f, 380f, terrainSize * 1.5f,
                60f, 160f, 20f, 50f, 0.5f, 1.5f, new Color(1f, 1f, 1f, 0.35f));

            // Layer 2: Mid-altitude wisps
            SpawnCloudLayer(rng, 20, 450f, 600f, terrainSize * 2f,
                80f, 200f, 10f, 25f, 0.8f, 2.2f, new Color(0.95f, 0.96f, 1f, 0.20f));

            // Layer 3: High cirrus
            SpawnCloudLayer(rng, 15, 800f, 1200f, terrainSize * 3f,
                120f, 350f, 5f, 12f, 1.2f, 3f, new Color(0.92f, 0.94f, 1f, 0.12f));
        }

        void SpawnCloudLayer(System.Random rng, int count, float minY, float maxY,
            float spread, float minW, float maxW, float minH, float maxH,
            float minDrift, float maxDrift, Color tint)
        {
            for (int i = 0; i < count; i++)
            {
                float x = (float)(rng.NextDouble() * 2.0 - 1.0) * spread;
                float z = (float)(rng.NextDouble() * 2.0 - 1.0) * spread;
                float y = Mathf.Lerp(minY, maxY, (float)rng.NextDouble());
                float w = Mathf.Lerp(minW, maxW, (float)rng.NextDouble());
                float h = Mathf.Lerp(minH, maxH, (float)rng.NextDouble());
                float drift = Mathf.Lerp(minDrift, maxDrift, (float)rng.NextDouble());
                if (rng.NextDouble() > 0.5) drift = -drift;

                var go = new GameObject($"Cloud_{_clouds.Count}");
                go.transform.SetParent(transform);
                go.transform.position = new Vector3(x, y, z);
                go.transform.localScale = new Vector3(w, h, 1f);

                var mf = go.AddComponent<MeshFilter>();
                mf.mesh = CreateQuadMesh();
                var mr = go.AddComponent<MeshRenderer>();

                // Per-instance material for alpha variation
                var mat = new Material(_cloudMat);
                mat.color = tint;
                mr.material = mat;
                mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                mr.receiveShadows = false;

                _clouds.Add(go.transform);
                _driftSpeed.Add(drift);
            }
        }

        Material CreateCloudMaterial()
        {
            var shader = Shader.Find("Universal Render Pipeline/Particles/Unlit");
            if (shader == null) shader = Shader.Find("Particles/Standard Unlit");
            if (shader == null) shader = Shader.Find("Universal Render Pipeline/Unlit");

            var mat = new Material(shader);
            mat.mainTexture = _cloudTex;
            mat.color = Color.white;
            mat.SetFloat("_Surface", 1f);
            mat.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
            mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
            mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
            mat.SetInt("_ZWrite", 0);
            mat.renderQueue = 3100;
            return mat;
        }

        // ── Procedural cloud texture ──────────

        Texture2D GenerateCloudTexture(int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, true);
            var pixels = new Color[size * size];
            float cx = size * 0.5f, cy = size * 0.5f;

            for (int y = 0; y < size; y++)
            for (int x = 0; x < size; x++)
            {
                float u = (float)x / size;
                float v = (float)y / size;

                // Radial falloff (elliptical for cloud shape)
                float dx = (x - cx) / cx;
                float dy = (y - cy) / cy;
                float dist = Mathf.Sqrt(dx * dx * 1.3f + dy * dy * 2.5f); // wider than tall
                float radial = Mathf.Clamp01(1f - dist);
                radial = Mathf.Pow(radial, 1.8f);

                // Multi-octave FBM noise for cloud density
                float n = 0f, amp = 1f, freq = 3f;
                for (int o = 0; o < 6; o++)
                {
                    n += amp * (Mathf.PerlinNoise(u * freq + 0.1f + o * 7.3f, v * freq + 0.1f + o * 3.7f) * 2f - 1f);
                    amp *= 0.5f;
                    freq *= 2.1f;
                }
                n = n * 0.5f + 0.5f;

                // Combine noise with radial shape
                float density = radial * Mathf.Clamp01(n * 1.3f - 0.1f);
                density = Mathf.Pow(density, 0.7f);

                // Subtle blue-ish shadow on bottom half
                float shade = Mathf.Lerp(0.85f, 1.0f, Mathf.Clamp01(v * 1.2f));

                pixels[y * size + x] = new Color(shade, shade, Mathf.Min(shade * 1.02f, 1f), density);
            }

            tex.SetPixels(pixels);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Bilinear;
            return tex;
        }

        static Mesh CreateQuadMesh()
        {
            var mesh = new Mesh { name = "CloudQuad" };
            mesh.vertices = new[]
            {
                new Vector3(-0.5f, -0.5f, 0f),
                new Vector3(0.5f, -0.5f, 0f),
                new Vector3(0.5f, 0.5f, 0f),
                new Vector3(-0.5f, 0.5f, 0f)
            };
            mesh.uv = new[]
            {
                new Vector2(0, 0), new Vector2(1, 0),
                new Vector2(1, 1), new Vector2(0, 1)
            };
            mesh.triangles = new[] { 0, 2, 1, 0, 3, 2 };
            mesh.normals = new[] { -Vector3.forward, -Vector3.forward, -Vector3.forward, -Vector3.forward };
            mesh.RecalculateBounds();
            return mesh;
        }
    }
}
