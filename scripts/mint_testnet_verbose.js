import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import xrpl from 'xrpl';

function uriToHex(uri) {
  return Buffer.from(uri, 'utf8').toString('hex').toUpperCase();
}

async function main() {
  console.log('🚀 Starting XRPL Testnet Minting Process...');
  
  const seed = process.env.XRPL_TESTNET_SEED;
  const endpoint = process.env.XRPL_ENDPOINT || 'wss://s.altnet.rippletest.net:51233';
  const outDir = path.resolve(process.env.OUTPUT_DIR || './dist');
  const manifestPath = path.join(outDir, 'manifest.json');

  console.log('🔧 Configuration:');
  console.log(`  Seed: ${seed ? 'Set' : 'Missing'}`);
  console.log(`  Endpoint: ${endpoint}`);
  console.log(`  Output Dir: ${outDir}`);
  console.log(`  Manifest: ${manifestPath}`);

  if (!seed) {
    console.error('❌ XRPL_TESTNET_SEED missing. Add to scripts/.env and rerun.');
    process.exit(1);
  }
  
  if (!await fs.pathExists(manifestPath)) {
    console.error('❌ Missing dist/manifest.json. Run IPFS upload first.');
    process.exit(1);
  }

  console.log('📖 Reading manifest...');
  const manifest = await fs.readJson(manifestPath);
  console.log(`  Found ${manifest.items ? manifest.items.length : 0} items to mint`);

  console.log('🔌 Connecting to XRPL Testnet...');
  const client = new xrpl.Client(endpoint);
  await client.connect();
  
  const wallet = xrpl.Wallet.fromSeed(seed);
  console.log('👛 Wallet:', wallet.address);

  const taxon = parseInt(process.env.NFT_TAXON || '7777', 10);
  const transferFee = parseInt(process.env.TRANSFER_FEE || '50000', 10); // 5%
  
  console.log(`🏷️  NFT Taxon: ${taxon}`);
  console.log(`💰 Transfer Fee: ${transferFee} (${transferFee/1000}%)`);

  const minted = [];
  const mintLimit = parseInt(process.env.MINT_LIMIT || '0', 10);
  const items = Array.isArray(manifest.items) ? manifest.items : [];
  const toMint = mintLimit && mintLimit > 0 ? items.slice(0, mintLimit) : items;
  
  console.log(`🎯 Minting ${toMint.length} NFTs...`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < toMint.length; i++) {
    const item = toMint[i];
    console.log(`[${i + 1}/${toMint.length}] Minting NFT #${item.id}...`);
    
    const uri = item.metadata;
    console.log(`  URI: ${uri}`);
    
    const tx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      URI: uriToHex(uri),
      Flags: 8,
      TransferFee: transferFee,
      NFTokenTaxon: taxon
    };
    
    try {
      console.log('  📝 Preparing transaction...');
      const prepared = await client.autofill(tx);
      
      console.log('  ✍️  Signing transaction...');
      const signed = wallet.sign(prepared);
      
      console.log('  📤 Submitting to network...');
      const res = await client.submitAndWait(signed.tx_blob);
      
      console.log(`  📋 Result: ${res.result.engine_result}`);
      
      if (res.result.engine_result !== 'tesSUCCESS') {
        throw new Error(`Transaction failed: ${res.result.engine_result}`);
      }
      
      const meta = res.result.meta;
      const affected = meta.AffectedNodes || [];
      let NFTokenID = null;
      
      for (const n of affected) {
        const page = n.CreatedNode?.NewFields || n.ModifiedNode?.FinalFields;
        if ((n.CreatedNode || n.ModifiedNode) && 
            (n.CreatedNode?.LedgerEntryType === 'NFTokenPage' || 
             n.ModifiedNode?.LedgerEntryType === 'NFTokenPage')) {
          const arr = page?.NFTokens || [];
          if (arr.length) NFTokenID = arr[arr.length - 1].NFToken.NFTokenID;
        }
      }
      
      if (!NFTokenID) throw new Error('NFTokenID not found in transaction result');
      
      console.log(`✅ Minted #${item.id} -> ${NFTokenID}`);
      minted.push({ 
        id: item.id, 
        NFTokenID, 
        uri, 
        rarity: undefined,
        txHash: signed.hash
      });
      successCount++;
      
    } catch (e) {
      console.error(`❌ Mint failed for #${item.id}:`, e?.message || e);
      minted.push({ 
        id: item.id, 
        error: String(e?.message || e) 
      });
      errorCount++;
    }
    
    // Small delay between mints
    if (i < toMint.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n📄 Saving results...');
  await fs.writeJson(path.join(outDir, 'minted.json'), minted, { spaces: 2 });
  console.log('✅ Wrote dist/minted.json');

  console.log('\n🔍 Checking wallet NFTs...');
  const nftResp = await client.request({ command: 'account_nfts', account: wallet.address });
  console.log(`📊 Account holds ${nftResp.result.account_nfts?.length || 0} NFTs`);
  
  await client.disconnect();
  
  console.log('\n🎉 Minting Complete!');
  console.log(`✅ Success: ${successCount} NFTs`);
  console.log(`❌ Errors: ${errorCount} NFTs`);
  console.log(`📊 Total: ${successCount + errorCount} NFTs processed`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { 
    console.error('💥 Fatal error:', err); 
    process.exit(1); 
  });
}