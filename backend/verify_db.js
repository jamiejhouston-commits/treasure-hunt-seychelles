const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all(
  'SELECT nftoken_id, name, rarity, puzzle_enabled FROM nfts WHERE chapter = ? ORDER BY token_id LIMIT 5',
  ['Chapter 1'],
  (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log('\n📊 Sample NFTs in Database:');
      rows.forEach(r => {
        console.log(`  ✓ ${r.name} (${r.rarity}${r.puzzle_enabled ? ', 🧩 PUZZLE' : ''})`);
        console.log(`    NFTokenID: ${r.nftoken_id}`);
      });
    }
    db.close();
  }
);
