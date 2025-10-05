#!/usr/bin/env node

/**
 * Retrieve NFTokenIDs from mint transaction hashes
 */

import fs from 'fs';
import path from 'path';
import { Client } from 'xrpl';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XRPL_NETWORK = 'wss://s.altnet.rippletest.net:51233';
const RESULTS_FILE = path.join(__dirname, '../data/new_batch_mint_results.json');

console.log('🔍 Retrieving NFTokenIDs from transaction hashes...\n');

async function getNFTokenIDFromTransaction(client, txHash) {
    try {
        const response = await client.request({
            command: 'tx',
            transaction: txHash
        });
        
        const meta = response.result.meta;
        
        // Try to find in CreatedNode
        if (meta.AffectedNodes) {
            for (const node of meta.AffectedNodes) {
                if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
                    const nfTokens = node.CreatedNode.NewFields?.NFTokens;
                    if (nfTokens && nfTokens.length > 0) {
                        return nfTokens[nfTokens.length - 1].NFToken.NFTokenID;
                    }
                }
                
                // Try ModifiedNode
                if (node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'NFTokenPage') {
                    const finalFields = node.ModifiedNode.FinalFields;
                    const prevFields = node.ModifiedNode.PreviousFields;
                    
                    if (finalFields?.NFTokens && prevFields?.NFTokens) {
                        // Find the new token
                        const newTokens = finalFields.NFTokens.filter(token => 
                            !prevFields.NFTokens.some(prev => 
                                prev.NFToken.NFTokenID === token.NFToken.NFTokenID
                            )
                        );
                        
                        if (newTokens.length > 0) {
                            return newTokens[0].NFToken.NFTokenID;
                        }
                    } else if (finalFields?.NFTokens) {
                        // If no previous fields, take the last token
                        const tokens = finalFields.NFTokens;
                        return tokens[tokens.length - 1].NFToken.NFTokenID;
                    }
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error(`   ❌ Error retrieving NFTokenID for tx ${txHash}:`, error.message);
        return null;
    }
}

async function main() {
    // Load results
    const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
    
    // Connect to XRPL
    console.log('🌐 Connecting to XRPL Testnet...');
    const client = new Client(XRPL_NETWORK);
    await client.connect();
    
    console.log(`📋 Processing ${results.length} transactions...\n`);
    
    let updated = 0;
    let failed = 0;
    
    for (const result of results) {
        if (result.nftokenID) {
            console.log(`✓ ${result.tokenId}: Already has NFTokenID`);
            continue;
        }
        
        console.log(`🔍 Retrieving NFTokenID for ${result.tokenId}...`);
        const nftokenID = await getNFTokenIDFromTransaction(client, result.transactionHash);
        
        if (nftokenID) {
            result.nftokenID = nftokenID;
            console.log(`   ✅ Found: ${nftokenID}`);
            updated++;
        } else {
            console.log(`   ❌ Could not find NFTokenID`);
            failed++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save updated results
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ NFTokenID RETRIEVAL COMPLETE');
    console.log('═══════════════════════════════════════════════');
    console.log(`   • Updated: ${updated}`);
    console.log(`   • Failed: ${failed}`);
    console.log(`   • Total: ${results.length}`);
    console.log(`\n📁 Results saved to: ${RESULTS_FILE}`);
    
    await client.disconnect();
}

main().catch(error => {
    console.error('💀 Error:', error);
    process.exit(1);
});
