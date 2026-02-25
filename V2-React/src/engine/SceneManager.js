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
    this._hemiLight    = null;
    this._fillLight    = null;
    this._rimLight     = null;
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
    this._pinchDist = null;
    this._touchHandlers     = null;
    this._joystick          = null;   // null | { anchorX, anchorY, knobX, knobY, dx, dy }
    this._joystickTouchId   = null;   // which touch ID drives the joystick
    this._joystickChangeCbs = [];     // callbacks for joystick visual
  }

  // ──────────────────────────────────────────────
  //  Initialisation
  // ──────────────────────────────────────────────
  init(container, onProgress) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);  // full native resolution
    this.renderer.shadowMap.enabled  = true;
    this.renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.6;
    this.renderer.outputColorSpace   = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Scene + fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xd0e0f0, 0.00018);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      55, container.clientWidth / container.clientHeight, 0.1, 25000,
    );
    this.camera.position.set(-400, 350, 700);

    // Controls — smooth orbit camera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping    = true;
    this.controls.dampingFactor    = 0.12;
    this.controls.maxDistance      = 4000;
    this.controls.minDistance      = 0.5;         // allow very close-up views
    this.controls.maxPolarAngle    = Math.PI * 0.49;  // ~88°
    this.controls.minPolarAngle    = 0.05;             // ~3°
    this.controls.enablePan        = true;
    this.controls.panSpeed         = 0.8;
    this.controls.screenSpacePanning = true;
    this.controls.keyPanSpeed      = 0;          // we handle keyboard ourselves
    this.controls.rotateSpeed      = 0.5;
    this.controls.zoomSpeed        = 1.4;
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

    // ── Scroll-wheel: dolly camera forward/backward along look direction ──
    this._onWheel = (e) => {
      // Let OrbitControls handle its own zoom; we add a forward dolly on top
      // Only if we want to override completely, uncomment below:
      // e.preventDefault();
    };
    // (Scroll zoom is already handled by OrbitControls zoomSpeed above)

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
    // Hemisphere light — sky/ground ambient
    this._hemiLight = new THREE.HemisphereLight(0x9ad8f0, 0x5e8b44, 1.25);
    this.scene.add(this._hemiLight);

    // Directional sun — aligned with the shared _sunDir vector
    this.sunLight = new THREE.DirectionalLight(0xfff8e8, 3.0);
    this.sunLight.position.copy(this._sunDir).multiplyScalar(1500);
    this.sunLight.castShadow = true;
    const s = this.sunLight.shadow;
    s.mapSize.set(4096, 4096);
    s.camera.near   =  0.5;
    s.camera.far    = 4000;
    s.camera.left   = -1400;
    s.camera.right  =  1400;
    s.camera.top    =  1400;
    s.camera.bottom = -1400;
    s.bias = -0.0004;
    s.normalBias = 0.02;
    this.scene.add(this.sunLight);

    // Fill light — opposite the sun for shadow softening
    this._fillLight = new THREE.DirectionalLight(0xa0ccee, 0.75);
    this._fillLight.position.set(-300, 200, -400);
    this.scene.add(this._fillLight);

    // Rim light for terrain edge definition — warm backlight
    this._rimLight = new THREE.DirectionalLight(0xffe0b0, 0.6);
    this._rimLight.position.set(-200, 100, 500);
    this.scene.add(this._rimLight);
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
        // Align hover marker parallel to the terrain surface
        if (hit.face) {
          const normal = hit.face.normal.clone().transformDirection(this.terrain.matrixWorld).normalize();
          this.hoverMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        }
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

    // ── Touch controls (mobile) ──────────────────────────────
    this._setupTouchControls(canvas);
  }

  // ──────────────────────────────────────────────
  //  Touch controls (mobile)
  //  Left half viewport  → physical camera movement (walk/strafe)
  //  Right half viewport → orbit / rotate
  //  Two-finger pinch    → zoom
  // ──────────────────────────────────────────────
  _setupTouchControls(canvas) {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    // Disable OrbitControls built-in touch so we manage everything ourselves
    this.controls.touches = { ONE: null, TWO: null };

    // Active touch map: id → { x, y, startX, startY, zone }
    const activeTouches = new Map();

    const getZone = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      return clientX < rect.left + rect.width / 2 ? 'left' : 'right';
    };

    const handleStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      for (const t of e.changedTouches) {
        const zone = getZone(t.clientX);
        activeTouches.set(t.identifier, {
          x: t.clientX, y: t.clientY,
          startX: t.clientX, startY: t.clientY,
          zone,
        });
        // Start joystick for first left-zone touch
        if (zone === 'left' && this._joystickTouchId === null) {
          this._joystickTouchId = t.identifier;
          this._joystick = {
            anchorX: t.clientX, anchorY: t.clientY,
            knobX:   t.clientX, knobY:   t.clientY,
            dx: 0, dy: 0,
          };
          this._joystickChangeCbs.forEach((cb) => cb({ ...this._joystick }));
        }
      }
      // Initialise pinch tracking when 2+ fingers land; suspend joystick
      if (e.touches.length >= 2) {
        if (this._joystick) {
          this._joystick = null;
          this._joystickTouchId = null;
          this._joystickChangeCbs.forEach((cb) => cb(null));
        }
        const a = e.touches[0], b = e.touches[1];
        const dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
        this._pinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleMove = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // ── Two-finger pinch zoom ──────────────────────────────
      if (e.touches.length >= 2) {
        // Suspend joystick during pinch
        if (this._joystick) {
          this._joystick = null;
          this._joystickTouchId = null;
          this._joystickChangeCbs.forEach((cb) => cb(null));
        }
        const a = e.touches[0], b = e.touches[1];
        const dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        if (this._pinchDist !== null && this._pinchDist > 0) {
          const scale = newDist / this._pinchDist;
          const camToTarget = this.camera.position.clone().sub(this.controls.target);
          const currentDist = camToTarget.length();
          const newCamDist = Math.max(
            this.controls.minDistance,
            Math.min(this.controls.maxDistance, currentDist / scale),
          );
          camToTarget.setLength(newCamDist);
          this.camera.position.copy(this.controls.target).add(camToTarget);
          this.controls.update();
        }
        this._pinchDist = newDist;
        for (const t of e.changedTouches) {
          const s = activeTouches.get(t.identifier);
          if (s) { s.x = t.clientX; s.y = t.clientY; }
        }
        return;
      }

      this._pinchDist = null;

      // ── Single-touch movement ──────────────────────────────
      for (const t of e.changedTouches) {
        const state = activeTouches.get(t.identifier);
        if (!state) continue;

        const dx = t.clientX - state.x;
        const dy = t.clientY - state.y;
        state.x = t.clientX;
        state.y = t.clientY;

        if (state.zone === 'left') {
          // ── Joystick: update state — movement applied in _animate ─
          if (this._joystick && t.identifier === this._joystickTouchId) {
            const maxR   = 65;
            const offX   = t.clientX - this._joystick.anchorX;
            const offY   = t.clientY - this._joystick.anchorY;
            const dist   = Math.sqrt(offX * offX + offY * offY);
            const clamp  = Math.min(dist, maxR);
            const nx     = dist > 0.5 ? offX / dist : 0;
            const ny     = dist > 0.5 ? offY / dist : 0;
            this._joystick.dx    = nx * (clamp / maxR);
            this._joystick.dy    = ny * (clamp / maxR);
            this._joystick.knobX = this._joystick.anchorX + nx * clamp;
            this._joystick.knobY = this._joystick.anchorY + ny * clamp;
            this._joystickChangeCbs.forEach((cb) => cb({ ...this._joystick }));
          }
        } else {
          // ── Orbit / rotate ────────────────────────────────
          const offset = this.camera.position.clone().sub(this.controls.target);
          const spherical = new THREE.Spherical().setFromVector3(offset);
          spherical.theta -= dx * 0.006;
          spherical.phi   -= dy * 0.006;
          spherical.phi = Math.max(
            this.controls.minPolarAngle,
            Math.min(this.controls.maxPolarAngle, spherical.phi),
          );
          spherical.makeSafe();
          offset.setFromSpherical(spherical);
          this.camera.position.copy(this.controls.target).add(offset);
          this.camera.lookAt(this.controls.target);
        }

        this.controls.update();
      }
    };

    const handleEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = canvas.getBoundingClientRect();
      for (const t of e.changedTouches) {
        const state = activeTouches.get(t.identifier);
        if (!state) continue;

        // Tap detection: minimal movement → fire click/tool action
        const ddx = t.clientX - state.startX;
        const ddy = t.clientY - state.startY;
        if (ddx * ddx + ddy * ddy < 144) { // 12 px threshold
          this.mouse.x =  ((t.clientX - rect.left) / rect.width)  * 2 - 1;
          this.mouse.y = -((t.clientY - rect.top)  / rect.height) * 2 + 1;
          if (this.activeTool === 'navigate') {
            const markerHit = this._raycastMarkers();
            if (markerHit) this._markerClickCbs.forEach((cb) => cb(markerHit));
          } else {
            const hit = this._raycastTerrain();
            if (hit) this._clickCbs.forEach((cb) => cb(hit.point));
          }
        }
        // Clear joystick when its controlling finger lifts
        if (t.identifier === this._joystickTouchId) {
          this._joystick = null;
          this._joystickTouchId = null;
          this._joystickChangeCbs.forEach((cb) => cb(null));
        }
        activeTouches.delete(t.identifier);
      }
      if (e.touches.length < 2) this._pinchDist = null;
    };

    const handleCancel = (e) => {
      e.preventDefault();
      activeTouches.clear();
      this._pinchDist = null;
      this._joystick = null;
      this._joystickTouchId = null;
      this._joystickChangeCbs.forEach((cb) => cb(null));
    };

    canvas.addEventListener('touchstart',  handleStart,  { passive: false, capture: true });
    canvas.addEventListener('touchmove',   handleMove,   { passive: false, capture: true });
    canvas.addEventListener('touchend',    handleEnd,    { passive: false, capture: true });
    canvas.addEventListener('touchcancel', handleCancel, { passive: false, capture: true });

    this._touchHandlers = { handleStart, handleMove, handleEnd, handleCancel };
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

    // ── Billboard chaser-light animation ──
    if (this.vegetation?.userData?.billboardBulbs) {
      const bulbs = this.vegetation.userData.billboardBulbs;
      const speed = 4.0;          // chase cycles per second
      const numBulbs = bulbs.length;
      for (let i = 0; i < numBulbs; i++) {
        const b = bulbs[i];
        // Chaser wave: each bulb pulses on/off in sequence
        const wave = Math.sin(t * speed * Math.PI * 2 - (b.index / numBulbs) * Math.PI * 2);
        const brightness = 0.3 + 0.7 * Math.max(0, wave); // 0.3 dim → 1.0 bright
        b.mesh.material.emissiveIntensity = brightness * 2.0;
        // Scale slightly when bright for a "pop" effect
        const s = 0.85 + brightness * 0.25;
        b.mesh.scale.setScalar(s);
      }
      // Pulse the main billboard point light subtly
      if (this.vegetation.userData.billboardLight) {
        this.vegetation.userData.billboardLight.intensity = 3.0 + Math.sin(t * 3.0) * 0.8;
      }
      if (this.vegetation.userData.billboardAccent) {
        this.vegetation.userData.billboardAccent.intensity = 1.8 + Math.sin(t * 2.5 + 1.0) * 0.6;
      }
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

    if (this._postFX && this._ssaoEnabled !== false) {
      this._postFX.compose(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ──────────────────────────────────────────────
  //  WASD/Arrow keyboard movement — physically moves the camera
  //  across the map. Speed is CONSTANT so it doesn't bottleneck
  //  when the camera is near the ground.
  // ──────────────────────────────────────────────
  _handleKeyboardMovement(dt) {
    const k = this._keys || {};
    const tgt = this.controls.target;
    const cam = this.camera;

    // Constant base speed — NOT scaled by distance
    let speed = 180 * dt * (this._cameraSpeedMultiplier || 1.0);
    // Shift = boost
    if (k['ShiftLeft'] || k['ShiftRight']) speed *= 3.0;

    // Camera-relative directions projected onto horizontal plane
    const fwd = new THREE.Vector3();
    cam.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    const right = new THREE.Vector3();
    right.crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();

    let dx = 0, dz = 0, dy = 0;

    // Arrow keys — move camera physically across the map
    if (k['ArrowUp'])    { dx += fwd.x * speed;    dz += fwd.z * speed; }
    if (k['ArrowDown'])  { dx -= fwd.x * speed;    dz -= fwd.z * speed; }
    if (k['ArrowLeft'])  { dx -= right.x * speed;  dz -= right.z * speed; }
    if (k['ArrowRight']) { dx += right.x * speed;  dz += right.z * speed; }

    // WASD — same movement
    if (k['KeyW']) { dx += fwd.x * speed;   dz += fwd.z * speed; }
    if (k['KeyS']) { dx -= fwd.x * speed;   dz -= fwd.z * speed; }
    if (k['KeyA']) { dx -= right.x * speed; dz -= right.z * speed; }
    if (k['KeyD']) { dx += right.x * speed; dz += right.z * speed; }

    // Q/E — vertical
    if (k['KeyQ']) { dy -= speed * 0.6; }
    if (k['KeyE']) { dy += speed * 0.6; }

    // Virtual joystick — continuous movement while finger is held
    if (this._joystick && (this._joystick.dx !== 0 || this._joystick.dy !== 0)) {
      const jSpeed = 180 * dt * (this._cameraSpeedMultiplier || 1.0);
      dx += (this._joystick.dx * right.x - this._joystick.dy * fwd.x) * jSpeed;
      dz += (this._joystick.dx * right.z - this._joystick.dy * fwd.z) * jSpeed;
    }

    if (dx !== 0 || dy !== 0 || dz !== 0) {
      // Move both camera and orbit target together (physical movement)
      cam.position.x += dx;
      cam.position.y += dy;
      cam.position.z += dz;
      tgt.x += dx;
      tgt.y += dy;
      tgt.z += dz;

      // Clamp within terrain bounds
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

    // Check if camera is over the terrain
    const overLand = Math.abs(cam.x) < halfSize && Math.abs(cam.z) < halfSize;

    if (overLand) {
      // Only clamp Y — keep camera above terrain surface
      const cx = Math.max(-halfSize + 1, Math.min(halfSize - 1, cam.x));
      const cz = Math.max(-halfSize + 1, Math.min(halfSize - 1, cam.z));
      const terrainH = getTerrainHeight(this.heightMap, cx, cz);
      const minY = terrainH + 0.3;          // allow very close to ground
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
      if (tgt.y < tgtH + 0.5) {
        tgt.y = tgtH + 0.5;
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
        const inten = d.intensity || 1;
        // Pulse disc — stronger with steeper dip
        if (d.disc) d.disc.material.opacity = 0.06 + inten * 0.08 + Math.sin(dt * (1.5 + inten)) * 0.04 * inten;
        // Pulse centre
        if (d.centreMat) d.centreMat.emissiveIntensity = 0.15 + inten * 0.15 + Math.sin(dt * (2 + inten * 2)) * 0.25 * inten;
        // Animate pulsing chevrons along dip direction
        if (d.chevrons && d.chevrons.length > 0) {
          const speed = 1.0 + inten * 1.2;   // faster pulse for steeper dip
          const span = d.chevrons.length * 0.9;
          for (let ci = 0; ci < d.chevrons.length; ci++) {
            const chev = d.chevrons[ci];
            const phase = (dt * speed + ci * 0.9) % span;
            const t = phase / span; // 0..1
            chev.position.x = d.dipDirX * d.dipLen * t;
            chev.position.z = d.dipDirZ * d.dipLen * t;
            chev.position.y = 0.15;
            const fade = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
            chev.material.opacity = Math.max(0, fade * 0.5 * inten + fade * 0.2);
            chev.scale.setScalar((0.8 + t * 0.6) * (0.6 + inten * 0.4));
          }
        }
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
  onJoystickChange(cb) {
    this._joystickChangeCbs.push(cb);
    return () => { this._joystickChangeCbs = this._joystickChangeCbs.filter((c) => c !== cb); };
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
  addDrillMarker(position, markerId, { inclination = 0, azimuth = 0 } = {}) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);

    // Tilt group to match borehole orientation
    // inclination: degrees from vertical (0 = straight down)
    // azimuth: compass bearing CW from N (+Z)
    const incRad = inclination * Math.PI / 180;
    const azRad  = azimuth * Math.PI / 180;

    // Build a pivot that tilts the entire drill rig
    const pivot = new THREE.Group();
    // Rotate around Y to face borehole azimuth (CW from +Z/North),
    // then tilt by inclination angle away from vertical
    pivot.rotation.order = 'YXZ';
    pivot.rotation.y = azRad;          // face toward azimuth (CW from N)
    pivot.rotation.x = incRad;         // tilt away from vertical into azimuth direction

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
    pivot.add(shaft);

    // Chuck collar (rotating band at top)
    const collarGeo = new THREE.CylinderGeometry(1.4, 1.2, 2.5, 12);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xcc3322, roughness: 0.35, metalness: 0.6,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = 19.5;
    collar.castShadow = true;
    pivot.add(collar);

    // Drill bit (cone at ground)
    const bitGeo = new THREE.ConeGeometry(0.9, 2.5, 8);
    const bitMat = new THREE.MeshStandardMaterial({
      color: 0x556066, roughness: 0.2, metalness: 0.9,
    });
    const bit = new THREE.Mesh(bitGeo, bitMat);
    bit.rotation.x = Math.PI;
    bit.position.y = -1;
    pivot.add(bit);

    // Top beacon sphere
    const beaconGeo = new THREE.SphereGeometry(1, 12, 8);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xff4422, roughness: 0.3, emissive: 0x661100, emissiveIntensity: 0.5,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 21.5;
    pivot.add(beacon);

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
      pivot.add(leg);
    }

    group.add(pivot);
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

  addStrikeDipMarker(position, strikeAngle, markerId, dipDirection = 0, dipAngle = 0) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y + 1.5, position.z);
    const strikeRad = (90 - strikeAngle) * Math.PI / 180;

    // Dip direction in Three.js coords: azimuth CW from N(+Z)
    const dipDirRad = dipDirection * Math.PI / 180;
    // Unit vector pointing in dip direction (horizontal, XZ plane)
    const dipDirX = Math.sin(dipDirRad);
    const dipDirZ = Math.cos(dipDirRad);

    // ── Intensity factor driven by dip angle ──
    // 0° dip → small/subtle (0.3), 45°+ → full size/intensity (1.0)
    const dipNorm = Math.min(dipAngle / 45, 1);           // 0..1
    const intensity = 0.3 + dipNorm * 0.7;                 // 0.3..1.0
    const discRadius  = 5 + intensity * 7;                 // 5..12
    const strikeLen   = 8 + intensity * 10;                // 8..18
    const dipLen      = 6 + intensity * 10;                // 6..16
    const chevCount   = dipAngle < 10 ? 1 : dipAngle < 30 ? 2 : 3;
    const arrowScale  = 0.5 + intensity * 0.7;             // 0.5..1.2

    // Bedding plane disc (semi-transparent)
    const discGeo = new THREE.CircleGeometry(discRadius, 64);
    discGeo.rotateX(-Math.PI / 2);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xffa500, transparent: true, opacity: 0.15, side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.3;

    // ── Tilt group: rotates disc + dip arrow + chevrons to match bedding plane ──
    // The bedding plane dips by dipAngle in the dipDirection.
    // We tilt around the strike axis (horizontal line perpendicular to dip direction).
    const tiltGroup = new THREE.Group();
    // Strike axis direction (perpendicular to dip direction, in XZ plane)
    const strikeAxisX = -dipDirZ;  // rotated 90° CCW from dip direction
    const strikeAxisZ = dipDirX;
    const strikeAxis = new THREE.Vector3(strikeAxisX, 0, strikeAxisZ).normalize();
    // Tilt around strike axis — negative so disc dips downward in the dip direction
    const dipRad = dipAngle * Math.PI / 180;
    tiltGroup.quaternion.setFromAxisAngle(strikeAxis, -dipRad);
    group.add(tiltGroup);

    tiltGroup.add(disc);

    // Strike line — stays HORIZONTAL (strike is by definition the horizontal trace)
    const len = strikeLen;
    const strikePts = [
      new THREE.Vector3(-Math.cos(strikeRad) * len, 0.3, Math.sin(strikeRad) * len),
      new THREE.Vector3(Math.cos(strikeRad) * len, 0.3, -Math.sin(strikeRad) * len),
    ];
    const strikeGeo = new THREE.BufferGeometry().setFromPoints(strikePts);
    group.add(new THREE.Line(strikeGeo, new THREE.LineBasicMaterial({ color: 0xffaa22, linewidth: 1, transparent: true, opacity: 0.25 + intensity * 0.25 })));

    // Strike endpoint dots (small, subdued) — also horizontal
    const endGeo = new THREE.SphereGeometry(0.45, 8, 6);
    const endMat = new THREE.MeshStandardMaterial({ color: 0xffaa22, roughness: 0.4, transparent: true, opacity: 0.5 });
    for (const pt of strikePts) {
      const e = new THREE.Mesh(endGeo, endMat);
      e.position.copy(pt);
      group.add(e);
    }

    // ── Dip direction arrow (PRIMARY — bold, with pulsing chevrons) ──
    const dipEnd = new THREE.Vector3(dipDirX * dipLen, 0, dipDirZ * dipLen);
    // Main dip line
    tiltGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), dipEnd]),
      new THREE.LineBasicMaterial({ color: 0xff4422, linewidth: 2 }),
    ));

    // Arrow tip (cone pointing in dip direction, within tilted plane)
    const arrowGeo = new THREE.ConeGeometry(1.0 * arrowScale, 2.5 * arrowScale, 8);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0xff4422, roughness: 0.3, emissive: 0x661100, emissiveIntensity: 0.5,
    });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.position.copy(dipEnd);
    // Point cone along dip direction (in the pre-tilt local frame where Y is up)
    const arrowTarget = new THREE.Vector3(dipDirX, 0, dipDirZ).normalize();
    const arrowQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowTarget);
    arrow.quaternion.copy(arrowQ);
    tiltGroup.add(arrow);

    // Pulsing chevron rings along dip direction (animated, inside tiltGroup)
    const chevrons = [];
    for (let ci = 0; ci < chevCount; ci++) {
      const chevR = 0.6 * arrowScale;
      const chevGeo = new THREE.RingGeometry(chevR, chevR + 0.6 * arrowScale, 16, 1, 0, Math.PI);
      const chevMat = new THREE.MeshBasicMaterial({
        color: 0xff6633, transparent: true, opacity: 0.6, side: THREE.DoubleSide,
      });
      const chev = new THREE.Mesh(chevGeo, chevMat);
      // Orient: face along dip direction
      chev.quaternion.copy(arrowQ);
      const rightAxis = new THREE.Vector3().crossVectors(arrowTarget, new THREE.Vector3(0, 1, 0)).normalize();
      chev.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(rightAxis, -Math.PI / 2));
      chev.position.set(0, 0.3, 0);
      tiltGroup.add(chev);
      chevrons.push(chev);
    }

    // Centre marker sphere
    const centreGeo = new THREE.SphereGeometry(0.8 + intensity * 0.6, 12, 8);
    const centreMat = new THREE.MeshStandardMaterial({
      color: 0xffcc44, roughness: 0.3, emissive: 0x664400, emissiveIntensity: 0.4,
    });
    const centre = new THREE.Mesh(centreGeo, centreMat);
    group.add(centre);

    // Angle label sprite — now shows DipDir/Dip
    const canvas = document.createElement('canvas');
    canvas.width = 384; canvas.height = 192;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(30, 15, 0, 0.85)';
    ctx.fillRect(0, 0, 384, 192);
    ctx.strokeStyle = '#ff6633';
    ctx.lineWidth = 5;
    ctx.strokeRect(4, 4, 376, 184);
    ctx.fillStyle = '#ffdd88';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(dipDirection)}\u00B0/${Math.round(dipAngle)}\u00B0`, 192, 100);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.y = 7;
    sprite.scale.set(10, 5, 1);
    group.add(sprite);

    group.userData = {
      type: 'strikeDip', markerId, disc, centre, centreMat,
      chevrons, dipDirX, dipDirZ, dipLen, intensity,
      t0: performance.now(),
    };
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
    // Compute sun direction — azimuth shifts slightly with elevation for visual variety
    const azimuth = 0.6 + (1.0 - deg / 90) * 0.3; // ~0.6 at noon, ~0.9 at dawn/dusk
    const pos = new THREE.Vector3(
      Math.cos(azimuth) * Math.cos(r),
      Math.sin(r),
      Math.sin(azimuth) * Math.cos(r),
    );
    const dir = pos.clone().normalize();
    this._sunDir.copy(dir);
    this.sunLight.position.copy(dir).multiplyScalar(1500);

    // ── Time-of-day interpolation (0 = horizon, 1 = overhead) ──
    const tNorm = Math.max(0, Math.min(1, (deg - 5) / 80)); // 5°→0, 85°→1

    // Sun light colour: warm gold at low angles → bright white at high angles
    const sunR = 1.0;
    const sunG = 0.78 + tNorm * 0.20;    // 0.78 dawn → 0.98 noon
    const sunB = 0.50 + tNorm * 0.42;    // 0.50 dawn → 0.92 noon
    this.sunLight.color.setRGB(sunR, sunG, sunB);
    // Sun intensity: dimmer at low angles, brightest at ~55°+
    this.sunLight.intensity = 2.0 + tNorm * 1.2; // 2.0 dawn → 3.2 noon

    // Hemisphere light: shift sky colour warmer at dawn/dusk
    if (this._hemiLight) {
      const hSkyR = 0.60 + (1 - tNorm) * 0.30;  // more orange at dawn
      const hSkyG = 0.65 + tNorm * 0.22;
      const hSkyB = 0.72 + tNorm * 0.22;
      this._hemiLight.color.setRGB(hSkyR, hSkyG, hSkyB);
      this._hemiLight.intensity = 1.0 + tNorm * 0.40; // 1.0 → 1.4
    }

    // Fill light: stronger at low sun to brighten shadows
    if (this._fillLight) {
      this._fillLight.intensity = 0.75 - tNorm * 0.15; // 0.75 dawn → 0.60 noon
    }
    // Rim light: stronger at low sun for backlit drama
    if (this._rimLight) {
      this._rimLight.intensity = 0.65 - tNorm * 0.15; // 0.65 dawn → 0.50 noon
      this._rimLight.color.setRGB(1.0, 0.76 + tNorm * 0.12, 0.50 + tNorm * 0.25);
    }

    // Fog colour: warm haze at dawn/dusk → cool blue at midday
    const fogR = 0.82 - tNorm * 0.06;  // warmer at dawn
    const fogG = 0.78 + tNorm * 0.08;
    const fogB = 0.74 + tNorm * 0.18;
    if (this.scene.fog) {
      this.scene.fog.color.setRGB(fogR, fogG, fogB);
    }

    // Horizon colour for water reflections
    const horizCol = new THREE.Color(fogR, fogG, fogB);

    // Propagate sun direction + horizon colour to all shader systems
    if (this.terrainMat) {
      this.terrainMat.uniforms.uSunDir.value.copy(dir);
      if (this.terrainMat.uniforms.uFogColorNear) {
        this.terrainMat.uniforms.uFogColorNear.value.setRGB(fogR, fogG, fogB);
      }
    }
    // Ocean
    if (this.water?.material) {
      this.water.material.uniforms.uSunDir.value.copy(dir);
      if (this.water.material.uniforms.uHorizonColor) {
        this.water.material.uniforms.uHorizonColor.value.copy(horizCol);
      }
    }
    // Lakes
    if (this.lakeWater) {
      this.lakeWater.traverse((child) => {
        if (child.material?.uniforms?.uSunDir) {
          child.material.uniforms.uSunDir.value.copy(dir);
        }
        if (child.material?.uniforms?.uHorizonColor) {
          child.material.uniforms.uHorizonColor.value.copy(horizCol);
        }
      });
    }
    // River
    if (this.riverWater) {
      this.riverWater.traverse((child) => {
        if (child.material?.uniforms?.uSunDir) {
          child.material.uniforms.uSunDir.value.copy(dir);
        }
        if (child.material?.uniforms?.uHorizonColor) {
          child.material.uniforms.uHorizonColor.value.copy(horizCol);
        }
      });
    }
    // Atmosphere sky dome
    if (this.atmosphere?.material) this.atmosphere.material.uniforms.uSunDir.value.copy(dir);
    // Sun disc is now shader-based inside the sky dome — no separate meshes to update
  }

  updateExposure(val) {
    this.renderer.toneMappingExposure = val;
  }
  setVegetationVisible(visible) {
    if (this.vegetation) this.vegetation.visible = visible;
  }
  setShadowsEnabled(on) {
    this.renderer.shadowMap.enabled = on;
    if (this.sunLight) this.sunLight.castShadow = on;
    // Force shadow map update
    this.renderer.shadowMap.needsUpdate = true;
  }
  setSSAOEnabled(on) {
    this._ssaoEnabled = on;
  }
  setCameraSpeed(multiplier) {
    this._cameraSpeedMultiplier = multiplier;
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
    this._joystick = null;
    this._joystickChangeCbs = [];
    if (this._touchHandlers) {
      const canvas = this.renderer.domElement;
      const { handleStart, handleMove, handleEnd, handleCancel } = this._touchHandlers;
      canvas.removeEventListener('touchstart',  handleStart,  { capture: true });
      canvas.removeEventListener('touchmove',   handleMove,   { capture: true });
      canvas.removeEventListener('touchend',    handleEnd,    { capture: true });
      canvas.removeEventListener('touchcancel', handleCancel, { capture: true });
    }
    this.controls.dispose();
    this._postFX?.colorTarget?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
