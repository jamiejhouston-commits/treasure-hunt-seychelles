/**
 * Sync Treasure Hunt NFTs to Database
 * Run this AFTER minting to sync WITH nftokenIDs
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.sqlite');
const resultsPath = path.join(__dirname, '../data/new_batch_mint_results.json');
const inputPath = path.join(__dirname, '../data/new_batch_mint_input.json');

console.log('🏴‍☠️ Syncing Treasure Hunt NFTs to Database\n');

// Load minting results (has nftokenIDs)
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

// Load original input (has full treasure hunt metadata)
const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Create lookup by tokenId
const resultsByTokenId = {};
results.forEach(r => {
    resultsByTokenId[r.tokenId] = r;
});

const db = new sqlite3.Database(dbPath);

let synced = 0;
let failed = 0;

db.serialize(() => {
    console.log(`📦 Processing ${input.length} NFTs...\n`);
    
    const stmt = db.prepare(`
        INSERT INTO nfts (
            nftoken_id,
            token_id,
            name,
            description,
            image_uri,
            metadata_uri,
            chapter,
            island,
            rarity,
            art_rarity,
            rarity_color,
            puzzle_enabled,
            layers
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    input.forEach(nft => {
        const result = resultsByTokenId[nft.tokenId];
        
        if (!result || !result.nftokenID) {
            console.log(`❌ Skipping ${nft.tokenId}: No nftokenID found`);
            failed++;
            return;
        }
        
        const originalData = nft.originalData;
        const imageUri = `https://gateway.pinata.cloud/ipfs/${originalData.image_ipfs}`;
        const metadataUri = `https://gateway.pinata.cloud/ipfs/${originalData.metadata_ipfs}`;
        const layersJson = JSON.stringify(originalData.layers);
        
        stmt.run(
            result.nftokenID,
            originalData.id,
            originalData.name,
            originalData.description,
            imageUri,
            metadataUri,
            originalData.chapter,
            'Treasure Hunt', // island
            originalData.rarity,
            originalData.rarity, // art_rarity same as rarity
            originalData.puzzle_enabled ? '#8B5CF6' : (originalData.rarity === 'Epic' ? '#A855F7' : originalData.rarity === 'Rare' ? '#3B82F6' : originalData.rarity === 'Uncommon' ? '#10B981' : '#6B7280'), // rarity_color
            originalData.puzzle_enabled ? 1 : 0,
            layersJson,
            (err) => {
                if (err) {
                    console.error(`❌ Error syncing ${originalData.name}:`, err.message);
                    failed++;
                } else {
                    console.log(`✅ Synced: ${originalData.name} (${originalData.rarity}${originalData.puzzle_enabled ? ', with puzzle' : ''})`);
                    synced++;
                }
            }
        );
    });
    
    stmt.finalize(() => {
        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ TREASURE HUNT SYNC COMPLETE');
        console.log('═══════════════════════════════════════════════');
        console.log(`   • Successfully synced: ${synced} NFTs`);
        console.log(`   • Failed: ${failed} NFTs`);
        console.log(`\n🎯 Gallery Minted is now ready!`);
        console.log('🧩 Layer viewing and puzzle solving interfaces are active!');
        console.log('\n🚀 Next Steps:');
        console.log('1. Start backend: cd backend && node server.js');
        console.log('2. Start frontend: cd frontend && npm start');
        console.log('3. Navigate to http://localhost:3000/gallery-minted');
        console.log('4. Click any NFT to test Layer Viewer');
        console.log('5. Go to /solve-puzzle to test puzzle submission\n');
        
        db.close();
    });
});
