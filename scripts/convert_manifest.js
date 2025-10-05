import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertManifest() {
    console.log('🔄 Converting Pinata manifest to minting format...');
    
    const manifestPath = path.join(__dirname, 'dist', 'manifest.json');
    const pinataManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    
    // Create items array for minting
    const items = [];
    
    // Get metadata uploads and sort by filename number
    const metadataUploads = pinataManifest.uploads.metadata.sort((a, b) => {
        const aNum = parseInt(a.name.split('.')[0]);
        const bNum = parseInt(b.name.split('.')[0]);
        return aNum - bNum;
    });
    
    console.log(`Found ${metadataUploads.length} metadata files`);
    
    // Create minting items using metadata URIs
    for (const metadata of metadataUploads) {
        const tokenId = parseInt(metadata.name.split('.')[0]);
        const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadata.cid}`;
        
        items.push({
            id: tokenId,
            metadata: metadataUri
        });
    }
    
    // Create the minting manifest
    const mintingManifest = {
        timestamp: new Date().toISOString(),
        source: 'Converted from Pinata manifest',
        items: items
    };
    
    // Save the minting manifest
    const mintingManifestPath = path.join(__dirname, 'dist', 'minting-manifest.json');
    await fs.writeFile(mintingManifestPath, JSON.stringify(mintingManifest, null, 2));
    
    console.log(`✅ Created minting manifest: ${mintingManifestPath}`);
    console.log(`📊 Ready to mint ${items.length} NFTs`);
    
    // Replace the original manifest
    await fs.writeFile(manifestPath, JSON.stringify(mintingManifest, null, 2));
    console.log('✅ Updated manifest.json for minting');
    
    return mintingManifest;
}

if (process.argv[1] === __filename) {
    convertManifest().catch(console.error);
}

export default convertManifest;