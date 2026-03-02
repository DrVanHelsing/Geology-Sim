import { useState } from 'react';
import useStore from '../../store/useStore';
import { LayersIcon, ChevronUpIcon, ChevronDownIcon, PlusIcon, TrashIcon } from '../icons/Icons';
import { GEOLOGICAL_PROCESSES, LAYER_INTERACTIONS } from '../../config/geology';

export default function LegendPanel() {
  const layers       = useStore((s) => s.layers);
  const reorderLayer = useStore((s) => s.reorderLayer);
  const addLayer     = useStore((s) => s.addLayer);
  const removeLayer  = useStore((s) => s.removeLayer);
  const showPopup    = useStore((s) => s.showRockPopup);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#888888');
  const [showProcesses, setShowProcesses] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  // Display layers from surface → deepest
  const reversed = [...layers].reverse();

  const handleAdd = () => {
    if (!newName.trim()) return;
    addLayer({
      name: newName.trim(),
      baseElevation: 0,
      color: newColor,
      hex: parseInt(newColor.slice(1), 16),
      minerals: ['Unknown'],
      characteristics: 'Custom layer',
      grainSize: 'Variable',
      texture: 'Unknown',
      fossils: 'None',
      age: 'Unknown',
    });
    setNewName('');
    setAdding(false);
  };

  return (
    <>
      <div className="panel-header">
        <LayersIcon />
        Layer Manager
      </div>

      <div className="layer-list">
        {reversed.map((layer, vi) => {
          const realIdx = layers.length - 1 - vi;
          return (
            <div key={layer.id} className="legend-item layer-item">
              {/* Reorder controls */}
              <div className="layer-reorder">
                <button
                  className="layer-reorder-btn"
                  disabled={vi === 0}
                  onClick={(e) => { e.stopPropagation(); reorderLayer(realIdx, realIdx + 1); }}
                  title="Move up (toward surface)"
                >
                  <ChevronUpIcon />
                </button>
                <button
                  className="layer-reorder-btn"
                  disabled={vi === reversed.length - 1}
                  onClick={(e) => { e.stopPropagation(); reorderLayer(realIdx, realIdx - 1); }}
                  title="Move down (toward depth)"
                >
                  <ChevronDownIcon />
                </button>
              </div>

              <div className="legend-swatch" style={{ background: layer.color }} />

              <div className="legend-info" onClick={() => showPopup(layer)} style={{ cursor: 'pointer' }}>
                <div className="legend-name">{layer.name}</div>
                <div className="legend-elev">
                  {layer.baseElevation}m+ &middot; {layer.age}
                </div>
              </div>

              {/* Delete button */}
              {layers.length > 1 && (
                <button
                  className="layer-delete-btn"
                  onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                  title="Remove layer"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add layer */}
      {adding ? (
        <div className="layer-add-form">
          <input
            type="text"
            placeholder="Layer name…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
            <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} style={{ width: 32, height: 28, border: 'none', background: 'none', cursor: 'pointer' }} />
            <button className="btn btn-sm btn-primary" onClick={handleAdd}>Add</button>
            <button className="btn btn-sm btn-outline" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-sm btn-outline btn-block" style={{ marginTop: 10 }} onClick={() => setAdding(true)}>
          <PlusIcon /> Add Layer
        </button>
      )}

      {/* ── Active Geological Processes ─────────────────────────────── */}
      {GEOLOGICAL_PROCESSES && GEOLOGICAL_PROCESSES.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setShowProcesses((v) => !v)}
            style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 0', color: 'var(--text-2)', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            <span>Active Processes</span>
            <span style={{ fontSize: 14 }}>{showProcesses ? '▲' : '▼'}</span>
          </button>
          {showProcesses && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {GEOLOGICAL_PROCESSES.map((p) => (
                <div key={p.name}
                  style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                    padding: '8px 10px', borderLeft: '3px solid var(--accent)',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{p.name}</div>
                  {p.timescale && (
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>Timescale: {p.timescale}</div>
                  )}
                  {p.description && (
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, lineHeight: 1.4 }}>{p.description}</div>
                  )}
                  {p.visualSign && (
                    <div style={{ fontSize: 10, color: 'var(--text-3, var(--text-2))', marginTop: 3, fontStyle: 'italic' }}>
                      Visual: {p.visualSign}
                    </div>
                  )}
                  {p.affectedLayers && (
                    <div style={{ fontSize: 10, color: 'var(--text-3, var(--text-2))', marginTop: 2 }}>
                      Affects: {p.affectedLayers.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Stratigraphic Contacts ───────────────────────────────────── */}
      {LAYER_INTERACTIONS && LAYER_INTERACTIONS.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => setShowContacts((v) => !v)}
            style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 0', color: 'var(--text-2)', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            <span>Stratigraphic Contacts</span>
            <span style={{ fontSize: 14 }}>{showContacts ? '▲' : '▼'}</span>
          </button>
          {showContacts && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {LAYER_INTERACTIONS.map((c, i) => (
                <div key={i}
                  style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                    padding: '7px 10px', borderLeft: '3px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {(c.upper && c.lower) && (
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
                      {c.upper} / {c.lower}
                    </div>
                  )}
                  {c.contactType && (
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>{c.contactType}</div>
                  )}
                  {c.description && (
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, lineHeight: 1.4 }}>{c.description}</div>
                  )}
                  {c.hydrogeology && (
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>Hydro: {c.hydrogeology}</div>
                  )}
                  {c.hazard && (
                    <div style={{ fontSize: 11, color: '#e06c75', marginTop: 2 }}>⚠ {c.hazard}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
