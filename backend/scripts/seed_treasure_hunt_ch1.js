/**
 * Seed Treasure Hunt Chapter 1 NFTs into Database
 * Loads 20 NFTs with puzzle layers and art rarity from metadata files
 */

const fs = require('fs-extra');
const path = require('path');
const db = require('../database/connection');

const METADATA_DIR = path.resolve(__dirname, '../../content/treasure_hunt_chapter1/metadata');
const TOTAL_NFTS = 20;

async function seedTreasureHuntChapter1() {
  console.log('🏴‍☠️ Starting Treasure Hunt Chapter 1 NFT seeding...\n');

  try {
    // Check if NFTs already exist
    const existingCount = await db('nfts')
      .where('chapter', 'Chapter 1')
      .where('description', 'like', '%Treasure Hunt%')
      .count('* as count')
      .first();

    if (existingCount.count >= TOTAL_NFTS) {
      console.log(`⚠️  Found ${existingCount.count} existing Chapter 1 Treasure Hunt NFTs.`);
      console.log('   Skipping seed to avoid duplicates.');
      console.log('   To re-seed, manually delete these NFTs from the database first.\n');
      return;
    }

    const nftsToInsert = [];

    // Read all 20 metadata files
    for (let i = 1; i <= TOTAL_NFTS; i++) {
      const metadataPath = path.join(METADATA_DIR, `nft_${i}.json`);

      if (!fs.existsSync(metadataPath)) {
        console.warn(`⚠️  Missing metadata file: nft_${i}.json`);
        continue;
      }

      const metadata = await fs.readJSON(metadataPath);
      const properties = metadata.properties || {};
      const attributes = metadata.attributes || [];

      // Extract rarity from attributes
      const rarityAttr = attributes.find(attr => attr.trait_type === 'Rarity');
      const chapterAttr = attributes.find(attr => attr.trait_type === 'Chapter');

      const nftRecord = {
        token_id: i, // IDs 1-20
        nftoken_id: `MINTED_TESTNET_CH1_${String(i).padStart(3, '0')}`, // Testnet placeholder
        name: metadata.name,
        description: metadata.description,
        image_uri: metadata.image, // IPFS URI
        metadata_uri: `http://localhost:3001/treasure_hunt/chapter1/metadata/nft_${i}.json`, // Metadata URL
        chapter: chapterAttr ? chapterAttr.value : 'Chapter 1: The Trail Begins',
        island: 'Seychelles Archipelago',
        rarity: rarityAttr ? rarityAttr.value.toLowerCase() : 'common',
        attributes: JSON.stringify(metadata.attributes),
        layers: JSON.stringify(properties.layers || []),
        puzzle_enabled: properties.puzzle_enabled || false,
        art_rarity: properties.art_rarity || 'Common',
        current_owner: null, // Not owned yet
        price_xrp: null,
        for_sale: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      nftsToInsert.push(nftRecord);

      const puzzleIndicator = nftRecord.puzzle_enabled ? '🧩' : '  ';
      const rarityColor = properties.rarity_color || '#8d99ae';
      console.log(`${puzzleIndicator} NFT #${i.toString().padStart(2)} - ${nftRecord.art_rarity.padEnd(8)} (${rarityColor})`);
    }

    if (nftsToInsert.length === 0) {
      console.log('❌ No NFTs to insert. Check metadata files.');
      return;
    }

    // Insert all NFTs into database
    console.log(`\n📝 Inserting ${nftsToInsert.length} NFTs into database...`);
    await db('nfts').insert(nftsToInsert);

    console.log(`\n✅ Successfully seeded ${nftsToInsert.length} Treasure Hunt Chapter 1 NFTs!`);
    console.log('\nBreakdown:');

    const rarities = nftsToInsert.reduce((acc, nft) => {
      acc[nft.art_rarity] = (acc[nft.art_rarity] || 0) + 1;
      return acc;
    }, {});

    Object.entries(rarities).forEach(([rarity, count]) => {
      console.log(`  ${rarity}: ${count} NFTs`);
    });

    const puzzleNFTs = nftsToInsert.filter(nft => nft.puzzle_enabled);
    console.log(`\n🧩 Puzzle NFTs: ${puzzleNFTs.map(nft => `#${nft.token_id}`).join(', ')}`);
    console.log('\n🎯 Ready for testing! Visit /gallery-minted to view NFTs.\n');

  } catch (error) {
    console.error('❌ Error seeding NFTs:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Run if called directly
if (require.main === module) {
  seedTreasureHuntChapter1()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedTreasureHuntChapter1;
