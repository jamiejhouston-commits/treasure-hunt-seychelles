import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import xrpl from 'xrpl';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function uriToHex(uri) {
  return Buffer.from(uri, 'utf8').toString('hex').toUpperCase();
}

async function main() {
  console.log('🏴‍☠️ Levasseur Treasure - XRPL Minting (Resume Capable)');
  console.log('======================================================');
  
  // Load manifest
  const manifestPath = path.join(__dirname, 'dist', 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const items = manifest.items || [];
  
  // Check for existing results
  const resultsPath = path.join(__dirname, 'dist', 'minted.json');
  let existingResults = [];
  try {
    const existingData = await fs.readFile(resultsPath, 'utf8');
    existingResults = JSON.parse(existingData);
    console.log(`📋 Found ${existingResults.length} existing minting results`);
  } catch (error) {
    console.log('📋 No existing results found, starting fresh');
  }
  
  // XRPL setup
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_TESTNET_SEED);
  
  console.log(`👛 Wallet: ${wallet.address}`);
  console.log(`📊 Total items: ${items.length}`);
  
  // Check existing NFTs in wallet
  const nftResp = await client.request({ command: 'account_nfts', account: wallet.address });
  const currentNFTs = nftResp.result.account_nfts?.length || 0;
  console.log(`🏷️  Current NFTs in wallet: ${currentNFTs}`);
  
  // Find items that need to be minted
  const mintedIds = new Set(existingResults.filter(r => r.NFTokenID).map(r => r.id));
  const itemsToMint = items.filter(item => !mintedIds.has(item.id));
  
  console.log(`✅ Already minted: ${mintedIds.size}`);
  console.log(`⏳ Need to mint: ${itemsToMint.length}`);
  
  if (itemsToMint.length === 0) {
    console.log('🎉 All items already minted!');
    await client.disconnect();
    return;
  }
  
  const taxon = parseInt(process.env.NFT_TAXON || '7777');
  const transferFee = parseInt(process.env.TRANSFER_FEE || '50000');
  
  console.log('\n🚀 Starting minting...\n');
  
  const results = [...existingResults]; // Start with existing results
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < itemsToMint.length; i++) {
    const item = itemsToMint[i];
    const totalProgress = mintedIds.size + i + 1;
    console.log(`[${totalProgress}/${items.length}] Minting NFT #${item.id}...`);
    
    try {
      const tx = {
        TransactionType: 'NFTokenMint',
        Account: wallet.address,
        URI: uriToHex(item.metadata),
        Flags: 8,
        TransferFee: transferFee,
        NFTokenTaxon: taxon
      };
      
      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const response = await client.submitAndWait(signed.tx_blob);
      
      if (response.result.meta.TransactionResult === 'tesSUCCESS') {
        // Find NFTokenID - improved extraction
        let nftokenID = null;
        for (const node of response.result.meta.AffectedNodes) {
          if (node.CreatedNode?.LedgerEntryType === 'NFTokenPage') {
            const tokens = node.CreatedNode.NewFields?.NFTokens || [];
            if (tokens.length > 0) {
              nftokenID = tokens[tokens.length - 1].NFToken?.NFTokenID;
            }
          }
          // Also check ModifiedNode for existing pages
          if (node.ModifiedNode?.LedgerEntryType === 'NFTokenPage') {
            const finalFields = node.ModifiedNode.FinalFields;
            const prevFields = node.ModifiedNode.PreviousFields;
            if (finalFields?.NFTokens && prevFields?.NFTokens) {
              // Find newly added token
              const newTokens = finalFields.NFTokens.filter(token => 
                !prevFields.NFTokens.some(prevToken => 
                  prevToken.NFToken?.NFTokenID === token.NFToken?.NFTokenID
                )
              );
              if (newTokens.length > 0) {
                nftokenID = newTokens[0].NFToken?.NFTokenID;
              }
            }
          }
        }
        
        console.log(`✅ Success! NFT #${item.id} -> ${nftokenID}`);
        results.push({
          id: item.id,
          NFTokenID: nftokenID,
          uri: item.metadata,
          txHash: signed.hash,
          mintedAt: new Date().toISOString()
        });
        success++;
        
        // Save progress after each successful mint
        await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
        
      } else {
        throw new Error(response.result.meta.TransactionResult);
      }
      
    } catch (error) {
      console.log(`❌ Failed NFT #${item.id}: ${error.message}`);
      results.push({
        id: item.id,
        error: error.message,
        failedAt: new Date().toISOString()
      });
      failed++;
      
      // Save progress even on failures
      await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
    }
    
    // Progress every 10 items
    if ((i + 1) % 10 === 0) {
      const totalSuccess = mintedIds.size + success;
      console.log(`📊 Progress: ${totalSuccess}/${items.length} total minted, ${success} this session, ${failed} failed`);
    }
    
    // Small delay to be nice to the network
    await new Promise(r => setTimeout(r, 1000));
  }
  
  const totalMinted = mintedIds.size + success;
  
  console.log('\n🎉 Minting Session Complete!');
  console.log(`✅ Total minted: ${totalMinted}/${items.length}`);
  console.log(`🆕 New this session: ${success}`);
  console.log(`❌ Failed this session: ${failed}`);
  console.log(`📄 Results saved to: ${resultsPath}`);
  
  if (totalMinted === items.length) {
    console.log('\n🏆 ALL NFTS SUCCESSFULLY MINTED! 🏆');
  }
  
  await client.disconnect();
}

main().catch(console.error);