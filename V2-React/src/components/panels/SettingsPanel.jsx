import { useState, useCallback } from 'react';
import useStore from '../../store/useStore';
import { SettingsIcon } from '../icons/Icons';

/* ── Time-of-day presets ──────────────────────── */
const TIME_PRESETS = [
  { label: 'Dawn',      icon: '🌅', sun: 12, fog: 0.00005, exposure: 1.15 },
  { label: 'Morning',   icon: '☀️', sun: 35, fog: 0.00004, exposure: 1.40 },
  { label: 'Noon',      icon: '🔆', sun: 55, fog: 0.00003, exposure: 1.60 },
  { label: 'Afternoon', icon: '⛅', sun: 42, fog: 0.00004, exposure: 1.45 },
  { label: 'Dusk',      icon: '🌇', sun: 10, fog: 0.00006, exposure: 1.05 },
];

/* ── Range slider with live value ─────────────── */
function RangeField({ label, value, min, max, step, format, onChange }) {
  const display = format ? format(value) : value;
  return (
    <div className="settings-range-group">
      <div className="settings-range-header">
        <span className="settings-range-label">{label}</span>
        <span className="settings-range-value">{display}</span>
      </div>
      <input
        type="range"
        className="settings-slider"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}

/* ── Toggle switch ───────────────────────────── */
function Toggle({ label, checked, onChange }) {
  return (
    <label className="settings-toggle-row">
      <span className="settings-toggle-label">{label}</span>
      <span className={`settings-toggle${checked ? ' on' : ''}`} onClick={() => onChange(!checked)}>
        <span className="settings-toggle-thumb" />
      </span>
    </label>
  );
}

/* ── Section divider ──────────────────────────── */
function Section({ title }) {
  return <div className="settings-section-title">{title}</div>;
}

export default function SettingsPanel() {
  const settings       = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetSettings  = useStore((s) => s.resetSettings);

  const [local, setLocal] = useState({ ...settings });

  const set = useCallback((key, val) => {
    setLocal((prev) => ({ ...prev, [key]: val }));
    // Apply immediately so every slider is live
    updateSettings({ [key]: val });
  }, [updateSettings]);

  const applyPreset = useCallback((preset) => {
    const patch = {
      sunElevation: preset.sun,
      fogDensity: preset.fog,
      exposure: preset.exposure,
    };
    setLocal((prev) => ({ ...prev, ...patch }));
    updateSettings(patch);
  }, [updateSettings]);

  const apply = useCallback(() => {
    updateSettings(local);
  }, [local, updateSettings]);

  const handleReset = useCallback(() => {
    const defaults = {
      waterLevel: 42,
      fogDensity: 0.00003,
      sunElevation: 55,
      exposure: 1.60,
      showVegetation: true,
      showShadows: true,
      enableSSAO: true,
      cameraSpeed: 1.0,
    };
    setLocal(defaults);
    resetSettings();
  }, [resetSettings]);

  return (
    <>
      <div className="panel-header"><SettingsIcon /> Settings</div>

      {/* ── Time of Day presets ── */}
      <Section title="Time of Day" />
      <div className="settings-presets">
        {TIME_PRESETS.map((p) => (
          <button
            key={p.label}
            className={`settings-preset-btn${local.sunElevation === p.sun ? ' active' : ''}`}
            onClick={() => applyPreset(p)}
            title={p.label}
          >
            <span className="settings-preset-icon">{p.icon}</span>
            <span className="settings-preset-label">{p.label}</span>
          </button>
        ))}
      </div>

      {/* ── Environment sliders ── */}
      <Section title="Environment" />

      <RangeField
        label="Sun Elevation"
        value={local.sunElevation}
        min={5} max={90} step={1}
        format={(v) => `${v}°`}
        onChange={(v) => set('sunElevation', v)}
      />

      <RangeField
        label="Water Level"
        value={local.waterLevel}
        min={0} max={100} step={1}
        format={(v) => `${v} m`}
        onChange={(v) => set('waterLevel', v)}
      />

      <RangeField
        label="Fog Density"
        value={local.fogDensity}
        min={0} max={0.0006} step={0.00001}
        format={(v) => v.toFixed(5)}
        onChange={(v) => set('fogDensity', v)}
      />

      <RangeField
        label="Exposure"
        value={local.exposure}
        min={0.3} max={2.5} step={0.05}
        format={(v) => v.toFixed(2)}
        onChange={(v) => set('exposure', v)}
      />

      <RangeField
        label="Camera Speed"
        value={local.cameraSpeed}
        min={0.25} max={3.0} step={0.25}
        format={(v) => `${v}×`}
        onChange={(v) => set('cameraSpeed', v)}
      />

      {/* ── Visual toggles ── */}
      <Section title="Visual Options" />

      <Toggle
        label="Vegetation"
        checked={local.showVegetation}
        onChange={(v) => { set('showVegetation', v); updateSettings({ showVegetation: v }); }}
      />

      <Toggle
        label="Shadows"
        checked={local.showShadows}
        onChange={(v) => { set('showShadows', v); updateSettings({ showShadows: v }); }}
      />

      <Toggle
        label="Ambient Occlusion (SSAO)"
        checked={local.enableSSAO}
        onChange={(v) => { set('enableSSAO', v); updateSettings({ enableSSAO: v }); }}
      />

      {/* ── Action buttons ── */}
      <div className="settings-actions">
        <button className="btn btn-primary btn-block" onClick={apply}>
          Apply Settings
        </button>
        <button className="btn btn-outline btn-block" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>
    </>
  );
}
