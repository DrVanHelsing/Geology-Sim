// ================================================================
//  MenuScreen — Island selection lobby shown before sim loads
// ================================================================
import { useState } from 'react';
import useStore from '../store/useStore';
import { ISLANDS } from '../config/islands';

/* ── tiny icon helpers ──────────────────────────────────────── */
function ChevronIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <polyline points="2,4 7,10 12,4" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.8 6.8a2.2 2.2 0 1 1 3.1 2c-.6.4-1 .9-1 1.7" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="13" r="0.9" fill="currentColor"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Island card ────────────────────────────────────────────── */
function IslandCard({ island, onEnter }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`menu-island-card${island.disabled ? ' disabled' : ''}`}>

      {/* Badge */}
      <div className="menu-island-badge" style={{ background: island.badgeColor + '22', color: island.badgeColor, borderColor: island.badgeColor + '44' }}>
        {island.badge}
      </div>

      {/* Header */}
      <div className="menu-island-header">
        <div>
          <div className="menu-island-name">{island.name}</div>
          <div className="menu-island-subtitle">{island.subtitle}</div>
        </div>
        <span className="menu-island-difficulty">{island.difficulty}</span>
      </div>

      {/* Tagline */}
      <div className="menu-island-tagline">{island.tagline}</div>

      {/* Brief description */}
      <p className="menu-island-desc">{island.description}</p>

      {/* Expand toggle */}
      <button
        className="menu-expand-btn"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span>{expanded ? 'Less info' : 'More info'}</span>
        <ChevronIcon open={expanded} />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="menu-island-detail">
          <div className="menu-detail-section">
            <div className="menu-detail-heading">Key Features</div>
            <div className="menu-feature-list">
              {island.features.map((f) => (
                <div key={f.label} className="menu-feature-row">
                  <span className="menu-feature-icon">{f.icon}</span>
                  <div>
                    <div className="menu-feature-label">{f.label}</div>
                    <div className="menu-feature-detail">{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="menu-detail-section">
            <div className="menu-detail-heading">Learning Objectives</div>
            <ul className="menu-objectives">
              {island.learningObjectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Enter button */}
      <button
        className="menu-enter-btn"
        disabled={island.disabled}
        onClick={() => !island.disabled && onEnter(island)}
      >
        {island.disabled ? 'Coming Soon' : (
          <>
            Enter Simulation
            <ArrowRightIcon />
          </>
        )}
      </button>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function MenuScreen() {
  const menuOpen  = useStore((s) => s.menuOpen);
  const enterSim  = useStore((s) => s.enterSim);
  const openHelp  = useStore((s) => s.openHelp);

  if (!menuOpen) return null;

  return (
    <div id="menu-screen">
      {/* Background grid decoration */}
      <div className="menu-bg-grid" aria-hidden="true" />

      {/* Help button — top-right */}
      <button className="menu-help-btn" onClick={openHelp} title="Help &amp; Controls">
        <HelpIcon />
        <span>Help</span>
      </button>

      {/* Hero */}
      <div className="menu-hero">
        <div className="menu-hero-eyebrow">Interactive Field Simulation</div>
        <h1 className="menu-hero-title">Structural Geology Simulator</h1>
        <p className="menu-hero-sub">
          Choose a geological island to begin your field survey.
          Each location presents a unique set of rock types, structures, and processes.
        </p>
      </div>

      {/* Island cards */}
      <div className="menu-cards-row">
        {ISLANDS.map((island) => (
          <IslandCard key={island.id} island={island} onEnter={enterSim} />
        ))}
      </div>

      {/* Footer */}
      <div className="menu-footer">
        Use the toolbar inside the sim to navigate, identify rocks, drill boreholes, and more.
        Press <kbd>F1</kbd> at any time to re-open help.
      </div>
    </div>
  );
}
