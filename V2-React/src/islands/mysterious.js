// ================================================================
//  MYSTERIOUS ISLAND  ("mysterious")
//  Journey 2: The Mysterious Island (2012 Film) — Movie-Accurate
//
//  This is a TECTONICALLY UNSTABLE, MULTI-PROVINCE VOLCANIC UPLIFT
//  ISLAND with asymmetric geomorphology — NOT a single cone volcano.
//
//  The island features:
//    • Coastal cliff ring (asymmetric, jagged)
//    • Offset Hidden Lagoon basin (collapsed crater)
//    • River canyon system with 60m waterfall
//    • Secondary ridge belt (fault-controlled)
//    • Hydrothermal vent field
//    • Lava tube cavern network (Nautilus dock)
//    • Central Golden Mountain stratovolcano (blending into terrain)
//    • Structural fault system (ring + radial)
//    • Subsurface magma chamber
//    • Regional subsidence
//    • Dense jungle biome zones
//
//  Coordinate System (Engine):
//    Origin (0, 0) = Golden Mountain summit
//    Engine window: 2000 × 2000 units
//    Scale: 1 engine unit = 16 real meters
//    +X = East, -X = West, +Z = North, -Z = South
//    Island boundary: (x²/16000²) + (z²/14000²) ≤ 1 (real meters)
//
//  Stratigraphy (deep → surface):
//    1. Basaltic Shield      (Miocene–Pliocene)
//    2. Tholeiitic Lava Flows (Pliocene–Pleistocene)
//    3. Pyroclastic Breccia  (Pleistocene)
//    4. Andesitic Lava       (Pleistocene–Holocene)
//    5. Tephra & Lapilli     (Late Pleistocene–Holocene)
//    6. Volcanic Ash & Andisol (Holocene)
// ================================================================
import { fbm, ridgeNoise } from '../engine/noise';
import { subdivideRiverPath } from '../engine/TerrainGenerator';

// ── Configuration Constants ───────────────────────────────────
// Engine scale: 2000 × 2000 grid represents 32 × 28 km real world (1:16).
const ISLAND_WORLD_SCALE = 1.8;
const S = (value) => value * ISLAND_WORLD_SCALE;

const TERRAIN_SIZE = Math.round(2000 * ISLAND_WORLD_SCALE);
const SEGMENTS     = 512;
const WATER_LEVEL  = 38;

// Real-world to engine coordinate conversion factor
const SCALE = 16;  // 1 engine unit = 16 meters

// ── Movie-Accurate Province Coordinates (Engine Units) ────────
// All coordinates from the master blueprint divided by SCALE

// Golden Mountain Stratovolcano
const VOLCANO = {
  cx: 0, cz: 0,
  peakElevation: 100,        // 1600m / 16 = 100 eng
  craterRadius: S(75),       // 1200m / 16 = 75 eng
  craterFloorElev: 97,       // 1550m / 16 = 97 eng (crater floor)
  craterRimElev: 109,        // 1750m / 16 = 109 eng
  baseRadius: S(375),        // 6000m / 16 = 375 eng
};

// Hidden Lagoon Basin (Collapsed Secondary Crater)
const LAGOON = {
  cx: S(-375), cz: S(250),   // (-6000, 4000) / 16
  radius: S(56),             // 900m / 16 = 56 eng
  surfaceElevation: 14,      // 220m / 16 = ~14 eng
  waterDepth: 1.1,           // 18m / 16 = ~1 eng
  innerCliffHeight: 8.75,    // 140m / 16 = ~9 eng
};

// Nautilus Dock Cavern (Full Structural Detail)
const NAUTILUS = {
  // Location coordinates
  entranceCx: S(-394), entranceCz: S(231),  // (-6300, 3700) / 16
  chamberCx: S(-381), chamberCz: S(244),    // (-6100, 3900) / 16
  length: S(16.25),          // 260m / 16
  width: S(11.25),           // 180m / 16
  elevation: 13.4,           // 215m / 16
  depth: -2.5,               // -40m relative
  ceilingHeight: 2.8,        // 45m / 16
  steamVentCx: S(-378), steamVentCz: S(251), // (-6050, 4020) / 16
  
  // Structural features (engineered elements)
  structures: {
    stoneDockPlatform: {
      cx: S(-378), cz: S(250),
      length: S(8),           // 128m / 16
      width: S(3),            // 48m / 16
      elevation: -2.2,        // -35m relative
      material: 'basalt-block',
      condition: 'ancient-weathered',
    },
    ironRailings: {
      present: true,
      sections: 6,
      heightAboveDeck: 0.07,  // 1.1m / 16
      material: 'wrought-iron',
      condition: 'rusted-intact',
    },
    timberDecking: {
      cx: S(-378), cz: S(250),
      length: S(6),
      width: S(2.5),
      material: 'teak',
      condition: 'weathered-stable',
    },
    dockingCradle: {
      cx: S(-375), cz: S(248),
      length: S(10),          // submarine berth
      width: S(3.5),
      depth: -2.8,
      material: 'carved-basalt',
    },
    mooringPosts: [
      { cx: S(-382), cz: S(252), height: 0.12 },
      { cx: S(-382), cz: S(246), height: 0.12 },
      { cx: S(-374), cz: S(252), height: 0.12 },
      { cx: S(-374), cz: S(246), height: 0.12 },
    ],
  },
  
  // Cavern environment
  environment: {
    ceiling: {
      type: 'arched-lava-tube',
      height: 2.8,
      stalactites: true,
      sulfurStaining: true,
      stainColor: '#C4A000',
    },
    steamFissures: [
      { cx: S(-385), cz: S(255), intensity: 0.7 },
      { cx: S(-372), cz: S(248), intensity: 0.5 },
    ],
    waterLevel: {
      depth: 1.8,             // partially water-filled
      clarity: 0.6,
      temperature: 28,        // geothermally warmed
    },
    lighting: {
      type: 'volumetric-steam',
      shafts: [
        { angle: 0.3, intensity: 0.4 },  // light through entrance
      ],
      ambientColor: '#2A3D4A',
    },
  },
  
  // Access tunnel from lagoon
  accessTunnel: {
    entranceCx: S(-394), entranceCz: S(231),
    chamberCx: S(-381), chamberCz: S(244),
    width: S(5),              // 80m / 16
    height: 3.5,              // 56m / 16
    curvature: 0.15,          // slight bend
    waterDepth: 1.5,
  },
};

// Lost City + Archaeological Architecture System
const LOST_CITY = {
  cx: S(-420),
  cz: S(180),
  plateauRadius: S(120),
  outerDistrictRadius: S(220),
  plateauElevation: WATER_LEVEL + 188,
  plazaRadius: S(25),
  canalWaterLevel: WATER_LEVEL + 10,
  terraces: [
    { inner: S(40), outer: S(60), offset: 12 },
    { inner: S(60), outer: S(90), offset: 8 },
    { inner: S(90), outer: S(120), offset: 6 },
  ],
};

const LOST_CITY_CANALS = {
  widthMin: S(6),
  widthMax: S(12),
  depth: 6,
  radial: [
    { angle: 0.15, length: S(150), width: S(9) },
    { angle: 1.10, length: S(165), width: S(8) },
    { angle: 2.20, length: S(160), width: S(7) },
    { angle: 3.15, length: S(145), width: S(10) },
    { angle: 4.30, length: S(150), width: S(8) },
  ],
};

const LOST_CITY_CAUSEWAY = {
  startX: LOST_CITY.cx,
  startZ: LOST_CITY.cz,
  endX: LAGOON.cx,
  endZ: LAGOON.cz,
  width: S(14),
  crestElevation: WATER_LEVEL + 13,
};

const NAUTILUS_BAY = {
  cx: S(-375),
  cz: S(250),
  harborRadius: S(70),
  dockElevation: WATER_LEVEL + 8,
  chamberRx: S(100),
  chamberRz: S(70),
  chamberDepth: 72,
};

const COLLAPSING_TOWER = {
  cx: S(210),
  cz: S(-380),
  height: 45,
  leanDegrees: 8,
};

// Secondary Ridge (Fault-Controlled Uplift)
const SECONDARY_RIDGE = {
  startX: S(-500), startZ: S(-375),  // (-8000, -6000) / 16
  endX: S(375), endZ: S(-500),       // (6000, -8000) / 16
  elevation: 50,               // 700-900m / 16 = 44-56 eng (avg 50)
  width: S(130),               // ~2km wide influence zone
};

// Hydrothermal Vent Field
const VENT_FIELD = {
  cx: S(250), cz: S(-125),    // (4000, -2000) / 16
  radius: S(19),               // 300m / 16
  suppressionRadius: S(31),    // 500m / 16
  elevation: 31,               // 500m / 16
};

// Ring Fault System
const RING_FAULT = {
  radius: S(250),              // 4000m / 16 = 250 eng
  displacement: 0.5,           // 6-12m / 16 = ~0.5 eng vertical drop
};

// River System
const CASCADE_RIVER = {
  sourceX: S(125), sourceZ: S(313),  // (2000, 5000) / 16
  sourceElevation: 56,         // 900m / 16
  waterfallX: S(-188), waterfallZ: S(188),  // (-3000, 3000) / 16
  waterfallDrop: 3.75,         // 60m / 16
  mouthX: S(-325), mouthZ: S(238),   // (-5200, 3800) / 16
  canyonDepth: 7.5,            // 120m / 16
};

// Coastal Cliff Segments (Asymmetric)
const CLIFF_SEGMENTS = [
  { name: 'West Amphitheater',  cx: S(-988), cz: 0,       height: 7.5,  azimuthCenter: Math.PI },      // (-15800, 0) / 16, 120m
  { name: 'North Pillars',      cx: 0,       cz: S(863),  height: 6.25, azimuthCenter: Math.PI/2 },    // (0, 13800) / 16, 100m
  { name: 'East Broken Cliffs', cx: S(925),  cz: 0,       height: 4.4,  azimuthCenter: 0 },            // (14800, 0) / 16, 70m
  { name: 'South Shear Zone',   cx: 0,       cz: S(-844), height: 5.3,  azimuthCenter: -Math.PI/2 },   // (0, -13500) / 16, 85m
];

// ══════════════════════════════════════════════════════════════
//  PROCEDURAL LAVA FLOW SYSTEM
//  8 radial tongues with channels + levees + clinker roughness
// ══════════════════════════════════════════════════════════════
const LAVA_FLOW_AXES = [
  { angle: 0.10, length: S(330), width: S(42), originR: S(24) },
  { angle: 0.95, length: S(280), width: S(32), originR: S(20) },
  { angle: 1.62, length: S(300), width: S(28), originR: S(16) },
  { angle: 2.35, length: S(260), width: S(24), originR: S(18) },
  { angle: 3.08, length: S(340), width: S(45), originR: S(26) },
  { angle: 3.85, length: S(240), width: S(22), originR: S(14) },
  { angle: 4.72, length: S(310), width: S(34), originR: S(22) },
  { angle: 5.42, length: S(220), width: S(20), originR: S(12) },
];

const LAVA_COLLAPSE_SCAR = {
  angle: 2.55,
  radius: S(190),
};

// ══════════════════════════════════════════════════════════════
//  LAVA TUBE NETWORK
//  Primary tube from volcano toward lagoon, secondary branches
//  Tube diameters: 8–25 m (0.5–1.6 eng)
// ══════════════════════════════════════════════════════════════
const LAVA_TUBES = {
  primary: {
    name: 'Main Lagoon Tube',
    // Path from near (0, 1500) descending toward lagoon system
    path: [
      { x: 0,       z: S(94),  depth: -1.25 }, // (0, 1500) / 16, -20m
      { x: S(-63),  z: S(113), depth: -1.9 },
      { x: S(-125), z: S(138), depth: -2.5 },
      { x: S(-200), z: S(163), depth: -3.1 },
      { x: S(-288), z: S(194), depth: -3.4 },
      { x: S(-381), z: S(231), depth: -2.5 },
    ],
    diameterRange: [1.0, 1.6],  // 16–25 m in real
    skylights: [
      { x: S(-125), z: S(138), radius: S(6) },
      { x: S(-200), z: S(163), radius: S(4) },
    ],
  },
  secondary: [
    {
      name: 'Western Branch',
      path: [
        { x: S(-125), z: S(138), depth: -2.5 },
        { x: S(-188), z: S(125), depth: -2.8 },
        { x: S(-250), z: S(125), depth: -3.1 },
      ],
      diameterRange: [0.5, 1.0],  // 8–16 m
    },
    {
      name: 'Eastern Branch',
      path: [
        { x: 0,      z: S(94),  depth: -1.25 },
        { x: S(63),  z: S(31),  depth: -1.9 },
        { x: S(125), z: S(-31), depth: -2.5 },
        { x: S(156), z: S(-94), depth: -3.1 },
      ],
      diameterRange: [0.5, 0.9],  // 8–14 m
    },
  ],
  features: {
    stalactites: true,
    calciteDeposition: true,
    steamPockets: true,
    chokePoints: [
      { x: S(-200), z: S(163), minDiameter: 0.5 },
    ],
  },
};

// ══════════════════════════════════════════════════════════════
//  GOLDEN MOUNTAIN SUMMIT FEATURES
//  Active fumaroles, sulfur crusts, ground cracks, minor vents
// ══════════════════════════════════════════════════════════════
const SUMMIT_FEATURES = {
  fumaroles: [
    { cx: S(8),   cz: S(12),  temp: 380, radius: S(3) },
    { cx: S(-15), cz: S(5),   temp: 320, radius: S(2.5) },
    { cx: S(10),  cz: S(-8),  temp: 290, radius: S(2) },
    { cx: S(-5),  cz: S(-18), temp: 340, radius: S(3.2) },
    { cx: S(22),  cz: S(3),   temp: 260, radius: S(1.8) },
  ],
  sulfurCrustZone: {
    cx: 0, cz: 0,
    radius: S(50),       // 800m / 16 = 50 eng
    intensity: 0.8,      // yellow tint strength
    color: '#C4A000',
  },
  groundCracks: [
    { startX: S(-25), startZ: S(30),  endX: S(15),  endZ: S(45),  width: 0.3 },
    { startX: S(20),  startZ: S(-10), endX: S(40),  endZ: S(25),  width: 0.25 },
    { startX: S(-35), startZ: S(-5),  endX: S(-10), endZ: S(-30), width: 0.35 },
  ],
  steamPlumes: [
    { cx: 0,       cz: 0,       radius: S(25), height: 120 },
    { cx: S(8),    cz: S(12),   radius: S(8),  height: 45 },
    { cx: S(-15),  cz: S(5),    radius: S(6),  height: 35 },
  ],
  minorVentCones: [
    { cx: S(45),  cz: S(20),  baseRadius: S(12), height: 18 },
    { cx: S(-38), cz: S(35),  baseRadius: S(8),  height: 12 },
    { cx: S(30),  cz: S(-45), baseRadius: S(10), height: 14 },
  ],
  ringFaultScar: {
    visibleArc: { startAngle: -0.3, endAngle: 1.2 },  // radians, partial exposure
    scarpHeight: 8,   // 128m / 16
    fractureZoneWidth: 15,
  },
};

// ══════════════════════════════════════════════════════════════
//  SEA CAVES AND COASTAL FEATURES
//  Wave-cut caves, terraces, basalt columns, black sand coves
// ══════════════════════════════════════════════════════════════
const SEA_CAVES = [
  {
    name: 'West Amphitheater Caves',
    segment: 'West Amphitheater',
    caves: [
      { cx: S(-938), cz: S(50),  depth: 25, width: S(8),  height: 12 },
      { cx: S(-950), cz: S(-30), depth: 35, width: S(12), height: 18 },
      { cx: S(-925), cz: S(80),  depth: 18, width: S(6),  height: 10 },
    ],
    basaltColumns: { present: true, columnDiameter: 0.8, spacing: 1.2 },
    waveCutTerrace: { elevation: WATER_LEVEL + 2, width: S(8) },
  },
  {
    name: 'North Pillar Caves',
    segment: 'North Pillars',
    caves: [
      { cx: S(40),  cz: S(830), depth: 20, width: S(10), height: 15 },
      { cx: S(-25), cz: S(845), depth: 28, width: S(8),  height: 12 },
    ],
    basaltColumns: { present: true, columnDiameter: 1.0, spacing: 1.5 },
    seaStacks: [
      { cx: S(60),  cz: S(880), baseRadius: S(8), height: 25 },
      { cx: S(-40), cz: S(895), baseRadius: S(6), height: 18 },
    ],
  },
  {
    name: 'East Broken Caves',
    segment: 'East Broken Cliffs',
    caves: [
      { cx: S(890), cz: S(35),  depth: 15, width: S(7), height: 9 },
      { cx: S(905), cz: S(-50), depth: 22, width: S(9), height: 11 },
    ],
    naturalArches: [
      { cx: S(880), cz: 0, span: S(12), height: 8, thickness: S(3) },
    ],
  },
  {
    name: 'South Shear Caves',
    segment: 'South Shear Zone',
    caves: [
      { cx: S(30),  cz: S(-810), depth: 30, width: S(11), height: 14 },
      { cx: S(-45), cz: S(-825), depth: 25, width: S(8),  height: 10 },
    ],
    blackSandCoves: [
      { cx: 0,      cz: S(-795), rx: S(20), rz: S(12) },
      { cx: S(60),  cz: S(-805), rx: S(15), rz: S(10) },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
//  WATERFALL LEDGE STRUCTURE
//  60m vertical drop with basalt overhang and plunge pool
// ══════════════════════════════════════════════════════════════
const WATERFALL_LEDGE = {
  cx: CASCADE_RIVER.waterfallX,  // (-3000, 3000) / 16 = (-188, 188)
  cz: CASCADE_RIVER.waterfallZ,
  overhang: {
    depth: S(4),        // 64m / 16 = 4 eng overhang projection
    height: 3.75,       // 60m / 16 = 3.75 eng vertical drop
    width: S(8),        // 128m / 16 = 8 eng ledge width
  },
  plungePool: {
    cx: S(-192),        // slightly offset downstream
    cz: S(185),
    radius: S(6),       // 96m / 16
    depth: 1.25,        // 20m / 16
  },
  mistPlume: {
    radius: S(12),
    height: 25,
    opacity: 0.6,
  },
  wetRockZone: {
    radius: S(15),
    slipperiness: 0.9,
  },
};

// ══════════════════════════════════════════════════════════════
//  LAGOON INNER CLIFF RING
//  Steep enclosing faces, overhanging ledges, narrow paths
// ══════════════════════════════════════════════════════════════
const LAGOON_CLIFFS = {
  cx: LAGOON.cx,
  cz: LAGOON.cz,
  innerRadius: LAGOON.radius * 0.95,
  outerRadius: LAGOON.radius * 1.2,
  cliffHeight: LAGOON.innerCliffHeight,
  features: {
    overhangingLedges: [
      { angle: 0.5,   depth: 2, width: 8 },
      { angle: 2.1,   depth: 1.5, width: 6 },
      { angle: 4.2,   depth: 2.5, width: 10 },
    ],
    narrowPaths: [
      { startAngle: 0.8, endAngle: 1.4, width: 1.5, elevation: 0.5 },
      { startAngle: 3.5, endAngle: 4.0, width: 2.0, elevation: 0.3 },
    ],
    rockfallDebris: [
      { cx: S(-385), cz: S(262), radius: S(8), density: 0.7 },
      { cx: S(-360), cz: S(238), radius: S(6), density: 0.5 },
    ],
  },
  jungleRim: {
    densityBoost: 2.0,  // 2x vegetation at rim
  },
};

// ══════════════════════════════════════════════════════════════
//  JUNGLE DENSITY ZONES
//  Spatial vegetation density variation as per spec
// ══════════════════════════════════════════════════════════════
const JUNGLE_DENSITY_ZONES = [
  {
    name: 'Peak Density Zone',
    cx: S(-250), cz: S(125),      // (-4000, 2000) / 16 — highest density
    radius: S(125),               // 2km / 16
    densityMultiplier: 1.5,
    features: ['giantFerns', 'massiveCycads', 'denseBamboo', 'thickCanopy', 'lianaVines'],
  },
  {
    name: 'Lagoon Riparian',
    cx: LAGOON.cx, cz: LAGOON.cz,
    radius: LAGOON.radius * 1.5,
    densityMultiplier: 2.0,  // 2x density at lagoon perimeter
    features: ['riparianVegetation', 'ferns', 'moistureLovers'],
  },
  {
    name: 'River Corridor',
    followsRiver: 'Cascade River',
    corridorWidth: S(30),
    densityMultiplier: 1.8,
    features: ['riparianVegetation', 'bamboo', 'lianas'],
  },
  {
    name: 'Hydrothermal Suppression',
    cx: VENT_FIELD.cx, cz: VENT_FIELD.cz,
    radius: VENT_FIELD.suppressionRadius,
    densityMultiplier: 0.5,  // 50% reduction
    features: ['heatTolerantScrub', 'deadTrees', 'mineralCrusts'],
  },
  {
    name: 'Summit Barren',
    cx: 0, cz: 0,
    radius: S(100),          // 1600m / 16 — near summit
    densityMultiplier: 0.1,
    features: ['bareRock', 'sulfurCrusts', 'lichens'],
  },
];

// ══════════════════════════════════════════════════════════════
//  HYDROTHERMAL FIELD STRUCTURES (Enhanced)
//  Steam vents, mineral crusts, hot pools, vegetation die-off
// ══════════════════════════════════════════════════════════════
const HYDROTHERMAL_STRUCTURES = {
  cx: VENT_FIELD.cx,
  cz: VENT_FIELD.cz,
  activeZoneRadius: VENT_FIELD.radius,
  suppressionRadius: VENT_FIELD.suppressionRadius,
  steamVentClusters: [
    { cx: S(250), cz: S(-125), count: 8, radius: S(6), avgTemp: 180 },
    { cx: S(258), cz: S(-118), count: 5, radius: S(4), avgTemp: 220 },
    { cx: S(242), cz: S(-130), count: 6, radius: S(5), avgTemp: 160 },
  ],
  mineralCrustMounds: [
    { cx: S(248), cz: S(-120), radius: S(4), height: 1.2, composition: 'sulfur-silica' },
    { cx: S(255), cz: S(-128), radius: S(3), height: 0.8, composition: 'iron-oxide' },
    { cx: S(245), cz: S(-132), radius: S(5), height: 1.5, composition: 'geyserite' },
  ],
  hotPools: [
    { cx: S(252), cz: S(-122), rx: S(3), rz: S(2.5), temp: 85, color: '#6BC4D8' },
    { cx: S(246), cz: S(-128), rx: S(2), rz: S(2),   temp: 72, color: '#8FD4A0' },
  ],
  discoloredGround: {
    cx: VENT_FIELD.cx, cz: VENT_FIELD.cz,
    radius: S(25),
    colors: ['#C4A000', '#8B4513', '#D2691E', '#FFFFFF'],  // sulfur, iron, rust, silica
  },
  fissurecracks: [
    { startX: S(240), startZ: S(-115), endX: S(260), endZ: S(-135), width: 0.2, steam: true },
    { startX: S(245), startZ: S(-140), endX: S(255), endZ: S(-110), width: 0.15, steam: true },
  ],
  vegetationDieOff: {
    radius: VENT_FIELD.suppressionRadius,
    deadTreeDensity: 0.3,
    bleachedColor: '#8B8378',
  },
};

// ── Volcanic Layer System ─────────────────────────────────────
const LAYERS = [
  {
    name: 'Basaltic Shield',
    baseElevation: 0,
    color: '#2A2727',
    hex: 0x2a2727,
    vegetationDensity: 0.02,
    minerals: [
      'Olivine', 'Augite', 'Labradorite Plagioclase',
      'Magnetite', 'Ilmenite', 'Zeolites (secondary)',
    ],
    characteristics:
      'The oldest exposed volcanic rock on the island — dense tholeiitic basalt erupted during the '
      + 'initial shield-building phase when the mantle plume hotspot first breached oceanic crust. '
      + 'Massive lava sheets (2–15 m thick) are separated by thin red palaeosol horizons. '
      + 'Columnar jointing (hexagonal columns 0.3–1 m diameter) develops in units thicker than ~5 m.',
    grainSize: 'Fine to medium (0.1–2 mm)',
    texture: 'Vesicular to massive; ophitic; columnar jointing; pillow structures at coast',
    fossils: 'None — volcanic.',
    age: 'Miocene–Pliocene (~6–3 Ma)',
    hardness: 8,
    porosity: 0.04,
    permeability: 'Low (fracture-controlled)',
    jointSpacing: '0.3–1 m (columnar)',
    jointSets: 3,
    jointAzimuth: null,
    weatheringRate: 'Very slow',
    mechanicalStrength: 220,
    fractureAperture: 0.5,
  },
  {
    name: 'Tholeiitic Lava Flows',
    baseElevation: 200,
    color: '#4A3728',
    hex: 0x4a3728,
    vegetationDensity: 0.55,
    minerals: [
      'Plagioclase', 'Augite', 'Orthopyroxene', 'Olivine',
      'Magnetite', 'Ilmenite', 'Calcite (vesicle fill)',
    ],
    characteristics:
      'Successive flood basalt flows as the shield volcano grew above sea level. '
      + 'Each flow unit (0.5–8 m thick) shows three-part architecture: glassy chilled base, '
      + 'vesicular scoriaceous top, and dense crystalline interior. '
      + 'Lava tube voids up to 8 m diameter — Hidden Lagoon formed from collapsed tube system.',
    grainSize: 'Very fine to fine (0.01–1 mm)',
    texture: 'Pahoehoe to aa transition; scoriaceous tops; lava tube voids',
    fossils: 'None — volcanic.',
    age: 'Pliocene–Pleistocene (~3–1 Ma)',
    hardness: 7,
    porosity: 0.12,
    permeability: 'Moderate',
    jointSpacing: '0.5–3 m',
    jointSets: 2,
    jointAzimuth: 135,
    weatheringRate: 'Slow–moderate',
    mechanicalStrength: 160,
    fractureAperture: 0.8,
  },
  {
    name: 'Pyroclastic Breccia',
    baseElevation: 390,
    color: '#7D5040',
    hex: 0x7d5040,
    vegetationDensity: 0.65,
    minerals: [
      'Volcanic Glass (sideromelane/tachylite)', 'Plagioclase phenocrysts',
      'Pyroxene lithics', 'Sulphur crystals', 'Alunite', 'Kaolinite',
    ],
    characteristics:
      'Poorly sorted volcaniclastic deposits from explosive Vulcanian and Plinian activity. '
      + 'Includes lahar units, pyroclastic surge deposits with accretionary lapilli, '
      + 'and block-and-ash flow deposits from dome-collapse events. '
      + 'Sulphur-yellow fumarolic alteration and bleached kaolinite-alunite zones near vents.',
    grainSize: 'Very poorly sorted — clay to 2 m blocks; modal size 5–50 mm',
    texture: 'Massive (lahar); cross-bedded (surge); accretionary lapilli',
    fossils: 'Carbonised tree and fern fragments (800 ka)',
    age: 'Pleistocene (~1.5–0.3 Ma)',
    hardness: 3,
    porosity: 0.30,
    permeability: 'Variable',
    jointSpacing: '0.3–2 m',
    jointSets: 1,
    jointAzimuth: 90,
    weatheringRate: 'Rapid',
    mechanicalStrength: 12,
    fractureAperture: 2.0,
  },
  {
    name: 'Andesitic Lava',
    baseElevation: 650,
    color: '#5C4A3F',
    hex: 0x5c4a3f,
    vegetationDensity: 0.28,
    minerals: [
      'Plagioclase (An₄₀–₆₀)', 'Hornblende', 'Biotite',
      'Orthopyroxene', 'Fe-Ti Oxides', 'Pyrite', 'Quartz',
      'Gold (epithermal veins, trace)',
    ],
    characteristics:
      'Viscous andesite (SiO₂ 58–64 wt%) forming the bulk of Golden Mountain above 300 m. '
      + 'Individual flows 5–25 m thick, 50–200 m wide, with levée walls. '
      + 'Radial dikes (1–10 m wide, 100–2000 m long) cut through older units. '
      + 'GOLD-BEARING EPITHERMAL VEINS in hydrothermal fractures above the ring fault zone.',
    grainSize: 'Fine to medium (0.5–4 mm); strongly porphyritic',
    texture: 'Porphyritic; trachytic flow alignment; platy + columnar jointing',
    fossils: 'None',
    age: 'Pleistocene–Holocene (~0.5 Ma – ongoing)',
    hardness: 7,
    porosity: 0.06,
    permeability: 'Low (elevated in fault zones)',
    jointSpacing: '0.5–2 m',
    jointSets: 4,
    jointAzimuth: 45,
    weatheringRate: 'Slow–moderate',
    mechanicalStrength: 150,
    fractureAperture: 1.2,
  },
  {
    name: 'Tephra & Lapilli',
    baseElevation: 1100,
    color: '#8B7355',
    hex: 0x8b7355,
    vegetationDensity: 0.12,
    minerals: [
      'Volcanic Glass Shards', 'Plagioclase micro-phenocrysts',
      'Pyroxene', 'Pyrite', 'Sulphur', 'Magnetite',
    ],
    characteristics:
      'Unconsolidated pyroclastic fall and surge deposits above 550 m. '
      + 'Multiple couplets of fine ash (0.1–5 mm) and coarser lapilli (2–64 mm) '
      + 'from sub-Plinian to Plinian eruption columns (15–30 km height). '
      + 'Bomb sag structures near vent (< 1.5 km). Most recent eruption < 200 years ago.',
    grainSize: 'Lapilli 2–64 mm; coarse ash 0.063–2 mm',
    texture: 'Massive to graded fallout; cross-bedded surge; bomb sag structures',
    fossils: 'Rare carbonised vegetation',
    age: 'Late Pleistocene–Holocene (<300 ka)',
    hardness: 1,
    porosity: 0.45,
    permeability: 'High in lapilli, low in fine ash',
    jointSpacing: 'N/A (unconsolidated)',
    jointSets: 0,
    jointAzimuth: null,
    weatheringRate: 'Very rapid',
    mechanicalStrength: 0.8,
    fractureAperture: null,
  },
  {
    name: 'Volcanic Ash & Andisol',
    baseElevation: 1480,
    color: '#3A6B2A',
    hex: 0x3a6b2a,
    vegetationDensity: 0.06,
    minerals: [
      'Allophane (Al-Si gel)', 'Imogolite', 'Ferrihydrite',
      'Kaolinite', 'Quartz silt', 'Organic humate', 'Fe-Mn oxide nodules',
    ],
    characteristics:
      'Andisol — volcanic soil from weathered tephra in the jungle belt below 600 m. '
      + 'Unique allophane mineralogy: water-retention 80–120% by weight, spongy thixotropic texture, '
      + 'high organic carbon (5–20%). Jet-black A-horizon (0.3–0.6 m) from jungle canopy decomposition. '
      + 'Soil temperatures 28–35 °C at 0.5 m depth from geothermal heating.',
    grainSize: 'Clay-rich (< 0.002 mm allophane gel)',
    texture: 'Massive, thixotropic; dark A-horizon; Fe-Mn nodule-rich B-horizon',
    fossils: 'Sub-fossil plant roots; pollen assemblage',
    age: 'Holocene (<11.7 ka, ongoing ~1–5 mm/yr)',
    hardness: 0.5,
    porosity: 0.65,
    permeability: 'High (bioturbation/root channels)',
    jointSpacing: 'N/A (unconsolidated)',
    jointSets: 0,
    jointAzimuth: null,
    weatheringRate: 'Formation-dominated (~1–5 mm/yr)',
    mechanicalStrength: 0.05,
    fractureAperture: null,
  },
];

// ── Geological Processes ──────────────────────────────────────
const GEOLOGICAL_PROCESSES = [
  {
    name: 'Active Volcanism & Hydrothermal Degassing',
    affectedLayers: ['Andesitic Lava', 'Tephra & Lapilli'],
    timescale: '10⁰–10³ years',
    description:
      'The Golden Mountain magma chamber (~6 km diameter, top at ~3 km depth) '
      + 'drives continuous degassing through ring-fault and radial dike conduits. '
      + 'Fumarole temperatures 150–450 °C. Eruption episodes every 50–200 years (VEI 3–5). '
      + 'Island subsidence rate accelerating due to magma chamber instability.',
    visualSign: 'Sulphur-yellow crusts; bleached alteration halos; steam venting; H₂S odour',
  },
  {
    name: 'Epithermal Gold Mineralisation',
    affectedLayers: ['Andesitic Lava', 'Pyroclastic Breccia'],
    timescale: '10⁴–10⁶ years',
    description:
      'Magmatic fluids (200–350 °C) mixing with meteoric water in the ring-fault zone '
      + 'precipitate quartz + adularia + pyrite + galena ± native gold assemblage. '
      + 'Au grades 2–25 g/t in bonanza veins within 500 m of the ring fault.',
    visualSign: 'White quartz vein halos; pyrite glint; gold-brown gossan staining',
  },
  {
    name: 'Caldera Collapse & Island Subsidence',
    affectedLayers: ['Andesitic Lava', 'Pyroclastic Breccia', 'Tholeiitic Lava Flows'],
    timescale: '10⁰–10³ years',
    description:
      'Partial drainage of the magma chamber causes caldera roof subsidence along ring faults. '
      + 'Lithospheric cooling, chamber compaction, and microplate instability drive subsidence. '
      + 'Catastrophic collapse could sink the island in hours (movie scenario).',
    visualSign: 'Ring-fault scarps; down-dropped terrace blocks; tension cracks; tilted benches',
  },
  {
    name: 'Lahar Generation (Rain-triggered Mass Flows)',
    affectedLayers: ['Pyroclastic Breccia', 'Tephra & Lapilli'],
    timescale: '10⁰–10² years',
    description:
      'Tropical rainfall (>200 mm/hr) saturates loose pyroclastic deposits, triggering '
      + 'mass flows at 40–80 km/hr in confined gorges. Volumes 10⁵–10⁶ m³. '
      + 'Cascade River gorge carved by repeated lahar events within the last 50 ka.',
    visualSign: 'Fresh debris-flow levées; muddy river during rain; stripped hillslopes',
  },
  {
    name: 'Coastal Cliff Erosion & Sea Cave Formation',
    affectedLayers: ['Basaltic Shield', 'Tholeiitic Lava Flows'],
    timescale: '10²–10⁵ years',
    description:
      'Wave action exploits columnar joints in 40–120 m coastal cliffs. '
      + 'Sea caves develop along vertical sheet-joint planes. Natural arches form when caves breach. '
      + 'Coastal retreat rate ~0.5–2 cm/yr, producing black-sand beaches.',
    visualSign: 'Black sand beaches; wave-cut platforms; sea caves; sea stacks',
  },
  {
    name: 'Andisol Formation & Jungle Geothermal Acceleration',
    affectedLayers: ['Volcanic Ash & Andisol', 'Tephra & Lapilli'],
    timescale: '10²–10³ years',
    description:
      'Geothermally heated soils (28–35 °C) accelerate tephra weathering 2–3× normal. '
      + 'Organic matter input from hyper-productive jungle (150–200 t/ha/yr biomass turnover) '
      + 'creates distinctive jet-black A-horizon. Net andisol accretion ~2–5 mm/yr.',
    visualSign: 'Jet-black spongy soil; warm steam from soil near hot-ground zones',
  },
];

// ── Layer Contact Interactions ────────────────────────────────
const LAYER_INTERACTIONS = [
  {
    upper: 'Tholeiitic Lava Flows',
    lower: 'Basaltic Shield',
    contactType: 'Gradational conformable',
    description: 'Continuous volcanic stratigraphy from shield to flood basalt.',
    hydrogeology: 'Continuous basalt aquifer; lava tubes span the contact.',
    hazard: null,
  },
  {
    upper: 'Pyroclastic Breccia',
    lower: 'Tholeiitic Lava Flows',
    contactType: 'Erosional unconformity',
    description: 'Major unconformity with up to 30 m relief. Principal failure plane for sector collapse.',
    hydrogeology: 'Lahar matrix creates perched water table in overlying pyroclastics.',
    hazard: 'Sector collapse plane — potential for >10⁷ m³ flank landslide and tsunami.',
  },
  {
    upper: 'Andesitic Lava',
    lower: 'Pyroclastic Breccia',
    contactType: 'Conformable to weakly unconformable',
    description: 'Andesite lavas bake pyroclastic breccia (1–5 m aureole). Gold-bearing fluids migrated along this horizon.',
    hydrogeology: 'Contact zone hosts mineralised fracture veins.',
    hazard: 'Baked contact may fracture in earthquakes, triggering rockfall.',
  },
  {
    upper: 'Tephra & Lapilli',
    lower: 'Andesitic Lava',
    contactType: 'Conformable — fallout drape',
    description: 'Sharp colour change from dark-grey lava to brown-buff lapilli.',
    hydrogeology: 'Perched water table above andesite; springs emerge at contact.',
    hazard: 'Tephra debris flows initiate at this contact when saturated.',
  },
  {
    upper: 'Volcanic Ash & Andisol',
    lower: 'Tephra & Lapilli',
    contactType: 'Gradational — pedogenic transition',
    description: 'Progressive weathering of lapilli into andisol. Weathering front at 0.5–2 m depth.',
    hydrogeology: 'Andisol storage above, high-transmissivity lapilli below.',
    hazard: 'Loss of vegetation triggers catastrophic gullying.',
  },
];

// ── Lake Features ─────────────────────────────────────────────
const LAKES = [
  {
    // Caldera Lake — inside Golden Mountain summit crater
    cx: 0, cz: 0,
    rx: S(37), rz: S(35),
    depth: 15,  // Scaled depth for engine
    name: 'Caldera Lake',
  },
  {
    // Hidden Lagoon — collapsed secondary crater
    cx: LAGOON.cx, cz: LAGOON.cz,
    rx: LAGOON.radius, rz: LAGOON.radius - S(4),
    depth: 12,
    name: 'Hidden Lagoon',
  },
];

// ── River System ──────────────────────────────────────────────
const RIVERS = [
  {
    name: 'Cascade River',
    width: S(22),
    depth: 95,
    // Water appearance (sediment-tinted as per spec)
    appearance: {
      color: '#5D4E37',            // sediment-brown tint
      clarity: 0.4,               // moderate turbidity
      sedimentLoad: 'volcanic-ash',
      flowSpeed: 'moderate-fast',
    },
    canyonWalls: {
      height: 50,                 // 40-80m / 16 = 2.5-5 eng (avg ~3.1)
      profile: 'V-shaped',
      boulderChokes: [
        { x: S(10), z: S(248) },
        { x: S(-95), z: S(218) },
      ],
    },
    points: [
      { x: CASCADE_RIVER.sourceX, z: CASCADE_RIVER.sourceZ },    // NE source — 900 m elevation
      { x: S(95), z: S(295) },
      { x: S(55), z: S(270) },
      { x: S(10), z: S(248) },
      { x: S(-45), z: S(232) },
      { x: S(-95), z: S(218) },
      { x: S(-145), z: S(205) },
      { x: CASCADE_RIVER.waterfallX, z: CASCADE_RIVER.waterfallZ }, // WATERFALL ZONE
      { x: S(-230), z: S(210) },
      { x: S(-285), z: S(225) },
      { x: CASCADE_RIVER.mouthX, z: CASCADE_RIVER.mouthZ },       // river mouth — lagoon
    ],
  },
];

// ── Nautilus Dock Vegetation Exclusion ────────────────────────
const NAUTILUS_FLAT = {
  cx: NAUTILUS.entranceCx,
  cz: NAUTILUS.entranceCz,
  radius: S(20),
  elevation: 215,
};

// ── Dense River Path Cache ────────────────────────────────────
const _denseCache = new Map();
function getDenseRiverPath(river) {
  if (_denseCache.has(river.name)) return _denseCache.get(river.name);
  const dense = subdivideRiverPath(river.points, 8);
  _denseCache.set(river.name, dense);
  return dense;
}

// ── Layer Lookup Helper ───────────────────────────────────────
function getLayerAtElevationLocal(elev) {
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    if (elev >= LAYERS[i].baseElevation) return LAYERS[i];
  }
  return LAYERS[0];
}

function getLavaFlowMask(wx, wz) {
  let mask = 0;
  for (const flow of LAVA_FLOW_AXES) {
    const ox = Math.cos(flow.angle) * flow.originR;
    const oz = Math.sin(flow.angle) * flow.originR;
    const dirX = Math.cos(flow.angle);
    const dirZ = Math.sin(flow.angle);
    const vx = wx - ox;
    const vz = wz - oz;
    const distAlong = Math.max(0, Math.min(flow.length, vx * dirX + vz * dirZ));
    const perpDist = Math.abs(vx * (-dirZ) + vz * dirX);
    if (perpDist <= flow.width) {
      const inside = Math.max(0, 1 - perpDist / flow.width);
      const alongT = 1 - distAlong / flow.length;
      const flowFade = alongT * alongT * (3 - 2 * alongT);
      mask = Math.max(mask, inside * flowFade);
    }
  }
  return Math.max(0, Math.min(1, mask));
}

// ══════════════════════════════════════════════════════════════
//  MULTI-PROVINCE TERRAIN GENERATION
//  
//  This is NOT a single cone volcano. The terrain combines:
//    1. Elliptical island boundary (asymmetric coastline)
//    2. Golden Mountain stratovolcano (blending into terrain)
//    3. Coastal cliff amphitheater (variable heights)
//    4. Hidden Lagoon basin (collapsed crater subtraction)
//    5. Canyon river incision (subtractive erosion)
//    6. Secondary ridge uplift (fault-controlled)
//    7. Hydrothermal vent field
//    8. Ring fault displacement
//    9. Radial dike ridges
//    10. Multi-province foothills and jungle terrain
//
//  All functions combine ADDITIVELY and SUBTRACTIVELY —
//  they do NOT sequentially override each other.
// ══════════════════════════════════════════════════════════════

function generateHeight(noise, noiseB, wx, wz) {
  const HALF  = TERRAIN_SIZE / 2;
  const nx    = wx / HALF;
  const nz    = wz / HALF;
  const angle = Math.atan2(nz, nx);

  // ── 1. ELLIPTICAL ISLAND BOUNDARY ────────────────────────────
  // Real: 32 km E-W × 28 km N-S → Engine: 2000 × 1750
  // Using semi-axes: 1000 (E-W) × 875 (N-S)
  const ellipRx = 1.0;    // E-W extent
  const ellipRz = 0.875;  // N-S extent (28/32 ratio)
  const ellipR  = Math.sqrt((nx / ellipRx) ** 2 + (nz / ellipRz) ** 2);
  
  // Engine radial distance
  const r_eng = Math.sqrt(wx * wx + wz * wz);

  // ── 2. BASE TERRAIN ELEVATION FIELD ──────────────────────────
  // Create a varied base terrain that is NOT dominated by the volcano
  // Multiple overlapping terrain provinces with different characteristics
  
  // Province A: Western highlands (more elevated western sector)
  const westBias = Math.max(0, -nx * 0.3 + 0.15);
  const westernHighlands = westBias * 300 * Math.max(0, 1 - ellipR * 1.05);
  
  // Province B: Northern plateau zone
  const northBias = Math.max(0, nz * 0.25 + 0.1);
  const northernPlateau = northBias * 240 * Math.max(0, 1 - ellipR * 1.02);
  
  // Province C: Southeastern depression (counterbalance volcano)
  const seDep = Math.max(0, (nx * 0.4 - nz * 0.3 - 0.2));
  const seDepression = -seDep * 150 * Math.max(0, 1 - ellipR);
  
  // Base fractal terrain field (medium frequency)
  const baseTerrain =
      fbm(noise,  wx * 0.0008 + 50, wz * 0.0008 + 50, 5) * 120
    + fbm(noiseB, wx * 0.0015 + 80, wz * 0.0015 + 80, 4) * 70;
  
  // Combine base provinces
  let h = WATER_LEVEL + 120 + westernHighlands + northernPlateau + seDepression + baseTerrain;

  // ── 3. SECONDARY RIDGE SYSTEM (Fault-Controlled Uplift) ──────
  // Ridge line from (-500, -375) to (375, -500) engine units
  // This MUST interrupt radial symmetry of the volcano
  const rsx = SECONDARY_RIDGE.startX, rsz = SECONDARY_RIDGE.startZ;
  const rex = SECONDARY_RIDGE.endX,   rez = SECONDARY_RIDGE.endZ;
  const rldx = rex - rsx, rldz = rez - rsz;
  const rlLen2 = rldx * rldx + rldz * rldz;
  const rlt = Math.max(0, Math.min(1, ((wx - rsx) * rldx + (wz - rsz) * rldz) / rlLen2));
  const rcx = rsx + rlt * rldx, rcz = rsz + rlt * rldz;
  const ridgeDist = Math.sqrt((wx - rcx) ** 2 + (wz - rcz) ** 2);
  
  // Ridge profile: sharp crest with asymmetric flanks
  const ridgeWidth = SECONDARY_RIDGE.width;
  const ridgeMask = Math.max(0, 1 - ellipR * 1.1);
  let ridgeH = 0;
  if (ridgeDist < ridgeWidth) {
    const ridgeT = ridgeDist / ridgeWidth;
    // Sharp peak profile
    ridgeH = Math.pow(Math.max(0, 1 - ridgeT), 1.6) * SECONDARY_RIDGE.elevation * ridgeMask;
    // Ridge roughness
    ridgeH += ridgeNoise(noiseB, wx * 0.005 + 30, wz * 0.005 + 30, 3) * 18 * (1 - ridgeT) * ridgeMask;
  }
  h += ridgeH;

  // ── 4. GOLDEN MOUNTAIN STRATOVOLCANO ─────────────────────────
  // Peak at (0,0), rebalanced to integrate with island uplift
  const volcDist = r_eng / VOLCANO.baseRadius;

  const innerCone = volcDist < 0.25
    ? (1 - volcDist / 0.25) ** 1.8 * 260
    : 0;
  const midSlope = volcDist < 0.6
    ? Math.max(0, 1 - volcDist / 0.6) ** 2.8 * 180
    : 0;
  const outerSkirt = volcDist < 1.2
    ? Math.max(0, 1 - volcDist / 1.2) ** 3 * 110
    : 0;

  const volcAsym = 1.0 + 0.12 * Math.cos(angle * 1.0 - 0.8) + 0.08 * Math.sin(angle * 2.0 + 0.3);
  const volcanoElevation = (innerCone + midSlope + outerSkirt) * volcAsym;
  const volcRough = volcDist < 1.0
    ? ridgeNoise(noise, wx * 0.004, wz * 0.004, 3) * 22 * Math.max(0, 1 - volcDist)
    : 0;

  h += volcanoElevation + volcRough;

  // ── 4a. PROCEDURAL LAVA FLOWS (channels + levees) ───────────
  // Radial tongues: channel incision, raised levees, clinker roughness.
  for (const flow of LAVA_FLOW_AXES) {
    const flowAngle = flow.angle + noise(flow.angle * 2.0, 17.0) * 0.08;
    const ox = Math.cos(flowAngle) * flow.originR;
    const oz = Math.sin(flowAngle) * flow.originR;
    const dirX = Math.cos(flowAngle);
    const dirZ = Math.sin(flowAngle);
    const vx = wx - ox;
    const vz = wz - oz;
    const distAlong = Math.max(0, Math.min(flow.length, vx * dirX + vz * dirZ));
    const perpSigned = vx * (-dirZ) + vz * dirX;
    const perpDist = Math.abs(perpSigned);

    if (perpDist <= flow.width) {
      const inside = Math.max(0, 1 - perpDist / flow.width);
      const alongT = 1 - distAlong / flow.length;
      const flowFade = alongT * alongT * (3 - 2 * alongT);

      const channelDepth = inside * inside * flowFade * 14;
      h -= channelDepth;

      const leveeCenter = flow.width * 0.6;
      const leveeShape = Math.max(0, 1 - Math.abs(perpDist - leveeCenter) / flow.width);
      const leveeHeight = leveeShape * leveeShape * flowFade * 6;
      h += leveeHeight;

      const clinker = ridgeNoise(noiseB, wx * 0.01, wz * 0.01, 2) * 4 * inside * flowFade;
      h += clinker;
    }
  }

  // Flank collapse scar to break symmetry
  const scarAngDiff = Math.atan2(Math.sin(angle - LAVA_COLLAPSE_SCAR.angle), Math.cos(angle - LAVA_COLLAPSE_SCAR.angle));
  const scarMask = Math.exp(-(scarAngDiff * scarAngDiff) / 0.2)
    * Math.exp(-((r_eng - LAVA_COLLAPSE_SCAR.radius) * (r_eng - LAVA_COLLAPSE_SCAR.radius)) / 600.0);
  h -= scarMask * 22;

  // ── 5. SUMMIT CRATER & ACTIVE FEATURES ───────────────────────
  // Crater rim radius: 75 eng (1200 m), floor radius: ~37 eng (600 m)
  const craterRimDist = Math.abs(r_eng - VOLCANO.craterRadius);
  const craterRimBump = 25 * Math.exp(-(craterRimDist * craterRimDist) / (20 * 20));

  const craterBowl = r_eng < VOLCANO.craterRadius
    ? -18 * Math.pow(Math.max(0, 1 - r_eng / VOLCANO.craterRadius), 1.8)
    : 0;

  h += craterRimBump + craterBowl;

  {
    for (const cone of SUMMIT_FEATURES.minorVentCones) {
      const cdx = wx - cone.cx;
      const cdz = wz - cone.cz;
      const cDist = Math.sqrt(cdx * cdx + cdz * cdz);
      if (cDist < cone.baseRadius * 1.5) {
        const coneH = Math.max(0, 1 - cDist / cone.baseRadius) ** 1.3 * cone.height;
        const coneCrater = cDist < cone.baseRadius * 0.3
          ? -cone.height * 0.25 * (1 - cDist / (cone.baseRadius * 0.3))
          : 0;
        h += coneH + coneCrater;
      }
    }

    const scar = SUMMIT_FEATURES.ringFaultScar;
    if (angle >= scar.visibleArc.startAngle && angle <= scar.visibleArc.endAngle) {
      const scarDist = Math.abs(r_eng - RING_FAULT.radius * 0.4);
      if (scarDist < scar.fractureZoneWidth) {
        const scarDepth = Math.max(0, 1 - scarDist / scar.fractureZoneWidth) * scar.scarpHeight;
        h -= scarDepth * 0.5;
        h += ridgeNoise(noiseB, wx * 0.02 + 500, wz * 0.02 + 500, 2) * 3 * (1 - scarDist / scar.fractureZoneWidth);
      }
    }

    for (const crack of SUMMIT_FEATURES.groundCracks) {
      const clx = crack.endX - crack.startX;
      const clz = crack.endZ - crack.startZ;
      const clLen2 = clx * clx + clz * clz;
      const clt = Math.max(0, Math.min(1, ((wx - crack.startX) * clx + (wz - crack.startZ) * clz) / clLen2));
      const ccx = crack.startX + clt * clx;
      const ccz = crack.startZ + clt * clz;
      const crackDist = Math.sqrt((wx - ccx) ** 2 + (wz - ccz) ** 2);
      if (crackDist < crack.width * 5) {
        const crackDepth = Math.max(0, 1 - crackDist / crack.width) * 2;
        h -= crackDepth;
      }
    }
  }

  // ── 6. RING FAULT + RADIAL DIKES ─────────────────────────────
  const ringDist = Math.abs(r_eng - RING_FAULT.radius);
  if (ringDist < 30) {
    const faultT = 1 / (1 + Math.exp(-(r_eng - RING_FAULT.radius) / 5));
    h -= faultT * RING_FAULT.displacement * 12;
    h += (1 - Math.abs(ringDist) / 30) * noise(wx * 0.02 + 200, wz * 0.02 + 200) * 8;
  }

  const dikeInfluence = Math.max(0, 1 - r_eng / 313) * Math.max(0, r_eng / 50 - 0.5);
  const dikePattern = Math.abs(Math.sin(angle * 8));
  const dikeRidge = dikePattern * 28 * dikeInfluence;
  h += dikeRidge;

  // ── 7. HIDDEN LAGOON BASIN (Collapsed Secondary Crater) ──────
  // Center at (-375, 250) engine, radius 56 eng
  // HARD subtractive carve to remain visually dominant
  {
    const ldx = wx - LAGOON.cx;
    const ldz = wz - LAGOON.cz;
    const lDist = Math.sqrt(ldx * ldx + ldz * ldz);
    const lOuter = LAGOON.radius * 1.8;  // Outer influence zone
    const lInner = LAGOON.radius;        // Basin floor
    
    if (lDist < lOuter) {
      // Inner cliff rim
      if (lDist > lInner * 0.85 && lDist < lInner * 1.15) {
        const rimDist = Math.abs(lDist - lInner);
        const rimBump = 12 * Math.exp(-(rimDist * rimDist) / (10 * 10));
        h += rimBump;
      }
      
      // Basin floor depression (dominant subtractive carve)
      const lNorm = Math.max(0, 1 - lDist / lInner);
      const lBlend = lNorm * lNorm * (3 - 2 * lNorm);
      h -= lBlend * 180;
    }
  }

  // ── 8. HYDROTHERMAL VENT FIELD ───────────────────────────────
  // Center at (250, -125) engine
  // Creates a distinctive altered terrain zone
  {
    const vdx = wx - VENT_FIELD.cx;
    const vdz = wz - VENT_FIELD.cz;
    const vDist = Math.sqrt(vdx * vdx + vdz * vdz);
    const vOuter = VENT_FIELD.suppressionRadius * 1.5;
    
    if (vDist < vOuter) {
      const ventMound = Math.max(0, 1 - vDist / VENT_FIELD.radius) * 35;
      const ventCrater = vDist < VENT_FIELD.radius * 0.4
        ? -15 * (1 - vDist / (VENT_FIELD.radius * 0.4))
        : 0;
      const ventRough = Math.max(0, 1 - vDist / vOuter)
        * ridgeNoise(noise, wx * 0.008 + 150, wz * 0.008 + 150, 3) * 20;
      h += ventMound + ventCrater + ventRough;

      for (const mound of HYDROTHERMAL_STRUCTURES.mineralCrustMounds) {
        const mdx = wx - mound.cx;
        const mdz = wz - mound.cz;
        const mDist = Math.sqrt(mdx * mdx + mdz * mdz);
        if (mDist < mound.radius * 1.5) {
          h += Math.max(0, 1 - mDist / mound.radius) ** 2 * mound.height;
        }
      }

      for (const pool of HYDROTHERMAL_STRUCTURES.hotPools) {
        const pdx = (wx - pool.cx) / pool.rx;
        const pdz = (wz - pool.cz) / pool.rz;
        const pDist = Math.sqrt(pdx * pdx + pdz * pdz);
        if (pDist < 1.5) {
          const poolDepth = Math.max(0, 1 - pDist) ** 2 * 0.8;
          h -= poolDepth;
        }
      }

      for (const fissure of HYDROTHERMAL_STRUCTURES.fissurecracks) {
        const flx = fissure.endX - fissure.startX;
        const flz = fissure.endZ - fissure.startZ;
        const flLen2 = flx * flx + flz * flz;
        const flt = Math.max(0, Math.min(1, ((wx - fissure.startX) * flx + (wz - fissure.startZ) * flz) / flLen2));
        const fcx = fissure.startX + flt * flx;
        const fcz = fissure.startZ + flt * flz;
        const fissDist = Math.sqrt((wx - fcx) ** 2 + (wz - fcz) ** 2);
        if (fissDist < fissure.width * 4) {
          h -= Math.max(0, 1 - fissDist / fissure.width) * 1.5;
        }
      }
    }
  }

  // ── 9. CASCADE RIVER GORGE ───────────────────────────────────
  // Deep V-shaped canyon — up to 120 m (7.5 eng) deep at waterfall
  for (const river of RIVERS) {
    const pts = getDenseRiverPath(river);
    let minD2 = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i].x, az = pts[i].z;
      const bx = pts[i + 1].x, bz = pts[i + 1].z;
      const abx = bx - ax, abz = bz - az;
      const lenSq = abx * abx + abz * abz;
      const t2 = lenSq > 0
        ? Math.max(0, Math.min(1, ((wx - ax) * abx + (wz - az) * abz) / lenSq))
        : 0;
      const cx2 = ax + t2 * abx, cz2 = az + t2 * abz;
      const d2 = (wx - cx2) ** 2 + (wz - cz2) ** 2;
      if (d2 < minD2) minD2 = d2;
    }
    const riverDist = Math.sqrt(minD2);
    const rw = river.width;
    if (riverDist < rw * 5.5) {
      const wfDist = Math.sqrt(
        (wx - CASCADE_RIVER.waterfallX) ** 2 + (wz - CASCADE_RIVER.waterfallZ) ** 2
      );
      const wfBoost = Math.max(0, 1 - wfDist / 100) * 2.5;
      const t3 = Math.max(0, 1 - riverDist / (rw * 4.5));
      const s3 = t3 * t3 * (3 - 2 * t3);
      const chD = river.depth * Math.max(0, 1 - (riverDist / rw) ** 2) * (1.0 + wfBoost);
      h -= s3 * (chD + 12);
    }
  }

  // ── 9b. WATERFALL LEDGE OVERHANG ─────────────────────────────
  {
    const wl = WATERFALL_LEDGE;
    const wldx = wx - wl.cx;
    const wldz = wz - wl.cz;
    const wlDist = Math.sqrt(wldx * wldx + wldz * wldz);

    if (wlDist < wl.overhang.width * 1.5) {
      const ledgeT = Math.max(0, 1 - wlDist / wl.overhang.width);
      const upstreamBias = Math.max(0, wldx * 0.15);
      h += ledgeT * upstreamBias * 8;
    }

    const ppdx = wx - wl.plungePool.cx;
    const ppdz = wz - wl.plungePool.cz;
    const ppDist = Math.sqrt(ppdx * ppdx + ppdz * ppdz);
    if (ppDist < wl.plungePool.radius * 1.8) {
      const poolT = Math.max(0, 1 - ppDist / wl.plungePool.radius);
      h -= poolT * poolT * wl.plungePool.depth * 8;
    }
  }

  // ── 9c. LAGOON INNER CLIFF DETAIL ────────────────────────────
  {
    const lc = LAGOON_CLIFFS;
    const lcdx = wx - lc.cx;
    const lcdz = wz - lc.cz;
    const lcDist = Math.sqrt(lcdx * lcdx + lcdz * lcdz);
    const lcAngle = Math.atan2(lcdz, lcdx);

    for (const ledge of lc.features.overhangingLedges) {
      const angDiff = Math.abs(Math.atan2(Math.sin(lcAngle - ledge.angle), Math.cos(lcAngle - ledge.angle)));
      if (angDiff < 0.3 && lcDist > lc.innerRadius * 0.9 && lcDist < lc.outerRadius) {
        const ledgeInfluence = Math.max(0, 1 - angDiff / 0.3);
        const radialPos = (lcDist - lc.innerRadius) / (lc.outerRadius - lc.innerRadius);
        h += ledgeInfluence * radialPos * ledge.depth * 2;
      }
    }

    for (const debris of lc.features.rockfallDebris) {
      const dbdx = wx - debris.cx;
      const dbdz = wz - debris.cz;
      const dbDist = Math.sqrt(dbdx * dbdx + dbdz * dbdz);
      if (dbDist < debris.radius) {
        const debrisH = (1 - dbDist / debris.radius) * debris.density * 3
          * (0.5 + 0.5 * noise(wx * 0.1, wz * 0.1));
        h += debrisH;
      }
    }
  }

  // ── 9d. LOST CITY TERRACES + CANALS + NAUTILUS BAY ───────────
  {
    const cdx = wx - LOST_CITY.cx;
    const cdz = wz - LOST_CITY.cz;
    const cityDist = Math.sqrt(cdx * cdx + cdz * cdz);

    if (cityDist < LOST_CITY.outerDistrictRadius * 1.1) {
      if (cityDist < LOST_CITY.plateauRadius) {
        const flattenT = Math.max(0, 1 - cityDist / LOST_CITY.plateauRadius);
        const flattenS = flattenT * flattenT * (3 - 2 * flattenT);
        h = h * (1 - flattenS * 0.72) + LOST_CITY.plateauElevation * flattenS * 0.72;

        for (const ring of LOST_CITY.terraces) {
          if (cityDist >= ring.inner && cityDist <= ring.outer) {
            const mid = (ring.inner + ring.outer) * 0.5;
            const halfW = (ring.outer - ring.inner) * 0.5;
            const ringT = Math.max(0, 1 - Math.abs(cityDist - mid) / halfW);
            h += ring.offset * ringT;
          }
        }

        const radialPaving = Math.abs(Math.sin(Math.atan2(cdz, cdx) * 12.0));
        h += radialPaving * 0.85 * Math.max(0, 1 - cityDist / LOST_CITY.plateauRadius);
      }

      // Plaza crack subsidence + rubble blend
      const crackMask = Math.abs(Math.sin((wx + wz) * 0.06)) * Math.abs(Math.cos((wx - wz) * 0.04));
      const rubbleBlend = ridgeNoise(noiseB, wx * 0.04 + 320, wz * 0.04 + 320, 2) * 1.8;
      if (cityDist < LOST_CITY.plazaRadius * 1.8) {
        h -= crackMask * 1.6;
        h += rubbleBlend * 0.5;
      }

      // Outer district instability (subsidence ±2) and rubble mounds
      if (cityDist > LOST_CITY.plateauRadius && cityDist < LOST_CITY.outerDistrictRadius) {
        const subsNoise = noise(wx * 0.015 + 700, wz * 0.015 + 700);
        h += subsNoise * 2.0;
        const moundNoise = Math.max(0, ridgeNoise(noise, wx * 0.02 + 810, wz * 0.02 + 810, 2));
        h += moundNoise * 3.2;
      }
    }

    // Radial canal carving + retaining wall shoulders
    for (const canal of LOST_CITY_CANALS.radial) {
      const sx = LOST_CITY.cx;
      const sz = LOST_CITY.cz;
      const ex = sx + Math.cos(canal.angle) * canal.length;
      const ez = sz + Math.sin(canal.angle) * canal.length;
      const lx = ex - sx;
      const lz = ez - sz;
      const len2 = lx * lx + lz * lz;
      const t4 = Math.max(0, Math.min(1, ((wx - sx) * lx + (wz - sz) * lz) / len2));
      const cx4 = sx + t4 * lx;
      const cz4 = sz + t4 * lz;
      const dist = Math.sqrt((wx - cx4) ** 2 + (wz - cz4) ** 2);

      if (dist < canal.width * 2.3) {
        const ct = Math.max(0, 1 - dist / (canal.width * 1.9));
        const cs = ct * ct * (3 - 2 * ct);
        h -= cs * LOST_CITY_CANALS.depth;

        const wallCenter = canal.width * 0.9;
        const wallShape = Math.max(0, 1 - Math.abs(dist - wallCenter) / (canal.width * 0.6));
        h += wallShape * 2.2;
      }
    }

    // Narrow inlet canal to lagoon (city waterway connection)
    {
      const sx = LOST_CITY.cx + S(95);
      const sz = LOST_CITY.cz + S(35);
      const ex = LAGOON.cx + S(18);
      const ez = LAGOON.cz - S(20);
      const lx = ex - sx;
      const lz = ez - sz;
      const len2 = lx * lx + lz * lz;
      const t5 = Math.max(0, Math.min(1, ((wx - sx) * lx + (wz - sz) * lz) / len2));
      const cx5 = sx + t5 * lx;
      const cz5 = sz + t5 * lz;
      const dist = Math.sqrt((wx - cx5) ** 2 + (wz - cz5) ** 2);
      const inletW = S(7);
      if (dist < inletW * 2.4) {
        const it = Math.max(0, 1 - dist / (inletW * 2.0));
        const is = it * it * (3 - 2 * it);
        h -= is * 7.0;
      }
    }

    // Nautilus Bay semicircular harbor cut
    {
      const bdx = wx - NAUTILUS_BAY.cx;
      const bdz = wz - NAUTILUS_BAY.cz;
      const bDist = Math.sqrt(bdx * bdx + bdz * bdz);
      const bAng = Math.atan2(bdz, bdx);
      const inSemi = bAng > -Math.PI * 0.1 && bAng < Math.PI * 1.1;
      if (inSemi && bDist < NAUTILUS_BAY.harborRadius * 1.35) {
        const bt = Math.max(0, 1 - bDist / NAUTILUS_BAY.harborRadius);
        const bs = bt * bt * (3 - 2 * bt);
        h = h * (1 - bs * 0.75) + NAUTILUS_BAY.dockElevation * bs * 0.75;
      }
    }

    // Mechanical gate basin at city canal outlet to lagoon
    {
      const gx = LAGOON.cx + S(20);
      const gz = LAGOON.cz - S(22);
      const gDist = Math.sqrt((wx - gx) ** 2 + (wz - gz) ** 2);
      if (gDist < S(24)) {
        const gt = Math.max(0, 1 - gDist / S(24));
        h -= gt * gt * 4.0;
      }
    }

    // Subsurface Nautilus chamber carve (cross-section visible)
    {
      const qx = (wx - NAUTILUS.chamberCx) / NAUTILUS_BAY.chamberRx;
      const qz = (wz - NAUTILUS.chamberCz) / NAUTILUS_BAY.chamberRz;
      const q2 = qx * qx + qz * qz;
      if (q2 < 1.4) {
        const qt = Math.max(0, 1 - q2 / 1.4);
        h -= qt * qt * NAUTILUS_BAY.chamberDepth;
      }
    }

    // Submerged causeway between city and lagoon
    {
      const sx = LOST_CITY_CAUSEWAY.startX;
      const sz = LOST_CITY_CAUSEWAY.startZ;
      const ex = LOST_CITY_CAUSEWAY.endX;
      const ez = LOST_CITY_CAUSEWAY.endZ;
      const lx = ex - sx;
      const lz = ez - sz;
      const len2 = lx * lx + lz * lz;
      const t6 = Math.max(0, Math.min(1, ((wx - sx) * lx + (wz - sz) * lz) / len2));
      const cx6 = sx + t6 * lx;
      const cz6 = sz + t6 * lz;
      const dist = Math.sqrt((wx - cx6) ** 2 + (wz - cz6) ** 2);
      if (dist < LOST_CITY_CAUSEWAY.width * 1.2) {
        const rt = Math.max(0, 1 - dist / LOST_CITY_CAUSEWAY.width);
        const rs = rt * rt * (3 - 2 * rt);
        h = h * (1 - rs * 0.5) + LOST_CITY_CAUSEWAY.crestElevation * rs * 0.5;
        h -= rs * 1.2;
      }
    }
  }

  // ── 10. COASTAL CLIFF AMPHITHEATER ───────────────────────────
  // ASYMMETRIC cliffs — different heights per segment (West, North, East, South)
  const coastWarp =
      0.065 * noise(Math.cos(angle) * 2.5 + 5.0, Math.sin(angle) * 2.5 + 5.0)
    + 0.038 * noiseB(Math.cos(angle) * 6.0 + 20, Math.sin(angle) * 6.0 + 20)
    + 0.022 * noise(Math.cos(angle) * 12.0 + 35, Math.sin(angle) * 12.0 + 35);

  const radWarp =
      0.035 * noise(wx * 0.0012 + 70, wz * 0.0012 + 70)
    + 0.018 * noiseB(wx * 0.0028 + 100, wz * 0.0028 + 100);

  let cliffHeightMult = 1.0;
  for (const seg of CLIFF_SEGMENTS) {
    const angDiff = Math.abs(Math.atan2(Math.sin(angle - seg.azimuthCenter), Math.cos(angle - seg.azimuthCenter)));
    if (angDiff < Math.PI / 3) {
      const segInfluence = Math.max(0, 1 - angDiff / (Math.PI / 3));
      cliffHeightMult = cliffHeightMult * (1 - segInfluence) + (seg.height / 7.5) * segInfluence;
    }
  }

  const coastThreshold = 0.85 + coastWarp + radWarp;
  const cliffBeyond = Math.max(0, ellipR - coastThreshold);
  const cliffJagged = 0.8 + 0.4 * noise(angle * 8.0 + wx * 0.01, wz * 0.01);
  const cliffDrop = cliffBeyond > 0
    ? Math.pow(cliffBeyond / Math.max(0.03, 0.10 - Math.abs(coastWarp) * 0.2), 2.2)
      * 850 * cliffHeightMult * cliffJagged
    : 0;

  h -= cliffDrop;

  // Notches cut into cliff ring for beach access
  const POCKET_BEACHES = [
    { cx: S(-875), cz: S(188),  r: S(28) },
    { cx: S(781),  cz: S(-125), r: S(20) },
    { cx: S(-125), cz: S(-800), r: S(35) },
    { cx: S(450),  cz: S(650),  r: S(25) },
  ];
  for (const b of POCKET_BEACHES) {
    const bDist = Math.sqrt((wx - b.cx) ** 2 + (wz - b.cz) ** 2);
    if (bDist < b.r * 2.8) {
      const bt = Math.max(0, 1 - bDist / (b.r * 2.2));
      const bs = bt * bt * (3 - 2 * bt);
      h = h * (1 - bs) + (WATER_LEVEL + 6) * bs;
    }
  }

  // Broad lowland uplift pass (raises island-average relief without spiking summit)
  const elevRel = h - WATER_LEVEL;
  const lowlandWeight = Math.max(0, 1 - Math.max(0, (elevRel - 220) / 220));
  const islandCoreWeight = Math.max(0, 1 - ellipR * 1.03);
  h += 300 * lowlandWeight * islandCoreWeight;

  // ── 11. MICRO RELIEF + LAKES ─────────────────────────────────
  const elevAboveWater = h - WATER_LEVEL;
  const jungleMask = Math.max(0, 1 - ellipR * 1.08)
    * Math.max(0, 1 - Math.abs(elevAboveWater - 180) / 200);
  const jungleFoothills =
      fbm(noiseB, wx * 0.0018 + 90, wz * 0.0018 + 90, 5) * 85 * jungleMask
    + fbm(noise,  wx * 0.0035 + 45, wz * 0.0035 + 45, 4) * 45 * jungleMask;
  h += jungleFoothills;

  for (const lake of LAKES) {
    const dx = (wx - lake.cx) / lake.rx;
    const dz = (wz - lake.cz) / lake.rz;
    const d2 = dx * dx + dz * dz;
    if (d2 < 2.25) {
      const dist = Math.sqrt(d2);
      const t = Math.max(0, 1 - dist / 1.5);
      const s = t * t * (3 - 2 * t);
      const depthCurve = Math.max(0, 1 - dist * dist) * lake.depth;
      h -= s * (depthCurve + 5);
    }
  }

  const detail = fbm(noise, wx * 0.007, wz * 0.007, 3) * 12;
  const micro  = noise(wx * 0.02, wz * 0.02) * 3;
  h += detail + micro;

  // ── 12. GLOBAL VERTICAL DAMPENING + CLAMP ────────────────────
  h = WATER_LEVEL + (h - WATER_LEVEL) * 0.82;

  // Clamp to ocean floor
  return Math.max(h, 15);
}

// ══════════════════════════════════════════════════════════════
//  STRUCTURAL GEOLOGY OFFSET
//  
//  Full fault network:
//    • Caldera ring fault (250 eng = 4 km)
//    • 8 radial dike harmonics
//    • Coastal collapse fault
//    • Lagoon ring fault
//    • Secondary ridge normal faults
//    • Eastern magma-chamber tilt (10° E)
// ══════════════════════════════════════════════════════════════

function getStructuralOffset(noise, wx, wz) {
  const r_eng = Math.sqrt(wx * wx + wz * wz);
  const angle = Math.atan2(wz, wx);

  // ── Radial dike harmonics (8 principal dikes) ─────────────────
  const dikeHarmo =
      Math.sin(angle * 8) * 20 * Math.max(0, 1 - r_eng / S(1050))
    + Math.abs(Math.cos(angle * 4)) * 5 * Math.max(0, 1 - r_eng / S(800));

  // ── Caldera ring fault (radius 250 eng = 4 km) ────────────────
  const ringFaultT = 1 / (1 + Math.exp(-(r_eng - RING_FAULT.radius) / 8));
  const ringFault = ringFaultT * -25;

  // ── Coastal collapse fault ────────────────────────────────────
  const coastFaultT = 1 / (1 + Math.exp(-(r_eng - S(820)) / 10));
  const coastFault = coastFaultT * -12;

  // ── Hidden Lagoon ring fault ──────────────────────────────────
  const lagDist = Math.sqrt((wx - LAGOON.cx) ** 2 + (wz - LAGOON.cz) ** 2);
  const lagFaultT = 1 / (1 + Math.exp(-(lagDist - LAGOON.radius * 1.1) / 6));
  const lagFault = lagFaultT * -14;

  // ── Secondary ridge normal faults ─────────────────────────────
  const rsx = SECONDARY_RIDGE.startX, rsz = SECONDARY_RIDGE.startZ;
  const rex = SECONDARY_RIDGE.endX, rez = SECONDARY_RIDGE.endZ;
  const rldx = rex - rsx, rldz = rez - rsz;
  const rlLen2 = rldx * rldx + rldz * rldz;
  const rlt = Math.max(0, Math.min(1, ((wx - rsx) * rldx + (wz - rsz) * rldz) / rlLen2));
  const rcx = rsx + rlt * rldx, rcz = rsz + rlt * rldz;
  const sRidge = Math.sqrt((wx - rcx) ** 2 + (wz - rcz) ** 2);
  const sRidgeFault = (1 / (1 + Math.exp(-(sRidge - S(50)) / 6))) * -8;

  // ── Hydrothermal vent zone disruption ─────────────────────────
  const ventDist = Math.sqrt((wx - VENT_FIELD.cx) ** 2 + (wz - VENT_FIELD.cz) ** 2);
  const ventDisrupt = ventDist < VENT_FIELD.suppressionRadius
    ? Math.max(0, 1 - ventDist / VENT_FIELD.suppressionRadius) * 10
    : 0;

  // ── Eastern magma-chamber tilt (10° E) ────────────────────────
  const tilt = wx * 0.015;

  // ── Background geological variation ───────────────────────────
  const n1 = noise(wx * 0.00028, wz * 0.00028) * 15;
  const n2 = noise(wx * 0.0011 + 60, wz * 0.0011 + 60) * 6;

  return dikeHarmo + ringFault + coastFault + lagFault + sRidgeFault + ventDisrupt + tilt + n1 + n2;
}

// ── Layer Lookup Functions ────────────────────────────────────

function getLayerAt(noise, wx, elev, wz) {
  return getLayerAtElevationLocal(elev - getStructuralOffset(noise, wx, wz));
}

function getLayerByElevation(elev) {
  return getLayerAtElevationLocal(elev);
}

function computeLayerIndex(noise, wx, h, wz) {
  const adjElev = h - getStructuralOffset(noise, wx, wz);
  const BLEND = 25;
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    if (adjElev >= LAYERS[i].baseElevation) {
      if (i < LAYERS.length - 1) {
        const next = LAYERS[i + 1].baseElevation;
        const dist = next - adjElev;
        if (dist < BLEND && dist > 0) return i + (1 - dist / BLEND);
      }
      return i;
    }
  }
  return 0;
}

// ══════════════════════════════════════════════════════════════
//  SUBSURFACE ARCHITECTURE
//  
//  Layer stack (as per blueprint):
//    1. Volcanic ash + soil (1–5 m)
//    2. Pyroclastic deposits (20–80 m)
//    3. Andesitic lava (200–800 m)
//    4. Basaltic shield base (1–2 km)
//    5. Intrusive bodies (dikes, sills)
//    6. Magma chamber
//
//  Magma chamber center: (0, 0, -3000 m depth)
//  Ellipsoid radii: X=3000, Z=2800, Y=1500
//  Tilt: 10 degrees toward +X
// ══════════════════════════════════════════════════════════════

const SUBSURFACE = {
  magmaChamber: {
    cx: 0, cz: 0, depth: -3000,  // real meters
    rx: 3000, rz: 2800, ry: 1500,
    tiltDegrees: 10,
  },
  nautilusCavern: {
    cx: NAUTILUS.chamberCx,
    cz: NAUTILUS.chamberCz,
    length: NAUTILUS_BAY.chamberRx * 2,
    width: NAUTILUS_BAY.chamberRz * 2,
    floorDepth: NAUTILUS.depth,
    ceilingHeight: 2.8,  // 45m / 16
  },
};

// ══════════════════════════════════════════════════════════════
//  BIOME ZONES (Elevation Bands)
//  
//  0–100 m:    Coastal scrub
//  100–400 m:  Dense jungle
//  400–900 m:  Mixed forest
//  900–1400 m: Sparse high-slope vegetation
//  1400+ m:    Bare volcanic rock
//  
//  Geothermal zones suppress vegetation.
// ══════════════════════════════════════════════════════════════

const BIOME_ZONES = [
  { name: 'Coastal Scrub',         minElev: 0,    maxElev: 100,  density: 0.3,
    flora: ['pandanus', 'seaGrape', 'coastalShrubs'] },
  { name: 'Dense Jungle',          minElev: 100,  maxElev: 400,  density: 0.9,
    flora: ['giantFerns', 'massiveCycads', 'denseBamboo', 'thickCanopy', 'lianaVines', 'heavyUndergrowth'],
    atmosphere: { lowMist: true, humidity: 0.95 } },
  { name: 'Mixed Forest',          minElev: 400,  maxElev: 900,  density: 0.6,
    flora: ['ferns', 'cycads', 'bamboo', 'trees'] },
  { name: 'Sparse High-Slope',     minElev: 900,  maxElev: 1400, density: 0.2,
    flora: ['scrubGrass', 'lowShrubs'] },
  { name: 'Bare Volcanic Rock',    minElev: 1400, maxElev: 2000, density: 0.02,
    flora: ['lichens', 'mosses'] },
];

// ══════════════════════════════════════════════════════════════
//  ATMOSPHERIC MICROCLIMATES
// ══════════════════════════════════════════════════════════════

const ATMOSPHERIC_ZONES = [
  { name: 'Summit Plume',     cx: 0,          cz: 0,         radius: S(100) },
  { name: 'Jungle Fog',       cx: S(-188),    cz: S(125),    radius: S(150) },
  { name: 'Vent Steam',       cx: VENT_FIELD.cx, cz: VENT_FIELD.cz, radius: S(50) },
  { name: 'Lagoon Humidity',  cx: LAGOON.cx,  cz: LAGOON.cz, radius: S(80) },
];

// ══════════════════════════════════════════════════════════════
//  ISLAND DEFINITION EXPORT
// ══════════════════════════════════════════════════════════════

export const mysteriousIsland = {
  id: 'mysterious',

  terrain: {
    size:              TERRAIN_SIZE,
    segments:          SEGMENTS,
    waterLevel:        WATER_LEVEL,
    noiseSeeds:        [73, 211],
    erosionIterations: 12000,
  },

  camera: {
    // View showing multi-province terrain, not just the volcano
    position: [S(650), 850, S(1100)],
    target:   [S(-100), 200, S(50)],
  },

  layers:              LAYERS,
  geologicalProcesses: GEOLOGICAL_PROCESSES,
  layerInteractions:   LAYER_INTERACTIONS,

  // Water features
  lakes:  LAKES,
  rivers: RIVERS,
  
  // Movie-accurate province data
  provinces: {
    volcano:        VOLCANO,
    lagoon:         LAGOON,
    lostCity:       LOST_CITY,
    nautilusBay:    NAUTILUS_BAY,
    nautilus:       NAUTILUS,
    secondaryRidge: SECONDARY_RIDGE,
    ventField:      VENT_FIELD,
    ringFault:      RING_FAULT,
    cascadeRiver:   CASCADE_RIVER,
    cliffSegments:  CLIFF_SEGMENTS,
  },

  // Engineered & natural structures
  structures: {
    nautilusDock:       NAUTILUS,
    lostCity:           LOST_CITY,
    lostCityCanals:     LOST_CITY_CANALS,
    submergedCauseway:  LOST_CITY_CAUSEWAY,
    nautilusBay:        NAUTILUS_BAY,
    collapsingTower:    COLLAPSING_TOWER,
    lavaTubes:          LAVA_TUBES,
    lavaFlowAxes:       LAVA_FLOW_AXES,
    waterfallLedge:     WATERFALL_LEDGE,
    lagoonCliffs:       LAGOON_CLIFFS,
    seaCaves:           SEA_CAVES,
    summitFeatures:     SUMMIT_FEATURES,
    hydrothermalField:  HYDROTHERMAL_STRUCTURES,
  },

  // Subsurface architecture
  subsurface: SUBSURFACE,

  // Biome and atmosphere
  biomeZones:          BIOME_ZONES,
  jungleDensityZones:  JUNGLE_DENSITY_ZONES,
  atmosphericZones:    ATMOSPHERIC_ZONES,

  // Terrain generation functions
  generateHeight,
  getStructuralOffset,
  getLayerAt,
  getLayerByElevation,
  computeLayerIndex,
  getDenseRiverPath,
  getLavaFlowMask,
};
