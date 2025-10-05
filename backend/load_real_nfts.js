const fs = require('fs');
const path = require('path');
const knex = require('knex');

// Initialize database connection
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'database.sqlite')
  },
  useNullAsDefault: true
});

async function loadRealNFTs() {
  console.log('🏴‍☠️ LOADING REAL LEVASSEUR TREASURE NFTS INTO DATABASE');
  console.log('====================================================');
  
  try {
    // Read the real NFT data
    const realNFTsPath = path.join(__dirname, 'real_nfts.json');
    const realNFTs = JSON.parse(fs.readFileSync(realNFTsPath, 'utf8'));
    
    console.log(`📋 Found ${realNFTs.length} real NFTs to load`);
    
    // Clear existing NFT data
    await db('nfts').del();
    console.log('🗑️  Cleared old data');
    
    // Insert real NFTs
    for (const nft of realNFTs) {
      await db('nfts').insert({
        id: nft.id,
        token_id: nft.token_id,
        name: nft.name,
        description: nft.description,
        image_url: nft.image_url,
        metadata_url: nft.metadata_url,
        attributes: JSON.stringify(nft.attributes),
        rarity: nft.rarity,
        price: nft.price,
        owner_address: nft.owner_address,
        transaction_hash: nft.transaction_hash,
        minted_at: nft.minted_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    console.log(`✅ Successfully loaded ${realNFTs.length} REAL NFTs into database`);
    
    // Update collection stats
    const stats = await db('nfts').select(
      db.raw('COUNT(*) as total'),
      db.raw('COUNT(DISTINCT owner_address) as owners'),
      db.raw('AVG(price) as floor_price')
    ).first();
    
    console.log('📊 Collection Stats:');
    console.log(`  - Total NFTs: ${stats.total}`);
    console.log(`  - Unique Owners: ${stats.owners}`);
    console.log(`  - Floor Price: ${stats.floor_price?.toFixed(2)} XRP`);
    
    await db.destroy();
    
    console.log('\n🎉 SUCCESS! Your REAL Seychelles treasure maps are now in the database!');
    console.log('🏴‍☠️ No more mock compass images - your collection is LIVE!');
    
  } catch (error) {
    console.error('❌ Error loading real NFTs:', error.message);
    await db.destroy();
    process.exit(1);
  }
}

loadRealNFTs();