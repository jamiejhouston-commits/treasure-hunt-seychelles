const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

class TreasureArtGenerator {
    constructor() {
        this.width = parseInt(process.env.CANVAS_WIDTH) || 2048;
        this.height = parseInt(process.env.CANVAS_HEIGHT) || 2048;
        this.totalSupply = parseInt(process.env.TOTAL_SUPPLY) || 1000;
        this.outputDir = './assets/images';
        
        // Rarity distribution from Prompt 1 blueprint
        this.rarityDistribution = {
            common: { percentage: 70, count: 700, traits: 'standard' },
            rare: { percentage: 25, count: 250, traits: 'enhanced' },
            epic: { percentage: 4, count: 40, traits: 'unique' },
            legendary: { percentage: 1, count: 10, traits: 'masterpiece' }
        };

        // Chapter distribution (250 NFTs per chapter)
        this.chapters = {
            1: { name: "Mahé Manuscripts", range: [1, 250], theme: "granite_peaks" },
            2: { name: "La Digue's Secrets", range: [251, 500], theme: "granite_boulders" },
            3: { name: "Praslin's Prophecy", range: [501, 750], theme: "primeval_forest" },
            4: { name: "Outer Islands Revelation", range: [751, 1000], theme: "coral_atolls" }
        };

        // Asset layer definitions
        this.layers = {
            backgrounds: {
                mahe: ['misty_peaks', 'waterfall_cascade', 'mountain_silhouette'],
                la_digue: ['granite_formations', 'anse_source', 'boulder_beach'],
                praslin: ['vallee_mai', 'coco_palm_forest', 'endemic_canopy'],
                outer_islands: ['coral_lagoon', 'atoll_reef', 'endless_ocean']
            },
            terrain: ['white_sand', 'black_volcanic', 'coral_limestone', 'granite_shore'],
            vegetation: ['coco_de_mer', 'takamaka_trees', 'mangroves', 'jellyfish_tree'],
            pirate_elements: ['compass_rose', 'treasure_chest', 'pirate_ship', 'ancient_map'],
            wildlife: ['sunbird', 'magpie_robin', 'fairy_tern', 'giant_tortoise', 'fruit_bat'],
            weather: ['golden_sunset', 'tropical_storm', 'monsoon_mist', 'blood_moon'],
            mystical: ['constellation_overlay', 'aurora_effect', 'lens_flare', 'sacred_symbols']
        };

        this.generatedTraits = [];
    }

    // Generate cryptographic puzzle clues for each NFT
    generatePuzzleClue(tokenId, chapter) {
        const baseClues = {
            1: "compass_bearing", // Mahé - navigational
            2: "star_chart", // La Digue - astronomical  
            3: "botanical_code", // Praslin - natural symbols
            4: "coordinate_sequence" // Outer Islands - final coordinates
        };

        const clueType = baseClues[chapter];
        const seed = `${tokenId}-${process.env.MASTER_CIPHER_KEY}`;
        const hash = crypto.createHash('sha256').update(seed).digest('hex');
        
        return {
            type: clueType,
            cipher: Buffer.from(`Fragment${tokenId}-${hash.substring(0, 16)}`).toString('base64'),
            coordinates: this.generateCoordinates(tokenId, chapter),
            puzzle_piece: `${clueType}_${tokenId}`,
            verification_hash: `0x${hash.substring(0, 32)}`
        };
    }

    generateCoordinates(tokenId, chapter) {
        // Real Seychelles coordinates with slight offsets for puzzle
        const baseCoords = {
            1: { lat: -4.6796, lng: 55.4919 }, // Mahé
            2: { lat: -4.3587, lng: 55.8442 }, // La Digue
            3: { lat: -4.3167, lng: 55.7408 }, // Praslin
            4: { lat: -4.2833, lng: 55.8333 }  // Outer Islands
        };

        const base = baseCoords[chapter];
        const offset = (tokenId % 1000) / 10000; // Small random offset
        
        return `${(base.lat + offset).toFixed(4)},${(base.lng + offset).toFixed(4)}`;
    }

    // Determine rarity based on tokenId
    getRarity(tokenId) {
        if (tokenId <= 700) return 'common';
        if (tokenId <= 950) return 'rare';
        if (tokenId <= 990) return 'epic';
        return 'legendary';
    }

    // Get chapter based on tokenId
    getChapter(tokenId) {
        for (const [chapterNum, info] of Object.entries(this.chapters)) {
            if (tokenId >= info.range[0] && tokenId <= info.range[1]) {
                return { number: parseInt(chapterNum), ...info };
            }
        }
        return this.chapters[1]; // fallback
    }

    // Generate trait combination for specific NFT
    generateTraits(tokenId) {
        const rarity = this.getRarity(tokenId);
        const chapter = this.getChapter(tokenId);
        const clue = this.generatePuzzleClue(tokenId, chapter.number);

        // Use tokenId as seed for reproducible randomness
        const random = (seed) => {
            const x = Math.sin(seed * tokenId) * 10000;
            return x - Math.floor(x);
        };

        const traits = {
            tokenId,
            chapter: chapter.name,
            island: this.getIslandName(chapter.number),
            rarity,
            clue,
            attributes: {}
        };

        // Background based on chapter theme
        const bgOptions = this.layers.backgrounds[this.getIslandKey(chapter.number)];
        traits.attributes.background = bgOptions[Math.floor(random(1) * bgOptions.length)];

        // Terrain
        traits.attributes.terrain = this.layers.terrain[Math.floor(random(2) * this.layers.terrain.length)];

        // Pirate elements
        traits.attributes.navigation_tool = this.layers.pirate_elements[Math.floor(random(3) * this.layers.pirate_elements.length)];

        // Wildlife (rarity affects selection)
        const wildlifePool = rarity === 'legendary' ? ['giant_tortoise', 'fruit_bat'] : this.layers.wildlife;
        traits.attributes.wildlife = wildlifePool[Math.floor(random(4) * wildlifePool.length)];

        // Weather effects (rare+ only)
        if (rarity !== 'common') {
            traits.attributes.weather = this.layers.weather[Math.floor(random(5) * this.layers.weather.length)];
        }

        // Mystical elements (epic+ only) 
        if (rarity === 'epic' || rarity === 'legendary') {
            traits.attributes.mystical = this.layers.mystical[Math.floor(random(6) * this.layers.mystical.length)];
        }

        return traits;
    }

    getIslandName(chapterNum) {
        const names = { 1: 'Mahé', 2: 'La Digue', 3: 'Praslin', 4: 'Outer Islands' };
        return names[chapterNum];
    }

    getIslandKey(chapterNum) {
        const keys = { 1: 'mahe', 2: 'la_digue', 3: 'praslin', 4: 'outer_islands' };
        return keys[chapterNum];
    }

    // Create procedural background based on traits
    async generateBackground(ctx, traits) {
        // Create gradient based on island theme
        const gradients = {
            'granite_peaks': ['#2C5234', '#4A7C59', '#6B9080'],
            'granite_boulders': ['#8B4513', '#CD853F', '#F4A460'],
            'primeval_forest': ['#013220', '#2F5233', '#4F7942'],
            'coral_atolls': ['#006994', '#4FB3D9', '#87CEEB']
        };

        const colors = gradients[traits.attributes.background] || gradients['granite_peaks'];
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Add texture overlay
        ctx.globalAlpha = 0.3;
        this.addTexture(ctx, traits.rarity);
        ctx.globalAlpha = 1.0;
    }

    // Add procedural texture
    addTexture(ctx, rarity) {
        const imageData = ctx.createImageData(this.width, this.height);
        const data = imageData.data;

        const intensity = rarity === 'legendary' ? 100 : rarity === 'epic' ? 80 : 60;

        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
            data[i + 3] = 255; // A
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // Draw compass rose (key pirate element)
    drawCompassRose(ctx, x, y, size, rarity) {
        const colors = {
            common: '#8B4513',
            rare: '#DAA520', 
            epic: '#FFD700',
            legendary: '#FF6347'
        };

        ctx.strokeStyle = colors[rarity];
        ctx.lineWidth = rarity === 'legendary' ? 8 : 4;
        ctx.fillStyle = colors[rarity];

        // Main compass circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.stroke();

        // Compass points
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const pointLength = i % 2 === 0 ? size * 0.8 : size * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(angle) * pointLength,
                y + Math.sin(angle) * pointLength
            );
            ctx.stroke();
        }

        // Center jewel for rare+
        if (rarity !== 'common') {
            ctx.beginPath();
            ctx.arc(x, y, size * 0.1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Generate single NFT image
    async generateNFTImage(tokenId) {
        console.log(`🎨 Generating NFT #${tokenId}...`);
        
        const traits = this.generateTraits(tokenId);
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        // 1. Generate background
        await this.generateBackground(ctx, traits);

        // 2. Add main pirate element (compass rose)
        const compassX = this.width * 0.7;
        const compassY = this.height * 0.3;
        const compassSize = traits.rarity === 'legendary' ? 150 : 100;
        this.drawCompassRose(ctx, compassX, compassY, compassSize, traits.rarity);

        // 3. Add treasure chest
        this.drawTreasureChest(ctx, this.width * 0.2, this.height * 0.7, traits.rarity);

        // 4. Add mystical overlay for epic+
        if (traits.rarity === 'epic' || traits.rarity === 'legendary') {
            this.addMysticalOverlay(ctx, traits);
        }

        // 5. Add clue inscription
        this.addClueInscription(ctx, traits.clue, traits.rarity);

        // Save image
        const fileName = `treasure_fragment_${tokenId.toString().padStart(4, '0')}.png`;
        const filePath = path.join(this.outputDir, fileName);
        
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(filePath, buffer);

        console.log(`✅ Generated NFT #${tokenId}: ${fileName}`);
        return { ...traits, fileName, filePath };
    }

    drawTreasureChest(ctx, x, y, rarity) {
        const size = rarity === 'legendary' ? 120 : 80;
        const colors = {
            common: '#8B4513',
            rare: '#CD853F',
            epic: '#DAA520',
            legendary: '#FFD700'
        };

        ctx.fillStyle = colors[rarity];
        ctx.fillRect(x, y, size, size * 0.7);
        
        // Chest bands
        ctx.strokeStyle = '#2F1B14';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            const bandY = y + (i + 1) * (size * 0.7) / 4;
            ctx.beginPath();
            ctx.moveTo(x, bandY);
            ctx.lineTo(x + size, bandY);
            ctx.stroke();
        }

        // Lock (legendary only)
        if (rarity === 'legendary') {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + size * 0.4, y + size * 0.3, size * 0.2, size * 0.2);
        }
    }

    addMysticalOverlay(ctx, traits) {
        // Constellation pattern for epic/legendary
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = traits.rarity === 'legendary' ? 4 : 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    addClueInscription(ctx, clue, rarity) {
        // Add subtle clue text
        const fontSize = rarity === 'legendary' ? 24 : 18;
        ctx.font = `${fontSize}px serif`;
        ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.textAlign = 'center';
        
        const clueText = `${clue.type.toUpperCase()}: ${clue.cipher.substring(0, 16)}...`;
        ctx.fillText(clueText, this.width / 2, this.height - 50);
    }

    // Generate all NFT images
    async generateAllNFTs() {
        console.log(`🚀 Starting generation of ${this.totalSupply} Treasure NFTs...`);
        console.log(`📐 Canvas size: ${this.width}x${this.height}px`);
        
        await fs.ensureDir(this.outputDir);
        
        const allTraits = [];
        const startTime = Date.now();

        for (let tokenId = 1; tokenId <= this.totalSupply; tokenId++) {
            try {
                const nftData = await this.generateNFTImage(tokenId);
                allTraits.push(nftData);
                
                // Progress update every 50 NFTs
                if (tokenId % 50 === 0) {
                    const elapsed = (Date.now() - startTime) / 1000;
                    const rate = tokenId / elapsed;
                    const remaining = (this.totalSupply - tokenId) / rate;
                    console.log(`📊 Progress: ${tokenId}/${this.totalSupply} (${(tokenId/this.totalSupply*100).toFixed(1)}%) - ETA: ${remaining.toFixed(0)}s`);
                }
            } catch (error) {
                console.error(`❌ Error generating NFT #${tokenId}:`, error);
                throw error;
            }
        }

        // Save traits data
        await fs.writeJson('./data/generated_traits.json', allTraits, { spaces: 2 });
        
        const totalTime = (Date.now() - startTime) / 1000;
        console.log(`🎉 Successfully generated ${this.totalSupply} NFTs in ${totalTime.toFixed(2)} seconds!`);
        console.log(`📁 Images saved to: ${this.outputDir}`);
        console.log(`📋 Traits data saved to: ./data/generated_traits.json`);

        return allTraits;
    }
}

// Main execution
async function main() {
    try {
        const generator = new TreasureArtGenerator();
        await generator.generateAllNFTs();
        console.log('\n✨ Art generation complete! Ready for metadata creation.');
    } catch (error) {
        console.error('💥 Art generation failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = TreasureArtGenerator;