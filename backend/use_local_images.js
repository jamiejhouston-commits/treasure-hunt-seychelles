const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Switching to local image URLs...\n');

const baseUrl = 'http://localhost:3001';

db.serialize(() => {
    // Get all Chapter 1 NFTs
    db.all('SELECT id, token_id, name FROM nfts WHERE chapter = ?', ['Chapter 1'], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching NFTs:', err);
            db.close();
            return;
        }
        
        console.log(`📦 Found ${rows.length} Chapter 1 NFTs\n`);
        
        const stmt = db.prepare(`
            UPDATE nfts 
            SET image_uri = ?
            WHERE id = ?
        `);
        
        let updated = 0;
        
        rows.forEach(nft => {
            const imageUrl = `${baseUrl}/treasure_hunt/chapter1/images/nft_${nft.token_id}.png`;
            
            stmt.run(imageUrl, nft.id, (err) => {
                if (err) {
                    console.error(`❌ Error updating ${nft.name}:`, err);
                } else {
                    console.log(`✅ ${nft.name} → ${imageUrl}`);
                    updated++;
                }
            });
        });
        
        stmt.finalize(() => {
            console.log('\n═══════════════════════════════════════════════');
            console.log('✅ IMAGE URLs UPDATED TO LOCAL');
            console.log('═══════════════════════════════════════════════');
            console.log(`   • Updated: ${updated} NFTs`);
            console.log(`   • Source: Local treasure hunt images`);
            console.log(`\n🎯 Images will now load instantly from local server!`);
            console.log('   No more IPFS gateway rate limiting issues.\n');
            
            db.close();
        });
    });
});
