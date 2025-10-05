const xrpl = require('xrpl');
const fs = require('fs-extra');
require('dotenv').config();

async function retryMint() {
    const networkUrl = process.env.XRPL_NETWORK || 'wss://s.altnet.rippletest.net:51233';
    const walletSeed = process.env.XRPL_WALLET_SEED;
    const royaltyPercentage = parseInt(process.env.ROYALTY_PERCENTAGE) || 500;

    if (!walletSeed) {
        throw new Error('XRPL_WALLET_SEED environment variable is required');
    }

    console.log('🔄 Starting retry minting process...');
    
    // Load failed NFTs
    const retryInput = await fs.readJson('../data/retry_input.json');
    console.log(`📊 Loaded ${retryInput.length} NFTs to retry`);

    // Connect to XRPL
    const client = new xrpl.Client(networkUrl);
    await client.connect();
    console.log(`📡 Connected to ${networkUrl}`);

    const wallet = xrpl.Wallet.fromSeed(walletSeed);
    console.log(`💰 Wallet: ${wallet.address}`);

    const results = [];
    
    // Mint one at a time with longer delays
    for (let i = 0; i < retryInput.length; i++) {
        const nft = retryInput[i];
        console.log(`\n🪙 Minting NFT ${i + 1}/${retryInput.length} (${nft.tokenId})...`);

        try {
            const uriHex = Buffer.from(nft.metadataUri, 'utf8').toString('hex').toUpperCase();
            
            const mintTransaction = {
                TransactionType: 'NFTokenMint',
                Account: wallet.address,
                URI: uriHex,
                Flags: 8, // tfTransferable
                TransferFee: royaltyPercentage,
                NFTokenTaxon: 0
            };

            const prepared = await client.autofill(mintTransaction);
            const signed = wallet.sign(prepared);
            
            console.log(`📤 Submitting transaction...`);
            const result = await client.submitAndWait(signed.tx_blob);

            if (result.result.meta.TransactionResult === 'tesSUCCESS') {
                // Extract NFTokenID
                let nftokenID = null;
                for (const node of result.result.meta.AffectedNodes) {
                    if (node.CreatedNode?.LedgerEntryType === 'NFTokenPage') {
                        const nftPage = node.CreatedNode.NewFields || node.CreatedNode.FinalFields;
                        if (nftPage.NFTokens?.[0]?.NFToken?.NFTokenID) {
                            nftokenID = nftPage.NFTokens[0].NFToken.NFTokenID;
                            break;
                        }
                    }
                    if (node.ModifiedNode?.LedgerEntryType === 'NFTokenPage') {
                        const nftPage = node.ModifiedNode.FinalFields;
                        if (nftPage.NFTokens?.length > 0) {
                            nftokenID = nftPage.NFTokens[nftPage.NFTokens.length - 1].NFToken.NFTokenID;
                            break;
                        }
                    }
                }

                results.push({
                    tokenId: nft.tokenId,
                    nftokenID,
                    metadataUri: nft.metadataUri,
                    transactionHash: result.result.hash,
                    ledgerIndex: result.result.ledger_index,
                    fee: xrpl.dropsToXrp(result.result.Fee),
                    timestamp: new Date().toISOString(),
                    account: wallet.address
                });

                console.log(`✅ Success! NFTokenID: ${nftokenID}`);
                console.log(`   Transaction: ${result.result.hash}`);
            } else {
                throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`);
            }

        } catch (error) {
            console.error(`❌ Failed: ${error.message}`);
            results.push({
                tokenId: nft.tokenId,
                error: error.message,
                failed: true
            });
        }

        // Longer delay between mints to avoid timeouts
        if (i < retryInput.length - 1) {
            console.log('⏳ Waiting 5 seconds before next mint...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    await client.disconnect();

    // Save results
    await fs.writeJson('../data/retry_results.json', results, { spaces: 2 });

    // Summary
    const successful = results.filter(r => !r.failed);
    const failed = results.filter(r => r.failed);
    
    console.log(`\n🎉 Retry minting complete!`);
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`💾 Results saved to data/retry_results.json`);
}

retryMint().catch(console.error);
