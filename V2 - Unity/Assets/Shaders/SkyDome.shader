// ================================================================
//  SKY DOME SHADER — URP Rayleigh/Mie Atmospheric Scattering
//  Enhanced with stars, cirrus, aurora hints, better Mie, god rays
// ================================================================
Shader "GeologySim/SkyDome"
{
    Properties
    {
        _SunDir ("Sun Direction", Vector) = (0.75, 0.4, 0.45, 0)
    }

    SubShader
    {
        Tags { "RenderType"="Background" "RenderPipeline"="UniversalPipeline" "Queue"="Background" }
        Cull Off
        ZWrite Off

        Pass
        {
            Name "SkyPass"
            Tags { "LightMode"="UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            float4 _SunDir;
            float _GlobalTime;

            struct Attributes { float4 positionOS : POSITION; };
            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float3 worldDir   : TEXCOORD0;
            };

            // ─── Noise utilities ────────────────────────────────────
            float Hash(float2 p)  { return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
            float Hash3(float3 p) { return frac(sin(dot(p, float3(127.1, 311.7, 74.7))) * 43758.5453); }

            float VNoise(float2 p)
            {
                float2 i = floor(p), f = frac(p);
                f = f * f * (3.0 - 2.0 * f);
                return lerp(lerp(Hash(i), Hash(i + float2(1,0)), f.x),
                            lerp(Hash(i + float2(0,1)), Hash(i + float2(1,1)), f.x), f.y);
            }

            float FBM(float2 p, int octaves)
            {
                float v = 0, a = 0.5;
                for (int i = 0; i < octaves; i++) { v += a * VNoise(p); p *= 2.1; a *= 0.48; }
                return v;
            }

            float Voronoi(float2 p)
            {
                float2 i = floor(p), f = frac(p);
                float md = 1.0;
                for (int y = -1; y <= 1; y++)
                for (int x = -1; x <= 1; x++)
                {
                    float2 n = float2(x, y);
                    float2 r = n - f + Hash(i + n);
                    md = min(md, dot(r, r));
                }
                return sqrt(md);
            }

            // ─── Phase functions ────────────────────────────────────
            float HGPhase(float cosT, float g)
            {
                float g2 = g * g;
                return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cosT, 1.5));
            }

            float RayleighPhase(float cosT)
            {
                return 0.75 * (1.0 + cosT * cosT);
            }

            // ─── Stars ─────────────────────────────────────────────
            float Stars(float3 dir)
            {
                // Voronoi grid on sphere
                float3 n = abs(dir);
                float2 uv;
                if (n.x > n.y && n.x > n.z) uv = dir.yz / dir.x;
                else if (n.y > n.z) uv = dir.xz / dir.y;
                else uv = dir.xy / dir.z;

                uv *= 120.0; // density
                float2 i = floor(uv), f = frac(uv);
                float star = 0;
                for (int y = -1; y <= 1; y++)
                for (int x = -1; x <= 1; x++)
                {
                    float2 nb = float2(x, y);
                    float h = Hash(i + nb);
                    if (h > 0.985) // ~1.5% cells have a star
                    {
                        float2 center = nb + float2(Hash(i + nb + 13.7), Hash(i + nb + 47.3));
                        float d = length(f - center);
                        float brightness = (h - 0.985) * 66.0; // 0→1
                        float twinkle = 0.7 + 0.3 * sin(_GlobalTime * 2.0 + h * 100.0);
                        star += smoothstep(0.04, 0.0, d) * brightness * twinkle;
                    }
                }
                return star;
            }

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                float3 wp = TransformObjectToWorld(IN.positionOS.xyz);
                OUT.worldDir = normalize(wp - GetCameraPositionWS());
                OUT.positionCS = TransformObjectToHClip(IN.positionOS.xyz);
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                float3 dir = normalize(IN.worldDir);
                float3 sun = normalize(_SunDir.xyz);
                float h = max(dir.y, 0.0);
                float cosT = dot(dir, sun);

                // ─── Rayleigh sky with wavelength-dependent scatter ─────
                float3 betaR = float3(5.8e-3, 13.5e-3, 33.1e-3); // wavelength scatter
                float rayleigh = RayleighPhase(cosT);
                float3 zenith  = float3(0.16, 0.36, 0.80);
                float3 horizon = float3(0.72, 0.82, 0.94);
                float3 sky = lerp(horizon, zenith, pow(h, 0.40));
                sky += betaR * rayleigh * 3.0 * max(sun.y, 0.05);

                // ─── Atmospheric extinction near horizon ────────────────
                float extinction = exp(-max(1.0 - h, 0.0) * 3.0);
                float3 extinctColor = float3(0.88, 0.78, 0.72);
                sky = lerp(extinctColor, sky, lerp(0.35, 1.0, extinction));

                // ─── Sunset / sunrise tint ──────────────────────────────
                float sunAlt = sun.y;
                float sunsetMask = smoothstep(0.0, 0.12, h) * (1.0 - smoothstep(0.12, 0.50, h));
                float sunsetStrength = smoothstep(0.4, -0.05, sunAlt); // stronger when sun is lower
                float3 sunsetColor = lerp(float3(1.0, 0.45, 0.15), float3(1.0, 0.65, 0.3), h);
                sky += sunsetColor * max(cosT, 0) * max(cosT, 0) * 0.55 * sunsetMask * (0.3 + 0.7 * sunsetStrength);

                // Dawn purple
                float dawnPurple = smoothstep(0.2, 0.5, h) * (1.0 - smoothstep(0.5, 0.8, h));
                sky += float3(0.25, 0.10, 0.35) * dawnPurple * sunsetStrength * 0.3;

                // ─── Mie forward scattering ─────────────────────────────
                float mieMain = HGPhase(cosT, 0.76) * 0.014;
                float mieSide = HGPhase(cosT, 0.40) * 0.004;
                float3 mieColor = lerp(float3(1.0, 0.92, 0.75), float3(1.0, 0.75, 0.50), sunsetStrength);
                sky += mieColor * (mieMain + mieSide);

                // ─── Sun disc (multi-layer) ─────────────────────────────
                float sd = max(cosT, 0.0);
                sky += float3(1.0, 0.98, 0.92) * pow(sd, 1024) * 6.0;   // hard core
                sky += float3(1.0, 0.97, 0.90) * pow(sd, 256)  * 2.0;   // inner bloom
                sky += float3(1.0, 0.85, 0.60) * pow(sd, 32)   * 0.40;  // mid halo
                sky += float3(1.0, 0.70, 0.40) * pow(sd, 6)    * 0.15;  // wide glow

                // ─── God-ray streaks from sun ───────────────────────────
                float2 sunScreen = sun.xz;
                float2 dirScreen = dir.xz;
                float rayAngle = atan2(dir.z - sun.z, dir.x - sun.x);
                float rayNoise = VNoise(float2(rayAngle * 8.0, 0.0)) * 0.8 + 0.2;
                float rayMask = pow(sd, 4) * 0.12 * rayNoise * smoothstep(0.0, 0.15, h);
                sky += float3(1.0, 0.92, 0.70) * rayMask;

                // ─── Ground hemisphere fade ─────────────────────────────
                if (dir.y < 0.0)
                {
                    float3 groundColor = lerp(float3(0.68, 0.78, 0.88), float3(0.45, 0.55, 0.65), -dir.y * 4.0);
                    sky = lerp(sky, groundColor, smoothstep(0.0, -0.08, dir.y));
                }

                // ─── Haze / mist bands near horizon ────────────────────
                if (h > 0.0 && h < 0.22)
                {
                    float2 huv = dir.xz / max(dir.y, 0.005) * 0.20 + _GlobalTime * 0.002;
                    float haze = smoothstep(0.32, 0.68, FBM(huv * 2.5, 4)) * 0.25;
                    float hf = smoothstep(0.0, 0.08, h) * (1.0 - smoothstep(0.08, 0.22, h));
                    float3 hazeColor = lerp(float3(0.92, 0.93, 0.96), float3(1.0, 0.88, 0.78), sunsetStrength * max(cosT, 0));
                    sky = lerp(sky, hazeColor, haze * hf);
                }

                // ─── Cumulus clouds (lower layer) ───────────────────────
                if (dir.y > 0.01)
                {
                    float invY = 1.0 / dir.y;
                    float2 cuv = dir.xz * invY * 0.50 + _GlobalTime * 0.004;

                    float c1 = FBM(cuv * 3.0, 5) - 0.32;
                    float c2 = FBM(cuv * 7.5 + float2(4.1, 2.3), 4) - 0.42;
                    float cloud = saturate(smoothstep(0, 0.30, c1) + smoothstep(0, 0.20, c2) * 0.35);

                    // Cloud lighting
                    float2 lightOff = sun.xz * 0.015;
                    float cShadow = FBM((cuv + lightOff) * 3.0, 4);
                    float lightFactor = 0.65 + 0.35 * max(sun.y, 0);
                    float selfShadow = saturate(1.0 - (cShadow - c1 - 0.32) * 2.5);
                    float3 cloudBright = float3(lightFactor, lightFactor, lightFactor);
                    float3 cloudDark = float3(0.55, 0.58, 0.65);
                    float3 cColor = lerp(cloudDark, cloudBright, selfShadow);

                    // Sunset coloring on clouds
                    cColor = lerp(cColor, float3(1.0, 0.75, 0.50), sunsetStrength * max(cosT + 0.3, 0) * 0.5);

                    float cloudFade = smoothstep(0.01, 0.20, dir.y);
                    sky = lerp(sky, cColor, cloud * 0.70 * cloudFade);
                }

                // ─── Cirrus / wispy clouds (upper layer) ────────────────
                if (dir.y > 0.15)
                {
                    float invY = 1.0 / dir.y;
                    float2 ciuv = dir.xz * invY * 0.12 + _GlobalTime * 0.0015 + float2(50, 80);

                    float w1 = VNoise(ciuv * 8.0);
                    float w2 = VNoise(ciuv * 16.0 + float2(7, 3));
                    float wisp = smoothstep(0.48, 0.70, w1) * 0.6 + smoothstep(0.52, 0.72, w2) * 0.3;
                    wisp *= smoothstep(0.15, 0.35, dir.y) * (1.0 - smoothstep(0.65, 0.90, dir.y));

                    float3 cirrusColor = lerp(float3(0.9, 0.92, 0.96), float3(1.0, 0.85, 0.70), sunsetStrength * 0.5);
                    sky = lerp(sky, cirrusColor, wisp * 0.30);
                }

                // ─── Stars (fade with sun altitude) ─────────────────────
                float starVis = smoothstep(0.15, -0.1, sunAlt) * smoothstep(0.0, 0.2, h);
                if (starVis > 0.001)
                {
                    float s = Stars(dir);
                    // Color variety
                    float starHue = Hash(floor(dir.xy * 120.0));
                    float3 starColor = lerp(float3(0.9, 0.9, 1.0), float3(1.0, 0.85, 0.7), starHue);
                    sky += starColor * s * starVis;
                }

                return half4(sky, 1);
            }
            ENDHLSL
        }
    }
    FallBack Off
}
