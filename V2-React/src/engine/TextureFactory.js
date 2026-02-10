// ================================================================
//  TEXTURE FACTORY — procedural PBR rock textures:
//  albedo, normal, roughness+AO+height (packed RMH).
//  Returned as 2D horizontal atlas textures (6 tiles × 512).
// ================================================================
import * as THREE from 'three';
import { createNoise2D } from './noise';

const TEX = 1024;
const clamp = (v) => Math.max(0, Math.min(255, v | 0));

function makeBuffers() {
  return {
    albedo: new Uint8ClampedArray(TEX * TEX * 4),
    rmh:    new Uint8ClampedArray(TEX * TEX * 4),
  };
}

function graniteGneiss(n, n2) {
  const { albedo, rmh } = makeBuffers();
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const i = (y * TEX + x) * 4;
      const v1 = n(x*0.018,y*0.018), v2 = n2(x*0.07,y*0.07), v3 = n(x*0.14+50,y*0.14+50);
      const bandY = y + n(x*0.005,y*0.008)*35;
      const band = Math.sin(bandY*0.045)*0.5+0.5;
      let r,g,b,rough;
      if (v3>0.25){r=190+v1*25;g=185+v1*20;b=180+v1*18;rough=0.55;}
      else if(v3>-0.15){r=195+v1*18;g=165+v1*14;b=160+v1*12;rough=0.6;}
      else{r=65+v1*22;g=58+v1*16;b=52+v1*14;rough=0.45;}
      const bm=band*0.25; r=r*(1-bm)+105*bm; g=g*(1-bm)+98*bm; b=b*(1-bm)+92*bm;
      r+=v2*14; g+=v2*11; b+=v2*9;
      const ao = 0.85+v2*0.08+band*0.07;
      const h = 0.5+v1*0.2+v2*0.1;
      rough += v2*0.08;
      albedo[i]=clamp(r);albedo[i+1]=clamp(g);albedo[i+2]=clamp(b);albedo[i+3]=255;
      rmh[i]=clamp(rough*255);rmh[i+1]=clamp(ao*255);rmh[i+2]=clamp(h*255);rmh[i+3]=255;
    }
  return { albedo, rmh };
}

function dolomiticLimestone(n, n2) {
  const { albedo, rmh } = makeBuffers();
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const i = (y * TEX + x) * 4;
      const v1=n(x*0.012,y*0.012),v2=n2(x*0.06,y*0.06),v3=n(x*0.25+100,y*0.25+100);
      let r=200+v1*20+v3*8,g=186+v1*18+v3*7,b=155+v1*16+v3*6;
      let rough=0.48,ao=0.9,h=0.5+v1*0.15;
      const vein=Math.abs(n(x*0.008+30,y*0.008+30));
      if(vein<0.06){r+=22;g+=18;b+=14;rough-=0.08;}
      if(v3>0.6){r+=18;g+=16;b+=14;rough-=0.12;}
      r+=v2*10;g+=v2*8;b+=v2*6; ao+=v2*0.05;
      albedo[i]=clamp(r);albedo[i+1]=clamp(g);albedo[i+2]=clamp(b);albedo[i+3]=255;
      rmh[i]=clamp(rough*255);rmh[i+1]=clamp(ao*255);rmh[i+2]=clamp(h*255);rmh[i+3]=255;
    }
  return { albedo, rmh };
}

function sandstoneShale(n, n2) {
  const { albedo, rmh } = makeBuffers();
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const i = (y * TEX + x) * 4;
      const v1=n(x*0.015,y*0.015),v2=n2(x*0.09,y*0.09);
      const bx=x*Math.cos(0.35)+y*Math.sin(0.35);
      const bed=Math.sin(bx*0.055+n(x*0.003,y*0.003)*6)*0.5+0.5;
      const isShale=bed<0.3;
      let r,g,b,rough,ao,h;
      if(isShale){r=130+v1*15;g=120+v1*12;b=105+v1*10;rough=0.72;ao=0.78;h=0.35;}
      else{r=188+v1*18+bed*12;g=165+v1*15+bed*8;b=118+v1*10+bed*6;rough=0.65;ao=0.88;h=0.55+bed*0.15;}
      r+=v2*10;g+=v2*8;b+=v2*6; rough+=v2*0.05;
      albedo[i]=clamp(r);albedo[i+1]=clamp(g);albedo[i+2]=clamp(b);albedo[i+3]=255;
      rmh[i]=clamp(rough*255);rmh[i+1]=clamp(ao*255);rmh[i+2]=clamp(h*255);rmh[i+3]=255;
    }
  return { albedo, rmh };
}

function schist(n, n2) {
  const { albedo, rmh } = makeBuffers();
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const i = (y * TEX + x) * 4;
      const v1=n(x*0.014,y*0.014),v2=n2(x*0.08,y*0.08);
      const folY=y+n(x*0.004,y*0.006)*20;
      const fol=Math.sin(folY*0.09)*0.5+0.5;
      let r=100+v1*18,g=115+v1*16,b=117+v1*16;
      let rough=0.58,ao=0.82,h=0.45+fol*0.15;
      const mica=fol>0.7?(fol-0.7)*3.33:0;
      r+=mica*35;g+=mica*30;b+=mica*25; rough-=mica*0.25;
      const garnet=n(x*0.06+200,y*0.06+200);
      if(garnet>0.65){r=140;g=40;b=45;rough=0.35;}
      r+=v2*8;g+=v2*7;b+=v2*6; ao+=v2*0.06;
      albedo[i]=clamp(r);albedo[i+1]=clamp(g);albedo[i+2]=clamp(b);albedo[i+3]=255;
      rmh[i]=clamp(rough*255);rmh[i+1]=clamp(ao*255);rmh[i+2]=clamp(h*255);rmh[i+3]=255;
    }
  return { albedo, rmh };
}

function limestone(n, n2) {
  const { albedo, rmh } = makeBuffers();
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const i = (y * TEX + x) * 4;
      const v1=n(x*0.01,y*0.01),v2=n2(x*0.07,y*0.07),v3=n(x*0.2+80,y*0.2+80);
      let r=168+v1*18,g=152+v1*16,b=135+v1*14;
      let rough=0.52,ao=0.88,h=0.5+v1*0.15;
      const sty=Math.abs(n(x*0.006+50,y*0.002+50));
      if(sty<0.03){r-=35;g-=30;b-=25;ao-=0.15;h-=0.1;}
      const fx=(x+50)%80-40,fy=(y+30)%90-45,fd=Math.sqrt(fx*fx+fy*fy);
      if(fd>12&&fd<16&&v3>0.1){r-=15;g-=12;b-=10;}
      r+=v2*8;g+=v2*7;b+=v2*6;
      albedo[i]=clamp(r);albedo[i+1]=clamp(g);albedo[i+2]=clamp(b);albedo[i+3]=255;
      rmh[i]=clamp(rough*255);rmh[i+1]=clamp(ao*255);rmh[i+2]=clamp(h*255);rmh[i+3]=255;
    }
  return { albedo, rmh };
}

function alluvium(n, n2) {
  const { albedo, rmh } = makeBuffers();
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const i = (y * TEX + x) * 4;
      const v1=n(x*0.012,y*0.012),v2=n2(x*0.06,y*0.06),v3=n(x*0.18+60,y*0.18+60);
      let r=110+v1*22,g=140+v1*20,b=85+v1*15;
      let rough=0.82,ao=0.75,h=0.4+v1*0.2;
      if(v3>0.4){r-=18;g-=8;b-=12;ao-=0.08;}
      const grass=n(x*0.04+40,y*0.04+40);
      if(grass>0.3){r-=12;g+=14;b-=8;rough+=0.05;}
      const root=Math.abs(n(x*0.01+70,y*0.003+70));
      if(root<0.02){r-=25;g-=15;b-=20;h-=0.08;}
      r+=v2*8;g+=v2*7;b+=v2*5;
      albedo[i]=clamp(r);albedo[i+1]=clamp(g);albedo[i+2]=clamp(b);albedo[i+3]=255;
      rmh[i]=clamp(rough*255);rmh[i+1]=clamp(ao*255);rmh[i+2]=clamp(h*255);rmh[i+3]=255;
    }
  return { albedo, rmh };
}

/* ── Sobel normal map ─────────────────────── */
function normalMapFromPixels(src) {
  const dst = new Uint8ClampedArray(TEX*TEX*4);
  const getH = (px,py) => {
    const idx = ((py+TEX)%TEX*TEX+(px+TEX)%TEX)*4;
    return (src[idx]+src[idx+1]+src[idx+2])/765;
  };
  const str = 3.2;
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const tl=getH(x-1,y-1),t=getH(x,y-1),tr=getH(x+1,y-1);
      const l=getH(x-1,y),r=getH(x+1,y);
      const bl=getH(x-1,y+1),b=getH(x,y+1),br=getH(x+1,y+1);
      const dX=(tr+2*r+br)-(tl+2*l+bl);
      const dY=(bl+2*b+br)-(tl+2*t+tr);
      const i=(y*TEX+x)*4;
      dst[i]=clamp((-dX*str*0.5+0.5)*255);
      dst[i+1]=clamp((dY*str*0.5+0.5)*255);
      dst[i+2]=255; dst[i+3]=255;
    }
  return dst;
}

/* ── Public API ───────────────────────────── */
export function createTextureAtlases() {
  const n = createNoise2D(999), n2 = createNoise2D(1234);
  const generators = [graniteGneiss, dolomiticLimestone, sandstoneShale, schist, limestone, alluvium];
  const TILES = generators.length, atlasW = TEX*TILES, atlasH = TEX;

  const albedoBuf = new Uint8ClampedArray(atlasW*atlasH*4);
  const normalBuf = new Uint8ClampedArray(atlasW*atlasH*4);
  const rmhBuf    = new Uint8ClampedArray(atlasW*atlasH*4);

  generators.forEach((gen, idx) => {
    const { albedo, rmh: rmhData } = gen(n, n2);
    const normals = normalMapFromPixels(albedo);
    for (let y = 0; y < TEX; y++) {
      const s = y*TEX*4, d = (y*atlasW+idx*TEX)*4;
      albedoBuf.set(albedo.subarray(s, s+TEX*4), d);
      normalBuf.set(normals.subarray(s, s+TEX*4), d);
      rmhBuf.set(rmhData.subarray(s, s+TEX*4), d);
    }
  });

  const makeTex = (data) => {
    const t = new THREE.DataTexture(data, atlasW, atlasH);
    t.format=THREE.RGBAFormat; t.type=THREE.UnsignedByteType;
    t.wrapS=THREE.ClampToEdgeWrapping; t.wrapT=THREE.ClampToEdgeWrapping;
    t.minFilter=THREE.LinearMipmapLinearFilter; t.magFilter=THREE.LinearFilter;
    t.generateMipmaps=true;
    t.needsUpdate=true;
    return t;
  };

  return { albedoAtlas: makeTex(albedoBuf), normalAtlas: makeTex(normalBuf), rmhAtlas: makeTex(rmhBuf) };
}
