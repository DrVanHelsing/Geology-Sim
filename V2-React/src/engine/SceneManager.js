// ================================================================
//  SCENE MANAGER — owns the Three.js lifecycle
//  Integrates: PBR terrain, expanded atlas textures, erosion,
//  physical atmosphere, Gerstner water, vegetation, SSAO post-
//  processing, and geological tools.
// ================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createNoise2D } from './noise';
import {
  buildHeightMap, buildTerrainGeometry, getTerrainHeight,
  getLayerAtPosition, getBeddingPerturbation, getFaultOffset, LAKES, RIVERS,
} from './TerrainGenerator';
import { erodeHeightmap } from './ErosionSimulator';
import { createTextureAtlases } from './TextureFactory';
import { createTerrainMaterial } from './TerrainShader';
import { createWater, animateWater, createLakeWater, createRiverWater, animateLakeWater } from './WaterSystem';
import { createAtmosphere, updateAtmosphere } from './AtmosphereSystem';
import { createVegetation } from './VegetationSystem';
import { createPostProcessing } from './PostProcessing';
import { TERRAIN_SIZE, SEGMENTS, WATER_LEVEL } from '../config/geology';

export class SceneManager {
  constructor() {
    this.scene      = null;
    this.camera     = null;
    this.renderer   = null;
    this.controls   = null;
    this.terrain    = null;
    this.terrainMat = null;
    this.water      = null;
    this.atmosphere = null;
    this.vegetation = null;
    this.heightMap  = null;
    this.noise      = null;
    this.noiseB     = null;
    this.clock      = new THREE.Clock();
    this.raycaster  = new THREE.Raycaster();
    this.mouse      = new THREE.Vector2();
    this.markersGroup = new THREE.Group();
    this.hoverMarker  = null;
    this.sunLight     = null;
    this._sunDir      = new THREE.Vector3(0.75, 0.4, 0.45).normalize();
    this._postFX      = null;

    this.activeTool = 'navigate';

    // Measure state
    this._measurePoints  = [];
    this._measureMarkers = [];
    this._measureLine    = null;

    // Cross-section state
    this._crossSectionPoints  = [];
    this._crossSectionMarkers = [];
    this._crossSectionLine    = null;

    // Strike-dip markers
    this._strikeDipMarkers = [];

    // Animated marker tracking
    this._animatedMarkers = [];

    // Callbacks
    this._hoverCbs = [];
    this._clickCbs = [];
    this._markerClickCbs = [];

    this._animId   = null;
    this._disposed = false;
  }

  // ──────────────────────────────────────────────
  //  Initialisation
  // ──────────────────────────────────────────────
  init(container, onProgress) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled  = true;
    this.renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace   = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Scene + fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xc8d8e8, 0.00028);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      55, container.clientWidth / container.clientHeight, 1, 25000,
    );
    this.camera.position.set(-400, 350, 700);

    // Controls — smooth orbit camera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping    = true;
    this.controls.dampingFactor    = 0.18;       // higher = more fluid/responsive
    this.controls.maxDistance      = 4000;
    this.controls.minDistance      = 20;
    this.controls.maxPolarAngle    = Math.PI * 0.48;  // ~88°
    this.controls.minPolarAngle    = 0.09;             // ~5°
    this.controls.enablePan        = true;
    this.controls.panSpeed         = 0.8;
    this.controls.screenSpacePanning = true;
    this.controls.keyPanSpeed      = 0;          // we handle keyboard ourselves
    this.controls.rotateSpeed      = 0.4;
    this.controls.zoomSpeed        = 1.2;        // scroll zoom only
    this.controls.mouseButtons     = {
      LEFT:   THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT:  THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    this.controls.target.set(0, 80, 0);

    // ── Keyboard state tracking for WASD/QE/+- camera ──
    this._keys = {};
    this._onKeyDown = (e) => { this._keys[e.code] = true; };
    this._onKeyUp   = (e) => { this._keys[e.code] = false; };
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);

    onProgress?.(5, 'Setting up lighting…');
    this._setupLighting();

    onProgress?.(10, 'Generating PBR textures…');
    const { albedoAtlas, normalAtlas, rmhAtlas } = createTextureAtlases();

    onProgress?.(20, 'Creating atmosphere…');
    this.atmosphere = createAtmosphere(this._sunDir);
    this.scene.add(this.atmosphere.mesh);

    onProgress?.(25, 'Building heightmap…');
    this.noise  = createNoise2D(42);
    this.noiseB = createNoise2D(137);
    this.heightMap = buildHeightMap(this.noise, this.noiseB);

    onProgress?.(35, 'Simulating erosion…');
    erodeHeightmap(this.heightMap, SEGMENTS + 1, 38000);

    onProgress?.(50, 'Constructing terrain…');
    const geo = buildTerrainGeometry(this.noise, this.heightMap);
    this.terrainMat = createTerrainMaterial(albedoAtlas, normalAtlas, rmhAtlas, {
      sunDir:       this._sunDir,
      fogColorNear: new THREE.Color(0.82, 0.86, 0.92),
      fogColorFar:  new THREE.Color(0.72, 0.80, 0.90),
      fogDensity:   0.00028,
      lakes:        LAKES,
      rivers:       RIVERS,
      waterLevel:   WATER_LEVEL,
    });
    this.terrain = new THREE.Mesh(geo, this.terrainMat);
    this.terrain.castShadow    = true;
    this.terrain.receiveShadow = true;
    this.scene.add(this.terrain);

    onProgress?.(65, 'Creating water…');
    this.water = createWater(this._sunDir);
    this.scene.add(this.water.mesh);

    onProgress?.(70, 'Creating lake surfaces…');
    const getH = (x, z) => getTerrainHeight(this.heightMap, x, z);
    this.lakeWater = createLakeWater(LAKES, getH);
    this.scene.add(this.lakeWater);

    onProgress?.(72, 'Creating river…');
    this.riverWater = createRiverWater(RIVERS, getH);
    this.scene.add(this.riverWater);

    onProgress?.(75, 'Planting vegetation…');
    this.vegetation = createVegetation(this.heightMap, this.noise);
    this.scene.add(this.vegetation);

    onProgress?.(80, 'Setting up SSAO…');
    try {
      this._postFX = createPostProcessing(this.renderer, this.camera);
    } catch (e) {
      console.warn('SSAO not available, falling back to direct render:', e);
      this._postFX = null;
    }

    onProgress?.(85, 'Preparing tools…');
    this.scene.add(this.markersGroup);
    this._createHoverMarker();
    this._setupDOMEvents(container);

    // Resize
    this._container = container;
    this._onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this._postFX?.resize(w * Math.min(window.devicePixelRatio, 2),
                           h * Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', this._onResize);

    onProgress?.(95, 'Starting renderer…');
    this._animate();
    onProgress?.(100, 'Ready!');
  }

  // ──────────────────────────────────────────────
  //  Lighting
  // ──────────────────────────────────────────────
  _setupLighting() {
    // Hemisphere light — sky/ground ambient (boosted for lower sun angle)
    this.scene.add(new THREE.HemisphereLight(0x87ceeb, 0x4e6b3c, 0.55));

    // Directional sun — aligned with the shared _sunDir vector
    this.sunLight = new THREE.DirectionalLight(0xfff4e0, 1.6);
    // Position the light along the sun direction, far enough for shadow coverage
    this.sunLight.position.copy(this._sunDir).multiplyScalar(1500);
    this.sunLight.castShadow = true;
    const s = this.sunLight.shadow;
    s.mapSize.set(2048, 2048);
    s.camera.near   =    1;
    s.camera.far    = 4000;
    s.camera.left   = -1400;
    s.camera.right  =  1400;
    s.camera.top    =  1400;
    s.camera.bottom = -1400;
    s.bias = -0.0004;
    s.normalBias = 0.02;
    this.scene.add(this.sunLight);

    // Fill light — opposite the sun for shadow softening
    const fill = new THREE.DirectionalLight(0x8fbbda, 0.35);
    fill.position.set(-300, 200, -400);
    this.scene.add(fill);

    // Rim light for terrain edge definition — warm backlight
    const rim = new THREE.DirectionalLight(0xffd0a0, 0.25);
    rim.position.set(-200, 100, 500);
    this.scene.add(rim);
  }

  // ──────────────────────────────────────────────
  //  Hover marker — animated double ring
  // ──────────────────────────────────────────────
  _createHoverMarker() {
    const group = new THREE.Group();

    // Outer ring
    const outerGeo = new THREE.RingGeometry(5, 7, 64);
    outerGeo.rotateX(-Math.PI / 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x58a6ff, transparent: true, opacity: 0.45, side: THREE.DoubleSide,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    group.add(outer);

    // Inner ring
    const innerGeo = new THREE.RingGeometry(2, 3.5, 64);
    innerGeo.rotateX(-Math.PI / 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x88ccff, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    group.add(inner);

    // Centre dot
    const dotGeo = new THREE.CircleGeometry(1, 32);
    dotGeo.rotateX(-Math.PI / 2);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xaaddff, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(dotGeo, dotMat));

    group.visible = false;
    group.userData = { outer, inner, outerMat, innerMat };
    this.hoverMarker = group;
    this.scene.add(group);
  }

  // ──────────────────────────────────────────────
  //  DOM events → engine → React
  // ──────────────────────────────────────────────
  _setupDOMEvents(container) {
    const canvas = this.renderer.domElement;

    const toolColors = {
      drill:        0xff5533,
      measure:      0xff6b6b,
      crossSection: 0x58a6ff,
      strikeDip:    0xffa500,
    };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      const hit = this._raycastTerrain();
      if (hit) {
        this.hoverMarker.position.set(hit.point.x, hit.point.y + 0.8, hit.point.z);
        this.hoverMarker.visible = this.activeTool !== 'navigate';
        // Tool-specific hover color
        const col = toolColors[this.activeTool] ?? 0x58a6ff;
        if (this.hoverMarker.userData.outerMat) {
          this.hoverMarker.userData.outerMat.color.setHex(col);
          this.hoverMarker.userData.innerMat.color.setHex(col);
        }
        this._hoverCbs.forEach((cb) => cb(hit.point));

        // Show pointer cursor when hovering over markers in navigate mode
        if (this.activeTool === 'navigate') {
          const markerHit = this._raycastMarkers();
          canvas.style.cursor = markerHit ? 'pointer' : 'grab';
        }
      } else {
        this.hoverMarker.visible = false;
      }
    });

    // Track mouse down position for drag detection
    let _mouseDownX = 0, _mouseDownY = 0;
    canvas.addEventListener('mousedown', (e) => {
      _mouseDownX = e.clientX;
      _mouseDownY = e.clientY;
    });

    canvas.addEventListener('click', (e) => {
      // Ignore clicks that are actually drags (orbit)
      const dx = e.clientX - _mouseDownX, dy = e.clientY - _mouseDownY;
      if (dx * dx + dy * dy > 16) return; // 4px threshold

      const rect = canvas.getBoundingClientRect();
      this.mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

      // In navigate mode, check for marker clicks
      if (this.activeTool === 'navigate') {
        const markerHit = this._raycastMarkers();
        if (markerHit) {
          this._markerClickCbs.forEach((cb) => cb(markerHit));
        }
        return;
      }

      const hit = this._raycastTerrain();
      if (hit) this._clickCbs.forEach((cb) => cb(hit.point));
    });

  }

  _raycastTerrain() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObject(this.terrain);
    return hits.length > 0 ? hits[0] : null;
  }

  /**
   * Raycast against all markers in the markers group.
   * Returns { type, markerId } of the closest hit marker, or null.
   */
  _raycastMarkers() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.markersGroup.children, true);
    for (const hit of hits) {
      // Walk up to find the group with marker metadata
      let obj = hit.object;
      while (obj && !obj.userData?.markerId) {
        obj = obj.parent;
      }
      if (obj?.userData?.markerId) {
        return { type: obj.userData.type, markerId: obj.userData.markerId };
      }
    }
    return null;
  }

  // ──────────────────────────────────────────────
  //  Render loop (with SSAO post-processing)
  // ──────────────────────────────────────────────
  _animate() {
    if (this._disposed) return;
    this._animId = requestAnimationFrame(() => this._animate());
    const dt = this.clock.getDelta();
    const t = this.clock.elapsedTime;

    // ── WASD/QE/+- Keyboard camera movement (Unity-style) ──
    this._handleKeyboardMovement(dt);

    this.controls.update();

    // ── Terrain-aware camera clamping ──
    this._clampCameraToTerrain();

    // ── Windmill blade animation ──
    if (this.vegetation?.userData?.windmillBlades) {
      // Rotate the blade assembly around its local Z axis (faces outward)
      this.vegetation.userData.windmillBlades.rotation.z = t * 0.8;
    }

    // ── Underwater detection: make water transparent when camera is below surface ──
    const camBelowWater = this.camera.position.y < WATER_LEVEL;
    if (this.water?.material?.uniforms?.uSubmerged) {
      this.water.material.uniforms.uSubmerged.value = camBelowWater ? 1.0 : 0.0;
    }
    // Also reduce fog when submerged so layers are visible
    if (camBelowWater) {
      this.scene.fog.density = 0.00012;
    } else {
      const targetFog = this.terrainMat?.uniforms?.uFogDensity?.value ?? 0.00028;
      this.scene.fog.density = targetFog;
    }

    animateWater(this.water, t);
    animateLakeWater(this.lakeWater, t);
    animateLakeWater(this.riverWater, t);
    if (this.terrainMat?.uniforms?.uTime) this.terrainMat.uniforms.uTime.value = t;
    updateAtmosphere(this.atmosphere, t);
    this._animateMarkers(t);

    if (this._postFX) {
      this._postFX.compose(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ──────────────────────────────────────────────
  //  WASD/QE/+- keyboard movement (ported from Unity OrbitCamera)
  //  Speed scales with camera distance for consistent feel.
  // ──────────────────────────────────────────────
  _handleKeyboardMovement(dt) {
    const k = this._keys || {};
    const tgt = this.controls.target;
    const cam = this.camera;
    const dist = cam.position.distanceTo(tgt);

    // Base speed scaled by distance — slightly faster than before
    let speed = 300 * dt * (dist / 350);
    // Shift = boost
    if (k['ShiftLeft'] || k['ShiftRight']) speed *= 2.5;

    // Camera-relative directions projected onto horizontal plane
    const fwd = new THREE.Vector3();
    cam.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    const right = new THREE.Vector3();
    right.crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();

    let moved = false;

    // Arrow keys — move the camera focus point (up/down/left/right on screen)
    if (k['ArrowUp'])    { tgt.addScaledVector(fwd, speed);    moved = true; }
    if (k['ArrowDown'])  { tgt.addScaledVector(fwd, -speed);   moved = true; }
    if (k['ArrowLeft'])  { tgt.addScaledVector(right, -speed);  moved = true; }
    if (k['ArrowRight']) { tgt.addScaledVector(right, speed);   moved = true; }

    // WASD — same movement for convenience
    if (k['KeyW']) { tgt.addScaledVector(fwd, speed);    moved = true; }
    if (k['KeyS']) { tgt.addScaledVector(fwd, -speed);   moved = true; }
    if (k['KeyA']) { tgt.addScaledVector(right, -speed);  moved = true; }
    if (k['KeyD']) { tgt.addScaledVector(right, speed);   moved = true; }

    // Q/E — vertical
    if (k['KeyQ']) { tgt.y -= speed * 0.5; moved = true; }
    if (k['KeyE']) { tgt.y += speed * 0.5; moved = true; }

    // Clamp target within terrain bounds
    if (moved) {
      const half = TERRAIN_SIZE / 2;
      tgt.x = Math.max(-half, Math.min(half, tgt.x));
      tgt.z = Math.max(-half, Math.min(half, tgt.z));
    }
  }

  // ──────────────────────────────────────────────
  //  Camera terrain clamping
  //  - Over land: camera stays above terrain surface
  //  - Over ocean: free to go below water for subsurface views
  //  IMPORTANT: never clamp camera X/Z — that fights OrbitControls
  //  and locks the view to center. Only clamp Y (height).
  // ──────────────────────────────────────────────
  _clampCameraToTerrain() {
    if (!this.heightMap) return;
    const cam = this.camera.position;
    const halfSize = TERRAIN_SIZE / 2;
    const margin = 8; // min height above terrain

    // Check if camera is over the terrain
    const overLand = Math.abs(cam.x) < halfSize && Math.abs(cam.z) < halfSize;

    if (overLand) {
      // Only clamp Y — keep camera above terrain surface
      const cx = Math.max(-halfSize + 1, Math.min(halfSize - 1, cam.x));
      const cz = Math.max(-halfSize + 1, Math.min(halfSize - 1, cam.z));
      const terrainH = getTerrainHeight(this.heightMap, cx, cz);
      const minY = terrainH + margin;
      if (cam.y < minY) {
        cam.y = minY;
      }
    } else {
      // Over ocean — allow going below water level, but not below a hard floor
      if (cam.y < -20) {
        cam.y = -20;
      }
    }

    // Clamp orbit target Y so it doesn't go underground
    const tgt = this.controls.target;
    const tgtInBounds = Math.abs(tgt.x) < halfSize && Math.abs(tgt.z) < halfSize;
    if (tgtInBounds) {
      const tx = Math.max(-halfSize + 1, Math.min(halfSize - 1, tgt.x));
      const tz = Math.max(-halfSize + 1, Math.min(halfSize - 1, tgt.z));
      const tgtH = getTerrainHeight(this.heightMap, tx, tz);
      if (tgt.y < tgtH + 2) {
        tgt.y = tgtH + 2;
      }
    }
  }

  // ──────────────────────────────────────────────
  //  Marker animations (pulsing, rotating, glowing)
  // ──────────────────────────────────────────────
  _animateMarkers(t) {
    // Hover marker pulse
    if (this.hoverMarker?.visible && this.hoverMarker.userData.outer) {
      const d = this.hoverMarker.userData;
      const s = 1 + Math.sin(t * 4) * 0.12;
      d.outer.scale.set(s, 1, s);
      d.inner.scale.set(1 / s, 1, 1 / s);
      d.outerMat.opacity = 0.3 + Math.sin(t * 3) * 0.15;
      d.innerMat.opacity = 0.25 + Math.sin(t * 5) * 0.1;
    }

    // Animated tool markers
    for (const marker of this._animatedMarkers) {
      const d = marker.userData;
      const dt = (performance.now() - d.t0) / 1000;

      if (d.type === 'drill') {
        // Pulse ground ring + glow disc
        if (d.ring) d.ring.material.opacity = 0.35 + Math.sin(dt * 3) * 0.2;
        if (d.disc) d.disc.material.opacity = 0.12 + Math.sin(dt * 2) * 0.08;
        // Rotate collar
        if (d.collar) d.collar.rotation.y = dt * 2;
        // Pulse beacon
        if (d.beacon) d.beacon.material.emissiveIntensity = 0.3 + Math.sin(dt * 4) * 0.3;
      }
      else if (d.type === 'measure') {
        // Pulse ring scale
        if (d.ring) {
          const s = 1 + Math.sin(dt * 3) * 0.15;
          d.ring.scale.set(s, 1, s);
          d.ring.material.opacity = 0.3 + Math.sin(dt * 2.5) * 0.2;
        }
        // Pulse sphere emissive
        if (d.sphereMat) d.sphereMat.emissiveIntensity = 0.2 + Math.sin(dt * 4) * 0.2;
      }
      else if (d.type === 'crossSection') {
        // Pulse beacon
        if (d.beaconMat) d.beaconMat.emissiveIntensity = 0.3 + Math.sin(dt * 3) * 0.3;
        // Pulse base ring
        if (d.ring) {
          const s = 1 + Math.sin(dt * 2.5) * 0.12;
          d.ring.scale.set(s, 1, s);
          d.ring.material.opacity = 0.3 + Math.sin(dt * 3) * 0.15;
        }
        // Pulse pillar opacity
        if (d.pillarMat) d.pillarMat.opacity = 0.5 + Math.sin(dt * 2) * 0.15;
      }
      else if (d.type === 'strikeDip') {
        // Pulse disc
        if (d.disc) d.disc.material.opacity = 0.12 + Math.sin(dt * 2) * 0.08;
        // Pulse centre
        if (d.centreMat) d.centreMat.emissiveIntensity = 0.2 + Math.sin(dt * 3) * 0.2;
      }
    }
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API — Tool control
  // ──────────────────────────────────────────────
  setActiveTool(tool) {
    this.activeTool = tool;
    if (tool === 'navigate') {
      // Full controls: left-rotate, right-pan, scroll-zoom
      this.controls.enabled       = true;
      this.controls.enableRotate  = true;
      this.controls.enableZoom    = true;
      this.controls.enablePan     = true;
      this.renderer.domElement.style.cursor = 'grab';
    } else {
      // Tool mode: disable left-rotate (used for tool clicks)
      // but keep right-click pan and scroll zoom so user can
      // reposition the view while using a tool
      this.controls.enabled       = true;
      this.controls.enableRotate  = false;
      this.controls.enableZoom    = true;
      this.controls.enablePan     = true;
      this.renderer.domElement.style.cursor = 'crosshair';
    }
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API — Event subscriptions
  // ──────────────────────────────────────────────
  onHover(cb) {
    this._hoverCbs.push(cb);
    return () => { this._hoverCbs = this._hoverCbs.filter((c) => c !== cb); };
  }
  onClick(cb) {
    this._clickCbs.push(cb);
    return () => { this._clickCbs = this._clickCbs.filter((c) => c !== cb); };
  }
  onMarkerClick(cb) {
    this._markerClickCbs.push(cb);
    return () => { this._markerClickCbs = this._markerClickCbs.filter((c) => c !== cb); };
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API — Camera data
  // ──────────────────────────────────────────────
  getCameraDirection() {
    const d = new THREE.Vector3();
    this.camera.getWorldDirection(d);
    return d;
  }
  getCameraPosition() { return this.camera.position.clone(); }
  getControlsTarget()  { return this.controls.target.clone(); }
  getScaleData() {
    const fov  = this.camera.fov * Math.PI / 180;
    const dist = this.camera.position.distanceTo(this.controls.target);
    return { worldPerPixel: 2 * Math.tan(fov / 2) * dist / this.renderer.domElement.clientHeight };
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API — Geology helpers
  // ──────────────────────────────────────────────
  getLayerAt(wx, elev, wz) {
    return getLayerAtPosition(this.noise, wx, elev, wz);
  }
  getTerrainHeightAt(wx, wz) {
    return getTerrainHeight(this.heightMap, wx, wz);
  }
  getBeddingAt(wx, wz) {
    return getBeddingPerturbation(this.noise, wx, wz) + getFaultOffset(wx);
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API — Markers
  // ──────────────────────────────────────────────
  addDrillMarker(position, markerId) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);

    // Ground impact ring (pulsing)
    const ringGeo = new THREE.RingGeometry(2.5, 4.5, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff5533, transparent: true, opacity: 0.55, side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.2;
    group.add(ring);

    // Inner glow disc
    const discGeo = new THREE.CircleGeometry(2.5, 48);
    discGeo.rotateX(-Math.PI / 2);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xff8844, transparent: true, opacity: 0.2, side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.15;
    group.add(disc);

    // Drill shaft (metallic tube)
    const shaftGeo = new THREE.CylinderGeometry(0.6, 0.6, 18, 12);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x889099, roughness: 0.25, metalness: 0.85,
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 9;
    shaft.castShadow = true;
    group.add(shaft);

    // Chuck collar (rotating band at top)
    const collarGeo = new THREE.CylinderGeometry(1.4, 1.2, 2.5, 12);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xcc3322, roughness: 0.35, metalness: 0.6,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = 19.5;
    collar.castShadow = true;
    group.add(collar);

    // Drill bit (cone at ground)
    const bitGeo = new THREE.ConeGeometry(0.9, 2.5, 8);
    const bitMat = new THREE.MeshStandardMaterial({
      color: 0x556066, roughness: 0.2, metalness: 0.9,
    });
    const bit = new THREE.Mesh(bitGeo, bitMat);
    bit.rotation.x = Math.PI;
    bit.position.y = -1;
    group.add(bit);

    // Top beacon sphere
    const beaconGeo = new THREE.SphereGeometry(1, 12, 8);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xff4422, roughness: 0.3, emissive: 0x661100, emissiveIntensity: 0.5,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 21.5;
    group.add(beacon);

    // Tripod legs
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const legGeo = new THREE.CylinderGeometry(0.2, 0.25, 22, 6);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x666677, roughness: 0.5, metalness: 0.6 });
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(Math.cos(a) * 3.5, 9, Math.sin(a) * 3.5);
      leg.rotation.z = Math.cos(a) * 0.18;
      leg.rotation.x = Math.sin(a) * 0.18;
      leg.castShadow = true;
      group.add(leg);
    }

    group.userData = { type: 'drill', markerId, ring, disc, collar, beacon, t0: performance.now() };
    this._animatedMarkers.push(group);
    this.markersGroup.add(group);
    return group;
  }

  addMeasurePoint(point, markerId) {
    this._measurePoints.push(point.clone());

    const group = new THREE.Group();
    group.position.set(point.x, point.y, point.z);

    // Outer pulsing ring
    const ringGeo = new THREE.RingGeometry(3, 4.5, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff6b6b, transparent: true, opacity: 0.45, side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.3;
    group.add(ring);

    // Core glowing sphere
    const sphereGeo = new THREE.SphereGeometry(2.5, 24, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xff5555, roughness: 0.25, emissive: 0x661111, emissiveIntensity: 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 4;
    group.add(sphere);

    // Vertical pin
    const pinGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 6);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xcc4444, roughness: 0.3, metalness: 0.7 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.y = 2;
    group.add(pin);

    group.userData = { type: 'measure', markerId, ring, sphere, sphereMat, t0: performance.now() };
    this._animatedMarkers.push(group);
    this.markersGroup.add(group);
    this._measureMarkers.push(group);
    return this._measurePoints.length;
  }
  getMeasurePoints() { return this._measurePoints; }

  addMeasureLine(a, b, markerId) {
    // Curved dashed line between points
    const points = [];
    const segs = 40;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      points.push(new THREE.Vector3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t + 2 + Math.sin(t * Math.PI) * 3,
        a.z + (b.z - a.z) * t,
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: 0xff6b6b, dashSize: 3, gapSize: 1.5,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    this.markersGroup.add(line);
    this._measureLine = line;
    this._measureLine.userData = { type: 'measure', markerId };

    // Distance label sprite (high-res canvas)
    const dist = a.distanceTo(b);
    const elevDiff = Math.abs(a.y - b.y);
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(20, 10, 10, 0.82)';
    ctx.fillRect(0, 0, 512, 160);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 152);
    ctx.fillStyle = '#ffaaaa';
    ctx.font = 'bold 54px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${dist.toFixed(1)} m`, 256, 68);
    ctx.fillStyle = '#ffcccc';
    ctx.font = '38px Arial';
    ctx.fillText(`\u0394elev: ${elevDiff.toFixed(1)} m`, 256, 124);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    sprite.position.set(mid.x, Math.max(a.y, b.y) + 14, mid.z);
    sprite.scale.set(22, 7, 1);
    this.markersGroup.add(sprite);
    this._measureLine._sprite = sprite;
  }

  clearMeasure() {
    this._measureMarkers.forEach((m) => {
      this.markersGroup.remove(m);
      m.traverse((c) => { c.geometry?.dispose(); c.material?.dispose(); });
    });
    if (this._measureLine) {
      this.markersGroup.remove(this._measureLine);
      this._measureLine.geometry?.dispose();
      this._measureLine.material?.dispose();
      if (this._measureLine._sprite) {
        this.markersGroup.remove(this._measureLine._sprite);
        this._measureLine._sprite.material.map?.dispose();
        this._measureLine._sprite.material.dispose();
      }
    }
    this._animatedMarkers = this._animatedMarkers.filter((m) => !this._measureMarkers.includes(m));
    this._measurePoints = []; this._measureMarkers = []; this._measureLine = null;
  }

  addCrossSectionPoint(point) {
    this._crossSectionPoints.push(point.clone());

    const group = new THREE.Group();
    group.position.set(point.x, point.y, point.z);

    // Semi-transparent glowing pillar
    const pillarGeo = new THREE.CylinderGeometry(1, 1.5, 16, 12);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x3388ff, roughness: 0.3, emissive: 0x112255, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.65,
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 8;
    group.add(pillar);

    // Top beacon sphere
    const beaconGeo = new THREE.SphereGeometry(1.5, 12, 8);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x66aaff, roughness: 0.2, emissive: 0x2244aa, emissiveIntensity: 0.5,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 17;
    group.add(beacon);

    // Base ring
    const ringGeo = new THREE.RingGeometry(2, 4, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x58a6ff, transparent: true, opacity: 0.45, side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.3;
    group.add(ring);

    // Point number label (high-res canvas)
    const num = this._crossSectionPoints.length;
    const canvas = document.createElement('canvas');
    canvas.width = 192; canvas.height = 192;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(10, 20, 50, 0.85)';
    ctx.fillRect(0, 0, 192, 192);
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 184, 184);
    ctx.fillStyle = '#aaddff';
    ctx.font = 'bold 110px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), 96, 100);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.y = 20;
    sprite.scale.set(5, 5, 1);
    group.add(sprite);

    group.userData = { type: 'crossSection', pillar, pillarMat, beacon, beaconMat, ring, t0: performance.now() };
    this._animatedMarkers.push(group);
    this.markersGroup.add(group);
    this._crossSectionMarkers.push(group);

    // If 2 points, draw terrain-following connecting line
    if (this._crossSectionPoints.length === 2) {
      this._drawCrossSectionLine();
    }

    return this._crossSectionPoints.length;
  }

  _drawCrossSectionLine() {
    if (this._crossSectionLine) {
      this.markersGroup.remove(this._crossSectionLine);
      this._crossSectionLine.geometry?.dispose();
      this._crossSectionLine.material?.dispose();
    }
    const [a, b] = this._crossSectionPoints;
    const points = [];
    const segs = 60;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const x = a.x + (b.x - a.x) * t;
      const z = a.z + (b.z - a.z) * t;
      const h = this.getTerrainHeightAt(x, z);
      points.push(new THREE.Vector3(x, h + 1.5, z));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: 0x58a6ff, dashSize: 4, gapSize: 2,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    this.markersGroup.add(line);
    this._crossSectionLine = line;
  }

  getCrossSectionPoints() { return this._crossSectionPoints; }
  clearCrossSection() {
    this._crossSectionMarkers.forEach((m) => {
      this.markersGroup.remove(m);
      m.traverse((c) => { c.geometry?.dispose(); c.material?.dispose(); });
    });
    if (this._crossSectionLine) {
      this.markersGroup.remove(this._crossSectionLine);
      this._crossSectionLine.geometry?.dispose();
      this._crossSectionLine.material?.dispose();
      this._crossSectionLine = null;
    }
    this._animatedMarkers = this._animatedMarkers.filter((m) => !this._crossSectionMarkers.includes(m));
    this._crossSectionPoints = []; this._crossSectionMarkers = [];
  }

  addStrikeDipMarker(position, strikeAngle, markerId) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y + 1.5, position.z);
    const strikeRad = (90 - strikeAngle) * Math.PI / 180;

    // Bedding plane disc (semi-transparent)
    const discGeo = new THREE.CircleGeometry(9, 64);
    discGeo.rotateX(-Math.PI / 2);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xffa500, transparent: true, opacity: 0.2, side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.3;
    group.add(disc);

    // Strike line (bold orange)
    const len = 14;
    const strikePts = [
      new THREE.Vector3(-Math.cos(strikeRad) * len, 0, Math.sin(strikeRad) * len),
      new THREE.Vector3(Math.cos(strikeRad) * len, 0, -Math.sin(strikeRad) * len),
    ];
    const strikeGeo = new THREE.BufferGeometry().setFromPoints(strikePts);
    group.add(new THREE.Line(strikeGeo, new THREE.LineBasicMaterial({ color: 0xffaa22, linewidth: 2 })));

    // Strike endpoint spheres (arrows)
    const endGeo = new THREE.SphereGeometry(0.7, 8, 6);
    const endMat = new THREE.MeshStandardMaterial({ color: 0xffaa22, roughness: 0.3, emissive: 0x553300, emissiveIntensity: 0.3 });
    for (const pt of strikePts) {
      const e = new THREE.Mesh(endGeo, endMat);
      e.position.copy(pt);
      group.add(e);
    }

    // Dip direction line (perpendicular, shorter)
    const dipRad = strikeRad - Math.PI / 2;
    const dipLen = 9;
    const dipEnd = new THREE.Vector3(Math.cos(dipRad) * dipLen, 0, -Math.sin(dipRad) * dipLen);
    const dipPts = [new THREE.Vector3(0, 0, 0), dipEnd];
    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(dipPts),
      new THREE.LineBasicMaterial({ color: 0xff6622, linewidth: 2 }),
    ));

    // Dip arrow tip sphere
    const dipTipGeo = new THREE.SphereGeometry(0.55, 8, 6);
    const dipTipMat = new THREE.MeshStandardMaterial({ color: 0xff6622, roughness: 0.3, emissive: 0x441100, emissiveIntensity: 0.3 });
    const dipTip = new THREE.Mesh(dipTipGeo, dipTipMat);
    dipTip.position.copy(dipEnd);
    group.add(dipTip);

    // Centre marker sphere
    const centreGeo = new THREE.SphereGeometry(1.2, 12, 8);
    const centreMat = new THREE.MeshStandardMaterial({
      color: 0xffcc44, roughness: 0.3, emissive: 0x664400, emissiveIntensity: 0.4,
    });
    const centre = new THREE.Mesh(centreGeo, centreMat);
    group.add(centre);

    // Angle label sprite (high-res canvas)
    const canvas = document.createElement('canvas');
    canvas.width = 384; canvas.height = 192;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(30, 15, 0, 0.85)';
    ctx.fillRect(0, 0, 384, 192);
    ctx.strokeStyle = '#ffaa44';
    ctx.lineWidth = 5;
    ctx.strokeRect(4, 4, 376, 184);
    ctx.fillStyle = '#ffdd88';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`S: ${Math.round(strikeAngle)}\u00B0`, 192, 100);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.y = 7;
    sprite.scale.set(10, 5, 1);
    group.add(sprite);

    group.userData = { type: 'strikeDip', markerId, disc, centre, centreMat, t0: performance.now() };
    this._animatedMarkers.push(group);
    this.markersGroup.add(group);
    this._strikeDipMarkers.push(group);
    return group;
  }
  clearStrikeDip() {
    this._strikeDipMarkers.forEach((g) => {
      g.traverse((c) => { c.geometry?.dispose(); c.material?.dispose(); });
      this.markersGroup.remove(g);
    });
    this._animatedMarkers = this._animatedMarkers.filter((m) => !this._strikeDipMarkers.includes(m));
    this._strikeDipMarkers = [];
  }

  /**
   * Remove a single marker by its markerId (works for any type).
   */
  removeMarkerById(markerId) {
    const allGroups = [...this.markersGroup.children];
    for (const group of allGroups) {
      if (group.userData?.markerId === markerId) {
        group.traverse((c) => { c.geometry?.dispose(); c.material?.dispose(); });
        this.markersGroup.remove(group);
        this._animatedMarkers = this._animatedMarkers.filter((m) => m !== group);
        this._strikeDipMarkers = this._strikeDipMarkers.filter((m) => m !== group);
        this._measureMarkers = this._measureMarkers.filter((m) => m !== group);
        // Also clean up associated measure line/sprite
        if (this._measureLine?.userData?.markerId === markerId) {
          this.markersGroup.remove(this._measureLine);
          this._measureLine.geometry?.dispose();
          this._measureLine.material?.dispose();
          if (this._measureLine._sprite) {
            this.markersGroup.remove(this._measureLine._sprite);
            this._measureLine._sprite.material.map?.dispose();
            this._measureLine._sprite.material.dispose();
          }
          this._measureLine = null;
        }
      }
    }
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API — Settings
  // ──────────────────────────────────────────────
  updateWaterLevel(level)  { if (this.water) this.water.mesh.position.y = level; }
  updateFogDensity(d) {
    this.scene.fog.density = d;
    if (this.terrainMat) this.terrainMat.uniforms.uFogDensity.value = d;
    if (this.water?.material) this.water.material.uniforms.uFogDensity.value = d;
  }
  updateSunElevation(deg) {
    const r = deg * Math.PI / 180;
    const pos = new THREE.Vector3(750*Math.cos(r*0.3), 400*Math.sin(r), 450*Math.cos(r*0.5));
    this.sunLight.position.copy(pos.clone().normalize().multiplyScalar(1500));
    const dir = pos.clone().normalize();
    this._sunDir.copy(dir);
    if (this.terrainMat) this.terrainMat.uniforms.uSunDir.value.copy(dir);
    if (this.water?.material) this.water.material.uniforms.uSunDir.value.copy(dir);
    if (this.atmosphere?.material) this.atmosphere.material.uniforms.uSunDir.value.copy(dir);
  }

  // ──────────────────────────────────────────────
  //  Cleanup
  // ──────────────────────────────────────────────
  dispose() {
    this._disposed = true;
    if (this._animId) cancelAnimationFrame(this._animId);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this.controls.dispose();
    this._postFX?.colorTarget?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
