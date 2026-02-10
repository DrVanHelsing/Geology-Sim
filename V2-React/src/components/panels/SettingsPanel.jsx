import { useState } from 'react';
import useStore from '../../store/useStore';
import { SettingsIcon } from '../icons/Icons';

export default function SettingsPanel() {
  const settings       = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const [local, setLocal] = useState({ ...settings });

  const apply = () => updateSettings(local);

  return (
    <>
      <div className="panel-header"><SettingsIcon /> Settings</div>

      <div className="field-group">
        <div className="field-label">Water Level (m)</div>
        <input
          type="number"
          value={local.waterLevel}
          min={0} max={150} step={1}
          onChange={(e) => setLocal({ ...local, waterLevel: +e.target.value })}
        />
      </div>

      <div className="field-group">
        <div className="field-label">Fog Density</div>
        <input
          type="number"
          value={local.fogDensity}
          min={0} max={0.005} step={0.00005}
          onChange={(e) => setLocal({ ...local, fogDensity: +e.target.value })}
        />
      </div>

      <div className="field-group">
        <div className="field-label">Sun Elevation (°)</div>
        <input
          type="number"
          value={local.sunElevation}
          min={5} max={90} step={5}
          onChange={(e) => setLocal({ ...local, sunElevation: +e.target.value })}
        />
      </div>

      <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={apply}>
        Apply Settings
      </button>
    </>
  );
}
