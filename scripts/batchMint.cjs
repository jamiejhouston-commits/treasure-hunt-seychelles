const xrpl = require('xrpl');
const fs = require('fs-extra');
const crypto = require('crypto');
require('dotenv').config();

class XRPLMinter {
    constructor() {
        this.networkUrl = process.env.XRPL_NETWORK || 'wss://s.altnet.rippletest.net:51233';
        this.walletSeed = process.env.XRPL_WALLET_SEED;
        this.royaltyPercentage = parseInt(process.env.ROYALTY_PERCENTAGE) || 500; // 5%
        
        if (!this.walletSeed) {
            throw new Error('XRPL_WALLET_SEED environment variable is required');
        }

        this.client = null;
        this.wallet = null;
        this.mintResults = [];
        this.batchSize = 5; // Conservative batch size for XRPL
    }

    // Initialize XRPL connection
    async initialize() {
        console.log('🔌 Connecting to XRPL network...');
        console.log(`📡 Network: ${this.networkUrl}`);
        
        this.client = new xrpl.Client(this.networkUrl);
        await this.client.connect();
        
        this.wallet = xrpl.Wallet.fromSeed(this.walletSeed);
        console.log(`💰 Wallet address: ${this.wallet.address}`);
        
        // Check account balance
        const accountInfo = await this.client.request({
            command: 'account_info',
            account: this.wallet.address
        });
        
        const balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
        console.log(`💎 Account balance: ${balance} XRP`);
        
        if (parseFloat(balance) < 100) {
            console.warn('⚠️  Warning: Low XRP balance for minting 1000 NFTs');
        }
        
        return true;
    }

    // Convert URI to hex format required by XRPL
    uriToHex(uri) {
        return Buffer.from(uri, 'utf8').toString('hex').toUpperCase();
    }

    // Mint single NFT
    async mintNFT(tokenId, metadataUri) {
        try {
            console.log(`🪙 Minting NFT #${tokenId}...`);
            
            const mintTransaction = {
                TransactionType: 'NFTokenMint',
                Account: this.wallet.address,
                URI: this.uriToHex(metadataUri),
                Flags: 8, // tfTransferable - allows transfers
                TransferFee: this.royaltyPercentage, // 5% royalty (500 = 0.5%)
                NFTokenTaxon: 0 // Collection identifier
            };

            // Sign and submit transaction
            const prepared = await this.client.autofill(mintTransaction);
            const signed = this.wallet.sign(prepared);
            
            console.log(`📤 Submitting transaction for NFT #${tokenId}...`);
            const result = await this.client.submitAndWait(signed.tx_blob);
            
            if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
                throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`);
            }

            // Extract NFTokenID from transaction metadata
            const nftokenID = this.extractNFTokenID(result.result.meta);
            
            const mintResult = {
                tokenId,
                nftokenID,
                metadataUri,
                transactionHash: result.result.hash,
                ledgerIndex: result.result.ledger_index,
                fee: xrpl.dropsToXrp(result.result.Fee),
                timestamp: new Date().toISOString(),
                account: this.wallet.address
            };

            console.log(`✅ NFT #${tokenId} minted successfully!`);
            console.log(`   NFTokenID: ${nftokenID}`);
            console.log(`   Transaction: ${result.result.hash}`);
            
            return mintResult;
            
        } catch (error) {
            console.error(`❌ Failed to mint NFT #${tokenId}:`, error.message);
            throw error;
        }
    }

    // Extract NFTokenID from transaction metadata
    extractNFTokenID(meta) {
        if (!meta.AffectedNodes) {
            throw new Error('No AffectedNodes in transaction metadata');
        }

        for (const node of meta.AffectedNodes) {
            if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
                const nftPage = node.CreatedNode.NewFields || node.CreatedNode.FinalFields;
                if (nftPage.NFTokens && nftPage.NFTokens.length > 0) {
                    return nftPage.NFTokens[0].NFToken.NFTokenID;
                }
            }
            if (node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'NFTokenPage') {
                const nftPage = node.ModifiedNode.FinalFields;
                if (nftPage.NFTokens && nftPage.NFTokens.length > 0) {
                    // Return the most recent NFToken (usually the last one)
                    return nftPage.NFTokens[nftPage.NFTokens.length - 1].NFToken.NFTokenID;
                }
            }
        }

        throw new Error('NFTokenID not found in transaction metadata');
    }

    // Batch mint all NFTs
    async batchMintAll(ipfsResultsFile = './data/mint_input.json') {
        console.log('🚀 Starting batch minting process...');
        
        const ipfsResults = await fs.readJson(ipfsResultsFile);
        console.log(`📊 Loaded ${ipfsResults.length} NFTs to mint`);

        await this.initialize();

        const mintResults = [];
        const startTime = Date.now();
        let totalFees = 0;

        for (let i = 0; i < ipfsResults.length; i += this.batchSize) {
            const batch = ipfsResults.slice(i, i + this.batchSize);
            console.log(`\n📦 Processing batch ${Math.floor(i/this.batchSize) + 1}/${Math.ceil(ipfsResults.length/this.batchSize)}`);

            const batchPromises = batch.map(async (nft) => {
                try {
                    // Add small delay between transactions in batch
                    await this.delay(Math.random() * 1000);
                    return await this.mintNFT(nft.tokenId, nft.metadataUri);
                } catch (error) {
                    console.error(`❌ Batch mint failed for NFT #${nft.tokenId}:`, error);
                    return {
                        tokenId: nft.tokenId,
                        error: error.message,
                        failed: true
                    };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            mintResults.push(...batchResults);
            
            // Calculate progress
            const completed = i + batch.length;
            const progress = (completed / ipfsResults.length * 100).toFixed(1);
            const elapsed = (Date.now() - startTime) / 1000;
            const rate = completed / elapsed;
            const remaining = (ipfsResults.length - completed) / rate;
            
            // Calculate fees
            const batchFees = batchResults
                .filter(r => !r.failed)
                .reduce((sum, r) => sum + parseFloat(r.fee || 0), 0);
            totalFees += batchFees;
            
            console.log(`📊 Progress: ${completed}/${ipfsResults.length} (${progress}%) - ETA: ${remaining.toFixed(0)}s`);
            console.log(`💰 Batch fees: ${batchFees.toFixed(6)} XRP - Total: ${totalFees.toFixed(6)} XRP`);

            // Longer delay between batches
            if (i + this.batchSize < ipfsResults.length) {
                console.log('⏳ Waiting between batches...');
                await this.delay(3000);
            }
        }

        // Save results
        await fs.writeJson('./data/mint_results.json', mintResults, { spaces: 2 });

        // Calculate statistics
        const successful = mintResults.filter(r => !r.failed);
        const failed = mintResults.filter(r => r.failed);
        const totalTime = (Date.now() - startTime) / 1000;

        console.log(`\n🎉 Batch minting complete!`);
        console.log(`⏱️  Total time: ${totalTime.toFixed(2)} seconds`);
        console.log(`✅ Successful: ${successful.length}`);
        console.log(`❌ Failed: ${failed.length}`);
        console.log(`💰 Total fees: ${totalFees.toFixed(6)} XRP`);
        console.log(`📁 Results saved to: ./data/mint_results.json`);

        if (failed.length > 0) {
            console.log('\n⚠️  Failed mints:');
            failed.forEach(f => console.log(`   NFT #${f.tokenId}: ${f.error}`));
        }

        return mintResults;
    }

    // Verify minted NFTs by checking account
    async verifyMints(accountAddress = null) {
        console.log('🔍 Verifying minted NFTs...');
        
        const account = accountAddress || this.wallet.address;
        
        try {
            const nftResponse = await this.client.request({
                command: 'account_nfts',
                account: account
            });

            const nfts = nftResponse.result.account_nfts || [];
            console.log(`📊 Found ${nfts.length} NFTs in account ${account}`);

            // Load mint results to compare
            const mintResults = await fs.readJson('./data/mint_results.json');
            const successfulMints = mintResults.filter(r => !r.failed);
            
            console.log(`📋 Expected ${successfulMints.length} successful mints`);
            
            if (nfts.length === successfulMints.length) {
                console.log('✅ All minted NFTs verified successfully!');
            } else {
                console.log(`⚠️  Mismatch: Expected ${successfulMints.length}, found ${nfts.length}`);
            }

            // Sample verification - check first few NFTs
            const sampleSize = Math.min(5, nfts.length);
            console.log(`\n🔍 Sample verification (${sampleSize} NFTs):`);
            
            for (let i = 0; i < sampleSize; i++) {
                const nft = nfts[i];
                console.log(`   NFT #${i + 1}:`);
                console.log(`     NFTokenID: ${nft.NFTokenID}`);
                console.log(`     URI: ${nft.URI ? Buffer.from(nft.URI, 'hex').toString('utf8') : 'N/A'}`);
                console.log(`     Flags: ${nft.Flags}`);
                console.log(`     TransferFee: ${nft.TransferFee || 0}`);
            }

            return nfts;
            
        } catch (error) {
            console.error('❌ Verification failed:', error);
            throw error;
        }
    }

    // Create offer to sell NFT (optional - for marketplace setup)
    async createSellOffer(nftokenID, priceXRP) {
        try {
            const sellOfferTransaction = {
                TransactionType: 'NFTokenCreateOffer',
                Account: this.wallet.address,
                NFTokenID: nftokenID,
                Amount: xrpl.xrpToDrops(priceXRP.toString()),
                Flags: 1 // tfSellNFToken
            };

            const prepared = await this.client.autofill(sellOfferTransaction);
            const signed = this.wallet.sign(prepared);
            const result = await this.client.submitAndWait(signed.tx_blob);

            if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
                throw new Error(`Sell offer failed: ${result.result.meta.TransactionResult}`);
            }

            console.log(`💰 Created sell offer for ${nftokenID} at ${priceXRP} XRP`);
            return result.result.hash;
            
        } catch (error) {
            console.error('❌ Failed to create sell offer:', error);
            throw error;
        }
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
            console.log('🔌 Disconnected from XRPL network');
        }
    }

    // Get minting statistics
    async getStats() {
        try {
            const mintResults = await fs.readJson('./data/mint_results.json');
            const successful = mintResults.filter(r => !r.failed);
            const failed = mintResults.filter(r => r.failed);
            const totalFees = successful.reduce((sum, r) => sum + parseFloat(r.fee || 0), 0);

            return {
                total: mintResults.length,
                successful: successful.length,
                failed: failed.length,
                totalFeesXRP: totalFees,
                successRate: (successful.length / mintResults.length * 100).toFixed(2) + '%',
                sampleNFTokenID: successful[0]?.nftokenID
            };
        } catch (error) {
            return { error: 'Stats not available - run minting first' };
        }
    }
}

// Main execution
async function main() {
    const minter = new XRPLMinter();
    
    try {
        console.log('🪙 Initializing XRPL minting system...');
        
        // Batch mint all NFTs
        const results = await minter.batchMintAll();
        
        // Verify mints
        await minter.verifyMints();
        
        // Display final statistics
        const stats = await minter.getStats();
        console.log('\n📊 Final Minting Statistics:');
        console.log(`   Total NFTs: ${stats.total}`);
        console.log(`   Successful: ${stats.successful}`);
        console.log(`   Failed: ${stats.failed}`);
        console.log(`   Success Rate: ${stats.successRate}`);
        console.log(`   Total Fees: ${stats.totalFeesXRP} XRP`);
        console.log(`   Sample NFTokenID: ${stats.sampleNFTokenID}`);
        
        console.log('\n✨ XRPL minting complete! NFTs ready for marketplace.');
        
    } catch (error) {
        console.error('💥 Minting process failed:', error);
    } finally {
        await minter.disconnect();
    }
}

if (require.main === module) {
    main();
}

module.exports = XRPLMinter;