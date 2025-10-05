const db = require('../database/connection');

// Mock NFT data for development/demo
const mockNFTs = [
  {
    id: 1,
    token_id: 1001,
    nftoken_id: 'mock_nft_1001',
    name: 'The Captain\'s Compass - Mahé Manuscript #1',
    description: 'A cryptic compass rose etched into ancient parchment. The needle points not north, but toward hidden secrets beneath the granite peaks of Mahé.',
    image_uri: 'ipfs://QmMockImage1/compass.jpg',
    metadata_uri: 'ipfs://QmMockMeta1/metadata.json',
    chapter: 'Mahé Manuscripts',
    island: 'Mahé',
    rarity: 'rare',
    attributes: JSON.stringify([
      { trait_type: 'Chapter', value: 'Mahé Manuscripts' },
      { trait_type: 'Island', value: 'Mahé' },
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Element', value: 'Navigation' }
    ]),
    clue_data: JSON.stringify({
      cipher: 'GRANET PEAKS HOLD THE FIRST BEARING',
      coordinates: '-4.6796, 55.4920',
      hint: 'Where granite meets sky, the first clue lies'
    }),
    current_owner: 'rMockOwner1234567890ABCDEFGH',
    price_xrp: 25.5,
    for_sale: true,
    offer_id: 'mock_offer_1',
    created_at: new Date('2025-01-15')
  },
  {
    id: 2,
    token_id: 1002,
    nftoken_id: 'mock_nft_1002',
    name: 'Sirius Navigator - La Digue\'s Secret #2',
    description: 'A celestial map showing the Southern Cross alignment. When Sirius dances with the constellation, the path to treasure reveals itself.',
    image_uri: 'ipfs://QmMockImage2/stars.jpg',
    metadata_uri: 'ipfs://QmMockMeta2/metadata.json',
    chapter: 'La Digue\'s Secrets',
    island: 'La Digue',
    rarity: 'epic',
    attributes: JSON.stringify([
      { trait_type: 'Chapter', value: 'La Digue\'s Secrets' },
      { trait_type: 'Island', value: 'La Digue' },
      { trait_type: 'Rarity', value: 'Epic' },
      { trait_type: 'Element', value: 'Celestial' }
    ]),
    clue_data: JSON.stringify({
      cipher: 'WHEN SIRIUS ALIGNS WITH SOUTHERN CROSS',
      coordinates: '-4.3587, 55.8397',
      hint: 'Stars guide those who know their dance'
    }),
    current_owner: 'rMockOwner2345678901BCDEFGHI',
    price_xrp: 45.0,
    for_sale: true,
    offer_id: 'mock_offer_2',
    created_at: new Date('2025-02-01')
  },
  {
    id: 3,
    token_id: 1003,
    nftoken_id: 'mock_nft_1003',
    name: 'Coco de Mer Cipher - Praslin\'s Prophecy #3',
    description: 'The sacred double coconut holds nature\'s most complex cipher. Only those who understand botanical mathematics can decode its message.',
    image_uri: 'ipfs://QmMockImage3/coconut.jpg',
    metadata_uri: 'ipfs://QmMockMeta3/metadata.json',
    chapter: 'Praslin\'s Prophecy',
    island: 'Praslin',
    rarity: 'legendary',
    attributes: JSON.stringify([
      { trait_type: 'Chapter', value: 'Praslin\'s Prophecy' },
      { trait_type: 'Island', value: 'Praslin' },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Element', value: 'Nature' }
    ]),
    clue_data: JSON.stringify({
      cipher: 'SACRED PALM WHISPERS NATURE\'S CODE',
      coordinates: '-4.3197, 55.7390',
      hint: 'The forbidden fruit holds forbidden knowledge'
    }),
    current_owner: null,
    price_xrp: 100.0,
    for_sale: false,
    offer_id: null,
    created_at: new Date('2025-02-15')
  },
  {
    id: 4,
    token_id: 1004,
    nftoken_id: 'mock_nft_1004',
    name: 'Azure Infinity - Outer Islands Revelation #4',
    description: 'Where endless ocean meets infinite sky, mathematical precision guides the final steps to Levasseur\'s greatest secret.',
    image_uri: 'ipfs://QmMockImage4/ocean.jpg',
    metadata_uri: 'ipfs://QmMockMeta4/metadata.json',
    chapter: 'Outer Islands Revelation',
    island: 'Aldabra',
    rarity: 'common',
    attributes: JSON.stringify([
      { trait_type: 'Chapter', value: 'Outer Islands Revelation' },
      { trait_type: 'Island', value: 'Aldabra' },
      { trait_type: 'Rarity', value: 'Common' },
      { trait_type: 'Element', value: 'Mathematical' }
    ]),
    clue_data: JSON.stringify({
      cipher: 'WHERE AZURE MEETS INFINITY PRECISE STEPS',
      coordinates: '-9.4034, 46.3481',
      hint: 'Numbers do not lie, coordinates are key'
    }),
    current_owner: 'rMockOwner3456789012CDEFGHIJ',
    price_xrp: 15.75,
    for_sale: true,
    offer_id: 'mock_offer_4',
    created_at: new Date('2025-03-01')
  },
  {
    id: 5,
    token_id: 1005,
    nftoken_id: 'mock_nft_1005',
    name: 'Pirate\'s Gold Map - Mahé Manuscript #5',
    description: 'A fragment of Levasseur\'s original treasure map, burned at the edges but containing crucial longitude calculations.',
    image_uri: 'ipfs://QmMockImage5/map.jpg',
    metadata_uri: 'ipfs://QmMockMeta5/metadata.json',
    chapter: 'Mahé Manuscripts',
    island: 'Mahé',
    rarity: 'rare',
    attributes: JSON.stringify([
      { trait_type: 'Chapter', value: 'Mahé Manuscripts' },
      { trait_type: 'Island', value: 'Mahé' },
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Element', value: 'Cartography' }
    ]),
    clue_data: JSON.stringify({
      cipher: 'LONGITUDE OF FORTUNE BURNS ETERNAL',
      coordinates: '-4.6191, 55.4513',
      hint: 'Even fire cannot destroy true treasure'
    }),
    current_owner: 'rMockOwner4567890123DEFGHIJK',
    price_xrp: 32.25,
    for_sale: true,
    offer_id: 'mock_offer_5',
    created_at: new Date('2025-03-10')
  }
];

// Collection stats
const mockStats = {
  total_nfts: 100,
  total_minted: 67,
  total_owners: 23,
  total_volume_xrp: 2450.75,
  total_sales: 45,
  floor_price_xrp: 15.75,
  average_price_xrp: 54.46,
  puzzle_solved: false,
  treasure_winner_account: null,
  last_updated: new Date()
};

async function seedMockData() {
  try {
    console.log('🌱 Seeding mock NFT data...');
    
    // Clear existing data
    await db('nfts').del();
    await db('collection_stats').del();
    
    // Insert mock NFTs
    await db('nfts').insert(mockNFTs);
    
    // Insert mock stats
    await db('collection_stats').insert(mockStats);
    
    console.log('✅ Mock data seeded successfully');
    console.log(`📊 Added ${mockNFTs.length} mock NFTs to gallery`);
    
  } catch (error) {
    console.error('❌ Error seeding mock data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedMockData().then(() => {
    console.log('✅ Mock data seeding complete');
    process.exit(0);
  }).catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedMockData, mockNFTs, mockStats };