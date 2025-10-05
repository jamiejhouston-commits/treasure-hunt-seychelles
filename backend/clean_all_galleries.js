const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🧹 Starting complete database cleanup...\n');

db.serialize(() => {
  // Get count of all NFTs before deletion
  db.get('SELECT COUNT(*) as count FROM nfts', (err, row) => {
    if (err) {
      console.error('❌ Error counting NFTs:', err);
      return;
    }
    
    const totalCount = row.count;
    console.log(`Found ${totalCount} total NFTs in database`);
    
    if (totalCount === 0) {
      console.log('✅ Database already clean!');
      db.close();
      return;
    }
    
    // Show breakdown by chapter if possible
    db.all('SELECT chapter, COUNT(*) as count FROM nfts GROUP BY chapter', (err, rows) => {
      if (!err && rows.length > 0) {
        console.log('\nBreakdown by chapter:');
        rows.forEach(row => {
          console.log(`  Chapter ${row.chapter || 'NULL'}: ${row.count} NFTs`);
        });
      }
      
      console.log('\n⚠️  About to delete ALL NFTs from database...');
      
      // Delete everything
      db.run('DELETE FROM nfts', function(err) {
        if (err) {
          console.error('❌ Error deleting NFTs:', err);
          db.close();
          return;
        }
        
        console.log(`\n✅ Successfully deleted ${this.changes} NFTs from database`);
        console.log('🎯 Database is now completely clean and ready for fresh minting!');
        
        // Verify the database is empty
        db.get('SELECT COUNT(*) as count FROM nfts', (err, row) => {
          if (!err) {
            console.log(`\n✓ Verification: ${row.count} NFTs remaining (should be 0)`);
          }
          db.close();
        });
      });
    });
  });
});
