// ================================================================
//  MobileControls — virtual joystick overlay + fullscreen button
// ================================================================
import { useEffect, useState, useCallback, useRef } from 'react';
import { useEngine } from '../context/SceneContext';

const OUTER_R = 65;   // px — outer ring radius
const KNOB_R  = 26;   // px — inner knob radius

const IS_TOUCH = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function MobileControls() {
  const engineRef  = useEngine();
  const [joystick, setJoystick]     = useState(null);
  const [isFs,     setIsFs]         = useState(false);
  const autoFsTriedRef = useRef(false);

  // ── Subscribe to joystick state from engine ──────────────────
  // Engine is initialised in a parent useEffect that runs AFTER
  // child effects, so we poll until the engine is ready.
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
        // Lock landscape after fullscreen is active
        try { await screen.orientation?.lock?.('landscape'); } catch (_) {}
      } catch (_) {}
    };
    document.addEventListener('touchstart', tryFs, { once: true, passive: true });
    return () => document.removeEventListener('touchstart', tryFs);
  }, []);

  // ── Fullscreen toggle (button handler) ───────────────────────
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

  return (
    <>
      {/* ── Virtual joystick visual (mobile only, shown while active) ── */}
      {IS_TOUCH && joystick && (
        <div className="mc-joystick-overlay" aria-hidden="true">
          {/* Outer ring */}
          <div
            className="mc-joystick-outer"
            style={{
              left:   joystick.anchorX - OUTER_R,
              top:    joystick.anchorY - OUTER_R,
              width:  OUTER_R * 2,
              height: OUTER_R * 2,
            }}
          />
          {/* Inner knob */}
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
