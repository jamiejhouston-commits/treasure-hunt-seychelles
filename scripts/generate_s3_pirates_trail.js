// Chapter III — The Pirate’s Trail (S3) Generator
// Generates 20 cinematic 2048x2048 preview illustrations, metadata, and a contact sheet for review (NO MINTING).
// Outputs:
//   • images  -> /scripts/dist/images/s3/S3-XX.png
//   • metadata -> /scripts/dist/metadata/s3/S3-XX.json
//   • contact  -> /scripts/dist/previews/s3_contact.png (5 × 4 grid)
// Also mirrors numeric copies for app preview via apply_s3_to_tokens.js.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_ROOT = path.join(__dirname, 'dist');
const IMAGE_DIR = path.join(OUTPUT_ROOT, 'images', 's3');
const META_DIR = path.join(OUTPUT_ROOT, 'metadata', 's3');
const PREVIEW_DIR = path.join(OUTPUT_ROOT, 'previews');
const CHAPTER3_PREVIEW_DIR = path.join(OUTPUT_ROOT, 'chapter3');
const CONTACT_SHEET_PATH = path.join(PREVIEW_DIR, 's3_contact.png');

[IMAGE_DIR, META_DIR, PREVIEW_DIR, CHAPTER3_PREVIEW_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const CARD_WIDTH = 2048;
const CARD_HEIGHT = 2048;
const CONTACT_COLS = 5;
const CONTACT_ROWS = 4;
const CONTACT_CELL = 512;
const CONTACT_MARGIN = 32;

const cards = [
  {
    index: 1,
    code: 'S3-01',
    title: 'Landing at Anse Gaulette',
    place: 'Anse Gaulette (Baie Lazare)',
    timeOfDay: 'Morning Sun',
    sceneType: 'Beach',
    symbol: 'Anchor',
    rarity: 'Legendary',
    clue: 'Where Picault kissed the shore, the rope points past the teeth of granite.',
    lighting: 'morning',
    base: 'beach'
  },
  {
    index: 2,
    code: 'S3-02',
    title: 'Skull in the Sand',
    place: 'Beau Vallon, Mahé',
    timeOfDay: 'High Noon',
    sceneType: 'Beach',
    symbol: 'Skull',
    rarity: 'Rare',
    clue: 'Count the coins to the water’s edge; the odd piece marks your bearing.',
    lighting: 'midday',
    base: 'beach'
  },
  {
    index: 3,
    code: 'S3-03',
    title: 'Rune of Ros Sodyer',
    place: 'Ros Sodyer Rock Pool (Anse Takamaka)',
    timeOfDay: 'Low Tide',
    sceneType: 'Pool',
    symbol: 'Dagger',
    rarity: 'Epic',
    clue: 'When the ocean exhales, three lights remain—read them in the pool’s quiet eye.',
    lighting: 'lagoonMist',
    base: 'pool'
  },
  {
    index: 4,
    code: 'S3-04',
    title: 'Torch Wall at Cascade',
    place: 'Cascade Waterfall, Mahé',
    timeOfDay: 'Late Afternoon',
    sceneType: 'Waterfall',
    symbol: 'Torch',
    rarity: 'Epic',
    clue: 'Step through the veil—fire reveals the mark the rain conceals.',
    lighting: 'lateAfternoon',
    base: 'waterfall'
  },
  {
    index: 5,
    code: 'S3-05',
    title: 'Parrot of Mission Lodge',
    place: 'Mission Lodge (Sans Souci)',
    timeOfDay: 'Sunset',
    sceneType: 'Ruins',
    symbol: 'Parrot',
    rarity: 'Rare',
    clue: 'The arch’s shadow names the hour; the feather points your climb.',
    lighting: 'sunset',
    base: 'ruin'
  },
  {
    index: 6,
    code: 'S3-06',
    title: 'Granite Teeth of Georgette',
    place: 'Anse Georgette, Praslin',
    timeOfDay: 'Midday',
    sceneType: 'Cliff',
    symbol: 'Compass',
    rarity: 'Epic',
    clue: 'Between the teeth, a corner of night; measure the gaps to find the shoal.',
    lighting: 'middayBright',
    base: 'cliff'
  },
  {
    index: 7,
    code: 'S3-07',
    title: 'Vache Sentinel',
    place: 'Île aux Vaches Marines',
    timeOfDay: 'Dusk',
    sceneType: 'Islet',
    symbol: 'Cutlass',
    rarity: 'Legendary',
    clue: 'A cow by name, a watch by duty—seven lights refuse to drink.',
    lighting: 'dusk',
    base: 'islet'
  },
  {
    index: 8,
    code: 'S3-08',
    title: 'Intendance Thunder',
    place: 'Anse Intendance, Mahé',
    timeOfDay: 'Pre-Storm',
    sceneType: 'Beach',
    symbol: 'Coin',
    rarity: 'Rare',
    clue: 'Turn the scar on the coin toward calm; the shoreline will forgive.',
    lighting: 'storm',
    base: 'stormBeach'
  },
  {
    index: 9,
    code: 'S3-09',
    title: 'Royale Lantern',
    place: 'Anse Royale, Mahé',
    timeOfDay: 'Evening',
    sceneType: 'Beach',
    symbol: 'Lantern',
    rarity: 'Rare',
    clue: 'Royale rests with two small lights—loop the rope and climb to counsel.',
    lighting: 'evening',
    base: 'doorway'
  },
  {
    index: 10,
    code: 'S3-10',
    title: 'La Misère Lookout',
    place: 'La Misère Viewpoint',
    timeOfDay: 'Blue Hour',
    sceneType: 'Viewpoint',
    symbol: 'Rope',
    rarity: 'Epic',
    clue: 'Count two knots of wind and drop to the quiet bay.',
    lighting: 'blueHour',
    base: 'cliffTop'
  },
  {
    index: 11,
    code: 'S3-11',
    title: 'Baie Ternay Mirror',
    place: 'Baie Ternay / Port Launay',
    timeOfDay: 'Moonlight',
    sceneType: 'Reef',
    symbol: 'Chest',
    rarity: 'Rare',
    clue: 'In a bay that refuses storm, the coral fingers name your number.',
    lighting: 'moonlit',
    base: 'moonBay'
  },
  {
    index: 12,
    code: 'S3-12',
    title: 'Anse Major Edge',
    place: 'Anse Major Trail',
    timeOfDay: 'Midday',
    sceneType: 'Trail',
    symbol: 'Dagger',
    rarity: 'Epic',
    clue: 'Count the cuts along the hilt—the path bites east.',
    lighting: 'harshSun',
    base: 'trail'
  },
  {
    index: 13,
    code: 'S3-13',
    title: 'Morne Blanc Mist',
    place: 'Morne Blanc',
    timeOfDay: 'Dawn',
    sceneType: 'Trail',
    symbol: 'Lantern',
    rarity: 'Legendary',
    clue: 'Five lights survive the cloud; lay your arc where the ridge breathes.',
    lighting: 'dawn',
    base: 'mistRidge'
  },
  {
    index: 14,
    code: 'S3-14',
    title: 'Copolia Dome',
    place: 'Copolia Granite Dome',
    timeOfDay: 'Zenith',
    sceneType: 'Viewpoint',
    symbol: 'Cutlass',
    rarity: 'Rare',
    clue: 'On the stone, light bends the reef—arc the rope where shoreline turns.',
    lighting: 'zenith',
    base: 'graniteDome'
  },
  {
    index: 15,
    code: 'S3-15',
    title: 'Sauzier’s Echo',
    place: 'Sauzier Waterfall, Port Glaud',
    timeOfDay: 'Afternoon',
    sceneType: 'Waterfall',
    symbol: 'Parrot',
    rarity: 'Epic',
    clue: 'Follow the echo’s measure; its bars climb the coast.',
    lighting: 'ripple',
    base: 'waterfall'
  },
  {
    index: 16,
    code: 'S3-16',
    title: 'Skull Mark at Gaulettes',
    place: 'Anse Gaulettes Marker Stone',
    timeOfDay: 'Bright Sun',
    sceneType: 'Trail',
    symbol: 'Skull',
    rarity: 'Rare',
    clue: 'Scratch the sign and follow the feather—the coin’s notch faces home.',
    lighting: 'midday',
    base: 'trail'
  },
  {
    index: 17,
    code: 'S3-17',
    title: 'Denison Reef Gate',
    place: 'Lady Denison-Pender Shoal',
    timeOfDay: 'High Sun',
    sceneType: 'Reef',
    symbol: 'Compass',
    rarity: 'Legendary',
    clue: 'Six lights pretend to open—turn your bow; home holds the lock.',
    lighting: 'middaySea',
    base: 'reefGate'
  },
  {
    index: 18,
    code: 'S3-18',
    title: 'Curieuse Mangrove Secret',
    place: 'Curieuse Island Mangroves',
    timeOfDay: 'Noon',
    sceneType: 'Mangrove',
    symbol: 'Chest',
    rarity: 'Epic',
    clue: 'Where roots breathe air, a small chest lies listening.',
    lighting: 'canopy',
    base: 'mangrove'
  },
  {
    index: 19,
    code: 'S3-19',
    title: 'Anse Source d’Argent Veil',
    place: 'Anse Source d’Argent, La Digue',
    timeOfDay: 'Late Afternoon',
    sceneType: 'Beach',
    symbol: 'Compass',
    rarity: 'Epic',
    clue: 'The rose chalked on stone turns with the sun—trace its shadow to the gap.',
    lighting: 'afternoonSoft',
    base: 'graniteVeil'
  },
  {
    index: 20,
    code: 'S3-20',
    title: 'Door Below Morne Seychellois',
    place: 'Morne Seychellois Foothill Cave',
    timeOfDay: 'Night',
    sceneType: 'Cave',
    symbol: 'Lantern',
    rarity: 'Legendary',
    clue: 'All roads return to the first shore; the door hears only the right order.',
    lighting: 'night',
    base: 'cave'
  }
];

const paletteMap = {
  morning: { sky: ['#56c4ff', '#d3f1ff'], water: ['#4bd2ff', '#0e76a5'], sand: '#f5d9b2', foliage: '#2f9361', shadow: 'rgba(0,0,0,0.18)' },
  midday: { sky: ['#7fdcff', '#e2f8ff'], water: ['#3fc8f0', '#0f6f96'], sand: '#f6dfb7', foliage: '#2d8b58', shadow: 'rgba(0,0,0,0.16)' },
  lagoonMist: { sky: ['#8fd8ff', '#e4fbff'], water: ['#5ed1d8', '#1c7d82'], sand: '#f2d4ac', foliage: '#3a9b70', shadow: 'rgba(0,30,50,0.22)' },
  lateAfternoon: { sky: ['#ffbd83', '#fef3da'], water: ['#5cbad6', '#1d719b'], sand: '#f2c89c', foliage: '#356a4d', shadow: 'rgba(50,30,10,0.2)' },
  sunset: { sky: ['#ff9860', '#694a86'], water: ['#4d80b7', '#143252'], sand: '#f1c7a2', foliage: '#3a7050', shadow: 'rgba(30,12,4,0.25)' },
  middayBright: { sky: ['#7fe4ff', '#c9f7ff'], water: ['#44c8e6', '#1481a1'], sand: '#f8e2bb', foliage: '#2a8352', shadow: 'rgba(0,0,0,0.15)' },
  dusk: { sky: ['#475c87', '#1c2438'], water: ['#2d5178', '#0a1625'], sand: '#2b3546', foliage: '#274445', shadow: 'rgba(0,0,0,0.28)' },
  storm: { sky: ['#8895a9', '#43536a'], water: ['#325876', '#0c2537'], sand: '#c5b59b', foliage: '#2a4b3f', shadow: 'rgba(10,10,20,0.35)' },
  evening: { sky: ['#7e96c3', '#2c3f63'], water: ['#345a82', '#0d2138'], sand: '#2b3a4a', foliage: '#24384a', shadow: 'rgba(10,10,30,0.3)' },
  blueHour: { sky: ['#456aa2', '#101f33'], water: ['#2a4e7b', '#091728'], sand: '#2a3549', foliage: '#1f3742', shadow: 'rgba(0,0,0,0.32)' },
  moonlit: { sky: ['#102035', '#03070c'], water: ['#0f2336', '#020509'], sand: '#1c242e', foliage: '#1a3843', shadow: 'rgba(0,0,0,0.4)' },
  harshSun: { sky: ['#8ce6ff', '#dcfaff'], water: ['#4ecae0', '#1a7d96'], sand: '#f7dfb4', foliage: '#2b844c', shadow: 'rgba(0,0,0,0.14)' },
  dawn: { sky: ['#f6c28c', '#c7d9e8'], water: ['#5fb7d4', '#1b607c'], sand: '#ddc5a1', foliage: '#4b6f53', shadow: 'rgba(15,25,30,0.28)' },
  zenith: { sky: ['#6ecbff', '#c0edff'], water: ['#3ec0d6', '#146f90'], sand: '#f5d9a9', foliage: '#2a7c4a', shadow: 'rgba(0,0,0,0.18)' },
  ripple: { sky: ['#b0e7ff', '#e9fbff'], water: ['#63cbe0', '#1f7d93'], sand: '#eacfae', foliage: '#31704a', shadow: 'rgba(20,40,45,0.24)' },
  canopy: { sky: ['#9ff0d0', '#e7ffed'], water: ['#41c79a', '#0f6c4e'], sand: '#d6c29a', foliage: '#1c6d4a', shadow: 'rgba(10,50,40,0.26)' },
  middaySea: { sky: ['#73deff', '#d4f8ff'], water: ['#36b6d9', '#0d5f82'], sand: '#e3caa5', foliage: '#2a7a4d', shadow: 'rgba(0,40,50,0.2)' },
  afternoonSoft: { sky: ['#ffc6a0', '#f5e7d6'], water: ['#5db6d3', '#1e6f8d'], sand: '#f4d5b0', foliage: '#3b7a54', shadow: 'rgba(30,30,40,0.22)' },
  night: { sky: ['#060b13', '#010204'], water: ['#0a1a2b', '#020506'], sand: '#1b1f27', foliage: '#192a2d', shadow: 'rgba(0,0,0,0.45)' }
};

function paintBase(ctx, card) {
  const palette = paletteMap[card.lighting] || paletteMap.midday;

  const skyGrad = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT * 0.65);
  skyGrad.addColorStop(0, palette.sky[0]);
  skyGrad.addColorStop(1, palette.sky[1]);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  switch (card.base) {
    case 'beach':
    case 'stormBeach':
      drawWaterBand(ctx, palette);
      drawSandSweep(ctx, palette, card.base === 'stormBeach' ? 0.72 : 0.68);
      break;
    case 'pool':
      drawWaterBand(ctx, palette, { top: 0.42, height: 0.35, softness: 0.08 });
      drawStoneShelf(ctx, palette);
      break;
    case 'waterfall':
      drawStoneWall(ctx, palette);
      drawWaterColumn(ctx, palette);
      break;
    case 'ruin':
      drawValleyBackdrop(ctx, palette);
      drawSandSweep(ctx, palette, 0.7, 0.08);
      break;
    case 'cliff':
      drawWaterBand(ctx, palette, { top: 0.55, height: 0.25 });
      drawCliffEdge(ctx, palette);
      break;
    case 'islet':
      drawWaterBand(ctx, palette, { top: 0.45, height: 0.4 });
      break;
    case 'doorway':
      drawWaterBand(ctx, palette, { top: 0.5, height: 0.28 });
      drawSandSweep(ctx, palette, 0.7, 0.04);
      break;
    case 'cliffTop':
      drawWaterBand(ctx, palette, { top: 0.6, height: 0.22 });
      drawCliffTop(ctx, palette);
      break;
    case 'moonBay':
      drawMoonlitBay(ctx, palette);
      break;
    case 'trail':
      drawCoastalSlope(ctx, palette);
      break;
    case 'mistRidge':
      drawLayeredRidge(ctx, palette);
      break;
    case 'graniteDome':
      drawGraniteBase(ctx, palette);
      break;
    case 'reefGate':
      drawUnderwaterPlane(ctx, palette);
      break;
    case 'mangrove':
      drawMangroveBase(ctx, palette);
      break;
    case 'graniteVeil':
      drawGraniteStacksBase(ctx, palette);
      break;
    case 'cave':
      drawCaveBase(ctx, palette);
      break;
    default:
      drawWaterBand(ctx, palette);
      drawSandSweep(ctx, palette);
      break;
  }

  return palette;
}

function drawWaterBand(ctx, palette, opts = {}) {
  const { top = 0.38, height = 0.32, softness = 0.12 } = opts;
  const yTop = CARD_HEIGHT * top;
  const yBottom = CARD_HEIGHT * (top + height);
  const waterGrad = ctx.createLinearGradient(0, yTop, 0, yBottom);
  waterGrad.addColorStop(0, palette.water[0]);
  waterGrad.addColorStop(1, palette.water[1]);
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.moveTo(0, yTop);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.3, yTop + CARD_HEIGHT * softness, CARD_WIDTH * 0.6, yTop + CARD_HEIGHT * (softness / 2));
  ctx.quadraticCurveTo(CARD_WIDTH * 0.85, yTop, CARD_WIDTH, yTop + CARD_HEIGHT * (softness / 3));
  ctx.lineTo(CARD_WIDTH, yBottom);
  ctx.lineTo(0, yBottom);
  ctx.closePath();
  ctx.fill();
}

function drawSandSweep(ctx, palette, top = 0.68, amplitude = 0.05) {
  const yStart = CARD_HEIGHT * top;
  ctx.fillStyle = palette.sand;
  ctx.beginPath();
  ctx.moveTo(0, yStart);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.18, yStart - CARD_HEIGHT * amplitude, CARD_WIDTH * 0.42, yStart + CARD_HEIGHT * (amplitude / 2));
  ctx.quadraticCurveTo(CARD_WIDTH * 0.7, yStart + CARD_HEIGHT * amplitude, CARD_WIDTH, yStart - CARD_HEIGHT * (amplitude / 3));
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawStoneShelf(ctx, palette) {
  ctx.fillStyle = 'rgba(115,108,100,0.55)';
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.78);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.3, CARD_HEIGHT * 0.7, CARD_WIDTH * 0.6, CARD_HEIGHT * 0.82);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.85, CARD_HEIGHT * 0.9, CARD_WIDTH, CARD_HEIGHT * 0.82);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawStoneWall(ctx, palette) {
  ctx.fillStyle = 'rgba(90,88,84,0.78)';
  ctx.fillRect(0, CARD_HEIGHT * 0.28, CARD_WIDTH, CARD_HEIGHT * 0.52);
}

function drawWaterColumn(ctx, palette) {
  const grad = ctx.createLinearGradient(0, CARD_HEIGHT * 0.28, 0, CARD_HEIGHT * 0.8);
  grad.addColorStop(0, 'rgba(200,220,255,0.25)');
  grad.addColorStop(1, 'rgba(200,220,255,0.05)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH * 0.42, CARD_HEIGHT * 0.28);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.5, CARD_HEIGHT * 0.52, CARD_WIDTH * 0.46, CARD_HEIGHT * 0.82);
  ctx.lineTo(CARD_WIDTH * 0.32, CARD_HEIGHT * 0.82);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.36, CARD_HEIGHT * 0.5, CARD_WIDTH * 0.28, CARD_HEIGHT * 0.28);
  ctx.closePath();
  ctx.fill();
}

function drawValleyBackdrop(ctx, palette) {
  ctx.fillStyle = palette.foliage;
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.52);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.2, CARD_HEIGHT * 0.45, CARD_WIDTH * 0.38, CARD_HEIGHT * 0.5);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.6, CARD_HEIGHT * 0.6, CARD_WIDTH * 0.82, CARD_HEIGHT * 0.48);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT * 0.62);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawCliffEdge(ctx, palette) {
  ctx.fillStyle = 'rgba(112,100,88,0.8)';
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.74);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.32, CARD_HEIGHT * 0.55, CARD_WIDTH * 0.68, CARD_HEIGHT * 0.7);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT * 0.62);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawCliffTop(ctx, palette) {
  ctx.fillStyle = 'rgba(108,96,80,0.9)';
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.75);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.22, CARD_HEIGHT * 0.68, CARD_WIDTH * 0.44, CARD_HEIGHT * 0.72);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.72, CARD_HEIGHT * 0.8, CARD_WIDTH, CARD_HEIGHT * 0.7);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawMoonlitBay(ctx, palette) {
  drawWaterBand(ctx, palette, { top: 0.42, height: 0.38, softness: 0.05 });
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(180, 210, 255, 0.08)';
  ctx.beginPath();
  ctx.ellipse(CARD_WIDTH * 0.5, CARD_HEIGHT * 0.68, CARD_WIDTH * 0.42, CARD_HEIGHT * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = 'rgba(26,45,58,0.82)';
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.72);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT * 0.72);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawCoastalSlope(ctx, palette) {
  ctx.fillStyle = palette.foliage;
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.75);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.18, CARD_HEIGHT * 0.55, CARD_WIDTH * 0.38, CARD_HEIGHT * 0.68);
  ctx.lineTo(CARD_WIDTH * 0.62, CARD_HEIGHT * 0.88);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawLayeredRidge(ctx, palette) {
  const layers = [
    { offset: 0.6, alpha: 0.25 },
    { offset: 0.68, alpha: 0.35 },
    { offset: 0.76, alpha: 0.45 }
  ];
  layers.forEach(({ offset, alpha }) => {
    ctx.fillStyle = `rgba(90,110,105,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, CARD_HEIGHT * offset);
    ctx.quadraticCurveTo(CARD_WIDTH * 0.3, CARD_HEIGHT * (offset - 0.08), CARD_WIDTH * 0.6, CARD_HEIGHT * offset);
    ctx.quadraticCurveTo(CARD_WIDTH * 0.9, CARD_HEIGHT * (offset + 0.05), CARD_WIDTH, CARD_HEIGHT * (offset - 0.03));
    ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
    ctx.lineTo(0, CARD_HEIGHT);
    ctx.closePath();
    ctx.fill();
  });
}

function drawGraniteBase(ctx, palette) {
  ctx.fillStyle = 'rgba(142,136,122,0.55)';
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.72);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.3, CARD_HEIGHT * 0.5, CARD_WIDTH * 0.64, CARD_HEIGHT * 0.6);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.88, CARD_HEIGHT * 0.7, CARD_WIDTH, CARD_HEIGHT * 0.62);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawUnderwaterPlane(ctx, palette) {
  drawWaterBand(ctx, palette, { top: 0.35, height: 0.45, softness: 0.04 });
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.ellipse(CARD_WIDTH * 0.5, CARD_HEIGHT * 0.64, CARD_WIDTH * 0.48, CARD_HEIGHT * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMangroveBase(ctx, palette) {
  drawWaterBand(ctx, palette, { top: 0.48, height: 0.32, softness: 0.06 });
  ctx.fillStyle = palette.foliage;
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.58);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.24, CARD_HEIGHT * 0.4, CARD_WIDTH * 0.48, CARD_HEIGHT * 0.55);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.8, CARD_HEIGHT * 0.7, CARD_WIDTH, CARD_HEIGHT * 0.5);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawGraniteStacksBase(ctx, palette) {
  drawSandSweep(ctx, palette, 0.7, 0.06);
  ctx.fillStyle = 'rgba(150,140,130,0.5)';
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.62);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.25, CARD_HEIGHT * 0.48, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.66);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.75, CARD_HEIGHT * 0.8, CARD_WIDTH, CARD_HEIGHT * 0.58);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawCaveBase(ctx, palette) {
  ctx.fillStyle = 'rgba(24,26,34,0.95)';
  ctx.fillRect(0, CARD_HEIGHT * 0.32, CARD_WIDTH, CARD_HEIGHT * 0.68);
  ctx.fillStyle = 'rgba(40,44,52,0.85)';
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT * 0.64);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.24, CARD_HEIGHT * 0.56, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.74);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.78, CARD_HEIGHT * 0.86, CARD_WIDTH, CARD_HEIGHT * 0.66);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function addAtmosphere(ctx, card, palette) {
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = palette.shadow;
  ctx.beginPath();
  ctx.ellipse(CARD_WIDTH * 0.5, CARD_HEIGHT * 0.62, CARD_WIDTH * 0.45, CARD_HEIGHT * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (card.lighting === 'storm') {
    drawHorizontalRain(ctx);
  } else if (card.lighting === 'lagoonMist' || card.base === 'mistRidge') {
    drawMistVeil(ctx);
  } else if (card.lighting === 'moonlit' || card.lighting === 'night') {
    drawStarField(ctx, card.index);
  } else if (card.lighting === 'dusk' || card.lighting === 'evening' || card.lighting === 'dawn') {
    drawStarField(ctx, card.index, 0.4);
  }
}

function drawHorizontalRain(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(180,200,220,0.18)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * CARD_WIDTH;
    const y = Math.random() * CARD_HEIGHT * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y + CARD_HEIGHT * 0.1);
    ctx.lineTo(x + 80, y + CARD_HEIGHT * 0.2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMistVeil(ctx) {
  ctx.save();
  const grad = ctx.createLinearGradient(0, CARD_HEIGHT * 0.4, 0, CARD_HEIGHT * 0.9);
  grad.addColorStop(0, 'rgba(240,250,255,0.35)');
  grad.addColorStop(1, 'rgba(200,220,230,0.05)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, CARD_HEIGHT * 0.4, CARD_WIDTH, CARD_HEIGHT * 0.6);
  ctx.restore();
}

function drawStarField(ctx, seed, density = 0.6) {
  const rnd = mulberry32(seed * 9127 + 53);
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  const count = Math.floor(120 * density);
  for (let i = 0; i < count; i++) {
    const x = rnd() * CARD_WIDTH;
    const y = rnd() * CARD_HEIGHT * 0.4;
    const r = 1.2 + rnd() * 2.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function addTitleBar(ctx, card) {
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, CARD_WIDTH, 180);
  ctx.fillStyle = '#f6e8ce';
  ctx.font = 'bold 80px "Cinzel"';
  ctx.textAlign = 'left';
  ctx.fillText(`${card.code} — ${card.title}`, 150, 118);
}

function addFrame(ctx) {
  ctx.save();
  const vignette = ctx.createRadialGradient(CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH / 3.2, CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH / 1.05);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.restore();
}

function drawSun(ctx, x, y, radius, color) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShipSilhouette(ctx, x, y, scale = 1, tone = 'rgba(40,48,60,0.85)') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = tone;
  ctx.beginPath();
  ctx.moveTo(-90, 12);
  ctx.quadraticCurveTo(0, 70, 90, 12);
  ctx.lineTo(80, -4);
  ctx.quadraticCurveTo(0, 36, -80, -6);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-6, -110, 12, 110);
  ctx.beginPath();
  ctx.moveTo(0, -104);
  ctx.lineTo(-70, -36);
  ctx.lineTo(0, -36);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -104);
  ctx.lineTo(60, -28);
  ctx.lineTo(0, -28);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawAnchor(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#3a434f';
  ctx.lineWidth = 24;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -140);
  ctx.lineTo(0, 160);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -190, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-160, 120);
  ctx.quadraticCurveTo(0, 220, 160, 120);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-160, 120);
  ctx.lineTo(-40, 48);
  ctx.moveTo(160, 120);
  ctx.lineTo(40, 48);
  ctx.stroke();
  ctx.restore();
}

function drawRope(ctx, points, options = {}) {
  const { width = 18, color = '#b78c58', dash = [] } = options;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
  ctx.restore();
}

function drawRopeCoil(ctx, x, y, radius = 80, turns = 4) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#b78c58';
  ctx.lineWidth = 16;
  ctx.beginPath();
  for (let i = 0; i < turns; i++) {
    const r = radius - i * 18;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  }
  ctx.stroke();
  ctx.restore();
}

function drawJaggedGranite(ctx, centerX, baseY, width, height, color = 'rgba(132,120,108,0.92)') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX - width / 2, baseY);
  ctx.lineTo(centerX - width * 0.2, baseY - height * 0.9);
  ctx.lineTo(centerX + width * 0.1, baseY - height);
  ctx.lineTo(centerX + width * 0.42, baseY - height * 0.4);
  ctx.lineTo(centerX + width / 2, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSkullHalfBuried(ctx, x, y, radius) {
  ctx.save();
  ctx.fillStyle = 'rgba(232,228,220,0.9)';
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI, 0);
  ctx.lineTo(x + radius, y + radius * 0.42);
  ctx.lineTo(x - radius, y + radius * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2b2620';
  ctx.beginPath();
  ctx.arc(x - radius * 0.45, y - radius * 0.1, radius * 0.28, Math.PI, 0);
  ctx.arc(x + radius * 0.45, y - radius * 0.1, radius * 0.28, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.38, y + radius * 0.12);
  ctx.quadraticCurveTo(x, y + radius * 0.38, x + radius * 0.38, y + radius * 0.12);
  ctx.quadraticCurveTo(x, y + radius * 0.46, x - radius * 0.38, y + radius * 0.12);
  ctx.fill();
  ctx.restore();
}

function drawCoinTrail(ctx, startX, startY, count, spacing = 58, rotation = 0.1) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = startX + Math.cos(rotation) * spacing * i;
    const y = startY + Math.sin(rotation) * spacing * i * 0.5;
    const grad = ctx.createRadialGradient(x - 6, y - 6, 6, x, y, 24);
    grad.addColorStop(0, 'rgba(255,222,140,0.92)');
    grad.addColorStop(1, 'rgba(160,110,40,0.55)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, 26, 18, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawRunePool(ctx, centerX, centerY, radius) {
  ctx.save();
  ctx.strokeStyle = 'rgba(86,220,255,0.85)';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 8;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6;
    const inner = radius * 0.65;
    const outer = radius * 0.92;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
    ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTorch(ctx, x, y, height = 260) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#3a3228';
  ctx.fillRect(-16, -height, 32, height);
  const flameGrad = ctx.createRadialGradient(0, -height, 10, 0, -height, 90);
  flameGrad.addColorStop(0, '#ffe6a3');
  flameGrad.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.ellipse(0, -height, 85, 120, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGlowingSigil(ctx, x, y, radius) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
  grad.addColorStop(0, 'rgba(120,200,255,0.8)');
  grad.addColorStop(1, 'rgba(120,200,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(180,230,255,0.6)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawParrot(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#ff733c';
  ctx.beginPath();
  ctx.ellipse(0, 0, 70, 110, Math.PI / 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#23624a';
  ctx.beginPath();
  ctx.ellipse(42, -26, 58, 76, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f9ec70';
  ctx.beginPath();
  ctx.arc(-24, -36, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1b1a16';
  ctx.beginPath();
  ctx.arc(-28, -40, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawArchRuins(ctx, centerX, baseY, width, height) {
  ctx.save();
  ctx.fillStyle = 'rgba(130,118,102,0.82)';
  ctx.beginPath();
  ctx.moveTo(centerX - width / 2, baseY);
  ctx.lineTo(centerX - width / 2, baseY - height * 0.4);
  ctx.quadraticCurveTo(centerX, baseY - height, centerX + width / 2, baseY - height * 0.4);
  ctx.lineTo(centerX + width / 2, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawGraniteSpires(ctx, leftX, baseY, gap, height) {
  drawJaggedGranite(ctx, leftX, baseY, 220, height);
  drawJaggedGranite(ctx, leftX + gap, baseY, 260, height * 1.1, 'rgba(142,128,116,0.85)');
}

function drawCowHill(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(118,108,100,0.92)';
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH * 0.16, CARD_HEIGHT * 0.66);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.32, CARD_HEIGHT * 0.48, CARD_WIDTH * 0.45, CARD_HEIGHT * 0.52);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.6, CARD_HEIGHT * 0.54, CARD_WIDTH * 0.68, CARD_HEIGHT * 0.6);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.82, CARD_HEIGHT * 0.74, CARD_WIDTH * 0.9, CARD_HEIGHT * 0.68);
  ctx.quadraticCurveTo(CARD_WIDTH * 0.72, CARD_HEIGHT * 0.84, CARD_WIDTH * 0.36, CARD_HEIGHT * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawClockDial(ctx, centerX, centerY, radius) {
  ctx.save();
  ctx.strokeStyle = 'rgba(220,190,120,0.65)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 6;
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    const inner = radius * 0.78;
    const outer = radius * 0.95;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
    ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStormClouds(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(60,70,90,0.7)';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    const x = CARD_WIDTH * (0.2 + 0.2 * i);
    const y = CARD_HEIGHT * (0.18 + 0.04 * (i % 2));
    ctx.ellipse(x, y, 220, 140, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawLightning(ctx, startX, startY, length) {
  ctx.save();
  ctx.strokeStyle = 'rgba(230,230,255,0.9)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX - 40, startY + length * 0.25);
  ctx.lineTo(startX + 20, startY + length * 0.5);
  ctx.lineTo(startX - 60, startY + length * 0.75);
  ctx.lineTo(startX + 10, startY + length);
  ctx.stroke();
  ctx.restore();
}

function drawLanternPair(ctx, positions, glow = '#ffd78a') {
  positions.forEach(([x, y]) => drawLantern(ctx, x, y, 1.1, glow));
}

function drawLantern(ctx, x, y, scale = 1, glowColor = '#ffd78a') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#2d2b26';
  ctx.fillRect(-18, -110, 36, 110);
  const grad = ctx.createRadialGradient(0, -80, 10, 0, -80, 120);
  grad.addColorStop(0, glowColor);
  grad.addColorStop(1, 'rgba(255,160,70,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, -80, 110, 160, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWindLines(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(200,220,255,0.45)';
  ctx.lineWidth = 12;
  for (let i = 0; i < 3; i++) {
    const y = CARD_HEIGHT * (0.36 + 0.06 * i);
    ctx.beginPath();
    ctx.moveTo(CARD_WIDTH * 0.18, y);
    ctx.quadraticCurveTo(CARD_WIDTH * 0.46, y - CARD_HEIGHT * 0.02, CARD_WIDTH * 0.72, y + CARD_HEIGHT * 0.04);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPalm(ctx, baseX, baseY, height, bend) {
  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.strokeStyle = '#3f2f20';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(bend * 60, -height * 0.4, bend * 120, -height);
  ctx.stroke();
  ctx.strokeStyle = '#2f703f';
  ctx.lineWidth = 12;
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (i - 2) * 0.26 + bend * 0.2;
    ctx.beginPath();
    ctx.moveTo(bend * 120, -height);
    ctx.lineTo(bend * 120 + Math.cos(angle) * 180, -height + Math.sin(angle) * 110);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCoralFragments(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(226,210,190,0.9)';
  const fragments = [
    [CARD_WIDTH * 0.36, CARD_HEIGHT * 0.78, 70, 22],
    [CARD_WIDTH * 0.46, CARD_HEIGHT * 0.82, 50, 16],
    [CARD_WIDTH * 0.52, CARD_HEIGHT * 0.79, 40, 18]
  ];
  fragments.forEach(([x, y, w, h]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawStoneCuts(ctx, points) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,230,160,0.8)';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  points.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.restore();
}

function drawChalkArc(ctx, centerX, centerY, radius, startAngle, endAngle) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,250,210,0.9)';
  ctx.lineWidth = 18;
  ctx.setLineDash([24, 18]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}

function drawWaterfallBars(ctx, x, top, bottom) {
  ctx.save();
  ctx.strokeStyle = 'rgba(160,200,255,0.6)';
  ctx.lineWidth = 10;
  ctx.setLineDash([16, 14]);
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();
  ctx.restore();
}

function drawTallyMarks(ctx, startX, startY, count) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,230,150,0.8)';
  ctx.lineWidth = 12;
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    ctx.moveTo(startX + i * 26, startY);
    ctx.lineTo(startX + i * 26, startY + 90);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(startX - 12, startY + 90);
  ctx.lineTo(startX + count * 26, startY - 20);
  ctx.stroke();
  ctx.restore();
}

function drawFeather(ctx, x, y, length, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const grad = ctx.createLinearGradient(0, 0, length, 0);
  grad.addColorStop(0, '#ffe8b5');
  grad.addColorStop(1, '#ff4f6d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.32, -30, length, 0);
  ctx.quadraticCurveTo(length * 0.32, 30, 0, 0);
  ctx.fill();
  ctx.restore();
}

function drawCoinSingle(ctx, x, y, radius = 32) {
  ctx.save();
  const grad = ctx.createRadialGradient(x - radius * 0.4, y - radius * 0.4, radius * 0.2, x, y, radius);
  grad.addColorStop(0, '#ffe5a1');
  grad.addColorStop(1, '#c68a32');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, radius * 1.2, radius, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCoralGate(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(220,200,180,0.9)';
  ctx.lineWidth = 28;
  for (let i = 0; i < 6; i++) {
    const x = CARD_WIDTH * (0.26 + i * 0.08);
    ctx.beginPath();
    ctx.moveTo(x, CARD_HEIGHT * 0.54);
    ctx.quadraticCurveTo(x + 20, CARD_HEIGHT * 0.42, x + 4, CARD_HEIGHT * 0.36);
    ctx.lineTo(x - 20, CARD_HEIGHT * 0.56);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBowCarving(ctx, centerX, centerY, width) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,230,180,0.85)';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(centerX - width / 2, centerY);
  ctx.quadraticCurveTo(centerX, centerY - width * 0.6, centerX + width / 2, centerY);
  ctx.quadraticCurveTo(centerX, centerY + width * 0.4, centerX - width / 2, centerY);
  ctx.stroke();
  ctx.restore();
}

function drawMangroveRoots(ctx, baseY) {
  ctx.save();
  ctx.strokeStyle = 'rgba(90,70,50,0.85)';
  ctx.lineWidth = 20;
  const roots = [0.18, 0.32, 0.44, 0.58, 0.7, 0.82];
  roots.forEach((ratio) => {
    const x = CARD_WIDTH * ratio;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x - 40, baseY - 140, x - 60, baseY - 280);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + 30, baseY - 120, x + 40, baseY - 260);
    ctx.stroke();
  });
  ctx.restore();
}

function drawChest(ctx, x, y, scale = 1, open = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#6a3c1f';
  ctx.beginPath();
  ctx.moveTo(-120, 0);
  ctx.lineTo(120, 0);
  ctx.lineTo(100, 100);
  ctx.lineTo(-100, 100);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d7b46a';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.fillStyle = '#4f2a15';
  ctx.beginPath();
  ctx.moveTo(-120, 0);
  ctx.lineTo(0, open ? -80 : -60);
  ctx.lineTo(120, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawChalkRose(ctx, centerX, centerY, radius) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,245,210,0.9)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const nextAngle = (Math.PI * 2 * (i + 1)) / 8;
    ctx.moveTo(centerX + Math.cos(angle) * radius * 0.2, centerY + Math.sin(angle) * radius * 0.2);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.lineTo(centerX + Math.cos(nextAngle) * radius * 0.2, centerY + Math.sin(nextAngle) * radius * 0.2);
  }
  ctx.stroke();
  ctx.restore();
}

function drawDoorway(ctx, x, y, width, height) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#413530';
  ctx.beginPath();
  ctx.moveTo(-width / 2, height / 2);
  ctx.lineTo(-width / 2, -height / 2 + 80);
  ctx.quadraticCurveTo(0, -height / 2, width / 2, -height / 2 + 80);
  ctx.lineTo(width / 2, height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#271f1a';
  ctx.beginPath();
  ctx.moveTo(-width / 2 + 40, height / 2 - 20);
  ctx.lineTo(-width / 2 + 40, -height / 2 + 120);
  ctx.quadraticCurveTo(0, -height / 2 + 36, width / 2 - 40, -height / 2 + 120);
  ctx.lineTo(width / 2 - 40, height / 2 - 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDoorPlates(ctx, centerX, centerY, width, height) {
  ctx.save();
  ctx.fillStyle = '#665848';
  ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
  ctx.strokeStyle = '#d4b470';
  ctx.lineWidth = 12;
  ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
  ctx.restore();
}

function drawCompass(ctx, x, y, radius) {
  ctx.save();
  const baseGrad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
  baseGrad.addColorStop(0, 'rgba(255,242,210,0.9)');
  baseGrad.addColorStop(1, 'rgba(180,150,90,0.6)');
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(90,70,50,0.6)';
  ctx.lineWidth = radius * 0.07;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.88, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f6e8ce';
  ctx.beginPath();
  ctx.moveTo(x, y - radius * 0.85);
  ctx.lineTo(x + radius * 0.18, y);
  ctx.lineTo(x, y + radius * 0.26);
  ctx.lineTo(x - radius * 0.18, y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(50,40,30,0.7)';
  ctx.lineWidth = radius * 0.04;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.72, y);
  ctx.lineTo(x + radius * 0.72, y);
  ctx.moveTo(x, y - radius * 0.72);
  ctx.lineTo(x, y + radius * 0.72);
  ctx.stroke();

  ctx.fillStyle = '#dfc37a';
  ctx.font = `bold ${Math.round(radius * 0.32)}px "Cinzel"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('N', x, y - radius * 0.58);
  ctx.fillText('S', x, y + radius * 0.58);
  ctx.fillText('E', x + radius * 0.6, y);
  ctx.fillText('W', x - radius * 0.6, y);
  ctx.restore();
}

function drawWaterfall(ctx, centerX, topY, bottomY, width) {
  ctx.save();
  const grad = ctx.createLinearGradient(0, topY, 0, bottomY);
  grad.addColorStop(0, 'rgba(210,230,255,0.75)');
  grad.addColorStop(1, 'rgba(140,180,220,0.2)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(centerX - width / 2, topY);
  ctx.bezierCurveTo(centerX - width * 0.6, (topY + bottomY) / 2, centerX - width * 0.4, bottomY, centerX - width * 0.18, bottomY);
  ctx.lineTo(centerX + width * 0.18, bottomY);
  ctx.bezierCurveTo(centerX + width * 0.42, bottomY * 0.92, centerX + width * 0.54, (topY + bottomY) / 2, centerX + width / 2, topY);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = width * 0.06;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX + i * width * 0.18, topY + 20);
    ctx.quadraticCurveTo(centerX + i * width * 0.12, (topY + bottomY) / 2, centerX + i * width * 0.08, bottomY - 20);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSkullEmblem(ctx, x, y, radius) {
  ctx.save();
  ctx.fillStyle = 'rgba(120,38,36,0.85)';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f1e7c2';
  ctx.beginPath();
  ctx.arc(x - radius * 0.35, y - radius * 0.15, radius * 0.26, 0, Math.PI * 2);
  ctx.arc(x + radius * 0.35, y - radius * 0.15, radius * 0.26, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.4, y + radius * 0.2);
  ctx.lineTo(x + radius * 0.4, y + radius * 0.2);
  ctx.lineTo(x + radius * 0.26, y + radius * 0.56);
  ctx.lineTo(x - radius * 0.26, y + radius * 0.56);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#2b2620';
  ctx.beginPath();
  ctx.arc(x - radius * 0.28, y - radius * 0.14, radius * 0.12, 0, Math.PI * 2);
  ctx.arc(x + radius * 0.28, y - radius * 0.14, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.22, y + radius * 0.22);
  ctx.quadraticCurveTo(x, y + radius * 0.38, x + radius * 0.22, y + radius * 0.22);
  ctx.quadraticCurveTo(x, y + radius * 0.46, x - radius * 0.22, y + radius * 0.22);
  ctx.fill();
  ctx.restore();
}

function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawShadow(ctx, x, y, width, height) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, width * 0.2, x, y, width);
  grad.addColorStop(0, 'rgba(0,0,0,0.3)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const sceneBuilders = {
  'S3-01': (ctx) => {
    drawSun(ctx, CARD_WIDTH * 0.15, CARD_HEIGHT * 0.18, 180, 'rgba(255,240,200,0.9)');
    drawShipSilhouette(ctx, CARD_WIDTH * 0.78, CARD_HEIGHT * 0.45, 0.8, 'rgba(50,70,90,0.6)');
    drawAnchor(ctx, CARD_WIDTH * 0.28, CARD_HEIGHT * 0.76, 1.05);
    drawRope(ctx, [
      [CARD_WIDTH * 0.28, CARD_HEIGHT * 0.64],
      [CARD_WIDTH * 0.42, CARD_HEIGHT * 0.58],
      [CARD_WIDTH * 0.54, CARD_HEIGHT * 0.64]
    ]);
    drawGraniteSpires(ctx, CARD_WIDTH * 0.62, CARD_HEIGHT * 0.7, CARD_WIDTH * 0.16, CARD_HEIGHT * 0.34);
  },
  'S3-02': (ctx) => {
    drawSkullHalfBuried(ctx, CARD_WIDTH * 0.36, CARD_HEIGHT * 0.76, 160);
    drawCoinTrail(ctx, CARD_WIDTH * 0.44, CARD_HEIGHT * 0.82, 9, 60, 0.18);
    drawShadow(ctx, CARD_WIDTH * 0.34, CARD_HEIGHT * 0.86, 220, 60);
  },
  'S3-03': (ctx) => {
    drawRunePool(ctx, CARD_WIDTH * 0.46, CARD_HEIGHT * 0.72, 320);
    drawMistVeil(ctx);
    drawShipSilhouette(ctx, CARD_WIDTH * 0.82, CARD_HEIGHT * 0.46, 0.6, 'rgba(60,100,120,0.4)');
  },
  'S3-04': (ctx, card, palette) => {
    drawWaterColumn(ctx, palette);
    drawTorch(ctx, CARD_WIDTH * 0.3, CARD_HEIGHT * 0.78, 260);
    drawGlowingSigil(ctx, CARD_WIDTH * 0.54, CARD_HEIGHT * 0.52, 120);
    drawShadow(ctx, CARD_WIDTH * 0.6, CARD_HEIGHT * 0.82, 260, 80);
  },
  'S3-05': (ctx) => {
    drawArchRuins(ctx, CARD_WIDTH * 0.36, CARD_HEIGHT * 0.68, 520, 320);
    drawParrot(ctx, CARD_WIDTH * 0.36, CARD_HEIGHT * 0.48, 1.15);
    drawShadow(ctx, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.82, 280, 110);
    drawFeather(ctx, CARD_WIDTH * 0.48, CARD_HEIGHT * 0.72, 220, -0.3);
  },
  'S3-06': (ctx, card, palette) => {
    drawGraniteSpires(ctx, CARD_WIDTH * 0.3, CARD_HEIGHT * 0.66, CARD_WIDTH * 0.36, CARD_HEIGHT * 0.42);
    drawWaterBand(ctx, palette, { top: 0.52, height: 0.2, softness: 0.05 });
    drawShipSilhouette(ctx, CARD_WIDTH * 0.72, CARD_HEIGHT * 0.52, 0.7, 'rgba(40,60,90,0.55)');
    drawCompass(ctx, CARD_WIDTH * 0.58, CARD_HEIGHT * 0.8, 150);
  },
  'S3-07': (ctx) => {
    drawCowHill(ctx);
    drawClockDial(ctx, CARD_WIDTH * 0.52, CARD_HEIGHT * 0.6, 150);
    drawStarField(ctx, 707, 0.9);
  },
  'S3-08': (ctx) => {
    drawStormClouds(ctx);
    drawLightning(ctx, CARD_WIDTH * 0.68, CARD_HEIGHT * 0.18, CARD_HEIGHT * 0.38);
    drawCoinSingle(ctx, CARD_WIDTH * 0.4, CARD_HEIGHT * 0.8, 38);
    drawTricorn(ctx, CARD_WIDTH * 0.62, CARD_HEIGHT * 0.78, 0.9);
  },
  'S3-09': (ctx) => {
    drawDoorway(ctx, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.72, 420, 520);
    drawLanternPair(ctx, [
      [CARD_WIDTH * 0.36, CARD_HEIGHT * 0.7],
      [CARD_WIDTH * 0.64, CARD_HEIGHT * 0.7]
    ]);
    drawShadow(ctx, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.9, 280, 90);
  },
  'S3-10': (ctx) => {
    drawWindLines(ctx);
    drawRopeCoil(ctx, CARD_WIDTH * 0.36, CARD_HEIGHT * 0.72, 90, 4);
    drawRope(ctx, [
      [CARD_WIDTH * 0.36, CARD_HEIGHT * 0.72],
      [CARD_WIDTH * 0.48, CARD_HEIGHT * 0.66],
      [CARD_WIDTH * 0.68, CARD_HEIGHT * 0.58]
    ], { width: 14 });
    drawPalm(ctx, CARD_WIDTH * 0.18, CARD_HEIGHT * 0.78, 380, -1);
    drawPalm(ctx, CARD_WIDTH * 0.22, CARD_HEIGHT * 0.8, 340, -0.7);
  },
  'S3-11': (ctx, card, palette) => {
    drawMoonlitBay(ctx, palette);
    drawStarField(ctx, 311, 1.2);
    drawCoralFragments(ctx);
    drawChest(ctx, CARD_WIDTH * 0.46, CARD_HEIGHT * 0.78, 0.6, false);
  },
  'S3-12': (ctx) => {
    drawStoneCuts(ctx, [
      [CARD_WIDTH * 0.28, CARD_HEIGHT * 0.72, CARD_WIDTH * 0.44, CARD_HEIGHT * 0.6],
      [CARD_WIDTH * 0.3, CARD_HEIGHT * 0.78, CARD_WIDTH * 0.46, CARD_HEIGHT * 0.66],
      [CARD_WIDTH * 0.32, CARD_HEIGHT * 0.84, CARD_WIDTH * 0.52, CARD_HEIGHT * 0.72]
    ]);
    drawCutlass(ctx, CARD_WIDTH * 0.52, CARD_HEIGHT * 0.72, -0.55);
    drawMapScrap(ctx, CARD_WIDTH * 0.42, CARD_HEIGHT * 0.86, 360, 200);
  },
  'S3-13': (ctx) => {
    drawMistVeil(ctx);
    drawLantern(ctx, CARD_WIDTH * 0.48, CARD_HEIGHT * 0.7, 1.1, '#ffd688');
    drawRope(ctx, [
      [CARD_WIDTH * 0.26, CARD_HEIGHT * 0.78],
      [CARD_WIDTH * 0.48, CARD_HEIGHT * 0.72],
      [CARD_WIDTH * 0.68, CARD_HEIGHT * 0.82]
    ], { width: 14 });
    drawStarField(ctx, 513, 0.5);
  },
  'S3-14': (ctx, card, palette) => {
    drawGraniteBase(ctx, palette);
    drawChalkArc(ctx, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.62, 420, Math.PI * 0.1, Math.PI * 0.9);
    drawCutlass(ctx, CARD_WIDTH * 0.64, CARD_HEIGHT * 0.7, -0.18);
  },
  'S3-15': (ctx) => {
    drawWaterfall(ctx, CARD_WIDTH * 0.44, CARD_HEIGHT * 0.28, CARD_HEIGHT * 0.82, CARD_WIDTH * 0.2);
    drawWaterfallBars(ctx, CARD_WIDTH * 0.52, CARD_HEIGHT * 0.32, CARD_HEIGHT * 0.8);
    drawRope(ctx, [
      [CARD_WIDTH * 0.28, CARD_HEIGHT * 0.76],
      [CARD_WIDTH * 0.38, CARD_HEIGHT * 0.82],
      [CARD_WIDTH * 0.48, CARD_HEIGHT * 0.88]
    ], { width: 12 });
    drawParrot(ctx, CARD_WIDTH * 0.68, CARD_HEIGHT * 0.56, 0.9);
    drawChest(ctx, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.84, 0.55, false);
    drawTallyMarks(ctx, CARD_WIDTH * 0.62, CARD_HEIGHT * 0.44, 4);
  },
  'S3-16': (ctx) => {
    drawJaggedGranite(ctx, CARD_WIDTH * 0.46, CARD_HEIGHT * 0.72, 360, CARD_HEIGHT * 0.28, 'rgba(138,126,110,0.88)');
    drawSkullHalfBuried(ctx, CARD_WIDTH * 0.46, CARD_HEIGHT * 0.68, 120);
    drawFeather(ctx, CARD_WIDTH * 0.58, CARD_HEIGHT * 0.7, 200, -0.24);
    drawCoinSingle(ctx, CARD_WIDTH * 0.48, CARD_HEIGHT * 0.82, 34);
  },
  'S3-17': (ctx) => {
    drawCoralGate(ctx);
    drawBowCarving(ctx, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.5, 260);
    drawStarField(ctx, 717, 0.3);
    drawShipSilhouette(ctx, CARD_WIDTH * 0.8, CARD_HEIGHT * 0.44, 0.6, 'rgba(20,40,60,0.4)');
  },
  'S3-18': (ctx) => {
    drawMangroveRoots(ctx, CARD_HEIGHT * 0.6);
    drawChest(ctx, CARD_WIDTH * 0.52, CARD_HEIGHT * 0.78, 0.6, true);
    drawRope(ctx, [
      [CARD_WIDTH * 0.52, CARD_HEIGHT * 0.78],
      [CARD_WIDTH * 0.46, CARD_HEIGHT * 0.72],
      [CARD_WIDTH * 0.4, CARD_HEIGHT * 0.68]
    ], { width: 12 });
    drawSkullEmblem(ctx, CARD_WIDTH * 0.66, CARD_HEIGHT * 0.62, 70);
  },
  'S3-19': (ctx, card, palette) => {
    drawGraniteStacksBase(ctx, palette);
    drawGraniteSpires(ctx, CARD_WIDTH * 0.3, CARD_HEIGHT * 0.68, CARD_WIDTH * 0.34, CARD_HEIGHT * 0.32);
    drawChalkRose(ctx, CARD_WIDTH * 0.46, CARD_HEIGHT * 0.62, 180);
    drawShadow(ctx, CARD_WIDTH * 0.64, CARD_HEIGHT * 0.74, 220, 80);
  },
  'S3-20': (ctx) => {
    drawDoorPlates(ctx, CARD_WIDTH * 0.5, CARD_HEIGHT * 0.58, 540, 520);
    drawLanternPair(ctx, [
      [CARD_WIDTH * 0.32, CARD_HEIGHT * 0.64],
      [CARD_WIDTH * 0.68, CARD_HEIGHT * 0.64]
    ], '#ffc873');
    drawCoinTrail(ctx, CARD_WIDTH * 0.44, CARD_HEIGHT * 0.86, 5, 52, 0.05);
    drawParrot(ctx, CARD_WIDTH * 0.78, CARD_HEIGHT * 0.46, 0.85);
  }
};

function drawMapScrap(ctx, x, y, width, height) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#f5d9b3';
  ctx.beginPath();
  ctx.moveTo(-width / 2, -height / 2);
  ctx.lineTo(width / 2, -height / 2 + 20);
  ctx.lineTo(width / 2 - 40, height / 2);
  ctx.lineTo(-width / 2 + 36, height / 2 - 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#a07b46';
  ctx.lineWidth = 6;
  ctx.setLineDash([18, 18]);
  ctx.stroke();
  ctx.restore();
}

function drawCutlass(ctx, x, y, angle = -0.3) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#d2d6e4';
  ctx.beginPath();
  ctx.moveTo(-280, -22);
  ctx.quadraticCurveTo(-100, -120, 130, -30);
  ctx.quadraticCurveTo(-90, 50, -280, 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#b8bcc8';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.fillStyle = '#a0672c';
  ctx.beginPath();
  ctx.ellipse(160, -6, 34, 68, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawTricorn(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#1f1c1a';
  ctx.beginPath();
  ctx.moveTo(-160, 0);
  ctx.quadraticCurveTo(0, -100, 160, 0);
  ctx.quadraticCurveTo(0, 74, -160, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#caa668';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function renderCard(card) {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext('2d');
  const palette = paintBase(ctx, card);
  addAtmosphere(ctx, card, palette);
  const builder = sceneBuilders[card.code];
  if (builder) {
    builder(ctx, card, palette);
  }
  addFrame(ctx);
  addTitleBar(ctx, card);
  return canvas;
}

function buildMetadata(card) {
  return {
    name: `${card.code} — ${card.title}`,
    description: `${card.code} — ${card.title}. Clue: ${card.clue}`,
    image: `/preview/chapter3/${card.code}.png`,
    attributes: [
      { trait_type: 'Chapter', value: 'III — The Pirate’s Trail' },
      { trait_type: 'Place', value: card.place },
      { trait_type: 'TimeOfDay', value: card.timeOfDay },
      { trait_type: 'SceneType', value: card.sceneType },
      { trait_type: 'Symbol', value: card.symbol },
      { trait_type: 'Rarity', value: card.rarity }
    ]
  };
}

async function createContactSheet(imagePaths) {
  const width = CONTACT_COLS * CONTACT_CELL + CONTACT_MARGIN * 2;
  const height = CONTACT_ROWS * CONTACT_CELL + CONTACT_MARGIN * 2;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0d141f';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < imagePaths.length; i++) {
    const img = await loadImage(imagePaths[i]);
    const col = i % CONTACT_COLS;
    const row = Math.floor(i / CONTACT_COLS);
    const x = CONTACT_MARGIN + col * CONTACT_CELL;
    const y = CONTACT_MARGIN + row * CONTACT_CELL;

  ctx.save();
  drawRoundedRectPath(ctx, x, y, CONTACT_CELL - CONTACT_MARGIN / 2, CONTACT_CELL - CONTACT_MARGIN / 2, 24);
  ctx.clip();

    const scale = Math.min((CONTACT_CELL - CONTACT_MARGIN) / img.width, (CONTACT_CELL - CONTACT_MARGIN) / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const offsetX = x + ((CONTACT_CELL - CONTACT_MARGIN / 2) - drawW) / 2;
    const offsetY = y + ((CONTACT_CELL - CONTACT_MARGIN / 2) - drawH) / 2;
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 236, 200, 0.78)';
    ctx.font = 'bold 28px "Cinzel"';
    ctx.fillText(cards[i].code, x + 26, y + CONTACT_CELL - 28);
  }

  fs.writeFileSync(CONTACT_SHEET_PATH, canvas.toBuffer('image/png'));
  console.log(`📋 Contact sheet created at ${CONTACT_SHEET_PATH}`);
}

async function main() {
  console.log('🎨 Generating Chapter III — The Pirate’s Trail (S3) preview set...');
  const imagePaths = [];

  for (const card of cards) {
    const canvas = renderCard(card);
    const buffer = canvas.toBuffer('image/png');
    const imagePath = path.join(IMAGE_DIR, `${card.code}.png`);
    fs.writeFileSync(imagePath, buffer);
    fs.writeFileSync(path.join(CHAPTER3_PREVIEW_DIR, `${card.code}.png`), buffer);
    imagePaths.push(imagePath);

    const metadata = buildMetadata(card);
    const metaPath = path.join(META_DIR, `${card.code}.json`);
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ ${card.code} generated.`);
  }

  await createContactSheet(imagePaths);
  console.log('✅ All S3 preview assets generated. Reminder: DO NOT MINT until explicit approval.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { cards, main };
