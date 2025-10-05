// Advanced transformation of example art images into Chapter VI premint card PNGs.
// Upgrades over placeholder version:
//  - Style profile driven color grading (per-card saturation, brightness, warmth)
//  - Procedural parchment with multi-layer noise + subtle radial illumination
//  - Edge accent pass (Laplacian style) blended multiply for an etched look
//  - Film grain + adjustable vignette
//  - Gold frame with inner highlight
//  - Automatic cycling of limited example sources to fill 20 cards
//  - Deterministic per-card random seed for noise variety
//
// If you later swap in AI generations, you can still apply this finishing stack.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

const EXAMPLE_DIR = path.resolve(__dirname,'../example art');
const OUTPUT_DIR = path.resolve(__dirname,'../content/ch6/output');
const STYLE_PROFILES_PATH = path.resolve(__dirname,'./ch6_styles.json');
if(!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR,{recursive:true});

// Simple golden frame SVG
function frameSVG(w,h){
  return Buffer.from(`<?xml version='1.0'?>\n<svg width='${w}' height='${h}' xmlns='http://www.w3.org/2000/svg'>\n <defs>\n  <linearGradient id='edgeG' x1='0' x2='0' y1='0' y2='1'>\n    <stop offset='0%' stop-color='#f5d67a'/>\n    <stop offset='50%' stop-color='#c89b3c'/>\n    <stop offset='100%' stop-color='#8a6120'/>\n  </linearGradient>\n  <radialGradient id='innerGlow' cx='50%' cy='50%' r='70%'>\n    <stop offset='0%' stop-color='rgba(255,240,210,0.55)'/>\n    <stop offset='60%' stop-color='rgba(255,235,200,0.15)'/>\n    <stop offset='100%' stop-color='rgba(255,230,190,0)'/>\n  </radialGradient>\n </defs>\n <rect x='4' y='4' width='${w-8}' height='${h-8}' rx='28' ry='28' fill='url(#innerGlow)' stroke='url(#edgeG)' stroke-width='10'/>\n <rect x='18' y='18' width='${w-36}' height='${h-36}' rx='18' ry='18' fill='none' stroke='rgba(255,240,210,0.45)' stroke-width='3' stroke-dasharray='4 6'/>\n</svg>`);
}

function seededRng(seed){
  let h = crypto.createHash('sha256').update(String(seed)).digest();
  let idx = 0;
  return ()=>{
    if(idx >= h.length){
      h = crypto.createHash('sha256').update(h).digest();
      idx = 0;
    }
    return h[idx++] / 255;
  };
}

function makeNoise(width,height,seed,alpha=0.25){
  const rand = seededRng(seed);
  const size = width*height*4;
  const buf = Buffer.alloc(size);
  for(let i=0;i<size;i+=4){
    const v = Math.floor(rand()*255);
    buf[i]=buf[i+1]=buf[i+2]=v; // grayscale
    buf[i+3]=Math.floor(alpha*255);
  }
  return sharp(buf,{raw:{width,height,channels:4}}).blur(0.3).png().toBuffer();
}

function radialMask(width,height,strength=0.85){
  // Create radial falloff alpha (center bright, edges darker)
  const buf = Buffer.alloc(width*height*4);
  const cx=width/2, cy=height/2; const maxD = Math.sqrt(cx*cx + cy*cy);
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const dx=x-cx, dy=y-cy; const d=Math.sqrt(dx*dx+dy*dy)/maxD;
      const v = Math.pow(1-Math.min(1,d),2);
      const i=(y*width+x)*4;
      const shade = Math.floor(255*v*strength);
      buf[i]=buf[i+1]=buf[i+2]=shade; buf[i+3]=255;
    }
  }
  return sharp(buf,{raw:{width,height,channels:4}}).blur(150).png().toBuffer();
}

async function buildParchment(width,height,seed){
  const baseColor = '#dccfb8';
  const base = await sharp({create:{width,height,channels:3,background:baseColor}}).png().toBuffer();
  const n1 = await makeNoise(width,height,seed+':n1',0.18);
  const n2 = await makeNoise(width,height,seed+':n2',0.10);
  const vignetteRaw = await radialMask(width,height,0.95); // raw buffer -> convert
  const vignette = await sharp(vignetteRaw).png().toBuffer();
  const n1png = await sharp(n1).png().toBuffer();
  const n2png = await sharp(n2).png().toBuffer();
  return sharp(base)
    .composite([
      {input:n1png,blend:'overlay'},
      {input:n2png,blend:'multiply'},
      {input:vignette,blend:'multiply',opacity:0.55}
    ])
    .modulate({saturation:0.92,brightness:1.02})
    .blur(0.3)
    .png()
    .toBuffer();
}

async function edgeAccent(buffer,width,height){
  // Cheap Laplacian-like edge accent by using sharp pipeline differences
  const gray = await sharp(buffer).grayscale().toBuffer();
  const blurred = await sharp(gray).blur(3).toBuffer();
  const diff = await sharp(gray).composite([{input:blurred,blend:'difference'}]).toBuffer();
  // Increase contrast
  return sharp(diff).linear(3,-128).modulate({brightness:1.1}).png().toBuffer();
}

function applyWarmth({r,g,b},warmth){
  // warmth >0 pushes red/yellow, <0 pushes blue/cool
  if(warmth===0) return {r,g,b};
  return {r:Math.min(255,r*(1+warmth*0.9)), g:Math.min(255,g*(1+warmth*0.3)), b:Math.min(255,b*(1-warmth))};
}

async function temperatureTint(width,height,warmth){
  const buf = Buffer.alloc(width*height*4);
  const baseColor = {r:255,g:244,b:230};
  const tint = applyWarmth(baseColor,warmth);
  for(let i=0;i<width*height;i++){
    const o=i*4; buf[o]=tint.r; buf[o+1]=tint.g; buf[o+2]=tint.b; buf[o+3]=Math.floor(Math.min(255,Math.abs(warmth)*180));
  }
  return sharp(buf,{raw:{width,height,channels:4}}).blur(60).png().toBuffer();
}

async function vignetteLayer(width,height,strength){
  const mask = await radialMask(width,height,1);
  return sharp(mask).negate().modulate({brightness:strength}).blur(80).png().toBuffer();
}

async function generateCards(){
  const width=1024, height=1536;
  const files = fs.readdirSync(EXAMPLE_DIR).filter(f=>/\.(jpe?g|png)$/i.test(f));
  if(files.length===0){
    console.error('No example images found. Aborting.');
    process.exit(1);
  }
  let styles=[];
  try{styles = JSON.parse(fs.readFileSync(STYLE_PROFILES_PATH,'utf-8'));}catch(e){
    console.warn('Could not load style profiles, using fallback.');
    styles = Array.from({length:20},(_,i)=>({id:i+1,saturation:0.55,brightness:0.97,warmth:0,grain:0.4,vignette:0.3,label:'default'}));
  }
  console.log(`Using ${styles.length} style profiles.`);
  for(let card=1; card<=20; card++){
    const style = styles[(card-1)%styles.length];
    const srcFile = files[(card-1)%files.length];
    const padded = String(card).padStart(3,'0');
    const outName = `ch6_${padded}.png`;
    const inputPath = path.join(EXAMPLE_DIR,srcFile);
    const outPath = path.join(OUTPUT_DIR,outName);
    const seed = `card-${card}-${style.label}`;

    const baseBuffer = await sharp(inputPath).resize(width,height,{fit:'cover'}).toBuffer();
  const parchment = await buildParchment(width,height,seed);
  const edgeBuf = await edgeAccent(baseBuffer,width,height);
  const tempTint = await temperatureTint(width,height,style.warmth||0);
  const vignette = await vignetteLayer(width,height,1.05 + (style.vignette||0)*0.4);
  const grain = await makeNoise(width,height,seed+':grain',Math.max(0.2,(style.grain||0.3)));

    // Base graded image
    let graded = await sharp(baseBuffer)
      .modulate({
        saturation: style.saturation || 0.9,
        brightness: style.brightness || 1.12
      })
      .toBuffer();

    // Composite stack (ordering matters)
    const composed = await sharp(graded)
      .composite([
        {input: parchment, blend:'overlay', opacity:0.32 + (style.parchmentStrength || 0)},
        {input: tempTint, blend:'soft-light', opacity:0.42},
        {input: grain, blend:'overlay', opacity:0.25 + (style.grainBoost || 0)},
        {input: edgeBuf, blend:'screen', opacity:0.28 + (style.edgeBoost || 0)},
        {input: vignette, blend:'multiply', opacity:0.28 + (style.vignette || 0)*0.35},
        {input: frameSVG(width,height), blend:'over'}
      ])
      .modulate({brightness:1.05,saturation:1.04})
      .sharpen({sigma:0.9})
      .png({quality:92})
      .toBuffer();

    fs.writeFileSync(outPath, composed);
    console.log(`✓ Card ${card.toString().padStart(2,'0')} -> ${outName} | src=${srcFile} | style=${style.label}`);
  }
  console.log(`✅ Advanced card image build complete. Next:\n  node scripts/validate_ch6_premint_assets.cjs\n  node scripts/ingest_ch6_premint.js`);
}

generateCards().catch(e=>{console.error('Build failed',e); process.exit(1);});
