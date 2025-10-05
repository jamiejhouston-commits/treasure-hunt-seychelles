import { createCanvas, registerFont } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/*
  Chapter VI Pre-Mint Generator
  ---------------------------------
  Generates etched-map style card images + JSON metadata from dataset at content/ch6/ch6_cards.json
  (Initial visual implementation: simple parchment background + layered symbolic glyphs & text blocks.)
  Later: integrate richer painterly environmental scenes per card.
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname,'../content/ch6/ch6_cards.json');
const OUT_DIR = path.resolve(__dirname,'../content/ch6/output');
const FONTS_DIR = path.resolve(__dirname,'../fonts');

function tryRegisterFont(file, family, options={}){
  const p = path.join(FONTS_DIR,file);
  if(fs.existsSync(p)){
    try { registerFont(p,{ family, ...options }); }
    catch(e){ console.warn('Font registration failed', file, e.message); }
  } else {
    console.warn('Font missing (fallback in use):', file);
  }
}

// Attempt font registrations (silent if absent)
tryRegisterFont('Cinzel-Bold.ttf','Cinzel',{ weight:'700' });
tryRegisterFont('Inter-Regular.ttf','Inter',{ weight:'400' });
tryRegisterFont('Inter-SemiBold.ttf','Inter',{ weight:'600' });
tryRegisterFont('Inter-Medium.ttf','Inter',{ weight:'500' });
tryRegisterFont('Inter-Italic.ttf','Inter',{ style:'italic', weight:'400' });

async function loadCards(){
  return fs.readJson(DATA_PATH);
}

function rand(a,b){ return a + Math.random()*(b-a); }

function drawParchment(ctx,w,h){
  const base = ctx.createLinearGradient(0,0,w,h);
  base.addColorStop(0,'#2d2922');
  base.addColorStop(1,'#1d1a16');
  ctx.fillStyle=base; ctx.fillRect(0,0,w,h);
  // mottling
  for(let i=0;i<420;i++){
    const x=rand(0,w), y=rand(0,h); const r=rand(12,160);
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    const a=rand(0.02,0.08);
    g.addColorStop(0,`rgba(90,80,60,${a})`);
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  // edge vignette
  const v = ctx.createRadialGradient(w/2,h/2,w*0.2,w/2,h/2,w*0.85);
  v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=v; ctx.fillRect(0,0,w,h);
}

function drawEtchLines(ctx,w,h){
  // Subtle contour / map etch pattern using sine field
  ctx.save();
  ctx.globalAlpha=0.12; ctx.strokeStyle='rgba(180,150,110,0.35)';
  for(let y=60; y<h-60; y+=50){
    ctx.beginPath();
    for(let x=60; x<w-60; x+=10){
      const dy = Math.sin(x*0.012 + y*0.03)*6 + Math.sin(x*0.04)*2;
      if(x===60) ctx.moveTo(x, y+dy); else ctx.lineTo(x, y+dy);
    }
    ctx.stroke();
  }
  ctx.restore();
}

const PROP_ICONS = {
  anchors: '⚓', bats: '🦇', lanternCrack:'⟡', waxCircles:'◯', trueRunes:'✦', decoyGlyphs:'᛫',
  shard:'✪', tallies:'卍', niche:'▢', chains:'⛓', markedLinks:'✕', drums:'♩', fireflyClusters:'✸',
  rings:'◌', smokeCurls:'≈', straps:'∥', letters:'ℓ', lanterns:'✧', stones:'♦', ferns:'⋔',
  braids:'∞', ticks:'˟', notchPairs:'∷', fish:'≋', flame:'†', dancers:'☽', crosses:'✝', owlCalls:'ʘ',
  treeScars:'∣', maskGleam:'☗', saltCircles:'⊚', carvings:'⌘', batClusters:'🦇', stick:'∣',
  loops:'∿', prints:'•', gulls:'∧', chests:'☐', veinedLeaves:'❧', candles:'🕯', key:'⚷', tallies:'卍',
  skulls:'☠', shells:'✤', spines:'♐', cracks:'∧', halves:'∩', circle:'◯', shards:'✪', teeth:'⟡', runes:'ᚱ', compassRose:'✥'
};

function renderPropIcons(props){
  const parts = [];
  for(const [k,v] of Object.entries(props)){
    const icon = PROP_ICONS[k] || '?';
    parts.push(`${icon}${v}`);
  }
  return parts.join('  ');
}

function drawFrame(ctx,w,h){
  ctx.strokeStyle='rgba(200,170,110,0.55)';
  ctx.lineWidth=4; ctx.strokeRect(28,28,w-56,h-56);
  ctx.strokeStyle='rgba(120,90,60,0.4)';
  ctx.lineWidth=1.5; ctx.strokeRect(40,40,w-80,h-80);
}

function layoutText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(/\s+/); let line=''; let yy=y; const lines=[];
  for(const w of words){
    const test = line ? line+' '+w : w;
    const m = ctx.measureText(test).width;
    if(m>maxWidth && line){
      lines.push(line); line=w; yy += lineHeight;
    } else { line=test; }
  }
  if(line) lines.push(line);
  lines.forEach(l=>{ ctx.fillText(l,x,yy); yy+=lineHeight; });
  return yy;
}

function symbolicGlyph(ctx,cx,cy,r,seed){
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(seed*0.7);
  ctx.strokeStyle='rgba(170,150,120,0.55)'; ctx.lineWidth=2.2; ctx.beginPath();
  for(let i=0;i<8;i++){
    const ang = (Math.PI*2/8)*i;
    const rx = Math.cos(ang)*r; const ry = Math.sin(ang)*r;
    ctx.moveTo(0,0); ctx.lineTo(rx,ry);
    ctx.moveTo(rx,ry); ctx.arc(0,0,r,ang,ang+0.0001); // ensure path continuity
  }
  ctx.stroke();
  // inner circle
  ctx.beginPath(); ctx.arc(0,0,r*0.45,0,Math.PI*2); ctx.stroke();
  ctx.restore();
}

// --- Scenic Background (lightweight portrait adaptation) ---
function scenicBackground(ctx,W,H,card){
  const horizon = H*0.45;
  // Gradient sky
  const sky = ctx.createLinearGradient(0,0,0,horizon);
  sky.addColorStop(0,'#f8d7a5'); sky.addColorStop(0.5,'#c26b32'); sky.addColorStop(1,'#251a19');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,horizon);
  // Soft clouds
  ctx.save(); ctx.globalCompositeOperation='lighter';
  for(let i=0;i<28;i++){
    const cx=rand(-80,W+80), cy=rand(40,horizon*0.9); const rx=rand(120,340), ry=rx*rand(0.25,0.45);
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rx);
    g.addColorStop(0,'rgba(255,255,255,0.9)'); g.addColorStop(0.5,'rgba(255,255,255,0.4)'); g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.globalAlpha=rand(0.25,0.55); ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
  // Distant islands
  for(let L=0;L<2;L++){
    for(let i=0;i<4;i++){
      const baseX=rand(-60,W-40); const width=rand(W*0.12,W*0.25); const peak=horizon-rand(80,220)+L*30;
      const grad=ctx.createLinearGradient(0,peak,0,horizon);
      grad.addColorStop(0,`rgba(${40+L*10},${100+L*18},${55+L*10},${0.55-L*0.2})`); grad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=grad; ctx.beginPath(); ctx.moveTo(baseX,horizon); ctx.lineTo(baseX+width*0.25,peak); ctx.lineTo(baseX+width,horizon); ctx.closePath(); ctx.fill();
    }
  }
  // Water
  const waterGrad=ctx.createLinearGradient(0,horizon,0,H);
  waterGrad.addColorStop(0,'#124c66'); waterGrad.addColorStop(0.7,'#062a3a'); waterGrad.addColorStop(1,'#02141c');
  ctx.fillStyle=waterGrad; ctx.fillRect(0,horizon,W,H-horizon);
  // Wave strokes
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(let i=0;i<220;i++){
    const y=horizon+rand(10,H*0.95-horizon); const len=rand(60,400); const x=rand(-40,W-20);
    const a=0.035+(1-(y-horizon)/(H-horizon))*0.22; ctx.strokeStyle=`rgba(200,240,255,${a})`; ctx.lineWidth=rand(1,2.5);
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len,y+rand(-4,4)); ctx.stroke();
  }
  ctx.restore();
  // Props-driven accents
  const p=card.props||{};
  // Anchors -> draw rusty shapes near bottom
  if(p.anchors){
    for(let i=0;i<p.anchors;i++){
      const ax = (W*0.15)+i*W*0.12+rand(-20,20); const ay = H*0.78+rand(-10,30);
      ctx.save(); ctx.translate(ax,ay); ctx.rotate(rand(-0.4,0.4)); ctx.strokeStyle='rgba(150,90,50,0.8)'; ctx.lineWidth=6;
      ctx.beginPath(); ctx.moveTo(0,-40); ctx.lineTo(0,40); ctx.moveTo(-30,10); ctx.lineTo(0,40); ctx.lineTo(30,10); ctx.stroke();
      ctx.restore();
    }
  }
  // Drums -> glowing circles mid foreground
  if(p.drums){
    for(let i=0;i<p.drums;i++){
      const dx=W*0.25 + i*W*0.07 + rand(-10,10); const dy=H*0.7 + rand(-10,10); const r=28+rand(-6,6);
      const g=ctx.createRadialGradient(dx,dy,r*0.2,dx,dy,r);
      g.addColorStop(0,'rgba(255,180,80,0.9)'); g.addColorStop(1,'rgba(120,50,10,0.05)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(dx,dy,r,0,Math.PI*2); ctx.fill();
    }
  }
  // Bats / fireflyClusters -> sky sprites
  if(p.bats || p.batClusters){
    const count=(p.bats||0)+(p.batClusters||0)*3; ctx.fillStyle='rgba(30,20,20,0.9)';
    for(let i=0;i<count;i++){ const bx=rand(40,W-40), by=rand(40,horizon*0.8); ctx.beginPath(); ctx.ellipse(bx,by,10,4,rand(0,Math.PI),0,Math.PI*2); ctx.fill(); }
  }
  if(p.fireflyClusters){
    for(let i=0;i<p.fireflyClusters*15;i++){ const fx=rand(0,W), fy=rand(horizon*0.55,H*0.85); const g=ctx.createRadialGradient(fx,fy,0,fx,fy,6); g.addColorStop(0,'rgba(255,220,120,0.9)'); g.addColorStop(1,'rgba(255,220,120,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(fx,fy,6,0,Math.PI*2); ctx.fill(); }
  }
  // Subtle vignette
  const v=ctx.createRadialGradient(W/2,H/2,W*0.2,W/2,H/2,W*0.85); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,0.55)'); ctx.fillStyle=v; ctx.fillRect(0,0,W,H);
}

function pirateSilhouette(ctx,W,H,card){
  ctx.save();
  const x=W*0.75, y=H*0.78; ctx.translate(x,y); ctx.scale(1.1,1.1);
  ctx.fillStyle='rgba(20,12,10,0.85)';
  ctx.beginPath(); ctx.ellipse(0,-90,46,70,0,0,Math.PI*2); ctx.fill(); // torso
  ctx.beginPath(); ctx.ellipse(0,-150,30,34,0,0,Math.PI*2); ctx.fill(); // head
  // hat if anchors or drums present
  if((card.props||{}).anchors || (card.props||{}).drums){
    ctx.beginPath(); ctx.moveTo(-60,-170); ctx.quadraticCurveTo(0,-200,60,-170); ctx.quadraticCurveTo(0,-160,-60,-170); ctx.fill();
  }
  // arm / spyglass if bearing even
  if(card.bearingDeg % 2 === 1){
    ctx.beginPath(); ctx.rect(40,-140,70,18); ctx.fill(); // outstretched arm
    ctx.fillRect(110,-138,34,14); // spyglass block
  }
  ctx.restore();
}

function renderCard(card, withArt=false){
  const W=900, H=1400; const canvas=createCanvas(W,H); const ctx=canvas.getContext('2d');
  if(withArt){
    scenicBackground(ctx,W,H,card);
    pirateSilhouette(ctx,W,H,card);
    // Parchment panel overlay
    const panelX=60, panelY=70, panelW=W-120, panelH=H*0.62;
    ctx.save(); ctx.globalAlpha=0.92; drawParchment(ctx,panelW,panelH); // draw onto temp canvas approach
    // Instead of separate canvas, clip region
    const panelImg = ctx.getImageData(0,0,panelW,panelH);
    ctx.restore();
    // Darken area under panel first
    ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fillRect(panelX-10,panelY-10,panelW+20,panelH+20);
    // Write panel image
    const panelCanvas = createCanvas(panelW,panelH); const pctx=panelCanvas.getContext('2d');
    drawParchment(pctx,panelW,panelH); drawEtchLines(pctx,panelW,panelH); drawFrame(pctx,panelW,panelH);
    ctx.drawImage(panelCanvas, panelX, panelY);
    ctx.save(); ctx.beginPath(); ctx.rect(panelX,panelY,panelW,panelH); ctx.clip();
    // Text inside panel using offsets
    ctx.fillStyle='#d9c7a0'; ctx.font='700 38px Cinzel'; ctx.textAlign='center';
    layoutText(ctx, card.title, W/2, panelY+70, panelW-80, 46);
    ctx.strokeStyle='rgba(210,180,120,0.5)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(panelX+80,panelY+140); ctx.lineTo(panelX+panelW-80,panelY+140); ctx.stroke();
    ctx.textAlign='left'; ctx.font='400 19px Inter'; ctx.fillStyle='rgba(220,210,190,0.88)';
    let y = panelY+180;
    y = layoutText(ctx, card.scene, panelX+70, y, panelW-140, 28) + 18;
    ctx.font='600 19px Inter'; ctx.fillStyle='rgba(225,200,150,0.9)';
    layoutText(ctx, 'Props: '+Object.entries(card.props).map(([k,v])=>`${k}=${v}`).join(', '), panelX+70, y, panelW-140, 28); y+=34;
    ctx.font='500 22px Inter'; ctx.fillStyle='rgba(210,180,140,0.75)';
    layoutText(ctx, renderPropIcons(card.props), panelX+70, y, panelW-140, 30); y+=40;
    ctx.font='400 19px Inter'; ctx.fillStyle='rgba(210,190,160,0.85)';
    y = layoutText(ctx, 'Clue: '+card.hiddenClueFormula, panelX+70, y, panelW-140, 28) + 16;
    ctx.fillStyle='rgba(235,210,170,0.95)'; ctx.font='600 24px Inter';
    ctx.fillText(`Bearing: ${card.bearingDeg}°    Cipher: ${card.cipherOutput}`, panelX+70, y); y+=54;
    ctx.fillStyle='rgba(190,170,140,0.85)'; ctx.font='italic 19px Inter';
    layoutText(ctx, '“'+card.riddle+'”', panelX+70, y, panelW-140, 28);
    ctx.restore();
    // Cipher glyph at bottom over background
    symbolicGlyph(ctx, W/2, H-300, 120, card.cipherIndex);
    ctx.textAlign='center'; ctx.font='500 22px Inter'; ctx.fillStyle='rgba(255,235,200,0.6)';
    ctx.fillText(`${card.id} • Phase: Pre-Mint • Chapter VI`, W/2, H-80);
  } else {
    drawParchment(ctx,W,H); drawEtchLines(ctx,W,H); drawFrame(ctx,W,H);
    ctx.fillStyle='#d9c7a0'; ctx.font='700 42px Cinzel'; ctx.textAlign='center';
    layoutText(ctx, card.title, W/2, 120, W-160, 48);
    ctx.strokeStyle='rgba(210,180,120,0.5)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(140,200); ctx.lineTo(W-140,200); ctx.stroke();
    ctx.textAlign='left'; ctx.font='400 20px Inter'; ctx.fillStyle='rgba(220,210,190,0.88)';
    let y = 240; y = layoutText(ctx, card.scene, 120, y, W-240, 30) + 20;
    ctx.font='600 20px Inter'; ctx.fillStyle='rgba(225,200,150,0.9)';
    layoutText(ctx, 'Props: '+Object.entries(card.props).map(([k,v])=>`${k}=${v}`).join(', '), 120, y, W-240, 30); y+=38;
    ctx.font='500 24px Inter'; ctx.fillStyle='rgba(210,180,140,0.75)';
    layoutText(ctx, renderPropIcons(card.props), 120, y, W-240, 34); y+=46;
    ctx.font='400 20px Inter'; ctx.fillStyle='rgba(210,190,160,0.85)';
    y = layoutText(ctx, 'Clue: '+card.hiddenClueFormula, 120, y, W-240, 30) + 20;
    ctx.fillStyle='rgba(235,210,170,0.95)'; ctx.font='600 26px Inter';
    ctx.fillText(`Bearing: ${card.bearingDeg}°    Cipher: ${card.cipherOutput}`, 120, y); y+=60;
    ctx.fillStyle='rgba(190,170,140,0.85)'; ctx.font='italic 20px Inter';
    layoutText(ctx, '“'+card.riddle+'”', 120, y, W-240, 30);
    symbolicGlyph(ctx, W/2, H-300, 120, card.cipherIndex);
    ctx.textAlign='center'; ctx.font='500 22px Inter'; ctx.fillStyle='rgba(255,235,200,0.6)';
    ctx.fillText(`${card.id}  •  Phase: Pre-Mint  •  Chapter VI`, W/2, H-80);
  }
  return canvas.toBuffer('image/png');
}

async function main(){
  await fs.ensureDir(OUT_DIR);
  const cards = await loadCards();
  const args = process.argv.slice(2);
  const countArg = args.find(a=>a.startsWith('--count='));
  const limit = countArg ? parseInt(countArg.split('=')[1],10) : cards.length;
  const withArt = args.includes('--with-art');
  for(let i=0;i<Math.min(limit,cards.length);i++){
    const card = cards[i];
    const png = renderCard(card, withArt);
    const imgName = `${card.id}.png`;
    const outPath = path.join(OUT_DIR,imgName);
    await fs.writeFile(outPath,png);
    // Metadata
    const meta = {
      name: card.title,
      description: card.scene,
      chapter: 6,
      chapterId: 'VI',
      cardId: card.id,
      bearingDeg: card.bearingDeg,
      cipherOutput: card.cipherOutput,
      cipherIndex: card.cipherIndex,
      hiddenClueFormula: card.hiddenClueFormula,
      riddle: card.riddle,
      collectionPhase: 'premint',
      attributes: [
        { trait_type: 'Chapter', value: 'VI' },
        { trait_type: 'Collection Phase', value: 'Pre-Mint' },
        { trait_type: 'Bearing', value: card.bearingDeg },
        { trait_type: 'Cipher Letter', value: card.cipherOutput }
      ].concat(Object.entries(card.props).map(([k,v])=>({ trait_type: k, value: v }))),
      image: `./${imgName}`
    };
    await fs.writeJson(outPath.replace(/\.png$/,'.json'), meta, { spaces: 2 });
    console.log('✓ Generated card', card.id);
  }
  console.log('Done.');
}

main().catch(e=>{ console.error(e); process.exit(1); });
