import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import xrpl from 'xrpl';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .option('cidMap', { type: 'string', default: './out/cids/cid-map.json' })
  .option('network', { type: 'string', default: process.env.XRPL_NETWORK || 'wss://s.altnet.rippletest.net:51233' })
  .option('limit', { type: 'number', default: 0 })
  .help().argv;

function uriToHex(uri) { return Buffer.from(uri, 'utf8').toString('hex').toUpperCase(); }

(async () => {
  const cidMapPath = path.resolve(argv.cidMap);
  if (!await fs.pathExists(cidMapPath)) {
    console.error('Missing CID map at', cidMapPath);
    process.exit(1);
  }
  const map = await fs.readJson(cidMapPath);
  const seed = process.env.XRPL_SEED || process.env.XRPL_WALLET_SEED;
  if (!seed) { console.error('XRPL_SEED not set'); process.exit(1); }

  const client = new xrpl.Client(argv.network);
  await client.connect();
  const wallet = xrpl.Wallet.fromSeed(seed);
  console.log('Minter:', wallet.address);

  const transferFeeBps = parseInt(process.env.TRANSFER_FEE_BPS || '500', 10);
  const items = argv.limit > 0 ? map.items.slice(0, argv.limit) : map.items;
  const results = [];
  for (const it of items) {
    const tx = { TransactionType: 'NFTokenMint', Account: wallet.address, URI: uriToHex(it.metadata), Flags: 8, NFTokenTaxon: 0, TransferFee: transferFeeBps };
    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const resp = await client.submitAndWait(signed.tx_blob);
    const nftoken_id = resp.result?.meta?.nftoken_id;
    results.push({ id: it.id, metadata: it.metadata, nftoken_id, tx: resp.result.hash });
    console.log(`Minted #${it.id}: ${nftoken_id}`);
  }
  const outPath = path.join(path.dirname(cidMapPath), 'mint-results.json');
  await fs.writeJson(outPath, { network: argv.network, minter: wallet.address, results }, { spaces: 2 });
  await client.disconnect();
  console.log('✅ Mint complete. Wrote', outPath);
})();
