// ================================================================
//  HelpModal — large visual overlay for help & instructions
// ================================================================
import { useState, useEffect, useCallback, useMemo } from 'react';
import useStore from '../store/useStore';
import {
  NavigateIcon, IdentifyIcon, DrillIcon, MeasureIcon,
  StrikeDipIcon, CrossSectionIcon, LayersIcon, NotebookIcon,
  SettingsIcon,
} from './icons/Icons';

/* ── tiny reusable pieces ─────────────────────────────────── */

/** Keyboard key cap */
function Key({ children, wide }) {
  return <span className={`hm-key${wide ? ' wide' : ''}`}>{children}</span>;
}

/* ── Touch gesture graphics (mobile help) ────────────── */

/** Phone outline with zone highlight and gesture arrows */
function TouchZoneGraphic({ zone }) {
  if (zone === 'left') {
    return (
      <svg width="54" height="70" viewBox="0 0 54 70" fill="none">
        <rect x="3" y="2" width="48" height="66" rx="8" stroke="var(--text-3)" strokeWidth="1.5"/>
        <line x1="27" y1="2" x2="27" y2="68" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3,2.5" opacity="0.5"/>
        <rect x="3" y="2" width="24" height="66" rx="8" fill="var(--accent)" opacity="0.08"/>
        <circle cx="15" cy="40" r="5" fill="var(--accent)" opacity="0.75"/>
        <line x1="15" y1="33" x2="15" y2="24" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
        <polyline points="11.5,28 15,24 18.5,28" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="7" y1="40" x2="13" y2="40" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
        <line x1="17" y1="40" x2="23" y2="40" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    );
  }
  if (zone === 'right') {
    return (
      <svg width="54" height="70" viewBox="0 0 54 70" fill="none">
        <rect x="3" y="2" width="48" height="66" rx="8" stroke="var(--text-3)" strokeWidth="1.5"/>
        <line x1="27" y1="2" x2="27" y2="68" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3,2.5" opacity="0.5"/>
        <rect x="27" y="2" width="24" height="66" rx="8" fill="var(--accent)" opacity="0.08"/>
        <circle cx="39" cy="40" r="5" fill="var(--accent)" opacity="0.75"/>
        <path d="M 31,28 A 9,11 0 0 1 47,28" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
        <polyline points="44,24 47,28 43,30" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // pinch
  return (
    <svg width="54" height="70" viewBox="0 0 54 70" fill="none">
      <rect x="3" y="2" width="48" height="66" rx="8" stroke="var(--text-3)" strokeWidth="1.5"/>
      <circle cx="19" cy="38" r="5" fill="var(--accent)" opacity="0.75"/>
      <circle cx="35" cy="38" r="5" fill="var(--accent)" opacity="0.75"/>
      <line x1="13" y1="38" x2="7" y2="38" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="10,35 7,38 10,41" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="41" y1="38" x2="47" y2="38" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="44,35 47,38 44,41" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Single-finger tap ripple graphic */
function TapGraphic() {
  return (
    <svg width="54" height="70" viewBox="0 0 54 70" fill="none">
      <rect x="3" y="2" width="48" height="66" rx="8" stroke="var(--text-3)" strokeWidth="1.5"/>
      <circle cx="27" cy="38" r="5" fill="var(--accent)" opacity="0.75"/>
      <circle cx="27" cy="38" r="11" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35"/>
      <circle cx="27" cy="38" r="17" stroke="var(--accent)" strokeWidth="1" opacity="0.15"/>
    </svg>
  );
}

/** Mouse illustration */
function MouseGraphic({ highlight }) {
  // highlight: 'left' | 'right' | 'middle' | 'scroll'
  return (
    <svg className="hm-mouse" viewBox="0 0 60 90" width="48" height="72">
      {/* body */}
      <rect x="5" y="20" width="50" height="60" rx="22" fill="none" stroke="var(--text-3)" strokeWidth="2" />
      {/* divider */}
      <line x1="30" y1="20" x2="30" y2="48" stroke="var(--text-3)" strokeWidth="1.2" />
      {/* left button */}
      <rect x="6" y="21" width="23" height="26" rx="10"
        fill={highlight === 'left' ? 'var(--accent)' : 'rgba(255,255,255,0.04)'}
        opacity={highlight === 'left' ? 0.55 : 1} />
      {/* right button */}
      <rect x="31" y="21" width="23" height="26" rx="10"
        fill={highlight === 'right' ? 'var(--accent)' : 'rgba(255,255,255,0.04)'}
        opacity={highlight === 'right' ? 0.55 : 1} />
      {/* scroll wheel */}
      <rect x="26" y="28" width="8" height="14" rx="4"
        fill={highlight === 'scroll' || highlight === 'middle' ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}
        opacity={highlight === 'scroll' || highlight === 'middle' ? 0.7 : 1}
        stroke="var(--text-3)" strokeWidth="1" />
      {/* scroll arrows when scroll highlighted */}
      {highlight === 'scroll' && (
        <>
          <polyline points="30,24 27,27 33,27" fill="var(--accent)" opacity="0.8"/>
          <polyline points="30,46 27,43 33,43" fill="var(--accent)" opacity="0.8"/>
        </>
      )}
    </svg>
  );
}

/** Animated WASD cluster */
function WASDCluster() {
  return (
    <div className="hm-key-cluster">
      <div className="hm-key-row"><Key>W</Key></div>
      <div className="hm-key-row"><Key>A</Key><Key>S</Key><Key>D</Key></div>
    </div>
  );
}

/** Arrow key cluster */
function ArrowCluster() {
  return (
    <div className="hm-key-cluster">
      <div className="hm-key-row"><Key>↑</Key></div>
      <div className="hm-key-row"><Key>←</Key><Key>↓</Key><Key>→</Key></div>
    </div>
  );
}

/** Tool card with icon + description */
function ToolCard({ icon: Icon, shortcut, name, desc, realWorld }) {
  return (
    <div className="hm-tool-card">
      <div className="hm-tool-icon"><Icon /></div>
      <div className="hm-tool-body">
        <div className="hm-tool-name">
          {name}
          <Key>{shortcut}</Key>
        </div>
        <div className="hm-tool-desc">{desc}</div>
        {realWorld && (
          <div className="hm-tool-real">
            <span className="hm-real-tag">Field equivalent</span>
            {realWorld}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── tab data ─────────────────────────────────────────────── */

const TABS = [
  { id: 'camera',    label: 'Camera Controls' },
  { id: 'tools',     label: 'Geological Tools' },
  { id: 'shortcuts', label: 'Keyboard Shortcuts' },
  { id: 'tips',      label: 'Tips & Tricks' },
];

/* ── tab content components ───────────────────────────────── */

/* ── Mobile camera controls tab ──────────────────────── */

function MobileCameraTab() {
  return (
    <div className="hm-tab-body">
      <div className="hm-control-grid">
        <div className="hm-control-card">
          <div className="hm-control-visual"><TouchZoneGraphic zone="left" /></div>
          <div className="hm-control-info">
            <div className="hm-control-label">Move Camera</div>
            <div className="hm-control-desc">Drag on the <strong>left half</strong> of the 3D view to physically move the camera — forward, back, and side to side relative to where you're looking.</div>
          </div>
        </div>
        <div className="hm-control-card">
          <div className="hm-control-visual"><TouchZoneGraphic zone="right" /></div>
          <div className="hm-control-info">
            <div className="hm-control-label">Orbit / Rotate</div>
            <div className="hm-control-desc">Drag on the <strong>right half</strong> of the 3D view to orbit and rotate the camera — look around the terrain from any angle.</div>
          </div>
        </div>
        <div className="hm-control-card">
          <div className="hm-control-visual"><TouchZoneGraphic zone="pinch" /></div>
          <div className="hm-control-info">
            <div className="hm-control-label">Pinch to Zoom</div>
            <div className="hm-control-desc">Pinch two fingers together or apart anywhere in the 3D view to zoom in and out. Get close to inspect textures or zoom out for an overview.</div>
          </div>
        </div>
        <div className="hm-control-card">
          <div className="hm-control-visual"><TapGraphic /></div>
          <div className="hm-control-info">
            <div className="hm-control-label">Tap to Interact</div>
            <div className="hm-control-desc">Tap anywhere in the 3D view to use the currently active tool — identify a rock, drill a core, measure distances, and more. Select tools from the toolbar at the bottom of the screen.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Desktop (PC) camera controls tab ────────────────── */

function PCCameraTab() {
  return (
    <div className="hm-tab-body">
      <div className="hm-control-grid">
        {/* Orbit */}
        <div className="hm-control-card">
          <div className="hm-control-visual">
            <MouseGraphic highlight="left" />
          </div>
          <div className="hm-control-info">
            <div className="hm-control-label">Orbit / Rotate</div>
            <div className="hm-control-desc">Left-click and drag to orbit around the terrain. Great for examining outcrops from different angles.</div>
          </div>
        </div>
        {/* Pan */}
        <div className="hm-control-card">
          <div className="hm-control-visual">
            <MouseGraphic highlight="right" />
          </div>
          <div className="hm-control-info">
            <div className="hm-control-label">Pan</div>
            <div className="hm-control-desc">Right-click drag or middle-click drag to pan the view across the terrain.</div>
          </div>
        </div>
        {/* Zoom */}
        <div className="hm-control-card">
          <div className="hm-control-visual">
            <MouseGraphic highlight="scroll" />
          </div>
          <div className="hm-control-info">
            <div className="hm-control-label">Zoom</div>
            <div className="hm-control-desc">Scroll wheel or touchpad pinch to zoom in and out. Get close to inspect textures or zoom out for an overview.</div>
          </div>
        </div>
        {/* WASD / Arrow movement */}
        <div className="hm-control-card">
          <div className="hm-control-visual hm-control-keys">
            <WASDCluster />
            <span className="hm-or-divider">or</span>
            <ArrowCluster />
          </div>
          <div className="hm-control-info">
            <div className="hm-control-label">Move Camera</div>
            <div className="hm-control-desc">Use WASD or arrow keys to physically move the camera across the terrain — forward, back, left, and right relative to where you're looking.</div>
          </div>
        </div>
        {/* Elevation */}
        <div className="hm-control-card">
          <div className="hm-control-visual hm-control-keys">
            <div className="hm-key-row"><Key>Q</Key><Key>E</Key></div>
          </div>
          <div className="hm-control-info">
            <div className="hm-control-label">Elevation</div>
            <div className="hm-control-desc">Q lowers and E raises the camera vertically — useful for inspecting cliff faces or getting an aerial view.</div>
          </div>
        </div>
        {/* Shift boost */}
        <div className="hm-control-card">
          <div className="hm-control-visual hm-control-keys">
            <div className="hm-key-row"><Key wide>Shift</Key><span className="hm-key-plus">+</span><span className="hm-key-label">Move</span></div>
          </div>
          <div className="hm-control-info">
            <div className="hm-control-label">Speed Boost</div>
            <div className="hm-control-desc">Hold Shift with any movement key for 3× faster traversal.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Platform-aware Camera tab ────────────────────────── */

function CameraTab() {
  const isMobile = useMemo(
    () => typeof window !== 'undefined' &&
          ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    [],
  );
  const [showMobile, setShowMobile] = useState(isMobile);

  return (
    <div>
      {/* Platform toggle */}
      <div className="hm-platform-toggle">
        <button
          className={`hm-platform-btn${!showMobile ? ' active' : ''}`}
          onClick={() => setShowMobile(false)}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          Desktop / PC
        </button>
        <button
          className={`hm-platform-btn${showMobile ? ' active' : ''}`}
          onClick={() => setShowMobile(true)}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <circle cx="12" cy="18" r="1" fill="currentColor"/>
          </svg>
          Mobile / Touch
        </button>
      </div>

      {showMobile ? <MobileCameraTab /> : <PCCameraTab />}
    </div>
  );
}

function ToolsTab() {
  return (
    <div className="hm-tab-body">
      <div className="hm-tools-grid">
        <ToolCard
          icon={NavigateIcon} shortcut="1" name="Navigate"
          desc="Default mode — orbit, pan and zoom freely. Click placed markers to review or delete them."
          realWorld="Walking between outcrops to observe the landscape and revisit previous stations."
        />
        <ToolCard
          icon={IdentifyIcon} shortcut="2" name="Identify Rock"
          desc="Click any point on the terrain to identify the geological layer. Shows rock type, age, composition and description."
          realWorld="Examining an outcrop with a hand lens — identifying lithology, mineral content and stratigraphic position."
        />
        <ToolCard
          icon={DrillIcon} shortcut="3" name="Drill Core"
          desc="Simulate drilling a borehole. Produces a vertical core log showing every subsurface layer with thicknesses."
          realWorld="Diamond drilling extracts cylindrical cores for subsurface investigation — essential for finding resources and planning construction."
        />
        <ToolCard
          icon={MeasureIcon} shortcut="4" name="Measure"
          desc="Click two points to measure straight-line distance and elevation difference. A dashed line with a label appears on the map."
          realWorld="Using a tape, rangefinder or GPS to measure distances. Elevation differences reveal bed thickness and structural offsets."
        />
        <ToolCard
          icon={StrikeDipIcon} shortcut="5" name="Dip Direction / Dip"
          desc="Click an outcrop to calculate the dip direction and dip of the bedding plane — the fundamental structural measurement (avoids right-hand-rule ambiguity)."
          realWorld="Using a Brunton compass-clinometer to record the 3D orientation of rock layers, faults and foliations."
        />
        <ToolCard
          icon={CrossSectionIcon} shortcut="6" name="Cross-Section"
          desc="Click two points to define a transect. A vertical cross-section is generated showing subsurface layer structure."
          realWorld="Constructing interpretive diagrams by projecting surface data downward using strikes, dips and borehole data."
        />
      </div>
    </div>
  );
}

function ShortcutsTab() {
  const shortcuts = [
    { keys: ['1'], action: 'Navigate tool', cat: 'Tools' },
    { keys: ['2'], action: 'Identify Rock tool', cat: 'Tools' },
    { keys: ['3'], action: 'Drill Core tool', cat: 'Tools' },
    { keys: ['4'], action: 'Measure tool', cat: 'Tools' },
    { keys: ['5'], action: 'Dip Dir / Dip tool', cat: 'Tools' },
    { keys: ['6'], action: 'Cross-Section tool', cat: 'Tools' },
    { keys: ['L'], action: 'Toggle Layer Legend', cat: 'Panels' },
    { keys: ['N'], action: 'Toggle Field Notebook', cat: 'Panels' },
    { keys: ['H'], action: 'Toggle this Help window', cat: 'Panels' },
    { keys: ['Esc'], action: 'Close current panel / help', cat: 'General' },
  ];

  const isMobile = useMemo(
    () => typeof window !== 'undefined' &&
          ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    [],
  );

  let lastCat = '';
  return (
    <div className="hm-tab-body">
      {isMobile && (
        <div className="hm-mobile-note">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          On a touchscreen device, keyboard shortcuts aren’t available. Use the toolbar at the bottom of the screen to switch tools, and the panel buttons to open the legend, notebook, and settings.
        </div>
      )}
      <div className="hm-shortcut-table">
        {shortcuts.map((s, i) => {
          const showCat = s.cat !== lastCat;
          lastCat = s.cat;
          return (
            <div key={i}>
              {showCat && <div className="hm-shortcut-cat">{s.cat}</div>}
              <div className="hm-shortcut-row">
                <div className="hm-shortcut-keys">
                  {s.keys.map((k, j) => <Key key={j}>{k}</Key>)}
                </div>
                <div className="hm-shortcut-action">{s.action}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hm-panels-section">
        <div className="hm-section-title">Panel Buttons</div>
        <div className="hm-panel-cards">
          <div className="hm-panel-card">
            <div className="hm-panel-card-icon"><LayersIcon /></div>
            <div>
              <div className="hm-panel-card-name">Layer Legend <Key>L</Key></div>
              <div className="hm-panel-card-desc">Complete stratigraphic column — all geological layers with colours, names, elevation ranges and rock types.</div>
            </div>
          </div>
          <div className="hm-panel-card">
            <div className="hm-panel-card-icon"><NotebookIcon /></div>
            <div>
              <div className="hm-panel-card-name">Field Notebook <Key>N</Key></div>
              <div className="hm-panel-card-desc">Running log of observations, measurements and drill results. Export as PDF for a field report.</div>
            </div>
          </div>
          <div className="hm-panel-card">
            <div className="hm-panel-card-icon"><SettingsIcon /></div>
            <div>
              <div className="hm-panel-card-name">Settings</div>
              <div className="hm-panel-card-desc">Adjust water level, fog density and sun elevation.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TipsTab() {
  const tips = [
    { title: 'Pin panels', desc: 'Click the pin icon on any panel to keep it open while using tools — handy for watching the notebook update in real time.' },
    { title: 'Delete markers', desc: 'In Navigate mode, click any placed marker to view its data or remove it from the map.' },
    { title: 'Underwater view', desc: 'Zoom below the water surface to see subsurface stratigraphy through the translucent water.' },
    { title: 'Reading outcrop patterns', desc: 'Colour bands on hillsides are different rock layers. Where they form V-shapes in valleys, the V points in the direction of dip — a classic field mapping rule.' },
    { title: 'Shift for speed', desc: 'Hold Shift while using WASD or arrow keys to move 2.5× faster — great for covering large terrain quickly.' },
    { title: 'Use cross-sections wisely', desc: 'Draw cross-sections perpendicular to the strike of beds for the clearest view of subsurface structure.' },
  ];

  return (
    <div className="hm-tab-body">
      <div className="hm-tips-grid">
        {tips.map((t, i) => (
          <div key={i} className="hm-tip-card">
            <div className="hm-tip-num">{i + 1}</div>
            <div>
              <div className="hm-tip-title">{t.title}</div>
              <div className="hm-tip-desc">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TAB_CONTENT = {
  camera:    CameraTab,
  tools:     ToolsTab,
  shortcuts: ShortcutsTab,
  tips:      TipsTab,
};

/* ── main modal ───────────────────────────────────────────── */

export default function HelpModal() {
  const helpOpen   = useStore((s) => s.helpOpen);
  const closeHelp  = useStore((s) => s.closeHelp);
  const [tab, setTab] = useState('camera');

  // Escape key closes modal
  const onKey = useCallback((e) => {
    if (e.key === 'Escape') closeHelp();
  }, [closeHelp]);
  useEffect(() => {
    if (!helpOpen) return;
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [helpOpen, onKey]);

  if (!helpOpen) return null;

  const TabContent = TAB_CONTENT[tab];

  return (
    <div className="hm-overlay" onClick={closeHelp}>
      <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="hm-header">
          <div className="hm-title">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Help &amp; Instructions
          </div>
          <button className="hm-close" onClick={closeHelp} title="Close (Esc)">✕</button>
        </div>

        {/* Tabs */}
        <div className="hm-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`hm-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content (scrollable) */}
        <div className="hm-content">
          <TabContent />
        </div>
      </div>
    </div>
  );
}
