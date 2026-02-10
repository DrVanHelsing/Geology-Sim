// ================================================================
//  OCEAN WATER SHADER — URP Enhanced Gerstner + Foam + Caustics
//  8 Gerstner waves, crest foam, depth gradient, dual specular,
//  subsurface scatter, horizon blend, micro-ripple detail
// ================================================================
Shader "GeologySim/OceanWater"
{
    Properties
    {
        _SkyColor     ("Sky Color", Color) = (0.55, 0.72, 0.88, 1)
        _DeepColor    ("Deep Color", Color) = (0.03, 0.10, 0.28, 1)
        _ShallowColor ("Shallow Color", Color) = (0.10, 0.38, 0.52, 1)
        _FoamColor    ("Foam Color", Color)  = (0.88, 0.92, 0.96, 1)
        _Opacity      ("Opacity", Range(0,1)) = 0.85
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
                float4 _SkyColor;
                float4 _DeepColor;
                float4 _ShallowColor;
                float4 _FoamColor;
                float  _Opacity;
            CBUFFER_END

            float _GlobalTime;

            struct Attributes { float4 positionOS : POSITION; float2 uv : TEXCOORD0; };
            struct Varyings
            {
                float4 positionCS  : SV_POSITION;
                float3 positionWS  : TEXCOORD0;
                float3 normalWS    : TEXCOORD1;
                float  fogFactor   : TEXCOORD2;
                float  waveHeight  : TEXCOORD3;
            };

            float Hash(float2 p) { return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
            float VNoise(float2 p)
            {
                float2 i = floor(p), f = frac(p);
                f = f*f*(3.0-2.0*f);
                return lerp(lerp(Hash(i),Hash(i+float2(1,0)),f.x),
                            lerp(Hash(i+float2(0,1)),Hash(i+float2(1,1)),f.x),f.y);
            }
            float FBM4(float2 p)
            {
                float v=0,a=0.5;
                for(int i=0;i<4;i++){v+=a*VNoise(p);p=p*2.03+float2(1.7,1.3);a*=0.5;}
                return v;
            }

            float3 Gerstner(float3 p, float t, float2 dir, float freq, float amp, float steep)
            {
                float phase = dot(dir, p.xz)*freq+t;
                return float3(steep*amp*dir.x*cos(phase), amp*sin(phase), steep*amp*dir.y*cos(phase));
            }

            struct WaveResult { float3 pos; float crestFactor; };

            WaveResult ApplyWaves(float3 pos, float t, float distAtten)
            {
                WaveResult r;
                float3 d = pos;
                float maxY = 0;

                // Primary swell
                d += Gerstner(pos, t*0.8,  normalize(float2(1.0,0.3)),  0.015, 0.60*distAtten, 0.65);
                d += Gerstner(pos, t*0.6,  normalize(float2(-0.3,1.0)), 0.022, 0.45*distAtten, 0.55);
                // Secondary waves
                d += Gerstner(pos, t*1.1,  normalize(float2(0.7,0.7)),  0.035, 0.25*distAtten, 0.45);
                d += Gerstner(pos, t*0.9,  normalize(float2(-0.5,-0.8)),0.045, 0.15*distAtten, 0.38);
                // Chop
                d += Gerstner(pos, t*1.3,  normalize(float2(0.4,-0.6)), 0.065, 0.09*distAtten, 0.32);
                d += Gerstner(pos, t*1.5,  normalize(float2(-0.8,0.2)), 0.09,  0.05*distAtten, 0.28);
                // High-frequency detail
                d += Gerstner(pos, t*2.0,  normalize(float2(0.6,-0.4)), 0.14,  0.025*distAtten, 0.20);
                d += Gerstner(pos, t*2.5,  normalize(float2(-0.2,0.8)), 0.20,  0.012*distAtten, 0.15);

                r.pos = d;
                r.crestFactor = saturate((d.y - pos.y) / (1.2 * distAtten + 0.01));
                return r;
            }

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                float3 pos = TransformObjectToWorld(IN.positionOS.xyz);
                float t = _GlobalTime;
                float3 cam = GetCameraPositionWS();
                float camDist = distance(pos.xz, cam.xz);
                float distAtten = saturate(1.0 - camDist/8000.0);
                distAtten *= distAtten;

                WaveResult w = ApplyWaves(pos, t, distAtten);
                float eps = 2.0;
                WaveResult wx = ApplyWaves(pos+float3(eps,0,0), t, distAtten);
                WaveResult wz = ApplyWaves(pos+float3(0,0,eps), t, distAtten);
                OUT.normalWS = normalize(cross(normalize(wz.pos-w.pos), normalize(wx.pos-w.pos)));
                OUT.positionWS = w.pos;
                OUT.positionCS = TransformWorldToHClip(w.pos);
                OUT.fogFactor = ComputeFogFactor(OUT.positionCS.z);
                OUT.waveHeight = w.crestFactor;
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                float3 N = normalize(IN.normalWS);
                float3 V = normalize(GetWorldSpaceViewDir(IN.positionWS));
                Light mainLight = GetMainLight();
                float3 L = mainLight.direction;
                float3 H = normalize(L+V);
                float t = _GlobalTime;

                float cosTheta = max(dot(N,V), 0.0);
                float fresnel = 0.02 + 0.98 * pow(1.0-cosTheta, 5.0);

                // Depth-based water body
                float depthFactor = smoothstep(0.0, 1.0, cosTheta);
                float3 waterBody = lerp(_DeepColor.rgb, _ShallowColor.rgb, depthFactor * 0.5);

                // Subsurface scattering — translucent green
                float sss = pow(max(dot(V,-L),0.0), 4.0) * 0.22;
                waterBody += float3(0.0, 0.18, 0.12) * sss;

                // Multi-octave caustics
                float c1 = VNoise(IN.positionWS.xz*0.03 + t*0.3) * 0.09;
                float c2 = VNoise(IN.positionWS.xz*0.08 + t*0.45 + float2(5.3,2.1)) * 0.06;
                float c3 = VNoise(IN.positionWS.xz*0.18 + t*0.7 + float2(11,4)) * 0.03;
                waterBody += float3(0.4, 0.7, 1.0) * (c1+c2+c3);

                // Sun diffuse + scattered light
                float diff = max(dot(N,L), 0.0);
                waterBody += waterBody * diff * 0.15;

                // Foam on wave crests
                float crest = IN.waveHeight;
                float foamNoise = FBM4(IN.positionWS.xz * 0.06 + t * 0.12);
                float foamMask = smoothstep(0.45, 0.7, crest) * smoothstep(0.3, 0.5, foamNoise);
                // Streaky foam texture
                float streak = VNoise(IN.positionWS.xz * float2(0.02, 0.12) + t * 0.2);
                foamMask += smoothstep(0.6, 0.8, crest) * smoothstep(0.55, 0.7, streak) * 0.4;
                waterBody = lerp(waterBody, _FoamColor.rgb, saturate(foamMask) * 0.65);

                // Sky reflection
                float3 R = reflect(-V, N);
                float skyBlend = max(R.y, 0.0);
                float3 reflColor = lerp(_SkyColor.rgb*0.75, _SkyColor.rgb*1.3, skyBlend);

                // Dual sun specular (sharp + broad)
                float NdH = max(dot(N,H), 0.0);
                float specSharp = pow(NdH, 1024.0) * 6.0;
                float specBroad = pow(NdH, 128.0) * 1.2;
                float specSoft  = pow(NdH, 32.0) * 0.2;
                reflColor += float3(1.0, 0.97, 0.88) * (specSharp + specBroad + specSoft);

                // Sun path on water (golden glitter)
                float sunPath = pow(max(dot(R, L), 0.0), 64.0) * 0.4;
                reflColor += float3(1.0, 0.92, 0.7) * sunPath;

                // Micro sparkle on close-up
                float sparkle = pow(VNoise(IN.positionWS.xz * 0.5 + t * 1.5), 10.0) * 0.25;
                reflColor += float3(1,1,1) * sparkle * diff;

                float3 color = lerp(waterBody, reflColor, fresnel);

                // Horizon blend
                float3 cam = GetCameraPositionWS();
                float horizDist = distance(IN.positionWS.xz, cam.xz);
                float horizFade = saturate(horizDist / 6000.0);
                horizFade = horizFade*horizFade*horizFade;
                float3 horizonColor = lerp(_SkyColor.rgb*0.88, _SkyColor.rgb*1.1, 0.5);
                color = lerp(color, horizonColor, horizFade*0.75);

                // Ambient
                color += _SkyColor.rgb * 0.04;

                color = MixFog(color, IN.fogFactor);
                return half4(color, _Opacity);
            }
            ENDHLSL
        }
    }
    FallBack Off
}
