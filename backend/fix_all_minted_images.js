const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

console.log('🔧 Fixing image URLs for all minted NFTs...');

// Get all minted NFTs
const mintedNFTs = db.prepare('SELECT token_id, chapter, image_uri FROM nfts WHERE nftoken_id IS NOT NULL').all();

console.log(`📊 Found ${mintedNFTs.length} minted NFTs to update`);

// Prepare update statement
const updateStmt = db.prepare('UPDATE nfts SET image_uri = ? WHERE token_id = ?');

// Begin transaction for performance
const updateAll = db.transaction((nfts) => {
  let updatedCount = 0;

  for (const nft of nfts) {
    let newImageUri;

    // Determine the correct image URL based on chapter
    if (nft.chapter === 'Chapter VI' && nft.image_uri.includes('/ch6/')) {
      // Chapter VI already has correct URLs, skip
      continue;
    } else if (nft.chapter === 'Chapter IV') {
      // Chapter IV should use ch4 images
      const imageNum = String(nft.token_id - 100).padStart(3, '0'); // Tokens 101-120 -> ch4_001-020
      newImageUri = `/ch4/images/ch4_${imageNum}.png`;
    } else if (nft.chapter === 'Chapter V') {
      // Chapter V should use ch5 images
      const imageNum = String(nft.token_id - 120).padStart(3, '0'); // Adjust based on actual token ranges
      newImageUri = `/ch5/images/ch5_${imageNum}.png`;
    } else {
      // For Chapter 1, 3, and any others - use the real generated images
      newImageUri = `/real/images/${nft.token_id}.png`;
    }

    if (newImageUri && newImageUri !== nft.image_uri) {
      updateStmt.run(newImageUri, nft.token_id);
      updatedCount++;
      console.log(`✅ Updated token ${nft.token_id} (${nft.chapter}): ${nft.image_uri} -> ${newImageUri}`);
    }
  }

  console.log(`\n📊 Updated ${updatedCount} image URLs`);
});

// Execute all updates in a single transaction
try {
  updateAll(mintedNFTs);
  console.log('✅ Successfully fixed all minted NFT image URLs!');
} catch (error) {
  console.error('❌ Error updating image URLs:', error);
  process.exit(1);
}

db.close();