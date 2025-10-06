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

      // Add puzzle layers for Chapter 1 TAYLOR puzzle (7 cards: 6 real + 1 fake)
      // NOTE: Using DIFFERENT layer numbers like original system (1, 2, 3, 4, 5, 6, 7)
      if (i === 4) layers.push({layer: 7, type: 'cryptogram_coordinate', url: '/treasure_hunt/chapter1/layers/nft_4_layer_7.png', description: 'ROW 3, COLUMN 7 → X (FAKE)'});
      if (i === 5) layers.push({layer: 1, type: 'cryptogram_coordinate', url: '/treasure_hunt/chapter1/layers/nft_5_layer_1.png', description: 'ROW 2, COLUMN 2 → T'});
      if (i === 8) layers.push({layer: 4, type: 'cryptogram_coordinate', url: '/treasure_hunt/chapter1/layers/nft_8_layer_4.png', description: 'ROW 1, COLUMN 1 → A'});
      if (i === 12) layers.push({layer: 2, type: 'cryptogram_coordinate', url: '/treasure_hunt/chapter1/layers/nft_12_layer_2.png', description: 'ROW 13, COLUMN 1 → Y'});
      if (i === 15) layers.push({layer: 5, type: 'cryptogram_coordinate', url: '/treasure_hunt/chapter1/layers/nft_15_layer_5.png', description: 'ROW 1, COLUMN 5 → L'});
      if (i === 17) layers.push({layer: 3, type: 'cryptogram_coordinate', url: '/treasure_hunt/chapter1/layers/nft_17_layer_3.png', description: 'ROW 1, COLUMN 3 → O'});
      if (i === 20) layers.push({layer: 6, type: 'cryptogram_coordinate', url: '/treasure_hunt/chapter1/layers/nft_20_layer_6.png', description: 'ROW 1, COLUMN 4 → R'});

      nfts.push({
        token_id: i,
        name: `Seychelles Treasure #${i}`,
        description: `Chapter 1: The Trail Begins - NFT #${i}`,
        image_uri: `/images/nft_${i}.png`,
        chapter: 'Chapter 1: The Trail Begins',
        rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        art_rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        layers: JSON.stringify(layers),
        puzzle_enabled: [4, 5, 8, 12, 15, 17, 20].includes(i),
        price_xrp: 10.0,
        for_sale: true,
        current_owner: null
      });
    }

    // Chapter 2: NFTs 21-40 (with puzzle layers)
    for (let i = 21; i <= 40; i++) {
      const layers = [{layer: 0, type: 'base_artwork', description: 'Original artwork'}];

      // Add puzzle layers for Chapter 2 ANSE SOLEIL puzzle (4 cards: 3 real + 1 fake)
      // NOTE: Using DIFFERENT layer numbers like original system
      if (i === 25) layers.push({layer: 1, type: 'cipher_text', url: '/images/nft_25_layer_1.png', description: 'Cipher: JWBN BXUNRU'});
      if (i === 28) layers.push({layer: 4, type: 'fake_map', url: '/images/nft_28_layer_1.png', description: 'FAKE MAP - Wrong beach'});
      if (i === 32) layers.push({layer: 2, type: 'real_map', url: '/images/nft_32_layer_2.png', description: 'Real map: Anse Soleil'});
      if (i === 37) layers.push({layer: 3, type: 'decoding_key', url: '/images/nft_37_layer_3.png', description: 'Key: SHIFT NINE FORWARD'});

      nfts.push({
        token_id: i,
        name: `Seychelles Treasure #${i}`,
        description: `Chapter 2: The Hidden Cache - NFT #${i}`,
        image_uri: `/images/nft_${i}.png`,
        chapter: 'Chapter 2: The Hidden Cache',
        rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        art_rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
        layers: JSON.stringify(layers),
        puzzle_enabled: [25, 28, 32, 37].includes(i),
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
