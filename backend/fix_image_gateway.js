const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Updating image URLs to use ipfs.io gateway...\n');

db.serialize(() => {
    // Update all Pinata gateway URLs to use ipfs.io
    db.run(`
        UPDATE nfts 
        SET image_uri = REPLACE(image_uri, 'https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/')
        WHERE image_uri LIKE 'https://gateway.pinata.cloud/ipfs/%'
    `, function(err) {
        if (err) {
            console.error('❌ Error updating image_uri:', err);
        } else {
            console.log(`✅ Updated ${this.changes} image_uri records`);
        }
    });
    
    db.run(`
        UPDATE nfts 
        SET metadata_uri = REPLACE(metadata_uri, 'https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/')
        WHERE metadata_uri LIKE 'https://gateway.pinata.cloud/ipfs/%'
    `, function(err) {
        if (err) {
            console.error('❌ Error updating metadata_uri:', err);
        } else {
            console.log(`✅ Updated ${this.changes} metadata_uri records`);
        }
        
        console.log('\n🎯 Image URLs updated to use ipfs.io gateway');
        console.log('   This gateway has better rate limits for public access\n');
        
        db.close();
    });
});
