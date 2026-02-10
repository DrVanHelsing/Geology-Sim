# Academic Research Document — Structural Geology Field Mapping Simulator

## A Procedurally Generated, Browser-Based Environment for Geological Field Training

---

## Table of Contents

1. [Abstract](#abstract)
2. [Introduction](#introduction)
3. [Rationale & Design Philosophy](#rationale--design-philosophy)
4. [System Architecture Decisions](#system-architecture-decisions)
5. [Terrain Generation — Reasoning & Challenges](#terrain-generation--reasoning--challenges)
6. [Geological Modelling — Design Justifications](#geological-modelling--design-justifications)
7. [Rendering Decisions — PBR, Atmosphere, and Post-Processing](#rendering-decisions--pbr-atmosphere-and-post-processing)
8. [Water Systems — Hydrological Challenges](#water-systems--hydrological-challenges)
9. [Vegetation Ecosystem — Density, Placement & Performance](#vegetation-ecosystem--density-placement--performance)
10. [Virtual Instruments — Pedagogical Considerations](#virtual-instruments--pedagogical-considerations)
11. [Challenges Faced & Solutions](#challenges-faced--solutions)
12. [Academic & Training Applications](#academic--training-applications)
13. [Future Extensions & Features](#future-extensions--features)
14. [Related Work](#related-work)
15. [Conclusions](#conclusions)

---

## Abstract

This document provides an academic analysis of the Structural Geology Field Mapping Simulator, a browser-based 3D application that procedurally generates geologically plausible terrain for interactive field mapping education. We discuss the reasoning behind every major design decision, from the choice of noise-based terrain synthesis and particle-based hydraulic erosion to physically-based rendering on constrained GPU hardware, Catmull-Rom spline river systems, and virtual field instruments. We enumerate the engineering challenges encountered during development — including river carving discontinuities, vegetation visibility failures, shader compatibility regressions, and performance constraints — along with the solutions that resolved them. Finally, we explore the system's potential applications in geology undergraduate education, distance learning, professional training, and research prototyping, and propose extensions that would enhance its scope and fidelity.

---

## Introduction

Field mapping is the cornerstone of geological education. Traditionally, students learn to read landscapes, identify rock types, measure structural orientations, construct cross-sections, and correlate stratigraphic units through supervised outdoor excursions. These field trips are invaluable but constrained by logistics, cost, weather, accessibility, and — as demonstrated during the COVID-19 pandemic — public health considerations.

Virtual geology environments offer a complementary approach. By procedurally generating terrain that obeys geological principles, students can practise field skills in a controlled, repeatable, and accessible setting. This simulator was designed with three objectives:

1. **Geological plausibility** — the subsurface structure must produce realistic outcrop patterns, bedding orientations, and stratigraphic relationships that reward genuine geological reasoning.
2. **Visual realism** — the landscape must be convincing enough that students develop observational habits transferable to real fieldwork.
3. **Accessibility** — the system must run on standard student hardware (integrated graphics, 12 GB RAM) inside a web browser without installation.

---

## Rationale & Design Philosophy

### Why Browser-Based?

Desktop GIS packages (e.g., QGIS, ArcGIS) and virtual globe tools (Google Earth Engine) exist, but they require installation, lack interactive sub-surface geology, and are not designed for guided field exercises. A browser-based approach was chosen because:

- **Zero installation**: students access the simulator via URL.
- **Cross-platform**: Windows, macOS, Linux, Chromebooks.
- **Rapid iteration**: Vite HMR allows researchers to modify geology or terrain parameters and see changes in seconds.
- **Shareability**: a single URL can distribute identical environments to an entire class.

### Why Procedural Generation?

Real-world Digital Elevation Models (DEMs) coupled with geological maps would produce more accurate terrain. However:

- **Copyright constraints** prevent redistribution of detailed geological survey data in many jurisdictions.
- **Pedagogical control**: procedural generation allows deliberate placement of structural features (faults, folds, unconformities) at known positions, enabling instructors to design exercises with predictable answers.
- **Reproducibility**: a deterministic seed produces identical terrain on every run, ensuring assessment fairness.
- **Extensibility**: adding new features (a thrust fault, an igneous intrusion) requires modifying generation parameters rather than sourcing new real-world data.

### Why React + Three.js?

The system separates concerns into a **React-driven UI layer** and a **Three.js engine layer**:

- React manages tool state, panel visibility, user input, and result display via a Zustand store. This produces a responsive, declarative UI with minimal boilerplate.
- Three.js handles all 3D rendering through raw WebGL, allowing custom GLSL shaders that would be difficult to author in higher-level engines (e.g., Babylon.js provides PBR out of the box, but with less shader-level control).
- Zustand was selected over Redux for its simplicity and `subscribeWithSelector` middleware, which allows the Three.js engine (non-React code) to react to store changes without forcing React re-renders on every mouse hover.

---

## System Architecture Decisions

### Engine / UI Boundary

A deliberate architectural choice was made to decouple the 3D engine from React's lifecycle:

1. `SceneManager` is a plain JavaScript class that owns the Three.js renderer, scene, camera, lights, and all 3D objects. It exposes an imperative API (`setActiveTool`, `addDrillMarker`, `updateWaterLevel`).
2. React components interact with the engine through a single custom hook (`useSceneEngine`) that:
   - Creates the engine once during mount.
   - Subscribes to Zustand store changes and forwards them to the engine.
   - Dispatches tool handler callbacks (which live in `ToolManager`) when terrain clicks occur.
3. No React state is set during the render loop. Hover information is throttled to ~30 fps via `performance.now()` gating, and terrain intersection results are written to the Zustand store only when the mouse moves.

**Reasoning**: Three.js render loops run at 60 fps. If every frame triggered React state updates, React's reconciliation overhead would dominate the frame budget. By restricting React updates to user-initiated events and throttled hover data, the system maintains smooth frame rates even on integrated GPUs.

### Shader Compatibility Strategy

A critical constraint was **Intel Iris Xe compatibility**. Early development attempts using GLSL 3.0 (`#version 300 es`, `in`/`out`, `texture()`) compiled on NVIDIA hardware but produced blank screens or shader compilation errors on Intel drivers. The solution was strict adherence to **standard GLSL** (effectively WebGL 1.0):

- `attribute` / `varying` / `uniform` declarations
- `texture2D()` for all texture lookups
- `gl_FragColor` for output
- No `textureLod()`, `textureGrad()`, or `dFdx()`/`dFdy()` derivatives

This restricts some rendering techniques (e.g., anisotropic filtering, screen-space derivatives for normal mapping) but ensures universal compatibility.

---

## Terrain Generation — Reasoning & Challenges

### Multi-Octave Noise Composition

The heightmap is built from additive noise layers, each targeting a different landscape feature:

| Noise Component | Octaves | Amplitude | Purpose |
|---|---|---|---|
| Continental base FBM | 6 | 55 m | Broad undulation |
| NW mountain ridge noise | 4 | 120 m | Sharp ridge crests via `1 - |n|` |
| NE secondary ridges | 4 | 80 m | Supporting range |
| Rolling hills FBM | 4 | 30 m | Mid-frequency terrain variation |
| Valley carving `|noise|` | 1 | -25 m | V-shaped drainage patterns |
| Detail FBM | 3 | 8 m | Surface roughness |
| Micro FBM | 2 | 2.5 m | Ground-level variation |
| Plateau FBM (clamped) | 3 | 18 m | Flat-topped mesas |
| Edge falloff | — | -60 m | Island boundary |

**Why ridge noise?** Standard FBM produces rounded hills. Real mountain ranges exhibit sharp ridgelines formed by differential erosion. The `ridgeNoise` function (`1 - |n|`, squared, accumulated over octaves) creates exactly this geometry: high, narrow crests that fall away steeply.

**Why directional masks?** Without spatial masking, ridge noise would cover the entire map. Gaussian-falloff masks confine mountain belts to specific areas, mimicking real orogenic belts — students see a clear boundary between mountainous and lowland terrain, which is a common real-world geological feature.

### Hydraulic Erosion — Why and How

Procedural noise alone produces "smooth" terrain that lacks the incised channels, alluvial fans, and sediment-filled valleys typical of real landscapes. Particle-based hydraulic erosion addresses this by simulating water droplets that:

1. Follow the steepest downhill gradient (with inertia to avoid zigzagging).
2. Erode terrain proportional to velocity and available capacity.
3. Deposit sediment when velocity decreases (e.g., reaching flat ground).
4. Evaporate, limiting path length.

**Parameter choices**:
- 38,000 iterations were determined empirically: fewer iterations left mountain slopes visibly smooth; more iterations produced over-eroded "badlands" terrain where channel networks obscured the underlying geological structure.
- Erosion radius = 3 cells creates smooth channel banks rather than sharp single-pixel cuts.
- Capacity = 4.0 and deposition rate = 0.3 produce visible channels without excessive sediment accumulation at valley floors.

**Challenge**: Erosion sometimes carved channels below the water level (38 m), creating terrain artefacts beneath lakes. **Solution**: The minimum terrain clamp at 18 m prevents erosion from producing unrealistically deep depressions, and lake carving is applied after erosion so lake bowls have clean geometries.

### River System — Catmull-Rom Splines

**Why Catmull-Rom?** The river path is defined by 11 hand-placed control points. Linear interpolation between these points would produce a jagged, unrealistic channel. Catmull-Rom splines provide C¹ continuity (smooth tangents) through every control point, producing the meandering curves expected of natural rivers.

**Why 81 subdivisions?** Terrain carving uses the same dense point set as the water mesh. Early versions used 11 sparse points for terrain carving but 81 dense points for the water ribbon, creating visible gaps where terrain poked through the water surface between control points. Matching both systems to 81 Catmull-Rom samples eliminated all discontinuities.

**Parabolic cross-section**: The river channel is carved with a parabolic profile (deeper at centre, shallow at edges) blended via Hermite smoothstep over a zone 3.5× the river half-width. This produces naturalistic channel geometry — narrow deep thalweg grading into floodplain.

**Challenge**: Initial carving depth (10 m) was insufficient. Noise-based terrain detail (~10.5 m) could exceed the carving depth, causing terrain "teeth" to protrude through the water. Increasing the total carving to 28 m (depth=16 + base=12) ensured the channel floor remained well below the water surface under all conditions.

---

## Geological Modelling — Design Justifications

### Six-Layer Stratigraphy

The six layers were chosen to represent a plausible geological history spanning Precambrian to Quaternary:

1. **Granite Gneiss** (Precambrian): Metamorphic basement — students learn that the deepest/oldest rocks are typically high-grade metamorphics.
2. **Dolomitic Limestone** (Cambrian): A carbonate platform — common in passive margin settings.
3. **Sandstone & Shale** (Ordovician): Clastic sedimentary sequence — introduces concepts of grain size, sorting, and depositional environment.
4. **Schist** (Silurian): Regional metamorphism — demonstrates how buried sediments can be metamorphosed.
5. **Limestone** (Devonian): Another carbonate — allows comparison with the dolomitic unit and discussion of diagenesis.
6. **Alluvium & Topsoil** (Quaternary): Modern surficial deposit — connects to present-day weathering and soil formation.

Each layer carries educational metadata: mineral assemblage, grain size, texture, fossils (where applicable), and age. This allows the Rock Identifier tool to function as a virtual hand specimen examination.

### Bedding Perturbation

Real strata are never perfectly horizontal. Regional folding, local warping, and differential compaction tilt bedding surfaces. The perturbation function combines:

- A sinusoidal fold axis (period ~600 m, amplitude 12 m) — representing a regional anticline/syncline pair.
- Two octaves of noise (amplitude 14 m and 6 m) — representing local warping.

This produces a ±32 m range of bedding displacement, ensuring that the same elevation can expose different rock types at different locations — a key mapping challenge that students must navigate.

### Fault Modelling

A north-south normal fault at X=200 introduces a 28 m vertical displacement (down-throw to the east). The sigmoid transition function (`1 / (1 + exp(-k * (x - xf)))`) avoids a sharp step, which would be geologically unrealistic and produce rendering artefacts at the fault scarp.

**Pedagogical significance**: Normal faults are among the first structural features students learn to identify. The fault in this simulator offsets visible stratigraphic boundaries, creating a mappable feature that students can locate by tracing layer discontinuities.

### Vegetation Density as a Geological Proxy

Each geological layer has a `vegetationDensity` property (0.05 to 1.0). This models a real-world phenomenon: soil thickness, chemistry, and drainage characteristics differ between rock types, controlling vegetation cover. Granite gneiss (0.05) supports almost no vegetation — thin acid soils over hard basement. Alluvium (1.0) supports full vegetation cover — deep, nutrient-rich soil.

This creates visible outcrop patterns: rock types with low vegetation density are more exposed, while high-density layers are masked by vegetation. Students learn to use vegetation patterns as a geological mapping aid, just as they would in real fieldwork.

---

## Rendering Decisions — PBR, Atmosphere, and Post-Processing

### Why PBR (Cook-Torrance)?

A simpler Phong or Lambert shader would be computationally cheaper, but Physically-Based Rendering was chosen because:

1. **Visual consistency**: PBR produces correct appearance under any lighting angle without manual tuning per light. As the sun elevation changes (Settings panel), rock surfaces remain believable.
2. **Material differentiation**: Roughness, metalness, and Fresnel parameters allow convincing visual distinction between wet mudstone (low roughness, high F0) and dry sandstone (high roughness, low F0) using the same shader.
3. **Educational immersion**: Geology students are trained to read rock surfaces — distinguishing foliation sheen from fracture surfaces, wet vs dry outcrops. PBR's physically correct specularity supports this.

**Implementation**: GGX Normal Distribution Function, Smith-Schlick Geometry term, and Fresnel-Schlick approximation — the standard microfacet BRDF used in modern game engines. Non-metal F0 = 0.04, metalness = 0 (rocks are dielectrics).

### Tri-Planar Mapping

Standard UV projection on terrain surfaces stretches textures on steep slopes. Tri-planar mapping samples the texture atlas along all three world axes (XY, XZ, YZ) and blends based on surface normal direction (with `pow(4)` sharpening for clean transitions). This ensures cliffs and slopes show undistorted rock textures — important for geological realism since rock textures have characteristic scales and patterns.

### Procedural Texture Atlas

External texture images would add load time and dependency management. Instead, each rock type's albedo, normal, and roughness-AO-height maps are procedurally generated on a 1024×1024 canvas:

- **Granite Gneiss**: Banding with mineral specks (quartz, feldspar, biotite)
- **Dolomitic Limestone**: Dissolution vein networks and pit textures
- **Sandstone & Shale**: Cross-bedding laminations with shale interbeds
- **Schist**: Foliation lines, mica flashes, garnet porphyroblasts
- **Limestone**: Stylolite dissolution seams, fossil outlines
- **Alluvium**: Grass patches, root channels

These are combined into a 6144×1024 horizontal atlas (6 tiles) for albedo, normal, and RMH, enabling single-texture tri-planar lookup with atlas UV offsetting. The 1024 px tile resolution provides crisp mineral-grain detail when the camera is close to the terrain surface (ultra-close LOD), while the atlas packing strategy keeps texture bind calls to a minimum.

**Normal maps** are derived from albedo via Sobel convolution — not artistically authored — ensuring consistency between the visible surface pattern and the lighting response.

### Atmospheric Scattering

A sky dome shader simulates physical Rayleigh scattering (blue zenith → warm horizon) and Mie scattering (sun glow) using Henyey-Greenstein phase function (g=0.76). This was chosen over a static skybox because:

- The sun elevation is adjustable at runtime (Settings panel), and the sky must respond physically.
- Dawn/dusk lighting conditions are important for field observation training — shadows lengthen, rock colours shift.
- FBM-animated clouds add temporal variation that reinforces the outdoor environment.

A 3D sun sphere (radius 120) and a BackSide glow halo (radius 300) are positioned at 6000 units along the shared `_sunDir` vector `(0.75, 0.4, 0.45)` normalized (~25° elevation), supplementing the sky dome's painted sun disc with a parallax-correct orb. The lower sun angle was chosen deliberately: the original direction `(0.4, 0.7, 0.3)` placed the sun at ~53° elevation — nearly overhead — which made it invisible from the typical downward-looking orbit camera. Lowering the elevation to ~25° and shifting the azimuth off-center ensures the sun orb and glow are clearly visible in the viewport, while producing longer shadows and more dramatic side-lighting that highlights terrain relief. The hemisphere ambient was increased from 0.50 to 0.55 to compensate for reduced direct overhead illumination at the lower sun angle. The glow uses an inverse-rim shader (`pow(1.0 - NdotV, 2.0) * 0.7`) to create soft atmospheric bloom around the sun without post-processing. The directional light is co-aligned with `_sunDir × 1500`, ensuring shadows, specular highlights, water reflections, and the visible sun position are all geometrically consistent.

### SSAO

Screen-Space Ambient Occlusion darkens concavities where light would naturally be occluded. A 12-tap kernel (golden-angle distributed) with distance-adaptive radius provides convincing contact shadows in rock crevices, building overhangs, and vegetation bases without the GPU cost of full ray-traced AO.

**Challenge**: Early SSAO implementations produced visible halos at terrain horizon edges where depth discontinuities occurred. A range-check falloff (samples rejected when depth difference exceeds threshold) eliminated the artefact.

---

## Water Systems — Hydrological Challenges

### Ocean — Gerstner Waves

Sinusoidal vertex displacement produces rounded, unrealistic waves. Gerstner waves model the circular orbital motion of water particles, creating trochoid wave profiles with sharp crests and broad troughs — a closer approximation to wind-driven ocean waves. Six waves with different directions, frequencies, and steepnesses are combined on a 300×300 vertex grid for visual complexity and fine-scale surface detail. Two high-frequency waves (w5, w6) were added to break up the periodicity visible with only four components.

All three water systems — ocean, lakes, and river — now share a triple specular model (high + medium + broad exponents) and multi-octave caustic noise for visual consistency across water bodies.

### Lake Water System — Gerstner Upgrade

Lake surfaces were originally driven by three sinusoidal ripple components with analytical normals. This produced symmetrical, wave-pool-like motion. The system was upgraded to a 5-component Gerstner wave model with finite-difference normals (ε=0.5, cross-product of forward/backward samples). This produces physically correct trochoid ripple profiles — sharp crests and flat troughs — even at the small amplitudes appropriate for enclosed water bodies. Lake geometry uses 96-segment circles (up from 64) for smoother shoreline silhouettes. A `uShallowColor` uniform enables per-lake colour variation.

### Lake Water Level Determination

Each lake's water level is not set arbitrarily but determined by sampling the terrain rim at 32 points around the lake periphery and taking the minimum. This ensures water sits at the natural "pour point" of the basin. The water surface is placed **1.8 m above** this minimum rim elevation (previously 0.3 m below), combined with deeper basin carving (16–24 m, up from 10–18 m). This change ensures lakes appear convincingly full, with water visibly lapping at the shoreline rather than sitting below the rim. The slight overshoot above the pour-point is visually acceptable because the terrain at the rim is irregular — the 1.8 m offset fills micro-depressions without creating visible overflow.

### River — Enhanced Flow System

The river shader was upgraded from 2-component to 4-component ripples, with two high-frequency waves (3.7× and 5.1× base frequency at decreasing amplitude) that break up the visible periodicity of the original system. Multi-octave flow-aligned caustics (two noise layers at different scales and scroll directions) replace the single-octave pattern. A subsurface scattering (SSS) approximation (`pow(dot(viewDir, -sunDir), 4) * 0.08`) adds translucent green-blue tint when viewing toward the sun, enhancing the perception of water depth.

### River Water Height

**Challenge**: Initial versions set river water height by sampling terrain at each mesh vertex, but bank-edge samples returned full bank height, creating a river surface that tilted upward at its edges. **Solution**: Water height is now sampled at the centre of the river (path midpoint) and set to channel floor + 1.0 m, producing a consistently flat and correctly positioned water surface.

---

## Vegetation Ecosystem — Density, Placement & Performance

### Biome-Aware Placement

Vegetation placement is not purely random. A multi-criteria filter determines whether each candidate position receives a plant:

1. **Water exclusion**: No vegetation within lakes (elliptical check) or river channel (distance to nearest Catmull-Rom path segment < half-width).
2. **Farm exclusion**: cleared circular zone around the farm compound.
3. **Slope threshold**: Steep terrain (>0.3–0.65 depending on type) is excluded — plants cannot root on cliff faces.
4. **Geological layer density**: `vegetationDensity` probability gate — granite (0.05) blocks 95% of candidates.
5. **Noise clustering**: Simplex noise at different scales creates natural-looking clumps rather than uniform distribution.
6. **Elevation preference**: Pines prefer >110 m (mountain zones), oaks <170 m (lowland), birches near water.
7. **Mountain vegetation**: Alpine shrubs, wildflowers, and mountain grass restricted to high elevations (>120-130 m).
8. **Riparian vegetation**: Reeds (within 18 m of water), dense grasses (55 m), wildflowers (45 m), shrubs (50 m).

**Educational value**: The resulting vegetation patterns are geologically correlated — students can observe that exposed granite (little soil) has sparse vegetation, while alluvial valleys are densely vegetated, and riparian zones have distinctive plant communities.

### Performance — InstancedMesh

Rendering 18,000+ individual vegetation objects with separate draw calls would exceed the GPU command budget on integrated graphics. `THREE.InstancedMesh` batches all instances of each type into a single draw call, reducing draw calls from ~18,000 to ~15. Per-instance colour variation is applied via `setColorAt()` without additional draw call overhead.

### Grass Style Unification

Grass across the entire terrain uses the same thin plane blade tuft geometry as the mountain grass — a `PlaneGeometry(0.5, 1.2, 1, 2)` with a subtle top-bend and `DoubleSide` rendering. This produces a lightweight, natural appearance consistent across all elevations. With 9,000 instances distributed by the standard vegetation placement pipeline (slope, geological density, water/farm exclusion), the grass provides ground-level detail without the visual bulk of 3D volumetric geometries.

---

## Challenges Faced & Solutions

This section catalogues the significant technical challenges encountered during development and the solutions employed.

### 1. River Micro-Gaps (Terrain vs Water Mesh Mismatch)

**Problem**: The terrain carving system used 11 sparse river control points while the water ribbon mesh used 81 Catmull-Rom subdivided points. Between control points, the terrain was not sufficiently carved, causing terrain polygons to protrude through the water surface.

**Root cause**: Two independent interpolation systems (linear for terrain carving, cubic for water mesh) operating on the same path definition.

**Solution**: Unified both systems to use the same Catmull-Rom subdivision (11 → 81 dense points). `subdivideRiverPath(pts, subsPerSeg=8)` is called once and the resulting array shared between `TerrainGenerator` and `WaterSystem`.

### 2. River Carving Depth Insufficient

**Problem**: Even with matched point sets, terrain "teeth" still appeared through the water surface in areas of high-frequency terrain noise.

**Root cause**: The carving depth (10 m) was comparable to the terrain detail noise amplitude (~10.5 m). In locally elevated areas, the noise-driven terrain height exceeded the carved channel floor.

**Solution**: Increased total carving to 28 m (explicit depth parameter = 16 m, base subtraction = 12 m). Additionally, the water height formula was changed from sampling bank terrain height to using channel-floor height + 1 m, ensuring a consistent relationship between water and carved terrain.

### 3. Vegetation Invisible at Distance

**Problem**: After initial implementation, grass was reported as entirely invisible in the scene despite correct placement logic.

**Root cause**: Flat `PlaneGeometry` billboards for grass were being viewed nearly edge-on from the default camera angle. At distances of 300–500 m, these sub-pixel elements were discarded during rasterization.

**Solution**: Adopted the same thin plane blade tufts used for mountain grass — `PlaneGeometry(0.5, 1.2, 1, 2)` with `DoubleSide` material and a subtle top-bend. The `DoubleSide` rendering ensures the blades remain visible from all camera angles. Bush geometry radius was also doubled (1 → 2) and minimum scale increased.

### 4. Vegetation Density Controlled by Wrong Layer

**Problem**: Vegetation was sparse everywhere, including areas that should be densely vegetated (e.g., alluvial valleys).

**Root cause**: `getLayerAtPosition()` applied bedding perturbation (±32 m displacement), which could shift the vegetation-density lookup into a completely different geological layer than the surface layer actually present. A surface alluvium location (density 1.0) could be perturbed into a granite lookup (density 0.05).

**Solution**: For vegetation density checks, switched to `getLayerAtElevation(h)` — which uses raw elevation without perturbation — giving a stable density value that correlates with actual surface conditions.

### 5. Vegetation Not Excluded from River

**Problem**: Trees and bushes spawned inside the river channel.

**Root cause**: The `isInRiver()` proximity check used the original 11 sparse control points. River segments between control points could be 200+ metres long, and the distance check against nearby points allowed positions within the river's curved path to pass filtering.

**Solution**: Changed `isInRiver()` and `nearWaterBody()` to use the 81-point Catmull-Rom dense path. With points spaced every ~7 m instead of ~70 m, the segment-distance check accurately excludes the entire river corridor.

### 6. Lake Water Shader XY/XZ Bug

**Problem**: Lake water surfaces displayed incorrect wave displacement — waves appeared to move vertically rather than creating horizontal ripple patterns.

**Root cause**: The GLSL shader applied wave displacement to the XY plane instead of the XZ plane (vertex positions in Three.js use Y-up convention).

**Solution**: Corrected the wave formula to displace vertices in the XZ plane with Y-axis vertical displacement.

### 7. GLSL 3.0 Incompatibility on Intel GPUs

**Problem**: Shaders compiled and rendered correctly on NVIDIA discrete GPUs but produced blank output or compilation errors on Intel Iris Xe.

**Root cause**: GLSL 3.0 ES syntax (`#version 300 es`, `in`/`out`, `texture()`) is not universally supported on all Intel driver versions, despite WebGL 2.0 being technically available.

**Solution**: All shaders were rewritten to use exclusively standard GLSL (`attribute`, `varying`, `texture2D`, `gl_FragColor`). No WebGL 2.0 features are used anywhere in the rendering pipeline.

### 8. React Re-render Performance

**Problem**: Hover events fired at 60+ fps, each updating React state, causing frame rate drops to <15 fps on integrated GPUs.

**Root cause**: Every terrain hover intersection triggered a Zustand store write, which triggered React re-renders of the HUD and StatusBar components.

**Solution**: Hover callbacks are gated to ~30 fps using `performance.now()` timestamps. Additionally, the HUD scale bar updates via `requestAnimationFrame` reading the camera directly, bypassing React entirely.

### 9. SSAO Halo Artefacts

**Problem**: Bright halos appeared at terrain silhouette edges and at the horizon line.

**Root cause**: SSAO depth samples at terrain boundaries had large depth discontinuities (terrain vs sky). These extreme differences produced incorrect occlusion values.

**Solution**: Added a range-check falloff: samples where `|depth_sample - depth_centre| > threshold` are excluded from the occlusion accumulation. Additionally, the final AO is blended 50/50 with white (`0.5 + 0.5 * ao`) to soften the effect.

---

## Academic & Training Applications

### Undergraduate Geology Education

1. **Geological Mapping Exercises**: Students can use the drill, identify, and cross-section tools to map outcrop patterns, identify the fault, trace fold axes, and produce geological maps and cross-sections — the core skills of a field mapping course.

2. **Stratigraphic Correlation**: The drill core tool reveals subsurface stratigraphy at any point. Students can drill multiple boreholes and correlate layers, learning about lateral facies changes and structural complications.

3. **Structural Geology Practicals**: The strike-and-dip tool demonstrates bedding orientation measurement. Students can take multiple measurements across the map, plot them on the stereonet visualisation, and interpret fold geometry.

4. **Rock Identification Training**: The rock identifier provides mineral assemblage, grain size, texture, fossils, and age information — teaching students to associate visual appearance with geological properties.

5. **Cross-Section Construction**: The cross-section tool demonstrates the principles of projecting surface data into a vertical profile, including layer interpretation and water table visualisation.

### Distance Learning & Accessibility

The simulator is particularly valuable for:

- **Remote learning**: students in geographically isolated areas or during lockdowns can complete field-equivalent exercises.
- **Disability accommodation**: students with mobility limitations who cannot easily navigate rough terrain can perform the same intellectual tasks.
- **Pre-field preparation**: students familiarise themselves with instruments and techniques before expensive field trips, improving efficiency in the field.
- **Post-field reinforcement**: concepts encountered in the field can be revisited and practised in the simulator.

### Professional Training

- **Mining and exploration geologists** can practise borehole correlation and cross-section interpretation.
- **Environmental consultants** can learn to relate surface geology to subsurface conditions.
- **Engineering geologists** can practise terrain assessment and geological hazard identification.

### Research Prototyping

The procedural generation framework can be adapted to test hypotheses about geological process interactions. Researchers can:

- Modify erosion parameters and observe resulting drainage network morphology.
- Adjust fault geometries and study their effect on outcrop patterns.
- Add new deformation components (thrust faults, unconformities) and validate mapping methodologies.

---

## Future Extensions & Features

### Geological Additions

1. **Igneous intrusions**: Dykes, sills, and batholiths with thermal aureoles (contact metamorphism zones). Would require a new layer-intersection algorithm and radial metamorphic gradient.

2. **Unconformities**: Angular unconformities where tilted strata are truncated and overlain by younger horizontal beds. Requires a per-layer rotation matrix that varies across the map.

3. **Thrust faults and reverse faults**: Compressional structures that duplicate stratigraphy. The current fault model (normal, single sigmoid) could be extended to an array of fault objects with type, geometry, and displacement parameters.

4. **Fold visualisation**: Interactive 3D fold axes with plunge and trend. Stereographic projection of multiple bedding measurements to determine fold orientation.

5. **Additional rock types**: Volcanic (basalt, tuff, ignimbrite), plutonic (granite, gabbro), and sedimentary (conglomerate, evaporites, chalk) to expand the stratigraphic range.

6. **Metamorphic grade zones**: Progressive metamorphism from unmetamorphosed sediment → slate → phyllite → schist → gneiss, with appropriate texture and mineral changes.

### Hydrological Extensions

7. **Groundwater table**: Subsurface water level that intersects the terrain, visible in boreholes and cross-sections. Could introduce concepts of aquifers, aquitards, and artesian conditions.

8. **Springs and seeps**: Where the water table intersects hillslopes, with associated vegetation effects.

9. **Alluvial fans and deltas**: Depositional features at river mouths and valley exits.

### Instrument & Tool Additions

10. **Geophysical survey tools**: Gravity, magnetic, and seismic line instruments for interpreting subsurface structure without drilling. Would introduce geophysics concepts and non-invasive exploration methods.

11. **Geological compass overlay**: A detailed Brunton compass simulation for measuring strike and dip, teaching students the actual measurement procedure.

12. **Sample collection**: Virtual rock sample collection with hand-specimen description and thin-section microscopy views.

13. **Geological map drawing**: An in-browser vector drawing layer where students can trace formation boundaries, fault lines, and fold axes directly on the terrain.

14. **Waypoint navigation**: GPS-style waypoint system for structured mapping exercises with prescribed observation stations.

### Technical Enhancements

15. **WebXR / VR support**: Stereoscopic rendering for immersive headset use. The Three.js `XRSession` API makes this feasible without engine changes.

16. **Multiplayer field trips**: WebSocket-based shared sessions where an instructor and students explore the same terrain simultaneously, with shared annotations and markers.

17. **Terrain import**: Load real-world DEMs and geological maps for site-specific training (e.g., a specific quarry or field area).

18. **Configurable geology**: A JSON/YAML schema for defining custom stratigraphic columns, fault arrays, fold geometries, and intrusion bodies — allowing instructors to build bespoke exercises.

19. **Assessment framework**: Built-in quizzes, scoring rubrics, and progress tracking for integration with Learning Management Systems (LMS).

20. **Enhanced LOD**: Multi-resolution terrain with dynamic tile loading for larger map extents (> 2 km).

21. **Sedimentary logging**: Visual stratigraphic logging tool that generates standard sedimentary log diagrams from borehole data.

---

## Related Work

The following projects and systems address similar goals in virtual geological education:

- **Virtual Landscapes**: Geological Society of London's virtual fieldwork resources using photogrammetric models of real outcrops.
- **Visible Geology** (visiblegeology.com): Browser-based tool for constructing geological block diagrams with faults and folds — complementary to this simulator's terrain-scale approach.
- **GeoTour (Google Earth)**: Guided virtual field trips using satellite imagery — lacks subsurface geology.
- **Minecraft Geology Mods**: Educational mods that add geological strata to voxel environments — lower fidelity but high engagement.
- **V-Field (Lancaster University)**: Spherical panorama-based virtual field trips with geological annotations.
- **OpenTopography**: LiDAR DEM hosting — provides data but not interactive tools.

This simulator differs from these by combining **procedural subsurface geology**, **physically-based rendering**, **interactive measurement instruments**, and **zero-installation browser delivery** in a single system.

---

## Conclusions

The Structural Geology Field Mapping Simulator demonstrates that procedural terrain generation, combined with geologically informed deformation models and physically-based rendering, can produce an educationally effective virtual field environment that runs on commodity hardware. The challenges encountered — from shader compatibility to vegetation visibility to river system coherence — were resolved through careful engineering that prioritised geological plausibility and visual quality within the constraints of browser-based WebGL rendering.

The system has direct applications in geology undergraduate education, distance learning, professional training, and research prototyping. Proposed extensions — including additional structural features, geophysical tools, VR support, and multiplayer capability — offer a clear path toward a comprehensive virtual geology laboratory.

The procedural approach ensures that the environment can be tuned, extended, and reproduced deterministically, making it suitable for both teaching and assessment contexts where fairness and repeatability are essential.
