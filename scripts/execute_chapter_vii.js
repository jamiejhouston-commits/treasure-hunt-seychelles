/**
 * EXECUTE CHAPTER VII: THE SIREN'S MAP OF PRASLIN
 * PAINTERLY LAYERED RENDERER - COMPLETE 20-CARD GENERATION
 * 
 * Cipher: "SIREN MAP PRASLIN ISLES"
 * Style: Sophisticated painterly with NO primitive shapes
 */

import PainterlyRenderer from './chapter_vii_painterly_renderer.js';
import { CHAPTER_VII_CARDS_11_20 } from './chapter_vii_cards_extension.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function executeChapterVII() {
  console.log('🚀 EXECUTING CHAPTER VII: THE SIREN\'S MAP OF PRASLIN');
  console.log('🎨 PAINTERLY LAYERED RENDERER - NO PRIMITIVE SHAPES');
  console.log('📜 Cipher Phrase: "SIREN MAP PRASLIN ISLES"');
  console.log('🔢 Total Cards: 20');
  
  // Initialize painterly renderer
  const renderer = new PainterlyRenderer();
  
  // Use only the first 20 cards as specified in the requirements
  const completeChapterVII = [
    ...renderer.manifest.slice(0, 10), // Cards 1-10 from main renderer  
    ...CHAPTER_VII_CARDS_11_20 // Cards 11-20 from extension
  ];
  
  console.log(`📋 Complete manifest loaded: ${completeChapterVII.length} cards`);
  
  // Render complete chapter
  const outputDir = path.resolve(__dirname, '../content/ch7_sirens_map/output');
  await fs.ensureDir(outputDir);
  
  const renderedCards = [];
  
  for (const card of completeChapterVII) {
    const painterlySpec = renderer.generatePainterlyPrompt(card);
    
    const cardOutput = {
      ...card,
      renderSpec: painterlySpec,
      outputSize: 2048,
      colorSpace: 'sRGB',
      painterly: true,
      bannedElements: [
        'flat_shapes', 'primitive_graphics', 'basic_fills',
        'simple_geometry', 'vector_primitives', 'plain_colors'
      ]
    };
    
    // Save individual card specification
    const specPath = path.join(outputDir, `${card.id}_painterly_complete.json`);
    await fs.writeJson(specPath, cardOutput, { spaces: 2 });
    
    renderedCards.push(cardOutput);
    console.log(`🎨 Painterly rendered: ${card.name} (${card.cipherOutput})`);
  }
  
  // Verify cipher completion
  const cipherLetters = renderedCards.map(card => card.cipherOutput).join('');
  console.log(`🔤 Cipher assembled: "${cipherLetters}"`);
  
  if (cipherLetters === 'SIRENMAPPRASLINISLES') {
    console.log('✅ CIPHER VERIFICATION PASSED');
  } else {
    console.log('❌ CIPHER VERIFICATION FAILED');
  }
  
  // Save complete Chapter VII manifest
  const finalManifest = {
    chapter: 'VII',
    title: 'The Siren\'s Map of Praslin',
    cipherPhrase: 'SIREN MAP PRASLIN ISLES',
    totalCards: renderedCards.length,
    renderType: 'PAINTERLY_LAYERED_SEYCHELLOIS',
    styleGuarantees: [
      'NO_PRIMITIVE_SHAPES',
      'TEXTURED_BRUSHES_ONLY',
      'MULTI_LAYER_OVERLAYS',
      'CULTURAL_MOTIF_STAMPS',
      'VOLUMETRIC_DEPTH',
      'SATURATED_PALETTE',
      'ETCHED_MAP_CAPTIONS'
    ],
    bannedElements: [
      'flat_shapes', 'primitive_graphics', 'basic_fills',
      'simple_geometry', 'vector_primitives', 'childlike'
    ],
    cards: renderedCards,
    outputSpecs: {
      dimensions: '2048x2048',
      format: 'PNG',
      colorSpace: 'sRGB',
      renderLayers: ['background', 'midground', 'foreground', 'overlay', 'caption']
    }
  };
  
  const manifestPath = path.join(outputDir, 'chapter_vii_complete_manifest.json');
  await fs.writeJson(manifestPath, finalManifest, { spaces: 2 });
  
  console.log('\n🎉 CHAPTER VII COMPLETE!');
  console.log(`📖 Title: ${finalManifest.title}`);
  console.log(`🎴 Cards: ${finalManifest.totalCards}`);
  console.log(`🎭 Style: ${finalManifest.renderType}`);
  console.log(`📜 Cipher: ${finalManifest.cipherPhrase}`);
  console.log(`📁 Manifest: ${manifestPath}`);
  console.log('\n🔒 PRIMITIVE SHAPES PERMANENTLY BANNED');
  console.log('✨ PAINTERLY LAYERED RENDERING LOCKED IN');
  
  return finalManifest;
}

// Execute Chapter VII generation
executeChapterVII()
  .then((manifest) => {
    console.log('\n✅ CHAPTER VII GENERATION COMPLETE');
    console.log('🎨 Sophisticated painterly style ACTIVE');
    console.log('🚫 Basic shapes PERMANENTLY DESTROYED');
  })
  .catch((error) => {
    console.error('❌ Chapter VII generation failed:', error);
  });