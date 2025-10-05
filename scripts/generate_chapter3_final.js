// FINAL Chapter 3 Generator (NO MINT) — Produces 20 high-detail illustrated placeholders + full metadata
// Tokens: 121–140 (Chapter 3 — The Landing at Anse Gaulette)
// This script implements the approved spec in chapter3_final_spec.md

import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const WIDTH = 1024;
const HEIGHT = 1024;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, 'dist');
const IMAGES_DIR = path.join(DIST_DIR, 'images');
const META_DIR = path.join(DIST_DIR, 'metadata');
await fs.ensureDir(IMAGES_DIR); await fs.ensureDir(META_DIR);

function rand(min,max){return Math.random()*(max-min)+min;}
function vignette(ctx){const g=ctx.createRadialGradient(WIDTH/2,HEIGHT/2,WIDTH*0.25,WIDTH/2,HEIGHT/2,WIDTH*0.8);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,0.65)');ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT);} 
function noise(ctx,n=4800,a=0.05){ctx.save();for(let i=0;i<n;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*a})`;ctx.fillRect(rand(0,WIDTH),rand(0,HEIGHT),1,1);}ctx.restore();}
function gradientSky(ctx,phase){const g=ctx.createLinearGradient(0,0,0,HEIGHT*0.6);if(phase==='arrival'){g.addColorStop(0,'#042c46');g.addColorStop(1,'#056b88');} else if(phase==='inland'){g.addColorStop(0,'#06352b');g.addColorStop(1,'#0d6c42');} else if(phase==='false'){g.addColorStop(0,'#2b1526');g.addColorStop(1,'#5a2e48');} else {g.addColorStop(0,'#061e33');g.addColorStop(1,'#0c4764');} ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT*0.6);} 
function horizonWater(ctx){const g=ctx.createLinearGradient(0,HEIGHT*0.4,0,HEIGHT);g.addColorStop(0,'#0c5d74');g.addColorStop(0.5,'#064452');g.addColorStop(1,'#022b33');ctx.fillStyle=g;ctx.fillRect(0,HEIGHT*0.4,WIDTH,HEIGHT*0.6);} 
function sunOrMoon(ctx,phase){if(phase==='arrival'){const g=ctx.createRadialGradient(WIDTH*0.82,HEIGHT*0.18,0,WIDTH*0.82,HEIGHT*0.18,140);g.addColorStop(0,'rgba(255,240,200,0.95)');g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(WIDTH*0.82,HEIGHT*0.18,140,0,Math.PI*2);ctx.fill();} else {const g=ctx.createRadialGradient(WIDTH*0.80,HEIGHT*0.16,0,WIDTH*0.80,HEIGHT*0.16,110);g.addColorStop(0,'rgba(255,255,250,0.9)');g.addColorStop(1,'rgba(255,255,250,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(WIDTH*0.80,HEIGHT*0.16,110,0,Math.PI*2);ctx.fill();}}
function clouds(ctx,count=8){ctx.save();for(let i=0;i<count;i++){const x=rand(80,WIDTH-80), y=rand(60,HEIGHT*0.35), w=rand(160,300), h=rand(70,120);const grd=ctx.createLinearGradient(x,y,x,y+h);grd.addColorStop(0,'rgba(255,255,255,0.85)');grd.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=grd;ctx.beginPath();ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);ctx.fill();}ctx.restore();}
function foamLines(ctx){ctx.save();ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.beginPath();const y=HEIGHT*0.72 + i*16;for(let x=0;x<=WIDTH;x+=18){const yy=y+Math.sin((x*0.035)+i)*4; if(x===0) ctx.moveTo(x,yy); else ctx.lineTo(x,yy);}ctx.stroke();}ctx.restore();}
function beachSand(ctx){const g=ctx.createLinearGradient(0,HEIGHT*0.65,0,HEIGHT);g.addColorStop(0,'rgba(255,245,225,0.3)');g.addColorStop(1,'rgba(255,250,240,0.9)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,HEIGHT*0.65);ctx.quadraticCurveTo(WIDTH*0.4,HEIGHT*0.60, WIDTH*0.65,HEIGHT*0.70);ctx.quadraticCurveTo(WIDTH*0.85,HEIGHT*0.78, WIDTH,HEIGHT*0.75);ctx.lineTo(WIDTH,HEIGHT);ctx.lineTo(0,HEIGHT);ctx.closePath();ctx.fill();}
function palms(ctx,count=6){ctx.save();for(let i=0;i<count;i++){const x=rand(80,WIDTH-80), base=HEIGHT*0.66 + rand(-20,40), h=rand(170,260);ctx.strokeStyle='#315829';ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+rand(-40,40), base-h*0.6, x+rand(-12,12));ctx.lineTo(x+rand(-10,10), base-h);ctx.stroke();for(let fr=0;fr<7;fr++){const ang=-Math.PI/2 + fr*(Math.PI/7) + rand(-0.25,0.25);const len=rand(90,160);ctx.strokeStyle='#3f8a35';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x, base-h);ctx.lineTo(x+Math.cos(ang)*len, base-h+Math.sin(ang)*len);ctx.stroke();}}ctx.restore();}
function pinkGranite(ctx,variant=0){ctx.save();ctx.fillStyle='#b97463';ctx.beginPath();ctx.moveTo(0,HEIGHT*0.60);ctx.lineTo(WIDTH*0.2,HEIGHT*0.48);ctx.lineTo(WIDTH*0.38,HEIGHT*0.56);ctx.lineTo(WIDTH*0.55,HEIGHT*0.44);ctx.lineTo(WIDTH*0.72,HEIGHT*0.53);ctx.lineTo(WIDTH*0.9,HEIGHT*0.47);ctx.lineTo(WIDTH,HEIGHT*0.50);ctx.lineTo(WIDTH,HEIGHT);ctx.lineTo(0,HEIGHT);ctx.closePath();ctx.fill();ctx.globalAlpha=0.28;ctx.fillStyle='#d49d90';for(let i=0;i<60;i++){ctx.beginPath();ctx.ellipse(rand(0,WIDTH),rand(HEIGHT*0.44,HEIGHT*0.65),rand(10,46),rand(6,26),rand(0,Math.PI),0,Math.PI*2);ctx.fill();}ctx.restore();}
function waterfall(ctx){const x=WIDTH*0.14,y=HEIGHT*0.30,w=140,h=340;const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'rgba(220,245,255,0.95)');g.addColorStop(1,'rgba(120,200,235,0.55)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=2;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(x+w*(i/9),y);ctx.lineTo(x+w*(i/9)+rand(-6,6), y+h);ctx.stroke();}}
function rockPool(ctx){const cx=WIDTH*0.70, cy=HEIGHT*0.70;for(let ring=0; ring<4; ring++){ctx.beginPath();ctx.strokeStyle=`rgba(0,160,210,${0.85 - ring*0.18})`;ctx.lineWidth=5-ring;ctx.arc(cx,cy, 55+ring*30, 0, Math.PI*2);ctx.stroke();}}
function cave(ctx){ctx.save();ctx.fillStyle='#111820';ctx.beginPath();ctx.moveTo(WIDTH*0.42,HEIGHT*0.54);ctx.quadraticCurveTo(WIDTH*0.53,HEIGHT*0.30, WIDTH*0.64,HEIGHT*0.54);ctx.lineTo(WIDTH*0.60,HEIGHT*0.84);ctx.lineTo(WIDTH*0.46,HEIGHT*0.84);ctx.closePath();ctx.fill();ctx.restore();}
function compass(ctx,x,y,r,a=1){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle='#f6d488';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.font='bold 30px Georgia';ctx.fillStyle='#f6d488';ctx.textAlign='center';ctx.fillText('N',x,y-r+34);ctx.fillText('S',x,y+r-12);ctx.fillText('W',x-r+24,y+10);ctx.fillText('E',x+r-24,y+10);ctx.restore();}
function ship(ctx){ctx.save();ctx.fillStyle='#0c2028';ctx.beginPath();ctx.moveTo(WIDTH*0.16,HEIGHT*0.62);ctx.lineTo(WIDTH*0.30,HEIGHT*0.62);ctx.lineTo(WIDTH*0.26,HEIGHT*0.68);ctx.lineTo(WIDTH*0.18,HEIGHT*0.68);ctx.closePath();ctx.fill();ctx.strokeStyle='#0f303c';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(WIDTH*0.23,HEIGHT*0.44);ctx.lineTo(WIDTH*0.23,HEIGHT*0.62);ctx.stroke();ctx.fillStyle='#fafafa';ctx.beginPath();ctx.moveTo(WIDTH*0.23,HEIGHT*0.44);ctx.lineTo(WIDTH*0.31,HEIGHT*0.56);ctx.lineTo(WIDTH*0.23,HEIGHT*0.56);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(WIDTH*0.23,HEIGHT*0.48);ctx.lineTo(WIDTH*0.16,HEIGHT*0.58);ctx.lineTo(WIDTH*0.23,HEIGHT*0.58);ctx.closePath();ctx.fill();ctx.restore();}
function treasureChest(ctx){ctx.save();const x=WIDTH*0.80,y=HEIGHT*0.74;ctx.fillStyle='#654321';ctx.fillRect(x-70,y-30,140,70);ctx.fillStyle='#7a4a25';ctx.beginPath();ctx.moveTo(x-70,y-30);ctx.quadraticCurveTo(x,y-90,x+70,y-30);ctx.lineTo(x+70,y-12);ctx.lineTo(x-70,y-12);ctx.closePath();ctx.fill();ctx.fillStyle='#d4b24f';ctx.fillRect(x-6,y-30,12,72);ctx.fillStyle='#f4d46a';for(let i=0;i<18;i++){ctx.beginPath();ctx.arc(x-50 + i*6, y+34 - rand(0,14), 3,0,Math.PI*2);ctx.fill();}ctx.restore();}
function skull(ctx){ctx.save();const sx=WIDTH*0.74, sy=HEIGHT*0.70;ctx.fillStyle='#f4efe4';ctx.beginPath();ctx.ellipse(sx,sy,54,44,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(sx-18,sy-8,12,16,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(sx+18,sy-8,12,16,0,0,Math.PI*2);ctx.fill();ctx.fillRect(sx-14, sy+16, 28, 14);ctx.restore();}
function parrot(ctx){ctx.save();const px=WIDTH*0.30, py=HEIGHT*0.56;ctx.fillStyle='#1aa84a';ctx.beginPath();ctx.ellipse(px,py,40,56,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffcf2b';ctx.beginPath();ctx.arc(px+26,py-14,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(px+18,py-20,5,0,Math.PI*2);ctx.fill();ctx.restore();}
function torchPair(ctx){for(let i=0;i<2;i++){const tx=WIDTH*0.50 + i*90, ty=HEIGHT*0.62;const g=ctx.createRadialGradient(tx,ty,6,tx,ty,70);g.addColorStop(0,'rgba(255,210,110,0.95)');g.addColorStop(1,'rgba(255,140,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(tx,ty,70,0,Math.PI*2);ctx.fill();}}
function fragment(ctx,variant=1){ctx.save();const bx=WIDTH*0.74, by=HEIGHT*0.58;ctx.fillStyle='rgba(245,232,200,0.95)';ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+180,by-12);ctx.lineTo(bx+160,by+140);ctx.lineTo(bx+40,by+150);ctx.lineTo(bx+15,by+110);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(120,90,50,0.85)';ctx.setLineDash([14,10]);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bx+30,by+30);ctx.lineTo(bx+140,by+110);ctx.stroke();if(variant===2){ctx.beginPath();ctx.moveTo(bx+50,by+18);ctx.lineTo(bx+150,by+18);ctx.stroke();}ctx.restore();}
function ghost(ctx){const x=WIDTH*0.68,y=HEIGHT*0.58;const g=ctx.createRadialGradient(x,y,10,x,y,180);g.addColorStop(0,'rgba(240,255,255,0.95)');g.addColorStop(1,'rgba(240,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,180,0,Math.PI*2);ctx.fill();}
function scriptWall(ctx){ctx.save();ctx.fillStyle='rgba(250,240,218,0.9)';const x=WIDTH*0.66,y=HEIGHT*0.50,w=220,h=200;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(60,40,20,0.85)';ctx.font='28px Georgia';for(let l=0;l<6;l++){let line='';const len=7+(l%2);for(let c=0;c<len;c++) line += String.fromCharCode(0x16A0 + (c*5 + l)%60);ctx.fillText(line, x+12, y+38 + l*30);}ctx.restore();}
function crossedCutlasses(ctx){ctx.save();ctx.strokeStyle='#d9e4ec';ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(WIDTH*0.72, HEIGHT*0.66);ctx.lineTo(WIDTH*0.86, HEIGHT*0.82);ctx.stroke();ctx.beginPath();ctx.moveTo(WIDTH*0.86, HEIGHT*0.66);ctx.lineTo(WIDTH*0.72, HEIGHT*0.82);ctx.stroke();ctx.restore();}
function routeDash(ctx){ctx.save();ctx.strokeStyle='rgba(200,160,60,0.9)';ctx.setLineDash([14,10]);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(WIDTH*0.20, HEIGHT*0.76);ctx.quadraticCurveTo(WIDTH*0.46, HEIGHT*0.70, WIDTH*0.64, HEIGHT*0.78);ctx.quadraticCurveTo(WIDTH*0.80, HEIGHT*0.84, WIDTH*0.90, HEIGHT*0.80);ctx.stroke();ctx.restore();}

// Spec Data (abbreviated from spec file)
const CARDS = [
  {id:121, title:'Card 01 — Landing at Anse Gaulette', rarity:'Epic', bearing:72, coords:'-4.7498, 55.4912', island:'Baie Lazare Shore', tag:'ANCHOR_BASE', phase:'arrival', links:[125,136], riddle:'Where the anchor greets first light, take the line the reef points before the sun owns it.', desc:'Moonlit landing: longboat, half-buried anchor, turquoise reef teeth, pure white sand, distant palms, subtle treasure rope coil.'},
  {id:122, title:'Card 02 — Reef Groove Survey', rarity:'Rare', bearing:84, coords:'-4.7509, 55.4921', island:'Lazare Picault Edge', tag:'GROOVE_COUNT', phase:'arrival', links:[134], riddle:'Count the twelve scars; add them to dawn’s base bearing.', desc:'Pink granite slab etched with grooves, measuring rope, amber compass glow, misted spray and coral flares.'},
  {id:123, title:'Card 03 — Dawn Mist Alignment', rarity:'Legendary', bearing:79, coords:'-4.7519, 55.4931', island:'Baie Lazare Mist Line', tag:'MIST_OFFSET', phase:'arrival', links:[134,138], riddle:'If the twin backs vanish, subtract the veil’s five.', desc:'Low mist across reef, twin reef humps fading, spectral compass rose halo emanating faint light.'},
  {id:124, title:'Card 04 — Sans Souci Veil', rarity:'Epic', bearing:86, coords:'-4.6512, 55.4480', island:'Sans Souci Waterfall', tag:'VEIL_SIGIL', phase:'arrival', links:[133,136], riddle:'Light reveals seven more only when the veil breathes silver.', desc:'Silver-sheet waterfall, hidden sigil brightened by reflected torch, lush emerald ferns and mossed granite.'},
  {id:125, title:'Card 05 — Shoreline Cipher', rarity:'Rare', bearing:86, coords:'-4.7485, 55.4898', island:'Baie Lazare Drift Zone', tag:'SHORE_CIPHER', phase:'arrival', links:[136], riddle:'Crosses in wet sand confirm the seventh’s truth.', desc:'Driftwood arrangement forming an X-rune, foam glow, small crab shadow, verifying prior shift.'},
  {id:126, title:'Card 06 — Ros Sodyer Resonance', rarity:'Epic', bearing:86, coords:'-4.3613, 55.8249', island:'Ros Sodyer Rock Pool', tag:'POOL_RIPPLES', phase:'inland', links:[136,139], riddle:'Three, then six, then nine: store them—time will stretch.', desc:'Bioluminescent concentric ripples, clear tide pool, coral heads below, overhead moon reflection.'},
  {id:127, title:'Card 07 — Parrot Sentinel', rarity:'Rare', bearing:86, coords:'-4.6395, 55.4489', island:'Forest Fringe', tag:'PARROT_INVERT', phase:'inland', links:[131], riddle:'Invert its hidden hue to ignore the liar’s ascent.', desc:'Vivid parrot perched by lagoon puddle creating inverted color reflection, twisting palms.'},
  {id:128, title:'Card 08 — Skull Cairn Marker', rarity:'Rare', bearing:86, coords:'-4.7461, 55.4955', island:'Coconut Grove', tag:'SKULL_ANGLES', phase:'inland', links:[126,135], riddle:'Add the hollow gaze angles; keep them for the minutes.', desc:'Palm-root cairn, carved skull, angled bone fragments forming reference V, ember torch stub.'},
  {id:129, title:'Card 09 — Echo Cavern Trail', rarity:'Epic', bearing:86, coords:'-4.6510, 55.4823', island:'Cascade Coastal Trail', tag:'ECHO_TRIADS', phase:'inland', links:[133,139], riddle:'Echoes in threes divide the minutes you saved.', desc:'Shallow cave mouth, tide pulses triple echoes, luminous moss and hanging vines.'},
  {id:130, title:'Card 10 — Port Launay Twilight Drift', rarity:'Rare', bearing:90, coords:'-4.6450, 55.4062', island:'Port Launay Bay', tag:'DRIFT_DEVIATE', phase:'inland', links:[138], riddle:'When the bay swallows gold, add four unless night disputes it later.', desc:'Sunset bay, drifting ship silhouette, leaning compass needle, copper-purple sky gradient.'},
  {id:131, title:'Card 11 — False Ridge Decoy', rarity:'Rare', bearing:90, coords:'-4.6503, 55.4488', island:'Morne Blanc Ridge', tag:'RIDGE_DECOY', phase:'false', links:[127,135], riddle:'The path that climbs demands ten more—heed the sentinel to refuse.', desc:'Steep ridge carved arrow upward, low cloud curling, faint parrot distant.'},
  {id:132, title:'Card 12 — Grove Ambush', rarity:'Epic', bearing:90, coords:'-4.7461, 55.4955', island:'Coconut Grove', tag:'AMBUSH_INVERT', phase:'false', links:[135], riddle:'Crossed steel would flip what drift proposed—unless already annulled.', desc:'Crossed cutlasses shadow, overturned crate, scattered beads, tense palm shade.'},
  {id:133, title:'Card 13 — Twin Torch Revelation', rarity:'Epic', bearing:88, coords:'-4.6518, 55.4496', island:'Sans Souci Passage', tag:'TORCH_ALT_RUNES', phase:'false', links:[135,139], riddle:'Read every second flame-mark to subtract two.', desc:'Two torches illuminating alternating runes, moisture haze, arch curvature.'},
  {id:134, title:'Card 14 — Granite Divergence', rarity:'Rare', bearing:88, coords:'-4.6490, 55.4520', island:'Granite Slab Overlook', tag:'GRANITE_SPLIT', phase:'false', links:[138], riddle:'Of the twins, take the cooler star-lit course.', desc:'Split granite plate etched dual bearings 088/094, star glow selects cooler.'},
  {id:135, title:'Card 15 — Script Wall Bearing Key', rarity:'Rare', bearing:88, coords:'-4.6498, 55.4808', island:'Cascade Script Wall', tag:'SCRIPT_SELECT', phase:'false', links:[133], riddle:'Keep only runes the fire skipped—assemble the bearing lettered.', desc:'Weathered runic wall, faint overlay grid, selective rune glow pattern.'},
  {id:136, title:'Card 16 — Map Fragment I', rarity:'Legendary', bearing:91, coords:'-4.7491, 55.4906', island:'Anse Gaulette Dune', tag:'FRAGMENT_I', phase:'climax', links:[139], riddle:'Add three when moon crowns the rings.', desc:'Glowing parchment fragment overlay of shoreline + numeric ring sequence.'},
  {id:137, title:'Card 17 — Pirate’s Ghost Intercession', rarity:'Legendary', bearing:90, coords:'-4.7521, 55.4939', island:'Baie Lazare Mist', tag:'GHOST_SUBTRACT', phase:'climax', links:[139], riddle:'Silence all but one—subtract the remainder.', desc:'Spectral captain form, swirling mist inward, faint hourglass apparition.'},
  {id:138, title:'Card 18 — Map Fragment II', rarity:'Epic', bearing:90, coords:'-4.6492, 55.4475', island:'Morne Blanc Overlook', tag:'FRAGMENT_II', phase:'climax', links:[139], riddle:'Flip the earliest gain; leave the heading whole.', desc:'Second fragment with inland contour lines, mirrored compass mini-rose.'},
  {id:139, title:'Card 19 — Final Sea Cave Convergence', rarity:'Legendary', bearing:90, coords:'-4.7442, 55.4979', island:'Hidden Sea Cave', tag:'CAVE_UNLOCK', phase:'climax', links:[140], riddle:'Present fragments, apply silence and stretched time; speak the eastward hour.', desc:'Sea cave interior, fragments assembled above tide pool, ghost residue glow, projected overlay.'},
  {id:140, title:'Card 20 — Torn Parchment Contour', rarity:'Epic', bearing:90, coords:'-4.7481, 55.4891', island:'Shoreline Firepit', tag:'TORN_CONTOUR', phase:'climax', links:[], riddle:'The contour aims beyond—carry the ninety forward.', desc:'Firepit ash glow, final torn edge pointing horizon path to next chapter.'}
];

// Draw feature layers chosen per card tag
function drawFeatures(ctx, card){
  // base environmental layers
  gradientSky(ctx, card.phase);
  horizonWater(ctx);
  if(['arrival','inland'].includes(card.phase)) beachSand(ctx);
  if(card.phase==='arrival') foamLines(ctx);
  if(card.phase==='inland') palms(ctx,4);
  if(card.phase==='false') {pinkGranite(ctx); palms(ctx,3);} // provide variability
  if(card.phase==='climax') {pinkGranite(ctx);}

  // card-specific overlays
  switch(card.tag){
    case 'ANCHOR_BASE': ship(ctx); compass(ctx, WIDTH*0.50, HEIGHT*0.30, 90, 0.20); routeDash(ctx); break;
    case 'GROOVE_COUNT': pinkGranite(ctx); compass(ctx, WIDTH*0.78, HEIGHT*0.30, 80, 0.25); break;
    case 'MIST_OFFSET': foamLines(ctx); compass(ctx, WIDTH*0.80, HEIGHT*0.28, 110, 0.28); break;
    case 'VEIL_SIGIL': waterfall(ctx); compass(ctx, WIDTH*0.30, HEIGHT*0.26, 80, 0.22); break;
    case 'SHORE_CIPHER': routeDash(ctx); break;
    case 'POOL_RIPPLES': rockPool(ctx); compass(ctx, WIDTH*0.24, HEIGHT*0.28, 70, 0.22); break;
    case 'PARROT_INVERT': parrot(ctx); break;
    case 'SKULL_ANGLES': skull(ctx); break;
    case 'ECHO_TRIADS': cave(ctx); break;
    case 'DRIFT_DEVIATE': ship(ctx); compass(ctx, WIDTH*0.22, HEIGHT*0.30, 90, 0.28); break;
    case 'RIDGE_DECOY': pinkGranite(ctx); break;
    case 'AMBUSH_INVERT': crossedCutlasses(ctx); palms(ctx,2); break;
    case 'TORCH_ALT_RUNES': cave(ctx); torchPair(ctx); break;
    case 'GRANITE_SPLIT': pinkGranite(ctx); compass(ctx, WIDTH*0.78, HEIGHT*0.30, 90, 0.30); break;
    case 'SCRIPT_SELECT': scriptWall(ctx); break;
    case 'FRAGMENT_I': fragment(ctx,1); break;
    case 'GHOST_SUBTRACT': ghost(ctx); break;
    case 'FRAGMENT_II': fragment(ctx,2); break;
    case 'CAVE_UNLOCK': cave(ctx); fragment(ctx,1); fragment(ctx,2); ghost(ctx); break;
    case 'TORN_CONTOUR': fragment(ctx,2); break;
  }
}

function rarityBadge(ctx, rarity){const x=WIDTH-220,y=34,w=190,h=54;const palette={Legendary:['#ffe89a','#b68700'],Epic:['#b7d3ff','#2c4f99'],Rare:['#c6ffd8','#1f6c45']};const col=palette[rarity]||['#ddd','#666'];const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,col[0]);g.addColorStop(1,col[1]);ctx.save();ctx.fillStyle=g;ctx.strokeStyle='rgba(0,0,0,0.55)';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,14):ctx.rect(x,y,w,h);ctx.fill();ctx.stroke();ctx.font='bold 26px Georgia';ctx.fillStyle='#0c0c0c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(rarity,x+w/2,y+h/2);ctx.restore();}
function titleText(ctx, text){ctx.save();ctx.font='bold 40px Georgia';ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=8;ctx.fillStyle='#ffe5a8';ctx.fillText(text,48,42);ctx.restore();}
function subInfo(ctx,text){ctx.save();ctx.font='20px Georgia';ctx.fillStyle='rgba(255,255,255,0.95)';ctx.fillText(text,48,HEIGHT-260);ctx.restore();}
function wrap(ctx,text,x,y,maxWidth,lineHeight){const words=text.split(' ');let line='',yy=y;for(const w of words){const test=line + w + ' '; if(ctx.measureText(test).width>maxWidth){ctx.fillText(line,x,yy); line=w + ' '; yy+=lineHeight;} else line=test;}ctx.fillText(line,x,yy);} 
function riddleBlock(ctx,text){ctx.save();ctx.font='22px Georgia';ctx.fillStyle='rgba(255,255,255,0.9)';wrap(ctx,text,48,HEIGHT-228, WIDTH-96, 28);ctx.restore();}

function compose(card){const canvas=createCanvas(WIDTH,HEIGHT);const ctx=canvas.getContext('2d');gradientSky(ctx,card.phase);sunOrMoon(ctx,card.phase);drawFeatures(ctx,card);noise(ctx,4000,0.045);vignette(ctx);titleText(ctx,`Chapter 3 — ${card.title}`);rarityBadge(ctx,card.rarity);subInfo(ctx,`${card.island}  •  ${card.coords}  •  Bearing ${card.bearing}°`);riddleBlock(ctx, card.riddle);vignette(ctx);return canvas;}

// Metadata builder
function buildMeta(card){return {
  name: `Chapter 3 — ${card.title}`,
  description: `Chapter 3 — The Landing at Anse Gaulette. ${card.title}. Scene: ${card.desc} Riddle: ${card.riddle}`,
  image: `/real/images/${card.id}.png`,
  attributes: [
    { trait_type: 'Chapter', value: 'Chapter 3 — The Landing at Anse Gaulette' },
    { trait_type: 'Island', value: card.island },
    { trait_type: 'Bearing', value: card.bearing },
    { trait_type: 'Coordinates', value: card.coords },
    { trait_type: 'Rarity', value: card.rarity },
    { trait_type: 'MysteryTag', value: card.tag },
    { trait_type: 'ClueLinks', value: card.links.join(', ') }
  ]
};}

async function main(){
  console.log('🗺️ Generating FINAL Chapter 3 set (NO MINT)...');
  for(const card of CARDS){
    const canvas = compose(card);
    const outImg = path.join(IMAGES_DIR, `${card.id}.png`);
    await fs.writeFile(outImg, canvas.toBuffer('image/png'));
    await fs.writeJson(path.join(META_DIR, `${card.id}.json`), buildMeta(card), { spaces:2 });
    console.log(`✅ ${card.id} ${card.title}`);
  }
  console.log('✅ FINAL imagery + metadata generated. Awaiting review & approval — NO MINT.');
}

await main();
