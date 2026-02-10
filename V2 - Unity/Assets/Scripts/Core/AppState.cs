// ================================================================
//  APPLICATION STATE — C# equivalent of the Zustand store
//  Uses events for decoupled UI updates (like subscribeWithSelector)
// ================================================================
using System;
using System.Collections.Generic;
using UnityEngine;

namespace GeologySim
{
    /// <summary>
    /// Singleton state manager replacing React+Zustand.
    /// All UI components subscribe to relevant events.
    /// </summary>
    public class AppState
    {
        static AppState _instance;
        public static AppState Instance => _instance ??= new AppState();

        // ── Active tool ──
        string _activeTool = "navigate";
        public string ActiveTool
        {
            get => _activeTool;
            set { _activeTool = value; OnToolChanged?.Invoke(value); }
        }
        public event Action<string> OnToolChanged;

        public void SetTool(string tool) => ActiveTool = tool;

        // ── Active panel ──
        string _activePanel;
        bool _panelPinned;
        public string ActivePanel
        {
            get => _activePanel;
            set { _activePanel = value; OnPanelChanged?.Invoke(value); }
        }
        public bool PanelPinned
        {
            get => _panelPinned;
            set { _panelPinned = value; OnPanelPinnedChanged?.Invoke(value); }
        }
        public event Action<string> OnPanelChanged;
        public event Action<bool> OnPanelPinnedChanged;

        public void SetPanel(string name) => ActivePanel = name;

        public void TogglePanel(string name)
        {
            ActivePanel = _activePanel == name ? null : name;
        }
        public void ClosePanel()
        {
            if (!_panelPinned) ActivePanel = null;
        }

        // ── Hover info ──
        public struct HoverData
        {
            public Vector3 worldPosition;
            public Vector3 normal;
            public float elevation;
            public string layerName;
            public string coordinates;
            public Color layerColor;
            public bool valid;
        }
        HoverData _hoverInfo;
        public HoverData HoverInfo
        {
            get => _hoverInfo;
            set { _hoverInfo = value; OnHoverChanged?.Invoke(value); }
        }
        public event Action<HoverData> OnHoverChanged;

        public void SetHoverData(HoverData data)
        {
            data.valid = true;
            HoverInfo = data;
        }

        // ── Rock popup ──
        public struct RockPopup
        {
            public bool visible;
            public string layerName;
            public float elevation;
            public string characteristics;
            public string[] minerals;
            public string grainSize;
            public string texture;
            public string fossils;
            public string age;
            public Color color;
        }

        RockPopup _rockPopupData;
        public RockPopup RockPopupInfo
        {
            get => _rockPopupData;
            set { _rockPopupData = value; OnRockPopupChanged?.Invoke(value); }
        }
        public event Action<RockPopup> OnRockPopupChanged;

        public void ShowRockPopup(RockPopup data)
        {
            data.visible = true;
            RockPopupInfo = data;
        }

        public void HideRockPopup()
        {
            var d = _rockPopupData;
            d.visible = false;
            RockPopupInfo = d;
        }

        // ── Drill results ──
        public class DrillResult
        {
            public string id;
            public Vector3 position;
            public float surfaceElevation;
            public float totalDepth;
            public List<DrillSegment> segments = new();
            public long timestamp;
        }
        public struct DrillSegment
        {
            public float fromDepth, toDepth;
            public string layerName;
            public Color color;
            public string[] minerals;
            public string grainSize;
            public string characteristics;
        }

        DrillResult _drillResult;
        public DrillResult CurrentDrill
        {
            get => _drillResult;
            set { _drillResult = value; OnDrillChanged?.Invoke(value); }
        }
        public List<DrillResult> DrillResults { get; } = new();
        public event Action<DrillResult> OnDrillChanged;
        public event Action OnDrillResultsChanged;

        public void AddDrillResult(DrillResult result)
        {
            DrillResults.Add(result);
            CurrentDrill = result;
            OnDrillResultsChanged?.Invoke();
        }

        // ── Measure results ──
        public class MeasureResult
        {
            public string id;
            public Vector3 start, end;
            public float horizontalDistance, verticalDifference, totalDistance;
            public float bearing, slope;
            public long timestamp;
        }

        MeasureResult _measureResult;
        public MeasureResult CurrentMeasure
        {
            get => _measureResult;
            set { _measureResult = value; OnMeasureChanged?.Invoke(value); }
        }
        public List<MeasureResult> MeasureResults { get; } = new();
        public event Action<MeasureResult> OnMeasureChanged;
        public event Action OnMeasureResultsChanged;

        public void AddMeasureResult(MeasureResult result)
        {
            MeasureResults.Add(result);
            CurrentMeasure = result;
            OnMeasureResultsChanged?.Invoke();
        }

        // ── Strike & Dip ──
        public class StrikeDipResult
        {
            public string id;
            public float strike, dip, dipDirection;
            public Vector3 position;
            public string layerName;
            public string notation;
        }

        public List<StrikeDipResult> StrikeDipResults { get; } = new();
        public event Action OnStrikeDipChanged;

        public void AddStrikeDipResult(StrikeDipResult result)
        {
            StrikeDipResults.Add(result);
            OnStrikeDipChanged?.Invoke();
        }

        // ── Cross-section ──
        public class CrossSectionData
        {
            public Vector3 start, end;
            public List<CrossSectionSample> samples = new();
            public float totalDistance, bearing;
        }
        public struct CrossSectionSample
        {
            public float distance, surfaceElevation, waterLevel;
            public List<CrossSectionLayer> layers;
        }
        public struct CrossSectionLayer
        {
            public float elevation;
            public string layerName;
            public Color color;
        }

        CrossSectionData _crossSection;
        public CrossSectionData CrossSection
        {
            get => _crossSection;
            set { _crossSection = value; OnCrossSectionChanged?.Invoke(value); }
        }
        public event Action<CrossSectionData> OnCrossSectionChanged;

        public void SetCrossSection(CrossSectionData data) => CrossSection = data;

        // ── Loading ──
        float _loadingProgress;
        string _loadingMessage = "Initialising...";
        bool _isLoaded;

        public float LoadingProgress => _loadingProgress;
        public string LoadingMessage => _loadingMessage;
        public bool IsLoaded => _isLoaded;
        public event Action<float, string, bool> OnLoadingChanged;
        public event Action OnLoadComplete;

        public void SetLoading(float progress, string message, bool done = false)
        {
            _loadingProgress = progress;
            _loadingMessage = message;
            _isLoaded = done || progress >= 1f;
            OnLoadingChanged?.Invoke(progress, message, _isLoaded);
            if (_isLoaded) OnLoadComplete?.Invoke();
        }

        // ── Settings ──
        public float WaterLevel = 38f; // must match GeologyConfig.WATER_LEVEL
        public float FogDensity = 0.00028f;
        public float SunElevation = 55f;
        public float AmbientIntensity = 1.15f;
        public event Action OnSettingsChanged;

        public void SetSetting(string key, float value)
        {
            switch (key)
            {
                case "waterLevel": WaterLevel = value; break;
                case "fogDensity": FogDensity = value; break;
                case "sunElevation": SunElevation = value; break;
                case "ambientIntensity": AmbientIntensity = value; break;
            }
            OnSettingsChanged?.Invoke();
        }

        public void NotifySettingsChanged() => OnSettingsChanged?.Invoke();

        // ── Marker ID counter ──
        int _nextId;
        public string NextId(string prefix = "") =>
            string.IsNullOrEmpty(prefix) ? $"{++_nextId}" : $"{prefix}-{++_nextId}";
    }
}
