/**
 * Clean up unminted Chapter 1 NFTs from database
 * Run this before doing proper minting workflow
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🧹 Cleaning up unminted Chapter 1 NFTs from database\n');

db.serialize(() => {
  // First, show what we're about to delete
  db.all(`
    SELECT id, token_id, name, chapter, art_rarity, puzzle_enabled
    FROM nfts
    WHERE chapter = 'Chapter 1'
  `, (err, rows) => {
    if (err) {
      console.error('Error querying NFTs:', err);
      return;
    }
    
    console.log(`Found ${rows.length} Chapter 1 NFTs to remove:\n`);
    rows.forEach(nft => {
      console.log(`  #${nft.token_id}: ${nft.name} (${nft.art_rarity}${nft.puzzle_enabled ? ', Puzzle' : ''})`);
    });
    console.log('');
    
    // Delete them
    db.run(`DELETE FROM nfts WHERE chapter = 'Chapter 1'`, function(err) {
      if (err) {
        console.error('Error deleting NFTs:', err);
        return;
      }
      
      console.log(`✅ Deleted ${this.changes} NFTs from database\n`);
      
      // Also clean up any puzzle submissions
      db.run(`DELETE FROM puzzle_submissions WHERE chapter = 'chapter1'`, function(err) {
        if (err) {
          console.error('Error deleting submissions:', err);
        } else if (this.changes > 0) {
          console.log(`✅ Deleted ${this.changes} puzzle submissions\n`);
        }
        
        console.log('═══════════════════════════════════════════════');
        console.log('✅ DATABASE CLEANED!');
        console.log('═══════════════════════════════════════════════\n');
        console.log('📁 NFT files still exist in:');
        console.log('   content/treasure_hunt_chapter1/\n');
        console.log('🚀 Next Steps:');
        console.log('1. Upload images to IPFS/Pinata');
        console.log('2. Mint NFTs to XRPL testnet');
        console.log('3. Sync minted NFTs to database');
        console.log('4. View in Gallery Minted\n');
        
        db.close();
      });
    });
  });
});
