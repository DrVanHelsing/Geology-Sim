// ================================================================
//  EDITOR SETUP SCRIPT — Auto-configures URP pipeline + scene
//  Unity Editor > GeologySim > Setup Scene
// ================================================================
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace GeologySim.Editor
{
    [InitializeOnLoad]
    public static class ProjectSetup
    {
        // ── Auto-check URP on domain reload ──
        static ProjectSetup()
        {
            EditorApplication.delayCall += EnsureURPConfigured;
        }

        /// <summary>
        /// Creates URP Pipeline + Renderer assets if none exist,
        /// and assigns them to Graphics + Quality settings.
        /// </summary>
        static void EnsureURPConfigured()
        {
            if (GraphicsSettings.defaultRenderPipeline != null) return;

            Debug.Log("[GeologySim] No URP pipeline asset found — creating one…");

            string dir = "Assets/Settings";
            if (!AssetDatabase.IsValidFolder(dir))
                AssetDatabase.CreateFolder("Assets", "Settings");

            // 1. Renderer Data
            var rendererData = ScriptableObject.CreateInstance<UniversalRendererData>();
            rendererData.name = "GeologySim_Renderer";
            string rendererPath = dir + "/GeologySim_Renderer.asset";
            AssetDatabase.CreateAsset(rendererData, rendererPath);

            // 2. Pipeline Asset
            var pipelineAsset = ScriptableObject.CreateInstance<UniversalRenderPipelineAsset>();
            pipelineAsset.name = "GeologySim_URP";
            string pipelinePath = dir + "/GeologySim_URP.asset";
            AssetDatabase.CreateAsset(pipelineAsset, pipelinePath);

            // Wire renderer into pipeline via SerializedObject (works across URP versions)
            var so = new SerializedObject(pipelineAsset);
            var renderers = so.FindProperty("m_RendererDataList");
            renderers.arraySize = 1;
            renderers.GetArrayElementAtIndex(0).objectReferenceValue = rendererData;
            so.FindProperty("m_DefaultRendererIndex").intValue = 0;
            so.ApplyModifiedPropertiesWithoutUndo();

            // 3. Configure pipeline for Iris Xe
            ConfigureURPAsset(pipelineAsset);

            // 4. Assign to Graphics Settings + all Quality Levels
            GraphicsSettings.defaultRenderPipeline = pipelineAsset;
            QualitySettings.renderPipeline = pipelineAsset;
            for (int i = 0; i < QualitySettings.names.Length; i++)
            {
                QualitySettings.SetQualityLevel(i, false);
                QualitySettings.renderPipeline = pipelineAsset;
            }

            EditorUtility.SetDirty(pipelineAsset);
            EditorUtility.SetDirty(rendererData);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            Debug.Log("[GeologySim] URP pipeline created and assigned: " + pipelinePath);
        }

        static void ConfigureURPAsset(UniversalRenderPipelineAsset asset)
        {
            var so = new SerializedObject(asset);

            // Shadows
            SetProp(so, "m_MainLightShadowsSupported", true);
            SetProp(so, "m_MainLightShadowmapResolution", 1024);
            SetProp(so, "m_ShadowDistance", 500f);
            SetProp(so, "m_ShadowCascadeCount", 2);

            // Anti-aliasing (2x MSAA for Iris Xe)
            SetProp(so, "m_MSAA", 2);

            // HDR off for integrated GPU
            SetProp(so, "m_SupportsHDR", false);

            // Render scale
            SetProp(so, "m_RenderScale", 1f);

            so.ApplyModifiedPropertiesWithoutUndo();
        }

        static void SetProp(SerializedObject so, string name, object value)
        {
            var prop = so.FindProperty(name);
            if (prop == null) return;
            switch (value)
            {
                case bool b:   prop.boolValue = b; break;
                case int i:    prop.intValue = i; break;
                case float f:  prop.floatValue = f; break;
            }
        }

        // ────────────────────────────────────────────
        //  Menu: Setup Scene
        // ────────────────────────────────────────────
        [MenuItem("GeologySim/Setup Scene", false, 1)]
        public static void SetupScene()
        {
            // Ensure URP is configured first
            EnsureURPConfigured();

            if (!EditorUtility.DisplayDialog(
                "GeologySim Setup",
                "This will create a new scene with all GeologySim components.\nContinue?",
                "Create Scene", "Cancel"))
                return;

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            // GameManager — creates everything at runtime
            var gmGO = new GameObject("GameManager");
            gmGO.AddComponent<GameManager>();

            // Save scene
            string scenePath = "Assets/Scenes/GeologySimMain.unity";
            System.IO.Directory.CreateDirectory(Application.dataPath + "/Scenes");
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene, scenePath);

            Debug.Log("[GeologySim] Scene created at " + scenePath);

            EditorUtility.DisplayDialog(
                "Setup Complete",
                "Scene saved to Assets/Scenes/GeologySimMain.unity\n\n" +
                "Press Play to start the Geology Field Simulator!\n\n" +
                "Keyboard shortcuts:\n" +
                "  1-5  Select tools\n" +
                "  L    Legend panel\n" +
                "  N    Notebook panel\n" +
                "  ,    Settings panel\n" +
                "  Esc  Close panels\n" +
                "  RMB  Rotate camera\n" +
                "  MMB  Pan camera\n" +
                "  Scroll  Zoom",
                "OK");
        }

        // ────────────────────────────────────────────
        //  Menu: Reconfigure URP for Iris Xe
        // ────────────────────────────────────────────
        [MenuItem("GeologySim/Configure Quality (Iris Xe)", false, 2)]
        public static void ConfigureQuality()
        {
            EnsureURPConfigured();

            QualitySettings.vSyncCount = 1;
            QualitySettings.lodBias = 1f;
            QualitySettings.maximumLODLevel = 0;
            Application.targetFrameRate = 60;

            Debug.Log("[GeologySim] Quality configured for Intel Iris Xe / i5 11th gen");

            EditorUtility.DisplayDialog(
                "Quality Configured",
                "Optimized settings applied for Intel Iris Xe:\n\n" +
                "• Shadow Resolution: 1024 (via URP Asset)\n" +
                "• Shadow Distance: 500m\n" +
                "• Shadow Cascades: 2\n" +
                "• MSAA: 2x\n" +
                "• VSync: On\n" +
                "• Target FPS: 60",
                "OK");
        }

        // ────────────────────────────────────────────
        //  Menu: Import TMP Essentials (Unity 6 fallback)
        // ────────────────────────────────────────────
        [MenuItem("GeologySim/Import TMP Essentials", false, 20)]
        public static void ImportTMP()
        {
            // Unity 6: TMP is bundled in com.unity.ugui 2.0+
            // Try legacy path first, then ugui path
            string[] paths = {
                "Packages/com.unity.textmeshpro/Package Resources/TMP Essential Resources.unitypackage",
                "Packages/com.unity.ugui/Package Resources/TMP Essential Resources.unitypackage"
            };

            foreach (var p in paths)
            {
                if (System.IO.File.Exists(p))
                {
                    AssetDatabase.ImportPackage(p, false);
                    Debug.Log("[GeologySim] TMP Essentials imported from " + p);
                    return;
                }
            }

            Debug.LogWarning("[GeologySim] TMP resources not found. " +
                "In Unity 6, open Window > TextMeshPro > Import TMP Essential Resources.");
        }
    }
}
#endif
