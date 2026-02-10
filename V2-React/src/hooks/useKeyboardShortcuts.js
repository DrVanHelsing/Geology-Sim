// ================================================================
//  useKeyboardShortcuts — global key bindings
// ================================================================
import { useEffect } from 'react';
import useStore from '../store/useStore';

export default function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e) => {
      // Don't intercept typing in form fields
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      const s = useStore.getState();

      switch (e.key) {
        case '1': s.setActiveTool('navigate'); break;
        case '2': s.setActiveTool('identify'); break;
        case '3': s.setActiveTool('drill');    break;
        case '4': s.setActiveTool('measure');  break;
        case '5': s.setActiveTool('strikedip');    break;
        case '6': s.setActiveTool('crosssection'); break;
        case 'l': case 'L': s.togglePanel('legend');   break;
        case 'n': case 'N': s.togglePanel('notebook'); break;
        case 'Escape':
          s.hideRockPopup();
          s.closePanel();
          break;
        default: break;
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
