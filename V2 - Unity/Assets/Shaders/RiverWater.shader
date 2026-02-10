Shader "GeologySim/RiverWater"
{
    Properties
    {
        _SkyColor   ("Sky Color",   Color) = (0.55, 0.72, 0.88, 1)
        _DeepColor  ("Deep Color",  Color) = (0.03, 0.14, 0.25, 1)
        _ShallowColor("Shallow",    Color) = (0.06, 0.25, 0.32, 1)
        _Opacity    ("Opacity",     Float) = 0.88
        _FlowSpeed  ("Flow Speed",  Float) = 2.0
    }
    SubShader
    {
        Tags { "RenderType"="Transparent" "Queue"="Transparent+1" "RenderPipeline"="UniversalPipeline" }
        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Cull Off

        Pass
        {
            Name "RiverWater"
            Tags { "LightMode"="UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            float4 _SkyColor;
            float4 _DeepColor;
            float4 _ShallowColor;
            float  _Opacity;
            float  _FlowSpeed;
            float  _GlobalTime;

            struct Attributes
            {
                float4 posOS : POSITION;
                float3 normalOS : NORMAL;
                float2 uv : TEXCOORD0;
            };

            struct Varyings
            {
                float4 posCS   : SV_POSITION;
                float3 worldPos : TEXCOORD0;
                float3 worldN   : TEXCOORD1;
                float2 riverUV  : TEXCOORD2;
                float  fogD     : TEXCOORD3;
            };

            // ── Hash + value noise ──
            float hash21(float2 p)
            {
                return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
            }
            float vnoise(float2 p)
            {
                float2 i = floor(p);
                float2 f = frac(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = hash21(i);
                float b = hash21(i + float2(1, 0));
                float c = hash21(i + float2(0, 1));
                float d = hash21(i + float2(1, 1));
                return lerp(lerp(a, b, f.x), lerp(c, d, f.x), f.y);
            }

            Varyings vert(Attributes v)
            {
                Varyings o;
                float3 pos = v.posOS.xyz;
                float t = _GlobalTime;
                float2 uv = v.uv;

                // ── Multi-component flowing ripples along river path ──
                float wave = sin(uv.y * 12.0 - t * _FlowSpeed)         * 0.15
                           + sin(uv.y * 8.0  - t * 1.4 + uv.x * 3.0)  * 0.08
                           + sin(uv.y * 18.0 - t * 2.8 + uv.x * 5.0)  * 0.04
                           + sin(uv.y * 25.0 - t * 3.5)                * 0.02;
                pos.y += wave;

                // Cross-river ripples for turbulence
                float cross1 = sin(uv.x * 6.28 + uv.y * 4.0 - t * 1.8) * 0.03;
                float cross2 = sin(uv.x * 12.0 - uv.y * 2.0 + t * 2.5) * 0.015;
                pos.y += cross1 + cross2;

                float3 worldPos = TransformObjectToWorld(pos);
                o.worldPos = worldPos;
                o.posCS = TransformWorldToHClip(worldPos);
                o.worldN = TransformObjectToWorldNormal(v.normalOS);
                o.riverUV = uv;
                o.fogD = length(GetCameraPositionWS() - worldPos);
                return o;
            }

            half4 frag(Varyings i) : SV_Target
            {
                float3 N = normalize(i.worldN);
                float3 V = normalize(GetCameraPositionWS() - i.worldPos);

                // Sun direction
                Light mainLight = GetMainLight();
                float3 L = normalize(mainLight.direction);

                // ── Fresnel (Schlick, F0=0.02 for water) ──
                float cosT = max(dot(N, V), 0.0);
                float fresnel = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);

                // ── Reflection ──
                float3 R = reflect(-V, N);
                float skyBlend = max(R.y, 0.0);
                float3 reflCol = lerp(_SkyColor.rgb * 0.75, _SkyColor.rgb * 1.3, skyBlend);

                // Triple sun specular
                float3 H = normalize(L + V);
                float NdH = max(dot(N, H), 0.0);
                float spec1 = pow(NdH, 1024.0) * 4.0;
                float spec2 = pow(NdH, 128.0)  * 1.0;
                float spec3 = pow(NdH, 32.0)   * 0.25;
                reflCol += float3(1.0, 0.97, 0.9) * (spec1 + spec2 + spec3);

                // ── River body color with edge depth gradient ──
                float edgeFade = smoothstep(0.0, 0.3,
                    min(i.riverUV.x, 1.0 - i.riverUV.x));
                float3 waterBody = lerp(_ShallowColor.rgb, _DeepColor.rgb,
                    edgeFade * 0.6);

                // ── Multi-octave flow caustics ──
                float t = _GlobalTime;
                float flow1 = vnoise(float2(
                    i.riverUV.y * 6.0 - t * 0.6,
                    i.riverUV.x * 3.0)) * 0.10;
                float flow2 = vnoise(float2(
                    i.riverUV.y * 12.0 - t * 0.9,
                    i.riverUV.x * 5.0)) * 0.05;
                float flowCaustic = flow1 + flow2;
                waterBody += float3(
                    flowCaustic * 0.3,
                    flowCaustic * 0.6,
                    flowCaustic * 0.8);

                // ── Subsurface scattering ──
                float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.12;
                waterBody += float3(0.0, 0.12, 0.10) * sss;

                // ── Diffuse contribution ──
                float diff = max(dot(N, L), 0.0) * 0.12;
                waterBody += waterBody * diff;

                // ── Final blend ──
                float3 col = lerp(waterBody, reflCol, fresnel);

                // ── Exponential fog ──
                float fogFactor = 1.0 - exp(-0.00028 * 0.00028 * i.fogD * i.fogD);
                col = lerp(col, float3(0.78, 0.85, 0.91), saturate(fogFactor));

                return half4(col, _Opacity);
            }
            ENDHLSL
        }
    }
    FallBack "Universal Render Pipeline/Unlit"
}
