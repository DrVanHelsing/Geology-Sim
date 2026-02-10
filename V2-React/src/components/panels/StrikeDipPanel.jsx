// ================================================================
//  STRIKE & DIP PANEL - proper Wulff stereonet + interactive 3D
//  sphere showing the bedding plane on a reference hemisphere.
//  Helps students visualise stereo projection.
// ================================================================
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import useStore from '../../store/useStore';

// Colour palette for multiple measurements
const COLORS = ['#ffa500','#58a6ff','#3fb950','#f85149','#d29922','#bc8cff',
  '#f778ba','#79c0ff','#56d364','#ff7b72','#e3b341','#d2a8ff'];

// ================================================================
//  MAIN PANEL
// ================================================================
export default function StrikeDipPanel() {
  const results        = useStore((s) => s.strikeDipResults);
  const clear          = useStore((s) => s.clearStrikeDip);
  const removeOne      = useStore((s) => s.removeStrikeDip);
  const selectedMarker = useStore((s) => s.selectedMarker);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const selectedId = selectedMarker?.type === 'strikeDip' ? selectedMarker.markerId : null;

  return (
    <div className="panel-content strikedip-panel">
      <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Dip Direction / Dip</h3>

      {results.length === 0 ? (
        <p style={{ color: '#8b949e', fontSize: 13 }}>
          Click on the terrain to measure bedding orientation.
        </p>
      ) : (
        <>
          <button onClick={clear} className="btn btn-sm btn-outline" style={{ marginBottom: 10 }}>
            Clear All
          </button>

          {/* Side-by-side: Wulff Stereonet + 3D Sphere */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Left: Wulff Stereonet */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 3, fontWeight: 600, letterSpacing: '0.05em' }}>
                STEREONET (Wulff)
              </div>
              <svg viewBox="0 0 220 220" style={{ width: 160, height: 160 }}>
                <WulffStereonet results={results} hoveredIdx={hoveredIdx} />
              </svg>
            </div>
            {/* Right: 3D Sphere */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 3, fontWeight: 600, letterSpacing: '0.05em' }}>
                3D VIEW (drag to rotate)
              </div>
              <SphereView results={results} hoveredIdx={hoveredIdx} />
            </div>
          </div>

          {/* Explanation helper */}
          <div style={{ fontSize: 10, color: '#484f58', background: '#0d1117', padding: '6px 8px', borderRadius: 6, marginBottom: 12, lineHeight: 1.5 }}>
            The <b style={{ color: '#8b949e' }}>stereonet</b> projects each
            bedding plane as a <b style={{ color: '#8b949e' }}>great circle</b> (arc)
            and its <b style={{ color: '#8b949e' }}>pole</b> (dot).
            The <b style={{ color: '#8b949e' }}>3D sphere</b> shows the actual plane
            cutting the reference hemisphere. Drag to rotate.
          </div>

          {/* Result cards */}
          <div className="sd-results-list">
            {results.map((r, i) => (
              <div
                key={r.id || i}
                className="sd-result-card"
                style={r.id === selectedId ? {
                  outline: '1px solid rgba(255,165,0,0.4)',
                  background: 'rgba(255,165,0,0.08)',
                } : {}}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="sd-result-header">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span className="sd-result-num">#{i + 1}</span>
                  <span className="sd-result-layer">{r.layerName}</span>
                  <button
                    onClick={() => removeOne(r.id)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', padding: '2px 6px', fontSize: 13, lineHeight: 1, borderRadius: 4 }}
                    title="Remove this measurement"
                  >{'\u00d7'}</button>
                </div>

                <div className="sd-result-body">
                  <svg viewBox="0 0 110 110" className="sd-symbol-large">
                    <DipDirSymbol dipDirection={r.dipDirection} dip={r.dip} color={COLORS[i % COLORS.length]} />
                  </svg>
                  <div className="sd-result-data">
                    <div className="sd-datum">
                      <span className="sd-datum-label">Dip Dir</span>
                      <span className="sd-datum-value" style={{ fontWeight: 700, fontSize: 15 }}>{r.dipDirection}{'\u00b0'}</span>
                    </div>
                    <div className="sd-datum">
                      <span className="sd-datum-label">Dip</span>
                      <span className="sd-datum-value" style={{ fontWeight: 700, fontSize: 15 }}>{r.dip}{'\u00b0'}</span>
                    </div>
                    <div className="sd-datum">
                      <span className="sd-datum-label">Strike</span>
                      <span className="sd-datum-value" style={{ opacity: 0.5 }}>{r.strike}{'\u00b0'}</span>
                    </div>
                    <div className="sd-datum-coords">
                      ({r.position.x}, {r.position.z})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


// ================================================================
//  WULFF STEREONET (SVG) - equal-angle projection
// ================================================================
function WulffStereonet({ results, hoveredIdx }) {
  const cx = 110, cy = 110, R = 95;

  // Equal-angle (Wulff) lower-hemisphere projection
  // pole with trend t (bearing CW from N) and plunge p (0=horiz, 90=down)
  // r = R * tan((90-p)/2 * pi/180), placed at bearing t
  const projectPole = (trend, plunge) => {
    const rProj = R * Math.tan((90 - plunge) / 2 * Math.PI / 180);
    const tRad = trend * Math.PI / 180;
    return { x: cx + rProj * Math.sin(tRad), y: cy - rProj * Math.cos(tRad) };
  };

  // Great circle on stereonet for a plane with given strike & dip
  const greatCirclePoints = (strike, dip, nPts = 60) => {
    const s = strike * Math.PI / 180;
    const d = dip * Math.PI / 180;

    // Pole to plane (into lower hemisphere)
    const pole = new THREE.Vector3(
      Math.sin(s + Math.PI / 2) * Math.cos(d),
      -Math.sin(d),
      Math.cos(s + Math.PI / 2) * Math.cos(d),
    ).normalize();

    // Strike direction (horizontal)
    const sv = new THREE.Vector3(Math.sin(s), 0, Math.cos(s)).normalize();
    // Dip direction (perpendicular to strike, in the plane)
    const dv = new THREE.Vector3().crossVectors(pole, sv).normalize();

    const pts = [];
    for (let i = 0; i <= nPts; i++) {
      const a = (i / nPts) * Math.PI;
      const v = new THREE.Vector3()
        .addScaledVector(sv, Math.cos(a))
        .addScaledVector(dv, Math.sin(a))
        .normalize();
      if (v.y > 0.001) continue; // skip upper hemisphere
      const plunge = Math.asin(Math.abs(v.y)) * 180 / Math.PI;
      let trend = Math.atan2(v.x, v.z) * 180 / Math.PI;
      if (trend < 0) trend += 360;
      pts.push(projectPole(trend, plunge));
    }
    return pts;
  };

  // Grid: concentric dip circles at 10deg intervals
  const gridCircles = [];
  for (let d = 10; d < 90; d += 10) {
    gridCircles.push(R * Math.tan(d / 2 * Math.PI / 180));
  }

  // Grid: great circle meridians at 30deg intervals
  const gridGC = [];
  for (let az = 0; az < 180; az += 30) {
    const pts = greatCirclePoints(az, 89.5, 40);
    if (pts.length > 1) gridGC.push(pts);
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={R + 2} fill="#0d1117" stroke="#30363d" strokeWidth="1" />

      {/* Dip circles */}
      {gridCircles.map((r, i) => (
        <circle key={`dc${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="#161b22" strokeWidth="0.4" />
      ))}

      {/* Great circle grid */}
      {gridGC.map((pts, i) => (
        <polyline key={`gc${i}`} points={pts.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke="#161b22" strokeWidth="0.4" />
      ))}

      {/* Cross-hair */}
      <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="#21262d" strokeWidth="0.5" />
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#21262d" strokeWidth="0.5" />

      {/* Primitive circle */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#30363d" strokeWidth="1.2" />

      {/* 10deg ticks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = i * 10 * Math.PI / 180;
        return <line key={`t${i}`}
          x1={cx + Math.sin(a) * (R - 3)} y1={cy - Math.cos(a) * (R - 3)}
          x2={cx + Math.sin(a) * (R + 3)} y2={cy - Math.cos(a) * (R + 3)}
          stroke="#30363d" strokeWidth="0.6" />;
      })}

      {/* Cardinals */}
      <text x={cx} y={cy - R - 6} fill="#58a6ff" fontSize="9" textAnchor="middle" fontWeight="bold">N</text>
      <text x={cx + R + 8} y={cy + 3} fill="#484f58" fontSize="7" textAnchor="middle">E</text>
      <text x={cx} y={cy + R + 11} fill="#484f58" fontSize="7" textAnchor="middle">S</text>
      <text x={cx - R - 8} y={cy + 3} fill="#484f58" fontSize="7" textAnchor="middle">W</text>

      {/* Plot each measurement */}
      {results.map((r, i) => {
        const c = COLORS[i % COLORS.length];
        const isH = hoveredIdx === i;
        const op = hoveredIdx !== null ? (isH ? 1 : 0.25) : 0.85;
        const pts = greatCirclePoints(r.strike, r.dip);
        const polePlunge = 90 - r.dip;
        const poleTrend = (r.strike + 90) % 360;
        const pole = projectPole(poleTrend, polePlunge);

        return (
          <g key={i} opacity={op}>
            {pts.length > 1 && (
              <polyline points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none" stroke={c} strokeWidth={isH ? 2.5 : 1.8} />
            )}
            <circle cx={pole.x} cy={pole.y} r={isH ? 5 : 3.5}
              fill={c} stroke="#0d1117" strokeWidth="1" />
            {isH && <text x={pole.x + 8} y={pole.y + 4} fill={c} fontSize="9" fontWeight="600">#{i + 1}</text>}
          </g>
        );
      })}
    </g>
  );
}


// ================================================================
//  3D SPHERE VIEW - interactive Three.js hemisphere showing
//  bedding planes cutting through a reference sphere
// ================================================================
function SphereView({ results, hoveredIdx }) {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  // Init Three.js scene once
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = 160, H = 160;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(2.2, 1.6, 2.8);
    camera.lookAt(0, -0.15, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 1.0);
    dl.position.set(3, 4, 2);
    scene.add(dl);

    // Reference sphere wireframe
    const sGeo = new THREE.SphereGeometry(1, 48, 48);
    scene.add(new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({
      color: 0x30363d, wireframe: true, transparent: true, opacity: 0.12,
    })));

    // Solid back-face for depth
    scene.add(new THREE.Mesh(sGeo, new THREE.MeshPhongMaterial({
      color: 0x161b22, transparent: true, opacity: 0.25, side: THREE.BackSide,
    })));

    // Equator ring
    const eqPts = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      eqPts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(eqPts),
      new THREE.LineBasicMaterial({ color: 0x484f58 }),
    ));

    // N-S and E-W meridians
    const meridian = (fn) => {
      const pts = [];
      for (let i = 0; i <= 64; i++) { const a = (i / 64) * Math.PI * 2; pts.push(fn(a)); }
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x21262d }));
    };
    scene.add(meridian(a => new THREE.Vector3(0, Math.sin(a), Math.cos(a))));
    scene.add(meridian(a => new THREE.Vector3(Math.cos(a), Math.sin(a), 0)));

    // North indicator
    const nArrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.2, 8),
      new THREE.MeshBasicMaterial({ color: 0x58a6ff }),
    );
    nArrow.position.set(0, 0, -1.25);
    nArrow.rotation.x = Math.PI / 2;
    scene.add(nArrow);

    // "N" label sprite
    const nc = document.createElement('canvas');
    nc.width = 32; nc.height = 32;
    const nctx = nc.getContext('2d');
    nctx.fillStyle = '#58a6ff';
    nctx.font = 'bold 24px sans-serif';
    nctx.textAlign = 'center'; nctx.textBaseline = 'middle';
    nctx.fillText('N', 16, 16);
    const ns = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(nc), transparent: true }));
    ns.position.set(0, 0, -1.5); ns.scale.set(0.3, 0.3, 1);
    scene.add(ns);

    const planesGroup = new THREE.Group();
    scene.add(planesGroup);

    stateRef.current = { renderer, scene, camera, planesGroup };

    let animId;
    const render = () => { animId = requestAnimationFrame(render); renderer.render(scene, camera); };
    render();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      stateRef.current = null;
    };
  }, []);

  // Drag-to-rotate
  useEffect(() => {
    const el = mountRef.current;
    if (!el || !stateRef.current) return;
    const { camera } = stateRef.current;

    let drag = false, px = 0, py = 0;
    let az = Math.atan2(camera.position.x, camera.position.z);
    let elev = Math.asin(camera.position.y / camera.position.length());
    const dist = camera.position.length();

    const update = () => {
      camera.position.set(
        dist * Math.cos(elev) * Math.sin(az),
        dist * Math.sin(elev),
        dist * Math.cos(elev) * Math.cos(az),
      );
      camera.lookAt(0, -0.15, 0);
    };

    const onDown = (e) => { drag = true; const p = e.touches ? e.touches[0] : e; px = p.clientX; py = p.clientY; e.preventDefault(); };
    const onMove = (e) => {
      if (!drag) return;
      const p = e.touches ? e.touches[0] : e;
      az -= (p.clientX - px) * 0.01;
      elev = Math.max(-1.4, Math.min(1.4, elev + (p.clientY - py) * 0.01));
      update(); px = p.clientX; py = p.clientY; e.preventDefault();
    };
    const onUp = () => { drag = false; };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  // Update planes when results/hover change
  useEffect(() => {
    if (!stateRef.current) return;
    const { planesGroup } = stateRef.current;

    // Dispose old objects
    while (planesGroup.children.length) {
      const ch = planesGroup.children[0];
      ch.traverse(o => {
        o.geometry?.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
          else o.material.dispose();
        }
      });
      planesGroup.remove(ch);
    }

    results.forEach((r, i) => {
      const color = new THREE.Color(COLORS[i % COLORS.length]);
      const isH = hoveredIdx === i;
      const planeOp = hoveredIdx !== null ? (isH ? 0.50 : 0.08) : 0.35;
      const lineOp  = hoveredIdx !== null ? (isH ? 1 : 0.15) : 0.85;

      const sRad = r.strike * Math.PI / 180;
      const dRad = r.dip * Math.PI / 180;

      // Plane normal (pole) — geographic: N=-z, E=+x, Down=-y
      const normal = new THREE.Vector3(
        Math.sin(sRad + Math.PI / 2) * Math.sin(dRad),
        -Math.cos(dRad),
        -Math.cos(sRad + Math.PI / 2) * Math.sin(dRad),
      ).normalize();

      // Orthonormal basis for the plane
      let right = new THREE.Vector3(0, 1, 0).cross(normal);
      if (right.lengthSq() < 0.0001) right = new THREE.Vector3(1, 0, 0).cross(normal);
      right.normalize();
      const fwd = new THREE.Vector3().crossVectors(normal, right).normalize();

      // Great circle on sphere (plane intersects unit sphere through centre)
      const gcPts = [];
      for (let j = 0; j <= 80; j++) {
        const a = (j / 80) * Math.PI * 2;
        gcPts.push(new THREE.Vector3().addScaledVector(right, Math.cos(a)).addScaledVector(fwd, Math.sin(a)));
      }
      planesGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(gcPts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: lineOp }),
      ));

      // Filled disc
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(1, 64),
        new THREE.MeshPhongMaterial({ color, transparent: true, opacity: planeOp, side: THREE.DoubleSide, depthWrite: false }),
      );
      disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      planesGroup.add(disc);

      // Pole arrow (line from centre to sphere surface)
      const poleDir = normal.y < 0 ? normal.clone() : normal.clone().negate();
      planesGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), poleDir.clone()]),
        new THREE.LineBasicMaterial({ color: color.clone().lerp(new THREE.Color(1,1,1), 0.3), transparent: true, opacity: lineOp }),
      ));

      // Pole dot on sphere
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshBasicMaterial({ color, transparent: hoveredIdx !== null && !isH, opacity: hoveredIdx !== null && !isH ? 0.15 : 1 }),
      );
      dot.position.copy(poleDir);
      planesGroup.add(dot);
    });
  }, [results, hoveredIdx]);

  return (
    <div ref={mountRef} style={{
      width: 160, height: 160, cursor: 'grab', borderRadius: 8,
      border: '1px solid #21262d', background: '#0d1117', overflow: 'hidden',
    }} />
  );
}


// ================================================================
//  DIP DIRECTION / DIP COMPASS SYMBOL (per result card)
//  Shows dip direction arrow pointing in the dipDirection bearing
//  with the dip angle labelled. The strike line is perpendicular.
// ================================================================
function DipDirSymbol({ dipDirection, dip, color = '#ffa500' }) {
  const cx = 55, cy = 55, r = 42;
  // Dip direction arrow (bearing CW from N)
  const ddRad = dipDirection * Math.PI / 180;
  const ddx = Math.sin(ddRad) * r * 0.65;
  const ddy = -Math.cos(ddRad) * r * 0.65;
  // Arrowhead
  const headLen = 6, headAng = 0.45;
  const ha1x = ddx - headLen * Math.sin(ddRad - headAng);
  const ha1y = ddy + headLen * Math.cos(ddRad - headAng);
  const ha2x = ddx - headLen * Math.sin(ddRad + headAng);
  const ha2y = ddy + headLen * Math.cos(ddRad + headAng);
  // Strike line (perpendicular to dip direction)
  const sRad = (dipDirection - 90) * Math.PI / 180;
  const sx = Math.sin(sRad) * r;
  const sy = -Math.cos(sRad) * r;

  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#21262d" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r + 1} fill="none" stroke="#30363d" strokeWidth="0.5" />
      <text x={cx} y={cy - r - 7} fill="#58a6ff" fontSize="9" textAnchor="middle" fontWeight="bold">N</text>
      <text x={cx + r + 8} y={cy + 3} fill="#484f58" fontSize="7" textAnchor="middle">E</text>
      <text x={cx} y={cy + r + 12} fill="#484f58" fontSize="7" textAnchor="middle">S</text>
      <text x={cx - r - 8} y={cy + 3} fill="#484f58" fontSize="7" textAnchor="middle">W</text>
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
        const ar = a * Math.PI / 180;
        return <line key={a}
          x1={cx + Math.sin(ar) * (r - 2)} y1={cy - Math.cos(ar) * (r - 2)}
          x2={cx + Math.sin(ar) * (r + 2)} y2={cy - Math.cos(ar) * (r + 2)}
          stroke="#30363d" strokeWidth="0.8" />;
      })}
      {/* Strike line (thin, secondary) */}
      <line x1={cx - sx} y1={cy - sy} x2={cx + sx} y2={cy + sy}
        stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
      {/* Dip direction arrow (bold, primary) */}
      <line x1={cx} y1={cy} x2={cx + ddx} y2={cy + ddy}
        stroke={color} strokeWidth="3" strokeLinecap="round" />
      <polygon points={`${cx+ddx},${cy+ddy} ${cx+ha1x},${cy+ha1y} ${cx+ha2x},${cy+ha2y}`}
        fill={color} />
      {/* Dip angle label */}
      <text x={cx + ddx * 1.35} y={cy + ddy * 1.35 + 4}
        fill="#e6edf3" fontSize="10" fontWeight="600" fontFamily="sans-serif">{dip}{'\u00b0'}</text>
      <circle cx={cx} cy={cy} r="2.5" fill={color} />
    </g>
  );
}