#!/usr/bin/env node
/**
 * Backfill missing nftoken_id values for Chapter VI token IDs (6001-6020).
 * Strategy:
 * 1. Load mint_results.json and retry_results.json to gather metadataUri per tokenId.
 * 2. Query XRPL account_nfts for the minter account.
 * 3. For each on-ledger NFT, fetch its metadata URI (by resolving the URI field; expect it to be the Pinata URL we stored).
 * 4. Match metadataUri to tokenId mapping; capture NFTokenID.
 * 5. Update SQLite DB (nfts table) setting nftoken_id where null.
 * 6. Output a summary of updates.
 */

const fs = require('fs');
const path = require('path');
const xrpl = require('xrpl');
const sqlite3 = require('sqlite3').verbose();

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const MINT_RESULTS = path.join(DATA_DIR, 'mint_results.json');
const RETRY_RESULTS = path.join(DATA_DIR, 'retry_results.json');
// Use the same sqlite file the API uses (database.sqlite)
const DB_PATH = path.join(ROOT, 'backend', 'database.sqlite');

const ACCOUNT = process.env.XRPL_ACCOUNT || 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH';
const NETWORK = process.env.XRPL_NETWORK || 'wss://s.altnet.rippletest.net:51233';

function loadJson(p) {
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

(async () => {
  const mint = loadJson(MINT_RESULTS);
  const retry = loadJson(RETRY_RESULTS);
  const combined = [...mint, ...retry];

  // Build map tokenId -> metadataUri from successful entries
  const tokenMeta = {};
  for (const entry of combined) {
    if (entry.metadataUri && !entry.failed) {
      tokenMeta[entry.tokenId] = entry.metadataUri;
    }
  }

  console.log('Collected metadata URIs for', Object.keys(tokenMeta).length, 'tokens');

  // Connect XRPL
  const client = new xrpl.Client(NETWORK);
  await client.connect();
  console.log('Connected to XRPL');

  // Paginate account_nfts
  let marker = undefined;
  const ledgerNFTs = [];
  do {
    const resp = await client.request({
      command: 'account_nfts',
      account: ACCOUNT,
      limit: 400,
      marker
    });
    ledgerNFTs.push(...resp.result.account_nfts);
    marker = resp.result.marker;
  } while (marker);
  console.log('Fetched', ledgerNFTs.length, 'on-ledger NFTs');

  // Map metadata URI -> NFTokenID from ledger objects
  // XRPL stores URI as hex. Need to decode.
  function hexToString(hex) {
    return Buffer.from(hex, 'hex').toString('utf8').replace(/\0+$/, '');
  }

  const uriToId = {};
  for (const nft of ledgerNFTs) {
    if (nft.URI) {
      try {
        const uri = hexToString(nft.URI);
        uriToId[uri] = nft.NFTokenID;
      } catch (e) {}
    }
  }

  // Prepare updates
  const updates = [];
  for (const [tokenIdStr, uri] of Object.entries(tokenMeta)) {
    const tokenId = Number(tokenIdStr);
    if (tokenId < 6001 || tokenId > 6020) continue;
    const chainId = uriToId[uri];
    if (chainId) {
      updates.push({ tokenId, nftoken_id: chainId });
    }
  }

  console.log('Matched', updates.length, 'token IDs to on-ledger NFTokenIDs');

  if (updates.length === 0) {
    console.log('No updates to apply.');
    await client.disconnect();
    return;
  }

  // Update DB
  const db = new sqlite3.Database(DB_PATH);
  const updateStmt = db.prepare('UPDATE nfts SET nftoken_id = ? WHERE token_id = ? AND (nftoken_id IS NULL OR nftoken_id = "")');

  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      for (const u of updates) {
        updateStmt.run(u.nftoken_id, u.tokenId);
      }
      db.run('COMMIT', (err) => (err ? reject(err) : resolve()));
    });
  });

  updateStmt.finalize();

  console.log('Database updated for', updates.length, 'tokens');

  db.close();
  await client.disconnect();

  // Write a report
  const reportPath = path.join(DATA_DIR, 'backfill_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), updates }, null, 2));
  console.log('Report written to', reportPath);
})();
