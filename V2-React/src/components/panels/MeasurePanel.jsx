import useStore from '../../store/useStore';
import { useEngine } from '../../context/SceneContext';
import { clearMeasure } from '../../tools/ToolManager';
import { MeasureIcon } from '../icons/Icons';

export default function MeasurePanel() {
  const result         = useStore((s) => s.measureResult);
  const setResult      = useStore((s) => s.setMeasureResult);
  const measureMarkers = useStore((s) => s.measureMarkers);
  const engineRef      = useEngine();

  const handleClear = () => {
    if (engineRef?.current) clearMeasure(engineRef.current);
    setResult(null);
  };

  if (!result) {
    return (
      <>
        <div className="panel-header"><MeasureIcon /> Measurement</div>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
          Select the <strong>Measure</strong> tool (4) and click two points
          on the terrain to measure distance, bearing, and elevation change.
        </p>
        {measureMarkers.length > 0 && (
          <MeasureMarkerList markers={measureMarkers} onSelect={setResult} />
        )}
      </>
    );
  }

  const { distance, horizDistance, elevChange, bearing, slope } = result;

  return (
    <>
      <div className="panel-header"><MeasureIcon /> Measurement</div>

      <div className="measure-result">
        <div className="measure-value">{distance.toFixed(1)} m</div>
        <div className="measure-label">3D Distance</div>
      </div>

      <div className="measure-result">
        <div className="measure-value">{horizDistance.toFixed(1)} m</div>
        <div className="measure-label">Horizontal Distance</div>
      </div>

      <div className="measure-result">
        <div className="measure-value">
          {elevChange >= 0 ? '+' : ''}{elevChange.toFixed(1)} m
        </div>
        <div className="measure-label">Elevation Change</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div className="measure-result">
          <div className="measure-value">{bearing.toFixed(1)}°</div>
          <div className="measure-label">Bearing</div>
        </div>
        <div className="measure-result">
          <div className="measure-value">{slope.toFixed(1)}°</div>
          <div className="measure-label">Slope</div>
        </div>
      </div>

      {result.pointA && (
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 8, opacity: 0.7 }}>
          A: ({result.pointA.x.toFixed(0)}, {result.pointA.z.toFixed(0)}, {result.pointA.y.toFixed(1)}m)
          &rarr; B: ({result.pointB.x.toFixed(0)}, {result.pointB.z.toFixed(0)}, {result.pointB.y.toFixed(1)}m)
        </div>
      )}

      <button
        className="btn btn-outline btn-block btn-sm"
        style={{ marginTop: 12 }}
        onClick={handleClear}
      >
        Clear Measurement
      </button>

      {/* Saved measurements list */}
      {measureMarkers.length > 1 && (
        <MeasureMarkerList markers={measureMarkers} activeId={result.id} onSelect={setResult} />
      )}
    </>
  );
}

function MeasureMarkerList({ markers, activeId, onSelect }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600, marginBottom: 6 }}>
        Saved Measurements ({markers.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {markers.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 8px', borderRadius: 4, border: 'none',
                background: isActive ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.04)',
                color: isActive ? '#ff8888' : 'var(--text-2)',
                cursor: 'pointer', fontSize: 12, textAlign: 'left',
                outline: isActive ? '1px solid rgba(255,107,107,0.3)' : 'none',
              }}
            >
              <span style={{ fontWeight: 600 }}>📏</span>
              <span>{m.distance.toFixed(1)}m</span>
              <span style={{ opacity: 0.6 }}>{m.bearing.toFixed(0)}°</span>
              <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
                Δ{m.elevChange >= 0 ? '+' : ''}{m.elevChange.toFixed(1)}m
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
