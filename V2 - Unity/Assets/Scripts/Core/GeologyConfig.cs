// ================================================================
//  GEOLOGICAL LAYER DEFINITIONS & CONSTANTS
//  Direct port of V2-React/src/config/geology.js
// ================================================================
using UnityEngine;

namespace GeologySim
{
    [System.Serializable]
    public class GeologicalLayer
    {
        public string name;
        public float baseElevation;
        public Color color;
        public float vegetationDensity;
        public string[] minerals;
        public string characteristics;
        public string grainSize;
        public string texture;
        public string fossils;
        public string age;
    }

    [System.Serializable]
    public struct LakeDefinition
    {
        public string name;
        public float cx, cz, rx, rz, depth;
    }

    [System.Serializable]
    public struct RiverDefinition
    {
        public string name;
        public float width, depth;
        public Vector2[] points;
    }

    [System.Serializable]
    public struct FarmDefinition
    {
        public float cx, cz, radius, elevation;
    }

    public static class GeologyConfig
    {
        public const float TERRAIN_SIZE = 2000f;
        public const int SEGMENTS = 384;
        public const float WATER_LEVEL = 38f;
        public const int GRID_DIM = SEGMENTS + 1; // 385

        public static readonly GeologicalLayer[] LAYERS = new[]
        {
            new GeologicalLayer
            {
                name = "Granite Gneiss",
                baseElevation = 0f,
                color = HexColor(0x8B7D7B),
                vegetationDensity = 0.05f,
                minerals = new[] { "Quartz", "K-Feldspar", "Plagioclase", "Biotite" },
                characteristics = "Coarse-grained metamorphic basement rock with gneissic banding",
                grainSize = "Coarse (2-5 mm)",
                texture = "Gneissic banding",
                fossils = "None",
                age = "Precambrian (~1.8 Ga)",
            },
            new GeologicalLayer
            {
                name = "Dolomitic Limestone",
                baseElevation = 40f,
                color = HexColor(0xC8B898),
                vegetationDensity = 0.25f,
                minerals = new[] { "Dolomite", "Calcite", "Minor Quartz" },
                characteristics = "Fine-grained carbonate rock with dolomite replacement textures",
                grainSize = "Fine (0.1-0.5 mm)",
                texture = "Crystalline, sucrosic",
                fossils = "Coral fragments, Stromatolites",
                age = "Cambrian (~510 Ma)",
            },
            new GeologicalLayer
            {
                name = "Sandstone & Shale",
                baseElevation = 75f,
                color = HexColor(0xB8A06E),
                vegetationDensity = 0.75f,
                minerals = new[] { "Quartz", "Feldspar", "Clay minerals", "Mica" },
                characteristics = "Alternating sandstone and shale beds with cross-bedding",
                grainSize = "Fine to Medium",
                texture = "Clastic, laminated",
                fossils = "Trilobites, Brachiopods",
                age = "Ordovician (~470 Ma)",
            },
            new GeologicalLayer
            {
                name = "Schist",
                baseElevation = 130f,
                color = HexColor(0x607070),
                vegetationDensity = 0.55f,
                minerals = new[] { "Muscovite", "Biotite", "Garnet", "Quartz" },
                characteristics = "Foliated metamorphic rock with visible mica flakes and garnet porphyroblasts",
                grainSize = "Medium to Coarse",
                texture = "Schistose foliation",
                fossils = "None (metamorphosed)",
                age = "Silurian (~430 Ma)",
            },
            new GeologicalLayer
            {
                name = "Limestone",
                baseElevation = 180f,
                color = HexColor(0xA09080),
                vegetationDensity = 0.45f,
                minerals = new[] { "Calcite", "Aragonite", "Minor Clay" },
                characteristics = "Fossiliferous limestone with well-preserved marine fauna",
                grainSize = "Fine to Medium",
                texture = "Bioclastic, micritic",
                fossils = "Ammonites, Crinoids, Brachiopods",
                age = "Devonian (~380 Ma)",
            },
            new GeologicalLayer
            {
                name = "Alluvium & Topsoil",
                baseElevation = 220f,
                color = HexColor(0x6D8B50),
                vegetationDensity = 1.0f,
                minerals = new[] { "Clay", "Quartz sand", "Organic matter" },
                characteristics = "Unconsolidated surface material with vegetation cover",
                grainSize = "Variable",
                texture = "Unconsolidated",
                fossils = "Plant debris, recent",
                age = "Quaternary (<2 Ma)",
            },
        };

        public static readonly LakeDefinition[] LAKES = new[]
        {
            new LakeDefinition { name = "Mirror Lake",   cx = -300, cz =  200, rx = 160, rz = 120, depth = 14 },  // large
            new LakeDefinition { name = "Crystal Pond",  cx =  280, cz = -300, rx = 100, rz = 110, depth = 10 },  // medium
            new LakeDefinition { name = "Emerald Tarn",  cx = -520, cz = -160, rx =  70, rz =  60, depth =  8 },  // small
        };

        public static readonly RiverDefinition[] RIVERS = new[]
        {
            new RiverDefinition
            {
                name = "Serpent River",
                width = 40f,
                depth = 28f,
                points = new[]
                {
                    new Vector2(-850, -650), new Vector2(-620, -480),
                    new Vector2(-400, -300), new Vector2(-220, -120),
                    new Vector2( -60,   30), new Vector2(  80,  130),
                    new Vector2( 230,   80), new Vector2( 380,   10),
                    new Vector2( 530, -100), new Vector2( 680, -180),
                    new Vector2( 850, -140),
                },
            },
        };

        public static readonly FarmDefinition FARM = new FarmDefinition
        {
            cx = 380, cz = 320, radius = 160, elevation = 95,
        };

        /// <summary>Sun direction shared across all systems.</summary>
        public static readonly Vector3 SUN_DIRECTION = new Vector3(0.75f, 0.4f, 0.45f).normalized;

        public static GeologicalLayer GetLayerAtElevation(float y)
        {
            for (int i = LAYERS.Length - 1; i >= 0; i--)
                if (y >= LAYERS[i].baseElevation) return LAYERS[i];
            return LAYERS[0];
        }

        public static int GetLayerIndexAtElevation(float y)
        {
            for (int i = LAYERS.Length - 1; i >= 0; i--)
                if (y >= LAYERS[i].baseElevation) return i;
            return 0;
        }

        static Color HexColor(int hex)
        {
            float r = ((hex >> 16) & 0xFF) / 255f;
            float g = ((hex >> 8) & 0xFF) / 255f;
            float b = (hex & 0xFF) / 255f;
            return new Color(r, g, b);
        }
    }
}
