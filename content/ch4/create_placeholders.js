const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

console.log('🎨 Creating Chapter IV placeholder images...\n');

// Create images directory if it doesn't exist
const imagesDir = './images';
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate placeholder images for all 20 cards
for (let i = 1; i <= 20; i++) {
    const cardId = `ch4_${i.toString().padStart(3, '0')}`;
    
    // Create 2048x2048 canvas
    const canvas = createCanvas(2048, 2048);
    const ctx = canvas.getContext('2d');
    
    // AGED PARCHMENT BACKGROUND
    const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1440);
    gradient.addColorStop(0, '#F4E4BC');  // Warm parchment center
    gradient.addColorStop(1, '#D4B896');  // Aged edges
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);
    
    // Add parchment texture
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    for (let j = 0; j < 15; j++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 2048, Math.random() * 2048);
        ctx.lineTo(Math.random() * 2048, Math.random() * 2048);
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
    
    // COMPASS RING BORDER
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 8;
    
    // Outer ring
    ctx.beginPath();
    ctx.arc(1024, 1024, 980, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner ring  
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
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#2C1810';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 1024, 120);
    ctx.fillText('E', 1930, 1024);
    ctx.fillText('S', 1024, 1930);
    ctx.fillText('W', 120, 1024);
    
    // CHAPTER IV TITLE
    ctx.font = 'bold 72px serif';
    ctx.fillStyle = '#2C1810';
    ctx.textAlign = 'center';
    ctx.fillText('Chapter IV', 1024, 250);
    
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#8B4513';
    ctx.fillText('Witch-Winds of Mahé', 1024, 320);
    
    // CARD NUMBER
    ctx.font = 'bold 120px serif';
    ctx.fillStyle = '#8B0000';
    ctx.textAlign = 'center';
    ctx.fillText(i.toString(), 1024, 1024);
    
    // PLACEHOLDER TEXT
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#4A4A4A';
    ctx.fillText('PREVIEW', 1024, 1120);
    
    ctx.font = '32px serif';
    ctx.fillStyle = '#666';
    ctx.fillText('Artwork Coming Soon', 1024, 1180);
    
    // PIRATE & WITCH SYMBOLS
    ctx.font = 'bold 180px serif';
    ctx.fillStyle = '#8B4513';
    ctx.fillText('⚔️', 824, 600);
    ctx.fillText('🔮', 1224, 600);
    
    // BOTTOM CIPHER AREA
    ctx.font = 'bold 64px serif';
    ctx.fillStyle = '#8B0000';
    ctx.textAlign = 'center';
    ctx.fillText('Ready for Art', 1024, 1750);
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    const filename = `${cardId}.png`;
    fs.writeFileSync(path.join(imagesDir, filename), buffer);
    
    console.log(`✅ Created placeholder: ${filename}`);
}

console.log(`\n🎉 Generated 20 Chapter IV placeholder images!`);
console.log('   These will display in the gallery while final artwork is being created.');
console.log('   Each image shows the aged parchment + compass ring design framework.');