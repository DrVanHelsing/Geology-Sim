// ================================================================
//  ENVIRONMENT FX MANAGER — Particle-based atmospheric effects
//  Ambient dust motes, god-ray shafts, fireflies, waterfall mist,
//  pollen, terrain-kicked dust, altitude-aware snow particles.
// ================================================================
using UnityEngine;

namespace GeologySim
{
    public class EnvironmentFXManager : MonoBehaviour
    {
        Camera _cam;
        ParticleSystem _dustMotes;
        ParticleSystem _pollenParticles;
        ParticleSystem _snowParticles;
        ParticleSystem _mistParticles;
        ParticleSystem _fireflyParticles;
        ParticleSystem _godRays;
        ParticleSystem _leafParticles;

        public void Initialize(Camera cam)
        {
            _cam = cam;
            CreateDustMotes();
            CreatePollenParticles();
            CreateSnowParticles();
            CreateMistParticles();
            CreateFireflies();
            CreateGodRays();
            CreateLeafParticles();
        }

        void Update()
        {
            if (_cam == null) return;
            Vector3 camPos = _cam.transform.position;

            // All particle systems follow camera loosely
            FollowCamera(_dustMotes, camPos, 0f);
            FollowCamera(_pollenParticles, camPos, -10f);
            FollowCamera(_snowParticles, camPos + Vector3.up * 60f, 0f);
            FollowCamera(_leafParticles, camPos, 0f);

            // Fireflies only active near ground level at lower elevations
            if (_fireflyParticles != null)
            {
                float groundY = Mathf.Max(camPos.y - 30f, GeologyConfig.WATER_LEVEL + 5f);
                _fireflyParticles.transform.position = new Vector3(camPos.x, groundY, camPos.z);
            }

            // Snow only visible at high altitude
            if (_snowParticles != null)
            {
                var emission = _snowParticles.emission;
                emission.rateOverTime = camPos.y > 150f ? 80f : 0f;
            }

            // Pollen only in grass zones
            if (_pollenParticles != null)
            {
                var emission = _pollenParticles.emission;
                bool inGrassZone = camPos.y > GeologyConfig.WATER_LEVEL + 5f && camPos.y < 130f;
                emission.rateOverTime = inGrassZone ? 25f : 0f;
            }
        }

        void FollowCamera(ParticleSystem ps, Vector3 pos, float yOffset)
        {
            if (ps != null)
                ps.transform.position = pos + Vector3.up * yOffset;
        }

        // ── Ambient Dust Motes ────────────────

        void CreateDustMotes()
        {
            var go = new GameObject("FX_DustMotes");
            go.transform.SetParent(transform);
            _dustMotes = go.AddComponent<ParticleSystem>();
            var main = _dustMotes.main;
            main.maxParticles = 400;
            main.startLifetime = new ParticleSystem.MinMaxCurve(6f, 14f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(0.3f, 1.2f);
            main.startSize = new ParticleSystem.MinMaxCurve(0.15f, 0.6f);
            main.startColor = new Color(1f, 0.95f, 0.85f, 0.25f);
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.gravityModifier = -0.02f; // slight upward drift

            var emission = _dustMotes.emission;
            emission.rateOverTime = 30f;

            var shape = _dustMotes.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(120f, 40f, 120f);

            var colorLife = _dustMotes.colorOverLifetime;
            colorLife.enabled = true;
            var gradient = new Gradient();
            gradient.SetKeys(
                new[] { new GradientColorKey(Color.white, 0f), new GradientColorKey(Color.white, 1f) },
                new[] { new GradientAlphaKey(0f, 0f), new GradientAlphaKey(0.3f, 0.2f),
                         new GradientAlphaKey(0.3f, 0.8f), new GradientAlphaKey(0f, 1f) }
            );
            colorLife.color = gradient;

            var noise = _dustMotes.noise;
            noise.enabled = true;
            noise.strength = 1.5f;
            noise.frequency = 0.3f;
            noise.scrollSpeed = 0.2f;
            noise.octaveCount = 2;

            SetupParticleMaterial(_dustMotes, new Color(1f, 0.97f, 0.88f, 0.2f));
        }

        // ── Pollen / Seed Particles ───────────

        void CreatePollenParticles()
        {
            var go = new GameObject("FX_Pollen");
            go.transform.SetParent(transform);
            _pollenParticles = go.AddComponent<ParticleSystem>();
            var main = _pollenParticles.main;
            main.maxParticles = 200;
            main.startLifetime = new ParticleSystem.MinMaxCurve(8f, 18f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(0.1f, 0.5f);
            main.startSize = new ParticleSystem.MinMaxCurve(0.08f, 0.25f);
            main.startColor = new Color(0.95f, 0.92f, 0.5f, 0.35f);
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.gravityModifier = -0.01f;

            var emission = _pollenParticles.emission;
            emission.rateOverTime = 25f;

            var shape = _pollenParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(100f, 15f, 100f);

            var noise = _pollenParticles.noise;
            noise.enabled = true;
            noise.strength = 2f;
            noise.frequency = 0.15f;
            noise.scrollSpeed = 0.3f;
            noise.octaveCount = 3;

            var colorLife = _pollenParticles.colorOverLifetime;
            colorLife.enabled = true;
            var grad = new Gradient();
            grad.SetKeys(
                new[] { new GradientColorKey(new Color(1f, 0.95f, 0.6f), 0f), new GradientColorKey(new Color(0.9f, 0.85f, 0.4f), 1f) },
                new[] { new GradientAlphaKey(0f, 0f), new GradientAlphaKey(0.4f, 0.15f),
                         new GradientAlphaKey(0.35f, 0.85f), new GradientAlphaKey(0f, 1f) }
            );
            colorLife.color = grad;

            SetupParticleMaterial(_pollenParticles, new Color(0.95f, 0.9f, 0.45f, 0.3f));
        }

        // ── High-altitude Snow ────────────────

        void CreateSnowParticles()
        {
            var go = new GameObject("FX_Snow");
            go.transform.SetParent(transform);
            _snowParticles = go.AddComponent<ParticleSystem>();
            var main = _snowParticles.main;
            main.maxParticles = 600;
            main.startLifetime = new ParticleSystem.MinMaxCurve(5f, 12f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(1f, 3f);
            main.startSize = new ParticleSystem.MinMaxCurve(0.2f, 0.7f);
            main.startColor = new Color(0.95f, 0.96f, 1f, 0.6f);
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.gravityModifier = 0.15f;

            var emission = _snowParticles.emission;
            emission.rateOverTime = 0f; // controlled in Update

            var shape = _snowParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(200f, 5f, 200f);

            var noise = _snowParticles.noise;
            noise.enabled = true;
            noise.strength = 1.8f;
            noise.frequency = 0.25f;
            noise.scrollSpeed = 0.15f;
            noise.octaveCount = 2;

            var colorLife = _snowParticles.colorOverLifetime;
            colorLife.enabled = true;
            var grad = new Gradient();
            grad.SetKeys(
                new[] { new GradientColorKey(Color.white, 0f), new GradientColorKey(new Color(0.9f, 0.92f, 0.98f), 1f) },
                new[] { new GradientAlphaKey(0f, 0f), new GradientAlphaKey(0.7f, 0.1f),
                         new GradientAlphaKey(0.5f, 0.9f), new GradientAlphaKey(0f, 1f) }
            );
            colorLife.color = grad;

            SetupParticleMaterial(_snowParticles, new Color(0.95f, 0.97f, 1f, 0.55f));
        }

        // ── Lake/Waterfall Mist ───────────────

        void CreateMistParticles()
        {
            var go = new GameObject("FX_Mist");
            go.transform.SetParent(transform);

            // Place mist at water level across the terrain center
            go.transform.position = new Vector3(0, GeologyConfig.WATER_LEVEL + 2f, 0);

            _mistParticles = go.AddComponent<ParticleSystem>();
            var main = _mistParticles.main;
            main.maxParticles = 150;
            main.startLifetime = new ParticleSystem.MinMaxCurve(10f, 20f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(0.2f, 0.8f);
            main.startSize = new ParticleSystem.MinMaxCurve(8f, 25f);
            main.startColor = new Color(0.8f, 0.85f, 0.92f, 0.08f);
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.gravityModifier = -0.005f;

            var emission = _mistParticles.emission;
            emission.rateOverTime = 8f;

            var shape = _mistParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(300f, 3f, 300f);

            var sizeLife = _mistParticles.sizeOverLifetime;
            sizeLife.enabled = true;
            sizeLife.size = new ParticleSystem.MinMaxCurve(1f, AnimationCurve.EaseInOut(0f, 0.3f, 1f, 1.5f));

            var colorLife = _mistParticles.colorOverLifetime;
            colorLife.enabled = true;
            var grad = new Gradient();
            grad.SetKeys(
                new[] { new GradientColorKey(new Color(0.82f, 0.87f, 0.94f), 0f), new GradientColorKey(new Color(0.9f, 0.92f, 0.96f), 1f) },
                new[] { new GradientAlphaKey(0f, 0f), new GradientAlphaKey(0.1f, 0.3f),
                         new GradientAlphaKey(0.08f, 0.7f), new GradientAlphaKey(0f, 1f) }
            );
            colorLife.color = grad;

            var noise = _mistParticles.noise;
            noise.enabled = true;
            noise.strength = 3f;
            noise.frequency = 0.08f;
            noise.scrollSpeed = 0.1f;

            SetupParticleMaterial(_mistParticles, new Color(0.85f, 0.88f, 0.95f, 0.06f), true);
        }

        // ── Fireflies (evening / low areas) ──

        void CreateFireflies()
        {
            var go = new GameObject("FX_Fireflies");
            go.transform.SetParent(transform);
            _fireflyParticles = go.AddComponent<ParticleSystem>();
            var main = _fireflyParticles.main;
            main.maxParticles = 80;
            main.startLifetime = new ParticleSystem.MinMaxCurve(3f, 7f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(0.1f, 0.4f);
            main.startSize = new ParticleSystem.MinMaxCurve(0.3f, 0.8f);
            main.startColor = new Color(0.8f, 1f, 0.4f, 0.6f);
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.gravityModifier = -0.02f;

            var emission = _fireflyParticles.emission;
            emission.rateOverTime = 12f;

            var shape = _fireflyParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(80f, 8f, 80f);

            var noise = _fireflyParticles.noise;
            noise.enabled = true;
            noise.strength = 2.5f;
            noise.frequency = 0.4f;
            noise.scrollSpeed = 0.5f;
            noise.octaveCount = 2;

            // Pulsing glow effect
            var colorLife = _fireflyParticles.colorOverLifetime;
            colorLife.enabled = true;
            var grad = new Gradient();
            grad.SetKeys(
                new[] { new GradientColorKey(new Color(0.5f, 0.9f, 0.2f), 0f),
                         new GradientColorKey(new Color(0.9f, 1f, 0.3f), 0.5f),
                         new GradientColorKey(new Color(0.4f, 0.8f, 0.15f), 1f) },
                new[] { new GradientAlphaKey(0f, 0f), new GradientAlphaKey(0.8f, 0.1f),
                         new GradientAlphaKey(0.2f, 0.5f), new GradientAlphaKey(0.7f, 0.7f),
                         new GradientAlphaKey(0f, 1f) }
            );
            colorLife.color = grad;

            var sizeLife = _fireflyParticles.sizeOverLifetime;
            sizeLife.enabled = true;
            sizeLife.size = new ParticleSystem.MinMaxCurve(1f,
                new AnimationCurve(
                    new Keyframe(0f, 0.2f), new Keyframe(0.15f, 1f),
                    new Keyframe(0.4f, 0.3f), new Keyframe(0.6f, 0.9f),
                    new Keyframe(0.85f, 0.4f), new Keyframe(1f, 0f)));

            SetupParticleMaterial(_fireflyParticles, new Color(0.7f, 1f, 0.3f, 0.5f), false, true);
        }

        // ── God Rays (light shafts) ──────────

        void CreateGodRays()
        {
            var go = new GameObject("FX_GodRays");
            go.transform.SetParent(transform);

            // Position along sun direction
            Vector3 sunDir = GeologyConfig.SUN_DIRECTION.normalized;
            go.transform.position = sunDir * 500f + Vector3.up * 100f;
            go.transform.rotation = Quaternion.LookRotation(-sunDir);

            _godRays = go.AddComponent<ParticleSystem>();
            var main = _godRays.main;
            main.maxParticles = 30;
            main.startLifetime = new ParticleSystem.MinMaxCurve(4f, 8f);
            main.startSpeed = 0f;
            main.startSize = new ParticleSystem.MinMaxCurve(20f, 60f);
            main.startSize3D = true;
            main.startSizeX = new ParticleSystem.MinMaxCurve(3f, 8f);
            main.startSizeY = new ParticleSystem.MinMaxCurve(60f, 150f);
            main.startSizeZ = 1f;
            main.startColor = new Color(1f, 0.95f, 0.8f, 0.03f);
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.startRotation = new ParticleSystem.MinMaxCurve(-0.15f, 0.15f);

            var emission = _godRays.emission;
            emission.rateOverTime = 3f;

            var shape = _godRays.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(200f, 50f, 10f);

            var colorLife = _godRays.colorOverLifetime;
            colorLife.enabled = true;
            var grad = new Gradient();
            grad.SetKeys(
                new[] { new GradientColorKey(new Color(1f, 0.95f, 0.80f), 0f), new GradientColorKey(new Color(1f, 0.92f, 0.75f), 1f) },
                new[] { new GradientAlphaKey(0f, 0f), new GradientAlphaKey(0.04f, 0.2f),
                         new GradientAlphaKey(0.03f, 0.8f), new GradientAlphaKey(0f, 1f) }
            );
            colorLife.color = grad;

            SetupParticleMaterial(_godRays, new Color(1f, 0.95f, 0.80f, 0.025f), true);
        }

        // ── Falling Leaves ────────────────────

        void CreateLeafParticles()
        {
            var go = new GameObject("FX_Leaves");
            go.transform.SetParent(transform);
            _leafParticles = go.AddComponent<ParticleSystem>();
            var main = _leafParticles.main;
            main.maxParticles = 100;
            main.startLifetime = new ParticleSystem.MinMaxCurve(6f, 14f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(0.5f, 2f);
            main.startSize = new ParticleSystem.MinMaxCurve(0.3f, 0.8f);
            main.startColor = new ParticleSystem.MinMaxGradient(
                new Color(0.45f, 0.55f, 0.20f, 0.7f),
                new Color(0.70f, 0.55f, 0.15f, 0.8f));
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.gravityModifier = 0.08f;
            main.startRotation = new ParticleSystem.MinMaxCurve(0f, Mathf.PI * 2f);

            var emission = _leafParticles.emission;
            emission.rateOverTime = 6f;

            var shape = _leafParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(100f, 30f, 100f);

            var rotLife = _leafParticles.rotationOverLifetime;
            rotLife.enabled = true;
            rotLife.z = new ParticleSystem.MinMaxCurve(-2f, 2f);

            var noise = _leafParticles.noise;
            noise.enabled = true;
            noise.strength = 3f;
            noise.frequency = 0.2f;
            noise.scrollSpeed = 0.4f;
            noise.octaveCount = 2;

            var colorLife = _leafParticles.colorOverLifetime;
            colorLife.enabled = true;
            var grad = new Gradient();
            grad.SetKeys(
                new[] { new GradientColorKey(new Color(0.5f, 0.6f, 0.2f), 0f),
                         new GradientColorKey(new Color(0.65f, 0.5f, 0.15f), 0.5f),
                         new GradientColorKey(new Color(0.55f, 0.35f, 0.1f), 1f) },
                new[] { new GradientAlphaKey(0f, 0f), new GradientAlphaKey(0.8f, 0.1f),
                         new GradientAlphaKey(0.7f, 0.85f), new GradientAlphaKey(0f, 1f) }
            );
            colorLife.color = grad;

            SetupParticleMaterial(_leafParticles, new Color(0.5f, 0.55f, 0.2f, 0.7f));
        }

        // ── Material Helper ───────────────────

        void SetupParticleMaterial(ParticleSystem ps, Color color, bool softBlend = false, bool additive = false)
        {
            var renderer = ps.GetComponent<ParticleSystemRenderer>();
            renderer.renderMode = ParticleSystemRenderMode.Billboard;
            renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            renderer.receiveShadows = false;

            // Find a suitable particle shader
            string shaderName = additive
                ? "Universal Render Pipeline/Particles/Unlit"
                : "Universal Render Pipeline/Particles/Unlit";
            var shader = Shader.Find(shaderName);
            if (shader == null)
                shader = Shader.Find("Particles/Standard Unlit");
            if (shader == null)
                shader = Shader.Find("Universal Render Pipeline/Unlit");

            var mat = new Material(shader);
            mat.color = color;
            mat.SetFloat("_Surface", 1f); // Transparent
            mat.SetFloat("_Blend", softBlend ? 1f : 0f); // 0=Alpha, 1=Additive(ish)

            // Set keywords for transparency
            mat.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
            mat.renderQueue = 3000;

            if (additive)
            {
                mat.SetFloat("_Blend", 1f);
                mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.One);
                mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.One);
            }

            // Generate a small soft circle texture for particles
            mat.mainTexture = CreateSoftCircleTexture(64);
            renderer.material = mat;
        }

        Texture2D CreateSoftCircleTexture(int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            var pixels = new Color[size * size];
            float center = size * 0.5f;

            for (int y = 0; y < size; y++)
            for (int x = 0; x < size; x++)
            {
                float dx = (x - center) / center;
                float dy = (y - center) / center;
                float dist = Mathf.Sqrt(dx * dx + dy * dy);
                float alpha = Mathf.Clamp01(1f - Mathf.Pow(dist, 1.5f));
                alpha *= alpha; // softer falloff
                pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
            }

            tex.SetPixels(pixels);
            tex.Apply(true);
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Bilinear;
            return tex;
        }
    }
}
