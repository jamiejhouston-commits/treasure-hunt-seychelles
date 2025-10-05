import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

console.log('🏴‍☠️ GENERATING CHAPTER IV: WITCH-WINDS OF MAHÉ ARTWORK...\n');

const cards = [
  {
    id: 'ch4_001',
    name: 'Witch-Winds at Intendance',
    scene: 'Blue hour dusk at Anse Intendance',
    pirate: 'Weathered helmsman with 5-pane brass lantern',
    witch: 'In tattered shawl tracing spiral runes in surf foam',
    cipher: 'LA',
    bearing: 57,
    colors: ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#f5af19']
  },
  {
    id: 'ch4_002', 
    name: 'Baie Lazare Oath',
    scene: 'Golden hour at Baie Lazare memorial',
    pirate: 'Grizzled captain at Lazare Picault stone monument',
    witch: 'Tying gris-gris charms to weathered post',
    cipher: 'ZA',
    bearing: 124,
    colors: ['#ff6b35', '#f7931e', '#ffcc02', '#8b4513', '#2c1810']
  },
  {
    id: 'ch4_003',
    name: 'Anse Gaulette Whisper', 
    scene: 'Midnight with ground fog bands',
    pirate: 'Silhouette beyond the mystical veil',
    witch: 'Moving like smoke through shifting fog',
    cipher: 'RE',
    bearing: 202,
    colors: ['#0d1b2a', '#415a77', '#778da9', '#00f5ff', '#2d5016']
  }
];

async function generateChapter4Art() {
  const outputDir = '../content/ch4/images';
  
  for (let cardIndex = 0; cardIndex < 20; cardIndex++) {
    const cardNum = cardIndex + 1;
    const cardId = `ch4_${cardNum.toString().padStart(3, '0')}`;
    
    // Use card data if available, otherwise create variation
    const baseCard = cards[cardIndex % 3];
    const isVariation = cardIndex >= 3;
    
    console.log(`🎨 Creating: ${cardId} - ${baseCard.name}${isVariation ? ` (Variation ${Math.floor(cardIndex/3) + 1})` : ''}`);
    
    // Create 2048x2048 canvas
    const canvas = createCanvas(2048, 2048);
    const ctx = canvas.getContext('2d');
    
    // AGED PARCHMENT BACKGROUND
    const bgGradient = ctx.createRadialGradient(1024, 1024, 200, 1024, 1024, 1400);
    bgGradient.addColorStop(0, '#f4e4bc');
    bgGradient.addColorStop(0.7, '#d4b896'); 
    bgGradient.addColorStop(1, '#8b7355');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 2048, 2048);
    
    // Add parchment texture
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 2048, Math.random() * 2048);
      ctx.lineTo(Math.random() * 2048, Math.random() * 2048);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
    
    // ORNATE COMPASS RING
    ctx.strokeStyle = '#2c1810';
    ctx.lineWidth = 12;
    
    // Outer decorative ring
    ctx.beginPath();
    ctx.arc(1024, 1024, 980, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner compass ring
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(1024, 1024, 920, 0, Math.PI * 2);
    ctx.stroke();
    
    // Degree markings every 30 degrees
    ctx.lineWidth = 4;
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const x1 = 1024 + Math.cos(rad) * 920;
      const y1 = 1024 + Math.sin(rad) * 920;
      const x2 = 1024 + Math.cos(rad) * 980;
      const y2 = 1024 + Math.sin(rad) * 980;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Cardinal directions
    ctx.font = 'bold 64px serif';
    ctx.fillStyle = '#2c1810';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 1024, 120);
    ctx.fillText('E', 1928, 1024);
    ctx.fillText('S', 1024, 1928);
    ctx.fillText('W', 120, 1024);
    
    // BEARING INDICATOR (specific to each card)
    const bearing = baseCard.bearing + (isVariation ? cardIndex * 13 : 0);
    const bearingRad = ((bearing - 90) * Math.PI) / 180;
    
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(1024, 1024);
    const bearingX = 1024 + Math.cos(bearingRad) * 850;
    const bearingY = 1024 + Math.sin(bearingRad) * 850;
    ctx.lineTo(bearingX, bearingY);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(bearingX, bearingY);
    ctx.lineTo(bearingX - 25 * Math.cos(bearingRad - 0.5), bearingY - 25 * Math.sin(bearingRad - 0.5));
    ctx.moveTo(bearingX, bearingY);
    ctx.lineTo(bearingX - 25 * Math.cos(bearingRad + 0.5), bearingY - 25 * Math.sin(bearingRad + 0.5));
    ctx.stroke();
    
    // CHAPTER IV TITLE
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#2c1810';
    ctx.textAlign = 'center';
    ctx.fillText('Chapter IV', 1024, 200);
    
    ctx.font = '36px serif';
    ctx.fillStyle = '#8b4513';
    ctx.fillText('Witch-Winds of Mahé', 1024, 250);
    
    // CARD NAME
    ctx.font = 'bold 42px serif';
    ctx.fillStyle = '#2c1810';
    ctx.fillText(baseCard.name, 1024, 320);
    
    // PIRATE & WITCH SYMBOLS (etched style)
    ctx.font = 'bold 200px serif';
    ctx.fillStyle = baseCard.colors[3];
    ctx.fillText('⚔️', 700, 600);
    
    ctx.fillStyle = baseCard.colors[4];
    ctx.fillText('🔮', 1300, 600);
    
    // MYSTICAL ELEMENTS
    ctx.font = '120px serif';
    ctx.fillStyle = baseCard.colors[1];
    ctx.fillText('🌙', 500, 800);
    ctx.fillText('⭐', 1500, 800);
    
    // SCENE DESCRIPTION AREA
    ctx.font = '24px serif';
    ctx.fillStyle = '#4a4a4a';
    ctx.textAlign = 'center';
    const sceneText = baseCard.scene;
    ctx.fillText(sceneText, 1024, 1100);
    
    // PIRATE DESCRIPTION
    ctx.font = '20px serif';
    ctx.fillStyle = '#654321';
    const pirateText = baseCard.pirate;
    ctx.fillText(pirateText, 1024, 1150);
    
    // WITCH DESCRIPTION  
    const witchText = baseCard.witch;
    ctx.fillText(witchText, 1024, 1200);
    
    // BEARING DISPLAY
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#8b0000';
    ctx.fillText(`Bearing: ${bearing}°`, 1024, 1300);
    
    // CIPHER OUTPUT (large and prominent)
    ctx.font = 'bold 120px serif';
    ctx.fillStyle = '#8b0000';
    ctx.textAlign = 'center';
    ctx.fillText(baseCard.cipher, 1024, 1600);
    
    // DECORATIVE ELEMENTS
    // Add some mystical symbols around the edges
    ctx.font = '60px serif';
    ctx.fillStyle = baseCard.colors[2];
    ctx.fillText('⚓', 200, 400);
    ctx.fillText('🗡️', 1800, 400);
    ctx.fillText('💀', 200, 1600);
    ctx.fillText('🏴‍☠️', 1800, 1600);
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    const filename = `${cardId}.png`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`   ✅ Saved: ${filename}`);
  }
  
  console.log('\n🎉 Generated all 20 Chapter IV artwork files!');
  console.log('   Each features aged parchment, compass rings, pirate/witch themes');
  console.log('   Ready for gallery preview and minting approval!');
}

generateChapter4Art().catch(console.error);