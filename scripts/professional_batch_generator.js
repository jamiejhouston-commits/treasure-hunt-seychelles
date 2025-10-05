import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';
import seedrandom from 'seedrandom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_SIZE = 2048;
const BASE_DIR = path.resolve(__dirname, '../content');

// Professional color palettes for each chapter theme
const PALETTES = {
  chapter1: {
    name: 'Mahé Manuscripts',
    colors: {
      parchment: '#f8e3c0',
      ink: '#1a1a1a',
      gold: '#d4af37',
      sepia: '#8b7355',
      rust: '#b7410e',
      sage: '#87a96b',
      midnight: '#2c3e50'
    }
  },
  chapter2: {
    name: 'Praslin\'s Prophecy',
    colors: {
      emerald: '#50c878',
      jade: '#00a86b',
      forest: '#355e3b',
      palm: '#8fbc8f',
      coral: '#ff6b6b',
      sand: '#f4d03f',
      azure: '#007fff'
    }
  },
  chapter3: {
    name: 'VASA Expedition',
    colors: {
      naval: '#1e3a8a',
      copper: '#b87333',
      brass: '#b5651d',
      ocean: '#006994',
      storm: '#4b5563',
      pearl: '#f8f8ff',
      anchor: '#2c3e50'
    }
  },
  chapter4: {
    name: 'Witch-Winds of Mahé',
    colors: {
      mystical: '#6b46c1',
      mist: '#e5e7eb',
      shadow: '#374151',
      moon: '#f1f5f9',
      spell: '#8b5cf6',
      crystal: '#a78bfa',
      void: '#1f2937'
    }
  },
  chapter5: {
    name: 'Cerf Island Shadows',
    colors: {
      dawn: '#ffd78b',
      ember: '#ff7b4f',
      surf: '#6fd1c7',
      moss: '#9bcf6d',
      coral: '#f25c5c',
      midnight: '#0a1324',
      gold: '#e8c36a'
    }
  },
  la_digue: {
    name: 'La Digue\'s Secrets',
    colors: {
      granite: '#8d7053',
      pink: '#ffc0cb',
      turquoise: '#40e0d0',
      vanilla: '#f3e5ab',
      coconut: '#ede0d4',
      hibiscus: '#dc143c',
      lagoon: '#008080'
    }
  },
  outer_islands: {
    name: 'Outer Islands Revelation',
    colors: {
      atoll: '#b0e0e6',
      deep: '#191970',
      pearl: '#f0f8ff',
      reef: '#ff7f50',
      current: '#4682b4',
      abyss: '#000080',
      phosphor: '#00ffff'
    }
  }
};

// Art style configurations
const ART_STYLES = {
  // Detailed realistic styles
  oil_painting: {
    brushStrokes: true,
    texture: 'canvas',
    blending: 'soft',
    detail: 'high'
  },
  watercolor: {
    bleeding: true,
    transparency: true,
    texture: 'paper',
    detail: 'medium'
  },
  ink_wash: {
    contrast: 'high',
    flowing: true,
    monochrome: false,
    detail: 'high'
  },
  
  // Stylized approaches  
  geometric: {
    shapes: 'angular',
    patterns: true,
    symmetry: true,
    detail: 'medium'
  },
  organic: {
    shapes: 'flowing',
    natural: true,
    growth: 'spiral',
    detail: 'high'
  },
  
  // Thematic styles
  nautical_chart: {
    grid: true,
    compass: true,
    measurements: true,
    detail: 'technical'
  },
  cave_painting: {
    primitive: true,
    earthTones: true,
    symbolic: true,
    detail: 'stylized'
  },
  stained_glass: {
    leadLines: true,
    colorBlocks: true,
    light: 'dramatic',
    detail: 'medium'
  }
};

// Composition templates for variety
const COMPOSITIONS = {
  // Perspectives
  closeup_detail: { zoom: 'macro', focus: 'center', depth: 'shallow' },
  wide_landscape: { zoom: 'wide', focus: 'horizon', depth: 'deep' },
  aerial_view: { zoom: 'bird', focus: 'pattern', depth: 'flat' },
  underwater: { zoom: 'medium', focus: 'floating', depth: 'filtered' },
  cave_interior: { zoom: 'enclosed', focus: 'light_source', depth: 'dramatic' },
  
  // Arrangements
  central_subject: { layout: 'radial', emphasis: 'single', balance: 'symmetric' },
  diagonal_flow: { layout: 'diagonal', emphasis: 'movement', balance: 'dynamic' },
  triangular: { layout: 'triangle', emphasis: 'stability', balance: 'classic' },
  spiral_pattern: { layout: 'spiral', emphasis: 'energy', balance: 'flowing' },
  
  // Narrative
  action_scene: { story: 'moment', tension: 'high', time: 'frozen' },
  contemplative: { story: 'mood', tension: 'low', time: 'eternal' },
  discovery: { story: 'revelation', tension: 'building', time: 'threshold' },
  mystery: { story: 'hidden', tension: 'suspense', time: 'unknown' }
};

// Professional rendering framework
class ProfessionalRenderer {
  constructor(canvas, palette, artStyle, composition, seed) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.palette = palette;
    this.style = artStyle;
    this.composition = composition;
    this.rng = seedrandom(seed);
    this.width = OUTPUT_SIZE;
    this.height = OUTPUT_SIZE;
  }

  // Foundation rendering methods
  renderSky(horizon = 0.6, weather = 'clear') {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height * horizon);
    
    switch (weather) {
      case 'dawn':
        gradient.addColorStop(0, this.palette.colors.dawn || '#ffd78b');
        gradient.addColorStop(1, this.palette.colors.azure || '#87ceeb');
        break;
      case 'storm':
        gradient.addColorStop(0, this.palette.colors.storm || '#4b5563');
        gradient.addColorStop(1, this.palette.colors.midnight || '#1f2937');
        break;
      case 'mystical':
        gradient.addColorStop(0, this.palette.colors.mystical || '#6b46c1');
        gradient.addColorStop(1, this.palette.colors.void || '#1f2937');
        break;
      default:
        gradient.addColorStop(0, this.palette.colors.azure || '#87ceeb');
        gradient.addColorStop(1, this.palette.colors.ocean || '#006994');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height * horizon);
  }

  renderWater(startY = 0.6) {
    const gradient = this.ctx.createLinearGradient(0, this.height * startY, 0, this.height);
    gradient.addColorStop(0, this.palette.colors.surf || '#6fd1c7');
    gradient.addColorStop(0.5, this.palette.colors.ocean || '#006994');
    gradient.addColorStop(1, this.palette.colors.deep || '#191970');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, this.height * startY, this.width, this.height * (1 - startY));
    
    // Add wave patterns
    this.addWavePatterns(startY);
  }

  addWavePatterns(startY) {
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < 8; i++) {
      this.ctx.beginPath();
      const y = this.height * startY + i * 40;
      for (let x = 0; x <= this.width; x += 20) {
        const waveHeight = Math.sin((x * 0.02) + (i * 0.5)) * 8;
        if (x === 0) this.ctx.moveTo(x, y + waveHeight);
        else this.ctx.lineTo(x, y + waveHeight);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderLandscape(type = 'beach') {
    switch (type) {
      case 'beach':
        this.renderBeachLandscape();
        break;
      case 'granite':
        this.renderGraniteLandscape();
        break;
      case 'jungle':
        this.renderJungleLandscape();
        break;
      case 'cave':
        this.renderCaveLandscape();
        break;
      default:
        this.renderBeachLandscape();
    }
  }

  renderBeachLandscape() {
    // Sand beach with natural curve
    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(0, this.height * 0.7, 0, this.height);
    gradient.addColorStop(0, this.palette.colors.sand || '#f4d03f');
    gradient.addColorStop(1, this.palette.colors.parchment || '#f8e3c0');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height * 0.72);
    
    // Natural beach curve
    for (let x = 0; x <= this.width; x += 50) {
      const curve = Math.sin(x * 0.008) * 30;
      this.ctx.lineTo(x, this.height * 0.72 + curve);
    }
    
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add sand texture
    this.addSandTexture();
    this.ctx.restore();
  }

  renderGraniteLandscape() {
    this.ctx.save();
    this.ctx.fillStyle = this.palette.colors.granite || '#8d7053';
    
    // Create rocky, angular coastline
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height * 0.65);
    
    const points = [
      [0.2, 0.55], [0.35, 0.62], [0.5, 0.48], 
      [0.68, 0.58], [0.82, 0.52], [1.0, 0.6]
    ];
    
    points.forEach(([x, y]) => {
      this.ctx.lineTo(this.width * x, this.height * y);
    });
    
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add granite texture
    this.addGraniteTexture();
    this.ctx.restore();
  }

  renderJungleLandscape() {
    // Multi-layered jungle with depth
    const layers = [
      { y: 0.45, color: this.palette.colors.forest || '#355e3b', opacity: 0.6 },
      { y: 0.55, color: this.palette.colors.jade || '#00a86b', opacity: 0.7 },
      { y: 0.65, color: this.palette.colors.emerald || '#50c878', opacity: 0.8 },
      { y: 0.75, color: this.palette.colors.palm || '#8fbc8f', opacity: 0.9 }
    ];
    
    layers.forEach(layer => {
      this.ctx.save();
      this.ctx.globalAlpha = layer.opacity;
      this.ctx.fillStyle = layer.color;
      
      // Organic tree line
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height);
      this.ctx.lineTo(0, this.height * layer.y);
      
      for (let x = 0; x <= this.width; x += 30) {
        const treeHeight = Math.random() * 100 + 50;
        const y = this.height * layer.y - treeHeight * Math.random();
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.lineTo(this.width, this.height);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  renderCaveLandscape() {
    // Dark cave interior with light source
    this.ctx.save();
    this.ctx.fillStyle = this.palette.colors.void || '#1f2937';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Cave opening with light
    const lightGradient = this.ctx.createRadialGradient(
      this.width * 0.5, this.height * 0.3, 0,
      this.width * 0.5, this.height * 0.3, this.width * 0.4
    );
    lightGradient.addColorStop(0, this.palette.colors.pearl || '#f8f8ff');
    lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    this.ctx.fillStyle = lightGradient;
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.5, this.height * 0.3, this.width * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  addSandTexture() {
    for (let i = 0; i < 3000; i++) {
      const x = this.rng() * this.width;
      const y = this.height * 0.7 + this.rng() * this.height * 0.3;
      const size = 1 + this.rng() * 2;
      const opacity = 0.1 + this.rng() * 0.3;
      
      this.ctx.fillStyle = `rgba(200, 180, 140, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  addGraniteTexture() {
    // Speckled granite pattern
    for (let i = 0; i < 1000; i++) {
      const x = this.rng() * this.width;
      const y = this.height * 0.45 + this.rng() * this.height * 0.55;
      const size = 2 + this.rng() * 6;
      
      const colors = ['#a0865c', '#6b5b47', '#d4a574', '#8b7963'];
      this.ctx.fillStyle = colors[Math.floor(this.rng() * colors.length)];
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Decorative elements
  renderPalms(count = 5) {
    this.ctx.save();
    for (let i = 0; i < count; i++) {
      const x = (this.width / (count + 1)) * (i + 1) + (this.rng() - 0.5) * 200;
      const baseY = this.height * (0.65 + this.rng() * 0.1);
      const height = 200 + this.rng() * 150;
      
      // Trunk
      this.ctx.strokeStyle = this.palette.colors.forest || '#355e3b';
      this.ctx.lineWidth = 15 + this.rng() * 10;
      this.ctx.lineCap = 'round';
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, baseY);
      this.ctx.quadraticCurveTo(
        x + (this.rng() - 0.5) * 80, 
        baseY - height * 0.6, 
        x + (this.rng() - 0.5) * 30, 
        baseY - height
      );
      this.ctx.stroke();
      
      // Fronds
      for (let f = 0; f < 8; f++) {
        const angle = (Math.PI * 2 * f) / 8 + this.rng() * 0.5;
        const length = 80 + this.rng() * 60;
        
        this.ctx.strokeStyle = this.palette.colors.palm || '#8fbc8f';
        this.ctx.lineWidth = 8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, baseY - height);
        this.ctx.lineTo(
          x + Math.cos(angle - Math.PI/2) * length,
          baseY - height + Math.sin(angle - Math.PI/2) * length
        );
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  renderTreasureElements(elements = ['chest', 'compass', 'map']) {
    elements.forEach(element => {
      switch (element) {
        case 'chest':
          this.renderTreasureChest();
          break;
        case 'compass':
          this.renderCompass();
          break;
        case 'map':
          this.renderMapFragment();
          break;
        case 'skull':
          this.renderSkull();
          break;
        case 'coins':
          this.renderScatteredCoins();
          break;
      }
    });
  }

  renderTreasureChest() {
    const x = this.width * (0.6 + this.rng() * 0.3);
    const y = this.height * (0.7 + this.rng() * 0.2);
    const size = 60 + this.rng() * 40;
    
    this.ctx.save();
    // Chest body
    this.ctx.fillStyle = this.palette.colors.rust || '#b7410e';
    this.ctx.fillRect(x - size, y - size/2, size * 2, size * 1.2);
    
    // Chest lid (curved)
    this.ctx.fillStyle = this.palette.colors.copper || '#b87333';
    this.ctx.beginPath();
    this.ctx.arc(x, y - size/2, size, Math.PI, 0);
    this.ctx.fill();
    
    // Gold details
    this.ctx.fillStyle = this.palette.colors.gold || '#d4af37';
    this.ctx.fillRect(x - 8, y - size/2, 16, size * 1.2);
    
    // Scattered coins
    for (let i = 0; i < 8; i++) {
      const coinX = x + (this.rng() - 0.5) * size * 3;
      const coinY = y + size/2 + this.rng() * 30;
      this.ctx.beginPath();
      this.ctx.arc(coinX, coinY, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  renderCompass() {
    const x = this.width * (0.1 + this.rng() * 0.8);
    const y = this.height * (0.1 + this.rng() * 0.8);
    const radius = 40 + this.rng() * 30;
    
    this.ctx.save();
    
    // Compass circle
    this.ctx.strokeStyle = this.palette.colors.brass || '#b5651d';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Compass points
    this.ctx.fillStyle = this.palette.colors.gold || '#d4af37';
    this.ctx.font = 'bold 24px serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    this.ctx.fillText('N', x, y - radius + 20);
    this.ctx.fillText('S', x, y + radius - 20);
    this.ctx.fillText('E', x + radius - 20, y);
    this.ctx.fillText('W', x - radius + 20, y);
    
    // Compass needle
    this.ctx.strokeStyle = this.palette.colors.ink || '#1a1a1a';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - radius/2);
    this.ctx.lineTo(x, y + radius/2);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  renderMapFragment() {
    const x = this.width * (0.2 + this.rng() * 0.6);
    const y = this.height * (0.2 + this.rng() * 0.6);
    const w = 150 + this.rng() * 100;
    const h = 100 + this.rng() * 80;
    
    this.ctx.save();
    
    // Parchment background
    this.ctx.fillStyle = this.palette.colors.parchment || '#f8e3c0';
    this.ctx.strokeStyle = this.palette.colors.sepia || '#8b7355';
    this.ctx.lineWidth = 3;
    
    // Torn edges effect
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + w * 0.9, y + this.rng() * 20);
    this.ctx.lineTo(x + w, y + h * 0.8);
    this.ctx.lineTo(x + w * 0.1, y + h);
    this.ctx.lineTo(x + this.rng() * 20, y + h * 0.2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Map details (dotted route)
    this.ctx.strokeStyle = this.palette.colors.ink || '#1a1a1a';
    this.ctx.setLineDash([8, 12]);
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x + 20, y + h * 0.3);
    this.ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.6, x + w * 0.8, y + h * 0.4);
    this.ctx.stroke();
    
    // X marks the spot
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(x + w * 0.7, y + h * 0.3);
    this.ctx.lineTo(x + w * 0.9, y + h * 0.5);
    this.ctx.moveTo(x + w * 0.9, y + h * 0.3);
    this.ctx.lineTo(x + w * 0.7, y + h * 0.5);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  renderSkull() {
    const x = this.width * (0.1 + this.rng() * 0.8);
    const y = this.height * (0.1 + this.rng() * 0.8);
    const size = 30 + this.rng() * 25;
    
    this.ctx.save();
    
    // Skull shape
    this.ctx.fillStyle = this.palette.colors.pearl || '#f8f8ff';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, size, size * 0.8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Eye sockets
    this.ctx.fillStyle = this.palette.colors.void || '#1f2937';
    this.ctx.beginPath();
    this.ctx.ellipse(x - size * 0.3, y - size * 0.2, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(x + size * 0.3, y - size * 0.2, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Nasal cavity
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + size * 0.1, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  renderScatteredCoins() {
    const count = 5 + Math.floor(this.rng() * 10);
    for (let i = 0; i < count; i++) {
      const x = this.rng() * this.width;
      const y = this.height * 0.7 + this.rng() * this.height * 0.25;
      const size = 4 + this.rng() * 8;
      
      this.ctx.fillStyle = this.palette.colors.gold || '#d4af37';
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Coin detail
      this.ctx.strokeStyle = this.palette.colors.brass || '#b5651d';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  // Atmospheric effects
  addAtmosphere(type = 'clear') {
    switch (type) {
      case 'mist':
        this.addMist();
        break;
      case 'rain':
        this.addRain();
        break;
      case 'sparkles':
        this.addSparkles();
        break;
      case 'smoke':
        this.addSmoke();
        break;
      case 'underwater':
        this.addUnderwaterEffect();
        break;
    }
  }

  addMist() {
    this.ctx.save();
    for (let i = 0; i < 15; i++) {
      const x = this.rng() * this.width;
      const y = this.rng() * this.height * 0.7;
      const size = 50 + this.rng() * 200;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 + this.rng() * 0.2})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  addSparkles() {
    this.ctx.save();
    this.ctx.fillStyle = this.palette.colors.gold || '#d4af37';
    
    for (let i = 0; i < 30; i++) {
      const x = this.rng() * this.width;
      const y = this.rng() * this.height;
      const size = 2 + this.rng() * 4;
      
      // Star shape
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(this.rng() * Math.PI * 2);
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, -size);
      this.ctx.lineTo(size * 0.3, -size * 0.3);
      this.ctx.lineTo(size, 0);
      this.ctx.lineTo(size * 0.3, size * 0.3);
      this.ctx.lineTo(0, size);
      this.ctx.lineTo(-size * 0.3, size * 0.3);
      this.ctx.lineTo(-size, 0);
      this.ctx.lineTo(-size * 0.3, -size * 0.3);
      this.ctx.closePath();
      this.ctx.fill();
      
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  addUnderwaterEffect() {
    // Caustic light patterns
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < 20; i++) {
      const x = this.rng() * this.width;
      const y = this.rng() * this.height;
      const size = 20 + this.rng() * 40;
      
      this.ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
        const radius = size + Math.sin(angle * 3) * 10;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (angle === 0) this.ctx.moveTo(px, py);
        else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.stroke();
    }
    
    // Bubbles
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 40; i++) {
      const x = this.rng() * this.width;
      const y = this.rng() * this.height;
      const size = 2 + this.rng() * 8;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  // Final post-processing
  addTitle(title, subtitle = '') {
    this.ctx.save();
    
    // Title background
    const titleHeight = subtitle ? 120 : 80;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, titleHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, titleHeight);
    
    // Main title
    this.ctx.fillStyle = this.palette.colors.gold || '#d4af37';
    this.ctx.font = 'bold 64px serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Text shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    
    this.ctx.fillText(title, this.width / 2, subtitle ? 40 : 50);
    
    // Subtitle
    if (subtitle) {
      this.ctx.fillStyle = this.palette.colors.pearl || '#f8f8ff';
      this.ctx.font = '32px serif';
      this.ctx.fillText(subtitle, this.width / 2, 80);
    }
    
    this.ctx.restore();
  }

  addVignette() {
    const gradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.width * 0.2,
      this.width / 2, this.height / 2, this.width * 0.8
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  addFilmGrain() {
    this.ctx.save();
    for (let i = 0; i < 2000; i++) {
      const x = this.rng() * this.width;
      const y = this.rng() * this.height;
      const opacity = this.rng() * 0.1;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.fillRect(x, y, 1, 1);
    }
    this.ctx.restore();
  }
}

// Export the framework
export { ProfessionalRenderer, PALETTES, ART_STYLES, COMPOSITIONS, OUTPUT_SIZE };