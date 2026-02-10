// ================================================================
//  LAKE WATER SHADER — URP Enhanced Gerstner Waves
//  7 Gerstner waves, foam ring, caustics, depth color, subsurface
// ================================================================
Shader "GeologySim/LakeWater"
{
    Properties
    {
        _Color        ("Water Color", Color) = (0.10, 0.32, 0.38, 1)
        _DeepColor    ("Deep Color", Color)  = (0.04, 0.12, 0.22, 1)
        _SkyColor     ("Sky Color", Color)   = (0.55, 0.72, 0.88, 1)
        _Opacity      ("Opacity", Range(0,1)) = 0.82
        _RimHeight    ("Rim Height", Float) = 1.8
    }

    SubShader
    {
        Tags { "RenderType"="Transparent" "RenderPipeline"="UniversalPipeline" "Queue"="Transparent" }

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode"="UniversalForward" }
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            Cull Off

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fog

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            CBUFFER_START(UnityPerMaterial)
                float4 _Color;
                float4 _DeepColor;
                float4 _SkyColor;
                float  _Opacity;
                float  _RimHeight;
            CBUFFER_END

            float _GlobalTime;

            struct Attributes { float4 positionOS : POSITION; float2 uv : TEXCOORD0; };
            struct Varyings
            {
                float4 positionCS  : SV_POSITION;
                float3 positionWS  : TEXCOORD0;
                float3 normalWS    : TEXCOORD1;
                float2 uv          : TEXCOORD2;
                float  fogFactor   : TEXCOORD3;
            };

            float Hash(float2 p) { return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
            float VNoise(float2 p)
            {
                float2 i = floor(p), f = frac(p);
                f = f*f*(3.0-2.0*f);
                return lerp(lerp(Hash(i),Hash(i+float2(1,0)),f.x),lerp(Hash(i+float2(0,1)),Hash(i+float2(1,1)),f.x),f.y);
            }

            float FBM3(float2 p)
            {
                float v = 0, a = 0.5;
                for (int i = 0; i < 3; i++) { v += a*VNoise(p); p = p*2.1+float2(1.3,1.7); a *= 0.5; }
                return v;
            }

            float3 Gerstner(float3 p, float t, float2 dir, float freq, float amp, float steep)
            {
                float phase = dot(dir, p.xz) * freq + t;
                return float3(steep*amp*dir.x*cos(phase), amp*sin(phase), steep*amp*dir.y*cos(phase));
            }

            float3 ApplyLakeWaves(float3 pos, float t)
            {
                float3 d = pos;
                d += Gerstner(pos, t*1.2, normalize(float2(1.0,0.5)), 0.06, 0.18, 0.28);
                d += Gerstner(pos, t*0.8, normalize(float2(-0.6,1.0)), 0.08, 0.12, 0.22);
                d += Gerstner(pos, t*1.5, normalize(float2(0.4,-0.8)), 0.12, 0.08, 0.18);
                d += Gerstner(pos, t*1.8, normalize(float2(-0.9,-0.3)), 0.18, 0.04, 0.12);
                d += Gerstner(pos, t*2.2, normalize(float2(0.7,0.7)), 0.25, 0.02, 0.08);
                d += Gerstner(pos, t*0.6, normalize(float2(-0.4,0.9)), 0.04, 0.08, 0.15);
                d += Gerstner(pos, t*2.8, normalize(float2(0.3,-0.5)), 0.35, 0.01, 0.06);
                return d;
            }

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                float3 pos = TransformObjectToWorld(IN.positionOS.xyz);
                float t = _GlobalTime;
                float3 displaced = ApplyLakeWaves(pos, t);
                float eps = 0.8;
                float3 px = ApplyLakeWaves(pos+float3(eps,0,0), t);
                float3 pz = ApplyLakeWaves(pos+float3(0,0,eps), t);
                OUT.normalWS = normalize(cross(normalize(pz-displaced), normalize(px-displaced)));
                OUT.positionWS = displaced;
                OUT.positionCS = TransformWorldToHClip(displaced);
                OUT.uv = IN.uv;
                OUT.fogFactor = ComputeFogFactor(OUT.positionCS.z);
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                float3 N = normalize(IN.normalWS);
                float3 V = normalize(GetWorldSpaceViewDir(IN.positionWS));
                Light mainLight = GetMainLight();
                float3 L = mainLight.direction;
                float3 H = normalize(L + V);
                float t = _GlobalTime;

                float cosTheta = max(dot(N, V), 0.0);
                float fresnel = 0.02 + 0.98 * pow(1.0-cosTheta, 5.0);

                // Edge/depth from UV
                float2 uvc = IN.uv - 0.5;
                float edgeDist = length(uvc) * 2.0;
                float depthFactor = saturate(1.0 - edgeDist);
                float edgeFade = smoothstep(0.85, 0.95, edgeDist);

                // Multi-layer water color with depth
                float3 shallowColor = _Color.rgb * 1.2;
                float3 midColor = lerp(_Color.rgb, _DeepColor.rgb, 0.5);
                float3 deepColor = _DeepColor.rgb;
                float3 waterColor = lerp(shallowColor, midColor, smoothstep(0.0, 0.4, depthFactor));
                waterColor = lerp(waterColor, deepColor, smoothstep(0.4, 0.8, depthFactor));

                // Caustics
                float c1 = VNoise(IN.positionWS.xz*0.04 + t*0.25) * 0.12;
                float c2 = VNoise(IN.positionWS.xz*0.09 + t*0.4 + float2(5,2)) * 0.08;
                float c3 = VNoise(IN.positionWS.xz*0.18 + t*0.6 + float2(10,7)) * 0.04;
                float caustics = (c1 + c2 + c3) * depthFactor;
                waterColor += float3(0.4, 0.6, 0.8) * caustics;

                // Foam ring at edges
                float foamZone = smoothstep(0.82, 0.92, edgeDist) * (1.0 - smoothstep(0.92, 1.0, edgeDist));
                float foamNoise = FBM3(IN.positionWS.xz * 0.15 + t * 0.3);
                float foam = foamZone * smoothstep(0.35, 0.55, foamNoise);
                waterColor = lerp(waterColor, float3(0.85, 0.90, 0.95), foam * 0.7);

                // Sky reflection
                float3 R = reflect(-V, N);
                float skyGrad = max(R.y, 0.0);
                float3 reflColor = lerp(_SkyColor.rgb*0.7, _SkyColor.rgb, skyGrad);

                // Sun specular (dual lobe)
                float NdH = max(dot(N,H), 0.0);
                float spec = pow(NdH, 512.0)*2.5 + pow(NdH, 96.0)*0.6 + pow(NdH, 24.0)*0.15;
                reflColor += float3(1.0, 0.95, 0.85) * spec;

                // Golden sun path reflection
                float sunRefl = pow(max(dot(R, L), 0.0), 128.0) * 0.6;
                reflColor += float3(1.0, 0.9, 0.7) * sunRefl;

                float3 color = lerp(waterColor, reflColor, fresnel);

                // Subsurface scattering
                float sss = pow(max(dot(V, -L), 0.0), 3.0) * 0.15;
                color += float3(0.0, 0.14, 0.10) * sss;

                // Ambient light
                color += _SkyColor.rgb * 0.06;

                // Micro wave sparkle close up
                float sparkle = pow(VNoise(IN.positionWS.xz * 0.8 + t * 2.0), 8.0) * 0.3;
                color += float3(1,1,1) * sparkle * max(dot(N,L), 0.0);

                // Opacity with edge fade and depth
                float alpha = _Opacity * smoothstep(0.0, 0.12, depthFactor);
                alpha = lerp(alpha, _Opacity * 0.92, depthFactor); // deeper = more opaque
                alpha = lerp(alpha, min(alpha, 0.4), edgeFade); // fade at very edge

                color = MixFog(color, IN.fogFactor);
                return half4(color, alpha);
            }
            ENDHLSL
        }
    }
    FallBack Off
}
