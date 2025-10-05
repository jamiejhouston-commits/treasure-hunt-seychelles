// Chapter III — The Pirate’s Trail (S3) Generator
// Generates 20 cinematic 2048×2048 illustrations + metadata + contact sheet for review (NO MINT)
// Output directories:
//   images/s3/S3-XX.png
//   metadata/s3/S3-XX.json
//   previews/s3_contact.png

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_ROOT = path.join(__dirname, 'dist');
const IMG_DIR = path.join(OUTPUT_ROOT, 'images', 's3');
const META_DIR = path.join(OUTPUT_ROOT, 'metadata', 's3');
const PREVIEW_DIR = path.join(OUTPUT_ROOT, 'previews');

[IMG_DIR, META_DIR, PREVIEW_DIR].forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

const cards = [
  {
    index: 1,
    code: 'S3-01',
    title: 'Landing at Anse Gaulette',
    place: 'Anse Gaulette, Mahé',
    timeOfDay: 'Morning Sun',
    lighting: 'sunny-morning',
    sceneType: 'Beach',
    symbol: 'Rope',
    rarity: 'Legendary',
    clue: 'Where Picault kissed the shore, the rope points past the teeth of granite.',
    elements: ['ship', 'anchor', 'rope', 'hat', 'granite', 'palms']
  },
  {
    index: 2,
    code: 'S3-02',
    title: 'Skull in the Sand',
    place: 'Beau Vallon, Mahé',
    timeOfDay: 'High Noon',
    lighting: 'sunny-midday',
    sceneType: 'Beach',
    symbol: 'Skull',
    rarity: 'Rare',
    clue: 'Count the coins to the water’s edge; the odd piece marks your bearing.',
    elements: ['skullSand', 'driftwoodCross', 'coins', 'turquoiseWater']
  },
  {
    index: 3,
    code: 'S3-03',
    title: 'Rune of Ros Sodyer',
    place: 'Ros Sodyer Rock Pool, Mahé',
    timeOfDay: 'Low Tide Sun',
    lighting: 'sunny-midday',
    sceneType: 'Reef',
    symbol: 'Dagger',
    rarity: 'Epic',
    clue: 'When the ocean exhales, three lights remain—read them in the pool’s quiet eye.',
    elements: ['rockPoolRunes', 'daggerFeather', 'glints']
  },
  {
    index: 4,
    code: 'S3-04',
    title: 'Torch Wall at Cascade',
    place: 'Cascade Waterfall, Mahé',
    timeOfDay: 'Late Afternoon',
    lighting: 'sunshafts',
    sceneType: 'Waterfall',
    symbol: 'Lantern',
    rarity: 'Epic',
    clue: 'Step through the veil—fire reveals the mark the rain conceals.',
    elements: ['torch', 'waterfall', 'compassTick', 'chestSilhouette']
  },
  {
    index: 5,
    code: 'S3-05',
    title: 'Parrot of Mission Lodge',
    place: 'Mission Lodge, Mahé',
    timeOfDay: 'Golden Hour',
    lighting: 'golden-hour',
    sceneType: 'Viewpoint',
    symbol: 'Parrot',
    rarity: 'Rare',
    clue: 'The arch’s shadow names the hour; the feather points your climb.',
    elements: ['parrot', 'arch', 'mapScrap', 'ropeArc']
  },
  {
    index: 6,
    code: 'S3-06',
    title: 'Granite Teeth of Georgette',
    place: 'Anse Georgette, Praslin',
    timeOfDay: 'Midday',
    lighting: 'sunny-midday',
    sceneType: 'Beach',
    symbol: 'Chest',
    rarity: 'Epic',
    clue: 'Between the teeth, a corner of night; measure the gaps to find the shoal.',
    elements: ['graniteTeeth', 'chestCorner', 'compassRose']
  },
  {
    index: 7,
    code: 'S3-07',
    title: 'Vache Sentinel',
    place: 'Île aux Vaches Marines',
    timeOfDay: 'Sunny',
    lighting: 'sunny-bright',
    sceneType: 'Islet',
  symbol: 'Compass',
    rarity: 'Legendary',
    clue: 'A cow by name, a watch by duty—seven lights refuse to drink.',
    elements: ['isletGranite', 'cutlass', 'rope', 'sevenStars']
  },
  {
    index: 8,
    code: 'S3-08',
    title: 'Intendance Thunder',
    place: 'Anse Intendance, Mahé',
    timeOfDay: 'Pre-Storm Glow',
    lighting: 'storm-glow',
    sceneType: 'Beach',
  symbol: 'Coin',
    rarity: 'Rare',
    clue: 'Turn the scar on the coin toward calm; the shoreline will forgive.',
    elements: ['stormSurf', 'skullCoin', 'tricornHat', 'shipHorizon']
  },
  {
    index: 9,
    code: 'S3-09',
    title: 'Royale Lantern',
    place: 'Anse Royale, Mahé',
    timeOfDay: 'Sunset',
    lighting: 'sunset',
    sceneType: 'Beach',
    symbol: 'Lantern',
    rarity: 'Rare',
    clue: 'Royale rests with two small lights—loop the rope and climb to counsel.',
    elements: ['lantern', 'ropeLoop', 'tidePoolStars']
  },
  {
    index: 10,
    code: 'S3-10',
    title: 'La Misère Lookout',
    place: 'La Misère Viewpoint',
    timeOfDay: 'Blue Hour',
    lighting: 'blue-hour',
    sceneType: 'Viewpoint',
    symbol: 'Compass',
    rarity: 'Epic',
    clue: 'Count two knots of wind and drop to the quiet bay.',
    elements: ['vistaLights', 'ropeKnots', 'shipLights']
  },
  {
    index: 11,
    code: 'S3-11',
    title: 'Baie Ternay Mirror',
    place: 'Baie Ternay, Mahé',
    timeOfDay: 'Mid-Morning',
    lighting: 'sunny-midday',
    sceneType: 'Reef',
    symbol: 'Coin',
    rarity: 'Rare',
    clue: 'In a bay that refuses storm, the coral fingers name your number.',
    elements: ['clearWater', 'coralDegree', 'featherCoral', 'chestShadow']
  },
  {
    index: 12,
    code: 'S3-12',
    title: 'Anse Major Edge',
    place: 'Anse Major Trail, Mahé',
    timeOfDay: 'Harsh Sun',
    lighting: 'sunny-high',
    sceneType: 'Trail',
    symbol: 'Dagger',
    rarity: 'Epic',
    clue: 'Count the cuts along the hilt—the path bites east.',
    elements: ['coastTrail', 'daggerMap', 'ropePointer']
  },
  {
    index: 13,
    code: 'S3-13',
    title: 'Morne Blanc Mist',
    place: 'Morne Blanc, Mahé',
    timeOfDay: 'Misty Dawn',
    lighting: 'mist-glow',
    sceneType: 'Trail',
    symbol: 'Lantern',
    rarity: 'Legendary',
    clue: 'Five lights survive the cloud; lay your arc where the ridge breathes.',
    elements: ['mistBoardwalk', 'lanternGlow', 'ropeArc', 'starPricks']
  },
  {
    index: 14,
    code: 'S3-14',
    title: 'Copolia Dome',
    place: 'Copolia Granite Dome, Mahé',
    timeOfDay: 'High Sun',
    lighting: 'sunny-high',
    sceneType: 'Viewpoint',
    symbol: 'Compass',
    rarity: 'Rare',
    clue: 'On the stone, light bends the reef—arc the rope where shoreline turns.',
    elements: ['graniteDome', 'lantern', 'cutlassParchment', 'glare']
  },
  {
    index: 15,
    code: 'S3-15',
    title: 'Sauzier’s Echo',
    place: 'Sauzier Waterfall, Port Glaud',
    timeOfDay: 'Dappled Noon',
    lighting: 'dappled',
    sceneType: 'Waterfall',
    symbol: 'Parrot',
    rarity: 'Epic',
    clue: 'Follow the echo’s measure; its bars climb the coast.',
    elements: ['waterfallBars', 'ropeLadder', 'parrot', 'chestHandle']
  },
  {
    index: 16,
    code: 'S3-16',
    title: 'Skull Mark at Gaulettes',
    place: 'Anse Gaulettes Marker Stone, Mahé',
    timeOfDay: 'Golden Hour',
    lighting: 'golden-hour',
    sceneType: 'Trail',
    symbol: 'Skull',
    rarity: 'Rare',
    clue: 'Scratch the sign and follow the feather—the coin’s notch faces home.',
    elements: ['markerStone', 'skullEtch', 'coinNotch', 'featherBay']
  },
  {
    index: 17,
    code: 'S3-17',
    title: 'Denison Reef Gate',
    place: 'Lady Denison-Pender Shoal',
    timeOfDay: 'High Sun',
    lighting: 'sunny-high',
    sceneType: 'Reef',
    symbol: 'Compass',
    rarity: 'Legendary',
    clue: 'Six lights pretend to open—turn your bow; home holds the lock.',
    elements: ['reefChart', 'shipTurn', 'sixStars']
  },
  {
    index: 18,
    code: 'S3-18',
    title: 'Curieuse Mangrove Secret',
    place: 'Curieuse Island Mangroves',
    timeOfDay: 'Noon',
    lighting: 'emerald-noon',
    sceneType: 'Reef',
    symbol: 'Chest',
    rarity: 'Rare',
    clue: 'Where roots breathe air, a small chest lies listening.',
    elements: ['mangroveRoots', 'smallChest', 'skullCharm']
  },
  {
    index: 19,
    code: 'S3-19',
    title: 'Anse Source d’Argent Veil',
    place: 'Anse Source d’Argent, La Digue',
    timeOfDay: 'Late Afternoon',
    lighting: 'sunset-gold',
    sceneType: 'Beach',
    symbol: 'Compass',
    rarity: 'Epic',
    clue: 'The rose chalked on stone turns with the sun—trace its shadow to the gap.',
    elements: ['pinkGranite', 'parchmentPalm', 'compassChalk']
  },
  {
    index: 20,
    code: 'S3-20',
    title: 'Door Below Morne Seychellois',
    place: 'Morne Seychellois Foothill Cave',
    timeOfDay: 'Torchlit Night',
    lighting: 'torch-night',
    sceneType: 'Cave',
    symbol: 'Lantern',
    rarity: 'Legendary',
    clue: 'All roads return to the first shore; the door hears only the right order.',
    elements: ['stoneDoor', 'lanterns', 'coinsDust', 'parrotSilhouette']
  }
];

const SYMBOL_MAP = {
  Rope: 'Rope',
  Skull: 'Skull',
  Dagger: 'Dagger',
  Lantern: 'Lantern',
  Parrot: 'Parrot',
  Chest: 'Chest',
  Coin: 'Coin',
  Compass: 'Compass',
  Cutlass: 'Compass' // fallback mapping (cutlass still pirate but map to Compass attribute if needed)
};

function seededRandom(seed) {
  let value = Math.sin(seed) * 10000;
  return () => {
    value = Math.sin(value + seed) * 10000;
    return value - Math.floor(value);
  };
}

function lerpColor(c1, c2, t) {
  const toRgb = (c) => {
    const num = parseInt(c.replace('#', ''), 16);
    return [num >> 16 & 255, num >> 8 & 255, num & 255];
  };
  const rgb1 = toRgb(c1);
  const rgb2 = toRgb(c2);
  const mix = rgb1.map((v, i) => Math.round(v + (rgb2[i] - v) * t));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}

function drawSky(ctx, card, rand) {
  const { lighting } = card;
  let top, mid, bottom;
  switch (lighting) {
    case 'sunny-morning':
      top = '#dff5ff'; mid = '#9fd4ff'; bottom = '#f2d6b3';
      break;
    case 'sunny-midday':
    case 'sunny-high':
      top = '#80c6ff'; mid = '#4da8ff'; bottom = '#1d79d3';
      break;
    case 'golden-hour':
    case 'sunset-gold':
      top = '#ffdf9e'; mid = '#ffb97a'; bottom = '#ff7e5f';
      break;
    case 'sunset':
      top = '#f9b4d0'; mid = '#ff8e72'; bottom = '#2f3a80';
      break;
    case 'blue-hour':
      top = '#324a8b'; mid = '#273872'; bottom = '#142042';
      break;
    case 'storm-glow':
      top = '#98a7c1'; mid = '#59688e'; bottom = '#2a344c';
      break;
    case 'mist-glow':
      top = '#c7d6de'; mid = '#9fb4c6'; bottom = '#6d7f8e';
      break;
    case 'emerald-noon':
      top = '#a9f4d2'; mid = '#5bd3a7'; bottom = '#13897b';
      break;
    case 'torch-night':
      top = '#101018'; mid = '#151b2f'; bottom = '#231a18';
      break;
    case 'sunshafts':
      top = '#c8dffe'; mid = '#92b8f9'; bottom = '#e7c28a';
      break;
    case 'sunny-bright':
      top = '#ccf5ff'; mid = '#7fcbff'; bottom = '#2a8bd7';
      break;
    case 'dappled':
      top = '#b9d4bb'; mid = '#78a98a'; bottom = '#2f5a4e';
      break;
    default:
      top = '#a2c5ff'; mid = '#4b8ed3'; bottom = '#0b3566';
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, 2048);
  gradient.addColorStop(0, top);
  gradient.addColorStop(0.5, mid);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2048, 2048);

  if (['sunny-morning', 'sunny-midday', 'sunny-high', 'sunny-bright', 'golden-hour', 'sunset-gold'].includes(lighting)) {
    const sunX = 400 + rand() * 600;
    const sunY = 300 + rand() * 200;
    const sunR = 160;
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3);
    sunGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    sunGradient.addColorStop(0.2, 'rgba(255, 238, 180, 0.65)');
    sunGradient.addColorStop(1, 'rgba(255, 180, 90, 0)');
    ctx.fillStyle = sunGradient;
    ctx.fillRect(sunX - sunR * 3, sunY - sunR * 3, sunR * 6, sunR * 6);
  }
}

function drawOcean(ctx, card, rand) {
  const yStart = 900;
  const gradient = ctx.createLinearGradient(0, yStart, 0, 2048);
  if (['blue-hour', 'torch-night'].includes(card.lighting)) {
    gradient.addColorStop(0, '#1a3358');
    gradient.addColorStop(0.5, '#11223d');
    gradient.addColorStop(1, '#0b1529');
  } else if (card.lighting === 'storm-glow') {
    gradient.addColorStop(0, '#3b4b67');
    gradient.addColorStop(0.5, '#1c293d');
    gradient.addColorStop(1, '#0a111e');
  } else if (card.lighting === 'emerald-noon') {
    gradient.addColorStop(0, '#3fd5c0');
    gradient.addColorStop(0.5, '#0fa88f');
    gradient.addColorStop(1, '#045d52');
  } else {
    gradient.addColorStop(0, '#4bc7f2');
    gradient.addColorStop(0.5, '#1897d2');
    gradient.addColorStop(1, '#045285');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, yStart, 2048, 450);

  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let i = 0; i < 12; i++) {
    const waveY = yStart + 40 + i * 20 + rand() * 60;
    ctx.beginPath();
    ctx.moveTo(-100, waveY);
    for (let x = 0; x <= 2148; x += 120) {
      ctx.quadraticCurveTo(x + 40, waveY + Math.sin(x / 180 + i) * (20 + rand() * 60), x + 120, waveY);
    }
    ctx.lineTo(2148, waveY + 40);
    ctx.lineTo(-100, waveY + 40);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSandOrGround(ctx, card, rand) {
  const scene = card.sceneType;
  ctx.save();
  switch (scene) {
    case 'Beach': {
      const sandGradient = ctx.createLinearGradient(0, 1200, 0, 2048);
      sandGradient.addColorStop(0, '#f8e4bd');
      sandGradient.addColorStop(1, '#d7b68e');
      ctx.fillStyle = sandGradient;
      ctx.beginPath();
      ctx.moveTo(-100, 1240);
      for (let x = 0; x <= 2148; x += 220) {
        ctx.quadraticCurveTo(x + 70, 1280 + Math.sin(x / 240) * 60 + rand() * 120, x + 220, 1350 + rand() * 80);
      }
      ctx.lineTo(2148, 2048);
      ctx.lineTo(-100, 2048);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'Islet':
    case 'Reef': {
      const reefGradient = ctx.createLinearGradient(0, 1200, 0, 2048);
      reefGradient.addColorStop(0, '#9ee0d5');
      reefGradient.addColorStop(1, '#4c8276');
      ctx.fillStyle = reefGradient;
      ctx.beginPath();
      ctx.moveTo(-100, 1240);
      for (let x = 0; x <= 2148; x += 240) {
        ctx.quadraticCurveTo(x + 120, 1200 + Math.cos(x / 160) * 120 + rand() * 80, x + 240, 1340 + rand() * 100);
      }
      ctx.lineTo(2148, 2048);
      ctx.lineTo(-100, 2048);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'Trail':
    case 'Viewpoint': {
      const pathGradient = ctx.createLinearGradient(0, 1200, 0, 2048);
      pathGradient.addColorStop(0, '#c8b58d');
      pathGradient.addColorStop(1, '#826953');
      ctx.fillStyle = pathGradient;
      ctx.fillRect(0, 1200, 2048, 848);
      ctx.fillStyle = 'rgba(72, 96, 62, 0.85)';
      ctx.beginPath();
      ctx.moveTo(0, 1200);
      for (let x = 0; x <= 2148; x += 400) {
        ctx.quadraticCurveTo(x + 160, 1180 - rand() * 120, x + 320, 1260 + rand() * 40);
      }
      ctx.lineTo(2148, 2048);
      ctx.lineTo(0, 2048);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'Waterfall': {
      const rockGradient = ctx.createLinearGradient(0, 1100, 0, 2048);
      rockGradient.addColorStop(0, '#54565f');
      rockGradient.addColorStop(1, '#2d2f38');
      ctx.fillStyle = rockGradient;
      ctx.fillRect(0, 1100, 2048, 948);
      break;
    }
    case 'Cave': {
      ctx.fillStyle = '#1a1210';
      ctx.fillRect(0, 1100, 2048, 948);
      break;
    }
    default:
      ctx.fillStyle = '#d7c8a9';
      ctx.fillRect(0, 1200, 2048, 848);
  }
  ctx.restore();
}

function drawGranite(ctx, rand, baseY, count = 5, scale = 1, colorA = '#918b82', colorB = '#6a5545') {
  for (let i = 0; i < count; i++) {
    const x = rand() * 2000;
    const width = (200 + rand() * 220) * scale;
    const height = (240 + rand() * 200) * scale;
    const gradient = ctx.createLinearGradient(x, baseY - height, x + width, baseY);
    gradient.addColorStop(0, lerpColor(colorA, '#ffffff', 0.1 * rand()));
    gradient.addColorStop(1, colorB);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x + width * 0.2, baseY - height * 0.8);
    ctx.lineTo(x + width * 0.6, baseY - height);
    ctx.lineTo(x + width, baseY);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPalms(ctx, rand, count = 4) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = 100 + rand() * 1800;
    const trunkTop = 700 + rand() * 150;
    ctx.strokeStyle = '#704c2b';
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.moveTo(x, 1400);
    ctx.quadraticCurveTo(x + rand() * 120 - 60, (1400 + trunkTop) / 2, x + rand() * 80 - 40, trunkTop);
    ctx.stroke();

    ctx.strokeStyle = '#1f6f3d';
    ctx.lineWidth = 14;
    for (let f = 0; f < 6; f++) {
      const angle = (Math.PI / 3) * f + rand() * 0.4;
      const length = 260 + rand() * 120;
      ctx.beginPath();
      ctx.moveTo(x, trunkTop);
      ctx.quadraticCurveTo(
        x + Math.cos(angle) * length * 0.6,
        trunkTop + Math.sin(angle) * length * 0.3,
        x + Math.cos(angle) * length,
        trunkTop + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawShip(ctx, rand, options = {}) {
  const baseY = options.baseY ?? 1000;
  const x = options.x ?? 300 + rand() * 600;
  const scale = options.scale ?? 1;
  ctx.save();
  ctx.translate(x, baseY);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#2b1d12';
  ctx.beginPath();
  ctx.moveTo(-140, 0);
  ctx.quadraticCurveTo(0, 80, 180, 0);
  ctx.lineTo(140, -40);
  ctx.quadraticCurveTo(0, 30, -160, -20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#503629';
  ctx.fillRect(-20, -260, 30, 260);
  ctx.fillRect(60, -240, 24, 240);
  const sailColors = ['#f7ede2', '#efe0c7', '#f9e8cd'];
  sailColors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-20 + idx * 40, -240 + idx * 20);
    ctx.lineTo(130 + idx * 20, -180 + idx * 30);
    ctx.lineTo(-20 + idx * 40, -120 + idx * 40);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

function drawAnchor(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#434343';
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(0, -160);
  ctx.lineTo(0, 80);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -200, 60, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-120, 80);
  ctx.quadraticCurveTo(0, 200, 120, 80);
  ctx.stroke();
  ctx.restore();
}

function drawRope(ctx, points, width = 16, color = '#c28b4d') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach(([x, y], idx) => {
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.restore();
}

function drawHat(ctx, x, y, scale = 1, color = '#231316') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-160, 0);
  ctx.quadraticCurveTo(0, -90, 160, 0);
  ctx.quadraticCurveTo(0, 70, -160, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3b2127';
  ctx.beginPath();
  ctx.moveTo(-120, -10);
  ctx.quadraticCurveTo(0, -120, 120, -10);
  ctx.lineTo(100, 40);
  ctx.quadraticCurveTo(0, -20, -100, 40);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCoins(ctx, rand, count, area) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = area.x + rand() * area.width;
    const y = area.y + rand() * area.height;
    const r = 32 + rand() * 16;
    const gradient = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    gradient.addColorStop(0, '#ffe7a1');
    gradient.addColorStop(0.7, '#d4a64f');
    gradient.addColorStop(1, '#9c6b21');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.75, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSkullEtch(ctx, x, y, scale = 1, color = 'rgba(30,20,20,0.7)') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.ellipse(0, 0, 120, 100, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-60, 30);
  ctx.lineTo(-60, 90);
  ctx.moveTo(60, 30);
  ctx.lineTo(60, 90);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-40, -20, 28, 0, Math.PI * 2);
  ctx.arc(40, -20, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawLantern(ctx, x, y, scale = 1, glowColor = '#ffdda1') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
  glow.addColorStop(0, 'rgba(255,218,150,0.7)');
  glow.addColorStop(1, 'rgba(255,218,150,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2d2620';
  ctx.lineWidth = 30;
  ctx.strokeRect(-70, -120, 140, 200);
  ctx.fillStyle = glowColor;
  ctx.fillRect(-60, -110, 120, 160);
  ctx.restore();
}

function drawParrot(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#2eb872';
  ctx.beginPath();
  ctx.ellipse(0, 0, 120, 200, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f44336';
  ctx.beginPath();
  ctx.ellipse(-40, -120, 90, 110, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.ellipse(60, -80, 60, 80, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(-20, -160, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff9800';
  ctx.beginPath();
  ctx.moveTo(-100, -120);
  ctx.lineTo(-150, -100);
  ctx.lineTo(-110, -70);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCompassRose(ctx, x, y, scale = 1, color = '#fbe6a4') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 24;
  ['N', 'E', 'S', 'W'].forEach((dir, idx) => {
    const angle = (Math.PI / 2) * idx;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 200, Math.sin(angle) * 200);
    ctx.stroke();
  });
  ctx.lineWidth = 10;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 70, Math.sin(angle) * 70);
    ctx.lineTo(Math.cos(angle) * 150, Math.sin(angle) * 150);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDagger(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#bcbcbc';
  ctx.beginPath();
  ctx.moveTo(0, -180);
  ctx.lineTo(50, 120);
  ctx.lineTo(-50, 120);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5c3a27';
  ctx.fillRect(-40, 120, 80, 60);
  ctx.restore();
}

function drawChest(ctx, x, y, scale = 1, open = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#5a381d';
  ctx.fillRect(-160, -80, 320, 200);
  ctx.fillStyle = '#7d4a23';
  ctx.fillRect(-160, -80, 320, 40);
  ctx.strokeStyle = '#d4a54b';
  ctx.lineWidth = 20;
  ctx.strokeRect(-160, -80, 320, 200);
  if (open) {
    ctx.fillStyle = '#af7e3c';
    ctx.beginPath();
    ctx.moveTo(-160, -80);
    ctx.lineTo(0, -220);
    ctx.lineTo(160, -80);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawWaterfall(ctx, rand) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  for (let i = 0; i < 6; i++) {
    const x = 250 + rand() * 1600;
    ctx.beginPath();
    ctx.moveTo(x, 500);
    ctx.quadraticCurveTo(x + rand() * 60 - 30, 1100, x + rand() * 40, 1620);
    ctx.lineTo(x + 160, 1620);
    ctx.quadraticCurveTo(x + 120, 1100, x + 200, 500);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawMangroves(ctx, rand) {
  ctx.save();
  ctx.strokeStyle = '#2c4735';
  ctx.lineWidth = 28;
  for (let i = 0; i < 6; i++) {
    const x = 200 + rand() * 1600;
    ctx.beginPath();
    ctx.moveTo(x, 1200);
    ctx.quadraticCurveTo(x + rand() * 140 - 70, 920, x + rand() * 180 - 90, 760);
    ctx.stroke();
    ctx.strokeStyle = '#426a51';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(x, 760);
    ctx.lineTo(x + rand() * 120 - 60, 640);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStoneDoor(ctx) {
  ctx.save();
  ctx.fillStyle = '#3a2e2a';
  ctx.beginPath();
  ctx.moveTo(600, 1250);
  ctx.lineTo(600, 1800);
  ctx.lineTo(1448, 1800);
  ctx.lineTo(1448, 1250);
  ctx.quadraticCurveTo(1024, 960, 600, 1250);
  ctx.fill();
  ctx.strokeStyle = '#d7ab6f';
  ctx.lineWidth = 24;
  ctx.stroke();
  ctx.fillStyle = 'rgba(215,171,111,0.12)';
  ctx.beginPath();
  ctx.moveTo(820, 1500);
  ctx.quadraticCurveTo(1024, 1340, 1228, 1500);
  ctx.lineTo(1228, 1700);
  ctx.quadraticCurveTo(1024, 1580, 820, 1700);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawElements(ctx, card, rand) {
  const e = card.elements;
  if (e.includes('granite') || e.includes('graniteTeeth') || e.includes('pinkGranite')) {
    const colorA = e.includes('pinkGranite') ? '#d4a9a2' : '#a9a49c';
    const colorB = e.includes('pinkGranite') ? '#8c6a63' : '#5b4a3d';
    drawGranite(ctx, rand, 1500, 6, 1.1, colorA, colorB);
  }
  if (['Beach', 'Reef', 'Islet'].includes(card.sceneType) && e.includes('palms')) drawPalms(ctx, rand, 5);
  if (e.includes('ship')) drawShip(ctx, rand, { baseY: 900, x: 300 + rand() * 600, scale: 0.8 });
  if (e.includes('anchor')) drawAnchor(ctx, 580, 1460, 0.9);
  if (e.includes('rope')) drawRope(ctx, [[400, 1500], [600, 1600], [850, 1680], [1100, 1740]]);
  if (e.includes('hat') || e.includes('tricornHat')) drawHat(ctx, 920, 1600, 1.1);
  if (e.includes('coins') || e.includes('coinsDust')) drawCoins(ctx, rand, 12, { x: 1100, y: 1550, width: 700, height: 350 });
  if (e.includes('skullSand') || e.includes('skullEtch')) drawSkullEtch(ctx, 500, 1500, 0.9, 'rgba(30,20,20,0.65)');
  if (e.includes('torch') || e.includes('lanterns')) drawLantern(ctx, 380, 1180, 1.4);
  if (e.includes('lantern')) drawLantern(ctx, 1600, 1180, 1.2);
  if (e.includes('parrot') || e.includes('parrotSilhouette')) drawParrot(ctx, 1500, 1160, 0.9);
  if (e.includes('compassRose') || e.includes('compassChalk')) drawCompassRose(ctx, 1240, 1480, 0.8);
  if (e.includes('daggerFeather') || e.includes('daggerMap')) drawDagger(ctx, 860, 1300, 1.0);
  if (e.includes('chestCorner') || e.includes('smallChest')) drawChest(ctx, 520, 1520, 0.8, e.includes('smallChest'));
  if (e.includes('waterfall') || e.includes('waterfallBars')) drawWaterfall(ctx, rand);
  if (e.includes('mangroveRoots')) drawMangroves(ctx, rand);
  if (e.includes('stoneDoor')) drawStoneDoor(ctx);

  if (e.includes('ropeLoop')) drawRope(ctx, [[1500, 1600], [1650, 1520], [1740, 1620], [1570, 1680], [1480, 1620]], 22);
  if (e.includes('ropeArc')) drawRope(ctx, [[600, 1500], [800, 1380], [1000, 1360], [1220, 1480]], 20, '#d1a25c');
  if (e.includes('ropePointer')) drawRope(ctx, [[900, 1500], [1080, 1440], [1340, 1420], [1550, 1360]], 18, '#d1a25c');

  if (e.includes('driftwoodCross')) {
    ctx.save();
    ctx.strokeStyle = '#5d3d2d';
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.moveTo(780, 1520);
    ctx.lineTo(940, 1380);
    ctx.moveTo(880, 1360);
    ctx.lineTo(780, 1480);
    ctx.stroke();
    ctx.restore();
  }

  if (e.includes('ropeLadder')) drawRope(ctx, [[420, 1400], [520, 1300], [620, 1180], [720, 1060]], 18, '#b8864c');

  if (e.includes('lanternGlow')) drawLantern(ctx, 820, 1200, 1.1);

  if (e.includes('markerStone')) {
    ctx.save();
    ctx.fillStyle = '#877b6f';
    ctx.beginPath();
    ctx.moveTo(700, 1500);
    ctx.lineTo(880, 1260);
    ctx.lineTo(1020, 1500);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (e.includes('featherBay') || e.includes('daggerFeather')) {
    ctx.save();
    ctx.fillStyle = '#f3d55b';
    ctx.beginPath();
    ctx.moveTo(1040, 1400);
    ctx.quadraticCurveTo(1200, 1300, 1340, 1440);
    ctx.quadraticCurveTo(1180, 1480, 1040, 1400);
    ctx.fill();
    ctx.restore();
  }

  if (e.includes('mapScrap') || e.includes('parchmentPalm')) {
    ctx.save();
    ctx.fillStyle = 'rgba(238, 214, 168, 0.85)';
    ctx.beginPath();
    ctx.moveTo(1280, 1260);
    ctx.lineTo(1500, 1200);
    ctx.lineTo(1600, 1320);
    ctx.lineTo(1400, 1420);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (e.includes('shipHorizon')) drawShip(ctx, rand, { baseY: 940, x: 1500, scale: 0.6 });

  if (e.includes('shipLights')) {
    ctx.save();
    ctx.fillStyle = '#ffd089';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(1460 + i * 80, 980 - i * 10, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (e.includes('vistaLights')) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,218,120,0.65)';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(200 + rand() * 1500, 1120 + rand() * 200, 12 + rand() * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (e.includes('tidePoolStars')) {
    ctx.save();
    ctx.fillStyle = '#fff8d5';
    ctx.beginPath();
    ctx.arc(620, 1400, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9dd3ff';
    ctx.beginPath();
    ctx.arc(620, 1400, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(560, 1380, 12, 0, Math.PI * 2);
    ctx.arc(660, 1420, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (e.includes('coralDegree')) {
    ctx.save();
    ctx.strokeStyle = '#ffeab0';
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.circle?.(820, 1400, 160);
    if (!ctx.circle) {
      ctx.arc(820, 1400, 160, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();
  }

  if (e.includes('reefChart')) {
    ctx.save();
    ctx.strokeStyle = '#f4e1c1';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(960, 1180);
    ctx.lineTo(1320, 1240);
    ctx.lineTo(1200, 1340);
    ctx.lineTo(1440, 1420);
    ctx.stroke();
    ctx.restore();
  }

  if (e.includes('sixStars') || e.includes('sevenStars') || e.includes('starPricks')) {
    ctx.save();
    ctx.fillStyle = '#f8f0d8';
    const starCount = e.includes('sevenStars') ? 7 : e.includes('sixStars') ? 6 : 5;
    for (let i = 0; i < starCount; i++) {
      const angle = (Math.PI * 2 * i) / starCount;
      const radius = 300;
      const x = 1200 + Math.cos(angle) * radius;
      const y = 600 + Math.sin(angle) * radius * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (e.includes('coinsDust')) drawCoins(ctx, rand, 18, { x: 800, y: 1500, width: 1000, height: 400 });
}

function addAtmosphere(ctx, card, rand) {
  ctx.save();
  if (['golden-hour', 'sunset-gold', 'sunset', 'sunshafts'].includes(card.lighting)) {
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(255, 196, 120, 0.18)';
    ctx.fillRect(0, 0, 2048, 2048);
  }
  if (card.lighting === 'storm-glow') {
    ctx.fillStyle = 'rgba(70, 80, 110, 0.18)';
    ctx.fillRect(0, 0, 2048, 2048);
  }
  if (card.lighting === 'mist-glow') {
    ctx.fillStyle = 'rgba(180, 200, 210, 0.22)';
    ctx.fillRect(0, 200, 2048, 1600);
  }
  if (card.lighting === 'torch-night') {
    ctx.fillStyle = 'rgba(40, 22, 12, 0.35)';
    ctx.fillRect(0, 400, 2048, 1600);
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = 'rgba(32, 32, 32, 0.12)';
  for (let i = 0; i < 80; i++) {
    ctx.beginPath();
    ctx.arc(rand() * 2200 - 100, rand() * 2200 - 100, rand() * 90 + 20, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function addTitleBar(ctx, card) {
  ctx.save();
  ctx.fillStyle = 'rgba(8, 12, 18, 0.65)';
  ctx.fillRect(0, 1780, 2048, 268);
  ctx.fillStyle = '#f9edcf';
  ctx.font = '64px "Pirata One", "Cinzel", serif';
  ctx.fillText(`${card.code} — ${card.title}`, 120, 1890);
  ctx.font = '42px "Inter", sans-serif';
  ctx.fillText(`${card.place} · ${card.timeOfDay} · ${card.rarity}`, 120, 1960);
  ctx.restore();
}

function renderCard(card) {
  const canvas = createCanvas(2048, 2048);
  const ctx = canvas.getContext('2d');
  const rand = seededRandom(card.index * 19);

  drawSky(ctx, card, rand);
  drawOcean(ctx, card, rand);
  drawSandOrGround(ctx, card, rand);
  drawElements(ctx, card, rand);
  addAtmosphere(ctx, card, rand);
  addTitleBar(ctx, card);

  return canvas;
}

function buildMetadata(card) {
  const description = `${card.title}. Chapter III — The Pirate’s Trail. Clue: ${card.clue}`;
  const attributes = [
    { trait_type: 'Chapter', value: 'III — The Pirate’s Trail' },
    { trait_type: 'Place', value: card.place },
    { trait_type: 'TimeOfDay', value: card.timeOfDay },
    { trait_type: 'SceneType', value: card.sceneType },
    { trait_type: 'Symbol', value: SYMBOL_MAP[card.symbol] || card.symbol },
    { trait_type: 'Rarity', value: card.rarity }
  ];
  return {
    name: `${card.code} — ${card.title}`,
    description,
    image: `/preview/chapter3/${card.code}.png`,
    attributes,
    clue: card.clue
  };
}

async function saveOutputs(canvas, card) {
  const imgPath = path.join(IMG_DIR, `${card.code}.png`);
  const metaPath = path.join(META_DIR, `${card.code}.json`);
  fs.writeFileSync(imgPath, canvas.toBuffer('image/png'));
  fs.writeFileSync(metaPath, JSON.stringify(buildMetadata(card), null, 2));
}

async function generateContactSheet(cards) {
  const columns = 5;
  const rows = 4;
  const cellSize = 512;
  const sheet = createCanvas(columns * cellSize, rows * cellSize);
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#0c1018';
  ctx.fillRect(0, 0, sheet.width, sheet.height);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const imgPath = path.join(IMG_DIR, `${card.code}.png`);
    const image = await loadImage(imgPath);
    const col = i % columns;
    const row = Math.floor(i / columns);
    ctx.drawImage(image, col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(col * cellSize, row * cellSize + cellSize - 68, cellSize, 68);
    ctx.fillStyle = '#f5e6c8';
    ctx.font = '28px "Pirata One", serif';
    ctx.fillText(card.code, col * cellSize + 16, row * cellSize + cellSize - 28);
  }

  const contactPath = path.join(PREVIEW_DIR, 's3_contact.png');
  fs.writeFileSync(contactPath, sheet.toBuffer('image/png'));
}

async function main() {
  console.log('🎨 Generating Chapter III — The Pirate’s Trail previews (NO MINT)...');
  for (const card of cards) {
    const canvas = renderCard(card);
    await saveOutputs(canvas, card);
    console.log(`✅ Rendered ${card.code} (${card.title})`);
  }
  await generateContactSheet(cards);
  console.log('🖼️ Contact sheet ready at dist/previews/s3_contact.png');
  console.log('🚫 Reminder: No minting performed. Awaiting approval.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { cards, main };
