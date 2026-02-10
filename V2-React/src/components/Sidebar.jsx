import useStore from '../store/useStore';
import {
  NavigateIcon, IdentifyIcon, DrillIcon, MeasureIcon,
  StrikeDipIcon, CrossSectionIcon,
  LayersIcon, NotebookIcon, HelpIcon, SettingsIcon,
} from './icons/Icons';

const TOOLS = [
  { id: 'navigate', icon: NavigateIcon, tip: 'Navigate (1)' },
  { id: 'identify', icon: IdentifyIcon, tip: 'Identify Rock (2)' },
  { id: 'drill',    icon: DrillIcon,    tip: 'Drill Core (3)' },
  { id: 'measure',     icon: MeasureIcon,      tip: 'Measure (4)' },
  { id: 'strikedip',   icon: StrikeDipIcon,    tip: 'Dip Dir / Dip (5)' },
  { id: 'crosssection', icon: CrossSectionIcon, tip: 'Cross-Section (6)' },
];

const PANELS = [
  { id: 'legend',   icon: LayersIcon,   tip: 'Layer Legend (L)' },
  { id: 'notebook', icon: NotebookIcon, tip: 'Field Notebook (N)' },
];

export default function Sidebar() {
  const activeTool  = useStore((s) => s.activeTool);
  const setTool     = useStore((s) => s.setActiveTool);
  const activePanel = useStore((s) => s.activePanel);
  const togglePanel = useStore((s) => s.togglePanel);
  const helpOpen    = useStore((s) => s.helpOpen);
  const toggleHelp  = useStore((s) => s.toggleHelp);

  return (
    <nav id="sidebar">
      {/* Tool buttons */}
      <div className="sb-section">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`sb-btn${activeTool === t.id ? ' active' : ''}`}
            data-tooltip={t.tip}
            onClick={() => setTool(t.id)}
          >
            <t.icon />
          </button>
        ))}
      </div>

      <div className="sb-divider" />

      {/* Panel toggle buttons */}
      <div className="sb-section">
        {PANELS.map((p) => (
          <button
            key={p.id}
            className={`sb-btn${activePanel === p.id ? ' active' : ''}`}
            data-tooltip={p.tip}
            onClick={() => togglePanel(p.id)}
          >
            <p.icon />
          </button>
        ))}
      </div>

      <div className="sb-spacer" />

      {/* Help & Settings */}
      <div className="sb-section">
        <button
          className={`sb-btn${helpOpen ? ' active' : ''}`}
          data-tooltip="Help (H)"
          onClick={() => toggleHelp()}
        >
          <HelpIcon />
        </button>
        <button
          className={`sb-btn${activePanel === 'settings' ? ' active' : ''}`}
          data-tooltip="Settings"
          onClick={() => togglePanel('settings')}
        >
          <SettingsIcon />
        </button>
      </div>
    </nav>
  );
}
