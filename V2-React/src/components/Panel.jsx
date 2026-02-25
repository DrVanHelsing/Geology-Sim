import { useEffect, useCallback } from 'react';
import useStore from '../store/useStore';
import { PinIcon } from './icons/Icons';
import LegendPanel       from './panels/LegendPanel';
import NotebookPanel     from './panels/NotebookPanel';
import DrillPanel        from './panels/DrillPanel';
import MeasurePanel      from './panels/MeasurePanel';
import StrikeDipPanel    from './panels/StrikeDipPanel';
import CrossSectionPanel from './panels/CrossSectionPanel';
import SettingsPanel     from './panels/SettingsPanel';

const PAGES = {
  legend:       LegendPanel,
  notebook:     NotebookPanel,
  drill:        DrillPanel,
  measure:      MeasurePanel,
  strikedip:    StrikeDipPanel,
  crosssection: CrossSectionPanel,
  settings:     SettingsPanel,
};

const PANEL_TITLES = {
  legend:       'Layer Manager',
  notebook:     'Field Notebook',
  drill:        'Drill Core',
  measure:      'Measurement',
  strikedip:    'Dip Direction / Dip',
  crosssection: 'Cross-Section',
  settings:     'Settings',
};

// Wider panels for data-heavy views
const WIDE_PANELS = new Set(['strikedip', 'crosssection']);

export default function Panel() {
  const activePanel    = useStore((s) => s.activePanel);
  const panelPinned    = useStore((s) => s.panelPinned);
  const togglePanelPin = useStore((s) => s.togglePanelPin);
  const closePanel     = useStore((s) => s.closePanel);
  const dismissPanel   = useStore((s) => s.dismissPanel);
  const isOpen         = activePanel !== null;
  const Page           = activePanel ? PAGES[activePanel] : null;
  const isWide         = activePanel && WIDE_PANELS.has(activePanel);
  const panelTitle     = activePanel ? PANEL_TITLES[activePanel] : '';

  // Click-away dismiss when unpinned
  const handleBackdropClick = useCallback(() => {
    if (!panelPinned) closePanel();
  }, [panelPinned, closePanel]);

  // Press Escape to close panel
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) closePanel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closePanel]);

  return (
    <>
      {/* Invisible backdrop for click-away when unpinned */}
      {isOpen && !panelPinned && (
        <div className="panel-backdrop" onClick={handleBackdropClick} />
      )}

      <div id="panel" className={`${isOpen ? 'open' : ''}${isWide ? ' wide' : ''}`}>
        {/* Mobile close header — visible only on touch/small screens */}
        {isOpen && (
          <div className="panel-mobile-header">
            <div className="panel-mobile-handle" />
            <span className="panel-mobile-title">{panelTitle}</span>
            <button
              className="panel-mobile-close"
              onClick={dismissPanel}
              aria-label="Close panel"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Pin/Unpin button (desktop) */}
        {isOpen && (
          <button
            className={`panel-pin-btn${panelPinned ? ' pinned' : ''}`}
            onClick={togglePanelPin}
            title={panelPinned ? 'Unpin panel' : 'Pin panel open'}
          >
            <PinIcon pinned={panelPinned} />
          </button>
        )}
        {Page && <div className="panel-page"><Page /></div>}
      </div>
    </>
  );
}
