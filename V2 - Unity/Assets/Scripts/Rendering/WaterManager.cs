// ================================================================
//  WATER MANAGER — Ocean, Lakes, River mesh creation & animation
//  Port of V2-React WaterSystem.js
// ================================================================
using UnityEngine;
using System.Collections.Generic;

namespace GeologySim
{
    public class WaterManager : MonoBehaviour
    {
        Material _oceanMat;
        Material _riverMat;
        List<Renderer> _allWaterRenderers = new();
        float[] _heightmap;

        public void Initialize(float[] heightmap)
        {
            _heightmap = heightmap;
            CreateOcean();
            CreateLakes(heightmap);
            CreateRiver(heightmap);
        }

        public void UpdateWaterLevel(float level)
        {
            // Ocean position
            var ocean = transform.Find("Ocean");
            if (ocean != null) ocean.position = new Vector3(0, level, 0);
            // Re-create lakes at new level would require full rebuild
        }

        #region Ocean

        void CreateOcean()
        {
            float size = GeologyConfig.TERRAIN_SIZE;
            var mesh = CreatePlaneMesh(300, 300, size * 10f, size * 10f);
            mesh.name = "OceanMesh";

            var go = new GameObject("Ocean");
            go.transform.SetParent(transform);
            var mf = go.AddComponent<MeshFilter>();
            mf.mesh = mesh;
            var mr = go.AddComponent<MeshRenderer>();

            _oceanMat = new Material(Shader.Find("GeologySim/OceanWater") ?? Shader.Find("Universal Render Pipeline/Lit"));
            _oceanMat.SetColor("_SkyColor", new Color(0.55f, 0.72f, 0.88f));
            _oceanMat.SetColor("_DeepColor", new Color(0.04f, 0.18f, 0.32f));
            _oceanMat.SetColor("_ShallowColor", new Color(0.12f, 0.42f, 0.55f));
            _oceanMat.SetFloat("_Opacity", 0.90f);
            mr.sharedMaterial = _oceanMat;
            mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            mr.receiveShadows = true;

            go.transform.position = new Vector3(0, GeologyConfig.WATER_LEVEL, 0);
            _allWaterRenderers.Add(mr);
        }

        #endregion

        #region Lakes

        void CreateLakes(float[] heightmap)
        {
            foreach (var lake in GeologyConfig.LAKES)
            {
                // Sample rim & average surrounding heights to find a natural fill level
                float minRim = float.MaxValue;
                float avgRim = 0f;
                int rimSamples = 0;
                for (float a = 0; a < Mathf.PI * 2; a += Mathf.PI / 24f)
                {
                    float sx = lake.cx + Mathf.Cos(a) * lake.rx * 0.97f;
                    float sz = lake.cz + Mathf.Sin(a) * lake.rz * 0.97f;
                    float rh = TerrainGenerator.GetTerrainHeight(heightmap, sx, sz);
                    if (rh < minRim) minRim = rh;
                    avgRim += rh;
                    rimSamples++;
                }
                avgRim /= rimSamples;
                // Water surface fills most of the basin — sits near the average rim
                // This makes lakes look full and shallow rather than deep empty holes
                // Fill to near-rim level so lakes look full, not like holes
                float waterY = Mathf.Max(avgRim - 1f, Mathf.Lerp(minRim, avgRim, 0.95f) + 2f);
                int seg = 128; // higher tessellation for better wave detail

                var mesh = CreateEllipseMesh(seg, 1f, 1f);
                mesh.name = $"LakeMesh_{lake.name}";

                var go = new GameObject($"Lake_{lake.name}");
                go.transform.SetParent(transform);
                var mf = go.AddComponent<MeshFilter>();
                mf.mesh = mesh;
                var mr = go.AddComponent<MeshRenderer>();

                var mat = new Material(Shader.Find("GeologySim/LakeWater") ?? Shader.Find("Universal Render Pipeline/Lit"));
                mat.SetColor("_Color", new Color(0.10f, 0.32f, 0.38f));
                mat.SetColor("_DeepColor", new Color(0.04f, 0.12f, 0.22f));
                mat.SetColor("_SkyColor", new Color(0.55f, 0.72f, 0.88f));
                mat.SetFloat("_Opacity", 0.82f);
                mat.SetFloat("_RimHeight", 3.5f);
                mr.sharedMaterial = mat;
                mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                mr.receiveShadows = true;

                go.transform.position = new Vector3(lake.cx, waterY, lake.cz);
                // Scale lake mesh slightly larger so water extends to shoreline edges
                go.transform.localScale = new Vector3(lake.rx * 1.12f, 1f, lake.rz * 1.12f);
                _allWaterRenderers.Add(mr);
            }
        }

        #endregion

        #region River

        void CreateRiver(float[] heightmap)
        {
            foreach (var river in GeologyConfig.RIVERS)
            {
                var pts = SubdivideRiverPath(river.points, 8);
                var verts = new List<Vector3>();
                var uvs = new List<Vector2>();
                var indices = new List<int>();
                float accLen = 0;

                for (int i = 0; i < pts.Length; i++)
                {
                    if (i > 0)
                        accLen += Vector2.Distance(pts[i], pts[i - 1]);

                    // Tangent
                    Vector2 tangent;
                    if (i == 0) tangent = pts[1] - pts[0];
                    else if (i == pts.Length - 1) tangent = pts[i] - pts[i - 1];
                    else tangent = pts[i + 1] - pts[i - 1];
                    tangent.Normalize();

                    Vector2 normal = new Vector2(-tangent.y, tangent.x);
                    float hw = river.width * (0.8f + 0.2f * Mathf.Sin(accLen * 0.005f));
                    float cx = pts[i].x, cz = pts[i].y;

                    float hC = TerrainGenerator.GetTerrainHeight(heightmap, cx, cz);
                    float h = hC + 6f; // water surface above carved channel floor — matches React

                    verts.Add(new Vector3(cx + normal.x * hw, h, cz + normal.y * hw));
                    verts.Add(new Vector3(cx - normal.x * hw, h, cz - normal.y * hw));

                    float u = accLen * 0.005f;
                    uvs.Add(new Vector2(0, u));
                    uvs.Add(new Vector2(1, u));

                    if (i < pts.Length - 1)
                    {
                        int vi = i * 2;
                        indices.Add(vi); indices.Add(vi + 1); indices.Add(vi + 2);
                        indices.Add(vi + 1); indices.Add(vi + 3); indices.Add(vi + 2);
                    }
                }

                var mesh = new Mesh();
                mesh.indexFormat = UnityEngine.Rendering.IndexFormat.UInt32;
                mesh.vertices = verts.ToArray();
                mesh.uv = uvs.ToArray();
                mesh.triangles = indices.ToArray();
                mesh.RecalculateNormals();
                mesh.RecalculateBounds();
                mesh.name = $"RiverMesh_{river.name}";

                var go = new GameObject($"River_{river.name}");
                go.transform.SetParent(transform);
                var mf = go.AddComponent<MeshFilter>();
                mf.mesh = mesh;
                var mr = go.AddComponent<MeshRenderer>();

                _riverMat = new Material(Shader.Find("GeologySim/RiverWater") ?? Shader.Find("Universal Render Pipeline/Lit"));
                _riverMat.SetColor("_SkyColor", new Color(0.55f, 0.72f, 0.88f));
                _riverMat.SetColor("_DeepColor", new Color(0.03f, 0.14f, 0.25f));
                _riverMat.SetColor("_ShallowColor", new Color(0.06f, 0.25f, 0.32f));
                _riverMat.SetFloat("_Opacity", 0.88f);
                _riverMat.SetFloat("_FlowSpeed", 2.0f);
                mr.sharedMaterial = _riverMat;
                mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                mr.receiveShadows = true;
                _allWaterRenderers.Add(mr);
            }
        }

        Vector2[] SubdivideRiverPath(Vector2[] pts, int subsPerSeg)
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

        float CatmullRom(float p0, float p1, float p2, float p3, float t)
        {
            float t2 = t * t, t3 = t2 * t;
            return 0.5f * ((2f * p1) + (-p0 + p2) * t
                + (2f * p0 - 5f * p1 + 4f * p2 - p3) * t2
                + (-p0 + 3f * p1 - 3f * p2 + p3) * t3);
        }

        #endregion

        #region Mesh Utilities

        static Mesh CreatePlaneMesh(int segX, int segZ, float width, float depth)
        {
            int vx = segX + 1, vz = segZ + 1;
            var verts = new Vector3[vx * vz];
            var uvs = new Vector2[vx * vz];
            var tris = new int[segX * segZ * 6];

            for (int iz = 0; iz < vz; iz++)
                for (int ix = 0; ix < vx; ix++)
                {
                    int i = iz * vx + ix;
                    verts[i] = new Vector3(
                        ((float)ix / segX - 0.5f) * width,
                        0,
                        ((float)iz / segZ - 0.5f) * depth);
                    uvs[i] = new Vector2((float)ix / segX, (float)iz / segZ);
                }

            int ti = 0;
            for (int iz = 0; iz < segZ; iz++)
                for (int ix = 0; ix < segX; ix++)
                {
                    int i00 = iz * vx + ix;
                    int i10 = i00 + 1;
                    int i01 = i00 + vx;
                    int i11 = i01 + 1;
                    tris[ti++] = i00; tris[ti++] = i01; tris[ti++] = i10;
                    tris[ti++] = i10; tris[ti++] = i01; tris[ti++] = i11;
                }

            var mesh = new Mesh();
            if (vx * vz > 65535)
                mesh.indexFormat = UnityEngine.Rendering.IndexFormat.UInt32;
            mesh.vertices = verts;
            mesh.uv = uvs;
            mesh.triangles = tris;
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            return mesh;
        }

        static Mesh CreateEllipseMesh(int segments, float rx, float rz)
        {
            int vc = segments + 1;
            var verts = new Vector3[vc + 1];
            var uvs = new Vector2[vc + 1];
            var tris = new int[segments * 3];

            verts[0] = Vector3.zero;
            uvs[0] = new Vector2(0.5f, 0.5f);
            for (int i = 0; i <= segments; i++)
            {
                float a = (float)i / segments * Mathf.PI * 2;
                verts[i + 1] = new Vector3(Mathf.Cos(a) * rx, 0, Mathf.Sin(a) * rz);
                uvs[i + 1] = new Vector2(
                    0.5f + Mathf.Cos(a) * 0.5f,
                    0.5f + Mathf.Sin(a) * 0.5f);
            }
            // Fix last vertex
            verts[vc] = verts[1];
            uvs[vc] = uvs[1];

            for (int i = 0; i < segments; i++)
            {
                tris[i * 3] = 0;
                tris[i * 3 + 1] = i + 1;
                tris[i * 3 + 2] = i + 2;
            }
            // Wrap last tri
            tris[(segments - 1) * 3 + 2] = 1;

            var mesh = new Mesh();
            mesh.vertices = verts;
            mesh.uv = uvs;
            mesh.triangles = tris;
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            return mesh;
        }

        #endregion

        #region Animation

        public void Animate(float time)
        {
            Shader.SetGlobalFloat("_GlobalTime", time);
        }

        #endregion
    }
}
