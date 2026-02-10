// ================================================================
//  GEOLOGICAL LAYER DEFINITIONS & CONSTANTS
// ================================================================

export const TERRAIN_SIZE = 2000; // 2km × 2km
export const SEGMENTS = 512;      // FHD terrain mesh resolution
export const WATER_LEVEL = 38;    // lowered for deeper valleys & river beds

/**
 * Geological layers ordered from deepest (index 0) to surface.
 * Elevation range now spans ~20–280 m for mountain terrain.
 */
export const LAYERS = [
  {
    name: 'Granite Gneiss',
    baseElevation: 0,
    color: '#8B7D7B',
    hex: 0x8b7d7b,
    vegetationDensity: 0.05,   // hard basement — almost no soil accumulation
    minerals: ['Quartz', 'K-Feldspar', 'Plagioclase', 'Biotite'],
    characteristics: 'Coarse-grained metamorphic basement rock with gneissic banding',
    grainSize: 'Coarse (2–5 mm)',
    texture: 'Gneissic banding',
    fossils: 'None',
    age: 'Precambrian (~1.8 Ga)',
  },
  {
    name: 'Dolomitic Limestone',
    baseElevation: 40,
    color: '#C8B898',
    hex: 0xc8b898,
    vegetationDensity: 0.25,   // karst surface — sparse soil in dissolution pits
    minerals: ['Dolomite', 'Calcite', 'Minor Quartz'],
    characteristics: 'Fine-grained carbonate rock with dolomite replacement textures',
    grainSize: 'Fine (0.1–0.5 mm)',
    texture: 'Crystalline, sucrosic',
    fossils: 'Coral fragments, Stromatolites',
    age: 'Cambrian (~510 Ma)',
  },
  {
    name: 'Sandstone & Shale',
    baseElevation: 75,
    color: '#B8A06E',
    hex: 0xb8a06e,
    vegetationDensity: 0.75,   // weathers easily into fertile soil
    minerals: ['Quartz', 'Feldspar', 'Clay minerals', 'Mica'],
    characteristics: 'Alternating sandstone and shale beds with cross-bedding',
    grainSize: 'Fine to Medium',
    texture: 'Clastic, laminated',
    fossils: 'Trilobites, Brachiopods',
    age: 'Ordovician (~470 Ma)',
  },
  {
    name: 'Schist',
    baseElevation: 130,
    color: '#607070',
    hex: 0x607070,
    vegetationDensity: 0.55,   // foliated surface retains moisture — alpine meadows
    minerals: ['Muscovite', 'Biotite', 'Garnet', 'Quartz'],
    characteristics: 'Foliated metamorphic rock with visible mica flakes and garnet porphyroblasts',
    grainSize: 'Medium to Coarse',
    texture: 'Schistose foliation',
    fossils: 'None (metamorphosed)',
    age: 'Silurian (~430 Ma)',
  },
  {
    name: 'Limestone',
    baseElevation: 180,
    color: '#A09080',
    hex: 0xa09080,
    vegetationDensity: 0.45,   // karst terrain — thin soil in crevices
    minerals: ['Calcite', 'Aragonite', 'Minor Clay'],
    characteristics: 'Fossiliferous limestone with well-preserved marine fauna',
    grainSize: 'Fine to Medium',
    texture: 'Bioclastic, micritic',
    fossils: 'Ammonites, Crinoids, Brachiopods',
    age: 'Devonian (~380 Ma)',
  },
  {
    name: 'Alluvium & Topsoil',
    baseElevation: 220,
    color: '#6D8B50',
    hex: 0x6d8b50,
    vegetationDensity: 1.0,    // rich unconsolidated soil — full vegetation support
    minerals: ['Clay', 'Quartz sand', 'Organic matter'],
    characteristics: 'Unconsolidated surface material with vegetation cover',
    grainSize: 'Variable',
    texture: 'Unconsolidated',
    fossils: 'Plant debris, recent',
    age: 'Quaternary (<2 Ma)',
  },
];

/**
 * Look up the geological layer at a given raw elevation.
 * @param {number} y - elevation in meters
 * @returns {object} matching LAYERS entry
 */
export function getLayerAtElevation(y) {
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    if (y >= LAYERS[i].baseElevation) return LAYERS[i];
  }
  return LAYERS[0];
}
