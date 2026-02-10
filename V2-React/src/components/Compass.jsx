import { useEffect, useRef } from 'react';
import { useEngine } from '../context/SceneContext';
import { bearingToCompass } from '../utils/helpers';

export default function Compass() {
  const engineRef  = useEngine();
  const canvasRef  = useRef(null);
  const bearingRef = useRef(null);

  useEffect(() => {
    let id;
    const loop = () => {
      id = requestAnimationFrame(loop);
      const engine = engineRef?.current;
      const canvas = canvasRef.current;
      if (!engine || !canvas) return;

      const dir = engine.getCameraDirection();
      let bearing = Math.atan2(dir.x, dir.z) * 180 / Math.PI;
      bearing = (bearing + 360) % 360;

      drawCompass(canvas, bearing);

      if (bearingRef.current) {
        bearingRef.current.textContent = `${Math.round(bearing)}° ${bearingToCompass(bearing)}`;
      }
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [engineRef]);

  return (
    <div id="compass-container">
      <canvas ref={canvasRef} id="compass-canvas" width={280} height={280} />
      <div ref={bearingRef} id="compass-bearing">--</div>
    </div>
  );
}

// ── Canvas drawing ──────────────────────────────────────────────
function drawCompass(canvas, bearing) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2, r = cx - 16;

  ctx.clearRect(0, 0, w, h);

  // Outer fill
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(13,17,23,0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(88,166,255,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Rotated ticks & labels
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-bearing * Math.PI / 180);

  for (let deg = 0; deg < 360; deg += 2) {
    const a      = (deg - 90) * Math.PI / 180;
    const major  = deg % 90 === 0;
    const med    = deg % 30 === 0;
    const minor  = deg % 10 === 0;
    const inner  = major ? r - 18 : med ? r - 12 : minor ? r - 8 : r - 5;

    ctx.beginPath();
    ctx.moveTo(inner * Math.cos(a), inner * Math.sin(a));
    ctx.lineTo((r - 1) * Math.cos(a), (r - 1) * Math.sin(a));
    ctx.strokeStyle = major ? '#fff' : med ? 'rgba(255,255,255,0.5)' : minor ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = major ? 2 : 1;
    ctx.stroke();
  }

  // Cardinals
  const cards = [
    { l: 'N', d: 0,   c: '#f85149' },
    { l: 'E', d: 90,  c: '#e6edf3' },
    { l: 'S', d: 180, c: '#e6edf3' },
    { l: 'W', d: 270, c: '#e6edf3' },
  ];
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  cards.forEach(({ l, d, c }) => {
    const a = (d - 90) * Math.PI / 180;
    ctx.fillStyle = c;
    ctx.fillText(l, (r - 30) * Math.cos(a), (r - 30) * Math.sin(a));
  });

  // Intermediate degrees
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  for (let deg = 0; deg < 360; deg += 30) {
    if (deg % 90 === 0) continue;
    const a = (deg - 90) * Math.PI / 180;
    ctx.fillText(deg.toString(), (r - 30) * Math.cos(a), (r - 30) * Math.sin(a));
  }
  ctx.restore();

  // Fixed needle (always points up = camera direction)
  ctx.save();
  ctx.translate(cx, cy);
  // North half (red)
  ctx.beginPath();
  ctx.moveTo(0, -(r - 42));
  ctx.lineTo(-5, 0);
  ctx.lineTo(5, 0);
  ctx.closePath();
  ctx.fillStyle = '#f85149';
  ctx.fill();
  // South half
  ctx.beginPath();
  ctx.moveTo(0, r - 42);
  ctx.lineTo(-5, 0);
  ctx.lineTo(5, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fill();
  // Centre dot
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#58a6ff';
  ctx.fill();
  ctx.restore();
}
