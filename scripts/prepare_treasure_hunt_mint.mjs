#!/usr/bin/env node

/**
 * TREASURE HUNT - PROPER MINTING WORKFLOW
 * 
 * This script prepares the 20 Chapter 1 NFTs for minting by:
 * 1. Uploading images to Pinata IPFS
 * 2. Uploading puzzle layers to Pinata IPFS
 * 3. Creating XLS-20 compliant metadata with IPFS hashes
 * 4. Uploading metadata to Pinata IPFS
 * 5. Generating mint input file for batch minting
 * 
 * After running this, use your existing minting script to mint to testnet.
 */

import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from scripts/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.error('❌ Missing Pinata credentials in .env file');
    console.log('   Add PINATA_API_KEY and PINATA_API_SECRET to your .env');
    process.exit(1);
}

const INPUT_DIR = path.join(__dirname, '../content/treasure_hunt_chapter1');
const OUTPUT_DIR = path.join(__dirname, '../data');
const MINT_INPUT_FILE = path.join(OUTPUT_DIR, 'treasure_hunt_mint_input.json');

console.log('🏴‍☠️ TREASURE HUNT - MINTING PREPARATION');
console.log('═══════════════════════════════════════════════\n');

/**
 * Upload file to Pinata IPFS
 */
async function uploadToPinata(filePath, fileName) {
    try {
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        const data = new FormData();
        
        data.append('file', fs.createReadStream(filePath), {
            filename: fileName,
            contentType: fileName.endsWith('.json') ? 'application/json' : 'image/png'
        });
        
        data.append('pinataMetadata', JSON.stringify({
            name: fileName,
            keyvalues: {
                project: 'seychelles-treasure-hunt',
                chapter: 'chapter1',
                type: fileName.endsWith('.json') ? 'metadata' : 'image'
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
        return result.IpfsHash;
    } catch (error) {
        console.error(`Error uploading ${fileName}:`, error.message);
        throw error;
    }
}

/**
 * Main preparation function
 */
async function prepareMinting() {
    try {
        // Load collection metadata
        const collectionFile = path.join(INPUT_DIR, 'collection_metadata.json');
        const collection = await fs.readJSON(collectionFile);
        
        console.log(`📦 Found ${collection.length} NFTs to prepare\n`);
        
        const mintInput = [];
        
        // Process each NFT
        for (const nft of collection) {
            console.log(`\n🎨 Processing NFT #${nft.id}: ${nft.name}`);
            
            // 1. Upload base image
            console.log('  📤 Uploading base image...');
            const imageFile = path.join(INPUT_DIR, 'images', `nft_${nft.id}.png`);
            const imageHash = await uploadToPinata(imageFile, `nft_${nft.id}.png`);
            console.log(`  ✓ Image: ipfs://${imageHash}`);
            
            // 2. Upload puzzle layers if exists
            const layerHashes = [];
            if (nft.puzzle_enabled && nft.layers.length > 1) {
                for (let i = 1; i < nft.layers.length; i++) {
                    const layer = nft.layers[i];
                    console.log(`  📤 Uploading puzzle layer ${layer.layer}...`);
                    const layerFile = path.join(INPUT_DIR, 'layers', `nft_${nft.id}_layer_${layer.layer}.png`);
                    const layerHash = await uploadToPinata(layerFile, `nft_${nft.id}_layer_${layer.layer}.png`);
                    console.log(`  ✓ Layer ${layer.layer}: ipfs://${layerHash}`);
                    layerHashes.push({
                        layer: layer.layer,
                        hash: layerHash
                    });
                }
            }
            
            // 3. Create metadata with IPFS hashes
            const metadata = {
                name: nft.name,
                description: nft.description,
                image: `ipfs://${imageHash}`,
                attributes: nft.attributes,
                properties: {
                    chapter: 'Chapter 1',
                    puzzle_enabled: nft.puzzle_enabled,
                    art_rarity: nft.rarity.tier,
                    rarity_color: nft.rarity.color,
                    layers: nft.layers.map((layer, idx) => ({
                        ...layer,
                        ipfs_hash: idx === 0 ? imageHash : layerHashes[idx - 1]?.hash
                    }))
                }
            };
            
            // 4. Upload metadata
            console.log('  📤 Uploading metadata...');
            const metadataFile = path.join(INPUT_DIR, 'metadata', `nft_${nft.id}.json`);
            await fs.writeJSON(metadataFile, metadata, { spaces: 2 });
            const metadataHash = await uploadToPinata(metadataFile, `nft_${nft.id}_metadata.json`);
            console.log(`  ✓ Metadata: ipfs://${metadataHash}`);
            
            // 5. Add to mint input
            mintInput.push({
                id: nft.id,
                name: nft.name,
                description: nft.description,
                image_ipfs: imageHash,
                metadata_ipfs: metadataHash,
                metadata_uri: `ipfs://${metadataHash}`,
                chapter: 'Chapter 1',
                rarity: nft.rarity.tier,
                puzzle_enabled: nft.puzzle_enabled,
                layers: metadata.properties.layers
            });
            
            console.log(`  ✅ NFT #${nft.id} ready for minting`);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // 6. Save mint input file
        await fs.ensureDir(OUTPUT_DIR);
        await fs.writeJSON(MINT_INPUT_FILE, mintInput, { spaces: 2 });
        
        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ MINTING PREPARATION COMPLETE!');
        console.log('═══════════════════════════════════════════════\n');
        console.log(`📁 Mint input file: ${MINT_INPUT_FILE}`);
        console.log(`📦 ${mintInput.length} NFTs ready to mint\n`);
        console.log('🚀 Next Steps:');
        console.log('1. Review mint input file');
        console.log('2. Run: node scripts/run_mint.mjs');
        console.log('3. Wait for minting to complete');
        console.log('4. NFTs will auto-sync to Gallery Minted\n');
        
    } catch (error) {
        console.error('\n❌ Preparation failed:', error);
        process.exit(1);
    }
}

// Run preparation
prepareMinting();
