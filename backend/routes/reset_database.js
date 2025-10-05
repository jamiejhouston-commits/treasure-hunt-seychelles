// Complete database reset - DELETE ALL, create ONLY Chapter 1 & 2 with layers
const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/reset-database', async (req, res) => {
  try {
    console.log('🗑️ DROPPING entire nfts table (deletes ALL old data)...');
    await db.schema.dropTableIfExists('nfts');

    console.log('🔨 CREATING fresh nfts table with correct schema...');
    await db.schema.createTable('nfts', (table) => {
      table.increments('id').primary();
      table.integer('token_id').notNullable();
      table.text('nftoken_id');
      table.text('name');
      table.text('description');
      table.text('image_uri');
      table.text('chapter');
      table.text('island');
      table.text('rarity');
      table.text('art_rarity');
      table.text('attributes');
      table.text('layers'); // KEY: Has our puzzle data
      table.boolean('puzzle_enabled').defaultTo(false);
      table.text('current_owner');
      table.decimal('price_xrp', 10, 2);
      table.boolean('for_sale').defaultTo(false);
      table.datetime('created_at').defaultTo(db.fn.now());
      table.datetime('updated_at').defaultTo(db.fn.now());
    });

    console.log('📦 INSERTING ONLY Chapter 1 & 2 (40 NFTs with layers)...');
    const nfts = [];

    // Chapter 1: NFTs 1-20 (with puzzle layers)
    for (let i = 1; i <= 20; i++) {
      const layers = [{layer: 0, type: 'base_artwork', description: 'Original artwork'}];

      // Add puzzle layers for specific Chapter 1 NFTs
      if (i === 5) layers.push({layer: 1, type: 'cipher_clue', url: '/images/nft_5_layer_1.png', description: 'First puzzle piece'});
      if (i === 12) layers.push({layer: 2, type: 'map_coordinates', url: '/images/nft_12_layer_2.png', description: 'Second puzzle piece'});
      if (i === 17) layers.push({layer: 3, type: 'direction_key', url: '/images/nft_17_layer_3.png', description: 'Third puzzle piece'});
      if (i === 20) layers.push({layer: 1, type: 'final_clue', url: '/images/nft_20_layer_1.png', description: 'Final puzzle piece'});

      nfts.push({
        token_id: i,
        name: `Seychelles Treasure #${i}`,
        description: `Chapter 1: The Trail Begins - NFT #${i}`,
        image_uri: `/images/nft_${i}.png`,
        chapter: 'Chapter 1: The Trail Begins',
        rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        art_rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        layers: JSON.stringify(layers),
        puzzle_enabled: [5, 12, 17, 20].includes(i),
        price_xrp: 10.0,
        for_sale: true,
        current_owner: null
      });
    }

    // Chapter 2: NFTs 21-40 (with puzzle layers)
    for (let i = 21; i <= 40; i++) {
      const layers = [{layer: 0, type: 'base_artwork', description: 'Original artwork'}];

      // Add puzzle layers for specific NFTs
      if (i === 25) layers.push({layer: 1, type: 'cipher_text', url: '/images/nft_25_layer_1.png'});
      if (i === 32) layers.push({layer: 2, type: 'map_fragment', url: '/images/nft_32_layer_2.png'});
      if (i === 37) layers.push({layer: 3, type: 'decoding_key', url: '/images/nft_37_layer_3.png'});
      if (i === 40) layers.push({layer: 1, type: 'cryptogram', url: '/images/nft_40_layer_1.png'});

      nfts.push({
        token_id: i,
        name: `Seychelles Treasure #${i}`,
        description: `Chapter 2: The Hidden Cache - NFT #${i}`,
        image_uri: `/images/nft_${i}.png`,
        chapter: 'Chapter 2: The Hidden Cache',
        rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        art_rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        layers: JSON.stringify(layers),
        puzzle_enabled: [25, 32, 37, 40].includes(i),
        price_xrp: 10.0,
        for_sale: true,
        current_owner: null
      });
    }

    // Insert all 40 NFTs
    await db('nfts').insert(nfts);

    const count = await db('nfts').count('* as total').first();

    res.json({
      success: true,
      message: `✅ Database reset complete! Created ${count.total} NFTs (Chapter 1 & 2 with layers only)`,
      nfts_created: count.total,
      chapters: ['Chapter 1: The Trail Begins (NFTs 1-20)', 'Chapter 2: The Hidden Cache (NFTs 21-40)']
    });
  } catch (error) {
    console.error('❌ Reset failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
