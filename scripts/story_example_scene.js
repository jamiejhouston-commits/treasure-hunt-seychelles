import { createCanvas, loadImage } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/*
 Simple hand-authored story scene (not randomized):
 Title: "Signals at the Hidden Cove"
 Elements:
  - Foreground left crew pointing
  - Foreground right crew with map
  - Mid ship wheel + helmsman
  - Background cliffs + glowing cove gap + sun
  - Sea path of light leading viewer eye
  - Subtle particles
 Uses silhouettes from assets/cinematic/props (crew.png/ship.png/fortress.png) & hero/ (wheel, compass optional)
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.resolve(__dirname,'../content/story_example');

async function loadSil(name){
  const tryPaths = [
    path.resolve(__dirname, '../assets/cinematic/hero/'+name+'.png'),
    path.resolve(__dirname, '../assets/cinematic/props/'+name+'.png')
  ];
  for (const p of tryPaths){
    if (fs.existsSync(p)) return loadImage(p);
  }
  return null;
}

function drawSky(ctx,w,h){
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#f5d08a');
  g.addColorStop(0.55,'#e9a052');
  g.addColorStop(1,'#3a2a28');
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
}

function drawSun(ctx,w,h){
  const cx=w*0.58, cy=h*0.34, r=h*0.11;
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*2.2);
  g.addColorStop(0,'rgba(255,240,170,1)');
  g.addColorStop(0.25,'rgba(255,210,120,0.9)');
  g.addColorStop(0.6,'rgba(255,160,70,0.25)');
  g.addColorStop(1,'rgba(255,120,40,0)');
  ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation='source-over';
}

function drawCliffs(ctx,w,h){
  const horizon=h*0.55;
  for(let i=0;i<6;i++){
    const left = i*(w/5)+ (Math.random()*40-20);
    const width= w/5 + Math.random()*80;
    const top = horizon - (140+Math.random()*220);
    const grad = ctx.createLinearGradient(0,top,0,horizon);
    grad.addColorStop(0,'rgba(90,70,55,0.95)');
    grad.addColorStop(1,'rgba(40,30,25,0)');
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.moveTo(left,horizon);
    ctx.lineTo(left+width*0.2, top+Math.random()*30);
    ctx.lineTo(left+width*0.55, top+Math.random()*40-20);
    ctx.lineTo(left+width, horizon);
    ctx.closePath();
    ctx.fill();
  }
  // Cove glow gap
  const gapX=w*0.57, gapW= w*0.09;
  const glow=ctx.createLinearGradient(gapX-gapW/2,horizon,horizon,gapX-gapW/2,horizon-200);
  ctx.save();
  const g2=ctx.createRadialGradient(gapX,horizon-20,0,gapX,horizon-20,260);
  g2.addColorStop(0,'rgba(255,210,150,0.6)');
  g2.addColorStop(1,'rgba(255,170,90,0)');
  ctx.globalCompositeOperation='screen';
  ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(gapX,horizon-20,260,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawSea(ctx,w,h){
  const horizon=h*0.55;
  const g=ctx.createLinearGradient(0,horizon,0,h);
  g.addColorStop(0,'#174b5f');
  g.addColorStop(1,'#071a23');
  ctx.fillStyle=g; ctx.fillRect(0,horizon,w,h-horizon);
  // Light path lane
  ctx.save();
  ctx.globalCompositeOperation='screen';
  for(let i=0;i<180;i++){
    const t=i/180;
    const y = horizon + t*(h-horizon);
    const laneW = (1-t)*w*0.32 + 40;
    const alpha = (1-t)*0.22;
    const x = w*0.52 - laneW/2;
    ctx.fillStyle=`rgba(255,200,120,${alpha})`;
    ctx.fillRect(x + Math.sin(t*8)*18, y, laneW, 2);
  }
  ctx.restore();
  // Sparkles
  for(let i=0;i<260;i++){
    const y = horizon + Math.random()*(h-horizon);
    const x = Math.random()*w;
    const a = (1-(y-horizon)/(h-horizon))*0.7;
    ctx.fillStyle=`rgba(255,240,200,${a*Math.random()*0.6})`;
    ctx.fillRect(x,y,2,2);
  }
}

function drawCrewShape(ctx,img,cx,cy,targetH,flip=false,gestureTilt=0){
  if(!img) return;
  const aspect = img.width/img.height;
  const targetW = targetH*aspect;
  ctx.save();
  ctx.translate(cx,cy);
  ctx.scale(flip?-1:1,1);
  ctx.rotate(gestureTilt*Math.PI/180);
  ctx.globalAlpha=0.94;
  ctx.drawImage(img,-targetW/2,-targetH, targetW, targetH);
  // Rim
  ctx.globalCompositeOperation='overlay';
  const g=ctx.createLinearGradient(-targetW/2,-targetH, targetW/2,0);
  g.addColorStop(0,'rgba(255,190,110,0.4)');
  g.addColorStop(1,'rgba(255,160,80,0)');
  ctx.fillStyle=g; ctx.fillRect(-targetW/2,-targetH,targetW,targetH);
  ctx.restore();
}

function drawWheel(ctx,img,cx,cy,scale){
  if(!img) return;
  const aspect = img.width/img.height;
  const w = scale; const h = w/aspect;
  ctx.save();
  ctx.globalAlpha=0.95;
  ctx.drawImage(img,cx-w/2,cy-h/2,w,h);
  ctx.restore();
}

async function main(){
  await fs.ensureDir(OUT_DIR);
  const W=1600, H=1000;
  const canvas = createCanvas(W,H); const ctx = canvas.getContext('2d');

  drawSky(ctx,W,H);
  drawSun(ctx,W,H);
  drawCliffs(ctx,W,H);
  drawSea(ctx,W,H);

  const crew = await loadSil('crew');
  const wheel = await loadSil('wheel');
  const mapHolder = crew; // reuse silhouette but different scaling

  // Helmsman (center)
  drawCrewShape(ctx,crew,W*0.48,H*0.80,H*0.42,false,0);
  drawWheel(ctx,wheel,W*0.48,H*0.82,420);

  // Pointing crew (left)
  drawCrewShape(ctx,crew,W*0.24,H*0.88,H*0.50,true,-6);

  // Map crew (right, smaller, leaning)
  drawCrewShape(ctx,mapHolder,W*0.70,H*0.90,H*0.46,false,5);

  // Foreground rail (simple dark bar)
  ctx.save();
  ctx.fillStyle='rgba(25,20,18,0.85)';
  ctx.fillRect(0,H*0.88,W, H*0.04);
  ctx.restore();

  // Particles in air
  for(let i=0;i<120;i++){
    const x=Math.random()*W; const y=Math.random()*H*0.75;
    ctx.fillStyle=`rgba(255,220,150,${Math.random()*0.15})`;
    ctx.fillRect(x,y,2,2);
  }

  // Vignette
  const v=ctx.createRadialGradient(W/2,H/2, W*0.2, W/2,H/2, W*0.75);
  v.addColorStop(0,'rgba(0,0,0,0)');
  v.addColorStop(1,'rgba(0,0,0,0.35)');
  ctx.fillStyle=v; ctx.fillRect(0,0,W,H);

  const outPath = path.join(OUT_DIR,'story_example_01.png');
  await fs.writeFile(outPath, canvas.toBuffer('image/png'));
  console.log('Story scene created at', outPath);
}

main().catch(e=>{ console.error(e); process.exit(1); });
