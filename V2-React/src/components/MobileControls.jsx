// ================================================================
//  MobileControls — virtual joystick overlay + fullscreen button
//                   + vertical zoom slider
// ================================================================
import { useEffect, useState, useCallback, useRef } from 'react';
import { useEngine } from '../context/SceneContext';

const OUTER_R = 65;   // px — outer ring radius
const KNOB_R  = 26;   // px — inner knob radius

const IS_TOUCH = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function MobileControls() {
  const engineRef  = useEngine();
  const [joystick, setJoystick] = useState(null);
  const [isFs,     setIsFs]     = useState(false);
  const [zoom,     setZoom]     = useState(0.5); // 0 = close, 1 = far
  const autoFsTriedRef = useRef(false);
  const zoomRafRef     = useRef(null);

  // ── Subscribe to joystick state from engine ──────────────────
  useEffect(() => {
    if (!IS_TOUCH) return;
    let unsub;
    const tryConnect = () => {
      const engine = engineRef?.current;
      if (!engine?.onJoystickChange) return false;
      unsub = engine.onJoystickChange(setJoystick);
      return true;
    };
    if (tryConnect()) return () => unsub?.();
    const id = setInterval(() => { if (tryConnect()) clearInterval(id); }, 80);
    return () => { clearInterval(id); unsub?.(); };
  }, [engineRef]);

  // ── Auto-enter fullscreen + landscape on first touch (mobile) ─
  useEffect(() => {
    if (!IS_TOUCH) return;
    const tryFs = async () => {
      if (autoFsTriedRef.current) return;
      autoFsTriedRef.current = true;
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        try { await screen.orientation?.lock?.('landscape'); } catch (_) {}
      } catch (_) {}
    };
    document.addEventListener('touchstart', tryFs, { once: true, passive: true });
    return () => document.removeEventListener('touchstart', tryFs);
  }, []);

  // ── Track fullscreen state ────────────────────────────────────
  useEffect(() => {
    const onFsChange = () =>
      setIsFs(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // ── Fullscreen toggle ─────────────────────────────────────────
  const toggleFs = useCallback(async () => {
    try {
      const inFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!inFs) {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        try { await screen.orientation?.lock?.('landscape'); } catch (_) {}
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        try { screen.orientation?.unlock?.(); } catch (_) {}
      }
    } catch (_) {}
  }, []);

  // ── Sync zoom slider with camera distance ────────────────────
  useEffect(() => {
    if (!IS_TOUCH) return;
    const sync = () => {
      const engine = engineRef?.current;
      if (engine?.getZoomLevel) {
        const level = engine.getZoomLevel();
        setZoom(Math.max(0, Math.min(1, level)));
      }
      zoomRafRef.current = requestAnimationFrame(sync);
    };
    zoomRafRef.current = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(zoomRafRef.current);
  }, [engineRef]);

  // ── Zoom slider change handler ────────────────────────────────
  const handleZoomChange = useCallback((e) => {
    const engine = engineRef?.current;
    if (!engine?.setZoomLevel) return;
    const val = parseFloat(e.target.value);
    setZoom(val);
    engine.setZoomLevel(val);
  }, [engineRef]);

  return (
    <>
      {/* ── Virtual joystick visual (mobile only, shown while active) ── */}
      {IS_TOUCH && joystick && (
        <div className="mc-joystick-overlay" aria-hidden="true">
          <div
            className="mc-joystick-outer"
            style={{
              left:   joystick.anchorX - OUTER_R,
              top:    joystick.anchorY - OUTER_R,
              width:  OUTER_R * 2,
              height: OUTER_R * 2,
            }}
          />
          <div
            className="mc-joystick-knob"
            style={{
              left:   joystick.knobX - KNOB_R,
              top:    joystick.knobY - KNOB_R,
              width:  KNOB_R * 2,
              height: KNOB_R * 2,
            }}
          />
        </div>
      )}

      {/* ── Vertical zoom slider (mobile only) ── */}
      {IS_TOUCH && (
        <div className="mc-zoom-slider" aria-label="Zoom">
          <svg className="mc-zoom-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={zoom}
            onChange={handleZoomChange}
            className="mc-zoom-range"
            orient="vertical"
          />
          <svg className="mc-zoom-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      )}

      {/* ── Fullscreen toggle button (all devices) ── */}
      <button
        className="mc-fullscreen-btn"
        onClick={toggleFs}
        title={isFs ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        aria-label={isFs ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFs ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20"/>
            <polyline points="20 10 14 10 14 4"/>
            <line x1="10" y1="14" x2="3" y2="21"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        )}
      </button>
    </>
  );
}
