import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/*
Batch generator for multiple advanced painterly scenes with pirate accessory variations (hat, eye patch).
Usage: node scripts/advanced_painterly_batch.js --count=3
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname,'../content/advanced_painterly_example');

function rand(a,b){ return a + Math.random()*(b-a); }
function choice(a){ return a[Math.floor(Math.random()*a.length)]; }

function layeredSky(ctx,w,h){
  const palettes = [
    [ ['#fbe6c2','#f6c177',0,0.22], ['#e89d4d','#c46b32',0.22,0.48], ['#5a3a32','#261b1c',0.48,1] ],
    [ ['#f4d7b8','#ef9f56',0,0.25], ['#d27834','#9b4525',0.25,0.55], ['#3f2b29','#191215',0.55,1] ],
    [ ['#f7e4c8','#f3b976',0,0.2], ['#e0883e','#b65228',0.2,0.5], ['#4c3331','#221717',0.5,1] ]
  ];
  const set = choice(palettes);
  set.forEach(b=>{
    const g = ctx.createLinearGradient(0,h*b[2],0,h*b[3]);
    g.addColorStop(0,b[0]); g.addColorStop(1,b[1]);
    ctx.fillStyle=g; ctx.fillRect(0,h*b[2],w,h*(b[3]-b[2]));
  });
}

function softClouds(ctx,w,h){
  ctx.save(); ctx.globalCompositeOperation='lighter';
  for(let i=0;i<38;i++){
    const cx = rand(-120,w+120); const cy = rand(10,h*0.55);
    const rx = rand(100,380); const ry = rx*rand(0.18,0.4);
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,rx);
    g.addColorStop(0,'rgba(255,255,255,0.9)');
    g.addColorStop(0.5,'rgba(255,255,255,0.35)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.globalAlpha = rand(0.25,0.6); ctx.fillStyle=g;
    ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// Lush Seychelles-style distant green mountains with layered vegetation tones
function distantIslands(ctx,w,h){
  const horizon=h*0.55; ctx.save();
  const layers = 2 + Math.floor(Math.random()*2); // parallax layers
  for(let L=0; L<layers; L++){
    const alphaBase = 0.55 - L*0.18;
    const hueShift = L*8;
    for(let i=0;i<4 + Math.floor(Math.random()*3);i++){
      const baseX = rand(-60,w-80); const width = rand(w*0.12,w*0.24);
      const peak = horizon - rand(90,240) + L*20;
      const g = ctx.createLinearGradient(0,peak,0,horizon);
      g.addColorStop(0,`rgba(${50+hueShift},${100+hueShift*2},${55+hueShift},${alphaBase})`);
      g.addColorStop(1,'rgba(20,40,25,0)');
      ctx.fillStyle=g; ctx.beginPath();
      ctx.moveTo(baseX,horizon);
      ctx.lineTo(baseX+width*0.2, peak+rand(-20,20));
      ctx.lineTo(baseX+width*0.55, peak+rand(-30,30));
      ctx.lineTo(baseX+width, horizon);
      ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();
}

// Midground tropical tree clusters (palms & broad leaves) along reef base or slopes
function tropicalClusters(ctx,w,h){
  const horizon=h*0.55; ctx.save();
  const clusterCount = 10 + Math.floor(Math.random()*6);
  for(let i=0;i<clusterCount;i++){
    const x = Math.random()*w;
    const y = horizon - Math.random()*140 - 10;
    const scale = 0.4 + Math.random()*0.9;
    const palm = Math.random() < 0.55;
    ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
    if(palm){
      // trunk
      ctx.strokeStyle='rgba(70,45,25,0.9)'; ctx.lineWidth=8; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-110); ctx.stroke();
      // fronds
      for(let f=0;f<6;f++){
        const ang = (-Math.PI/2) + (f-2.5)*0.35;
        const len = 120 + Math.random()*40;
        const gx = Math.cos(ang)*len; const gy = Math.sin(ang)*len;
        const grad = ctx.createLinearGradient(0,-110,gx,gy-110);
        grad.addColorStop(0,'rgba(30,80,30,0.9)');
        grad.addColorStop(1,'rgba(70,140,60,0.15)');
        ctx.strokeStyle=grad; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(0,-110); ctx.lineTo(gx,gy-110); ctx.stroke();
      }
    } else {
      // broad leaf bush
      for(let b=0;b<8;b++){
        const lx = rand(-50,50); const ly = rand(-20,-130);
        const r = rand(30,60);
        const leaf = ctx.createRadialGradient(lx,ly,r*0.1,lx,ly,r);
        leaf.addColorStop(0,'rgba(40,100,40,0.9)');
        leaf.addColorStop(1,'rgba(10,40,15,0)');
        ctx.fillStyle=leaf; ctx.beginPath(); ctx.ellipse(lx,ly,r*1.2,r,0,0,Math.PI*2); ctx.fill();
      }
    }
    ctx.restore();
  }
  ctx.restore();
}

function reefSpires(ctx,w,h){
  const horizon=h*0.55; ctx.save();
  const count = 4 + Math.floor(Math.random()*3);
  for(let i=0;i<count;i++){
    const baseX = w*0.25 + i*w*0.12 + rand(-40,40);
    const height = rand(150,300); const topY = horizon - height;
    const width = rand(110,190);
    const layers = 7; let prevY = horizon; let left=baseX - width/2; let right=baseX+width/2;
    for(let l=0;l<layers;l++){
      const t=l/(layers-1); const segTop = horizon - height*t - rand(0,12);
      const c1 = `rgba(80,60,50,${0.82 - t*0.55})`;
      ctx.fillStyle=c1; ctx.beginPath();
      ctx.moveTo(left, prevY);
      const midY = (prevY+segTop)/2 + rand(-18,18);
      ctx.bezierCurveTo(left+rand(10,38), midY, right-rand(10,38), midY, right, segTop);
      ctx.lineTo(right-rand(10,26), segTop-rand(10,26));
      ctx.lineTo(left+rand(10,26), segTop-rand(10,26));
      ctx.closePath(); ctx.fill();
      prevY = segTop;
      left += rand(5,14); right -= rand(5,14);
    }
    // Rim highlight
    ctx.save(); ctx.globalCompositeOperation='overlay';
    const rim = ctx.createLinearGradient(baseX-width/2, topY, baseX+width/2, horizon);
    rim.addColorStop(0,'rgba(255,200,140,0)');
    rim.addColorStop(0.55,'rgba(255,200,140,0.32)');
    rim.addColorStop(1,'rgba(255,140,60,0)');
    ctx.fillStyle=rim; ctx.fillRect(baseX-width/2, topY, width, height);
    ctx.restore();
  }
  ctx.restore();
}

function sunShaft(ctx,w,h){
  const cx=w*0.5, cy=h*0.36; const horizon=h*0.55; ctx.save();
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<120;i++){
    const t = i/120; const y = cy + (horizon-cy)*t;
    const sw = (1-t)*w*0.34 + 100;
    ctx.globalAlpha = (1-t)*0.08;
    ctx.fillStyle='rgba(255,210,140,1)';
    ctx.fillRect(cx - sw/2 + Math.sin(t*8)*12, y, sw, 4);
  }
  ctx.restore();
}

function water(ctx,w,h){
  const horizon=h*0.55; const g = ctx.createLinearGradient(0,horizon,0,h);
  g.addColorStop(0,'#0f5a7a'); g.addColorStop(0.65,'#083247'); g.addColorStop(1,'#031823');
  ctx.fillStyle=g; ctx.fillRect(0,horizon,w,h-horizon);
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(let band=0; band<3; band++){
    const passes = 160 - band*30;
    for(let i=0;i<passes;i++){
      const y = horizon + rand(10,h*0.45);
      const len = rand(70, 540 - band*120);
      const x = rand(-40,w-30);
      const alpha = 0.04 + (1 - (y-horizon)/(h-horizon))*0.17;
      ctx.strokeStyle = `rgba(${200+band*10},${235-band*15},${255-band*25},${alpha})`;
      ctx.lineWidth = rand(1, 2.6-band*0.35);
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len, y+rand(-5,5)); ctx.stroke();
    }
  }
  ctx.restore();
}

// --- Seychelles Environment Enhancements (Batch) ---
function shorelineAndLagoon(ctx,w,h){
  const horizon = h*0.55;
  const shoreY = horizon + h*0.32;
  const sandGrad = ctx.createLinearGradient(0,shoreY-120,0,h);
  sandGrad.addColorStop(0,'#f2ecd9'); sandGrad.addColorStop(0.5,'#e7e1cf'); sandGrad.addColorStop(1,'#d8d3c4');
  ctx.fillStyle=sandGrad; ctx.fillRect(0,shoreY-140,w,h-(shoreY-140));
  ctx.save(); ctx.beginPath(); const curveTop = shoreY - 150; ctx.moveTo(0, curveTop + 40);
  const cp1x = w*0.30, cp1y = curveTop + rand(-40,30); const cp2x = w*0.6, cp2y = curveTop + rand(-20,50);
  ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,w,curveTop+rand(10,60)); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.globalCompositeOperation='destination-out'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation='lighter'; const shallow = ctx.createLinearGradient(0,curveTop,0,curveTop+260);
  shallow.addColorStop(0,'rgba(116,226,214,0.85)'); shallow.addColorStop(0.45,'rgba(80,190,190,0.55)'); shallow.addColorStop(1,'rgba(25,80,90,0.15)');
  ctx.fillStyle=shallow; ctx.beginPath(); ctx.moveTo(0, curveTop+40); ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,w,curveTop+50); ctx.lineTo(w,shoreY+60); ctx.lineTo(0,shoreY+60); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(0,curveTop+42); const segs=34; for(let s=1;s<=segs;s++){ const t=s/segs; const x=t*w; const y=curveTop+40+Math.sin(t*3)*8+rand(-2,2); ctx.lineTo(x,y);} ctx.stroke(); ctx.globalAlpha=0.35; for(let i=0;i<100;i++){ ctx.beginPath(); ctx.arc(rand(0,w), curveTop+60+rand(0,120), rand(1,3.2),0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.fill(); } ctx.restore();
}

function graniteBoulders(ctx,w,h){
  const baseY = h*0.82; const clusters=3; for(let c=0;c<clusters;c++){ const cx = w*(0.12 + c*0.18) + rand(-40,40); const scale = 0.9 + Math.random()*0.6; const rocks = 2 + Math.floor(Math.random()*3); for(let r=0;r<rocks;r++){ const rx = cx + rand(-60,60); const ry = baseY + rand(-20,30); const radW = rand(90,160)*scale; const radH=radW*rand(0.55,0.75); ctx.save(); ctx.translate(rx,ry); ctx.rotate(rand(-0.2,0.2)); for(let p=0;p<4;p++){ const t=p/3; ctx.beginPath(); ctx.ellipse(0,-radH*0.3, radW*(1-t*0.18), radH*(1-t*0.22),0,0,Math.PI*2); const fill = ctx.createLinearGradient(-radW,-radH,radW,radH); fill.addColorStop(0,'rgba(105,92,88,0.9)'); fill.addColorStop(0.5,'rgba(140,122,118,0.75)'); fill.addColorStop(1,'rgba(70,60,64,0.85)'); ctx.fillStyle=fill; ctx.globalAlpha=0.85 - t*0.3; ctx.fill(); } ctx.globalAlpha=0.25; ctx.strokeStyle='rgba(40,30,28,0.9)'; for(let f=0; f<6; f++){ ctx.beginPath(); ctx.moveTo(rand(-radW*0.5,radW*0.5), -radH*0.9); ctx.lineTo(rand(-radW*0.4,radW*0.4), radH*0.4); ctx.stroke(); } ctx.globalAlpha=1; ctx.globalCompositeOperation='overlay'; const hl = ctx.createLinearGradient(radW*0.2,-radH,radW,-radH*0.2); hl.addColorStop(0,'rgba(255,210,160,0)'); hl.addColorStop(1,'rgba(255,190,130,0.55)'); ctx.fillStyle=hl; ctx.beginPath(); ctx.ellipse(0,-radH*0.3,radW*0.9,radH*0.9,0,0,Math.PI*2); ctx.fill(); ctx.restore(); } }
}

function lagoonCaustics(ctx,w,h){
  const horizon=h*0.55; const areaY=horizon+40; const limitY = horizon + h*0.38; ctx.save(); ctx.globalCompositeOperation='screen'; for(let i=0;i<200;i++){ const y=rand(areaY,limitY); const x=rand(0,w); const a=0.03 + (1 - (y-areaY)/(limitY-areaY))*0.23; ctx.fillStyle=`rgba(255,255,255,${a})`; ctx.beginPath(); const rw=rand(4,16); const rh=rw*rand(0.4,0.8); ctx.ellipse(x,y,rw,rh,rand(0,Math.PI),0,Math.PI*2); ctx.fill(); } ctx.restore(); }

function deckForeground(ctx,w,h){
  ctx.save(); const y = h*0.87;
  const g = ctx.createLinearGradient(0,y,0,h);
  g.addColorStop(0,'#2a211c'); g.addColorStop(1,'#1a1411');
  ctx.fillStyle=g; ctx.fillRect(0,y,w,h-y);
  ctx.strokeStyle='rgba(0,0,0,0.35)';
  for(let i=0;i<18;i++){ const px = i*(w/18); ctx.beginPath(); ctx.moveTo(px,y); ctx.lineTo(px,h); ctx.stroke(); }
  ctx.restore();
}

function atmosphere(ctx,w,h){
  ctx.save(); const fog = ctx.createLinearGradient(0,h*0.35,0,h);
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
    const n = (Math.random()-0.5)*28;
    d[i] = Math.max(0,Math.min(255,d[i]+n*0.55));
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

// (Simplified) character generator with accessories
function character(ctx,{x,y,scale=1,pose='default',hat=false,eyePatch=false}){
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  const coats = ['#3b2d25','#2e313b','#362f27'];
  const coat = choice(coats); const skin='#d6b18a'; const trim='#c28842'; const accent='#7d4d2c';
  for(let i=0;i<3;i++){
    ctx.fillStyle = coat; ctx.beginPath(); ctx.moveTo(-30+rand(-4,4), -94+rand(-4,4));
    ctx.bezierCurveTo(-48,-42,48,-42,30+rand(-4,4),-94+rand(-4,4));
    ctx.lineTo(26+rand(-4,4), -6+rand(-4,4)); ctx.bezierCurveTo(8,12,-8,12,-26+rand(-4,4),-6+rand(-4,4));
    ctx.closePath(); ctx.globalAlpha=0.72; ctx.fill();
  }
  ctx.globalAlpha=1;
  // head
  ctx.fillStyle=skin; ctx.beginPath(); ctx.ellipse(0,-114,22,26,0,0,Math.PI*2); ctx.fill();
  // eye patch support
  ctx.save(); ctx.fillStyle='rgba(40,30,25,0.65)';
  if(!eyePatch){ ctx.beginPath(); ctx.ellipse(-8,-118,3.3,4,0,0,Math.PI*2); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(8,-118,3.3,4,0,0,Math.PI*2); ctx.fill();
  if(eyePatch){ ctx.fillStyle='#090a0b'; ctx.beginPath(); ctx.ellipse(-8,-118,6.5,7.5,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#111'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-28,-126); ctx.lineTo(12,-112); ctx.stroke(); }
  ctx.restore();
  // hat
  if(hat){ ctx.save(); ctx.translate(0,-134); ctx.fillStyle='#1b1412'; ctx.beginPath(); ctx.moveTo(-38,6); ctx.quadraticCurveTo(-8,-24,0,-22); ctx.quadraticCurveTo(8,-24,38,6); ctx.quadraticCurveTo(0,-4,-38,6); ctx.closePath(); ctx.fill(); ctx.strokeStyle='#c99a44'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(-32,2); ctx.quadraticCurveTo(0,-8,32,2); ctx.stroke(); ctx.restore(); }
  // arms
  ctx.strokeStyle=coat; ctx.lineCap='round'; ctx.lineWidth=14;
  if(pose==='spyglass'){ ctx.beginPath(); ctx.moveTo(-6,-68); ctx.lineTo(-100,-96); ctx.stroke(); ctx.beginPath(); ctx.moveTo(8,-68); ctx.lineTo(64,-38); ctx.stroke(); ctx.fillStyle='#d4b37a'; ctx.fillRect(-108,-104,38,18); }
  else if(pose==='chart'){ ctx.beginPath(); ctx.moveTo(-12,-68); ctx.lineTo(-50,-28); ctx.stroke(); ctx.beginPath(); ctx.moveTo(12,-68); ctx.lineTo(50,-28); ctx.stroke(); ctx.fillStyle='#e7d6b0'; ctx.fillRect(-54,-38,108,32); }
  else if(pose==='rigging'){ ctx.beginPath(); ctx.moveTo(-12,-68); ctx.lineTo(-12,-150); ctx.stroke(); ctx.beginPath(); ctx.moveTo(12,-68); ctx.lineTo(64,-8); ctx.stroke(); ctx.strokeStyle='#d5c2a0'; ctx.lineWidth=5; for(let r=0;r<4;r++){ ctx.beginPath(); ctx.moveTo(-12,-150+r*26); ctx.lineTo(56,-8+r*10); ctx.stroke(); } }
  else { ctx.beginPath(); ctx.moveTo(-12,-68); ctx.lineTo(-64,-38); ctx.stroke(); ctx.beginPath(); ctx.moveTo(12,-68); ctx.lineTo(64,-38); ctx.stroke(); }
  // sash
  ctx.fillStyle=trim; ctx.globalAlpha=0.8; ctx.fillRect(-30,-52,60,16); ctx.globalAlpha=1;
  // lower body
  ctx.fillStyle=accent; ctx.globalAlpha=0.7; ctx.beginPath(); ctx.ellipse(0,2,42,24,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.restore();
}

function generateScene(index){
  const W=1600,H=1000; const canvas=createCanvas(W,H); const ctx=canvas.getContext('2d');
  layeredSky(ctx,W,H); softClouds(ctx,W,H); distantIslands(ctx,W,H); sunShaft(ctx,W,H); reefSpires(ctx,W,H); tropicalClusters(ctx,W,H); water(ctx,W,H); shorelineAndLagoon(ctx,W,H); lagoonCaustics(ctx,W,H); graniteBoulders(ctx,W,H); deckForeground(ctx,W,H);
  // Character layout variants
  const layout = choice(['A','B','C']);
  if(layout==='A'){
    character(ctx,{x:W*0.24,y:H*0.86,scale:1.16,pose:'spyglass',hat:true});
    character(ctx,{x:W*0.46,y:H*0.84,scale:1.05,pose:'chart',eyePatch:true});
    character(ctx,{x:W*0.66,y:H*0.86,scale:1.1,pose:'rigging',hat:true});
  } else if(layout==='B'){
    character(ctx,{x:W*0.30,y:H*0.86,scale:1.18,pose:'chart',hat:true});
    character(ctx,{x:W*0.52,y:H*0.84,scale:1.08,pose:'spyglass',eyePatch:true});
    character(ctx,{x:W*0.70,y:H*0.87,scale:1.12,pose:'rigging'});
  } else {
    character(ctx,{x:W*0.26,y:H*0.86,scale:1.14,pose:'rigging',hat:true});
    character(ctx,{x:W*0.48,y:H*0.84,scale:1.06,pose:'chart'});
    character(ctx,{x:W*0.68,y:H*0.86,scale:1.12,pose:'spyglass',hat:true,eyePatch:true});
  }
  atmosphere(ctx,W,H); painterlyNoise(ctx,W,H); grading(ctx,W,H);
  return canvas.toBuffer('image/png');
}

async function main(){
  await fs.ensureDir(OUT_DIR);
  const args = process.argv.slice(2); const cArg = args.find(a=>a.startsWith('--count='));
  const count = cArg? parseInt(cArg.split('=')[1],10):3;
  for(let i=1;i<=count;i++){
    const buf = generateScene(i);
    const outPath = path.join(OUT_DIR, `advanced_painterly_${String(i+1).padStart(2,'0')}.png`);
    await fs.writeFile(outPath, buf);
    // Write placeholder premint metadata sidecar for future DB ingestion
    const meta = {
      name: `PreMint Painterly Scene ${i}`,
      description: 'Work-in-progress Seychelles painterly pirate scene',
      collectionPhase: 'premint',
      attributes: [
        { trait_type: 'Phase', value: 'Pre-Mint' },
        { trait_type: 'Style', value: 'Painterly' }
      ],
      image: `./advanced_painterly_${String(i+1).padStart(2,'0')}.png`
    };
    await fs.writeJson(outPath.replace(/\.png$/,'.json'), meta, { spaces: 2 });
    console.log('✓ Generated', outPath, 'and metadata');
  }
  console.log('Batch complete.');
}

main().catch(e=>{ console.error(e); process.exit(1); });
