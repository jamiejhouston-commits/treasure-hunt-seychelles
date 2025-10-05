const fs = require('fs');
const path = require('path');
const db = require('./database/connection');

async function loadChapter3Metadata() {
    const chapter3Dir = path.resolve(__dirname, '../scripts/dist/chapter3');
    const chapter3Data = [];
    
    console.log('🔍 Loading Chapter 3 metadata files...');
    
    for (let i = 1; i <= 20; i++) {
        const paddedNum = String(i).padStart(2, '0');
        const metadataPath = path.join(chapter3Dir, `chapter3-${paddedNum}-metadata.json`);
        
        try {
            const content = fs.readFileSync(metadataPath, 'utf-8');
            const metadata = JSON.parse(content);
            
            const locationAttr = metadata.attributes.find(a => a.trait_type === 'Location');
            const rarityAttr = metadata.attributes.find(a => a.trait_type === 'Rarity');
            const symbolAttr = metadata.attributes.find(a => a.trait_type === 'Symbol');
            
            chapter3Data.push({
                id: 100 + i, // IDs 101-120
                token_id: 100 + i,
                name: metadata.name,
                description: metadata.description,
                // Use existing preview images served from server.js: /preview/chapter3/S3-XX.png
                image_uri: `/preview/chapter3/S3-${paddedNum}.png`,
                metadata_uri: `ipfs://pending-chapter3-${i}`,
                chapter: 'Chapter 3 — VASA Expedition',
                island: locationAttr?.value?.split(', ')[1] || 'Mahé',
                rarity: (rarityAttr?.value || 'Common').toLowerCase(),
                attributes: JSON.stringify(metadata.attributes),
                clue_data: JSON.stringify({
                    clue: metadata.properties?.clue || '',
                    symbol: symbolAttr?.value || '',
                    coordinates: metadata.properties?.clue?.match(/Coordinates: ([^-]+)/)?.[1]?.trim() || '',
                    chapter: 3,
                    card_number: i
                }),
                current_owner: 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH', // Your owner address from real_nfts.json
                price_xrp: null,
                for_sale: 0,
                offer_id: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            
            console.log(`✅ Loaded: ${metadata.name}`);
        } catch (error) {
            console.error(`❌ Error loading chapter3-${paddedNum}-metadata.json:`, error.message);
        }
    }
    
    return chapter3Data;
}

async function restoreChapter3NFTs() {
    console.log('🏴‍☠️ RESTORING CHAPTER 3 NFTS TO TREASURE OF SEYCHELLES GALLERY');
    console.log('================================================================');
    
    try {
        // Load Chapter 3 metadata
        const chapter3Data = await loadChapter3Metadata();
        console.log(`\n📦 Found ${chapter3Data.length} Chapter 3 NFTs to restore`);
        
        if (chapter3Data.length === 0) {
            console.log('❌ No Chapter 3 metadata found!');
            return;
        }
        
        // Delete existing IDs 101-120 (SE2 entries that shouldn't be there)
        console.log('\n🗑️  Removing incorrect SE2 entries from IDs 101-120...');
        const deleted = await db('nfts').whereBetween('id', [101, 120]).del();
        console.log(`✅ Removed ${deleted} incorrect entries`);
        
        // Insert proper Chapter 3 NFTs
        console.log('\n📥 Inserting proper Chapter 3 NFTs...');
        for (const nft of chapter3Data) {
            await db('nfts').insert(nft);
            console.log(`✅ Restored: ${nft.name} (ID: ${nft.id})`);
        }
        
        // Verify the restoration
        const count = await db('nfts').count('* as count').first();
        const chapter3Count = await db('nfts').where('chapter', 'like', '%Chapter 3%').count('* as count').first();
        
        console.log('\n📊 RESTORATION COMPLETE:');
        console.log(`   Total NFTs in database: ${count.count}`);
        console.log(`   Chapter 3 NFTs restored: ${chapter3Count.count}`);
        console.log('   Your beautiful Chapter 3 "VASA Expedition" NFTs are back! 🎉');
        
        process.exit(0);
        
    } catch (error) {
        console.error('💥 Error restoring Chapter 3 NFTs:', error);
        process.exit(1);
    }
}

restoreChapter3NFTs();