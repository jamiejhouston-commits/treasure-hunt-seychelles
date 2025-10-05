import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import xrpl from 'xrpl';

function uriToHex(uri) {
  return Buffer.from(uri, 'utf8').toString('hex').toUpperCase();
}

async function batchMint() {
  console.log('🏴‍☠️ Levasseur Treasure - XRPL Testnet Batch Minting');
  console.log('='.repeat(60));
  
  const seed = process.env.XRPL_TESTNET_SEED;
  const endpoint = 'wss://s.altnet.rippletest.net:51233';
  const outDir = path.resolve('./dist');
  const manifestPath = path.join(outDir, 'manifest.json');
  
  if (!seed) {
    console.error('❌ XRPL_TESTNET_SEED missing');
    process.exit(1);
  }

  console.log('📖 Loading manifest...');
  const manifest = await fs.readJson(manifestPath);
  const items = manifest.items || [];
  console.log(`📊 Found ${items.length} NFTs to mint`);

  console.log('🔌 Connecting to XRPL Testnet...');
  const client = new xrpl.Client(endpoint);
  await client.connect();
  
  const wallet = xrpl.Wallet.fromSeed(seed);
  console.log(`👛 Wallet: ${wallet.address}`);

  // Check current account state
  try {
    const accountInfo = await client.request({
      command: 'account_info',
      account: wallet.address
    });
    console.log(`💰 Balance: ${accountInfo.result.account_data.Balance / 1000000} XRP`);
    
    const nftResp = await client.request({ 
      command: 'account_nfts', 
      account: wallet.address 
    });
    const currentNFTs = nftResp.result.account_nfts?.length || 0;
    console.log(`🏷️  Current NFTs: ${currentNFTs}`);
    
    if (currentNFTs > 0) {
      console.log('⚠️  Wallet already contains NFTs. Continuing from where we left off...');
    }
  } catch (e) {
    console.log('⚠️  Could not get account info:', e.message);
  }

  const taxon = parseInt(process.env.NFT_TAXON || '7777', 10);
  const transferFee = parseInt(process.env.TRANSFER_FEE || '50000', 10);
  console.log(`🏷️  NFToken Taxon: ${taxon}`);
  console.log(`💰 Transfer Fee: ${transferFee} (${transferFee/1000}%)`);

  const minted = [];
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  console.log('\n🚀 Starting minting process...\n');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const progress = `[${i + 1}/${items.length}]`;
    
    console.log(`${progress} Processing NFT #${item.id}...`);
    
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
      const res = await client.submitAndWait(signed.tx_blob);

      if (res.result.meta.TransactionResult === 'tesSUCCESS') {
        // Extract NFTokenID
        let NFTokenID = null;
        const affected = res.result.meta.AffectedNodes || [];
        
        for (const n of affected) {
          const page = n.CreatedNode?.NewFields || n.ModifiedNode?.FinalFields;
          if ((n.CreatedNode || n.ModifiedNode) && 
              (n.CreatedNode?.LedgerEntryType === 'NFTokenPage' || 
               n.ModifiedNode?.LedgerEntryType === 'NFTokenPage')) {
            const arr = page?.NFTokens || [];
            if (arr.length) NFTokenID = arr[arr.length - 1].NFToken.NFTokenID;
          }
        }
        
        if (NFTokenID) {
          console.log(`✅ ${progress} Minted #${item.id} -> ${NFTokenID}`);
          minted.push({
            id: item.id,
            NFTokenID,
            uri: item.metadata,
            txHash: signed.hash,
            success: true
          });
          successCount++;
        } else {
          throw new Error('NFTokenID not found in transaction result');
        }
      } else {
        throw new Error(`Transaction failed: ${res.result.meta.TransactionResult}`);
      }

    } catch (error) {
      console.log(`❌ ${progress} Failed #${item.id}: ${error.message}`);
      minted.push({
        id: item.id,
        error: error.message,
        success: false
      });
      errorCount++;
    }

    // Progress update every 10 items
    if ((i + 1) % 10 === 0 || i === items.length - 1) {
      const percent = ((i + 1) / items.length * 100).toFixed(1);
      console.log(`📊 Progress: ${percent}% | ✅ ${successCount} | ❌ ${errorCount}`);
    }

    // Small delay between transactions
    if (i < items.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save results
  console.log('\n💾 Saving minting results...');
  const resultsPath = path.join(outDir, 'minted.json');
  await fs.writeJson(resultsPath, minted, { spaces: 2 });
  console.log(`✅ Results saved to ${resultsPath}`);

  // Final account check
  const finalNftResp = await client.request({ 
    command: 'account_nfts', 
    account: wallet.address 
  });
  const finalNFTCount = finalNftResp.result.account_nfts?.length || 0;

  await client.disconnect();

  // Summary
  console.log('\n🎉 Minting Complete!');
  console.log('='.repeat(40));
  console.log(`✅ Successful: ${successCount} NFTs`);
  console.log(`❌ Failed: ${errorCount} NFTs`);
  console.log(`📊 Total Processed: ${successCount + errorCount} NFTs`);
  console.log(`🏷️  Final NFT Count: ${finalNFTCount} NFTs in wallet`);
  console.log('='.repeat(40));

  return {
    success: successCount,
    failed: errorCount,
    total: items.length,
    results: minted
  };
}

if (process.argv[1] === import.meta.url.replace('file://', '')) {
  batchMint().catch(err => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
}