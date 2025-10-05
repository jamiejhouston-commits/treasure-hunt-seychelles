import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/*
 Vector Story Scene (Procedural Only) - No external silhouettes or pasted images
 Title: "Crossing the Reef at Dusk"
 Goals:
  - Demonstrate fully original vector shapes: characters, ship elements, environment
  - Layered depth: background sky > distant isles > mid reef arches > water > ship deck foreground
  - Distinct character poses built from primitive forms (no silhouettes): lookout, helmsman, cartographer, signal flag runner
  - Cinematic lighting path toward sun gap between reef arches
 Output: content/story_vector_example/vector_story_01.png
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname,'../content/story_vector_example');

function rand(a,b){ return a + Math.random()*(b-a); }

function drawSky(ctx,w,h){
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#f7d9a2');
  g.addColorStop(0.45,'#e49946');
  g.addColorStop(0.82,'#4a2c28');
  g.addColorStop(1,'#1b1418');
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
}

function drawSunGap(ctx,w,h){
  const cx=w*0.55, cy=h*0.38; const r=h*0.11;
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*3.1);
  g.addColorStop(0,'rgba(255,245,200,1)');
  g.addColorStop(0.25,'rgba(255,210,130,0.85)');
  g.addColorStop(0.6,'rgba(255,160,80,0.28)');
  g.addColorStop(1,'rgba(255,120,40,0)');
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawDistantIsles(ctx,w,h){
  const horizon=h*0.56;
  ctx.save();
  for(let i=0;i<5;i++){
    const baseX = i*(w/4.5)+rand(-40,60);
    const peak = horizon - rand(60,200);
    const width = rand(w*0.15,w*0.28);
    const g = ctx.createLinearGradient(0,peak,0,horizon);
    g.addColorStop(0,'rgba(60,70,85,0.9)');
    g.addColorStop(1,'rgba(20,28,36,0)');
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(baseX,horizon);
    ctx.lineTo(baseX+width*0.15, peak+rand(-10,20));
    ctx.lineTo(baseX+width*0.55, peak+rand(-20,30));
    ctx.lineTo(baseX+width, horizon);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawReefArches(ctx,w,h){
  const horizon=h*0.56;
  ctx.save();
  const arches = 3;
  for(let i=0;i<arches;i++){
    const cx = w*0.38 + i*w*0.14 + rand(-20,20);
    const archW = w*0.11 + rand(-10,40);
    const archH = h*0.18 + rand(-30,30);
    const topY = horizon - archH;
    // base mass
    const baseColor = `rgba(70,55,45,0.88)`;
    ctx.fillStyle=baseColor;
    ctx.beginPath();
    ctx.moveTo(cx-archW, horizon);
    ctx.lineTo(cx-archW*0.5, topY+rand(-15,5));
    ctx.quadraticCurveTo(cx, topY-rand(10,40), cx+archW*0.5, topY+rand(-5,20));
    ctx.lineTo(cx+archW, horizon);
    ctx.closePath();
    ctx.fill();
    // carve arch gap
    ctx.save();
    ctx.globalCompositeOperation='destination-out';
    ctx.beginPath();
    ctx.ellipse(cx, horizon-archH*0.25, archW*0.55, archH*0.55, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
    // warm rim
    ctx.save();
    ctx.globalCompositeOperation='overlay';
    const rim = ctx.createLinearGradient(cx-archW, topY, cx+archW, horizon);
    rim.addColorStop(0,'rgba(255,170,110,0.0)');
    rim.addColorStop(0.5,'rgba(255,170,110,0.35)');
    rim.addColorStop(1,'rgba(255,200,140,0)');
    ctx.fillStyle=rim; ctx.fillRect(cx-archW, topY, archW*2, archH);
    ctx.restore();
  }
  ctx.restore();
}

function drawSea(ctx,w,h){
  const horizon=h*0.56;
  const g=ctx.createLinearGradient(0,horizon,0,h);
  g.addColorStop(0,'#11465d');
  g.addColorStop(1,'#04151c');
  ctx.fillStyle=g; ctx.fillRect(0,horizon,w,h-horizon);
  // Light lane
  ctx.save();
  ctx.globalCompositeOperation='screen';
  for(let i=0;i<200;i++){
    const t=i/200;
    const y=horizon + t*(h-horizon);
    const laneW=(1-t)*w*0.40 + 50;
    const alpha=(1-t)*0.25;
    const x=w*0.55 - laneW/2 + Math.sin(t*9)*15;
    ctx.fillStyle=`rgba(255,200,120,${alpha})`;
    ctx.fillRect(x,y,laneW,2);
  }
  ctx.restore();
  // Sparkle specks
  for(let i=0;i<300;i++){
    const y=horizon + Math.random()*(h-horizon);
    const x=Math.random()*w;
    const a=(1-(y-horizon)/(h-horizon))*0.8;
    ctx.fillStyle=`rgba(255,240,200,${a*Math.random()*0.6})`;
    ctx.fillRect(x,y,2,2);
  }
}

// Character primitive builder
function drawCharacter(ctx,opts){
  const {x,y,scale=1,pose='default',facing=1} = opts;
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(scale*facing,scale);
  // base colors
  const coat='#332620';
  const trim='#c58a42';
  const skin='#d8b48a';
  // Torso
  ctx.fillStyle=coat; ctx.fillRect(-28,-100,56,90);
  // Head
  ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-115,22,0,Math.PI*2); ctx.fill();
  // Trim sash
  ctx.fillStyle=trim; ctx.fillRect(-28,-70,56,16);
  // Arms (pose variants)
  ctx.strokeStyle=coat; ctx.lineWidth=14; ctx.lineCap='round';
  if(pose==='point'){
    ctx.beginPath(); ctx.moveTo(-10,-70); ctx.lineTo(-90,-120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10,-70); ctx.lineTo(70,-40); ctx.stroke();
  } else if(pose==='hold_map'){
    ctx.beginPath(); ctx.moveTo(-14,-70); ctx.lineTo(-40,-30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14,-70); ctx.lineTo(40,-30); ctx.stroke();
    // map
    ctx.fillStyle='#e5d2aa'; ctx.fillRect(-42,-40,84,38);
  } else if(pose==='helm'){
    ctx.beginPath(); ctx.moveTo(-14,-70); ctx.lineTo(-60,-30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14,-70); ctx.lineTo(60,-30); ctx.stroke();
    // simple wheel center
    ctx.strokeStyle=trim; ctx.lineWidth=10; ctx.beginPath(); ctx.arc(0,-20,32,0,Math.PI*2); ctx.stroke();
  } else if(pose==='flag'){
    ctx.beginPath(); ctx.moveTo(-14,-70); ctx.lineTo(-14,-160); ctx.stroke();
    ctx.fillStyle='#e7b24a'; ctx.fillRect(-14,-160,90,40);
    ctx.beginPath(); ctx.moveTo(14,-70); ctx.lineTo(60,-30); ctx.stroke();
  } else { // default
    ctx.beginPath(); ctx.moveTo(-14,-70); ctx.lineTo(-60,-40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14,-70); ctx.lineTo(60,-40); ctx.stroke();
  }
  // Simple shadow under
  ctx.restore();
}

function drawForegroundRail(ctx,w,h){
  ctx.save();
  ctx.fillStyle='rgba(30,22,18,0.92)';
  ctx.fillRect(0,h*0.87,w,h*0.045);
  ctx.restore();
}

function atmospherePass(ctx,w,h){
  ctx.save();
  const fog=ctx.createLinearGradient(0,h*0.40,0,h);
  fog.addColorStop(0,'rgba(255,200,140,0.0)');
  fog.addColorStop(0.55,'rgba(255,180,110,0.17)');
  fog.addColorStop(1,'rgba(255,150,90,0.38)');
  ctx.fillStyle=fog; ctx.fillRect(0,0,w,h);
  ctx.globalCompositeOperation='overlay';
  ctx.fillStyle='rgba(255,160,80,0.18)'; ctx.fillRect(0,0,w,h);
  ctx.restore();
}

function grading(ctx,w,h){
  const img = ctx.getImageData(0,0,w,h); const d=img.data;
  for(let i=0;i<d.length;i+=4){
    d[i] = Math.min(255, d[i]*1.04 + 6); // R
    d[i+1] = Math.min(255, d[i+1]*1.02 + 3); // G
    d[i+2] = Math.min(255, d[i+2]*0.97 + 2); // B
  }
  ctx.putImageData(img,0,0);
  // Vignette
  const v = ctx.createRadialGradient(w/2,h/2,w*0.2, w/2,h/2,w*0.75);
  v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,0.35)');
  ctx.fillStyle=v; ctx.fillRect(0,0,w,h);
}

async function main(){
  await fs.ensureDir(OUT_DIR);
  const W=1600, H=1000;
  const canvas = createCanvas(W,H); const ctx = canvas.getContext('2d');

  drawSky(ctx,W,H);
  drawSunGap(ctx,W,H);
  drawDistantIsles(ctx,W,H);
  drawReefArches(ctx,W,H);
  drawSea(ctx,W,H);

  // Characters (pure vector)
  drawCharacter(ctx,{x:W*0.22,y:H*0.88,scale:1.25,pose:'point',facing:1}); // lookout
  drawCharacter(ctx,{x:W*0.48,y:H*0.79,scale:1.05,pose:'helm',facing:1}); // helmsman
  drawCharacter(ctx,{x:W*0.68,y:H*0.90,scale:1.15,pose:'hold_map',facing:-1}); // cartographer
  drawCharacter(ctx,{x:W*0.36,y:H*0.89,scale:1.10,pose:'flag',facing:1}); // signal runner

  drawForegroundRail(ctx,W,H);
  atmospherePass(ctx,W,H);
  grading(ctx,W,H);

  const outPath = path.join(OUT_DIR,'vector_story_01.png');
  await fs.writeFile(outPath, canvas.toBuffer('image/png'));
  console.log('Vector story scene created at', outPath);
}

main().catch(e=>{ console.error(e); process.exit(1); });
