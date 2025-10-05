#!/usr/bin/env node

/**
 * Convert treasure hunt mint input to batch_mint_new.mjs format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../data/treasure_hunt_mint_input.json');
const OUTPUT_FILE = path.join(__dirname, '../data/new_batch_mint_input.json');

console.log('🔄 Converting treasure hunt mint input format...\n');

// Load the treasure hunt format
const treasureHuntData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

// Convert to batch_mint_new.mjs format
const convertedData = treasureHuntData.map(nft => ({
    tokenId: `treasure-hunt-ch1-${nft.id}`,
    metadataUri: nft.metadata_uri,
    // Keep original data for database sync later
    originalData: {
        id: nft.id,
        name: nft.name,
        description: nft.description,
        image_ipfs: nft.image_ipfs,
        metadata_ipfs: nft.metadata_ipfs,
        chapter: nft.chapter,
        rarity: nft.rarity,
        puzzle_enabled: nft.puzzle_enabled,
        layers: nft.layers
    }
}));

// Save converted data
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(convertedData, null, 2));

console.log(`✅ Converted ${convertedData.length} NFTs`);
console.log(`📁 Output: ${OUTPUT_FILE}`);
console.log('\n🚀 Ready to mint! Run: node scripts/run_mint.mjs');
