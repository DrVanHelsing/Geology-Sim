// ================================================================
//  ZUSTAND STORE — single source of truth for all React UI state
// ================================================================
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { LAYERS } from '../config/geology';

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // ── Active tool ──────────────────────────────
    activeTool: 'navigate',
    setActiveTool: (tool) => set({ activeTool: tool }),

    // ── Side panel ───────────────────────────────
    activePanel: null,
    panelPinned: false,
    openPanel:   (name) => set({ activePanel: name }),
    togglePanel: (name) =>
      set((s) => ({ activePanel: s.activePanel === name ? null : name })),
    closePanel: () => {
      const { panelPinned } = get();
      if (!panelPinned) set({ activePanel: null });
    },
    dismissPanel: () => set({ activePanel: null }),       // force-close ignoring pin
    togglePanelPin: () => set((s) => ({ panelPinned: !s.panelPinned })),

    // ── Layer management ─────────────────────────
    layers: LAYERS.map((l, i) => ({ ...l, id: i })),
    reorderLayer: (fromIndex, toIndex) =>
      set((s) => {
        const arr = [...s.layers];
        const [item] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, item);
        return { layers: arr };
      }),
    addLayer: (layer) =>
      set((s) => ({ layers: [...s.layers, { ...layer, id: Date.now() }] })),
    removeLayer: (id) =>
      set((s) => ({ layers: s.layers.filter((l) => l.id !== id) })),

    // ── Hover info (status bar) ──────────────────
    hoverInfo: null,
    setHoverInfo: (info) => set({ hoverInfo: info }),

    // ── Rock identification popup ────────────────
    rockPopup: null,
    showRockPopup: (layer) => set({ rockPopup: layer }),
    hideRockPopup: () => set({ rockPopup: null }),

    // ── Drill core result (latest + persistent collection) ──
    drillResult: null,
    setDrillResult: (result) => set({ drillResult: result }),
    drillMarkers: [],
    addDrillMarker: (marker) => set((s) => ({ drillMarkers: [...s.drillMarkers, marker] })),
    removeDrillMarker: (id) => set((s) => ({
      drillMarkers: s.drillMarkers.filter((m) => m.id !== id),
    })),
    clearDrillMarkers: () => set({ drillMarkers: [] }),

    // ── Measure result (latest + persistent collection) ──
    measureResult: null,
    setMeasureResult: (result) => set({ measureResult: result }),
    measureMarkers: [],
    addMeasureMarker: (marker) => set((s) => ({ measureMarkers: [...s.measureMarkers, marker] })),
    removeMeasureMarker: (id) => set((s) => ({
      measureMarkers: s.measureMarkers.filter((m) => m.id !== id),
    })),
    clearMeasureMarkers: () => set({ measureMarkers: [] }),

    // ── Strike & Dip ─────────────────────────────
    strikeDipResults: [],
    addStrikeDip: (result) => set((s) => ({ strikeDipResults: [...s.strikeDipResults, result] })),
    removeStrikeDip: (id) => set((s) => ({
      strikeDipResults: s.strikeDipResults.filter((r) => r.id !== id),
    })),
    clearStrikeDip: () => set({ strikeDipResults: [] }),

    // ── Cross-section ────────────────────────────
    crossSection: null,
    setCrossSection: (data) => set({ crossSection: data }),

    // ── Selected marker (click-to-view persistence) ──
    selectedMarker: null,
    selectMarker: (marker) => set({ selectedMarker: marker }),
    clearSelectedMarker: () => set({ selectedMarker: null }),

    // ── Help modal ────────────────────────────────
    helpOpen: false,
    openHelp:  () => set({ helpOpen: true }),
    closeHelp: () => set({ helpOpen: false }),
    toggleHelp: () => set((s) => ({ helpOpen: !s.helpOpen })),

    // ── Loading progress ─────────────────────────
    loadingProgress: 0,
    loadingMessage: 'Initializing…',
    isLoaded: false,
    setLoading: (progress, message) =>
      set({ loadingProgress: progress, loadingMessage: message, isLoaded: progress >= 100 }),

    // ── Settings ─────────────────────────────────
    settings: { waterLevel: 42, fogDensity: 0.00028, sunElevation: 55 },
    updateSettings: (patch) =>
      set((s) => ({ settings: { ...s.settings, ...patch } })),
  })),
);

export default useStore;
