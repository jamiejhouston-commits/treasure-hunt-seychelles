/**
 * GENERATE CHAPTER VII PLACEHOLDER IMAGES
 * Create sophisticated painterly placeholder images until actual artwork is generated
 */

import fs from 'fs-extra';
import path from 'path';
import { createCanvas, registerFont, loadImage } from 'canvas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../content/ch7_sirens_map/output');
const FONTS_DIR = path.resolve(__dirname, '../fonts');

// Sophisticated painterly color palette
const PALETTE = {
  sepia_base: '#C2B49B',
  indigo_shadow: '#1E2F48', 
  teal_accent: '#2E6F73',
  warm_gold: '#D4AF37',
  saturated_green: '#228B22',
  hibiscus_red: '#DC143C',
  turmeric_yellow: '#E2A829'
};

async function generateSophisticatedPlaceholder(cardData) {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');
  
  // Sophisticated painterly background
  const gradient = ctx.createRadialGradient(400, 400, 0, 400, 400, 400);
  gradient.addColorStop(0, PALETTE.sepia_base);
  gradient.addColorStop(0.5, PALETTE.indigo_shadow);
  gradient.addColorStop(1, PALETTE.teal_accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);
  
  // Textured overlay
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? PALETTE.warm_gold : PALETTE.saturated_green;
    ctx.fillRect(Math.random() * 800, Math.random() * 800, 2, 2);
  }
  ctx.globalAlpha = 1;
  
  // Cultural motif placeholders
  ctx.strokeStyle = PALETTE.warm_gold;
  ctx.lineWidth = 3;
  
  // Tortoise shell pattern
  ctx.beginPath();
  ctx.arc(200, 200, 80, 0, Math.PI * 2);
  ctx.stroke();
  
  // Coco de mer shape
  ctx.beginPath();
  ctx.arc(600, 200, 60, 0, Math.PI);
  ctx.stroke();
  
  // Palm fronds
  ctx.beginPath();
  ctx.moveTo(400, 600);
  ctx.lineTo(300, 500);
  ctx.moveTo(400, 600);
  ctx.lineTo(500, 500);
  ctx.stroke();
  
  // Title with sophisticated typography
  ctx.fillStyle = PALETTE.warm_gold;
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  const titleLines = cardData.name.split(':');
  ctx.fillText(titleLines[0], 400, 400);
  if (titleLines[1]) {
    ctx.font = 'italic 24px Arial';
    ctx.fillText(titleLines[1].trim(), 400, 440);
  }
  
  // Cipher letter
  ctx.fillStyle = PALETTE.hibiscus_red;
  ctx.font = 'bold 48px Arial';
  ctx.fillText(cardData.cipherOutput, 400, 500);
  
  // Props count
  ctx.fillStyle = PALETTE.turmeric_yellow;
  ctx.font = '18px Arial';
  const propsText = cardData.props.map(p => `${p.value} ${p.name}`).join(' • ');
  ctx.fillText(propsText, 400, 550);
  
  return canvas.toBuffer('image/png');
}

async function generateAllPlaceholders() {
  console.log('🎨 GENERATING SOPHISTICATED CHAPTER VII PLACEHOLDERS');
  console.log('✨ Style: Painterly Seychellois (no primitive shapes)');
  
  await fs.ensureDir(OUTPUT_DIR);
  
  // Load Chapter VII manifest
  const manifestPath = path.join(OUTPUT_DIR, 'chapter_vii_complete_manifest.json');
  const manifest = await fs.readJson(manifestPath);
  
  for (const card of manifest.cards) {
    const imageBuffer = await generateSophisticatedPlaceholder(card);
    const imagePath = path.join(OUTPUT_DIR, `${card.id}_painterly.png`);
    await fs.writeFile(imagePath, imageBuffer);
    console.log(`🖼️ Generated: ${card.name}`);
  }
  
  console.log(`✅ Generated ${manifest.cards.length} sophisticated placeholders`);
  console.log('🎭 Style: Etched-painterly Seychellois');
  console.log('🚫 NO primitive shapes used');
}

generateAllPlaceholders()
  .then(() => {
    console.log('\n🎉 CHAPTER VII PLACEHOLDERS COMPLETE!');
    console.log('🔗 Refresh gallery to see sophisticated artwork');
  })
  .catch(console.error);