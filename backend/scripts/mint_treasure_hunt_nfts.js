/**
 * Mint Treasure Hunt Chapter 1 NFTs on XRPL Testnet
 * Mints all 20 NFTs and updates database with nftoken_ids
 */

const xrpl = require('xrpl');
const fs = require('fs-extra');
const path = require('path');
const db = require('../database/connection');

// Configuration
const TESTNET_WSS = process.env.XRPL_WSS || 'wss://s.altnet.rippletest.net:51233';
const ISSUER_SEED = process.env.ISSUER_SEED || 'sEdSKaCy2JT7JaM7v95H9SxkhP9wS2r'; // Testnet seed
const METADATA_DIR = path.resolve(__dirname, '../../content/treasure_hunt_chapter1/metadata');
const TOTAL_NFTS = 20;

// NFT Transfer Fee (7.5% = 7500 / 100000)
const TRANSFER_FEE = 7500;

async function mintNFT(client, wallet, metadata, tokenId) {
  try {
    console.log(`\n🔨 Minting NFT #${tokenId}: ${metadata.name}`);

    // Prepare metadata URI (using local server for testnet)
    const metadataURI = `http://localhost:3001/treasure_hunt/chapter1/metadata/nft_${tokenId}.json`;

    // Convert URI to hex
    const uriHex = Buffer.from(metadataURI).toString('hex').toUpperCase();

    // Create NFT mint transaction
    const mintTx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      URI: uriHex,
      Flags: 8, // tfTransferable (8)
      TransferFee: TRANSFER_FEE,
      NFTokenTaxon: 1 // Treasure Hunt Chapter 1
    };

    console.log(`   📝 URI: ${metadataURI}`);
    console.log(`   🔑 Issuer: ${wallet.address}`);

    // Submit transaction
    const prepared = await client.autofill(mintTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Mint failed: ${result.result.meta.TransactionResult}`);
    }

    // Extract NFToken ID from metadata
    const nftokenID = result.result.meta.nftoken_id ||
                       result.result.meta.AffectedNodes
                         ?.find(node => node.CreatedNode?.LedgerEntryType === 'NFTokenPage')
                         ?.CreatedNode?.NewFields?.NFTokens?.[0]?.NFToken?.NFTokenID;

    if (!nftokenID) {
      // Alternative: search through modified nodes
      for (const node of result.result.meta.AffectedNodes) {
        if (node.ModifiedNode?.LedgerEntryType === 'NFTokenPage') {
          const finalFields = node.ModifiedNode.FinalFields;
          const prevFields = node.ModifiedNode.PreviousFields;

          if (finalFields?.NFTokens && prevFields?.NFTokens) {
            const newTokens = finalFields.NFTokens.filter(
              t => !prevFields.NFTokens.find(p => p.NFToken.NFTokenID === t.NFToken.NFTokenID)
            );
            if (newTokens.length > 0) {
              return newTokens[0].NFToken.NFTokenID;
            }
          } else if (finalFields?.NFTokens) {
            return finalFields.NFTokens[finalFields.NFTokens.length - 1].NFToken.NFTokenID;
          }
        }
      }
      throw new Error('Could not find NFToken ID in transaction result');
    }

    console.log(`   ✅ Minted! NFToken ID: ${nftokenID}`);
    console.log(`   🔗 Ledger: ${result.result.ledger_index}`);

    return {
      nftokenID,
      txHash: result.result.hash,
      ledgerIndex: result.result.ledger_index
    };

  } catch (error) {
    console.error(`   ❌ Failed to mint NFT #${tokenId}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🏴‍☠️ TREASURE HUNT CHAPTER 1 - NFT MINTING');
  console.log('=' .repeat(70));
  console.log(`Network: XRPL Testnet (${TESTNET_WSS})`);
  console.log(`Total NFTs: ${TOTAL_NFTS}`);
  console.log('=' .repeat(70));

  const client = new xrpl.Client(TESTNET_WSS);
  let wallet;

  try {
    // Connect to XRPL
    console.log('\n🔌 Connecting to XRPL Testnet...');
    await client.connect();
    console.log('✅ Connected!');

    // Get or create wallet
    wallet = xrpl.Wallet.fromSeed(ISSUER_SEED);
    console.log(`\n💼 Issuer Wallet: ${wallet.address}`);

    // Check balance
    const accountInfo = await client.request({
      command: 'account_info',
      account: wallet.address,
      ledger_index: 'validated'
    });

    const balance = Number(accountInfo.result.account_data.Balance) / 1000000;
    console.log(`💰 Balance: ${balance} XRP`);

    if (balance < 100) {
      console.log('\n⚠️  WARNING: Low balance. You may need more testnet XRP.');
      console.log('   Get testnet XRP from: https://xrpl.org/xrp-testnet-faucet.html');
    }

    // Load and mint each NFT
    const results = [];
    const errors = [];

    for (let i = 1; i <= TOTAL_NFTS; i++) {
      const metadataPath = path.join(METADATA_DIR, `nft_${i}.json`);

      if (!fs.existsSync(metadataPath)) {
        console.log(`\n⚠️  Skipping NFT #${i} - metadata file not found`);
        errors.push({ tokenId: i, error: 'Metadata file not found' });
        continue;
      }

      const metadata = await fs.readJSON(metadataPath);

      try {
        const result = await mintNFT(client, wallet, metadata, i);
        results.push({
          tokenId: i,
          ...result
        });

        // Small delay between mints to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        errors.push({ tokenId: i, error: error.message });
      }
    }

    // Update database with minted NFToken IDs
    console.log('\n\n📝 Updating database with NFToken IDs...');

    for (const result of results) {
      try {
        await db('nfts')
          .where('token_id', result.tokenId)
          .update({
            nftoken_id: result.nftokenID,
            current_owner: wallet.address,
            updated_at: new Date().toISOString()
          });
        console.log(`   ✅ Updated NFT #${result.tokenId} in database`);
      } catch (dbError) {
        console.error(`   ❌ Failed to update NFT #${result.tokenId}:`, dbError.message);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 MINTING SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Successfully minted: ${results.length}/${TOTAL_NFTS} NFTs`);

    if (errors.length > 0) {
      console.log(`\n❌ Failed to mint: ${errors.length} NFTs`);
      errors.forEach(({ tokenId, error }) => {
        console.log(`   NFT #${tokenId}: ${error}`);
      });
    }

    if (results.length > 0) {
      console.log('\n🎉 Minted NFToken IDs:');
      results.forEach(({ tokenId, nftokenID }) => {
        console.log(`   #${tokenId}: ${nftokenID}`);
      });
    }

    console.log('\n💼 Issuer Account:', wallet.address);
    console.log('\n🔗 View on Testnet Explorer:');
    console.log(`   https://testnet.xrpl.org/accounts/${wallet.address}`);
    console.log('='.repeat(70));

    // Save results to file
    const resultsPath = path.join(__dirname, 'mint_results.json');
    await fs.writeJSON(resultsPath, {
      timestamp: new Date().toISOString(),
      network: 'testnet',
      issuer: wallet.address,
      totalMinted: results.length,
      results,
      errors
    }, { spaces: 2 });
    console.log(`\n💾 Results saved to: ${resultsPath}`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    throw error;
  } finally {
    if (client.isConnected()) {
      await client.disconnect();
      console.log('\n👋 Disconnected from XRPL');
    }
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✨ Minting complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Minting failed:', error);
      process.exit(1);
    });
}

module.exports = { mintNFT };
