// ================================================================
//  GEOLOGICAL LAYER DEFINITIONS & CONSTANTS
// ================================================================

export const TERRAIN_SIZE = 2000; // 2km × 2km
export const SEGMENTS = 512;      // FHD terrain mesh resolution
export const WATER_LEVEL = 64;    // ocean/sea base level — kept below terrain to prevent flooding

/**
 * Geological layers ordered from deepest (index 0) to surface.
 * Elevation range spans ~20–280 m for mountain terrain.
 *
 * New realistic properties (used in Info Panel & terrain shader):
 *   hardness          – Mohs-scale relative hardness (1–10)
 *   porosity          – fraction of void space (0–1)
 *   permeability      – hydraulic conductivity category
 *   jointSpacing      – dominant joint set spacing (descriptive)
 *   jointSets         – number of prominent joint/cleavage sets
 *   jointAzimuth      – primary joint strike azimuth (°, from N)
 *   weatheringRate    – qualitative surface degradation rate
 *   chemicalReactivity– susceptibility to dissolution & alteration
 *   mechanicalStrength– uniaxial compressive strength (MPa, approx)
 *   hydraulicRole     – aquifer / aquitard / barrier
 *   fractureAperture  – typical open-fracture width (mm)
 */
export const LAYERS = [
  {
    name: 'Granite Gneiss',
    baseElevation: 0,
    color: '#8B7D7B',
    hex: 0x8b7d7b,
    vegetationDensity: 0.05,
    minerals: ['Quartz', 'K-Feldspar', 'Plagioclase', 'Biotite', 'Hornblende'],
    characteristics: 'Coarse-grained metamorphic basement rock with pronounced gneissic banding. '
      + 'Formed by high-grade regional metamorphism at ~18–25 km depth. '
      + 'Alternating felsic (light) and mafic (dark) mineral bands folded on the cm–dm scale. '
      + 'Acts as impermeable regional basement; groundwater perches on its surface.',
    grainSize: 'Coarse (2–8 mm)',
    texture: 'Gneissic banding, augen texture, mylonitic foliation along shear zones',
    fossils: 'None — pre-dates metazoan life',
    age: 'Precambrian (~1.8 Ga)',
    // ── Physical properties ──────────────────────────
    hardness: 7,
    porosity: 0.002,                  // fracture porosity only
    permeability: 'Very low (fracture-controlled)',
    jointSpacing: '0.5 – 2 m',
    jointSets: 3,                     // two vertical + one sub-horizontal
    jointAzimuth: 45,                // NE-trending principal set
    weatheringRate: 'Very slow',
    chemicalReactivity: 'Low — quartz inert; feldspars slowly kaolinised',
    mechanicalStrength: 180,
    hydraulicRole: 'Basement aquitard; thin fracture aquifer along joint zones',
    fractureAperture: 0.2,
    // ── Geological interactions ───────────────────────
    contactBelow: null,
    contactAbove: 'Angular unconformity with overlying Dolomitic Limestone — represents ~800 Ma gap',
    erosionStyle: 'Exfoliation domes (onion-skin weathering), tor formation, spheroidal boulders',
    waterInteraction: 'Rainwater percolates along joints; feldspar hydrolysis very slowly releases K+, Na+',
  },
  {
    name: 'Dolomitic Limestone',
    baseElevation: 40,
    color: '#C8B898',
    hex: 0xc8b898,
    vegetationDensity: 0.25,
    minerals: ['Dolomite', 'Calcite', 'Minor Quartz', 'Pyrite'],
    characteristics: 'Fine-grained dolostone with selective dolomitisation of original lime-mud. '
      + 'Pinpoint porosity and vuggy texture from dolomite crystal growth. '
      + 'Dissolution by slightly acidic meteoric water creates karst features: '
      + 'sinkholes, grikes, clints, and subterranean drainage.',
    grainSize: 'Very fine to fine (0.01–0.5 mm)',
    texture: 'Sucrosic (sugary) crystalline, vuggy, minor stylolites',
    fossils: 'Coral fragments, Stromatolitic heads, Crinoid ossicles',
    age: 'Cambrian (~510 Ma)',
    hardness: 4,
    porosity: 0.12,
    permeability: 'Moderate (vuggy + fracture)',
    jointSpacing: '0.1 – 0.5 m (closely jointed)',
    jointSets: 2,
    jointAzimuth: 60,
    weatheringRate: 'Moderate (dissolution-dominated)',
    chemicalReactivity: 'High — CaMg(CO₃)₂ + H₂CO₃ → Ca²⁺ + Mg²⁺ + 2HCO₃⁻',
    mechanicalStrength: 85,
    hydraulicRole: 'Karst aquifer — rapid conduit flow through dissolution pipes',
    fractureAperture: 1.5,
    contactBelow: 'Nonconformity on basement — basal conglomerate locally present',
    contactAbove: 'Gradational contact with overlying Sandstone; shale partings mark the transition',
    erosionStyle: 'Karst dissolution: dolines, poljes, cave systems, spring mounds',
    waterInteraction: 'Aggressive dissolution in CO₂-rich groundwater; forms cave systems & springs; '
      + 'lake margins undercut to form overhangs; lake water acquires Mg²⁺ and Ca²⁺ hardness',
  },
  {
    name: 'Sandstone & Shale',
    baseElevation: 75,
    color: '#B8A06E',
    hex: 0xb8a06e,
    vegetationDensity: 0.75,
    minerals: ['Quartz', 'Feldspar', 'Clay minerals (Illite, Smectite)', 'Mica', 'Pyrite'],
    characteristics: 'Cyclically interbedded quartz arenite sandstone and organic-rich shale. '
      + 'Sandstone beds show large-scale cross-bedding (aeolian or deltaic origin). '
      + 'Shale partings represent low-energy flooding events. '
      + 'Differential erosion creates stepped cliffs: resistant sandstone caps over recessed shale.',
    grainSize: 'Sandstone fine–medium (0.1–0.5 mm); Shale clay (<0.004 mm)',
    texture: 'Clastic, cross-bedded sandstone; laminated to fissile shale',
    fossils: 'Trilobites, Brachiopods, Trace fossils (Cruziana), Graptolites in shale',
    age: 'Ordovician (~470 Ma)',
    hardness: 5,
    porosity: 0.20,
    permeability: 'High (sandstone); Very low (shale — acts as seal)',
    jointSpacing: '0.3 – 1 m in sandstone; 0.05 – 0.2 m in shale',
    jointSets: 2,
    jointAzimuth: 90,
    weatheringRate: 'Moderate (sandstone resistant; shale rapid)',
    chemicalReactivity: 'Low (quartz dominant); shale moderate (clay swelling)',
    mechanicalStrength: 55,
    hydraulicRole: 'Sandstone — confined aquifer; shale — regional aquitard / seal',
    fractureAperture: 0.5,
    contactBelow: 'Disconformity — minor erosion surface on Dolomitic Limestone',
    contactAbove: 'Sharp erosive contact with overlying Schist (tectonic unconformity)',
    erosionStyle: 'Differential: sandstone forms free faces & rock arches; shale erodes to slopes. '
      + 'River incision follows shale partings; cliff-collapse of overhanging sandstone.',
    waterInteraction: 'Sandstone stores and transmits groundwater; springs emerge at sandstone–shale contact. '
      + 'Pyrite oxidation produces mild acid drainage; shale swells on wetting, causing land-slides.',
  },
  {
    name: 'Schist',
    baseElevation: 130,
    color: '#607070',
    hex: 0x607070,
    vegetationDensity: 0.55,
    minerals: ['Muscovite', 'Biotite', 'Garnet (almandine)', 'Quartz', 'Plagioclase', 'Staurolite'],
    characteristics: 'Well-foliated greenschist-to-amphibolite facies metasediment. '
      + 'Prominent mica-defined foliation dips steeply (~60–70°) to SW. '
      + 'Garnet porphyroblasts up to 8 mm visible at close range as euhedral dodecahedra. '
      + 'Quartz pressure-shadow boudinages indicate ductile shear. '
      + 'Cleavage-parallel cleavage planes create flat, slabby outcrops.',
    grainSize: 'Medium to coarse (0.5–5 mm); garnet porphyroblasts to 12 mm',
    texture: 'Lepidoblastic schistose foliation, crenulation cleavage, pressure shadows around garnets',
    fossils: 'None — original sedimentary fabric destroyed by metamorphism',
    age: 'Silurian protolith (~430 Ma); metamorphism Devonian (~380 Ma)',
    hardness: 6,
    porosity: 0.005,
    permeability: 'Very low (foliation-parallel flow only)',
    jointSpacing: '0.05 – 0.3 m (closely cleaved)',
    jointSets: 3,                     // foliation + 2 cross-sets
    jointAzimuth: 210,                // foliation strike
    weatheringRate: 'Slow (biotite oxidation = main pathway)',
    chemicalReactivity: 'Low-moderate (biotite oxidises; garnet dissolves very slowly)',
    mechanicalStrength: 110,
    hydraulicRole: 'Aquitard — foliation-parallel flow possible but very limited',
    fractureAperture: 0.1,
    contactBelow: 'Tectonic unconformity — thrust contact with underlying Sandstone',
    contactAbove: 'Erosive contact — exhumed by later uplift and erosion',
    erosionStyle: 'Flaggy slabs split along foliation; cleavage controls ridge and crag orientation. '
      + 'Garnet weathers free to form heavy-mineral placers in stream sediment.',
    waterInteraction: 'Low permeability routes water along foliation planes as thin films. '
      + 'Frost wedging along cleavage very effective above treeline.',
  },
  {
    name: 'Limestone',
    baseElevation: 180,
    color: '#A09080',
    hex: 0xa09080,
    vegetationDensity: 0.45,
    minerals: ['Calcite', 'Aragonite', 'Minor Clay', 'Chert nodules', 'Pyrite'],
    characteristics: 'Bioclastic and micritic shallow-marine limestone rich in macro-fossils. '
      + 'Chert nodules (flint) occur along specific beds as silicified sponge spicules. '
      + 'Stylolite seams record chemical compaction. '
      + 'Steeply dipping conjugate joints create a well-developed fracture network. '
      + 'Surface weathering creates "limestone pavement" (clint-and-grike) microrelief.',
    grainSize: 'Fine to medium (0.05–2 mm)',
    texture: 'Bioclastic grainstone to wackestone, micritic matrix, stylolites',
    fossils: 'Ammonites, Crinoids, Brachiopods, Echinoids, Colonial corals, Belemnites',
    age: 'Devonian (~380 Ma)',
    hardness: 3,
    porosity: 0.08,
    permeability: 'Low–moderate (matrix + fracture)',
    jointSpacing: '0.2 – 0.8 m',
    jointSets: 2,
    jointAzimuth: 30,
    weatheringRate: 'Moderate (dissolution in rain, rapid in karst zones)',
    chemicalReactivity: 'High — CaCO₃ + H₂CO₃ → Ca²⁺ + 2HCO₃⁻; effervesces in HCl',
    mechanicalStrength: 70,
    hydraulicRole: 'Fractured limestone aquifer; spring line at base',
    fractureAperture: 0.8,
    contactBelow: 'Conformable gradational contact with Schist',
    contactAbove: 'Disconformity — erosion surface overlain by Quaternary Alluvium',
    erosionStyle: 'Clint-and-grike karst pavement; cave collapse dolines; tufa precipitates at springs. '
      + 'Chert nodules resist weathering and accumulate as surface rubble.',
    waterInteraction: 'Rapid dissolution shapes lake margins into undercut notches. '
      + 'Karst springs discharge Ca-HCO₃ water; tufa build-up downstream. '
      + 'Lake water pH buffered by carbonate equilibrium.',
  },
  {
    name: 'Alluvium & Topsoil',
    baseElevation: 220,
    color: '#6D8B50',
    hex: 0x6d8b50,
    vegetationDensity: 1.0,
    minerals: ['Clay (Kaolinite, Smectite)', 'Quartz sand', 'Gravel', 'Organic matter', 'Iron oxides'],
    characteristics: 'Heterogeneous unconsolidated Quaternary deposit: '
      + 'fluvial gravel-sand in channel belts, overbank silt-clay flood plain, '
      + 'colluvial slope-wash, organic-rich top-soil horizon (A-horizon up to 0.3 m). '
      + 'Pebble lithologies reflect upstream bedrock. '
      + 'Iron-oxide mottling in gleyed sub-soils indicates seasonal waterlogging.',
    grainSize: 'Mixed — pebble gravel to clay; A-horizon dominated by silt',
    texture: 'Massive to horizontally laminated; occasional imbrication in gravel',
    fossils: 'Plant rootlets, charcoal fragments, pollen (sub-fossil), occasional mammal bones',
    age: 'Quaternary (<2 Ma, mostly Holocene <11.7 ka)',
    hardness: 1,
    porosity: 0.35,
    permeability: 'High (sand/gravel); Variable (clay lenses act as aquitards)',
    jointSpacing: 'N/A (unconsolidated)',
    jointSets: 0,
    jointAzimuth: null,
    weatheringRate: 'Rapid (subject to gullying, sheet wash, bioturbation)',
    chemicalReactivity: 'Moderate — organic acids, Fe²⁺/Fe³⁺ cycling, clay exchange reactions',
    mechanicalStrength: 0.1,
    hydraulicRole: 'Unconfined shallow aquifer; main recharge zone for deeper systems',
    fractureAperture: null,
    contactBelow: 'Unconformity — erosion surface incised into bedrock by river or glacial action',
    contactAbove: 'Surface (eroding / accreting)',
    erosionStyle: 'Sheetwash, rill erosion, river bank collapse, soil creep on slopes > 5°. '
      + 'Rapid incision if base level drops.',
    waterInteraction: 'Stores vadose and phreatic water; controls base flow in rivers. '
      + 'Seasonal waterlogging produces reducing conditions above clay lenses. '
      + 'River-bank alluvium directly communicates with stream — hyporheic exchange.',
  },
];

// ================================================================
//  LAYER INTERACTIONS (adjacent-pair geological processes)
// ================================================================
/**
 * Describes what happens at each stratigraphic contact and how
 * adjacent layers interact physically and chemically.
 */
export const LAYER_INTERACTIONS = [
  {
    upper: 'Dolomitic Limestone',
    lower: 'Granite Gneiss',
    contactType: 'Angular Unconformity',
    description: 'A ~800 Ma gap in the record. The basement was eroded to a peneplain before '
      + 'carbonate deposition. Basal dolomite often contains rip-up clasts of gneiss. '
      + 'Hydrothermal fluids migrating up from the basement can dolomitise the overlying limestone.',
    hydrogeology: 'Spring line at contact — groundwater perched on impermeable basement.',
    hazard: null,
  },
  {
    upper: 'Sandstone & Shale',
    lower: 'Dolomitic Limestone',
    contactType: 'Disconformity',
    description: 'Minor erosion surface. Freshwater springs discharge at this level because '
      + 'permeable sandstone beds overlie the karst-vulnerable dolomite, creating a '
      + 'hydraulic gradient that drives lateral flow and surface spring emergence.',
    hydrogeology: 'Perched spring horizon. Dolomite karst drainage recharges sandstone aquifer at contact.',
    hazard: 'Karst subsidence — dissolution of dolomite can cause sudden collapse of overlying sandstone.',
  },
  {
    upper: 'Schist',
    lower: 'Sandstone & Shale',
    contactType: 'Tectonic Unconformity / Thrust Contact',
    description: 'The schist was emplaced by a low-angle thrust over the sedimentary sequence. '
      + 'A zone of fault gouge and breccia (5–30 m thick) marks the contact. '
      + 'Mylonite fabrics in the lowermost schist record ductile shearing. '
      + 'The contact dips ~15° to the NW, exposed on valley walls as a colour break from dark schist to buff sandstone.',
    hydrogeology: 'Fault zone acts as conduit for mineralised fluids; sulphide-bearing veins typical.',
    hazard: 'Landslide plane — weak gouge + steep scarp = risk of translational slides after rain.',
  },
  {
    upper: 'Limestone',
    lower: 'Schist',
    contactType: 'Conformable — gradational',
    description: 'The schistose basement was gradually buried by transgressing carbonate seas. '
      + 'The lowermost limestone beds contain reworked mica flakes and schist pebbles. '
      + 'A calcite vein network penetrates the upper schist along joint planes, '
      + 'recorded as white veins visible at 1–10 m scale.',
    hydrogeology: 'Calcium-rich springs discharge at contact — schist provides template for vein calcite.',
    hazard: null,
  },
  {
    upper: 'Alluvium & Topsoil',
    lower: 'Limestone',
    contactType: 'Erosional Unconformity',
    description: 'Quaternary glaciers and rivers excavated deep into the limestone, then left '
      + 'unconsolidated fill as they retreated. The base of the alluvium typically '
      + 'follows former glacial scour surfaces. Sinkholes developed in the limestone '
      + 'can swallow surface alluvium catastrophically.',
    hydrogeology: 'High recharge into underlying limestone karst; river loses water to sink-points.',
    hazard: 'Sinkhole collapse under alluvium cover. Contamination of karst aquifer from surface.',
  },
];

// ================================================================
//  ACTIVE GEOLOGICAL PROCESSES
// ================================================================
/**
 * Ongoing processes operating across the landscape at various timescales.
 */
export const GEOLOGICAL_PROCESSES = [
  {
    name: 'Karst Dissolution',
    affectedLayers: ['Dolomitic Limestone', 'Limestone'],
    timescale: '10²–10⁵ years',
    description: 'Rainwater (pH ~5.6) dissolves carbonate rocks along joints. '
      + 'Dissolution rate ~0.02–0.1 mm/yr on exposed surfaces, faster in runoff zones. '
      + 'Lakes accumulate Ca²⁺ and HCO₃⁻ hardness. Tufa precipitates at spring outlets.',
    visualSign: 'Pitted rock surfaces, rock pools, undercut lake shores, white tufa deposits',
  },
  {
    name: 'Differential Erosion',
    affectedLayers: ['Sandstone & Shale'],
    timescale: '10³–10⁶ years',
    description: 'Resistant sandstone beds stand proud as cliffs and caps; '
      + 'weaker shale erodes to gentler slopes and gullies. '
      + 'River incision follows shale partings, creating stepped valley profiles.',
    visualSign: 'Cliff-bench topography, angular escarpments, overhang formations',
  },
  {
    name: 'Feldspar Hydrolysis (Chemical Weathering)',
    affectedLayers: ['Granite Gneiss', 'Sandstone & Shale'],
    timescale: '10⁴–10⁷ years',
    description: '2KAlSi₃O₈ + 2H₂O + CO₂ → Al₂Si₂O₅(OH)₄ + 4SiO₂ + K₂CO₃. '
      + 'Feldspar converts to kaolinite clay; released silica cements sandstone or enters rivers.',
    visualSign: 'Pale yellowish weathering rind, clay-rich decomposed granite (grus) in low areas',
  },
  {
    name: 'Joint Propagation by Frost Wedging',
    affectedLayers: ['Granite Gneiss', 'Schist', 'Limestone'],
    timescale: '10¹–10³ years',
    description: 'Water infiltrates joints and expands 9% on freezing, exerting ~150 MPa. '
      + 'Repeated cycles widen joints by microcracking. Rate highest above 1200 m where '
      + 'freeze-thaw cycles are ≥50/yr.',
    visualSign: 'Angular frost-shattered rubble (felsenmeer), widened joint apertures, block topple',
  },
  {
    name: 'Fluvial Sediment Transport',
    affectedLayers: ['Alluvium & Topsoil'],
    timescale: '10⁰–10³ years',
    description: 'The Serpent River mobilises bed load (gravel–sand) in floods and transports '
      + 'suspended silt–clay during moderate flows. Sediment load peaks after rain events. '
      + 'Point bars accrete on inner meander bends; outer banks undercut.',
    visualSign: 'Turbid river water after rain, gravel bars, cut banks, meander migration',
  },
  {
    name: 'Hyporheic Exchange',
    affectedLayers: ['Alluvium & Topsoil'],
    timescale: 'Hours–days',
    description: 'River water exchanges with shallow groundwater in the alluvial gravel '
      + 'beneath and beside the channel. This mediates temperature, dissolved oxygen, '
      + 'and nutrient cycling. The hyporheic zone supports unique micro-invertebrates.',
    visualSign: 'Wet gravel bars, seeps along riverbank, cool bank storage in summer',
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
