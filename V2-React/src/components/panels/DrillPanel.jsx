import useStore from '../../store/useStore';
import { DrillIcon } from '../icons/Icons';

export default function DrillPanel() {
  const result       = useStore((s) => s.drillResult);
  const drillMarkers = useStore((s) => s.drillMarkers);
  const setResult    = useStore((s) => s.setDrillResult);
  const removeDrill  = useStore((s) => s.removeDrillMarker);
  const clearDrill   = useStore((s) => s.clearDrillMarkers);
  const showPopup    = useStore((s) => s.showRockPopup);

  const handleRemove = (id) => {
    removeDrill(id);
    if (result?.id === id) setResult(null);
  };
  const handleClearAll = () => {
    clearDrill();
    setResult(null);
  };

  if (!result) {
    return (
      <>
        <div className="panel-header"><DrillIcon /> Drill Core</div>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
          Select the <strong>Drill</strong> tool (3) and click on the terrain to extract a core.
        </p>
        {drillMarkers.length > 0 && (
          <DrillMarkerList markers={drillMarkers} onSelect={setResult} onRemove={handleRemove} onClearAll={handleClearAll} />
        )}
      </>
    );
  }

  const { results, position, surfaceY } = result;
  const totalDepth = results.length > 0 ? results[results.length - 1].endDepth : 0;

  return (
    <>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span><DrillIcon /> Drill Core Result</span>
        <button
          onClick={() => handleRemove(result.id)}
          style={{ fontSize: 10, color: '#f85149', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
          title="Remove this drill core"
        >Remove</button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>
        Location: ({position.x.toFixed(0)}, {position.z.toFixed(0)})
        &middot; Surface: {surfaceY.toFixed(1)}m
        &middot; Depth: {totalDepth.toFixed(1)}m
      </div>

      <div className="core-wrapper">
        {/* Depth axis */}
        <div className="core-depth-axis" style={{ height: Math.max(200, totalDepth * 2) }}>
          {results.map((r, i) => (
            <div key={i} className="core-depth-tick" style={{ top: r.startDepth * 2 }}>
              {r.startDepth.toFixed(0)}m
            </div>
          ))}
          {results.length > 0 && (
            <div className="core-depth-tick" style={{ top: totalDepth * 2 }}>
              {totalDepth.toFixed(0)}m
            </div>
          )}
        </div>

        {/* Core column */}
        <div className="core-column">
          {results.map((r, i) => (
            <div
              key={i}
              className="core-segment"
              style={{
                height: Math.max(20, (r.endDepth - r.startDepth) * 2),
                background: r.layer.color,
              }}
              title={r.layer.name}
              onClick={() => showPopup(r.layer)}
            />
          ))}
        </div>

        {/* Log */}
        <div className="core-log">
          {results.map((r, i) => {
            const thickness = r.endDepth - r.startDepth;
            return (
              <div
                key={i}
                className="core-log-entry"
                style={{
                  borderColor: r.layer.color,
                  minHeight: Math.max(20, thickness * 2),
                }}
                onClick={() => showPopup(r.layer)}
              >
                <div className="core-log-name">{r.layer.name}</div>
                <div className="core-log-detail">
                  {thickness.toFixed(1)}m &middot; {r.layer.grainSize}
                  <br />
                  {r.layer.minerals.slice(0, 3).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved drill markers list */}
      {drillMarkers.length > 1 && (
        <DrillMarkerList markers={drillMarkers} activeId={result.id} onSelect={setResult} onRemove={handleRemove} onClearAll={handleClearAll} />
      )}
    </>
  );
}

function DrillMarkerList({ markers, activeId, onSelect, onRemove, onClearAll }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Saved Drill Cores ({markers.length})</span>
        {markers.length > 0 && (
          <button
            onClick={onClearAll}
            style={{ fontSize: 10, color: '#f85149', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
            title="Clear all drill markers"
          >Clear All</button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {markers.map((m) => {
          const isActive = m.id === activeId;
          const totalDepth = m.results.length > 0 ? m.results[m.results.length - 1].endDepth : 0;
          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <button
                onClick={() => onSelect(m)}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 4, border: 'none',
                  background: isActive ? 'rgba(255,85,51,0.15)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#ff8866' : 'var(--text-2)',
                  cursor: 'pointer', fontSize: 12, textAlign: 'left',
                  outline: isActive ? '1px solid rgba(255,85,51,0.3)' : 'none',
                }}
              >
                <span style={{ fontWeight: 600 }}>⛏</span>
                <span>({m.position.x.toFixed(0)}, {m.position.z.toFixed(0)})</span>
                <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{totalDepth.toFixed(0)}m deep</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(m.id); }}
                style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', padding: '4px 6px', fontSize: 13, lineHeight: 1, borderRadius: 4 }}
                title="Remove marker"
              >×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
