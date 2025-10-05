import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import { createCanvas } from '@napi-rs/canvas';
import seedrandom from 'seedrandom';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .option('supply', { type: 'number', default: parseInt(process.env.SUPPLY || '100', 10) })
  .option('imagesDir', { type: 'string', default: process.env.IMAGES_DIR || './dist/images' })
  .option('outDir', { type: 'string', default: process.env.OUTPUT_DIR || './dist' })
  .option('seed', { type: 'string', default: 'seychelles-levasseur' })
  .help().argv;

const WIDTH = 1024;
const HEIGHT = 1024;

// Procedural generator (no external assets required)
// Produces parchment-style maps with Seychelles identity: parchment, islands, compass,
// stars, glyphs, overlays. Legendary adds gold foil accents.

function pickWeighted(rng, items) {
  const total = items.reduce((s, i) => s + i.w, 0);
  let r = rng() * total;
  for (const it of items) {
    if ((r -= it.w) <= 0) return it.v;
  }
  return items[items.length - 1].v;
}

function drawParchment(ctx, rng) {
  const baseHue = Math.floor(35 + rng() * 10);
  ctx.fillStyle = `hsl(${baseHue}, 40%, 82%)`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = `hsla(${baseHue + (rng() * 8 - 4)}, 35%, ${70 + rng() * 20}%, ${rng() * 0.06})`;
    const x = rng() * WIDTH;
    const y = rng() * HEIGHT;
    const r = rng() * 3 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // torn edges vignette
  const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  grad.addColorStop(0, 'rgba(0,0,0,0.08)');
  grad.addColorStop(0.05, 'rgba(0,0,0,0)');
  grad.addColorStop(0.95, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawCompass(ctx, rng) {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  ctx.strokeStyle = 'rgba(60,40,20,0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 280, 0, Math.PI * 2);
  ctx.stroke();
  const headings = ['N','E','S','W'];
  ctx.font = '48px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#3b2b1b';
  ctx.fillText('N', cx, cy - 320);
  ctx.fillText('S', cx, cy + 320);
  ctx.fillText('W', cx - 320, cy);
  ctx.fillText('E', cx + 320, cy);
  // random bearing
  const angle = rng() * Math.PI * 2;
  ctx.strokeStyle = '#8b0000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * 280, cy + Math.sin(angle) * 280);
  ctx.stroke();
  return Math.round((angle * 180) / Math.PI);
}

function drawStars(ctx, rng, intensity) {
  const count = Math.floor(intensity * 200);
  ctx.fillStyle = 'rgba(255,255,240,0.8)';
  for (let i = 0; i < count; i++) {
    const x = rng() * WIDTH;
    const y = rng() * HEIGHT;
    const r = rng() * 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSigil(ctx, rng) {
  const x = 150 + rng() * (WIDTH - 300);
  const y = 150 + rng() * (HEIGHT - 300);
  ctx.strokeStyle = 'rgba(20,20,20,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 40, y);
  ctx.lineTo(x, y - 40);
  ctx.lineTo(x + 40, y);
  ctx.lineTo(x, y + 40);
  ctx.closePath();
  ctx.stroke();
}

function drawIslandSilhouette(ctx, rng, island) {
  // Approximate island silhouettes with bezier blobs; differ per island
  const cx = WIDTH * (0.5 + (rng() - 0.5) * 0.2);
  const cy = HEIGHT * (0.52 + (rng() - 0.5) * 0.2);
  const scale = 0.9 + rng() * 0.15;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.rotate((rng() - 0.5) * 0.6);
  ctx.beginPath();
  ctx.moveTo(-220, 0);
  const wob = island === 'Mahé' ? 0.7 : island === 'La Digue' ? 0.5 : island === 'Praslin' ? 0.6 : 0.4;
  for (let i = 0; i < 6; i++) {
    const a1 = (i / 6) * Math.PI * 2;
    const a2 = ((i + 1) / 6) * Math.PI * 2;
    const r1 = 220 * (1 + (rng() - 0.5) * wob);
    const r2 = 220 * (1 + (rng() - 0.5) * wob);
    ctx.bezierCurveTo(
      Math.cos(a1) * r1, Math.sin(a1) * r1,
      Math.cos((a1 + a2) / 2) * (r1 + r2) / 2, Math.sin((a1 + a2) / 2) * (r1 + r2) / 2,
      Math.cos(a2) * r2, Math.sin(a2) * r2
    );
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(80,60,40,0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(80,60,40,0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawCoral(ctx, rng) {
  ctx.save();
  ctx.strokeStyle = 'rgba(20,100,100,0.25)';
  ctx.lineWidth = 1.5;
  for (let b = 0; b < 3 + Math.floor(rng() * 3); b++) {
    let x = 120 + rng() * (WIDTH - 240);
    let y = 120 + rng() * (HEIGHT - 240);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < 30; i++) {
      x += (rng() - 0.5) * 20;
      y += (rng() - 0.5) * 20;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawCocoDeMer(ctx, rng) {
  const x = WIDTH * (0.25 + rng() * 0.5);
  const y = HEIGHT * (0.25 + rng() * 0.5);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rng() - 0.5) * 0.8);
  ctx.scale(1 + rng() * 0.4, 1 + rng() * 0.4);
  ctx.strokeStyle = 'rgba(40,30,20,0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.bezierCurveTo(-30, -40, 30, -40, 30, 0);
  ctx.bezierCurveTo(30, 40, -30, 40, -30, 0);
  ctx.stroke();
  ctx.restore();
}

function drawGoldFoil(ctx, rng) {
  const grad = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 100, WIDTH/2, HEIGHT/2, 500);
  grad.addColorStop(0, 'rgba(212,175,55,0.18)');
  grad.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  // subtle diagonal streaks
  ctx.strokeStyle = 'rgba(255,230,120,0.18)';
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    const y = rng() * HEIGHT;
    ctx.moveTo(-50, y);
    ctx.lineTo(WIDTH + 50, y - 200);
    ctx.stroke();
  }
}

function drawClueText(ctx, text) {
  ctx.fillStyle = 'rgba(30,20,10,0.85)';
  ctx.font = '32px "Times New Roman"';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const lines = [text.slice(0, 28), text.slice(28, 56), text.slice(56, 84)].filter(Boolean);
  let y = HEIGHT - 160;
  for (const line of lines) {
    ctx.fillText(line, 60, y);
    y += 38;
  }
}

function pickIsland(rng) {
  const roll = rng();
  if (roll < 0.35) return 'Mahé';
  if (roll < 0.6) return 'La Digue';
  if (roll < 0.85) return 'Praslin';
  return 'Aldabra';
}

function chapterForIsland(island) {
  return island === 'Mahé' ? 'Mahé Manuscripts'
    : island === 'La Digue' ? "La Digue's Secrets"
    : island === 'Praslin' ? "Praslin's Prophecy"
    : 'Outer Islands Revelation';
}

function pickRarity(rng) {
  const roll = rng() * 100;
  if (roll < 70) return 'Common';
  if (roll < 90) return 'Rare';
  if (roll < 98) return 'Epic';
  return 'Legendary';
}

function pickOverlaySet(rng, rarity) {
  const base = [];
  if (rarity !== 'Common') base.push('Astronomy');
  if (rarity !== 'Common' && rng() < 0.7) base.push('Coral Tracing');
  if (rng() < 0.5) base.push('Coco de Mer Sigil');
  return Array.from(new Set(base));
}

async function generateOne(index, rng, outDir, imagesDir) {
  await fs.ensureDir(imagesDir);
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  drawParchment(ctx, rng);
  const rarity = pickRarity(rng);
  const island = pickIsland(rng);
  const chapter = chapterForIsland(island);
  const overlays = pickOverlaySet(rng, rarity);

  drawIslandSilhouette(ctx, rng, island);
  const bearing = drawCompass(ctx, rng);
  if (overlays.includes('Astronomy')) drawStars(ctx, rng, rarity === 'Rare' ? 0.5 : rarity === 'Epic' ? 0.8 : 1.0);
  if (overlays.includes('Coral Tracing')) drawCoral(ctx, rng);
  if (overlays.includes('Coco de Mer Sigil')) drawCocoDeMer(ctx, rng);
  if (rarity === 'Legendary') drawGoldFoil(ctx, rng);

  const coordLat = (-4.0 - rng() * 6).toFixed(4);
  const coordLon = (46 + rng() * 10).toFixed(4);
  const clueType = rng() < 0.5 ? 'coord' : (rng() < 0.8 ? 'glyph' : 'cipher');
  const clueVal = clueType === 'coord' ? `${coordLat}, ${coordLon}` : clueType === 'glyph' ? 'ᚠᚢᚦᚨ' : `Rotate ${bearing}°, sum primes`;
  const clueText = `Bearing ${bearing}°. Coords ${coordLat}, ${coordLon}.`;
  drawClueText(ctx, clueText);

  const filename = `${index}.png`;
  const filepath = path.resolve(imagesDir, filename);
  const buf = await canvas.encode('png');
  await fs.writeFile(filepath, buf);

  return {
    tokenId: index,
    rarity,
    island,
    chapter,
    overlays,
    layers: {
      parchment: true,
      island: true,
      compass: true,
      stars: overlays.includes('Astronomy'),
      coral: overlays.includes('Coral Tracing'),
      coco_de_mer: overlays.includes('Coco de Mer Sigil'),
      gold_foil: rarity === 'Legendary'
    },
    bearing,
    coordinates: `${coordLat}, ${coordLon}`,
    clue: { type: clueType, value: clueVal, hint: clueText }
  };
}

(async () => {
  const rng = seedrandom(argv.seed);
  const outDir = path.resolve(argv.outDir);
  const imagesDir = path.resolve(argv.imagesDir);
  await fs.ensureDir(outDir);
  await fs.ensureDir(imagesDir);

  const supply = argv.supply;
  const manifest = [];
  for (let i = 1; i <= supply; i++) {
    const localRng = seedrandom(argv.seed + '-' + i);
    const meta = await generateOne(i, localRng, outDir, imagesDir);
    manifest.push(meta);
    if (i % 10 === 0) console.log(`Generated ${i}/${supply}`);
  }
  await fs.writeJson(path.join(outDir, 'art-manifest.json'), manifest, { spaces: 2 });
  console.log(`✅ Generated ${supply} images to ${imagesDir}`);
})();
