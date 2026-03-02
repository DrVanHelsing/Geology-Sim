// ================================================================
//  ATMOSPHERE SYSTEM — physical Rayleigh/Mie scattering sky,
//  sun disc, animated clouds, volumetric haze bands.
// ================================================================
import * as THREE from 'three';

const vertSky = /* glsl */ `
  varying vec3 vWorldDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldDir = normalize(wp.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragSky = /* glsl */ `
  #define PI 3.14159265359
  uniform vec3  uSunDir;
  uniform float uFogDensity;
  uniform float uTime;
  varying vec3  vWorldDir;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a*vnoise(p); p *= 2.1; a *= 0.48; }
    return v;
  }

  float rayleighPhase(float c) { return 0.75*(1.0+c*c); }
  float hgPhase(float c, float g) {
    float g2=g*g;
    return (1.0-g2)/(4.0*PI*pow(1.0+g2-2.0*g*c,1.5));
  }

  void main() {
    vec3 dir = normalize(vWorldDir);
    vec3 sun = normalize(uSunDir);
    float h = max(dir.y, 0.0);
    float cosT = dot(dir, sun);

    // Rayleigh sky
    vec3 zenith = vec3(0.18,0.38,0.78);
    vec3 horizon = vec3(0.72,0.82,0.94);
    vec3 sky = mix(horizon, zenith, pow(h, 0.45));

    // Sunset tint
    float sunsetMask = smoothstep(0.0,0.15,h)*(1.0-smoothstep(0.15,0.45,h));
    sky += vec3(1.0,0.55,0.25)*max(cosT,0.0)*max(cosT,0.0)*0.5*sunsetMask;

    // Mie glow
    sky += vec3(1.0,0.92,0.75)*hgPhase(cosT,0.76)*0.012;

    // Sun disc — bright core + multi-layer glow (rendered before clouds → naturally occluded)
    float sd = max(dot(dir, sun), 0.0);
    sky += vec3(1.0,0.98,0.92)*pow(sd,2048.0)*12.0;  // tight blazing core
    sky += vec3(1.0,0.97,0.88)*pow(sd,512.0)*5.0;    // bright inner disc
    sky += vec3(1.0,0.90,0.70)*pow(sd,128.0)*1.2;    // warm bloom ring
    sky += vec3(1.0,0.82,0.55)*pow(sd,32.0)*0.45;    // broad corona
    sky += vec3(1.0,0.70,0.40)*pow(sd,6.0)*0.18;     // atmospheric glow

    // Ground
    if (dir.y < 0.0) {
      sky = mix(sky, vec3(0.48,0.55,0.58), smoothstep(0.0,-0.08,dir.y));
    }

    // Haze bands
    if (h > 0.0 && h < 0.2) {
      vec2 huv = dir.xz/max(dir.y,0.01)*2500.0*0.0001 + uTime*0.003;
      float haze = smoothstep(0.35,0.65,fbm(huv*2.0))*0.2;
      float hf = smoothstep(0.0,0.1,h)*(1.0-smoothstep(0.1,0.2,h));
      sky = mix(sky, vec3(0.9,0.92,0.95), haze*hf);
    }

    // Clouds
    if (dir.y > 0.01) {
      vec2 cuv = dir.xz/dir.y*4500.0*0.00012 + uTime*0.005;
      float c1 = fbm(cuv*3.0)-0.35;
      float c2 = fbm(cuv*6.0+vec2(3.7,1.2))-0.45;
      float cloud = clamp(smoothstep(0.0,0.35,c1)+smoothstep(0.0,0.25,c2)*0.3,0.0,1.0);
      float cLight = 0.7+0.3*max(sun.y,0.0);
      vec3 cColor = mix(vec3(0.6,0.65,0.72), vec3(cLight), smoothstep(0.0,0.5,c1));
      sky = mix(sky, cColor, cloud*0.6*smoothstep(0.01,0.18,dir.y));
    }

    // Distance-fog perception tint for large-scale atmospheric depth
    float distanceProxy = (1.0 - max(dir.y, 0.0)) * 2200.0;
    float depthFactor = exp(-distanceProxy * uFogDensity);
    vec3 humidFogColor = vec3(0.78, 0.86, 0.92);
    sky = mix(humidFogColor, sky, clamp(depthFactor, 0.0, 1.0));

    gl_FragColor = vec4(sky, 1.0);
  }
`;

function createSummitSteamPlume() {
  const group = new THREE.Group();
  const particles = [];
  const count = 28;
  const texture = makeSoftCircleTexture();
  for (let i = 0; i < count; i++) {
    const mat = new THREE.SpriteMaterial({
      map: texture,
      color: 0xdde6ef,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const sprite = new THREE.Sprite(mat);
    const ang = (i / count) * Math.PI * 2;
    const r = 6 + (i % 7) * 2.3;
    sprite.position.set(Math.cos(ang) * r, 105 + (i % 5) * 8, Math.sin(ang) * r);
    const size = 28 + (i % 6) * 7;
    sprite.scale.set(size, size, 1);
    sprite.renderOrder = 3;
    group.add(sprite);
    particles.push({ sprite, rise: 8 + (i % 5) * 1.2, phase: i * 0.7, swirl: 2.5 + (i % 4) });
  }
  group.userData.particles = particles;
  return group;
}

function createLagoonHumidityBand(lagoon) {
  const geo = new THREE.CylinderGeometry(95, 115, 22, 48, 1, true);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xd7e8f2,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const band = new THREE.Mesh(geo, mat);
  band.position.set(lagoon.cx, 66, lagoon.cz);
  band.renderOrder = 2;
  band.userData.baseOpacity = 0.2;
  return band;
}

function createOceanFogRing(islandDef) {
  const terrainSize = islandDef?.terrain?.size ?? 2000;
  const waterLevel = islandDef?.terrain?.waterLevel ?? 42;
  const innerRadius = Math.max(terrainSize * 1.7, 4200);
  const outerRadius = innerRadius + Math.max(terrainSize * 1.4, 2800);

  const geo = new THREE.RingGeometry(innerRadius, outerRadius, 192, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xc9d9e8) },
      uAlpha: { value: 0.22 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uAlpha;
      varying vec2 vUv;
      void main() {
        float innerFade = smoothstep(0.08, 0.34, vUv.x);
        float outerFade = 1.0 - smoothstep(0.78, 1.0, vUv.x);
        float alpha = innerFade * outerFade * uAlpha;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });

  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = -Math.PI * 0.5;
  ring.position.set(0, waterLevel + 82, 0);
  ring.renderOrder = 1;
  ring.userData.baseAlpha = 0.22;
  return ring;
}

function makeSoftCircleTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size * 0.5, size * 0.5, 2, size * 0.5, size * 0.5, size * 0.5);
  grad.addColorStop(0.0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1.0, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function createAtmosphere(sunDir, islandDef) {
  const dir = sunDir ?? new THREE.Vector3(0.75, 0.4, 0.45).normalize();

  // ── Sky dome ──
  const geo = new THREE.SphereGeometry(8000, 64, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: dir },
      uFogDensity: { value: 0.00003 },
      uTime:   { value: 0 },
    },
    vertexShader: vertSky, fragmentShader: fragSky,
    side: THREE.BackSide, depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -1;

  // Sun disc is now rendered entirely in the sky dome shader (naturally behind clouds)
  // No separate 3D meshes needed — shader handles core, bloom, corona, and glow

  const effectsGroup = new THREE.Group();

  const summitSteam = createSummitSteamPlume();
  effectsGroup.add(summitSteam);

  const oceanFogRing = createOceanFogRing(islandDef);
  effectsGroup.add(oceanFogRing);

  const lagoonData = islandDef?.provinces?.lagoon;
  const lagoonHumidity = lagoonData ? createLagoonHumidityBand(lagoonData) : null;
  if (lagoonHumidity) effectsGroup.add(lagoonHumidity);

  return { mesh, material: mat, effectsGroup, summitSteam, lagoonHumidity, oceanFogRing };
}

export function updateAtmosphere(atmo, time) {
  if (!atmo) return;
  if (atmo.material) atmo.material.uniforms.uTime.value = time;

  const particles = atmo.summitSteam?.userData?.particles || [];
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const tt = time * 0.35 + p.phase;
    const riseLoop = (time * p.rise) % 180;
    const swirl = Math.sin(tt * 1.8) * p.swirl;
    p.sprite.position.x = Math.cos(tt) * (8 + swirl * 0.5);
    p.sprite.position.z = Math.sin(tt * 1.1) * (7 + swirl * 0.5);
    p.sprite.position.y = 96 + riseLoop;
    p.sprite.material.opacity = 0.1 + 0.22 * Math.max(0.0, 1.0 - riseLoop / 180);
  }

  if (atmo.lagoonHumidity) {
    const pulse = 0.85 + 0.15 * Math.sin(time * 0.7);
    atmo.lagoonHumidity.material.opacity = atmo.lagoonHumidity.userData.baseOpacity * pulse;
  }

  if (atmo.oceanFogRing?.material?.uniforms?.uAlpha) {
    const drift = 0.93 + 0.07 * Math.sin(time * 0.11);
    atmo.oceanFogRing.material.uniforms.uAlpha.value = atmo.oceanFogRing.userData.baseAlpha * drift;
  }
}
