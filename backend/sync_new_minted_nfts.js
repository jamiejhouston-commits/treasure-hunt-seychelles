#!/usr/bin/env node

/**
 * Sync New Minted NFTs to Database for Gallery Minted
 * 
 * This script takes minted NFT results and adds them to the database
 * so they appear in the Gallery Minted section of the app
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKEND_DIR = path.join(__dirname, '..', 'backend');
const DB_PATH = path.join(BACKEND_DIR, 'database.sqlite');

const MINT_RESULTS_FILE = path.join(DATA_DIR, 'new_batch_mint_results.json');
const BATCH_SUMMARY_FILE = path.join(DATA_DIR, 'new_batch_summary.json');

/**
 * Parse rarity from attributes
 */
function getRarityValue(rarity) {
    const rarityMap = {
        'Common': 1,
        'Uncommon': 2,
        'Rare': 3,
        'Epic': 4,
        'Legendary': 5
    };
    return rarityMap[rarity] || 1;
}

/**
 * Generate nftoken_id format
 */
function generateNFTokenShortId(tokenId, chapter = 'new') {
    return `${chapter}_${String(tokenId).padStart(3, '0')}`;
}

/**
 * Sync minted NFTs to database
 */
function syncNewMintedNFTs() {
    console.log('🔄 Starting Database Sync for New Minted NFTs\n');
    
    // Check if files exist
    if (!fs.existsSync(MINT_RESULTS_FILE)) {
        console.error('❌ Mint results file not found. Run batch minting first.');
        console.error(`   Expected: ${MINT_RESULTS_FILE}`);
        return;
    }
    
    if (!fs.existsSync(BATCH_SUMMARY_FILE)) {
        console.error('❌ Batch summary file not found. Run preparation script first.');
        console.error(`   Expected: ${BATCH_SUMMARY_FILE}`);
        return;
    }
    
    // Load data
    const mintResults = JSON.parse(fs.readFileSync(MINT_RESULTS_FILE, 'utf8'));
    const batchSummary = JSON.parse(fs.readFileSync(BATCH_SUMMARY_FILE, 'utf8'));
    
    console.log(`📋 Loading ${mintResults.length} minted NFTs`);
    console.log(`📝 Loading metadata for ${batchSummary.items.length} items\n`);
    
    // Create mapping of tokenId to metadata
    const metadataMap = {};
    batchSummary.items.forEach(item => {
        metadataMap[item.tokenId] = item;
    });
    
    // Initialize database
    console.log('💾 Connecting to database...');
    const db = new Database(DB_PATH);
    
    // Prepare insert statement
    const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO nfts (
            token_id, nftoken_id, name, description, image_uri, metadata_uri,
            chapter, island, rarity, attributes, 
            current_owner, price_xrp, for_sale, 
            created_at, updated_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, 
            ?, ?, ?, 
            ?, ?
        )
    `);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each minted NFT
    console.log('📝 Inserting NFTs into database...\n');
    
    for (const mintResult of mintResults) {
        const { tokenId, nftokenID, account, timestamp } = mintResult;
        const metadata = metadataMap[tokenId];
        
        if (!metadata) {
            console.error(`❌ No metadata found for token ${tokenId}`);
            errorCount++;
            continue;
        }
        
        try {
            const nftokenShortId = generateNFTokenShortId(tokenId, 'new');
            const rarity = metadata.rarity || 'Common';
            const rarityValue = getRarityValue(rarity);
            
            // Extract image URL from metadata
            const imageUri = metadata.imageUrl || `http://localhost:3001/new/images/${tokenId}.png`;
            const metadataUri = metadata.metadataUri || `http://localhost:3001/new/metadata/${tokenId}.json`;
            
            // Prepare attributes JSON
            const attributesJson = JSON.stringify([
                { trait_type: "Token ID", value: tokenId },
                { trait_type: "Chapter", value: "Seychelles Heritage" },
                { trait_type: "Rarity", value: rarity },
                { trait_type: "Collection", value: "Levasseur Treasure" },
                { trait_type: "Batch", value: "New Batch 2025" }
            ]);
            
            // Insert into database
            insertStmt.run(
                tokenId,                    // token_id
                nftokenShortId,            // nftoken_id
                metadata.name,             // name
                metadata.description || `Seychelles Heritage NFT #${tokenId}`, // description
                imageUri,                  // image_uri
                metadataUri,               // metadata_uri
                'Seychelles Heritage',     // chapter
                'Seychelles',             // island
                rarity.toLowerCase(),      // rarity
                attributesJson,           // attributes
                account,                  // current_owner
                null,                     // price_xrp
                0,                        // for_sale (not for sale initially)
                timestamp,                // created_at
                timestamp                 // updated_at
            );
            
            console.log(`✅ Added ${metadata.name} (Token ${tokenId}) - ${rarity}`);
            successCount++;
            
        } catch (error) {
            console.error(`❌ Failed to insert token ${tokenId}:`, error.message);
            errorCount++;
        }
    }
    
    // Close database
    db.close();
    
    // Create sync report
    const syncReport = {
        syncedAt: new Date().toISOString(),
        totalProcessed: mintResults.length,
        successfullyAdded: successCount,
        errors: errorCount,
        chapter: 'Seychelles Heritage',
        tokenIdRange: {
            start: Math.min(...mintResults.map(r => r.tokenId)),
            end: Math.max(...mintResults.map(r => r.tokenId))
        }
    };
    
    const syncReportPath = path.join(DATA_DIR, 'new_batch_sync_report.json');
    fs.writeFileSync(syncReportPath, JSON.stringify(syncReport, null, 2));
    
    // Display summary
    console.log('\n🎉 Database Sync Complete!\n');
    console.log('📊 SUMMARY:');
    console.log(`   • Successfully added: ${successCount} NFTs`);
    console.log(`   • Errors: ${errorCount} NFTs`);
    console.log(`   • Chapter: Seychelles Heritage`);
    console.log(`   • Token range: ${syncReport.tokenIdRange.start} - ${syncReport.tokenIdRange.end}`);
    console.log(`   • Sync report: ${syncReportPath}`);
    
    if (successCount > 0) {
        console.log('\n✅ NFTs are now available in Gallery Minted!');
        console.log('   🌐 Visit: http://localhost:3000/gallery-minted');
        console.log('   🔍 Filter by "Seychelles Heritage" chapter to see new NFTs');
    }
    
    if (errorCount > 0) {
        console.log(`\n⚠️  ${errorCount} NFTs failed to sync. Check the logs above.`);
    }
    
    return syncReport;
}

// Run the sync
if (require.main === module) {
    try {
        syncNewMintedNFTs();
    } catch (error) {
        console.error('💀 Sync failed:', error.message);
        process.exit(1);
    }
}

module.exports = syncNewMintedNFTs;