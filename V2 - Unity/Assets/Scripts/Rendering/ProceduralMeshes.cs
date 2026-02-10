// ================================================================
//  PROCEDURAL MESHES — High-quality runtime meshes for vegetation
//  Cross-billboard grass, multi-plane leaf clusters, icosphere rocks.
// ================================================================
using UnityEngine;
using System.Collections.Generic;

namespace GeologySim
{
    public static class ProceduralMeshes
    {
        public static Mesh GrassCross    { get; private set; }
        public static Mesh LeafCluster   { get; private set; }
        public static Mesh PineCluster   { get; private set; }
        public static Mesh Icosphere     { get; private set; }
        public static Mesh FlowerQuad    { get; private set; }

        public static void GenerateAll()
        {
            GrassCross  = CreateGrassCrossBillboard();
            LeafCluster = CreateLeafClusterMesh();
            PineCluster = CreatePineClusterMesh();
            Icosphere   = CreateIcosphere(1);
            FlowerQuad  = CreateCrossQuad(0.5f, 0.5f);
        }

        // ── Cross-billboard for grass ───────────────────────
        // Two quads at 90° forming an X shape, Y goes 0→1

        static Mesh CreateGrassCrossBillboard()
        {
            var mesh = new Mesh { name = "GrassCross" };

            var verts = new Vector3[] {
                // Quad 1 (along X)
                new(-0.5f, 0f, 0f), new(0.5f, 0f, 0f),
                new(0.5f, 1f, 0f),  new(-0.5f, 1f, 0f),
                // Quad 2 (along Z)
                new(0f, 0f, -0.5f), new(0f, 0f, 0.5f),
                new(0f, 1f, 0.5f),  new(0f, 1f, -0.5f),
                // Quad 3 (diagonal)
                new(-0.35f, 0f, -0.35f), new(0.35f, 0f, 0.35f),
                new(0.35f, 1f, 0.35f),   new(-0.35f, 1f, -0.35f),
            };

            var uvs = new Vector2[] {
                new(0,0), new(1,0), new(1,1), new(0,1),
                new(0,0), new(1,0), new(1,1), new(0,1),
                new(0,0), new(1,0), new(1,1), new(0,1),
            };

            var normals = new Vector3[12];
            for (int i = 0; i < 4; i++) normals[i] = Vector3.forward;
            for (int i = 4; i < 8; i++) normals[i] = Vector3.right;
            for (int i = 8; i < 12; i++) normals[i] = new Vector3(0.707f, 0f, 0.707f);

            var tris = new int[] {
                0,2,1, 0,3,2,
                4,6,5, 4,7,6,
                8,10,9, 8,11,10,
            };

            mesh.vertices = verts;
            mesh.uv = uvs;
            mesh.normals = normals;
            mesh.triangles = tris;
            mesh.RecalculateBounds();
            return mesh;
        }

        // ── Leaf cluster for deciduous trees ────────────────
        // 6 small quads at various angles forming a puffy cluster

        static Mesh CreateLeafClusterMesh()
        {
            var mesh = new Mesh { name = "LeafCluster" };
            var verts = new List<Vector3>();
            var uvList = new List<Vector2>();
            var normList = new List<Vector3>();
            var triList = new List<int>();

            // 8 planes at various angles
            var configs = new (float rotY, float rotX, float offsetY)[] {
                (0f, 0f, 0f),
                (45f, 15f, 0.05f),
                (90f, -10f, 0.02f),
                (135f, 20f, -0.03f),
                (22f, -25f, 0.08f),
                (67f, 30f, -0.05f),
                (112f, -15f, 0.04f),
                (157f, 10f, -0.06f),
            };

            foreach (var cfg in configs)
            {
                int baseIdx = verts.Count;
                var rot = Quaternion.Euler(cfg.rotX, cfg.rotY, 0f);
                var offset = new Vector3(0f, cfg.offsetY, 0f);

                var qVerts = new Vector3[] {
                    new(-0.5f, -0.5f, 0f),
                    new(0.5f, -0.5f, 0f),
                    new(0.5f, 0.5f, 0f),
                    new(-0.5f, 0.5f, 0f),
                };

                var normal = rot * Vector3.forward;

                for (int i = 0; i < 4; i++)
                {
                    verts.Add(rot * qVerts[i] + offset);
                    normList.Add(normal);
                }

                uvList.Add(new Vector2(0, 0));
                uvList.Add(new Vector2(1, 0));
                uvList.Add(new Vector2(1, 1));
                uvList.Add(new Vector2(0, 1));

                triList.AddRange(new[] {
                    baseIdx, baseIdx + 2, baseIdx + 1,
                    baseIdx, baseIdx + 3, baseIdx + 2
                });
            }

            mesh.vertices = verts.ToArray();
            mesh.uv = uvList.ToArray();
            mesh.normals = normList.ToArray();
            mesh.triangles = triList.ToArray();
            mesh.RecalculateBounds();
            return mesh;
        }

        // ── Pine needle cluster ─────────────────────────────
        // Flatter, more conical arrangement for pines

        static Mesh CreatePineClusterMesh()
        {
            var mesh = new Mesh { name = "PineCluster" };
            var verts = new List<Vector3>();
            var uvList = new List<Vector2>();
            var normList = new List<Vector3>();
            var triList = new List<int>();

            // 6 planes in a conical arrangement (angled down from center)
            for (int i = 0; i < 6; i++)
            {
                int baseIdx = verts.Count;
                float angle = i * 60f;
                var rot = Quaternion.Euler(-30f, angle, 0f);

                var qVerts = new Vector3[] {
                    new(-0.5f, -0.3f, 0f),
                    new(0.5f, -0.3f, 0f),
                    new(0.5f, 0.3f, 0f),
                    new(-0.5f, 0.3f, 0f),
                };

                var normal = rot * Vector3.forward;
                for (int j = 0; j < 4; j++)
                {
                    verts.Add(rot * qVerts[j]);
                    normList.Add(normal);
                }

                uvList.Add(new Vector2(0, 0));
                uvList.Add(new Vector2(1, 0));
                uvList.Add(new Vector2(1, 1));
                uvList.Add(new Vector2(0, 1));

                triList.AddRange(new[] {
                    baseIdx, baseIdx + 2, baseIdx + 1,
                    baseIdx, baseIdx + 3, baseIdx + 2
                });
            }

            mesh.vertices = verts.ToArray();
            mesh.uv = uvList.ToArray();
            mesh.normals = normList.ToArray();
            mesh.triangles = triList.ToArray();
            mesh.RecalculateBounds();
            return mesh;
        }

        // ── Cross quad (for flowers) ────────────────────────

        static Mesh CreateCrossQuad(float w, float h)
        {
            var mesh = new Mesh { name = "FlowerCross" };
            var verts = new Vector3[] {
                new(-w, 0, 0), new(w, 0, 0), new(w, h*2, 0), new(-w, h*2, 0),
                new(0, 0, -w), new(0, 0, w), new(0, h*2, w), new(0, h*2, -w),
            };
            var uvs = new Vector2[] {
                new(0,0), new(1,0), new(1,1), new(0,1),
                new(0,0), new(1,0), new(1,1), new(0,1),
            };
            var normals = new Vector3[8];
            for (int i = 0; i < 4; i++) normals[i] = Vector3.forward;
            for (int i = 4; i < 8; i++) normals[i] = Vector3.right;

            mesh.vertices = verts;
            mesh.uv = uvs;
            mesh.normals = normals;
            mesh.triangles = new[] { 0,2,1, 0,3,2, 4,6,5, 4,7,6 };
            mesh.RecalculateBounds();
            return mesh;
        }

        // ── Icosphere (for rocks/boulders) ──────────────────

        static Mesh CreateIcosphere(int subdivisions)
        {
            var mesh = new Mesh { name = "Icosphere" };

            // Start with icosahedron
            float t = (1f + Mathf.Sqrt(5f)) / 2f;
            var vertList = new List<Vector3> {
                new(-1, t, 0), new(1, t, 0), new(-1,-t, 0), new(1,-t, 0),
                new(0,-1, t), new(0, 1, t), new(0,-1,-t), new(0, 1,-t),
                new( t, 0,-1), new( t, 0, 1), new(-t, 0,-1), new(-t, 0, 1),
            };

            // Normalize to unit sphere
            for (int i = 0; i < vertList.Count; i++)
                vertList[i] = vertList[i].normalized;

            var triIdx = new List<int> {
                0,11,5,  0,5,1,   0,1,7,   0,7,10,  0,10,11,
                1,5,9,   5,11,4,  11,10,2,  10,7,6,  7,1,8,
                3,9,4,   3,4,2,   3,2,6,   3,6,8,   3,8,9,
                4,9,5,   2,4,11,  6,2,10,  8,6,7,   9,8,1,
            };

            // Subdivide
            for (int s = 0; s < subdivisions; s++)
            {
                var midCache = new Dictionary<long, int>();
                var newTris = new List<int>();

                for (int i = 0; i < triIdx.Count; i += 3)
                {
                    int a = triIdx[i], b = triIdx[i + 1], c = triIdx[i + 2];
                    int ab = GetMidpoint(vertList, midCache, a, b);
                    int bc = GetMidpoint(vertList, midCache, b, c);
                    int ca = GetMidpoint(vertList, midCache, c, a);

                    newTris.AddRange(new[] {
                        a, ab, ca,
                        b, bc, ab,
                        c, ca, bc,
                        ab, bc, ca
                    });
                }
                triIdx = newTris;
            }

            // Slight random displacement for rock-like appearance
            var rng = new System.Random(42);
            for (int i = 0; i < vertList.Count; i++)
            {
                float disp = 1f + (float)(rng.NextDouble() * 0.3 - 0.15);
                vertList[i] *= disp;
            }

            mesh.vertices = vertList.ToArray();
            mesh.triangles = triIdx.ToArray();
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();

            // Generate UVs (spherical projection)
            var uvs = new Vector2[vertList.Count];
            for (int i = 0; i < vertList.Count; i++)
            {
                var n = vertList[i].normalized;
                uvs[i] = new Vector2(
                    0.5f + Mathf.Atan2(n.z, n.x) / (2f * Mathf.PI),
                    0.5f + Mathf.Asin(Mathf.Clamp(n.y, -1f, 1f)) / Mathf.PI
                );
            }
            mesh.uv = uvs;

            return mesh;
        }

        static int GetMidpoint(List<Vector3> verts, Dictionary<long, int> cache, int a, int b)
        {
            long key = ((long)Mathf.Min(a, b) << 32) + Mathf.Max(a, b);
            if (cache.TryGetValue(key, out int idx)) return idx;

            var mid = ((verts[a] + verts[b]) * 0.5f).normalized;
            idx = verts.Count;
            verts.Add(mid);
            cache[key] = idx;
            return idx;
        }
    }
}
