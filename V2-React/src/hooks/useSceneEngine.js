// ================================================================
//  useSceneEngine — lifecycle hook that creates, wires, and
//  disposes the Three.js engine, bridging it to Zustand state.
// ================================================================
import { useEffect, useRef } from 'react';
import { SceneManager } from '../engine/SceneManager';
import {
  handleIdentify, handleDrill, handleMeasure, clearMeasure,
  handleStrikeDip, handleCrossSection, clearCrossSection, clearStrikeDip,
} from '../tools/ToolManager';
import useStore from '../store/useStore';

export default function useSceneEngine(containerRef) {
  const engineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || engineRef.current) return;

    const engine = new SceneManager();
    engineRef.current = engine;

    // ── Initialise engine (synchronous — progress callbacks update store) ──
    engine.init(containerRef.current, (progress, message) => {
      useStore.getState().setLoading(progress, message);
    });

    // ── Throttled hover → store ──
    let lastHover = 0;
    engine.onHover((point) => {
      const now = performance.now();
      if (now - lastHover < 33) return; // ~30 fps
      lastHover = now;

      const layer = engine.getLayerAt(point.x, point.y, point.z);
      useStore.getState().setHoverInfo({
        x: point.x,
        z: point.z,
        elevation: point.y,
        rockName: layer.name,
      });
    });

    // ── Click → tool handler → store ──
    engine.onClick((point) => {
      const s    = useStore.getState();
      const tool = s.activeTool;

      switch (tool) {
        case 'identify': {
          const layer = handleIdentify(engine, point);
          s.showRockPopup(layer);
          break;
        }
        case 'drill': {
          const result = handleDrill(engine, point);
          s.setDrillResult(result);
          s.addDrillMarker(result);      // persist
          s.openPanel('drill');
          break;
        }
        case 'measure': {
          const result = handleMeasure(engine, point);
          if (result) {
            s.setMeasureResult(result);
            s.addMeasureMarker(result);  // persist
            s.openPanel('measure');
          }
          break;
        }
        case 'strikedip': {
          const result = handleStrikeDip(engine, point);
          s.addStrikeDip(result);
          s.openPanel('strikedip');
          break;
        }
        case 'crosssection': {
          const result = handleCrossSection(engine, point);
          if (result) {
            s.setCrossSection(result);
            s.openPanel('crosssection');
          }
          break;
        }
        default:
          break;
      }
    });

    // ── Marker click (navigate mode) → recall saved data ──
    engine.onMarkerClick(({ type, markerId }) => {
      const s = useStore.getState();
      let data = null;
      let panel = null;

      if (type === 'drill') {
        data = s.drillMarkers.find((m) => m.id === markerId);
        if (data) {
          s.setDrillResult(data);
          panel = 'drill';
        }
      } else if (type === 'measure') {
        data = s.measureMarkers.find((m) => m.id === markerId);
        if (data) {
          s.setMeasureResult(data);
          panel = 'measure';
        }
      } else if (type === 'strikeDip') {
        data = s.strikeDipResults.find((m) => m.id === markerId);
        if (data) panel = 'strikedip';
      }

      if (data) {
        s.selectMarker({ type, markerId, data });
        if (panel) s.openPanel(panel);
      }
    });

    // ── Forward tool changes to engine ──
    const unsubTool = useStore.subscribe(
      (s) => s.activeTool,
      (tool) => {
        engine.setActiveTool(tool);
        if (tool !== 'measure') clearMeasure(engine);
        if (tool !== 'crosssection') clearCrossSection(engine);
      },
    );

    // ── Forward settings changes to engine ──
    const unsubSettings = useStore.subscribe(
      (s) => s.settings,
      (settings) => {
        engine.updateWaterLevel(settings.waterLevel);
        engine.updateFogDensity(settings.fogDensity);
        engine.updateSunElevation(settings.sunElevation);
        engine.updateExposure(settings.exposure);
        engine.setVegetationVisible(settings.showVegetation);
        engine.setShadowsEnabled(settings.showShadows);
        engine.setSSAOEnabled(settings.enableSSAO);
        engine.setCameraSpeed(settings.cameraSpeed);
      },
    );

    return () => {
      unsubTool();
      unsubSettings();
      engine.dispose();
      engineRef.current = null;
    };
  }, [containerRef]);

  return engineRef;
}
