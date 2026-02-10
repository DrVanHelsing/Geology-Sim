// ================================================================
//  ATMOSPHERE MANAGER — Sky dome, sun sphere, sun glow
//  Port of V2-React AtmosphereSystem.js
// ================================================================
using UnityEngine;

namespace GeologySim
{
    public class AtmosphereManager : MonoBehaviour
    {
        Material _skyMat;
        Material _glowMat;
        GameObject _sunSphere;
        GameObject _glowSphere;

        public void Initialize()
        {
            CreateSkyDome();
            CreateSun();
        }

        void CreateSkyDome()
        {
            var go = new GameObject("SkyDome");
            go.transform.SetParent(transform);
            var mf = go.AddComponent<MeshFilter>();
            mf.mesh = CreateSphereMesh(48, 48, 15000f);
            var mr = go.AddComponent<MeshRenderer>();

            _skyMat = new Material(Shader.Find("GeologySim/SkyDome"));
            _skyMat.SetVector("_SunDir", GeologyConfig.SUN_DIRECTION);

            mr.material = _skyMat;
            mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            mr.receiveShadows = false;
        }

        void CreateSun()
        {
            Vector3 sunDir = GeologyConfig.SUN_DIRECTION.normalized;
            float sunDist = 12000f;
            Vector3 sunPos = sunDir * sunDist;

            // Sun sphere (emissive orb)
            _sunSphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            _sunSphere.name = "SunSphere";
            _sunSphere.transform.SetParent(transform);
            _sunSphere.transform.position = sunPos;
            _sunSphere.transform.localScale = Vector3.one * 240f; // radius 120

            var sunMat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
            sunMat.color = new Color(1f, 0.98f, 0.92f);
            _sunSphere.GetComponent<Renderer>().material = sunMat;
            _sunSphere.GetComponent<Renderer>().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            // Remove collider
            var col = _sunSphere.GetComponent<Collider>();
            if (col) Destroy(col);

            // Sun glow sphere (larger, transparent, backside rendered)
            _glowSphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            _glowSphere.name = "SunGlow";
            _glowSphere.transform.SetParent(transform);
            _glowSphere.transform.position = sunPos;
            _glowSphere.transform.localScale = Vector3.one * 600f; // radius 300

            _glowMat = new Material(Shader.Find("GeologySim/SunGlow"));
            _glowMat.SetColor("_GlowColor", new Color(1f, 0.95f, 0.8f));
            _glowMat.SetFloat("_MaxAlpha", 0.7f);
            _glowSphere.GetComponent<Renderer>().material = _glowMat;
            _glowSphere.GetComponent<Renderer>().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            var glowCol = _glowSphere.GetComponent<Collider>();
            if (glowCol) Destroy(glowCol);
        }

        Mesh CreateSphereMesh(int widthSeg, int heightSeg, float radius)
        {
            // Generate a proper UV sphere with requested resolution
            int w = Mathf.Max(widthSeg, 8);
            int h = Mathf.Max(heightSeg, 4);
            int vertCount = (w + 1) * (h + 1);
            var verts = new Vector3[vertCount];
            var normals = new Vector3[vertCount];
            int idx = 0;
            for (int y = 0; y <= h; y++)
            {
                float v = (float)y / h;
                float phi = v * Mathf.PI;
                for (int x = 0; x <= w; x++)
                {
                    float u = (float)x / w;
                    float theta = u * 2f * Mathf.PI;
                    float sp = Mathf.Sin(phi);
                    float cp = Mathf.Cos(phi);
                    float st = Mathf.Sin(theta);
                    float ct = Mathf.Cos(theta);
                    Vector3 n = new Vector3(sp * ct, cp, sp * st);
                    verts[idx] = n * radius;
                    normals[idx] = n;
                    idx++;
                }
            }

            int triCount = w * h * 6;
            var tris = new int[triCount];
            int ti = 0;
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    int c = y * (w + 1) + x;
                    int n = c + w + 1;
                    tris[ti++] = c;
                    tris[ti++] = n;
                    tris[ti++] = c + 1;
                    tris[ti++] = c + 1;
                    tris[ti++] = n;
                    tris[ti++] = n + 1;
                }
            }

            var mesh = new Mesh();
            mesh.name = "SkyDomeMesh";
            mesh.vertices = verts;
            mesh.normals = normals;
            mesh.triangles = tris;
            mesh.RecalculateBounds();
            return mesh;
        }

        public void Animate(float time)
        {
            if (_skyMat != null)
                _skyMat.SetFloat("_GlobalTime", time);
            if (_glowMat != null)
                _glowMat.SetFloat("_GlobalTime", time);

            // Make atmosphere follow camera
            var cam = Camera.main;
            if (cam != null)
                transform.position = cam.transform.position;
        }

        public void UpdateSunDirection(Vector3 dir)
        {
            dir.Normalize();
            if (_skyMat != null) _skyMat.SetVector("_SunDir", dir);

            float dist = 12000f;
            Vector3 pos = dir * dist;
            if (_sunSphere != null) _sunSphere.transform.position = transform.position + pos;
            if (_glowSphere != null) _glowSphere.transform.position = transform.position + pos;
        }
    }
}
