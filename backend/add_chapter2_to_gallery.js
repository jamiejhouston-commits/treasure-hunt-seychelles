/**
 * Add Chapter 2 NFTs to gallery for preview (NOT minted yet)
 * Token IDs 21-40
 */
const fs = require('fs-extra');
const path = require('path');
const db = require('./database/connection');

const METADATA_DIR = path.resolve(__dirname, '../content/treasure_hunt_chapter2/metadata');

async function addChapter2ToGallery() {
  console.log('🏴‍☠️ Adding Chapter 2 NFTs to gallery for preview...\n');

  try {
    // Check if Chapter 2 already exists
    const existing = await db('nfts')
      .whereBetween('token_id', [21, 40])
      .count('* as count')
      .first();

    if (existing.count > 0) {
      console.log(`⚠️  Found ${existing.count} existing NFTs in token range 21-40`);
      console.log('   Deleting them first...');
      await db('nfts').whereBetween('token_id', [21, 40]).del();
    }

    const nftsToInsert = [];

    // Read metadata for NFTs 21-40
    for (let i = 21; i <= 40; i++) {
      const metadataPath = path.join(METADATA_DIR, `nft_${i}.json`);

      if (!fs.existsSync(metadataPath)) {
        console.warn(`⚠️  Missing: nft_${i}.json`);
        continue;
      }

      const metadata = await fs.readJSON(metadataPath);
      const properties = metadata.properties || {};
      const attributes = metadata.attributes || [];

      const rarityAttr = attributes.find(attr => attr.trait_type === 'Rarity');
      const chapterAttr = attributes.find(attr => attr.trait_type === 'Chapter');

      const nftRecord = {
        token_id: i,
        nftoken_id: null, // NOT minted yet
        name: metadata.name,
        description: metadata.description,
        image_uri: `/images/nft_${i}.png`, // Local path for gallery
        metadata_uri: `/treasure_hunt/chapter2/metadata/nft_${i}.json`,
        chapter: chapterAttr ? chapterAttr.value : 'Chapter 2: The Hidden Cache',
        island: 'Seychelles Archipelago',
        rarity: rarityAttr ? rarityAttr.value.toLowerCase() : 'common',
        attributes: JSON.stringify(attributes),
        layers: JSON.stringify(properties.layers || []),
        puzzle_enabled: properties.puzzle_enabled || false,
        art_rarity: properties.art_rarity || 'Common',
        current_owner: null, // Not owned
        price_xrp: null,
        for_sale: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      nftsToInsert.push(nftRecord);

      const puzzleIcon = nftRecord.puzzle_enabled ? '🧩' : '  ';
      console.log(`${puzzleIcon} NFT #${i} - ${nftRecord.art_rarity.padEnd(8)} (${properties.rarity_color})`);
    }

    if (nftsToInsert.length === 0) {
      console.log('❌ No NFTs to insert');
      return;
    }

    // Insert into database
    console.log(`\n📝 Inserting ${nftsToInsert.length} NFTs...`);
    await db('nfts').insert(nftsToInsert);

    console.log(`\n✅ Chapter 2 added to gallery!`);
    console.log(`🎯 View at: http://localhost:3001/gallery-minted`);
    console.log(`🧩 Puzzle NFTs: #25, #32, #37, #40\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

if (require.main === module) {
  addChapter2ToGallery()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = addChapter2ToGallery;
