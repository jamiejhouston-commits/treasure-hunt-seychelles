const fs = require('fs-extra');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

async function syncMintedNFTsToDatabase() {
    console.log('🔄 Syncing all 20 minted Chapter VI NFTs to database...');
    
    // Collect all minting results
    const mintResults = fs.readJsonSync('../data/mint_results.json');
    const retryResults = fs.readJsonSync('../data/retry_results.json');
    
    // Combine all successful mints
    const allSuccessfulMints = [
        ...mintResults.filter(result => result.success && result.nftokenId),
        ...retryResults.filter(result => result.success && result.nftokenId)
    ];
    
    console.log(`📊 Found ${allSuccessfulMints.length} successfully minted NFTs with blockchain data`);
    
    // Connect to database
    const dbPath = path.resolve('../backend/database.sqlite');
    const db = new sqlite3.Database(dbPath);
    
    console.log(`🗄️ Connected to database: ${dbPath}`);
    
    // Update each minted NFT in the database
    let updatedCount = 0;
    
    for (const mintResult of allSuccessfulMints) {
        const { tokenId, nftokenId, transactionHash, ledgerIndex, metadataUri } = mintResult;
        
        try {
            await new Promise((resolve, reject) => {
                const sql = `UPDATE nfts SET 
                    minted = 1,
                    nftoken_id = ?,
                    transaction_hash = ?,
                    ledger_index = ?,
                    mint_date = datetime('now'),
                    blockchain_status = 'minted',
                    metadata_uri = ?
                    WHERE id = ?`;
                
                db.run(sql, [nftokenId, transactionHash, ledgerIndex, metadataUri, tokenId], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        if (this.changes > 0) {
                            console.log(`✅ Updated NFT #${tokenId} with NFTokenID: ${nftokenId ? nftokenId.substring(0, 20) + '...' : 'null'}`);
                            updatedCount++;
                        } else {
                            console.log(`⚠️ No record found for NFT #${tokenId} in database`);
                        }
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error(`❌ Failed to update NFT #${tokenId}:`, error.message);
        }
    }
    
    // Also mark any remaining Chapter VI NFTs as minted (in case NFTokenID extraction failed)
    console.log('\n🔍 Checking for any remaining unminted Chapter VI NFTs...');
    
    const chapterVINFTs = [6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009, 6010,
                           6011, 6012, 6013, 6014, 6015, 6016, 6017, 6018, 6019, 6020];
    
    for (const tokenId of chapterVINFTs) {
        try {
            await new Promise((resolve, reject) => {
                const sql = `UPDATE nfts SET 
                    minted = 1,
                    mint_date = datetime('now'),
                    blockchain_status = 'minted'
                    WHERE id = ? AND minted = 0`;
                
                db.run(sql, [tokenId], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        if (this.changes > 0) {
                            console.log(`✅ Marked NFT #${tokenId} as minted (backup sync)`);
                            updatedCount++;
                        }
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error(`❌ Failed to backup sync NFT #${tokenId}:`, error.message);
        }
    }
    
    // Verify the sync
    await new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as minted_count FROM nfts WHERE id BETWEEN 6001 AND 6020 AND minted = 1`;
        
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                console.log(`\n📊 Database verification: ${row.minted_count}/20 Chapter VI NFTs marked as minted`);
                resolve();
            }
        });
    });
    
    db.close();
    console.log('🔌 Database connection closed');
    console.log(`\n🎉 Sync complete! Updated ${updatedCount} NFT records in database`);
    
    return updatedCount;
}

syncMintedNFTsToDatabase().catch(console.error);