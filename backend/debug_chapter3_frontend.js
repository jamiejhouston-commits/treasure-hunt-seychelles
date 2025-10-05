async function debugChapter3() {
  try {
    console.log('\n🔍 Debugging Chapter 3 Visibility...\n');
    
    // Test: Count NFTs by chapter
    console.log('NFT count by chapter:');
    const Database = require('better-sqlite3');
    const db = new Database('./database.sqlite');
    const counts = db.prepare(`
      SELECT chapter, COUNT(*) as count 
      FROM nfts 
      WHERE chapter IS NOT NULL 
      GROUP BY chapter 
      ORDER BY chapter
    `).all();
    counts.forEach(row => {
      console.log(`   ${row.chapter}: ${row.count} NFTs`);
    });
    
    // Test 4: Show Chapter 3 NFTs
    console.log('\n4️⃣ Chapter 3 NFTs in database:');
    const ch3nfts = db.prepare(`
      SELECT id, token_id, name, chapter 
      FROM nfts 
      WHERE chapter = 'Chapter 3' 
      ORDER BY token_id
    `).all();
    ch3nfts.forEach(nft => {
      console.log(`   Token ${nft.token_id}: ${nft.name}`);
    });
    
    console.log('\n✅ Debug complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugChapter3();
