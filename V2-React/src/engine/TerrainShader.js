// ================================================================
//  PBR TERRAIN SHADER — Cook-Torrance BRDF, tri-planar atlas,
//  detail normals, roughness/AO/height, aerial perspective fog.
//  Standard GLSL for Intel Iris Xe compatibility.
// ================================================================
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  attribute float aLayerIndex;
  attribute vec3  aVertColor;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying vec3  vVertColor;
  varying float vLayerIndex;
  varying float vFogDepth;
  varying vec2  vDetailUV;
  varying vec2  vMicroUV;
  varying float vElevation;
  varying float vCamDist;

  void main() {
    vec4 wp    = modelMatrix * vec4(position, 1.0);
    vWorldPos  = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vVertColor   = aVertColor;
    vLayerIndex  = aLayerIndex;
    vElevation   = wp.y;

    // detail UV at higher frequency for close-up normals
    vDetailUV = wp.xz * 0.06;
    // micro detail UV for extreme close-up
    vMicroUV  = wp.xz * 0.25;

    vec4 mvp = modelViewMatrix * vec4(position, 1.0);
    vFogDepth = length(mvp.xyz);
    vCamDist  = length(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * mvp;
  }
`;

const fragmentShader = /* glsl */ `
  #define PI 3.14159265359
  #define TILE_COUNT 6.0

  uniform sampler2D uAlbedoAtlas;
  uniform sampler2D uNormalAtlas;
  uniform sampler2D uRmhAtlas;     // R=roughness, G=AO, B=height
  uniform float uTexScale;
  uniform float uDetailScale;
  uniform float uDetailStrength;
  uniform vec3  uSunDir;
  uniform vec3  uSunColor;
  uniform vec3  uAmbientColor;
  uniform vec3  uFogColorNear;
  uniform vec3  uFogColorFar;
  uniform float uFogDensity;
  uniform float uWaterLevel;
  uniform float uTime;
  uniform vec3  uSkyColor;

  // Lake positions for wetness (max 8)
  #define MAX_LAKES 5
  uniform vec4 uLakes[MAX_LAKES]; // xy=cx,cz  zw=rx,rz
  uniform int uLakeCount;

  // River segments for wetness (max 12)
  #define MAX_RIVER_PTS 11
  uniform vec2 uRiverPts[MAX_RIVER_PTS];
  uniform float uRiverWidth;
  uniform int uRiverPtCount;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying vec3  vVertColor;
  varying float vLayerIndex;
  varying float vFogDepth;
  varying vec2  vDetailUV;
  varying vec2  vMicroUV;
  varying float vElevation;
  varying float vCamDist;

  /* ── Atlas UV helper ─────────────────────── */
  vec2 atlasUV(vec2 baseUV, float layer) {
    float l = clamp(floor(layer), 0.0, TILE_COUNT - 1.0);
    return vec2((fract(baseUV.x) + l) / TILE_COUNT, fract(baseUV.y));
  }

  /* ── Tri-planar sample ───────────────────── */
  vec4 triPlanar(sampler2D tex, vec3 pos, float sc, float layer) {
    vec3 bl = abs(normalize(vWorldNormal));
    bl = pow(bl, vec3(4.0));
    bl /= (bl.x + bl.y + bl.z);
    vec4 sx = texture2D(tex, atlasUV(pos.yz * sc, layer));
    vec4 sy = texture2D(tex, atlasUV(pos.xz * sc, layer));
    vec4 sz = texture2D(tex, atlasUV(pos.xy * sc, layer));
    return sx * bl.x + sy * bl.y + sz * bl.z;
  }

  /* ── Detail normal from height field ──── */
  vec3 computeDetailNormal(vec2 uv) {
    float eps = 0.002;
    // Use the normal atlas at high freq as a detail height source
    float hC = texture2D(uNormalAtlas, uv).r;
    float hR = texture2D(uNormalAtlas, uv + vec2(eps, 0.0)).r;
    float hU = texture2D(uNormalAtlas, uv + vec2(0.0, eps)).r;
    vec3 detN = normalize(vec3(hC - hR, hC - hU, eps * 4.0));
    return detN;
  }

  /* ── PBR: GGX normal distribution ──── */
  float distributionGGX(float NdotH, float roughness) {
    float a  = roughness * roughness;
    float a2 = a * a;
    float d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
    return a2 / (PI * d * d + 0.0001);
  }

  /* ── PBR: Schlick-GGX geometry ──── */
  float geometrySmith(float NdotV, float NdotL, float roughness) {
    float r = roughness + 1.0;
    float k = (r * r) / 8.0;
    float gV = NdotV / (NdotV * (1.0 - k) + k);
    float gL = NdotL / (NdotL * (1.0 - k) + k);
    return gV * gL;
  }

  /* ── PBR: Fresnel-Schlick ──── */
  vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
  }

  void main() {
    float lo = floor(vLayerIndex);
    float hi = min(lo + 1.0, TILE_COUNT - 1.0);
    float t  = smoothstep(0.0, 1.0, fract(vLayerIndex));

    /* ── Distance-based LOD for anti-tiling ── */
    float camDist = vCamDist;
    float distLOD = smoothstep(300.0, 1400.0, camDist);

    /* ── Close-up LOD tiers ── */
    float closeUp  = smoothstep(150.0, 30.0, camDist);   // 1.0 when very close
    float ultraClose = smoothstep(60.0, 10.0, camDist);  // 1.0 when extremely close

    /* ── Sample PBR textures (tri-planar, layer-blended) ── */
    vec3 albLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale, lo).rgb;
    vec3 albHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale, hi).rgb;
    vec3 texColor = mix(albLo, albHi, t);

    // High-frequency detail layer — visible when zoomed in
    vec3 detAlbLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 3.5, lo).rgb;
    vec3 detAlbHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 3.5, hi).rgb;
    vec3 detColor = mix(detAlbLo, detAlbHi, t);
    // Overlay detail: multiply-blend preserves base color, adds grain
    texColor = mix(texColor, texColor * detColor * 1.6, closeUp * 0.45);

    // Micro-detail layer — visible only when extremely close
    vec3 microLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 9.0, lo).rgb;
    vec3 microHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 9.0, hi).rgb;
    vec3 microColor = mix(microLo, microHi, t);
    texColor = mix(texColor, texColor * microColor * 1.5, ultraClose * 0.3);

    // Macro-scale texture: lower frequency sample that persists at distance
    vec3 macroLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 0.25, lo).rgb;
    vec3 macroHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 0.25, hi).rgb;
    vec3 macroColor = mix(macroLo, macroHi, t);

    // At close range: use detail texture; at distance: blend to macro then vertex color
    vec3 blendedTex = mix(texColor, macroColor, smoothstep(0.0, 0.6, distLOD));
    vec3 albedo = mix(blendedTex * vVertColor, vVertColor * 0.95, distLOD * 0.2) * 1.35;

    vec3 nLo = triPlanar(uNormalAtlas, vWorldPos, uTexScale, lo).rgb;
    vec3 nHi = triPlanar(uNormalAtlas, vWorldPos, uTexScale, hi).rgb;
    vec3 texNormal = mix(nLo, nHi, t) * 2.0 - 1.0;

    vec4 rmhLo = triPlanar(uRmhAtlas, vWorldPos, uTexScale, lo);
    vec4 rmhHi = triPlanar(uRmhAtlas, vWorldPos, uTexScale, hi);
    vec4 rmhVal = mix(rmhLo, rmhHi, t);
    float roughness = rmhVal.r;
    float ao        = rmhVal.g;
    float heightVal = rmhVal.b;

    /* ── Detail normal blending (fades at distance, slower falloff) ── */
    vec3 detN = computeDetailNormal(vDetailUV);
    float detailFade = smoothstep(1.0, 0.0, distLOD * 0.7);
    texNormal = normalize(texNormal + detN * uDetailStrength * detailFade);

    /* ── Micro-detail normal (extreme close-up grain) ── */
    vec3 microN = computeDetailNormal(vMicroUV);
    texNormal = normalize(texNormal + microN * uDetailStrength * 0.6 * ultraClose);

    /* ── High-freq normal from PBR atlas at close range ── */
    vec3 hfNrmLo = triPlanar(uNormalAtlas, vWorldPos, uTexScale * 3.5, lo).rgb;
    vec3 hfNrmHi = triPlanar(uNormalAtlas, vWorldPos, uTexScale * 3.5, hi).rgb;
    vec3 hfNrm = mix(hfNrmLo, hfNrmHi, t) * 2.0 - 1.0;
    texNormal = normalize(texNormal + hfNrm * 0.25 * closeUp);

    /* ── Construct final world normal ── */
    vec3 N = normalize(vWorldNormal + texNormal * 0.35);

    /* ── Slope-based darkening + roughness boost ── */
    float slope = 1.0 - abs(N.y);
    albedo *= mix(1.0, 0.68, smoothstep(0.3, 0.8, slope));
    roughness = clamp(roughness + slope * 0.15, 0.05, 1.0);

    /* ── Wetness near water bodies ── */
    float wetness = 0.0;
    // Near global water level
    wetness = max(wetness, smoothstep(20.0, 0.0, vElevation - uWaterLevel));
    // Near lakes
    for (int i = 0; i < MAX_LAKES; i++) {
      if (i >= uLakeCount) break;
      vec2 lc = uLakes[i].xy;
      vec2 lr = uLakes[i].zw;
      float dx = (vWorldPos.x - lc.x) / (lr.x * 1.5);
      float dz = (vWorldPos.z - lc.y) / (lr.y * 1.5);
      float ld = sqrt(dx*dx + dz*dz);
      wetness = max(wetness, smoothstep(1.3, 0.5, ld));
    }
    // Near river
    for (int i = 0; i < MAX_RIVER_PTS - 1; i++) {
      if (i >= uRiverPtCount - 1) break;
      vec2 a = uRiverPts[i], b = uRiverPts[i+1];
      vec2 ab = b - a;
      vec2 ap = vWorldPos.xz - a;
      float t2 = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
      vec2 closest = a + t2 * ab;
      float rd = length(vWorldPos.xz - closest);
      wetness = max(wetness, smoothstep(uRiverWidth * 4.0, uRiverWidth * 0.5, rd));
    }
    wetness = clamp(wetness, 0.0, 0.85);

    /* ── Close-up roughness variation for mineral grain feel ── */
    float microRough = triPlanar(uRmhAtlas, vWorldPos, uTexScale * 5.0, lo).r;
    roughness = mix(roughness, microRough, closeUp * 0.35);

    // Wet terrain: darker albedo, lower roughness, higher F0
    albedo *= mix(1.0, 0.65, wetness);
    roughness = mix(roughness, 0.05, wetness * 0.9);
    float wetF0boost = wetness * 0.08;

    /* ── PBR Cook-Torrance ── */
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);
    vec3 H = normalize(V + L);

    float NdotV = max(dot(N, V), 0.001);
    float NdotL = max(dot(N, L), 0.0);
    float NdotH = max(dot(N, H), 0.0);
    float HdotV = max(dot(H, V), 0.0);

    // Non-metal rock: F0 ≈ 0.04 — boosted near water
    vec3 F0 = vec3(0.04 + wetF0boost);

    float D = distributionGGX(NdotH, roughness);
    float G = geometrySmith(NdotV, NdotL, roughness);
    vec3  F = fresnelSchlick(HdotV, F0);

    vec3 specular = (D * G * F) / (4.0 * NdotV * NdotL + 0.001);
    vec3 kD = (1.0 - F) * (1.0 - 0.0); // metalness = 0

    vec3 Lo = (kD * albedo / PI + specular) * uSunColor * NdotL;

    // Ambient lighting with AO
    vec3 ambient = uAmbientColor * albedo * ao * 1.1;

    // Indirect specular approx (environment reflection)
    vec3 envColor = mix(uSunColor * 0.22, uAmbientColor * 0.6, roughness);
    vec3 envSpec = fresnelSchlick(NdotV, F0) * envColor * ao * (0.35 + wetness * 0.5);

    // Grazing-angle reflection — adds rim highlights on terrain edges
    float rimFresnel = pow(1.0 - NdotV, 4.0) * 0.15 * (1.0 + wetness * 2.0);
    vec3 rimColor = mix(uSkyColor, uSunColor, 0.35) * rimFresnel;

    vec3 color = ambient + Lo + envSpec + rimColor;

    /* ── Height-based micro-shadow (cavity occlusion) ── */
    float cavity = smoothstep(0.2, 0.5, heightVal);
    color *= mix(0.82, 1.0, cavity);

    /* ── Aerial perspective fog ── */
    float fogT = 1.0 - exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    fogT = clamp(fogT, 0.0, 1.0);
    // Blend between near-fog (warm) and far-fog (cool atmospheric)
    vec3 fogColor = mix(uFogColorNear, uFogColorFar, smoothstep(0.0, 0.6, fogT));
    color = mix(color, fogColor, fogT);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createTerrainMaterial(albedoAtlas, normalAtlas, rmhAtlas, opts = {}) {
  // Build lake uniform array (vec4 each: cx, cz, rx, rz)
  const lakes = opts.lakes || [];
  const lakeData = [];
  for (let i = 0; i < 5; i++) {
    if (i < lakes.length) {
      lakeData.push(new THREE.Vector4(lakes[i].cx, lakes[i].cz, lakes[i].rx, lakes[i].rz));
    } else {
      lakeData.push(new THREE.Vector4(0, 0, 0, 0));
    }
  }

  // Build river points uniform array
  const rivers = opts.rivers || [];
  const riverPts = [];
  const rp = rivers.length > 0 ? rivers[0].points : [];
  for (let i = 0; i < 11; i++) {
    if (i < rp.length) {
      riverPts.push(new THREE.Vector2(rp[i].x, rp[i].z));
    } else {
      riverPts.push(new THREE.Vector2(0, 0));
    }
  }

  return new THREE.ShaderMaterial({
    uniforms: {
      uAlbedoAtlas:    { value: albedoAtlas },
      uNormalAtlas:    { value: normalAtlas },
      uRmhAtlas:       { value: rmhAtlas },
      uTexScale:       { value: opts.texScale       ?? 0.018 },
      uDetailScale:    { value: opts.detailScale    ?? 0.06 },
      uDetailStrength: { value: opts.detailStrength ?? 0.35 },
      uSunDir:         { value: opts.sunDir         ?? new THREE.Vector3(0.75, 0.4, 0.45).normalize() },
      uSunColor:       { value: opts.sunColor       ?? new THREE.Color(1.0, 0.96, 0.88) },
      uSkyColor:       { value: opts.skyColor       ?? new THREE.Color(0.55, 0.72, 0.88) },
      uAmbientColor:   { value: opts.ambient        ?? new THREE.Color(0.35, 0.38, 0.45) },
      uFogColorNear:   { value: opts.fogColorNear   ?? new THREE.Color(0.82, 0.86, 0.92) },
      uFogColorFar:    { value: opts.fogColorFar    ?? new THREE.Color(0.72, 0.80, 0.90) },
      uFogDensity:     { value: opts.fogDensity     ?? 0.00028 },
      uWaterLevel:     { value: opts.waterLevel     ?? 38 },
      uTime:           { value: 0 },
      uLakes:          { value: lakeData },
      uLakeCount:      { value: lakes.length },
      uRiverPts:       { value: riverPts },
      uRiverWidth:     { value: rivers.length > 0 ? rivers[0].width : 18 },
      uRiverPtCount:   { value: rp.length },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });
}
