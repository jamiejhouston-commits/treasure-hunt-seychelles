import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import xrpl from 'xrpl';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function mintFromExistingManifest() {
  console.log('🏴‍☠️ Continuing SE2 Minting from Existing Manifest');
  console.log('===============================================');
  
  // Load existing manifest
  const manifestPath = path.join(__dirname, 'dist', 'manifest_se2.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  
  console.log(`📋 Found ${manifest.length} NFTs ready to mint`);
  
  const mintedRecords = [];
  let successCount = 0;
  let failCount = 0;
  
  // XRPL setup
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_TESTNET_SEED);
  
  console.log(`👛 Wallet: ${wallet.address}`);
  console.log('⚓ Starting minting process...\n');
  
  for (const item of manifest) {
    try {
      console.log(`🏴‍☠️ Minting SE2-${item.index.toString().padStart(2, '0')}...`);
      
      const tx = {
        TransactionType: 'NFTokenMint',
        Account: wallet.address,
        URI: Buffer.from(item.uri, 'utf8').toString('hex').toUpperCase(),
        Flags: 8, // tfTransferable
        TransferFee: parseInt(process.env.TRANSFER_FEE || '50000'),
        NFTokenTaxon: parseInt(process.env.NFT_TAXON || '7777')
      };
      
      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const response = await client.submitAndWait(signed.tx_blob);
      
      if (response.result.meta.TransactionResult === 'tesSUCCESS') {
        // Extract NFTokenID using account_nfts query method (more reliable)
        await new Promise(r => setTimeout(r, 1000)); // Wait for ledger update
        const nftResp = await client.request({ 
          command: 'account_nfts', 
          account: wallet.address,
          limit: 200
        });
        
        // Find the newest NFT that matches our URI
        const nfts = nftResp.result.account_nfts || [];
        const targetURI = Buffer.from(item.uri, 'utf8').toString('hex').toUpperCase();
        const matchingNFT = nfts.find(nft => nft.URI === targetURI);
        
        const record = {
          index: item.index,
          name: `SE2-${item.index.toString().padStart(2, '0')}`,
          uri: item.uri,
          nftoken_id: matchingNFT ? matchingNFT.NFTokenID : 'NOT_FOUND',
          tx_hash: signed.hash,
          ledger_index: response.result.ledger_index,
          timestamp: new Date().toISOString(),
          image_cid: item.image_cid,
          metadata_cid: item.metadata_cid
        };
        
        mintedRecords.push(record);
        successCount++;
        
        console.log(`  ✅ Success: ${matchingNFT ? matchingNFT.NFTokenID : 'ID_PENDING'}`);
        
      } else {
        throw new Error(`Transaction failed: ${response.result.meta.TransactionResult}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Failed SE2-${item.index.toString().padStart(2, '0')}: ${error.message}`);
      
      const record = {
        index: item.index,
        name: `SE2-${item.index.toString().padStart(2, '0')}`,
        uri: item.uri,
        error: error.message,
        timestamp: new Date().toISOString(),
        image_cid: item.image_cid,
        metadata_cid: item.metadata_cid
      };
      
      mintedRecords.push(record);
      failCount++;
    }
    
    // Progress update every 5 items
    if (item.index % 5 === 0) {
      console.log(`📊 Progress: ${successCount} success, ${failCount} failed`);
    }
    
    // Delay between mints to avoid rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }
  
  await client.disconnect();
  
  // Save results
  const mintedPath = path.join(__dirname, 'dist', 'minted', 'minted_se2.json');
  await fs.writeFile(mintedPath, JSON.stringify(mintedRecords, null, 2));
  
  // Generate README with hidden letters and star counts
  const hiddenLettersA = ["B","A","I","E","L","A","Z","A","R","E"]; // SE2-01 to SE2-10
  const hiddenLettersB = ["P","I","C","A","U","L","T","B","A","Y"]; // SE2-11 to SE2-20
  const starCards = [
    {index: 2, stars: 3},
    {index: 4, stars: 5}, 
    {index: 9, stars: 7},
    {index: 12, stars: 2},
    {index: 16, stars: 4},
    {index: 19, stars: 6}
  ];
  
  const readme = `# SE2 — Chapter II: The Landing at Baie Lazare (Lazare Picault)

## Hidden Letters
Set A (01-10): ${hiddenLettersA.join('')}
Set B (11-20): ${hiddenLettersB.join('')}

## Star Counts (Vault Offset)
${starCards.map(c => `SE2-${c.index.toString().padStart(2, '0')}: ${c.stars} stars`).join('\n')}
**Offset Sequence: ${starCards.map(c => c.stars).join('')}**

## Minting Results
Total Processed: ${mintedRecords.length}/20
Successful: ${successCount}
Failed: ${failCount}

## All NFT URIs
${mintedRecords.map(r => `${r.name}: ${r.uri}`).join('\n')}
`;
  
  const readmePath = path.join(__dirname, 'dist', 'metadata', 'se2', 'README.md');
  await fs.writeFile(readmePath, readme);
  
  // Final Report
  console.log('\n🎉 SE2 MINTING COMPLETE!');
  console.log('========================');
  console.log(`✅ Minted ${successCount}/20 Special-Edition NFTs for Chapter II`);
  console.log(`📍 Wallet: ${wallet.address}`);
  console.log(`🔢 Star Offset: ${starCards.map(c => c.stars).join('')}`);
  console.log(`❌ Failed: ${failCount}`);
  
  const successful = mintedRecords.filter(r => r.nftoken_id && !r.error);
  if (successful.length > 0) {
    console.log(`\n📊 First 3 NFTokenIDs:`);
    successful.slice(0, 3).forEach(r => {
      console.log(`   ${r.name}: ${r.nftoken_id}`);
    });
    
    if (successful.length >= 3) {
      console.log(`📊 Last 3 NFTokenIDs:`);
      successful.slice(-3).forEach(r => {
        console.log(`   ${r.name}: ${r.nftoken_id}`);
      });
    }
  }
  
  console.log(`\n🌐 Results saved to: ${mintedPath}`);
  console.log(`📖 README saved to: ${readmePath}`);
  
  // Quick verification
  const currentNFTs = await client.request({ command: 'account_nfts', account: wallet.address });
  console.log(`\n🏷️  Total NFTs in wallet: ${currentNFTs.result.account_nfts?.length || 0}`);
}

mintFromExistingManifest().catch(console.error);