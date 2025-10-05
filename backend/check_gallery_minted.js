const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.get("SELECT COUNT(*) as count FROM nfts WHERE nftoken_id IS NOT NULL AND chapter = 'VI'", (err, row) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Chapter VI NFTs with nftoken_id (GALLERY MINTED):', row.count);
    }
    
    // Also check total Chapter VI NFTs
    db.get("SELECT COUNT(*) as count FROM nfts WHERE chapter = 'VI'", (err2, row2) => {
        if (err2) {
            console.error('Error:', err2);
        } else {
            console.log('Total Chapter VI NFTs in database:', row2.count);
        }
        db.close();
    });
});