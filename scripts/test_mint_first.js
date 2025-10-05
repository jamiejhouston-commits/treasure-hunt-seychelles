import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import xrpl from 'xrpl';

function uriToHex(uri) {
  return Buffer.from(uri, 'utf8').toString('hex').toUpperCase();
}

async function mintFirst() {
  console.log('🚀 Testing XRPL connection and minting first NFT...');
  
  const seed = process.env.XRPL_TESTNET_SEED;
  const endpoint = 'wss://s.altnet.rippletest.net:51233';
  const outDir = path.resolve('./dist');
  const manifestPath = path.join(outDir, 'manifest.json');
  
  const manifest = await fs.readJson(manifestPath);
  const firstItem = manifest.items[0];
  
  console.log(`First item to mint: #${firstItem.id}`);
  console.log(`Metadata URI: ${firstItem.metadata}`);
  
  console.log('🔌 Connecting to XRPL Testnet...');
  const client = new xrpl.Client(endpoint);
  
  try {
    await client.connect();
    console.log('✅ Connected to XRPL Testnet');
    
    const wallet = xrpl.Wallet.fromSeed(seed);
    console.log('👛 Wallet address:', wallet.address);
    
    // Check account info
    try {
      const accountInfo = await client.request({
        command: 'account_info',
        account: wallet.address
      });
      console.log(`💰 Balance: ${accountInfo.result.account_data.Balance / 1000000} XRP`);
    } catch (e) {
      console.log('⚠️  Could not get account info:', e.message);
    }
    
    const taxon = parseInt(process.env.NFT_TAXON || '7777', 10);
    const transferFee = parseInt(process.env.TRANSFER_FEE || '50000', 10);
    
    const tx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      URI: uriToHex(firstItem.metadata),
      Flags: 8,
      TransferFee: transferFee,
      NFTokenTaxon: taxon
    };
    
    console.log('📝 Preparing transaction...');
    console.log('Transaction details:', {
      URI: firstItem.metadata,
      URIHex: uriToHex(firstItem.metadata).substring(0, 50) + '...',
      TransferFee: transferFee,
      NFTokenTaxon: taxon
    });
    
    const prepared = await client.autofill(tx);
    console.log('✅ Transaction prepared, fee:', prepared.Fee);
    
    console.log('✍️  Signing transaction...');
    const signed = wallet.sign(prepared);
    
    console.log('📤 Submitting transaction...');
    const res = await client.submitAndWait(signed.tx_blob);
    
    console.log(`📋 Result: ${res.result.engine_result}`);
    console.log(`🔗 Transaction hash: ${signed.hash}`);
    
    if (res.result.engine_result === 'tesSUCCESS') {
      console.log('🎉 First NFT minted successfully!');
      
      // Extract NFTokenID
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
      
      if (NFTokenID) {
        console.log(`🏷️  NFTokenID: ${NFTokenID}`);
      } else {
        console.log('⚠️  Could not extract NFTokenID');
      }
      
      // Check wallet NFTs
      const nftResp = await client.request({ command: 'account_nfts', account: wallet.address });
      console.log(`📊 Wallet now holds ${nftResp.result.account_nfts?.length || 0} NFTs`);
      
    } else {
      console.log('❌ Transaction failed:', res.result.engine_result);
      console.log('Full result:', JSON.stringify(res.result, null, 2));
    }
    
  } finally {
    await client.disconnect();
    console.log('🔌 Disconnected from XRPL');
  }
}

mintFirst().catch(err => {
  console.error('💥 Error:', err);
  process.exit(1);
});