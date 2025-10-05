const fs = require('fs-extra');

// Create final retry input for remaining 6 NFTs
function createFinalRetry() {
    console.log('🔍 Creating final retry for remaining NFTs...');
    
    // The NFTs we still need to mint (6 remaining)
    const remainingNFTs = [6013, 6014, 6016, 6017, 6018, 6020];
    const originalInput = fs.readJsonSync('../data/mint_input.json');
    
    // Filter to get only the remaining NFTs
    const finalRetryInput = originalInput.filter(nft => remainingNFTs.includes(nft.tokenId));
    
    console.log(`🔄 Final retry prepared for ${finalRetryInput.length} NFTs:`);
    finalRetryInput.forEach(nft => {
        console.log(`   Token ${nft.tokenId}: ${nft.metadataUri.substring(0, 60)}...`);
    });
    
    // Save final retry input
    fs.writeJsonSync('../data/final_retry_input.json', finalRetryInput, { spaces: 2 });
    
    console.log('✅ Final retry input saved to ../data/final_retry_input.json');
    return finalRetryInput;
}

createFinalRetry();