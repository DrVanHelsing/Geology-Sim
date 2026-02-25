// ================================================================
//  MobileControls — virtual joystick overlay
// ================================================================
import { useEffect, useState, useRef } from 'react';
import { useEngine } from '../context/SceneContext';

const OUTER_R = 65;   // px — outer ring radius
const KNOB_R  = 26;   // px — inner knob radius

const IS_TOUCH = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function MobileControls() {
  const engineRef  = useEngine();
  const [joystick, setJoystick] = useState(null);
  const autoFsTriedRef = useRef(false);

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

  // ── Nothing to render on non-touch devices ────────────────────
  if (!IS_TOUCH) return null;

  return (
    <>
      {/* ── Virtual joystick visual (shown while active) ── */}
      {joystick && (
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
    </>
  );
}
