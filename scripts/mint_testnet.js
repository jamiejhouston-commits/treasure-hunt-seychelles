import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import xrpl from 'xrpl';

function uriToHex(uri) {
  return Buffer.from(uri, 'utf8').toString('hex').toUpperCase();
}

async function main() {
  const seed = process.env.XRPL_TESTNET_SEED;
  const endpoint = process.env.XRPL_ENDPOINT || 'wss://s.altnet.rippletest.net:51233';
  const outDir = path.resolve(process.env.OUTPUT_DIR || './dist');
  const manifestPath = path.join(outDir, 'manifest.json');

  if (!seed) {
    console.error('❌ XRPL_TESTNET_SEED missing. Add to scripts/.env and rerun.');
    process.exit(1);
  }
  if (!await fs.pathExists(manifestPath)) {
    console.error('❌ Missing dist/manifest.json. Run IPFS upload first.');
    process.exit(1);
  }

  const manifest = await fs.readJson(manifestPath);
  const client = new xrpl.Client(endpoint);
  console.log('🔌 Connecting to XRPL Testnet...');
  await client.connect();
  const wallet = xrpl.Wallet.fromSeed(seed);
  console.log('👛 Wallet:', wallet.address);

  const taxon = parseInt(process.env.NFT_TAXON || '7777', 10);
  const transferFee = parseInt(process.env.TRANSFER_FEE || '50000', 10); // 5%

  const minted = [];
  const mintLimit = parseInt(process.env.MINT_LIMIT || '0', 10);
  const items = Array.isArray(manifest.items) ? manifest.items : [];
  const toMint = mintLimit && mintLimit > 0 ? items.slice(0, mintLimit) : items;
  for (const item of toMint) {
    const uri = item.metadata;
    const tx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      URI: uriToHex(uri),
      Flags: 8,
      TransferFee: transferFee,
      NFTokenTaxon: taxon
    };
    try {
      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const res = await client.submitAndWait(signed.tx_blob);
      const meta = res.result.meta;
      const affected = meta.AffectedNodes || [];
      let NFTokenID = null;
      for (const n of affected) {
        const page = n.CreatedNode?.NewFields || n.ModifiedNode?.FinalFields;
        if ((n.CreatedNode || n.ModifiedNode) && (n.CreatedNode?.LedgerEntryType === 'NFTokenPage' || n.ModifiedNode?.LedgerEntryType === 'NFTokenPage')) {
          const arr = page?.NFTokens || [];
          if (arr.length) NFTokenID = arr[arr.length - 1].NFToken.NFTokenID;
        }
      }
      if (!NFTokenID) throw new Error('NFTokenID not found');
      console.log(`✅ Minted #${item.id} -> ${NFTokenID}`);
      minted.push({ id: item.id, NFTokenID, uri, rarity: undefined });
    } catch (e) {
      console.error(`❌ Mint failed for #${item.id}:`, e?.message || e);
      minted.push({ id: item.id, error: String(e?.message || e) });
    }
  }

  await fs.writeJson(path.join(outDir, 'minted.json'), minted, { spaces: 2 });
  console.log('📄 Wrote dist/minted.json');

  const nftResp = await client.request({ command: 'account_nfts', account: wallet.address });
  console.log(`🔎 Account holds ${nftResp.result.account_nfts?.length || 0} NFTs`);
  await client.disconnect();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { console.error(err); process.exit(1); });
}
