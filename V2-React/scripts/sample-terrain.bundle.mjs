// src/engine/noise.js
var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2F = (3 - Math.sqrt(3)) / 6;
function fbm(noise2, x, z, octaves = 6, lacunarity = 2, gain = 0.5) {
  let sum = 0, amp = 1, freq = 1, maxAmp = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise2(x * freq, z * freq) * amp;
    maxAmp += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / maxAmp;
}
function ridgeNoise(noise2, x, z, octaves = 4) {
  let sum = 0, amp = 1, freq = 1;
  for (let o = 0; o < octaves; o++) {
    let n = noise2(x * freq, z * freq);
    n = 1 - Math.abs(n);
    n *= n;
    sum += n * amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum;
}

// src/engine/TerrainGenerator.js
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function subdivideRiverPath(pts, subsPerSeg = 8) {
  const result = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < subsPerSeg; j++) {
      const t = j / subsPerSeg;
      result.push({
        x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
        z: catmullRom(p0.z, p1.z, p2.z, p3.z, t)
      });
    }
  }
  result.push({ x: pts[pts.length - 1].x, z: pts[pts.length - 1].z });
  return result;
}

// src/islands/mysterious.js
var TERRAIN_SIZE = 2e3;
var SEGMENTS = 512;
var WATER_LEVEL = 38;
var VOLCANO = {
  cx: 0,
  cz: 0,
  peakElevation: 100,
  // 1600m / 16 = 100 eng
  craterRadius: 75,
  // 1200m / 16 = 75 eng
  craterFloorElev: 97,
  // 1550m / 16 = 97 eng (crater floor)
  craterRimElev: 109,
  // 1750m / 16 = 109 eng
  baseRadius: 375
  // 6000m / 16 = 375 eng
};
var LAGOON = {
  cx: -375,
  cz: 250,
  // (-6000, 4000) / 16
  radius: 56,
  // 900m / 16 = 56 eng
  surfaceElevation: 14,
  // 220m / 16 = ~14 eng
  waterDepth: 1.1,
  // 18m / 16 = ~1 eng
  innerCliffHeight: 8.75
  // 140m / 16 = ~9 eng
};
var NAUTILUS = {
  // Location coordinates
  entranceCx: -394,
  entranceCz: 231,
  // (-6300, 3700) / 16
  chamberCx: -381,
  chamberCz: 244,
  // (-6100, 3900) / 16
  length: 16.25,
  // 260m / 16
  width: 11.25,
  // 180m / 16
  elevation: 13.4,
  // 215m / 16
  depth: -2.5,
  // -40m relative
  ceilingHeight: 2.8,
  // 45m / 16
  steamVentCx: -378,
  steamVentCz: 251,
  // (-6050, 4020) / 16
  // Structural features (engineered elements)
  structures: {
    stoneDockPlatform: {
      cx: -378,
      cz: 250,
      length: 8,
      // 128m / 16
      width: 3,
      // 48m / 16
      elevation: -2.2,
      // -35m relative
      material: "basalt-block",
      condition: "ancient-weathered"
    },
    ironRailings: {
      present: true,
      sections: 6,
      heightAboveDeck: 0.07,
      // 1.1m / 16
      material: "wrought-iron",
      condition: "rusted-intact"
    },
    timberDecking: {
      cx: -378,
      cz: 250,
      length: 6,
      width: 2.5,
      material: "teak",
      condition: "weathered-stable"
    },
    dockingCradle: {
      cx: -375,
      cz: 248,
      length: 10,
      // submarine berth
      width: 3.5,
      depth: -2.8,
      material: "carved-basalt"
    },
    mooringPosts: [
      { cx: -382, cz: 252, height: 0.12 },
      { cx: -382, cz: 246, height: 0.12 },
      { cx: -374, cz: 252, height: 0.12 },
      { cx: -374, cz: 246, height: 0.12 }
    ]
  },
  // Cavern environment
  environment: {
    ceiling: {
      type: "arched-lava-tube",
      height: 2.8,
      stalactites: true,
      sulfurStaining: true,
      stainColor: "#C4A000"
    },
    steamFissures: [
      { cx: -385, cz: 255, intensity: 0.7 },
      { cx: -372, cz: 248, intensity: 0.5 }
    ],
    waterLevel: {
      depth: 1.8,
      // partially water-filled
      clarity: 0.6,
      temperature: 28
      // geothermally warmed
    },
    lighting: {
      type: "volumetric-steam",
      shafts: [
        { angle: 0.3, intensity: 0.4 }
        // light through entrance
      ],
      ambientColor: "#2A3D4A"
    }
  },
  // Access tunnel from lagoon
  accessTunnel: {
    entranceCx: -394,
    entranceCz: 231,
    chamberCx: -381,
    chamberCz: 244,
    width: 5,
    // 80m / 16
    height: 3.5,
    // 56m / 16
    curvature: 0.15,
    // slight bend
    waterDepth: 1.5
  }
};
var SECONDARY_RIDGE = {
  startX: -500,
  startZ: -375,
  // (-8000, -6000) / 16
  endX: 375,
  endZ: -500,
  // (6000, -8000) / 16
  elevation: 50,
  // 700-900m / 16 = 44-56 eng (avg 50)
  width: 130
  // ~2km wide influence zone
};
var VENT_FIELD = {
  cx: 250,
  cz: -125,
  // (4000, -2000) / 16
  radius: 19,
  // 300m / 16
  suppressionRadius: 31,
  // 500m / 16
  elevation: 31
  // 500m / 16
};
var RING_FAULT = {
  radius: 250,
  // 4000m / 16 = 250 eng
  displacement: 0.5
  // 6-12m / 16 = ~0.5 eng vertical drop
};
var CASCADE_RIVER = {
  sourceX: 125,
  sourceZ: 313,
  // (2000, 5000) / 16
  sourceElevation: 56,
  // 900m / 16
  waterfallX: -188,
  waterfallZ: 188,
  // (-3000, 3000) / 16
  waterfallDrop: 3.75,
  // 60m / 16
  mouthX: -325,
  mouthZ: 238,
  // (-5200, 3800) / 16
  canyonDepth: 7.5
  // 120m / 16
};
var CLIFF_SEGMENTS = [
  { name: "West Amphitheater", cx: -988, cz: 0, height: 7.5, azimuthCenter: Math.PI },
  // (-15800, 0) / 16, 120m
  { name: "North Pillars", cx: 0, cz: 863, height: 6.25, azimuthCenter: Math.PI / 2 },
  // (0, 13800) / 16, 100m
  { name: "East Broken Cliffs", cx: 925, cz: 0, height: 4.4, azimuthCenter: 0 },
  // (14800, 0) / 16, 70m
  { name: "South Shear Zone", cx: 0, cz: -844, height: 5.3, azimuthCenter: -Math.PI / 2 }
  // (0, -13500) / 16, 85m
];
var LAVA_FLOW_AXES = [
  { angle: 0.1, length: 330, width: 42, originR: 24 },
  { angle: 0.95, length: 280, width: 32, originR: 20 },
  { angle: 1.62, length: 300, width: 28, originR: 16 },
  { angle: 2.35, length: 260, width: 24, originR: 18 },
  { angle: 3.08, length: 340, width: 45, originR: 26 },
  { angle: 3.85, length: 240, width: 22, originR: 14 },
  { angle: 4.72, length: 310, width: 34, originR: 22 },
  { angle: 5.42, length: 220, width: 20, originR: 12 }
];
var LAVA_COLLAPSE_SCAR = {
  angle: 2.55,
  radius: 190
};
var LAVA_TUBES = {
  primary: {
    name: "Main Lagoon Tube",
    // Path from near (0, 1500) descending toward lagoon system
    path: [
      { x: 0, z: 94, depth: -1.25 },
      // (0, 1500) / 16, -20m
      { x: -63, z: 113, depth: -1.9 },
      // descending
      { x: -125, z: 138, depth: -2.5 },
      // mid-section
      { x: -200, z: 163, depth: -3.1 },
      // approaching lagoon
      { x: -288, z: 194, depth: -3.4 },
      // pre-chamber
      { x: -381, z: 231, depth: -2.5 }
      // NAUTILUS entrance zone
    ],
    diameterRange: [1, 1.6],
    // 16–25 m in real
    skylights: [
      { x: -125, z: 138, radius: 6 },
      // collapsed skylight -2000, 2200
      { x: -200, z: 163, radius: 4 }
      // smaller skylight
    ]
  },
  secondary: [
    {
      name: "Western Branch",
      path: [
        { x: -125, z: 138, depth: -2.5 },
        // branches from primary
        { x: -188, z: 125, depth: -2.8 },
        { x: -250, z: 125, depth: -3.1 }
        // (-4000, 2000) / 16
      ],
      diameterRange: [0.5, 1]
      // 8–16 m
    },
    {
      name: "Eastern Branch",
      path: [
        { x: 0, z: 94, depth: -1.25 },
        // branches from primary start
        { x: 63, z: 31, depth: -1.9 },
        { x: 125, z: -31, depth: -2.5 },
        { x: 156, z: -94, depth: -3.1 }
        // (2500, -1500) / 16
      ],
      diameterRange: [0.5, 0.9]
      // 8–14 m
    }
  ],
  features: {
    stalactites: true,
    calciteDeposition: true,
    steamPockets: true,
    chokePoints: [
      { x: -200, z: 163, minDiameter: 0.5 }
      // narrow passage
    ]
  }
};
var SUMMIT_FEATURES = {
  fumaroles: [
    { cx: 8, cz: 12, temp: 380, radius: 3 },
    // main fumarole cluster
    { cx: -15, cz: 5, temp: 320, radius: 2.5 },
    { cx: 10, cz: -8, temp: 290, radius: 2 },
    { cx: -5, cz: -18, temp: 340, radius: 3.2 },
    { cx: 22, cz: 3, temp: 260, radius: 1.8 }
  ],
  sulfurCrustZone: {
    cx: 0,
    cz: 0,
    radius: 50,
    // 800m / 16 = 50 eng
    intensity: 0.8,
    // yellow tint strength
    color: "#C4A000"
  },
  groundCracks: [
    { startX: -25, startZ: 30, endX: 15, endZ: 45, width: 0.3 },
    { startX: 20, startZ: -10, endX: 40, endZ: 25, width: 0.25 },
    { startX: -35, startZ: -5, endX: -10, endZ: -30, width: 0.35 }
  ],
  steamPlumes: [
    { cx: 0, cz: 0, radius: 25, height: 120 },
    // main crater steam
    { cx: 8, cz: 12, radius: 8, height: 45 },
    // fumarole plumes
    { cx: -15, cz: 5, radius: 6, height: 35 }
  ],
  minorVentCones: [
    { cx: 45, cz: 20, baseRadius: 12, height: 18 },
    // parasitic cone NE
    { cx: -38, cz: 35, baseRadius: 8, height: 12 },
    // parasitic cone NW
    { cx: 30, cz: -45, baseRadius: 10, height: 14 }
    // parasitic cone SE
  ],
  ringFaultScar: {
    visibleArc: { startAngle: -0.3, endAngle: 1.2 },
    // radians, partial exposure
    scarpHeight: 8,
    // 128m / 16
    fractureZoneWidth: 15
  }
};
var SEA_CAVES = [
  {
    name: "West Amphitheater Caves",
    segment: "West Amphitheater",
    caves: [
      { cx: -938, cz: 50, depth: 25, width: 8, height: 12 },
      { cx: -950, cz: -30, depth: 35, width: 12, height: 18 },
      { cx: -925, cz: 80, depth: 18, width: 6, height: 10 }
    ],
    basaltColumns: { present: true, columnDiameter: 0.8, spacing: 1.2 },
    waveCutTerrace: { elevation: WATER_LEVEL + 2, width: 8 }
  },
  {
    name: "North Pillar Caves",
    segment: "North Pillars",
    caves: [
      { cx: 40, cz: 830, depth: 20, width: 10, height: 15 },
      { cx: -25, cz: 845, depth: 28, width: 8, height: 12 }
    ],
    basaltColumns: { present: true, columnDiameter: 1, spacing: 1.5 },
    seaStacks: [
      { cx: 60, cz: 880, baseRadius: 8, height: 25 },
      { cx: -40, cz: 895, baseRadius: 6, height: 18 }
    ]
  },
  {
    name: "East Broken Caves",
    segment: "East Broken Cliffs",
    caves: [
      { cx: 890, cz: 35, depth: 15, width: 7, height: 9 },
      { cx: 905, cz: -50, depth: 22, width: 9, height: 11 }
    ],
    naturalArches: [
      { cx: 880, cz: 0, span: 12, height: 8, thickness: 3 }
    ]
  },
  {
    name: "South Shear Caves",
    segment: "South Shear Zone",
    caves: [
      { cx: 30, cz: -810, depth: 30, width: 11, height: 14 },
      { cx: -45, cz: -825, depth: 25, width: 8, height: 10 }
    ],
    blackSandCoves: [
      { cx: 0, cz: -795, rx: 20, rz: 12 },
      { cx: 60, cz: -805, rx: 15, rz: 10 }
    ]
  }
];
var WATERFALL_LEDGE = {
  cx: CASCADE_RIVER.waterfallX,
  // (-3000, 3000) / 16 = (-188, 188)
  cz: CASCADE_RIVER.waterfallZ,
  overhang: {
    depth: 4,
    // 64m / 16 = 4 eng overhang projection
    height: 3.75,
    // 60m / 16 = 3.75 eng vertical drop
    width: 8
    // 128m / 16 = 8 eng ledge width
  },
  plungePool: {
    cx: -192,
    // slightly offset downstream
    cz: 185,
    radius: 6,
    // 96m / 16
    depth: 1.25
    // 20m / 16
  },
  mistPlume: {
    radius: 12,
    height: 25,
    opacity: 0.6
  },
  wetRockZone: {
    radius: 15,
    slipperiness: 0.9
  }
};
var LAGOON_CLIFFS = {
  cx: LAGOON.cx,
  cz: LAGOON.cz,
  innerRadius: LAGOON.radius * 0.95,
  outerRadius: LAGOON.radius * 1.2,
  cliffHeight: LAGOON.innerCliffHeight,
  features: {
    overhangingLedges: [
      { angle: 0.5, depth: 2, width: 8 },
      { angle: 2.1, depth: 1.5, width: 6 },
      { angle: 4.2, depth: 2.5, width: 10 }
    ],
    narrowPaths: [
      { startAngle: 0.8, endAngle: 1.4, width: 1.5, elevation: 0.5 },
      { startAngle: 3.5, endAngle: 4, width: 2, elevation: 0.3 }
    ],
    rockfallDebris: [
      { cx: -385, cz: 262, radius: 8, density: 0.7 },
      { cx: -360, cz: 238, radius: 6, density: 0.5 }
    ]
  },
  jungleRim: {
    densityBoost: 2
    // 2x vegetation at rim
  }
};
var JUNGLE_DENSITY_ZONES = [
  {
    name: "Peak Density Zone",
    cx: -250,
    cz: 125,
    // (-4000, 2000) / 16 — highest density
    radius: 125,
    // 2km / 16
    densityMultiplier: 1.5,
    features: ["giantFerns", "massiveCycads", "denseBamboo", "thickCanopy", "lianaVines"]
  },
  {
    name: "Lagoon Riparian",
    cx: LAGOON.cx,
    cz: LAGOON.cz,
    radius: LAGOON.radius * 1.5,
    densityMultiplier: 2,
    // 2x density at lagoon perimeter
    features: ["riparianVegetation", "ferns", "moistureLovers"]
  },
  {
    name: "River Corridor",
    followsRiver: "Cascade River",
    corridorWidth: 30,
    densityMultiplier: 1.8,
    features: ["riparianVegetation", "bamboo", "lianas"]
  },
  {
    name: "Hydrothermal Suppression",
    cx: VENT_FIELD.cx,
    cz: VENT_FIELD.cz,
    radius: VENT_FIELD.suppressionRadius,
    densityMultiplier: 0.5,
    // 50% reduction
    features: ["heatTolerantScrub", "deadTrees", "mineralCrusts"]
  },
  {
    name: "Summit Barren",
    cx: 0,
    cz: 0,
    radius: 100,
    // 1600m / 16 — near summit
    densityMultiplier: 0.1,
    features: ["bareRock", "sulfurCrusts", "lichens"]
  }
];
var HYDROTHERMAL_STRUCTURES = {
  cx: VENT_FIELD.cx,
  cz: VENT_FIELD.cz,
  activeZoneRadius: VENT_FIELD.radius,
  suppressionRadius: VENT_FIELD.suppressionRadius,
  steamVentClusters: [
    { cx: 250, cz: -125, count: 8, radius: 6, avgTemp: 180 },
    { cx: 258, cz: -118, count: 5, radius: 4, avgTemp: 220 },
    { cx: 242, cz: -130, count: 6, radius: 5, avgTemp: 160 }
  ],
  mineralCrustMounds: [
    { cx: 248, cz: -120, radius: 4, height: 1.2, composition: "sulfur-silica" },
    { cx: 255, cz: -128, radius: 3, height: 0.8, composition: "iron-oxide" },
    { cx: 245, cz: -132, radius: 5, height: 1.5, composition: "geyserite" }
  ],
  hotPools: [
    { cx: 252, cz: -122, rx: 3, rz: 2.5, temp: 85, color: "#6BC4D8" },
    { cx: 246, cz: -128, rx: 2, rz: 2, temp: 72, color: "#8FD4A0" }
  ],
  discoloredGround: {
    cx: VENT_FIELD.cx,
    cz: VENT_FIELD.cz,
    radius: 25,
    colors: ["#C4A000", "#8B4513", "#D2691E", "#FFFFFF"]
    // sulfur, iron, rust, silica
  },
  fissurecracks: [
    { startX: 240, startZ: -115, endX: 260, endZ: -135, width: 0.2, steam: true },
    { startX: 245, startZ: -140, endX: 255, endZ: -110, width: 0.15, steam: true }
  ],
  vegetationDieOff: {
    radius: VENT_FIELD.suppressionRadius,
    deadTreeDensity: 0.3,
    bleachedColor: "#8B8378"
  }
};
var LAYERS = [
  {
    name: "Basaltic Shield",
    baseElevation: 0,
    color: "#2A2727",
    hex: 2762535,
    vegetationDensity: 0.02,
    minerals: [
      "Olivine",
      "Augite",
      "Labradorite Plagioclase",
      "Magnetite",
      "Ilmenite",
      "Zeolites (secondary)"
    ],
    characteristics: "The oldest exposed volcanic rock on the island \u2014 dense tholeiitic basalt erupted during the initial shield-building phase when the mantle plume hotspot first breached oceanic crust. Massive lava sheets (2\u201315 m thick) are separated by thin red palaeosol horizons. Columnar jointing (hexagonal columns 0.3\u20131 m diameter) develops in units thicker than ~5 m.",
    grainSize: "Fine to medium (0.1\u20132 mm)",
    texture: "Vesicular to massive; ophitic; columnar jointing; pillow structures at coast",
    fossils: "None \u2014 volcanic.",
    age: "Miocene\u2013Pliocene (~6\u20133 Ma)",
    hardness: 8,
    porosity: 0.04,
    permeability: "Low (fracture-controlled)",
    jointSpacing: "0.3\u20131 m (columnar)",
    jointSets: 3,
    jointAzimuth: null,
    weatheringRate: "Very slow",
    mechanicalStrength: 220,
    fractureAperture: 0.5
  },
  {
    name: "Tholeiitic Lava Flows",
    baseElevation: 200,
    color: "#4A3728",
    hex: 4863784,
    vegetationDensity: 0.55,
    minerals: [
      "Plagioclase",
      "Augite",
      "Orthopyroxene",
      "Olivine",
      "Magnetite",
      "Ilmenite",
      "Calcite (vesicle fill)"
    ],
    characteristics: "Successive flood basalt flows as the shield volcano grew above sea level. Each flow unit (0.5\u20138 m thick) shows three-part architecture: glassy chilled base, vesicular scoriaceous top, and dense crystalline interior. Lava tube voids up to 8 m diameter \u2014 Hidden Lagoon formed from collapsed tube system.",
    grainSize: "Very fine to fine (0.01\u20131 mm)",
    texture: "Pahoehoe to aa transition; scoriaceous tops; lava tube voids",
    fossils: "None \u2014 volcanic.",
    age: "Pliocene\u2013Pleistocene (~3\u20131 Ma)",
    hardness: 7,
    porosity: 0.12,
    permeability: "Moderate",
    jointSpacing: "0.5\u20133 m",
    jointSets: 2,
    jointAzimuth: 135,
    weatheringRate: "Slow\u2013moderate",
    mechanicalStrength: 160,
    fractureAperture: 0.8
  },
  {
    name: "Pyroclastic Breccia",
    baseElevation: 390,
    color: "#7D5040",
    hex: 8212544,
    vegetationDensity: 0.65,
    minerals: [
      "Volcanic Glass (sideromelane/tachylite)",
      "Plagioclase phenocrysts",
      "Pyroxene lithics",
      "Sulphur crystals",
      "Alunite",
      "Kaolinite"
    ],
    characteristics: "Poorly sorted volcaniclastic deposits from explosive Vulcanian and Plinian activity. Includes lahar units, pyroclastic surge deposits with accretionary lapilli, and block-and-ash flow deposits from dome-collapse events. Sulphur-yellow fumarolic alteration and bleached kaolinite-alunite zones near vents.",
    grainSize: "Very poorly sorted \u2014 clay to 2 m blocks; modal size 5\u201350 mm",
    texture: "Massive (lahar); cross-bedded (surge); accretionary lapilli",
    fossils: "Carbonised tree and fern fragments (800 ka)",
    age: "Pleistocene (~1.5\u20130.3 Ma)",
    hardness: 3,
    porosity: 0.3,
    permeability: "Variable",
    jointSpacing: "0.3\u20132 m",
    jointSets: 1,
    jointAzimuth: 90,
    weatheringRate: "Rapid",
    mechanicalStrength: 12,
    fractureAperture: 2
  },
  {
    name: "Andesitic Lava",
    baseElevation: 650,
    color: "#5C4A3F",
    hex: 6048319,
    vegetationDensity: 0.28,
    minerals: [
      "Plagioclase (An\u2084\u2080\u2013\u2086\u2080)",
      "Hornblende",
      "Biotite",
      "Orthopyroxene",
      "Fe-Ti Oxides",
      "Pyrite",
      "Quartz",
      "Gold (epithermal veins, trace)"
    ],
    characteristics: "Viscous andesite (SiO\u2082 58\u201364 wt%) forming the bulk of Golden Mountain above 300 m. Individual flows 5\u201325 m thick, 50\u2013200 m wide, with lev\xE9e walls. Radial dikes (1\u201310 m wide, 100\u20132000 m long) cut through older units. GOLD-BEARING EPITHERMAL VEINS in hydrothermal fractures above the ring fault zone.",
    grainSize: "Fine to medium (0.5\u20134 mm); strongly porphyritic",
    texture: "Porphyritic; trachytic flow alignment; platy + columnar jointing",
    fossils: "None",
    age: "Pleistocene\u2013Holocene (~0.5 Ma \u2013 ongoing)",
    hardness: 7,
    porosity: 0.06,
    permeability: "Low (elevated in fault zones)",
    jointSpacing: "0.5\u20132 m",
    jointSets: 4,
    jointAzimuth: 45,
    weatheringRate: "Slow\u2013moderate",
    mechanicalStrength: 150,
    fractureAperture: 1.2
  },
  {
    name: "Tephra & Lapilli",
    baseElevation: 1100,
    color: "#8B7355",
    hex: 9139029,
    vegetationDensity: 0.12,
    minerals: [
      "Volcanic Glass Shards",
      "Plagioclase micro-phenocrysts",
      "Pyroxene",
      "Pyrite",
      "Sulphur",
      "Magnetite"
    ],
    characteristics: "Unconsolidated pyroclastic fall and surge deposits above 550 m. Multiple couplets of fine ash (0.1\u20135 mm) and coarser lapilli (2\u201364 mm) from sub-Plinian to Plinian eruption columns (15\u201330 km height). Bomb sag structures near vent (< 1.5 km). Most recent eruption < 200 years ago.",
    grainSize: "Lapilli 2\u201364 mm; coarse ash 0.063\u20132 mm",
    texture: "Massive to graded fallout; cross-bedded surge; bomb sag structures",
    fossils: "Rare carbonised vegetation",
    age: "Late Pleistocene\u2013Holocene (<300 ka)",
    hardness: 1,
    porosity: 0.45,
    permeability: "High in lapilli, low in fine ash",
    jointSpacing: "N/A (unconsolidated)",
    jointSets: 0,
    jointAzimuth: null,
    weatheringRate: "Very rapid",
    mechanicalStrength: 0.8,
    fractureAperture: null
  },
  {
    name: "Volcanic Ash & Andisol",
    baseElevation: 1480,
    color: "#3A6B2A",
    hex: 3828522,
    vegetationDensity: 0.06,
    minerals: [
      "Allophane (Al-Si gel)",
      "Imogolite",
      "Ferrihydrite",
      "Kaolinite",
      "Quartz silt",
      "Organic humate",
      "Fe-Mn oxide nodules"
    ],
    characteristics: "Andisol \u2014 volcanic soil from weathered tephra in the jungle belt below 600 m. Unique allophane mineralogy: water-retention 80\u2013120% by weight, spongy thixotropic texture, high organic carbon (5\u201320%). Jet-black A-horizon (0.3\u20130.6 m) from jungle canopy decomposition. Soil temperatures 28\u201335 \xB0C at 0.5 m depth from geothermal heating.",
    grainSize: "Clay-rich (< 0.002 mm allophane gel)",
    texture: "Massive, thixotropic; dark A-horizon; Fe-Mn nodule-rich B-horizon",
    fossils: "Sub-fossil plant roots; pollen assemblage",
    age: "Holocene (<11.7 ka, ongoing ~1\u20135 mm/yr)",
    hardness: 0.5,
    porosity: 0.65,
    permeability: "High (bioturbation/root channels)",
    jointSpacing: "N/A (unconsolidated)",
    jointSets: 0,
    jointAzimuth: null,
    weatheringRate: "Formation-dominated (~1\u20135 mm/yr)",
    mechanicalStrength: 0.05,
    fractureAperture: null
  }
];
var GEOLOGICAL_PROCESSES = [
  {
    name: "Active Volcanism & Hydrothermal Degassing",
    affectedLayers: ["Andesitic Lava", "Tephra & Lapilli"],
    timescale: "10\u2070\u201310\xB3 years",
    description: "The Golden Mountain magma chamber (~6 km diameter, top at ~3 km depth) drives continuous degassing through ring-fault and radial dike conduits. Fumarole temperatures 150\u2013450 \xB0C. Eruption episodes every 50\u2013200 years (VEI 3\u20135). Island subsidence rate accelerating due to magma chamber instability.",
    visualSign: "Sulphur-yellow crusts; bleached alteration halos; steam venting; H\u2082S odour"
  },
  {
    name: "Epithermal Gold Mineralisation",
    affectedLayers: ["Andesitic Lava", "Pyroclastic Breccia"],
    timescale: "10\u2074\u201310\u2076 years",
    description: "Magmatic fluids (200\u2013350 \xB0C) mixing with meteoric water in the ring-fault zone precipitate quartz + adularia + pyrite + galena \xB1 native gold assemblage. Au grades 2\u201325 g/t in bonanza veins within 500 m of the ring fault.",
    visualSign: "White quartz vein halos; pyrite glint; gold-brown gossan staining"
  },
  {
    name: "Caldera Collapse & Island Subsidence",
    affectedLayers: ["Andesitic Lava", "Pyroclastic Breccia", "Tholeiitic Lava Flows"],
    timescale: "10\u2070\u201310\xB3 years",
    description: "Partial drainage of the magma chamber causes caldera roof subsidence along ring faults. Lithospheric cooling, chamber compaction, and microplate instability drive subsidence. Catastrophic collapse could sink the island in hours (movie scenario).",
    visualSign: "Ring-fault scarps; down-dropped terrace blocks; tension cracks; tilted benches"
  },
  {
    name: "Lahar Generation (Rain-triggered Mass Flows)",
    affectedLayers: ["Pyroclastic Breccia", "Tephra & Lapilli"],
    timescale: "10\u2070\u201310\xB2 years",
    description: "Tropical rainfall (>200 mm/hr) saturates loose pyroclastic deposits, triggering mass flows at 40\u201380 km/hr in confined gorges. Volumes 10\u2075\u201310\u2076 m\xB3. Cascade River gorge carved by repeated lahar events within the last 50 ka.",
    visualSign: "Fresh debris-flow lev\xE9es; muddy river during rain; stripped hillslopes"
  },
  {
    name: "Coastal Cliff Erosion & Sea Cave Formation",
    affectedLayers: ["Basaltic Shield", "Tholeiitic Lava Flows"],
    timescale: "10\xB2\u201310\u2075 years",
    description: "Wave action exploits columnar joints in 40\u2013120 m coastal cliffs. Sea caves develop along vertical sheet-joint planes. Natural arches form when caves breach. Coastal retreat rate ~0.5\u20132 cm/yr, producing black-sand beaches.",
    visualSign: "Black sand beaches; wave-cut platforms; sea caves; sea stacks"
  },
  {
    name: "Andisol Formation & Jungle Geothermal Acceleration",
    affectedLayers: ["Volcanic Ash & Andisol", "Tephra & Lapilli"],
    timescale: "10\xB2\u201310\xB3 years",
    description: "Geothermally heated soils (28\u201335 \xB0C) accelerate tephra weathering 2\u20133\xD7 normal. Organic matter input from hyper-productive jungle (150\u2013200 t/ha/yr biomass turnover) creates distinctive jet-black A-horizon. Net andisol accretion ~2\u20135 mm/yr.",
    visualSign: "Jet-black spongy soil; warm steam from soil near hot-ground zones"
  }
];
var LAYER_INTERACTIONS = [
  {
    upper: "Tholeiitic Lava Flows",
    lower: "Basaltic Shield",
    contactType: "Gradational conformable",
    description: "Continuous volcanic stratigraphy from shield to flood basalt.",
    hydrogeology: "Continuous basalt aquifer; lava tubes span the contact.",
    hazard: null
  },
  {
    upper: "Pyroclastic Breccia",
    lower: "Tholeiitic Lava Flows",
    contactType: "Erosional unconformity",
    description: "Major unconformity with up to 30 m relief. Principal failure plane for sector collapse.",
    hydrogeology: "Lahar matrix creates perched water table in overlying pyroclastics.",
    hazard: "Sector collapse plane \u2014 potential for >10\u2077 m\xB3 flank landslide and tsunami."
  },
  {
    upper: "Andesitic Lava",
    lower: "Pyroclastic Breccia",
    contactType: "Conformable to weakly unconformable",
    description: "Andesite lavas bake pyroclastic breccia (1\u20135 m aureole). Gold-bearing fluids migrated along this horizon.",
    hydrogeology: "Contact zone hosts mineralised fracture veins.",
    hazard: "Baked contact may fracture in earthquakes, triggering rockfall."
  },
  {
    upper: "Tephra & Lapilli",
    lower: "Andesitic Lava",
    contactType: "Conformable \u2014 fallout drape",
    description: "Sharp colour change from dark-grey lava to brown-buff lapilli.",
    hydrogeology: "Perched water table above andesite; springs emerge at contact.",
    hazard: "Tephra debris flows initiate at this contact when saturated."
  },
  {
    upper: "Volcanic Ash & Andisol",
    lower: "Tephra & Lapilli",
    contactType: "Gradational \u2014 pedogenic transition",
    description: "Progressive weathering of lapilli into andisol. Weathering front at 0.5\u20132 m depth.",
    hydrogeology: "Andisol storage above, high-transmissivity lapilli below.",
    hazard: "Loss of vegetation triggers catastrophic gullying."
  }
];
var LAKES = [
  {
    // Caldera Lake — inside Golden Mountain summit crater
    cx: 0,
    cz: 0,
    rx: 37,
    rz: 35,
    depth: 15,
    // Scaled depth for engine
    name: "Caldera Lake"
  },
  {
    // Hidden Lagoon — collapsed secondary crater
    cx: LAGOON.cx,
    cz: LAGOON.cz,
    rx: LAGOON.radius,
    rz: LAGOON.radius - 4,
    depth: 12,
    name: "Hidden Lagoon"
  }
];
var RIVERS = [
  {
    name: "Cascade River",
    width: 22,
    depth: 95,
    // Water appearance (sediment-tinted as per spec)
    appearance: {
      color: "#5D4E37",
      // sediment-brown tint
      clarity: 0.4,
      // moderate turbidity
      sedimentLoad: "volcanic-ash",
      flowSpeed: "moderate-fast"
    },
    canyonWalls: {
      height: 50,
      // 40-80m / 16 = 2.5-5 eng (avg ~3.1)
      profile: "V-shaped",
      boulderChokes: [
        { x: 10, z: 248 },
        // narrow boulder section
        { x: -95, z: 218 }
        // second choke point
      ]
    },
    points: [
      { x: CASCADE_RIVER.sourceX, z: CASCADE_RIVER.sourceZ },
      // NE source — 900 m elevation
      { x: 95, z: 295 },
      // upper valley
      { x: 55, z: 270 },
      // descending gorge
      { x: 10, z: 248 },
      // andesite section
      { x: -45, z: 232 },
      // mid-gorge
      { x: -95, z: 218 },
      // pyroclastic valley
      { x: -145, z: 205 },
      // gorge narrows
      { x: CASCADE_RIVER.waterfallX, z: CASCADE_RIVER.waterfallZ },
      // WATERFALL ZONE
      { x: -230, z: 210 },
      // post-waterfall plunge
      { x: -285, z: 225 },
      // lower basalt gorge
      { x: CASCADE_RIVER.mouthX, z: CASCADE_RIVER.mouthZ }
      // river mouth — lagoon
    ]
  }
];
var NAUTILUS_FLAT = {
  cx: NAUTILUS.entranceCx,
  cz: NAUTILUS.entranceCz,
  radius: 20,
  elevation: 215
};
var _denseCache = /* @__PURE__ */ new Map();
function getDenseRiverPath(river) {
  if (_denseCache.has(river.name)) return _denseCache.get(river.name);
  const dense = subdivideRiverPath(river.points, 8);
  _denseCache.set(river.name, dense);
  return dense;
}
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
    const perpDist = Math.abs(vx * -dirZ + vz * dirX);
    if (perpDist <= flow.width) {
      const inside = Math.max(0, 1 - perpDist / flow.width);
      const alongT = 1 - distAlong / flow.length;
      const flowFade = alongT * alongT * (3 - 2 * alongT);
      mask = Math.max(mask, inside * flowFade);
    }
  }
  return Math.max(0, Math.min(1, mask));
}
function generateHeight(noise2, noiseB2, wx, wz) {
  const HALF = TERRAIN_SIZE / 2;
  const nx = wx / HALF;
  const nz = wz / HALF;
  const angle = Math.atan2(nz, nx);
  const ellipRx = 1;
  const ellipRz = 0.875;
  const ellipR = Math.sqrt((nx / ellipRx) ** 2 + (nz / ellipRz) ** 2);
  const r_eng = Math.sqrt(wx * wx + wz * wz);
  const westBias = Math.max(0, -nx * 0.3 + 0.15);
  const westernHighlands = westBias * 300 * Math.max(0, 1 - ellipR * 1.05);
  const northBias = Math.max(0, nz * 0.25 + 0.1);
  const northernPlateau = northBias * 240 * Math.max(0, 1 - ellipR * 1.02);
  const seDep = Math.max(0, nx * 0.4 - nz * 0.3 - 0.2);
  const seDepression = -seDep * 150 * Math.max(0, 1 - ellipR);
  const baseTerrain = fbm(noise2, wx * 8e-4 + 50, wz * 8e-4 + 50, 5) * 120 + fbm(noiseB2, wx * 15e-4 + 80, wz * 15e-4 + 80, 4) * 70;
  let h = WATER_LEVEL + 120 + westernHighlands + northernPlateau + seDepression + baseTerrain;
  const rsx = SECONDARY_RIDGE.startX, rsz = SECONDARY_RIDGE.startZ;
  const rex = SECONDARY_RIDGE.endX, rez = SECONDARY_RIDGE.endZ;
  const rldx = rex - rsx, rldz = rez - rsz;
  const rlLen2 = rldx * rldx + rldz * rldz;
  const rlt = Math.max(0, Math.min(1, ((wx - rsx) * rldx + (wz - rsz) * rldz) / rlLen2));
  const rcx = rsx + rlt * rldx, rcz = rsz + rlt * rldz;
  const ridgeDist = Math.sqrt((wx - rcx) ** 2 + (wz - rcz) ** 2);
  const ridgeWidth = SECONDARY_RIDGE.width;
  const ridgeMask = Math.max(0, 1 - ellipR * 1.1);
  let ridgeH = 0;
  if (ridgeDist < ridgeWidth) {
    const ridgeT = ridgeDist / ridgeWidth;
    ridgeH = Math.pow(Math.max(0, 1 - ridgeT), 1.6) * SECONDARY_RIDGE.elevation * ridgeMask;
    ridgeH += ridgeNoise(noiseB2, wx * 5e-3 + 30, wz * 5e-3 + 30, 3) * 18 * (1 - ridgeT) * ridgeMask;
  }
  h += ridgeH;
  const volcDist = r_eng / VOLCANO.baseRadius;
  const innerCone = volcDist < 0.25 ? (1 - volcDist / 0.25) ** 1.8 * 260 : 0;
  const midSlope = volcDist < 0.6 ? Math.max(0, 1 - volcDist / 0.6) ** 2.8 * 180 : 0;
  const outerSkirt = volcDist < 1.2 ? Math.max(0, 1 - volcDist / 1.2) ** 3 * 110 : 0;
  const volcAsym = 1 + 0.12 * Math.cos(angle * 1 - 0.8) + 0.08 * Math.sin(angle * 2 + 0.3);
  const volcanoElevation = (innerCone + midSlope + outerSkirt) * volcAsym;
  const volcRough = volcDist < 1 ? ridgeNoise(noise2, wx * 4e-3, wz * 4e-3, 3) * 22 * Math.max(0, 1 - volcDist) : 0;
  h += volcanoElevation + volcRough;
  for (const flow of LAVA_FLOW_AXES) {
    const flowAngle = flow.angle + noise2(flow.angle * 2, 17) * 0.08;
    const ox = Math.cos(flowAngle) * flow.originR;
    const oz = Math.sin(flowAngle) * flow.originR;
    const dirX = Math.cos(flowAngle);
    const dirZ = Math.sin(flowAngle);
    const vx = wx - ox;
    const vz = wz - oz;
    const distAlong = Math.max(0, Math.min(flow.length, vx * dirX + vz * dirZ));
    const perpSigned = vx * -dirZ + vz * dirX;
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
      const clinker = ridgeNoise(noiseB2, wx * 0.01, wz * 0.01, 2) * 4 * inside * flowFade;
      h += clinker;
    }
  }
  const scarAngDiff = Math.atan2(Math.sin(angle - LAVA_COLLAPSE_SCAR.angle), Math.cos(angle - LAVA_COLLAPSE_SCAR.angle));
  const scarMask = Math.exp(-(scarAngDiff * scarAngDiff) / 0.2) * Math.exp(-((r_eng - LAVA_COLLAPSE_SCAR.radius) * (r_eng - LAVA_COLLAPSE_SCAR.radius)) / 600);
  h -= scarMask * 22;
  const craterRimDist = Math.abs(r_eng - VOLCANO.craterRadius);
  const craterRimBump = 25 * Math.exp(-(craterRimDist * craterRimDist) / (20 * 20));
  const craterBowl = r_eng < VOLCANO.craterRadius ? -18 * Math.pow(Math.max(0, 1 - r_eng / VOLCANO.craterRadius), 1.8) : 0;
  h += craterRimBump + craterBowl;
  {
    for (const cone of SUMMIT_FEATURES.minorVentCones) {
      const cdx = wx - cone.cx;
      const cdz = wz - cone.cz;
      const cDist = Math.sqrt(cdx * cdx + cdz * cdz);
      if (cDist < cone.baseRadius * 1.5) {
        const coneH = Math.max(0, 1 - cDist / cone.baseRadius) ** 1.3 * cone.height;
        const coneCrater = cDist < cone.baseRadius * 0.3 ? -cone.height * 0.25 * (1 - cDist / (cone.baseRadius * 0.3)) : 0;
        h += coneH + coneCrater;
      }
    }
    const scar = SUMMIT_FEATURES.ringFaultScar;
    if (angle >= scar.visibleArc.startAngle && angle <= scar.visibleArc.endAngle) {
      const scarDist = Math.abs(r_eng - RING_FAULT.radius * 0.4);
      if (scarDist < scar.fractureZoneWidth) {
        const scarDepth = Math.max(0, 1 - scarDist / scar.fractureZoneWidth) * scar.scarpHeight;
        h -= scarDepth * 0.5;
        h += ridgeNoise(noiseB2, wx * 0.02 + 500, wz * 0.02 + 500, 2) * 3 * (1 - scarDist / scar.fractureZoneWidth);
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
  const ringDist = Math.abs(r_eng - RING_FAULT.radius);
  if (ringDist < 30) {
    const faultT = 1 / (1 + Math.exp(-(r_eng - RING_FAULT.radius) / 5));
    h -= faultT * RING_FAULT.displacement * 12;
    h += (1 - Math.abs(ringDist) / 30) * noise2(wx * 0.02 + 200, wz * 0.02 + 200) * 8;
  }
  const dikeInfluence = Math.max(0, 1 - r_eng / 313) * Math.max(0, r_eng / 50 - 0.5);
  const dikePattern = Math.abs(Math.sin(angle * 8));
  const dikeRidge = dikePattern * 28 * dikeInfluence;
  h += dikeRidge;
  {
    const ldx = wx - LAGOON.cx;
    const ldz = wz - LAGOON.cz;
    const lDist = Math.sqrt(ldx * ldx + ldz * ldz);
    const lOuter = LAGOON.radius * 1.8;
    const lInner = LAGOON.radius;
    if (lDist < lOuter) {
      if (lDist > lInner * 0.85 && lDist < lInner * 1.15) {
        const rimDist = Math.abs(lDist - lInner);
        const rimBump = 12 * Math.exp(-(rimDist * rimDist) / (10 * 10));
        h += rimBump;
      }
      const lNorm = Math.max(0, 1 - lDist / lInner);
      const lBlend = lNorm * lNorm * (3 - 2 * lNorm);
      h -= lBlend * 180;
    }
  }
  {
    const vdx = wx - VENT_FIELD.cx;
    const vdz = wz - VENT_FIELD.cz;
    const vDist = Math.sqrt(vdx * vdx + vdz * vdz);
    const vOuter = VENT_FIELD.suppressionRadius * 1.5;
    if (vDist < vOuter) {
      const ventMound = Math.max(0, 1 - vDist / VENT_FIELD.radius) * 35;
      const ventCrater = vDist < VENT_FIELD.radius * 0.4 ? -15 * (1 - vDist / (VENT_FIELD.radius * 0.4)) : 0;
      const ventRough = Math.max(0, 1 - vDist / vOuter) * ridgeNoise(noise2, wx * 8e-3 + 150, wz * 8e-3 + 150, 3) * 20;
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
  for (const river of RIVERS) {
    const pts = getDenseRiverPath(river);
    let minD2 = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i].x, az = pts[i].z;
      const bx = pts[i + 1].x, bz = pts[i + 1].z;
      const abx = bx - ax, abz = bz - az;
      const lenSq = abx * abx + abz * abz;
      const t2 = lenSq > 0 ? Math.max(0, Math.min(1, ((wx - ax) * abx + (wz - az) * abz) / lenSq)) : 0;
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
      const chD = river.depth * Math.max(0, 1 - (riverDist / rw) ** 2) * (1 + wfBoost);
      h -= s3 * (chD + 12);
    }
  }
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
        const debrisH = (1 - dbDist / debris.radius) * debris.density * 3 * (0.5 + 0.5 * noise2(wx * 0.1, wz * 0.1));
        h += debrisH;
      }
    }
  }
  const coastWarp = 0.065 * noise2(Math.cos(angle) * 2.5 + 5, Math.sin(angle) * 2.5 + 5) + 0.038 * noiseB2(Math.cos(angle) * 6 + 20, Math.sin(angle) * 6 + 20) + 0.022 * noise2(Math.cos(angle) * 12 + 35, Math.sin(angle) * 12 + 35);
  const radWarp = 0.035 * noise2(wx * 12e-4 + 70, wz * 12e-4 + 70) + 0.018 * noiseB2(wx * 28e-4 + 100, wz * 28e-4 + 100);
  let cliffHeightMult = 1;
  for (const seg of CLIFF_SEGMENTS) {
    const angDiff = Math.abs(Math.atan2(Math.sin(angle - seg.azimuthCenter), Math.cos(angle - seg.azimuthCenter)));
    if (angDiff < Math.PI / 3) {
      const segInfluence = Math.max(0, 1 - angDiff / (Math.PI / 3));
      cliffHeightMult = cliffHeightMult * (1 - segInfluence) + seg.height / 7.5 * segInfluence;
    }
  }
  const coastThreshold = 0.85 + coastWarp + radWarp;
  const cliffBeyond = Math.max(0, ellipR - coastThreshold);
  const cliffJagged = 0.8 + 0.4 * noise2(angle * 8 + wx * 0.01, wz * 0.01);
  const cliffDrop = cliffBeyond > 0 ? Math.pow(cliffBeyond / Math.max(0.03, 0.1 - Math.abs(coastWarp) * 0.2), 2.2) * 850 * cliffHeightMult * cliffJagged : 0;
  h -= cliffDrop;
  const POCKET_BEACHES = [
    { cx: -875, cz: 188, r: 28 },
    { cx: 781, cz: -125, r: 20 },
    { cx: -125, cz: -800, r: 35 },
    { cx: 450, cz: 650, r: 25 }
  ];
  for (const b of POCKET_BEACHES) {
    const bDist = Math.sqrt((wx - b.cx) ** 2 + (wz - b.cz) ** 2);
    if (bDist < b.r * 2.8) {
      const bt = Math.max(0, 1 - bDist / (b.r * 2.2));
      const bs = bt * bt * (3 - 2 * bt);
      h = h * (1 - bs) + (WATER_LEVEL + 6) * bs;
    }
  }
  const elevRel = h - WATER_LEVEL;
  const lowlandWeight = Math.max(0, 1 - Math.max(0, (elevRel - 220) / 220));
  const islandCoreWeight = Math.max(0, 1 - ellipR * 1.03);
  h += 300 * lowlandWeight * islandCoreWeight;
  const elevAboveWater = h - WATER_LEVEL;
  const jungleMask = Math.max(0, 1 - ellipR * 1.08) * Math.max(0, 1 - Math.abs(elevAboveWater - 180) / 200);
  const jungleFoothills = fbm(noiseB2, wx * 18e-4 + 90, wz * 18e-4 + 90, 5) * 85 * jungleMask + fbm(noise2, wx * 35e-4 + 45, wz * 35e-4 + 45, 4) * 45 * jungleMask;
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
  const detail = fbm(noise2, wx * 7e-3, wz * 7e-3, 3) * 12;
  const micro = noise2(wx * 0.02, wz * 0.02) * 3;
  h += detail + micro;
  h = WATER_LEVEL + (h - WATER_LEVEL) * 0.82;
  return Math.max(h, 15);
}
function getStructuralOffset(noise2, wx, wz) {
  const r_eng = Math.sqrt(wx * wx + wz * wz);
  const angle = Math.atan2(wz, wx);
  const dikeHarmo = Math.sin(angle * 8) * 20 * Math.max(0, 1 - r_eng / 1050) + Math.abs(Math.cos(angle * 4)) * 5 * Math.max(0, 1 - r_eng / 800);
  const ringFaultT = 1 / (1 + Math.exp(-(r_eng - RING_FAULT.radius) / 8));
  const ringFault = ringFaultT * -25;
  const coastFaultT = 1 / (1 + Math.exp(-(r_eng - 820) / 10));
  const coastFault = coastFaultT * -12;
  const lagDist = Math.sqrt((wx - LAGOON.cx) ** 2 + (wz - LAGOON.cz) ** 2);
  const lagFaultT = 1 / (1 + Math.exp(-(lagDist - LAGOON.radius * 1.1) / 6));
  const lagFault = lagFaultT * -14;
  const rsx = SECONDARY_RIDGE.startX, rsz = SECONDARY_RIDGE.startZ;
  const rex = SECONDARY_RIDGE.endX, rez = SECONDARY_RIDGE.endZ;
  const rldx = rex - rsx, rldz = rez - rsz;
  const rlLen2 = rldx * rldx + rldz * rldz;
  const rlt = Math.max(0, Math.min(1, ((wx - rsx) * rldx + (wz - rsz) * rldz) / rlLen2));
  const rcx = rsx + rlt * rldx, rcz = rsz + rlt * rldz;
  const sRidge = Math.sqrt((wx - rcx) ** 2 + (wz - rcz) ** 2);
  const sRidgeFault = 1 / (1 + Math.exp(-(sRidge - 50) / 6)) * -8;
  const ventDist = Math.sqrt((wx - VENT_FIELD.cx) ** 2 + (wz - VENT_FIELD.cz) ** 2);
  const ventDisrupt = ventDist < VENT_FIELD.suppressionRadius ? Math.max(0, 1 - ventDist / VENT_FIELD.suppressionRadius) * 10 : 0;
  const tilt = wx * 0.015;
  const n1 = noise2(wx * 28e-5, wz * 28e-5) * 15;
  const n2 = noise2(wx * 11e-4 + 60, wz * 11e-4 + 60) * 6;
  return dikeHarmo + ringFault + coastFault + lagFault + sRidgeFault + ventDisrupt + tilt + n1 + n2;
}
function getLayerAt(noise2, wx, elev, wz) {
  return getLayerAtElevationLocal(elev - getStructuralOffset(noise2, wx, wz));
}
function getLayerByElevation(elev) {
  return getLayerAtElevationLocal(elev);
}
function computeLayerIndex(noise2, wx, h, wz) {
  const adjElev = h - getStructuralOffset(noise2, wx, wz);
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
var SUBSURFACE = {
  magmaChamber: {
    cx: 0,
    cz: 0,
    depth: -3e3,
    // real meters
    rx: 3e3,
    rz: 2800,
    ry: 1500,
    tiltDegrees: 10
  },
  nautilusCavern: {
    cx: NAUTILUS.chamberCx,
    cz: NAUTILUS.chamberCz,
    length: NAUTILUS.length,
    width: NAUTILUS.width,
    floorDepth: NAUTILUS.depth,
    ceilingHeight: 2.8
    // 45m / 16
  }
};
var BIOME_ZONES = [
  {
    name: "Coastal Scrub",
    minElev: 0,
    maxElev: 100,
    density: 0.3,
    flora: ["pandanus", "seaGrape", "coastalShrubs"]
  },
  {
    name: "Dense Jungle",
    minElev: 100,
    maxElev: 400,
    density: 0.9,
    flora: ["giantFerns", "massiveCycads", "denseBamboo", "thickCanopy", "lianaVines", "heavyUndergrowth"],
    atmosphere: { lowMist: true, humidity: 0.95 }
  },
  {
    name: "Mixed Forest",
    minElev: 400,
    maxElev: 900,
    density: 0.6,
    flora: ["ferns", "cycads", "bamboo", "trees"]
  },
  {
    name: "Sparse High-Slope",
    minElev: 900,
    maxElev: 1400,
    density: 0.2,
    flora: ["scrubGrass", "lowShrubs"]
  },
  {
    name: "Bare Volcanic Rock",
    minElev: 1400,
    maxElev: 2e3,
    density: 0.02,
    flora: ["lichens", "mosses"]
  }
];
var ATMOSPHERIC_ZONES = [
  { name: "Summit Plume", cx: 0, cz: 0, radius: 100 },
  { name: "Jungle Fog", cx: -188, cz: 125, radius: 150 },
  { name: "Vent Steam", cx: VENT_FIELD.cx, cz: VENT_FIELD.cz, radius: 50 },
  { name: "Lagoon Humidity", cx: LAGOON.cx, cz: LAGOON.cz, radius: 80 }
];
var mysteriousIsland = {
  id: "mysterious",
  terrain: {
    size: TERRAIN_SIZE,
    segments: SEGMENTS,
    waterLevel: WATER_LEVEL,
    noiseSeeds: [73, 211],
    erosionIterations: 12e3
  },
  camera: {
    // View showing multi-province terrain, not just the volcano
    position: [650, 850, 1100],
    target: [-100, 200, 50]
  },
  layers: LAYERS,
  geologicalProcesses: GEOLOGICAL_PROCESSES,
  layerInteractions: LAYER_INTERACTIONS,
  // Water features
  lakes: LAKES,
  rivers: RIVERS,
  // Movie-accurate province data
  provinces: {
    volcano: VOLCANO,
    lagoon: LAGOON,
    nautilus: NAUTILUS,
    secondaryRidge: SECONDARY_RIDGE,
    ventField: VENT_FIELD,
    ringFault: RING_FAULT,
    cascadeRiver: CASCADE_RIVER,
    cliffSegments: CLIFF_SEGMENTS
  },
  // Engineered & natural structures
  structures: {
    nautilusDock: NAUTILUS,
    lavaTubes: LAVA_TUBES,
    lavaFlowAxes: LAVA_FLOW_AXES,
    waterfallLedge: WATERFALL_LEDGE,
    lagoonCliffs: LAGOON_CLIFFS,
    seaCaves: SEA_CAVES,
    summitFeatures: SUMMIT_FEATURES,
    hydrothermalField: HYDROTHERMAL_STRUCTURES
  },
  // Subsurface architecture
  subsurface: SUBSURFACE,
  // Biome and atmosphere
  biomeZones: BIOME_ZONES,
  jungleDensityZones: JUNGLE_DENSITY_ZONES,
  atmosphericZones: ATMOSPHERIC_ZONES,
  // Terrain generation functions
  generateHeight,
  getStructuralOffset,
  getLayerAt,
  getLayerByElevation,
  computeLayerIndex,
  getDenseRiverPath,
  getLavaFlowMask
};

// scripts/sample-terrain.mjs
function hashNoise(seed = 1) {
  return (x, y) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };
}
var noise = hashNoise(73);
var noiseB = hashNoise(211);
var size = mysteriousIsland.terrain.size;
var half = size / 2;
var peak = -Infinity;
var sumAll = 0;
var countAll = 0;
var sumIsland = 0;
var countIsland = 0;
for (let z = -half; z <= half; z += 20) {
  for (let x = -half; x <= half; x += 20) {
    const h = mysteriousIsland.generateHeight(noise, noiseB, x, z);
    if (h > peak) peak = h;
    sumAll += h;
    countAll += 1;
    const nx = x / half;
    const nz = z / half;
    const ellipR = Math.sqrt((nx / 1) ** 2 + (nz / 0.875) ** 2);
    if (ellipR <= 1) {
      sumIsland += h;
      countIsland += 1;
    }
  }
}
var avgAll = sumAll / countAll;
var avgIsland = sumIsland / countIsland;
console.log(JSON.stringify({
  samples: countAll,
  islandSamples: countIsland,
  peak,
  avgAll,
  avgIsland,
  checks: {
    peakUnder650: peak < 650,
    avgIslandOver200: avgIsland > 200
  }
}, null, 2));
