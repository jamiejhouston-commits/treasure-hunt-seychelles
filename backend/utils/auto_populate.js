// Auto-populate database on startup if empty
const db = require('../database/connection');

async function autoPopulateDatabase() {
  try {
    // Check if NFTs table exists
    const tableExists = await db.schema.hasTable('nfts');

    if (!tableExists) {
      console.log('📋 NFTs table does not exist, creating...');
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
        table.text('layers');
        table.boolean('puzzle_enabled').defaultTo(false);
        table.text('current_owner');
        table.decimal('price_xrp', 10, 2);
        table.boolean('for_sale').defaultTo(false);
        table.datetime('created_at').defaultTo(db.fn.now());
        table.datetime('updated_at').defaultTo(db.fn.now());
      });
    }

    // Check if database is empty
    const count = await db('nfts').count('* as total').first();

    if (count.total === 0) {
      console.log('🔄 Database is empty, auto-populating with 40 NFTs...');

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
        if (i === 25) layers.push({layer: 1, type: 'cipher_text', url: '/treasure_hunt/chapter2/layers/nft_25_layer_1.png', description: 'Cipher: JWBN BXUNRU'});
        if (i === 28) layers.push({layer: 4, type: 'map_fragment', url: '/treasure_hunt/chapter2/layers/nft_28_layer_4.png', description: 'Map showing northern coastal region'});
        if (i === 32) layers.push({layer: 2, type: 'map_fragment', url: '/treasure_hunt/chapter2/layers/nft_32_layer_2.png', description: 'Map showing southern beach area'});
        if (i === 37) layers.push({layer: 3, type: 'decoding_key', url: '/treasure_hunt/chapter2/layers/nft_37_layer_3.png', description: 'Cipher decoding instructions'});

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

      console.log('✅ Auto-populated database with 40 NFTs (Chapter 1 & 2 with puzzle layers)');
    } else {
      console.log(`📊 Database already has ${count.total} NFTs, skipping auto-populate`);
    }
  } catch (error) {
    console.error('❌ Auto-populate failed:', error);
    // Don't throw - let server start anyway
  }
}

module.exports = { autoPopulateDatabase };
