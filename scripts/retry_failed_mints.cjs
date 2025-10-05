const fs = require('fs-extra');
const path = require('path');

// Extract failed NFTs from mint results for retry
function extractFailedMints() {
    console.log('🔍 Analyzing failed mints for retry...');
    
    const mintResults = fs.readJsonSync('./data/mint_results.json');
    const originalInput = fs.readJsonSync('./data/mint_input.json');
    
    // Get failed token IDs
    const failedTokenIds = mintResults
        .filter(result => result.failed && result.tokenId)
        .map(result => result.tokenId);
    
    console.log(`❌ Found ${failedTokenIds.length} failed NFTs:`, failedTokenIds);
    
    // Create retry input with only failed NFTs
    const retryInput = originalInput.filter(nft => failedTokenIds.includes(nft.tokenId));
    
    console.log(`🔄 Prepared ${retryInput.length} NFTs for retry:`);
    retryInput.forEach(nft => {
        console.log(`   Token ${nft.tokenId}: ${nft.metadataUri.substring(0, 60)}...`);
    });
    
    // Save retry input
    fs.writeJsonSync('./data/retry_input.json', retryInput, { spaces: 2 });
    
    return retryInput;
}

extractFailedMints();