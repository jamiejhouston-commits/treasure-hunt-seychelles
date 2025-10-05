// High-fidelity tropical Seychelles themed illustrated generator for Chapter 3 (NO MINTING)
// Produces 20 vivid placeholder images + metadata for tokens 121-140.
// Focus: turquoise water gradients, white sand, lush palms, pink granite (La Digue style hue), waterfalls, coastal caves, rock pool, atmospheric pirate motifs.

import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const WIDTH = 900; // Slightly larger for richer detail
const HEIGHT = 900;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, 'dist');
const IMAGES_DIR = path.join(DIST_DIR, 'images');
const META_DIR = path.join(DIST_DIR, 'metadata');
await fs.ensureDir(IMAGES_DIR); await fs.ensureDir(META_DIR);

function r(min,max){return Math.random()*(max-min)+min;}

// Palettes per phase (vibrant tropical yet story-dark edging)
const PALETTES = {
  arrival: ['#013047','#026a7c','#04a4b4','#fef8e7','#ffd072'],
  inland: ['#083a2b','#0d5c3a','#138c55','#f6f3e2','#f2c14f'],
  false: ['#2b1222','#472436','#6a3952','#f6e9d8','#e9b84c'],
  climax: ['#041f33','#083f5e','#0e678c','#f5f2e6','#f7c85f']
};

// Utility drawing
function vignette(ctx){const g=ctx.createRadialGradient(WIDTH/2,HEIGHT/2,WIDTH*0.2,WIDTH/2,HEIGHT/2,WIDTH*0.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,0.55)');ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT);} 
function noise(ctx, n=3400,a=0.05){ctx.save();for(let i=0;i<n;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*a})`;ctx.fillRect(r(0,WIDTH),r(0,HEIGHT),1,1);}ctx.restore();}
function sunGlow(ctx,x,y,radius){const g=ctx.createRadialGradient(x,y,0,x,y,radius);g.addColorStop(0,'rgba(255,241,200,0.95)');g.addColorStop(0.5,'rgba(255,220,120,0.45)');g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();}
function moon(ctx,x,y,r){const g=ctx.createRadialGradient(x,y,4,x,y,r);g.addColorStop(0,'rgba(255,255,250,0.95)');g.addColorStop(1,'rgba(255,255,250,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function clouds(ctx,count=6){ctx.save();for(let i=0;i<count;i++){const x=r(60,WIDTH-60), y=r(40,HEIGHT*0.35), w=r(140,260), h=r(50,90);const grd=ctx.createLinearGradient(x,y,x,y+h);grd.addColorStop(0,'rgba(255,255,255,0.85)');grd.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=grd;ctx.beginPath();ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);ctx.fill();}ctx.restore();}
function horizonWater(ctx,phase){const [d1,m1,m2,light] = PALETTES[phase];const g=ctx.createLinearGradient(0,HEIGHT*0.15,0,HEIGHT);g.addColorStop(0,phase==='arrival'?m1:'#0f4056');g.addColorStop(0.45,m2);g.addColorStop(1, '#02252f');ctx.fillStyle=g;ctx.fillRect(0,HEIGHT*0.15,WIDTH,HEIGHT*0.85);} 
function beachSand(ctx){const g=ctx.createLinearGradient(0,HEIGHT*0.55,0,HEIGHT);g.addColorStop(0,'rgba(250,240,210,0.2)');g.addColorStop(1,'rgba(255,250,235,0.85)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,HEIGHT*0.55);ctx.quadraticCurveTo(WIDTH*0.35,HEIGHT*0.5, WIDTH*0.65,HEIGHT*0.62);ctx.quadraticCurveTo(WIDTH*0.85,HEIGHT*0.70, WIDTH,HEIGHT*0.68);ctx.lineTo(WIDTH,HEIGHT);ctx.lineTo(0,HEIGHT);ctx.closePath();ctx.fill();}
function surfLines(ctx){ctx.save();ctx.strokeStyle='rgba(255,255,255,0.65)';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();const y=HEIGHT*0.6 + i*14;for(let x=0;x<=WIDTH;x+=14){const yy=y+Math.sin((x*0.04)+i)*3; if(x===0) ctx.moveTo(x,yy); else ctx.lineTo(x,yy);}ctx.stroke();}ctx.restore();}

function lushPalms(ctx,count=6){ctx.save();for(let i=0;i<count;i++){const x=r(60,WIDTH-60), base=HEIGHT*0.55 + r(-30,30), h=r(140,220);ctx.strokeStyle='#2e4d23';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+r(-30,30), base-h*0.5, x+r(-10,10));ctx.lineTo(x+r(-8,8), base-h);ctx.stroke();for(let fr=0;fr<7;fr++){const ang=-Math.PI/2 + fr*(Math.PI/7) + r(-0.25,0.25);const len=r(70,130);ctx.strokeStyle='#3f7b32';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+r(-8,8), base-h);ctx.lineTo(x+r(-8,8)+Math.cos(ang)*len, base-h+Math.sin(ang)*len);ctx.stroke();}}ctx.restore();}

function pinkGranite(ctx){ctx.save();ctx.fillStyle='#b9786d';ctx.beginPath();ctx.moveTo(0,HEIGHT*0.52);ctx.lineTo(WIDTH*0.2,HEIGHT*0.40);ctx.lineTo(WIDTH*0.38,HEIGHT*0.48);ctx.lineTo(WIDTH*0.55,HEIGHT*0.36);ctx.lineTo(WIDTH*0.72,HEIGHT*0.46);ctx.lineTo(WIDTH*0.9,HEIGHT*0.38);ctx.lineTo(WIDTH,HEIGHT*0.44);ctx.lineTo(WIDTH,HEIGHT);ctx.lineTo(0,HEIGHT);ctx.closePath();ctx.fill();ctx.globalAlpha=0.22;ctx.fillStyle='#d49d90';for(let i=0;i<40;i++){ctx.beginPath();ctx.ellipse(r(0,WIDTH),r(HEIGHT*0.35,HEIGHT*0.56),r(10,40),r(6,22),r(0,Math.PI*2),0,Math.PI*2);ctx.fill();}ctx.restore();}

function waterfall(ctx,x,y,w,h){const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'rgba(220,245,255,0.95)');g.addColorStop(1,'rgba(120,200,235,0.55)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=2;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(x+w*(i/7),y);ctx.lineTo(x+w*(i/7)+r(-4,4), y+h);ctx.stroke();}}

function rockPool(ctx){const cx=WIDTH*0.68, cy=HEIGHT*0.62; for(let ring=0; ring<4; ring++){ctx.beginPath(); ctx.strokeStyle=`rgba(0,150,200,${0.8 - ring*0.18})`; ctx.lineWidth=4 - ring; ctx.arc(cx,cy, 40+ring*22, 0, Math.PI*2); ctx.stroke();}}
function cave(ctx){ctx.save();ctx.fillStyle='#0f1419';ctx.beginPath();ctx.moveTo(WIDTH*0.38,HEIGHT*0.50);ctx.quadraticCurveTo(WIDTH*0.52,HEIGHT*0.28, WIDTH*0.66,HEIGHT*0.50);ctx.lineTo(WIDTH*0.62,HEIGHT*0.78);ctx.lineTo(WIDTH*0.42,HEIGHT*0.78);ctx.closePath();ctx.fill();ctx.restore();}
function compass(ctx,x,y,r,alpha=0.85){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle='#f6d488';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.font='bold 26px Georgia';ctx.fillStyle='#f6d488';ctx.textAlign='center';ctx.fillText('N',x,y-r+30);ctx.fillText('S',x,y+r-12);ctx.fillText('W',x-r+20,y+8);ctx.fillText('E',x+r-20,y+8);ctx.restore();}

function shipSilhouette(ctx){ctx.save();ctx.fillStyle='#081820';ctx.beginPath();ctx.moveTo(WIDTH*0.16,HEIGHT*0.47);ctx.lineTo(WIDTH*0.30,HEIGHT*0.47);ctx.lineTo(WIDTH*0.26,HEIGHT*0.52);ctx.lineTo(WIDTH*0.18,HEIGHT*0.52);ctx.closePath();ctx.fill();ctx.strokeStyle='#0a2a34';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(WIDTH*0.23,HEIGHT*0.30);ctx.lineTo(WIDTH*0.23,HEIGHT*0.47);ctx.stroke();ctx.fillStyle='#fafafa';ctx.beginPath();ctx.moveTo(WIDTH*0.23,HEIGHT*0.30);ctx.lineTo(WIDTH*0.31,HEIGHT*0.40);ctx.lineTo(WIDTH*0.23,HEIGHT*0.40);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(WIDTH*0.23,HEIGHT*0.33);ctx.lineTo(WIDTH*0.16,HEIGHT*0.43);ctx.lineTo(WIDTH*0.23,HEIGHT*0.43);ctx.closePath();ctx.fill();ctx.restore();}

function treasureChest(ctx){ctx.save();const x=WIDTH*0.74,y=HEIGHT*0.66;ctx.fillStyle='#654321';ctx.fillRect(x-60,y-20,120,60);ctx.fillStyle='#7a4a25';ctx.beginPath();ctx.moveTo(x-60,y-20);ctx.quadraticCurveTo(x,y-70,x+60,y-20);ctx.lineTo(x+60,y-5);ctx.lineTo(x-60,y-5);ctx.closePath();ctx.fill();ctx.fillStyle='#d4b24f';ctx.fillRect(x-6,y-20,12,60);ctx.fillStyle='#f4d46a';for(let i=0;i<14;i++){ctx.beginPath();ctx.arc(x-40 + i*6, y+34 - r(0,10), 3,0,Math.PI*2);ctx.fill();}ctx.restore();}

function ghost(ctx){const x=WIDTH*0.62,y=HEIGHT*0.50;const g=ctx.createRadialGradient(x,y,8,x,y,140);g.addColorStop(0,'rgba(240,255,255,0.95)');g.addColorStop(1,'rgba(240,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,140,0,Math.PI*2);ctx.fill();}

function mapFragment(ctx, variant=1){ctx.save();const baseX=WIDTH*0.70, baseY=HEIGHT*0.46;ctx.fillStyle='rgba(245,232,200,0.93)';ctx.beginPath();ctx.moveTo(baseX,baseY);ctx.lineTo(baseX+140,baseY-10);ctx.lineTo(baseX+122,baseY+110);ctx.lineTo(baseX+20,baseY+120);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(120,90,50,0.9)';ctx.setLineDash([10,6]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(baseX+15,baseY+20);ctx.lineTo(baseX+110,baseY+90);ctx.stroke();if(variant===2){ctx.beginPath();ctx.moveTo(baseX+30,baseY+15);ctx.lineTo(baseX+125,baseY+15);ctx.stroke();}ctx.restore();}

function rarityBadge(ctx, rarity){const x=WIDTH-200,y=30,w=170,h=46;const colors={Legendary:['#ffe89a','#b68700'],Epic:['#b7d3ff','#2c4f99'],Rare:['#c6ffd8','#1f6c45']};const g=ctx.createLinearGradient(x,y,x+w,y+h);const c=colors[rarity]||['#e0e0e0','#555'];g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.save();ctx.fillStyle=g;ctx.strokeStyle='rgba(0,0,0,0.55)';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,10):ctx.rect(x,y,w,h);ctx.fill();ctx.stroke();ctx.font='bold 22px Georgia';ctx.fillStyle='#0c0c0c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(rarity,x+w/2,y+h/2);ctx.restore();}

function headerTitle(ctx,text){ctx.save();ctx.font='bold 34px Georgia';ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=6;ctx.fillStyle='#ffe5a8';ctx.fillText(text,40,34);ctx.restore();}
function subInfo(ctx,text){ctx.save();ctx.font='18px Georgia';ctx.fillStyle='rgba(255,255,255,0.95)';ctx.fillText(text,40,HEIGHT-230);ctx.restore();}
function riddleText(ctx,text){ctx.save();ctx.font='18px Georgia';ctx.fillStyle='rgba(255,255,255,0.92)';wrap(ctx,text,40,HEIGHT-200, WIDTH-80, 24);ctx.restore();}
function wrap(ctx,text,x,y,maxWidth,lineHeight){const words=text.split(' ');let line='';let yy=y;for(let n=0;n<words.length;n++){const test=line + words[n] + ' ';const m=ctx.measureText(test);if(m.width>maxWidth){ctx.fillText(line,x,yy);line=words[n] + ' ';yy+=lineHeight;}else{line=test;}}ctx.fillText(line,x,yy);} 

// Cards definition (reusing narrative, adjusting wording slightly for tropical and authenticity)
const CARDS = [
  { id:121, t:'Card 01 — Landing at Anse Gaulette', loc:'Anse Gaulette (Baie Lazare)', coords:'-4.7498, 55.4912', phase:'arrival', rarity:'Epic', feature:['ship','beach','palms'], riddle:'At low tide the whitening reef aligns — where anchors face the sunrise, mark the first bearing.' },
  { id:122, t:'Card 02 — The Carved Rock', loc:'Lazare Picault Ridge', coords:'-4.7509, 55.4921', phase:'arrival', rarity:'Rare', feature:['granite','compass'], riddle:'Count grooves on the pink face; subtract the dawn waves to reveal a step in hours.' },
  { id:123, t:'Card 03 — Mist Over Lazare', loc:'Baie Lazare Mist Line', coords:'-4.7519, 55.4931', phase:'arrival', rarity:'Legendary', feature:['fog','compass','ship'], riddle:'When the morning haze conceals north, follow twin reef humps to offset true heading.' },
  { id:124, t:'Card 04 — Sans Souci Veil', loc:'Sans Souci Waterfall', coords:'-4.6512, 55.4480', phase:'arrival', rarity:'Epic', feature:['waterfall','granite'], riddle:'Behind the silver sheet a sigil glows only when a torch and Fragment I agree.' },
  { id:125, t:'Card 05 — Shoreline Cipher', loc:'Baie Lazare Shore', coords:'-4.7485, 55.4898', phase:'arrival', rarity:'Rare', feature:['sand','route'], riddle:'Trace driftwood shadows at dusk — crossed lines match the hidden hour in Fragment I.' },
  { id:126, t:'Card 06 — Ros Sodyer Rings', loc:'Ros Sodyer Rock Pool', coords:'-4.3613, 55.8249', phase:'inland', rarity:'Epic', feature:['rockpool','granite'], riddle:'Three concentric ripples echo numbers that amplify Fragment I when the moon is highest.' },
  { id:127, t:'Card 07 — Forest Parrot', loc:'Forest Fringe', coords:'-4.6395, 55.4489', phase:'inland', rarity:'Rare', feature:['palms','parrot'], riddle:'Color inversion of its plumage maps safely past the false climb — pair with Card 11.' },
  { id:128, t:'Card 08 — Skull Marker', loc:'Coconut Grove', coords:'-4.7461, 55.4955', phase:'inland', rarity:'Rare', feature:['palms','skull'], riddle:'Two hollow gazes yield angles; sum with Ros Sodyer ring two to pivot east.' },
  { id:129, t:'Card 09 — Coastal Cave Whisper', loc:'Cascade Coastal Trail', coords:'-4.6510, 55.4823', phase:'inland', rarity:'Epic', feature:['cave','granite'], riddle:'Echo count in threes; add tide height to find the torch position in Card 13.' },
  { id:130, t:'Card 10 — Port Launay Twilight', loc:'Port Launay Bay', coords:'-4.6450, 55.4062', phase:'inland', rarity:'Rare', feature:['bay','ship','compass'], riddle:'When the bay swallows the sun, the needle drifts — record the deviation for Card 18.' },
  { id:131, t:'Card 11 — False Ridge Path', loc:'Morne Blanc Ridge', coords:'-4.6503, 55.4488', phase:'false', rarity:'Rare', feature:['granite','trail'], riddle:'Fastest ascent halves itself — combine halved height with Parrot inversion to skip a trap.' },
  { id:132, t:'Card 12 — Grove Ambush', loc:'Coconut Grove', coords:'-4.7461, 55.4955', phase:'false', rarity:'Epic', feature:['palms','cutlasses','skull'], riddle:'Crossed steel misleads; invert nine fallen fronds to translate Script Wall glyphs.' },
  { id:133, t:'Card 13 — Torch of Secrets', loc:'Sans Souci Passage', coords:'-4.6518, 55.4496', phase:'false', rarity:'Epic', feature:['torch','cave'], riddle:'Twin flames reveal hidden ink; read only alternating runes to sync with Card 15.' },
  { id:134, t:'Card 14 — Granite Ruse', loc:'Granite Slab Overlook', coords:'-4.6490, 55.4520', phase:'false', rarity:'Rare', feature:['granite','compass'], riddle:'Two granite pointers disagree — night variant plus Card 03 offset yields true bearing.' },
  { id:135, t:'Card 15 — Hidden Script Wall', loc:'Cascade Script Wall', coords:'-4.6498, 55.4808', phase:'false', rarity:'Rare', feature:['script','granite'], riddle:'Shallow letters form a bearing only when every second rune from Card 13 is kept.' },
  { id:136, t:'Card 16 — Map Fragment I', loc:'Anse Gaulette Dune', coords:'-4.7491, 55.4906', phase:'climax', rarity:'Legendary', feature:['fragment1'], riddle:'Fragment I adds hours to Ros Sodyer sequence: 3—6—9 becomes 6—9—12 at moonrise.' },
  { id:137, t:'Card 17 — Pirate Ghost', loc:'Baie Lazare Mist', coords:'-4.7521, 55.4939', phase:'climax', rarity:'Legendary', feature:['ghost'], riddle:'Request silence; remaining echo count subtracts from Fragment I’s shift to gate Card 19.' },
  { id:138, t:'Card 18 — Map Fragment II', loc:'Morne Blanc Overlook', coords:'-4.6492, 55.4475', phase:'climax', rarity:'Epic', feature:['fragment2','granite'], riddle:'Fragment II flips deviation from Port Launay (Card 10); reversed south becomes the entrance key.' },
  { id:139, t:'Card 19 — Final Sea Cave', loc:'Hidden Sea Cave', coords:'-4.7442, 55.4979', phase:'climax', rarity:'Legendary', feature:['cave','torch','fragment1'], riddle:'Present both fragments plus ghost subtraction; speak tide span to reveal the last hour.' },
  { id:140, t:'Card 20 — Torn Parchment', loc:'Shoreline Firepit', coords:'-4.7481, 55.4891', phase:'climax', rarity:'Epic', feature:['torn'], riddle:'Edge contour mirrors bay curve — the final chapter concludes with this revelation.' }
];

// Clue linkage map (explicit interlocks for metadata attribute)
const CLUE_LINKS = {
  121:[125,136], 122:[134], 123:[134,138], 124:[133,136], 125:[136], 126:[136,139],
  127:[131], 128:[126,135], 129:[133,139], 130:[138], 131:[127,135], 132:[135],
  133:[135,139], 134:[138], 135:[133], 136:[139], 137:[139], 138:[139], 139:[140], 140:[]
};

function featureLayer(ctx, featureArr, phase){
  for(const f of featureArr){
    switch(f){
      case 'ship': shipSilhouette(ctx); break;
      case 'beach': beachSand(ctx); surfLines(ctx); break;
      case 'palms': lushPalms(ctx, 4); break;
      case 'granite': pinkGranite(ctx); break;
      case 'waterfall': waterfall(ctx, WIDTH*0.12, HEIGHT*0.18, 120, 280); break;
      case 'rockpool': rockPool(ctx); break;
      case 'cave': cave(ctx); break;
      case 'compass': compass(ctx, WIDTH*0.16, HEIGHT*0.26, 80, 0.75); break;
      case 'treasure': treasureChest(ctx); break;
      case 'fragment1': mapFragment(ctx,1); break;
      case 'fragment2': mapFragment(ctx,2); break;
      case 'ghost': ghost(ctx); break;
      case 'torch': // overlay flame pools
        for(let i=0;i<2;i++){const tx=WIDTH*0.45 + i*80, ty=HEIGHT*0.58; const g=ctx.createRadialGradient(tx,ty,4,tx,ty,50); g.addColorStop(0,'rgba(255,200,90,0.95)'); g.addColorStop(1,'rgba(255,120,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(tx,ty,50,0,Math.PI*2); ctx.fill(); }
        break;
      case 'cutlasses': // stylized crossed blades
        ctx.save(); ctx.strokeStyle='#d9e4ec'; ctx.lineWidth=10; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(WIDTH*0.70, HEIGHT*0.55); ctx.lineTo(WIDTH*0.82, HEIGHT*0.68); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(WIDTH*0.82, HEIGHT*0.55); ctx.lineTo(WIDTH*0.70, HEIGHT*0.68); ctx.stroke(); ctx.restore();
        break;
      case 'skull': ctx.save(); const sx=WIDTH*0.72, sy=HEIGHT*0.60; ctx.fillStyle='#f4efe4'; ctx.beginPath(); ctx.ellipse(sx,sy,46,38,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#111'; ctx.beginPath(); ctx.ellipse(sx-16,sy-6,10,14,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(sx+16,sy-6,10,14,0,0,Math.PI*2); ctx.fill(); ctx.fillRect(sx-10, sy+12, 20, 12); ctx.restore();
        break;
      case 'route': ctx.save(); ctx.strokeStyle='rgba(200,160,60,0.9)'; ctx.setLineDash([10,8]); ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(WIDTH*0.18, HEIGHT*0.64); ctx.quadraticCurveTo(WIDTH*0.42, HEIGHT*0.58, WIDTH*0.58, HEIGHT*0.66); ctx.quadraticCurveTo(WIDTH*0.76, HEIGHT*0.74, WIDTH*0.88, HEIGHT*0.70); ctx.stroke(); ctx.restore(); break;
      case 'trail': ctx.save(); ctx.strokeStyle='rgba(180,140,80,0.85)'; ctx.lineWidth=14; ctx.beginPath(); ctx.moveTo(WIDTH*0.15, HEIGHT*0.70); ctx.quadraticCurveTo(WIDTH*0.40, HEIGHT*0.54, WIDTH*0.62, HEIGHT*0.50); ctx.quadraticCurveTo(WIDTH*0.78, HEIGHT*0.46, WIDTH*0.90, HEIGHT*0.40); ctx.stroke(); ctx.restore(); break;
      case 'script': ctx.save(); ctx.fillStyle='rgba(250,240,218,0.85)'; ctx.fillRect(WIDTH*0.60, HEIGHT*0.46, 160, 140); ctx.fillStyle='rgba(60,40,20,0.85)'; ctx.font='24px Georgia'; for(let l=0;l<5;l++){ let line=''; const len=6+r(0,3)|0; for(let c=0;c<len;c++) line += String.fromCharCode(0x16A0 + (c*3 + l)%40); ctx.fillText(line, WIDTH*0.62, HEIGHT*0.50 + l*26); } ctx.restore(); break;
      case 'torn': ctx.save(); const bx=WIDTH*0.66, by=HEIGHT*0.50; ctx.fillStyle='rgba(250,238,206,0.9)'; ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+150,by-6); ctx.lineTo(bx+140,by+120); ctx.lineTo(bx+40,by+132); ctx.lineTo(bx+18,by+90); ctx.closePath(); ctx.fill(); ctx.strokeStyle='rgba(120,90,50,0.8)'; ctx.setLineDash([12,8]); ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(bx+20,by+24); ctx.lineTo(bx+120,by+94); ctx.stroke(); ctx.restore(); break;
      case 'parrot': ctx.save(); const px=WIDTH*0.30, py=HEIGHT*0.42; ctx.fillStyle='#1aa84a'; ctx.beginPath(); ctx.ellipse(px,py,32,46,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#ffcf2b'; ctx.beginPath(); ctx.arc(px+20,py-12,12,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(px+12,py-16,4,0,Math.PI*2); ctx.fill(); ctx.restore(); break;
    }
  }
}

function background(ctx, phase){ // layered tropical + mood
  const pal = PALETTES[phase];
  const sky = ctx.createLinearGradient(0,0,0,HEIGHT*0.55);
  sky.addColorStop(0, pal[2]);
  sky.addColorStop(0.5, pal[1]);
  sky.addColorStop(1, pal[0]);
  ctx.fillStyle=sky; ctx.fillRect(0,0,WIDTH,HEIGHT*0.55);
  horizonWater(ctx, phase);
  if(phase==='arrival') sunGlow(ctx, WIDTH*0.78, HEIGHT*0.18, 140); else moon(ctx, WIDTH*0.80, HEIGHT*0.16, 60);
  clouds(ctx, phase==='false'?2:6);
}

function compose(card){
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  background(ctx, card.phase);
  featureLayer(ctx, card.feature, card.phase);
  noise(ctx, 2600, 0.04);
  vignette(ctx);
  headerTitle(ctx, `Chapter 3 — ${card.t}`);
  rarityBadge(ctx, card.rarity);
  subInfo(ctx, `${card.loc}  •  ${card.coords}  •  ${card.rarity}`);
  riddleText(ctx, card.riddle);
  vignette(ctx);
  return canvas;
}

function meta(card){
  return {
    name: `Chapter 3 — ${card.t}`,
    description: `Chapter 3 — The Landing at Anse Gaulette. ${card.t}. Riddle: ${card.riddle} This tropical illustrated placeholder card interlocks with others to advance the Seychelles legend quest.`,
    image: `/real/images/${card.id}.png`,
    attributes: [
      { trait_type: 'Chapter', value: 'Chapter 3 — The Landing at Anse Gaulette' },
      { trait_type: 'Rarity', value: card.rarity },
      { trait_type: 'Location', value: card.loc },
      { trait_type: 'Coordinates', value: card.coords },
      { trait_type: 'Phase', value: card.phase },
      { trait_type: 'Card', value: card.id - 120 },
      { trait_type: 'Theme', value: 'Vibrant Tropical Pirate Adventure' },
      { trait_type: 'ClueLinks', value: (CLUE_LINKS[card.id]||[]).join(', ') }
    ]
  };
}

async function main(){
  console.log('🌴 Generating tropical Chapter 3 illustrated placeholders (20 items)...');
  for(const card of CARDS){
    const canvas = compose(card);
    const outImg = path.join(IMAGES_DIR, `${card.id}.png`);
    await fs.writeFile(outImg, canvas.toBuffer('image/png'));
    await fs.writeJson(path.join(META_DIR, `${card.id}.json`), meta(card), { spaces:2 });
    console.log(`✅ ${card.id} -> ${card.t}`);
  }
  console.log('✅ Done. NO MINTING. Review in app.');
}

await main();
