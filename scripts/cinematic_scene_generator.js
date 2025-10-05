import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import seedrandom from 'seedrandom';
import { createCanvas, loadImage } from 'canvas';

/*
  Cinematic Pirate Scene Generator (Phase 1)
  -----------------------------------------
  GOAL: Produce richer, layered adventure art approximations using procedural painting + silhouette overlays
  based on your provided reference mood (golden hour, hero object foreground, depth, atmosphere).

  OUTPUT: /content/cinematic_preview/
    - images/<slug>_<index>.png
    - metadata/<slug>_<index>.json

  RUN:   node cinematic_scene_generator.js --count 10 --seed GOLDEN-DAWN

  Silhouette assets (optional) auto-detected from:
    assets/cinematic/hero/*  (compass,map_scroll,wheel,watch,hourglass,crew,ship)
    assets/cinematic/props/*

  If missing, procedural placeholders are used.
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../content/cinematic_preview');
const IMG_SIZE = 2048; // full size; you can add --preview to output half-size

// Scene template definitions
const SCENE_TEMPLATES = [
  {
    key: 'compass_vista',
    weight: 1.2,
    hero: 'compass',
    horizon: 0.55,
    sun: { x: 0.52, y: 0.35, radius: 260, hue: 44 },
    camera: { focal: 35, tilt: 0 },
    layers: ['sky', 'sunGlow', 'clouds', 'distantCliffs', 'midSea', 'shipSilhouette', 'foregroundHero', 'atmosphere', 'grading']
  },
  {
    key: 'deck_wheel_forward',
    weight: 1,
    hero: 'wheel',
    horizon: 0.45,
    sun: { x: 0.50, y: 0.32, radius: 220, hue: 38 },
    camera: { focal: 28, tilt: 0 },
    layers: ['sky','sunGlow','clouds','backMasts','midSea','deckPerspective','foregroundHero','spray','atmosphere','grading']
  },
  {
    key: 'scroll_fortress_channel',
    weight: 0.9,
    hero: 'map_scroll',
    horizon: 0.60,
    sun: { x: 0.60, y: 0.33, radius: 250, hue: 48 },
    camera: { focal: 40 },
    layers: ['sky','sunGlow','clouds','distantFortress','channelIslands','midSea','shipSilhouette','foregroundHero','atmosphere','grading']
  },
  {
    key: 'time_relic_sands',
    weight: 0.8,
    hero: 'time_relic',
    horizon: 0.50,
    sun: { x: 0.48, y: 0.36, radius: 240, hue: 42 },
    camera: { focal: 55 },
    layers: ['sky','sunGlow','clouds','distantStorm','midGroundSand','foregroundHero','atmosphere','grading']
  }
];

function weightedPick(rng) {
  const total = SCENE_TEMPLATES.reduce((s,t)=>s+t.weight,0);
  let roll = rng()*total;
  for (const t of SCENE_TEMPLATES) { roll -= t.weight; if (roll <= 0) return t; }
  return SCENE_TEMPLATES[0];
}

async function loadSilhouetteAssets() {
  const base = path.resolve(__dirname,'../assets/cinematic');
  const buckets = { hero:{}, props:{} };
  const categories = [ ['hero','hero'], ['props','props'] ];
  for (const [folder,key] of categories) {
    const dir = path.join(base, folder);
    if (!fs.existsSync(dir)) continue;
    const files = (await fs.readdir(dir)).filter(f=>/\.(png|jpg|jpeg)$/i.test(f));
    for (const f of files) {
      const name = f.replace(/\.(png|jpg|jpeg)$/i,'');
      try { buckets[key][name] = await loadImage(path.join(dir,f)); } catch { /* ignore */ }
    }
  }
  return buckets;
}

function drawImageCentered(ctx, img, cx, cy, targetW, targetH, opacity=1, blend) {
  ctx.save();
  if (blend) ctx.globalCompositeOperation = blend;
  ctx.globalAlpha = opacity;
  ctx.drawImage(img, cx - targetW/2, cy - targetH/2, targetW, targetH);
  ctx.restore();
}

// --- Silhouette Segmentation (simple connected pixel regions) ---
function segmentSilhouette(image, maxParts=6, alphaThreshold=40){
  try {
    const w = image.width, h = image.height;
    const tmp = createCanvas(w,h); const tctx = tmp.getContext('2d');
    tctx.drawImage(image,0,0,w,h);
    const data = tctx.getImageData(0,0,w,h);
    const arr = data.data;
    const visited = new Uint8Array(w*h);
    const parts = [];
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (let y=0;y<h;y++){
      for (let x=0;x<w;x++){
        const idx = (y*w+x);
        if (visited[idx]) continue;
        const a = arr[idx*4+3];
        if (a < alphaThreshold) { visited[idx]=1; continue; }
        // BFS
        const q=[idx]; visited[idx]=1;
        let minX=x,maxX=x,minY=y,maxY=y;
        const pixels=[];
        while(q.length){
          const cur = q.pop();
          const cx = cur % w; const cy = (cur - cx)/w;
            const ai = arr[cur*4+3];
            if (ai < alphaThreshold) continue;
            pixels.push(cur);
            if (cx<minX)minX=cx; if (cx>maxX)maxX=cx; if (cy<minY)minY=cy; if (cy>maxY)maxY=cy;
            for (const [dx,dy] of dirs){
              const nx=cx+dx, ny=cy+dy; if (nx<0||ny<0||nx>=w||ny>=h) continue;
              const nIdx = ny*w+nx; if (visited[nIdx]) continue; visited[nIdx]=1; q.push(nIdx);
            }
        }
        const pw = maxX-minX+1, ph = maxY-minY+1;
        if (pixels.length < 150) continue; // ignore tiny specks
        const canvasPart = createCanvas(pw,ph); const pctx = canvasPart.getContext('2d');
        // copy region
        const partData = pctx.createImageData(pw,ph);
        for (const p of pixels){
          const px = p % w; const py = (p - px)/w;
          const si = (py*w+px)*4; const di = ((py-minY)*pw + (px-minX))*4;
          partData.data[di] = arr[si];
          partData.data[di+1] = arr[si+1];
            partData.data[di+2] = arr[si+2];
          partData.data[di+3] = arr[si+3];
        }
        pctx.putImageData(partData,0,0);
        parts.push({ canvas: canvasPart, x:minX, y:minY, w:pw, h:ph, area: pixels.length });
        if (parts.length >= maxParts) return parts.sort((a,b)=>b.area-a.area);
      }
    }
    return parts.sort((a,b)=>b.area-a.area);
  } catch (e) { return []; }
}

function renderSilhouetteMulti(ctx, img, cx, cy, baseW, sunVec){
  const aspect = img.height ? img.width / img.height : 1;
  const baseH = baseW / aspect;
  const parts = segmentSilhouette(img, 7);
  if (!parts.length){
    drawImageCentered(ctx,img,cx,cy,baseW,baseH,0.95,'source-over');
    return;
  }
  // Sort largest first (background) to smallest (foreground accent)
  const totalArea = parts.reduce((s,p)=>s+p.area,0);
  parts.forEach((p,i)=>{
    const scale = baseW / img.width;
    const tx = cx - baseW/2 + p.x*scale;
    const ty = cy - baseH/2 + p.y*scale;
    const w = p.w * scale; const h = p.h * scale;
    // Depth offset + slight parallax based on order
    const depth = i / parts.length; // 0 back, 1 front
    const lift = (1-depth)*8; // subtle vertical layering
    ctx.save();
    // Base shadow under each major component for separation
    ctx.globalAlpha = 0.28*(1-depth);
    ctx.globalCompositeOperation='multiply';
    ctx.filter='blur(18px)';
    ctx.drawImage(p.canvas, tx, ty+24+lift, w, h);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.92 - depth*0.15;
    ctx.globalCompositeOperation='source-over';
    ctx.drawImage(p.canvas, tx, ty+lift, w, h);
    ctx.restore();

    // Rim highlight along sun direction: sample mask and overlay gradient
    ctx.save();
    const grad = ctx.createLinearGradient(tx, ty, tx + w*sunVec.x*2 + 0.01, ty + h*sunVec.y*2 + 0.01);
    grad.addColorStop(0,'rgba(255,200,120,0.55)');
    grad.addColorStop(0.5,'rgba(255,160,80,0.12)');
    grad.addColorStop(1,'rgba(255,140,60,0)');
    ctx.globalCompositeOperation='overlay';
    ctx.globalAlpha = 0.5*(1-depth);
    ctx.fillStyle = grad;
    ctx.fillRect(tx,ty,w,h);
    ctx.restore();
  });
}

function lightWrap(ctx, img, cx, cy, w, h, sunVec) {
  // Simple light wrap: blur-ish expansion via repeated draws scaled + additive near sun direction
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const steps = 5;
  for (let i=steps; i>=1; i--) {
    const scale = 1 + i*0.015;
    const offX = -sunVec.x * i * 4;
    const offY = -sunVec.y * i * 4;
    ctx.globalAlpha = 0.04 + (0.06 * (1 - i/steps));
    ctx.drawImage(img, cx - (w*scale)/2 + offX, cy - (h*scale)/2 + offY, w*scale, h*scale);
  }
  ctx.restore();
}

function randRange(rng, a,b){ return a + (b-a)*rng(); }
function lerp(a,b,t){ return a + (b-a)*t; }

function hsl(h,s,l){ return `hsl(${h},${s}%,${l}%)`; }

function drawSky(ctx, tpl, rng){
  const grd = ctx.createLinearGradient(0,0,0,IMG_SIZE);
  const hue = tpl.sun.hue;
  grd.addColorStop(0, hsl(hue, 70, 70));
  grd.addColorStop(0.45, hsl(hue-10, 60, 55));
  grd.addColorStop(1, hsl(hue-25, 55, 30));
  ctx.fillStyle = grd; ctx.fillRect(0,0,IMG_SIZE,IMG_SIZE);
}

function drawSunGlow(ctx, tpl){
  ctx.save();
  const {x,y,radius} = tpl.sun;
  const cx = x*IMG_SIZE, cy = y*IMG_SIZE;
  const rad = radius;
  const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
  grd.addColorStop(0,'rgba(255,230,140,0.95)');
  grd.addColorStop(0.4,'rgba(255,200,90,0.55)');
  grd.addColorStop(1,'rgba(255,180,60,0)');
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawClouds(ctx, rng){
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i=0;i<18;i++){
    const w = randRange(rng, 280, 760);
    const h = w*randRange(rng,0.15,0.35);
    const x = randRange(rng,-100,IMG_SIZE-200);
    const y = randRange(rng, IMG_SIZE*0.05, IMG_SIZE*0.5);
    const grd = ctx.createLinearGradient(x,y, x, y+h);
    grd.addColorStop(0,'rgba(255,255,255,0.9)');
    grd.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCliffs(ctx,rng, tpl){
  ctx.save();
  ctx.globalAlpha = 0.85;
  const baseY = tpl.horizon*IMG_SIZE;
  for (let segment=0; segment<5; segment++){
    const left = segment*(IMG_SIZE/4)+randRange(rng,-40,40);
    const width = IMG_SIZE/4 + randRange(rng,-60,80);
    const top = baseY - randRange(rng,120,340);
    const grd = ctx.createLinearGradient(0,top,0,baseY);
    grd.addColorStop(0,'rgba(70,90,110,0.9)');
    grd.addColorStop(1,'rgba(20,30,40,0.0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(left, baseY);
    ctx.lineTo(left+width*0.2, top+randRange(rng,0,40));
    ctx.lineTo(left+width*0.6, top+randRange(rng,-40,30));
    ctx.lineTo(left+width, baseY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSea(ctx,rng,tpl){
  const horizonY = tpl.horizon*IMG_SIZE;
  const grd = ctx.createLinearGradient(0,horizonY,0,IMG_SIZE);
  grd.addColorStop(0,'rgba(10,70,110,0.9)');
  grd.addColorStop(0.6,'rgba(5,40,70,0.95)');
  grd.addColorStop(1,'rgba(3,25,45,1)');
  ctx.fillStyle = grd; ctx.fillRect(0,horizonY,IMG_SIZE,IMG_SIZE-horizonY);

  ctx.save();
  ctx.globalCompositeOperation='lighter';
  for (let i=0;i<260;i++){
    const y = randRange(rng,horizonY+10,IMG_SIZE-30);
    const len = randRange(rng,120,640);
    const x = randRange(rng,-50,IMG_SIZE-50);
    const alpha = 0.05 + (1 - (y-horizonY)/(IMG_SIZE-horizonY))*0.18;
    ctx.strokeStyle = `rgba(200,240,255,${alpha})`;
    ctx.lineWidth = randRange(rng,1,3);
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len,y+randRange(rng,-6,6)); ctx.stroke();
  }
  ctx.restore();
}

function drawShipSilhouette(ctx,rng,tpl, silhouettes){
  if (silhouettes?.props?.ship) {
    // Use provided ship silhouette scaled to horizon
    const img = silhouettes.props.ship;
    const horizonY = tpl.horizon*IMG_SIZE;
    const targetW = IMG_SIZE * 0.33;
    const aspect = img.height ? img.width / img.height : 1.6;
    const targetH = targetW / aspect;
    const x = randRange(rng, IMG_SIZE*0.35, IMG_SIZE*0.7);
    const y = horizonY - targetH*0.2;
    // Base dark draw
    drawImageCentered(ctx, img, x, y, targetW, targetH, 0.9, 'source-over');
    // Subtle atmospheric fade
    ctx.save();
    const grad = ctx.createLinearGradient(0, y-targetH/2, 0, y+targetH/2);
    grad.addColorStop(0,'rgba(255,255,255,0)');
    grad.addColorStop(1,'rgba(255,200,120,0.08)');
    ctx.globalCompositeOperation='overlay';
    ctx.fillStyle = grad;
    ctx.fillRect(x-targetW/2, y-targetH/2, targetW, targetH);
    ctx.restore();
    return;
  }
  // Fallback procedural ship
  ctx.save();
  const horizonY = tpl.horizon*IMG_SIZE;
  const scale = randRange(rng,0.18,0.28);
  const baseX = randRange(rng, IMG_SIZE*0.35, IMG_SIZE*0.7);
  const baseY = horizonY - 10;
  ctx.translate(baseX, baseY);
  ctx.scale(scale*IMG_SIZE/800, scale*IMG_SIZE/800);
  ctx.fillStyle = 'rgba(20,25,35,0.85)';
  ctx.beginPath();
  ctx.moveTo(-300,0); ctx.lineTo(260,0); ctx.lineTo(210,-40); ctx.lineTo(-240,-50); ctx.closePath();
  ctx.fill();
  // masts
  for (let m=0;m<3;m++){
    ctx.fillRect(-200 + m*160, -400, 18, 400);
    // sails simplified
    ctx.beginPath();
    ctx.moveTo(-200 + m*160 + 9, -380);
    ctx.quadraticCurveTo(-120 + m*160, -260, -200 + m*160 + 9, -170);
    ctx.lineTo(-200 + m*160 + 9, -380);
    ctx.fill();
  }
  ctx.restore();
}

function drawDeckPerspective(ctx,rng,tpl){
  const horizonY = tpl.horizon*IMG_SIZE;
  const plankCount = 40;
  ctx.save();
  for (let i=0;i<plankCount;i++){
    const t0 = i/plankCount;
    const t1 = (i+1)/plankCount;
    const y0 = lerp(horizonY, IMG_SIZE, t0*t0);
    const y1 = lerp(horizonY, IMG_SIZE, t1*t1);
    const leftSpread0 = lerp(IMG_SIZE*0.05, -IMG_SIZE*0.25, t0);
    const rightSpread0 = lerp(IMG_SIZE*0.95, IMG_SIZE*1.25, t0);
    const leftSpread1 = lerp(IMG_SIZE*0.05, -IMG_SIZE*0.3, t1);
    const rightSpread1 = lerp(IMG_SIZE*0.95, IMG_SIZE*1.3, t1);
    const woodHue = 32 + randRange(rng,-4,4);
    const lightness = 25 + t0*25 + randRange(rng,-4,4);
    ctx.fillStyle = hsl(woodHue,50,lightness);
    ctx.beginPath();
    ctx.moveTo(leftSpread0,y0);
    ctx.lineTo(rightSpread0,y0);
    ctx.lineTo(rightSpread1,y1);
    ctx.lineTo(leftSpread1,y1);
    ctx.closePath();
    ctx.fill();
    if (i%4===0){
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth=3; ctx.stroke();
    }
  }
  ctx.restore();
}

function drawSand(ctx,rng,tpl){
  const horizonY = tpl.horizon*IMG_SIZE;
  ctx.save();
  const grd = ctx.createLinearGradient(0,horizonY,0,IMG_SIZE);
  grd.addColorStop(0,'hsl(38,55%,55%)');
  grd.addColorStop(1,'hsl(35,45%,40%)');
  ctx.fillStyle = grd; ctx.fillRect(0,horizonY,IMG_SIZE,IMG_SIZE-horizonY);
  for (let i=0;i<4000;i++){
    const x = Math.random()*IMG_SIZE;
    const y = horizonY + Math.random()*(IMG_SIZE-horizonY);
    ctx.fillStyle = `rgba(60,40,20,${Math.random()*0.3})`;
    ctx.fillRect(x,y,2,2);
  }
  ctx.restore();
}

function drawHeroObject(ctx,rng,tpl, silhouettes, sunVec){
  const useSil = silhouettes?.hero?.[tpl.hero];
  if (useSil) {
    // Position heuristics
    const cx = IMG_SIZE*0.48;
    const cy = tpl.hero === 'wheel' ? IMG_SIZE*0.70 : IMG_SIZE*0.72;
    const baseW = tpl.hero === 'wheel' ? IMG_SIZE*0.70 : IMG_SIZE*0.55;
    renderSilhouetteMulti(ctx, useSil, cx, cy, baseW, sunVec);
    return;
  }
  // Fallback procedural hero
  switch(tpl.hero){
    case 'compass': return drawCompassHero(ctx,rng);
    case 'wheel': return drawWheelHero(ctx,rng);
    case 'map_scroll': return drawScrollHero(ctx,rng);
    case 'time_relic': return drawTimeRelicHero(ctx,rng);
    default: return drawCompassHero(ctx,rng);
  }
}

function drawCompassHero(ctx,rng){
  const cx = IMG_SIZE*0.45; const cy = IMG_SIZE*0.72; const R = IMG_SIZE*0.22;
  // outer ring
  const grd = ctx.createLinearGradient(cx-R,cy-R,cx+R,cy+R);
  grd.addColorStop(0,'#4a3420'); grd.addColorStop(1,'#c89c52');
  ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fill();
  // inner face
  ctx.fillStyle = '#f3e6d2'; ctx.beginPath(); ctx.arc(cx,cy,R*0.82,0,Math.PI*2); ctx.fill();
  // tick marks
  ctx.save(); ctx.translate(cx,cy); ctx.strokeStyle='#222';
  for(let i=0;i<360;i+=15){ ctx.save(); ctx.rotate(i*Math.PI/180); ctx.beginPath(); ctx.moveTo(0,-R*0.82); ctx.lineTo(0,-R*0.86); ctx.stroke(); ctx.restore(); }
  // needle
  ctx.fillStyle='#c0392b'; ctx.beginPath(); ctx.moveTo(0,-R*0.55); ctx.lineTo(R*0.06,0); ctx.lineTo(0,R*0.15); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#1d3d6b'; ctx.beginPath(); ctx.moveTo(0,R*0.55); ctx.lineTo(-R*0.06,0); ctx.lineTo(0,-R*0.15); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawWheelHero(ctx,rng){
  const cx = IMG_SIZE*0.5; const cy = IMG_SIZE*0.68; const R = IMG_SIZE*0.28;
  ctx.save();
  ctx.lineWidth = 30; ctx.strokeStyle = '#5d4225'; ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth = 16; ctx.strokeStyle = '#a57434'; ctx.beginPath(); ctx.arc(cx,cy,R*0.7,0,Math.PI*2); ctx.stroke();
  for(let i=0;i<8;i++){ const ang = i*Math.PI/4; const x = cx + Math.cos(ang)*R; const y = cy + Math.sin(ang)*R; ctx.fillStyle='#c28c4a'; ctx.beginPath(); ctx.arc(x,y,40,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
}

function drawScrollHero(ctx,rng){
  const left = IMG_SIZE*0.12; const top = IMG_SIZE*0.62; const w = IMG_SIZE*0.76; const h = IMG_SIZE*0.24;
  const grd = ctx.createLinearGradient(left,top,left+w,top+h);
  grd.addColorStop(0,'#e3d2ae'); grd.addColorStop(1,'#b39258');
  ctx.fillStyle = grd; ctx.fillRect(left,top,w,h);
  ctx.strokeStyle = '#5c4526'; ctx.lineWidth = 20; ctx.strokeRect(left,top,w,h);
  // rolls
  ctx.fillStyle='#6d5130';
  ctx.beginPath(); ctx.arc(left, top+h/2, h/2, Math.PI/2, Math.PI*1.5); ctx.fill();
  ctx.beginPath(); ctx.arc(left+w, top+h/2, h/2, -Math.PI/2, Math.PI/2); ctx.fill();
}

function drawTimeRelicHero(ctx,rng){
  // watch + hourglass simplified
  const watchX = IMG_SIZE*0.42; const watchY = IMG_SIZE*0.74; const R = IMG_SIZE*0.17;
  ctx.fillStyle='#d4c199'; ctx.beginPath(); ctx.arc(watchX,watchY,R,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f5efe4'; ctx.beginPath(); ctx.arc(watchX,watchY,R*0.78,0,Math.PI*2); ctx.fill();
  // hourglass
  const hgX = IMG_SIZE*0.63; const hgY = IMG_SIZE*0.70; const h = IMG_SIZE*0.28; const w = IMG_SIZE*0.12;
  ctx.fillStyle='#4e3b24'; ctx.fillRect(hgX-w/2, hgY-h/2, w, h);
  ctx.fillStyle='rgba(240,230,210,0.85)'; ctx.beginPath(); ctx.moveTo(hgX-w/2,hgY-h/2); ctx.lineTo(hgX+w/2,hgY-h/2); ctx.lineTo(hgX+w/2,hgY-h/2 + h*0.45); ctx.lineTo(hgX-w/2,hgY-h/2 + h*0.55); ctx.closePath(); ctx.fill();
}

function applyAtmosphere(ctx){
  ctx.save();
  const fog = ctx.createLinearGradient(0,IMG_SIZE*0.35,0,IMG_SIZE);
  fog.addColorStop(0,'rgba(255,220,160,0)');
  fog.addColorStop(0.5,'rgba(255,200,140,0.15)');
  fog.addColorStop(1,'rgba(255,180,120,0.35)');
  ctx.fillStyle = fog; ctx.fillRect(0,0,IMG_SIZE,IMG_SIZE);
  ctx.globalCompositeOperation='overlay';
  ctx.fillStyle='rgba(255,180,90,0.15)'; ctx.fillRect(0,0,IMG_SIZE,IMG_SIZE);
  ctx.restore();
}

function gradingPass(ctx){
  const imgData = ctx.getImageData(0,0,IMG_SIZE,IMG_SIZE);
  const d = imgData.data;
  for (let i=0;i<d.length;i+=4){
    // subtle cinematic teal/orange curve
    const r = d[i], g = d[i+1], b = d[i+2];
    d[i] = Math.min(255, r*1.05 + 8);
    d[i+1] = Math.min(255, g*1.02 + 4);
    d[i+2] = Math.min(255, b*0.98 + 2);
    // mild contrast
    for (let c=0;c<3;c++){
      let v = d[i+c]/255; v = (v-0.5)*1.06 + 0.5; d[i+c] = Math.max(0,Math.min(255,v*255));
    }
  }
  ctx.putImageData(imgData,0,0);
  // vignette
  const vg = ctx.createRadialGradient(IMG_SIZE/2,IMG_SIZE/2,IMG_SIZE*0.2, IMG_SIZE/2,IMG_SIZE/2, IMG_SIZE*0.75);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.35)');
  ctx.fillStyle = vg; ctx.fillRect(0,0,IMG_SIZE,IMG_SIZE);
}

function renderScene(rng, index, silhouettes, options){
  const tpl = weightedPick(rng);
  const canvas = createCanvas(IMG_SIZE, IMG_SIZE);
  const ctx = canvas.getContext('2d');

  // Sun vector for lighting (normalized screen space toward viewer)
  const sun = tpl.sun; const sunVec = { x: (sun.x-0.5), y: (sun.y-0.5) };

  drawSky(ctx, tpl, rng);
  drawSunGlow(ctx, tpl);
  drawClouds(ctx, rng);
  if (tpl.key === 'scroll_fortress_channel' || tpl.key === 'compass_vista') drawCliffs(ctx,rng,tpl);
  if (tpl.key === 'deck_wheel_forward') drawDeckPerspective(ctx,rng,tpl);
  if (tpl.key === 'time_relic_sands') drawSand(ctx,rng,tpl); else drawSea(ctx,rng,tpl);
  if (tpl.key !== 'time_relic_sands' && tpl.key !== 'deck_wheel_forward') drawShipSilhouette(ctx,rng,tpl, silhouettes);
  drawHeroObject(ctx,rng,tpl, silhouettes, sunVec);
  applyAtmosphere(ctx);
  gradingPass(ctx);

  return { buffer: canvas.toBuffer('image/png'), template: tpl.key, hero: tpl.hero };
}

async function main(){
  const args = process.argv.slice(2);
  const countArg = args.find(a=>a.startsWith('--count='));
  const seedArg = args.find(a=>a.startsWith('--seed='));
  const count = countArg ? parseInt(countArg.split('=')[1],10) : 8;
  const seed = seedArg ? seedArg.split('=')[1] : 'CINEMATIC-SEED';

  const disableSilArg = args.includes('--no-silhouettes');
  const rng = seedrandom(seed);
  const silhouettes = disableSilArg ? null : await loadSilhouetteAssets();
  if (silhouettes) {
    console.log('Silhouettes loaded:', Object.keys(silhouettes.hero).length, 'hero,', Object.keys(silhouettes.props).length, 'props');
  } else {
    console.log('Silhouettes disabled or none found.');
  }
  await fs.ensureDir(path.join(OUTPUT_DIR,'images'));
  await fs.ensureDir(path.join(OUTPUT_DIR,'metadata'));

  console.log(`🎬 Generating ${count} cinematic scenes (seed: ${seed})...`);
  const metaIndex = [];
  for (let i=0;i<count;i++){
  const { buffer, template, hero } = renderScene(rng, i, silhouettes, {});
    const name = `cinematic_${String(i+1).padStart(3,'0')}`;
    const imgPath = path.join(OUTPUT_DIR,'images', `${name}.png`);
    await fs.writeFile(imgPath, buffer);
    const metadata = {
      name: `Cinematic Treasure Panel #${i+1}`,
      description: 'Cinematic Seychelles pirate adventure scene generated procedurally.',
      image: `ipfs://TO-BE-UPLOADED/${name}.png`,
      attributes: [
        { trait_type: 'Template', value: template },
        { trait_type: 'Hero Object', value: hero },
        { trait_type: 'Seed', value: seed }
      ]
    };
    const metaPath = path.join(OUTPUT_DIR,'metadata', `${name}.json`);
    await fs.writeJson(metaPath, metadata, { spaces: 2 });
    metaIndex.push({ name, template, hero, file: `${name}.png` });
    console.log(`  ✓ ${name} (${template} / ${hero})`);
  }
  await fs.writeJson(path.join(OUTPUT_DIR,'metadata-index.json'), metaIndex, { spaces: 2 });
  console.log(`\n✅ Done. Preview folder: ${OUTPUT_DIR}`);
}

main().catch(err=>{ console.error('Generation failed:', err); process.exit(1); });
