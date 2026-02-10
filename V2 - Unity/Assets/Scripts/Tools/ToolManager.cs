// ================================================================
//  TOOL MANAGER — Geological field tools with animated markers,
//  labels, dashed lines, proper pin shapes.
//  Navigate, Identify, Drill, Measure, StrikeDip, CrossSection
// ================================================================
using UnityEngine;
using System.Collections.Generic;

namespace GeologySim
{
    public class ToolManager : MonoBehaviour
    {
        OrbitCamera _cam;
        float[] _heightmap;
        SimplexNoise2D _noise;

        // Marker hierarchy
        Transform _markerParent;

        // Cached meshes
        Mesh _sphereMesh;
        Mesh _cylinderMesh;
        Mesh _coneMesh;

        // Shared materials
        Material _baseMat;

        // Measure state
        Vector3? _measureStart;
        GameObject _measurePreviewLine;

        // Cross-section state
        Vector3? _crossStart;
        GameObject _crossPreviewLine;

        // Marker animation tracking
        List<(Transform transform, float birthTime, Vector3 basePos)> _animatedMarkers = new();

        // Hover marker (world-space ring that follows cursor)
        Transform _hoverMarker;
        Transform _hoverRingInner;

        // Reference to UIManager for toasts & notebook
        UIManager _ui;

        public void Initialize(OrbitCamera cam, float[] heightmap, SimplexNoise2D noise)
        {
            _cam = cam;
            _heightmap = heightmap;
            _noise = noise;
            _markerParent = new GameObject("Markers").transform;
            _markerParent.SetParent(transform);

            _baseMat = new Material(Shader.Find("Universal Render Pipeline/Lit"));
            _baseMat.SetFloat("_Smoothness", 0.3f);
            _baseMat.enableInstancing = true;

            CachePrimitives();
            CreateHoverMarker();

            _ui = FindFirstObjectByType<UIManager>();
        }

        void CachePrimitives()
        {
            var go1 = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            _sphereMesh = go1.GetComponent<MeshFilter>().sharedMesh;
            Destroy(go1);

            var go2 = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            _cylinderMesh = go2.GetComponent<MeshFilter>().sharedMesh;
            Destroy(go2);

            _coneMesh = CreateConeMesh(12);
        }

        static Mesh CreateConeMesh(int segs)
        {
            var verts = new List<Vector3> { new(0, 1, 0) };
            for (int i = 0; i <= segs; i++)
            {
                float a = (float)i / segs * Mathf.PI * 2f;
                verts.Add(new Vector3(Mathf.Cos(a) * 0.5f, 0, Mathf.Sin(a) * 0.5f));
            }
            var tris = new List<int>();
            for (int i = 0; i < segs; i++)
                tris.AddRange(new[] { 0, i + 1, i + 2 });
            var mesh = new Mesh();
            mesh.vertices = verts.ToArray();
            mesh.triangles = tris.ToArray();
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            mesh.name = "MarkerCone";
            return mesh;
        }

        void CreateHoverMarker()
        {
            var go = new GameObject("HoverMarker");
            go.transform.SetParent(_markerParent);
            _hoverMarker = go.transform;

            // Outer ring
            var outer = MakeSubMesh(go.transform, "OuterRing", _cylinderMesh,
                MakeColorMat(new Color(1, 1, 1, 0.25f), true),
                Vector3.zero, Quaternion.identity, new Vector3(4f, 0.04f, 4f));

            // Inner ring (pulsing)
            _hoverRingInner = MakeSubMesh(go.transform, "InnerRing", _cylinderMesh,
                MakeColorMat(new Color(0.345f, 0.651f, 1.0f, 0.35f), true),
                new Vector3(0, 0.05f, 0), Quaternion.identity, new Vector3(2.5f, 0.06f, 2.5f)).transform;

            go.SetActive(false);
        }

        void UpdateHoverMarker(Vector3 pos)
        {
            if (_hoverMarker == null) return;
            _hoverMarker.gameObject.SetActive(true);
            _hoverMarker.position = pos + Vector3.up * 0.3f;

            // Pulse inner ring
            if (_hoverRingInner != null)
            {
                float pulse = 1f + Mathf.Sin(Time.time * 3f) * 0.15f;
                _hoverRingInner.localScale = new Vector3(2.5f * pulse, 0.06f, 2.5f * pulse);
            }
        }

        void Update()
        {
            if (_heightmap == null || _cam == null) return;
            var state = AppState.Instance;

            // Animate markers (gentle bob)
            float t = Time.time;
            foreach (var (tr, birth, basePos) in _animatedMarkers)
            {
                if (tr == null) continue;
                float age = t - birth;
                float bob = Mathf.Sin(age * 1.5f) * 0.3f;
                tr.position = basePos + Vector3.up * bob;

                // Entrance scale animation (first 0.4s)
                if (age < 0.4f)
                {
                    float s = Mathf.SmoothStep(0, 1, age / 0.4f);
                    tr.localScale = Vector3.one * s;
                }
            }

            // Hover detection
            if (TryRaycast(Input.mousePosition, out Vector3 hitPos, out Vector3 hitNormal))
            {
                float wx = hitPos.x, wz = hitPos.z, wy = hitPos.y;
                var layer = TerrainGenerator.GetLayerAtPosition(_noise, wx, wy, wz);
                state.SetHoverData(new AppState.HoverData
                {
                    worldPosition = hitPos,
                    normal = hitNormal,
                    elevation = wy,
                    layerName = layer.name,
                    layerColor = layer.color,
                    coordinates = $"({wx:F0}, {wz:F0})"
                });

                // Preview line for measure/cross-section
                UpdatePreviewLine(hitPos);

                // Hover marker
                UpdateHoverMarker(hitPos);

                // Left click = activate tool
                if (Input.GetMouseButtonUp(0) && !IsPointerOverUI() && !IsCameraDragging())
                {
                    switch (state.ActiveTool)
                    {
                        case "navigate": break; // Navigation is handled by camera
                        case "identify": DoIdentify(hitPos, layer); break;
                        case "drill": DoDrill(hitPos); break;
                        case "measure": DoMeasure(hitPos); break;
                        case "strikeDip": DoStrikeDip(hitPos, hitNormal); break;
                        case "crossSection": DoCrossSection(hitPos); break;
                    }
                }
            }
        }

        void UpdatePreviewLine(Vector3 currentPos)
        {
            // Measure preview
            if (_measureStart != null && AppState.Instance.ActiveTool == "measure")
            {
                if (_measurePreviewLine == null)
                    _measurePreviewLine = CreatePreviewLineObj(Color.yellow);

                var lr = _measurePreviewLine.GetComponent<LineRenderer>();
                lr.SetPosition(0, _measureStart.Value + Vector3.up * 1.5f);
                lr.SetPosition(1, currentPos + Vector3.up * 1.5f);
                _measurePreviewLine.SetActive(true);
            }
            else if (_measurePreviewLine != null)
                _measurePreviewLine.SetActive(false);

            // Cross-section preview
            if (_crossStart != null && AppState.Instance.ActiveTool == "crossSection")
            {
                if (_crossPreviewLine == null)
                    _crossPreviewLine = CreatePreviewLineObj(Color.cyan);

                var lr = _crossPreviewLine.GetComponent<LineRenderer>();
                lr.SetPosition(0, _crossStart.Value + Vector3.up * 1.5f);
                lr.SetPosition(1, currentPos + Vector3.up * 1.5f);
                _crossPreviewLine.SetActive(true);
            }
            else if (_crossPreviewLine != null)
                _crossPreviewLine.SetActive(false);
        }

        GameObject CreatePreviewLineObj(Color color)
        {
            var go = new GameObject("PreviewLine");
            go.transform.SetParent(_markerParent);
            var lr = go.AddComponent<LineRenderer>();
            lr.positionCount = 2;
            lr.startWidth = 0.8f;
            lr.endWidth = 0.8f;
            var mat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
            Color c = color;
            c.a = 0.5f;
            mat.color = c;
            lr.material = mat;
            lr.startColor = c;
            lr.endColor = c;
            return go;
        }

        bool TryRaycast(Vector2 screenPos, out Vector3 hitPos, out Vector3 hitNormal)
        {
            hitPos = Vector3.zero;
            hitNormal = Vector3.up;
            Camera cam = Camera.main;
            if (cam == null) return false;

            Ray ray = cam.ScreenPointToRay(screenPos);
            if (Physics.Raycast(ray, out RaycastHit hit, 5000f))
            {
                hitPos = hit.point;
                hitNormal = hit.normal;
                return true;
            }

            float t = (80f - ray.origin.y) / ray.direction.y;
            if (t > 0)
            {
                hitPos = ray.origin + ray.direction * t;
                hitPos.y = TerrainGenerator.GetTerrainHeight(_heightmap, hitPos.x, hitPos.z);
                return true;
            }
            return false;
        }

        bool IsPointerOverUI()
        {
            return UnityEngine.EventSystems.EventSystem.current != null &&
                   UnityEngine.EventSystems.EventSystem.current.IsPointerOverGameObject();
        }

        bool IsCameraDragging()
        {
            return _cam != null && _cam.IsDragging;
        }

        #region Identify Tool

        void DoIdentify(Vector3 pos, GeologicalLayer layer)
        {
            AppState.Instance.ShowRockPopup(new AppState.RockPopup
            {
                visible = true,
                layerName = layer.name,
                elevation = pos.y,
                characteristics = layer.characteristics,
                minerals = layer.minerals,
                grainSize = layer.grainSize,
                texture = layer.texture,
                fossils = layer.fossils,
                age = layer.age,
                color = layer.color
            });

            // Animated identify marker — pulsing ring + magnifier sphere
            PlaceIdentifyMarker(pos);
        }

        #endregion

        #region Drill Tool

        void DoDrill(Vector3 pos)
        {
            var state = AppState.Instance;
            float wx = pos.x, wz = pos.z;
            float surfaceH = TerrainGenerator.GetTerrainHeight(_heightmap, wx, wz);
            float bottom = Mathf.Max(surfaceH - 100f, 0f);

            var segments = new List<AppState.DrillSegment>();
            float step = 2f;
            float y = surfaceH;
            while (y > bottom)
            {
                var layer = TerrainGenerator.GetLayerAtPosition(_noise, wx, y, wz);
                float segBottom = Mathf.Max(y - step, bottom);
                segments.Add(new AppState.DrillSegment
                {
                    fromDepth = surfaceH - y,
                    toDepth = surfaceH - segBottom,
                    layerName = layer.name,
                    color = layer.color,
                    minerals = layer.minerals,
                    grainSize = layer.grainSize,
                    characteristics = layer.characteristics
                });
                y -= step;
            }

            var result = new AppState.DrillResult
            {
                id = state.NextId("D"),
                position = pos,
                surfaceElevation = surfaceH,
                totalDepth = surfaceH - bottom,
                segments = segments,
                timestamp = System.DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            };

            state.AddDrillResult(result);
            PlaceDrillMarker(pos, surfaceH);

            _ui?.AddNotebookEntry($"Drilled core at ({wx:F0},{wz:F0}) elev {surfaceH:F1}m — depth {result.totalDepth:F0}m");
        }

        #endregion

        #region Measure Tool

        void DoMeasure(Vector3 pos)
        {
            if (_measureStart == null)
            {
                _measureStart = pos;
                PlacePinMarker(pos, new Color(1f, 0.85f, 0.15f), "M\u2022A");
                _ui?.ShowToast("Start point set. Click a second point to complete measurement.", new Color(0.345f, 0.651f, 1.0f), 2.5f);
            }
            else
            {
                Vector3 start = _measureStart.Value;
                Vector3 end = pos;
                float hDist = Vector2.Distance(new Vector2(start.x, start.z), new Vector2(end.x, end.z));
                float vDiff = end.y - start.y;
                float totalDist = Vector3.Distance(start, end);
                float bearing = Mathf.Atan2(end.x - start.x, end.z - start.z) * Mathf.Rad2Deg;
                if (bearing < 0) bearing += 360f;
                float slope = Mathf.Atan2(vDiff, hDist) * Mathf.Rad2Deg;

                var result = new AppState.MeasureResult
                {
                    id = AppState.Instance.NextId("M"),
                    start = start,
                    end = end,
                    horizontalDistance = hDist,
                    verticalDifference = vDiff,
                    totalDistance = totalDist,
                    bearing = bearing,
                    slope = slope,
                    timestamp = System.DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                };

                AppState.Instance.AddMeasureResult(result);
                PlacePinMarker(end, new Color(1f, 0.85f, 0.15f), $"M\u2022B");
                DrawDashedLine(start, end, new Color(1f, 0.85f, 0.15f));

                _ui?.AddNotebookEntry($"Measured {totalDist:F1}m | Bearing {bearing:F0}\u00B0 | Slope {slope:F1}\u00B0");
                _measureStart = null;
            }
        }

        #endregion

        #region StrikeDip Tool

        void DoStrikeDip(Vector3 pos, Vector3 normal)
        {
            Vector3 dipDir = new Vector3(normal.x, 0, normal.z).normalized;
            Vector3 strikeDir = Vector3.Cross(Vector3.up, dipDir).normalized;

            float strike = Mathf.Atan2(strikeDir.x, strikeDir.z) * Mathf.Rad2Deg;
            if (strike < 0) strike += 360f;

            float dip = 90f - Mathf.Acos(Mathf.Clamp(normal.y, -1, 1)) * Mathf.Rad2Deg;
            dip = Mathf.Abs(dip);

            float dipDirection = strike + 90f;
            if (dipDirection >= 360f) dipDirection -= 360f;

            string CompassDir(float deg)
            {
                string[] dirs = { "N", "NE", "E", "SE", "S", "SW", "W", "NW" };
                return dirs[Mathf.RoundToInt(deg / 45f) % 8];
            }

            var layer = TerrainGenerator.GetLayerAtPosition(_noise, pos.x, pos.y, pos.z);
            var result = new AppState.StrikeDipResult
            {
                id = AppState.Instance.NextId("SD"),
                position = pos,
                strike = strike,
                dip = dip,
                dipDirection = dipDirection,
                layerName = layer.name,
                notation = $"N{strike:F0}\u00B0E / {dip:F0}\u00B0{CompassDir(dipDirection)}"
            };

            AppState.Instance.AddStrikeDipResult(result);

            // Place strike/dip symbol marker (T-shape)
            PlaceStrikeDipMarker(pos, strike, dip, new Color(1f, 0.55f, 0.1f));

            _ui?.AddNotebookEntry($"Strike/Dip: {result.notation} at {layer.name}");
            _ui?.ShowToast($"\u2220 {result.notation}", new Color(0.345f, 0.651f, 1.0f), 3f);
        }

        #endregion

        #region CrossSection Tool

        void DoCrossSection(Vector3 pos)
        {
            if (_crossStart == null)
            {
                _crossStart = pos;
                PlaceCrossSectionMarker(pos, "A");
                _ui?.ShowToast("Cross-section start set. Click a second point for the profile.", new Color(0.345f, 0.651f, 1.0f), 2.5f);
            }
            else
            {
                Vector3 start = _crossStart.Value;
                Vector3 end = pos;
                PlaceCrossSectionMarker(end, "B");
                DrawDashedLine(start, end, new Color(0.2f, 0.85f, 0.95f));

                int numSamples = 50;
                var samples = new List<AppState.CrossSectionSample>();

                for (int i = 0; i <= numSamples; i++)
                {
                    float t = (float)i / numSamples;
                    float wx = Mathf.Lerp(start.x, end.x, t);
                    float wz = Mathf.Lerp(start.z, end.z, t);
                    float surfaceH = TerrainGenerator.GetTerrainHeight(_heightmap, wx, wz);
                    float dist = Vector2.Distance(new Vector2(start.x, start.z), new Vector2(wx, wz));

                    var layers = new List<AppState.CrossSectionLayer>();
                    for (float y = surfaceH; y > Mathf.Max(surfaceH - 80, 0); y -= 3f)
                    {
                        var layer = TerrainGenerator.GetLayerAtPosition(_noise, wx, y, wz);
                        layers.Add(new AppState.CrossSectionLayer
                        {
                            elevation = y,
                            layerName = layer.name,
                            color = layer.color
                        });
                    }

                    samples.Add(new AppState.CrossSectionSample
                    {
                        distance = dist,
                        surfaceElevation = surfaceH,
                        waterLevel = GeologyConfig.WATER_LEVEL,
                        layers = layers
                    });
                }

                float totalDist = Vector2.Distance(new Vector2(start.x, start.z), new Vector2(end.x, end.z));
                float bearing = Mathf.Atan2(end.x - start.x, end.z - start.z) * Mathf.Rad2Deg;
                if (bearing < 0) bearing += 360f;

                AppState.Instance.SetCrossSection(new AppState.CrossSectionData
                {
                    start = start, end = end,
                    totalDistance = totalDist, bearing = bearing,
                    samples = samples
                });

                _ui?.AddNotebookEntry($"Cross-section: {totalDist:F0}m bearing {bearing:F0}\u00B0");
                _crossStart = null;
            }
        }

        #endregion

        #region Visual Helpers — Enhanced Markers

        /// <summary>
        /// Place an animated pin marker with a flag-like shape:
        /// cone tip pointing down, thin stick, sphere head with label
        /// </summary>
        void PlacePinMarker(Vector3 worldPos, Color color, string label)
        {
            float poleH = 8f;
            var root = new GameObject($"Pin_{label}");
            root.transform.SetParent(_markerParent);
            Vector3 basePos = worldPos + Vector3.up * (poleH * 0.5f);
            root.transform.position = basePos;
            root.transform.localScale = Vector3.zero; // will animate in

            // Pole (thin cylinder)
            var pole = MakeSubMesh(root.transform, "Pole", _cylinderMesh,
                MakeColorMat(color * 0.8f),
                Vector3.zero,
                Quaternion.identity,
                new Vector3(0.2f, poleH * 0.5f, 0.2f));

            // Head (sphere)
            var head = MakeSubMesh(root.transform, "Head", _sphereMesh,
                MakeColorMat(color),
                new Vector3(0, poleH * 0.5f + 1.2f, 0),
                Quaternion.identity,
                new Vector3(2.2f, 2.2f, 2.2f));

            // Glow halo around head
            var halo = MakeSubMesh(root.transform, "Halo", _sphereMesh,
                MakeColorMat(new Color(color.r, color.g, color.b, 0.15f), true),
                new Vector3(0, poleH * 0.5f + 1.2f, 0),
                Quaternion.identity,
                new Vector3(3.5f, 3.5f, 3.5f));

            // Tip cone pointing down
            var tip = MakeSubMesh(root.transform, "Tip", _coneMesh,
                MakeColorMat(color),
                new Vector3(0, -poleH * 0.5f - 0.6f, 0),
                Quaternion.Euler(180, 0, 0),
                new Vector3(0.9f, 1.2f, 0.9f));

            // 3D text label (billboard) — we use a TextMesh for world-space
            var labelGo = new GameObject("Label");
            labelGo.transform.SetParent(root.transform);
            labelGo.transform.localPosition = new Vector3(0, poleH * 0.5f + 3.2f, 0);
            labelGo.transform.localScale = Vector3.one * 0.6f;
            var tm = labelGo.AddComponent<TextMesh>();
            tm.text = label;
            tm.fontSize = 42;
            tm.characterSize = 0.12f;
            tm.anchor = TextAnchor.MiddleCenter;
            tm.alignment = TextAlignment.Center;
            tm.color = Color.white;
            tm.fontStyle = UnityEngine.FontStyle.Bold;
            // Billboard component
            labelGo.AddComponent<BillboardText>();

            _animatedMarkers.Add((root.transform, Time.time, basePos));
        }

        /// <summary>
        /// Place a strike/dip T-bar marker showing orientation
        /// </summary>
        void PlaceStrikeDipMarker(Vector3 pos, float strike, float dip, Color color)
        {
            var root = new GameObject("SD_Marker");
            root.transform.SetParent(_markerParent);
            root.transform.position = pos + Vector3.up * 2f;
            root.transform.rotation = Quaternion.Euler(0, -strike, 0);

            // Ground disc (flat ring at surface)
            MakeSubMesh(root.transform, "GroundDisc", _cylinderMesh,
                MakeColorMat(new Color(color.r, color.g, color.b, 0.3f), true),
                new Vector3(0, -1.8f, 0),
                Quaternion.identity,
                new Vector3(4f, 0.05f, 4f));

            // Strike line (horizontal bar)
            MakeSubMesh(root.transform, "StrikeLine", _cylinderMesh,
                MakeColorMat(color),
                Vector3.zero,
                Quaternion.Euler(0, 0, 90),
                new Vector3(0.15f, 3f, 0.15f));

            // Dip tick (short perpendicular bar)
            float dipLen = Mathf.Clamp(dip / 90f * 2f, 0.3f, 2f);
            MakeSubMesh(root.transform, "DipTick", _cylinderMesh,
                MakeColorMat(color * 1.3f),
                new Vector3(0, 0, dipLen * 0.5f),
                Quaternion.identity,
                new Vector3(0.15f, 0.15f, dipLen));

            // Centre sphere
            MakeSubMesh(root.transform, "Centre", _sphereMesh,
                MakeColorMat(color),
                Vector3.zero,
                Quaternion.identity,
                new Vector3(0.5f, 0.5f, 0.5f));

            // Vertical pole
            MakeSubMesh(root.transform, "Pole", _cylinderMesh,
                MakeColorMat(color * 0.6f),
                new Vector3(0, -1f, 0),
                Quaternion.identity,
                new Vector3(0.12f, 2f, 0.12f));

            // Label
            AddWorldLabel(root.transform, $"S{strike:F0}", new Vector3(0, 2.5f, 0), color);

            _animatedMarkers.Add((root.transform, Time.time, root.transform.position));
        }

        /// <summary>
        /// Place an identify marker — pulsing ring + sparkle sphere
        /// </summary>
        void PlaceIdentifyMarker(Vector3 pos)
        {
            Color c = new Color(0.3f, 0.65f, 1f);
            var root = new GameObject("ID_Marker");
            root.transform.SetParent(_markerParent);
            root.transform.position = pos + Vector3.up * 0.5f;
            root.transform.localScale = Vector3.zero;

            // Ground ring (flat disc)
            MakeSubMesh(root.transform, "Ring", _cylinderMesh,
                MakeColorMat(new Color(c.r, c.g, c.b, 0.4f), true),
                Vector3.zero,
                Quaternion.identity,
                new Vector3(5f, 0.05f, 5f));

            // Inner ring
            MakeSubMesh(root.transform, "InnerRing", _cylinderMesh,
                MakeColorMat(c),
                new Vector3(0, 0.1f, 0),
                Quaternion.identity,
                new Vector3(3f, 0.08f, 3f));

            // Sparkle sphere
            MakeSubMesh(root.transform, "Sparkle", _sphereMesh,
                MakeColorMat(new Color(c.r, c.g, c.b, 0.6f), true),
                new Vector3(0, 2f, 0),
                Quaternion.identity,
                new Vector3(1.2f, 1.2f, 1.2f));

            // Beacon pillar
            MakeSubMesh(root.transform, "Beam", _cylinderMesh,
                MakeColorMat(new Color(c.r, c.g, c.b, 0.12f), true),
                new Vector3(0, 5f, 0),
                Quaternion.identity,
                new Vector3(0.6f, 5f, 0.6f));

            _animatedMarkers.Add((root.transform, Time.time, root.transform.position));
        }

        /// <summary>
        /// Place a drill marker — tripod legs + shaft + collar + drill bit + beacon
        /// </summary>
        void PlaceDrillMarker(Vector3 pos, float surfaceH)
        {
            Color c = new Color(0.95f, 0.25f, 0.2f);
            var root = new GameObject("Drill_Marker");
            root.transform.SetParent(_markerParent);
            root.transform.position = pos + Vector3.up * 0.2f;
            root.transform.localScale = Vector3.zero;

            // Ground disc
            MakeSubMesh(root.transform, "GroundDisc", _cylinderMesh,
                MakeColorMat(new Color(c.r, c.g, c.b, 0.25f), true),
                Vector3.zero,
                Quaternion.identity,
                new Vector3(4f, 0.05f, 4f));

            // Tripod legs (3 cylinders angled outward)
            for (int i = 0; i < 3; i++)
            {
                float a = i * 120f * Mathf.Deg2Rad;
                float dx = Mathf.Cos(a) * 1.5f;
                float dz = Mathf.Sin(a) * 1.5f;
                MakeSubMesh(root.transform, $"Leg{i}", _cylinderMesh,
                    MakeColorMat(new Color(0.5f, 0.5f, 0.5f)),
                    new Vector3(dx * 0.5f, 3f, dz * 0.5f),
                    Quaternion.Euler(Mathf.Atan2(dx, 0) * Mathf.Rad2Deg * 0.15f, a * Mathf.Rad2Deg, -10f),
                    new Vector3(0.1f, 3.5f, 0.1f));
            }

            // Main shaft (central cylinder)
            MakeSubMesh(root.transform, "Shaft", _cylinderMesh,
                MakeColorMat(c * 0.8f),
                new Vector3(0, 5f, 0),
                Quaternion.identity,
                new Vector3(0.25f, 5f, 0.25f));

            // Collar (wider disc at top)
            MakeSubMesh(root.transform, "Collar", _cylinderMesh,
                MakeColorMat(c),
                new Vector3(0, 10f, 0),
                Quaternion.identity,
                new Vector3(1.2f, 0.3f, 1.2f));

            // Drill bit (cone at bottom)
            MakeSubMesh(root.transform, "Bit", _coneMesh,
                MakeColorMat(new Color(0.8f, 0.8f, 0.8f)),
                new Vector3(0, 0.3f, 0),
                Quaternion.Euler(180, 0, 0),
                new Vector3(0.6f, 1.5f, 0.6f));

            // Beacon beam (semi-transparent tall pillar)
            MakeSubMesh(root.transform, "Beacon", _cylinderMesh,
                MakeColorMat(new Color(c.r, c.g, c.b, 0.08f), true),
                new Vector3(0, 15f, 0),
                Quaternion.identity,
                new Vector3(0.8f, 15f, 0.8f));

            // Label
            int drillNum = AppState.Instance.DrillResults.Count;
            AddWorldLabel(root.transform, $"D{drillNum}", new Vector3(0, 12f, 0), c);

            _animatedMarkers.Add((root.transform, Time.time, root.transform.position));
        }

        /// <summary>
        /// Place a cross-section marker — pillar + beacon + ring + label
        /// </summary>
        void PlaceCrossSectionMarker(Vector3 pos, string label)
        {
            Color c = new Color(0.2f, 0.85f, 0.95f);
            var root = new GameObject($"XS_Marker_{label}");
            root.transform.SetParent(_markerParent);
            root.transform.position = pos + Vector3.up * 0.2f;
            root.transform.localScale = Vector3.zero;

            // Ground ring
            MakeSubMesh(root.transform, "Ring", _cylinderMesh,
                MakeColorMat(new Color(c.r, c.g, c.b, 0.35f), true),
                Vector3.zero,
                Quaternion.identity,
                new Vector3(4f, 0.05f, 4f));

            // Pillar
            MakeSubMesh(root.transform, "Pillar", _cylinderMesh,
                MakeColorMat(c),
                new Vector3(0, 5f, 0),
                Quaternion.identity,
                new Vector3(0.3f, 5f, 0.3f));

            // Top sphere
            MakeSubMesh(root.transform, "Top", _sphereMesh,
                MakeColorMat(c),
                new Vector3(0, 10.2f, 0),
                Quaternion.identity,
                new Vector3(1.5f, 1.5f, 1.5f));

            // Beacon
            MakeSubMesh(root.transform, "Beacon", _cylinderMesh,
                MakeColorMat(new Color(c.r, c.g, c.b, 0.1f), true),
                new Vector3(0, 15f, 0),
                Quaternion.identity,
                new Vector3(0.5f, 15f, 0.5f));

            // Label
            AddWorldLabel(root.transform, $"XS\u2022{label}", new Vector3(0, 12f, 0), c);

            _animatedMarkers.Add((root.transform, Time.time, root.transform.position));
        }

        void AddWorldLabel(Transform parent, string text, Vector3 localPos, Color color)
        {
            var go = new GameObject("Label");
            go.transform.SetParent(parent);
            go.transform.localPosition = localPos;
            go.transform.localScale = Vector3.one * 0.6f;
            var tm = go.AddComponent<TextMesh>();
            tm.text = text;
            tm.fontSize = 42;
            tm.characterSize = 0.12f;
            tm.anchor = TextAnchor.MiddleCenter;
            tm.alignment = TextAlignment.Center;
            tm.color = color;
            tm.fontStyle = UnityEngine.FontStyle.Bold;
            go.AddComponent<BillboardText>();
        }

        void DrawDashedLine(Vector3 start, Vector3 end, Color color)
        {
            var go = new GameObject("DashedLine");
            go.transform.SetParent(_markerParent);
            var lr = go.AddComponent<LineRenderer>();

            // Create dashed effect using multiple segments
            Vector3 dir = (end - start);
            float dist = dir.magnitude;
            dir /= dist;
            float dashLen = 3f;
            float gapLen = 2f;
            float cycle = dashLen + gapLen;
            int numDashes = Mathf.CeilToInt(dist / cycle);

            var positions = new List<Vector3>();
            for (int i = 0; i <= numDashes * 2 + 1; i++)
            {
                float along = Mathf.Min((i * cycle * 0.5f), dist);
                positions.Add(start + dir * along + Vector3.up * 1.5f);
            }

            lr.positionCount = positions.Count;
            lr.SetPositions(positions.ToArray());
            lr.startWidth = 0.8f;
            lr.endWidth = 0.8f;
            var mat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
            mat.color = color;
            lr.material = mat;
            lr.startColor = color;
            lr.endColor = color;
        }

        GameObject MakeSubMesh(Transform parent, string name, Mesh mesh, Material mat,
            Vector3 localPos, Quaternion localRot, Vector3 localScale)
        {
            var go = new GameObject(name);
            go.transform.SetParent(parent);
            go.transform.localPosition = localPos;
            go.transform.localRotation = localRot;
            go.transform.localScale = localScale;
            go.AddComponent<MeshFilter>().sharedMesh = mesh;
            var mr = go.AddComponent<MeshRenderer>();
            mr.sharedMaterial = mat;
            mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            return go;
        }

        Material MakeColorMat(Color color, bool transparent = false)
        {
            Material mat;
            if (transparent)
            {
                mat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
                mat.SetFloat("_Surface", 1); // Transparent
                mat.SetFloat("_Blend", 0);
                mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
                mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
                mat.SetInt("_ZWrite", 0);
                mat.renderQueue = 3000;
            }
            else
            {
                mat = new Material(_baseMat);
            }
            mat.color = color;
            mat.enableInstancing = true;
            return mat;
        }

        #endregion
    }

    // Billboard text component — always faces camera
    public class BillboardText : MonoBehaviour
    {
        void LateUpdate()
        {
            if (Camera.main != null)
                transform.rotation = Camera.main.transform.rotation;
        }
    }
}
