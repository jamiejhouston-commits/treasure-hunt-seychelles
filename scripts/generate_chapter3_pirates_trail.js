// Chapter III — The Pirate’s Trail Generator (NO MINT)
// Generates 20 unique 1024x1024 placeholder illustrated scenes with pirate engravings & tropical variation.
// Overwrites token IDs 121-140 images & metadata for review only.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'dist');
const IMG_DIR = path.join(OUTPUT_DIR, 'images');
const META_DIR = path.join(OUTPUT_DIR, 'metadata');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);
if (!fs.existsSync(META_DIR)) fs.mkdirSync(META_DIR);

// Core data from spec (condensed)
const cards = [
  { id:121, code:'S3-01', title:'Skull on the Shore', mood:'Bright', rarity:'Epic', anchor:'Anse Gaulette Sand', engraving:true, hook:'etched skull + rope coil', clue:'The skull faces first light; follow its gaze.' },
  { id:122, code:'S3-02', title:'Rune of the Boulder', mood:'Bright', rarity:'Rare', anchor:'Baie Lazare Granite', engraving:true, hook:'sunlit spiral rune', clue:'Count spiral turns to match reef steps.' },
  { id:123, code:'S3-03', title:'Parrot’s Palm Perch', mood:'Bright', rarity:'Rare', anchor:'Palm Cove', engraving:false, hook:'vivid parrot + shells', clue:'Invert feather hues to cancel a false climb.' },
  { id:124, code:'S3-04', title:'Waterfall Sigil', mood:'Bright', rarity:'Epic', anchor:'Sans Souci Fall', engraving:true, hook:'mist veil sigil', clue:'Torch reflection reveals the seventh shift.' },
  { id:125, code:'S3-05', title:'Driftwood Cipher', mood:'Bright', rarity:'Rare', anchor:'Shore Debris Line', engraving:true, hook:'tally runes driftwood', clue:'Tally marks confirm added bearing.' },
  { id:126, code:'S3-06', title:'Rock Pool Rings', mood:'Bright', rarity:'Epic', anchor:'Ros Sodyer Pool', engraving:true, hook:'numeric ring scratches', clue:'Three six nine—store for stretched time.' },
  { id:127, code:'S3-07', title:'Bone Arrow Cairn', mood:'Mystic', rarity:'Rare', anchor:'Forest Edge', engraving:true, hook:'bone arrow stack', clue:'Bone arrow rejects the ridge lure.' },
  { id:128, code:'S3-08', title:'Skull Cairn Ledger', mood:'Mystic', rarity:'Rare', anchor:'Coconut Grove', engraving:true, hook:'skull + notches', clue:'Pair the hollows; reserve their sum.' },
  { id:129, code:'S3-09', title:'Echo Gate', mood:'Mystic', rarity:'Epic', anchor:'Cascade Trail Cave', engraving:false, hook:'echo glow cave', clue:'Triad echoes divide saved minutes.' },
  { id:130, code:'S3-10', title:'Twilight Deviation', mood:'Mystic', rarity:'Epic', anchor:'Port Launay Bay', engraving:true, hook:'compass scratch dusk', clue:'Add four if dusk unopposed.' },
  { id:131, code:'S3-11', title:'False Ridge Marker', mood:'Mystic', rarity:'Rare', anchor:'Morne Blanc Rise', engraving:true, hook:'false carved arrow', clue:'Engraved ascent is a lie—ignore ten.' },
  { id:132, code:'S3-12', title:'Ambush Crossed Steel', mood:'Mystic', rarity:'Epic', anchor:'Coconut Grove Inner', engraving:true, hook:'crossed cutlass scorch', clue:'Crossed steel flips drift only if not annulled.' },
  { id:133, code:'S3-13', title:'Twin Torch Script', mood:'Mystic', rarity:'Epic', anchor:'Passage Alcove', engraving:true, hook:'alternating rune wall', clue:'Every second rune subtracts two.' },
  { id:134, code:'S3-14', title:'Divergent Bearing Stone', mood:'Mystic', rarity:'Rare', anchor:'Granite Overlook', engraving:true, hook:'dual bearing etch', clue:'Choose the cooler star path.' },
  { id:135, code:'S3-15', title:'Bearing Glyph Wall', mood:'Mystic', rarity:'Rare', anchor:'Script Wall', engraving:true, hook:'grid rune wall', clue:'Keep unlit runes to spell bearing.' },
  { id:136, code:'S3-16', title:'Fragment I Emergence', mood:'Mystic', rarity:'Legendary', anchor:'Dune Hollow', engraving:true, hook:'glowing fragment', clue:'Add three at lunar crown.' },
  { id:137, code:'S3-17', title:'Ghost Veil', mood:'Mystic', rarity:'Legendary', anchor:'Mist Channel', engraving:true, hook:'spectral sigil mist', clue:'Silence leaves one—subtract remainder.' },
  { id:138, code:'S3-18', title:'Fragment II Reversal', mood:'Mystic', rarity:'Epic', anchor:'Overlook Ledge', engraving:true, hook:'mirror fragment glow', clue:'Flip earliest gain; heading holds.' },
  { id:139, code:'S3-19', title:'Sea Cave Assembly', mood:'Mystic', rarity:'Legendary', anchor:'Hidden Sea Cave', engraving:true, hook:'aligned fragments', clue:'Present all, apply time & silence—speak east.' },
  { id:140, code:'S3-20', title:'Torn Contour Map', mood:'Bright', rarity:'Legendary', anchor:'Shore Firepit', engraving:true, hook:'ash-lit contour scrap', clue:'Contour aims beyond to next isle.' }
];

// Utility: pseudo-random but deterministic per id for variation
function seedRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

function drawCard(card) {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');
  const rand = seedRandom(card.id * 7 + 13);

  // Background gradient based on mood
  if (card.mood === 'Bright') {
    const g = ctx.createLinearGradient(0, 0, 0, 1024);
    g.addColorStop(0, '#ffeaa5');
    g.addColorStop(0.5, '#7ed8ff');
    g.addColorStop(1, '#0d7fa8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
  } else {
    const g = ctx.createRadialGradient(512, 512, 50, 512, 512, 700);
    g.addColorStop(0, '#142734');
    g.addColorStop(0.5, '#0c1a22');
    g.addColorStop(1, '#04090c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
    // Mist overlay
    for (let i=0;i<5;i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.04 + rand()*0.05})`;
      ctx.beginPath();
      ctx.ellipse(512 + (rand()-0.5)*400, 400 + (rand()-0.5)*300, 380, 140, rand()*Math.PI, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Horizon band / water
  ctx.fillStyle = card.mood === 'Bright' ? '#2fb4d8' : '#0d3c52';
  ctx.fillRect(0, 620, 1024, 160);

  // Sand / foreground base
  ctx.fillStyle = card.mood === 'Bright' ? '#f6e2b6' : '#3a3224';
  ctx.beginPath();
  ctx.moveTo(0, 780);
  for (let x=0; x<=1024; x+=64) {
    const y = 780 + Math.sin((x/1024)*Math.PI*2 + rand()*5)*20*rand();
    ctx.lineTo(x, y);
  }
  ctx.lineTo(1024, 1024);
  ctx.lineTo(0, 1024);
  ctx.closePath();
  ctx.fill();

  // Granite boulders (vary shape count per card)
  const boulderCount = 2 + Math.floor(rand()*4);
  for (let i=0;i<boulderCount;i++) {
    const bx = 150 + rand()*724;
    const by = 650 + rand()*140;
    const w = 120 + rand()*160;
    const h = 90 + rand()*130;
    const grad = ctx.createLinearGradient(bx-w/2, by-h/2, bx+w/2, by+h/2);
    const tone = card.mood === 'Bright' ? 180 : 90;
    grad.addColorStop(0, `rgb(${tone+30},${tone+20},${tone+10})`);
    grad.addColorStop(1, `rgb(${tone-20},${tone-30},${tone-25})`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(bx, by, w, h, rand()*Math.PI, 0, Math.PI*2);
    ctx.fill();
  }

  // Palm silhouettes (bright) or twisted roots (mystic)
  const floraCount = 3 + Math.floor(rand()*3);
  for (let i=0;i<floraCount;i++) {
    const fx = 80 + rand()*880;
    if (card.mood === 'Bright') {
      ctx.strokeStyle = '#136b33';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(fx, 780);
      ctx.lineTo(fx+rand()*10-5, 560+rand()*40);
      ctx.stroke();
      // fronds
      for (let f=0; f<5; f++) {
        ctx.beginPath();
        ctx.moveTo(fx, 580+rand()*30);
        ctx.lineTo(fx + (rand()>0.5?1:-1)*(120+rand()*40), 560 + f*14 + rand()*20);
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = '#27402c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(fx, 800);
      const midY = 700 + rand()*40;
      ctx.lineTo(fx + rand()*40-20, midY);
      ctx.lineTo(fx + rand()*60-30, midY-120-rand()*40);
      ctx.stroke();
    }
  }

  // Engravings / pirate markings
  if (card.engraving) {
    ctx.save();
    ctx.translate(512, 700);
    const markCount = 3 + Math.floor(rand()*4); // multiple strokes to imply complexity
    for (let m=0;m<markCount;m++) {
      ctx.strokeStyle = card.mood==='Bright' ? 'rgba(60,30,10,0.7)' : 'rgba(180,150,90,0.65)';
      ctx.lineWidth = 2 + rand()*2;
      ctx.beginPath();
      const rx = (rand()-0.5)*260;
      const ry = (rand()-0.5)*160;
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + (rand()-0.5)*120, ry + (rand()-0.5)*90);
      // small cross / rune nodes
      if (rand() > 0.5) {
        ctx.moveTo(rx+4, ry+4);
        ctx.lineTo(rx-4, ry-4);
        ctx.moveTo(rx-4, ry+4);
        ctx.lineTo(rx+4, ry-4);
      }
      ctx.stroke();
    }
    // Special motif: skull-ish or fragment
    ctx.fillStyle = card.mood==='Bright' ? 'rgba(40,20,10,0.55)' : 'rgba(210,190,150,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 46, 38, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillRect(-22, 6, 12, 14);
    ctx.fillRect(10, 6, 12, 14);
    ctx.restore();
  }

  // Hook symbolic element (simple icon line) for uniqueness layering
  ctx.save();
  ctx.translate(128 + rand()*768, 640 + rand()*120);
  ctx.strokeStyle = card.mood==='Bright' ? '#fff8d2' : '#9cc9d6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i=0;i<5;i++) {
    ctx.moveTo(0,0);
    ctx.lineTo((rand()-0.5)*140, (rand()-0.5)*140);
  }
  ctx.stroke();
  ctx.restore();

  // Title overlay bar
  ctx.fillStyle = card.mood==='Bright' ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.18)';
  ctx.fillRect(0,0,1024,72);
  ctx.fillStyle = card.mood==='Bright' ? '#ffeec9' : '#e0f4ff';
  ctx.font = '28px Sans';
  ctx.fillText(`${card.code} — ${card.title}`, 30, 46);

  return canvas.toBuffer('image/png');
}

function buildMetadata(card) {
  const name = `${card.code} — ${card.title}`; // S3-XX — Title
  const description = `${card.code} — ${card.title}. Chapter III — The Pirate’s Trail. Clue: ${card.clue}`;
  const attributes = [
    { trait_type: 'Chapter', value: 'Chapter III — The Pirate’s Trail' },
    { trait_type: 'TitleCode', value: card.code },
    { trait_type: 'Rarity', value: card.rarity },
    { trait_type: 'Mood', value: card.mood },
    { trait_type: 'LocationAnchor', value: card.anchor },
    { trait_type: 'Engraving', value: card.engraving ? 'Yes' : 'No' }
  ];
  return { name, description, image: `/real/images/${card.id}.png`, attributes };
}

function main() {
  console.log('Generating Pirate’s Trail Chapter 3 assets (NO MINT)...');
  cards.forEach(card => {
    const buf = drawCard(card);
    const imgPath = path.join(IMG_DIR, `${card.id}.png`);
    fs.writeFileSync(imgPath, buf);
    const meta = buildMetadata(card);
    const metaPath = path.join(META_DIR, `${card.id}.json`);
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    console.log(`Generated ${card.code} -> token ${card.id}`);
  });
  console.log('Done. Ready for DB sync (still NO MINT).');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { cards, drawCard, buildMetadata };
