// ================================================================
//  VEGETATION LIT SHADER — URP alpha-cutout vegetation
//  Wind animation, subsurface scattering, two-sided rendering.
//  Dramatically improves trees, grass, bushes, flowers.
// ================================================================
Shader "GeologySim/VegetationLit"
{
    Properties
    {
        _MainTex    ("Albedo (RGBA)", 2D) = "white" {}
        _Color      ("Tint", Color) = (1,1,1,1)
        _Cutoff     ("Alpha Cutoff", Range(0,1)) = 0.35
        _WindStr    ("Wind Strength", Float) = 0.12
        _SSSColor   ("Subsurface Color", Color) = (0.35, 0.65, 0.15, 1)
        _SSSPow     ("SSS Power", Float) = 3.0
        _Roughness  ("Roughness", Range(0,1)) = 0.82
    }

    SubShader
    {
        Tags { "RenderType"="TransparentCutout" "RenderPipeline"="UniversalPipeline" "Queue"="AlphaTest" }
        Cull Off

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
                float4 _MainTex_ST;
                float4 _Color;
                float  _Cutoff;
                float  _WindStr;
                float4 _SSSColor;
                float  _SSSPow;
                float  _Roughness;
            CBUFFER_END

            TEXTURE2D(_MainTex); SAMPLER(sampler_MainTex);
            float _GlobalTime;

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS   : NORMAL;
                float2 uv         : TEXCOORD0;
                float4 color      : COLOR;
            };

            struct Varyings
            {
                float4 positionCS  : SV_POSITION;
                float2 uv          : TEXCOORD0;
                float3 normalWS    : TEXCOORD1;
                float3 positionWS  : TEXCOORD2;
                float  fogFactor   : TEXCOORD3;
                float4 shadowCoord : TEXCOORD4;
                float4 vertColor   : COLOR;
            };

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                float3 posOS = IN.positionOS.xyz;
                float3 posWS = TransformObjectToWorld(posOS);

                // Wind: vertex height drives sway amount
                float heightFactor = saturate(posOS.y);
                float t = _GlobalTime;

                // Primary wind wave
                float windX = sin(t * 1.8 + posWS.x * 0.4 + posWS.z * 0.3) * _WindStr * heightFactor;
                float windZ = cos(t * 2.3 + posWS.x * 0.35 + posWS.z * 0.5) * _WindStr * heightFactor * 0.7;
                // Secondary gust
                windX += sin(t * 4.1 + posWS.x * 0.8 + posWS.z * 0.2) * _WindStr * 0.25 * heightFactor;
                windZ += cos(t * 3.5 + posWS.z * 0.9) * _WindStr * 0.15 * heightFactor;

                posOS.x += windX;
                posOS.z += windZ;

                VertexPositionInputs posInputs = GetVertexPositionInputs(posOS);
                VertexNormalInputs normInputs = GetVertexNormalInputs(IN.normalOS);

                OUT.positionCS = posInputs.positionCS;
                OUT.positionWS = posInputs.positionWS;
                OUT.normalWS = normInputs.normalWS;
                OUT.uv = TRANSFORM_TEX(IN.uv, _MainTex);
                OUT.fogFactor = ComputeFogFactor(posInputs.positionCS.z);
                OUT.vertColor = IN.color;

                #if defined(_MAIN_LIGHT_SHADOWS_SCREEN) && !defined(_SURFACE_TYPE_TRANSPARENT)
                    OUT.shadowCoord = ComputeScreenPos(posInputs.positionCS);
                #else
                    OUT.shadowCoord = TransformWorldToShadowCoord(posInputs.positionWS);
                #endif

                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                float4 tex = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, IN.uv);
                float4 col = tex * _Color * IN.vertColor;

                // Alpha cutoff
                clip(col.a - _Cutoff);

                float3 N = normalize(IN.normalWS);
                // For two-sided: flip normal if backface
                float3 V = normalize(GetWorldSpaceViewDir(IN.positionWS));
                N = N * sign(dot(N, V) + 0.001);

                Light mainLight = GetMainLight(IN.shadowCoord);
                float3 L = mainLight.direction;
                float NdL = dot(N, L);
                float shadow = lerp(0.35, 1.0, mainLight.shadowAttenuation * mainLight.distanceAttenuation);

                // Half-Lambert wrap lighting (softer, natural for vegetation)
                float diff = saturate(NdL * 0.5 + 0.5);
                diff = diff * diff; // Soften further
                float3 diffuse = col.rgb * mainLight.color.rgb * diff * shadow;

                // Subsurface scattering (back-lit leaves glow)
                float VdL = max(dot(V, -L), 0.0);
                float sss = pow(VdL, _SSSPow) * saturate(-NdL + 0.3) * tex.a;
                float3 sssContrib = _SSSColor.rgb * col.rgb * sss * shadow * 2.0;

                // Specular highlight (leaf gloss / wet sheen)
                float3 Hspec = normalize(L + V);
                float NdH = max(dot(N, Hspec), 0.0);
                float specPow = lerp(16.0, 128.0, 1.0 - _Roughness);
                float spec = pow(NdH, specPow) * max(NdL, 0.0) * (1.0 - _Roughness * 0.7);
                float3 specContrib = mainLight.color.rgb * spec * shadow * 0.25;

                // Ambient hemisphere
                float hemi = max(dot(N, float3(0,1,0)), 0.0) * 0.5 + 0.5;
                float3 skyAmb = float3(0.42, 0.50, 0.65);
                float3 gndAmb = float3(0.25, 0.22, 0.18);
                float3 ambient = lerp(gndAmb, skyAmb, hemi) * col.rgb * 1.15;

                // Rim light (silhouette brightening)
                float rim = pow(1.0 - saturate(dot(N, V)), 3.0) * 0.12;
                float3 rimColor = float3(0.5, 0.6, 0.4) * rim;

                // Additional lights
                float3 addLight = float3(0,0,0);
                #ifdef _ADDITIONAL_LIGHTS
                uint alc = GetAdditionalLightsCount();
                for (uint li = 0u; li < alc; li++) {
                    Light al = GetAdditionalLight(li, IN.positionWS);
                    float alNdL = saturate(dot(N, al.direction) * 0.5 + 0.5);
                    addLight += col.rgb * al.color.rgb * alNdL * al.distanceAttenuation * al.shadowAttenuation;
                }
                #endif

                float3 finalColor = diffuse + sssContrib + specContrib + ambient + rimColor + addLight;
                finalColor = MixFog(finalColor, IN.fogFactor);
                return half4(finalColor, 1.0);
            }
            ENDHLSL
        }

        // ── Shadow Caster (with alpha test + wind) ──
        Pass
        {
            Name "ShadowCaster"
            Tags { "LightMode"="ShadowCaster" }
            ZWrite On
            ZTest LEqual
            ColorMask 0
            Cull Off

            HLSLPROGRAM
            #pragma vertex ShadowVert
            #pragma fragment ShadowFrag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            CBUFFER_START(UnityPerMaterial)
                float4 _MainTex_ST;
                float4 _Color;
                float  _Cutoff;
                float  _WindStr;
                float4 _SSSColor;
                float  _SSSPow;
                float  _Roughness;
            CBUFFER_END

            TEXTURE2D(_MainTex); SAMPLER(sampler_MainTex);
            float _GlobalTime;

            struct SA { float4 positionOS : POSITION; float3 normalOS : NORMAL; float2 uv : TEXCOORD0; };
            struct SV { float4 positionCS : SV_POSITION; float2 uv : TEXCOORD0; };

            SV ShadowVert(SA IN)
            {
                SV OUT;
                float3 posOS = IN.positionOS.xyz;
                float3 posWS = TransformObjectToWorld(posOS);
                float hf = saturate(posOS.y);
                float t = _GlobalTime;
                posOS.x += sin(t * 1.8 + posWS.x * 0.4 + posWS.z * 0.3) * _WindStr * hf;
                posOS.z += cos(t * 2.3 + posWS.x * 0.35 + posWS.z * 0.5) * _WindStr * hf * 0.7;

                posWS = TransformObjectToWorld(posOS);
                posWS += TransformObjectToWorldNormal(IN.normalOS) * 0.01;
                OUT.positionCS = TransformWorldToHClip(posWS);
                #if UNITY_REVERSED_Z
                    OUT.positionCS.z = min(OUT.positionCS.z, UNITY_NEAR_CLIP_VALUE);
                #else
                    OUT.positionCS.z = max(OUT.positionCS.z, UNITY_NEAR_CLIP_VALUE);
                #endif
                OUT.uv = IN.uv * _MainTex_ST.xy + _MainTex_ST.zw;
                return OUT;
            }

            half4 ShadowFrag(SV IN) : SV_Target
            {
                float a = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, IN.uv).a * _Color.a;
                clip(a - _Cutoff);
                return 0;
            }
            ENDHLSL
        }

        // ── Depth Only (with alpha test) ──
        Pass
        {
            Name "DepthOnly"
            Tags { "LightMode"="DepthOnly" }
            ZWrite On
            ColorMask R
            Cull Off

            HLSLPROGRAM
            #pragma vertex DepthVert
            #pragma fragment DepthFrag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            CBUFFER_START(UnityPerMaterial)
                float4 _MainTex_ST;
                float4 _Color;
                float  _Cutoff;
                float  _WindStr;
                float4 _SSSColor;
                float  _SSSPow;
                float  _Roughness;
            CBUFFER_END

            TEXTURE2D(_MainTex); SAMPLER(sampler_MainTex);

            struct DA { float4 positionOS : POSITION; float2 uv : TEXCOORD0; };
            struct DV2 { float4 positionCS : SV_POSITION; float2 uv : TEXCOORD0; };

            DV2 DepthVert(DA IN)
            {
                DV2 OUT;
                OUT.positionCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.uv = IN.uv * _MainTex_ST.xy + _MainTex_ST.zw;
                return OUT;
            }

            half4 DepthFrag(DV2 IN) : SV_Target
            {
                float a = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, IN.uv).a * _Color.a;
                clip(a - _Cutoff);
                return 0;
            }
            ENDHLSL
        }
    }

    FallBack "Universal Render Pipeline/Lit"
}
