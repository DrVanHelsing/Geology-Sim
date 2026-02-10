import { useRef, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';

export default function RockPopup() {
  const layer = useStore((s) => s.rockPopup);
  const hide  = useStore((s) => s.hideRockPopup);
  const popupRef = useRef(null);

  /* click-away: dismiss when clicking outside the popup */
  const handleClickOutside = useCallback((e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      hide();
    }
  }, [hide]);

  useEffect(() => {
    if (!layer) return;
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [layer, handleClickOutside]);

  if (!layer) return null;

  const fields = [
    ['Minerals',        layer.minerals.join(', ')],
    ['Grain Size',      layer.grainSize],
    ['Texture',         layer.texture],
    ['Fossils',         layer.fossils || 'None'],
    ['Age',             layer.age],
    ['Characteristics', layer.characteristics],
  ];

  return (
    <div id="rock-popup" ref={popupRef}>
      <button className="popup-close" onClick={hide}>&times;</button>
      <div className="popup-title">
        <div className="popup-swatch" style={{ background: layer.color }} />
        <span>{layer.name}</span>
      </div>
      <div className="popup-grid">
        {fields.map(([label, value]) => (
          <div key={label}>
            <div className="popup-field-label">{label}</div>
            <div className="popup-field-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
