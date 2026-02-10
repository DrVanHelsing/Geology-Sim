# Technical Reference — Structural Geology Field Mapping Simulator

## Complete Inventory of Technologies, Algorithms, Code Patterns, and Shaders

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Noise & Procedural Generation](#noise--procedural-generation)
3. [Terrain Generation Algorithms](#terrain-generation-algorithms)
4. [Hydraulic Erosion Simulation](#hydraulic-erosion-simulation)
5. [Geological Layer System](#geological-layer-system)
6. [Procedural Texture Generation](#procedural-texture-generation)
7. [PBR Terrain Shader (Cook-Torrance BRDF)](#pbr-terrain-shader-cook-torrance-brdf)
8. [Atmospheric Scattering Shader](#atmospheric-scattering-shader)
9. [Water Shaders (Ocean, Lakes, River)](#water-shaders-ocean-lakes-river)
10. [SSAO Post-Processing](#ssao-post-processing)
11. [Spline & Interpolation Algorithms](#spline--interpolation-algorithms)
12. [Vegetation System & Instanced Rendering](#vegetation-system--instanced-rendering)
13. [Tool Implementation Details](#tool-implementation-details)
14. [3D Marker Construction & Animation](#3d-marker-construction--animation)
15. [State Management Architecture](#state-management-architecture)
16. [React Component Patterns](#react-component-patterns)
17. [Performance Techniques](#performance-techniques)
18. [Constants & Configuration Values](#constants--configuration-values)

---

## Technology Stack

### Core Dependencies

| Package | Version | Role | File(s) |
|---|---|---|---|
| `vite` | 5.1.4 | Dev server, HMR, build bundling (441 modules) | `vite.config.js` |
| `@vitejs/plugin-react` | 4.2.1 | JSX/React Fast Refresh for Vite | `vite.config.js` |
| `react` | 18.2.0 | UI framework (functional components, hooks) | All `.jsx` files |
| `react-dom` | 18.2.0 | DOM rendering | `main.jsx` |
| `three` | 0.162.0 | 3D WebGL rendering engine | All `engine/*.js` files |
| `zustand` | 4.5.1 | State management with `subscribeWithSelector` | `useStore.js` |
| `jspdf` | 2.5.1 | PDF export for field notebook | `NotebookPanel.jsx` |

### External Resources (CDN)

| Resource | Source | Purpose |
|---|---|---|
| Inter (400, 500, 600) | Google Fonts | UI body text |
| JetBrains Mono (400) | Google Fonts | Monospace data display |

### Build Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
})
```

---

## Noise & Procedural Generation

**File**: `src/engine/noise.js`

### Simplex Noise 2D

Implementation based on Stefan Gustavson's simplex noise algorithm. Produces coherent noise in the range [-1, 1].

```javascript
export function createNoise2D(seed = 0) {
  // Permutation table built with Linear Congruential Generator (LCG)
  // LCG: next = (seed * 1664525 + 1013904223) & 0xffffffff
  // Gradient table: 12 vectors for 2D simplex grid
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];
  // Skew factor: F2 = 0.5 * (sqrt(3) - 1)
  // Unskew factor: G2 = (3 - sqrt(3)) / 6
  // ...
  return function noise2D(x, y) { /* simplex evaluation */ };
}
```

**Why used**: Simplex noise is the foundation of all terrain features. It provides gradient-continuous random values that tile smoothly, unlike Perlin noise which has visible grid-aligned artefacts. Used in `TerrainGenerator.js`, `VegetationSystem.js`, `ErosionSimulator.js`.

### Fractional Brownian Motion (FBM)

```javascript
export function fbm(noise, x, z, octaves = 6, lacunarity = 2.0, gain = 0.5) {
  let sum = 0, amp = 1, freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += noise(x * freq, z * freq) * amp;
    freq *= lacunarity;  // double frequency each octave
    amp *= gain;          // halve amplitude each octave
  }
  return sum;
}
```

**Where used**: Continental-scale terrain (6 oct), rolling hills (4 oct), detail (3 oct), micro (2 oct), plateaus (3 oct), atmospheric clouds (5 oct in shader).

**Why used**: FBM sums self-similar noise at increasing frequencies, producing the fractal character of natural terrain. The `gain` parameter (0.5) ensures high-frequency details contribute less energy, preserving large-scale form while adding surface roughness.

### Ridge Noise

```javascript
export function ridgeNoise(noise, x, z, octaves = 4) {
  let sum = 0, amp = 1, freq = 1, prev = 1;
  for (let i = 0; i < octaves; i++) {
    let n = noise(x * freq, z * freq);
    n = 1 - Math.abs(n);  // invert to create ridges at zero-crossings
    n = n * n;             // sharpen the ridge
    n *= prev;             // weight by previous octave (sharper peaks)
    sum += n * amp;
    prev = n;
    freq *= 2;
    amp *= 0.5;
  }
  return sum;
}
```

**Where used**: Mountain range generation (NW belt amplitude ×120 m, NE belt ×80 m).

**Why used**: Standard FBM produces rounded mounds. `1 - |n|` creates sharp ridges at the noise function's zero-crossings, and squaring sharpens them further. Multiplying by the previous octave's value (`prev = n`) concentrates high-frequency detail on ridge crests, producing the sharp-crested, deeply incised appearance of real mountain ridgelines.

---

## Terrain Generation Algorithms

**File**: `src/engine/TerrainGenerator.js`

### Height Function Composition

```javascript
export function generateHeight(noise, noiseB, x, z) {
  // 1. Base continental floor
  let h = 80 + fbm(noise, x * 0.0008, z * 0.0008, 6) * 55;

  // 2. NW Mountain belt — ridge noise × Gaussian mask
  const mtnMask1 = Math.exp(-((dx1*dx1 + dz1*dz1) / (2 * 650*650)));
  h += ridgeNoise(noiseB, x*0.0014, z*0.0014, 4) * 120 * mtnMask1;

  // 3. NE Secondary range
  const mtnMask2 = Math.exp(-((dx2*dx2 + dz2*dz2) / (2 * 500*500)));
  h += ridgeNoise(noise, x*0.0018, z*0.0018, 4) * 80 * mtnMask2;

  // 4. Rolling hills
  h += fbm(noiseB, x * 0.002, z * 0.002, 4) * 30;

  // 5. V-shaped valley carving (absolute value creates incisions)
  h -= Math.abs(noise(x * 0.001, z * 0.001)) * 25;

  // 6. Detail + micro noise
  h += fbm(noise, x * 0.006, z * 0.006, 3) * 8;
  h += fbm(noiseB, x * 0.015, z * 0.015, 2) * 2.5;

  // 7. Plateau formation (clamped positive noise)
  h += Math.max(0, fbm(noise, x * 0.0012, z * 0.0012, 3)) * 18;

  // 8. Edge falloff (island boundary)
  h -= edgeDrop * 60;

  return Math.max(h, 18);
}
```

**Frequency-amplitude pairings**: Each noise layer uses carefully chosen frequency scales (0.0008 to 0.015) and amplitudes (2.5 m to 120 m). Lower frequencies produce large-scale features; higher frequencies add surface detail. The frequency ratios between layers ensure they don't produce visible beating patterns.

### Gaussian Mountain Masks

```javascript
const mtnMask = Math.exp(-((dx*dx + dz*dz) / (2 * radius*radius)));
```

**Why used**: Confines mountain ranges to circular regions with smooth falloff. The Gaussian function produces a bell curve from 1.0 (centre) to ~0 (3σ away), avoiding hard edges that would look artificial.

### Edge Falloff

```javascript
const edgeFrac = Math.max(0, (distFromEdge - mapSize * 0.85) / (mapSize * 0.15));
const edgeDrop = edgeFrac * edgeFrac;  // quadratic
h -= edgeDrop * 60;
```

**Why used**: Creates an island effect — terrain drops towards map boundaries, preventing a flat clipped edge that would break immersion.

### Farm Flattening (Hermite Smoothstep)

```javascript
const farmDist = Math.sqrt((wx - farmCX)**2 + (wz - farmCZ)**2);
if (farmDist < farmRadius) {
  const t = farmDist / farmRadius;
  const s = t * t * (3 - 2 * t);  // Hermite smoothstep
  h = farmElev * (1 - s) + h * s;
}
```

**Why used**: Hermite smoothstep `t²(3-2t)` provides a C¹-continuous blend between the flat farm plateau and the surrounding terrain. A linear blend would create a visible crease at the boundary.

### Bilinear Height Interpolation

```javascript
export function getTerrainHeight(heightMap, wx, wz) {
  // Convert world coords to grid indices
  const gx = (wx + halfSize) / TERRAIN_SIZE * SEGMENTS;
  const gz = (wz + halfSize) / TERRAIN_SIZE * SEGMENTS;
  const ix = Math.floor(gx), iz = Math.floor(gz);
  const fx = gx - ix, fz = gz - iz;

  // Four corner samples
  const h00 = heightMap[iz * S1 + ix];
  const h10 = heightMap[iz * S1 + ix + 1];
  const h01 = heightMap[(iz+1) * S1 + ix];
  const h11 = heightMap[(iz+1) * S1 + ix + 1];

  // Bilinear blend
  return (h00*(1-fx)*(1-fz) + h10*fx*(1-fz) + h01*(1-fx)*fz + h11*fx*fz);
}
```

**Where used**: Every terrain height query — tool handlers, vegetation placement, water level determination, river carving.

**Why used**: The heightmap is a discrete grid (385×385). Bilinear interpolation produces smooth continuous height values between grid points, preventing staircase artefacts in tool results and vegetation placement.

---

## Hydraulic Erosion Simulation

**File**: `src/engine/ErosionSimulator.js`

### Algorithm: Particle-Based Hydraulic Erosion

```javascript
export function erodeHeightmap(heightMap, size, iterations = 22000) {
  const params = {
    inertia: 0.05,       // direction momentum (0=pure gradient, 1=pure inertia)
    capacity: 4.0,       // max sediment capacity per droplet
    deposition: 0.3,     // fraction of excess sediment deposited per step
    erosion: 0.3,        // fraction of deficit eroded per step
    evaporation: 0.012,  // water loss per step
    gravity: 4.0,        // speed gain from slope
    minSlope: 0.01,      // prevents division by zero on flat terrain
    radius: 3,           // erosion brush radius (cells)
    maxLife: 30           // max steps per droplet
  };

  for (let iter = 0; iter < iterations; iter++) {
    // Random starting position
    let x = Math.random() * (size - 2) + 1;
    let z = Math.random() * (size - 2) + 1;
    let dx = 0, dz = 0;
    let speed = 1, water = 1, sediment = 0;

    for (let step = 0; step < params.maxLife; step++) {
      // Bilinear height + gradient at current position
      const {height, gradX, gradZ} = sampleHeightAndGradient(heightMap, x, z, size);

      // Update direction with inertia
      dx = dx * params.inertia - gradX * (1 - params.inertia);
      dz = dz * params.inertia - gradZ * (1 - params.inertia);

      // Normalize direction
      const len = Math.sqrt(dx*dx + dz*dz);
      if (len < 1e-6) break;
      dx /= len; dz /= len;

      // Move droplet
      const nx = x + dx, nz = z + dz;
      if (nx < 1 || nx >= size-2 || nz < 1 || nz >= size-2) break;

      const newHeight = sampleHeight(heightMap, nx, nz, size);
      const heightDiff = newHeight - height;

      // Sediment capacity = max(slope, minSlope) * speed * water * capacity
      const cap = Math.max(-heightDiff, params.minSlope) * speed * water * params.capacity;

      if (sediment > cap || heightDiff > 0) {
        // Deposit sediment (going uphill or over capacity)
        const deposit = (heightDiff > 0)
          ? Math.min(sediment, heightDiff)
          : (sediment - cap) * params.deposition;
        depositAt(heightMap, x, z, size, deposit);
        sediment -= deposit;
      } else {
        // Erode terrain (under capacity)
        const erodeAmount = Math.min((cap - sediment) * params.erosion, -heightDiff);
        erodeRadius(heightMap, x, z, size, erodeAmount, params.radius);
        sediment += erodeAmount;
      }

      // Update physics
      speed = Math.sqrt(Math.max(0, speed*speed + heightDiff * params.gravity));
      water *= (1 - params.evaporation);
      x = nx; z = nz;
    }
  }
}
```

**Why used**: Procedural noise produces mathematically smooth terrain. Real landscapes are shaped by water — incised channels, rounded ridges, sediment-filled valleys. This algorithm simulates thousands of water droplets flowing downhill, each carrying and depositing sediment, creating realistic drainage patterns that break up the noise-based uniformity.

**Key design decisions**:
- `radius: 3` — erosion is distributed over a circular area, not a single point, preventing thin slot canyons.
- `inertia: 0.05` — nearly pure gradient following, producing channels that closely follow the steepest path (more realistic for unchannelised flow).
- `capacity: 4.0` and `gravity: 4.0` — tuned to produce visible but not excessive erosion at 38,000 iterations.

---

## Geological Layer System

**File**: `src/config/geology.js`

### Layer Data Structure

```javascript
export const GEOLOGY_LAYERS = [
  {
    name: 'Granite Gneiss',
    baseElevation: 0,
    color: { r: 180, g: 170, b: 160 },
    hex: '#b4aaa0',
    vegetationDensity: 0.05,
    minerals: ['Quartz', 'K-Feldspar', 'Plagioclase', 'Biotite', 'Hornblende'],
    characteristics: 'Foliated high-grade metamorphic rock with alternating light and dark mineral bands',
    grainSize: 'Coarse (2-10mm)',
    texture: 'Gneissic banding',
    fossils: 'None — pre-dates complex life',
    age: 'Precambrian (~1.8 Ga)'
  },
  // ... 5 more layers
];
```

### Elevation-Based Layer Lookup

```javascript
export function getLayerAtElevation(y) {
  for (let i = GEOLOGY_LAYERS.length - 1; i >= 0; i--) {
    if (y >= GEOLOGY_LAYERS[i].baseElevation) return GEOLOGY_LAYERS[i];
  }
  return GEOLOGY_LAYERS[0];
}
```

**Why reverse iteration**: The highest-baseElevation layer that the query elevation is above is the correct one. Iterating from top to bottom and returning on the first match is both correct and efficient.

### Bedding Perturbation

```javascript
export function getBeddingPerturbation(noise, wx, wz) {
  // Regional fold axis (~NE-SW)
  const fold = Math.sin((wx + wz) * 0.005) * 12;
  // Local warping
  const n1 = noise(wx * 0.003, wz * 0.003) * 14;
  const n2 = noise(wx * 0.007 + 50, wz * 0.007 + 50) * 6;
  return fold + n1 + n2;  // ±32 m range
}
```

**Why used**: Flat-lying strata would produce boring horizontal bands. The regional fold produces an anticline-syncline pair with ~600 m wavelength, mimicking real-world compressional folding. The two noise terms add local-scale warping at different frequencies. The total ±32 m range ensures that outcrop patterns are complex enough to require genuine geological reasoning to map.

### Fault Offset (Sigmoid)

```javascript
export function getFaultOffset(wx) {
  const faultX = 200, faultW = 40, throw_ = -28;
  return throw_ / (1 + Math.exp(-6 * (wx - faultX) / faultW));
}
```

**Why sigmoid**: A step function would create an infinitely thin fault plane — geologically unrealistic and producing rendering artefacts. The sigmoid `1/(1+e^(-kx))` transitions smoothly over the fault zone width (40 m), modelling the finite-width deformation zone around real fault planes.

### Fractional Layer Index with Blend Zone

```javascript
export function computeLayerIndex(noise, wx, h, wz) {
  const BLEND = 6;  // metres
  const effectiveH = h + getBeddingPerturbation(noise, wx, wz)
                       + getFaultOffset(wx);

  for (let i = GEOLOGY_LAYERS.length - 1; i >= 1; i--) {
    const base = GEOLOGY_LAYERS[i].baseElevation;
    if (effectiveH >= base - BLEND) {
      const t = Math.min(1, Math.max(0, (effectiveH - base + BLEND) / (2 * BLEND)));
      const smooth = t * t * (3 - 2 * t);  // Hermite smoothstep
      return (i - 1) + smooth;
    }
  }
  return 0;
}
```

**Why used**: Sharp layer boundaries (integer indices) would create visible staircase edges on the terrain mesh. The 6 m blend zone produces a smooth fractional index that the fragment shader uses to interpolate between adjacent layer textures, creating natural-looking gradational contacts.

---

## Procedural Texture Generation

**File**: `src/engine/TextureFactory.js`

### Per-Layer Texture Generators

Each geological layer has a dedicated texture generator producing 512×512 pixel albedo and RMH (Roughness, AO, Height) buffers. Examples:

#### Granite Gneiss — Banding with Mineral Specks

```javascript
function generateGraniteGneiss(albedo, rmh, W) {
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      // Banding pattern from sinusoidal wave + noise
      const band = Math.sin(y * 0.12 + Math.sin(x * 0.05) * 2) * 0.5 + 0.5;
      const base = [180 - band*30, 170 - band*25, 160 - band*20];

      // Mineral specks: random bright quartz, pink feldspar, dark biotite
      if (Math.random() < 0.02) { /* quartz: lighter */ }
      if (Math.random() < 0.015) { /* feldspar: pinkish */ }
      if (Math.random() < 0.025) { /* biotite: dark */ }

      albedo[i] = r; albedo[i+1] = g; albedo[i+2] = b; albedo[i+3] = 255;
      rmh[i] = roughness; rmh[i+1] = ao; rmh[i+2] = height; rmh[i+3] = 255;
    }
  }
}
```

#### Schist — Foliation with Garnet Porphyroblasts

```javascript
function generateSchist(albedo, rmh, W) {
  // Wavy foliation lines: sin(y * freq + sin(x * warp) * amp)
  // Mica flash spots: Gaussian bright patches at random positions
  // Garnet porphyroblasts: circular dark-red spots (radius 3-5 px)
}
```

### Sobel Normal Map Generation

```javascript
function normalMapFromPixels(src, W) {
  const dst = new Uint8Array(W * W * 4);
  const S = 3.2;  // strength multiplier
  for (let y = 1; y < W-1; y++) {
    for (let x = 1; x < W-1; x++) {
      // Sobel kernel on luminance
      const tl = lum(x-1, y-1), t = lum(x, y-1), tr = lum(x+1, y-1);
      const l  = lum(x-1, y),                      r  = lum(x+1, y);
      const bl = lum(x-1, y+1), b = lum(x, y+1), br = lum(x+1, y+1);

      const dx = (tr + 2*r + br) - (tl + 2*l + bl);
      const dy = (bl + 2*b + br) - (tl + 2*t + tr);

      // Normal = normalize(-dx*S, -dy*S, 1)
      const nx = -dx * S, ny = -dy * S, nz = 1;
      const len = Math.sqrt(nx*nx + ny*ny + nz*nz);

      dst[i]   = ((nx/len) * 0.5 + 0.5) * 255;  // R = X
      dst[i+1] = ((ny/len) * 0.5 + 0.5) * 255;  // G = Y
      dst[i+2] = ((nz/len) * 0.5 + 0.5) * 255;  // B = Z
    }
  }
  return dst;
}
```

**Why Sobel**: The Sobel operator is a standard image-processing edge detector. Applied to the albedo luminance, it approximates surface gradient (dx, dy) which maps directly to a tangent-space normal vector. Strength=3.2 produces visible but not exaggerated surface relief.

### Atlas Construction

```javascript
export function createTextureAtlases() {
  const W = 512;
  // Generate 6 layers × (albedo + rmh) buffers
  const generators = [genGraniteGneiss, genDolomiticLimestone, ...];

  // Combine into 3072×512 horizontal atlas
  const atlasAlbedo = new Uint8Array(6 * W * W * 4);
  const atlasNormal = new Uint8Array(6 * W * W * 4);
  const atlasRMH    = new Uint8Array(6 * W * W * 4);

  for (let i = 0; i < 6; i++) {
    const albedo = new Uint8Array(W * W * 4);
    const rmh = new Uint8Array(W * W * 4);
    generators[i](albedo, rmh, W);
    const normal = normalMapFromPixels(albedo, W);

    // Copy tile i into atlas at x-offset i*W
    copyTile(atlasAlbedo, albedo, i * W, 0, W);
    copyTile(atlasNormal, normal, i * W, 0, W);
    copyTile(atlasRMH, rmh, i * W, 0, W);
  }

  return {
    albedoAtlas: new THREE.DataTexture(atlasAlbedo, 6*W, W, ...),
    normalAtlas: new THREE.DataTexture(atlasNormal, 6*W, W, ...),
    rmhAtlas:    new THREE.DataTexture(atlasRMH,    6*W, W, ...)
  };
}
```

**Why horizontal atlas**: A single texture containing all 6 rock tiles allows the fragment shader to select any layer with a UV offset calculation, avoiding texture array extensions (not available in WebGL 1.0). The shader computes `atlasUV = vec2(fract(uv.x) / 6.0 + float(layer) / 6.0, uv.y)`.

---

## PBR Terrain Shader (Cook-Torrance BRDF)

**File**: `src/engine/TerrainShader.js`

### Vertex Shader

```glsl
attribute float aLayerIndex;
attribute vec3 aVertColor;

varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying vec3 vVertColor;
varying float vLayerIndex;
varying float vFogDepth;
varying vec2 vDetailUV;
varying float vElevation;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vVertColor = aVertColor;
  vLayerIndex = aLayerIndex;
  vFogDepth = length(worldPos.xyz - cameraPosition);
  vDetailUV = worldPos.xz * 0.06;
  vElevation = worldPos.y;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
```

### Fragment Shader — Key Functions

#### Atlas UV Mapping

```glsl
vec2 atlasUV(vec2 baseUV, float layer) {
  float l = floor(clamp(layer, 0.0, 5.0));
  return vec2(fract(baseUV.x) / 6.0 + l / 6.0, fract(baseUV.y));
}
```

#### Tri-Planar Sampling

```glsl
vec3 triPlanar(sampler2D tex, vec3 pos, float sc, float layer) {
  vec3 w = abs(vWorldNormal);
  w = pow(w, vec4(4.0));  // sharpen blend weights
  w /= (w.x + w.y + w.z);

  vec3 xSample = texture2D(tex, atlasUV(pos.yz * sc, layer)).rgb;
  vec3 ySample = texture2D(tex, atlasUV(pos.xz * sc, layer)).rgb;
  vec3 zSample = texture2D(tex, atlasUV(pos.xy * sc, layer)).rgb;

  return xSample * w.x + ySample * w.y + zSample * w.z;
}
```

**Why `pow(4.0)`**: Default linear blending creates a mushy transition zone. Raising weights to the 4th power creates sharper transitions between projection planes, reducing the visible blend region on steep slopes.

#### GGX Normal Distribution Function

```glsl
float distributionGGX(float NdotH, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float denom = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (3.14159265 * denom * denom);
}
```

**Why GGX**: The GGX (Trowbridge-Reitz) microfacet distribution has a longer specular tail than Beckmann, producing more realistic highlights on rough surfaces. It is the industry-standard NDF used in Unreal Engine, Frostbite, and Unity.

#### Smith-Schlick Geometry Function

```glsl
float geometrySmith(float NdotV, float NdotL, float roughness) {
  float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
  float gV = NdotV / (NdotV * (1.0 - k) + k);
  float gL = NdotL / (NdotL * (1.0 - k) + k);
  return gV * gL;
}
```

**Why `k = (r+1)²/8`**: This is the Disney/Epic remapping of roughness for analytical lights (as opposed to IBL where k = r²/2). It prevents the geometry term from over-attenuating specular at high roughness values.

#### Fresnel-Schlick Approximation

```glsl
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}
```

**Why Schlick**: An approximation of the full Fresnel equations that is both computationally efficient and physically accurate for dielectric surfaces with F0 = 0.04 (standard for rock/soil).

#### Complete BRDF Assembly

```glsl
// Cook-Torrance specular
float D = distributionGGX(NdotH, roughness);
float G = geometrySmith(NdotV, NdotL, roughness);
vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);

vec3 numerator = D * G * F;
float denominator = 4.0 * NdotV * NdotL + 0.0001;  // avoid div/0
vec3 specular = numerator / denominator;

// Energy conservation
vec3 kD = (vec3(1.0) - F) * (1.0 - metalness);

// Final outgoing radiance
vec3 Lo = (kD * albedo / 3.14159265 + specular) * lightColor * NdotL;
```

#### Terrain Wetness System

```glsl
// Distance to nearest water body (lakes + river segments)
float waterProx = 1e6;
// Check 5 lakes (uniforms: lakePosX[5], lakePosZ[5], lakeR[5])
for (int i = 0; i < 5; i++) {
  float d = length(vWorldPos.xz - vec2(lakePosX[i], lakePosZ[i])) - lakeR[i];
  waterProx = min(waterProx, d);
}
// Check 11 river segments
for (int i = 0; i < 10; i++) {
  // Point-to-segment distance
  waterProx = min(waterProx, segDist);
}

float wetness = smoothstep(25.0, 0.0, waterProx) * smoothstep(waterLevel - 5.0, waterLevel + 15.0, vElevation);

// Apply wetness
albedo *= mix(1.0, 0.65, wetness);       // darken
roughness = mix(roughness, 0.05, wetness); // make glossy
F0 = mix(F0, vec3(0.08), wetness);        // boost reflectance
```

**Why wetness**: Real terrain near water bodies is visibly darker and shinier due to moisture absorption. This visual cue helps students identify water proximity — an important geological observation skill.

#### Aerial Perspective Fog

```glsl
float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
vec3 nearFog = vec3(0.75, 0.82, 0.92);
vec3 farFog = vec3(0.6, 0.7, 0.85);
vec3 fogColor = mix(nearFog, farFog, smoothstep(500.0, 3000.0, vFogDepth));
color = mix(color, fogColor, fogFactor);
```

**Why exponential²**: Standard linear fog has a visible "wall". Exponential-squared fog (`e^(-(d·ρ)²)`) produces a physically motivated atmospheric extinction curve that increases gradually with distance.

---

## Atmospheric Scattering Shader

**File**: `src/engine/AtmosphereSystem.js`

### Sky Dome

```javascript
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(8000, 32, 32),
  new THREE.ShaderMaterial({ side: THREE.BackSide, ... })
);
```

### Fragment Shader — Physical Sky Model

```glsl
// Rayleigh scattering: blue at zenith, warm at horizon
vec3 zenithColor = vec3(0.15, 0.35, 0.85);
vec3 horizonColor = vec3(0.7, 0.8, 0.95);
vec3 skyBase = mix(horizonColor, zenithColor, pow(elevation, 0.5));

// Sunset tint near horizon
float sunsetFactor = smoothstep(0.3, 0.0, abs(elevation - 0.05));
skyBase = mix(skyBase, vec3(1.0, 0.5, 0.2), sunsetFactor * sunProximity * 0.5);

// Henyey-Greenstein Mie scattering (sun glow)
float g = 0.76;
float cosAngle = dot(viewDir, sunDir);
float mie = (1.0 - g*g) / pow(1.0 + g*g - 2.0*g*cosAngle, 1.5) / (4.0 * PI);
skyBase += sunColor * mie * 0.15;

// Sun disc: triple-layer for core, bloom, haze
float sunDist = length(viewDir - sunDir);
skyBase += vec3(1.0, 0.95, 0.8) * pow(max(0.0, 1.0 - sunDist*8.0), 512.0);  // hard core
skyBase += vec3(1.0, 0.9, 0.7) * pow(max(0.0, 1.0 - sunDist*4.0), 32.0);   // bloom
skyBase += vec3(0.9, 0.8, 0.6) * pow(max(0.0, 1.0 - sunDist*2.0), 6.0);    // haze

// FBM animated clouds
float cloudNoise = fbm(viewDir.xz * 2.0 + time * 0.01, 5);
float clouds = smoothstep(0.3, 0.7, cloudNoise) * smoothstep(0.0, 0.3, elevation);
skyBase = mix(skyBase, vec3(1.0), clouds * 0.6);
```

**Why Henyey-Greenstein**: It is the standard analytical phase function for Mie scattering, parameterised by a single asymmetry factor `g` (0 = isotropic, 1 = fully forward). At g=0.76, the forward-scattering lobe produces a natural sun halo.

### In-Shader Value Noise (Hash-Based)

```glsl
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);  // smoothstep
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
```

**Why used**: The sky shader needs procedural noise for clouds and haze but cannot access the CPU-side simplex noise. This compact hash-based value noise runs entirely on the GPU.

### Sun Sphere & Glow Orb

In addition to the painted sun disc in the sky shader, a 3D sun orb is placed in the scene for parallax-correct sun positioning:

```javascript
// Emissive sun sphere
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(120, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xfffaea, fog: false })
);
sunMesh.position.copy(sunDir).multiplyScalar(6000);

// BackSide glow halo (inverse rim shader)
const glowMesh = new THREE.Mesh(
  new THREE.SphereGeometry(300, 32, 32),
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    // Fragment: alpha = pow(1.0 - dot(viewDir, normal), 2.0) * 0.7
  })
);
```

**Why a 3D orb?** The sky dome's painted sun disc works well for broad atmospheric glow, but it does not respond to camera parallax — it remains fixed on the sky sphere regardless of camera position. A 3D `MeshBasicMaterial` sphere at 6000 units along `sunDir` provides a consistent, bright point that aligns perfectly with the directional light source. The sun direction `(0.75, 0.4, 0.45)` normalized places the sun at approximately 25° elevation, offset to the right-front of the scene — low enough to be clearly visible from the default camera orbit while producing dramatic side-lighting with long shadows. The BackSide glow sphere creates a soft halo around the sun using an inverse-rim shader (`pow(1.0 - NdotV, 2.0) * 0.7`), simulating atmospheric light bloom without post-processing.

Both meshes are parented to the sky dome group and returned in the atmosphere object (`{ mesh, material, sunMesh, glowMesh }`).

---


## Water Shaders (Ocean, Lakes, River)

**File**: `src/engine/WaterSystem.js`

### Unified Water Shading Philosophy

All three water bodies (ocean, lakes, river) share the same high-quality fragment shading pipeline. Each has its own complete standalone vertex and fragment shader — no string replacement or shader patching. The shared quality features are:

- **Fresnel-Schlick** (F0=0.04, pow 4) — physically based view-dependent reflectivity
- **Quad sun specular** (2048+512+64+12 power) — tight core, bloom, wide glow, ultra-wide haze
- **Sun-path shimmer** — broad luminous streak (pow 8)
- **Sparkle / sun glitter** — noise-based micro-facet glints (`pow(vnoise, 8) * pow(NdH, 8) * 6.0`)
- **fbm3 micro-ripple** normal perturbation (3-octave FBM at scale 0.12)
- **Forward + back subsurface scattering** (forward: `pow(dot(V,-L), 3) * 0.35`, back: `pow(dot(N,L), 2) * 0.12`)
- **3-octave caustic shimmer** (scales 0.03, 0.08, 0.18)
- **Horizon-colour reflection blending** at grazing angles (`pow(1-R.y, 3) * 0.5`)
- **Sun-lit diffuse** (`max(dot(N,L), 0) * 0.22`)
- **Fog with horizon-haze blending** (exponential² density)

### Gerstner Wave (Ocean Vertex Shader)

```glsl
vec3 gerstner(vec3 p, float t, vec2 dir, float freq, float amp, float steep) {
  float phase = dot(dir, p.xz) * freq + t;
  float s = sin(phase), c = cos(phase);
  return vec3(steep * amp * dir.x * c, amp * s, steep * amp * dir.y * c);
}

// 8 wave components with distance-based amplitude fade
float waveFade = smoothstep(8000.0, 2000.0, distFromCentre);
vec3 w1 = gerstner(pos, t*0.8,  normalize(vec2(1,0.3)),   0.012, 0.70, 0.65) * waveFade;
vec3 w2 = gerstner(pos, t*0.6,  normalize(vec2(-0.3,1)),  0.018, 0.50, 0.55) * waveFade;
// ... w3-w8 with increasing frequency, decreasing amplitude
vec3 w8 = gerstner(pos, t*2.0,  normalize(vec2(-0.6,0.8)),0.16,  0.018, 0.18) * waveFade;
```

The ocean uses a 400×400 vertex grid on a **20 000 m × 20 000 m plane** (10× terrain size). Wave amplitude is attenuated at distance via `smoothstep(8000, 2000, distFromCentre)`.

**Why 8 waves**: Six Gerstner components produced recognisable periodicity at mid-range. Adding two high-frequency waves (w7: freq 0.12, amp 0.03; w8: freq 0.16, amp 0.018) breaks up the repeating pattern and adds fine-scale surface chop.

**Why Gerstner**: Gerstner waves model the circular orbital motion of water particles, producing the realistic trochoid wave profile (sharp crest, flat trough) that characterises real ocean waves.

### Shore Waves

```glsl
// Island coastline ≈ 750–950 from centre
float shoreProx = 1.0 - smoothstep(650.0, 1050.0, distXZ);
vec2 toShore = normalize(pos.xz);

// 3 overlapping inward-moving breaking wave components
float shoalPhase1 = dot(toShore, pos.xz) * 0.025 - t * 1.6;
float shoalPhase2 = dot(toShore, pos.xz) * 0.040 - t * 2.2;
float shoalPhase3 = dot(toShore, pos.xz) * 0.018 - t * 1.0;
float shoreWave = sin(shoalPhase1)*0.45 + sin(shoalPhase2)*0.25 + sin(shoalPhase3)*0.60;

// Noise-randomised timing
float shoreNoise = sin(dot(toShore, vec2(127.1,311.7))*3.0 + t*0.3)*0.5 + 0.5;
pos.y += shoreWave * shoreProx * waveFade * 0.6 * (0.5 + shoreNoise * 0.5);
```

**Why shore waves**: Without them, the ocean near the island appeared static and unrealistic. The 3 overlapping components at different frequencies create irregular, natural-looking surf. `shoreProx` confines shore waves to a doughnut-shaped zone around the coastline, and `shoreNoise` ensures breakers don't all arrive simultaneously.

### Ocean Fresnel Reflection

```glsl
float fresnel = 0.04 + 0.96 * pow(1.0 - cosTheta, 4.0);

vec3 R = reflect(-V, N);
vec3 skyRefl = mix(uSkyColor * 0.9, uSkyColor * 1.5, max(R.y, 0.0));
float horizonBlend = pow(1.0 - max(R.y, 0.0), 3.0);
vec3 reflColor = mix(skyRefl, uHorizonColor * 1.15, horizonBlend * 0.5);
```

**Horizon colour blending**: The `uHorizonColor` uniform matches the atmospheric sky dome's horizon band. At grazing angles, reflections transition to the warm horizon hue, reproducing real atmospheric haze reflections.

### Quad Specular Highlights

```glsl
vec3 H = normalize(L + V);
float NdH = max(dot(N, H), 0.0);
float spec1 = pow(NdH, 2048.0) * 8.0;   // tight bright core
float spec2 = pow(NdH, 512.0) * 2.5;    // bloom
float spec3 = pow(NdH, 64.0) * 0.5;     // wide glow
float spec4 = pow(NdH, 12.0) * 0.12;    // ultra-wide haze
```

**Why quad specular**: Triple specular (1024+256+48) lacked the bright central pinpoint and the ultra-wide atmospheric haze. The 2048-power core creates a tiny hard highlight visible at long range, while the 12-power ultra-wide haze provides atmospheric sun glow. Together the four terms reproduce multi-scale sun reflection on real water.

### Lake Shaders (Standalone)

Lake shaders are complete standalone GLSL (`lakeVertShader`, `lakeFragShader`) — not derived from the ocean shader via string patching.

```glsl
// Lake vertex: 8 Gerstner waves scaled to unit-circle geometry
vec3 allWaves(vec3 p, float t) {
  return gerstner(p,t*0.8,normalize(vec2(1,0.3)),3.0,0.012,0.65)
       + gerstner(p,t*0.6,normalize(vec2(-0.3,1)),4.5,0.009,0.55)
       // ... 8 waves total with lake-appropriate frequencies (3.0–40.0)
       + gerstner(p,t*2.0,normalize(vec2(-0.6,0.8)),40.0,0.0003,0.18);
}
```

Lake geometry uses `CircleGeometry(1, 128)` (up from 96 segments) for smoother shoreline silhouettes. Normals are computed via finite differences of the `allWaves()` helper.

**Lake-specific fragment features**:
- Centre-depth darkening: `mix(waterBody, vec3(0.02, 0.10, 0.22), (1.0 - edgeDist) * 0.3)`
- Alpha 0.88 (ocean uses 0.85 modulated by `uSubmerged`)
- No distance-fading of sparkle/caustics (lakes are always close-up)

**Why standalone shaders**: The previous approach used `waterFrag.replace()` to patch the ocean fragment shader for lake use. This was fragile — missing varying declarations, broken uniform references. Clean standalone shaders are reliable, readable, and maintainable.

### Lake Water Level

Lake water surfaces are placed at `minRimElevation + 1.8 m`. Combined with deeper basin carving (16–24 m), this ensures lakes appear convincingly full.

### River Shaders (Standalone)

River shaders are also complete standalone GLSL (`riverVertShader`, `riverFragShader`).

```glsl
// River vertex: 5-frequency downstream flow waves
float flowBias = uv.y * 6.0 - t * 2.0;
pos.y += sin(flowBias) * 0.15
       + sin(uv.y * 10.0 - t * 2.8 + uv.x * 3.0) * 0.08
       + sin(uv.y * 16.0 - t * 3.5 + uv.x * 5.0) * 0.04
       + sin(uv.y * 25.0 - t * 4.5) * 0.02
       + sin(uv.y * 40.0 - t * 6.0 + uv.x * 8.0) * 0.01;
```

Normals are computed via finite differences of the flow-wave field in UV space.

**River-specific fragment features**:
- **Edge-to-centre depth gradient**: `mix(uShallowColor, uDeepColor, edgeFade * 0.6 + depthFactor * 0.2)`
- **Flow-aligned caustics**: UV.y-scrolling caustic noise simulating light patterns moving downstream
- **Edge foam**: `vnoise(vec2(vRiverUV.x*10, vRiverUV.y*20 - uTime*1.2)) * edgeProx` — foam near banks
- Alpha 0.88

**Why 5-frequency flow waves**: Frequencies from 6 to 40 with decreasing amplitudes (0.15 → 0.01) break up visible repetition at every viewing distance.

**Why flow-aware normals**: Finite-difference normals from UV-space neighbours produce accurate normals for the displaced surface, enabling correct specular reflections that shift with the flow.

**Why UV-based flow**: The river's V-coordinate naturally increases along its length. Scrolling the wave function along V creates the visual impression of water flowing downstream.

## SSAO Post-Processing

**File**: `src/engine/PostProcessing.js`

### Pipeline Architecture

```
Frame N:
  1. Render scene → colorTarget (with depthTexture)
  2. SSAO composite pass:
     - Read depthTexture → linearise depth
     - 12-tap rotated kernel sampling
     - Output: composited colour × AO to screen
```

### Kernel Generation (Golden Angle)

```javascript
const kernelSize = 12;
for (let i = 0; i < kernelSize; i++) {
  const angle = i * 2.39996323;  // golden angle in radians
  const r = Math.sqrt((i + 0.5) / kernelSize);  // square root distribution
  kernelOffsets.push(Math.cos(angle) * r, Math.sin(angle) * r);
}
```

**Why golden angle**: Distributing samples at the golden angle (137.5°) produces an approximately uniform distribution that avoids the visible banding of regular angular spacing and the clustering of purely random distributions. `sqrt(i/N)` distribution ensures equal area per sample (disk, not ring).

### SSAO Fragment Shader

```glsl
// Linearise depth
float linearDepth(float d) {
  return cameraNear * cameraFar / (cameraFar - d * (cameraFar - cameraNear));
}

void main() {
  float depth = linearDepth(texture2D(tDepth, vUv).r);

  // Adaptive radius: larger at close range, smaller at distance
  float radius = ssaoRadius / depth;

  // Per-pixel kernel rotation (hash-based)
  float rotAngle = hash(vUv * resolution) * 6.2832;
  float cosR = cos(rotAngle), sinR = sin(rotAngle);

  float occlusion = 0.0;
  for (int i = 0; i < 12; i++) {
    // Rotate kernel offset
    vec2 offset = vec2(
      kernel[i*2] * cosR - kernel[i*2+1] * sinR,
      kernel[i*2] * sinR + kernel[i*2+1] * cosR
    ) * radius;

    float sampleDepth = linearDepth(texture2D(tDepth, vUv + offset).r);
    float diff = depth - sampleDepth;

    // Range check: reject samples with large depth difference (prevents halos)
    float rangeCheck = smoothstep(0.0, 1.0, ssaoRadius / abs(diff));
    occlusion += step(0.01, diff) * rangeCheck;
  }

  float ao = 1.0 - (occlusion / 12.0);
  ao = 0.5 + 0.5 * ao;  // soften: blend with 50% white

  vec3 color = texture2D(tColor, vUv).rgb * ao;
  gl_FragColor = vec4(color, 1.0);
}
```

**Why 12 samples**: Full-quality SSAO uses 32-64 samples. At 12 samples with golden-angle distribution and per-pixel rotation, the visual quality is sufficient for this application while keeping the fragment shader cost low enough for integrated GPUs.

**Why `0.5 + 0.5 * ao`**: Prevents SSAO from making the scene too dark. The half-blending ensures that even fully occluded areas (ao=0) still contribute 50% brightness, which is visually appropriate for an outdoor scene with strong ambient light.

---

## Spline & Interpolation Algorithms

**File**: `src/engine/TerrainGenerator.js`

### Catmull-Rom Cubic Interpolation

```javascript
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2*p0 - 5*p1 + 4*p2 - p3) * t2 +
    (-p0 + 3*p1 - 3*p2 + p3) * t3
  );
}
```

**Why Catmull-Rom**: Unlike Bézier splines, Catmull-Rom splines pass exactly through their control points (interpolatory property), making them ideal for river paths where control points represent specific geographic coordinates that the river must pass through. The tangent at each point is automatically derived from adjacent points, eliminating manual tangent specification.

### River Path Subdivision

```javascript
function subdivideRiverPath(points, subsPerSegment = 8) {
  const result = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    for (let s = 0; s < subsPerSegment; s++) {
      const t = s / subsPerSegment;
      result.push([
        catmullRom(p0[0], p1[0], p2[0], p3[0], t),
        catmullRom(p0[1], p1[1], p2[1], p3[1], t)
      ]);
    }
  }
  result.push(points[points.length - 1]);
  return result;  // 11 points → 81 dense points
}
```

**Why 8 subdivisions per segment**: With 10 segments (11 points), this produces 81 points spaced approximately 7 m apart (on a typical segment length of ~60 m). This density ensures that:
1. Terrain carving has no gaps between carved sections.
2. The water ribbon mesh follows curves smoothly.
3. Vegetation exclusion accurately traces the full river corridor.

### Hermite Smoothstep

```javascript
const t = x * x * (3 - 2 * x);  // Hermite smoothstep: 3t² - 2t³
```

**Where used**: Farm flattening, layer blending, river carving blend zones, lake bowl carving, terrain wetness, fog blending.

**Why used**: Hermite smoothstep maps [0, 1] → [0, 1] with zero first derivative at both endpoints (C¹ continuous). This prevents visible creases at transition boundaries. The GLSL builtin `smoothstep(edge0, edge1, x)` uses this formula internally.

---

## Vegetation System & Instanced Rendering

**File**: `src/engine/VegetationSystem.js`

### InstancedMesh Pattern

```javascript
// Create geometry once (shared by all instances)
const trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 12, 6);
const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, COUNT);

// Set per-instance transform
const dummy = new THREE.Object3D();
for (let i = 0; i < COUNT; i++) {
  dummy.position.set(x, y, z);
  dummy.rotation.y = Math.random() * Math.PI * 2;
  dummy.scale.setScalar(0.8 + Math.random() * 0.4);
  dummy.updateMatrix();
  trunkMesh.setMatrixAt(i, dummy.matrix);
  trunkMesh.setColorAt(i, color.clone().offsetHSL(0, 0, (Math.random()-0.5)*0.1));
}
trunkMesh.instanceMatrix.needsUpdate = true;
trunkMesh.instanceColor.needsUpdate = true;
```

**Why InstancedMesh**: Renders up to N identical geometries in a single draw call. The GPU multiplies each vertex by the per-instance matrix automatically. This reduces draw calls from ~18,000 (one per vegetation object) to ~15 (one per vegetation type), enabling integrated GPU compatibility.

### Placement Filter Pipeline

```javascript
function canPlace(x, z, heightMap, noise, type) {
  // 1. Bounds check
  if (Math.abs(x) > halfSize - 50 || Math.abs(z) > halfSize - 50) return false;

  // 2. Water exclusion
  if (isInLake(x, z)) return false;
  if (isInRiver(x, z, denseRiverPath)) return false;

  // 3. Farm exclusion
  if (isInFarm(x, z)) return false;

  // 4. Slope check
  const slope = getSlope(heightMap, x, z);
  if (slope > type.maxSlope) return false;

  // 5. Geological density
  const layer = getLayerAtElevation(getTerrainHeight(heightMap, x, z));
  if (Math.random() > layer.vegetationDensity * type.densityMult) return false;

  // 6. Noise clustering
  if (noise(x * type.clusterFreq, z * type.clusterFreq) < type.clusterThreshold) return false;

  return true;
}
```

### Slope Calculation (Central Difference)

```javascript
function getSlope(heightMap, x, z) {
  const d = 4;  // sample distance (metres)
  const hL = getTerrainHeight(heightMap, x - d, z);
  const hR = getTerrainHeight(heightMap, x + d, z);
  const hU = getTerrainHeight(heightMap, x, z - d);
  const hD = getTerrainHeight(heightMap, x, z + d);
  const dx = (hR - hL) / (2 * d);
  const dz = (hD - hU) / (2 * d);
  return Math.sqrt(dx * dx + dz * dz);
}
```

**Why central difference**: Forward differences are biased; central differences give a more accurate gradient estimate. The 4 m sample distance smooths over single-vertex noise while remaining responsive to real terrain features.

### River Exclusion (Segment Distance)

```javascript
function isInRiver(x, z, densePath) {
  const halfWidth = 15;  // river half-width
  for (let i = 0; i < densePath.length - 1; i++) {
    const ax = densePath[i][0], az = densePath[i][1];
    const bx = densePath[i+1][0], bz = densePath[i+1][1];

    // Point-to-segment distance
    const abx = bx - ax, abz = bz - az;
    const apx = x - ax, apz = z - az;
    const t = Math.max(0, Math.min(1, (apx*abx + apz*abz) / (abx*abx + abz*abz)));
    const cx = ax + t * abx, cz = az + t * abz;
    const dist = Math.sqrt((x-cx)*(x-cx) + (z-cz)*(z-cz));

    if (dist < halfWidth) return true;
  }
  return false;
}
```

**Why segment distance**: Point distance (checking only control points) misses the space between points. Segment distance checks the closest point on each line segment, accurately covering the full river corridor. With 80 segments (~7 m each), coverage is effectively continuous.

### Geometry Merge Utility

```javascript
function mergeBufferGeometries(geometries) {
  let totalVerts = 0, totalIdx = 0;
  for (const g of geometries) {
    totalVerts += g.attributes.position.count;
    totalIdx += g.index ? g.index.count : 0;
  }

  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const indices = new Uint32Array(totalIdx);

  let vertOffset = 0, idxOffset = 0, vertCount = 0;
  for (const g of geometries) {
    positions.set(g.attributes.position.array, vertOffset * 3);
    normals.set(g.attributes.normal.array, vertOffset * 3);
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) {
        indices[idxOffset + i] = g.index.array[i] + vertCount;
      }
      idxOffset += g.index.count;
    }
    vertCount = vertOffset += g.attributes.position.count;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  return merged;
}
```

**Where used**: Pine tree crowns (3 merged cone geometries), oak tree crowns (4 merged sphere geometries), farm building components.

**Why used**: Multiple simple geometries are combined into one before creating InstancedMesh, reducing the number of InstancedMesh objects (and therefore draw calls) needed.

---

## Tool Implementation Details

**File**: `src/tools/ToolManager.js`

### Drill Core — Vertical Borehole Sampling

```javascript
function handleDrill(engine, x, z, store) {
  const surfaceH = engine.getTerrainHeightAt(x, z);
  const layers = [];
  let prevLayer = null;

  // Sample every 0.5 m from surface to elevation 0
  for (let depth = 0; depth <= surfaceH; depth += 0.5) {
    const elevation = surfaceH - depth;
    const layer = engine.getLayerAt(x, z, elevation);

    if (!prevLayer || layer.name !== prevLayer.name) {
      if (prevLayer) prevLayer.toDepth = depth;
      layers.push({
        layer,
        fromDepth: depth,
        toDepth: depth + 0.5,
        elevation
      });
      prevLayer = layers[layers.length - 1];
    } else {
      prevLayer.toDepth = depth + 0.5;
    }
  }

  store.getState().setDrillResult({ x, z, surfaceH, layers });
  engine.addDrillMarker(x, surfaceH, z);
}
```

**Why 0.5 m step**: Smaller steps increase computation but ensure thin layers (minimum 6 m blend zone) are not missed. At 0.5 m, even the thinnest layer will produce at least 12 samples, guaranteeing detection.

### Strike & Dip — Bedding Orientation

```javascript
function handleStrikeDip(engine, x, z, store) {
  const bedding = engine.getBeddingAt(x, z);
  // getBeddingAt uses central-difference gradient of perturbation:
  //   dPdx = (perturbation(x+d, z) - perturbation(x-d, z)) / (2*d)
  //   dPdz = (perturbation(x, z+d) - perturbation(x, z-d)) / (2*d)

  // Dip angle: angle between bedding surface and horizontal
  const dipAngle = Math.atan(Math.sqrt(dPdx*dPdx + dPdz*dPdz)) * (180/Math.PI);

  // Dip direction: azimuth of steepest descent
  const dipDirection = (Math.atan2(dPdx, dPdz) * (180/Math.PI) + 360) % 360;

  // Strike: 90° counterclockwise from dip direction (right-hand rule)
  const strike = (dipDirection - 90 + 360) % 360;

  store.getState().addStrikeDipResult({ x, z, strike, dipAngle, dipDirection });
  engine.addStrikeDipMarker(x, surfaceH, z, strike, dipAngle, dipDirection);
}
```

**Why central-difference gradient**: The bedding perturbation function is a sum of sin() and noise() — its gradient could be computed analytically, but central differences provide a unified approach that also accounts for fault offset and any future deformation additions without requiring per-function derivative code.

### Cross-Section — Subsurface Profile

```javascript
function sampleCrossSection(engine, x1, z1, x2, z2) {
  const SAMPLES = 200;
  const profile = [];

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const x = x1 + (x2 - x1) * t;
    const z = z1 + (z2 - z1) * t;
    const surfaceH = engine.getTerrainHeightAt(x, z);

    // Trace all layer boundaries below surface
    const layerBoundaries = [];
    for (let elev = surfaceH; elev >= 0; elev -= 0.5) {
      const layer = engine.getLayerAt(x, z, elev);
      if (!layerBoundaries.length || layer.name !== layerBoundaries.at(-1).layer.name) {
        layerBoundaries.push({ elevation: elev, layer });
      }
    }

    profile.push({
      distance: t * totalDistance,
      surfaceElevation: surfaceH,
      layers: layerBoundaries
    });
  }
  return profile;
}
```

**Why 200 samples**: The cross-section panel canvas is 720 px wide. At 200 samples (~3.6 px per sample), the layer boundaries appear smooth without visible stepping. More samples would not improve visual quality but would increase computation time.

---

## 3D Marker Construction & Animation

**File**: `src/engine/SceneManager.js`

### Drill Marker Components

```javascript
// Ground ring (pulsing)
const ringGeo = new THREE.TorusGeometry(7, 0.4, 8, 32);
// Inner glow disc
const glowGeo = new THREE.CircleGeometry(5, 32);
// Metallic shaft
const shaftGeo = new THREE.CylinderGeometry(0.6, 0.6, 18, 12);
// Rotating collar
const collarGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 8);
// Drill bit cone
const bitGeo = new THREE.ConeGeometry(0.8, 3, 8);
// Top beacon sphere
const beaconGeo = new THREE.SphereGeometry(0.8, 12, 12);
// Tripod legs (3×)
const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 14, 6);
// Positioned at ±120° angles, leaning outward
```

### Animation Loop

```javascript
_animateMarkers(time) {
  // Drill: ring pulse scale, collar rotation, beacon emissive
  this.drillMarkers.forEach(m => {
    m.ring.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    m.collar.rotation.y = time * 1.5;
    m.beacon.material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.3;
  });

  // Measure: ring pulse, sphere emissive cycle
  this.measureMarkers.forEach(m => {
    m.ring.scale.setScalar(0.9 + Math.sin(time * 2.5) * 0.15);
    m.sphere.material.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.3;
  });

  // Cross-section: beacon emissive, ring scale, pillar opacity
  this.crossSectionMarkers.forEach(m => {
    m.beacon.material.emissiveIntensity = 0.5 + Math.sin(time * 2.5) * 0.3;
    m.ring.scale.setScalar(0.95 + Math.sin(time * 2) * 0.08);
    m.pillar.material.opacity = 0.12 + Math.sin(time * 1.5) * 0.04;
  });

  // Strike-dip: disc opacity, centre sphere emissive
  this.strikeDipMarkers.forEach(m => {
    m.disc.material.opacity = 0.3 + Math.sin(time * 1.5) * 0.1;
    m.centre.material.emissiveIntensity = 0.4 + Math.sin(time * 2.5) * 0.3;
  });
}
```

**Why animated markers**: Static markers blend into complex terrain. Subtle animation (pulsing, rotating, glowing) draws the eye to marker locations without being distracting, making it easy for students to locate their measurement points.

---

## State Management Architecture

**File**: `src/store/useStore.js`

### Zustand Store Structure

```javascript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useStore = create(subscribeWithSelector((set, get) => ({
  // Tool state
  activeTool: 'navigate',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Panel state
  activePanel: null,
  panelPinned: false,
  setActivePanel: (panel) => set({ activePanel: panel }),
  setPanelPinned: (pinned) => set({ panelPinned: pinned }),

  // Geological layers (mutable for layer manager)
  layers: [...GEOLOGY_LAYERS],
  reorderLayer: (from, to) => set(state => {
    const layers = [...state.layers];
    const [moved] = layers.splice(from, 1);
    layers.splice(to, 0, moved);
    return { layers };
  }),
  addLayer: (layer) => set(state => ({ layers: [...state.layers, layer] })),
  removeLayer: (index) => set(state => ({
    layers: state.layers.filter((_, i) => i !== index)
  })),

  // Tool results
  hoverInfo: null,
  rockPopup: null,
  drillResult: null,
  measureResult: null,
  strikeDipResults: [],
  crossSection: null,

  // Settings
  settings: { waterLevel: 38, fogDensity: 0.0012, sunElevation: 45 },
  updateSetting: (key, value) => set(state => ({
    settings: { ...state.settings, [key]: value }
  })),

  // Loading state
  loading: true,
  loadingProgress: 0,
  loadingMessage: 'Initialising...',
})));
```

**Why `subscribeWithSelector`**: This middleware allows the Three.js engine (non-React code) to subscribe to specific store slices:

```javascript
// In useSceneEngine.js — engine subscribes to tool changes
useStore.subscribe(
  (state) => state.activeTool,
  (tool) => engine.setActiveTool(tool)
);

// Engine subscribes to settings changes
useStore.subscribe(
  (state) => state.settings,
  (settings) => {
    engine.updateWaterLevel(settings.waterLevel);
    engine.updateFogDensity(settings.fogDensity);
    engine.updateSunElevation(settings.sunElevation);
  }
);
```

This pattern avoids React re-renders when the engine merely needs to respond to state changes.

---

## React Component Patterns

### Scene Engine Lifecycle Hook

**File**: `src/hooks/useSceneEngine.js`

```javascript
export function useSceneEngine(containerRef) {
  const engineRef = useRef(null);

  useEffect(() => {
    const engine = new SceneManager();
    engineRef.current = engine;

    engine.init(containerRef.current, {
      onProgress: (pct, msg) => {
        useStore.getState().setLoadingProgress(pct);
        useStore.getState().setLoadingMessage(msg);
      }
    }).then(() => {
      useStore.getState().setLoading(false);
    });

    // Subscribe engine to store changes
    const unsubs = [
      useStore.subscribe(s => s.activeTool, tool => engine.setActiveTool(tool)),
      useStore.subscribe(s => s.settings, settings => { ... }),
    ];

    // Throttled hover handler
    let lastHover = 0;
    engine.onHover = (info) => {
      const now = performance.now();
      if (now - lastHover < 33) return;  // ~30 fps
      lastHover = now;
      useStore.getState().setHoverInfo(info);
    };

    // Click handler → tool dispatch
    engine.onClick = (info) => {
      const tool = useStore.getState().activeTool;
      ToolManager.dispatch(tool, engine, info, useStore);
    };

    return () => {
      unsubs.forEach(u => u());
      engine.dispose();
    };
  }, []);

  return engineRef;
}
```

**Why `useRef` not `useState`**: The engine is a mutable object with its own lifecycle. Storing it in `useState` would trigger re-renders on every engine property change. `useRef` holds the engine outside React's render cycle.

### Panel Pin/Unpin with Click-Away

**File**: `src/components/Panel.jsx`

```javascript
function Panel({ children }) {
  const { activePanel, panelPinned, setPanelPinned, setActivePanel } = useStore();

  useEffect(() => {
    if (!activePanel || panelPinned) return;

    const handleClick = (e) => {
      if (!panelRef.current?.contains(e.target) && !sidebarContains(e.target)) {
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [activePanel, panelPinned]);

  // ...
}
```

### Canvas-Drawn HUD Scale Bar

**File**: `src/components/HUD.jsx`

```javascript
function HUD({ engineRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let rafId;
    const draw = () => {
      const engine = engineRef.current;
      if (!engine) { rafId = requestAnimationFrame(draw); return; }

      const camera = engine.getCameraPosition();
      const dist = camera.distanceTo(engine.getControlsTarget());
      const { value, label } = niceScaleValue(dist);

      // Draw scale bar directly on canvas — bypasses React
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      // ... draw scale bar lines and label
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);
}
```

**Why canvas + rAF**: The scale bar must update every frame (camera might be orbiting). Using React state would cause re-renders at 60 fps. Drawing directly on a canvas element via `requestAnimationFrame` achieves 60 fps updates with zero React overhead.

---

## Performance Techniques

### Summary Table

| Technique | Location | Impact |
|---|---|---|
| InstancedMesh | VegetationSystem.js | Draw calls: ~18,000 → ~15 |
| Throttled hover (30 fps) | useSceneEngine.js | Prevents React re-render thrashing |
| rAF-driven HUD | HUD.jsx | Scale bar updates bypass React |
| 12-tap SSAO | PostProcessing.js | Reduced fragment cost vs 32-64 taps |
| Golden-angle kernel | PostProcessing.js | Better quality per sample than random |
| Distance LOD texturing | TerrainShader.js | Macro texture blend reduces mipmap aliasing |
| `pow(4)` tri-planar weights | TerrainShader.js | Fewer blend pixels per triangle |
| Procedural textures | TextureFactory.js | No network loads; instant generation |
| Single atlas texture | TextureFactory.js | 1 bind per pass vs 6 per layer |
| Hermite smoothstep | Multiple files | C¹ blends avoid derivative discontinuities |
| Bilinear interpolation | TerrainGenerator.js | Smooth height queries from discrete grid |
| `useRef` for engine | useSceneEngine.js | Engine mutations don't trigger renders |
| `subscribeWithSelector` | useStore.js | Targeted engine subscriptions |
| Pixel ratio cap (2×) | SceneManager.js | Limits fill rate on HiDPI screens |
| Standard GLSL only | All shaders | Universal GPU compatibility |

---

## Constants & Configuration Values

### Terrain

| Constant | Value | File | Purpose |
|---|---|---|---|
| `TERRAIN_SIZE` | 2000 | geology.js | World extent (2 km) |
| `SEGMENTS` | 384 | geology.js | Heightmap grid resolution |
| `WATER_LEVEL` | 38 | geology.js | Global ocean height (m) |
| Base floor | 80 m | TerrainGenerator.js | Continental base elevation |
| Min height clamp | 18 m | TerrainGenerator.js | Absolute minimum terrain height |
| Erosion iterations | 38,000 | SceneManager.js | Total particle drops |
| Erosion radius | 3 cells | ErosionSimulator.js | Erosion brush size |

### River

| Constant | Value | Purpose |
|---|---|---|
| Control points | 11 | Path definition |
| Dense points | 81 | After Catmull-Rom subdivision |
| Width | 30 m | Channel width |
| Carving depth | 16 m | Parabolic channel depth |
| Base subtraction | 12 m | Additional floor lowering |
| Blend zone | 3.5× half-width | Hermite blending extent |

### Lakes

| Lake | Position (X, Z) | Radii (RX, RZ) | Depth (m) |
|---|---|---|---|
| Mirror Lake | (-200, 300) | (70, 50) | 24 |
| Crystal Pond | (350, -250) | (45, 35) | 22 |
| Emerald Tarn | (-450, -100) | (55, 65) | 18 |
| Sapphire Lake | (100, 500) | (80, 55) | 20 |
| Hidden Pool | (-300, -400) | (35, 40) | 16 |

Lake water surfaces sit at `minRimElevation + 1.8 m`, where `minRimElevation` is the lowest of 32 samples around the lake periphery. This ensures water fills the basin convincingly to near the pour-point.

### Farm Compound

| Constant | Value |
|---|---|
| Centre X | 380 |
| Centre Z | 320 |
| Radius | 160 m |
| Target elevation | 95 m |
| Rotation angle | π × 0.15 |
| Buildings | 6 (farmhouse, 2 cottages, barn, workshop, storage) |
| Silos | 2 with domes |
| Crop fields | 4 with row cultivation |
| Fence segments | 40 perimeter |

### Rendering

| Constant | Value | File |
|---|---|---|
| Camera FOV | 55° | SceneManager.js |
| Camera near/far | 1 / 25,000 | SceneManager.js |
| Shadow map size | 2048² | SceneManager.js |
| Shadow frustum | ±1400, far 4000 | SceneManager.js |
| Sun light intensity | 1.6 | SceneManager.js |
| Hemisphere intensity | 0.55 | SceneManager.js |
| Rim light intensity | 0.25 | SceneManager.js |
| Sun direction | `(0.75, 0.4, 0.45)` normalized (~25° elev.) | SceneManager.js |
| Sun position | `_sunDir × 1500` | SceneManager.js |
| Sun orb radius | 120 (sphere) + 300 (glow) | AtmosphereSystem.js |
| Sun orb distance | 6000 along `_sunDir` | AtmosphereSystem.js |
| Ocean grid | 400 × 400 | WaterSystem.js |
| Ocean plane size | 20,000 m (10× terrain) | WaterSystem.js |
| Lake segments | 96 | WaterSystem.js |
| Tone mapping | ACESFilmic | SceneManager.js |
| Exposure | 1.15 | SceneManager.js |
| Max orbit distance | 4,000 | SceneManager.js |
| Max polar angle | 0.48π | SceneManager.js |
| Damping factor | 0.18 | SceneManager.js |
| Fog type | Exp² | SceneManager.js |
| SSAO kernel size | 12 | PostProcessing.js |
| SSAO blend | 50% white | PostProcessing.js |
| Texture tile size | 1024 px | TextureFactory.js |
| Atlas dimensions | 6144×1024 | TextureFactory.js |
| Layer blend zone | 6 m | TerrainGenerator.js |
| Hover throttle | ~33 ms (30 fps) | useSceneEngine.js |

### Vegetation Counts

| Type | Count |
|---|---|
| Pine trees | 600 |
| Oak trees | 450 |
| Birch trees | 250 |
| Bushes | 2,500 |
| Rocks | 500 |
| Grass blade tufts | 9,000 |
| Alpine shrubs | 500 |
| Wildflowers (mountain) | 400 |
| Mountain grass | 800 |
| Riparian grass | 600 |
| Riparian wildflowers | 500 |
| Reeds | 300 |
| Riparian shrubs | 300 |
| **Total** | **~16,200** |

### Noise Seeds

| Seed | Variable | Usage |
|---|---|---|
| 42 | `noise` | Primary terrain, vegetation clustering |
| 137 | `noiseB` | Secondary terrain details, mountain belts |

---

*This document covers every algorithm, shader, code pattern, and technical constant used in the Structural Geology Field Mapping Simulator. All code snippets are representative of the actual implementation and are annotated with their location, purpose, and the reasoning behind their selection.*
