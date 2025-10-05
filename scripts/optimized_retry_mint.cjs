const xrpl = require('xrpl');
const fs = require('fs-extra');
require('dotenv').config();

class OptimizedXRPLMinter {
    constructor() {
        this.networkUrl = process.env.XRPL_NETWORK || 'wss://s.altnet.rippletest.net:51233';
        this.walletSeed = process.env.XRPL_WALLET_SEED;
        this.royaltyPercentage = parseInt(process.env.ROYALTY_PERCENTAGE) || 500;
        
        if (!this.walletSeed) {
            throw new Error('XRPL_WALLET_SEED environment variable is required');
        }

        this.client = null;
        this.wallet = null;
        this.batchSize = 1; // Process one at a time to avoid timing issues
        this.delayBetweenMints = 8000; // 8 second delay between mints
        this.maxRetries = 3; // Retry failed transactions
    }

    async initialize() {
        console.log('🔌 Connecting to XRPL network (optimized mode)...');
        console.log(`📡 Network: ${this.networkUrl}`);
        
        this.client = new xrpl.Client(this.networkUrl);
        await this.client.connect();
        
        this.wallet = xrpl.Wallet.fromSeed(this.walletSeed);
        console.log(`💰 Wallet address: ${this.wallet.address}`);
        
        const accountInfo = await this.client.request({
            command: 'account_info',
            account: this.wallet.address
        });
        
        const balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
        console.log(`💎 Account balance: ${balance} XRP`);
        
        return true;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    uriToHex(uri) {
        return Buffer.from(uri, 'utf8').toString('hex').toUpperCase();
    }

    async mintNFTWithRetry(tokenId, metadataUri, retryCount = 0) {
        try {
            console.log(`🪙 Minting NFT #${tokenId} (attempt ${retryCount + 1}/${this.maxRetries + 1})...`);
            
            const mintTransaction = {
                TransactionType: 'NFTokenMint',
                Account: this.wallet.address,
                URI: this.uriToHex(metadataUri),
                Flags: 8, // tfTransferable
                TransferFee: this.royaltyPercentage,
                NFTokenTaxon: 0
            };

            console.log(`📤 Submitting transaction for NFT #${tokenId}...`);
            
            const result = await this.client.submitAndWait(mintTransaction, {
                wallet: this.wallet,
                autofill: true
            });

            if (result.result.meta?.TransactionResult !== 'tesSUCCESS') {
                throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`);
            }

            // Extract NFTokenID
            let nftokenID = null;
            if (result.result.meta?.CreatedNode) {
                const createdNode = Array.isArray(result.result.meta.CreatedNode) 
                    ? result.result.meta.CreatedNode[0] 
                    : result.result.meta.CreatedNode;
                    
                if (createdNode?.CreatedNode?.LedgerEntryType === 'NFTokenPage') {
                    const nftPage = createdNode.CreatedNode.NewFields || createdNode.CreatedNode.FinalFields;
                    if (nftPage?.NFTokens?.[0]?.NFToken?.NFTokenID) {
                        nftokenID = nftPage.NFTokens[0].NFToken.NFTokenID;
                    }
                }
            }

            const mintResult = {
                tokenId: tokenId,
                nftokenId: nftokenID,
                transactionHash: result.result.hash,
                ledgerIndex: result.result.ledger_index,
                metadataUri: metadataUri,
                account: this.wallet.address,
                timestamp: new Date().toISOString(),
                success: true
            };

            console.log(`✅ NFT #${tokenId} minted successfully!`);
            console.log(`   NFTokenID: ${nftokenID}`);
            console.log(`   Transaction: ${result.result.hash}`);
            
            return mintResult;
            
        } catch (error) {
            console.error(`❌ Failed to mint NFT #${tokenId} (attempt ${retryCount + 1}):`, error.message);
            
            if (retryCount < this.maxRetries && error.message.includes('tefPAST_SEQ')) {
                console.log(`🔄 Retrying NFT #${tokenId} after extended delay...`);
                await this.delay(15000); // 15 second delay before retry
                return await this.mintNFTWithRetry(tokenId, metadataUri, retryCount + 1);
            }
            
            return {
                tokenId: tokenId,
                error: error.message,
                failed: true,
                retryCount: retryCount + 1
            };
        }
    }

    async retryFailedMints(inputFile = '../data/retry_input.json') {
        console.log('🔄 Starting optimized retry minting process...');
        
        const retryData = fs.readJsonSync(inputFile);
        console.log(`📊 Loaded ${retryData.length} NFTs to retry`);

        await this.initialize();

        const mintResults = [];
        const startTime = Date.now();
        let totalFees = 0;

        for (let i = 0; i < retryData.length; i++) {
            const nft = retryData[i];
            
            console.log(`\n📦 Processing retry ${i + 1}/${retryData.length}`);
            
            const result = await this.mintNFTWithRetry(nft.tokenId, nft.metadataUri);
            mintResults.push(result);
            
            if (result.success) {
                totalFees += 0.000012; // Approximate XRP fee per transaction
            }
            
            // Progress update
            const successful = mintResults.filter(r => r.success).length;
            const failed = mintResults.filter(r => r.failed).length;
            console.log(`📊 Progress: ${successful} successful, ${failed} failed`);
            
            // Delay between mints (except for last one)
            if (i < retryData.length - 1) {
                console.log(`⏳ Waiting ${this.delayBetweenMints/1000}s before next mint...`);
                await this.delay(this.delayBetweenMints);
            }
        }

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const successful = mintResults.filter(r => r.success).length;
        const failed = mintResults.filter(r => r.failed).length;

        console.log(`\n🎉 Retry minting complete!`);
        console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
        console.log(`✅ Successful: ${successful}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`💰 Total fees: ${totalFees.toFixed(8)} XRP`);

        // Save results
        const outputFile = '../data/retry_results.json';
        fs.writeJsonSync(outputFile, mintResults, { spaces: 2 });
        console.log(`📁 Results saved to: ${outputFile}`);

        if (failed > 0) {
            console.log('\n⚠️  Failed retries:');
            mintResults.filter(r => r.failed).forEach(result => {
                console.log(`   NFT #${result.tokenId}: ${result.error}`);
            });
        }

        await this.client.disconnect();
        console.log('🔌 Disconnected from XRPL network');
        
        return mintResults;
    }
}

// Execute retry minting
async function main() {
    try {
        const minter = new OptimizedXRPLMinter();
        await minter.retryFailedMints();
    } catch (error) {
        console.error('💥 Retry minting process failed:', error);
        process.exit(1);
    }
}

main();