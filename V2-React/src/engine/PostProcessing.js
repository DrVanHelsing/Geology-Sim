// ================================================================
//  POST-PROCESSING — SSAO + soft shadow via compositing.
//  Uses a lightweight screen-space AO implementation that works
//  well on Intel Iris Xe (no GLSL3 / MRT required).
// ================================================================
import * as THREE from 'three';

/* ── Full-screen quad helper ── */
function fullScreenQuad(mat) {
  const geo = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}

/* ── SSAO shader ── */
const ssaoVert = /* glsl */ `
  varying vec2 vUV;
  void main() {
    vUV = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const ssaoFrag = /* glsl */ `
  uniform sampler2D tDepth;
  uniform sampler2D tColor;
  uniform vec2 uResolution;
  uniform float uRadius;
  uniform float uIntensity;
  uniform mat4  uProjectionInverse;
  uniform mat4  uViewInverse;
  uniform float uNear;
  uniform float uFar;
  uniform float uTime;
  uniform vec3 uLagoon; // xz center, z=radius
  uniform float uHasLagoon;

  varying vec2 vUV;

  float linearizeDepth(float d) {
    return uNear * uFar / (uFar - d * (uFar - uNear));
  }

  vec3 reconstructViewPos(vec2 uv, float depth) {
    vec4 clip = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 view = uProjectionInverse * clip;
    return view.xyz / max(view.w, 0.0001);
  }

  // Hash for kernel rotation
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec4 baseColor = texture2D(tColor, vUV);
    float depth = texture2D(tDepth, vUV).r;

    if (depth >= 1.0) {
      gl_FragColor = baseColor;
      return;
    }

    float linearD = linearizeDepth(depth);
    vec2 texelSize = 1.0 / uResolution;

    // Distance-adaptive radius
    float adaptiveRadius = uRadius / linearD;

    float occlusion = 0.0;
    float sampleCount = 0.0;

    // 12-tap rotated kernel
    float angle = hash(vUV * uResolution) * 6.283;
    float ca = cos(angle), sa = sin(angle);
    mat2 rot = mat2(ca, -sa, sa, ca);

    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      float r = (fi + 0.5) / 12.0;
      float theta = fi * 2.3998632; // golden angle
      vec2 offset = vec2(cos(theta), sin(theta)) * r;
      offset = rot * offset * adaptiveRadius * texelSize * 24.0;

      float sampleDepth = texture2D(tDepth, vUV + offset).r;
      float sampleLinear = linearizeDepth(sampleDepth);

      float diff = linearD - sampleLinear;
      float rangeFalloff = smoothstep(0.0, 1.0, uRadius * 2.0 / (abs(diff) + 0.001));
      occlusion += step(0.02, diff) * rangeFalloff;
      sampleCount += 1.0;
    }

    occlusion = 1.0 - (occlusion / sampleCount) * uIntensity;
    occlusion = clamp(occlusion, 0.0, 1.0);
    // Soft AO application
    occlusion = occlusion * 0.5 + 0.5;

    vec3 color = baseColor.rgb * occlusion;

    // Reconstruct position for atmosphere-aware grading
    vec3 viewPos = reconstructViewPos(vUV, depth);
    vec3 worldPos = (uViewInverse * vec4(viewPos, 1.0)).xyz;
    float dist = length(viewPos);

    // Atmospheric perspective desaturation
    float distanceFactor = clamp(dist / 1500.0, 0.0, 1.0);
    color = mix(color, color * 0.8 + vec3(0.1), distanceFactor * 0.4);

    // Elevation-based mist layer (150–350 m)
    float mistBand = smoothstep(150.0, 210.0, worldPos.y) * (1.0 - smoothstep(300.0, 350.0, worldPos.y));
    float mistNoise = hash(worldPos.xz * 0.03 + vec2(uTime * 0.03, -uTime * 0.02));
    float mistAlpha = mistBand * (0.08 + mistNoise * 0.12);
    color = mix(color, vec3(0.86, 0.91, 0.95), mistAlpha);

    // Lagoon humidity fog band
    if (uHasLagoon > 0.5) {
      float lagoonDist = length(worldPos.xz - uLagoon.xy);
      float lagoonMask = 1.0 - smoothstep(uLagoon.z, uLagoon.z + 100.0, lagoonDist);
      float humidAlpha = clamp(lagoonMask * (0.15 + 0.10 * mistNoise), 0.0, 0.25);
      color = mix(color, vec3(0.82, 0.88, 0.93), humidAlpha);
    }

    gl_FragColor = vec4(color, baseColor.a);
  }
`;

/**
 * Creates a post-processing pipeline with SSAO.
 * Returns { renderTarget, ssaoTarget, ssaoMaterial, compose }
 */
export function createPostProcessing(renderer, camera) {
  const size = renderer.getSize(new THREE.Vector2());
  const w = size.x, h = size.y;

  // Main render target (color + depth)
  const colorTarget = new THREE.WebGLRenderTarget(w, h, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });
  colorTarget.depthTexture = new THREE.DepthTexture(w, h);
  colorTarget.depthTexture.type = THREE.UnsignedIntType;

  // SSAO material
  const ssaoMat = new THREE.ShaderMaterial({
    uniforms: {
      tColor:              { value: colorTarget.texture },
      tDepth:              { value: colorTarget.depthTexture },
      uResolution:         { value: new THREE.Vector2(w, h) },
      uRadius:             { value: 5.0 },
      uIntensity:          { value: 1.7 },
      uProjectionInverse:  { value: camera.projectionMatrixInverse },
      uViewInverse:        { value: camera.matrixWorld },
      uNear:               { value: camera.near },
      uFar:                { value: camera.far },
      uTime:               { value: 0 },
      uLagoon:             { value: new THREE.Vector3(0, 0, 0) },
      uHasLagoon:          { value: 0 },
    },
    vertexShader: ssaoVert,
    fragmentShader: ssaoFrag,
    depthTest: false,
    depthWrite: false,
  });

  const ssaoScene = new THREE.Scene();
  const ssaoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  ssaoScene.add(fullScreenQuad(ssaoMat));

  function resize(w2, h2) {
    colorTarget.setSize(w2, h2);
    ssaoMat.uniforms.uResolution.value.set(w2, h2);
    ssaoMat.uniforms.uNear.value = camera.near;
    ssaoMat.uniforms.uFar.value = camera.far;
  }

  function compose(scene, renderScene, ctx = {}) {
    // Pass 1: render scene to target
    renderer.setRenderTarget(colorTarget);
    renderer.render(scene, camera);

    // Pass 2: SSAO composite to screen
    ssaoMat.uniforms.uProjectionInverse.value.copy(camera.projectionMatrixInverse);
    ssaoMat.uniforms.uViewInverse.value.copy(camera.matrixWorld);
    ssaoMat.uniforms.uTime.value = ctx.time ?? 0;
    if (ctx.lagoon) {
      ssaoMat.uniforms.uLagoon.value.set(ctx.lagoon.cx, ctx.lagoon.cz, ctx.lagoon.radius ?? 56);
      ssaoMat.uniforms.uHasLagoon.value = 1;
    } else {
      ssaoMat.uniforms.uHasLagoon.value = 0;
    }
    renderer.setRenderTarget(null);
    renderer.render(ssaoScene, ssaoCamera);
  }

  return { colorTarget, ssaoMaterial: ssaoMat, resize, compose };
}
