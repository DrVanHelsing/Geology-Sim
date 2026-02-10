import { useEffect, useRef } from 'react';
import { useEngine } from '../context/SceneContext';
import { niceScaleValue, formatDistance } from '../utils/helpers';

export default function HUD() {
  const engineRef = useEngine();
  const lineRef   = useRef(null);
  const labelRef  = useRef(null);

  // Update scale bar every frame via rAF (avoids React re-renders)
  useEffect(() => {
    let id;
    const update = () => {
      id = requestAnimationFrame(update);
      const engine = engineRef?.current;
      if (!engine || !lineRef.current) return;

      const { worldPerPixel } = engine.getScaleData();
      const targetPx  = 120;
      const worldDist = worldPerPixel * targetPx;
      const nice      = niceScaleValue(worldDist);
      const actualPx  = nice / worldPerPixel;

      lineRef.current.style.width  = actualPx + 'px';
      labelRef.current.textContent = formatDistance(nice);
    };
    id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, [engineRef]);

  return (
    <>
      <div id="crosshair" />
      <div id="scale-bar-container">
        <div ref={lineRef} id="scale-bar-line" style={{ width: 100 }} />
        <div ref={labelRef} id="scale-bar-label">--</div>
      </div>
    </>
  );
}
