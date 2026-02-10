// ================================================================
//  UI MANAGER — Complete runtime Canvas-based UI (V2-React parity)
//  Sidebar with procedural icons, animated tooltips, full panels
//  for all tools, toast notifications, pin button, HUD crosshair,
//  rotating compass, loading screen.
// ================================================================
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace GeologySim
{
    public class UIManager : MonoBehaviour
    {
        // Root
        Canvas _mainCanvas;
        CanvasScaler _scaler;
        GameObject _sidebar;
        GameObject _statusBar;
        GameObject _loadingScreen;
        GameObject _rockPopup;
        GameObject _compass;
        GameObject _crosshair;
        GameObject _toastContainer;

        // Status bar text
        TMP_Text _coordText, _elevText, _layerText, _toolText;

        // Panel container
        GameObject _panelContainer;
        Dictionary<string, GameObject> _panels = new();

        // Sidebar button tracking
        Dictionary<string, GameObject> _toolBtnGOs = new();
        Dictionary<string, Image> _toolBtnBGs = new();
        Dictionary<string, GameObject> _panelBtnGOs = new();
        Dictionary<string, Image> _panelBtnBGs = new();

        // Active glow ring references
        Dictionary<string, Image> _glowRings = new();

        // Loading
        TMP_Text _loadingText;
        Image _loadingBar;

        // Panel content references for live updates
        Transform _drillContent, _measureContent, _strikeDipContent, _crossSectionContent;
        TMP_Text _notebookArea;
        List<string> _notebookEntries = new();

        // Toast queue
        List<(string text, Color color, float expiry)> _toasts = new();
        float _toastNextY;

        // Compass needle
        RectTransform _compassNeedle;

        // Pin state
        bool _panelPinned;
        Image _pinBtnImg;

        // ── V2-React Colors ──
        static readonly Color BG_DARK      = new(0.051f, 0.067f, 0.090f, 0.95f);  // #0d1117
        static readonly Color BG_PANEL     = new(0.098f, 0.114f, 0.141f, 0.95f);  // #161b22
        static readonly Color BG_HOVER     = new(0.133f, 0.153f, 0.188f, 1f);     // #21262d
        static readonly Color TEXT_1       = new(0.902f, 0.929f, 0.953f);          // #e6edf3
        static readonly Color TEXT_2       = new(0.545f, 0.580f, 0.620f);          // #8b949e
        static readonly Color ACCENT       = new(0.345f, 0.651f, 1.0f);           // #58a6ff
        static readonly Color ACCENT_DIM   = new(0.345f, 0.651f, 1.0f, 0.15f);
        static readonly Color BTN_NORMAL   = new(0.071f, 0.086f, 0.114f, 0.92f);
        static readonly Color BTN_ACTIVE   = new(0.345f, 0.651f, 1.0f, 0.22f);
        static readonly Color DANGER       = new(0.973f, 0.318f, 0.286f);         // #f85149
        static readonly Color SUCCESS      = new(0.224f, 0.745f, 0.412f);

        // Dimensions
        const float SIDEBAR_W = 104f;
        const float PANEL_W = 400f;
        const float STATUS_H = 46f;
        const float BTN_SIZE = 72f;

        // ──────────────────────────────────────────
        //  INITIALIZATION
        // ──────────────────────────────────────────

        public void Initialize()
        {
            CreateMainCanvas();
            CreateSidebar();
            CreateStatusBar();
            CreatePanelContainer();
            CreateLoadingScreen();
            CreateRockPopup();
            CreateCompass();
            CreateCrosshair();
            CreateToastContainer();

            var state = AppState.Instance;
            state.OnLoadingChanged += OnLoadingChanged;
            state.OnRockPopupChanged += OnRockPopupChanged;
            state.OnToolChanged += OnToolChanged;
            state.OnPanelChanged += OnPanelChanged;
            state.OnHoverChanged += OnHoverChanged;
            state.OnDrillChanged += OnDrillChanged;
            state.OnMeasureChanged += OnMeasureChanged;
            state.OnDrillResultsChanged += RefreshDrillPanel;
            state.OnMeasureResultsChanged += RefreshMeasurePanel;
            state.OnStrikeDipChanged += RefreshStrikeDipPanel;
            state.OnCrossSectionChanged += OnCrossSectionChanged;

            SetActivePanel(null);
            HideRockPopup();
            UpdateToolHighlight(state.ActiveTool ?? "navigate");
        }

        void Update()
        {
            // Rotate compass to match camera
            if (_compassNeedle != null && Camera.main != null)
            {
                float yaw = Camera.main.transform.eulerAngles.y;
                _compassNeedle.localRotation = Quaternion.Euler(0, 0, yaw);
            }

            // Update scale bar based on camera distance
            UpdateScaleBar();

            // Expire toasts
            CleanupToasts();
        }

        void UpdateScaleBar()
        {
            if (_scaleBarText == null || Camera.main == null) return;
            // Approximate: pixel-to-world ratio at terrain level
            float camH = Camera.main.transform.position.y;
            float barPixels = 80f;
            // Rough estimate: at camera height h, 1 pixel ≈ h/(screen_height * fov_factor) world units
            float fovFactor = Mathf.Tan(Camera.main.fieldOfView * 0.5f * Mathf.Deg2Rad);
            float worldPerPixel = (camH * 2f * fovFactor) / Screen.height;
            float worldWidth = barPixels * worldPerPixel;

            // Snap to nice values
            float[] nice = { 10, 20, 50, 100, 200, 500, 1000, 2000, 5000 };
            float chosen = 100;
            foreach (float n in nice) { if (n >= worldWidth * 0.5f) { chosen = n; break; } }
            _scaleBarText.text = chosen >= 1000 ? $"{chosen / 1000:F0}km" : $"{chosen:F0}m";
        }

        // ──────────────────────────────────────────
        //  CANVAS
        // ──────────────────────────────────────────

        void CreateMainCanvas()
        {
            var go = new GameObject("UICanvas");
            go.transform.SetParent(transform);
            _mainCanvas = go.AddComponent<Canvas>();
            _mainCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _mainCanvas.sortingOrder = 100;

            _scaler = go.AddComponent<CanvasScaler>();
            _scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            // DPI-aware reference: shrink reference on high-DPI screens → larger UI
            float dpiScale = Screen.dpi > 50 ? Mathf.Clamp(Screen.dpi / 96f, 1f, 2.5f)
                                              : (Screen.height > 1440 ? Screen.height / 1080f : 1f);
            float uiBoost = Mathf.Max(1f, dpiScale * 1.05f);
            _scaler.referenceResolution = new Vector2(1920f / uiBoost, 1080f / uiBoost);
            _scaler.matchWidthOrHeight = 0.5f;

            go.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        // ──────────────────────────────────────────
        //  SIDEBAR
        // ──────────────────────────────────────────

        void CreateSidebar()
        {
            _sidebar = new GameObject("Sidebar", typeof(RectTransform));
            _sidebar.transform.SetParent(_mainCanvas.transform, false);
            var bg = _sidebar.AddComponent<Image>();
            bg.color = BG_DARK;
            var rt = Anchor(_sidebar, 0, 0, 0, 1, 0, 0.5f);
            rt.offsetMin = new Vector2(0, 0);
            rt.offsetMax = new Vector2(SIDEBAR_W, 0);

            var vlg = _sidebar.AddComponent<VerticalLayoutGroup>();
            vlg.padding = new RectOffset(6, 6, 10, 10);
            vlg.spacing = 2;
            vlg.childAlignment = TextAnchor.UpperCenter;
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;

            // ── Tools section ──
            AddSidebarLabel(_sidebar.transform, "TOOLS", 13);

            // Navigate (1)
            AddToolButton("navigate", "Navigate", "1", DrawNavigateIcon);
            // Identify (2)
            AddToolButton("identify", "Identify Rock", "2", DrawIdentifyIcon);
            // Drill (3)
            AddToolButton("drill", "Drill Core", "3", DrawDrillIcon);
            // Measure (4)
            AddToolButton("measure", "Measure Distance", "4", DrawMeasureIcon);
            // Strike & Dip (5)
            AddToolButton("strikeDip", "Strike & Dip", "5", DrawStrikeDipIcon);
            // Cross Section (6)
            AddToolButton("crossSection", "Cross Section", "6", DrawCrossSectionIcon);

            // Separator
            CreateSeparator(_sidebar.transform);

            // ── Panels section ──
            AddSidebarLabel(_sidebar.transform, "PANELS", 13);

            AddPanelButton("legend", "Legend", "L", DrawLegendIcon);
            AddPanelButton("notebook", "Notebook", "N", DrawNotebookIcon);
            AddPanelButton("settings", "Settings", ",", DrawSettingsIcon);
        }

        void AddSidebarLabel(Transform parent, string text, int size)
        {
            var go = new GameObject($"Label_{text}");
            go.transform.SetParent(parent, false);
            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = 22;
            le.preferredWidth = SIDEBAR_W - 10;

            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = size;
            tmp.fontStyle = FontStyles.Bold;
            tmp.color = TEXT_2 * 0.7f;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.characterSpacing = 6;
        }

        void AddToolButton(string tool, string tooltip, string shortcut, Action<Transform> drawIcon)
        {
            var go = CreateIconButton(_sidebar.transform, tooltip, shortcut, drawIcon, () =>
            {
                AppState.Instance.SetTool(tool);
            });
            _toolBtnGOs[tool] = go;
            _toolBtnBGs[tool] = go.GetComponent<Image>();
        }

        void AddPanelButton(string panel, string tooltip, string shortcut, Action<Transform> drawIcon)
        {
            var go = CreateIconButton(_sidebar.transform, tooltip, shortcut, drawIcon, () =>
            {
                var s = AppState.Instance;
                s.SetPanel(s.ActivePanel == panel ? null : panel);
            });
            _panelBtnGOs[panel] = go;
            _panelBtnBGs[panel] = go.GetComponent<Image>();
        }

        GameObject CreateIconButton(Transform parent, string tooltip, string shortcut,
            Action<Transform> drawIcon, Action onClick)
        {
            var go = new GameObject($"Btn_{tooltip}");
            go.transform.SetParent(parent, false);

            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = BTN_SIZE;
            le.preferredWidth = BTN_SIZE;
            le.minHeight = BTN_SIZE;

            var img = go.AddComponent<Image>();
            img.color = BTN_NORMAL;

            var btn = go.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(() => onClick?.Invoke());
            var colors = btn.colors;
            colors.normalColor = BTN_NORMAL;
            colors.highlightedColor = BG_HOVER;
            colors.pressedColor = ACCENT;
            colors.selectedColor = BTN_ACTIVE;
            colors.fadeDuration = 0.12f;
            btn.colors = colors;

            // Active glow ring (hidden by default)
            var glowGo = new GameObject("Glow", typeof(RectTransform));
            glowGo.transform.SetParent(go.transform, false);
            var glowRt = glowGo.GetComponent<RectTransform>();
            glowRt.anchorMin = Vector2.zero;
            glowRt.anchorMax = Vector2.one;
            glowRt.sizeDelta = new Vector2(4, 4);
            var glowImg = glowGo.AddComponent<Image>();
            glowImg.color = Color.clear;
            glowImg.raycastTarget = false;

            // Icon container
            var iconContainer = new GameObject("Icon", typeof(RectTransform));
            iconContainer.transform.SetParent(go.transform, false);
            var iconRt = iconContainer.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0.15f, 0.15f);
            iconRt.anchorMax = new Vector2(0.85f, 0.85f);
            iconRt.offsetMin = Vector2.zero;
            iconRt.offsetMax = Vector2.zero;

            drawIcon?.Invoke(iconContainer.transform);

            // Tooltip on hover
            var tooltipTrigger = go.AddComponent<TooltipTrigger>();
            tooltipTrigger.tooltipText = $"{tooltip} ({shortcut})";

            return go;
        }

        // ──────────────────────────────────────────
        //  PROCEDURAL ICONS (rendered via IconFactory textures)
        // ──────────────────────────────────────────

        void DrawNavigateIcon(Transform p) => AddSpriteIcon(p, "navigate");
        void DrawIdentifyIcon(Transform p) => AddSpriteIcon(p, "identify");
        void DrawDrillIcon(Transform p)    => AddSpriteIcon(p, "drill");
        void DrawMeasureIcon(Transform p)  => AddSpriteIcon(p, "measure");
        void DrawStrikeDipIcon(Transform p) => AddSpriteIcon(p, "strikeDip");
        void DrawCrossSectionIcon(Transform p) => AddSpriteIcon(p, "crossSection");
        void DrawLegendIcon(Transform p)   => AddSpriteIcon(p, "legend");
        void DrawNotebookIcon(Transform p) => AddSpriteIcon(p, "notebook");
        void DrawSettingsIcon(Transform p) => AddSpriteIcon(p, "settings");

        void AddSpriteIcon(Transform parent, string iconName)
        {
            var go = new GameObject("IconSprite", typeof(RectTransform));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
            var img = go.AddComponent<Image>();
            img.sprite = IconFactory.Get(iconName);
            img.color = TEXT_1;
            img.raycastTarget = false;
            img.preserveAspect = true;
        }

        void CreateSeparator(Transform parent)
        {
            var go = new GameObject("Separator");
            go.transform.SetParent(parent, false);
            var img = go.AddComponent<Image>();
            img.color = new Color(1, 1, 1, 0.08f);
            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = 1;
            le.flexibleWidth = 1;
        }

        void UpdateToolHighlight(string activeTool)
        {
            foreach (var kvp in _toolBtnBGs)
            {
                bool active = kvp.Key == activeTool;
                kvp.Value.color = active ? BTN_ACTIVE : BTN_NORMAL;

                // Glow ring
                var glow = kvp.Value.transform.Find("Glow");
                if (glow != null)
                    glow.GetComponent<Image>().color = active ? ACCENT_DIM : Color.clear;

                // Tint icon sprite
                var iconSprite = kvp.Value.transform.Find("Icon/IconSprite");
                if (iconSprite != null)
                {
                    var ico = iconSprite.GetComponent<Image>();
                    if (ico != null) ico.color = active ? ACCENT : TEXT_1;
                }
            }
        }

        void UpdatePanelHighlight(string activePanel)
        {
            foreach (var kvp in _panelBtnBGs)
            {
                bool active = kvp.Key == activePanel;
                kvp.Value.color = active ? BTN_ACTIVE : BTN_NORMAL;

                var glow = kvp.Value.transform.Find("Glow");
                if (glow != null)
                    glow.GetComponent<Image>().color = active ? ACCENT_DIM : Color.clear;

                var iconSprite = kvp.Value.transform.Find("Icon/IconSprite");
                if (iconSprite != null)
                {
                    var ico = iconSprite.GetComponent<Image>();
                    if (ico != null) ico.color = active ? ACCENT : TEXT_1;
                }
            }
        }

        // ──────────────────────────────────────────
        //  STATUS BAR
        // ──────────────────────────────────────────

        void CreateStatusBar()
        {
            var go = new GameObject("StatusBar", typeof(RectTransform));
            go.transform.SetParent(_mainCanvas.transform, false);
            var img = go.AddComponent<Image>();
            img.color = BG_DARK;
            var rt = Anchor(go, 0, 0, 1, 0, 0.5f, 0);
            rt.offsetMin = new Vector2(SIDEBAR_W + 4, 0);
            rt.offsetMax = new Vector2(0, STATUS_H);
            _statusBar = go;

            var hlg = go.AddComponent<HorizontalLayoutGroup>();
            hlg.padding = new RectOffset(14, 14, 4, 4);
            hlg.spacing = 20;
            hlg.childAlignment = TextAnchor.MiddleLeft;
            hlg.childForceExpandWidth = false;

            // Emoji-style prefixed labels
            _coordText = CreateStatusLabel(go.transform, "\u25CB Coordinates: --", 220);
            _elevText  = CreateStatusLabel(go.transform, "\u25B2 Elevation: --", 180);
            _layerText = CreateStatusLabel(go.transform, "\u25A0 Layer: --", 260);
            _toolText  = CreateStatusLabel(go.transform, "\u25C6 Tool: navigate", 200);
        }

        TMP_Text CreateStatusLabel(Transform parent, string text, float width)
        {
            var go = new GameObject("Label");
            go.transform.SetParent(parent, false);
            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = 14;
            tmp.color = TEXT_2;
            tmp.alignment = TextAlignmentOptions.MidlineLeft;
            var le = go.AddComponent<LayoutElement>();
            le.preferredWidth = width;
            le.preferredHeight = 24;
            return tmp;
        }

        // ──────────────────────────────────────────
        //  PANEL CONTAINER
        // ──────────────────────────────────────────

        void CreatePanelContainer()
        {
            _panelContainer = new GameObject("PanelContainer", typeof(RectTransform));
            _panelContainer.transform.SetParent(_mainCanvas.transform, false);
            var rt = Anchor(_panelContainer, 0, 0, 0, 1, 0, 0.5f);
            rt.offsetMin = new Vector2(SIDEBAR_W + 6, STATUS_H + 4);
            rt.offsetMax = new Vector2(SIDEBAR_W + 6 + PANEL_W, -4);

            CreateLegendPanel();
            CreateDrillPanel();
            CreateMeasurePanel();
            CreateStrikeDipPanel();
            CreateCrossSectionPanel();
            CreateNotebookPanel();
            CreateSettingsPanel();
        }

        // ── Floating Panel Factory ──

        GameObject CreateFloatingPanel(string id, string title, float? customWidth = null)
        {
            float w = customWidth ?? PANEL_W;

            var go = new GameObject($"Panel_{id}", typeof(RectTransform));
            go.transform.SetParent(_panelContainer.transform, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0, 0);
            rt.anchorMax = new Vector2(0, 1);
            rt.pivot = new Vector2(0, 0.5f);
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = new Vector2(w, 0);

            var bg = go.AddComponent<Image>();
            bg.color = BG_PANEL;

            var vlg = go.AddComponent<VerticalLayoutGroup>();
            vlg.padding = new RectOffset(12, 12, 10, 12);
            vlg.spacing = 6;
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;

            // Header row with title + pin + close
            var header = new GameObject("Header");
            header.transform.SetParent(go.transform, false);
            var hLayout = header.AddComponent<HorizontalLayoutGroup>();
            hLayout.spacing = 6;
            hLayout.childAlignment = TextAnchor.MiddleLeft;
            hLayout.childForceExpandWidth = false;
            var hLe = header.AddComponent<LayoutElement>();
            hLe.preferredHeight = 28;

            // Title
            var titleGo = new GameObject("Title");
            titleGo.transform.SetParent(header.transform, false);
            var titleTmp = titleGo.AddComponent<TextMeshProUGUI>();
            titleTmp.text = title;
            titleTmp.fontSize = 18;
            titleTmp.fontStyle = FontStyles.Bold;
            titleTmp.color = TEXT_1;
            var titleLe = titleGo.AddComponent<LayoutElement>();
            titleLe.flexibleWidth = 1;
            titleLe.preferredHeight = 28;

            // Pin button
            var pinGo = new GameObject("PinBtn");
            pinGo.transform.SetParent(header.transform, false);
            var pinImg = pinGo.AddComponent<Image>();
            pinImg.color = Color.clear;
            var pinBtn = pinGo.AddComponent<Button>();
            pinBtn.targetGraphic = pinImg;
            pinBtn.onClick.AddListener(() =>
            {
                _panelPinned = !_panelPinned;
                AppState.Instance.PanelPinned = _panelPinned;
                UpdatePinVisual();
                ShowToast(_panelPinned ? "Panel pinned" : "Panel unpinned", TEXT_2);
            });
            var pinLe = pinGo.AddComponent<LayoutElement>();
            pinLe.preferredWidth = 22;
            pinLe.preferredHeight = 22;
            var pinTxt = new GameObject("Txt");
            pinTxt.transform.SetParent(pinGo.transform, false);
            var pinTmp = pinTxt.AddComponent<TextMeshProUGUI>();
            pinTmp.text = "\u25CB"; // ○ (unpinned) / ● (pinned)
            pinTmp.fontSize = 16;
            pinTmp.color = TEXT_2;
            pinTmp.alignment = TextAlignmentOptions.Center;
            var pinTxtRt = pinTxt.GetComponent<RectTransform>();
            pinTxtRt.anchorMin = Vector2.zero;
            pinTxtRt.anchorMax = Vector2.one;
            pinTxtRt.sizeDelta = Vector2.zero;

            // Close button
            var closeGo = new GameObject("CloseBtn");
            closeGo.transform.SetParent(header.transform, false);
            var closeImg = closeGo.AddComponent<Image>();
            closeImg.color = Color.clear;
            var closeBtn = closeGo.AddComponent<Button>();
            closeBtn.targetGraphic = closeImg;
            closeBtn.onClick.AddListener(() => AppState.Instance.SetPanel(null));
            var closeLe = closeGo.AddComponent<LayoutElement>();
            closeLe.preferredWidth = 22;
            closeLe.preferredHeight = 22;
            var closeTxt = new GameObject("X");
            closeTxt.transform.SetParent(closeGo.transform, false);
            var closeTmp = closeTxt.AddComponent<TextMeshProUGUI>();
            closeTmp.text = "\u2715"; // ✕
            closeTmp.fontSize = 16;
            closeTmp.color = TEXT_2;
            closeTmp.alignment = TextAlignmentOptions.Center;
            var closeRt2 = closeTxt.GetComponent<RectTransform>();
            closeRt2.anchorMin = Vector2.zero;
            closeRt2.anchorMax = Vector2.one;
            closeRt2.sizeDelta = Vector2.zero;

            // Divider
            AddDivider(go.transform);

            // Scrollable content area
            var scrollGo = new GameObject("Scroll", typeof(RectTransform));
            scrollGo.transform.SetParent(go.transform, false);
            var scrollRt = scrollGo.GetComponent<RectTransform>();
            var scrollLe = scrollGo.AddComponent<LayoutElement>();
            scrollLe.flexibleHeight = 1;

            var scrollRect = scrollGo.AddComponent<ScrollRect>();
            scrollRect.horizontal = false;
            scrollRect.vertical = true;
            scrollRect.movementType = ScrollRect.MovementType.Elastic;
            scrollRect.scrollSensitivity = 20;
            var scrollMask = scrollGo.AddComponent<RectMask2D>();

            // Viewport
            var viewport = new GameObject("Viewport", typeof(RectTransform));
            viewport.transform.SetParent(scrollGo.transform, false);
            var vpRt = viewport.GetComponent<RectTransform>();
            vpRt.anchorMin = Vector2.zero;
            vpRt.anchorMax = Vector2.one;
            vpRt.sizeDelta = Vector2.zero;
            vpRt.offsetMin = Vector2.zero;
            vpRt.offsetMax = Vector2.zero;

            var content = new GameObject("Content", typeof(RectTransform));
            content.transform.SetParent(viewport.transform, false);
            var cRt = content.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0, 1);
            cRt.anchorMax = new Vector2(1, 1);
            cRt.pivot = new Vector2(0.5f, 1);
            cRt.sizeDelta = new Vector2(0, 0);

            var csf = content.AddComponent<ContentSizeFitter>();
            csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            var cVlg = content.AddComponent<VerticalLayoutGroup>();
            cVlg.spacing = 4;
            cVlg.childForceExpandWidth = true;
            cVlg.childForceExpandHeight = false;
            cVlg.padding = new RectOffset(0, 0, 0, 8);

            scrollRect.content = cRt;
            scrollRect.viewport = vpRt;

            go.SetActive(false);
            _panels[id] = go;
            return go;
        }

        Transform GetPanelContent(GameObject panel)
        {
            var scroll = panel.transform.Find("Scroll");
            if (scroll == null) return panel.transform;
            var vp = scroll.Find("Viewport");
            if (vp == null) return scroll;
            var content = vp.Find("Content");
            return content ?? vp;
        }

        // ── Legend Panel ──

        void CreateLegendPanel()
        {
            var go = CreateFloatingPanel("legend", "Geological Legend");
            var content = GetPanelContent(go);

            AddPanelSubheader(content, "Geological Layers");

            foreach (var layer in GeologyConfig.LAYERS)
            {
                var row = new GameObject("LayerRow");
                row.transform.SetParent(content, false);
                var hlg = row.AddComponent<HorizontalLayoutGroup>();
                hlg.spacing = 8;
                hlg.padding = new RectOffset(4, 4, 3, 3);
                hlg.childAlignment = TextAnchor.MiddleLeft;
                hlg.childForceExpandWidth = false;
                var le = row.AddComponent<LayoutElement>();
                le.preferredHeight = 30;

                // Color swatch with rounded corner effect
                var swatch = new GameObject("Swatch");
                swatch.transform.SetParent(row.transform, false);
                var swImg = swatch.AddComponent<Image>();
                swImg.color = layer.color;
                var swLe = swatch.AddComponent<LayoutElement>();
                swLe.preferredWidth = 18;
                swLe.preferredHeight = 18;

                // Layer info
                var info = new GameObject("Info");
                info.transform.SetParent(row.transform, false);
                var vlg = info.AddComponent<VerticalLayoutGroup>();
                vlg.spacing = 0;
                vlg.childForceExpandHeight = false;
                var infoLe = info.AddComponent<LayoutElement>();
                infoLe.flexibleWidth = 1;
                infoLe.preferredHeight = 28;

                var nameTmp = AddText(info.transform, $"{layer.name}", 11, TEXT_1, FontStyles.Bold);
                var elevTmp = AddText(info.transform, $"Base: {layer.baseElevation:F0}m  |  {layer.characteristics.Split('.')[0]}", 9, TEXT_2);
            }

            AddDivider(content);
            AddPanelSubheader(content, "Map Information");
            AddText(content, $"Terrain: {GeologyConfig.TERRAIN_SIZE:F0}m \u00D7 {GeologyConfig.TERRAIN_SIZE:F0}m", 10, TEXT_2);
            AddText(content, $"Water Level: {GeologyConfig.WATER_LEVEL:F0}m", 10, TEXT_2);
            AddText(content, $"Grid: {GeologyConfig.SEGMENTS} segments", 10, TEXT_2);
        }

        // ── Drill Panel ──

        void CreateDrillPanel()
        {
            var go = CreateFloatingPanel("drill", "Drill Core Results");
            _drillContent = GetPanelContent(go);
            AddEmptyState(_drillContent, "Click on the terrain to drill a core sample.\nEach core will show the rock layers beneath.");
        }

        void RefreshDrillPanel()
        {
            if (_drillContent == null) return;
            ClearChildren(_drillContent);

            var state = AppState.Instance;
            if (state.DrillResults.Count == 0)
            {
                AddEmptyState(_drillContent, "Click on the terrain to drill a core sample.\nEach core will show the rock layers beneath.");
                return;
            }

            int coreNum = 0;
            foreach (var drill in state.DrillResults.AsEnumerable().Reverse().Take(5))
            {
                coreNum++;
                AddPanelSubheader(_drillContent, $"Core #{coreNum} — Elev: {drill.surfaceElevation:F1}m");

                // Visual core column
                var coreContainer = new GameObject("CoreColumn");
                coreContainer.transform.SetParent(_drillContent, false);
                var coreLe = coreContainer.AddComponent<LayoutElement>();
                coreLe.preferredHeight = Mathf.Min(drill.segments.Count * 8 + 10, 200);

                var coreVlg = coreContainer.AddComponent<VerticalLayoutGroup>();
                coreVlg.spacing = 0;
                coreVlg.padding = new RectOffset(20, 20, 2, 2);
                coreVlg.childForceExpandWidth = true;
                coreVlg.childForceExpandHeight = false;

                string lastLayer = "";
                foreach (var seg in drill.segments)
                {
                    if (seg.layerName == lastLayer) continue;
                    lastLayer = seg.layerName;

                    var segRow = new GameObject("Seg");
                    segRow.transform.SetParent(coreContainer.transform, false);
                    var segHlg = segRow.AddComponent<HorizontalLayoutGroup>();
                    segHlg.spacing = 6;
                    segHlg.childAlignment = TextAnchor.MiddleLeft;
                    segHlg.childForceExpandWidth = false;
                    var segLe = segRow.AddComponent<LayoutElement>();
                    segLe.preferredHeight = 18;

                    // Depth label
                    AddText(segRow.transform, $"{seg.fromDepth:F0}m", 9, TEXT_2).GetComponent<LayoutElement>().preferredWidth = 36;

                    // Color bar
                    var bar = new GameObject("Bar");
                    bar.transform.SetParent(segRow.transform, false);
                    var barImg = bar.AddComponent<Image>();
                    barImg.color = seg.color;
                    var barLe = bar.AddComponent<LayoutElement>();
                    barLe.preferredWidth = 24;
                    barLe.preferredHeight = 14;

                    // Layer name
                    var nameLe2 = AddText(segRow.transform, seg.layerName, 10, TEXT_1).GetComponent<LayoutElement>();
                    nameLe2.flexibleWidth = 1;
                }

                AddDivider(_drillContent);
            }
        }

        void OnDrillChanged(AppState.DrillResult drill)
        {
            RefreshDrillPanel();
            if (drill != null)
                ShowToast($"Drilled core at elevation {drill.surfaceElevation:F1}m — {drill.segments.Count} layers", ACCENT);
        }

        // ── Measure Panel ──

        void CreateMeasurePanel()
        {
            var go = CreateFloatingPanel("measure", "Measurements");
            _measureContent = GetPanelContent(go);
            AddEmptyState(_measureContent, "Click two points on the terrain to measure distance.\nFirst click sets the start, second click completes.");
        }

        void RefreshMeasurePanel()
        {
            if (_measureContent == null) return;
            ClearChildren(_measureContent);

            var state = AppState.Instance;
            if (state.MeasureResults.Count == 0)
            {
                AddEmptyState(_measureContent, "Click two points on the terrain to measure distance.\nFirst click sets the start, second click completes.");
                return;
            }

            int num = 0;
            foreach (var m in state.MeasureResults.AsEnumerable().Reverse().Take(8))
            {
                num++;
                AddPanelSubheader(_measureContent, $"Measurement #{num}");

                var info = new GameObject("Info");
                info.transform.SetParent(_measureContent, false);
                var vlg = info.AddComponent<VerticalLayoutGroup>();
                vlg.spacing = 2;
                vlg.padding = new RectOffset(8, 4, 2, 2);
                vlg.childForceExpandHeight = false;
                var infoLe = info.AddComponent<LayoutElement>();
                infoLe.preferredHeight = 90;

                AddText(info.transform, $"\u2194 3D Distance:  {m.totalDistance:F1} m", 11, TEXT_1);
                AddText(info.transform, $"\u2500 Horizontal:  {m.horizontalDistance:F1} m", 10, TEXT_2);
                AddText(info.transform, $"\u2502 Elev Change: {m.verticalDifference:F1} m", 10, TEXT_2);
                AddText(info.transform, $"\u2192 Bearing:     {m.bearing:F1}\u00B0", 10, TEXT_2);
                AddText(info.transform, $"\u2215 Slope:       {m.slope:F1}\u00B0", 10, TEXT_2);

                AddDivider(_measureContent);
            }
        }

        void OnMeasureChanged(AppState.MeasureResult m)
        {
            RefreshMeasurePanel();
            if (m != null)
                ShowToast($"Measured {m.totalDistance:F1}m  |  Bearing {m.bearing:F0}\u00B0  |  Slope {m.slope:F1}\u00B0", ACCENT);
        }

        // ── Strike & Dip Panel ──

        void CreateStrikeDipPanel()
        {
            var go = CreateFloatingPanel("strikeDip", "Strike & Dip");
            _strikeDipContent = GetPanelContent(go);
            AddEmptyState(_strikeDipContent, "Click on a sloped surface to measure its strike and dip angles.\nResults show the orientation of rock layers.");
        }

        void RefreshStrikeDipPanel()
        {
            if (_strikeDipContent == null) return;
            ClearChildren(_strikeDipContent);

            var state = AppState.Instance;
            if (state.StrikeDipResults.Count == 0)
            {
                AddEmptyState(_strikeDipContent, "Click on a sloped surface to measure its strike and dip angles.\nResults show the orientation of rock layers.");
                return;
            }

            // Summary header
            AddPanelSubheader(_strikeDipContent, $"{state.StrikeDipResults.Count} Measurement(s)");

            foreach (var sd in state.StrikeDipResults.AsEnumerable().Reverse().Take(10))
            {
                var row = new GameObject("SDRow");
                row.transform.SetParent(_strikeDipContent, false);
                var vlg = row.AddComponent<VerticalLayoutGroup>();
                vlg.spacing = 1;
                vlg.padding = new RectOffset(8, 4, 3, 3);
                vlg.childForceExpandHeight = false;
                var rowLe = row.AddComponent<LayoutElement>();
                rowLe.preferredHeight = 50;

                AddText(row.transform, $"\u2220 {sd.notation}", 12, TEXT_1, FontStyles.Bold);
                AddText(row.transform, $"Layer: {sd.layerName}  |  Strike: {sd.strike:F0}\u00B0  Dip: {sd.dip:F0}\u00B0", 10, TEXT_2);

                AddDivider(_strikeDipContent);
            }
        }

        // ── Cross Section Panel ──

        void CreateCrossSectionPanel()
        {
            var go = CreateFloatingPanel("crossSection", "Cross Section");
            _crossSectionContent = GetPanelContent(go);
            AddEmptyState(_crossSectionContent, "Click two points on the terrain to create a cross-section.\nThe profile will show rock layers between the points.");
        }

        void OnCrossSectionChanged(AppState.CrossSectionData data)
        {
            if (_crossSectionContent == null) return;
            ClearChildren(_crossSectionContent);

            if (data == null)
            {
                AddEmptyState(_crossSectionContent, "Click two points on the terrain to create a cross-section.");
                return;
            }

            AddPanelSubheader(_crossSectionContent, $"Distance: {data.totalDistance:F0}m  |  Bearing: {data.bearing:F0}\u00B0");

            // Visual cross-section using colored bars
            var vizContainer = new GameObject("CrossViz", typeof(RectTransform));
            vizContainer.transform.SetParent(_crossSectionContent, false);
            var vizLe = vizContainer.AddComponent<LayoutElement>();
            vizLe.preferredHeight = 180;

            var vizRt = vizContainer.GetComponent<RectTransform>();

            // Background
            var vizBg = vizContainer.AddComponent<Image>();
            vizBg.color = new Color(0.06f, 0.07f, 0.09f);

            // Draw simplified profile columns
            if (data.samples.Count > 0)
            {
                float maxElev = 0, minElev = float.MaxValue;
                foreach (var s in data.samples)
                {
                    maxElev = Mathf.Max(maxElev, s.surfaceElevation);
                    if (s.layers != null && s.layers.Count > 0)
                        minElev = Mathf.Min(minElev, s.layers[^1].elevation);
                }
                if (minElev == float.MaxValue) minElev = 0;
                float range = Mathf.Max(maxElev - minElev, 1);

                int step = Mathf.Max(1, data.samples.Count / 40);
                for (int i = 0; i < data.samples.Count; i += step)
                {
                    var sample = data.samples[i];
                    float x01 = (float)i / data.samples.Count;
                    float surfNorm = (sample.surfaceElevation - minElev) / range;

                    // Column showing surface + primary layer color
                    var col = new GameObject("Col", typeof(RectTransform));
                    col.transform.SetParent(vizContainer.transform, false);
                    var colRt = col.GetComponent<RectTransform>();
                    colRt.anchorMin = new Vector2(x01, 0);
                    colRt.anchorMax = new Vector2(x01 + 1f / 42f, surfNorm);
                    colRt.offsetMin = Vector2.zero;
                    colRt.offsetMax = Vector2.zero;
                    var colImg = col.AddComponent<Image>();
                    colImg.color = (sample.layers != null && sample.layers.Count > 0)
                        ? sample.layers[0].color
                        : new Color(0.5f, 0.5f, 0.4f);
                    colImg.raycastTarget = false;
                }

                // Water level line
                float waterNorm = (GeologyConfig.WATER_LEVEL - minElev) / range;
                if (waterNorm > 0 && waterNorm < 1)
                {
                    var wl = new GameObject("WaterLine", typeof(RectTransform));
                    wl.transform.SetParent(vizContainer.transform, false);
                    var wlRt = wl.GetComponent<RectTransform>();
                    wlRt.anchorMin = new Vector2(0, waterNorm);
                    wlRt.anchorMax = new Vector2(1, waterNorm);
                    wlRt.sizeDelta = new Vector2(0, 2);
                    wlRt.anchoredPosition = Vector2.zero;
                    var wlImg = wl.AddComponent<Image>();
                    wlImg.color = new Color(0.2f, 0.5f, 0.8f, 0.6f);
                    wlImg.raycastTarget = false;
                }
            }

            // Layer legend for cross section
            AddDivider(_crossSectionContent);
            AddPanelSubheader(_crossSectionContent, "Layers Encountered");
            if (data.samples.Count > 0 && data.samples[0].layers != null)
            {
                var seenLayers = new HashSet<string>();
                foreach (var sample in data.samples)
                {
                    if (sample.layers == null) continue;
                    foreach (var l in sample.layers)
                    {
                        if (seenLayers.Add(l.layerName))
                        {
                            var lr = new GameObject("LR");
                            lr.transform.SetParent(_crossSectionContent, false);
                            var hlg = lr.AddComponent<HorizontalLayoutGroup>();
                            hlg.spacing = 6;
                            hlg.childAlignment = TextAnchor.MiddleLeft;
                            hlg.childForceExpandWidth = false;
                            var lrLe = lr.AddComponent<LayoutElement>();
                            lrLe.preferredHeight = 18;

                            var sw = new GameObject("Sw");
                            sw.transform.SetParent(lr.transform, false);
                            var swImg = sw.AddComponent<Image>();
                            swImg.color = l.color;
                            var swLe = sw.AddComponent<LayoutElement>();
                            swLe.preferredWidth = 12;
                            swLe.preferredHeight = 12;

                            AddText(lr.transform, l.layerName, 10, TEXT_2);
                        }
                    }
                }
            }

            ShowToast($"Cross-section created: {data.totalDistance:F0}m at bearing {data.bearing:F0}\u00B0", ACCENT);
        }

        // ── Notebook Panel ──

        TMP_InputField _notebookInput;

        void CreateNotebookPanel()
        {
            var go = CreateFloatingPanel("notebook", "Field Notebook");
            var content = GetPanelContent(go);

            AddPanelSubheader(content, "Field Notes");
            AddText(content, "Record observations and measurements in the field.", 10, TEXT_2);

            // ── Free-text input row ──
            var inputRow = new GameObject("InputRow", typeof(RectTransform));
            inputRow.transform.SetParent(content, false);
            var rowHlg = inputRow.AddComponent<HorizontalLayoutGroup>();
            rowHlg.spacing = 4;
            rowHlg.childForceExpandHeight = true;
            rowHlg.childForceExpandWidth = false;
            var rowLe = inputRow.AddComponent<LayoutElement>();
            rowLe.preferredHeight = 32;

            // Input field
            var inputGo = new GameObject("NoteInput", typeof(RectTransform));
            inputGo.transform.SetParent(inputRow.transform, false);
            var inputBg = inputGo.AddComponent<Image>();
            inputBg.color = new Color(0.08f, 0.10f, 0.13f, 1f);
            _notebookInput = inputGo.AddComponent<TMP_InputField>();
            var placeholder = CreateInputChild(inputGo.transform, "Placeholder", "Type a note…", TEXT_2 * 0.6f, FontStyles.Italic);
            var inputText = CreateInputChild(inputGo.transform, "Text", "", TEXT_1, FontStyles.Normal);
            _notebookInput.textViewport = inputGo.GetComponent<RectTransform>();
            _notebookInput.textComponent = inputText;
            _notebookInput.placeholder = placeholder;
            _notebookInput.fontAsset = inputText.font;
            _notebookInput.pointSize = 11;
            _notebookInput.onSubmit.AddListener(s => { if (!string.IsNullOrWhiteSpace(s)) { AddNotebookEntry($"<b>NOTE:</b> {s}"); _notebookInput.text = ""; } });
            var inputLe = inputGo.AddComponent<LayoutElement>();
            inputLe.flexibleWidth = 1;

            // Add button
            CreateNotebookActionButton(inputRow.transform, "+", 28, () =>
            {
                if (!string.IsNullOrWhiteSpace(_notebookInput.text))
                {
                    AddNotebookEntry($"<b>NOTE:</b> {_notebookInput.text}");
                    _notebookInput.text = "";
                }
            });

            // ── Action buttons row ──
            var actionRow = new GameObject("Actions", typeof(RectTransform));
            actionRow.transform.SetParent(content, false);
            var actHlg = actionRow.AddComponent<HorizontalLayoutGroup>();
            actHlg.spacing = 4;
            actHlg.childForceExpandWidth = false;
            actHlg.childForceExpandHeight = true;
            var actLe = actionRow.AddComponent<LayoutElement>();
            actLe.preferredHeight = 26;

            // Location stamp
            CreateNotebookActionButton(actionRow.transform, "Stamp Location", 100, () =>
            {
                if (Camera.main != null)
                {
                    var p = Camera.main.transform.position;
                    AddNotebookEntry($"<b>LOCATION:</b> ({p.x:F0}, {p.y:F0}, {p.z:F0})");
                }
            });

            // Timestamp
            CreateNotebookActionButton(actionRow.transform, "Timestamp", 80, () =>
            {
                AddNotebookEntry($"<b>TIME:</b> {System.DateTime.Now:yyyy-MM-dd HH:mm:ss}");
            });

            // Clear
            CreateNotebookActionButton(actionRow.transform, "Clear", 50, () =>
            {
                _notebookEntries.Clear();
                if (_notebookArea != null) _notebookArea.text = "<i>Notebook cleared.</i>";
            });

            // Export (copy to clipboard)
            CreateNotebookActionButton(actionRow.transform, "Export", 50, () =>
            {
                if (_notebookEntries.Count > 0)
                {
                    // Strip rich text tags for clipboard
                    string plain = string.Join("\n", _notebookEntries)
                        .Replace("<b>", "").Replace("</b>", "")
                        .Replace("<i>", "").Replace("</i>", "")
                        .Replace("<color=#58a6ff>", "").Replace("</color>", "");
                    GUIUtility.systemCopyBuffer = plain;
                    ShowToast("Notebook copied to clipboard", SUCCESS);
                }
                else ShowToast("No entries to export", DANGER);
            });

            AddDivider(content);
            AddPanelSubheader(content, "Recent Activity");

            // Notebook log area
            var logGo = new GameObject("NotebookLog");
            logGo.transform.SetParent(content, false);
            _notebookArea = logGo.AddComponent<TextMeshProUGUI>();
            _notebookArea.text = "<i>No entries yet. Use tools to generate data.</i>";
            _notebookArea.fontSize = 13;
            _notebookArea.color = TEXT_2;
            _notebookArea.textWrappingMode = TextWrappingModes.Normal;
            _notebookArea.richText = true;
            var logLe = logGo.AddComponent<LayoutElement>();
            logLe.preferredHeight = 300;
            logLe.flexibleHeight = 1;
        }

        TextMeshProUGUI CreateInputChild(Transform parent, string name, string text, Color c, FontStyles style)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = new Vector2(6, 2);
            rt.offsetMax = new Vector2(-6, -2);
            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = 13;
            tmp.color = c;
            tmp.fontStyle = style;
            tmp.alignment = TextAlignmentOptions.MidlineLeft;
            return tmp;
        }

        void CreateNotebookActionButton(Transform parent, string label, float width, Action onClick)
        {
            var go = new GameObject($"Btn_{label}", typeof(RectTransform));
            go.transform.SetParent(parent, false);
            var img = go.AddComponent<Image>();
            img.color = BG_HOVER;
            var btn = go.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(() => onClick());
            var le = go.AddComponent<LayoutElement>();
            le.preferredWidth = width;

            var txt = new GameObject("Txt", typeof(RectTransform));
            txt.transform.SetParent(go.transform, false);
            var tr = txt.GetComponent<RectTransform>();
            tr.anchorMin = Vector2.zero; tr.anchorMax = Vector2.one;
            tr.offsetMin = Vector2.zero; tr.offsetMax = Vector2.zero;
            var tmp2 = txt.AddComponent<TextMeshProUGUI>();
            tmp2.text = label;
            tmp2.fontSize = 12;
            tmp2.fontStyle = FontStyles.Bold;
            tmp2.color = ACCENT;
            tmp2.alignment = TextAlignmentOptions.Center;
        }

        public void AddNotebookEntry(string entry)
        {
            string timestamp = DateTime.Now.ToString("HH:mm:ss");
            _notebookEntries.Insert(0, $"<color=#58a6ff>[{timestamp}]</color> {entry}");
            if (_notebookEntries.Count > 50) _notebookEntries.RemoveAt(_notebookEntries.Count - 1);

            if (_notebookArea != null)
                _notebookArea.text = string.Join("\n", _notebookEntries);
        }

        // ── Settings Panel ──

        void CreateSettingsPanel()
        {
            var go = CreateFloatingPanel("settings", "Settings");
            var content = GetPanelContent(go);

            AddPanelSubheader(content, "Environment");
            CreateSliderRow(content, "Water Level", GeologyConfig.WATER_LEVEL, 0, 100, v =>
                AppState.Instance.SetSetting("waterLevel", v));
            CreateSliderRow(content, "Fog Density", 0.00022f, 0, 0.001f, v =>
                AppState.Instance.SetSetting("fogDensity", v));
            CreateSliderRow(content, "Sun Elevation", 55f, 10, 80, v =>
                AppState.Instance.SetSetting("sunElevation", v));

            AddDivider(content);
            AddPanelSubheader(content, "Display");
            CreateSliderRow(content, "Ambient Intensity", 1.15f, 0.5f, 2f, v =>
                AppState.Instance.SetSetting("ambientIntensity", v));

            AddDivider(content);

            // Apply button
            var applyGo = new GameObject("ApplyBtn");
            applyGo.transform.SetParent(content, false);
            var applyImg = applyGo.AddComponent<Image>();
            applyImg.color = ACCENT;
            var applyBtn = applyGo.AddComponent<Button>();
            applyBtn.targetGraphic = applyImg;
            applyBtn.onClick.AddListener(() =>
            {
                AppState.Instance.NotifySettingsChanged();
                ShowToast("Settings applied", SUCCESS);
            });
            var applyLe = applyGo.AddComponent<LayoutElement>();
            applyLe.preferredHeight = 32;

            var applyTxt = new GameObject("Txt");
            applyTxt.transform.SetParent(applyGo.transform, false);
            var applyTmp = applyTxt.AddComponent<TextMeshProUGUI>();
            applyTmp.text = "Apply Settings";
            applyTmp.fontSize = 14;
            applyTmp.fontStyle = FontStyles.Bold;
            applyTmp.color = Color.white;
            applyTmp.alignment = TextAlignmentOptions.Center;
            var applyTxtRt = applyTxt.GetComponent<RectTransform>();
            applyTxtRt.anchorMin = Vector2.zero;
            applyTxtRt.anchorMax = Vector2.one;
            applyTxtRt.sizeDelta = Vector2.zero;
        }

        void CreateSliderRow(Transform parent, string label, float defaultVal, float min, float max, Action<float> onChange)
        {
            var row = new GameObject($"Slider_{label}");
            row.transform.SetParent(parent, false);
            var vlg = row.AddComponent<VerticalLayoutGroup>();
            vlg.spacing = 2;
            vlg.padding = new RectOffset(4, 4, 3, 3);
            var le = row.AddComponent<LayoutElement>();
            le.preferredHeight = 42;

            // Label + value
            var labelGo = new GameObject("Label");
            labelGo.transform.SetParent(row.transform, false);
            var labelTmp = labelGo.AddComponent<TextMeshProUGUI>();
            string fmt = max < 1 ? "F5" : "F1";
            labelTmp.text = $"{label}: {defaultVal.ToString(fmt)}";
            labelTmp.fontSize = 12;
            labelTmp.color = TEXT_2;

            // Slider track
            var sliderGo = new GameObject("Slider");
            sliderGo.transform.SetParent(row.transform, false);
            var sliderLe = sliderGo.AddComponent<LayoutElement>();
            sliderLe.preferredHeight = 16;

            var bgGo = new GameObject("Background", typeof(RectTransform));
            bgGo.transform.SetParent(sliderGo.transform, false);
            var bgRt = bgGo.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.sizeDelta = Vector2.zero;
            var bgImg = bgGo.AddComponent<Image>();
            bgImg.color = BG_HOVER;

            var fillArea = new GameObject("Fill Area", typeof(RectTransform));
            fillArea.transform.SetParent(sliderGo.transform, false);
            var fillAreaRt = fillArea.GetComponent<RectTransform>();
            fillAreaRt.anchorMin = Vector2.zero;
            fillAreaRt.anchorMax = Vector2.one;
            fillAreaRt.offsetMin = new Vector2(5, 0);
            fillAreaRt.offsetMax = new Vector2(-5, 0);

            var fillGo = new GameObject("Fill", typeof(RectTransform));
            fillGo.transform.SetParent(fillArea.transform, false);
            var fillRt = fillGo.GetComponent<RectTransform>();
            fillRt.sizeDelta = Vector2.zero;
            var fillImg = fillGo.AddComponent<Image>();
            fillImg.color = ACCENT;

            var handleArea = new GameObject("Handle Slide Area", typeof(RectTransform));
            handleArea.transform.SetParent(sliderGo.transform, false);
            var handleAreaRt = handleArea.GetComponent<RectTransform>();
            handleAreaRt.anchorMin = Vector2.zero;
            handleAreaRt.anchorMax = Vector2.one;
            handleAreaRt.offsetMin = new Vector2(8, 0);
            handleAreaRt.offsetMax = new Vector2(-8, 0);

            var handle = new GameObject("Handle", typeof(RectTransform));
            handle.transform.SetParent(handleArea.transform, false);
            var handleRt = handle.GetComponent<RectTransform>();
            handleRt.sizeDelta = new Vector2(14, 14);
            var handleImg = handle.AddComponent<Image>();
            handleImg.color = Color.white;

            var slider = sliderGo.AddComponent<Slider>();
            slider.fillRect = fillRt;
            slider.handleRect = handleRt;
            slider.targetGraphic = handleImg;
            slider.minValue = min;
            slider.maxValue = max;
            slider.value = defaultVal;
            slider.onValueChanged.AddListener(v =>
            {
                labelTmp.text = $"{label}: {v.ToString(fmt)}";
                onChange?.Invoke(v);
            });
        }

        // ──────────────────────────────────────────
        //  LOADING SCREEN
        // ──────────────────────────────────────────

        void CreateLoadingScreen()
        {
            _loadingScreen = new GameObject("LoadingScreen", typeof(RectTransform));
            _loadingScreen.transform.SetParent(_mainCanvas.transform, false);
            var bg = _loadingScreen.AddComponent<Image>();
            bg.color = new Color(0.04f, 0.05f, 0.07f, 1f);
            var rt = Anchor(_loadingScreen, 0, 0, 1, 1, 0.5f, 0.5f);
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Center content
            var center = new GameObject("Center", typeof(RectTransform));
            center.transform.SetParent(_loadingScreen.transform, false);
            var cRt = center.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0.5f, 0.5f);
            cRt.anchorMax = new Vector2(0.5f, 0.5f);
            cRt.sizeDelta = new Vector2(460, 140);

            var cvlg = center.AddComponent<VerticalLayoutGroup>();
            cvlg.spacing = 12;
            cvlg.childAlignment = TextAnchor.MiddleCenter;
            cvlg.childForceExpandWidth = true;

            // Geology icon
            var iconGo = new GameObject("Icon");
            iconGo.transform.SetParent(center.transform, false);
            var iconTmp = iconGo.AddComponent<TextMeshProUGUI>();
            iconTmp.text = "\u26F0"; // ⛰ mountain
            iconTmp.fontSize = 36;
            iconTmp.color = ACCENT;
            iconTmp.alignment = TextAlignmentOptions.Center;

            // Title
            var titleGo = new GameObject("Title");
            titleGo.transform.SetParent(center.transform, false);
            var titleTmp = titleGo.AddComponent<TextMeshProUGUI>();
            titleTmp.text = "Geology Field Simulator";
            titleTmp.fontSize = 24;
            titleTmp.fontStyle = FontStyles.Bold;
            titleTmp.color = TEXT_1;
            titleTmp.alignment = TextAlignmentOptions.Center;

            // Status
            var statusGo = new GameObject("Status");
            statusGo.transform.SetParent(center.transform, false);
            _loadingText = statusGo.AddComponent<TextMeshProUGUI>();
            _loadingText.text = "Initializing...";
            _loadingText.fontSize = 12;
            _loadingText.color = TEXT_2;
            _loadingText.alignment = TextAlignmentOptions.Center;

            // Progress bar
            var barBg = new GameObject("BarBg");
            barBg.transform.SetParent(center.transform, false);
            var barBgImg = barBg.AddComponent<Image>();
            barBgImg.color = BG_HOVER;
            var barBgLe = barBg.AddComponent<LayoutElement>();
            barBgLe.preferredHeight = 5;

            var fill = new GameObject("Fill", typeof(RectTransform));
            fill.transform.SetParent(barBg.transform, false);
            var fillRt = fill.GetComponent<RectTransform>();
            fillRt.anchorMin = Vector2.zero;
            fillRt.anchorMax = new Vector2(0, 1);
            fillRt.offsetMin = Vector2.zero;
            fillRt.offsetMax = Vector2.zero;
            _loadingBar = fill.AddComponent<Image>();
            _loadingBar.color = ACCENT;
        }

        // ──────────────────────────────────────────
        //  ROCK POPUP
        // ──────────────────────────────────────────

        void CreateRockPopup()
        {
            _rockPopup = new GameObject("RockPopup", typeof(RectTransform));
            _rockPopup.transform.SetParent(_mainCanvas.transform, false);
            var rt = _rockPopup.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.sizeDelta = new Vector2(420, 380);

            var bg = _rockPopup.AddComponent<Image>();
            bg.color = BG_PANEL;

            var vlg = _rockPopup.AddComponent<VerticalLayoutGroup>();
            vlg.padding = new RectOffset(16, 16, 14, 14);
            vlg.spacing = 5;
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;

            // Close button (top-right, excluded from layout)
            var closeGo = new GameObject("CloseBtn", typeof(RectTransform));
            closeGo.transform.SetParent(_rockPopup.transform, false);
            var closeRt = closeGo.GetComponent<RectTransform>();
            closeRt.anchorMin = new Vector2(1, 1);
            closeRt.anchorMax = new Vector2(1, 1);
            closeRt.pivot = new Vector2(1, 1);
            closeRt.sizeDelta = new Vector2(30, 30);
            closeRt.anchoredPosition = new Vector2(-6, -6);
            var closeImg = closeGo.AddComponent<Image>();
            closeImg.color = new Color(0, 0, 0, 0);
            var closeBtn = closeGo.AddComponent<Button>();
            closeBtn.onClick.AddListener(HideRockPopup);
            var closeLe = closeGo.AddComponent<LayoutElement>();
            closeLe.ignoreLayout = true;
            var closeTxt = new GameObject("X");
            closeTxt.transform.SetParent(closeGo.transform, false);
            var closeTmp = closeTxt.AddComponent<TextMeshProUGUI>();
            closeTmp.text = "\u2715";
            closeTmp.fontSize = 14;
            closeTmp.color = TEXT_2;
            closeTmp.alignment = TextAlignmentOptions.Center;
            var closeRt2 = closeTxt.GetComponent<RectTransform>();
            closeRt2.anchorMin = Vector2.zero;
            closeRt2.anchorMax = Vector2.one;
            closeRt2.sizeDelta = Vector2.zero;

            _rockPopup.SetActive(false);
        }

        void ShowRockPopupContent(AppState.RockPopup data)
        {
            var parent = _rockPopup.transform;
            for (int i = parent.childCount - 1; i >= 1; i--)
                Destroy(parent.GetChild(i).gameObject);

            // Header row
            var headerRow = new GameObject("HeaderRow");
            headerRow.transform.SetParent(parent, false);
            var hrlg = headerRow.AddComponent<HorizontalLayoutGroup>();
            hrlg.spacing = 10;
            hrlg.childAlignment = TextAnchor.MiddleLeft;
            hrlg.childForceExpandWidth = false;
            var hrle = headerRow.AddComponent<LayoutElement>();
            hrle.preferredHeight = 34;

            // Color swatch
            var swatch = new GameObject("Swatch");
            swatch.transform.SetParent(headerRow.transform, false);
            var swImg = swatch.AddComponent<Image>();
            swImg.color = data.color;
            var swLe = swatch.AddComponent<LayoutElement>();
            swLe.preferredWidth = 26;
            swLe.preferredHeight = 26;

            // Title
            var title = AddText(headerRow.transform, data.layerName, 18, TEXT_1, FontStyles.Bold);
            title.GetComponent<LayoutElement>().preferredWidth = 320;

            // Elevation badge
            var elevBadge = new GameObject("ElevBadge");
            elevBadge.transform.SetParent(parent, false);
            var elevBgImg = elevBadge.AddComponent<Image>();
            elevBgImg.color = ACCENT_DIM;
            var elevHlg = elevBadge.AddComponent<HorizontalLayoutGroup>();
            elevHlg.padding = new RectOffset(8, 8, 2, 2);
            var elevLe2 = elevBadge.AddComponent<LayoutElement>();
            elevLe2.preferredHeight = 22;
            AddText(elevBadge.transform, $"\u25B2 Elevation: {data.elevation:F1} m", 11, ACCENT);

            AddDivider(parent);

            // Properties
            AddPopupProperty(parent, "Characteristics", data.characteristics);
            AddPopupProperty(parent, "Age", data.age);
            AddPopupProperty(parent, "Grain Size", data.grainSize);
            AddPopupProperty(parent, "Texture", data.texture);
            AddPopupProperty(parent, "Fossils", data.fossils);
            if (data.minerals != null && data.minerals.Length > 0)
                AddPopupProperty(parent, "Minerals", string.Join(", ", data.minerals));

            _rockPopup.SetActive(true);

            // Log to notebook
            AddNotebookEntry($"Identified <b>{data.layerName}</b> at elevation {data.elevation:F1}m");
        }

        void AddPopupProperty(Transform parent, string label, string value)
        {
            var row = new GameObject("Prop");
            row.transform.SetParent(parent, false);
            var vlg = row.AddComponent<VerticalLayoutGroup>();
            vlg.spacing = 0;
            vlg.padding = new RectOffset(0, 0, 1, 1);
            vlg.childForceExpandHeight = false;
            var le = row.AddComponent<LayoutElement>();
            le.preferredHeight = 30;

            AddText(row.transform, label, 9, TEXT_2);
            AddText(row.transform, value ?? "—", 11, TEXT_1);
        }

        void HideRockPopup()
        {
            if (_rockPopup != null) _rockPopup.SetActive(false);
        }

        // ──────────────────────────────────────────
        //  COMPASS (rotating)
        // ──────────────────────────────────────────

        void CreateCompass()
        {
            float compassSize = 100;
            _compass = new GameObject("Compass", typeof(RectTransform));
            _compass.transform.SetParent(_mainCanvas.transform, false);
            var rt = _compass.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1, 1);
            rt.anchorMax = new Vector2(1, 1);
            rt.pivot = new Vector2(1, 1);
            rt.anchoredPosition = new Vector2(-12, -12);
            rt.sizeDelta = new Vector2(compassSize, compassSize);

            var bgImg = _compass.AddComponent<Image>();
            bgImg.color = new Color(0.06f, 0.07f, 0.09f, 0.75f);

            // Compass ring (rendered as a texture)
            var ringTex = CreateCompassRingTexture(128);
            var ringGo = new GameObject("Ring", typeof(RectTransform));
            ringGo.transform.SetParent(_compass.transform, false);
            var ringRt = ringGo.GetComponent<RectTransform>();
            ringRt.anchorMin = Vector2.zero; ringRt.anchorMax = Vector2.one;
            ringRt.offsetMin = new Vector2(4, 4); ringRt.offsetMax = new Vector2(-4, -4);
            var ringImg = ringGo.AddComponent<RawImage>();
            ringImg.texture = ringTex;
            ringImg.color = new Color(1, 1, 1, 0.5f);
            ringImg.raycastTarget = false;

            // Rotating needle container
            var needleGo = new GameObject("Needle", typeof(RectTransform));
            needleGo.transform.SetParent(_compass.transform, false);
            _compassNeedle = needleGo.GetComponent<RectTransform>();
            _compassNeedle.anchorMin = new Vector2(0.5f, 0.5f);
            _compassNeedle.anchorMax = new Vector2(0.5f, 0.5f);
            _compassNeedle.sizeDelta = new Vector2(compassSize - 8, compassSize - 8);

            // Cardinal + intercardinal labels
            AddCompassLabel(needleGo.transform, "N", new Vector2(0, 38), new Color(0.95f, 0.3f, 0.3f), 14, true);
            AddCompassLabel(needleGo.transform, "S", new Vector2(0, -38), TEXT_2, 9, false);
            AddCompassLabel(needleGo.transform, "E", new Vector2(38, 0), TEXT_2, 9, false);
            AddCompassLabel(needleGo.transform, "W", new Vector2(-38, 0), TEXT_2, 9, false);
            AddCompassLabel(needleGo.transform, "NE", new Vector2(27, 27), TEXT_2 * 0.7f, 7, false);
            AddCompassLabel(needleGo.transform, "NW", new Vector2(-27, 27), TEXT_2 * 0.7f, 7, false);
            AddCompassLabel(needleGo.transform, "SE", new Vector2(27, -27), TEXT_2 * 0.7f, 7, false);
            AddCompassLabel(needleGo.transform, "SW", new Vector2(-27, -27), TEXT_2 * 0.7f, 7, false);

            // Center dot
            var dot = new GameObject("Dot", typeof(RectTransform));
            dot.transform.SetParent(_compass.transform, false);
            var dotRt = dot.GetComponent<RectTransform>();
            dotRt.anchorMin = new Vector2(0.5f, 0.5f);
            dotRt.anchorMax = new Vector2(0.5f, 0.5f);
            dotRt.sizeDelta = new Vector2(5, 5);
            var dotImg = dot.AddComponent<Image>();
            dotImg.color = TEXT_1;

            // Scale bar (below compass)
            CreateScaleBar();
        }

        Texture2D CreateCompassRingTexture(int sz)
        {
            var tex = new Texture2D(sz, sz, TextureFormat.RGBA32, false);
            var px = new Color32[sz * sz];
            for (int i = 0; i < px.Length; i++) px[i] = new Color32(0, 0, 0, 0);

            float cx = sz * 0.5f, cy = sz * 0.5f, r = sz * 0.45f;
            // Draw tick marks around circle
            for (int deg = 0; deg < 360; deg += 5)
            {
                float a = deg * Mathf.Deg2Rad;
                float len = deg % 30 == 0 ? 8 : (deg % 10 == 0 ? 5 : 2);
                float r1 = r, r2 = r - len;
                byte alpha = (byte)(deg % 30 == 0 ? 200 : (deg % 10 == 0 ? 140 : 80));
                var col = new Color32(230, 237, 243, alpha);
                // Simple line
                for (float t = 0; t <= 1; t += 0.03f)
                {
                    float rr = Mathf.Lerp(r1, r2, t);
                    int px_ = (int)(cx + Mathf.Cos(a) * rr);
                    int py_ = (int)(cy + Mathf.Sin(a) * rr);
                    if (px_ >= 0 && px_ < sz && py_ >= 0 && py_ < sz)
                        px[py_ * sz + px_] = col;
                }
            }
            tex.SetPixels32(px);
            tex.Apply();
            tex.filterMode = FilterMode.Bilinear;
            return tex;
        }

        // Scale bar
        TMP_Text _scaleBarText;
        RectTransform _scaleBarLine;

        void CreateScaleBar()
        {
            var go = new GameObject("ScaleBar", typeof(RectTransform));
            go.transform.SetParent(_mainCanvas.transform, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1, 1);
            rt.anchorMax = new Vector2(1, 1);
            rt.pivot = new Vector2(1, 1);
            rt.anchoredPosition = new Vector2(-12, -120);
            rt.sizeDelta = new Vector2(100, 24);

            // Line
            var lineGo = new GameObject("Line", typeof(RectTransform));
            lineGo.transform.SetParent(go.transform, false);
            _scaleBarLine = lineGo.GetComponent<RectTransform>();
            _scaleBarLine.anchorMin = new Vector2(0, 0.4f);
            _scaleBarLine.anchorMax = new Vector2(1, 0.6f);
            _scaleBarLine.offsetMin = Vector2.zero;
            _scaleBarLine.offsetMax = Vector2.zero;
            var lineImg = lineGo.AddComponent<Image>();
            lineImg.color = new Color(1, 1, 1, 0.5f);
            lineImg.raycastTarget = false;

            // End caps
            for (int i = 0; i < 2; i++)
            {
                var cap = new GameObject($"Cap{i}", typeof(RectTransform));
                cap.transform.SetParent(go.transform, false);
                var capRt = cap.GetComponent<RectTransform>();
                capRt.anchorMin = new Vector2(i, 0);
                capRt.anchorMax = new Vector2(i, 1);
                capRt.sizeDelta = new Vector2(2, 0);
                var capImg = cap.AddComponent<Image>();
                capImg.color = new Color(1, 1, 1, 0.5f);
                capImg.raycastTarget = false;
            }

            // Label
            var txtGo = new GameObject("Txt", typeof(RectTransform));
            txtGo.transform.SetParent(go.transform, false);
            var txtRt = txtGo.GetComponent<RectTransform>();
            txtRt.anchorMin = Vector2.zero; txtRt.anchorMax = Vector2.one;
            txtRt.offsetMin = new Vector2(0, -14); txtRt.offsetMax = new Vector2(0, -2);
            _scaleBarText = txtGo.AddComponent<TextMeshProUGUI>();
            _scaleBarText.text = "100m";
            _scaleBarText.fontSize = 11;
            _scaleBarText.color = TEXT_2;
            _scaleBarText.alignment = TextAlignmentOptions.Center;
            _scaleBarText.raycastTarget = false;
        }

        void AddCompassLabel(Transform parent, string text, Vector2 pos, Color col, int size, bool bold)
        {
            var go = new GameObject(text, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.sizeDelta = new Vector2(20, 20);
            rt.anchoredPosition = pos;
            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = size;
            tmp.fontStyle = bold ? FontStyles.Bold : FontStyles.Normal;
            tmp.color = col;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.raycastTarget = false;
        }

        // ──────────────────────────────────────────
        //  HUD CROSSHAIR
        // ──────────────────────────────────────────

        void CreateCrosshair()
        {
            _crosshair = new GameObject("Crosshair", typeof(RectTransform));
            _crosshair.transform.SetParent(_mainCanvas.transform, false);
            var rt = _crosshair.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.sizeDelta = new Vector2(20, 20);

            // Small + shape
            var h = new GameObject("H", typeof(RectTransform));
            h.transform.SetParent(_crosshair.transform, false);
            var hRt = h.GetComponent<RectTransform>();
            hRt.anchorMin = new Vector2(0, 0.45f);
            hRt.anchorMax = new Vector2(1, 0.55f);
            hRt.sizeDelta = Vector2.zero;
            hRt.offsetMin = Vector2.zero;
            hRt.offsetMax = Vector2.zero;
            var hImg = h.AddComponent<Image>();
            hImg.color = new Color(1, 1, 1, 0.25f);
            hImg.raycastTarget = false;

            var v = new GameObject("V", typeof(RectTransform));
            v.transform.SetParent(_crosshair.transform, false);
            var vRt = v.GetComponent<RectTransform>();
            vRt.anchorMin = new Vector2(0.45f, 0);
            vRt.anchorMax = new Vector2(0.55f, 1);
            vRt.sizeDelta = Vector2.zero;
            vRt.offsetMin = Vector2.zero;
            vRt.offsetMax = Vector2.zero;
            var vImg = v.AddComponent<Image>();
            vImg.color = new Color(1, 1, 1, 0.25f);
            vImg.raycastTarget = false;
        }

        // ──────────────────────────────────────────
        //  TOAST NOTIFICATIONS
        // ──────────────────────────────────────────

        void CreateToastContainer()
        {
            _toastContainer = new GameObject("Toasts", typeof(RectTransform));
            _toastContainer.transform.SetParent(_mainCanvas.transform, false);
            var rt = Anchor(_toastContainer, 0.5f, 1, 0.5f, 1, 0.5f, 1);
            rt.anchoredPosition = new Vector2(0, -10);
            rt.sizeDelta = new Vector2(400, 300);

            var vlg = _toastContainer.AddComponent<VerticalLayoutGroup>();
            vlg.spacing = 4;
            vlg.childAlignment = TextAnchor.UpperCenter;
            vlg.childForceExpandWidth = false;
            vlg.childForceExpandHeight = false;
            vlg.padding = new RectOffset(0, 0, 0, 0);
        }

        public void ShowToast(string message, Color color, float duration = 3.5f)
        {
            if (_toastContainer == null) return;

            var go = new GameObject("Toast");
            go.transform.SetParent(_toastContainer.transform, false);

            var img = go.AddComponent<Image>();
            img.color = new Color(BG_PANEL.r, BG_PANEL.g, BG_PANEL.b, 0.92f);

            var hlg = go.AddComponent<HorizontalLayoutGroup>();
            hlg.padding = new RectOffset(12, 12, 6, 6);
            hlg.spacing = 8;
            hlg.childAlignment = TextAnchor.MiddleLeft;

            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = 30;

            // Color accent bar
            var bar = new GameObject("Bar");
            bar.transform.SetParent(go.transform, false);
            var barImg = bar.AddComponent<Image>();
            barImg.color = color;
            var barLe = bar.AddComponent<LayoutElement>();
            barLe.preferredWidth = 3;
            barLe.preferredHeight = 18;

            // Text
            var txt = new GameObject("Txt");
            txt.transform.SetParent(go.transform, false);
            var tmp = txt.AddComponent<TextMeshProUGUI>();
            tmp.text = message;
            tmp.fontSize = 11;
            tmp.color = TEXT_1;
            var txtLe = txt.AddComponent<LayoutElement>();
            txtLe.preferredWidth = 350;
            txtLe.preferredHeight = 20;

            // Auto-destroy
            StartCoroutine(DestroyAfter(go, duration));
        }

        IEnumerator DestroyAfter(GameObject go, float delay)
        {
            yield return new WaitForSeconds(delay);
            if (go != null) Destroy(go);
        }

        void CleanupToasts()
        {
            // Handled by coroutines
        }

        // ──────────────────────────────────────────
        //  STATE EVENT HANDLERS
        // ──────────────────────────────────────────

        void OnLoadingChanged(float progress, string message, bool loaded)
        {
            if (_loadingScreen != null)
            {
                _loadingScreen.SetActive(!loaded);
                if (_loadingText != null) _loadingText.text = message;
                if (_loadingBar != null)
                    _loadingBar.rectTransform.anchorMax = new Vector2(progress, 1);
            }

            if (loaded)
            {
                if (_sidebar != null) _sidebar.SetActive(true);
                if (_statusBar != null) _statusBar.SetActive(true);
                ShowToast("World loaded. Use tools (1-6) to explore geology.", ACCENT, 5f);
            }
        }

        void OnRockPopupChanged(AppState.RockPopup data)
        {
            if (data.visible) ShowRockPopupContent(data);
            else HideRockPopup();
        }

        void OnToolChanged(string tool)
        {
            if (_toolText != null) _toolText.text = $"\u25C6 Tool: {tool}";
            UpdateToolHighlight(tool);

            // Auto-open corresponding panel for tool-specific panels
            if (tool == "drill" || tool == "measure" || tool == "strikeDip" || tool == "crossSection")
                SetActivePanel(tool);

            // Tool-specific feedback messages
            var msgs = new Dictionary<string, string>
            {
                ["navigate"] = "Navigate mode — orbit, pan, and zoom the camera",
                ["identify"] = "Identify mode — click terrain to identify rock type",
                ["drill"] = "Drill mode — click to extract a core sample",
                ["measure"] = "Measure mode — click two points to measure distance",
                ["strikeDip"] = "Strike & Dip mode — click a slope to measure orientation",
                ["crossSection"] = "Cross-Section mode — click two points for a profile"
            };
            if (msgs.TryGetValue(tool, out string msg))
                ShowToast(msg, ACCENT, 2.5f);
        }

        void OnPanelChanged(string panel)
        {
            SetActivePanel(panel);
            UpdatePanelHighlight(panel);
        }

        void OnHoverChanged(AppState.HoverData data)
        {
            if (_coordText != null) _coordText.text = $"\u25CB Coords: {data.coordinates}";
            if (_elevText != null) _elevText.text = $"\u25B2 Elev: {data.elevation:F1}m";
            if (_layerText != null) _layerText.text = $"\u25A0 Layer: {data.layerName}";
        }

        void SetActivePanel(string panelId)
        {
            foreach (var kvp in _panels)
                kvp.Value.SetActive(kvp.Key == panelId);
        }

        void UpdatePinVisual()
        {
            // Update all pin buttons text across panels
            foreach (var kvp in _panels)
            {
                var pinTxt = kvp.Value.transform.Find("Header/PinBtn/Txt");
                if (pinTxt != null)
                {
                    var tmp = pinTxt.GetComponent<TMP_Text>();
                    if (tmp != null) tmp.text = _panelPinned ? "\u25CF" : "\u25CB"; // ● or ○
                }
            }
        }

        // ──────────────────────────────────────────
        //  UI HELPERS
        // ──────────────────────────────────────────

        RectTransform Anchor(GameObject go, float axMin, float ayMin, float axMax, float ayMax, float px, float py)
        {
            RectTransform rt = go.GetComponent<RectTransform>();
            if (rt == null)
            {
                // Unity cannot convert Transform→RectTransform via AddComponent after creation.
                // Ensure callers use new GameObject(name, typeof(RectTransform)) instead.
                rt = go.AddComponent<RectTransform>();
            }
            if (rt != null)
            {
                rt.anchorMin = new Vector2(axMin, ayMin);
                rt.anchorMax = new Vector2(axMax, ayMax);
                rt.pivot = new Vector2(px, py);
            }
            else
            {
                Debug.LogError($"[UIManager] Anchor: No RectTransform on {go.name}. Use typeof(RectTransform) in constructor.");
            }
            return rt;
        }

        TMP_Text AddText(Transform parent, string text, int size, Color color, FontStyles style = FontStyles.Normal)
        {
            var go = new GameObject("Txt");
            go.transform.SetParent(parent, false);
            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = size;
            tmp.fontStyle = style;
            tmp.color = color;
            tmp.textWrappingMode = TextWrappingModes.Normal;
            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = size + 8;
            return tmp;
        }

        void AddDivider(Transform parent)
        {
            var go = new GameObject("Div");
            go.transform.SetParent(parent, false);
            var img = go.AddComponent<Image>();
            img.color = new Color(1, 1, 1, 0.06f);
            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = 1;
        }

        void AddPanelSubheader(Transform parent, string text)
        {
            var go = new GameObject("Sub");
            go.transform.SetParent(parent, false);
            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = 13;
            tmp.fontStyle = FontStyles.Bold;
            tmp.color = ACCENT;
            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = 22;
        }

        void AddEmptyState(Transform parent, string message)
        {
            var go = new GameObject("Empty");
            go.transform.SetParent(parent, false);
            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = message;
            tmp.fontSize = 13;
            tmp.fontStyle = FontStyles.Italic;
            tmp.color = TEXT_2;
            tmp.textWrappingMode = TextWrappingModes.Normal;
            tmp.alignment = TextAlignmentOptions.Center;
            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = 80;
        }

        void ClearChildren(Transform parent)
        {
            for (int i = parent.childCount - 1; i >= 0; i--)
                Destroy(parent.GetChild(i).gameObject);
        }

        void OnDestroy()
        {
            var state = AppState.Instance;
            if (state == null) return;
            state.OnLoadingChanged -= OnLoadingChanged;
            state.OnRockPopupChanged -= OnRockPopupChanged;
            state.OnToolChanged -= OnToolChanged;
            state.OnPanelChanged -= OnPanelChanged;
            state.OnHoverChanged -= OnHoverChanged;
            state.OnDrillChanged -= OnDrillChanged;
            state.OnMeasureChanged -= OnMeasureChanged;
            state.OnDrillResultsChanged -= RefreshDrillPanel;
            state.OnMeasureResultsChanged -= RefreshMeasurePanel;
            state.OnStrikeDipChanged -= RefreshStrikeDipPanel;
            state.OnCrossSectionChanged -= OnCrossSectionChanged;
        }
    }

    // ──────────────────────────────────────────
    //  TOOLTIP TRIGGER component (attached to buttons)
    // ──────────────────────────────────────────
    public class TooltipTrigger : MonoBehaviour,
        UnityEngine.EventSystems.IPointerEnterHandler,
        UnityEngine.EventSystems.IPointerExitHandler
    {
        public string tooltipText;
        GameObject _tooltipGO;
        static GameObject _activeTooltip;

        public void OnPointerEnter(UnityEngine.EventSystems.PointerEventData eventData)
        {
            if (_activeTooltip != null) Destroy(_activeTooltip);

            var canvas = GetComponentInParent<Canvas>();
            if (canvas == null) return;

            _tooltipGO = new GameObject("Tooltip");
            _tooltipGO.transform.SetParent(canvas.transform, false);

            var bg = _tooltipGO.AddComponent<Image>();
            bg.color = new Color(0.12f, 0.14f, 0.18f, 0.95f);
            bg.raycastTarget = false;

            var rt = _tooltipGO.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(120, 28);

            // Position to the right of the button
            var btnRt = GetComponent<RectTransform>();
            Vector3[] corners = new Vector3[4];
            btnRt.GetWorldCorners(corners);
            rt.position = new Vector3(corners[2].x + 4, (corners[1].y + corners[2].y) * 0.5f, 0);

            var txt = new GameObject("Txt");
            txt.transform.SetParent(_tooltipGO.transform, false);
            var tmp = txt.AddComponent<TextMeshProUGUI>();
            tmp.text = tooltipText;
            tmp.fontSize = 12;
            tmp.color = new Color(0.9f, 0.93f, 0.95f);
            tmp.alignment = TextAlignmentOptions.MidlineLeft;
            tmp.raycastTarget = false;
            var txtRt = txt.GetComponent<RectTransform>();
            txtRt.anchorMin = Vector2.zero;
            txtRt.anchorMax = Vector2.one;
            txtRt.offsetMin = new Vector2(8, 2);
            txtRt.offsetMax = new Vector2(-4, -2);

            _activeTooltip = _tooltipGO;
        }

        public void OnPointerExit(UnityEngine.EventSystems.PointerEventData eventData)
        {
            if (_tooltipGO != null) Destroy(_tooltipGO);
            _tooltipGO = null;
            _activeTooltip = null;
        }

        void OnDisable()
        {
            if (_tooltipGO != null) Destroy(_tooltipGO);
        }
    }
}
