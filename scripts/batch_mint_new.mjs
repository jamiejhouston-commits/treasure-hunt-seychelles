#!/usr/bin/env node

/**
 * Batch Mint New NFTs to XRPL Testnet
 * 
 * This script mints NFTs that have been prepared by prepare_mint_batch.mjs
 */

import fs from 'fs';
import path from 'path';
import { Client, Wallet, convertStringToHex } from 'xrpl';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const XRPL_NETWORK = 'wss://s.altnet.rippletest.net:51233'; // Testnet
const WALLET_SEED = process.env.XRPL_WALLET_SEED || process.env.XRPL_SEED;

if (!WALLET_SEED) {
    console.error('❌ Missing XRPL wallet seed in environment');
    process.exit(1);
}

const DATA_DIR = path.join(__dirname, '..', 'data');
const MINT_INPUT_FILE = path.join(DATA_DIR, 'new_batch_mint_input.json');

/**
 * Mint a single NFT
 */
async function mintNFT(client, wallet, tokenId, metadataUri, retryCount = 0) {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    
    try {
        // Convert metadata URI to hex
        const uriHex = convertStringToHex(metadataUri);
        
        // Prepare NFTokenMint transaction
        const mintTx = {
            TransactionType: 'NFTokenMint',
            Account: wallet.address,
            NFTokenTaxon: 7000, // Collection identifier for new batch
            Flags: 8, // tfTransferable
            URI: uriHex,
            Fee: '12' // 0.000012 XRP
        };
        
        console.log(`   🔨 Minting NFT ${tokenId}...`);
        
        // Submit and wait for validation
        const response = await client.submitAndWait(mintTx, { wallet });
        
        if (response.result.meta.TransactionResult === 'tesSUCCESS') {
            // Extract NFTokenID from transaction metadata
            let nftokenID = null;
            if (response.result.meta.CreatedNode) {
                const createdNode = response.result.meta.CreatedNode;
                if (createdNode.LedgerEntryType === 'NFTokenPage') {
                    // Extract from NFTokenPage
                    const nfTokens = createdNode.NewFields?.NFTokens || createdNode.FinalFields?.NFTokens;
                    if (nfTokens && nfTokens.length > 0) {
                        nftokenID = nfTokens[nfTokens.length - 1].NFToken.NFTokenID;
                    }
                }
            }
            
            // Fallback: search in modified nodes
            if (!nftokenID && response.result.meta.ModifiedNode) {
                const modifiedNode = response.result.meta.ModifiedNode;
                if (modifiedNode.LedgerEntryType === 'NFTokenPage') {
                    const finalFields = modifiedNode.FinalFields;
                    const prevFields = modifiedNode.PreviousFields;
                    if (finalFields?.NFTokens && prevFields?.NFTokens) {
                        // Find the new token
                        const newTokens = finalFields.NFTokens.filter(token => 
                            !prevFields.NFTokens.some(prev => prev.NFToken.NFTokenID === token.NFToken.NFTokenID)
                        );
                        if (newTokens.length > 0) {
                            nftokenID = newTokens[0].NFToken.NFTokenID;
                        }
                    }
                }
            }
            
            const result = {
                tokenId,
                nftokenID,
                metadataUri,
                transactionHash: response.result.hash,
                ledgerIndex: response.result.ledger_index,
                fee: response.result.Fee,
                timestamp: new Date().toISOString(),
                account: wallet.address
            };
            
            console.log(`   ✅ Minted successfully! NFTokenID: ${nftokenID}`);
            return result;
            
        } else {
            throw new Error(`Transaction failed: ${response.result.meta.TransactionResult}`);
        }
        
    } catch (error) {
        console.error(`   ❌ Minting failed for token ${tokenId}:`, error.message);
        
        if (retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
            console.log(`   ⏳ Retrying in ${delay/1000} seconds... (${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return mintNFT(client, wallet, tokenId, metadataUri, retryCount + 1);
        } else {
            console.error(`   💀 Max retries exceeded for token ${tokenId}`);
            throw error;
        }
    }
}

/**
 * Main minting function
 */
async function batchMintNewNFTs() {
    console.log('🏴‍☠️ Starting Batch Minting Process\n');
    
    // Check if input file exists
    if (!fs.existsSync(MINT_INPUT_FILE)) {
        console.error('❌ Mint input file not found. Run prepare_mint_batch.mjs first.');
        console.error(`   Expected: ${MINT_INPUT_FILE}`);
        return;
    }
    
    // Load mint input
    const mintInput = JSON.parse(fs.readFileSync(MINT_INPUT_FILE, 'utf8'));
    console.log(`📋 Loaded ${mintInput.length} NFTs to mint\n`);
    
    // Initialize XRPL client
    console.log('🌐 Connecting to XRPL Testnet...');
    const client = new Client(XRPL_NETWORK);
    await client.connect();
    
    // Initialize wallet
    const wallet = Wallet.fromSeed(WALLET_SEED);
    console.log(`💰 Using wallet: ${wallet.address}`);
    
    // Check wallet balance
    const accountInfo = await client.request({
        command: 'account_info',
        account: wallet.address
    });
    
    const balance = Number(accountInfo.result.account_data.Balance) / 1000000; // Convert drops to XRP
    console.log(`💰 Current balance: ${balance} XRP`);
    
    const estimatedFees = mintInput.length * 0.000012; // 12 drops per transaction
    if (balance < estimatedFees + 2) { // Keep 2 XRP reserve for testnet
        console.error(`❌ Insufficient balance. Need at least ${estimatedFees + 2} XRP`);
        await client.disconnect();
        return;
    }
    
    console.log(`💸 Estimated minting cost: ${estimatedFees} XRP\n`);
    
    // Start minting
    const results = [];
    const errors = [];
    
    for (let i = 0; i < mintInput.length; i++) {
        const { tokenId, metadataUri } = mintInput[i];
        
        console.log(`⚓ Minting ${i + 1}/${mintInput.length}: Token ID ${tokenId}`);
        
        try {
            const result = await mintNFT(client, wallet, tokenId, metadataUri);
            results.push(result);
            
            // Small delay between mints to avoid rate limiting
            if (i < mintInput.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
        } catch (error) {
            errors.push({
                tokenId,
                metadataUri,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    // Disconnect from XRPL
    await client.disconnect();
    
    // Save results
    const resultsPath = path.join(DATA_DIR, 'new_batch_mint_results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    if (errors.length > 0) {
        const errorsPath = path.join(DATA_DIR, 'new_batch_mint_errors.json');
        fs.writeFileSync(errorsPath, JSON.stringify(errors, null, 2));
    }
    
    // Display summary
    console.log('\n🎉 Batch Minting Complete!\n');
    console.log('📊 SUMMARY:');
    console.log(`   • Successfully minted: ${results.length} NFTs`);
    console.log(`   • Failed: ${errors.length} NFTs`);
    console.log(`   • Total cost: ${(results.length * 0.000012).toFixed(6)} XRP`);
    console.log(`   • Results saved to: ${resultsPath}`);
    
    if (errors.length > 0) {
        console.log(`   • Errors saved to: ${path.join(DATA_DIR, 'new_batch_mint_errors.json')}`);
        console.log('\n❌ Failed NFTs:');
        errors.forEach(error => {
            console.log(`   • Token ${error.tokenId}: ${error.error}`);
        });
    }
    
    if (results.length > 0) {
        console.log('\n✅ Successfully minted NFTs:');
        results.forEach(result => {
            console.log(`   • Token ${result.tokenId}: ${result.nftokenID}`);
        });
        
        console.log('\n🔄 Next step: Run database sync to update Gallery Minted');
        console.log('   node backend/sync_new_minted_nfts.js');
    }
    
    return { results, errors };
}

// Run the minting
if (import.meta.url === `file://${process.argv[1]}`) {
    batchMintNewNFTs().catch(console.error);
}

export default batchMintNewNFTs;