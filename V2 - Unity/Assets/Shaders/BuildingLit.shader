// ================================================================
//  BUILDING LIT SHADER — URP PBR with triplanar texturing,
//  normal mapping, and weathering effects for farm buildings,
//  fences, stone walls, and tree bark. Opaque, shadow-casting.
// ================================================================
Shader "GeologySim/BuildingLit"
{
    Properties
    {
        _WallTex    ("Wall Texture", 2D) = "white" {}
        _NormalTex  ("Normal Map", 2D) = "bump" {}
        _Color      ("Color Tint", Color) = (1,1,1,1)
        _Roughness  ("Roughness", Range(0,1)) = 0.72
        _TexScale   ("Triplanar Scale", Float) = 0.1
        _NormStr    ("Normal Strength", Float) = 0.8
        _WeatherAmt ("Weathering", Range(0,1)) = 0.25
    }

    SubShader
    {
        Tags { "RenderType"="Opaque" "RenderPipeline"="UniversalPipeline" "Queue"="Geometry" }

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode"="UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile _ _MAIN_LIGHT_SHADOWS _MAIN_LIGHT_SHADOWS_CASCADE _MAIN_LIGHT_SHADOWS_SCREEN
            #pragma multi_compile _ _ADDITIONAL_LIGHTS
            #pragma multi_compile _ _SHADOWS_SOFT
            #pragma multi_compile_fog

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            CBUFFER_START(UnityPerMaterial)
                float4 _WallTex_ST;
                float4 _NormalTex_ST;
                float4 _Color;
                float  _Roughness;
                float  _TexScale;
                float  _NormStr;
                float  _WeatherAmt;
            CBUFFER_END

            TEXTURE2D(_WallTex);   SAMPLER(sampler_WallTex);
            TEXTURE2D(_NormalTex); SAMPLER(sampler_NormalTex);

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS   : NORMAL;
                float4 color      : COLOR;
            };

            struct Varyings
            {
                float4 positionCS  : SV_POSITION;
                float3 positionWS  : TEXCOORD0;
                float3 normalWS    : TEXCOORD1;
                float  fogFactor   : TEXCOORD2;
                float4 shadowCoord : TEXCOORD3;
                float3 tangentWS   : TEXCOORD4;
                float3 bitangentWS : TEXCOORD5;
                float4 vertColor   : COLOR;
            };

            float Hash(float2 p) { return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

            float VNoise(float2 p)
            {
                float2 i = floor(p), f = frac(p);
                f = f * f * (3.0 - 2.0 * f);
                return lerp(lerp(Hash(i), Hash(i + float2(1,0)), f.x),
                            lerp(Hash(i + float2(0,1)), Hash(i + float2(1,1)), f.x), f.y);
            }

            // Triplanar texture sampling
            float3 SampleTriplanar(TEXTURE2D_PARAM(tex, samp), float3 wp, float3 N, float scale)
            {
                float3 blend = pow(abs(N), 4);
                blend /= (blend.x + blend.y + blend.z + 0.0001);
                float3 xp = SAMPLE_TEXTURE2D(tex, samp, wp.yz * scale).rgb;
                float3 yp = SAMPLE_TEXTURE2D(tex, samp, wp.xz * scale).rgb;
                float3 zp = SAMPLE_TEXTURE2D(tex, samp, wp.xy * scale).rgb;
                return xp * blend.x + yp * blend.y + zp * blend.z;
            }

            float3 SampleTriplanarNormal(float3 wp, float3 N, float3 T, float3 B, float scale, float str)
            {
                float3 blend = pow(abs(N), 4);
                blend /= (blend.x + blend.y + blend.z + 0.0001);
                float3 nx = SAMPLE_TEXTURE2D(_NormalTex, sampler_NormalTex, wp.yz * scale).rgb * 2.0 - 1.0;
                float3 ny = SAMPLE_TEXTURE2D(_NormalTex, sampler_NormalTex, wp.xz * scale).rgb * 2.0 - 1.0;
                float3 nz = SAMPLE_TEXTURE2D(_NormalTex, sampler_NormalTex, wp.xy * scale).rgb * 2.0 - 1.0;
                float3 blended = nx * blend.x + ny * blend.y + nz * blend.z;
                blended.xy *= str;
                return normalize(T * blended.x + B * blended.y + N * blended.z);
            }

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                VertexPositionInputs posInputs = GetVertexPositionInputs(IN.positionOS.xyz);
                VertexNormalInputs normInputs = GetVertexNormalInputs(IN.normalOS);
                OUT.positionCS = posInputs.positionCS;
                OUT.positionWS = posInputs.positionWS;
                OUT.normalWS = normInputs.normalWS;
                OUT.fogFactor = ComputeFogFactor(posInputs.positionCS.z);
                OUT.vertColor = IN.color;

                // Build tangent frame
                float3 nrm = normInputs.normalWS;
                float3 upV = abs(nrm.y) < 0.999 ? float3(0,1,0) : float3(1,0,0);
                OUT.tangentWS = normalize(cross(upV, nrm));
                OUT.bitangentWS = cross(nrm, OUT.tangentWS);

                #if defined(_MAIN_LIGHT_SHADOWS_SCREEN) && !defined(_SURFACE_TYPE_TRANSPARENT)
                    OUT.shadowCoord = ComputeScreenPos(posInputs.positionCS);
                #else
                    OUT.shadowCoord = TransformWorldToShadowCoord(posInputs.positionWS);
                #endif
                return OUT;
            }

            // Simplified GGX
            float GGX(float NdH, float r) { float a = r*r; float a2 = a*a; float d = NdH*NdH*(a2-1.0)+1.0; return a2/(PI*d*d+0.0001); }
            float SmithG(float NdV, float NdL, float r) { float k = (r+1.0)*(r+1.0)/8.0; return (NdV/(NdV*(1.0-k)+k))*(NdL/(NdL*(1.0-k)+k)); }
            float3 SchlickF(float VdH, float3 F0) { return F0 + (1.0-F0)*pow(saturate(1.0-VdH),5.0); }

            half4 frag(Varyings IN) : SV_Target
            {
                float3 N = normalize(IN.normalWS);
                float3 T = normalize(IN.tangentWS);
                float3 B = normalize(IN.bitangentWS);
                float3 V = normalize(GetWorldSpaceViewDir(IN.positionWS));

                Light mainLight = GetMainLight(IN.shadowCoord);
                float3 L = mainLight.direction;
                float3 H = normalize(L + V);

                // ── Triplanar texture sampling ──
                float3 texCol = SampleTriplanar(TEXTURE2D_ARGS(_WallTex, sampler_WallTex),
                    IN.positionWS, N, _TexScale) * _Color.rgb;

                // Normal mapping (triplanar)
                N = SampleTriplanarNormal(IN.positionWS, N, T, B, _TexScale, _NormStr);

                // ── Weathering ──
                // Darken near ground, add vertical streaks
                float groundProx = saturate(1.0 - (IN.positionWS.y - 38.0) / 12.0);// near water level
                float streak = VNoise(IN.positionWS.xz * 0.15) * 0.15;
                float rain = VNoise(float2(IN.positionWS.x * 2.0, IN.positionWS.y * 8.0)) * 0.08;
                float weather = (groundProx * 0.3 + streak + rain) * _WeatherAmt;
                texCol *= (1.0 - weather);

                // Moss on north-facing + low surfaces
                float northFace = max(dot(normalize(IN.normalWS), float3(0, 0.3, -0.95)), 0.0);
                float mossMask = northFace * groundProx * _WeatherAmt * 2.0;
                float3 mossColor = float3(0.15, 0.28, 0.10);
                texCol = lerp(texCol, mossColor, saturate(mossMask));

                // ── PBR Lighting ──
                float NdL = max(dot(N, L), 0.0);
                float NdV = max(dot(N, V), 0.001);
                float NdH = max(dot(N, H), 0.0);
                float VdH = max(dot(H, V), 0.0);

                float rough = _Roughness + weather * 0.15;
                rough = clamp(rough, 0.04, 1.0);

                float3 F0 = float3(0.04, 0.04, 0.04);
                float D = GGX(NdH, rough);
                float G = SmithG(NdV, NdL, rough);
                float3 F = SchlickF(VdH, F0);
                float3 spec = (D * G * F) / (4.0 * NdV * NdL + 0.001);

                float sha = lerp(0.35, 1.0, mainLight.shadowAttenuation * mainLight.distanceAttenuation);
                float3 Lo = (texCol / PI + spec) * mainLight.color.rgb * NdL * sha;

                // Ambient
                float hemi = max(dot(N, float3(0,1,0)), 0.0) * 0.5 + 0.5;
                float3 ambient = lerp(float3(0.28,0.24,0.20), float3(0.42,0.48,0.62), hemi) * texCol * 1.1;

                // AO from normal direction (cavity approximation)
                float ao = lerp(0.60, 1.0, max(dot(normalize(IN.normalWS), float3(0,1,0)), 0.0));

                // Fresnel rim (environment reflection approximation)
                float fresnel = pow(1.0 - NdV, 4.0) * 0.18;
                float3 skyRef = float3(0.42, 0.52, 0.68);
                float3 fresnelContrib = fresnel * skyRef * (1.0 - rough * 0.6);

                #ifdef _ADDITIONAL_LIGHTS
                uint alc = GetAdditionalLightsCount();
                for (uint li = 0u; li < alc; li++) {
                    Light al = GetAdditionalLight(li, IN.positionWS);
                    Lo += texCol / PI * al.color.rgb * max(dot(N,al.direction),0.0) * al.distanceAttenuation * al.shadowAttenuation;
                }
                #endif

                float3 col = (ambient + Lo + fresnelContrib) * ao;
                col = MixFog(col, IN.fogFactor);
                return half4(col, 1);
            }
            ENDHLSL
        }

        // ── Shadow Caster ──
        Pass
        {
            Name "ShadowCaster"
            Tags { "LightMode"="ShadowCaster" }
            ZWrite On
            ZTest LEqual
            ColorMask 0

            HLSLPROGRAM
            #pragma vertex ShadowVert
            #pragma fragment ShadowFrag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            struct SA { float4 positionOS : POSITION; float3 normalOS : NORMAL; };
            struct SV { float4 positionCS : SV_POSITION; };

            SV ShadowVert(SA IN)
            {
                SV OUT;
                float3 pw = TransformObjectToWorld(IN.positionOS.xyz);
                pw += TransformObjectToWorldNormal(IN.normalOS) * 0.02;
                OUT.positionCS = TransformWorldToHClip(pw);
                #if UNITY_REVERSED_Z
                    OUT.positionCS.z = min(OUT.positionCS.z, UNITY_NEAR_CLIP_VALUE);
                #else
                    OUT.positionCS.z = max(OUT.positionCS.z, UNITY_NEAR_CLIP_VALUE);
                #endif
                return OUT;
            }

            half4 ShadowFrag(SV IN) : SV_Target { return 0; }
            ENDHLSL
        }

        // ── Depth Only ──
        Pass
        {
            Name "DepthOnly"
            Tags { "LightMode"="DepthOnly" }
            ZWrite On
            ColorMask R

            HLSLPROGRAM
            #pragma vertex DV
            #pragma fragment DF
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            struct DA { float4 positionOS : POSITION; };
            struct DV2 { float4 positionCS : SV_POSITION; };
            DV2 DV(DA IN) { DV2 OUT; OUT.positionCS = TransformObjectToHClip(IN.positionOS.xyz); return OUT; }
            half4 DF(DV2 IN) : SV_Target { return 0; }
            ENDHLSL
        }
    }

    FallBack "Universal Render Pipeline/Lit"
}
