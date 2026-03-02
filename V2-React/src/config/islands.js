// ================================================================
//  ISLAND DEFINITIONS
//  Each entry describes a geological landscape available in the sim.
//  The first entry (id: 'survey') maps to the current terrain.
// ================================================================

export const ISLANDS = [
  {
    id: 'survey',
    name: 'Hadley Island',
    subtitle: 'Structural Geology Survey',
    tagline: 'Six geological layers. Faults. Karst. River drainage.',
    badge: 'Classic',
    badgeColor: '#58a6ff',
    description:
      'A 2 × 2 km field island exposing the full stratigraphic column — from '
      + 'Precambrian basement granite to Quaternary alluvium. Fault offsets, '
      + 'bedding dip, and hydraulic erosion have shaped the landscape into a '
      + 'textbook environment for structural mapping.',
    features: [
      { icon: '🪨', label: 'Stratigraphic Column', detail: '6 layers from Granite Gneiss (~1.8 Ga) to Alluvium (<10 ka)' },
      { icon: '⚡', label: 'Fault System', detail: 'Normal fault with ~12 m throw crossing the southern valley' },
      { icon: '💧', label: 'Karst Hydrology', detail: 'Dolomitic Limestone aquifer feeds five lake basins and the Serpent River' },
      { icon: '🏔️', label: 'Relief', detail: '~260 m of topographic relief; peaks at ~280 m, valley floors at ~20 m' },
      { icon: '🌱', label: 'Vegetation', detail: 'Density follows rock type — sparse on resistant granite, dense on alluvial soils' },
    ],
    tools: ['navigate', 'identify', 'drill', 'measure', 'strikeDip', 'crossSection'],
    difficulty: 'Standard',
    learningObjectives: [
      'Identify rock types by colour, texture, and morphology',
      'Measure strike and dip of bedding planes',
      'Interpret stratigraphic contacts and unconformities',
      'Trace fault offset across the topography',
      'Construct a geological cross-section',
    ],
  },
  {
    id: 'mysterious',
    name: 'The Mysterious Island',
    subtitle: 'Volcanic Hotspot Geology',
    tagline: 'Mantle plume. Caldera. Gold veins. Sinking fast.',
    badge: 'New',
    badgeColor: '#e05c3a',
    description:
      'A tectonically unstable volcanic uplift island in the South Pacific, built atop a '
      + 'mantle plume hotspot. The Golden Mountain stratovolcano dominates the interior '      + '(~750 m peak), ringed by 40–120 m basalt sea-cliffs, dense hyper-evolved jungle, '      + 'a collapsed caldera lake at the summit, and the Hidden Lagoon — a vast subsided '      + 'lava-tube crater at 220 m elevation. The island is actively sinking.',
    features: [
      { icon: '🌋', label: 'Stratovolcano', detail: 'Golden Mountain — composite shield + andesitic cone, ~750 m summit; active fumaroles' },
      { icon: '🕳️', label: 'Caldera Lake', detail: 'Collapse caldera at summit; ring-fault down-throw of 24 m; active hydrothermal system' },
      { icon: '💧', label: 'Hidden Lagoon', detail: 'Subsided lava-tube crater at 220 m ASL, 400 m across; collapsed tube voids below' },
      { icon: '🪨', label: '6 Volcanic Layers', detail: 'Basaltic Shield → Tholeiitic Flows → Pyroclastic Breccia → Andesitic Lava → Tephra → Andisol' },
      { icon: '⚡', label: 'Ring Fault & Dike Swarm', detail: '8 radial dikes + 380 m caldera ring fault; epithermal gold veins in hydrothermal zone' },
      { icon: '🌿', label: 'Jungle & Andisol', detail: 'Geothermally heated andisol (28–35 °C at 0.5 m) drives hyper-productive jungle biome' },
    ],
    tools: ['navigate', 'identify', 'drill', 'measure', 'strikeDip', 'crossSection'],
    difficulty: 'Advanced',
    learningObjectives: [
      'Identify volcanic rock types by texture, vesicularity, and composition',
      'Interpret stratovolcano stratigraphy from basaltic shield to surface andisol',
      'Recognise caldera structure, ring faults, and radial dike swarms',
      'Analyse epithermal gold mineralisation and hydrothermal alteration zones',
      'Map lahar deposits and reconstruct pyroclastic eruption sequences',
      'Understand how mantle-plume hotspot volcanism builds and destroys islands',
    ],
  },
  {
    id: 'volcanic',
    name: 'Kaleo Island',
    subtitle: 'Volcanic Arc Geology',
    tagline: 'Lava flows. Calderas. Hydrothermal vents.',
    badge: 'Coming Soon',
    badgeColor: '#d29922',
    description:
      'A young oceanic island constructed entirely from volcanic products — '
      + 'basaltic lava flows, tephra cone sequences, and a collapsed caldera. '
      + 'Hydrothermal activity alters the flanks, while coastal erosion cuts '
      + 'spectacular sea-cliffs through the layered extrusive pile.',
    features: [
      { icon: '🌋', label: 'Lava Stratigraphy', detail: 'Hawaiite → mugearite → trachyte compositional sequence' },
      { icon: '🕳️', label: 'Caldera', detail: '1.2 km wide collapse caldera with resurgent dome' },
      { icon: '♨️', label: 'Hydrothermal', detail: 'Fumaroles and solfataras alter basalt to clay and sulphur minerals' },
      { icon: '🌊', label: 'Coastal Cliffs', detail: 'Wave-cut platforms expose palagonite tuff and pillow lava at sea level' },
    ],
    tools: ['navigate', 'identify', 'drill', 'measure'],
    difficulty: 'Advanced',
    learningObjectives: [
      'Distinguish effusive from explosive volcanic products',
      'Map lava flow sequences and eruption episodes',
      'Identify hydrothermal alteration zones',
      'Interpret caldera collapse and resurgence',
    ],
    disabled: true,
  },
  {
    id: 'arctic',
    name: 'Norden Ridge',
    subtitle: 'Glacial & Periglacial Geology',
    tagline: 'Moraines. Drumlin fields. Patterned ground.',
    badge: 'Coming Soon',
    badgeColor: '#d29922',
    description:
      'A high-latitude ridge landscape shaped by Quaternary glaciation. '
      + 'Ice-moulded bedrock, drumlin swarms, lateral moraines, and pro-glacial '
      + 'lake deposits record three glacial advances. Active periglacial '
      + 'processes — frost wedging, solifluction, and patterned ground — '
      + 'continue to remodel the surface today.',
    features: [
      { icon: '🧊', label: 'Glacial Landforms', detail: 'Striations, roches moutonnées, cirques, and U-shaped valleys' },
      { icon: '🏕️', label: 'Moraine Complex', detail: 'Three terminal moraines recording separate glacial maxima' },
      { icon: '❄️', label: 'Periglacial Active Layer', detail: 'Seasonal freeze–thaw drives polygon formation and solifluction lobes' },
      { icon: '🦎', label: 'Erratic Boulders', detail: 'Far-travelled granite erratics record ice-flow direction from the NW' },
    ],
    tools: ['navigate', 'identify', 'measure', 'strikeDip'],
    difficulty: 'Intermediate',
    learningObjectives: [
      'Identify and map glacial erosion and depositional features',
      'Reconstruct ice-flow direction from striae and erratics',
      'Interpret Quaternary climate change from the sedimentary record',
      'Recognise periglacial sorting and patterned-ground morphology',
    ],
    disabled: true,
  },
];
