const path = require('path');
const fs = require('fs/promises');
const db = require('./database/connection');

async function main() {
  const mintResultsPath = path.resolve(__dirname, '../scripts/out/cids/mint-results.json');
  const cidMapPath = path.resolve(__dirname, '../scripts/out/cids/cid-map.json');

  const [mintResultsRaw, cidMapRaw] = await Promise.all([
    fs.readFile(mintResultsPath, 'utf8'),
    fs.readFile(cidMapPath, 'utf8')
  ]);

  let mintResults;
  let cidMap;

  try {
    mintResults = JSON.parse(mintResultsRaw);
  } catch (error) {
    throw new Error(`Failed to parse mint-results.json: ${error.message}`);
  }

  try {
    cidMap = JSON.parse(cidMapRaw);
  } catch (error) {
    throw new Error(`Failed to parse cid-map.json: ${error.message}`);
  }

  if (!Array.isArray(mintResults.results)) {
    throw new Error('mint-results.json is missing the "results" array');
  }
  if (!Array.isArray(cidMap.items)) {
    throw new Error('cid-map.json is missing the "items" array');
  }

  const imageById = new Map(cidMap.items.map((item) => [Number(item.id), item.image]));
  const metadataById = new Map(mintResults.results.map((item) => [Number(item.id), item.metadata]));
  const nftokenById = new Map(mintResults.results.map((item) => [Number(item.id), item.nftoken_id]));

  const ownerAddress = mintResults.minter || null;
  const updated = [];

  for (const tokenId of Array.from(nftokenById.keys()).sort((a, b) => a - b)) {
    const nftokenId = nftokenById.get(tokenId);
    const metadataUri = metadataById.get(tokenId);
    const imageUri = imageById.get(tokenId) || `/real/images/${tokenId}.png`;

    const changes = {
      nftoken_id: nftokenId,
      metadata_uri: metadataUri,
      image_uri: imageUri,
      current_owner: ownerAddress,
      updated_at: db.fn.now()
    };

    const rows = await db('nfts').where({ token_id: tokenId }).update(changes);
    if (rows === 0) {
      console.warn(`⚠️  Token ${tokenId} not found in database, skipped.`);
      continue;
    }
    updated.push({ tokenId, nftokenId, metadataUri, imageUri });
    console.log(`✅ Synced token ${tokenId} → ${nftokenId}`);
  }

  console.log(`\n🎯 Updated ${updated.length} Chapter III NFTs in gallery.`);
  if (ownerAddress) {
    console.log(`🪪 Current owner set to ${ownerAddress}`);
  }
}

main()
  .catch((error) => {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  })
  .finally(() => db.destroy());
