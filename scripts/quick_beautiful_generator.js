import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';
import seedrandom from 'seedrandom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_SIZE = 2048;

// Quick, beautiful NFT generator for immediate high-quality results
class QuickProfessionalGenerator {
  constructor(seed) {
    this.rng = seedrandom(seed);
  }

  generateCard(tokenId, chapterInfo, cardData) {
    const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
    const ctx = canvas.getContext('2d');
    
    // Professional color palette based on chapter
    const palette = this.getPalette(chapterInfo.theme);
    
    // Render beautiful, unique artwork
    this.renderBackground(ctx, palette, cardData.style);
    this.renderMainElements(ctx, palette, cardData);
    this.addAtmosphericEffects(ctx, palette);
    this.addTitle(ctx, cardData.name, palette);
    this.addProfessionalFinishing(ctx);
    
    return canvas.toBuffer('image/png');
  }

  getPalette(theme) {
    const palettes = {
      scholarly: {
        primary: '#f8e3c0',    // Warm parchment
        secondary: '#8b7355',   // Rich sepia
        accent: '#d4af37',      // Golden highlight
        dark: '#1a1a1a',        // Deep ink
        light: '#f5f5f5'        // Soft white
      },
      mystical: {
        primary: '#2d1b69',     // Deep mystical purple
        secondary: '#50c878',   // Magical emerald
        accent: '#ffd700',      // Mystical gold
        dark: '#1a0f2e',        // Dark void
        light: '#e8e8ff'        // Ethereal light
      },
      nautical: {
        primary: '#1e3a8a',     // Deep ocean blue
        secondary: '#0891b2',   // Seafoam
        accent: '#f59e0b',      // Brass/gold
        dark: '#0c1821',        // Deep water
        light: '#f0f9ff'        // Sea foam white
      },
      granite: {
        primary: '#ffc0cb',     // Pink granite
        secondary: '#40e0d0',   // Turquoise lagoon
        accent: '#ff6b6b',      // Coral accent
        dark: '#2c1810',        // Dark stone
        light: '#fff8f0'        // Warm white
      },
      treasure: {
        primary: '#8b4513',     // Rich wood
        secondary: '#cd853f',   // Sandy gold
        accent: '#ffd700',      // Pure gold
        dark: '#2f1b14',        // Dark wood
        light: '#fff8dc'        // Cream
      }
    };
    
    return palettes[theme] || palettes.treasure;
  }

  renderBackground(ctx, palette, style) {
    // Create sophisticated gradient backgrounds
    const gradient = ctx.createLinearGradient(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    
    switch (style) {
      case 'sunset':
        gradient.addColorStop(0, '#ff7f50');
        gradient.addColorStop(0.5, '#ff6b6b');
        gradient.addColorStop(1, '#4ecdc4');
        break;
      case 'underwater':
        gradient.addColorStop(0, '#006994');
        gradient.addColorStop(0.5, '#0891b2');
        gradient.addColorStop(1, '#065f46');
        break;
      case 'mystical':
        gradient.addColorStop(0, palette.primary);
        gradient.addColorStop(0.7, palette.secondary);
        gradient.addColorStop(1, palette.dark);
        break;
      default:
        gradient.addColorStop(0, palette.light);
        gradient.addColorStop(0.6, palette.primary);
        gradient.addColorStop(1, palette.secondary);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    
    // Add texture
    this.addBackgroundTexture(ctx, palette);
  }

  addBackgroundTexture(ctx, palette) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = this.rng() > 0.5 ? palette.light : palette.dark;
      ctx.fillRect(
        this.rng() * OUTPUT_SIZE,
        this.rng() * OUTPUT_SIZE,
        2 + this.rng() * 3,
        2 + this.rng() * 3
      );
    }
    
    ctx.restore();
  }

  renderMainElements(ctx, palette, cardData) {
    // Create unique focal elements for each card
    const elements = cardData.elements || ['treasure', 'compass', 'map'];
    
    elements.forEach((element, index) => {
      const x = OUTPUT_SIZE * (0.2 + index * 0.3);
      const y = OUTPUT_SIZE * (0.3 + this.rng() * 0.4);
      
      this.renderElement(ctx, palette, element, x, y);
    });
    
    // Add decorative border
    this.renderDecorativeBorder(ctx, palette);
  }

  renderElement(ctx, palette, element, x, y) {
    ctx.save();
    
    switch (element) {
      case 'treasure':
        this.renderTreasureChest(ctx, palette, x, y);
        break;
      case 'compass':
        this.renderCompass(ctx, palette, x, y);
        break;
      case 'map':
        this.renderMapFragment(ctx, palette, x, y);
        break;
      case 'skull':
        this.renderSkull(ctx, palette, x, y);
        break;
      case 'ship':
        this.renderShip(ctx, palette, x, y);
        break;
      case 'palm':
        this.renderPalmTree(ctx, palette, x, y);
        break;
      case 'crystal':
        this.renderCrystal(ctx, palette, x, y);
        break;
      default:
        this.renderGenericTreasure(ctx, palette, x, y);
    }
    
    ctx.restore();
  }

  renderTreasureChest(ctx, palette, x, y) {
    const size = 80 + this.rng() * 60;
    
    // Chest base
    ctx.fillStyle = palette.secondary;
    ctx.fillRect(x - size, y, size * 2, size);
    
    // Chest lid
    ctx.fillStyle = palette.primary;
    ctx.beginPath();
    ctx.arc(x, y, size, Math.PI, 0);
    ctx.fill();
    
    // Gold bands
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 8;
    ctx.strokeRect(x - size, y, size * 2, size);
    
    // Scattered coins
    ctx.fillStyle = palette.accent;
    for (let i = 0; i < 12; i++) {
      const coinX = x + (this.rng() - 0.5) * size * 3;
      const coinY = y + size + this.rng() * 40;
      ctx.beginPath();
      ctx.arc(coinX, coinY, 6 + this.rng() * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderCompass(ctx, palette, x, y) {
    const radius = 50 + this.rng() * 30;
    
    // Compass face
    ctx.fillStyle = palette.light;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Compass rim
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Direction markers
    ctx.fillStyle = palette.dark;
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('N', x, y - radius + 20);
    ctx.fillText('S', x, y + radius - 20);
    ctx.fillText('E', x + radius - 20, y);
    ctx.fillText('W', x - radius + 20, y);
    
    // Compass needle
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y - radius/2);
    ctx.lineTo(x, y + radius/2);
    ctx.stroke();
  }

  renderMapFragment(ctx, palette, x, y) {
    const w = 120 + this.rng() * 80;
    const h = 80 + this.rng() * 60;
    
    // Parchment base
    ctx.fillStyle = palette.primary;
    ctx.strokeStyle = palette.secondary;
    ctx.lineWidth = 3;
    
    // Irregular shape for aged look
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w * 0.9, y + this.rng() * 20);
    ctx.lineTo(x + w, y + h * 0.8);
    ctx.lineTo(x + w * 0.2, y + h);
    ctx.lineTo(x + this.rng() * 30, y + h * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Map markings
    ctx.strokeStyle = palette.dark;
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + h/3);
    ctx.quadraticCurveTo(x + w/2, y + h * 0.6, x + w * 0.8, y + h/2);
    ctx.stroke();
    
    // X marks the spot
    ctx.setLineDash([]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.7, y + h * 0.4);
    ctx.lineTo(x + w * 0.85, y + h * 0.6);
    ctx.moveTo(x + w * 0.85, y + h * 0.4);
    ctx.lineTo(x + w * 0.7, y + h * 0.6);
    ctx.stroke();
  }

  renderSkull(ctx, palette, x, y) {
    const size = 40 + this.rng() * 20;
    
    // Skull shape
    ctx.fillStyle = palette.light;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye sockets
    ctx.fillStyle = palette.dark;
    ctx.beginPath();
    ctx.ellipse(x - size * 0.3, y - size * 0.2, size * 0.2, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + size * 0.3, y - size * 0.2, size * 0.2, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nasal opening
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.1, size * 0.1, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  renderShip(ctx, palette, x, y) {
    const length = 150 + this.rng() * 100;
    
    // Ship hull
    ctx.fillStyle = palette.secondary;
    ctx.beginPath();
    ctx.ellipse(x, y, length, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mast
    ctx.strokeStyle = palette.dark;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x, y - 120);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Sail
    ctx.fillStyle = palette.light;
    ctx.beginPath();
    ctx.moveTo(x, y - 120);
    ctx.lineTo(x + 80, y - 60);
    ctx.lineTo(x, y - 20);
    ctx.closePath();
    ctx.fill();
  }

  renderPalmTree(ctx, palette, x, y) {
    const height = 150 + this.rng() * 100;
    
    // Trunk
    ctx.strokeStyle = palette.secondary;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + this.rng() * 60 - 30, y - height/2, x + this.rng() * 40 - 20, y - height);
    ctx.stroke();
    
    // Fronds
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 12;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const frondLength = 80 + this.rng() * 40;
      ctx.beginPath();
      ctx.moveTo(x, y - height);
      ctx.lineTo(
        x + Math.cos(angle - Math.PI/2) * frondLength,
        y - height + Math.sin(angle - Math.PI/2) * frondLength
      );
      ctx.stroke();
    }
  }

  renderCrystal(ctx, palette, x, y) {
    const size = 60 + this.rng() * 40;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.rng() * Math.PI * 2);
    
    // Crystal facets
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, -size * 0.3);
    ctx.lineTo(size * 0.8, size * 0.5);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.8, size * 0.5);
    ctx.lineTo(-size * 0.6, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Crystal shine
    ctx.fillStyle = palette.light;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.3, -size * 0.6);
    ctx.lineTo(size * 0.2, size * 0.2);
    ctx.lineTo(0, size);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  renderGenericTreasure(ctx, palette, x, y) {
    // Fallback: render coins and gems
    for (let i = 0; i < 8; i++) {
      const itemX = x + (this.rng() - 0.5) * 100;
      const itemY = y + (this.rng() - 0.5) * 100;
      const size = 8 + this.rng() * 12;
      
      ctx.fillStyle = this.rng() > 0.5 ? palette.accent : palette.secondary;
      ctx.beginPath();
      ctx.arc(itemX, itemY, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderDecorativeBorder(ctx, palette) {
    ctx.save();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 12;
    
    // Corner decorations
    const cornerSize = 80;
    const corners = [
      [cornerSize, cornerSize],
      [OUTPUT_SIZE - cornerSize, cornerSize],
      [OUTPUT_SIZE - cornerSize, OUTPUT_SIZE - cornerSize],
      [cornerSize, OUTPUT_SIZE - cornerSize]
    ];
    
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.stroke();
      
      // Decorative lines
      ctx.beginPath();
      ctx.moveTo(x - 50, y);
      ctx.lineTo(x + 50, y);
      ctx.moveTo(x, y - 50);
      ctx.lineTo(x, y + 50);
      ctx.stroke();
    });
    
    ctx.restore();
  }

  addAtmosphericEffects(ctx, palette) {
    // Add magical sparkles
    ctx.save();
    ctx.fillStyle = palette.accent;
    
    for (let i = 0; i < 50; i++) {
      const x = this.rng() * OUTPUT_SIZE;
      const y = this.rng() * OUTPUT_SIZE;
      const size = 2 + this.rng() * 6;
      
      // Star shape
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.rng() * Math.PI * 2);
      
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.3, -size * 0.3);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.3, size * 0.3);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.3, size * 0.3);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size * 0.3, -size * 0.3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
    
    ctx.restore();
  }

  addTitle(ctx, title, palette) {
    ctx.save();
    
    // Title background
    const gradient = ctx.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, OUTPUT_SIZE, 120);
    
    // Title text
    ctx.fillStyle = palette.accent;
    ctx.font = 'bold 72px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // Handle long titles
    if (title.length > 20) {
      ctx.font = 'bold 56px serif';
    }
    if (title.length > 30) {
      ctx.font = 'bold 48px serif';
    }
    
    ctx.fillText(title, OUTPUT_SIZE / 2, 60);
    
    ctx.restore();
  }

  addProfessionalFinishing(ctx) {
    // Subtle vignette
    const vignette = ctx.createRadialGradient(
      OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE * 0.3,
      OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE * 0.8
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    
    // Film grain
    ctx.save();
    for (let i = 0; i < 800; i++) {
      const alpha = this.rng() * 0.08;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(this.rng() * OUTPUT_SIZE, this.rng() * OUTPUT_SIZE, 1, 1);
    }
    ctx.restore();
  }
}

// Generate complete chapter with beautiful cards
async function generateBeautifulChapter(chapterName, cardCount = 20, theme = 'treasure') {
  console.log(`🎨 Generating ${cardCount} beautiful ${chapterName} cards...`);
  
  const chapterSlug = chapterName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const baseDir = path.resolve(__dirname, '../content');
  const chapterDir = path.join(baseDir, chapterSlug);
  const imagesDir = path.join(chapterDir, 'images');
  const metadataDir = path.join(chapterDir, 'metadata');
  
  await fs.ensureDir(imagesDir);
  await fs.ensureDir(metadataDir);
  
  const generator = new QuickProfessionalGenerator('beautiful_' + chapterSlug);
  
  // Art styles to cycle through
  const artStyles = ['sunset', 'underwater', 'mystical', 'treasure', 'granite'];
  const elementSets = [
    ['treasure', 'compass', 'map'],
    ['skull', 'ship', 'crystal'],
    ['palm', 'treasure', 'compass'],
    ['map', 'crystal', 'ship'],
    ['compass', 'skull', 'palm']
  ];
  
  for (let i = 1; i <= cardCount; i++) {
    const tokenId = i;
    const slug = `${chapterSlug}_${i.toString().padStart(3, '0')}`;
    
    const cardData = {
      name: `${chapterName} Card ${i}`,
      style: artStyles[i % artStyles.length],
      elements: elementSets[i % elementSets.length]
    };
    
    const chapterInfo = {
      name: chapterName,
      theme: theme
    };
    
    // Generate artwork
    const imageBuffer = generator.generateCard(tokenId, chapterInfo, cardData);
    const imagePath = path.join(imagesDir, `${slug}.png`);
    await fs.writeFile(imagePath, imageBuffer);
    
    // Generate metadata
    const metadata = {
      name: cardData.name,
      description: `A beautifully crafted treasure card from ${chapterName}, featuring unique artwork and professional composition.`,
      image: `/${chapterSlug}/images/${slug}.png`,
      chapter: chapterName,
      attributes: [
        { trait_type: 'Chapter', value: chapterName },
        { trait_type: 'Art Style', value: cardData.style },
        { trait_type: 'Theme', value: theme },
        { trait_type: 'Card Number', value: i }
      ],
      properties: {
        tokenId: tokenId,
        chapter: chapterName
      }
    };
    
    const metadataPath = path.join(metadataDir, `${slug}.json`);
    await fs.writeJson(metadataPath, metadata, { spaces: 2 });
    
    console.log(`✅ Generated ${slug} - ${cardData.style} style`);
  }
  
  console.log(`🎉 ${chapterName} complete! (${cardCount} professional cards)`);
}

// Export for use in other scripts
export { QuickProfessionalGenerator, generateBeautifulChapter };

// CLI usage
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  const chapterName = args[0] || 'Test Chapter';
  const cardCount = parseInt(args[1]) || 20;
  const theme = args[2] || 'treasure';
  
  generateBeautifulChapter(chapterName, cardCount, theme).catch(console.error);
}