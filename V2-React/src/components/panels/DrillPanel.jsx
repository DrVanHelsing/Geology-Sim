import { useState } from 'react';
import useStore from '../../store/useStore';
import { DrillIcon } from '../icons/Icons';

// ──────────────────────────────────────────────
//  Drill settings bar (inclination / azimuth / depth)
// ──────────────────────────────────────────────
function DrillSettingsBar() {
  const settings    = useStore((s) => s.drillSettings);
  const setSettings = useStore((s) => s.setDrillSettings);

  const inputStyle = {
    width: 54, padding: '3px 5px', borderRadius: 4, border: '1px solid #30363d',
    background: '#0d1117', color: '#e6edf3', fontSize: 12, textAlign: 'center',
  };
  const labelStyle = { fontSize: 10, color: '#8b949e', marginBottom: 2 };

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={labelStyle}>Incl. (°)</span>
        <input type="number" min={0} max={89} step={1}
          value={settings.inclination}
          onChange={(e) => setSettings({ inclination: Math.max(0, Math.min(89, +e.target.value || 0)) })}
          style={inputStyle} title="Inclination from vertical (0° = straight down)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={labelStyle}>Azim. (°)</span>
        <input type="number" min={0} max={359} step={1}
          value={settings.azimuth}
          onChange={(e) => setSettings({ azimuth: ((+e.target.value || 0) % 360 + 360) % 360 })}
          style={inputStyle} title="Borehole azimuth (compass bearing)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={labelStyle}>Depth (m)</span>
        <input type="number" min={1} max={500} step={5}
          value={settings.maxDepth}
          onChange={(e) => setSettings({ maxDepth: Math.max(1, Math.min(500, +e.target.value || 100)) })}
          style={inputStyle} title="Maximum borehole depth" />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
//  Mini compass showing borehole azimuth
// ──────────────────────────────────────────────
function BoreholeCompass({ azimuth, inclination, size = 48 }) {
  const r = size * 0.38;
  const cx = size / 2, cy = size / 2;
  const azRad = azimuth * Math.PI / 180;
  const len = r * (1 - inclination / 90) * 0.8 + r * 0.2; // shorter when more vertical
  const dx = Math.sin(azRad) * len;
  const dy = -Math.cos(azRad) * len;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#21262d" strokeWidth="0.8" />
      <text x={cx} y={cy - r - 3} fill="#58a6ff" fontSize="7" textAnchor="middle" fontWeight="bold">N</text>
      <line x1={cx} y1={cy} x2={cx + dx} y2={cy + dy}
        stroke="#ff5533" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="2" fill="#ff5533" />
      {inclination === 0 && (
        <circle cx={cx} cy={cy} r="3" fill="none" stroke="#ff5533" strokeWidth="1.5" />
      )}
    </svg>
  );
}

// ──────────────────────────────────────────────
//  MAIN PANEL
// ──────────────────────────────────────────────
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
        <DrillSettingsBar />
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
          Set borehole parameters above, then click on the terrain to drill.
        </p>
        {drillMarkers.length > 0 && (
          <DrillMarkerList markers={drillMarkers} onSelect={setResult} onRemove={handleRemove} onClearAll={handleClearAll} />
        )}
      </>
    );
  }

  const { results, position, surfaceY, inclination = 0, azimuth = 0, maxDepth = 100 } = result;
  const totalDepth = results.length > 0 ? results[results.length - 1].endDepth : 0;
  const isVertical = inclination === 0;

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

      <DrillSettingsBar />

      {/* Borehole metadata */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        {!isVertical && <BoreholeCompass azimuth={azimuth} inclination={inclination} />}
        <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
          <div>Loc: ({position.x.toFixed(0)}, {position.z.toFixed(0)}) &middot; Surface: {surfaceY.toFixed(1)}m</div>
          <div>
            Incl: <b style={{ color: '#e6edf3' }}>{inclination}°</b>
            {!isVertical && <> &middot; Azim: <b style={{ color: '#e6edf3' }}>{azimuth}°</b></>}
            &middot; Depth: <b style={{ color: '#e6edf3' }}>{totalDepth.toFixed(1)}m</b>
          </div>
        </div>
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
          const inc = m.inclination ?? 0;
          const az  = m.azimuth ?? 0;
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
                <span style={{ fontWeight: 600 }}>{'\u26cf'}</span>
                <span>({m.position.x.toFixed(0)}, {m.position.z.toFixed(0)})</span>
                <span style={{ opacity: 0.5, fontSize: 10 }}>
                  {inc > 0 ? `${inc}\u00b0/${az}\u00b0` : 'V'}
                </span>
                <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{totalDepth.toFixed(0)}m</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(m.id); }}
                style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', padding: '4px 6px', fontSize: 13, lineHeight: 1, borderRadius: 4 }}
                title="Remove marker"
              >{'\u00d7'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}