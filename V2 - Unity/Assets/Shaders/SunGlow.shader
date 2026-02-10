// ================================================================
//  SUN GLOW SHADER — Radial god-rays, chromatic rim, pulsing
//  Enhanced from V2-React AtmosphereSystem.js glow
// ================================================================
Shader "GeologySim/SunGlow"
{
    Properties
    {
        _GlowColor ("Glow Color", Color) = (1.0, 0.95, 0.8, 1)
        _MaxAlpha  ("Max Alpha", Range(0,1)) = 0.7
    }

    SubShader
    {
        Tags { "RenderType"="Transparent" "RenderPipeline"="UniversalPipeline" "Queue"="Transparent-1" }
        Cull Front
        ZWrite Off
        Blend SrcAlpha One

        Pass
        {
            Name "GlowPass"
            Tags { "LightMode"="UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            float4 _GlowColor;
            float  _MaxAlpha;
            float  _GlobalTime;

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS   : NORMAL;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float3 normalWS   : TEXCOORD0;
                float3 positionWS : TEXCOORD1;
                float3 objectPos  : TEXCOORD2;
            };

            float Hash(float2 p) { return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                OUT.positionCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.positionWS = TransformObjectToWorld(IN.positionOS.xyz);
                OUT.normalWS = TransformObjectToWorldNormal(IN.normalOS);
                OUT.objectPos = IN.positionOS.xyz;
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                float3 V = normalize(GetCameraPositionWS() - IN.positionWS);
                float3 N = normalize(IN.normalWS);
                float NdotV = max(dot(V, N), 0.0);
                float rim = 1.0 - NdotV;

                // ─── Core glow (inverse rim = bright at center) ─────
                float coreBright = pow(NdotV, 4.0) * 0.8;
                float coreWide   = pow(NdotV, 1.5) * 0.3;

                // ─── Outer rim glow ─────────────────────────────────
                float rimGlow = pow(rim, 1.8) * 0.45;

                // ─── Chromatic aberration (different falloff per channel) ──
                float3 chromatic;
                chromatic.r = pow(NdotV, 2.5); // red falls off slower
                chromatic.g = pow(NdotV, 3.5); // green mid
                chromatic.b = pow(NdotV, 5.0); // blue falls off fastest → warm edge
                chromatic *= 0.5;

                // ─── Radial rays ────────────────────────────────────
                float3 objN = normalize(IN.objectPos);
                float rayAngle = atan2(objN.z, objN.x);
                float rayCount = 12.0;
                float ray1 = pow(abs(sin(rayAngle * rayCount)), 8.0);
                float ray2 = pow(abs(sin(rayAngle * rayCount * 2.0 + 1.7)), 12.0);
                float rays = (ray1 * 0.3 + ray2 * 0.15);
                // Mask rays to mid-radius ring
                float ringMask = smoothstep(0.15, 0.45, rim) * smoothstep(0.90, 0.55, rim);
                rays *= ringMask;

                // ─── Pulsing animation ──────────────────────────────
                float pulse = 1.0 + 0.06 * sin(_GlobalTime * 1.5) + 0.03 * sin(_GlobalTime * 3.7);

                // ─── Combine ────────────────────────────────────────
                float3 color = _GlowColor.rgb * (coreBright + coreWide) * pulse;
                color += _GlowColor.rgb * rimGlow;
                color += chromatic;
                color += _GlowColor.rgb * rays;

                float alpha = saturate(coreBright + coreWide + rimGlow * 0.7 + rays * 0.5) * _MaxAlpha * pulse;

                // Soft edge fade
                alpha *= smoothstep(1.0, 0.75, rim);

                return half4(color, alpha);
            }
            ENDHLSL
        }
    }
    FallBack Off
}
