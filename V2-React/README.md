# Structural Geology Field Mapping Simulator

A browser-based 3D interactive geology field simulator built for education, training, and research. Students and geologists can explore a procedurally generated 2 km × 2 km terrain, identify rock formations, drill virtual boreholes, measure distances and elevations, determine strike & dip orientations, and visualise geological cross-sections — all from within a modern dark-themed UI.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Terrain Generation](#terrain-generation)
7. [Geological Model](#geological-model)
8. [Water System](#water-system)
9. [Vegetation & Structures](#vegetation--structures)
10. [Rendering Pipeline](#rendering-pipeline)
11. [Tools & Instruments](#tools--instruments)
12. [User Interface](#user-interface)
13. [Keyboard Shortcuts](#keyboard-shortcuts)
14. [Configuration](#configuration)
15. [Performance](#performance)
16. [Browser Compatibility](#browser-compatibility)
17. [License](#license)

---

## Overview

This simulator recreates a realistic geological field environment entirely in the browser. The terrain is generated procedurally from multi-octave noise functions, carved by hydraulic erosion, and painted with physically-based rock textures. Six stratigraphic layers — from Precambrian basement to Quaternary alluvium — are deformed by regional folds, bedding perturbation, and a normal fault, creating a geologically plausible subsurface structure that students can investigate with a suite of virtual field instruments.

The application runs on commodity hardware (tested on Intel Iris Xe / i5 11th-gen / 12 GB RAM) and requires no installation beyond a modern browser and Node.js for development.

---

## Features

### Terrain & Landscape
- **2 km × 2 km procedural terrain** at 384 × 384 segment resolution (~148 K vertices)
- **Mountain ranges**: NW and NE ridge belts generated with ridge noise and directional masks
- **Rolling hills**: mid-frequency FBM across the map
- **V-shaped valleys**: absolute-value noise drainage carving
- **Plateaus / mesa shapes**: broad positive noise features
- **Edge falloff**: terrain lowers towards map boundaries (island-style)
- **Hydraulic erosion**: 38,000 particle-based droplet iterations sculpt realistic drainage networks
- **River carving**: Serpent River follows 11 control points interpolated via Catmull-Rom splines (81 dense samples), with Hermite-smoothed parabolic channel cross-sections
- **Lake basins**: 5 named lakes (Mirror Lake, Crystal Pond, Emerald Tarn, Sapphire Lake, Hidden Pool) with deep elliptical bowl carving (16–24 m depth)
- **Farm compound**: Hermite-smoothstep flattened plateau at (380, 320) with buildings, silos, fields, fences, and a windmill

### Geology
- **6 stratigraphic layers** spanning Precambrian to Quaternary, each with minerals, grain size, texture, fossils, age, and vegetation density
- **Bedding perturbation**: regional fold axis (~NE-SW, λ ≈ 600 m) plus multi-frequency noise (±32 m displacement)
- **Normal fault**: N-S oriented, 28 m down-throw to the east via sigmoid transition
- **Smooth layer blending**: 6 m transition zones between adjacent layers using fractional layer indices

### Water
- **Ocean**: Gerstner 6-wave animated surface (300×300 grid) with Fresnel-Schlick reflection (F0=0.02), triple sun specular (1024+256+48 power), multi-octave caustics, subsurface scattering, and depth-based colour
- **Lakes**: 5 individual Gerstner-wave water surfaces (5 wave components, 96-segment geometry) with rim-tracking raised water levels (+1.8 m above rim), finite-difference normals, triple specular highlights, multi-octave caustics, and SSS
- **River**: Catmull-Rom ribbon mesh with 4-component flowing ripple shader, triple specular, multi-octave flow caustics, SSS, variable width, and channel-floor-relative water height

### Vegetation & Structures
- **Trees**: 600 pines (3-layered cones), 450 oaks (lumpy merged spheres), 250 birches (near-water preference)
- **Bushes**: 2,500 instances with per-instance colour variation
- **Rocks**: 500 dodecahedron outcrops preferring steep slopes
- **Grass**: 9,000 thin plane blade tufts (matching mountain grass style)
- **Mountain vegetation**: 500 alpine shrubs, 400 wildflowers, 800 mountain grass (above ~120-130 m)
- **Riparian vegetation**: 600 dense grass patches, 500 wildflowers, 300 reeds, 300 shrubs (near water bodies)
- **Farm compound**: 6 buildings (farmhouse, 2 cottages, barn, workshop, storage) with foundations, roofs, windows, doors, chimneys; 2 silos with domes; hay bales; water trough; animal pen with post-and-rail fencing; 4 crop fields with rows; dirt paths; perimeter fence; windmill with blades
- **All vegetation uses InstancedMesh** for GPU-efficient rendering

### Rendering
- **PBR Cook-Torrance BRDF** terrain shader with GGX NDF, Smith-Schlick geometry, Fresnel-Schlick, boosted ambient (×1.1) and enhanced rim Fresnel highlights
- **Tri-planar texture mapping** with 6-tile horizontal atlas (1024 px per tile)
- **Procedural PBR texture atlas**: albedo, normal (Sobel-derived), and packed roughness-AO-height maps per rock type
- **Detail normals** with distance-based LOD (macro ↔ detail blend) including ultra-close micro-detail tier
- **Terrain wetness** near water bodies: darker albedo, lower roughness, boosted F0
- **Physical atmospheric scattering** sky dome: Rayleigh + Mie, sun disc, animated clouds, haze bands
- **3D sun orb**: Emissive sun sphere (r=120) with BackSide glow sphere (r=300) positioned along sun direction at 6000 m, aligned with all shader sun directions and directional light
- **SSAO post-processing**: 12-tap rotated kernel with distance-adaptive radius and golden-angle sampling
- **Aerial perspective fog**: dual near/far colour exponential²
- **ACES Filmic tone mapping** at 1.15 exposure
- **Shadow mapping**: 2048² PCF soft shadows from directional sun light (positioned along shared sun direction vector, shadow frustum ±1400)

### Tools
1. **Rock Identifier (2)**: Click terrain to identify the geological layer — shows name, minerals, grain size, texture, fossils, age, and characteristics in a popup
2. **Drill Core (3)**: Virtual borehole sampling — animated tripod rig marker with rotating collar, pulsing ground ring, and beacon; panel shows a visual core column with depth axis, colour-coded layer segments, and log entries
3. **Measure (4)**: Two-click distance/elevation measurement — glowing sphere markers on pins, curved dashed connecting line, label sprite showing 3D distance and elevation difference; panel shows horizontal distance, bearing, and slope angle
4. **Strike & Dip (5)**: Bedding orientation measurement — bedding plane disc, bold strike/dip lines with endpoint spheres, angle label; panel shows strike, dip, dip direction with SVG stereonet visualisation and compass symbol
5. **Cross-Section (6)**: Two-point geological profile — glowing pillar markers with numbered labels, terrain-following dashed line; panel renders a large canvas cross-section with layer colours, rock-type hatching patterns, water level indicator, surface profile, grid axes, and layer legend

### UI
- **Dark-themed** interface styled after GitHub's design language
- **Sidebar** with tool and panel toggle buttons, custom SVG icon animations
- **Slide-out panel** with pin/unpin, backdrop click-away dismiss, Escape key close
- **Status bar**: real-time coordinates (X, Z), elevation, rock name, active tool
- **Compass**: 280 px canvas-drawn rotating compass with cardinal/intermediate labels, needle, and bearing readout
- **Scale bar**: camera-distance-adaptive with "nice" rounding (1, 2, 5, 10 … 5000 m)
- **Loading screen**: progress bar with stage messages (textures → heightmap → erosion → terrain → water → vegetation → SSAO → tools)
- **Layer manager**: reorder, add, remove geological layers
- **Settings panel**: water level, fog density, sun elevation
- **Field notebook**: free-text observations, location stamp, timestamp, PDF export (jsPDF)
- **Keyboard shortcuts**: 1-6 for tools, L for legend, N for notebook, Escape to dismiss

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Vite** | 5.1 | Build tool & dev server |
| **React** | 18.2 | UI framework |
| **Three.js** | 0.162 | 3D rendering engine |
| **Zustand** | 4.5 | Lightweight state management |
| **jsPDF** | 2.5.1 | PDF export for field notebook |
| **GLSL** | WebGL 1 (standard) | Custom vertex & fragment shaders |

All shaders use **standard GLSL** (`attribute`, `varying`, `texture2D`, `gl_FragColor`) for Intel Iris Xe compatibility — no GLSL 3.0 / `in`/`out` syntax.

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd V2-React
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`. Hot module replacement is enabled.

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
V2-React/
├── index.html                    # Entry HTML (Google Fonts, root div)
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration (React plugin, port 3000)
└── src/
    ├── main.jsx                  # React root mount
    ├── App.jsx                   # Top-level layout (providers, viewport, UI)
    ├── index.css                 # Global styles (~600 lines)
    ├── config/
    │   └── geology.js            # Layer definitions, constants, elevation lookup
    ├── engine/
    │   ├── noise.js              # Simplex 2D, FBM, ridge noise
    │   ├── TerrainGenerator.js   # Heightmap, river/lake/farm carving, geometry
    │   ├── ErosionSimulator.js   # Hydraulic erosion (particle-based)
    │   ├── TextureFactory.js     # Procedural PBR atlas generation
    │   ├── TerrainShader.js      # Cook-Torrance PBR GLSL material
    │   ├── WaterSystem.js        # Gerstner ocean, lake, river water
    │   ├── AtmosphereSystem.js   # Rayleigh/Mie sky dome
    │   ├── VegetationSystem.js   # Trees, bushes, rocks, grass, farm compound
    │   ├── PostProcessing.js     # SSAO pipeline
    │   └── SceneManager.js       # Three.js lifecycle, tools, render loop
    ├── store/
    │   └── useStore.js           # Zustand store (tool state, panels, results)
    ├── tools/
    │   └── ToolManager.js        # Tool handler functions (drill, measure, etc.)
    ├── hooks/
    │   ├── useSceneEngine.js     # Engine lifecycle hook (init, events, cleanup)
    │   └── useKeyboardShortcuts.js
    ├── utils/
    │   └── helpers.js            # Compass bearing, scale bar, distance formatting
    ├── context/
    │   └── SceneContext.jsx       # React context sharing engine ref
    └── components/
        ├── Viewport.jsx          # Canvas container (forwardRef)
        ├── Sidebar.jsx           # Tool & panel buttons
        ├── Panel.jsx             # Slide-out panel with pin/unpin
        ├── HUD.jsx               # Crosshair + scale bar
        ├── Compass.jsx           # Canvas-drawn compass
        ├── StatusBar.jsx         # Bottom info bar
        ├── LoadingScreen.jsx     # Progress overlay
        ├── RockPopup.jsx         # Rock identification modal
        ├── icons/
        │   └── Icons.jsx         # SVG icon components with animation classes
        └── panels/
            ├── DrillPanel.jsx        # Borehole core visualisation
            ├── MeasurePanel.jsx      # Distance/bearing results
            ├── StrikeDipPanel.jsx    # Strike/dip with stereonet
            ├── CrossSectionPanel.jsx # Canvas geological cross-section
            ├── LegendPanel.jsx       # Layer manager (reorder/add/remove)
            ├── SettingsPanel.jsx     # Water, fog, sun controls
            └── NotebookPanel.jsx     # Field notes + PDF export
```

---

## Terrain Generation

The terrain is built in stages, each feeding into the next:

1. **Noise initialisation**: Two seeded simplex noise functions (`seed=42`, `seed=137`)
2. **Multi-octave heightmap** (385 × 385 grid):
   - Base continental floor at 80 m + 6-octave FBM (±55 m)
   - NW mountain ridge belt: ridge noise × 120 m × Gaussian mask (R=650 m)
   - NE secondary range: ridge noise × 80 m × mask (R=500 m)
   - Rolling hills: 4-octave FBM × 30 m
   - V-shaped valleys: |noise| × 25 m (subtracted)
   - Detail (3-octave × 8 m) + micro (2-octave × 2.5 m)
   - Plateau: max-clamped FBM × 18 m
   - Edge falloff: quadratic drop of 60 m beyond 85% map extent
3. **Farm flattening**: Hermite smoothstep blend to target elevation (95 m) within radius 160 m
4. **Lake carving**: 5 elliptical bowls with smoothstep blend + parabolic depth
5. **River carving**: Catmull-Rom subdivision (11 → 81 points), Hermite-smoothed parabolic cross-section, depth up to 28 m, width 30 m, blend zone 3.5× width
6. **Hydraulic erosion**: 38,000 particle-based droplets with inertia, sediment capacity, deposition, erosion radius, evaporation
7. **Geometry construction**: `PlaneGeometry(2000, 2000, 384, 384)` with per-vertex height, fractional layer index, and HSL-perturbed vertex colour

Height range: approximately 25–280 m. Water level: 38 m.

---

## Geological Model

### Stratigraphic Column

| Layer | Base Elevation | Age | Vegetation Density | Key Minerals |
|---|---|---|---|---|
| Granite Gneiss | 0 m | Precambrian (~1.8 Ga) | 0.05 | Quartz, K-Feldspar, Plagioclase, Biotite |
| Dolomitic Limestone | 40 m | Cambrian (~510 Ma) | 0.25 | Dolomite, Calcite, Minor Quartz |
| Sandstone & Shale | 75 m | Ordovician (~470 Ma) | 0.75 | Quartz, Feldspar, Clay minerals, Mica |
| Schist | 130 m | Silurian (~430 Ma) | 0.55 | Muscovite, Biotite, Garnet, Quartz |
| Limestone | 180 m | Devonian (~380 Ma) | 0.45 | Calcite, Aragonite, Minor Clay |
| Alluvium & Topsoil | 220 m | Quaternary (<2 Ma) | 1.0 | Clay, Quartz sand, Organic matter |

### Structural Deformation
- **Bedding perturbation**: Regional fold axis (~NE-SW, wavelength ~600 m) + two noise octaves = ±32 m vertical displacement
- **Normal fault**: Located at X=200, width=40 m, 28 m down-throw to the east via sigmoid function
- **Layer lookup**: elevation adjusted by perturbation + fault offset → lookup against base elevation thresholds

---

## Water System

### Ocean
- Gerstner 6-wave vertex displacement (frequencies 0.015–0.09, amplitudes 0.04–0.55, steepnesses 0.25–0.6) on 300×300 grid
- Normals computed from finite differences of the displaced surface
- Fragment shader: Fresnel-Schlick (F0=0.02), sky reflection, triple-power sun specular (1024 + 256 + 48), multi-octave caustic shimmer, depth-based colour, SSS, sun-lit diffuse, fog

### Lakes
- 5 individual `CircleGeometry(1, 96)` surfaces scaled to elliptical lake dimensions
- Deeper basin carving (16–24 m depth) with raised water level (rim + 1.8 m) for fuller, more visible lakes
- Gerstner 5-wave vertex displacement with finite-difference normals (replacing simple sinusoidal ripples)
- Triple sun specular (1024 + 256 + 48), multi-octave caustics, SSS, shallow/deep colour blending, sun-lit diffuse

### River
- Catmull-Rom subdivided ribbon mesh (81 cross-section pairs)
- Variable width along path (±20% sinusoidal)
- Water height = channel floor + 6 m
- 4-component flowing ripple shader with triple specular, multi-octave flow caustics, SSS

---

## Vegetation & Structures

All vegetation types use `THREE.InstancedMesh` with per-instance colour via `setColorAt`. Placement is filtered by:
- Water exclusion (lakes, rivers — dense Catmull-Rom path checking)
- Farm exclusion zone
- Slope threshold (varies by type: 0.3–0.65)
- Geological layer vegetation density (probabilistic)
- Noise-based density clustering
- Elevation preferences (pines prefer >110 m, oaks prefer <170 m, birch near water)

**Total instanced objects**: ~18,000+ across all vegetation types.

---

## Rendering Pipeline

1. **Texture generation** — procedural PBR atlases (6 × 1024 px tiles: albedo, normal, RMH)
2. **Heightmap computation** — multi-octave noise → uint Float32Array
3. **Erosion simulation** — 38 K particle iterations in-place on heightmap
4. **Geometry build** — PlaneGeometry + per-vertex height/colour/layerIndex
5. **Scene assembly** — terrain, water (ocean + 5 lakes + river), atmosphere + sun orb + glow, vegetation, lighting (sun aligned with `_sunDir`)
6. **Render loop** (per frame):
   - Update orbit controls
   - Animate water (Gerstner time uniform)
   - Animate atmosphere (cloud/haze time)
   - Animate terrain wetness time
   - Animate tool markers (drill collar rotation, ring pulses, beacon glow, measure sphere emissive)
   - Render to off-screen target (colour + depth)
   - SSAO composite pass → screen

### Lighting
- Hemisphere light: sky 0x87ceeb / ground 0x4e6b3c, intensity 0.55 (boosted for lower sun angle)
- Directional sun: 0xfff4e0, intensity 1.6, positioned along shared `_sunDir` vector (0.75, 0.4, 0.45) × 1500, 2048² shadow map (frustum ±1400, far 4000), PCF soft shadows
- Fill light: 0x8fbbda, intensity 0.35, from opposite direction
- Rim light: 0xffd0a0, intensity 0.25, for edge definition
- 3D sun orb: emissive sphere + BackSide glow halo in AtmosphereSystem, positioned off-center at ~25° elevation for visibility from default camera angle

---

## Tools & Instruments

### Rock Identifier
Click any point to view the geological layer at that location. The layer is determined by elevation adjusted for bedding perturbation and fault offset.

### Drill Core
Samples a vertical borehole from surface to elevation 0 in 0.5 m steps. Each step queries the deformed layer structure. The panel displays a visual core column, depth axis, and detailed log entries. A 3D marker (tripod rig with rotating collar) is placed at the drill site.

### Measure
Two-click measurement computing: 3D distance, horizontal distance, elevation change, bearing (azimuth from North), and slope angle. Markers are glowing spheres on pins connected by a curved dashed line with a distance/elevation label sprite.

### Strike & Dip
Central-difference gradient of the bedding perturbation surface at the clicked point yields dip magnitude and direction. Strike is 90° counterclockwise from dip. The panel includes an SVG stereonet overview for multiple measurements and per-measurement compass symbols.

### Cross-Section
Two-point line sampled at 200 intervals. For each sample, the surface elevation and all subsurface layers are traced. The panel renders a 720 × 420 px canvas with:
- Colour-coded layer columns with geological hatching patterns (dots, wavy lines, stipple, diagonal hatching, brick, V-shapes)
- Surface profile line with glow
- Water level indicator
- Grid with axis labels and titles

---

## User Interface

### Sidebar (left, 52 px)
- 6 tool buttons: Navigate, Identify, Drill, Measure, Strike & Dip, Cross-Section
- 2 panel toggles: Layer Legend, Field Notebook
- Settings button (bottom)
- Tooltip on hover
- Active state highlight (accent blue glow)

### Panel (slide-out, 340 px / 520 px wide)
- Pin/unpin button (top-right)
- Click-away dismiss when unpinned
- Escape key to close
- Content varies by active panel

### Status Bar (bottom, 30 px)
- Real-time: X coordinate, Z coordinate, Elevation, Rock name, Active tool
- Monospace font for data values

### Compass (bottom-right)
- 140 px canvas-drawn rotating compass
- 2° tick resolution, cardinal letters, 30° intermediate labels
- Fixed needle pointing camera direction
- Bearing readout below

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` | Navigate (orbit) |
| `2` | Identify Rock |
| `3` | Drill Core |
| `4` | Measure |
| `5` | Strike & Dip |
| `6` | Cross-Section |
| `L` | Toggle Layer Legend |
| `N` | Toggle Field Notebook |
| `Escape` | Close panel / dismiss popup |

---

## Configuration

Key constants in `src/config/geology.js`:

```javascript
TERRAIN_SIZE = 2000    // 2 km × 2 km world extent
SEGMENTS     = 384     // heightmap grid resolution
WATER_LEVEL  = 38      // global ocean water level (metres)
```

Environment settings adjustable at runtime via the Settings panel:
- **Water Level**: 0–150 m
- **Fog Density**: 0–0.005
- **Sun Elevation**: 5–90°

---

## Performance

The application targets 30–60 fps on integrated graphics (Intel Iris Xe). Key optimisations:

- **InstancedMesh** for all vegetation (single draw call per type)
- **Distance-based LOD** in terrain shader (macro vs detail texture blend)
- **SSAO with 12 taps** (rather than 32–64) with golden-angle kernel rotation
- **Throttled hover** callbacks (~30 fps via `performance.now()` gating)
- **Pixel ratio capped** at 2× to limit fill rate
- **Standard GLSL** (no GLSL 3.0 / WebGL 2.0 features required)
- **Mipmap-filtered** atlas textures to reduce texture bandwidth
- **Procedural textures** — no external image assets to load

---

## Browser Compatibility

Tested on:
- Chrome 120+ (Windows, macOS)
- Firefox 120+
- Edge 120+

Requires **WebGL 1.0** (universally available). Does not require WebGL 2.0 or any browser extensions.

---

## License

This project was developed for educational and research purposes.
