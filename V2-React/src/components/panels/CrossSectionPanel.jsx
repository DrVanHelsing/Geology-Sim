// ================================================================
//  CROSS-SECTION PANEL — large canvas geological cross-section
// ================================================================
import { useRef, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useEngine } from '../../context/SceneContext';
import { clearCrossSection } from '../../tools/ToolManager';
import { LAYERS, WATER_LEVEL } from '../../config/geology';

const PAD = { top: 28, right: 24, bottom: 44, left: 56 };
const CANVAS_W = 720;
const CANVAS_H = 420;

export default function CrossSectionPanel() {
  const data       = useStore((s) => s.crossSection);
  const setData    = useStore((s) => s.setCrossSection);
  const engineRef  = useEngine();
  const canvasRef  = useRef(null);

  const handleClear = () => {
    if (engineRef?.current) clearCrossSection(engineRef.current);
    setData(null);
  };

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    draw(canvasRef.current, data);
  }, [data]);

  if (!data) {
    return (
      <div className="panel-content crosssection-panel">
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Cross-Section</h3>
        <p style={{ color: '#8b949e', fontSize: 13 }}>
          Click two points on the terrain to draw a cross-section line.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-content crosssection-panel">
      <h3 style={{ margin: '0 0 6px', fontSize: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Cross-Section</span>
        <button
          onClick={handleClear}
          style={{ fontSize: 10, color: '#f85149', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontWeight: 400 }}
          title="Clear cross-section"
        >Clear</button>
      </h3>
      <div className="cs-meta">
        <span>Bearing: <b>{data.bearing.toFixed(1)}°</b></span>
        <span>Length: <b>{data.totalDistance.toFixed(0)} m</b></span>
        <span>Samples: <b>{data.samples.length}</b></span>
      </div>
      <div className="cs-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="cs-canvas"
        />
      </div>
      {/* Layer legend */}
      <div className="cs-legend">
        {LAYERS.map((l) => (
          <span key={l.name} className="cs-legend-item">
            <span className="cs-legend-swatch" style={{ background: l.color }} />
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Rock texture pattern helper ── */
function applyRockPattern(ctx, layerIdx, x, y, w, h, baseColor) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(x, y, w, h);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 0.6;

  switch (layerIdx % 6) {
    case 0: // Granite — random dots
      for (let i = 0; i < w * h * 0.004; i++) {
        const px = x + Math.random() * w;
        const py = y + Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? '#aaa' : '#555';
        ctx.fillRect(px, py, 1.5, 1.5);
      }
      break;
    case 1: // Dolomite — horizontal wavy lines
      for (let ly = y + 4; ly < y + h; ly += 6) {
        ctx.beginPath();
        for (let lx = x; lx < x + w; lx += 3) {
          const offset = Math.sin(lx * 0.05) * 1.5;
          lx === x ? ctx.moveTo(lx, ly + offset) : ctx.lineTo(lx, ly + offset);
        }
        ctx.stroke();
      }
      break;
    case 2: // Sandstone — stipple
      for (let i = 0; i < w * h * 0.003; i++) {
        const px = x + Math.random() * w;
        const py = y + Math.random() * h;
        ctx.beginPath();
        ctx.arc(px, py, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 3: // Schist — diagonal hatching
      for (let ly = y - w; ly < y + h; ly += 5) {
        ctx.beginPath();
        ctx.moveTo(x, ly);
        ctx.lineTo(x + w, ly + w);
        ctx.stroke();
      }
      break;
    case 4: // Limestone — brick-like pattern
      for (let ly = y + 6; ly < y + h; ly += 8) {
        const offset = (Math.floor((ly - y) / 8) % 2) * 10;
        ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x + w, ly); ctx.stroke();
        for (let lx = x + offset; lx < x + w; lx += 20) {
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly - 8); ctx.stroke();
        }
      }
      break;
    case 5: // Alluvium — V-shaped (roots/organic)
      for (let i = 0; i < w * h * 0.002; i++) {
        const px = x + Math.random() * w;
        const py = y + Math.random() * h;
        ctx.beginPath();
        ctx.moveTo(px - 2, py - 2);
        ctx.lineTo(px, py + 1);
        ctx.lineTo(px + 2, py - 2);
        ctx.stroke();
      }
      break;
  }
  ctx.restore();
}

function draw(canvas, { samples, totalDistance }) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Anti-alias background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, W, H);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Elevation bounds
  let minE = Infinity, maxE = -Infinity;
  for (const s of samples) {
    if (s.surfaceElevation > maxE) maxE = s.surfaceElevation;
    for (const l of s.layers) {
      if (l.bottomElevation < minE) minE = l.bottomElevation;
    }
  }
  minE = Math.max(0, minE - 8);
  maxE += 15;

  const xScale = (d) => PAD.left + (d / totalDistance) * plotW;
  const yScale = (e) => PAD.top + plotH - ((e - minE) / (maxE - minE)) * plotH;

  // Grid lines
  ctx.strokeStyle = '#161b22';
  ctx.lineWidth = 0.5;
  const yTicks = 6;
  for (let i = 0; i <= yTicks; i++) {
    const e = minE + ((maxE - minE) / yTicks) * i;
    const y = yScale(e);
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + plotW, y); ctx.stroke();
  }
  const xTicks = 6;
  for (let i = 0; i <= xTicks; i++) {
    const d = (totalDistance / xTicks) * i;
    const x = xScale(d);
    ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + plotH); ctx.stroke();
  }

  // Draw each layer column with rock patterns
  const colW = Math.max(2, plotW / samples.length + 0.5);
  for (let si = 0; si < samples.length; si++) {
    const s = samples[si];
    const x = xScale(s.distance) - colW / 2;
    for (const l of s.layers) {
      const y1 = yScale(l.topElevation);
      const y2 = yScale(l.bottomElevation);
      const layerIdx = LAYERS.findIndex((ll) => ll.name === l.name);
      applyRockPattern(ctx, layerIdx >= 0 ? layerIdx : 0, x, y1, colW + 1, y2 - y1, l.color);
    }
  }

  // Water level
  const waterY = yScale(WATER_LEVEL);
  if (waterY > PAD.top && waterY < PAD.top + plotH) {
    ctx.fillStyle = 'rgba(26,111,160,0.15)';
    ctx.fillRect(PAD.left, waterY, plotW, PAD.top + plotH - waterY);
    ctx.strokeStyle = 'rgba(88,166,255,0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD.left, waterY);
    ctx.lineTo(PAD.left + plotW, waterY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#58a6ff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('Water Level', PAD.left + 4, waterY - 5);
  }

  // Surface profile — thick white line with glow
  ctx.shadowColor = 'rgba(230,237,243,0.3)';
  ctx.shadowBlur = 4;
  ctx.strokeStyle = '#e6edf3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < samples.length; i++) {
    const x = xScale(samples[i].distance);
    const y = yScale(samples[i].surfaceElevation);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Axes
  ctx.strokeStyle = '#484f58';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top);
  ctx.lineTo(PAD.left, PAD.top + plotH);
  ctx.lineTo(PAD.left + plotW, PAD.top + plotH);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#8b949e';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  for (let i = 0; i <= xTicks; i++) {
    const d = (totalDistance / xTicks) * i;
    const x = xScale(d);
    ctx.fillText(`${d.toFixed(0)}m`, x, PAD.top + plotH + 16);
    ctx.beginPath(); ctx.moveTo(x, PAD.top + plotH); ctx.lineTo(x, PAD.top + plotH + 4); ctx.stroke();
  }

  ctx.textAlign = 'right';
  for (let i = 0; i <= yTicks; i++) {
    const e = minE + ((maxE - minE) / yTicks) * i;
    const y = yScale(e);
    ctx.fillText(`${e.toFixed(0)}m`, PAD.left - 6, y + 4);
    ctx.beginPath(); ctx.moveTo(PAD.left - 4, y); ctx.lineTo(PAD.left, y); ctx.stroke();
  }

  // Axis titles
  ctx.fillStyle = '#58a6ff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Distance (m)', PAD.left + plotW / 2, H - 6);
  ctx.save();
  ctx.translate(14, PAD.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Elevation (m)', 0, 0);
  ctx.restore();
}
