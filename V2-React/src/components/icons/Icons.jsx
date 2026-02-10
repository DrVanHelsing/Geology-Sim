// ================================================================
//  SVG ICON COMPONENTS — improved inline icons with animation hooks
// ================================================================

const S = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function NavigateIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-active' : ''}>
      <path d="M3 11l9-9 9 9" />
      <path d="M12 2v14" />
      <path d="M5 22h14" />
      <path d="M5 19l3.5-3" />
      <path d="M15.5 16L19 19" />
    </svg>
  );
}

export function IdentifyIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-pulse' : ''}>
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="m21 21-5.2-5.2" strokeWidth="2.2" />
      {/* sparkle detail */}
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="13" cy="9" r="0.6" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}

export function DrillIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-drill-spin' : ''}>
      {/* drill bit body */}
      <path d="M12 2v8" strokeWidth="2.5" />
      <path d="M9 10h6l-1 4H10l-1-4z" strokeWidth="1.5" />
      {/* drill tip */}
      <path d="M10 14l2 8 2-8" strokeWidth="1.5" />
      {/* rotation lines */}
      <path d="M8.5 5a4 4 0 0 1 7 0" strokeWidth="1" opacity="0.4" />
      <path d="M7.5 7.5a6 6 0 0 1 9 0" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

export function MeasureIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-ruler-extend' : ''}>
      {/* ruler body */}
      <rect x="2" y="7" width="20" height="10" rx="1.5" strokeWidth="1.5" />
      {/* tick marks */}
      <line x1="6" y1="7" x2="6" y2="11" />
      <line x1="10" y1="7" x2="10" y2="12" strokeWidth="2" />
      <line x1="14" y1="7" x2="14" y2="11" />
      <line x1="18" y1="7" x2="18" y2="12" strokeWidth="2" />
      {/* measurement arrows */}
      <path d="M3 20h18" strokeWidth="1" opacity="0.4" />
      <path d="M3 19l2 1-2 1" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M21 19l-2 1 2 1" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

export function LayersIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-active' : ''}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

export function NotebookIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-active' : ''}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <line x1="8" y1="7" x2="16" y2="7" opacity="0.4" />
      <line x1="8" y1="10" x2="14" y2="10" opacity="0.3" />
    </svg>
  );
}

export function StrikeDipIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-compass-needle' : ''}>
      {/* compass circle */}
      <circle cx="12" cy="12" r="9.5" strokeWidth="1.5" />
      {/* N marker */}
      <text x="12" y="6" fontSize="5" fill="currentColor" stroke="none" textAnchor="middle" fontWeight="bold">N</text>
      {/* strike line */}
      <line x1="5.5" y1="14" x2="18.5" y2="14" strokeWidth="2.2" />
      {/* dip tick */}
      <line x1="12" y1="14" x2="12" y2="19" strokeWidth="2" />
      {/* dip angle */}
      <text x="14" y="19" fontSize="5.5" fill="currentColor" stroke="none" fontFamily="sans-serif">δ</text>
    </svg>
  );
}

export function CrossSectionIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-active' : ''}>
      {/* terrain profile */}
      <path d="M2 16 Q5 6 8 10 Q11 14 14 7 Q17 2 22 8" strokeWidth="2" />
      {/* subsurface layers */}
      <path d="M2 16 Q7 18 12 17 Q17 16 22 17" strokeWidth="1" opacity="0.4" />
      <path d="M2 19 Q7 20 12 19.5 Q17 19 22 20" strokeWidth="1" opacity="0.3" />
      {/* base */}
      <line x1="2" y1="22" x2="22" y2="22" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

export function SettingsIcon({ active }) {
  return (
    <svg {...S} className={active ? 'icon-spin-slow' : ''}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PinIcon({ pinned }) {
  return (
    <svg {...S} viewBox="0 0 20 20" style={{ width: 14, height: 14 }}>
      {pinned ? (
        <>
          <path d="M10 2v6" strokeWidth="2" />
          <rect x="5" y="8" width="10" height="3" rx="1" />
          <line x1="10" y1="11" x2="10" y2="18" />
          <circle cx="10" cy="18" r="1" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <path d="M10 2v6" strokeWidth="2" opacity="0.4" />
          <rect x="5" y="8" width="10" height="3" rx="1" opacity="0.4" />
          <line x1="10" y1="11" x2="10" y2="18" opacity="0.4" />
          <line x1="3" y1="3" x2="17" y2="17" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export function ChevronUpIcon() {
  return <svg {...S} viewBox="0 0 16 16" style={{ width: 12, height: 12 }}><path d="M4 10l4-4 4 4" /></svg>;
}

export function ChevronDownIcon() {
  return <svg {...S} viewBox="0 0 16 16" style={{ width: 12, height: 12 }}><path d="M4 6l4 4 4-4" /></svg>;
}

export function PlusIcon() {
  return <svg {...S} viewBox="0 0 16 16" style={{ width: 12, height: 12 }}><path d="M8 3v10M3 8h10" /></svg>;
}

export function TrashIcon() {
  return <svg {...S} viewBox="0 0 16 16" style={{ width: 12, height: 12 }}><path d="M3 4h10M5.5 4V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1M6 7v5M10 7v5M4 4l.8 9a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9L12 4" /></svg>;
}
