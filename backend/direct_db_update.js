const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('🏴‍☠️ DIRECT DATABASE UPDATE - REAL NFTS ONLY!');
console.log('===========================================');

try {
  // Open database
  const db = new Database(path.join(__dirname, 'database.sqlite'));
  
  // Read real NFT data
  const realNFTsPath = path.join(__dirname, 'real_nfts.json');
  const realNFTs = JSON.parse(fs.readFileSync(realNFTsPath, 'utf8'));
  
  console.log(`📋 Found ${realNFTs.length} real NFTs to load`);
  
  // Clear existing data
  db.exec('DELETE FROM nfts');
  console.log('🗑️  Cleared old mock data');
  
  // Create the table first
  db.exec(`
    CREATE TABLE IF NOT EXISTS nfts (
      id INTEGER PRIMARY KEY,
      token_id INTEGER UNIQUE NOT NULL,
      nftoken_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      image_uri TEXT NOT NULL,
      metadata_uri TEXT NOT NULL,
      chapter TEXT NOT NULL,
      island TEXT NOT NULL,
      rarity TEXT NOT NULL,
      attributes TEXT,
      clue_data TEXT,
      current_owner TEXT,
      price_xrp REAL,
      for_sale INTEGER DEFAULT 0,
      offer_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('📋 Created NFTs table');
  
  // Prepare insert statement matching the correct schema
  const insert = db.prepare(`
    INSERT INTO nfts (
      token_id, nftoken_id, name, description, image_uri, metadata_uri, 
      chapter, island, rarity, attributes, current_owner, price_xrp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Insert all real NFTs
  for (const nft of realNFTs) {
    const island = nft.attributes.find(attr => attr.trait_type === 'Island')?.value || 'Seychelles';
    const chapter = nft.attributes.find(attr => attr.trait_type === 'Chapter')?.value || 'Treasure Maps';
    
    insert.run(
      nft.id,
      nft.token_id, 
      nft.name,
      nft.description,
      nft.image_url, // Use image_url as image_uri
      nft.metadata_url, // Use metadata_url as metadata_uri
      chapter,
      island,
      nft.rarity,
      JSON.stringify(nft.attributes),
      nft.owner_address, // Use as current_owner
      nft.price // Use as price_xrp
    );
  }
  
  console.log(`✅ Inserted ${realNFTs.length} REAL NFTs`);
  
  // Verify
  const count = db.prepare('SELECT COUNT(*) as count FROM nfts').get();
  console.log(`📊 Database now contains: ${count.count} NFTs`);
  
  // Sample data
  const sample = db.prepare('SELECT name, rarity, image_uri FROM nfts LIMIT 3').all();
  console.log('🎯 Sample NFTs:');
  sample.forEach(nft => {
    console.log(`  - ${nft.name} (${nft.rarity})`);
    console.log(`    Image: ${nft.image_uri}`);
  });
  
  db.close();
  
  console.log('\n🎉 SUCCESS! Your REAL Seychelles treasure maps are now LIVE!');
  console.log('🏴‍☠️ Refresh your browser to see the real NFTs!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}