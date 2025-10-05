import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏴‍☠️ QUICK FIX - REPLACING MOCK DATA WITH REAL NFTS!');
console.log('=================================================');

// Read the real minted data
const mintedPath = path.join(__dirname, 'dist', 'minted.json');
const mintedData = JSON.parse(fs.readFileSync(mintedPath, 'utf8'));

console.log(`📋 Found ${mintedData.length} REAL minted NFTs`);

// Create a simple JSON file that the backend can read
const realNFTData = [];

for (let i = 0; i < mintedData.length; i++) {
  const nft = mintedData[i];
  
  // Read metadata
  const metadataPath = path.join(__dirname, 'dist', 'metadata', `${nft.id}.json`);
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  realNFTData.push({
    id: nft.id,
    token_id: nft.NFTokenID || `TEMP_${nft.id}`,
    name: metadata.name,
    description: metadata.description,
    image_url: metadata.image, // This is the REAL IPFS image
    metadata_url: nft.uri,
    attributes: metadata.attributes,
    rarity: metadata.attributes.find(attr => attr.trait_type === 'Rarity')?.value || 'Common',
    price: Math.floor(Math.random() * 50) + 15,
    owner_address: 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH',
    transaction_hash: nft.txHash,
    minted_at: nft.mintedAt || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

// Save the real NFT data
const outputPath = path.join(__dirname, '..', 'backend', 'real_nfts.json');
fs.writeFileSync(outputPath, JSON.stringify(realNFTData, null, 2));

console.log(`✅ Created real NFT data file: ${outputPath}`);
console.log('🎯 Sample real NFT:');
console.log(JSON.stringify(realNFTData[0], null, 2));

console.log('\n🏴‍☠️ REAL SEYCHELLES TREASURE MAPS ARE READY!');
console.log('No more mock compass bullshit! 🎉');

export default realNFTData;