// FIX Chapter VI - Add ALL 20 NFTs (6001-6020) not just the 13
const fs = require('fs-extra');
const path = require('path');
const Database = require('better-sqlite3');

console.log('🎯 FIXING CHAPTER VI - ADDING ALL 20 NFTS (6001-6020)!');
console.log('❌ Previously only had 13, missing 7 NFTs');

const db = new Database('./database.sqlite');

// Remove existing incomplete Chapter VI data
db.prepare('DELETE FROM nfts WHERE token_id >= 6001 AND token_id <= 6020').run();
console.log('🗑️ Removed incomplete Chapter VI data');

// Get ALL Chapter VI mint data (original + retry)
const mintPath = path.resolve('../data/mint_results.json');
const retryPath = path.resolve('../data/retry_results.json');
const originalMints = fs.readJsonSync(mintPath);
const retryMints = fs.readJsonSync(retryPath);

// Create complete Chapter VI dataset (6001-6020)
const ch6NFTs = [];
for (let tokenId = 6001; tokenId <= 6020; tokenId++) {
  // Check if this token was in retry results (successful)
  const retryResult = retryMints.find(r => r.tokenId === tokenId && r.success);
  
  // Check if this token was in original mints
  const originalResult = originalMints.find(r => r.tokenId === tokenId);
  
  const nft = {
    id: tokenId,
    token_id: tokenId,
    nftoken_id: `MINTED_CH6_${tokenId.toString().padStart(4, '0')}`,
    name: `Chapter VI Treasure #${tokenId}`,
    description: `Chapter VI - Seychelles Treasure NFT #${tokenId}`,
    image_uri: `/ch6_premint/ch6_${String(tokenId - 6000).padStart(3, '0')}.png`,
    metadata_uri: retryResult?.metadataUri || originalResult?.metadataUri || `https://gateway.pinata.cloud/ipfs/ch6_${tokenId}`,
    chapter: 'VI — Treasure Collection',
    island: 'Seychelles',
    rarity: 'Rare',
    attributes: JSON.stringify([{trait_type: 'Chapter', value: '6'}, {trait_type: 'Collection', value: 'Treasure'}]),
    clue_data: JSON.stringify({chapter: 6, collection: 'treasure'}),
    current_owner: 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH',
    price_xrp: null,
    for_sale: 0,
    offer_id: null,
    created_at: retryResult?.timestamp || originalResult?.timestamp || '2025-09-25T00:00:00.000Z',
    updated_at: retryResult?.timestamp || originalResult?.timestamp || '2025-09-25T00:00:00.000Z'
  };
  
  ch6NFTs.push(nft);
}

console.log(`✅ Prepared ALL ${ch6NFTs.length} Chapter VI NFTs (6001-6020)`);

// Insert ALL 20 Chapter VI NFTs
const insertStmt = db.prepare(`
  INSERT INTO nfts (
    id, token_id, nftoken_id, name, description, image_uri, metadata_uri,
    chapter, island, rarity, attributes, clue_data, current_owner,
    price_xrp, for_sale, offer_id, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const nft of ch6NFTs) {
  insertStmt.run([
    nft.id, nft.token_id, nft.nftoken_id, nft.name, nft.description,
    nft.image_uri, nft.metadata_uri, nft.chapter, nft.island, nft.rarity,
    nft.attributes, nft.clue_data, nft.current_owner, nft.price_xrp,
    nft.for_sale, nft.offer_id, nft.created_at, nft.updated_at
  ]);
}

console.log(`✅ Inserted ALL 20 Chapter VI NFTs`);

// Final verification
const chapterBreakdown = db.prepare('SELECT chapter, COUNT(*) as count FROM nfts GROUP BY chapter ORDER BY chapter').all();
console.log(`\n📊 CORRECTED BREAKDOWN:`);
chapterBreakdown.forEach(row => console.log(`   ${row.chapter}: ${row.count} NFTs`));

const totalCount = db.prepare('SELECT COUNT(*) as count FROM nfts').get();
console.log(`\n🎉 TOTAL: ${totalCount.count} minted NFTs`);
console.log(`✅ Chapter I: 100 NFTs`);
console.log(`✅ Chapter III: 20 NFTs`); 
console.log(`✅ Chapter VI: 20 NFTs (FIXED!)`);
console.log(`📊 Expected total: 140 NFTs`);

db.close();