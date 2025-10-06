// One-time database population endpoint
const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/populate-database', async (req, res) => {
  try {
    console.log('🧹 Cleaning old NFTs and updating schema...');

    // Delete all existing NFTs
    await db('nfts').delete();
    console.log('✅ Cleared old NFTs');

    // Add new columns if they don't exist
    const tableInfo = await db.raw('PRAGMA table_info(nfts)');
    const columns = tableInfo.map(col => col.name);

    if (!columns.includes('layers')) {
      await db.schema.table('nfts', table => {
        table.text('layers');
      });
      console.log('✅ Added layers column');
    }

    if (!columns.includes('metadata_uri')) {
      await db.schema.table('nfts', table => {
        table.text('metadata_uri');
      });
      console.log('✅ Added metadata_uri column');
    }

    if (!columns.includes('puzzle_enabled')) {
      await db.schema.table('nfts', table => {
        table.boolean('puzzle_enabled').defaultTo(false);
      });
      console.log('✅ Added puzzle_enabled column');
    }

    // Now insert Chapter 1 & 2 NFTs
    const nfts = [];

    // Chapter 1: NFTs 1-20
    for (let i = 1; i <= 20; i++) {
      nfts.push({
        token_id: `NFT-${i}`,
        sequence: i,
        name: `Seychelles Treasure #${i}`,
        description: `Chapter 1: The Trail Begins - NFT #${i}`,
        image_uri: `/images/nft_${i}.png`,
        metadata_uri: `/treasure_hunt/chapter1/metadata/nft_${i}.json`,
        chapter: 'Chapter 1: The Trail Begins',
        rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        layers: JSON.stringify([{layer: 0, type: 'base_artwork', description: 'Original artwork'}]),
        puzzle_enabled: [5, 12, 17, 20].includes(i),
        status: 'available',
        price: 10.0,
        currency: 'XRP'
      });
    }

    // Chapter 2: NFTs 21-40
    for (let i = 21; i <= 40; i++) {
      const layers = [{layer: 0, type: 'base_artwork', description: 'Original artwork'}];

      if (i === 25) layers.push({layer: 1, type: 'cipher_text', url: '/images/nft_25_layer_1.png'});
      if (i === 32) layers.push({layer: 2, type: 'map_fragment', url: '/images/nft_32_layer_2.png'});
      if (i === 37) layers.push({layer: 3, type: 'decoding_key', url: '/images/nft_37_layer_3.png'});
      if (i === 40) layers.push({layer: 1, type: 'cryptogram', url: '/images/nft_40_layer_1.png'});

      nfts.push({
        token_id: `NFT-${i}`,
        sequence: i,
        name: `Seychelles Treasure #${i}`,
        description: `Chapter 2: The Hidden Cache - NFT #${i}`,
        image_uri: `/images/nft_${i}.png`,
        metadata_uri: `/treasure_hunt/chapter2/metadata/nft_${i}.json`,
        chapter: 'Chapter 2: The Hidden Cache',
        rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        layers: JSON.stringify(layers),
        puzzle_enabled: [25, 32, 37, 40].includes(i),
        status: 'available',
        price: 10.0,
        currency: 'XRP'
      });
    }

    // Insert all NFTs
    await db('nfts').insert(nfts);

    const count = await db('nfts').count('* as total').first();

    res.json({
      success: true,
      message: `✅ Database populated with ${count.total} NFTs (Chapter 1 & 2)`,
      nfts_added: count.total
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
