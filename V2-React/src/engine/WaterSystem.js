// ================================================================
//  WATER SYSTEM — enhanced reflective water with Fresnel-Schlick,
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

    // 6 Gerstner waves for rich, detailed ocean surface
    vec3 w1 = gerstner(pos, t*0.8, normalize(vec2(1.0, 0.3)), 0.015, 0.55, 0.6) * waveFade;
    vec3 w2 = gerstner(pos, t*0.6, normalize(vec2(-0.3, 1.0)), 0.022, 0.40, 0.5) * waveFade;
    vec3 w3 = gerstner(pos, t*1.1, normalize(vec2(0.7, 0.7)), 0.035, 0.22, 0.4) * waveFade;
    vec3 w4 = gerstner(pos, t*0.9, normalize(vec2(-0.5, -0.8)), 0.045, 0.12, 0.35) * waveFade;
    vec3 w5 = gerstner(pos, t*1.3, normalize(vec2(0.4, -0.6)), 0.065, 0.07, 0.3) * waveFade;
    vec3 w6 = gerstner(pos, t*1.5, normalize(vec2(-0.8, 0.2)), 0.09, 0.04, 0.25) * waveFade;
    pos += w1 + w2 + w3 + w4 + w5 + w6;

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    vUV = pos.xz * 0.001;

    // Wave normal from finite differences
    float eps = 2.0;
    vec3 px = position + vec3(eps,0,0);
    vec3 pz = position + vec3(0,0,eps);
    px += (gerstner(px,t*0.8,normalize(vec2(1,0.3)),0.015,0.55,0.6)
        + gerstner(px,t*0.6,normalize(vec2(-0.3,1)),0.022,0.40,0.5)
        + gerstner(px,t*1.1,normalize(vec2(0.7,0.7)),0.035,0.22,0.4)
        + gerstner(px,t*0.9,normalize(vec2(-0.5,-0.8)),0.045,0.12,0.35)
        + gerstner(px,t*1.3,normalize(vec2(0.4,-0.6)),0.065,0.07,0.3)
        + gerstner(px,t*1.5,normalize(vec2(-0.8,0.2)),0.09,0.04,0.25)) * waveFade;
    pz += (gerstner(pz,t*0.8,normalize(vec2(1,0.3)),0.015,0.55,0.6)
        + gerstner(pz,t*0.6,normalize(vec2(-0.3,1)),0.022,0.40,0.5)
        + gerstner(pz,t*1.1,normalize(vec2(0.7,0.7)),0.035,0.22,0.4)
        + gerstner(pz,t*0.9,normalize(vec2(-0.5,-0.8)),0.045,0.12,0.35)
        + gerstner(pz,t*1.3,normalize(vec2(0.4,-0.6)),0.065,0.07,0.3)
        + gerstner(pz,t*1.5,normalize(vec2(-0.8,0.2)),0.09,0.04,0.25)) * waveFade;
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

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);

    // Fresnel (Schlick) — F0=0.02 for water
    float cosTheta = max(dot(N, V), 0.0);
    float fresnel = 0.02 + 0.98 * pow(1.0 - cosTheta, 5.0);

    // Reflection color — sky gradient with horizon enrichment
    vec3 R = reflect(-V, N);
    float skyBlend = max(R.y, 0.0);
    vec3 skyRefl = mix(uSkyColor * 0.8, uSkyColor * 1.3, skyBlend);
    // Blend toward warm horizon colour at low reflection angles
    float horizonBlend = pow(1.0 - max(R.y, 0.0), 3.0);
    vec3 reflColor = mix(skyRefl, uHorizonColor, horizonBlend * 0.4);

    // Triple sun specular — core, bloom, wide glow
    vec3 H = normalize(L + V);
    float NdH = max(dot(N, H), 0.0);
    float spec1 = pow(NdH, 1024.0) * 5.0;
    float spec2 = pow(NdH, 256.0) * 1.5;
    float spec3 = pow(NdH, 48.0) * 0.3;
    vec3 sunSpec = vec3(1.0, 0.97, 0.88) * (spec1 + spec2 + spec3);

    // Sun path shimmer — extra wide glow along reflection path
    float sunReflect = pow(max(dot(R, L), 0.0), 16.0) * 0.35;
    sunSpec += vec3(1.0, 0.95, 0.80) * sunReflect;
    reflColor += sunSpec;

    // Depth-based color (shallow vs deep)
    float depthFactor = smoothstep(0.0, 1.0, cosTheta);
    vec3 waterBody = mix(uDeepColor, uShallowColor, depthFactor * 0.5);

    // Distance-based deep ocean darkening
    float oceanDeep = smoothstep(1500.0, 6000.0, vDistFromCentre);
    waterBody = mix(waterBody, vec3(0.02, 0.08, 0.18), oceanDeep * 0.5);

    // Subsurface scattering hint
    float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.22;
    waterBody += vec3(0.0, 0.18, 0.14) * sss;

    // Multi-octave caustic shimmer (fade out at distance)
    float causticFade = smoothstep(3000.0, 800.0, vDistFromCentre);
    float c1 = vnoise(vWorldPos.xz * 0.03 + uTime * 0.3) * 0.08;
    float c2 = vnoise(vWorldPos.xz * 0.08 + uTime * 0.45 + vec2(5.3, 2.1)) * 0.05;
    float caustic = (c1 + c2) * causticFade;
    waterBody += vec3(caustic * 0.5, caustic * 0.8, caustic);

    // Sun-lit diffuse
    float diff = max(dot(N, L), 0.0) * 0.14;
    waterBody += waterBody * diff;

    // Final blend
    vec3 color = mix(waterBody, reflColor, fresnel);

    // Fog — stronger at distance for horizon fade
    float fogDist = vFogDepth;
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * fogDist * fogDist);
    // Horizon-haze colour blend for distant ocean
    vec3 fogCol = mix(uFogColor, uHorizonColor, smoothstep(3000.0, 10000.0, fogDist) * 0.5);
    color = mix(color, fogCol, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, mix(0.82, 0.25, uSubmerged));
  }
`;

export function createWater(sunDir) {
  // Massive ocean plane — extends well beyond camera far plane for horizon illusion
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
// The water level is found by sampling terrain height at the lake rim.
export function createLakeWater(lakes, getTerrainHeightFn) {
  const group = new THREE.Group();
  for (const lake of lakes) {
    // Sample rim heights around the ellipse to find the lowest rim point
    let minRim = Infinity;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      const sx = lake.cx + Math.cos(a) * lake.rx * 0.92;
      const sz = lake.cz + Math.sin(a) * lake.rz * 0.92;
      const rh = getTerrainHeightFn(sx, sz);
      if (rh < minRim) minRim = rh;
    }
    // Also sample ring at 0.7 radii for bowl shape
    let innerMin = Infinity;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const sx = lake.cx + Math.cos(a) * lake.rx * 0.5;
      const sz = lake.cz + Math.sin(a) * lake.rz * 0.5;
      const rh = getTerrainHeightFn(sx, sz);
      if (rh < innerMin) innerMin = rh;
    }
    // Water surface sits near the rim — raised for fuller, more visible lakes
    const waterY = minRim + 1.8;

    const geo = new THREE.CircleGeometry(1, 96);
    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:         { value: 0 },
        uSunDir:       { value: new THREE.Vector3(0.75, 0.4, 0.45).normalize() },
        uSkyColor:     { value: new THREE.Color(0.55, 0.72, 0.88) },
        uDeepColor:    { value: new THREE.Color(0.02, 0.10, 0.20) },
        uShallowColor: { value: new THREE.Color(0.08, 0.30, 0.38) },
        uHorizonColor: { value: new THREE.Color(0.72, 0.80, 0.88) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vUV;

        /* Gerstner wave for lakes — smaller amplitude than ocean */
        vec3 gerstner(vec3 p, float t, vec2 dir, float freq, float amp, float steep) {
          float phase = dot(dir, p.xz) * freq + t;
          float s = sin(phase), c = cos(phase);
          return vec3(steep * amp * dir.x * c, amp * s, steep * amp * dir.y * c);
        }

        void main() {
          vec3 pos = position;
          vUV = pos.xz * 0.5 + 0.5;
          float t = uTime;

          // 5 Gerstner wave components for detailed lake surface
          vec3 w1 = gerstner(pos, t*0.7, normalize(vec2(1.0, 0.3)), 3.5, 0.06, 0.5);
          vec3 w2 = gerstner(pos, t*0.5, normalize(vec2(-0.3, 1.0)), 5.0, 0.04, 0.4);
          vec3 w3 = gerstner(pos, t*1.1, normalize(vec2(0.7, 0.7)), 7.0, 0.025, 0.35);
          vec3 w4 = gerstner(pos, t*0.9, normalize(vec2(-0.6, -0.5)), 9.0, 0.015, 0.3);
          vec3 w5 = gerstner(pos, t*1.3, normalize(vec2(0.2, -0.9)), 12.0, 0.01, 0.25);
          pos += w1 + w2 + w3 + w4 + w5;

          vec4 wp = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wp.xyz;

          // Wave normals from finite differences
          float eps = 0.05;
          vec3 px = position + vec3(eps,0,0);
          vec3 pz = position + vec3(0,0,eps);
          px += gerstner(px,t*0.7,normalize(vec2(1,0.3)),3.5,0.06,0.5)
              + gerstner(px,t*0.5,normalize(vec2(-0.3,1)),5.0,0.04,0.4)
              + gerstner(px,t*1.1,normalize(vec2(0.7,0.7)),7.0,0.025,0.35)
              + gerstner(px,t*0.9,normalize(vec2(-0.6,-0.5)),9.0,0.015,0.3)
              + gerstner(px,t*1.3,normalize(vec2(0.2,-0.9)),12.0,0.01,0.25);
          pz += gerstner(pz,t*0.7,normalize(vec2(1,0.3)),3.5,0.06,0.5)
              + gerstner(pz,t*0.5,normalize(vec2(-0.3,1)),5.0,0.04,0.4)
              + gerstner(pz,t*1.1,normalize(vec2(0.7,0.7)),7.0,0.025,0.35)
              + gerstner(pz,t*0.9,normalize(vec2(-0.6,-0.5)),9.0,0.015,0.3)
              + gerstner(pz,t*1.3,normalize(vec2(0.2,-0.9)),12.0,0.01,0.25);
          vec3 T = normalize(px - pos);
          vec3 B = normalize(pz - pos);
          vNorm = normalize(mat3(modelMatrix) * normalize(cross(B, T)));

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vFogD = length(mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uSunDir;
        uniform vec3 uSkyColor;
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;
        uniform vec3 uHorizonColor;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vUV;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float vnoise(vec2 p) {
          vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                     mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }

        void main() {
          vec3 N = normalize(vNorm);
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(uSunDir);

          // Fresnel-Schlick (F0 = 0.02 for water)
          float cosT = max(dot(N, V), 0.0);
          float fresnel = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);

          // Sky reflection with horizon colour blend
          vec3 R = reflect(-V, N);
          float skyBlend = max(R.y, 0.0);
          vec3 reflCol = mix(uSkyColor * 0.75, uSkyColor * 1.3, skyBlend);
          float horizBlend = pow(1.0 - max(R.y, 0.0), 3.0);
          reflCol = mix(reflCol, uHorizonColor, horizBlend * 0.3);

          // Triple sun specular for realistic sun glitter
          vec3 H = normalize(L + V);
          float NdH = max(dot(N, H), 0.0);
          float spec1 = pow(NdH, 1024.0) * 5.0;  // hard core
          float spec2 = pow(NdH, 256.0) * 1.5;    // bloom
          float spec3 = pow(NdH, 48.0) * 0.3;     // wide glow
          vec3 sunSpec = vec3(1.0, 0.97, 0.90) * (spec1 + spec2 + spec3);
          // Sun path shimmer
          float sunPath = pow(max(dot(R, L), 0.0), 16.0) * 0.25;
          sunSpec += vec3(1.0, 0.95, 0.80) * sunPath;
          reflCol += sunSpec;

          // Depth-based tint
          float edgeDist = length(vUV - 0.5) * 2.0;
          float depthFactor = smoothstep(0.0, 1.0, cosT);
          vec3 waterBody = mix(uDeepColor, uShallowColor, edgeDist * 0.5 + depthFactor * 0.3);

          // Multi-octave caustics
          float c1 = vnoise(vWorldPos.xz * 0.06 + uTime * 0.2) * 0.10;
          float c2 = vnoise(vWorldPos.xz * 0.12 + uTime * 0.35 + vec2(3.7, 1.2)) * 0.06;
          float caustic = c1 + c2;
          waterBody += vec3(caustic * 0.4, caustic * 0.7, caustic * 0.9);

          // Subsurface scattering
          float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.22;
          waterBody += vec3(0.0, 0.18, 0.14) * sss;

          // Sun-lit diffuse contribution
          float diff = max(dot(N, L), 0.0) * 0.14;
          waterBody += waterBody * diff;

          vec3 col = mix(waterBody, reflCol, fresnel);

          // Fog
          float fog = 1.0 - exp(-0.00028 * 0.00028 * vFogD * vFogD);
          col = mix(col, vec3(0.78, 0.85, 0.91), clamp(fog, 0.0, 1.0));
          gl_FragColor = vec4(col, 0.90);
        }
      `,
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
  // Add the final point
  result.push({ x: pts[pts.length - 1].x, z: pts[pts.length - 1].z });
  return result;
}

/* ── River water surfaces ─────────────────── */
export function createRiverWater(rivers, getTerrainHeightFn) {
  const group = new THREE.Group();
  for (const river of rivers) {
    // Subdivide 11 control points → ~81 dense points for smooth terrain tracking
    const pts = subdivideRiverPath(river.points, 8);

    // Create a ribbon mesh along the river path
    const ribVerts = [];
    const ribUVs   = [];
    const ribIdx   = [];
    let accLen = 0;

    for (let i = 0; i < pts.length; i++) {
      // Accumulate path length first (needed for width variation + UV)
      if (i > 0) accLen += Math.sqrt((pts[i].x - pts[i-1].x)**2 + (pts[i].z - pts[i-1].z)**2);

      // Tangent direction
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
      // Perpendicular (normal in xz plane)
      const nx = -tz, nz = tx;

      // Gentle width variation over the river length
      const hw = river.width * (0.8 + 0.2 * Math.sin(accLen * 0.005));
      const cx = pts[i].x, cz = pts[i].z;

      // Water height: sample channel centre and sit just above the carved floor
      // With deep carving (28m), water sits well below natural banks
      const hC = getTerrainHeightFn(cx, cz);
      const h = hC + 6.0; // water surface 2 m above carved channel floor

      // Left vertex
      ribVerts.push(cx + nx * hw, h, cz + nz * hw);
      // Right vertex
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
        uDeepColor:    { value: new THREE.Color(0.03, 0.14, 0.25) },
        uHorizonColor: { value: new THREE.Color(0.72, 0.80, 0.88) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vRiverUV;
        varying vec3 vFlowNormal;

        void main() {
          vec3 pos = position;
          vRiverUV = uv;

          // Multi-component flowing ripples with flow-direction emphasis
          float flowPhase = uv.y * 12.0 - uTime * 2.5;
          float wave = sin(flowPhase) * 0.18
                     + sin(uv.y * 8.0 - uTime * 1.8 + uv.x * 3.0) * 0.10
                     + sin(uv.y * 18.0 - uTime * 3.2 + uv.x * 5.0) * 0.05
                     + sin(uv.y * 25.0 - uTime * 4.0) * 0.025
                     + sin(uv.y * 40.0 - uTime * 5.5 + uv.x * 8.0) * 0.012;
          pos.y += wave;

          // Compute flow-aware normal via finite differences
          float eps = 0.01;
          float wX = sin((uv.y) * 12.0 - uTime * 2.5) * 0.18
                   + sin((uv.y) * 8.0 - uTime * 1.8 + (uv.x + eps) * 3.0) * 0.10
                   + sin((uv.y) * 18.0 - uTime * 3.2 + (uv.x + eps) * 5.0) * 0.05
                   + sin((uv.y) * 25.0 - uTime * 4.0) * 0.025
                   + sin((uv.y) * 40.0 - uTime * 5.5 + (uv.x + eps) * 8.0) * 0.012;
          float wZ = sin((uv.y + eps) * 12.0 - uTime * 2.5) * 0.18
                   + sin((uv.y + eps) * 8.0 - uTime * 1.8 + uv.x * 3.0) * 0.10
                   + sin((uv.y + eps) * 18.0 - uTime * 3.2 + uv.x * 5.0) * 0.05
                   + sin((uv.y + eps) * 25.0 - uTime * 4.0) * 0.025
                   + sin((uv.y + eps) * 40.0 - uTime * 5.5 + uv.x * 8.0) * 0.012;
          float dWdx = (wX - wave) / eps;
          float dWdz = (wZ - wave) / eps;
          vFlowNormal = normalize(vec3(-dWdx, 1.0, -dWdz));

          vec4 wp = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wp.xyz;
          vNorm = normalize(mat3(modelMatrix) * vFlowNormal);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vFogD = length(mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uSunDir;
        uniform vec3 uSkyColor;
        uniform vec3 uDeepColor;
        uniform vec3 uHorizonColor;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vRiverUV;
        varying vec3 vFlowNormal;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float vnoise(vec2 p) {
          vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                     mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }

        void main() {
          vec3 N = normalize(vNorm);
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(uSunDir);

          float cosT = max(dot(N, V), 0.0);
          float fresnel = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);

          // Reflection with horizon blend
          vec3 R = reflect(-V, N);
          vec3 reflCol = mix(uSkyColor * 0.75, uSkyColor * 1.3, max(R.y, 0.0));
          float horizBlend = pow(1.0 - max(R.y, 0.0), 3.0);
          reflCol = mix(reflCol, uHorizonColor, horizBlend * 0.25);

          // Triple sun specular
          vec3 H = normalize(L + V);
          float NdH = max(dot(N, H), 0.0);
          float spec1 = pow(NdH, 1024.0) * 4.0;
          float spec2 = pow(NdH, 128.0) * 1.2;
          float spec3 = pow(NdH, 32.0) * 0.3;
          vec3 sunSpec = vec3(1.0, 0.97, 0.9) * (spec1 + spec2 + spec3);
          // Sun path shimmer on river
          float sunPath = pow(max(dot(R, L), 0.0), 16.0) * 0.2;
          sunSpec += vec3(1.0, 0.95, 0.80) * sunPath;
          reflCol += sunSpec;

          // River body color with edge depth gradient
          vec3 shallowCol = vec3(0.06, 0.25, 0.32);
          float edgeFade = smoothstep(0.0, 0.3, min(vRiverUV.x, 1.0 - vRiverUV.x));
          vec3 waterBody = mix(shallowCol, uDeepColor, edgeFade * 0.6);

          // Multi-octave flow caustics — stronger flowing pattern
          float flowSpeed = uTime * 0.8;
          float flow1 = vnoise(vec2(vRiverUV.y * 6.0 - flowSpeed, vRiverUV.x * 3.0)) * 0.12;
          float flow2 = vnoise(vec2(vRiverUV.y * 12.0 - flowSpeed * 1.5, vRiverUV.x * 5.0)) * 0.06;
          float flow3 = vnoise(vec2(vRiverUV.y * 24.0 - flowSpeed * 2.0, vRiverUV.x * 8.0)) * 0.03;
          float flow = flow1 + flow2 + flow3;
          waterBody += vec3(flow * 0.3, flow * 0.6, flow * 0.8);

          // Flowing foam/streak lines near edges and rapids
          float edgeProx = 1.0 - edgeFade;
          float foamPattern = vnoise(vec2(vRiverUV.x * 10.0, vRiverUV.y * 20.0 - uTime * 1.2)) * edgeProx;
          float foam = smoothstep(0.25, 0.55, foamPattern) * 0.35;
          waterBody = mix(waterBody, vec3(0.65, 0.75, 0.80), foam);

          // Flow streaks along the river — thin bright lines moving downstream
          float streak1 = smoothstep(0.48, 0.50, sin(vRiverUV.x * 30.0 + vnoise(vec2(vRiverUV.y * 4.0 - uTime * 0.6, 0.0)) * 3.0));
          float streak2 = smoothstep(0.48, 0.50, sin(vRiverUV.x * 22.0 + vnoise(vec2(vRiverUV.y * 3.0 - uTime * 0.5, 5.0)) * 4.0));
          float streaks = (streak1 + streak2) * 0.05 * edgeFade;
          waterBody += vec3(streaks);

          // SSS — enhanced for flowing water translucency
          float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.18;
          waterBody += vec3(0.0, 0.15, 0.12) * sss;

          // Sun-lit diffuse
          float diff = max(dot(N, L), 0.0) * 0.14;
          waterBody += waterBody * diff;

          vec3 col = mix(waterBody, reflCol, fresnel);

          // Fog
          float fog = 1.0 - exp(-0.00028 * 0.00028 * vFogD * vFogD);
          col = mix(col, vec3(0.78, 0.85, 0.91), clamp(fog, 0.0, 1.0));
          gl_FragColor = vec4(col, 0.88);
        }
      `,
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
