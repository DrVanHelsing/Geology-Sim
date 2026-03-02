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

  // Core descriptive fields
  const coreFields = [
    ['Minerals',        layer.minerals?.join(', ')],
    ['Grain Size',      layer.grainSize],
    ['Texture',         layer.texture],
    ['Fossils',         layer.fossils || 'None'],
    ['Age',             layer.age],
    ['Characteristics', layer.characteristics],
  ];

  // Physical / engineering properties (only shown if present in the layer definition)
  const physFields = [
    layer.hardness           != null && ['Hardness',          `${layer.hardness} / 10 (Mohs)`],
    layer.mechanicalStrength != null && ['Compr. Strength',   `~${layer.mechanicalStrength} MPa`],
    layer.porosity           != null && ['Porosity',          `${(layer.porosity * 100).toFixed(1)} %`],
    layer.permeability                && ['Permeability',     layer.permeability],
    layer.jointSpacing                && ['Joint Spacing',    layer.jointSpacing],
    layer.jointSets          != null  && layer.jointSets > 0 && ['Joint Sets', `${layer.jointSets} (primary azimuth ${layer.jointAzimuth ?? '–'}°)`],
    layer.weatheringRate              && ['Weathering Rate',  layer.weatheringRate],
    layer.chemicalReactivity          && ['Chem. Reactivity', layer.chemicalReactivity],
    layer.hydraulicRole               && ['Hydraulic Role',   layer.hydraulicRole],
  ].filter(Boolean);

  // Process / interaction fields
  const processFields = [
    layer.erosionStyle       && ['Erosion Style',   layer.erosionStyle],
    layer.waterInteraction   && ['Water Interaction', layer.waterInteraction],
    layer.contactAbove       && ['Contact Above',   layer.contactAbove],
    layer.contactBelow       && ['Contact Below',   layer.contactBelow],
  ].filter(Boolean);

  const Section = ({ title, fields }) => fields.length === 0 ? null : (
    <>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    color: 'var(--accent)', textTransform: 'uppercase',
                    margin: '10px 0 4px', borderBottom: '1px solid #21262d', paddingBottom: 3 }}>
        {title}
      </div>
      <div className="popup-grid">
        {fields.map(([label, value]) => (
          <div key={label}>
            <div className="popup-field-label">{label}</div>
            <div className="popup-field-value">{value}</div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div id="rock-popup" ref={popupRef}>
      <button className="popup-close" onClick={hide}>&times;</button>
      <div className="popup-title">
        <div className="popup-swatch" style={{ background: layer.color }} />
        <span>{layer.name}</span>
      </div>
      <Section title="Petrography" fields={coreFields} />
      <Section title="Physical Properties" fields={physFields} />
      <Section title="Geological Processes" fields={processFields} />
    </div>
  );
}
