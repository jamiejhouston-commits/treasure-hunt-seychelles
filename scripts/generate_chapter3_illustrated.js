// Generates 20 illustrated Chapter 3 images + metadata (NO MINTING)
// Output images: ../scripts/dist/images/121.png ... 140.png
// Output metadata: ../scripts/dist/metadata/121.json ... 140.json

import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const WIDTH = 800;
const HEIGHT = 800;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, 'dist');
const IMAGES_DIR = path.join(DIST_DIR, 'images');
const META_DIR = path.join(DIST_DIR, 'metadata');

await fs.ensureDir(IMAGES_DIR);
await fs.ensureDir(META_DIR);

// Utilities
function rand(min, max) { return Math.random() * (max - min) + min; }
function drawVignette(ctx) {
  const grd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, WIDTH*0.2, WIDTH/2, HEIGHT/2, WIDTH*0.7);
  grd.addColorStop(0, 'rgba(0,0,0,0)');
  grd.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,WIDTH,HEIGHT);
}

function drawNoise(ctx, density=1200, alpha=0.04) {
  ctx.save();
  for (let i=0;i<density;i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*alpha})`;
    ctx.fillRect(rand(0,WIDTH), rand(0,HEIGHT), 1, 1);
  }
  ctx.restore();
}

function drawFog(ctx, layers=3) {
  for (let i=0;i<layers;i++) {
    const y = rand(HEIGHT*0.1, HEIGHT*0.9);
    const h = rand(40, 120);
    const grd = ctx.createLinearGradient(0,y,0,y+h);
    grd.addColorStop(0, 'rgba(255,255,255,0.08)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, y, WIDTH, h);
  }
}

// Atmosphere & texture helpers for richer full-card composition
function drawStars(ctx, count=180) {
  ctx.save();
  for (let i=0;i<count;i++) {
    const x = rand(0, WIDTH);
    const y = rand(0, HEIGHT*0.45);
    const a = Math.random()*0.8 + 0.2;
    ctx.fillStyle = `rgba(255,255,240,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}

function drawMoon(ctx, x=WIDTH*0.82, y=HEIGHT*0.18, r=42) {
  const g = ctx.createRadialGradient(x,y,4, x,y,r);
  g.addColorStop(0,'rgba(255,255,220,0.95)');
  g.addColorStop(1,'rgba(255,255,220,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
}

function drawWaves(ctx, y=HEIGHT*0.7, amp=10, bands=5) {
  ctx.save();
  for (let b=0;b<bands;b++) {
    const alpha = 0.12 + b*0.05;
    ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x=0; x<=WIDTH; x+=8) {
      const yy = y + Math.sin((x*0.03) + b*0.7) * amp * (1 - b/bands);
      if (x===0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawPalms(ctx, baseY=HEIGHT*0.8) {
  ctx.save();
  ctx.fillStyle = '#0d1a12';
  for (let i=0;i<5;i++) {
    const x = 80 + i*140 + rand(-20,20);
    const h = rand(60, 120);
    ctx.fillRect(x, baseY-h, 6, h);
    for (let p=0;p<6;p++) {
      const ang = -Math.PI/2 + p*(Math.PI/6) + rand(-0.2,0.2);
      const len = rand(28, 46);
      ctx.beginPath();
      ctx.moveTo(x+3, baseY-h);
      ctx.lineTo(x+3 + Math.cos(ang)*len, baseY-h + Math.sin(ang)*len);
      ctx.strokeStyle = '#0f2a1a';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function ropeBorder(ctx) {
  ctx.save();
  // Outer dark frame
  ctx.strokeStyle = 'rgba(10,10,10,0.9)';
  ctx.lineWidth = 16; ctx.strokeRect(12,12, WIDTH-24, HEIGHT-24);
  // Rope pattern inner frame
  ctx.strokeStyle = '#caa66a'; ctx.lineWidth = 8;
  ctx.strokeRect(24,24, WIDTH-48, HEIGHT-48);
  // Corner rivets
  ctx.fillStyle = '#6b532e';
  const pts = [ [36,36],[WIDTH-36,36],[36,HEIGHT-36],[WIDTH-36,HEIGHT-36] ];
  for (const [x,y] of pts) { ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
}

function parchmentOverlay(ctx, alpha=0.12) {
  // Faint parchment texture using noise + warm tint
  ctx.save();
  const g = ctx.createLinearGradient(0,0,0,HEIGHT);
  g.addColorStop(0,'rgba(220,200,160,0.10)');
  g.addColorStop(1,'rgba(180,160,120,0.08)');
  ctx.fillStyle = g; ctx.fillRect(0,0,WIDTH,HEIGHT);
  drawNoise(ctx, 1800, alpha);
  ctx.restore();
}

function mapGrid(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(230,210,160,0.14)';
  ctx.lineWidth = 1; ctx.setLineDash([8,10]);
  for (let x=60; x<WIDTH; x+=80) { ctx.beginPath(); ctx.moveTo(x,60); ctx.lineTo(x,HEIGHT-60); ctx.stroke(); }
  for (let y=60; y<HEIGHT; y+=80) { ctx.beginPath(); ctx.moveTo(60,y); ctx.lineTo(WIDTH-60,y); ctx.stroke(); }
  ctx.restore();
}

function compass(ctx, cx, cy, r, alpha=0.18) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#d4c19b';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
  // N E S W
  ctx.font = 'bold 20px serif';
  ctx.fillStyle = '#d4c19b';
  ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - r + 24);
  ctx.fillText('S', cx, cy + r - 8);
  ctx.fillText('W', cx - r + 14, cy+6);
  ctx.fillText('E', cx + r - 14, cy+6);
  ctx.restore();
}

function gradientNightOcean(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  g.addColorStop(0, '#07121e');
  g.addColorStop(0.45, '#0f2338');
  g.addColorStop(1, '#183250');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,WIDTH,HEIGHT);
}

function titleText(ctx, title) {
  ctx.save();
  ctx.font = 'bold 28px Georgia';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  // Glow
  ctx.shadowColor = 'rgba(255,215,0,0.6)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#f7d96f';
  ctx.fillText(title, 24, 24);
  ctx.restore();
}

function smallInfo(ctx, text, y) {
  ctx.save();
  ctx.font = '14px Georgia';
  ctx.fillStyle = 'rgba(230,230,230,0.95)';
  ctx.fillText(text, 24, y);
  ctx.restore();
}

function rarityBadge(ctx, rarity) {
  const x = WIDTH-170, y = 26, w=144, h=36;
  const colors = {
    'Legendary': ['#f6e27a','#b58b00'],
    'Epic': ['#b8d6ff','#3b5a9a'],
    'Rare': ['#c7ffd6','#2e7d57']
  }[rarity] || ['#e0e0e0','#666'];
  const g = ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0, colors[0]); g.addColorStop(1, colors[1]);
  ctx.save();
  ctx.fillStyle = g; ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2; ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x,y,w,h,8) : ctx.rect(x,y,w,h);
  ctx.fill(); ctx.stroke();
  ctx.font = 'bold 16px Georgia'; ctx.fillStyle = '#0c0c0c';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(rarity, x+w/2, y+h/2);
  ctx.restore();
}

// Iconography (simple illustrated silhouettes)
function skull(ctx, x, y, scale=1) {
  ctx.save();
  ctx.translate(x,y); ctx.scale(scale, scale);
  ctx.fillStyle = '#e9e2d0';
  ctx.beginPath();
  ctx.ellipse(0,0, 40,32, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(-12,-4,8,10,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(12,-4,8,10,0,0,Math.PI*2); ctx.fill();
  ctx.fillRect(-6,12,12,10);
  ctx.restore();
}

function anchor(ctx, x, y, scale=1) {
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  ctx.strokeStyle = '#c9cbd3'; ctx.lineWidth = 6; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(0,-40); ctx.lineTo(0,30); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-50,10,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40,30); ctx.quadraticCurveTo(0,60,40,30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40,30); ctx.lineTo(-25,15); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40,30); ctx.lineTo(25,15); ctx.stroke();
  ctx.restore();
}

function ship(ctx, x, y, scale=1) {
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  ctx.fillStyle = '#1a222c';
  ctx.beginPath(); ctx.moveTo(-60,20); ctx.lineTo(60,20); ctx.lineTo(40,40); ctx.lineTo(-40,40); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#303b4a'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(0,-60); ctx.lineTo(0,20); ctx.stroke();
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath(); ctx.moveTo(0,-60); ctx.lineTo(40,-30); ctx.lineTo(0,-30); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,-50); ctx.lineTo(-30,-20); ctx.lineTo(0,-20); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function parrot(ctx, x, y, scale=1) {
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  ctx.fillStyle = '#2fb86a';
  ctx.beginPath(); ctx.ellipse(0,0,18,24,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#e9b13b'; ctx.beginPath(); ctx.arc(10,-8,6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(6,-10,2,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function cutlasses(ctx, x, y, scale=1) {
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  ctx.strokeStyle = '#cfd6df'; ctx.lineWidth=6; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-30,20); ctx.quadraticCurveTo(-5,-10, 20,-25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(30,20); ctx.quadraticCurveTo(5,-10, -20,-25); ctx.stroke();
  ctx.restore();
}

function caveMouth(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#1d2027';
  ctx.beginPath();
  ctx.moveTo(x, y+h);
  ctx.quadraticCurveTo(x+w*0.1, y+h*0.2, x+w*0.5, y);
  ctx.quadraticCurveTo(x+w*0.9, y+h*0.2, x+w, y+h);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function waterfall(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x, y+h);
  g.addColorStop(0, 'rgba(180,200,255,0.8)');
  g.addColorStop(1, 'rgba(120,160,220,0.7)');
  ctx.fillStyle = g; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth=2;
  for (let i=0;i<6;i++) {
    const sx = x + (i+0.3)*(w/6);
    ctx.beginPath(); ctx.moveTo(sx,y); ctx.lineTo(sx, y+h); ctx.stroke();
  }
}

function graniteCliffs(ctx, yBase) {
  ctx.save();
  ctx.fillStyle = '#2a2f3a';
  ctx.beginPath();
  ctx.moveTo(0,yBase);
  ctx.lineTo(100,yBase-80);
  ctx.lineTo(220,yBase-40);
  ctx.lineTo(360,yBase-100);
  ctx.lineTo(520,yBase-60);
  ctx.lineTo(680,yBase-110);
  ctx.lineTo(800,yBase-70);
  ctx.lineTo(800,800);
  ctx.lineTo(0,800);
  ctx.closePath();
  ctx.fill();
  // texture lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth=2;
  for (let i=0;i<9;i++) {
    ctx.beginPath();
    ctx.moveTo(rand(0,WIDTH), yBase - rand(30, 140));
    ctx.lineTo(rand(0,WIDTH), yBase + rand(20, 80));
    ctx.stroke();
  }
  ctx.restore();
}

function torch(ctx, x, y) {
  const g = ctx.createRadialGradient(x,y,4, x,y,28);
  g.addColorStop(0,'rgba(255,200,80,0.9)');
  g.addColorStop(1,'rgba(255,120,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x-30,y-30,60,60);
  ctx.fillStyle = '#5a3b1f'; ctx.fillRect(x-2,y,4,18);
}

function treasureChest(ctx, x, y, scale=1) {
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  ctx.fillStyle = '#5a3b1f';
  ctx.fillRect(-40,-10,80,36);
  ctx.fillStyle = '#6c4520'; ctx.beginPath();
  ctx.moveTo(-40,-10); ctx.quadraticCurveTo(0,-38,40,-10); ctx.lineTo(40,6); ctx.lineTo(-40,6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d4b24f'; ctx.fillRect(-4,-10,8,36);
  // coins
  ctx.fillStyle = '#f4d46a'; for (let i=0;i<8;i++){ ctx.beginPath(); ctx.arc(-24+i*6,20-rand(0,6),2,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
}

// Chapter 3 cards data
const CARDS = [
  { t: 'Card 01 — Landing at Anse Gaulette', loc: 'Anse Gaulette, Baie Lazare', coords: '-4.7498, 55.4912', phase: 'arrival', feature: 'ship', rarity: 'Epic', riddle: 'At low tide, the coral teeth align to point where anchors sleep.' },
  { t: 'Card 02 — The Carved Rock', loc: 'Lazare Picault ridge', coords: '-4.7509, 55.4921', phase: 'arrival', feature: 'anchor', rarity: 'Rare', riddle: 'Count the notches on the granite’s scar; subtract the waves at dawn.' },
  { t: 'Card 03 — Fog at Lazare Picault', loc: 'Baie Lazare mist line', coords: '-4.7519, 55.4931', phase: 'arrival', feature: 'fog+compass', rarity: 'Legendary', riddle: 'When north is veiled, set bearing by the whispering reef’s twin humps.' },
  { t: 'Card 04 — The Hidden Waterfall', loc: 'Sans Souci fall', coords: '-4.6512, 55.4480', phase: 'arrival', feature: 'waterfall', rarity: 'Epic', riddle: 'Beneath the silver curtain lies a mark only torchlight wakes.' },
  { t: 'Card 05 — Shoreline Cipher', loc: 'Baie Lazare shore', coords: '-4.7485, 55.4898', phase: 'arrival', feature: 'cutlasses', rarity: 'Rare', riddle: 'Cross blades upon the map where driftwood signs an X at dusk.' },
  { t: 'Card 06 — Ros Sodyer Echo', loc: 'Ros Sodyer Rock Pool', coords: '-4.3613, 55.8249', phase: 'inland', feature: 'rockpool', rarity: 'Epic', riddle: 'Three rings ripple truth; pair them with Fragment I to read time.' },
  { t: 'Card 07 — The Parrot’s Warning', loc: 'Forest fringe', coords: '-4.6395, 55.4489', phase: 'inland', feature: 'parrot', rarity: 'Rare', riddle: 'Colors reversed reveal the safe path where green turns gold.' },
  { t: 'Card 08 — Skull Marker', loc: 'Coconut Grove', coords: '-4.7461, 55.4955', phase: 'inland', feature: 'skull', rarity: 'Rare', riddle: 'Hollow eyes see two ways; add their angles to find the third.' },
  { t: 'Card 09 — Cave of Whispers', loc: 'Cascade trail cave', coords: '-4.6510, 55.4823', phase: 'inland', feature: 'cave', rarity: 'Epic', riddle: 'Echo counts in threes; align with the tide to unlock the mouth.' },
  { t: 'Card 10 — Port Launay Shadows', loc: 'Port Launay bay', coords: '-4.6450, 55.4062', phase: 'inland', feature: 'ship+compass', rarity: 'Rare', riddle: 'When the bay swallows the sun, the compass points to iron sleep.' },
  { t: 'Card 11 — False Trail I', loc: 'Morne Blanc ridge', coords: '-4.6503, 55.4488', phase: 'false', feature: 'cliffs', rarity: 'Rare', riddle: 'The path that climbs fastest falls shortest—halve the summit’s number.' },
  { t: 'Card 12 — Ambush at Coconut Grove', loc: 'Coconut Grove', coords: '-4.7461, 55.4955', phase: 'false', feature: 'cutlasses+skull', rarity: 'Epic', riddle: 'Crossed steel hides truth; invert the grove’s count of nine to proceed.' },
  { t: 'Card 13 — Torch of Secrets', loc: 'Sans Souci passage', coords: '-4.6518, 55.4496', phase: 'false', feature: 'torches', rarity: 'Epic', riddle: 'Light in pairs reveals ink unseen; read between the burns.' },
  { t: 'Card 14 — The Granite Ruse', loc: 'Granite slab', coords: '-4.6490, 55.4520', phase: 'false', feature: 'cliffs+compass', rarity: 'Rare', riddle: 'Granite points twice; only the second at night rings true.' },
  { t: 'Card 15 — Hidden Script', loc: 'Cascade script wall', coords: '-4.6498, 55.4808', phase: 'false', feature: 'map', rarity: 'Rare', riddle: 'Letters carved shallow spell a bearing when paired with ring three.' },
  { t: 'Card 16 — Map Fragment I', loc: 'Anse Gaulette dune', coords: '-4.7491, 55.4906', phase: 'climax', feature: 'fragment', rarity: 'Legendary', riddle: 'Fragment I adds hours to the pool; read 3-6-9 in moonlight.' },
  { t: 'Card 17 — The Pirate’s Ghost', loc: 'Baie Lazare mist', coords: '-4.7521, 55.4939', phase: 'climax', feature: 'ghost', rarity: 'Legendary', riddle: 'Ask the ghost for silence; the echo that remains is your sum.' },
  { t: 'Card 18 — Map Fragment II', loc: 'Morne Blanc overlook', coords: '-4.6492, 55.4475', phase: 'climax', feature: 'fragment', rarity: 'Epic', riddle: 'Fragment II flips the compass—south becomes key when cliffs loom.' },
  { t: 'Card 19 — The Final Cave', loc: 'Hidden sea cave', coords: '-4.7442, 55.4979', phase: 'climax', feature: 'finalcave', rarity: 'Legendary', riddle: 'Present I+II and speak the tide; the mouth reveals the last hour.' },
  { t: 'Card 20 — Torn Parchment', loc: 'Shoreline firepit', coords: '-4.7481, 55.4891', phase: 'climax', feature: 'tornmap', rarity: 'Epic', riddle: 'Torn edge mirrors the bay; the final chapter reaches its conclusion.' },
];

function drawFeature(ctx, feature) {
  switch(feature) {
    case 'ship': ship(ctx, WIDTH*0.55, HEIGHT*0.55, 1.2); drawWaves(ctx, HEIGHT*0.7, 12, 6); break;
    case 'anchor': anchor(ctx, WIDTH*0.65, HEIGHT*0.6, 1.2); treasureChest(ctx, WIDTH*0.48, HEIGHT*0.62, 1.0); break;
    case 'fog+compass': compass(ctx, WIDTH*0.8, HEIGHT*0.25, 90, 0.2); drawFog(ctx, 4); break;
    case 'waterfall': graniteCliffs(ctx, HEIGHT*0.78); waterfall(ctx, WIDTH*0.62, HEIGHT*0.25, 80, 280); drawFog(ctx, 3); break;
    case 'cutlasses': cutlasses(ctx, WIDTH*0.65, HEIGHT*0.55, 1.0); break;
    case 'rockpool': graniteCliffs(ctx, HEIGHT*0.82); // pool rings
      const cx = WIDTH*0.45, cy = HEIGHT*0.65; 
      ctx.strokeStyle='rgba(120,200,255,0.8)'; ctx.lineWidth=3;
      for (let r=18; r<=60; r+=18){ ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke(); }
      break;
    case 'parrot': parrot(ctx, WIDTH*0.62, HEIGHT*0.46, 2.0); drawPalms(ctx); break;
    case 'skull': skull(ctx, WIDTH*0.63, HEIGHT*0.52, 1.4); break;
    case 'cave': caveMouth(ctx, WIDTH*0.55, HEIGHT*0.42, 160, 200); break;
    case 'ship+compass': ship(ctx, WIDTH*0.52, HEIGHT*0.58, 1.0); compass(ctx, WIDTH*0.22, HEIGHT*0.28, 70, 0.18); break;
    case 'cliffs': graniteCliffs(ctx, HEIGHT*0.8); break;
    case 'cutlasses+skull': cutlasses(ctx, WIDTH*0.62, HEIGHT*0.54, 1.1); skull(ctx, WIDTH*0.52, HEIGHT*0.56, 0.9); break;
    case 'torches': torch(ctx, WIDTH*0.58, HEIGHT*0.52); torch(ctx, WIDTH*0.70, HEIGHT*0.46); caveMouth(ctx, WIDTH*0.50, HEIGHT*0.40, 160, 200); break;
    case 'cliffs+compass': graniteCliffs(ctx, HEIGHT*0.78); compass(ctx, WIDTH*0.72, HEIGHT*0.3, 80, 0.2); break;
    case 'map': compass(ctx, WIDTH*0.2, HEIGHT*0.24, 60, 0.2); // draw dashed route
      ctx.save(); ctx.strokeStyle='rgba(230,210,160,0.9)'; ctx.setLineDash([8,6]); ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(120,520); ctx.quadraticCurveTo(240,460, 380,520); ctx.quadraticCurveTo(520,580, 660,520); ctx.stroke(); ctx.restore();
      break;
    case 'fragment': ctx.save(); ctx.fillStyle='rgba(235,220,180,0.9)';
      ctx.beginPath(); ctx.moveTo(520,420); ctx.lineTo(700,400); ctx.lineTo(660,560); ctx.lineTo(520,540); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(180,160,120,0.9)'; ctx.setLineDash([10,6]); ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(540,460); ctx.lineTo(680,520); ctx.stroke(); ctx.restore(); break;
    case 'ghost': ctx.save(); const g = ctx.createRadialGradient(560,460,10,560,460,120);
      g.addColorStop(0,'rgba(220,240,255,0.85)'); g.addColorStop(1,'rgba(220,240,255,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(560,460,120,0,Math.PI*2); ctx.fill(); ctx.restore(); break;
    case 'finalcave': caveMouth(ctx, WIDTH*0.50, HEIGHT*0.40, 200, 240); torch(ctx, WIDTH*0.48, HEIGHT*0.52); torch(ctx, WIDTH*0.70, HEIGHT*0.46); break;
    case 'tornmap': ctx.save(); ctx.fillStyle='rgba(240,224,190,0.92)';
      ctx.beginPath(); ctx.moveTo(520,420); ctx.lineTo(690,410); ctx.lineTo(680,520); ctx.lineTo(600,560); ctx.lineTo(520,520); ctx.closePath(); ctx.fill(); ctx.restore(); break;
  }
}

function phasePalette(phase) {
  switch(phase) {
    case 'arrival': return ['#07121e','#0f2338','#183250'];
    case 'inland': return ['#0a1411','#113126','#163c2b'];
    case 'false': return ['#1b0f10','#2b1b1d','#331f21'];
    case 'climax': return ['#0a0f1b','#14213a','#1b2a4a'];
    default: return ['#07121e','#0f2338','#183250'];
  }
}

function baseFrame(ctx, card) {
  // Background gradient by phase
  const [c1,c2,c3] = phasePalette(card.phase);
  const g = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  g.addColorStop(0, c1); g.addColorStop(0.45, c2); g.addColorStop(1, c3);
  ctx.fillStyle = g; ctx.fillRect(0,0,WIDTH,HEIGHT);
  drawStars(ctx, 140);
  drawMoon(ctx);
  if (card.phase !== 'inland') drawWaves(ctx, HEIGHT*0.72, 10, 5);
  if (card.phase !== 'arrival') graniteCliffs(ctx, HEIGHT*0.82);
  parchmentOverlay(ctx, 0.06);
  mapGrid(ctx);
  compass(ctx, WIDTH*0.14, HEIGHT*0.16, 60, 0.10);
  drawFog(ctx, 2);
  ropeBorder(ctx);
  drawVignette(ctx);
}

function composeCardImage(card) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  baseFrame(ctx, card);
  // Landmark foreground hint band
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, HEIGHT-220, WIDTH, 220); ctx.restore();
  drawFeature(ctx, card.feature);
  // Text overlays
  titleText(ctx, `Chapter 3 — ${card.t}`);
  rarityBadge(ctx, card.rarity);
  smallInfo(ctx, `${card.loc}  •  Coords ${card.coords}  •  ${card.rarity}`, HEIGHT-190);
  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.font = '16px Georgia'; ctx.fillText(card.riddle, 24, HEIGHT-160, WIDTH-48); ctx.restore();
  drawVignette(ctx);
  return canvas;
}

const CLUE_LINKS = {
  121: [125],
  122: [134],
  123: [138],
  124: [133],
  125: [136],
  126: [136],
  127: [131],
  128: [132],
  129: [139],
  130: [122,139],
  131: [135],
  132: [133],
  133: [135,139],
  134: [123,138],
  135: [126],
  136: [138,139],
  137: [139],
  138: [139],
  139: [140],
  140: []
};

function cardToMetadata(card, tokenId, idx) {
  const clueLinks = CLUE_LINKS[tokenId] || [];
  return {
    name: `Chapter 3 — ${card.t}`,
    description: `Chapter 3 — The Landing at Anse Gaulette. ${card.t}. Riddle: ${card.riddle}. This card connects with others in the saga to reveal bearings, timings, and trail corrections.`,
    image: `/real/images/${tokenId}.png`,
    attributes: [
      { trait_type: 'Chapter', value: 'Chapter 3 — The Landing at Anse Gaulette' },
      { trait_type: 'Rarity', value: card.rarity },
      { trait_type: 'Location', value: card.loc },
      { trait_type: 'Coordinates', value: card.coords },
      { trait_type: 'Phase', value: card.phase },
      { trait_type: 'Card', value: idx },
      { trait_type: 'Theme', value: 'Dark Cinematic Pirate Adventure' },
      { trait_type: 'ClueLinks', value: clueLinks.join(', ') }
    ]
  };
}

async function main() {
  console.log('🏴‍☠️ Generating illustrated Chapter 3 placeholders (20 items)...');
  // Token IDs 121..140
  for (let i=0; i<20; i++) {
    const tokenId = 121 + i;
    const card = CARDS[i];
    const canvas = composeCardImage(card);
    const outImg = path.join(IMAGES_DIR, `${tokenId}.png`);
    await fs.writeFile(outImg, canvas.toBuffer('image/png'));
    const meta = cardToMetadata(card, tokenId, i+1);
    await fs.writeJson(path.join(META_DIR, `${tokenId}.json`), meta, { spaces: 2 });
    console.log(`✅ ${meta.name} -> ${path.basename(outImg)}`);
  }
  console.log('🎉 Done. Images in dist/images, metadata in dist/metadata. NO MINTING.');
}

await main();
