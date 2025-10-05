const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

console.log('🔧 UPDATING IMAGE URLs TO REAL LOCAL IMAGES');
console.log('==========================================');

try {
  // Update all NFTs to use real local images
  const update = db.prepare(`
    UPDATE nfts SET image_uri = ? WHERE id = ?
  `);
  
  const count = db.prepare('SELECT COUNT(*) as count FROM nfts').get();
  console.log(`📊 Updating ${count.count} NFTs...`);
  
  for (let i = 1; i <= 100; i++) {
    const realImageUrl = `http://localhost:3001/real/images/${i}.png`;
    update.run(realImageUrl, i);
  }
  
  console.log('✅ Updated all image URLs to use real local images');
  
  // Verify updates
  const samples = db.prepare('SELECT id, name, image_uri FROM nfts LIMIT 5').all();
  console.log('🎯 Updated sample NFTs:');
  samples.forEach(nft => {
    console.log(`  - NFT #${nft.id}: ${nft.name}`);
    console.log(`    Image: ${nft.image_uri}`);
  });
  
} catch (error) {
  console.log('❌ Error:', error.message);
}

db.close();

console.log('\n🏴‍☠️ NOW REFRESH YOUR BROWSER TO SEE THE REAL TREASURE MAPS!');
console.log('✨ No more mock compass bullshit!');