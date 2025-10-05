const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const DB_PATH = './database.sqlite';

async function loadChapter3Metadata() {
    const chapter3Dir = path.resolve(__dirname, '../scripts/dist/chapter3');
    const metadataFiles = [];
    
    for (let i = 1; i <= 20; i++) {
        const paddedNum = String(i).padStart(2, '0');
        const metadataPath = path.join(chapter3Dir, `chapter3-${paddedNum}-metadata.json`);
        try {
            const content = await fs.readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(content);
            metadataFiles.push({
                index: i,
                metadata,
                imagePath: `chapter3-${paddedNum}.png`
            });
        } catch (error) {
            console.error(`❌ Error reading metadata ${paddedNum}:`, error.message);
        }
    }
    
    return metadataFiles;
}

async function insertChapter3NFTs() {
    console.log('🏴‍☠️ Adding Chapter 3 NFTs to Treasure of Seychelles database...\n');
    
    const db = new sqlite3.Database(DB_PATH);
    const chapter3Data = await loadChapter3Metadata();
    
    return new Promise((resolve, reject) => {
        // Get the highest existing token_id
        db.get('SELECT MAX(token_id) as max_id FROM nfts', (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            
            const startingTokenId = (result?.max_id || 0) + 1;
            console.log(`📊 Starting token_id: ${startingTokenId}`);
            console.log(`📦 Adding ${chapter3Data.length} Chapter 3 NFTs...\n`);
            
            const stmt = db.prepare(`
                INSERT INTO nfts (
                    token_id, name, description, image_uri, metadata_uri, 
                    chapter, island, rarity, attributes, clue_data,
                    current_owner, price_xrp, for_sale, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `);
            
            let completed = 0;
            
            chapter3Data.forEach((item, index) => {
                const tokenId = startingTokenId + index;
                const { metadata, imagePath } = item;
                
                // Extract attributes from metadata
                const locationAttr = metadata.attributes.find(a => a.trait_type === 'Location');
                const rarityAttr = metadata.attributes.find(a => a.trait_type === 'Rarity');
                const themeAttr = metadata.attributes.find(a => a.trait_type === 'Theme');
                
                const imageUri = `/preview/chapter3/${imagePath}`;
                const metadataUri = `ipfs://pending-${tokenId}`; // Will be updated after IPFS upload
                
                stmt.run([
                    tokenId,                                    // token_id
                    metadata.name,                             // name
                    metadata.description,                      // description  
                    imageUri,                                  // image_uri
                    metadataUri,                              // metadata_uri
                    'Chapter 3',                              // chapter
                    locationAttr?.value || 'Seychelles',      // island
                    rarityAttr?.value || 'Common',            // rarity
                    JSON.stringify(metadata.attributes),      // attributes
                    JSON.stringify({                          // clue_data
                        theme: themeAttr?.value || 'Pirates',
                        chapter: 3,
                        card_number: index + 1
                    }),
                    null,                                     // current_owner (not minted yet)
                    null,                                     // price_xrp (not for sale yet)
                    0,                                        // for_sale (false)
                ], function(err) {
                    if (err) {
                        console.error(`❌ Error inserting NFT ${tokenId}:`, err.message);
                        return;
                    }
                    
                    completed++;
                    console.log(`✅ Added: ${metadata.name} (Token ID: ${tokenId})`);
                    
                    if (completed === chapter3Data.length) {
                        stmt.finalize();
                        
                        // Verify insertion
                        db.all('SELECT COUNT(*) as count FROM nfts WHERE chapter = ?', ['Chapter 3'], (err, rows) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            
                            console.log(`\n🎉 Successfully added ${completed} Chapter 3 NFTs!`);
                            console.log(`📊 Total Chapter 3 NFTs in database: ${rows[0].count}`);
                            console.log('\n🏴‍☠️ Chapter 3 NFTs are now visible in your Treasure of Seychelles app!');
                            console.log('🌐 View them at: http://localhost:3000');
                            
                            db.close();
                            resolve();
                        });
                    }
                });
            });
        });
    });
}

// Run the insertion
insertChapter3NFTs().catch(console.error);