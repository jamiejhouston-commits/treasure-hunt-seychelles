// Quick script to add NFTs using only columns that exist in the database
const db = require('./database/connection');

async function addNFTs() {
  console.log('Adding Chapter 1 & 2 NFTs to database...');

  const nfts = [];

  // Chapter 1: NFTs 1-20
  for (let i = 1; i <= 20; i++) {
    nfts.push({
      token_id: i,
      name: `Seychelles Treasure #${i}`,
      description: `Chapter 1: The Trail Begins - NFT #${i}`,
      image_uri: `/images/nft_${i}.png`,
      metadata_uri: `/treasure_hunt/chapter1/metadata/nft_${i}.json`,
      chapter: 'Chapter 1: The Trail Begins',
      rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
      layers: JSON.stringify([{layer: 0, type: 'base_artwork', description: 'Original artwork'}]),
      puzzle_enabled: [5, 12, 17, 20].includes(i),
      for_sale: false
    });
  }

  // Chapter 2: NFTs 21-40
  for (let i = 21; i <= 40; i++) {
    const layers = [{layer: 0, type: 'base_artwork', description: 'Original artwork'}];

    // Add puzzle layers
    if (i === 25) layers.push({layer: 1, type: 'cipher_text', url: '/images/nft_25_layer_1.png'});
    if (i === 32) layers.push({layer: 2, type: 'map_fragment', url: '/images/nft_32_layer_2.png'});
    if (i === 37) layers.push({layer: 3, type: 'decoding_key', url: '/images/nft_37_layer_3.png'});
    if (i === 40) layers.push({layer: 1, type: 'cryptogram', url: '/images/nft_40_layer_1.png'});

    nfts.push({
      token_id: i,
      name: `Seychelles Treasure #${i}`,
      description: `Chapter 2: The Hidden Cache - NFT #${i}`,
      image_uri: `/images/nft_${i}.png`,
      metadata_uri: `/treasure_hunt/chapter2/metadata/nft_${i}.json`,
      chapter: 'Chapter 2: The Hidden Cache',
      rarity: i % 5 === 0 ? 'epic' : i % 3 === 0 ? 'rare' : i % 2 === 0 ? 'uncommon' : 'common',
      layers: JSON.stringify(layers),
      puzzle_enabled: [25, 32, 37, 40].includes(i),
      for_sale: false
    });
  }

  // Insert NFTs
  for (const nft of nfts) {
    try {
      await db('nfts').insert(nft).onConflict('token_id').ignore();
    } catch (err) {
      console.log(`Skipping NFT ${nft.token_id} - already exists or error:`, err.message);
    }
  }

  const count = await db('nfts').count('* as total').first();
  console.log(`✅ Database now has ${count.total} NFTs!`);
  process.exit(0);
}

addNFTs().catch(console.error);
