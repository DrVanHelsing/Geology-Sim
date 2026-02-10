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

// Wider panels for data-heavy views
const WIDE_PANELS = new Set(['strikedip', 'crosssection']);

export default function Panel() {
  const activePanel    = useStore((s) => s.activePanel);
  const panelPinned    = useStore((s) => s.panelPinned);
  const togglePanelPin = useStore((s) => s.togglePanelPin);
  const closePanel     = useStore((s) => s.closePanel);
  const isOpen         = activePanel !== null;
  const Page           = activePanel ? PAGES[activePanel] : null;
  const isWide         = activePanel && WIDE_PANELS.has(activePanel);

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
        {/* Pin/Unpin button */}
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
