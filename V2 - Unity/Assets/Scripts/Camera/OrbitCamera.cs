// ================================================================
//  ORBIT CAMERA — Orbital camera controller with zoom-to-cursor,
//  terrain-aware clamping, smooth interpolation, WASD movement.
//  Port of V2-React Three.js OrbitControls customizations.
// ================================================================
using UnityEngine;
using UnityEngine.EventSystems;

namespace GeologySim
{
    public class OrbitCamera : MonoBehaviour
    {
        [Header("Orbit Settings")]
        public float rotateSpeed = 0.3f;
        public float zoomSpeed = 50f;
        public float panSpeed = 0.5f;
        public float keyboardMoveSpeed = 200f;

        [Header("Limits")]
        public float minDistance = 20f;
        public float maxDistance = 2500f;
        public float minPolarAngle = 5f;   // degrees
        public float maxPolarAngle = 88f;  // degrees

        [Header("Smoothing")]
        public float smoothTime = 0.12f;

        float _distance = 800f;
        float _polar = 50f;    // degrees from Y-axis
        float _azimuth = 45f;  // degrees around Y

        Vector3 _target = new Vector3(0, 80, 0);
        Vector3 _targetSmooth;
        float _distSmooth, _polarSmooth, _azimuthSmooth;

        float[] _heightmap;
        Camera _cam;
        bool _rotating, _panning;
        Vector3 _lastMouse;

        public void Initialize(float[] heightmap)
        {
            _heightmap = heightmap;
            _cam = GetComponent<Camera>();
            if (_cam == null) _cam = gameObject.AddComponent<Camera>();

            _cam.nearClipPlane = 1f;
            _cam.farClipPlane = 25000f;
            _cam.fieldOfView = 55f;
            _cam.backgroundColor = new Color(0.12f, 0.14f, 0.18f);
            _cam.clearFlags = CameraClearFlags.SolidColor;
            _cam.allowHDR = true;                 // HDR for better bloom / tonemapping
            _cam.allowMSAA = true;                // edge smoothing

            // Enable post-processing on this camera
            var camData = _cam.GetComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
            if (camData == null)
                camData = gameObject.AddComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
            camData.renderPostProcessing = true;

            _distSmooth = _distance;
            _polarSmooth = _polar;
            _azimuthSmooth = _azimuth;
            _targetSmooth = _target;

            UpdateTransform();
        }

        void Update()
        {
            if (_heightmap == null) return;
            HandleInput();
            HandleKeyboardMovement();
            SmoothUpdate();
            ClampToTerrain();
            UpdateTransform();
        }

        void HandleInput()
        {
            bool overUI = EventSystem.current != null && EventSystem.current.IsPointerOverGameObject();

            // ── Scroll Zoom (toward cursor) ──
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.001f && !overUI)
            {
                if (scroll > 0)
                {
                    Ray ray = _cam.ScreenPointToRay(Input.mousePosition);
                    float zoomFactor = _distance * 0.15f;
                    Vector3 cursorDir = ray.direction;
                    _target += cursorDir * zoomFactor * 0.3f;
                    _target.y = Mathf.Max(_target.y, GetTerrainH(_target.x, _target.z) + 2f);
                    _distance -= zoomFactor;
                }
                else
                {
                    float zoomFactor = _distance * 0.15f;
                    _distance += zoomFactor;
                }
                _distance = Mathf.Clamp(_distance, minDistance, maxDistance);
            }

            // ── Left-click rotate (primary) OR Right-click rotate ──
            if ((Input.GetMouseButtonDown(0) || Input.GetMouseButtonDown(1)) && !overUI)
            {
                // Left-click: only rotate if no tool action is pending (tool manager handles click)
                if (Input.GetMouseButtonDown(1))
                {
                    _rotating = true;
                    _lastMouse = Input.mousePosition;
                }
                else if (Input.GetMouseButtonDown(0))
                {
                    // Left-click starts drag-rotate after a small threshold
                    _lastMouse = Input.mousePosition;
                }
            }

            // Left-click becomes rotate after dragging > 4 pixels
            if (Input.GetMouseButton(0) && !_rotating && !_panning && !overUI)
            {
                float dragDist = Vector3.Distance(Input.mousePosition, _lastMouse);
                if (dragDist > 4f)
                    _rotating = true;
            }

            if (Input.GetMouseButtonUp(0) && !Input.GetMouseButton(1)) _rotating = false;
            if (Input.GetMouseButtonUp(1) && !Input.GetMouseButton(0)) _rotating = false;

            // ── Middle-click pan ──
            if (Input.GetMouseButtonDown(2) && !overUI)
            {
                _panning = true;
                _lastMouse = Input.mousePosition;
            }
            if (Input.GetMouseButtonUp(2)) _panning = false;

            // ── Shift + Left/Right click = pan ──
            if ((Input.GetMouseButton(0) || Input.GetMouseButton(1)) && Input.GetKey(KeyCode.LeftShift) && !overUI)
            {
                _panning = true;
                _rotating = false;
            }
            if (Input.GetKeyUp(KeyCode.LeftShift))
                _panning = false;

            Vector3 delta = Input.mousePosition - _lastMouse;
            _lastMouse = Input.mousePosition;

            if (_rotating)
            {
                _azimuth += delta.x * rotateSpeed;
                _polar -= delta.y * rotateSpeed;
                _polar = Mathf.Clamp(_polar, minPolarAngle, maxPolarAngle);
            }

            if (_panning)
            {
                float panMul = _distance * 0.001f * panSpeed;
                Vector3 right = _cam.transform.right;
                Vector3 fwd = Vector3.Cross(right, Vector3.up).normalized;
                _target -= right * delta.x * panMul;
                _target -= fwd * delta.y * panMul;
            }
        }

        void HandleKeyboardMovement()
        {
            // WASD + QE camera traversal
            float speed = keyboardMoveSpeed * Time.deltaTime;
            // Scale speed with distance for consistent feel
            speed *= _distance / 400f;

            Vector3 fwd = _cam.transform.forward;
            fwd.y = 0; fwd.Normalize();
            Vector3 right = _cam.transform.right;
            right.y = 0; right.Normalize();

            Vector3 move = Vector3.zero;
            if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) move += fwd;
            if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) move -= fwd;
            if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow)) move += right;
            if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) move -= right;
            if (Input.GetKey(KeyCode.Q)) _target.y -= speed * 0.5f;
            if (Input.GetKey(KeyCode.E)) _target.y += speed * 0.5f;

            if (move.sqrMagnitude > 0.001f)
                _target += move.normalized * speed;

            // +/- zoom
            if (Input.GetKey(KeyCode.Equals) || Input.GetKey(KeyCode.KeypadPlus))
                _distance = Mathf.Max(minDistance, _distance - speed * 2f);
            if (Input.GetKey(KeyCode.Minus) || Input.GetKey(KeyCode.KeypadMinus))
                _distance = Mathf.Min(maxDistance, _distance + speed * 2f);
        }

        void SmoothUpdate()
        {
            float t = Mathf.Clamp01(Time.deltaTime / smoothTime);
            _distSmooth = Mathf.Lerp(_distSmooth, _distance, t);
            _polarSmooth = Mathf.Lerp(_polarSmooth, _polar, t);
            _azimuthSmooth = Mathf.Lerp(_azimuthSmooth, _azimuth, t);
            _targetSmooth = Vector3.Lerp(_targetSmooth, _target, t);
        }

        void ClampToTerrain()
        {
            float half = GeologyConfig.TERRAIN_SIZE / 2f;
            _target.x = Mathf.Clamp(_target.x, -half, half);
            _target.z = Mathf.Clamp(_target.z, -half, half);

            float th = GetTerrainH(_target.x, _target.z);
            _target.y = Mathf.Max(_target.y, th + 5f);
        }

        void UpdateTransform()
        {
            float pr = _polarSmooth * Mathf.Deg2Rad;
            float ar = _azimuthSmooth * Mathf.Deg2Rad;

            Vector3 offset = new Vector3(
                Mathf.Sin(pr) * Mathf.Cos(ar),
                Mathf.Cos(pr),
                Mathf.Sin(pr) * Mathf.Sin(ar)
            ) * _distSmooth;

            Vector3 camPos = _targetSmooth + offset;

            // Clamp cam Y above terrain
            float camTH = GetTerrainH(camPos.x, camPos.z);
            camPos.y = Mathf.Max(camPos.y, camTH + 8f);

            transform.position = camPos;
            transform.LookAt(_targetSmooth);
        }

        float GetTerrainH(float wx, float wz)
        {
            if (_heightmap == null) return 0;
            return TerrainGenerator.GetTerrainHeight(_heightmap, wx, wz);
        }

        /// <summary>World-space target for other systems to reference.</summary>
        public Vector3 Target => _target;
        public float Distance => _distance;

        /// <summary>Check if left-click drag started (tools should ignore).</summary>
        public bool IsDragging => _rotating || _panning;

        /// <summary>
        /// Perform a raycast from screen position against terrain mesh.
        /// </summary>
        public bool RaycastTerrain(Vector2 screenPos, out RaycastHit hit)
        {
            Ray ray = _cam.ScreenPointToRay(screenPos);
            return Physics.Raycast(ray, out hit, maxDistance * 2f);
        }
    }
}
