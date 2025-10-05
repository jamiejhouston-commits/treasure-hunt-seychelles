const fs = require('fs');
const path = require('path');

console.log('📋 Creating simple placeholder files for Chapter IV...\n');

// Create images directory if it doesn't exist
const imagesDir = './images';
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Create simple placeholder text files (will be replaced with real images later)
const placeholderContent = `# Chapter IV Placeholder
This is a temporary placeholder for Chapter IV artwork.
The actual 2048x2048 PNG images will be generated with:
- Aged parchment backgrounds
- Ornate compass ring borders  
- Etched pirates and witches
- Deep indigo/gold color palette
- Hidden cipher elements
`;

for (let i = 1; i <= 20; i++) {
    const cardId = `ch4_${i.toString().padStart(3, '0')}`;
    const filename = `${cardId}.png.placeholder`;
    
    fs.writeFileSync(path.join(imagesDir, filename), placeholderContent);
    console.log(`✅ Created: ${filename}`);
}

console.log(`\n🎉 Created 20 placeholder files!`);
console.log('   Note: These are temporary placeholders.');
console.log('   Real PNG artwork will replace these files when ready.');

// Also copy some existing images as temporary placeholders
const existingImagesPath = '../../assets/images';
if (fs.existsSync(existingImagesPath)) {
    const existingFiles = fs.readdirSync(existingImagesPath).filter(f => f.endsWith('.png'));
    if (existingFiles.length > 0) {
        console.log('\n📸 Using existing image as temporary Chapter IV placeholder...');
        const sourceImage = path.join(existingImagesPath, existingFiles[0]);
        
        for (let i = 1; i <= 20; i++) {
            const cardId = `ch4_${i.toString().padStart(3, '0')}`;
            const targetPath = path.join(imagesDir, `${cardId}.png`);
            
            if (fs.existsSync(sourceImage)) {
                fs.copyFileSync(sourceImage, targetPath);
                console.log(`✅ Copied placeholder image: ${cardId}.png`);
            }
        }
    }
}