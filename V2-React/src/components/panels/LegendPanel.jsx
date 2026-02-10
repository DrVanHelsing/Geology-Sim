import { useState } from 'react';
import useStore from '../../store/useStore';
import { LayersIcon, ChevronUpIcon, ChevronDownIcon, PlusIcon, TrashIcon } from '../icons/Icons';

export default function LegendPanel() {
  const layers       = useStore((s) => s.layers);
  const reorderLayer = useStore((s) => s.reorderLayer);
  const addLayer     = useStore((s) => s.addLayer);
  const removeLayer  = useStore((s) => s.removeLayer);
  const showPopup    = useStore((s) => s.showRockPopup);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#888888');

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
    </>
  );
}
