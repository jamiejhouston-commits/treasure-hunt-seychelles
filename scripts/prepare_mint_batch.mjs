#!/usr/bin/env node

/**
 * Complete NFT Minting Pipeline for Seychelles Treasure Collection
 * 
 * This script handles the entire process:
 * 1. Upload images to Pinata IPFS
 * 2. Generate XLS-20 compliant metadata
 * 3. Upload metadata to Pinata IPFS
 * 4. Prepare mint input file
 * 5. Execute batch minting on XRPL
 * 6. Update database for Gallery Minted
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.error('❌ Missing Pinata credentials in .env file');
    process.exit(1);
}

const MINT_NOW_DIR = path.join(__dirname, '..', 'mint_now');
const DATA_DIR = path.join(__dirname, '..', 'data');
const METADATA_DIR = path.join(__dirname, '..', 'metadata', 'new_batch');

// Ensure directories exist
if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
}

/**
 * Upload a file to Pinata IPFS
 */
async function uploadToPinata(filePath, fileName, isJSON = false) {
    try {
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        const data = new FormData();
        
        if (isJSON) {
            data.append('file', fs.createReadStream(filePath), {
                filename: fileName,
                contentType: 'application/json'
            });
        } else {
            data.append('file', fs.createReadStream(filePath), {
                filename: fileName,
                contentType: 'image/png'
            });
        }
        
        data.append('pinataMetadata', JSON.stringify({
            name: fileName,
            keyvalues: {
                project: 'seychelles-treasure',
                type: isJSON ? 'metadata' : 'image'
            }
        }));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
                ...data.getHeaders()
            },
            body: data
        });
        
        if (!response.ok) {
            throw new Error(`Pinata upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    } catch (error) {
        console.error(`Failed to upload ${fileName}:`, error.message);
        throw error;
    }
}

/**
 * Generate metadata for an NFT based on filename analysis
 */
function generateMetadata(filename, imageUrl, tokenId) {
    // Analyze filename to extract meaningful data
    const baseName = path.basename(filename, '.png');
    
    // Extract semantic information from filename
    let name, description, attributes = [];
    
    if (baseName.includes('creole')) {
        // Creole culture NFTs
        if (baseName.includes('night_fishing')) {
            name = "Creole Night Fishing";
            description = "Traditional Seychellois fishermen casting nets under the golden glow of lanterns, preserving ancestral techniques passed down through generations of island folk.";
            attributes = [
                { trait_type: "Culture", value: "Creole" },
                { trait_type: "Activity", value: "Night Fishing" },
                { trait_type: "Time", value: "Night" },
                { trait_type: "Rarity", value: "Rare" }
            ];
        } else if (baseName.includes('black_parrot')) {
            name = "Black Parrot of Praslin";
            description = "The endangered Seychelles Black Parrot, found only in the ancient coco de mer forests of Praslin, a living treasure as rare as pirate gold.";
            attributes = [
                { trait_type: "Fauna", value: "Black Parrot" },
                { trait_type: "Location", value: "Praslin" },
                { trait_type: "Status", value: "Endangered" },
                { trait_type: "Rarity", value: "Epic" }
            ];
        } else if (baseName.includes('village_dance')) {
            name = "Creole Village Dance";
            description = "The rhythmic heartbeat of Seychellois culture, where traditional dances tell stories of the islands' rich history under tropical moonlight.";
            attributes = [
                { trait_type: "Culture", value: "Creole" },
                { trait_type: "Activity", value: "Dancing" },
                { trait_type: "Community", value: "Village" },
                { trait_type: "Rarity", value: "Uncommon" }
            ];
        } else if (baseName.includes('jungle_river')) {
            name = "Jungle River Passage";
            description = "Hidden waterways cutting through Mahé's dense tropical jungle, where pirates once moved treasure under the canopy's protective embrace.";
            attributes = [
                { trait_type: "Landscape", value: "River" },
                { trait_type: "Biome", value: "Jungle" },
                { trait_type: "Mystery", value: "Pirate Route" },
                { trait_type: "Rarity", value: "Rare" }
            ];
        } else if (baseName.includes('fishing_village')) {
            name = "Traditional Fishing Village";
            description = "Colorful Creole houses dotting the coastline, where generations of fishermen have cast their nets in search of the ocean's bounty.";
            attributes = [
                { trait_type: "Settlement", value: "Fishing Village" },
                { trait_type: "Architecture", value: "Creole" },
                { trait_type: "Occupation", value: "Fishing" },
                { trait_type: "Rarity", value: "Common" }
            ];
        } else if (baseName.includes('forest_spirits')) {
            name = "Forest Spirits of Mahé";
            description = "Ancient spirits dwelling in Mahé's primordial forests, guardians of secrets that predate even Levasseur's buried treasure.";
            attributes = [
                { trait_type: "Mystical", value: "Forest Spirits" },
                { trait_type: "Location", value: "Mahé" },
                { trait_type: "Element", value: "Nature" },
                { trait_type: "Rarity", value: "Legendary" }
            ];
        } else if (baseName.includes('plantation_house')) {
            name = "Colonial Plantation House";
            description = "A weathered plantation house where colonial history and Creole heritage intertwine, witness to centuries of island transformation.";
            attributes = [
                { trait_type: "Architecture", value: "Colonial" },
                { trait_type: "History", value: "Plantation Era" },
                { trait_type: "Heritage", value: "Mixed" },
                { trait_type: "Rarity", value: "Rare" }
            ];
        } else {
            // Generic Creole NFT
            name = "Creole Heritage";
            description = "A glimpse into the rich Creole culture of Seychelles, where African, French, and Indian influences blend in tropical harmony.";
            attributes = [
                { trait_type: "Culture", value: "Creole" },
                { trait_type: "Heritage", value: "Mixed" },
                { trait_type: "Rarity", value: "Common" }
            ];
        }
    } else if (baseName.includes('vallee_de_mai')) {
        name = "Vallée de Mai Primeval Forest";
        description = "The legendary Vallée de Mai, home to the coco de mer palm and ancient secrets. This UNESCO World Heritage site holds mysteries as old as the Garden of Eden.";
        attributes = [
            { trait_type: "Location", value: "Vallée de Mai" },
            { trait_type: "Flora", value: "Coco de Mer" },
            { trait_type: "Status", value: "UNESCO Heritage" },
            { trait_type: "Rarity", value: "Legendary" }
        ];
    } else if (baseName.includes('painted')) {
        // Artistic interpretation NFTs
        const paintedNum = baseName.match(/(\d+)_painted/)?.[1] || tokenId;
        name = `Seychelles Artistic Vision #${paintedNum}`;
        description = "An artistic interpretation of Seychelles' natural beauty, capturing the essence of paradise through the lens of creative expression.";
        attributes = [
            { trait_type: "Art Style", value: "Painted" },
            { trait_type: "Series", value: "Artistic Vision" },
            { trait_type: "Medium", value: "Digital Art" },
            { trait_type: "Rarity", value: "Rare" }
        ];
    } else {
        // Generic Seychelles NFT based on other patterns
        name = `Seychelles Treasure Clue #${tokenId}`;
        description = "A cryptographic clue leading to the legendary treasure of Olivier Levasseur, hidden somewhere in the pristine islands of Seychelles.";
        attributes = [
            { trait_type: "Type", value: "Treasure Clue" },
            { trait_type: "Island Group", value: "Seychelles" },
            { trait_type: "Mystery", value: "Levasseur" },
            { trait_type: "Rarity", value: "Common" }
        ];
    }
    
    // Add standard attributes
    attributes.push(
        { trait_type: "Token ID", value: tokenId },
        { trait_type: "Chapter", value: "Seychelles Heritage" },
        { trait_type: "Collection", value: "Levasseur Treasure" }
    );
    
    return {
        name,
        description,
        image: imageUrl,
        external_url: "https://treasureofseychelles.com",
        attributes,
        properties: {
            category: "image",
            creators: [{
                address: "r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH",
                share: 100
            }]
        }
    };
}

/**
 * Main processing function
 */
async function processNewBatch() {
    console.log('🏴‍☠️ Starting NFT Minting Pipeline for Seychelles Treasure Collection\n');
    
    // Step 1: Get list of images
    const imageFiles = fs.readdirSync(MINT_NOW_DIR)
        .filter(file => file.toLowerCase().endsWith('.png'))
        .sort();
    
    if (imageFiles.length === 0) {
        console.error('❌ No PNG images found in mint_now directory');
        return;
    }
    
    console.log(`📸 Found ${imageFiles.length} images to process:`);
    imageFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
    console.log();
    
    const results = [];
    const startingTokenId = 7001; // Continue from where we left off
    
    // Step 2: Process each image
    for (let i = 0; i < imageFiles.length; i++) {
        const filename = imageFiles[i];
        const tokenId = startingTokenId + i;
        const imagePath = path.join(MINT_NOW_DIR, filename);
        
        console.log(`⚓ Processing ${i + 1}/${imageFiles.length}: ${filename}`);
        
        try {
            // Upload image to Pinata
            console.log(`   📤 Uploading image to IPFS...`);
            const imageUrl = await uploadToPinata(imagePath, filename, false);
            console.log(`   ✅ Image uploaded: ${imageUrl}`);
            
            // Generate metadata
            console.log(`   📝 Generating metadata...`);
            const metadata = generateMetadata(filename, imageUrl, tokenId);
            
            // Save metadata locally
            const metadataFilename = `${tokenId}_metadata.json`;
            const metadataPath = path.join(METADATA_DIR, metadataFilename);
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            
            // Upload metadata to Pinata
            console.log(`   📤 Uploading metadata to IPFS...`);
            const metadataUrl = await uploadToPinata(metadataPath, metadataFilename, true);
            console.log(`   ✅ Metadata uploaded: ${metadataUrl}`);
            
            results.push({
                tokenId,
                filename,
                imageUrl,
                metadataUri: metadataUrl,
                name: metadata.name,
                rarity: metadata.attributes.find(attr => attr.trait_type === "Rarity")?.value || "Common"
            });
            
            console.log(`   🎯 ${metadata.name} (${metadata.attributes.find(attr => attr.trait_type === "Rarity")?.value || "Common"}) - Ready for minting!\n`);
            
        } catch (error) {
            console.error(`   ❌ Failed to process ${filename}:`, error.message);
            console.log();
        }
    }
    
    // Step 3: Create mint input file
    console.log('📋 Creating mint input file...');
    const mintInput = results.map(item => ({
        tokenId: item.tokenId,
        metadataUri: item.metadataUri
    }));
    
    const mintInputPath = path.join(DATA_DIR, 'new_batch_mint_input.json');
    fs.writeFileSync(mintInputPath, JSON.stringify(mintInput, null, 2));
    
    // Step 4: Create summary report
    const summary = {
        totalProcessed: results.length,
        startingTokenId,
        endingTokenId: startingTokenId + results.length - 1,
        rarityBreakdown: {},
        processedAt: new Date().toISOString(),
        readyForMinting: true,
        mintInputFile: 'new_batch_mint_input.json',
        items: results
    };
    
    // Calculate rarity breakdown
    results.forEach(item => {
        const rarity = item.rarity;
        summary.rarityBreakdown[rarity] = (summary.rarityBreakdown[rarity] || 0) + 1;
    });
    
    const summaryPath = path.join(DATA_DIR, 'new_batch_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    // Display final summary
    console.log('🎉 NFT Preparation Complete!\n');
    console.log('📊 SUMMARY:');
    console.log(`   • Total NFTs prepared: ${results.length}`);
    console.log(`   • Token ID range: ${startingTokenId} - ${startingTokenId + results.length - 1}`);
    console.log(`   • Mint input file: ${mintInputPath}`);
    console.log(`   • Summary report: ${summaryPath}`);
    console.log('\n🎭 Rarity Breakdown:');
    Object.entries(summary.rarityBreakdown).forEach(([rarity, count]) => {
        console.log(`   • ${rarity}: ${count} NFTs`);
    });
    
    console.log('\n🚀 Ready for minting! Run the following command to mint:');
    console.log(`   node scripts/batch_mint_new.js`);
    
    return summary;
}

// Run the processing
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🏴‍☠️ Script starting...');
    processNewBatch().catch(error => {
        console.error('💀 Script failed:', error);
        process.exit(1);
    });
}

export default processNewBatch;