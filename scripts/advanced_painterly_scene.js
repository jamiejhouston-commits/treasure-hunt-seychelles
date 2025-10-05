import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/*
 Advanced Painterly Procedural Scene (No external image assets)
 Goal: Move away from primitive blocky look toward layered painterly strokes, gradient-masked forms, multi-part characters.
 Scene: "Approach to the Hidden Anchorage"
 Elements:
  - Layered sky with stratified color bands & soft volumetric clouds
  - Sun shaft through cliff gap
  - Distant silhouette archipelago with atmospheric depth
  - Midground towering reef spires (jagged shapes built from noisy bezier stacks)
  - Dynamic water with multi-frequency wave strokes & reflective highlights lane
  - Ship deck foreground (implied) with three multi-part characters: captain (spyglass), navigator (chart table), lookout (rigging) all constructed from layered forms & soft shading
  - Painterly texture noise pass & subtle color grading
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname,'../content/advanced_painterly_example');

function rand(a,b){ return a + Math.random()*(b-a); }
function choice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function layeredSky(ctx,w,h){
  const bands = [
    { c1:'#fbe6c2', c2:'#f6c177', from:0, to:0.22 },
    { c1:'#e89d4d', c2:'#c46b32', from:0.22, to:0.48 },
    { c1:'#5a3a32', c2:'#261b1c', from:0.48, to:1.0 }
  ];
  bands.forEach(b=>{
    const g = ctx.createLinearGradient(0,h*b.from,0,h*b.to);
    g.addColorStop(0,b.c1); g.addColorStop(1,b.c2);
    ctx.fillStyle=g; ctx.fillRect(0,h*b.from,w,h*(b.to-b.from));
  });
}

function softClouds(ctx,w,h){
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<40;i++){
    const cx = rand(-100,w+100); const cy = rand(20,h*0.55);
    const rx = rand(120,420); const ry = rx*rand(0.18,0.38);
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,rx);
    g.addColorStop(0,'rgba(255,255,255,0.9)');
    g.addColorStop(0.5,'rgba(255,255,255,0.35)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.globalAlpha = rand(0.25,0.65);
    ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// Lush green mountainous backdrop (tropical Seychelles style)
function distantIslands(ctx,w,h){
  const horizon=h*0.55; ctx.save();
  const layers = 2; // parallax layers for depth
  for(let L=0; L<layers; L++){
    const alphaBase = 0.55 - L*0.20;
    const hueShift = L*10;
    for(let i=0;i<5;i++){
      const baseX = rand(-80,w-100); const width = rand(w*0.14,w*0.26);
      const peak = horizon - rand(100,260) + L*26;
      const g = ctx.createLinearGradient(0,peak,0,horizon);
      g.addColorStop(0,`rgba(${50+hueShift},${110+hueShift*2},${55+hueShift},${alphaBase})`);
      g.addColorStop(1,'rgba(25,50,28,0)');
      ctx.fillStyle=g; ctx.beginPath();
      ctx.moveTo(baseX,horizon);
      ctx.lineTo(baseX+width*0.2, peak+rand(-20,30));
      ctx.lineTo(baseX+width*0.55, peak+rand(-40,40));
      ctx.lineTo(baseX+width, horizon);
      ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();
}

// Tropical vegetation clusters (palms / broadleaf) sprinkled mid layer
function tropicalClusters(ctx,w,h){
  const horizon=h*0.55; ctx.save();
  const clusterCount = 12;
  for(let i=0;i<clusterCount;i++){
    const x = Math.random()*w;
    const y = horizon - Math.random()*150 - 10;
    const scale = 0.45 + Math.random()*0.85;
    const palm = Math.random() < 0.6;
    ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
    if(palm){
      ctx.strokeStyle='rgba(70,45,25,0.9)'; ctx.lineWidth=8; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-120); ctx.stroke();
      for(let f=0;f<6;f++){
        const ang = (-Math.PI/2) + (f-2.5)*0.36; const len = 130 + Math.random()*40;
        const gx = Math.cos(ang)*len; const gy = Math.sin(ang)*len;
        const grad = ctx.createLinearGradient(0,-120,gx,gy-120);
        grad.addColorStop(0,'rgba(30,80,30,0.9)'); grad.addColorStop(1,'rgba(70,140,60,0.15)');
        ctx.strokeStyle=grad; ctx.lineWidth=11; ctx.beginPath(); ctx.moveTo(0,-120); ctx.lineTo(gx,gy-120); ctx.stroke();
      }
    } else {
      for(let b=0;b<8;b++){
        const lx = rand(-56,56); const ly = rand(-20,-140); const r = rand(34,70);
        const leaf = ctx.createRadialGradient(lx,ly,r*0.12,lx,ly,r);
        leaf.addColorStop(0,'rgba(40,100,40,0.9)'); leaf.addColorStop(1,'rgba(10,40,15,0)');
        ctx.fillStyle=leaf; ctx.beginPath(); ctx.ellipse(lx,ly,r*1.25,r,0,0,Math.PI*2); ctx.fill();
      }
    }
    ctx.restore();
  }
  ctx.restore();
}

function reefSpires(ctx,w,h){
  const horizon=h*0.55; ctx.save();
  for(let i=0;i<5;i++){
    const baseX = w*0.28 + i*w*0.1 + rand(-40,40);
    const height = rand(160,320); const topY = horizon - height;
    const width = rand(120,200);
    // Build jagged vertical spire with stacked bezier layers
    const layers = 8; let prevY = horizon; let left=baseX - width/2; let right=baseX+width/2;
    for(let l=0;l<layers;l++){
      const t=l/(layers-1); const segTop = horizon - height*t - rand(0,10);
      const c1 = `rgba(80,60,50,${0.85 - t*0.6})`;
      ctx.fillStyle=c1; ctx.beginPath();
      ctx.moveTo(left, prevY);
      const midY = (prevY+segTop)/2 + rand(-20,20);
      ctx.bezierCurveTo(left+rand(10,40), midY, right-rand(10,40), midY, right, segTop);
      ctx.lineTo(right-rand(10,30), segTop-rand(10,30));
      ctx.lineTo(left+rand(10,30), segTop-rand(10,30));
      ctx.closePath(); ctx.fill();
      prevY = segTop;
      // inward taper
      left += rand(6,16); right -= rand(6,16);
    }
    // Rim highlight
    ctx.save(); ctx.globalCompositeOperation='overlay';
    const rim = ctx.createLinearGradient(baseX-width/2, topY, baseX+width/2, horizon);
    rim.addColorStop(0,'rgba(255,200,140,0)');
    rim.addColorStop(0.55,'rgba(255,200,140,0.35)');
    rim.addColorStop(1,'rgba(255,140,60,0)');
    ctx.fillStyle=rim; ctx.fillRect(baseX-width/2, topY, width, height);
    ctx.restore();
  }
  ctx.restore();
}

function sunShaft(ctx,w,h){
  const cx=w*0.52, cy=h*0.36; const horizon=h*0.55; ctx.save();
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<130;i++){
    const t = i/130; const y = cy + (horizon-cy)*t;
    const sw = (1-t)*w*0.32 + 120;
    ctx.globalAlpha = (1-t)*0.08;
    ctx.fillStyle='rgba(255,210,140,1)';
    ctx.fillRect(cx - sw/2 + Math.sin(t*7)*14, y, sw, 4);
  }
  ctx.restore();
}

function water(ctx,w,h){
  const horizon=h*0.55; const g = ctx.createLinearGradient(0,horizon,0,h);
  g.addColorStop(0,'#0f5a7a'); g.addColorStop(0.65,'#083247'); g.addColorStop(1,'#031823');
  ctx.fillStyle=g; ctx.fillRect(0,horizon,w,h-horizon);
  // Multi-frequency strokes
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(let band=0; band<3; band++){
    const passes = 180 - band*40;
    for(let i=0;i<passes;i++){
      const y = horizon + rand(10,h*0.45);
      const len = rand(80, 580 - band*120);
      const x = rand(-50,w-30);
      const alpha = 0.04 + (1 - (y-horizon)/(h-horizon))*0.18;
      ctx.strokeStyle = `rgba(${200+band*10},${235-band*15},${255-band*25},${alpha})`;
      ctx.lineWidth = rand(1, 2.8-band*0.4);
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len, y+rand(-5,5)); ctx.stroke();
    }
  }
  ctx.restore();
}

// --- Seychelles Environment Enhancements ---
// Curved shoreline with sand + shallow lagoon gradient & foam
function shorelineAndLagoon(ctx,w,h){
  const horizon = h*0.55;
  const shoreY = horizon + h*0.32; // approximate beach zone start
  // Sand base gradient
  const sandGrad = ctx.createLinearGradient(0,shoreY-120,0,h);
  sandGrad.addColorStop(0,'#f2ecd9');
  sandGrad.addColorStop(0.5,'#e7e1cf');
  sandGrad.addColorStop(1,'#d8d3c4');
  ctx.fillStyle=sandGrad; ctx.fillRect(0,shoreY-140,w,h-(shoreY-140));
  // Curved shoreline path (s-curve)
  ctx.save();
  ctx.beginPath();
  const curveTop = shoreY - 150;
  ctx.moveTo(0, curveTop + 40);
  const cp1x = w*0.28, cp1y = curveTop + rand(-40,20);
  const cp2x = w*0.58, cp2y = curveTop + rand(-10,60);
  ctx.bezierCurveTo(cp1x,cp1y, cp2x,cp2y, w, curveTop + rand(10,60));
  ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
  // Lagoon mask cutout
  ctx.globalCompositeOperation='destination-out';
  ctx.fill();
  ctx.restore();
  // Lagoon shallow fill (re-add water color at higher lightness)
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  const shallow = ctx.createLinearGradient(0, curveTop, 0, curveTop+260);
  shallow.addColorStop(0,'rgba(116,226,214,0.85)');
  shallow.addColorStop(0.45,'rgba(80,190,190,0.55)');
  shallow.addColorStop(1,'rgba(25,80,90,0.15)');
  ctx.fillStyle=shallow;
  ctx.beginPath();
  ctx.moveTo(0, curveTop+40);
  ctx.bezierCurveTo(cp1x,cp1y, cp2x,cp2y, w, curveTop + 50);
  ctx.lineTo(w,shoreY+60); ctx.lineTo(0,shoreY+60); ctx.closePath();
  ctx.fill();
  ctx.restore();
  // Foam edge
  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,0.85)';
  ctx.lineWidth=3.2; ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(0, curveTop + 42);
  const segs = 38;
  for(let s=1;s<=segs;s++){
    const t = s/segs;
    const x = t*w;
    // Reconstruct approximated curve y via lerp of control points (simplification)
    const yBase = curveTop + 40 + Math.sin(t*3)*8 + rand(-2,2);
    ctx.lineTo(x, yBase);
  }
  ctx.stroke();
  ctx.globalAlpha=0.35;
  for(let i=0;i<120;i++){
    ctx.beginPath();
    ctx.arc(rand(0,w), curveTop + 60 + rand(0,120), rand(1,3.4), 0, Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.12)';
    ctx.fill();
  }
  ctx.restore();
}

// Granite boulder clusters (foreground accents)
function graniteBoulders(ctx,w,h){
  const baseY = h*0.82; const clusterCount = 3;
  for(let c=0;c<clusterCount;c++){
    const cx = w*(0.12 + c*0.18) + rand(-40,40);
    const scale = 0.9 + Math.random()*0.6;
    const rocks = 2 + Math.floor(Math.random()*3);
    for(let r=0;r<rocks;r++){
      const rx = cx + rand(-60,60); const ry = baseY + rand(-20,30);
      const radW = rand(90,160)*scale; const radH = radW*rand(0.55,0.75);
      // base shape
      ctx.save();
      ctx.translate(rx,ry);
      ctx.rotate(rand(-0.2,0.2));
      // layering passes for soft form
      for(let p=0;p<4;p++){
        const t = p/3;
        ctx.beginPath();
        ctx.ellipse(0, -radH*0.3, radW*(1-t*0.18), radH*(1-t*0.22), 0, 0, Math.PI*2);
        const fill = ctx.createLinearGradient(-radW, -radH, radW, radH);
        fill.addColorStop(0,'rgba(105,92,88,0.9)');
        fill.addColorStop(0.5,'rgba(140,122,118,0.75)');
        fill.addColorStop(1,'rgba(70,60,64,0.85)');
        ctx.fillStyle=fill; ctx.globalAlpha=0.85 - t*0.3; ctx.fill();
      }
      // Vertical fluting lines (erosion)
      ctx.globalAlpha=0.25; ctx.strokeStyle='rgba(40,30,28,0.9)';
      for(let f=0; f<6; f++){
        ctx.beginPath(); ctx.moveTo(rand(-radW*0.5,radW*0.5), -radH*0.9);
        ctx.lineTo(rand(-radW*0.4,radW*0.4), radH*0.4); ctx.stroke();
      }
      ctx.globalAlpha=1;
      // Warm highlight glaze (sun from upper right)
      ctx.globalCompositeOperation='overlay';
      const hl = ctx.createLinearGradient(radW*0.2,-radH,radW,-radH*0.2);
      hl.addColorStop(0,'rgba(255,210,160,0)');
      hl.addColorStop(1,'rgba(255,190,130,0.55)');
      ctx.fillStyle=hl; ctx.beginPath(); ctx.ellipse(0,-radH*0.3,radW*0.9,radH*0.9,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }
}

// Water caustic sparkle accents in shallow area
function lagoonCaustics(ctx,w,h){
  const horizon = h*0.55; const areaY = horizon + 40; const limitY = horizon + h*0.38;
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(let i=0;i<220;i++){
    const y = rand(areaY, limitY);
    const x = rand(0,w);
    const a = 0.03 + (1 - (y-areaY)/(limitY-areaY))*0.25;
    ctx.fillStyle=`rgba(255,255,255,${a})`;
    ctx.beginPath();
    const rw = rand(4,18); const rh = rw*rand(0.4,0.8);
    ctx.ellipse(x,y,rw,rh,rand(0,Math.PI),0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

// Character composed of layered shapes with soft shading + optional accessories (hat, eye patch)
function character(ctx,{x,y,scale=1,pose='default',facing=1,role='crew',hat=false,eyePatch=false}){
  ctx.save(); ctx.translate(x,y); ctx.scale(scale*facing,scale);
  // base palette variant
  const paletteVariants = [
    { coat:'#3b2d25', trim:'#c28842', skin:'#d6b18a', accent:'#7d4d2c' },
    { coat:'#2e313b', trim:'#b48c3a', skin:'#d9b495', accent:'#6c3f2a' },
    { coat:'#362f27', trim:'#d09a45', skin:'#d7b08a', accent:'#74462c' }
  ];
  const pal = choice(paletteVariants);
  // Rough painterly torso (stacked paths)
  for(let i=0;i<4;i++){
    ctx.fillStyle = pal.coat;
    ctx.beginPath();
    ctx.moveTo(-32+rand(-4,4), -96+rand(-4,4));
    ctx.bezierCurveTo(-50, -40, 50, -40, 32+rand(-4,4), -96+rand(-4,4));
    ctx.lineTo(28+rand(-4,4), -4+rand(-4,4));
    ctx.bezierCurveTo(10, 14, -10, 14, -28+rand(-4,4), -4+rand(-4,4));
    ctx.closePath(); ctx.globalAlpha=0.75; ctx.fill();
  }
  ctx.globalAlpha=1;
  // Head base
  ctx.fillStyle=pal.skin; ctx.beginPath(); ctx.ellipse(0,-116,24,28,0,0,Math.PI*2); ctx.fill();
  // Simple facial suggestion (eyes) unless covered by patch
  ctx.save();
  ctx.fillStyle='rgba(40,30,25,0.65)';
  if(!eyePatch){
    ctx.beginPath(); ctx.ellipse(-8,-120,3.5,4,0,0,Math.PI*2); ctx.fill();
  }
  ctx.beginPath(); ctx.ellipse(8,-120,3.5,4,0,0,Math.PI*2); ctx.fill();
  // Eye patch (left eye from viewer perspective)
  if(eyePatch){
    ctx.fillStyle='#0a0a0c'; ctx.beginPath(); ctx.ellipse(-8,-120,7,8,0,0,Math.PI*2); ctx.fill();
    // Strap
    ctx.strokeStyle='#111'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-30,-128); ctx.lineTo(14,-114); ctx.stroke();
  }
  ctx.restore();
  // Shadow under head
  ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0,-98,30,12,0,0,Math.PI*2); ctx.fill();
  // Pirate hat
  if(hat){
    ctx.save();
    ctx.translate(0,-138);
    ctx.fillStyle='#1b1412';
    ctx.beginPath();
    ctx.moveTo(-40,6);
    ctx.quadraticCurveTo(-10,-26,0,-24);
    ctx.quadraticCurveTo(10,-26,40,6);
    ctx.quadraticCurveTo(0,-6,-40,6);
    ctx.closePath(); ctx.fill();
    // Brim / trim
    ctx.strokeStyle='#c99a44'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(-34,2); ctx.quadraticCurveTo(0,-10,34,2); ctx.stroke();
    ctx.restore();
  }
  // Arms (pose)
  ctx.strokeStyle=pal.coat; ctx.lineCap='round'; ctx.lineWidth=16;
  if(pose==='spyglass'){
    ctx.beginPath(); ctx.moveTo(-8,-70); ctx.lineTo(-110,-100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10,-70); ctx.lineTo(70,-40); ctx.stroke();
    // spyglass primitive
    ctx.fillStyle='#d4b37a'; ctx.fillRect(-118,-110,40,20);
  } else if(pose==='chart'){
    ctx.beginPath(); ctx.moveTo(-14,-70); ctx.lineTo(-56,-28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16,-70); ctx.lineTo(56,-28); ctx.stroke();
    ctx.fillStyle='#e7d6b0'; ctx.fillRect(-60,-40,120,34);
  } else if(pose==='rigging'){
    ctx.beginPath(); ctx.moveTo(-14,-70); ctx.lineTo(-14,-160); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14,-70); ctx.lineTo(70,-10); ctx.stroke();
    ctx.strokeStyle='#d5c2a0'; ctx.lineWidth=6;
    for(let r=0;r<4;r++){ ctx.beginPath(); ctx.moveTo(-14,-160+r*28); ctx.lineTo(60,-10+r*10); ctx.stroke(); }
  } else {
    ctx.beginPath(); ctx.moveTo(-14,-70); ctx.lineTo(-70,-40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14,-70); ctx.lineTo(70,-40); ctx.stroke();
  }
  // Accent sash
  ctx.fillStyle=pal.trim; ctx.globalAlpha=0.85; ctx.fillRect(-34,-54,68,18); ctx.globalAlpha=1;
  // Lower body suggestion
  ctx.fillStyle=pal.accent; ctx.globalAlpha=0.7; ctx.beginPath(); ctx.ellipse(0,4,46,26,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.restore();
}

function deckForeground(ctx,w,h){
  ctx.save(); const y = h*0.87;
  const g = ctx.createLinearGradient(0,y,0,h);
  g.addColorStop(0,'#2a211c'); g.addColorStop(1,'#1a1411');
  ctx.fillStyle=g; ctx.fillRect(0,y,w,h-y);
  // Plank lines
  ctx.strokeStyle='rgba(0,0,0,0.35)';
  for(let i=0;i<18;i++){ const px = i*(w/18); ctx.beginPath(); ctx.moveTo(px,y); ctx.lineTo(px,h); ctx.stroke(); }
  ctx.restore();
}

function atmosphere(ctx,w,h){
  ctx.save();
  const fog = ctx.createLinearGradient(0,h*0.35,0,h);
  fog.addColorStop(0,'rgba(255,210,150,0.0)');
  fog.addColorStop(0.55,'rgba(255,185,120,0.18)');
  fog.addColorStop(1,'rgba(255,150,90,0.42)');
  ctx.fillStyle=fog; ctx.fillRect(0,0,w,h);
  ctx.globalCompositeOperation='overlay';
  ctx.fillStyle='rgba(255,160,80,0.18)'; ctx.fillRect(0,0,w,h);
  ctx.restore();
}

function painterlyNoise(ctx,w,h){
  const img = ctx.getImageData(0,0,w,h); const d=img.data;
  for(let i=0;i<d.length;i+=4){
    const n = (Math.random()-0.5)*30; // subtle noise
    d[i] = Math.max(0,Math.min(255,d[i]+n*0.6));
    d[i+1] = Math.max(0,Math.min(255,d[i+1]+n*0.4));
    d[i+2] = Math.max(0,Math.min(255,d[i+2]+n*0.3));
  }
  ctx.putImageData(img,0,0);
}

function grading(ctx,w,h){
  const img = ctx.getImageData(0,0,w,h); const d=img.data;
  for(let i=0;i<d.length;i+=4){
    d[i] = Math.min(255, d[i]*1.05 + 6);
    d[i+1] = Math.min(255, d[i+1]*1.02 + 4);
    d[i+2] = Math.min(255, d[i+2]*0.98 + 2);
  }
  ctx.putImageData(img,0,0);
  const v = ctx.createRadialGradient(w/2,h/2,w*0.25, w/2,h/2,w*0.78);
  v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,0.38)');
  ctx.fillStyle=v; ctx.fillRect(0,0,w,h);
}

async function main(){
  await fs.ensureDir(OUT_DIR);
  const W=1600, H=1000; const canvas = createCanvas(W,H); const ctx = canvas.getContext('2d');
  layeredSky(ctx,W,H);
  softClouds(ctx,W,H);
  distantIslands(ctx,W,H);
  tropicalClusters(ctx,W,H);
  sunShaft(ctx,W,H);
  reefSpires(ctx,W,H);
  water(ctx,W,H);
  shorelineAndLagoon(ctx,W,H); // overlays sand + shallow lagoon modifications
  lagoonCaustics(ctx,W,H);
  graniteBoulders(ctx,W,H);
  deckForeground(ctx,W,H);
  // Characters
  character(ctx,{x:W*0.26,y:H*0.86,scale:1.18,pose:'spyglass',hat:true});
  character(ctx,{x:W*0.48,y:H*0.83,scale:1.08,pose:'chart',eyePatch:true});
  character(ctx,{x:W*0.66,y:H*0.85,scale:1.12,pose:'rigging',hat:true});
  atmosphere(ctx,W,H);
  painterlyNoise(ctx,W,H);
  grading(ctx,W,H);
  const outPath = path.join(OUT_DIR,'advanced_painterly_01.png');
  await fs.writeFile(outPath, canvas.toBuffer('image/png'));
  console.log('Advanced painterly scene created at', outPath);
}

main().catch(e=>{ console.error(e); process.exit(1); });
