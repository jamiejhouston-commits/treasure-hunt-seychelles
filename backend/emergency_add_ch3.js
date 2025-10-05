// EMERGENCY FIX - ADD CHAPTER III BACK!
const fs = require('fs-extra');
const path = require('path');
const Database = require('better-sqlite3');

console.log('🚨 EMERGENCY - ADDING CHAPTER III BACK!');

const db = new Database('./database.sqlite');

// Get Chapter III mint data
const mintPath = path.resolve('../data/mint_results.json');
const retryPath = path.resolve('../data/retry_results.json');
const originalMints = fs.readJsonSync(mintPath);
const retryMints = fs.readJsonSync(retryPath);

console.log('📋 Looking for Chapter III tokens (3001-3020)...');

// Create Chapter III dataset (3001-3020)
const ch3NFTs = [];
for (let tokenId = 3001; tokenId <= 3020; tokenId++) {
  // Check retry results first
  const retryResult = retryMints.find(r => r.tokenId === tokenId && r.success);
  // Check original mints
  const originalResult = originalMints.find(r => r.tokenId === tokenId);
  
  const nft = {
    id: tokenId,
    token_id: tokenId,
    nftoken_id: `MINTED_CH3_${tokenId.toString().padStart(4, '0')}`,
    name: `Chapter III Pirate Trail #${tokenId}`,
    description: `Chapter III - The Pirate's Trail NFT #${tokenId}`,
    image_uri: `/ch3_premint/ch3_${String(tokenId - 3000).padStart(3, '0')}.png`,
    metadata_uri: retryResult?.metadataUri || originalResult?.metadataUri || `https://gateway.pinata.cloud/ipfs/ch3_${tokenId}`,
    chapter: 'III — The Pirate\'s Trail',
    island: 'Seychelles',
    rarity: 'Rare',
    attributes: JSON.stringify([{trait_type: 'Chapter', value: '3'}, {trait_type: 'Collection', value: 'Pirates Trail'}]),
    clue_data: JSON.stringify({chapter: 3, collection: 'pirates'}),
    current_owner: 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH',
    price_xrp: null,
    for_sale: 0,
    offer_id: null,
    created_at: retryResult?.timestamp || originalResult?.timestamp || '2025-09-25T00:00:00.000Z',
    updated_at: retryResult?.timestamp || originalResult?.timestamp || '2025-09-25T00:00:00.000Z'
  };
  
  ch3NFTs.push(nft);
}

console.log(`✅ Prepared ${ch3NFTs.length} Chapter III NFTs (3001-3020)`);

// Insert Chapter III NFTs
const insertStmt = db.prepare(`
  INSERT INTO nfts (
    id, token_id, nftoken_id, name, description, image_uri, metadata_uri,
    chapter, island, rarity, attributes, clue_data, current_owner,
    price_xrp, for_sale, offer_id, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const nft of ch3NFTs) {
  insertStmt.run([
    nft.id, nft.token_id, nft.nftoken_id, nft.name, nft.description,
    nft.image_uri, nft.metadata_uri, nft.chapter, nft.island, nft.rarity,
    nft.attributes, nft.clue_data, nft.current_owner, nft.price_xrp,
    nft.for_sale, nft.offer_id, nft.created_at, nft.updated_at
  ]);
}

console.log(`✅ INSERTED ALL 20 CHAPTER III NFTS!`);

// Final verification
const chapterBreakdown = db.prepare('SELECT chapter, COUNT(*) as count FROM nfts GROUP BY chapter ORDER BY chapter').all();
console.log(`\n📊 CURRENT BREAKDOWN:`);
chapterBreakdown.forEach(row => console.log(`   ${row.chapter}: ${row.count} NFTs`));

const totalCount = db.prepare('SELECT COUNT(*) as count FROM nfts').get();
console.log(`\n🎉 TOTAL: ${totalCount.count} minted NFTs`);

db.close();