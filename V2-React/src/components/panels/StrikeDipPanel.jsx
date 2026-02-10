// ================================================================
//  STRIKE & DIP PANEL — large stereonet-style visualization
// ================================================================
import useStore from '../../store/useStore';

export default function StrikeDipPanel() {
  const results        = useStore((s) => s.strikeDipResults);
  const clear          = useStore((s) => s.clearStrikeDip);
  const selectedMarker = useStore((s) => s.selectedMarker);

  // Determine which result card to highlight
  const selectedId = selectedMarker?.type === 'strikeDip' ? selectedMarker.markerId : null;

  return (
    <div className="panel-content strikedip-panel">
      <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Strike &amp; Dip</h3>

      {results.length === 0 ? (
        <p style={{ color: '#8b949e', fontSize: 13 }}>
          Click on the terrain to measure bedding orientation.
        </p>
      ) : (
        <>
          <button onClick={clear} className="btn btn-sm btn-outline" style={{ marginBottom: 10 }}>
            Clear All
          </button>

          {/* Stereonet overview — plots all measurements on one compass */}
          {results.length > 1 && (
            <div className="sd-stereonet-wrapper">
              <svg viewBox="0 0 200 200" className="sd-stereonet">
                <StereonetBase />
                {results.map((r, i) => (
                  <StereonetPlot key={i} strike={r.strike} dip={r.dip} index={i} />
                ))}
              </svg>
            </div>
          )}

          <div className="sd-results-list">
            {results.map((r, i) => (
              <div
                key={r.id || i}
                className="sd-result-card"
                style={r.id === selectedId ? {
                  outline: '1px solid rgba(255,165,0,0.4)',
                  background: 'rgba(255,165,0,0.08)',
                } : {}}
              >
                <div className="sd-result-header">
                  <span className="sd-result-num">#{i + 1}</span>
                  <span className="sd-result-layer">{r.layerName}</span>
                </div>

                <div className="sd-result-body">
                  {/* Large strike/dip symbol */}
                  <svg viewBox="0 0 110 110" className="sd-symbol-large">
                    <StrikeDipSymbol strike={r.strike} dip={r.dip} />
                  </svg>

                  <div className="sd-result-data">
                    <div className="sd-datum">
                      <span className="sd-datum-label">Strike</span>
                      <span className="sd-datum-value">{r.strike}°</span>
                    </div>
                    <div className="sd-datum">
                      <span className="sd-datum-label">Dip</span>
                      <span className="sd-datum-value">{r.dip}°</span>
                    </div>
                    <div className="sd-datum">
                      <span className="sd-datum-label">Dip Dir</span>
                      <span className="sd-datum-value">{r.dipDirection}°</span>
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

/* ── Large strike/dip compass symbol ── */
function StrikeDipSymbol({ strike, dip }) {
  const cx = 55, cy = 55, r = 42;
  const rad = (90 - strike) * Math.PI / 180;
  const dx = Math.cos(rad) * r;
  const dy = -Math.sin(rad) * r;
  const dipRad = rad - Math.PI / 2;
  const tx = Math.cos(dipRad) * r * 0.45;
  const ty = -Math.sin(dipRad) * r * 0.45;

  return (
    <g>
      {/* Compass circle */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#21262d" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r + 1} fill="none" stroke="#30363d" strokeWidth="0.5" />
      {/* Cardinal directions */}
      <text x={cx} y={cy - r - 7} fill="#58a6ff" fontSize="9" textAnchor="middle" fontWeight="bold">N</text>
      <text x={cx + r + 8} y={cy + 3} fill="#484f58" fontSize="7" textAnchor="middle">E</text>
      <text x={cx} y={cy + r + 12} fill="#484f58" fontSize="7" textAnchor="middle">S</text>
      <text x={cx - r - 8} y={cy + 3} fill="#484f58" fontSize="7" textAnchor="middle">W</text>
      {/* Tick marks around circle */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => {
        const ar = a * Math.PI / 180;
        const x1 = cx + Math.sin(ar) * (r - 2);
        const y1 = cy - Math.cos(ar) * (r - 2);
        const x2 = cx + Math.sin(ar) * (r + 2);
        const y2 = cy - Math.cos(ar) * (r + 2);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#30363d" strokeWidth="0.8" />;
      })}
      {/* Strike line — bold orange */}
      <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy}
        stroke="#ffa500" strokeWidth="3" strokeLinecap="round" />
      {/* Dip tick — orange */}
      <line x1={cx} y1={cy} x2={cx + tx} y2={cy + ty}
        stroke="#ffa500" strokeWidth="2.5" strokeLinecap="round" />
      {/* Dip angle label */}
      <text x={cx + tx * 1.3} y={cy + ty * 1.3 + 4}
        fill="#e6edf3" fontSize="10" fontWeight="600" fontFamily="sans-serif">{dip}°</text>
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.5" fill="#ffa500" />
    </g>
  );
}

/* ── Mini stereonet for overview ── */
function StereonetBase() {
  const cx = 100, cy = 100, r = 85;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0d1117" stroke="#30363d" strokeWidth="1" />
      {/* Cross lines */}
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#161b22" strokeWidth="0.5" />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#161b22" strokeWidth="0.5" />
      <text x={cx} y={cy - r - 4} fill="#58a6ff" fontSize="8" textAnchor="middle">N</text>
    </g>
  );
}

function StereonetPlot({ strike, dip, index }) {
  const cx = 100, cy = 100, r = 85;
  const rad = (90 - strike) * Math.PI / 180;
  const len = r * 0.8;
  const dx = Math.cos(rad) * len;
  const dy = -Math.sin(rad) * len;
  const colors = ['#ffa500', '#58a6ff', '#3fb950', '#f85149', '#d29922', '#bc8cff'];
  const c = colors[index % colors.length];
  return (
    <g>
      <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy}
        stroke={c} strokeWidth="2" opacity="0.8" />
      <circle cx={cx} cy={cy} r="3" fill={c} opacity="0.7" />
    </g>
  );
}
