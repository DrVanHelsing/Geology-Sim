// ================================================================
//  WATER SYSTEM â€” enhanced reflective water with Fresnel-Schlick,
//  animated Gerstner waves, depth fog, caustics hints,
//  environment-color-aware reflection, horizon-scale ocean,
//  and flowing river animation.
// ================================================================
import * as THREE from 'three';
import { TERRAIN_SIZE, WATER_LEVEL } from '../config/geology';

const waterVert = /* glsl */ `
  uniform float uTime;
  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vUV;
  varying float vDistFromCentre;

  /* Gerstner wave helper */
  vec3 gerstner(vec3 p, float t, vec2 dir, float freq, float amp, float steep) {
    float phase = dot(dir, p.xz) * freq + t;
    float s = sin(phase), c = cos(phase);
    return vec3(
      steep * amp * dir.x * c,
      amp * s,
      steep * amp * dir.y * c
    );
  }

  void main() {
    vec3 pos = position;
    float t = uTime;

    // Fade wave amplitude with distance from centre to avoid edge artifacts
    float distXZ = length(pos.xz);
    float waveFade = smoothstep(8000.0, 2000.0, distXZ);
    vDistFromCentre = distXZ;

    // â”€â”€ Shore wave zone â€” subtle waves hitting the island â”€â”€
    // Island coastline â‰ˆ 750â€“950 from centre; boost and shape waves there
    float shoreProx = 1.0 - smoothstep(650.0, 1050.0, distXZ); // 1 at coast, 0 far away
    float shoreDir = distXZ > 1.0 ? 1.0 : 0.0;
    vec2 toShore = distXZ > 1.0 ? normalize(pos.xz) : vec2(0.0);
    // Inward-moving breaking waves â€” several overlapping shore-break components
    float shoalPhase1 = dot(toShore, pos.xz) * 0.025 - t * 1.6;
    float shoalPhase2 = dot(toShore, pos.xz) * 0.040 - t * 2.2;
    float shoalPhase3 = dot(toShore, pos.xz) * 0.018 - t * 1.0;
    float shoreWave = sin(shoalPhase1) * 0.45 + sin(shoalPhase2) * 0.25 + sin(shoalPhase3) * 0.60;
    // Randomise with noise so breakers arrive at different times/places
    float shoreNoise = sin(dot(toShore, vec2(127.1, 311.7)) * 3.0 + t * 0.3) * 0.5 + 0.5;
    pos.y += shoreWave * shoreProx * waveFade * 0.6 * (0.5 + shoreNoise * 0.5);

    // 8 Gerstner waves for rich, detailed ocean surface with more visible motion
    vec3 w1 = gerstner(pos, t*0.8,  normalize(vec2(1.0, 0.3)),  0.012, 0.70, 0.65) * waveFade;
    vec3 w2 = gerstner(pos, t*0.6,  normalize(vec2(-0.3, 1.0)), 0.018, 0.50, 0.55) * waveFade;
    vec3 w3 = gerstner(pos, t*1.1,  normalize(vec2(0.7, 0.7)),  0.030, 0.30, 0.45) * waveFade;
    vec3 w4 = gerstner(pos, t*0.9,  normalize(vec2(-0.5,-0.8)), 0.042, 0.16, 0.38) * waveFade;
    vec3 w5 = gerstner(pos, t*1.3,  normalize(vec2(0.4, -0.6)), 0.060, 0.09, 0.32) * waveFade;
    vec3 w6 = gerstner(pos, t*1.5,  normalize(vec2(-0.8, 0.2)), 0.085, 0.05, 0.28) * waveFade;
    vec3 w7 = gerstner(pos, t*1.7,  normalize(vec2(0.9,-0.4)),  0.12,  0.03, 0.22) * waveFade;
    vec3 w8 = gerstner(pos, t*2.0,  normalize(vec2(-0.6, 0.8)), 0.16,  0.018, 0.18) * waveFade;
    pos += w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8;

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    vUV = pos.xz * 0.001;

    // Wave normal from finite differences
    float eps = 2.0;
    vec3 px = position + vec3(eps,0,0);
    vec3 pz = position + vec3(0,0,eps);
    px += (gerstner(px,t*0.8,normalize(vec2(1,0.3)),0.012,0.70,0.65)
        + gerstner(px,t*0.6,normalize(vec2(-0.3,1)),0.018,0.50,0.55)
        + gerstner(px,t*1.1,normalize(vec2(0.7,0.7)),0.030,0.30,0.45)
        + gerstner(px,t*0.9,normalize(vec2(-0.5,-0.8)),0.042,0.16,0.38)
        + gerstner(px,t*1.3,normalize(vec2(0.4,-0.6)),0.060,0.09,0.32)
        + gerstner(px,t*1.5,normalize(vec2(-0.8,0.2)),0.085,0.05,0.28)
        + gerstner(px,t*1.7,normalize(vec2(0.9,-0.4)),0.12,0.03,0.22)
        + gerstner(px,t*2.0,normalize(vec2(-0.6,0.8)),0.16,0.018,0.18)) * waveFade;
    pz += (gerstner(pz,t*0.8,normalize(vec2(1,0.3)),0.012,0.70,0.65)
        + gerstner(pz,t*0.6,normalize(vec2(-0.3,1)),0.018,0.50,0.55)
        + gerstner(pz,t*1.1,normalize(vec2(0.7,0.7)),0.030,0.30,0.45)
        + gerstner(pz,t*0.9,normalize(vec2(-0.5,-0.8)),0.042,0.16,0.38)
        + gerstner(pz,t*1.3,normalize(vec2(0.4,-0.6)),0.060,0.09,0.32)
        + gerstner(pz,t*1.5,normalize(vec2(-0.8,0.2)),0.085,0.05,0.28)
        + gerstner(pz,t*1.7,normalize(vec2(0.9,-0.4)),0.12,0.03,0.22)
        + gerstner(pz,t*2.0,normalize(vec2(-0.6,0.8)),0.16,0.018,0.18)) * waveFade;
    vec3 T = normalize(px - pos);
    vec3 B = normalize(pz - pos);
    vWorldNormal = normalize(cross(B, T));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFogDepth = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const waterFrag = /* glsl */ `
  uniform vec3  uSunDir;
  uniform vec3  uSkyColor;
  uniform vec3  uDeepColor;
  uniform vec3  uShallowColor;
  uniform vec3  uFogColor;
  uniform float uFogDensity;
  uniform float uSubmerged;
  uniform float uTime;
  uniform vec3  uHorizonColor;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vUV;
  varying float vDistFromCentre;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float vnoise(vec2 p) {
    vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm3(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * vnoise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);

    // â”€â”€ Micro-ripple normal perturbation for close-up detail â”€â”€
    float rippleFade = smoothstep(4000.0, 400.0, vDistFromCentre);
    float rScale = 0.12;
    vec2 rUV = vWorldPos.xz * rScale + uTime * vec2(0.12, 0.08);
    float rH  = fbm3(rUV);
    float rHx = fbm3(rUV + vec2(0.5, 0.0));
    float rHz = fbm3(rUV + vec2(0.0, 0.5));
    vec3 rippleN = normalize(vec3((rH - rHx) * 0.6, 1.0, (rH - rHz) * 0.6));
    N = normalize(mix(N, rippleN, rippleFade * 0.35));

    // Fresnel (Schlick) â€” F0=0.02 for water, boosted power for vivid reflections
    float cosTheta = max(dot(N, V), 0.0);
    float fresnel = 0.04 + 0.96 * pow(1.0 - cosTheta, 4.0);

    // Reflection color â€” enriched sky gradient with horizon colour
    vec3 R = reflect(-V, N);
    float skyBlend = max(R.y, 0.0);
    vec3 skyRefl = mix(uSkyColor * 0.9, uSkyColor * 1.5, skyBlend);
    // Blend toward warm horizon colour at low reflection angles
    float horizonBlend = pow(1.0 - max(R.y, 0.0), 3.0);
    vec3 reflColor = mix(skyRefl, uHorizonColor * 1.15, horizonBlend * 0.5);

    // Quad sun specular â€” tighter core, bloom, wide glow, ultra-wide haze
    vec3 H = normalize(L + V);
    float NdH = max(dot(N, H), 0.0);
    float spec1 = pow(NdH, 2048.0) * 8.0;   // tight bright core
    float spec2 = pow(NdH, 512.0) * 2.5;    // bloom
    float spec3 = pow(NdH, 64.0) * 0.5;     // wide glow
    float spec4 = pow(NdH, 12.0) * 0.12;    // ultra-wide haze
    vec3 sunSpec = vec3(1.0, 0.97, 0.88) * (spec1 + spec2 + spec3 + spec4);

    // Sun path shimmer â€” wide luminous streak on the water
    float sunReflect = pow(max(dot(R, L), 0.0), 8.0) * 0.55;
    sunSpec += vec3(1.0, 0.95, 0.80) * sunReflect;

    // Sparkle / sun glitter â€” noise-based micro-facet glints
    float sparkleFade = smoothstep(5000.0, 500.0, vDistFromCentre);
    float sparkleNoise = vnoise(vWorldPos.xz * 1.8 + uTime * vec2(0.7, 0.5));
    float sparkle = pow(sparkleNoise, 8.0) * pow(NdH, 8.0) * 6.0 * sparkleFade;
    sunSpec += vec3(1.0, 0.98, 0.90) * sparkle;

    reflColor += sunSpec;

    // Depth-based color (shallow vs deep)
    float depthFactor = smoothstep(0.0, 1.0, cosTheta);
    vec3 waterBody = mix(uDeepColor, uShallowColor, depthFactor * 0.5);

    // Distance-based deep ocean darkening
    float oceanDeep = smoothstep(1500.0, 6000.0, vDistFromCentre);
    waterBody = mix(waterBody, vec3(0.02, 0.08, 0.18), oceanDeep * 0.5);

    // Enhanced subsurface scattering â€” forward-scatter + back-scatter
    float sssForward = pow(max(dot(V, -L), 0.0), 3.0) * 0.35;
    float sssBack = pow(max(dot(N, L), 0.0), 2.0) * 0.12;
    waterBody += vec3(0.02, 0.22, 0.18) * sssForward;
    waterBody += vec3(0.0, 0.10, 0.08) * sssBack;

    // 3-octave caustic shimmer (fade out at distance)
    float causticFade = smoothstep(3000.0, 600.0, vDistFromCentre);
    float c1 = vnoise(vWorldPos.xz * 0.03 + uTime * 0.35) * 0.10;
    float c2 = vnoise(vWorldPos.xz * 0.08 + uTime * 0.50 + vec2(5.3, 2.1)) * 0.07;
    float c3 = vnoise(vWorldPos.xz * 0.18 + uTime * 0.70 + vec2(2.1, 7.4)) * 0.04;
    float caustic = (c1 + c2 + c3) * causticFade;
    waterBody += vec3(caustic * 0.5, caustic * 0.85, caustic * 1.1);

    // Sun-lit diffuse â€” boosted
    float diff = max(dot(N, L), 0.0) * 0.22;
    waterBody += waterBody * diff;

    // Final blend
    vec3 color = mix(waterBody, reflColor, fresnel);

    // Fog â€” stronger at distance for horizon fade
    float fogDist = vFogDepth;
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * fogDist * fogDist);
    // Horizon-haze colour blend for distant ocean
    vec3 fogCol = mix(uFogColor, uHorizonColor, smoothstep(3000.0, 10000.0, fogDist) * 0.5);
    color = mix(color, fogCol, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, mix(0.85, 0.25, uSubmerged));
  }
`;

export function createWater(sunDir) {
  // Massive ocean plane â€” extends well beyond camera far plane for horizon illusion
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE * 10, TERRAIN_SIZE * 10, 400, 400);
  geo.rotateX(-Math.PI / 2);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:          { value: 0 },
      uSunDir:        { value: sunDir ?? new THREE.Vector3(0.75,0.4,0.45).normalize() },
      uSkyColor:      { value: new THREE.Color(0.55, 0.72, 0.88) },
      uDeepColor:     { value: new THREE.Color(0.04, 0.18, 0.32) },
      uShallowColor:  { value: new THREE.Color(0.12, 0.42, 0.55) },
      uFogColor:      { value: new THREE.Color(0.784, 0.847, 0.91) },
      uHorizonColor:  { value: new THREE.Color(0.72, 0.80, 0.88) },
      uFogDensity:    { value: 0.00028 },
      uSubmerged:     { value: 0 },
    },
    vertexShader: waterVert,
    fragmentShader: waterFrag,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = WATER_LEVEL;
  mesh.receiveShadow = true;
  mesh.renderOrder = 10;

  return { mesh, material: mat };
}

export function animateWater(water, time) {
  if (water?.material) water.material.uniforms.uTime.value = time;
}


/* ── Lake water surfaces ───────────────────── */
// Lakes use ocean-identical Gerstner waves, Fresnel, specular, SSS,
// micro-ripples, caustics, sparkle — just scaled to the unit-circle geometry.
const lakeVertShader = /* glsl */ `
  uniform float uTime;
  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vUV;

  vec3 gerstner(vec3 p, float t, vec2 dir, float freq, float amp, float steep) {
    float phase = dot(dir, p.xz) * freq + t;
    float s = sin(phase), c = cos(phase);
    return vec3(steep * amp * dir.x * c, amp * s, steep * amp * dir.y * c);
  }

  vec3 allWaves(vec3 p, float t) {
    return gerstner(p,t*0.8,normalize(vec2(1,0.3)),3.0,0.012,0.65)
         + gerstner(p,t*0.6,normalize(vec2(-0.3,1)),4.5,0.009,0.55)
         + gerstner(p,t*1.1,normalize(vec2(0.7,0.7)),7.5,0.006,0.45)
         + gerstner(p,t*0.9,normalize(vec2(-0.5,-0.8)),10.0,0.003,0.38)
         + gerstner(p,t*1.3,normalize(vec2(0.4,-0.6)),15.0,0.002,0.32)
         + gerstner(p,t*1.5,normalize(vec2(-0.8,0.2)),21.0,0.0012,0.28)
         + gerstner(p,t*1.7,normalize(vec2(0.9,-0.4)),30.0,0.0006,0.22)
         + gerstner(p,t*2.0,normalize(vec2(-0.6,0.8)),40.0,0.0003,0.18);
  }

  void main() {
    vec3 pos = position;
    vUV = pos.xz * 0.5 + 0.5;
    float t = uTime;

    pos += allWaves(pos, t);

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;

    // Finite-difference normals
    float eps = 0.02;
    vec3 px = position + vec3(eps,0,0);
    vec3 pz = position + vec3(0,0,eps);
    px += allWaves(px, t);
    pz += allWaves(pz, t);
    vec3 T = normalize(px - pos);
    vec3 B = normalize(pz - pos);
    vWorldNormal = normalize(mat3(modelMatrix) * normalize(cross(B, T)));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFogDepth = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const lakeFragShader = /* glsl */ `
  uniform vec3  uSunDir;
  uniform vec3  uSkyColor;
  uniform vec3  uDeepColor;
  uniform vec3  uShallowColor;
  uniform vec3  uFogColor;
  uniform float uFogDensity;
  uniform float uTime;
  uniform vec3  uHorizonColor;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vUV;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float vnoise(vec2 p) {
    vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm3(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * vnoise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);

    // Micro-ripple normal perturbation
    vec2 rUV = vWorldPos.xz * 0.12 + uTime * vec2(0.12, 0.08);
    float rH  = fbm3(rUV);
    float rHx = fbm3(rUV + vec2(0.5, 0.0));
    float rHz = fbm3(rUV + vec2(0.0, 0.5));
    vec3 rippleN = normalize(vec3((rH - rHx) * 0.6, 1.0, (rH - rHz) * 0.6));
    N = normalize(mix(N, rippleN, 0.35));

    // Fresnel (Schlick)
    float cosTheta = max(dot(N, V), 0.0);
    float fresnel = 0.04 + 0.96 * pow(1.0 - cosTheta, 4.0);

    // Reflection colour
    vec3 R = reflect(-V, N);
    float skyBlend = max(R.y, 0.0);
    vec3 skyRefl = mix(uSkyColor * 0.9, uSkyColor * 1.5, skyBlend);
    float horizonBlend = pow(1.0 - max(R.y, 0.0), 3.0);
    vec3 reflColor = mix(skyRefl, uHorizonColor * 1.15, horizonBlend * 0.5);

    // Quad sun specular
    vec3 H = normalize(L + V);
    float NdH = max(dot(N, H), 0.0);
    float spec1 = pow(NdH, 2048.0) * 8.0;
    float spec2 = pow(NdH, 512.0) * 2.5;
    float spec3 = pow(NdH, 64.0) * 0.5;
    float spec4 = pow(NdH, 12.0) * 0.12;
    vec3 sunSpec = vec3(1.0, 0.97, 0.88) * (spec1 + spec2 + spec3 + spec4);

    float sunReflect = pow(max(dot(R, L), 0.0), 8.0) * 0.55;
    sunSpec += vec3(1.0, 0.95, 0.80) * sunReflect;

    // Sparkle / sun glitter
    float sparkleNoise = vnoise(vWorldPos.xz * 1.8 + uTime * vec2(0.7, 0.5));
    float sparkle = pow(sparkleNoise, 8.0) * pow(NdH, 8.0) * 6.0;
    sunSpec += vec3(1.0, 0.98, 0.90) * sparkle;
    reflColor += sunSpec;

    // Depth-based colour
    float depthFactor = smoothstep(0.0, 1.0, cosTheta);
    vec3 waterBody = mix(uDeepColor, uShallowColor, depthFactor * 0.5);

    // Lake centre depth darkening
    float edgeDist = length(vUV - 0.5) * 2.0;
    waterBody = mix(waterBody, vec3(0.02, 0.10, 0.22), (1.0 - edgeDist) * 0.3);

    // Subsurface scattering
    float sssForward = pow(max(dot(V, -L), 0.0), 3.0) * 0.35;
    float sssBack = pow(max(dot(N, L), 0.0), 2.0) * 0.12;
    waterBody += vec3(0.02, 0.22, 0.18) * sssForward;
    waterBody += vec3(0.0, 0.10, 0.08) * sssBack;

    // 3-octave caustics
    float c1 = vnoise(vWorldPos.xz * 0.03 + uTime * 0.35) * 0.10;
    float c2 = vnoise(vWorldPos.xz * 0.08 + uTime * 0.50 + vec2(5.3, 2.1)) * 0.07;
    float c3 = vnoise(vWorldPos.xz * 0.18 + uTime * 0.70 + vec2(2.1, 7.4)) * 0.04;
    float caustic = c1 + c2 + c3;
    waterBody += vec3(caustic * 0.5, caustic * 0.85, caustic * 1.1);

    // Sun-lit diffuse
    float diff = max(dot(N, L), 0.0) * 0.22;
    waterBody += waterBody * diff;

    // Final blend
    vec3 color = mix(waterBody, reflColor, fresnel);

    // Fog
    float fogDist = vFogDepth;
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * fogDist * fogDist);
    vec3 fogCol = mix(uFogColor, uHorizonColor, smoothstep(3000.0, 10000.0, fogDist) * 0.5);
    color = mix(color, fogCol, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, 0.88);
  }
`;

export function createLakeWater(lakes, getTerrainHeightFn) {
  const group = new THREE.Group();
  for (const lake of lakes) {
    let minRim = Infinity;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      const sx = lake.cx + Math.cos(a) * lake.rx * 0.92;
      const sz = lake.cz + Math.sin(a) * lake.rz * 0.92;
      const rh = getTerrainHeightFn(sx, sz);
      if (rh < minRim) minRim = rh;
    }
    const waterY = minRim + 1.8;

    const geo = new THREE.CircleGeometry(1, 128);
    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:         { value: 0 },
        uSunDir:       { value: new THREE.Vector3(0.75, 0.4, 0.45).normalize() },
        uSkyColor:     { value: new THREE.Color(0.55, 0.72, 0.88) },
        uDeepColor:    { value: new THREE.Color(0.04, 0.18, 0.32) },
        uShallowColor: { value: new THREE.Color(0.12, 0.42, 0.55) },
        uFogColor:     { value: new THREE.Color(0.784, 0.847, 0.91) },
        uHorizonColor: { value: new THREE.Color(0.72, 0.80, 0.88) },
        uFogDensity:   { value: 0.00018 },
      },
      vertexShader: lakeVertShader,
      fragmentShader: lakeFragShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(lake.cx, waterY, lake.cz);
    mesh.scale.set(lake.rx * 0.95, 1, lake.rz * 0.95);
    mesh.receiveShadow = true;
    mesh.renderOrder = 11;
    mesh.userData = { isLakeWater: true };
    group.add(mesh);
  }
  return group;
}

/* ── Catmull-Rom interpolation for smooth river paths ── */
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t
    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
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
        z: catmullRom(p0.z, p1.z, p2.z, p3.z, t),
      });
    }
  }
  result.push({ x: pts[pts.length - 1].x, z: pts[pts.length - 1].z });
  return result;
}

/* ── River water surfaces — ocean-quality with downstream flow ── */
const riverVertShader = /* glsl */ `
  uniform float uTime;
  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vRiverUV;

  void main() {
    vec3 pos = position;
    vRiverUV = uv;
    float t = uTime;

    // Downstream flow waves — multiple frequencies travelling along the river
    float flowBias = uv.y * 6.0 - t * 2.0;
    pos.y += sin(flowBias) * 0.15
           + sin(uv.y * 10.0 - t * 2.8 + uv.x * 3.0) * 0.08
           + sin(uv.y * 16.0 - t * 3.5 + uv.x * 5.0) * 0.04
           + sin(uv.y * 25.0 - t * 4.5) * 0.02
           + sin(uv.y * 40.0 - t * 6.0 + uv.x * 8.0) * 0.01;

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;

    // Normal via finite differences on flow-wave field
    float eps = 0.005;
    float baseY = sin(uv.y*6.0 - t*2.0)*0.15
                + sin(uv.y*10.0 - t*2.8 + uv.x*3.0)*0.08
                + sin(uv.y*16.0 - t*3.5 + uv.x*5.0)*0.04
                + sin(uv.y*25.0 - t*4.5)*0.02
                + sin(uv.y*40.0 - t*6.0 + uv.x*8.0)*0.01;
    float yPx = sin(uv.y*6.0 - t*2.0)*0.15
              + sin(uv.y*10.0 - t*2.8 + (uv.x+eps)*3.0)*0.08
              + sin(uv.y*16.0 - t*3.5 + (uv.x+eps)*5.0)*0.04
              + sin(uv.y*25.0 - t*4.5)*0.02
              + sin(uv.y*40.0 - t*6.0 + (uv.x+eps)*8.0)*0.01;
    float yPz = sin((uv.y+eps)*6.0 - t*2.0)*0.15
              + sin((uv.y+eps)*10.0 - t*2.8 + uv.x*3.0)*0.08
              + sin((uv.y+eps)*16.0 - t*3.5 + uv.x*5.0)*0.04
              + sin((uv.y+eps)*25.0 - t*4.5)*0.02
              + sin((uv.y+eps)*40.0 - t*6.0 + uv.x*8.0)*0.01;
    float dYdx = (yPx - baseY) / eps;
    float dYdz = (yPz - baseY) / eps;
    vWorldNormal = normalize(mat3(modelMatrix) * normalize(vec3(-dYdx, 1.0, -dYdz)));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFogDepth = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const riverFragShader = /* glsl */ `
  uniform vec3  uSunDir;
  uniform vec3  uSkyColor;
  uniform vec3  uDeepColor;
  uniform vec3  uShallowColor;
  uniform vec3  uFogColor;
  uniform float uFogDensity;
  uniform float uTime;
  uniform vec3  uHorizonColor;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vRiverUV;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float vnoise(vec2 p) {
    vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm3(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * vnoise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);

    // Flow-aligned micro-ripple normal perturbation
    vec2 rUV = vWorldPos.xz * 0.12 + uTime * vec2(0.12, 0.08);
    float rH  = fbm3(rUV);
    float rHx = fbm3(rUV + vec2(0.5, 0.0));
    float rHz = fbm3(rUV + vec2(0.0, 0.5));
    vec3 rippleN = normalize(vec3((rH - rHx) * 0.6, 1.0, (rH - rHz) * 0.6));
    N = normalize(mix(N, rippleN, 0.35));

    // Fresnel
    float cosTheta = max(dot(N, V), 0.0);
    float fresnel = 0.04 + 0.96 * pow(1.0 - cosTheta, 4.0);

    // Reflection — enriched sky gradient + horizon
    vec3 R = reflect(-V, N);
    float skyBlend = max(R.y, 0.0);
    vec3 reflColor = mix(uSkyColor * 0.9, uSkyColor * 1.5, skyBlend);
    float horizonBlend = pow(1.0 - max(R.y, 0.0), 3.0);
    reflColor = mix(reflColor, uHorizonColor * 1.15, horizonBlend * 0.5);

    // Quad sun specular
    vec3 H = normalize(L + V);
    float NdH = max(dot(N, H), 0.0);
    float spec1 = pow(NdH, 2048.0) * 8.0;
    float spec2 = pow(NdH, 512.0) * 2.5;
    float spec3 = pow(NdH, 64.0) * 0.5;
    float spec4 = pow(NdH, 12.0) * 0.12;
    vec3 sunSpec = vec3(1.0, 0.97, 0.88) * (spec1 + spec2 + spec3 + spec4);

    float sunReflect = pow(max(dot(R, L), 0.0), 8.0) * 0.55;
    sunSpec += vec3(1.0, 0.95, 0.80) * sunReflect;

    // Sparkle / sun glitter
    float sparkleNoise = vnoise(vWorldPos.xz * 1.8 + uTime * vec2(0.7, 0.5));
    float sparkle = pow(sparkleNoise, 8.0) * pow(NdH, 8.0) * 6.0;
    sunSpec += vec3(1.0, 0.98, 0.90) * sparkle;
    reflColor += sunSpec;

    // Depth-based body colour — edge-to-centre depth for river cross-section
    float edgeFade = smoothstep(0.0, 0.3, min(vRiverUV.x, 1.0 - vRiverUV.x));
    float depthFactor = smoothstep(0.0, 1.0, cosTheta);
    vec3 waterBody = mix(uShallowColor, uDeepColor, edgeFade * 0.6 + depthFactor * 0.2);

    // Subsurface scattering
    float sssForward = pow(max(dot(V, -L), 0.0), 3.0) * 0.35;
    float sssBack = pow(max(dot(N, L), 0.0), 2.0) * 0.12;
    waterBody += vec3(0.02, 0.22, 0.18) * sssForward;
    waterBody += vec3(0.0, 0.10, 0.08) * sssBack;

    // Flowing caustics along river
    float flowSpeed = uTime * 0.8;
    float c1 = vnoise(vec2(vRiverUV.y * 6.0 - flowSpeed, vRiverUV.x * 3.0) + vWorldPos.xz * 0.02) * 0.10;
    float c2 = vnoise(vec2(vRiverUV.y * 12.0 - flowSpeed * 1.5, vRiverUV.x * 5.0) + vWorldPos.xz * 0.05) * 0.07;
    float c3 = vnoise(vec2(vRiverUV.y * 24.0 - flowSpeed * 2.0, vRiverUV.x * 8.0) + vWorldPos.xz * 0.10) * 0.04;
    float caustic = c1 + c2 + c3;
    waterBody += vec3(caustic * 0.5, caustic * 0.85, caustic * 1.1);

    // Flowing foam near banks
    float edgeProx = 1.0 - edgeFade;
    float foamPattern = vnoise(vec2(vRiverUV.x * 10.0, vRiverUV.y * 20.0 - uTime * 1.2)) * edgeProx;
    float foam = smoothstep(0.25, 0.55, foamPattern) * 0.35;
    waterBody = mix(waterBody, vec3(0.70, 0.80, 0.85), foam);

    // Sun-lit diffuse
    float diff = max(dot(N, L), 0.0) * 0.22;
    waterBody += waterBody * diff;

    // Final blend
    vec3 color = mix(waterBody, reflColor, fresnel);

    // Fog
    float fogDist = vFogDepth;
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * fogDist * fogDist);
    vec3 fogCol = mix(uFogColor, uHorizonColor, smoothstep(3000.0, 10000.0, fogDist) * 0.5);
    color = mix(color, fogCol, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, 0.88);
  }
`;

export function createRiverWater(rivers, getTerrainHeightFn) {
  const group = new THREE.Group();
  for (const river of rivers) {
    const pts = subdivideRiverPath(river.points, 8);

    const ribVerts = [];
    const ribUVs   = [];
    const ribIdx   = [];
    let accLen = 0;

    for (let i = 0; i < pts.length; i++) {
      if (i > 0) accLen += Math.sqrt((pts[i].x - pts[i-1].x)**2 + (pts[i].z - pts[i-1].z)**2);

      let tx, tz;
      if (i === 0) {
        tx = pts[1].x - pts[0].x; tz = pts[1].z - pts[0].z;
      } else if (i === pts.length - 1) {
        tx = pts[i].x - pts[i-1].x; tz = pts[i].z - pts[i-1].z;
      } else {
        tx = pts[i+1].x - pts[i-1].x; tz = pts[i+1].z - pts[i-1].z;
      }
      const tl = Math.sqrt(tx*tx + tz*tz) || 1;
      tx /= tl; tz /= tl;
      const nx = -tz, nz = tx;

      const hw = river.width * (0.8 + 0.2 * Math.sin(accLen * 0.005));
      const cx = pts[i].x, cz = pts[i].z;

      const hC = getTerrainHeightFn(cx, cz);
      const h = hC + 6.0;

      ribVerts.push(cx + nx * hw, h, cz + nz * hw);
      ribVerts.push(cx - nx * hw, h, cz - nz * hw);

      const u = accLen * 0.005;
      ribUVs.push(0, u, 1, u);

      if (i < pts.length - 1) {
        const vi = i * 2;
        ribIdx.push(vi, vi + 1, vi + 2, vi + 1, vi + 3, vi + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(ribVerts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(ribUVs, 2));
    geo.setIndex(ribIdx);
    geo.computeVertexNormals();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:         { value: 0 },
        uSunDir:       { value: new THREE.Vector3(0.75, 0.4, 0.45).normalize() },
        uSkyColor:     { value: new THREE.Color(0.55, 0.72, 0.88) },
        uDeepColor:    { value: new THREE.Color(0.04, 0.18, 0.32) },
        uShallowColor: { value: new THREE.Color(0.12, 0.42, 0.55) },
        uFogColor:     { value: new THREE.Color(0.784, 0.847, 0.91) },
        uHorizonColor: { value: new THREE.Color(0.72, 0.80, 0.88) },
        uFogDensity:   { value: 0.00018 },
      },
      vertexShader: riverVertShader,
      fragmentShader: riverFragShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.renderOrder = 11;
    mesh.userData = { isRiverWater: true };
    group.add(mesh);
  }
  return group;
}

export function animateLakeWater(lakeGroup, time) {
  if (!lakeGroup) return;
  lakeGroup.children.forEach(m => {
    if (m.material && m.material.uniforms) {
      m.material.uniforms.uTime.value = time;
    }
  });
}
