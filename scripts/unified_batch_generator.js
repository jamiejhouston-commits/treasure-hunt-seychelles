import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';
import { ProfessionalRenderer, PALETTES, ART_STYLES, COMPOSITIONS } from './professional_batch_generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_SIZE = 2048;
const BASE_DIR = path.resolve(__dirname, '../content');

// Chapter configurations with unique themes and card definitions
const CHAPTERS = {
  chapter1: {
    slug: 'ch1',
    name: 'Mahé Manuscripts',
    description: 'Ancient documents reveal the first clues to Levasseur\'s treasure',
    tokenStart: 1,
    tokenEnd: 31,
    palette: 'chapter1',
    theme: 'scholarly',
    island: 'Mahé',
    cipher: 'MAHE',
    cards: [
      {
        tokenId: 1, slug: 'ch1_001', name: 'Port Victoria Archive',
        artStyle: 'ink_wash', composition: 'closeup_detail', cipherOutput: 'M',
        riddle: 'Where quill meets parchment in the harbor\'s first light.',
        description: 'Ancient maritime ledgers spread across a mahogany desk, their pages yellowed with age and salt spray. A brass compass rests atop charts of the Seychelles archipelago.',
        elements: ['map', 'compass', 'quill'], atmosphere: 'scholarly'
      },
      {
        tokenId: 2, slug: 'ch1_002', name: 'Governor\'s Seal',
        artStyle: 'oil_painting', composition: 'central_subject', cipherOutput: 'A',
        riddle: 'The crown\'s mark holds the second key.',
        description: 'A wax seal bearing the British colonial crest, pressed into crimson wax on an official document. Candlelight flickers across the intricate details.',
        elements: ['seal', 'candle', 'document'], atmosphere: 'formal'
      },
      {
        tokenId: 3, slug: 'ch1_003', name: 'Creole Chronicle',
        artStyle: 'watercolor', composition: 'discovery', cipherOutput: 'H',
        riddle: 'Local tongues speak what admiralty cannot.',
        description: 'Handwritten Creole text flows across handmade paper, revealing local knowledge passed down through generations of islanders.',
        elements: ['manuscript', 'palm_leaf'], atmosphere: 'intimate'
      },
      {
        tokenId: 4, slug: 'ch1_004', name: 'Ship Registry Fragment',
        artStyle: 'nautical_chart', composition: 'triangular', cipherOutput: 'E',
        riddle: 'The registry remembers what captains forgot.',
        description: 'Torn ship manifests list mysterious cargo and destinations, with one entry circled in faded ink: "Le Vasseur - Destination Unknown".',
        elements: ['ship_papers', 'ink_stain'], atmosphere: 'mysterious'
      }
      // Continue with 27 more cards to complete Mahé Manuscripts...
    ]
  },
  
  chapter2: {
    slug: 'ch2',
    name: 'Praslin\'s Prophecy',
    description: 'The mystical Vallée de Mai holds ancient secrets',
    tokenStart: 32,
    tokenEnd: 59,
    palette: 'chapter2',
    theme: 'mystical',
    island: 'Praslin',
    cipher: 'PRASLIN',
    cards: [
      {
        tokenId: 32, slug: 'ch2_001', name: 'Coco de Mer Oracle',
        artStyle: 'organic', composition: 'spiral_pattern', cipherOutput: 'P',
        riddle: 'The forbidden fruit speaks in riddles of stone.',
        description: 'A massive coco de mer nut splits open to reveal golden light emanating from within, surrounded by the primordial jungle of the Vallée de Mai.',
        elements: ['coco_de_mer', 'golden_light'], atmosphere: 'mystical'
      },
      {
        tokenId: 33, slug: 'ch2_002', name: 'Black Parrot\'s Warning',
        artStyle: 'stained_glass', composition: 'aerial_view', cipherOutput: 'R',
        riddle: 'The endemic cries thrice before dawn.',
        description: 'The rare Seychelles Black Parrot perches on an ancient takamaka tree, its obsidian feathers gleaming as it calls toward hidden paths.',
        elements: ['black_parrot', 'takamaka_tree'], atmosphere: 'wilderness'
      },
      {
        tokenId: 34, slug: 'ch2_003', name: 'Caiman Rouge Trail',
        artStyle: 'jungle_painting', composition: 'diagonal_flow', cipherOutput: 'A',
        riddle: 'Red earth marks the passage of ancients.',
        description: 'A narrow trail winds through dense jungle, marked by red clay soil and the ancient footprints of those who came before.',
        elements: ['jungle_path', 'red_clay'], atmosphere: 'ancient'
      }
      // Continue with 25 more cards to complete Praslin's Prophecy...
    ]
  },

  // Add more chapters following the same pattern...
  chapter6: {
    slug: 'ch6',
    name: 'La Digue\'s Secrets',
    description: 'Pink granite boulders hold the island\'s ancient mysteries',
    tokenStart: 241,
    tokenEnd: 268,
    palette: 'la_digue',
    theme: 'granite',
    island: 'La Digue',
    cipher: 'DIGUE',
    cards: [
      {
        tokenId: 241, slug: 'ch6_001', name: 'Anse Source d\'Argent',
        artStyle: 'geometric', composition: 'wide_landscape', cipherOutput: 'D',
        riddle: 'Where silver water meets pink stone.',
        description: 'Massive pink granite boulders frame a pristine beach, their ancient surfaces carved by millennia of wind and waves into cryptic patterns.',
        elements: ['pink_granite', 'silver_water'], atmosphere: 'pristine'
      }
      // Continue with more La Digue cards...
    ]
  }
};

// Professional card renderer
class ChapterCardRenderer {
  constructor(card, chapter) {
    this.card = card;
    this.chapter = chapter;
    this.canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
    this.palette = PALETTES[chapter.palette];
    this.artStyle = ART_STYLES[card.artStyle] || ART_STYLES.oil_painting;
    this.composition = COMPOSITIONS[card.composition] || COMPOSITIONS.central_subject;
    this.renderer = new ProfessionalRenderer(
      this.canvas,
      this.palette,
      this.artStyle,
      this.composition,
      card.slug
    );
  }

  async render() {
    const { renderer, card, chapter } = this;
    
    // Base environment setup
    switch (chapter.theme) {
      case 'scholarly':
        this.renderScholarlyScene();
        break;
      case 'mystical':
        this.renderMysticalScene();
        break;
      case 'granite':
        this.renderGraniteScene();
        break;
      case 'nautical':
        this.renderNauticalScene();
        break;
      default:
        this.renderDefaultScene();
    }

    // Add specific elements for this card
    if (card.elements) {
      renderer.renderTreasureElements(card.elements);
    }

    // Apply atmospheric effects
    if (card.atmosphere) {
      renderer.addAtmosphere(card.atmosphere);
    }

    // Add professional finishing touches
    renderer.addTitle(card.name);
    renderer.addVignette();
    renderer.addFilmGrain();

    return this.canvas.toBuffer('image/png');
  }

  renderScholarlyScene() {
    const { renderer } = this;
    
    // Warm, scholarly interior
    renderer.ctx.fillStyle = this.palette.colors.parchment;
    renderer.ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    
    // Add book shelves and study elements
    this.renderBookshelf();
    this.renderDesk();
    this.renderCandlelight();
  }

  renderMysticalScene() {
    const { renderer } = this;
    
    renderer.renderSky(0.7, 'mystical');
    renderer.renderLandscape('jungle');
    renderer.renderTreasureElements(['compass']);
    renderer.addAtmosphere('mist');
  }

  renderGraniteScene() {
    const { renderer } = this;
    
    renderer.renderSky(0.6, 'clear');
    renderer.renderWater(0.4);
    renderer.renderLandscape('granite');
    renderer.addAtmosphere('sparkles');
  }

  renderNauticalScene() {
    const { renderer } = this;
    
    renderer.renderSky(0.5, 'storm');
    renderer.renderWater(0.5);
    this.renderShip();
    renderer.addAtmosphere('rain');
  }

  renderDefaultScene() {
    const { renderer } = this;
    
    renderer.renderSky(0.6, 'dawn');
    renderer.renderWater(0.6);
    renderer.renderLandscape('beach');
    renderer.renderPalms(3);
  }

  renderBookshelf() {
    const { ctx } = this.renderer;
    
    ctx.save();
    ctx.fillStyle = this.palette.colors.sepia;
    
    // Vertical shelves
    for (let i = 0; i < 5; i++) {
      const y = 200 + i * 300;
      ctx.fillRect(100, y, OUTPUT_SIZE - 200, 40);
      
      // Books on shelves
      for (let j = 0; j < 15; j++) {
        const x = 120 + j * (OUTPUT_SIZE - 240) / 15;
        const height = 150 + Math.random() * 100;
        const width = 20 + Math.random() * 30;
        
        ctx.fillStyle = `hsl(${Math.random() * 60 + 15}, 60%, ${30 + Math.random() * 30}%)`;
        ctx.fillRect(x, y - height, width, height);
      }
    }
    
    ctx.restore();
  }

  renderDesk() {
    const { ctx } = this.renderer;
    
    ctx.save();
    ctx.fillStyle = this.palette.colors.rust;
    
    // Desk surface
    ctx.fillRect(200, OUTPUT_SIZE * 0.7, OUTPUT_SIZE - 400, 100);
    
    // Desk legs
    ctx.fillRect(220, OUTPUT_SIZE * 0.8, 40, 200);
    ctx.fillRect(OUTPUT_SIZE - 260, OUTPUT_SIZE * 0.8, 40, 200);
    
    ctx.restore();
  }

  renderCandlelight() {
    const { ctx } = this.renderer;
    const centerX = OUTPUT_SIZE * 0.3;
    const centerY = OUTPUT_SIZE * 0.65;
    
    // Candle flame glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
    gradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
    ctx.fill();
  }

  renderShip() {
    const { ctx } = this.renderer;
    const shipX = OUTPUT_SIZE * 0.3;
    const shipY = OUTPUT_SIZE * 0.6;
    
    ctx.save();
    
    // Ship hull
    ctx.fillStyle = this.palette.colors.midnight;
    ctx.beginPath();
    ctx.ellipse(shipX, shipY, 300, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Masts
    ctx.strokeStyle = this.palette.colors.rust;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(shipX, shipY - 200);
    ctx.lineTo(shipX, shipY);
    ctx.stroke();
    
    // Sails
    ctx.fillStyle = this.palette.colors.pearl;
    ctx.beginPath();
    ctx.moveTo(shipX, shipY - 200);
    ctx.lineTo(shipX + 150, shipY - 100);
    ctx.lineTo(shipX, shipY - 50);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
}

// Batch generation system
class BatchGenerator {
  constructor() {
    this.totalCards = 0;
    this.generatedCards = 0;
  }

  async generateChapter(chapterKey) {
    const chapter = CHAPTERS[chapterKey];
    if (!chapter) {
      throw new Error(`Chapter ${chapterKey} not found`);
    }

    console.log(`\n🏝️ Generating ${chapter.name} (${chapter.cards.length} cards)...`);
    
    const chapterDir = path.join(BASE_DIR, chapter.slug);
    const imagesDir = path.join(chapterDir, 'images');
    const metadataDir = path.join(chapterDir, 'metadata');
    
    await fs.ensureDir(imagesDir);
    await fs.ensureDir(metadataDir);

    for (const card of chapter.cards) {
      await this.generateCard(card, chapter, imagesDir, metadataDir);
      this.generatedCards++;
      
      const progress = ((this.generatedCards / this.totalCards) * 100).toFixed(1);
      console.log(`✅ Generated ${card.slug} - ${card.artStyle} (${progress}%)`);
    }

    console.log(`🎨 ${chapter.name} complete!`);
    return chapter.cards.length;
  }

  async generateCard(card, chapter, imagesDir, metadataDir) {
    // Generate artwork
    const renderer = new ChapterCardRenderer(card, chapter);
    const imageBuffer = await renderer.render();
    
    const imagePath = path.join(imagesDir, `${card.slug}.png`);
    await fs.writeFile(imagePath, imageBuffer);

    // Generate metadata
    const metadata = {
      name: card.name,
      description: card.description,
      image: `/${chapter.slug}/images/${card.slug}.png`,
      chapter: chapter.name,
      island: chapter.island,
      cipherOutput: card.cipherOutput,
      riddle: card.riddle,
      attributes: [
        { trait_type: 'Chapter', value: chapter.name },
        { trait_type: 'Island', value: chapter.island },
        { trait_type: 'Art Style', value: card.artStyle },
        { trait_type: 'Composition', value: card.composition },
        { trait_type: 'Theme', value: chapter.theme },
        { trait_type: 'Cipher Output', value: card.cipherOutput }
      ],
      properties: {
        chapter: chapter.name,
        tokenId: card.tokenId
      }
    };

    const metadataPath = path.join(metadataDir, `${card.slug}.json`);
    await fs.writeJson(metadataPath, metadata, { spaces: 2 });
  }

  async generateAllChapters() {
    console.log('🚀 LEVASSEUR TREASURE - PROFESSIONAL BATCH GENERATION');
    console.log('================================================');
    
    // Calculate total cards
    this.totalCards = Object.values(CHAPTERS).reduce((sum, chapter) => sum + chapter.cards.length, 0);
    console.log(`📊 Total cards to generate: ${this.totalCards}`);
    
    const startTime = Date.now();
    let totalGenerated = 0;

    for (const [chapterKey, chapter] of Object.entries(CHAPTERS)) {
      try {
        const count = await this.generateChapter(chapterKey);
        totalGenerated += count;
      } catch (error) {
        console.error(`❌ Failed to generate ${chapter.name}:`, error.message);
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    console.log('\n🎉 BATCH GENERATION COMPLETE!');
    console.log(`📊 Generated: ${totalGenerated} cards`);
    console.log(`⏱️ Duration: ${duration} seconds`);
    console.log(`🎨 All chapters now have professional, unique artwork!`);
  }

  async generateSingleChapter(chapterKey) {
    this.totalCards = CHAPTERS[chapterKey]?.cards.length || 0;
    return await this.generateChapter(chapterKey);
  }
}

// CLI interface
async function main() {
  const generator = new BatchGenerator();
  const args = process.argv.slice(2);

  if (args.length > 0) {
    const chapterKey = args[0];
    if (CHAPTERS[chapterKey]) {
      await generator.generateSingleChapter(chapterKey);
    } else {
      console.error(`❌ Chapter '${chapterKey}' not found`);
      console.log('Available chapters:', Object.keys(CHAPTERS).join(', '));
      process.exit(1);
    }
  } else {
    await generator.generateAllChapters();
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(err => {
    console.error('❌ Batch generation failed:', err);
    process.exit(1);
  });
}

export { BatchGenerator, CHAPTERS, ChapterCardRenderer };