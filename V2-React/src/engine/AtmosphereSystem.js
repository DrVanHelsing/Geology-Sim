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

    gl_FragColor = vec4(sky, 1.0);
  }
`;

export function createAtmosphere(sunDir) {
  const dir = sunDir ?? new THREE.Vector3(0.75, 0.4, 0.45).normalize();

  // ── Sky dome ──
  const geo = new THREE.SphereGeometry(8000, 64, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: dir },
      uTime:   { value: 0 },
    },
    vertexShader: vertSky, fragmentShader: fragSky,
    side: THREE.BackSide, depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -1;

  // Sun disc is now rendered entirely in the sky dome shader (naturally behind clouds)
  // No separate 3D meshes needed — shader handles core, bloom, corona, and glow

  return { mesh, material: mat };
}

export function updateAtmosphere(atmo, time) {
  if (atmo?.material) atmo.material.uniforms.uTime.value = time;
}
