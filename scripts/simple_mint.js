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
  console.log('🏴‍☠️ Levasseur Treasure - XRPL Minting');
  console.log('=====================================');
  
  // Load manifest
  const manifestPath = path.join(__dirname, 'dist', 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const items = manifest.items || [];
  
  // XRPL setup
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_TESTNET_SEED);
  
  console.log(`👛 Wallet: ${wallet.address}`);
  console.log(`📊 Items to mint: ${items.length}`);
  
  // Check existing NFTs
  const nftResp = await client.request({ command: 'account_nfts', account: wallet.address });
  const currentNFTs = nftResp.result.account_nfts?.length || 0;
  console.log(`🏷️  Current NFTs: ${currentNFTs}`);
  
  const taxon = parseInt(process.env.NFT_TAXON || '7777');
  const transferFee = parseInt(process.env.TRANSFER_FEE || '50000');
  
  console.log('\n🚀 Starting minting...\n');
  
  const results = [];
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`[${i+1}/${items.length}] Minting NFT #${item.id}...`);
    
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
        // Find NFTokenID
        let nftokenID = null;
        for (const node of response.result.meta.AffectedNodes) {
          if (node.CreatedNode?.LedgerEntryType === 'NFTokenPage') {
            const tokens = node.CreatedNode.NewFields.NFTokens;
            if (tokens && tokens.length > 0) {
              nftokenID = tokens[tokens.length - 1].NFToken.NFTokenID;
            }
          }
        }
        
        console.log(`✅ Success! NFT #${item.id} -> ${nftokenID}`);
        results.push({
          id: item.id,
          NFTokenID: nftokenID,
          uri: item.metadata,
          txHash: signed.hash
        });
        success++;
      } else {
        throw new Error(response.result.meta.TransactionResult);
      }
      
    } catch (error) {
      console.log(`❌ Failed NFT #${item.id}: ${error.message}`);
      results.push({
        id: item.id,
        error: error.message
      });
      failed++;
    }
    
    // Progress every 10 items
    if ((i + 1) % 10 === 0) {
      console.log(`📊 Progress: ${success} success, ${failed} failed`);
    }
    
    // Small delay
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Save results
  const resultsPath = path.join(__dirname, 'dist', 'minted.json');
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
  
  console.log('\n🎉 Minting Complete!');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📄 Results saved to: ${resultsPath}`);
  
  await client.disconnect();
}

main().catch(console.error);