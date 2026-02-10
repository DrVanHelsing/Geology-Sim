# Geology Field Simulator — Unity Port

A complete port of the V2-React geology field simulator to Unity, providing
better rendering quality, smoother performance, and native GPU acceleration.

## System Requirements

- **Unity 2022.3 LTS** (any 2022.3.x build)
- **Universal Render Pipeline** (included via manifest.json)
- **Target Hardware**: Intel Iris Xe, i5 11th gen, 12 GB RAM (or better)

## Quick Setup (5 minutes)

### Step 1 — Install Unity

1. Install **Unity Hub** from [unity.com](https://unity.com/download)
2. In Unity Hub → **Installs** → **Install Editor** → pick **2022.3.x LTS**
3. No extra modules needed (built-in render pipeline packages will auto-download)

### Step 2 — Open the Project

1. In Unity Hub → **Projects** → **Open** (or **Add**)
2. Navigate to **this folder** (`V2 - Unity/`)
3. Click **Open** — Unity will import packages (may take 2-5 minutes first time)

### Step 3 — Import TextMeshPro Essentials

When Unity opens, you may see a TMP Importer dialog:
- Click **Import TMP Essentials**
- If it doesn't appear: **Window → TextMeshPro → Import TMP Essential Resources**

### Step 4 — Setup Scene

1. **GeologySim → Setup Scene** (top menu bar)
2. Click **Create Scene** in the dialog
3. The scene is saved to `Assets/Scenes/GeologySimMain.unity`

### Step 5 — Configure Quality (Optional)

1. **GeologySim → Configure Quality (Iris Xe)** (top menu)
2. This applies optimized settings for Intel Iris Xe graphics

### Step 6 — Play!

1. Press the **▶ Play** button (or Ctrl+P)
2. The simulator will generate terrain, run erosion, build water/atmosphere/vegetation
3. Loading takes ~5-15 seconds depending on hardware
4. Interact with the full UI once loaded

## Controls

| Input | Action |
|-------|--------|
| **Right Mouse + Drag** | Orbit camera |
| **Middle Mouse + Drag** | Pan camera |
| **Scroll Wheel** | Zoom (toward cursor) |
| **Left Click** | Use active tool |
| **1** | Identify tool |
| **2** | Drill tool |
| **3** | Measure tool |
| **4** | Strike & Dip tool |
| **5** | Cross Section tool |
| **L** | Toggle Legend panel |
| **N** | Toggle Notebook panel |
| **,** | Toggle Settings panel |
| **Esc** | Close panels / popups |

## Features (parity with V2-React)

- **Procedural terrain**: 384×384 grid, 8-layer noise composition, Catmull-Rom
  river carving, 5 lake basins, farm flattening
- **Hydraulic erosion**: 38,000 particle simulation
- **6 geological layers**: Granite Gneiss → Alpine Schist with bedding
  perturbation and fault offset
- **Water systems**: Ocean (6 Gerstner waves), Lakes (5 Gerstner), River
  (4-component flow)
- **Atmosphere**: Rayleigh/Mie sky dome, sun disc + glow, animated clouds
- **Vegetation**: Pine/Oak/Birch trees, bushes, rocks, grass, mountain flora,
  full farm compound (buildings, silos, fields, fences, windmill)
- **Field tools**: Identify, Drill Core, Measure, Strike & Dip, Cross Section
- **Full UI**: Sidebar, status bar, floating panels, loading screen, rock popup

## Project Structure

```
Assets/
  Editor/
    ProjectSetup.cs          # Menu items for scene setup
  Scripts/
    Core/
      GeologyConfig.cs        # All geological constants & layer definitions
      SimplexNoise.cs          # Simplex noise & FBM/Ridge utilities
      AppState.cs              # Singleton state management with events
      GameManager.cs           # Main orchestrator — builds entire world
    Terrain/
      TerrainGenerator.cs      # Heightmap, erosion, mesh construction
    Rendering/
      WaterManager.cs          # Ocean, lakes, river mesh & animation
      AtmosphereManager.cs     # Sky dome, sun sphere, glow
      VegetationManager.cs     # All vegetation & farm compound
    Camera/
      OrbitCamera.cs           # Orbital camera with terrain clamping
    Tools/
      ToolManager.cs           # All 5 geological field tools
    UI/
      UIManager.cs             # Complete runtime Canvas UI
  Shaders/
    TerrainPBR.shader          # Cook-Torrance BRDF terrain
    OceanWater.shader          # 6-wave Gerstner ocean
    LakeWater.shader           # 5-wave Gerstner lakes
    SkyDome.shader             # Rayleigh/Mie atmospheric scattering
    SunGlow.shader             # Backside rim glow for sun
Packages/
  manifest.json               # URP 14.0.11, TextMeshPro 3.0.6
```

## Performance Notes

- Terrain mesh uses **32-bit indices** (148K+ vertices)
- Vegetation uses individual GameObjects marked `isStatic = true` for
  static batching — Unity will batch these automatically
- Water animation uses global shader property `_GlobalTime` (single
  `Shader.SetGlobalFloat` call per frame)
- Shadow resolution set to Medium (1024) for Iris Xe — increase to High
  for discrete GPUs
- Fog uses exponential-squared mode matching the V2-React implementation

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pink/magenta materials | URP not configured — ensure you opened a 3D URP project or manually assign a URP asset in Project Settings → Graphics |
| TMP_Text errors | Import TMP Essentials: Window → TextMeshPro → Import TMP Essential Resources |
| Slow first load | Normal — Unity compiles shaders on first run. Subsequent loads are faster |
| Low FPS | Run GeologySim → Configure Quality (Iris Xe) to apply optimized settings |
| No terrain visible | Make sure you ran GeologySim → Setup Scene and pressed Play |
