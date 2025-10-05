const fs = require('fs-extra');

function transformIPFSResultsForMinting() {
    console.log('🔄 Transforming IPFS results for minting...');
    
    const ipfsResults = fs.readJsonSync('./data/ipfs_upload_results.json');
    
    // Filter to only JSON metadata files and transform format
    const metadataFiles = ipfsResults
        .filter(result => result.file.endsWith('.json') && result.cid)
        .map(result => {
            // Extract token ID from filename like "ch6_001.json" -> "6001"
            const match = result.file.match(/ch6_(\d+)\.json/);
            if (!match) {
                console.warn(`⚠️ Skipping file with unexpected format: ${result.file}`);
                return null;
            }
            
            const tokenNumber = parseInt(match[1]);
            const tokenId = 6000 + tokenNumber; // Chapter 6 starts at 6001
            
            return {
                tokenId: tokenId,
                metadataUri: result.url
            };
        })
        .filter(Boolean); // Remove null values
    
    console.log(`✅ Transformed ${metadataFiles.length} NFTs for minting`);
    
    // Save transformed format
    fs.writeJsonSync('./data/mint_input.json', metadataFiles, { spaces: 2 });
    
    // Show sample
    console.log('\n📋 Sample transformed NFTs:');
    metadataFiles.slice(0, 3).forEach(nft => {
        console.log(`   Token ${nft.tokenId}: ${nft.metadataUri}`);
    });
    
    return metadataFiles;
}

transformIPFSResultsForMinting();