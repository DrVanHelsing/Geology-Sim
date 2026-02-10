// ================================================================
//  GAME MANAGER — Main orchestrator MonoBehaviour
//  Creates terrain, water, atmosphere, vegetation, tools, UI.
//  Manages the update loop for animated systems.
// ================================================================
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;
using System.Collections;

namespace GeologySim
{
    public class GameManager : MonoBehaviour
    {
        [Header("References (auto-created at runtime)")]
        WaterManager _water;
        AtmosphereManager _atmosphere;
        VegetationManager _vegetation;
        ToolManager _tools;
        OrbitCamera _camera;
        UIManager _ui;


        float[] _heightmap;
        SimplexNoise2D _noise, _noiseB;
        Mesh _terrainMesh;
        float _startTime;

        void Start()
        {
            _startTime = Time.realtimeSinceStartup;

            // Allow system to use more VRAM (6GB GPU)
            QualitySettings.globalTextureMipmapLimit = 0; // Full resolution textures
            Shader.maximumChunksOverride = 0; // No chunk limit
            QualitySettings.streamingMipmapsMemoryBudget = 4096; // 4GB streaming budget

            // Runtime URP check
            if (GraphicsSettings.defaultRenderPipeline == null)
                Debug.LogError("[GeologySim] No URP Pipeline Asset assigned! " +
                    "Go to Edit > Project Settings > Graphics and assign a URP asset, " +
                    "or run GeologySim > Setup Scene from the menu bar.");

            StartCoroutine(BuildWorld());
        }

        IEnumerator BuildWorld()
        {
            var state = AppState.Instance;

            // 1. Noise
            state.SetLoading(0.05f, "Initializing noise generators…");
            yield return null;
            _noise  = new SimplexNoise2D(42);
            _noiseB = new SimplexNoise2D(137);

            // 2. Heightmap
            state.SetLoading(0.10f, "Generating heightmap…");
            yield return null;
            _heightmap = TerrainGenerator.BuildHeightMap(_noise, _noiseB);

            // 3. Erosion
            state.SetLoading(0.30f, "Simulating hydraulic erosion (38k particles)…");
            yield return null;
            TerrainGenerator.ErodeHeightmap(_heightmap, GeologyConfig.GRID_DIM, 38000);

            // 4. Build mesh
            state.SetLoading(0.55f, "Building terrain mesh…");
            yield return null;
            _terrainMesh = TerrainGenerator.BuildTerrainMesh(_noise, _heightmap);

            // 5. Create terrain GameObject
            state.SetLoading(0.60f, "Creating terrain object…");
            yield return null;
            var terrainGO = new GameObject("Terrain");
            var mf = terrainGO.AddComponent<MeshFilter>();
            mf.mesh = _terrainMesh;
            var mr = terrainGO.AddComponent<MeshRenderer>();

            // Terrain material
            var terrainShader = Shader.Find("GeologySim/TerrainPBR");
            if (terrainShader != null)
            {
                var terrainMat = new Material(terrainShader);
                terrainMat.SetFloat("_Roughness", 0.72f);
                terrainMat.SetFloat("_AmbientBoost", 1.15f);
                terrainMat.SetFloat("_DetailScale", 0.04f);
                terrainMat.SetFloat("_DetailStr", 0.14f);
                terrainMat.SetFloat("_SnowLine", 200f);
                terrainMat.SetFloat("_WaterLevel", GeologyConfig.WATER_LEVEL);

                // Generate runtime noise/detail textures for high-quality sampling
                TextureGenerator.GenerateAndAssign(terrainMat);

                mr.sharedMaterial = terrainMat;
            }
            else
            {
                // Fallback: vertex-color-aware unlit so the terrain isn't invisible
                var fallbackShader = Shader.Find("Universal Render Pipeline/Unlit");
                if (fallbackShader == null) fallbackShader = Shader.Find("Unlit/Color");
                var fallbackMat = new Material(fallbackShader);
                fallbackMat.color = new Color(0.6f, 0.55f, 0.45f);
                mr.sharedMaterial = fallbackMat;
                Debug.LogWarning("[GeologySim] TerrainPBR shader not found — using fallback");
            }
            mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
            mr.receiveShadows = true;

            // Add MeshCollider for raycasting (tools)
            var mc = terrainGO.AddComponent<MeshCollider>();
            mc.sharedMesh = _terrainMesh;

            // 6. Water
            state.SetLoading(0.65f, "Creating water systems…");
            yield return null;
            var waterGO = new GameObject("WaterManager");
            _water = waterGO.AddComponent<WaterManager>();
            _water.Initialize(_heightmap);

            // 7. Atmosphere
            state.SetLoading(0.72f, "Building atmosphere…");
            yield return null;
            var atmosGO = new GameObject("AtmosphereManager");
            _atmosphere = atmosGO.AddComponent<AtmosphereManager>();
            _atmosphere.Initialize();

            // 8. Vegetation
            state.SetLoading(0.78f, "Planting vegetation & building farm…");
            yield return null;
            var vegGO = new GameObject("VegetationManager");
            _vegetation = vegGO.AddComponent<VegetationManager>();
            _vegetation.Initialize(_heightmap, _noise);

            // 9. Camera
            state.SetLoading(0.88f, "Setting up camera…");
            yield return null;
            var camGO = new GameObject("MainCamera");
            camGO.tag = "MainCamera";
            _camera = camGO.AddComponent<OrbitCamera>();
            _camera.Initialize(_heightmap);

            // 10. Lighting
            state.SetLoading(0.90f, "Configuring lighting…");
            yield return null;
            SetupLighting();

            // 11. Tools
            state.SetLoading(0.93f, "Initializing field tools…");
            yield return null;
            var toolsGO = new GameObject("ToolManager");
            _tools = toolsGO.AddComponent<ToolManager>();
            _tools.Initialize(_camera, _heightmap, _noise);

            // 12. UI
            state.SetLoading(0.96f, "Building UI…");
            yield return null;
            var uiGO = new GameObject("UIManager");
            _ui = uiGO.AddComponent<UIManager>();
            _ui.Initialize();

            // 13. Done
            float elapsed = Time.realtimeSinceStartup - _startTime;
            state.SetLoading(1f, $"Ready! ({elapsed:F1}s)", true);
            Debug.Log($"[GeologySim] World built in {elapsed:F1}s");

            // 14. Wire settings propagation
            state.OnSettingsChanged += OnSettingsChanged;
        }

        void OnSettingsChanged()
        {
            var s = AppState.Instance;

            // Water level
            if (_water != null) _water.UpdateWaterLevel(s.WaterLevel);

            // Fog
            RenderSettings.fogDensity = s.FogDensity;

            // Sun elevation → direction
            if (_atmosphere != null)
            {
                float elev = s.SunElevation * Mathf.Deg2Rad;
                float azimuth = 220f * Mathf.Deg2Rad; // match GeologyConfig default
                var dir = new Vector3(
                    Mathf.Cos(elev) * Mathf.Sin(azimuth),
                    Mathf.Sin(elev),
                    Mathf.Cos(elev) * Mathf.Cos(azimuth)).normalized;
                _atmosphere.UpdateSunDirection(dir);

                // Rotate directional light to match
                var sunLight = GameObject.Find("DirectionalLight");
                if (sunLight != null)
                    sunLight.transform.rotation = Quaternion.LookRotation(-dir);
            }

            // Ambient intensity
            RenderSettings.ambientIntensity = s.AmbientIntensity;
        }

        void SetupLighting()
        {
            // Directional light (sun)
            var lightGO = new GameObject("DirectionalLight");
            var light = lightGO.AddComponent<Light>();
            light.type = LightType.Directional;
            light.color = new Color(1f, 0.97f, 0.88f);
            light.intensity = 1.4f;
            light.shadows = LightShadows.Soft;
            light.shadowStrength = 0.65f;
            lightGO.transform.rotation = Quaternion.LookRotation(-GeologyConfig.SUN_DIRECTION);

            // URP shadow bias (shadowResolution is controlled by URP pipeline asset)
            light.shadowBias = 0.015f;
            light.shadowNormalBias = 0.35f;

            // Secondary fill light (subtle blue from sky)
            var fillGO = new GameObject("FillLight");
            var fillLight = fillGO.AddComponent<Light>();
            fillLight.type = LightType.Directional;
            fillLight.color = new Color(0.55f, 0.65f, 0.82f);
            fillLight.intensity = 0.25f;
            fillLight.shadows = LightShadows.None;
            fillGO.transform.rotation = Quaternion.LookRotation(new Vector3(-0.3f, -0.5f, 0.8f));

            // Ambient light (hemisphere approximation via RenderSettings)
            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.50f, 0.60f, 0.78f);
            RenderSettings.ambientEquatorColor = new Color(0.58f, 0.62f, 0.68f);
            RenderSettings.ambientGroundColor = new Color(0.35f, 0.30f, 0.26f);
            RenderSettings.ambientIntensity = 1.15f;

            // Fog
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.ExponentialSquared;
            RenderSettings.fogDensity = 0.00022f;
            RenderSettings.fogColor = new Color(0.72f, 0.82f, 0.90f);

            // Post-processing Volume
            SetupPostProcessing();
        }

        void SetupPostProcessing()
        {
            var volumeGO = new GameObject("PostProcessVolume");
            var volume = volumeGO.AddComponent<UnityEngine.Rendering.Volume>();
            volume.isGlobal = true;
            volume.priority = 1;

            var profile = ScriptableObject.CreateInstance<UnityEngine.Rendering.VolumeProfile>();
            volume.profile = profile;

            // Bloom — sun glow & water sparkle
            var bloom = profile.Add<UnityEngine.Rendering.Universal.Bloom>(true);
            bloom.threshold.value = 0.82f;
            bloom.intensity.value = 0.55f;
            bloom.scatter.value = 0.72f;

            // Tonemapping — cinematic ACES curve
            var tonemap = profile.Add<UnityEngine.Rendering.Universal.Tonemapping>(true);
            tonemap.mode.value = UnityEngine.Rendering.Universal.TonemappingMode.ACES;

            // Vignette — subtle edge darkening
            var vignette = profile.Add<UnityEngine.Rendering.Universal.Vignette>(true);
            vignette.intensity.value = 0.28f;
            vignette.smoothness.value = 0.45f;

            // Color Adjustments — richer, warmer tones
            var colorAdj = profile.Add<UnityEngine.Rendering.Universal.ColorAdjustments>(true);
            colorAdj.postExposure.value = 0.18f;
            colorAdj.contrast.value = 12f;
            colorAdj.saturation.value = 15f;
            colorAdj.colorFilter.value = new Color(1.02f, 1.00f, 0.97f);

            // Lift Gamma Gain — warm shadows, cool highlights
            var lgg = profile.Add<UnityEngine.Rendering.Universal.LiftGammaGain>(true);
            lgg.lift.value = new Vector4(0.02f, 0.01f, -0.01f, 0f);
            lgg.gamma.value = new Vector4(0f, 0f, 0f, 0.05f);
            lgg.gain.value = new Vector4(-0.02f, 0f, 0.03f, 0f);

            // Chromatic Aberration — subtle lens effect
            var ca = profile.Add<UnityEngine.Rendering.Universal.ChromaticAberration>(true);
            ca.intensity.value = 0.08f;

            // Film Grain — subtle cinematic grain
            var grain = profile.Add<UnityEngine.Rendering.Universal.FilmGrain>(true);
            grain.intensity.value = 0.15f;
            grain.response.value = 0.6f;

            // Depth of Field — tilt-shift style subtle focus
            var dof = profile.Add<UnityEngine.Rendering.Universal.DepthOfField>(true);
            dof.mode.value = UnityEngine.Rendering.Universal.DepthOfFieldMode.Bokeh;
            dof.focusDistance.value = 500f;
            dof.focalLength.value = 85f;
            dof.aperture.value = 12f;  // relatively wide to keep most in focus
        }

        void Update()
        {
            float time = Time.time;

            // Animate water (sets _GlobalTime global shader property)
            if (_water != null) _water.Animate(time);

            // Animate atmosphere
            if (_atmosphere != null) _atmosphere.Animate(time);

            // Keyboard shortcuts
            HandleKeyboardShortcuts();
        }

        void HandleKeyboardShortcuts()
        {
            var state = AppState.Instance;

            if (Input.GetKeyDown(KeyCode.Alpha1)) state.SetTool("navigate");
            if (Input.GetKeyDown(KeyCode.Alpha2)) state.SetTool("identify");
            if (Input.GetKeyDown(KeyCode.Alpha3)) state.SetTool("drill");
            if (Input.GetKeyDown(KeyCode.Alpha4)) state.SetTool("measure");
            if (Input.GetKeyDown(KeyCode.Alpha5)) state.SetTool("strikeDip");
            if (Input.GetKeyDown(KeyCode.Alpha6)) state.SetTool("crossSection");

            if (Input.GetKeyDown(KeyCode.L)) state.SetPanel(state.ActivePanel == "legend" ? null : "legend");
            if (Input.GetKeyDown(KeyCode.N)) state.SetPanel(state.ActivePanel == "notebook" ? null : "notebook");
            if (Input.GetKeyDown(KeyCode.Comma)) state.SetPanel(state.ActivePanel == "settings" ? null : "settings");

            if (Input.GetKeyDown(KeyCode.Escape))
            {
                state.SetPanel(null);
                state.HideRockPopup();
            }
        }
    }
}
