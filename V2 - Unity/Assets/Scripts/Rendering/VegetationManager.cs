// ================================================================
//  VEGETATION MANAGER — GPU-instanced trees, bushes, rocks, grass,
//  farm compound, mountain vegetation.
//  Port of V2-React VegetationSystem.js
//  OPTIMIZED: shared materials, DrawMeshInstanced batching
// ================================================================
using UnityEngine;
using System.Collections.Generic;

namespace GeologySim
{
    public class VegetationManager : MonoBehaviour
    {
        SimplexNoise2D _scatter;
        float[] _heightmap;
        System.Random _rng = new(42);

        // Windmill blade hub (animated)
        Transform _windmillHub;

        // Cached primitive meshes
        static Mesh _cubeMesh;
        static Mesh _sphereMesh;
        static Mesh _cylinderMesh;
        static Mesh _coneMesh;
        // High-quality procedural meshes
        static Mesh _grassCrossMesh;
        static Mesh _leafClusterMesh;
        static Mesh _pineClusterMesh;
        static Mesh _icosphereMesh;
        static Mesh _flowerQuadMesh;

        // Shared materials (reused across instances for batching)
        Material _pinetrunkMat, _oakTrunkMat, _birchTrunkMat;
        Material[] _pineCrownMats, _oakCrownMats, _birchCrownMats;
        Material[] _bushMats, _grassMats;
        Material _rockMat, _alpineShrubMat;
        Material _fenceMat, _hayMat;
        // Building materials (textured PBR)
        Material _wallStoneMat, _wallWoodMat, _roofMat;

        public void Initialize(float[] heightmap, SimplexNoise2D noise)
        {
            _heightmap = heightmap;
            _scatter = new SimplexNoise2D(777);

            // Generate runtime textures and meshes for high-quality vegetation
            VegetationTextures.GenerateAll();
            ProceduralMeshes.GenerateAll();

            CachePrimitives();
            InitSharedMaterials();

            AddPineTrees();
            AddOakTrees();
            AddBirchTrees();
            AddBushes();
            AddRocks();
            AddGrass();
            AddLakesideReeds();
            AddLilyPads();
            AddMushrooms();
            AddFallenLogs();
            AddGroundFlowers();
            AddFarmCompound();
            AddMountainVegetation();
            AddRiparianVegetation();
        }

        void Update()
        {
            // Rotate windmill blades
            if (_windmillHub != null)
                _windmillHub.Rotate(Vector3.forward, 25f * Time.deltaTime, Space.Self);
        }

        static void CachePrimitives()
        {
            if (_cubeMesh != null) return;
            _cubeMesh = GetPrimitiveMesh(PrimitiveType.Cube);
            _sphereMesh = GetPrimitiveMesh(PrimitiveType.Sphere);
            _cylinderMesh = GetPrimitiveMesh(PrimitiveType.Cylinder);
            _coneMesh = CreateConeMesh(16);

            // High-quality procedural meshes
            _grassCrossMesh  = ProceduralMeshes.GrassCross;
            _leafClusterMesh = ProceduralMeshes.LeafCluster;
            _pineClusterMesh = ProceduralMeshes.PineCluster;
            _icosphereMesh   = ProceduralMeshes.Icosphere;
            _flowerQuadMesh  = ProceduralMeshes.FlowerQuad;
        }

        static Mesh GetPrimitiveMesh(PrimitiveType type)
        {
            var go = GameObject.CreatePrimitive(type);
            var mesh = go.GetComponent<MeshFilter>().sharedMesh;
            // Use Object.DestroyImmediate in editor to avoid "Destroy may not be called" warnings
            if (Application.isPlaying)
                Destroy(go);
            else
                DestroyImmediate(go);
            return mesh;
        }

        static Mesh CreateConeMesh(int segments)
        {
            var verts = new List<Vector3>();
            var tris = new List<int>();
            verts.Add(new Vector3(0, 1, 0)); // tip
            for (int i = 0; i <= segments; i++)
            {
                float a = (float)i / segments * Mathf.PI * 2f;
                verts.Add(new Vector3(Mathf.Cos(a) * 0.5f, 0, Mathf.Sin(a) * 0.5f));
            }
            for (int i = 0; i < segments; i++)
                tris.AddRange(new[] { 0, i + 1, i + 2 });

            var mesh = new Mesh();
            mesh.vertices = verts.ToArray();
            mesh.triangles = tris.ToArray();
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            mesh.name = "Cone";
            return mesh;
        }

        void InitSharedMaterials()
        {
            // ── Tree trunks (BuildingLit for triplanar bark texture) ──
            _pinetrunkMat = MakeTextured(new Color(0.35f, 0.22f, 0.12f), VegetationTextures.BarkOak, 0.12f, 0.9f);
            _oakTrunkMat  = MakeTextured(new Color(0.32f, 0.20f, 0.10f), VegetationTextures.BarkOak, 0.10f, 0.88f);
            _birchTrunkMat = MakeTextured(new Color(0.91f, 0.86f, 0.78f), VegetationTextures.BarkOak, 0.15f, 0.6f);

            // ── Crown palettes (VegetationLit for alpha cutout + wind + SSS) ──
            _pineCrownMats = new Material[4];
            for (int i = 0; i < 4; i++)
            {
                float v = 0.7f + i * 0.15f;
                _pineCrownMats[i] = MakeVeg(new Color(0.15f * v, 0.35f * v, 0.12f * v),
                    VegetationTextures.PineNeedle, 0.12f, 0.06f);
            }

            _oakCrownMats = new Material[4];
            for (int i = 0; i < 4; i++)
            {
                float v = 0.7f + i * 0.15f;
                _oakCrownMats[i] = MakeVeg(new Color(0.18f * v, 0.42f * v, 0.1f * v),
                    VegetationTextures.LeafCluster, 0.15f, 0.10f);
            }

            _birchCrownMats = new Material[4];
            for (int i = 0; i < 4; i++)
            {
                float v = 0.8f + i * 0.1f;
                _birchCrownMats[i] = MakeVeg(new Color(0.35f * v, 0.67f * v, 0.2f * v),
                    VegetationTextures.LeafCluster, 0.15f, 0.12f);
            }

            // ── Bushes (VegetationLit — leaf clusters) ──
            _bushMats = new Material[3];
            for (int i = 0; i < 3; i++)
            {
                float v = 0.7f + i * 0.2f;
                _bushMats[i] = MakeVeg(new Color(0.18f * v, 0.43f * v, 0.12f * v),
                    VegetationTextures.LeafCluster, 0.12f, 0.08f);
            }

            // ── Grass (VegetationLit — grass blade billboards with strong wind) ──
            _grassMats = new Material[] {
                MakeVeg(new Color(0.65f, 0.95f, 0.45f), VegetationTextures.GrassBlade, 0.18f, 0.22f),
                MakeVeg(new Color(0.55f, 0.85f, 0.40f), VegetationTextures.GrassBlade, 0.18f, 0.22f),
            };

            // ── Rocks (BuildingLit for triplanar rock texture) ──
            _rockMat = MakeTextured(new Color(0.48f, 0.46f, 0.42f), VegetationTextures.RockDetail, 0.08f, 0.92f);
            _alpineShrubMat = MakeVeg(new Color(0.20f, 0.34f, 0.14f),
                VegetationTextures.LeafCluster, 0.20f, 0.05f);

            // ── Farm materials (BuildingLit for triplanar stone/wood) ──
            _fenceMat = MakeTextured(new Color(0.42f, 0.31f, 0.19f), VegetationTextures.BarkOak, 0.14f, 0.9f);
            _hayMat = MakeLit(new Color(0.78f, 0.66f, 0.28f), 0.92f);
            _wallStoneMat = MakeTextured(new Color(0.85f, 0.80f, 0.72f), VegetationTextures.StoneWall, 0.08f, 0.75f);
            _wallWoodMat  = MakeTextured(new Color(0.55f, 0.40f, 0.25f), VegetationTextures.BarkOak, 0.06f, 0.82f);
            _roofMat = MakeTextured(new Color(0.50f, 0.36f, 0.26f), VegetationTextures.RockDetail, 0.05f, 0.8f);
        }

        Material MakeLit(Color color, float roughness)
        {
            var mat = new Material(Shader.Find("Universal Render Pipeline/Lit"));
            mat.color = color;
            mat.SetFloat("_Smoothness", 1f - roughness);
            mat.enableInstancing = true;
            return mat;
        }

        /// <summary>VegetationLit material: alpha cutout + wind + subsurface scattering</summary>
        Material MakeVeg(Color tint, Texture2D tex, float cutoff = 0.35f, float windStr = 0.12f)
        {
            var shader = Shader.Find("GeologySim/VegetationLit");
            if (shader == null) { Debug.LogWarning("[VegMgr] VegetationLit shader not found"); return MakeLit(tint, 0.85f); }
            var mat = new Material(shader);
            mat.SetTexture("_MainTex", tex);
            mat.SetColor("_Color", tint);
            mat.SetFloat("_Cutoff", cutoff);
            mat.SetFloat("_WindStr", windStr);
            mat.SetColor("_SSSColor", new Color(0.35f, 0.65f, 0.15f, 1f));
            mat.SetFloat("_SSSPow", 3f);
            mat.SetFloat("_Roughness", 0.82f);
            mat.enableInstancing = true;
            return mat;
        }

        /// <summary>BuildingLit material: triplanar textured + normal mapped + weathering</summary>
        Material MakeTextured(Color tint, Texture2D wallTex, float texScale = 0.1f, float roughness = 0.72f)
        {
            var shader = Shader.Find("GeologySim/BuildingLit");
            if (shader == null) { Debug.LogWarning("[VegMgr] BuildingLit shader not found"); return MakeLit(tint, roughness); }
            var mat = new Material(shader);
            mat.SetTexture("_WallTex", wallTex);
            mat.SetTexture("_NormalTex", VegetationTextures.StoneNormal);
            mat.SetColor("_Color", tint);
            mat.SetFloat("_Roughness", roughness);
            mat.SetFloat("_TexScale", texScale);
            mat.SetFloat("_NormStr", 0.8f);
            mat.SetFloat("_WeatherAmt", 0.25f);
            mat.enableInstancing = true;
            return mat;
        }

        float GetH(float wx, float wz) => TerrainGenerator.GetTerrainHeight(_heightmap, wx, wz);

        float GetSlope(float wx, float wz)
        {
            float e = 3f;
            float dx = GetH(wx + e, wz) - GetH(wx - e, wz);
            float dz = GetH(wx, wz + e) - GetH(wx, wz - e);
            return Mathf.Sqrt(dx * dx + dz * dz) / (4f * e);
        }

        bool IsInLake(float wx, float wz, float pad)
        {
            foreach (var lake in GeologyConfig.LAKES)
            {
                float dx = (wx - lake.cx) / (lake.rx + pad);
                float dz = (wz - lake.cz) / (lake.rz + pad);
                if (dx * dx + dz * dz < 1) return true;
            }
            return false;
        }

        bool IsInRiver(float wx, float wz, float pad)
        {
            foreach (var river in GeologyConfig.RIVERS)
            {
                for (int i = 0; i < river.points.Length; i++)
                {
                    float dx = wx - river.points[i].x;
                    float dz = wz - river.points[i].y;
                    if (dx * dx + dz * dz < (river.width + pad) * (river.width + pad))
                        return true;
                }
            }
            return false;
        }

        bool IsInFarm(float wx, float wz, float pad)
        {
            var farm = GeologyConfig.FARM;
            float dx = wx - farm.cx, dz = wz - farm.cz;
            return dx * dx + dz * dz < (farm.radius + pad) * (farm.radius + pad);
        }

        bool VegetationCheck(GeologicalLayer layer, float slope)
        {
            return layer.vegetationDensity > 0 && slope < 0.6f;
        }

        float ScatterVal(float x, float z) => _scatter.Evaluate(x, z);
        float RandF() => (float)_rng.NextDouble();
        float RandRange(float min, float max) => min + RandF() * (max - min);

        #region Pine Trees

        void AddPineTrees()
        {
            int count = 120;
            int placed = 0;
            for (int attempt = 0; attempt < count * 8 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.9f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.9f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 3 || IsInLake(wx, wz, 20) || IsInRiver(wx, wz, 15) || IsInFarm(wx, wz, 15)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.55f) continue;
                var layer = GeologyConfig.GetLayerAtElevation(h);
                if (!VegetationCheck(layer, slope)) continue;
                float density = ScatterVal(wx * 0.006f, wz * 0.006f);
                if (density < -0.15f) continue;

                float scale = RandRange(0.85f, 1.7f);
                float yRot = RandF() * 360f;

                // Trunk
                CreateObj("PineTrunk", _cylinderMesh, _pinetrunkMat,
                    new Vector3(wx, h + scale * 5f, wz),
                    Quaternion.Euler(0, yRot, 0),
                    new Vector3(scale * 0.8f, scale * 5.5f, scale * 0.8f));

                // Crown tiers
                for (int tier = 0; tier < 3; tier++)
                {
                    float ty = h + scale * (7f + tier * 4f);
                    float tr = scale * (4.8f - tier * 0.9f);
                    float th = scale * 5.2f;
                    CreateObj($"PineCrown_{tier}", _pineClusterMesh, _pineCrownMats[(_rng.Next() & 0x7FFFFFFF) % 4],
                        new Vector3(wx, ty, wz),
                        Quaternion.Euler(RandRange(-10, 10), yRot + tier * 30, RandRange(-5, 5)),
                        new Vector3(tr * 2, th, tr * 2));
                }
                placed++;
            }
        }

        #endregion

        #region Oak Trees

        void AddOakTrees()
        {
            int count = 90;
            int placed = 0;
            for (int attempt = 0; attempt < count * 8 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 3 || IsInLake(wx, wz, 25) || IsInRiver(wx, wz, 15) || IsInFarm(wx, wz, 15)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.4f) continue;
                var layer = GeologyConfig.GetLayerAtElevation(h);
                if (!VegetationCheck(layer, slope)) continue;
                float density = ScatterVal(wx * 0.008f, wz * 0.008f);
                if (density < 0f) continue;
                if (h > 170 && RandF() > 0.2f) continue;

                float scale = RandRange(0.75f, 1.6f);
                float yRot = RandF() * 360f;

                // Trunk
                CreateObj("OakTrunk", _cylinderMesh, _oakTrunkMat,
                    new Vector3(wx, h + scale * 4.5f, wz),
                    Quaternion.Euler(0, yRot, 0),
                    new Vector3(scale * 1.1f, scale * 4.5f, scale * 1.1f));

                // Crown — 4 merged lumpy spheres (matching React's multi-lobe design)
                float crownBase = h + scale * 9f;
                for (int lobe = 0; lobe < 4; lobe++)
                {
                    float la = lobe * 90f + RandRange(-20, 20);
                    float lr = scale * 3.0f;
                    float lobX = wx + Mathf.Cos(la * Mathf.Deg2Rad) * lr;
                    float lobZ = wz + Mathf.Sin(la * Mathf.Deg2Rad) * lr;
                    float lobScale = scale * RandRange(5f, 7f);
                    float lobH = crownBase + RandRange(0, scale * 3f);
                    CreateObj("OakLobe", _leafClusterMesh, _oakCrownMats[(_rng.Next() & 0x7FFFFFFF) % 4],
                        new Vector3(lobX, lobH, lobZ),
                        Quaternion.Euler(RandRange(-15, 15), yRot + lobe * 40, RandRange(-10, 10)),
                        new Vector3(lobScale, lobScale * 0.75f, lobScale * 0.9f));
                }

                placed++;
            }
        }

        #endregion

        #region Birch Trees

        void AddBirchTrees()
        {
            int count = 50;
            int placed = 0;
            for (int attempt = 0; attempt < count * 8 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 5 || IsInLake(wx, wz, 18) || IsInRiver(wx, wz, 15) || IsInFarm(wx, wz, 10)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.35f) continue;
                var layer = GeologyConfig.GetLayerAtElevation(h);
                if (!VegetationCheck(layer, slope)) continue;

                bool nearLake = false;
                foreach (var lake in GeologyConfig.LAKES)
                {
                    float dx2 = (wx - lake.cx) / (lake.rx * 2);
                    float dz2 = (wz - lake.cz) / (lake.rz * 2);
                    if (dx2 * dx2 + dz2 * dz2 < 1) { nearLake = true; break; }
                }
                if (!nearLake && RandF() > 0.3f) continue;

                float scale = RandRange(0.7f, 1.1f);
                float yRot = RandF() * 360f;

                CreateObj("BirchTrunk", _cylinderMesh, _birchTrunkMat,
                    new Vector3(wx, h + scale * 5f, wz),
                    Quaternion.Euler(0, yRot, 0),
                    new Vector3(scale * 0.45f, scale * 5f, scale * 0.45f));

                CreateObj("BirchCrown", _leafClusterMesh, _birchCrownMats[(_rng.Next() & 0x7FFFFFFF) % 4],
                    new Vector3(wx, h + scale * 12f, wz),
                    Quaternion.Euler(RandRange(-10, 10), yRot, RandRange(-5, 5)),
                    new Vector3(scale * 6f, scale * 9f, scale * 6f));

                placed++;
            }
        }

        #endregion

        #region Bushes

        void AddBushes()
        {
            int count = 600;
            int placed = 0;
            for (int attempt = 0; attempt < count * 6 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 2 || IsInLake(wx, wz, 8) || IsInRiver(wx, wz, 10) || IsInFarm(wx, wz, 5)) continue;
                float slope = GetSlope(wx, wz);
                var layer = GeologyConfig.GetLayerAtElevation(h);
                if (!VegetationCheck(layer, slope)) continue;
                if (ScatterVal(wx * 0.015f, wz * 0.015f) < -0.3f) continue;

                float scale = RandRange(2.2f, 6.5f);
                CreateObj("Bush", _leafClusterMesh, _bushMats[(_rng.Next() & 0x7FFFFFFF) % 3],
                    new Vector3(wx, h - 0.3f + scale * 0.33f, wz),
                    Quaternion.Euler(RandRange(-10, 10), RandF() * 360f, RandRange(-10, 10)),
                    new Vector3(scale, scale * 0.65f, scale));
                placed++;
            }
        }

        #endregion

        #region Rocks

        void AddRocks()
        {
            int count = 500;
            int placed = 0;
            for (int attempt = 0; attempt < count * 6 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.9f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.9f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 1 || IsInLake(wx, wz, 5) || IsInRiver(wx, wz, 10) || IsInFarm(wx, wz, 0)) continue;
                float slope = GetSlope(wx, wz);
                if (slope < 0.15f && RandF() > 0.12f) continue;

                float scale = RandRange(1.5f, 6f);
                // Use terrain layer color for rocks
                var layer = GeologyConfig.GetLayerAtElevation(h);
                float gray = RandRange(0.35f, 0.65f);
                var mat = MakeLit(new Color(
                    layer.color.r * 0.5f + gray * 0.5f,
                    layer.color.g * 0.5f + gray * 0.48f,
                    layer.color.b * 0.5f + gray * 0.45f), 0.92f);

                CreateObj("Rock", _icosphereMesh, mat,
                    new Vector3(wx, h - scale * 0.25f, wz),
                    Quaternion.Euler(RandF() * 360, RandF() * 360, RandF() * 360),
                    new Vector3(scale, scale * RandRange(0.4f, 1f), scale * RandRange(0.7f, 1.3f)));
                placed++;
            }
        }

        #endregion

        #region Grass

        void AddGrass()
        {
            // Flat 2D grass patches — green quads lying on the terrain surface
            var patchMats = new Material[] {
                MakeLit(new Color(0.38f, 0.58f, 0.22f), 0.95f),
                MakeLit(new Color(0.32f, 0.52f, 0.18f), 0.95f),
                MakeLit(new Color(0.42f, 0.62f, 0.26f), 0.95f),
                MakeLit(new Color(0.28f, 0.48f, 0.16f), 0.95f),
            };

            int count = 14000;
            int placed = 0;

            for (int attempt = 0; attempt < count * 4 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.9f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.9f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 1 || IsInLake(wx, wz, 3) || IsInRiver(wx, wz, 5)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.5f) continue;

                // Flat patch: wide in XZ, paper-thin in Y
                float scaleXZ = RandRange(3f, 12f);
                float scaleZ = scaleXZ * RandRange(0.5f, 1.4f);
                CreateObj("GrassPatch", _cubeMesh, patchMats[placed & 3],
                    new Vector3(wx, h + 0.04f, wz),
                    Quaternion.Euler(0, RandF() * 360f, 0),
                    new Vector3(scaleXZ, 0.06f, scaleZ));
                placed++;
            }
        }

        #endregion

        #region Lakeside Reeds

        void AddLakesideReeds()
        {
            var reedMat = MakeLit(new Color(0.30f, 0.45f, 0.18f), 0.88f);
            var reedTipMat = MakeLit(new Color(0.50f, 0.35f, 0.15f), 0.85f);
            int placed = 0;

            foreach (var lake in GeologyConfig.LAKES)
            {
                // Place reeds around the perimeter of each lake
                int reedsPerLake = 80;
                for (int i = 0; i < reedsPerLake; i++)
                {
                    float angle = RandF() * Mathf.PI * 2f;
                    float radialOffset = RandRange(0.85f, 1.15f); // near the lake edge
                    float wx = lake.cx + Mathf.Cos(angle) * lake.rx * radialOffset;
                    float wz = lake.cz + Mathf.Sin(angle) * lake.rz * radialOffset;
                    float h = GetH(wx, wz);
                    if (h > GeologyConfig.WATER_LEVEL + 8) continue;

                    float reedH = RandRange(2.0f, 4.5f);
                    float yRot = RandF() * 360f;

                    // Reed stalk
                    CreateObj("Reed", _cubeMesh, reedMat,
                        new Vector3(wx, h + reedH * 0.5f, wz),
                        Quaternion.Euler(RandRange(-3, 3), yRot, RandRange(-3, 3)),
                        new Vector3(0.12f, reedH, 0.12f));

                    // Cattail tip (every other reed)
                    if (i % 2 == 0)
                    {
                        CreateObj("Cattail", _cubeMesh, reedTipMat,
                            new Vector3(wx, h + reedH + 0.4f, wz),
                            Quaternion.Euler(0, yRot, 0),
                            new Vector3(0.25f, 0.8f, 0.25f));
                    }
                    placed++;
                }
            }
        }

        #endregion

        #region Lily Pads

        void AddLilyPads()
        {
            var padMat = MakeLit(new Color(0.18f, 0.42f, 0.15f), 0.75f);
            var flowerMat = MakeLit(new Color(0.92f, 0.85f, 0.90f), 0.6f);
            var pinkFlowerMat = MakeLit(new Color(0.88f, 0.55f, 0.65f), 0.6f);

            foreach (var lake in GeologyConfig.LAKES)
            {
                int pads = 35;
                for (int i = 0; i < pads; i++)
                {
                    float angle = RandF() * Mathf.PI * 2f;
                    float rFrac = RandRange(0.15f, 0.7f);
                    float wx = lake.cx + Mathf.Cos(angle) * lake.rx * rFrac;
                    float wz = lake.cz + Mathf.Sin(angle) * lake.rz * rFrac;
                    float waterY = GeologyConfig.WATER_LEVEL + lake.depth * 0.78f;

                    float scale = RandRange(1.5f, 4.5f);
                    CreateObj("LilyPad", _cylinderMesh, padMat,
                        new Vector3(wx, waterY + 0.05f, wz),
                        Quaternion.Euler(0, RandF() * 360f, 0),
                        new Vector3(scale, 0.04f, scale));

                    // Flower on ~30% of pads
                    if (RandF() < 0.3f)
                    {
                        var fMat = RandF() > 0.5f ? flowerMat : pinkFlowerMat;
                        CreateObj("LilyFlower", _sphereMesh, fMat,
                            new Vector3(wx + RandRange(-0.3f, 0.3f), waterY + 0.4f, wz + RandRange(-0.3f, 0.3f)),
                            Quaternion.identity,
                            new Vector3(0.6f, 0.4f, 0.6f));
                    }
                }
            }
        }

        #endregion

        #region Mushrooms

        void AddMushrooms()
        {
            var stemMat = MakeLit(new Color(0.85f, 0.82f, 0.72f), 0.8f);
            var capColors = new[] {
                new Color(0.72f, 0.22f, 0.18f),  // red
                new Color(0.68f, 0.52f, 0.18f),  // brown
                new Color(0.85f, 0.78f, 0.55f),  // tan
                new Color(0.60f, 0.35f, 0.20f),  // dark brown
            };

            int count = 300;
            int placed = 0;
            for (int attempt = 0; attempt < count * 6 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 2 || IsInLake(wx, wz, 5) || IsInRiver(wx, wz, 8) || IsInFarm(wx, wz, 10)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.4f) continue;
                // More likely near trees (mid-elevation)
                if (h > 160 || h < 45) continue;
                if (ScatterVal(wx * 0.02f, wz * 0.02f) < 0.1f) continue;

                float scale = RandRange(0.08f, 0.25f);
                var capMat = MakeLit(capColors[_rng.Next(capColors.Length)], 0.7f);

                // Stem
                CreateObj("MushroomStem", _cylinderMesh, stemMat,
                    new Vector3(wx, h + scale * 0.4f, wz),
                    Quaternion.identity,
                    new Vector3(scale * 0.2f, scale * 0.4f, scale * 0.2f));

                // Cap
                CreateObj("MushroomCap", _sphereMesh, capMat,
                    new Vector3(wx, h + scale * 0.85f, wz),
                    Quaternion.identity,
                    new Vector3(scale * 0.8f, scale * 0.35f, scale * 0.8f));

                placed++;
            }
        }

        #endregion

        #region Fallen Logs

        void AddFallenLogs()
        {
            var logMats = new[] {
                MakeLit(new Color(0.38f, 0.26f, 0.15f), 0.88f),
                MakeLit(new Color(0.32f, 0.22f, 0.12f), 0.90f),
                MakeLit(new Color(0.42f, 0.30f, 0.18f), 0.85f),
            };

            int count = 80;
            int placed = 0;
            for (int attempt = 0; attempt < count * 8 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 3 || IsInLake(wx, wz, 15) || IsInRiver(wx, wz, 12) || IsInFarm(wx, wz, 10)) continue;
                if (h > 180) continue;

                float len = RandRange(6f, 16f);
                float rad = RandRange(0.4f, 1.2f);
                float yRot = RandF() * 360f;

                CreateObj("FallenLog", _cylinderMesh, logMats[_rng.Next(logMats.Length)],
                    new Vector3(wx, h + rad * 0.3f, wz),
                    Quaternion.Euler(0, yRot, 90),
                    new Vector3(rad, len * 0.5f, rad));

                // Moss patch on log
                if (RandF() < 0.5f)
                {
                    var mossMat = MakeLit(new Color(0.22f, 0.40f, 0.15f), 0.85f);
                    CreateObj("LogMoss", _sphereMesh, mossMat,
                        new Vector3(wx, h + rad * 0.7f, wz),
                        Quaternion.Euler(0, yRot, 0),
                        new Vector3(rad * 1.8f, rad * 0.4f, len * 0.3f));
                }

                placed++;
            }
        }

        #endregion

        #region Ground Flowers

        void AddGroundFlowers()
        {
            var flowerColors = new[] {
                new Color(0.95f, 0.90f, 0.20f),  // yellow dandelion
                new Color(0.55f, 0.25f, 0.70f),  // purple
                new Color(0.90f, 0.40f, 0.50f),  // pink
                new Color(0.95f, 0.95f, 0.90f),  // white daisy
                new Color(0.20f, 0.45f, 0.80f),  // blue
                new Color(0.95f, 0.60f, 0.15f),  // orange
            };

            int count = 1200;
            int placed = 0;
            for (int attempt = 0; attempt < count * 4 && placed < count; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.86f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.86f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL + 2 || IsInLake(wx, wz, 6) || IsInRiver(wx, wz, 6)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.35f) continue;
                if (h > 165) continue; // no flowers at high altitude

                float scale = RandRange(0.25f, 0.7f);
                var fColor = flowerColors[_rng.Next(flowerColors.Length)];
                CreateObj("Flower", _flowerQuadMesh, MakeVeg(fColor, VegetationTextures.FlowerPetal, 0.25f, 0.08f),
                    new Vector3(wx, h, wz),
                    Quaternion.Euler(0, RandF() * 360f, 0),
                    new Vector3(scale, scale * 0.7f, scale));
                placed++;
            }
        }

        #endregion

        #region Farm Compound

        void AddFarmCompound()
        {
            float fcx = GeologyConfig.FARM.cx;
            float fcz = GeologyConfig.FARM.cz;
            float angle = Mathf.PI * 0.15f;
            float cosA = Mathf.Cos(angle), sinA = Mathf.Sin(angle);

            Vector2 Local(float lx, float lz)
            {
                return new Vector2(fcx + lx * cosA - lz * sinA, fcz + lx * sinA + lz * cosA);
            }

            var buildings = new[] {
                new { lx=0f,   lz=0f,   w=14f, d=11f, h=7.5f, wallCol=new Color32(0xd4,0xc4,0xa8,0xff), roofCol=new Color32(0x7a,0x3b,0x2e,0xff), chimney=true },
                new { lx=-28f, lz=18f,  w=9f,  d=7f,  h=5.5f, wallCol=new Color32(0xe0,0xd5,0xc0,0xff), roofCol=new Color32(0x5a,0x46,0x3a,0xff), chimney=true },
                new { lx=-28f, lz=-8f,  w=8f,  d=6.5f,h=4.8f, wallCol=new Color32(0xc8,0xbf,0xa8,0xff), roofCol=new Color32(0x6a,0x4e,0x3e,0xff), chimney=false },
                new { lx=38f,  lz=0f,   w=24f, d=15f, h=10f,  wallCol=new Color32(0x8b,0x45,0x13,0xff), roofCol=new Color32(0x4a,0x30,0x20,0xff), chimney=false },
                new { lx=18f,  lz=32f,  w=10f, d=7f,  h=4.2f, wallCol=new Color32(0xa0,0x90,0x6a,0xff), roofCol=new Color32(0x5c,0x50,0x40,0xff), chimney=false },
                new { lx=-14f, lz=-32f, w=9f,  d=6f,  h=3.8f, wallCol=new Color32(0x9e,0x8d,0x6e,0xff), roofCol=new Color32(0x5a,0x50,0x40,0xff), chimney=false },
            };

            foreach (var b in buildings)
            {
                var pos = Local(b.lx, b.lz);
                float gh = GetH(pos.x, pos.y);

                // Foundation
                var foundMat = MakeTextured(new Color(0.55f, 0.52f, 0.48f), VegetationTextures.StoneWall, 0.06f, 0.9f);
                CreateObj("Foundation", _cubeMesh, foundMat,
                    new Vector3(pos.x, gh + 0.3f, pos.y),
                    Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                    new Vector3(b.w + 1f, 0.6f, b.d + 1f));

                // Walls
                var wallMat = b.lx > 30f ? _wallWoodMat :  // barn = wood
                    MakeTextured((Color)b.wallCol, VegetationTextures.StoneWall, 0.07f, 0.82f);
                CreateObj("Wall", _cubeMesh, wallMat,
                    new Vector3(pos.x, gh + b.h / 2f + 0.6f, pos.y),
                    Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                    new Vector3(b.w, b.h, b.d));

                // Roof — gabled roof with two slopes meeting at the ridge
                var roofMat = MakeTextured((Color)b.roofCol, VegetationTextures.RockDetail, 0.04f, 0.75f);
                float roofPeak = b.d * 0.4f;       // height of ridge above wall top
                float wallTop = gh + b.h + 0.6f;
                float halfD = b.d * 0.5f + 0.3f;   // half-depth + small overhang
                float halfW = b.w * 0.5f + 0.5f;   // half-width + overhang
                float slopeLen = Mathf.Sqrt(roofPeak * roofPeak + halfD * halfD);
                float tiltDeg = Mathf.Atan2(roofPeak, halfD) * Mathf.Rad2Deg;
                float angleDeg = angle * Mathf.Rad2Deg;
                var baseRot = Quaternion.Euler(0, angleDeg, 0);

                // Ridge beam at peak (thin so slopes overlap it)
                CreateObj("RoofRidge", _cubeMesh, roofMat,
                    new Vector3(pos.x, wallTop + roofPeak - 0.1f, pos.y),
                    baseRot,
                    new Vector3(halfW * 2f, 0.4f, 0.4f));
                // Left slope — center at midpoint of ridge-to-eave line
                float midY = wallTop + roofPeak * 0.5f;
                float midOff = halfD * 0.5f;
                CreateObj("RoofL", _cubeMesh, roofMat,
                    new Vector3(
                        pos.x - sinA * midOff,
                        midY,
                        pos.y + cosA * midOff),
                    baseRot * Quaternion.Euler(tiltDeg, 0, 0),
                    new Vector3(halfW * 2f, 0.45f, slopeLen + 0.3f));
                // Right slope — mirror of left
                CreateObj("RoofR", _cubeMesh, roofMat,
                    new Vector3(
                        pos.x + sinA * midOff,
                        midY,
                        pos.y - cosA * midOff),
                    baseRot * Quaternion.Euler(-tiltDeg, 0, 0),
                    new Vector3(halfW * 2f, 0.45f, slopeLen + 0.3f));

                // Door (front face dark rectangle)
                var doorMat = MakeLit(new Color(0.25f, 0.18f, 0.12f), 0.85f);
                float doorX = pos.x + cosA * b.w * 0.15f;
                float doorZ = pos.y + sinA * b.w * 0.15f;
                CreateObj("Door", _cubeMesh, doorMat,
                    new Vector3(doorX, gh + 1.8f, doorZ),
                    Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                    new Vector3(1.8f, 3.2f, b.d + 0.15f));

                // Windows (4 per building — 2 on each side)
                var windowMat = MakeLit(new Color(0.5f, 0.65f, 0.8f), 0.2f);
                var frameMat = MakeLit(new Color(0.3f, 0.22f, 0.15f), 0.85f);
                for (int side = -1; side <= 1; side += 2) // two opposite sides
                {
                    for (int wi = -1; wi <= 1; wi += 2) // two windows per side
                    {
                        float wOffAlong = b.w * 0.28f * wi;
                        float wOffPerp = b.d * 0.51f * side;
                        float winX = pos.x + cosA * wOffAlong - sinA * wOffPerp;
                        float winZ = pos.y + sinA * wOffAlong + cosA * wOffPerp;
                        // Window frame
                        CreateObj("WinFrame", _cubeMesh, frameMat,
                            new Vector3(winX, gh + b.h * 0.55f, winZ),
                            Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                            new Vector3(1.7f, 1.5f, 0.18f));
                        // Glass pane
                        CreateObj("Window", _cubeMesh, windowMat,
                            new Vector3(winX, gh + b.h * 0.55f, winZ),
                            Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                            new Vector3(1.3f, 1.1f, 0.19f));
                    }
                }

                // Chimney
                if (b.chimney)
                {
                    var chimneyMat = MakeLit(new Color(0.42f, 0.36f, 0.31f), 0.88f);
                    CreateObj("Chimney", _cubeMesh, chimneyMat,
                        new Vector3(
                            pos.x + cosA * b.w * 0.25f - sinA * b.d * 0.2f,
                            gh + b.h + b.h * 0.35f,
                            pos.y + sinA * b.w * 0.25f + cosA * b.d * 0.2f),
                        Quaternion.identity,
                        new Vector3(1.3f, 3.8f, 1.3f));
                }
            }

            // Silos
            for (int i = 0; i < 2; i++)
            {
                var sp = Local(52 + i * 10, -8);
                float sh = GetH(sp.x, sp.y);
                CreateObj("Silo", _cylinderMesh, MakeLit(new Color(0.67f, 0.66f, 0.58f), 0.65f),
                    new Vector3(sp.x, sh + 6.5f, sp.y),
                    Quaternion.identity,
                    new Vector3(7f, 13f, 7f));
                CreateObj("SiloCap", _sphereMesh, MakeLit(new Color(0.53f, 0.53f, 0.5f), 0.55f),
                    new Vector3(sp.x, sh + 13.5f, sp.y),
                    Quaternion.identity,
                    new Vector3(6f, 3f, 6f));
            }

            // Hay bales
            float[][] hayPos = {
                new[]{30f,-22f}, new[]{34f,-24f}, new[]{32f,-18f}, new[]{28f,-26f},
                new[]{36f,-20f}, new[]{38f,-26f}, new[]{26f,-22f}, new[]{40f,-22f}
            };
            foreach (var hp in hayPos)
            {
                var pp = Local(hp[0], hp[1]);
                float hh = GetH(pp.x, pp.y);
                CreateObj("HayBale", _cylinderMesh, _hayMat,
                    new Vector3(pp.x, hh + 1.3f, pp.y),
                    Quaternion.Euler(0, 0, 90),
                    new Vector3(3.6f, 2.5f, 3.6f));
            }

            // Fence
            int fenceSegs = 40;
            float fenceRadius = 80f;

            // Water trough (near barn)
            var troughP = Local(38, -12);
            float troughH = GetH(troughP.x, troughP.y);
            CreateObj("Trough", _cubeMesh, MakeLit(new Color(0.4f, 0.35f, 0.28f), 0.85f),
                new Vector3(troughP.x, troughH + 0.6f, troughP.y),
                Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                new Vector3(6f, 1.2f, 2f));
            CreateObj("TroughWater", _cubeMesh, MakeLit(new Color(0.15f, 0.3f, 0.42f), 0.15f),
                new Vector3(troughP.x, troughH + 1.0f, troughP.y),
                Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                new Vector3(5.4f, 0.2f, 1.4f));

            // Animal pen (small fenced area near barn)
            var penCenter = Local(48, 22);
            float penH = GetH(penCenter.x, penCenter.y);
            float penR = 15f;
            int penSegs = 16;
            for (int i = 0; i < penSegs; i++)
            {
                float pa = (float)i / penSegs * Mathf.PI * 2f;
                float px1 = penCenter.x + Mathf.Cos(pa) * penR;
                float pz1 = penCenter.y + Mathf.Sin(pa) * penR;
                float ph1 = GetH(px1, pz1);
                CreateObj("PenPost", _cylinderMesh, _fenceMat,
                    new Vector3(px1, ph1 + 1f, pz1), Quaternion.identity, new Vector3(0.25f, 2f, 0.25f));
                float pa2 = (float)(i + 1) / penSegs * Mathf.PI * 2f;
                float px2 = penCenter.x + Mathf.Cos(pa2) * penR;
                float pz2 = penCenter.y + Mathf.Sin(pa2) * penR;
                float ph2 = GetH(px2, pz2);
                float md_x = (px1 + px2) * 0.5f, md_z = (pz1 + pz2) * 0.5f, md_h = (ph1 + ph2) * 0.5f + 1.2f;
                float d2 = Vector2.Distance(new Vector2(px1, pz1), new Vector2(px2, pz2));
                float ra = Mathf.Atan2(pz2 - pz1, px2 - px1) * Mathf.Rad2Deg;
                CreateObj("PenRail", _cubeMesh, _fenceMat,
                    new Vector3(md_x, md_h, md_z), Quaternion.Euler(0, -ra, 0), new Vector3(d2, 0.12f, 0.08f));
            }

            // Dirt paths between buildings
            var pathMat = MakeLit(new Color(0.55f, 0.45f, 0.32f), 0.95f);
            float[][] pathPairs = {
                new[]{ 0f, 0f, 38f, 0f },   // farmhouse → barn
                new[]{ 0f, 0f, -28f, 18f },  // farmhouse → cottage
                new[]{ 0f, 0f, -28f, -8f },  // farmhouse → shed
                new[]{ 0f, 0f, 18f, 32f },   // farmhouse → outbuilding
            };
            foreach (var pp in pathPairs)
            {
                var p1 = Local(pp[0], pp[1]);
                var p2 = Local(pp[2], pp[3]);
                float mx = (p1.x + p2.x) * 0.5f, mz = (p1.y + p2.y) * 0.5f;
                float mh = GetH(mx, mz);
                float pathDist = Vector2.Distance(p1, p2);
                float pathAngle = Mathf.Atan2(p2.y - p1.y, p2.x - p1.x) * Mathf.Rad2Deg;
                CreateObj("Path", _cubeMesh, pathMat,
                    new Vector3(mx, mh + 0.06f, mz),
                    Quaternion.Euler(0, -pathAngle, 0),
                    new Vector3(pathDist, 0.12f, 2.5f));
            }
            for (int i = 0; i < fenceSegs; i++)
            {
                float a1 = (float)i / fenceSegs * Mathf.PI * 2f;
                float fx = fcx + Mathf.Cos(a1) * fenceRadius;
                float fz = fcz + Mathf.Sin(a1) * fenceRadius;
                float fh = GetH(fx, fz);
                CreateObj("FencePost", _cylinderMesh, _fenceMat,
                    new Vector3(fx, fh + 1.5f, fz),
                    Quaternion.identity,
                    new Vector3(0.35f, 3f, 0.35f));

                // Horizontal rail between posts
                float a2 = (float)(i + 1) / fenceSegs * Mathf.PI * 2f;
                float fx2 = fcx + Mathf.Cos(a2) * fenceRadius;
                float fz2 = fcz + Mathf.Sin(a2) * fenceRadius;
                float fh2 = GetH(fx2, fz2);
                float mid_x = (fx + fx2) * 0.5f, mid_z = (fz + fz2) * 0.5f;
                float mid_h = (fh + fh2) * 0.5f + 1.8f;
                float dist = Vector2.Distance(new Vector2(fx, fz), new Vector2(fx2, fz2));
                float railAngle = Mathf.Atan2(fz2 - fz, fx2 - fx) * Mathf.Rad2Deg;
                CreateObj("FenceRail", _cubeMesh, _fenceMat,
                    new Vector3(mid_x, mid_h, mid_z),
                    Quaternion.Euler(0, -railAngle, 0),
                    new Vector3(dist, 0.15f, 0.1f));
            }

            // Crop fields
            var fieldDefs = new[] {
                new { lx=-55f, lz=-15f, w=32f, d=28f, col=new Color(0.35f, 0.55f, 0.19f) },
                new { lx=-55f, lz=22f,  w=28f, d=22f, col=new Color(0.54f, 0.60f, 0.19f) },
                new { lx=10f,  lz=-55f, w=36f, d=22f, col=new Color(0.42f, 0.62f, 0.22f) },
                new { lx=10f,  lz=52f,  w=30f, d=18f, col=new Color(0.63f, 0.56f, 0.23f) },
            };
            foreach (var f in fieldDefs)
            {
                var fp = Local(f.lx, f.lz);
                float fh = GetH(fp.x, fp.y);
                var fMat = MakeLit(f.col, 0.92f);
                CreateObj("CropField", _cubeMesh, fMat,
                    new Vector3(fp.x, fh + 0.08f, fp.y),
                    Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                    new Vector3(f.w, 0.16f, f.d));

                // Crop rows (thin strips for texture)
                for (float row = -f.w * 0.4f; row < f.w * 0.4f; row += 2.5f)
                {
                    var rp = Local(f.lx + row, f.lz);
                    float rh = GetH(rp.x, rp.y);
                    CreateObj("CropRow", _cubeMesh, MakeLit(f.col * 1.2f, 0.9f),
                        new Vector3(rp.x, rh + 0.4f, rp.y),
                        Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0),
                        new Vector3(0.6f, 0.55f, f.d * 0.9f));
                }
            }

            // Windmill
            var wmP = Local(-42, -30);
            float wmH = GetH(wmP.x, wmP.y);
            CreateObj("WindmillTower", _cylinderMesh, MakeLit(new Color(0.78f, 0.75f, 0.69f), 0.8f),
                new Vector3(wmP.x, wmH + 8f, wmP.y), Quaternion.identity, new Vector3(4f, 16f, 4f));
            CreateObj("WindmillCap", _coneMesh, MakeLit(new Color(0.35f, 0.29f, 0.23f), 0.85f),
                new Vector3(wmP.x, wmH + 17.5f, wmP.y), Quaternion.identity, new Vector3(4.4f, 3f, 4.4f));

            // Windmill blade hub (rotates in Update)
            var hubGo = new GameObject("WindmillHub");
            hubGo.transform.position = new Vector3(wmP.x + cosA * 2.2f, wmH + 16.5f, wmP.y + sinA * 2.2f);
            hubGo.transform.rotation = Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0);
            hubGo.transform.SetParent(transform);
            _windmillHub = hubGo.transform;

            // Hub sphere (small, centered)
            CreateObj("Hub", _sphereMesh, MakeLit(new Color(0.45f, 0.38f, 0.30f), 0.7f),
                Vector3.zero, Quaternion.identity, new Vector3(1.0f, 1.0f, 0.6f)).transform.SetParent(hubGo.transform, false);

            // 4 thin blades extending outward from hub like spokes
            var bladeMat = MakeLit(new Color(0.85f, 0.82f, 0.75f), 0.7f);
            for (int b = 0; b < 4; b++)
            {
                float ba = b * 90f;
                float rad = ba * Mathf.Deg2Rad;
                float bladeLen = 7.5f;
                float bladeOff = bladeLen * 0.5f + 0.4f; // start just outside hub
                var blade = CreateObj("WindmillBlade", _cubeMesh, bladeMat,
                    new Vector3(Mathf.Cos(rad) * bladeOff,
                                Mathf.Sin(rad) * bladeOff, 0.25f),
                    Quaternion.Euler(0, 0, ba),
                    new Vector3(0.55f, bladeLen, 0.1f));
                blade.transform.SetParent(hubGo.transform, false);
            }

            // Well
            var wellP = Local(12, -15);
            float wellH = GetH(wellP.x, wellP.y);
            var stoneMat = MakeLit(new Color(0.5f, 0.48f, 0.44f), 0.9f);
            CreateObj("Well", _cylinderMesh, stoneMat,
                new Vector3(wellP.x, wellH + 1f, wellP.y),
                Quaternion.identity, new Vector3(3f, 2f, 3f));
            // Well water surface
            CreateObj("WellWater", _cylinderMesh, MakeLit(new Color(0.1f, 0.25f, 0.35f), 0.2f),
                new Vector3(wellP.x, wellH + 0.7f, wellP.y),
                Quaternion.identity, new Vector3(2.4f, 0.1f, 2.4f));

            // Cart/wagon
            var cartP = Local(-8, 18);
            float cartH = GetH(cartP.x, cartP.y);
            var woodMat = MakeLit(new Color(0.45f, 0.32f, 0.18f), 0.88f);
            CreateObj("CartBody", _cubeMesh, woodMat,
                new Vector3(cartP.x, cartH + 1.2f, cartP.y),
                Quaternion.Euler(0, angle * Mathf.Rad2Deg + 15, 0),
                new Vector3(5f, 1.5f, 2.5f));
            // Wheels
            for (int wi = 0; wi < 4; wi++)
            {
                float wxOff = (wi < 2 ? -2f : 2f), wzOff = (wi % 2 == 0 ? -1.2f : 1.2f);
                var wp = Local(-8 + wxOff, 18 + wzOff);
                CreateObj("Wheel", _cylinderMesh, MakeLit(new Color(0.3f, 0.2f, 0.12f), 0.9f),
                    new Vector3(wp.x, cartH + 0.6f, wp.y),
                    Quaternion.Euler(0, 0, 90),
                    new Vector3(1.1f, 0.15f, 1.1f));
            }
        }

        #endregion

        #region Mountain Vegetation

        void AddMountainVegetation()
        {
            // Alpine shrubs
            int shrubCount = 500;
            int placed = 0;
            for (int attempt = 0; attempt < shrubCount * 8 && placed < shrubCount; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float h = GetH(wx, wz);
                if (h < 130 || h < GeologyConfig.WATER_LEVEL + 5) continue;
                if (IsInLake(wx, wz, 10) || IsInRiver(wx, wz, 10) || IsInFarm(wx, wz, 10)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.7f) continue;

                float scale = RandRange(0.6f, 2.2f);
                CreateObj("AlpineShrub", _leafClusterMesh, _alpineShrubMat,
                    new Vector3(wx, h - 0.15f, wz),
                    Quaternion.Euler(RandRange(-10, 10), RandF() * 360f, RandRange(-5, 5)),
                    new Vector3(scale * 1.3f, scale * 0.4f, scale * 1.1f));
                placed++;
            }

            // Wildflowers
            int flowerCount = 400;
            placed = 0;
            var flowerColors = new[] {
                new Color(0.6f, 0.3f, 0.7f), new Color(0.9f, 0.8f, 0.2f),
                new Color(0.9f, 0.9f, 0.85f), new Color(0.8f, 0.4f, 0.5f),
                new Color(0.3f, 0.5f, 0.8f)
            };
            Material[] flowerMats = new Material[flowerColors.Length];
            for (int i = 0; i < flowerColors.Length; i++)
                flowerMats[i] = MakeLit(flowerColors[i], 0.8f);

            for (int attempt = 0; attempt < flowerCount * 8 && placed < flowerCount; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float h = GetH(wx, wz);
                if (h < 120 || h < GeologyConfig.WATER_LEVEL + 5) continue;
                if (IsInLake(wx, wz, 8) || IsInRiver(wx, wz, 8) || IsInFarm(wx, wz, 5)) continue;
                float slope = GetSlope(wx, wz);
                if (slope > 0.5f) continue;

                float scale = RandRange(0.5f, 1.5f);
                CreateObj("Wildflower", _sphereMesh, flowerMats[_rng.Next(flowerMats.Length)],
                    new Vector3(wx, h + 0.15f, wz),
                    Quaternion.Euler(0, RandF() * 360, 0),
                    new Vector3(scale, scale * 0.6f, scale));
                placed++;
            }

            // Boulders on mountain slopes
            int boulderCount = 200;
            placed = 0;
            for (int attempt = 0; attempt < boulderCount * 8 && placed < boulderCount; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.88f;
                float h = GetH(wx, wz);
                if (h < 140) continue;
                if (IsInLake(wx, wz, 10) || IsInRiver(wx, wz, 10)) continue;
                float slope = GetSlope(wx, wz);
                if (slope < 0.2f) continue;

                float scale = RandRange(2f, 8f);
                float gray = RandRange(0.4f, 0.6f);
                CreateObj("Boulder", _icosphereMesh, MakeTextured(new Color(gray, gray * 0.96f, gray * 0.9f), VegetationTextures.RockDetail, 0.06f, 0.92f),
                    new Vector3(wx, h - scale * 0.2f, wz),
                    Quaternion.Euler(RandF() * 30, RandF() * 360, RandF() * 20),
                    new Vector3(scale, scale * RandRange(0.5f, 0.8f), scale * RandRange(0.8f, 1.2f)));
                placed++;
            }
        }

        #endregion

        #region Riparian Vegetation

        void AddRiparianVegetation()
        {
            // Dense vegetation near water bodies matching React's 1700-item riparian zone
            var densePatchMat = MakeLit(new Color(0.22f, 0.42f, 0.15f), 0.92f);
            var wildflowerMats = new[] {
                MakeLit(new Color(0.95f, 0.85f, 0.25f), 0.75f), // yellow
                MakeLit(new Color(0.7f, 0.3f, 0.75f), 0.75f),   // purple
                MakeLit(new Color(0.95f, 0.55f, 0.65f), 0.75f),  // pink
                MakeLit(new Color(0.9f, 0.9f, 0.85f), 0.75f),    // white
                MakeLit(new Color(0.35f, 0.55f, 0.85f), 0.75f),  // blue
            };
            var shrubMat = MakeLit(new Color(0.28f, 0.48f, 0.20f), 0.88f);
            var reedMat = MakeLit(new Color(0.32f, 0.50f, 0.22f), 0.9f);

            int patchPlaced = 0, flowerPlaced = 0, shrubPlaced = 0, reedPlaced = 0;
            int targetPatches = 600, targetFlowers = 500, targetShrubs = 300, targetReeds = 300;

            // Find water proximity candidates — scatter near lakes and river
            for (int attempt = 0; attempt < (targetPatches + targetFlowers + targetShrubs + targetReeds) * 3; attempt++)
            {
                float wx = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float wz = RandRange(-0.5f, 0.5f) * GeologyConfig.TERRAIN_SIZE * 0.85f;
                float h = GetH(wx, wz);
                if (h < GeologyConfig.WATER_LEVEL - 1 || h > GeologyConfig.WATER_LEVEL + 20) continue;
                if (IsInFarm(wx, wz, 10)) continue;

                // Must be near water but not IN water
                bool nearLake = IsInLake(wx, wz, 20) && !IsInLake(wx, wz, 1);
                bool nearRiver = IsInRiver(wx, wz, 18) && !IsInRiver(wx, wz, 3);
                if (!nearLake && !nearRiver) continue;

                float slope = GetSlope(wx, wz);
                if (slope > 0.5f) continue;

                float r = RandF();
                if (r < 0.35f && patchPlaced < targetPatches)
                {
                    // Dense ground patch
                    float s = RandRange(1.5f, 4.0f);
                    CreateObj("RipPatch", _sphereMesh, densePatchMat,
                        new Vector3(wx, h + 0.1f, wz),
                        Quaternion.Euler(0, RandF() * 360, 0),
                        new Vector3(s, s * 0.3f, s));
                    patchPlaced++;
                }
                else if (r < 0.60f && flowerPlaced < targetFlowers)
                {
                    float s = RandRange(0.4f, 1.2f);
                    CreateObj("RipFlower", _sphereMesh, wildflowerMats[_rng.Next(wildflowerMats.Length)],
                        new Vector3(wx, h + 0.2f, wz),
                        Quaternion.Euler(0, RandF() * 360, 0),
                        new Vector3(s, s * 0.7f, s));
                    flowerPlaced++;
                }
                else if (r < 0.80f && shrubPlaced < targetShrubs)
                {
                    float s = RandRange(2f, 5f);
                    CreateObj("RipShrub", _sphereMesh, shrubMat,
                        new Vector3(wx, h + s * 0.3f, wz),
                        Quaternion.Euler(0, RandF() * 360, 0),
                        new Vector3(s * 0.8f, s * 0.6f, s * 0.8f));
                    shrubPlaced++;
                }
                else if (reedPlaced < targetReeds)
                {
                    float rh = RandRange(2f, 5f);
                    CreateObj("RipReed", _cubeMesh, reedMat,
                        new Vector3(wx, h + rh * 0.5f, wz),
                        Quaternion.Euler(RandRange(-5, 5), RandF() * 360, RandRange(-5, 5)),
                        new Vector3(0.12f, rh, 0.06f));
                    reedPlaced++;
                }
            }
        }

        #endregion

        #region Helpers

        GameObject CreateObj(string name, Mesh mesh, Material mat, Vector3 pos, Quaternion rot, Vector3 scale)
        {
            var go = new GameObject(name);
            go.transform.SetParent(transform);
            go.transform.position = pos;
            go.transform.rotation = rot;
            go.transform.localScale = scale;
            var mf = go.AddComponent<MeshFilter>();
            mf.sharedMesh = mesh;
            var mr = go.AddComponent<MeshRenderer>();
            mr.sharedMaterial = mat;
            mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
            go.isStatic = true;
            return go;
        }

        #endregion
    }
}
