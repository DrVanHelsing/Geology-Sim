// ================================================================
//  TERRAIN PBR SHADER — URP Cook-Torrance BRDF (v2 – texture-enhanced)
//  Hyper-realistic vertex-color terrain with baked noise textures,
//  triplanar sampling, normal-map perturbation, Cook-Torrance BRDF,
//  distance-LOD, wetness, snow, cavity AO, atmospheric scattering.
// ================================================================
Shader "GeologySim/TerrainPBR"
{
    Properties
    {
        _Roughness   ("Base Roughness", Range(0,1)) = 0.72
        _AmbientBoost("Ambient Boost", Float) = 1.15
        _DetailScale ("Detail Noise Scale", Float) = 0.04
        _DetailStr   ("Detail Noise Strength", Range(0,0.5)) = 0.14
        _SnowLine    ("Snow Line Elevation", Float) = 200
        _WaterLevel  ("Water Level", Float) = 38

        // Runtime-generated textures (set by TextureGenerator.cs)
        _NoiseTex    ("FBM Noise",  2D) = "gray" {}
        _WorleyTex   ("Worley Noise", 2D) = "white" {}
        _GrassTex    ("Grass Detail", 2D) = "gray" {}
        _NormalTex   ("Normal Map",   2D) = "bump" {}
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
                float _Roughness;
                float _AmbientBoost;
                float _DetailScale;
                float _DetailStr;
                float _SnowLine;
                float _WaterLevel;
            CBUFFER_END

            TEXTURE2D(_NoiseTex);   SAMPLER(sampler_NoiseTex);
            TEXTURE2D(_WorleyTex);  SAMPLER(sampler_WorleyTex);
            TEXTURE2D(_GrassTex);   SAMPLER(sampler_GrassTex);
            TEXTURE2D(_NormalTex);  SAMPLER(sampler_NormalTex);

            float _GlobalTime;

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS   : NORMAL;
                float4 color      : COLOR;
                float2 uv2        : TEXCOORD1;
            };

            struct Varyings
            {
                float4 positionCS  : SV_POSITION;
                float3 positionWS  : TEXCOORD0;
                float3 normalWS    : TEXCOORD1;
                float4 vertColor   : COLOR;
                float  fogFactor   : TEXCOORD2;
                float4 shadowCoord : TEXCOORD3;
                float  camDist     : TEXCOORD4;
                float  layerIndex  : TEXCOORD5;
                float3 tangentWS   : TEXCOORD6;
                float3 bitangentWS : TEXCOORD7;
            };

            float Hash(float2 p) { return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

            float ValueNoise(float2 p)
            {
                float2 i = floor(p), f = frac(p);
                f = f * f * (3.0 - 2.0 * f);
                return lerp(
                    lerp(Hash(i), Hash(i + float2(1,0)), f.x),
                    lerp(Hash(i + float2(0,1)), Hash(i + float2(1,1)), f.x), f.y);
            }

            float FBM4(float2 p)
            {
                float v = 0, a = 0.5;
                float2x2 rot = float2x2(0.8, -0.6, 0.6, 0.8);
                for (int i = 0; i < 4; i++) { v += a * ValueNoise(p); p = mul(rot, p) * 2.1; a *= 0.45; }
                return v;
            }

            // ── Texture-based triplanar sampling (replaces expensive per-pixel FBM) ──
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

            float StrataPattern(float3 wp, float3 N)
            {
                float slope = 1.0 - max(dot(N, float3(0,1,0)), 0.0);
                float cliff = smoothstep(0.3, 0.7, slope);
                float s = sin(wp.y * 1.2 + FBM4(wp.xz * 0.003) * 8.0) * 0.5 + 0.5;
                s *= sin(wp.y * 3.5 + FBM4(wp.xz * 0.008) * 4.0) * 0.3 + 0.7;
                float f = sin(wp.y * 8.0 + ValueNoise(wp.xz * 0.02) * 3.0) * 0.15 + 0.85;
                return lerp(1.0, s * f, cliff * 0.7);
            }

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                VertexPositionInputs posInputs = GetVertexPositionInputs(IN.positionOS.xyz);
                VertexNormalInputs normInputs  = GetVertexNormalInputs(IN.normalOS);
                OUT.positionCS  = posInputs.positionCS;
                OUT.positionWS  = posInputs.positionWS;
                OUT.normalWS    = normInputs.normalWS;
                OUT.vertColor   = IN.color;
                OUT.fogFactor   = ComputeFogFactor(posInputs.positionCS.z);
                OUT.camDist     = distance(GetCameraPositionWS(), posInputs.positionWS);
                OUT.layerIndex  = IN.uv2.x;

                // Build tangent frame for normal mapping
                float3 nrm = normInputs.normalWS;
                float3 upV = abs(nrm.y) < 0.999 ? float3(0,1,0) : float3(1,0,0);
                OUT.tangentWS   = normalize(cross(upV, nrm));
                OUT.bitangentWS = cross(nrm, OUT.tangentWS);

                #if defined(_MAIN_LIGHT_SHADOWS_SCREEN) && !defined(_SURFACE_TYPE_TRANSPARENT)
                    OUT.shadowCoord = ComputeScreenPos(posInputs.positionCS);
                #else
                    OUT.shadowCoord = TransformWorldToShadowCoord(posInputs.positionWS);
                #endif
                return OUT;
            }

            float TerrainGGX(float NdH, float r) { float a = r*r; float a2 = a*a; float d = NdH*NdH*(a2-1.0)+1.0; return a2/(PI*d*d+0.0001); }
            float TerrainGeom(float NdV, float NdL, float r) { float k = (r+1.0)*(r+1.0)/8.0; return (NdV/(NdV*(1.0-k)+k))*(NdL/(NdL*(1.0-k)+k)); }
            float3 TerrainFresnel(float c, float3 F0) { return F0 + (1.0-F0)*pow(saturate(1.0-c),5.0); }

            half4 frag(Varyings IN) : SV_Target
            {
                float3 N = normalize(IN.normalWS);
                float3 T = normalize(IN.tangentWS);
                float3 B = normalize(IN.bitangentWS);
                float3 V = normalize(GetWorldSpaceViewDir(IN.positionWS));
                Light mainLight = GetMainLight(IN.shadowCoord);
                float3 L = mainLight.direction;

                float elev = IN.positionWS.y;
                float cd = IN.camDist;

                // LOD factors
                float distLOD    = smoothstep(300.0, 1400.0, cd);
                float closeUp    = smoothstep(150.0, 30.0, cd);
                float ultraClose = smoothstep(60.0, 10.0, cd);
                float medRange   = smoothstep(500.0, 100.0, cd);
                float superClose = smoothstep(25.0, 5.0, cd);

                // ── Texture-based multi-scale noise sampling ──
                float3 noiseMacro  = SampleTriplanar(TEXTURE2D_ARGS(_NoiseTex, sampler_NoiseTex),  IN.positionWS, N, _DetailScale * 0.5);
                float3 noiseDetail = SampleTriplanar(TEXTURE2D_ARGS(_NoiseTex, sampler_NoiseTex),  IN.positionWS, N, _DetailScale * 2.0);
                float3 noiseMicro  = SampleTriplanar(TEXTURE2D_ARGS(_NoiseTex, sampler_NoiseTex),  IN.positionWS, N, _DetailScale * 8.0);
                float3 noiseFine   = SampleTriplanar(TEXTURE2D_ARGS(_NoiseTex, sampler_NoiseTex),  IN.positionWS, N, _DetailScale * 20.0);

                float3 worleyLarge = SampleTriplanar(TEXTURE2D_ARGS(_WorleyTex, sampler_WorleyTex), IN.positionWS, N, 0.005);
                float3 worleySmall = SampleTriplanar(TEXTURE2D_ARGS(_WorleyTex, sampler_WorleyTex), IN.positionWS, N, 0.02);
                float3 worleyMicro = SampleTriplanar(TEXTURE2D_ARGS(_WorleyTex, sampler_WorleyTex), IN.positionWS, N, 0.06);

                float3 grassSample = SampleTriplanar(TEXTURE2D_ARGS(_GrassTex, sampler_GrassTex), IN.positionWS, N, 0.08);
                float3 grassMicro  = SampleTriplanar(TEXTURE2D_ARGS(_GrassTex, sampler_GrassTex), IN.positionWS, N, 0.25);

                // Composite noise layers
                float combo = noiseMacro.r
                            + noiseDetail.r * 0.4 * closeUp
                            + noiseDetail.g * 0.25 * medRange
                            + noiseMicro.r * 0.2 * ultraClose
                            + noiseFine.b * 0.12 * superClose;

                float rockGrain = worleySmall.r * superClose;
                float mineralSpecks = step(0.92, worleyMicro.b) * superClose;
                float pebbles = worleyLarge.g * closeUp;
                float strata = StrataPattern(IN.positionWS, N);

                // ── Normal perturbation from baked normal map ──
                float normStr = lerp(0.15, 0.8, closeUp) * (1.0 - distLOD);
                float3 pertN = SampleTriplanarNormal(IN.positionWS, N, T, B, _DetailScale * 3.0, normStr);
                float3 microN = SampleTriplanarNormal(IN.positionWS, N, T, B, _DetailScale * 12.0, normStr * 0.5 * ultraClose);
                N = normalize(lerp(pertN, microN, 0.3 * ultraClose));

                float3 H = normalize(L + V);

                // ── Albedo ──
                float3 base3 = IN.vertColor.rgb;
                float3 detM = base3 * (1.0 + (combo - 0.5) * _DetailStr * 2.5);
                detM *= strata;
                detM = lerp(detM, detM * (0.82 + rockGrain * 0.36), superClose * 0.55);
                detM += float3(0.15, 0.12, 0.08) * mineralSpecks * 0.4;

                float slopeA = 1.0 - max(dot(normalize(IN.normalWS), float3(0,1,0)), 0.0);
                float flatG  = 1.0 - smoothstep(0.0, 0.3, slopeA);
                detM = lerp(detM, detM * (0.78 + pebbles * 0.44), flatG * closeUp * 0.35);

                float3 alb = lerp(detM, base3 * 0.98, distLOD * 0.5);
                alb = saturate(alb);

                // ── Cliff ──
                float cliffM = smoothstep(0.4, 0.8, slopeA);
                float cn = noiseMacro.g;
                float3 cb = lerp(float3(0.48,0.44,0.40), float3(0.40,0.38,0.36), smoothstep(0.3,0.7,cn));
                float rockFace = worleySmall.b;
                cb = lerp(cb, float3(0.55,0.48,0.42), rockFace * 0.4);
                float crevice = worleySmall.r * noiseMicro.g;
                cb *= (0.72 + crevice * 0.56);
                float lichenP = step(0.70, noiseMacro.b) * smoothstep(60.0, 180.0, elev);
                cb = lerp(cb, float3(0.52, 0.56, 0.32), lichenP * 0.4);
                alb = lerp(alb, cb, cliffM * 0.75);

                // ── Grass — texture-driven ──
                float gM = (1.0-cliffM)*smoothstep(_WaterLevel+5.0,_WaterLevel+20.0,elev)*(1.0-smoothstep(120.0,180.0,elev));
                float3 gb = lerp(float3(0.28,0.42,0.18), float3(0.45,0.50,0.22), smoothstep(0.35,0.65, grassSample.g));
                gb = lerp(gb, float3(0.22,0.35,0.14), grassMicro.r * 0.4 * closeUp);
                float dried = grassSample.b;
                gb = lerp(gb, float3(0.42,0.38,0.22), smoothstep(0.55,0.8,dried) * 0.35);
                gb *= (0.85 + grassSample.g * 0.30);
                float blade = grassMicro.r;
                gb = lerp(gb, lerp(float3(0.18,0.32,0.10),float3(0.35,0.52,0.20),blade), superClose * 0.35);
                float3 flowerC = lerp(float3(0.85,0.75,0.2), float3(0.8,0.3,0.5), Hash(floor(IN.positionWS.xz * 3.0)));
                gb = lerp(gb, flowerC, step(0.85, grassMicro.r) * superClose * 0.15);
                alb = lerp(alb, gb, gM * 0.50 * max(closeUp, 0.35));

                // ── Moss ──
                float nf = max(dot(normalize(IN.normalWS), float3(0,0.3,-0.95)), 0.0);
                float mM = nf*(1.0-cliffM)*smoothstep(50.0,90.0,elev)*(1.0-smoothstep(160.0,200.0,elev))*max(closeUp,0.15);
                float mn = noiseMacro.b;
                alb = lerp(alb, lerp(float3(0.18,0.30,0.12),float3(0.12,0.25,0.08),mn), mM*0.40);

                // ── Erosion + gullies ──
                float eM = smoothstep(0.35,0.55,noiseDetail.r)*slopeA*0.3*max(closeUp,0.15);
                float gully = worleyLarge.b * slopeA;
                alb = lerp(alb, alb*0.62, eM + gully*0.18);

                // ── Dirt paths ──
                float pn = sin(IN.positionWS.x*0.015+noiseMacro.r*25.0);
                float pM = smoothstep(0.92,0.98,abs(pn))*flatG*smoothstep(_WaterLevel+10.0,_WaterLevel+30.0,elev)*(1.0-smoothstep(150.0,180.0,elev));
                alb = lerp(alb, float3(0.42,0.36,0.28), pM*0.5);

                // ── Wetness + puddles ──
                float wP = 1.0-saturate((elev-_WaterLevel)/15.0); wP *= wP;
                float pudM = smoothstep(0.58,0.72,noiseDetail.g)*wP*flatG;
                alb = lerp(alb, float3(0.08,0.15,0.20), pudM*0.65);
                alb = lerp(alb, alb*0.58, wP*0.65);

                // ── Beach ──
                float beachM = smoothstep(_WaterLevel+8.0,_WaterLevel+2.0,elev)*flatG;
                float sn = noiseDetail.r;
                float3 beachC = lerp(float3(0.72,0.65,0.50), float3(0.68,0.58,0.42), sn);
                float wetSand = smoothstep(_WaterLevel+4.0,_WaterLevel+1.0,elev);
                beachC = lerp(beachC, beachC * 0.65, wetSand * 0.6);
                beachC += worleyMicro.r * 0.06 * superClose;
                alb = lerp(alb, beachC, beachM*0.65);

                // ── Snow ──
                float snowN = noiseMacro.r;
                float snowM = smoothstep(_SnowLine,_SnowLine+40.0,elev)*smoothstep(0.6,0.3,slopeA)*smoothstep(0.3,0.6,snowN);
                float3 snowC = lerp(float3(0.92,0.94,0.96),float3(0.88,0.90,0.95),noiseDetail.g);
                snowC = lerp(snowC, float3(0.78,0.82,0.92), (1.0-max(dot(N,L),0.0))*0.2);
                snowC += (worleySmall.r - 0.5) * 0.04 * closeUp;
                float sparkle = step(0.95, worleyMicro.b) * superClose * max(dot(N,L),0.0);
                snowC += sparkle * 0.25;
                alb = lerp(alb, snowC, snowM*0.90);

                // ── Scree ──
                float scrM = cliffM*smoothstep(140.0,190.0,elev)*(1.0-snowM);
                float scrN = worleySmall.r;
                float3 screeC = lerp(float3(0.52,0.50,0.46), float3(0.45,0.42,0.40), scrN);
                screeC += (worleyMicro.g - 0.5) * 0.08 * closeUp;
                alb = lerp(alb, screeC, scrM*0.55);

                // ── Alpine meadow ──
                float alpineM = smoothstep(100.0, 140.0, elev) * (1.0 - smoothstep(160.0, 190.0, elev)) * (1.0 - cliffM);
                float3 alpineC = lerp(float3(0.35,0.40,0.20), float3(0.28,0.35,0.18), grassSample.g);
                alpineC = lerp(alpineC, float3(0.55,0.50,0.25), grassSample.b * 0.3);
                alb = lerp(alb, alpineC, alpineM * 0.25 * max(closeUp, 0.2));

                // ── Roughness ──
                float rough = _Roughness + (combo-0.5)*0.12 + (rockGrain-0.5)*0.08*superClose;
                rough = lerp(rough, 0.12, pudM*0.85);
                rough = lerp(rough, 0.32, wP*0.5);
                rough = lerp(rough, 0.15, snowM*0.7);
                rough = lerp(rough, 0.92, cliffM*0.3);
                rough = lerp(rough, 0.48, beachM*0.5);
                rough = lerp(rough, rough * 0.6, wetSand * beachM);
                rough = clamp(rough, 0.04, 1.0);

                // ── AO ──
                float cAO = lerp(0.45, 1.0, max(dot(normalize(IN.normalWS), float3(0,1,0)), 0.0));
                cAO = lerp(cAO, 1.0, 0.25) * lerp(0.82, 1.0, combo) * lerp(0.88, 1.0, pebbles);
                cAO *= lerp(0.9, 1.0, worleySmall.b * closeUp);

                // ── BRDF ──
                float NdL = max(dot(N,L),0.0);
                float NdV = max(dot(N,V),0.001);
                float NdH = max(dot(N,H),0.0);
                float HdV = max(dot(H,V),0.0);
                float3 F0 = lerp(float3(0.04,0.04,0.04),float3(0.06,0.06,0.06),wP);
                F0 = lerp(F0, float3(0.02,0.02,0.02), snowM);
                F0 = lerp(F0, float3(0.08,0.08,0.08), pudM);
                float D = TerrainGGX(NdH,rough);
                float G = TerrainGeom(NdV,NdL,rough);
                float3 F = TerrainFresnel(HdV,F0);
                float3 spec = (D*G*F)/(4.0*NdV*NdL+0.001);
                float3 kD = (1.0-F);

                float3 sunC = mainLight.color.rgb;
                float sha = lerp(0.30, 1.0, mainLight.shadowAttenuation * mainLight.distanceAttenuation);
                float3 Lo = (kD*alb/PI + spec) * sunC * NdL * sha;

                // ── Ambient ──
                float3 skyA = float3(0.42,0.48,0.62);
                float3 gndA = float3(0.28,0.24,0.20);
                float hemi = max(dot(N,float3(0,1,0)),0.0)*0.5+0.5;
                float3 amb = lerp(gndA,skyA,hemi)*alb*_AmbientBoost*cAO;

                float3 bounceDir = reflect(-L, float3(0,1,0));
                float bounce = max(dot(N, bounceDir), 0.0) * 0.08;
                amb += alb * float3(0.35,0.30,0.22) * bounce;

                #ifdef _ADDITIONAL_LIGHTS
                uint alc = GetAdditionalLightsCount();
                for (uint li = 0u; li < alc; li++) {
                    Light al = GetAdditionalLight(li, IN.positionWS);
                    Lo += alb/PI * al.color.rgb * max(dot(N,al.direction),0.0) * al.distanceAttenuation * al.shadowAttenuation;
                }
                #endif

                // ── Env specular + reflections ──
                float3 envC = lerp(sunC*0.22, skyA*0.65, rough);
                float3 envS = envC * pow(1.0-NdV,5.0)*0.4 * (1.0-rough*0.5);
                envS += float3(0.3,0.4,0.55)*pudM*pow(1.0-NdV,3.0)*0.45;
                envS += float3(0.25,0.30,0.40)*wP*cliffM*pow(1.0-NdV,4.0)*0.2;

                // ── Rim + SSS ──
                float3 rim = lerp(float3(0.55,0.72,0.88),sunC,0.35)*pow(1.0-NdV,4.0)*0.13;
                float sss = pow(max(dot(V,-L),0.0),4.0)*0.06*(1.0-cliffM);
                float3 sssC = alb*float3(0.5,0.8,0.3)*sss + float3(0.6,0.7,0.9)*pow(max(dot(V,-L),0.0),3.0)*0.08*snowM;

                // ── Haze ──
                float3 haze = float3(0.72,0.80,0.90);
                float hf = smoothstep(400.0, 2000.0, cd) * 0.38;

                float3 col = amb + Lo + envS + rim + sssC;
                col = lerp(col, haze, hf);
                col = MixFog(col, IN.fogFactor);

                return half4(col, 1);
            }
            ENDHLSL
        }

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
            SV ShadowVert(SA IN) { SV OUT; float3 pw = TransformObjectToWorld(IN.positionOS.xyz); pw += TransformObjectToWorldNormal(IN.normalOS)*0.02; OUT.positionCS = TransformWorldToHClip(pw);
                #if UNITY_REVERSED_Z
                    OUT.positionCS.z = min(OUT.positionCS.z, UNITY_NEAR_CLIP_VALUE);
                #else
                    OUT.positionCS.z = max(OUT.positionCS.z, UNITY_NEAR_CLIP_VALUE);
                #endif
                return OUT; }
            half4 ShadowFrag(SV IN) : SV_Target { return 0; }
            ENDHLSL
        }

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
