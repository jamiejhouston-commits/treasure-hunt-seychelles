import WaterfallWitchGenerator from './generateWaterfallWitchArt.js';
import fs from 'fs-extra';
import path from 'path';

async function main() {
    console.log('🎭 Generating traits data for existing Waterfall Witch images...');

    const generator = new WaterfallWitchGenerator();
    const allTraits = [];

    // Ensure data directory exists
    await fs.ensureDir('./data');

    // Generate traits for each token ID
    for (let tokenId = 1001; tokenId <= 1150; tokenId++) {
        const traits = generator.generateAdvancedTraits(tokenId);

        // Add file information
        const fileName = `waterfall_witch_${tokenId.toString().padStart(4, '0')}.png`;
        const filePath = path.join('./assets/waterfall_edition', fileName);

        allTraits.push({
            ...traits,
            fileName,
            filePath
        });

        if ((tokenId - 1000) % 25 === 0) {
            console.log(`   📊 Generated traits for ${tokenId - 1000}/150 NFTs...`);
        }
    }

    // Save traits data
    const traitsFilePath = './data/waterfall_witch_traits.json';
    await fs.writeJson(traitsFilePath, allTraits, { spaces: 2 });

    console.log(`✅ Generated traits for ${allTraits.length} Waterfall Witch NFTs`);
    console.log(`📄 Saved to: ${traitsFilePath}`);

    // Show summary
    const rarities = allTraits.reduce((acc, nft) => {
        acc[nft.rarity] = (acc[nft.rarity] || 0) + 1;
        return acc;
    }, {});

    console.log('\\n💎 Rarity Distribution:');
    Object.entries(rarities).forEach(([rarity, count]) => {
        console.log(`   • ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}: ${count}`);
    });

    const treasureCards = allTraits.filter(nft => nft.clue.is_winning_card).length;
    console.log(`🏆 Treasure Location Cards: ${treasureCards}`);
}

main().catch(console.error);