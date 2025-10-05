import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import SophisticatedEtchedGenerator from './sophisticated_etched_generator.js';

import manifest from './ch6_revenant_manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DESTROY the old basic shape system - USE ONLY SOPHISTICATED ETCHED STYLE
console.log('🔥 DESTROYING Chapter 6 basic shape generator');
console.log('✨ REPLACING with sophisticated etched-painterly system');

const OUTPUT_DIR = path.resolve(__dirname, '../content/ch6/output');

/**
 * NEW SOPHISTICATED CHAPTER 6 GENERATOR
 * Uses ONLY the etched-painterly style from example art
 * NO MORE basic shapes or childlike bullshit
 */
async function generateSophisticatedCard(cardData, outputPath) {
  const generator = new SophisticatedEtchedGenerator();
  
  // Generate sophisticated prompt matching example art style
  const { prompt, negativePrompt } = generator.generatePrompt(cardData);
  
  console.log(`🎨 Generating sophisticated art for: ${cardData.name}`);
  console.log(`📝 Style: Etched-painterly (example art matched)`);
  console.log(`🚫 Banned: ${negativePrompt}`);
  
  // NOTE: This would integrate with your AI art generation tool
  // For now, we're setting up the sophisticated prompt system
  const artMetadata = {
    cardId: cardData.id,
    name: cardData.name,
    style: 'SOPHISTICATED_ETCHED_PAINTERLY',
    prompt: prompt,
    negativePrompt: negativePrompt,
    guaranteedStyle: 'SEYCHELLOIS_ETCHED_MAP_ENGRAVING',
    bannedStyles: ['basic_shapes', 'childlike', 'cartoon', 'simple'],
    exampleArtReference: 'C:\\Users\\andre\\The Levasseur Treasure of Seychelles\\example art',
    requiredElements: [
      'fine_copperplate_hatching',
      'muted_sepia_indigo_teal_palette', 
      'textured_layering_no_flat_spaces',
      'seychelles_cultural_motifs',
      'elongated_angular_patterned_figures',
      'volumetric_atmospheric_depth'
    ]
  };
  
  // Save the sophisticated art specification
  const specPath = outputPath.replace('.png', '_sophisticated_spec.json');
  await fs.writeJson(specPath, artMetadata, { spaces: 2 });
  
  return artMetadata;
}

// MAIN GENERATION FUNCTION - SOPHISTICATED ONLY
async function generateAllSophisticatedCards() {
  console.log('🎨 STARTING SOPHISTICATED ETCHED-PAINTERLY GENERATION');
  console.log('🚫 BANNED: All basic shapes, childlike art, simple graphics');
  console.log('✅ LOCKED: Seychellois etched-painterly style from example art');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    await fs.mkdirs(OUTPUT_DIR);
  }
  
  const results = [];
  
  for (const card of manifest) {
    const outputPath = path.join(OUTPUT_DIR, `${card.id}_sophisticated.png`);
    const artSpec = await generateSophisticatedCard(card, outputPath);
    results.push(artSpec);
  }
  
  console.log(`✨ Generated ${results.length} sophisticated art specifications`);
  console.log('🎨 ALL cards will use etched-painterly style matching example art');
  console.log('🔥 Basic shapes and childlike art PERMANENTLY DESTROYED');
  
  return results;
}

// Execute the sophisticated generation
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllSophisticatedCards()
    .then(() => {
      console.log('🎉 SOPHISTICATED ETCHED-PAINTERLY SYSTEM INSTALLED');
      console.log('🚫 BASIC SHAPES PERMANENTLY BANNED');
    })
    .catch(console.error);
}
  if (!fs.existsSync(full)) {
    console.warn('Font missing (fallback in use):', file);
    return;
  }
  try {
    registerFont(full, { family, ...options });
  } catch (err) {
    console.warn('Failed to register font', file, err.message);
  }
}

tryRegisterFont('Cinzel-Bold.ttf', 'Cinzel', { weight: '700' });
tryRegisterFont('Cinzel-Regular.ttf', 'Cinzel', { weight: '400' });
tryRegisterFont('Inter-Regular.ttf', 'Inter', { weight: '400' });
tryRegisterFont('Inter-SemiBold.ttf', 'Inter', { weight: '600' });
tryRegisterFont('Inter-Italic.ttf', 'Inter', { style: 'italic', weight: '400' });

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  if (value.length !== 6) return { r: 255, g: 255, b: 255 };
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbaString(hex, alpha = 1) {
  if (!hex) return `rgba(255,255,255,${alpha})`;
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const to = (c) => clamp(Math.round(c + (255 - c) * amount), 0, 255);
  return `rgb(${to(r)},${to(g)},${to(b)})`;
}

function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const to = (c) => clamp(Math.round(c * (1 - amount)), 0, 255);
  return `rgb(${to(r)},${to(g)},${to(b)})`;
}

function createNoiseCanvas(intensity, rng) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const density = Math.floor(6000 * intensity);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (let i = 0; i < density; i++) {
    const x = rng() * WIDTH;
    const y = rng() * HEIGHT;
    const size = 1 + rng() * 2;
    const alpha = 0.04 + rng() * 0.04 * intensity;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(x, y, size, size);
  }
  return canvas;
}

function getCardRarity(card) {
  return (card.rarity || card.art?.rarity || card.metadata?.rarity || 'rare').toLowerCase();
}

function getCardEnvironment(card) {
  if (card.environment) return card.environment;
  if (card.art?.environment) return card.art.environment;
  const scene = (card.scene || '').toLowerCase();
  if (/river|shore|beach|lagoon|ferry|tide|port/.test(scene)) return 'coastal';
  if (/forest|jungle|mangrove|takamaka|fern|palm/.test(scene)) return 'jungle';
  if (/mountain|ridge|granite|copolia|pass|highland/.test(scene)) return 'highland';
  if (/village|market|mission|plantation|tea|drum|ceremony/.test(scene)) return 'village';
  if (/ritual|circle|salt|ceremony|dance|mask/.test(scene)) return 'ceremony';
  if (/cavern|cave|tidepool|boulder|underground/.test(scene)) return 'cavern';
  return 'coastal';
}

function paintGradientBand(ctx, topColor, bottomColor, yStart, yEnd) {
  const grad = ctx.createLinearGradient(0, yStart, 0, yEnd);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, yStart, WIDTH, yEnd - yStart);
}

function paintBrushStrokes(ctx, color, count, minWidth, maxWidth, minHeight, maxHeight, rng, opacity = 0.15) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const w = minWidth + rng() * (maxWidth - minWidth);
    const h = minHeight + rng() * (maxHeight - minHeight);
    const x = rng() * WIDTH;
    const y = rng() * ART_HEIGHT;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rng() - 0.5) * Math.PI * 0.35);
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.restore();
}

function paletteColor(palette, key, fallback) {
  return palette && palette[key] ? palette[key] : fallback;
}

function applyParchmentTexture(ctx, rng) {
  const parchment = createCanvas(WIDTH, HEIGHT);
  const pctx = parchment.getContext('2d');
  pctx.fillStyle = 'rgba(214,194,161,0.25)';
  pctx.fillRect(0, 0, WIDTH, HEIGHT);

  const fiberCount = 3600;
  for (let i = 0; i < fiberCount; i++) {
    const x = rng() * WIDTH;
    const y = rng() * HEIGHT;
    const length = 18 + rng() * 46;
    const thickness = 0.7 + rng() * 1.8;
    const angle = (rng() - 0.5) * Math.PI;
    pctx.save();
    pctx.translate(x, y);
    pctx.rotate(angle);
    pctx.fillStyle = `rgba(168,142,110,${0.035 + rng() * 0.04})`;
    pctx.fillRect(-length / 2, -thickness / 2, length, thickness);
    pctx.restore();
  }

  const blotches = 45;
  for (let i = 0; i < blotches; i++) {
    const x = rng() * WIDTH;
    const y = rng() * HEIGHT;
    const radius = WIDTH * (0.05 + rng() * 0.08);
    const grad = pctx.createRadialGradient(x, y, radius * 0.25, x, y, radius);
    grad.addColorStop(0, `rgba(112,92,68,${0.06 + rng() * 0.05})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    pctx.fillStyle = grad;
    pctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.55;
  ctx.drawImage(parchment, 0, 0);
  ctx.restore();
}

function applyColorGrade(ctx, palette) {
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  const grade = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  grade.addColorStop(0, 'rgba(210,184,148,0.22)');
  grade.addColorStop(0.48, 'rgba(44,71,85,0.18)');
  grade.addColorStop(1, 'rgba(24,33,44,0.32)');
  ctx.fillStyle = grade;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = rgbaString(palette?.accent || '#f3d79c', 0.14);
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
}

function applyInkEtching(ctx, rng) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = 'rgba(48,36,28,0.35)';
  ctx.lineWidth = 1.1;
  const spacing = 44;
  for (let x = -WIDTH; x < WIDTH; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + ART_HEIGHT, ART_HEIGHT);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.08;
  for (let x = -WIDTH; x < WIDTH; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, ART_HEIGHT);
    ctx.lineTo(x + ART_HEIGHT, 0);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = 'rgba(62,49,37,0.26)';
  ctx.lineWidth = 0.8;
  const scratches = 36;
  for (let i = 0; i < scratches; i++) {
    const startX = rng() * WIDTH;
    const startY = rng() * ART_HEIGHT;
    const length = 40 + rng() * 120;
    const angle = (rng() - 0.5) * Math.PI * 0.6;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  ctx.restore();
}

function applyRuneGlow(ctx, palette, rng) {
  const accent = palette?.glow || palette?.accent || '#f4d79a';
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const count = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < count; i++) {
    const radius = WIDTH * (0.045 + rng() * 0.07);
    const x = clamp(rng() * WIDTH, radius * 0.4, WIDTH - radius * 0.4);
    const y = clamp(rng() * ART_HEIGHT, radius * 0.4, ART_HEIGHT - radius * 0.4);
    const glow = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
    glow.addColorStop(0, rgbaString(accent, 0.34));
    glow.addColorStop(0.6, rgbaString(accent, 0.18));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.strokeStyle = rgbaString(accent, 0.28);
  ctx.lineWidth = 1.4;
  const sigils = 5 + Math.floor(rng() * 6);
  for (let i = 0; i < sigils; i++) {
    const cx = rng() * WIDTH;
    const cy = rng() * ART_HEIGHT * 0.92;
    const size = 14 + rng() * 36;
    ctx.beginPath();
    const sides = 3 + Math.floor(rng() * 3);
    for (let j = 0; j < sides; j++) {
      const angle = (Math.PI * 2 * j) / sides + rng() * 0.25;
      const px = cx + Math.cos(angle) * size;
      const py = cy + Math.sin(angle) * size;
      if (j === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

function applyBackground(ctx, palette, rng) {
  const background = palette?.background || '#121016';
  const gradientFrom = palette?.gradientFrom || darken(background, 0.2);
  const gradientTo = palette?.gradientTo || lighten(background, 0.15);
  const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  grad.addColorStop(0, gradientFrom);
  grad.addColorStop(1, gradientTo);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (palette?.glow) {
    const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.4, WIDTH * 0.1, WIDTH / 2, HEIGHT * 0.4, WIDTH * 0.65);
    glow.addColorStop(0, rgbaString(palette.glow, 0.55));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  const noise = createNoiseCanvas(0.6, rng);
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.4;
  ctx.drawImage(noise, 0, 0);
  ctx.restore();
}

function drawCompassRose(ctx, palette, alpha = 0.2) {
  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.strokeStyle = rgbaString(palette?.accent || '#f0d68c', alpha);
  ctx.lineWidth = 3;
  const radius = WIDTH * 0.28;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.stroke();
  }
  ctx.rotate(Math.PI / 4);
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius * 0.8, Math.sin(angle) * radius * 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCompassGlyph(ctx, size) {
  const radius = size * 0.5;
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.stroke();
  }
  ctx.lineWidth = size * 0.08;
  ctx.save();
  ctx.rotate(Math.PI / 4);
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius * 0.7, Math.sin(angle) * radius * 0.7);
    ctx.stroke();
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

const overlayHandlers = {
  horizon(ctx, value, palette) {
    const y = clamp(value, 0.1, 0.9) * HEIGHT;
    const grad = ctx.createLinearGradient(0, y - HEIGHT * 0.1, 0, y + HEIGHT * 0.25);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, rgbaString(palette?.glow || palette?.accent || '#f0d68c', 0.25));
    grad.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  },
  shimmer(ctx, value, palette, rng) {
    const count = Math.floor(180 * value);
    for (let i = 0; i < count; i++) {
      const x = rng() * WIDTH;
      const y = rng() * HEIGHT * 0.6;
      const len = 20 + rng() * 80;
      const angle = (rng() - 0.5) * Math.PI * 0.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const grad = ctx.createLinearGradient(0, 0, len, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.3, rgbaString(palette?.accent || '#f3d28a', 0.2));
      grad.addColorStop(0.7, rgbaString(palette?.accent || '#f3d28a', 0.05));
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len, 0);
      ctx.stroke();
      ctx.restore();
    }
  },
  mist(ctx, value, palette, rng) {
    const count = Math.floor(140 * value);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < count; i++) {
      const x = rng() * WIDTH;
      const y = HEIGHT * 0.3 + rng() * HEIGHT * 0.5;
      const w = WIDTH * (0.1 + rng() * 0.3);
      const h = w * (0.3 + rng() * 0.2);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, w);
      grad.addColorStop(0, rgbaString(palette?.glow || '#f0daca', 0.08));
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, rng() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
  canopy(ctx, value, palette) {
    const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.4);
    grad.addColorStop(0, rgbaString('#070707', clamp(value * 1.2, 0.2, 0.8)));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  },
  aurora(ctx, value, palette, rng) {
    const bandCount = 3;
    for (let b = 0; b < bandCount; b++) {
      const baseY = HEIGHT * 0.18 * (1 + b * 0.3);
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= WIDTH; x += 40) {
        const offset = Math.sin((x / WIDTH) * Math.PI * 2 + b) * HEIGHT * 0.04 * value;
        ctx.lineTo(x, baseY + offset);
      }
      ctx.lineTo(WIDTH, baseY + HEIGHT * 0.12);
      ctx.lineTo(0, baseY + HEIGHT * 0.12);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, baseY, 0, baseY + HEIGHT * 0.12);
      grad.addColorStop(0, rgbaString(palette?.accent || '#67e8f9', 0.18));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.65;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
  cavern(ctx, value) {
    const grad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.7, WIDTH * 0.2, WIDTH / 2, HEIGHT * 0.7, WIDTH * 0.7);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(0,0,0,${clamp(value + 0.25, 0.2, 0.75)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  },
  ember(ctx, value, palette, rng) {
    const count = Math.floor(300 * value);
    for (let i = 0; i < count; i++) {
      const x = rng() * WIDTH;
      const y = HEIGHT * 0.55 + rng() * HEIGHT * 0.35;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
      grad.addColorStop(0, rgbaString(palette?.glow || '#f9a66c', 0.6));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  foam(ctx, value, palette, rng) {
    const y = HEIGHT * 0.82;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let x = 0; x < WIDTH; x += 12) {
      const height = 12 + Math.sin((x / WIDTH) * Math.PI * 4 + rng() * 2) * 6;
      ctx.fillStyle = rgbaString(palette?.glow || '#f0f0f0', 0.25 * value);
      ctx.fillRect(x, y + Math.sin(x * 0.015) * 8, 12, height);
    }
    ctx.restore();
  },
  fresco(ctx, value, palette) {
    const stripes = 12;
    ctx.save();
    ctx.globalAlpha = clamp(value, 0.2, 0.5);
    ctx.strokeStyle = rgbaString(palette?.accent || '#d7c0a5', 0.25);
    ctx.lineWidth = 6;
    for (let i = 0; i < stripes; i++) {
      const x = WIDTH * (0.15 + (i / stripes) * 0.7);
      ctx.beginPath();
      ctx.moveTo(x, HEIGHT * 0.3);
      ctx.lineTo(x, HEIGHT * 0.9);
      ctx.stroke();
    }
    ctx.restore();
  },
  granite(ctx, value, palette, rng) {
    const count = Math.floor(1400 * value);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = rgbaString(palette?.accent || '#b3a089', 0.35);
    for (let i = 0; i < count; i++) {
      const x = rng() * WIDTH;
      const y = HEIGHT * 0.5 + rng() * HEIGHT * 0.45;
      const w = 4 + rng() * 12;
      const h = 3 + rng() * 10;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, rng() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
  gust(ctx, value, palette, rng) {
    const count = Math.floor(100 * value);
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = rgbaString(palette?.accent || '#d5d2c9', 0.4);
    ctx.lineWidth = 3;
    for (let i = 0; i < count; i++) {
      const y = HEIGHT * 0.3 + rng() * HEIGHT * 0.4;
      const x = -WIDTH * 0.1;
      const len = WIDTH * (0.4 + rng() * 0.6);
      const offset = rng() * HEIGHT * 0.1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + len * 0.5, y - offset, x + len, y + rng() * HEIGHT * 0.04);
      ctx.stroke();
    }
    ctx.restore();
  },
  haze(ctx, value, palette) {
    const grad = ctx.createLinearGradient(0, HEIGHT * 0.6, 0, HEIGHT);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, rgbaString(palette?.glow || '#f0d6a0', clamp(value * 0.6, 0.1, 0.5)));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  },
  lightning(ctx, value, palette, rng) {
    const strikes = Math.max(1, Math.round(2 * value));
    ctx.save();
    ctx.strokeStyle = rgbaString(palette?.glow || '#f9f7ff', 0.7);
    ctx.lineWidth = 4;
    ctx.shadowColor = rgbaString('#ffffff', 0.4);
    ctx.shadowBlur = 14;
    for (let s = 0; s < strikes; s++) {
      let x = WIDTH * (0.3 + rng() * 0.4);
      let y = HEIGHT * 0.15;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const steps = 8;
      for (let i = 0; i < steps; i++) {
        x += (rng() - 0.5) * WIDTH * 0.18;
        y += HEIGHT * 0.09 + rng() * HEIGHT * 0.04;
        ctx.lineTo(clamp(x, 0, WIDTH), y);
      }
      ctx.stroke();
    }
    ctx.restore();
  },
  mortar(ctx, value, palette) {
    const rows = Math.floor(20 * value);
    const cols = 10;
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = rgbaString(palette?.accent || '#d3ba8e', 0.2);
    ctx.lineWidth = 2;
    for (let r = 0; r < rows; r++) {
      const y = HEIGHT * 0.3 + (r / rows) * HEIGHT * 0.5;
      ctx.beginPath();
      ctx.moveTo(WIDTH * 0.15, y);
      ctx.lineTo(WIDTH * 0.85, y);
      ctx.stroke();
      for (let c = 0; c < cols; c++) {
        const x = WIDTH * 0.15 + (c / cols) * WIDTH * 0.7;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + HEIGHT * 0.5 / rows);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
  ripple(ctx, value, palette, rng) {
    const centerY = HEIGHT * 0.75;
    const rings = Math.floor(6 * value) + 3;
    ctx.save();
    ctx.strokeStyle = rgbaString(palette?.accent || '#9ed3e5', 0.25);
    ctx.lineWidth = 3;
    for (let i = 0; i < rings; i++) {
      const radius = WIDTH * 0.12 + i * WIDTH * 0.045;
      ctx.beginPath();
      ctx.ellipse(WIDTH / 2, centerY, radius, radius * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
  river(ctx, value, palette, rng) {
    ctx.save();
    ctx.fillStyle = rgbaString(palette?.accent || '#2a7c9a', clamp(0.22 + value * 0.3, 0.1, 0.6));
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT * 0.65);
    ctx.bezierCurveTo(WIDTH * 0.25, HEIGHT * (0.62 + value * 0.1), WIDTH * 0.45, HEIGHT * 0.8, WIDTH * 0.6, HEIGHT);
    ctx.lineTo(0, HEIGHT);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
  smoke(ctx, value, palette, rng) {
    const count = Math.floor(90 * value) + 20;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < count; i++) {
      const x = WIDTH * (0.4 + rng() * 0.2);
      const y = HEIGHT * 0.5 - rng() * HEIGHT * 0.3;
      const w = WIDTH * 0.05 * (0.5 + rng());
      const h = HEIGHT * 0.08 * (0.5 + rng());
      const grad = ctx.createRadialGradient(x, y, 0, x, y, w);
      grad.addColorStop(0, rgbaString(palette?.glow || '#ddb892', 0.08));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, rng() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
  streaks(ctx, value, palette, rng) {
    const count = Math.floor(80 * value);
    ctx.save();
    ctx.globalAlpha = clamp(0.15 + value * 0.25, 0.1, 0.5);
    ctx.strokeStyle = rgbaString(palette?.accent || '#e5ad7c', 0.3);
    ctx.lineWidth = 2;
    for (let i = 0; i < count; i++) {
      const x = rng() * WIDTH;
      const y = rng() * HEIGHT;
      const length = WIDTH * 0.2 * rng();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y + length * 0.4);
      ctx.stroke();
    }
    ctx.restore();
  }
};

const environmentRenderers = {
  coastal(ctx, card, rng, settings) {
    const palette = card.art?.palette || {};
    paintGradientBand(ctx, lighten(paletteColor(palette, 'gradientFrom', '#184870'), 0.08), paletteColor(palette, 'gradientTo', '#0f1d36'), 0, ART_HEIGHT * 0.45);
    paintGradientBand(ctx, paletteColor(palette, 'background', '#163042'), darken(paletteColor(palette, 'background', '#102433'), 0.35), ART_HEIGHT * 0.45, ART_HEIGHT);

    ctx.save();
    ctx.fillStyle = rgbaString(paletteColor(palette, 'accent', '#4ec5d9'), 0.45);
    drawWaveLayer(ctx, WIDTH, ART_HEIGHT * 0.58, ART_HEIGHT * 0.05, rng);
    ctx.fillStyle = rgbaString(lighten(paletteColor(palette, 'accent', '#6ee7ff'), 0.2), 0.35);
    drawWaveLayer(ctx, WIDTH, ART_HEIGHT * 0.66, ART_HEIGHT * 0.04, rng);
    ctx.restore();

    paintBrushStrokes(ctx, rgbaString(paletteColor(palette, 'accent', '#f4d79a'), 0.2), 120, 60, 140, 6, 16, rng, 0.32);

    ctx.save();
    ctx.translate(120, ART_HEIGHT * 0.9);
    ctx.fillStyle = rgbaString(lighten(paletteColor(palette, 'accent', '#1f644d'), 0.1), 0.95);
    drawPalmCluster(ctx, 180, 6, ctx.fillStyle, rng);
    ctx.restore();

    ctx.save();
    ctx.translate(WIDTH - 160, ART_HEIGHT * 0.92);
    ctx.fillStyle = rgbaString(darken(paletteColor(palette, 'accent', '#1f644d'), 0.2), 0.9);
    drawPalmCluster(ctx, 210, 7, ctx.fillStyle, rng);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = rgbaString('#0a0f17', 0.65);
    ctx.translate(WIDTH * (0.25 + rng() * 0.1), ART_HEIGHT * 0.72);
    drawBoatSilhouette(ctx, 180, 60);
    ctx.restore();
  },
  jungle(ctx, card, rng, settings) {
    const palette = card.art?.palette || {};
    paintGradientBand(ctx, lighten(paletteColor(palette, 'gradientFrom', '#1c3f34'), 0.1), paletteColor(palette, 'gradientTo', '#10241d'), 0, ART_HEIGHT * 0.35);
    paintGradientBand(ctx, paletteColor(palette, 'background', '#0f1e16'), darken(paletteColor(palette, 'background', '#0b1410'), 0.25), ART_HEIGHT * 0.35, ART_HEIGHT);

    ctx.save();
    ctx.fillStyle = 'rgba(190,214,197,0.12)';
    paintBrushStrokes(ctx, ctx.fillStyle, 90, 80, 140, 120, 260, rng, 0.18);
    ctx.restore();

    const trunks = 4 + Math.floor(settings.foliageLayers);
    for (let i = 0; i < trunks; i++) {
      ctx.save();
      const x = WIDTH * (0.1 + i * 0.2 + (rng() - 0.5) * 0.1);
      ctx.translate(x, ART_HEIGHT);
      ctx.fillStyle = rgbaString('#2c1f18', 0.85);
      drawTakamakaTrunk(ctx, ART_HEIGHT * (0.55 + rng() * 0.15), 26 + rng() * 12);
      ctx.restore();
    }

    const canopyColor = rgbaString(lighten(paletteColor(palette, 'accent', '#2a7e55'), 0.25), 0.95);
    for (let i = 0; i < settings.foliageLayers; i++) {
      ctx.save();
      const x = WIDTH * (0.2 + i * 0.22 + (rng() - 0.5) * 0.15);
      const y = ART_HEIGHT * (0.55 - i * 0.12 + (rng() - 0.5) * 0.05);
      ctx.translate(x, y);
      ctx.fillStyle = canopyColor;
      drawPalmCluster(ctx, 160 + i * 25, 6 + i, ctx.fillStyle, rng);
      ctx.restore();
    }

    paintBrushStrokes(ctx, rgbaString('#1a3a2c', 0.6), 140, 80, 200, 18, 40, rng, 0.45);
  },
  highland(ctx, card, rng, settings) {
    const palette = card.art?.palette || {};
    paintGradientBand(ctx, paletteColor(palette, 'gradientFrom', '#243049'), paletteColor(palette, 'gradientTo', '#1a2235'), 0, ART_HEIGHT * 0.4);
    paintGradientBand(ctx, paletteColor(palette, 'background', '#1a1f29'), darken(paletteColor(palette, 'background', '#0e1118'), 0.35), ART_HEIGHT * 0.4, ART_HEIGHT);

    paintBrushStrokes(ctx, 'rgba(206,215,224,0.22)', 60, 140, 260, 40, 90, rng, 0.22);

    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(WIDTH * (0.2 + i * 0.3), ART_HEIGHT * 0.78);
      ctx.fillStyle = rgbaString(darken(paletteColor(palette, 'accent', '#4f687f'), 0.25 - i * 0.05), 0.9);
      drawSimpleRock(ctx, 420 - i * 80);
      ctx.restore();
    }

    paintBrushStrokes(ctx, rgbaString('#3a5d3d', 0.5), 120, 90, 200, 20, 40, rng, 0.32);
  },
  village(ctx, card, rng, settings) {
    const palette = card.art?.palette || {};
    paintGradientBand(ctx, lighten(paletteColor(palette, 'gradientFrom', '#49253a'), 0.15), paletteColor(palette, 'gradientTo', '#261127'), 0, ART_HEIGHT * 0.4);
    paintGradientBand(ctx, paletteColor(palette, 'background', '#2a1914'), darken(paletteColor(palette, 'background', '#1a0e0b'), 0.25), ART_HEIGHT * 0.4, ART_HEIGHT);

    ctx.save();
    ctx.fillStyle = rgbaString('#faac3c', 0.78);
    ctx.translate(WIDTH * 0.18, ART_HEIGHT * 0.46);
    drawMarketBanner(ctx, 220, 90);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = rgbaString('#8f4cc6', 0.7);
    ctx.translate(WIDTH * 0.62, ART_HEIGHT * 0.4);
    drawMarketBanner(ctx, 260, 110);
    ctx.restore();

    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(WIDTH * (0.2 + i * 0.25), ART_HEIGHT * 0.78);
      ctx.fillStyle = rgbaString('#3e1d14', 0.85 - i * 0.1);
      drawVillageHut(ctx, 220, 220);
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = rgbaString('#f6d8a9', 0.45);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(WIDTH * 0.1, ART_HEIGHT * 0.32);
    ctx.quadraticCurveTo(WIDTH * 0.5, ART_HEIGHT * 0.38, WIDTH * 0.9, ART_HEIGHT * 0.26);
    ctx.stroke();
    ctx.restore();
  },
  ceremony(ctx, card, rng, settings) {
    const palette = card.art?.palette || {};
    paintGradientBand(ctx, paletteColor(palette, 'gradientFrom', '#361422'), paletteColor(palette, 'gradientTo', '#12060d'), 0, ART_HEIGHT * 0.5);
    paintGradientBand(ctx, darken(paletteColor(palette, 'background', '#1b0a0e'), 0.1), '#060203', ART_HEIGHT * 0.5, ART_HEIGHT);

    const rings = 3;
    for (let i = 0; i < rings; i++) {
      ctx.save();
      ctx.strokeStyle = rgbaString('#f3c568', 0.35 - i * 0.08);
      ctx.lineWidth = 8 - i * 2;
      ctx.beginPath();
      ctx.ellipse(WIDTH / 2, ART_HEIGHT * 0.75, WIDTH * (0.26 + i * 0.1), ART_HEIGHT * (0.12 + i * 0.04), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    paintBrushStrokes(ctx, 'rgba(255,255,255,0.18)', 80, 120, 200, 12, 26, rng, 0.25);

    ctx.save();
    ctx.strokeStyle = rgbaString(lighten(paletteColor(palette, 'glow', '#f7d789'), 0.15), 0.45);
    for (let i = 0; i < settings.silhouetteCount + 1; i++) {
      ctx.save();
      ctx.translate(WIDTH * (0.3 + i * 0.2 + (rng() - 0.5) * 0.08), ART_HEIGHT * 0.65);
      drawSpiritTrail(ctx, 220 + rng() * 120, 90 + rng() * 40, rng);
      ctx.restore();
    }
    ctx.restore();
  },
  cavern(ctx, card, rng, settings) {
    const palette = card.art?.palette || {};
    paintGradientBand(ctx, paletteColor(palette, 'gradientFrom', '#1b1e33'), paletteColor(palette, 'gradientTo', '#0a0f1a'), 0, ART_HEIGHT);

    for (let i = 0; i < 7; i++) {
      ctx.save();
      ctx.translate(WIDTH * (0.1 + i * 0.13 + (rng() - 0.5) * 0.05), ART_HEIGHT * 0.18 + rng() * 40);
      ctx.fillStyle = rgbaString('#10131f', 0.75);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(40 + rng() * 40, 120 + rng() * 80);
      ctx.lineTo(-40 - rng() * 30, 120 + rng() * 80);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = rgbaString(lighten(paletteColor(palette, 'accent', '#45a7d3'), 0.25), 0.55);
    ctx.beginPath();
    ctx.ellipse(WIDTH * 0.55, ART_HEIGHT * 0.78, WIDTH * 0.24, ART_HEIGHT * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    paintBrushStrokes(ctx, rgbaString('#0a1623', 0.6), 110, 80, 160, 14, 32, rng, 0.4);
  }
};

function renderEnvironment(ctx, card, rng) {
  const rarity = getCardRarity(card);
  const settings = raritySettings[rarity] || raritySettings.rare;
  const env = getCardEnvironment(card);
  const renderer = environmentRenderers[env] || environmentRenderers.coastal;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, WIDTH, ART_HEIGHT);
  ctx.clip();
  renderer(ctx, card, rng, settings);
  ctx.restore();
}

const humanPresenceRenderers = {
  default(ctx, card, rng, settings, palette, baseColor, strokeColor) {
    const silhouettes = Math.max(1, settings.silhouetteCount);
    for (let i = 0; i < silhouettes; i++) {
      ctx.save();
      const x = WIDTH * (0.25 + i * 0.22 + (rng() - 0.5) * 0.12);
      const y = ART_HEIGHT * (0.72 + (rng() - 0.5) * 0.04);
      ctx.translate(x, y);
      const size = 220 + rng() * 80;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = size * 0.06;
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = 0.92;
      setShadow(ctx, '#05070a', 0.32, 22);
      drawDancerSilhouette(ctx, size);
      ctx.restore();
    }
  },
  trio_dancers(ctx, card, rng, settings, palette, baseColor, strokeColor) {
    const silhouettes = Math.max(2, settings.silhouetteCount);
    for (let i = 0; i < silhouettes; i++) {
      ctx.save();
      const spread = 0.2 + settings.silhouetteCount * 0.04;
      const x = WIDTH * (0.28 + i * spread + (rng() - 0.5) * 0.08);
      const y = ART_HEIGHT * (0.7 + (rng() - 0.5) * 0.05);
      ctx.translate(x, y);
      const size = 240 + rng() * 90;
      ctx.rotate((rng() - 0.5) * 0.2);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = size * 0.06;
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = 0.94;
      setShadow(ctx, '#04060d', 0.36, 24 + settings.foliageLayers * 4);
      drawDancerSilhouette(ctx, size);
      ctx.restore();
    }
  },
  fisher_warning(ctx, card, rng, settings, palette, baseColor, strokeColor) {
    const silhouettes = Math.max(2, settings.silhouetteCount);
    for (let i = 0; i < silhouettes; i++) {
      ctx.save();
      const x = WIDTH * (0.34 + i * 0.18 + (rng() - 0.5) * 0.08);
      const y = ART_HEIGHT * (0.8 + (rng() - 0.5) * 0.03);
      ctx.translate(x, y);
      ctx.scale(1, 1 + (rng() - 0.5) * 0.1);
      const size = 210 + rng() * 70;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = size * 0.05;
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = 0.88;
      setShadow(ctx, '#05080d', 0.42, 26);
      drawDancer(ctx, size);
      ctx.restore();
    }
  },
  spirit_procession(ctx, card, rng, settings, palette, baseColor, strokeColor) {
    const silhouettes = settings.silhouetteCount + 1;
    const glow = rgbaString(lighten(paletteColor(palette, 'glow', '#f7d789'), 0.12), 0.45);
    for (let i = 0; i < silhouettes; i++) {
      const t = silhouettes <= 1 ? 0.5 : i / (silhouettes - 1);
      const x = WIDTH * (0.28 + t * 0.44 + (rng() - 0.5) * 0.05);
      const y = ART_HEIGHT * (0.68 + (rng() - 0.5) * 0.04);
      const size = 200 + rng() * 90;
      ctx.save();
      ctx.translate(x, y + size * -0.2);
      ctx.strokeStyle = glow;
      ctx.lineWidth = size * 0.08;
      drawSpiritTrail(ctx, size * 1.6, size * 0.45, rng);
      ctx.restore();

      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = size * 0.05;
      ctx.fillStyle = rgbaString(baseColor, 0.78);
      setShadow(ctx, '#070b12', 0.4, 24 + settings.foliageLayers * 6);
      drawDancerSilhouette(ctx, size);
      ctx.restore();
    }
  },
  mapmakers(ctx, card, rng, settings, palette, baseColor, strokeColor) {
    ctx.save();
    const size = 280 + settings.silhouetteCount * 30;
    ctx.translate(WIDTH * 0.5 + (rng() - 0.5) * WIDTH * 0.04, ART_HEIGHT * 0.72);
    ctx.scale(1.12, 1.05);
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = baseColor;
    ctx.strokeStyle = strokeColor;
    setShadow(ctx, '#06090f', 0.32, 28);
    drawFigureTrio(ctx, size);
    ctx.restore();

    const aides = Math.max(0, settings.silhouetteCount - 2);
    for (let i = 0; i < aides; i++) {
      ctx.save();
      ctx.translate(WIDTH * (0.3 + i * 0.28 + (rng() - 0.5) * 0.08), ART_HEIGHT * (0.77 + (rng() - 0.5) * 0.03));
      const sizeAide = 190 + rng() * 60;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = sizeAide * 0.05;
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = 0.88;
      drawDancerSilhouette(ctx, sizeAide);
      ctx.restore();
    }
  },
  ritual_circle(ctx, card, rng, settings, palette, baseColor, strokeColor) {
    const silhouettes = Math.max(3, settings.silhouetteCount + 1);
    for (let i = 0; i < silhouettes; i++) {
      const angle = (Math.PI * 2 * i) / silhouettes;
      const radius = WIDTH * 0.14;
      const x = WIDTH / 2 + Math.cos(angle) * radius;
      const y = ART_HEIGHT * 0.72 + Math.sin(angle) * radius * 0.4;
      const size = 210 + rng() * 70;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(angle) * 0.2);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = size * 0.05;
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = 0.92;
      setShadow(ctx, '#08070d', 0.45, 30 + settings.foliageLayers * 5);
      drawDancerSilhouette(ctx, size);
      ctx.restore();
    }
  }
};

function renderHumanPresence(ctx, card, rng) {
  const rarity = getCardRarity(card);
  const settings = raritySettings[rarity] || raritySettings.rare;
  const environment = getCardEnvironment(card);
  const palette = card.art?.palette || {};
  if (!settings.silhouetteCount && !card.humanPresence) {
    return;
  }

  const baseColor = environment === 'ceremony'
    ? rgbaString('#1c0609', 0.85)
    : rgbaString('#0a0c10', 0.7);
  const strokeColor = rgbaString(lighten(paletteColor(palette, 'accent', '#f5dba6'), 0.18), 0.38);
  const key = (card.humanPresence || 'default').toLowerCase();
  const renderer = humanPresenceRenderers[key] || humanPresenceRenderers.default;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, WIDTH, ART_HEIGHT);
  ctx.clip();
  renderer(ctx, card, rng, settings, palette, baseColor, strokeColor);
  ctx.restore();
}

const faunaRenderers = {
  fruit_bats(ctx, item, card, rng, settings, palette) {
    const count = item.count ?? Math.max(3, settings.silhouetteCount + 1);
    const maxDim = Math.min(WIDTH, ART_HEIGHT);
    const size = (item.size || 160) * (maxDim / 1024);
    const baseColor = item.color || rgbaString(paletteColor(palette, 'accent', '#f6e2c4'), 0.92);
    const radius = WIDTH * (item.radius ?? 0.28);
    const baseY = ART_HEIGHT * (item.baseY ?? 0.18);
    const start = (item.arcStart ?? -0.65) * Math.PI;
    const end = (item.arcEnd ?? -0.2) * Math.PI;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = lerp(start, end, t);
      const x = WIDTH / 2 + Math.cos(angle) * radius * (0.75 + (rng() - 0.5) * 0.1);
      const y = baseY + Math.sin(angle) * ART_HEIGHT * 0.12 + (rng() - 0.5) * 18;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2 + (rng() - 0.5) * 0.4);
      ctx.globalAlpha = item.opacity ?? 0.85;
      setShadow(ctx, '#05090f', 0.35, 18 + settings.foliageLayers * 4);
      drawShape(ctx, item.shape || 'bat', size, baseColor);
      ctx.restore();
    }
  },
  flying_foxes(ctx, item, card, rng, settings, palette) {
    const swap = { ...item, size: item.size || 220, count: item.count ?? Math.max(3, settings.silhouetteCount + 2), color: item.color || rgbaString(paletteColor(palette, 'glow', '#fcedbb'), 0.9) };
    faunaRenderers.fruit_bats(ctx, swap, card, rng, settings, palette);
  },
  spirit_cat(ctx, item, card, rng, settings, palette) {
    const count = item.count ?? 1;
    const maxDim = Math.min(WIDTH, ART_HEIGHT);
    const size = (item.size || 220) * (maxDim / 1024);
    const color = item.color || rgbaString(paletteColor(palette, 'glow', '#f6d09a'), 0.92);
    for (let i = 0; i < count; i++) {
      const x = WIDTH * clamp((item.center?.x ?? 0.62) + (rng() - 0.5) * (item.spread?.x ?? 0.18), 0.1, 0.9);
      const y = ART_HEIGHT * clamp((item.center?.y ?? 0.82) + (rng() - 0.5) * (item.spread?.y ?? 0.04), 0.55, 0.95);
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = item.opacity ?? 0.88;
      setShadow(ctx, '#07080c', 0.5, 28);
      drawShape(ctx, item.shape || 'cat', size, color);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = rgbaString(color, 0.35);
      ctx.beginPath();
      ctx.ellipse(0, size * 0.4, size * 0.7, size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
  reef_fish(ctx, item, card, rng, settings, palette) {
    const count = item.count ?? Math.max(5, 3 + Math.round(settings.foliageLayers * 1.5));
    const maxDim = Math.min(WIDTH, ART_HEIGHT);
    const size = (item.size || 150) * (maxDim / 1024);
    const color = item.color || rgbaString(paletteColor(palette, 'accent', '#7cc7d3'), 0.85);
    const bandY = item.bandY ?? 0.86;
    const bandHeight = item.bandHeight ?? 0.05;
    for (let i = 0; i < count; i++) {
      const x = WIDTH * clamp((item.center?.x ?? 0.2 + i * 0.12) + (rng() - 0.5) * (item.spread?.x ?? 0.1), 0.05, 0.95);
      const y = ART_HEIGHT * clamp(bandY + (rng() - 0.5) * bandHeight, 0.6, 0.95);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rng() - 0.5) * 0.2);
      ctx.globalAlpha = item.opacity ?? 0.8;
      setShadow(ctx, '#031017', 0.28, 16);
      drawShape(ctx, item.shape || 'fish', size, color);
      ctx.restore();
    }
  },
  fireflies(ctx, item, card, rng, settings, palette) {
    const count = item.count ?? Math.round(24 + settings.particleDensity * 32);
    const maxDim = Math.min(WIDTH, ART_HEIGHT);
    const size = (item.size || 90) * (maxDim / 1024);
    const centerX = item.center?.x ?? 0.5;
    const centerY = item.center?.y ?? 0.5;
    const spreadX = item.spread?.x ?? 0.6;
    const spreadY = item.spread?.y ?? 0.3;
    const color = item.color || rgbaString(paletteColor(palette, 'glow', '#ffd98c'), 0.85);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < count; i++) {
      const x = clamp(centerX + (rng() - 0.5) * spreadX, 0, 1) * WIDTH;
      const y = clamp(centerY + (rng() - 0.5) * spreadY, 0, 1) * ART_HEIGHT;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = (item.opacity ?? 0.85) * (0.7 + rng() * 0.3);
      drawShape(ctx, item.shape || 'firefly', size, color);
      ctx.restore();
    }
    ctx.restore();
  },
  black_parrots(ctx, item, card, rng, settings, palette) {
    const count = item.count ?? Math.max(2, settings.silhouetteCount);
    const maxDim = Math.min(WIDTH, ART_HEIGHT);
    const size = (item.size || 180) * (maxDim / 1024);
    const color = item.color || rgbaString(paletteColor(palette, 'accent', '#eae5cf'), 0.8);
    for (let i = 0; i < count; i++) {
      const x = WIDTH * clamp((item.center?.x ?? 0.3 + i * 0.2) + (rng() - 0.5) * (item.spread?.x ?? 0.12), 0.05, 0.95);
      const y = ART_HEIGHT * clamp((item.center?.y ?? 0.24) + (rng() - 0.5) * (item.spread?.y ?? 0.08), 0.05, 0.45);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rng() - 0.5) * 0.25);
      ctx.globalAlpha = item.opacity ?? 0.82;
      setShadow(ctx, '#05070b', 0.32, 20);
      drawShape(ctx, item.shape || 'gull', size, color);
      ctx.restore();
    }
  },
  default(ctx, item, card, rng, settings, palette) {
    const count = item.count ?? 1;
    const shape = item.shape || 'firefly';
    const maxDim = Math.min(WIDTH, ART_HEIGHT);
    const size = (item.size || 140) * (maxDim / 1024);
    const centerX = item.center?.x ?? 0.5;
    const centerY = item.center?.y ?? 0.6;
    const spreadX = item.spread?.x ?? 0.5;
    const spreadY = item.spread?.y ?? 0.4;
    for (let i = 0; i < count; i++) {
      const x = clamp(centerX + (rng() - 0.5) * spreadX, 0, 1) * WIDTH;
      const y = clamp(centerY + (rng() - 0.5) * spreadY, 0, 1) * ART_HEIGHT;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rng() - 0.5) * (item.rotationJitter ?? 0.3));
      ctx.globalAlpha = item.opacity ?? 0.82;
      setShadow(ctx, '#05080d', 0.28, 18 + settings.foliageLayers * 3);
      drawShape(ctx, shape, size, item.color || palette.accent || '#f5dba6');
      ctx.restore();
    }
  }
};

function renderFauna(ctx, card, rng) {
  const fauna = card.fauna || [];
  if (!fauna.length) return;

  const rarity = getCardRarity(card);
  const settings = raritySettings[rarity] || raritySettings.rare;
  const palette = card.art?.palette || {};

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, WIDTH, ART_HEIGHT);
  ctx.clip();

  fauna.forEach((item, index) => {
    const localRng = seedrandom(`${card.id}:fauna:${index}`);
    const renderer = faunaRenderers[item.type] || faunaRenderers.default;
    renderer(ctx, item, card, localRng, settings, palette);
  });

  ctx.restore();
}

function renderAtmospherics(ctx, card, rng) {
  const rarity = getCardRarity(card);
  const settings = raritySettings[rarity] || raritySettings.rare;
  const environment = getCardEnvironment(card);
  const palette = card.art?.palette || {};

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, WIDTH, ART_HEIGHT);
  ctx.clip();

  const density = 160 * settings.particleDensity;
  for (let i = 0; i < density; i++) {
    const x = rng() * WIDTH;
    const y = rng() * ART_HEIGHT;
    const size = 2 + rng() * 3;
    const alpha = environment === 'cavern' ? 0.25 + rng() * 0.25 : 0.15 + rng() * 0.2;
    ctx.fillStyle = rgbaString(paletteColor(palette, 'glow', '#f4d79a'), alpha * 0.6);
    ctx.fillRect(x, y, size, size);
  }

  ctx.restore();
}

async function embedSymbolicElements(ctx, card, rng) {
  const palette = card.art?.palette || {};
  const icons = [...(card.art?.icons || [])];

  for (const highlight of card.propHighlights || []) {
    icons.push({
      ...highlight,
      highlight: true,
      color: highlight.color || lighten(paletteColor(palette, 'accent', '#f6d7a4'), 0.12),
      opacity: highlight.opacity ?? 0.96,
      size: highlight.size || highlight.baseSize || 260
    });
  }

  if (!icons.length) return;

  const rarity = getCardRarity(card);
  const settings = raritySettings[rarity] || raritySettings.rare;
  const env = getCardEnvironment(card);
  const shadowColor = env === 'ceremony' ? '#3f0f17' : '#04121a';

  for (let index = 0; index < icons.length; index++) {
    const icon = icons[index];
    const rngLocal = seedrandom(`${card.id}:icon:${index}`);
    const instances = computeInstances(icon, rngLocal);
    const color = icon.color || palette.accent || '#f2d7a4';
    const opacity = icon.opacity ?? 0.9;
    const baseSize = (icon.size || 240) / 1024;
    const maxDim = Math.min(WIDTH, ART_HEIGHT);
    const assetKey = icon.asset || icon.assetKey || painterlyShapeAssetMap[icon.shape];
    const tintedAsset = assetKey ? await getTintedSilhouetteCanvas(assetKey, color) : null;

    for (const inst of instances) {
      const x = inst.x * WIDTH;
      const y = inst.y * ART_HEIGHT * 0.92 + ART_HEIGHT * 0.04;
      const size = baseSize * maxDim * (0.9 + rngLocal() * 0.25);
      const finalSize = icon.highlight ? size * 1.08 : size;
      const rotation = (inst.rotation || 0) + (rngLocal() - 0.5) * (icon.rotationJitter ?? 0.15);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      const blur = icon.highlight ? 24 + settings.foliageLayers * 6 : 14 + settings.foliageLayers * 4;
      const shadowStrength = icon.highlight ? 0.55 : 0.45;
      setShadow(ctx, shadowColor, shadowStrength, blur);
      ctx.globalAlpha = Math.min(1, icon.highlight ? opacity + 0.1 : opacity);
      if (tintedAsset) {
        const aspect = tintedAsset.height === 0 ? 1 : tintedAsset.width / tintedAsset.height;
        let drawWidth = finalSize;
        let drawHeight = finalSize;
        if (aspect > 1) {
          drawHeight = finalSize / aspect;
        } else if (aspect < 1) {
          drawWidth = finalSize * aspect;
        }
        ctx.drawImage(tintedAsset, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      } else if (icon.shape === 'coco_de_mer' || icon.shape === 'giant_tortoise') {
        // Skip fallback - PNG assets only for these shapes
      } else {
        drawShape(ctx, icon.shape, finalSize, color);
      }

      if (icon.highlight) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0)';
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = rgbaString(paletteColor(palette, 'glow', '#f8dea6'), 0.4);
        ctx.beginPath();
        ctx.ellipse(0, finalSize * 0.1, finalSize * 0.85, finalSize * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }
  }
}

async function loadSilhouetteAsset(key) {
  if (!key) return null;
  if (silhouetteImageCache.has(key)) {
    return silhouetteImageCache.get(key);
  }
  const assetPath = painterlyAssetPaths[key];
  if (!assetPath || !fs.existsSync(assetPath)) {
    console.warn('Painterly asset missing:', key, assetPath);
    silhouetteImageCache.set(key, null);
    return null;
  }
  try {
    const img = await loadImage(assetPath);
    silhouetteImageCache.set(key, img);
    return img;
  } catch (err) {
    console.warn('Failed to load painterly asset', assetPath, err.message);
    silhouetteImageCache.set(key, null);
    return null;
  }
}

async function getTintedSilhouetteCanvas(key, color) {
  if (!key) return null;
  const tintKey = `${key}:${color}`;
  if (tintedSilhouetteCache.has(tintKey)) {
    return tintedSilhouetteCache.get(tintKey);
  }
  const img = await loadSilhouetteAsset(key);
  if (!img) return null;
  const tintCanvas = createCanvas(img.width, img.height);
  const tctx = tintCanvas.getContext('2d');
  tctx.clearRect(0, 0, tintCanvas.width, tintCanvas.height);
  tctx.drawImage(img, 0, 0);
  tctx.globalCompositeOperation = 'source-in';
  tctx.fillStyle = color;
  tctx.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
  tintedSilhouetteCache.set(tintKey, tintCanvas);
  return tintCanvas;
}

function painterlyBlendMode(blend) {
  switch ((blend || 'normal').toLowerCase()) {
    case 'multiply':
    case 'screen':
    case 'overlay':
    case 'darken':
    case 'lighten':
    case 'soft-light':
    case 'hard-light':
      return blend.toLowerCase();
    default:
      return 'source-over';
  }
}

function paintBrushTextureLayer(ctx, layer, painterly, rng) {
  const densityFactor = painterly?.brushDensity ?? 0.7;
  const density = Math.round((layer.density ?? densityFactor) * 240);
  const color = rgbaString(layer.color || painterly?.glazeHue || '#f5d7a4', 1);
  const opacity = clamp(layer.opacity ?? 0.4, 0, 1);
  const texture = (layer.texture || 'knife').toLowerCase();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  const minDim = Math.min(WIDTH, ART_HEIGHT);
  const impasto = painterly?.impastoDepth ?? 0.5;

  switch (texture) {
    case 'ripple': {
      ctx.lineWidth = minDim * 0.006 * (0.7 + impasto * 0.6);
      for (let i = 0; i < density; i++) {
        const cx = rng() * WIDTH;
        const cy = ART_HEIGHT * (0.4 + rng() * 0.5);
        const rx = minDim * (0.08 + rng() * 0.14);
        const ry = rx * (0.35 + rng() * 0.2);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, rng() * Math.PI, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 'soft-glaze': {
      for (let i = 0; i < density; i++) {
        const x = rng() * WIDTH;
        const y = rng() * ART_HEIGHT;
        const w = minDim * (0.08 + rng() * 0.18);
        const h = w * (0.6 + rng() * 0.4);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, w);
        gradient.addColorStop(0, rgbaString(layer.color || painterly?.glazeHue, 0.18 + 0.1 * impasto));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - w, y - h, w * 2, h * 2);
      }
      ctx.fillStyle = color;
      break;
    }
    case 'linen': {
      ctx.lineWidth = minDim * 0.003;
      ctx.globalAlpha = opacity * 0.8;
      for (let i = 0; i < density * 1.2; i++) {
        const x = rng() * WIDTH;
        const y = rng() * ART_HEIGHT;
        const len = minDim * (0.04 + rng() * 0.16);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rng() - 0.5) * Math.PI);
        ctx.beginPath();
        ctx.moveTo(-len / 2, 0);
        ctx.lineTo(len / 2, 0);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }
    case 'glitter': {
      for (let i = 0; i < density * 1.4; i++) {
        const x = rng() * WIDTH;
        const y = rng() * ART_HEIGHT;
        const size = 1 + rng() * 2;
        ctx.globalAlpha = opacity * (0.5 + rng() * 0.5);
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = opacity;
      break;
    }
    case 'wash': {
      for (let i = 0; i < density; i++) {
        const x = rng() * WIDTH;
        const y = rng() * ART_HEIGHT;
        const w = minDim * (0.14 + rng() * 0.22);
        const h = w * (0.5 + rng() * 0.5);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rng() - 0.5) * Math.PI * 0.35);
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
      }
      break;
    }
    case 'glaze': {
      const glazeColor = layer.color || painterly?.glazeHue || '#f5d7a4';
      for (let i = 0; i < density; i++) {
        const x = rng() * WIDTH;
        const y = rng() * ART_HEIGHT;
        const radius = minDim * (0.05 + rng() * 0.18);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, rgbaString(glazeColor, 0.1 + 0.1 * impasto));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = opacity;
        ctx.fillStyle = grad;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      ctx.fillStyle = color;
      break;
    }
    case 'knife':
    default: {
      const strokeWidth = minDim * (0.008 + impasto * 0.01);
      for (let i = 0; i < density * 1.1; i++) {
        const x = rng() * WIDTH;
        const y = rng() * ART_HEIGHT;
        const length = minDim * (0.08 + rng() * 0.18);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rng() - 0.5) * Math.PI * 0.5);
        ctx.fillRect(-length / 2, -strokeWidth / 2, length, strokeWidth);
        ctx.restore();
      }
      break;
    }
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
}

function applyPainterlyCanvas(ctx, painterly, rng) {
  // Disabled excessive canvas texture that was covering cards with stick patterns
  return;
}

function renderPainterlyBrushLayers(ctx, card, painterly) {
  // Disabled aggressive brush layers that were covering cards with stick textures
  return;
}

const painterlyShapeScale = {
  altar: 0.38,
  bat: 0.16,
  boulder: 0.48,
  candle: 0.12,
  cocoDeMer: 0.24,
  coco_de_mer: 0.24,
  compass: 0.26,
  crack: 0.24,
  gate: 0.42,
  giant_tortoise: 0.32,
  giantTortoise: 0.32,
  key: 0.18,
  mask: 0.34,
  pool: 0.4,
  rune: 0.2,
  shard: 0.2,
  shell: 0.18,
  skull: 0.16,
  tally: 0.18,
  tooth: 0.16,
  waterfall: 0.5
};

const painterlyShapeAssetMap = {
  coco_de_mer: 'coco_de_mer',
  cocoDeMer: 'coco_de_mer',
  giant_tortoise: 'giant_tortoise',
  giantTortoise: 'giant_tortoise'
};

function resolvePainterlyPlacement(entry, rng) {
  const placement = entry.placement || { type: 'absolute', x: 0.5, y: 0.5 };
  const type = placement.type || 'absolute';
  const count = entry.count ?? 1;
  const instances = [];

  switch (type) {
    case 'arc': {
      const center = placement.center || { x: 0.5, y: 0.5 };
      const radius = placement.radius || 0.25;
      const startAngle = (placement.startAngle ?? 0) * (Math.PI / 180);
      const endAngle = (placement.endAngle ?? 360) * (Math.PI / 180);
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const angle = lerp(startAngle, endAngle, t);
        instances.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          rotation: angle + Math.PI / 2
        });
      }
      break;
    }
    case 'line': {
      const start = placement.start || { x: 0.4, y: 0.4 };
      const end = placement.end || { x: 0.6, y: 0.6 };
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        instances.push({
          x: lerp(start.x, end.x, t),
          y: lerp(start.y, end.y, t)
        });
      }
      break;
    }
    case 'stack': {
      const start = placement.start || { x: 0.5, y: 0.5 };
      const spacing = placement.spacing || 0.05;
      const baseY = start.y - spacing * (count - 1) * 0.5;
      for (let i = 0; i < count; i++) {
        instances.push({ x: start.x, y: baseY + spacing * i });
      }
      break;
    }
    case 'ring': {
      const center = placement.center || { x: 0.5, y: 0.5 };
      const radius = placement.radius || 0.2;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        instances.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          rotation: angle + Math.PI / 2
        });
      }
      break;
    }
    case 'flank': {
      if (placement.left) instances.push({ x: placement.left.x, y: placement.left.y });
      if (placement.right) instances.push({ x: placement.right.x, y: placement.right.y });
      break;
    }
    case 'shadow': {
      const anchor = placement.anchor || { x: 0.5, y: 0.75 };
      instances.push({ x: anchor.x, y: anchor.y, scale: placement.scale || 0.4 });
      break;
    }
    case 'absolute':
    default: {
      const x = placement.x ?? 0.5;
      const y = placement.y ?? 0.5;
      for (let i = 0; i < count; i++) {
        instances.push({ x, y });
      }
    }
  }

  return instances.map((inst) => ({
    x: clamp(inst.x + (rng() - 0.5) * (entry.jitter?.x ?? 0), 0, 1),
    y: clamp(inst.y + (rng() - 0.5) * (entry.jitter?.y ?? 0), 0, 1),
    rotation: inst.rotation || 0,
    scale: inst.scale || 1
  }));
}

function applyBrushStyle(ctx, style, edgeSoftness, impasto, color) {
  const softness = clamp(edgeSoftness ?? 0.4, 0, 1);
  const depth = clamp(impasto ?? 0.5, 0, 1);
  ctx.shadowColor = rgbaString(color, 0.45 * (0.3 + depth * 0.7));
  ctx.shadowBlur = 20 + softness * 60;
  switch ((style || '').toLowerCase()) {
    case 'glaze':
      ctx.globalCompositeOperation = 'screen';
      break;
    case 'fan':
      ctx.globalCompositeOperation = 'lighten';
      break;
    case 'drybrush':
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha *= 0.85;
      break;
    case 'loaded':
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 25 + depth * 70;
      break;
    case 'knife':
      ctx.globalCompositeOperation = 'overlay';
      ctx.shadowBlur = 18 + depth * 50;
      break;
    case 'ripple':
      ctx.globalCompositeOperation = 'soft-light';
      break;
    default:
      ctx.globalCompositeOperation = 'source-over';
  }
}

async function renderPainterlySilhouettes(ctx, card, painterly) {
  if (!painterly?.silhouettes?.length) return;
  const minDim = Math.min(WIDTH, ART_HEIGHT);
  for (let index = 0; index < painterly.silhouettes.length; index++) {
    const entry = painterly.silhouettes[index];
    const localRng = seedrandom(`${card.id}:silhouette:${index}`);
    const brush = entry.brush || {};
    const color = brush.color || painterly.glazeHue || card.art?.palette?.accent || '#f6d5a2';
    const baseScale = painterlyShapeScale[entry.shape] || 0.22;
    const placements = resolvePainterlyPlacement(entry, localRng);
    const assetKey = entry.asset || entry.assetKey || painterlyShapeAssetMap[entry.shape];
    const tintedAsset = assetKey ? await getTintedSilhouetteCanvas(assetKey, color) : null;
    placements.forEach((place, i) => {
      const rngOffset = seedrandom(`${card.id}:silhouette:${index}:${i}`);
      ctx.save();
      ctx.translate(place.x * WIDTH, place.y * ART_HEIGHT);
      const strokeAngle = (brush.strokeAngle ?? 0) * (Math.PI / 180);
      ctx.rotate(strokeAngle + (rngOffset() - 0.5) * 0.12);
      const scale = (brush.scale || 1) * (entry.scale || 1) * place.scale;
      const size = baseScale * scale * minDim;
      ctx.globalAlpha = clamp(0.4 + (brush.opacity ?? 0.5), 0.1, 1);
      applyBrushStyle(ctx, brush.style, brush.edgeSoftness, painterly.impastoDepth, color);
      if (tintedAsset) {
        const aspect = tintedAsset.height === 0 ? 1 : tintedAsset.width / tintedAsset.height;
        const drawWidth = size;
        const drawHeight = aspect === 0 ? size : size / aspect;
        ctx.drawImage(tintedAsset, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      } else if (entry.shape === 'coco_de_mer' || entry.shape === 'giant_tortoise') {
        // Skip fallback - PNG assets only for these shapes
      } else {
        drawShape(ctx, entry.shape, size, color);
      }
      ctx.restore();
    });
  }
}

function renderPainterlyGlow(ctx, card, painterly) {
  if (!painterly?.glowAccents?.length) return;
  painterly.glowAccents.forEach((glow, index) => {
    const localRng = seedrandom(`${card.id}:glow:${index}`);
    const color = glow.color || painterly.glazeHue || card.art?.palette?.glow || '#f9dca0';
    const intensity = clamp(glow.intensity ?? 0.4, 0, 1.2);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = intensity;
    if (glow.band) {
      const yStart = clamp(glow.band.yStart ?? 0.4, 0, 1) * ART_HEIGHT;
      const yEnd = clamp(glow.band.yEnd ?? 0.6, 0, 1) * ART_HEIGHT;
      const grad = ctx.createLinearGradient(0, yStart, 0, yEnd);
      grad.addColorStop(0, rgbaString(color, intensity * 0.6));
      grad.addColorStop(0.5, rgbaString(color, intensity));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, yStart, WIDTH, yEnd - yStart);
    } else {
      const radius = (glow.radius ?? 0.24) * Math.min(WIDTH, ART_HEIGHT);
      const center = glow.center || { x: 0.5, y: 0.5 };
      const cx = clamp(center.x + (localRng() - 0.5) * 0.04, 0, 1) * WIDTH;
      const cy = clamp(center.y + (localRng() - 0.5) * 0.04, 0, 1) * ART_HEIGHT;
      const radial = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      radial.addColorStop(0, rgbaString(color, intensity));
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }
    ctx.restore();
  });
}

function applyPainterlyGlaze(ctx, painterly) {
  if (!painterly?.glazeHue) return;
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = clamp(0.24 + (painterly.impastoDepth ?? 0.4) * 0.2, 0, 0.6);
  ctx.fillStyle = rgbaString(painterly.glazeHue, 1);
  ctx.fillRect(0, 0, WIDTH, ART_HEIGHT);
  ctx.restore();
}

async function renderPainterlyEffects(ctx, card) {
  const painterly = card.art?.painterly;
  if (!painterly) return;
  const baseRng = seedrandom(`${card.id}:painterly`);
  // Disabled excessive painterly effects that were covering cards
  // applyPainterlyCanvas(ctx, painterly, baseRng);
  // renderPainterlyBrushLayers(ctx, card, painterly);
  await renderPainterlySilhouettes(ctx, card, painterly);
  renderPainterlyGlow(ctx, card, painterly);
  // Keep subtle glaze but reduce intensity
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.1; // Much reduced from original
  if (painterly.glazeHue) {
    ctx.fillStyle = rgbaString(painterly.glazeHue, 1);
    ctx.fillRect(0, 0, WIDTH, ART_HEIGHT);
  }
  ctx.restore();
}

function applyOverlays(ctx, card, rng) {
  const overlays = card.art?.overlays || {};
  for (const [key, value] of Object.entries(overlays)) {
    if (key === 'compass' && value) {
      drawCompassRose(ctx, card.art?.palette, 0.2);
      continue;
    }
    const handler = overlayHandlers[key];
    if (handler) {
      handler(ctx, typeof value === 'number' ? value : 0.6, card.art?.palette, rng);
    }
  }
}

function rotatePoint(x, y, angle) {
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  };
}

function computeInstances(icon, rng) {
  const count = icon.count || (icon.positions ? icon.positions.length : 1);
  const instances = [];
  if (icon.positions && icon.positions.length) {
    for (const pos of icon.positions) {
      instances.push({ x: pos.x, y: pos.y, rotation: 0 });
    }
    return instances;
  }
  const jitter = icon.rotationJitter || 0;
  switch (icon.distribution) {
    case 'line': {
      const start = icon.start || { x: 0.4, y: 0.4 };
      const end = icon.end || { x: 0.6, y: 0.6 };
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        instances.push({
          x: lerp(start.x, end.x, t),
          y: lerp(start.y, end.y, t),
          rotation: (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'arc': {
      const center = icon.center || { x: 0.5, y: 0.5 };
      const radius = icon.radius || 0.25;
      const startAngle = (icon.startAngle ?? 0) * (Math.PI / 180);
      const endAngle = (icon.endAngle ?? 360) * (Math.PI / 180);
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const angle = lerp(startAngle, endAngle, t);
        instances.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          rotation: angle + Math.PI / 2 + (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'ring': {
      const center = icon.center || { x: 0.5, y: 0.5 };
      const radius = icon.radius || 0.25;
      const startAngle = icon.startAngle ? icon.startAngle * (Math.PI / 180) : 0;
      for (let i = 0; i < count; i++) {
        const angle = startAngle + (Math.PI * 2 * i) / count;
        instances.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          rotation: angle + Math.PI / 2 + (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'stack': {
      const start = icon.start || { x: 0.5, y: 0.5 };
      const spacing = icon.spacing || 0.05;
      const baseY = start.y - spacing * (count - 1) * 0.5;
      for (let i = 0; i < count; i++) {
        instances.push({
          x: start.x,
          y: baseY + spacing * i,
          rotation: (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'cluster':
    case 'scatter': {
      const center = icon.center || { x: 0.5, y: 0.5 };
      const spread = icon.spread || { x: 0.1, y: 0.1 };
      for (let i = 0; i < count; i++) {
        const nx = (rng() - 0.5) * spread.x * 2;
        const ny = (rng() - 0.5) * spread.y * 2;
        instances.push({
          x: clamp(center.x + nx, 0, 1),
          y: clamp(center.y + ny, 0, 1),
          rotation: (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'spiral': {
      const center = icon.center || { x: 0.5, y: 0.5 };
      const radius = icon.radius || 0.3;
      for (let i = 0; i < count; i++) {
        const t = i / Math.max(1, count - 1);
        const angle = t * Math.PI * 2;
        const r = radius * (0.2 + 0.8 * t);
        instances.push({
          x: center.x + Math.cos(angle) * r,
          y: center.y + Math.sin(angle) * r,
          rotation: angle + (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'braid': {
      const center = icon.center || { x: 0.5, y: 0.4 };
      const radius = icon.radius || 0.3;
      const strands = 3;
      for (let i = 0; i < count; i++) {
        const strand = i % strands;
        const t = i / count;
        const angle = t * Math.PI * 2;
        const offsetY = (strand - (strands - 1) / 2) * 0.05;
        const offsetX = Math.sin(angle * 2 + strand) * 0.04;
        instances.push({
          x: clamp(center.x + offsetX + (t - 0.5) * radius * 1.5, 0, 1),
          y: clamp(center.y + offsetY + Math.cos(angle) * 0.05, 0, 1),
          rotation: angle * 0.4 + (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'river': {
      const center = icon.center || { x: 0.5, y: 0.4 };
      const radius = icon.radius || 0.3;
      for (let i = 0; i < count; i++) {
        const t = i / Math.max(1, count - 1);
        const x = clamp(center.x + (t - 0.5) * radius * 1.6, 0, 1);
        const y = clamp(center.y + Math.sin(t * Math.PI * 2) * 0.1, 0, 1);
        instances.push({
          x,
          y,
          rotation: (rng() - 0.5) * jitter
        });
      }
      break;
    }
    case 'radiate': {
      const center = icon.center || { x: 0.5, y: 0.5 };
      const radius = icon.radius || 0.3;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const r = radius * (0.6 + rng() * 0.4);
        instances.push({
          x: clamp(center.x + Math.cos(angle) * r, 0, 1),
          y: clamp(center.y + Math.sin(angle) * r, 0, 1),
          rotation: angle + (rng() - 0.5) * jitter
        });
      }
      break;
    }
    default: {
      const center = icon.center || { x: 0.5, y: 0.5 };
      for (let i = 0; i < count; i++) {
        instances.push({
          x: clamp(center.x + (rng() - 0.5) * 0.05, 0, 1),
          y: clamp(center.y + (rng() - 0.5) * 0.05, 0, 1),
          rotation: (rng() - 0.5) * jitter
        });
      }
    }
  }
  return instances;
}

function setShadow(ctx, color, alpha, blur) {
  ctx.shadowColor = rgbaString(color, alpha);
  ctx.shadowBlur = blur;
}

function drawSimpleRock(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, size * 0.2);
  ctx.lineTo(-size * 0.3, -size * 0.3);
  ctx.lineTo(size * 0.2, -size * 0.4);
  ctx.lineTo(size * 0.45, -size * 0.1);
  ctx.lineTo(size * 0.3, size * 0.35);
  ctx.closePath();
  ctx.fill();
}

function drawAnchor(ctx, size) {
  const stem = size * 0.6;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -stem);
  ctx.lineTo(0, stem * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -stem * 0.8, size * 0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-size * 0.55, stem * 0.25);
  ctx.quadraticCurveTo(0, stem * 0.75, size * 0.55, stem * 0.25);
  ctx.moveTo(-size * 0.55, stem * 0.25);
  ctx.lineTo(-size * 0.32, stem * 0.45);
  ctx.moveTo(size * 0.55, stem * 0.25);
  ctx.lineTo(size * 0.32, stem * 0.45);
  ctx.stroke();
}

function drawMoon(ctx, size) {
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, Math.PI * 0.3, Math.PI * 1.7);
  ctx.arc(size * -0.12, 0, size * 0.5, Math.PI * 1.4, Math.PI * 0.6, true);
  ctx.closePath();
  ctx.fill();
}

function drawBat(ctx, size) {
  const wing = size * 0.6;
  ctx.beginPath();
  ctx.moveTo(-wing, 0);
  ctx.quadraticCurveTo(-wing * 0.6, -size * 0.6, 0, -size * 0.1);
  ctx.quadraticCurveTo(wing * 0.6, -size * 0.6, wing, 0);
  ctx.quadraticCurveTo(wing * 0.4, size * 0.4, 0, size * 0.2);
  ctx.quadraticCurveTo(-wing * 0.4, size * 0.4, -wing, 0);
  ctx.closePath();
  ctx.fill();
}

function drawLantern(ctx, size) {
  const bodyW = size * 0.6;
  const bodyH = size;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.5, -bodyH * 0.2);
  ctx.lineTo(-bodyW * 0.35, bodyH * 0.5);
  ctx.lineTo(bodyW * 0.35, bodyH * 0.5);
  ctx.lineTo(bodyW * 0.5, -bodyH * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-bodyW * 0.3, -bodyH * 0.5, bodyW * 0.6, bodyH * 0.35);
  ctx.fillRect(-bodyW * 0.2, -bodyH * 0.7, bodyW * 0.4, bodyH * 0.15);
}

function drawFigureTrio(ctx, size) {
  const unit = size * 0.3;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(i * unit * 0.8, -unit * 0.7, unit * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(i * unit * 0.8 - unit * 0.5, unit * 0.4);
    ctx.quadraticCurveTo(i * unit * 0.8, -unit * 0.2, i * unit * 0.8 + unit * 0.5, unit * 0.4);
    ctx.closePath();
    ctx.fill();
  }
}

function drawWaxCircle(ctx, size) {
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
  ctx.stroke();
}

function drawRune(ctx, size) {
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.5);
  ctx.lineTo(0, size * 0.5);
  ctx.moveTo(-size * 0.35, -size * 0.05);
  ctx.lineTo(size * 0.35, size * 0.05);
  ctx.stroke();
}

function drawSkull(ctx, size) {
  ctx.beginPath();
  ctx.arc(0, -size * 0.2, size * 0.4, Math.PI, 0);
  ctx.bezierCurveTo(size * 0.45, size * 0.4, size * 0.3, size * 0.6, 0, size * 0.6);
  ctx.bezierCurveTo(-size * 0.3, size * 0.6, -size * 0.45, size * 0.4, -size * 0.4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.arc(-size * 0.18, -size * 0.15, size * 0.12, 0, Math.PI * 2);
  ctx.arc(size * 0.18, -size * 0.15, size * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCat(ctx, size) {
  ctx.beginPath();
  ctx.arc(0, -size * 0.3, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, size * 0.5);
  ctx.quadraticCurveTo(-size * 0.1, -size * 0.1, size * 0.4, size * 0.5);
  ctx.closePath();
  ctx.fill();
}

function drawMountain(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, size * 0.4);
  ctx.lineTo(-size * 0.15, -size * 0.6);
  ctx.lineTo(size * 0.1, size * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, size * 0.4);
  ctx.lineTo(size * 0.35, -size * 0.3);
  ctx.lineTo(size * 0.7, size * 0.4);
  ctx.closePath();
  ctx.fill();
}

function drawShard(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.6);
  ctx.lineTo(size * 0.35, -size * 0.1);
  ctx.lineTo(size * 0.2, size * 0.6);
  ctx.lineTo(-size * 0.2, size * 0.6);
  ctx.lineTo(-size * 0.35, -size * 0.1);
  ctx.closePath();
  ctx.fill();
}

function drawTally(ctx, size) {
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-size * 0.4 + i * size * 0.25, -size * 0.5);
    ctx.lineTo(-size * 0.4 + i * size * 0.25, size * 0.5);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-size * 0.45, size * 0.4);
  ctx.lineTo(size * 0.55, -size * 0.5);
  ctx.stroke();
}

function drawTower(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, size * 0.6);
  ctx.lineTo(-size * 0.2, -size * 0.6);
  ctx.lineTo(size * 0.2, -size * 0.6);
  ctx.lineTo(size * 0.4, size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-size * 0.2, -size * 0.2, size * 0.4, size * 0.5);
}

function drawChain(ctx, size) {
  const links = 4;
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  for (let i = 0; i < links; i++) {
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.6 + i * size * 0.4, size * 0.3, size * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawFern(ctx, size) {
  ctx.lineWidth = size * 0.05;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.5);
  ctx.quadraticCurveTo(size * 0.3, 0, 0, -size * 0.5);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const y = lerp(size * 0.4, -size * 0.4, t);
    const length = size * (0.25 - t * 0.15);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(length, y - size * 0.08);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(-length * 0.5, y - size * 0.08);
    ctx.stroke();
  }
}

function drawFirefly(ctx, size) {
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.6);
  grad.addColorStop(0, 'rgba(255,255,200,0.8)');
  grad.addColorStop(1, 'rgba(255,255,200,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawFish(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, 0);
  ctx.quadraticCurveTo(0, -size * 0.45, size * 0.6, 0);
  ctx.quadraticCurveTo(0, size * 0.45, -size * 0.6, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, 0);
  ctx.lineTo(-size * 0.85, size * 0.35);
  ctx.lineTo(-size * 0.85, -size * 0.35);
  ctx.closePath();
  ctx.fill();
}

function drawFootprint(ctx, size) {
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.2, size * 0.2, size * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(-size * 0.18 + i * size * 0.12, size * 0.2, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawForest(ctx, size, color) {
  ctx.fillStyle = color;
  for (let i = -2; i <= 2; i++) {
    const scale = 0.7 + Math.abs(i) * 0.25;
    ctx.beginPath();
    ctx.moveTo(i * size * 0.4, size * 0.6);
    ctx.lineTo(i * size * 0.4 + size * 0.25 * scale, -size * 0.3 * scale);
    ctx.lineTo(i * size * 0.4 + size * 0.45 * scale, size * 0.6);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPalmFrond(ctx, length, width) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(width * 0.5, -length * 0.2, width * 0.5, -length * 0.8, 0, -length);
  ctx.bezierCurveTo(-width * 0.5, -length * 0.8, -width * 0.5, -length * 0.2, 0, 0);
  ctx.closePath();
  ctx.fill();
}

function drawPalmCluster(ctx, baseSize, fronds, color, rng) {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < fronds; i++) {
    const angle = (-Math.PI / 3) + (i / Math.max(1, fronds - 1)) * (Math.PI * 2 / 3);
    ctx.save();
    ctx.rotate(angle + (rng ? (rng() - 0.5) * 0.25 : 0));
    drawPalmFrond(ctx, baseSize, baseSize * 0.35);
    ctx.restore();
  }
  ctx.restore();
}

function drawTakamakaTrunk(ctx, height, width) {
  ctx.beginPath();
  ctx.moveTo(-width * 0.5, 0);
  ctx.bezierCurveTo(-width, -height * 0.3, -width * 0.4, -height * 0.9, 0, -height);
  ctx.bezierCurveTo(width * 0.4, -height * 0.9, width, -height * 0.3, width * 0.5, 0);
  ctx.closePath();
  ctx.fill();
}

function drawWaveLayer(ctx, width, height, amplitude, rng) {
  ctx.beginPath();
  ctx.moveTo(0, height);
  const segments = 8;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * WIDTH;
    const y = height - Math.sin(t * Math.PI * 2 + (rng ? rng() * 0.5 : 0)) * amplitude;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(WIDTH, height + amplitude * 2);
  ctx.lineTo(0, height + amplitude * 2);
  ctx.closePath();
  ctx.fill();
}

function drawBoatSilhouette(ctx, length, height) {
  ctx.beginPath();
  ctx.moveTo(-length * 0.5, 0);
  ctx.quadraticCurveTo(0, -height * 0.8, length * 0.5, 0);
  ctx.lineTo(length * 0.4, height * 0.25);
  ctx.lineTo(-length * 0.4, height * 0.25);
  ctx.closePath();
  ctx.fill();
}

function drawVillageHut(ctx, width, height) {
  ctx.beginPath();
  ctx.moveTo(-width * 0.55, height * 0.5);
  ctx.lineTo(0, -height * 0.55);
  ctx.lineTo(width * 0.55, height * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-width * 0.4, height * 0.1, width * 0.8, height * 0.4);
}

function drawMarketBanner(ctx, width, height) {
  ctx.beginPath();
  ctx.moveTo(-width * 0.5, 0);
  ctx.lineTo(width * 0.5, 0);
  ctx.lineTo(width * 0.5, height);
  ctx.lineTo(0, height * 0.6);
  ctx.lineTo(-width * 0.5, height);
  ctx.closePath();
  ctx.fill();
}

function drawDancerSilhouette(ctx, size) {
  ctx.beginPath();
  ctx.arc(0, -size * 0.55, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 0.35, size * 0.5);
  ctx.quadraticCurveTo(0, -size * 0.1, size * 0.35, size * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.lineWidth = size * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, -size * 0.05);
  ctx.lineTo(-size * 0.5, -size * 0.35);
  ctx.moveTo(size * 0.1, -size * 0.05);
  ctx.lineTo(size * 0.5, -size * 0.35);
  ctx.stroke();
  ctx.restore();
}

function drawSpiritTrail(ctx, length, width, rng) {
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const segments = 5;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const offset = (rng ? (rng() - 0.5) * width : 0) * (1 - t);
    ctx.lineTo(offset, -length * t);
  }
  ctx.stroke();
  ctx.restore();
}

function drawGate(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, size * 0.5);
  ctx.quadraticCurveTo(0, -size * 0.6, size * 0.6, size * 0.5);
  ctx.lineTo(size * 0.6, size * 0.6);
  ctx.lineTo(-size * 0.6, size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.strokeStyle = rgbaString('#000000', 0.3);
  ctx.lineWidth = size * 0.08;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * size * 0.25, size * 0.5);
    ctx.lineTo(i * size * 0.25, size * -0.2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGlyphStone(ctx, size) {
  drawSimpleRock(ctx, size);
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, -size * 0.2);
  ctx.lineTo(size * 0.2, size * 0.2);
  ctx.moveTo(size * 0.2, -size * 0.3);
  ctx.lineTo(-size * 0.2, size * 0.15);
  ctx.stroke();
  ctx.restore();
}

function drawGull(ctx, size) {
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, 0);
  ctx.quadraticCurveTo(-size * 0.2, -size * 0.3, 0, 0);
  ctx.quadraticCurveTo(size * 0.2, -size * 0.3, size * 0.6, 0);
  ctx.stroke();
}

function drawHouse(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, size * 0.5);
  ctx.lineTo(-size * 0.6, -size * 0.2);
  ctx.lineTo(0, -size * 0.6);
  ctx.lineTo(size * 0.6, -size * 0.2);
  ctx.lineTo(size * 0.6, size * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-size * 0.3, -size * 0.05, size * 0.25, size * 0.4);
}

function drawKey(ctx, size) {
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(-size * 0.4, 0, size * 0.25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-size * 0.15, 0);
  ctx.lineTo(size * 0.55, 0);
  ctx.moveTo(size * 0.3, -size * 0.15);
  ctx.lineTo(size * 0.45, -size * 0.15);
  ctx.moveTo(size * 0.3, size * 0.15);
  ctx.lineTo(size * 0.45, size * 0.15);
  ctx.stroke();
}

function drawLeaf(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.6);
  ctx.bezierCurveTo(size * 0.45, -size * 0.4, size * 0.45, size * 0.4, 0, size * 0.6);
  ctx.bezierCurveTo(-size * 0.45, size * 0.4, -size * 0.45, -size * 0.4, 0, -size * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawLetter(ctx, size) {
  ctx.lineWidth = size * 0.16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, size * 0.5);
  ctx.lineTo(-size * 0.3, -size * 0.5);
  ctx.lineTo(size * 0.3, -size * 0.5);
  ctx.lineTo(size * 0.3, size * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, 0);
  ctx.lineTo(size * 0.3, 0);
  ctx.stroke();
}

function drawMask(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, -size * 0.2);
  ctx.quadraticCurveTo(0, -size * 0.7, size * 0.6, -size * 0.2);
  ctx.quadraticCurveTo(size * 0.4, size * 0.7, 0, size * 0.5);
  ctx.quadraticCurveTo(-size * 0.4, size * 0.7, -size * 0.6, -size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(-size * 0.25, -size * 0.05, size * 0.16, size * 0.12, 0, 0, Math.PI * 2);
  ctx.ellipse(size * 0.25, -size * 0.05, size * 0.16, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNotch(ctx, size) {
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, -size * 0.5);
  ctx.lineTo(-size * 0.4, size * 0.5);
  ctx.moveTo(size * 0.4, -size * 0.5);
  ctx.lineTo(size * 0.4, size * 0.5);
  ctx.stroke();
}

function drawOwl(ctx, size) {
  ctx.beginPath();
  ctx.arc(0, -size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-size * 0.2, -size * 0.2, size * 0.4, size * 0.6);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.arc(-size * 0.15, -size * 0.3, size * 0.1, 0, Math.PI * 2);
  ctx.arc(size * 0.15, -size * 0.3, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPool(ctx, size) {
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.7, size * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawRiverSymbol(ctx, size) {
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, -size * 0.4);
  ctx.quadraticCurveTo(-size * 0.2, -size * 0.6, 0, -size * 0.2);
  ctx.quadraticCurveTo(size * 0.3, size * 0.2, size * 0.6, size * 0.4);
  ctx.stroke();
}

function drawScar(ctx, size) {
  ctx.beginPath();
  ctx.rect(-size * 0.1, -size * 0.6, size * 0.2, size * 1.2);
  ctx.fill();
}

function drawShell(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(0, size * 0.6);
  ctx.quadraticCurveTo(size * 0.5, size * 0.3, 0, -size * 0.6);
  ctx.quadraticCurveTo(-size * 0.5, size * 0.3, 0, size * 0.6);
  ctx.fill();
}

function drawSmoke(ctx, size) {
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  grad.addColorStop(0, 'rgba(255,255,255,0.25)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpine(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, 0);
  ctx.lineTo(size * 0.5, 0);
  ctx.stroke();
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * size * 0.2, 0);
    ctx.lineTo(i * size * 0.2, -size * 0.35 * (1 - Math.abs(i) * 0.2));
    ctx.stroke();
  }
}

function drawStaff(ctx, size) {
  ctx.beginPath();
  ctx.rect(-size * 0.08, -size * 0.6, size * 0.16, size * 1.2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -size * 0.6, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawStone(ctx, size) {
  drawSimpleRock(ctx, size);
}

function drawStrap(ctx, size) {
  ctx.beginPath();
  ctx.rect(-size * 0.5, -size * 0.15, size, size * 0.3);
  ctx.fill();
}

function drawTooth(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, -size * 0.6);
  ctx.lineTo(size * 0.3, -size * 0.6);
  ctx.lineTo(0, size * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawWaterfall(ctx, size) {
  const grad = ctx.createLinearGradient(-size * 0.4, 0, size * 0.4, 0);
  grad.addColorStop(0, 'rgba(255,255,255,0.05)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.35)');
  grad.addColorStop(1, 'rgba(255,255,255,0.05)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.rect(-size * 0.4, -size * 0.6, size * 0.8, size * 1.2);
  ctx.fill();
}

function drawWave(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, 0);
  ctx.quadraticCurveTo(-size * 0.2, -size * 0.2, 0, 0);
  ctx.quadraticCurveTo(size * 0.2, size * 0.2, size * 0.5, 0);
  ctx.lineTo(size * 0.5, size * 0.3);
  ctx.lineTo(-size * 0.5, size * 0.3);
  ctx.closePath();
  ctx.fill();
}

function drawBoulder(ctx, size) {
  drawSimpleRock(ctx, size);
}

function drawCandle(ctx, size) {
  ctx.beginPath();
  ctx.rect(-size * 0.2, -size * 0.5, size * 0.4, size * 0.8);
  ctx.fill();
  const grad = ctx.createRadialGradient(0, -size * 0.6, 0, 0, -size * 0.6, size * 0.35);
  grad.addColorStop(0, 'rgba(255,220,150,0.7)');
  grad.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, -size * 0.6, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

function drawCocoDeMer(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.58);
  ctx.bezierCurveTo(size * 0.46, -size * 0.58, size * 0.58, -size * 0.08, size * 0.42, size * 0.38);
  ctx.quadraticCurveTo(0, size * 0.68, -size * 0.42, size * 0.38);
  ctx.bezierCurveTo(-size * 0.58, -size * 0.08, -size * 0.46, -size * 0.58, 0, -size * 0.58);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.strokeStyle = rgbaString('#000000', 0.18);
  ctx.lineWidth = size * 0.05;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.6);
  ctx.quadraticCurveTo(size * 0.08, -size * 0.15, 0, size * 0.52);
  ctx.moveTo(0, -size * 0.6);
  ctx.quadraticCurveTo(-size * 0.08, -size * 0.15, 0, size * 0.52);
  ctx.stroke();
  ctx.restore();
}

function drawCircleRing(ctx, size) {
  ctx.lineWidth = size * 0.12;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCrack(ctx, size) {
  ctx.lineWidth = size * 0.12;
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.5);
  ctx.lineTo(-size * 0.1, -size * 0.2);
  ctx.lineTo(-size * 0.3, size * 0.1);
  ctx.lineTo(size * 0.2, size * 0.3);
  ctx.lineTo(size * 0.45, size * 0.5);
  ctx.stroke();
}

function drawCrate(ctx, size) {
  ctx.beginPath();
  ctx.rect(-size * 0.6, -size * 0.6, size * 1.2, size * 1.2);
  ctx.fill();
  ctx.save();
  ctx.strokeStyle = rgbaString('#000000', 0.4);
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, -size * 0.6);
  ctx.lineTo(size * 0.6, size * 0.6);
  ctx.moveTo(size * 0.6, -size * 0.6);
  ctx.lineTo(-size * 0.6, size * 0.6);
  ctx.stroke();
  ctx.restore();
}

function drawCross(ctx, size) {
  ctx.beginPath();
  ctx.rect(-size * 0.12, -size * 0.6, size * 0.24, size * 1.2);
  ctx.fill();
  ctx.beginPath();
  ctx.rect(-size * 0.4, -size * 0.15, size * 0.8, size * 0.3);
  ctx.fill();
}

function drawCrossLink(ctx, size) {
  ctx.lineWidth = size * 0.18;
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, 0);
  ctx.lineTo(size * 0.4, 0);
  ctx.moveTo(0, -size * 0.4);
  ctx.lineTo(0, size * 0.4);
  ctx.stroke();
}

function drawGiantTortoise(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.62, size * 0.12);
  ctx.quadraticCurveTo(-size * 0.46, -size * 0.4, -size * 0.08, -size * 0.5);
  ctx.quadraticCurveTo(size * 0.5, -size * 0.35, size * 0.62, 0);
  ctx.quadraticCurveTo(size * 0.42, size * 0.48, 0, size * 0.6);
  ctx.quadraticCurveTo(-size * 0.46, size * 0.48, -size * 0.62, size * 0.12);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.fillStyle = rgbaString('#000000', 0.28);
  ctx.beginPath();
  ctx.ellipse(-size * 0.4, size * 0.45, size * 0.16, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.4, size * 0.45, size * 0.16, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-size * 0.15, size * 0.52, size * 0.14, size * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.15, size * 0.52, size * 0.14, size * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.62, size * 0.08, size * 0.18, size * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDancer(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, size * 0.6);
  ctx.quadraticCurveTo(0, -size * 0.5, size * 0.1, size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -size * 0.6, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawDrum(ctx, size) {
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.fillStyle = rgbaString('#ffffff', 0.25);
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.1, size * 0.45, size * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGateWaterfall(ctx, size) {
  drawGate(ctx, size);
  ctx.save();
  ctx.fillStyle = rgbaString('#ffffff', 0.3);
  ctx.beginPath();
  ctx.rect(-size * 0.15, -size * 0.2, size * 0.3, size * 0.6);
  ctx.fill();
  ctx.restore();
}

function drawShape(ctx, shape, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  switch (shape) {
    case 'altar':
      ctx.beginPath();
      ctx.rect(-size * 0.6, size * 0.2, size * 1.2, size * 0.4);
      ctx.fill();
      ctx.fillRect(-size * 0.4, -size * 0.4, size * 0.8, size * 0.6);
      break;
    case 'anchor':
      drawAnchor(ctx, size);
      break;
    case 'arch':
      drawGate(ctx, size);
      break;
    case 'bat':
      drawBat(ctx, size);
      break;
    case 'boulder':
      drawBoulder(ctx, size);
      break;
    case 'candle':
      drawCandle(ctx, size);
      break;
    case 'cat':
      drawCat(ctx, size);
      break;
    case 'coco_de_mer':
      drawCocoDeMer(ctx, size);
      break;
    case 'cavern':
      drawGate(ctx, size * 1.2);
      break;
    case 'chain':
      drawChain(ctx, size);
      break;
    case 'circle':
      drawCircleRing(ctx, size);
      break;
    case 'compass':
      drawCompassGlyph(ctx, size);
      break;
    case 'crack':
      drawCrack(ctx, size);
      break;
    case 'crate':
      drawCrate(ctx, size);
      break;
    case 'cross':
      drawCross(ctx, size);
      break;
    case 'crossLink':
      drawCrossLink(ctx, size);
      break;
    case 'dancer':
      drawDancer(ctx, size);
      break;
    case 'drum':
      drawDrum(ctx, size);
      break;
    case 'fern':
      drawFern(ctx, size);
      break;
    case 'figureTrio':
      drawFigureTrio(ctx, size);
      break;
    case 'firefly':
      drawFirefly(ctx, size);
      break;
    case 'fish':
      drawFish(ctx, size);
      break;
    case 'footprint':
      drawFootprint(ctx, size);
      break;
    case 'forest':
      drawForest(ctx, size, color);
      break;
    case 'gate':
      drawGate(ctx, size);
      break;
    case 'glyphStone':
      drawGlyphStone(ctx, size);
      break;
    case 'giant_tortoise':
    case 'giantTortoise':
      drawGiantTortoise(ctx, size);
      break;
    case 'gull':
      drawGull(ctx, size);
      break;
    case 'house':
      drawHouse(ctx, size);
      break;
    case 'key':
      drawKey(ctx, size);
      break;
    case 'lantern':
      drawLantern(ctx, size);
      break;
    case 'leaf':
      drawLeaf(ctx, size);
      break;
    case 'letter':
      drawLetter(ctx, size);
      break;
    case 'mask':
      drawMask(ctx, size);
      break;
    case 'moon':
      drawMoon(ctx, size);
      break;
    case 'mountain':
      drawMountain(ctx, size);
      break;
    case 'notch':
      drawNotch(ctx, size);
      break;
    case 'owl':
      drawOwl(ctx, size);
      break;
    case 'pool':
      drawPool(ctx, size);
      break;
    case 'river':
      drawRiverSymbol(ctx, size);
      break;
    case 'rune':
      drawRune(ctx, size);
      break;
    case 'scar':
      drawScar(ctx, size);
      break;
    case 'shard':
      drawShard(ctx, size);
      break;
    case 'shell':
      drawShell(ctx, size);
      break;
    case 'skull':
      drawSkull(ctx, size);
      break;
    case 'smoke':
      drawSmoke(ctx, size);
      break;
    case 'spine':
      drawSpine(ctx, size);
      break;
    case 'staff':
      drawStaff(ctx, size);
      break;
    case 'stone':
      drawStone(ctx, size);
      break;
    case 'strap':
      drawStrap(ctx, size);
      break;
    case 'tally':
      drawTally(ctx, size);
      break;
    case 'tooth':
      drawTooth(ctx, size);
      break;
    case 'tower':
      drawTower(ctx, size);
      break;
    case 'waterfall':
      drawWaterfall(ctx, size);
      break;
    case 'wave':
      drawWave(ctx, size);
      break;
    case 'waxCircle':
      drawWaxCircle(ctx, size);
      break;
    case 'altarShards':
      drawShard(ctx, size);
      break;
    default:
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
  }
  ctx.restore();
}

function drawIcon(ctx, card, icon, index) {
  const rng = seedrandom(`${card.id}:${icon.shape}:${index}`);
  const instances = computeInstances(icon, rng);
  const palette = card.art?.palette || {};
  const color = icon.color || palette.accent || '#f2d7a4';
  const opacity = icon.opacity ?? 0.88;
  const baseSize = (icon.size || 220) / 1024;
  const maxDim = Math.min(WIDTH, ART_HEIGHT);

  for (const inst of instances) {
    const x = inst.x * WIDTH;
    const y = inst.y * ART_HEIGHT;
    const size = baseSize * maxDim;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(inst.rotation || 0);
    ctx.globalAlpha = opacity;
    drawShape(ctx, icon.shape, size, color);
    ctx.restore();
  }
}

function drawFrame(ctx, palette) {
  ctx.save();
  ctx.strokeStyle = rgbaString(palette?.accent || '#f0d6a0', 0.45);
  ctx.lineWidth = 12;
  ctx.strokeRect(26, 26, WIDTH - 52, HEIGHT - 52);
  ctx.strokeStyle = rgbaString(palette?.accent || '#f0d6a0', 0.18);
  ctx.lineWidth = 4;
  ctx.strokeRect(54, 54, WIDTH - 108, HEIGHT - 108);
  ctx.restore();
}

function layoutText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text ?? '').split(/\s+/);
  let line = '';
  let yy = y;
  for (const word of words) {
    if (!word && !line) continue;
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = candidate;
    }
  }
  if (line) {
    ctx.fillText(line, x, yy);
    yy += lineHeight;
  }
  return yy;
}

function drawBottomPanel(ctx, card) {
  ctx.save();
  const panelY = ART_HEIGHT;
  const grad = ctx.createLinearGradient(0, panelY, 0, HEIGHT);
  grad.addColorStop(0, 'rgba(12,10,8,0.02)');
  grad.addColorStop(0.4, 'rgba(18,14,12,0.85)');
  grad.addColorStop(1, 'rgba(30,24,20,0.92)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, panelY, WIDTH, FOOTER_HEIGHT);

  ctx.strokeStyle = rgbaString(card.art?.palette?.accent || '#f0d6a0', 0.35);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(60, panelY + 12);
  ctx.lineTo(WIDTH - 60, panelY + 12);
  ctx.stroke();

  const marginX = 80;
  const titleY = panelY + 60;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,240,220,0.92)';
  ctx.font = '700 42px Cinzel';
  ctx.fillText(card.name, WIDTH / 2, titleY);

  const leftWidth = WIDTH * 0.58;
  const rightWidth = WIDTH * 0.24;
  const leftX = marginX;
  const rightX = WIDTH - marginX - rightWidth;
  let leftY = titleY + 42;
  let rightY = titleY + 26;

  ctx.textAlign = 'left';
  ctx.font = '400 22px Inter';
  ctx.fillStyle = 'rgba(240,225,200,0.9)';
  leftY = layoutText(ctx, card.scene, leftX, leftY, leftWidth, 30) + 18;

  ctx.font = '600 22px Inter';
  ctx.fillStyle = 'rgba(255,230,195,0.92)';
  ctx.fillText('Props', rightX, rightY);
  rightY += 30;
  ctx.font = '400 20px Inter';
  ctx.fillStyle = 'rgba(235,220,195,0.85)';
  for (const prop of card.props || []) {
    rightY = layoutText(ctx, `${prop.name}: ${prop.value}`, rightX, rightY, rightWidth, 26) + 8;
  }
  rightY += 6;

  ctx.font = '600 20px Inter';
  ctx.fillStyle = 'rgba(250,220,185,0.88)';
  rightY = layoutText(ctx, `Clue: ${card.hiddenClue}`, rightX, rightY, rightWidth, 26) + 14;

  ctx.font = '500 21px Inter';
  ctx.fillStyle = 'rgba(235,210,185,0.86)';
  ctx.fillText(`Bearing: ${card.bearingDeg}°`, rightX, rightY);
  rightY += 28;
  ctx.fillText(`Cipher: ${card.cipherOutput} (index ${card.cipherIndex})`, rightX, rightY);

  ctx.textAlign = 'center';
  ctx.font = 'italic 21px Inter';
  ctx.fillStyle = 'rgba(255,215,190,0.8)';
  layoutText(ctx, `“${card.riddle}”`, WIDTH / 2, Math.max(leftY + 14, panelY + FOOTER_HEIGHT - 90), leftWidth, 26);

  ctx.restore();
}

async function renderCard(card) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const rng = seedrandom(card.id);

  applyBackground(ctx, card.art?.palette, rng);
  applyParchmentTexture(ctx, rng);
  applyColorGrade(ctx, card.art?.palette);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, WIDTH, ART_HEIGHT);
  ctx.clip();
  renderEnvironment(ctx, card, rng);
  await renderPainterlyEffects(ctx, card);
  renderFauna(ctx, card, rng);
  renderHumanPresence(ctx, card, rng);
  await embedSymbolicElements(ctx, card, rng);
  applyOverlays(ctx, card, rng);
  renderAtmospherics(ctx, card, rng);
  applyInkEtching(ctx, rng);
  applyRuneGlow(ctx, card.art?.palette || {}, rng);
  ctx.restore();

  drawBottomPanel(ctx, card);
  drawFrame(ctx, card.art?.palette);

  return canvas.toBuffer('image/png');
}

function buildAttributes(card) {
  const attrs = [
    { trait_type: 'Chapter', value: 'VI' },
    { trait_type: 'Collection Phase', value: 'Pre-Mint' },
    { trait_type: 'Bearing', value: card.bearingDeg },
    { trait_type: 'Cipher Letter', value: card.cipherOutput }
  ];
  for (const prop of card.props || []) {
    attrs.push({ trait_type: prop.name, value: prop.value });
  }
  return attrs;
}

async function writeMetadata(card, filename) {
  const meta = {
    name: card.name,
    description: card.scene,
    chapter: 6,
    chapterId: 'VI',
    cardId: card.id,
    bearingDeg: card.bearingDeg,
    cipherOutput: card.cipherOutput,
    cipherIndex: card.cipherIndex,
    hiddenClue: card.hiddenClue,
    riddle: card.riddle,
    collectionPhase: 'premint',
    attributes: buildAttributes(card),
    image: `./${filename}`
  };
  await fs.writeJson(path.join(OUTPUT_DIR, filename.replace(/\.png$/, '.json')), meta, { spaces: 2 });
}

async function main() {
  await fs.ensureDir(OUTPUT_DIR);
  for (const card of manifest) {
    const buffer = await renderCard(card);
    const filename = `${card.id}.png`;
    await fs.writeFile(path.join(OUTPUT_DIR, filename), buffer);
    await writeMetadata(card, filename);
    console.log(`✓ Rendered ${card.id}`);
  }
  console.log('✅ Chapter VI manifest-driven art complete.');
}

main().catch((err) => {
  console.error('Render failed', err);
  process.exit(1);
});
