const path = require('path');
const fs = require('fs/promises');
const db = require('./database/connection');
const { logger } = require('./utils/logger');

const FALLBACK_OWNER = 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH';
const REAL_NFTS_PATH = path.resolve(__dirname, 'real_nfts.json');

function normaliseTrait(attributes, traitName) {
  if (!Array.isArray(attributes)) return null;
  const match = attributes.find((attr) => {
    const key = String(attr?.trait_type || '').toLowerCase();
    return key === traitName.toLowerCase();
  });
  return match ? match.value : null;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

function parseTimestamp(value) {
  if (!value) return new Date();
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return new Date();
  }
  return dt;
}

function buildNftRowFromRealDataset(nft) {
  if (!nft || typeof nft !== 'object') {
    throw new Error('Encountered malformed NFT entry while building dataset.');
  }

  const attributes = Array.isArray(nft.attributes) ? nft.attributes : [];
  const chapter = nft.chapter || normaliseTrait(attributes, 'chapter') || 'Unknown Chapter';
  const island = nft.island || normaliseTrait(attributes, 'island') || 'Seychelles';
  const rarity = (nft.rarity || normaliseTrait(attributes, 'rarity') || 'common').toLowerCase();
  const owner = nft.owner_address || process.env.XRPL_ISSUER_ACCOUNT || FALLBACK_OWNER;
  const metadataUri = nft.metadata_uri || nft.metadata_url || nft.uri;
  const imageUri = nft.image_uri || nft.image_url || nft.image;

  if (!metadataUri) {
    throw new Error(`Missing metadata URI for NFT id ${nft.id}`);
  }
  if (!imageUri) {
    throw new Error(`Missing image URI for NFT id ${nft.id}`);
  }

  const createdAt = parseTimestamp(nft.created_at || nft.minted_at).toISOString();
  const updatedAt = parseTimestamp(nft.updated_at || nft.minted_at).toISOString();

  return {
    id: nft.id,
    token_id: nft.id,
    nftoken_id: nft.nftoken_id || nft.NFTokenID || null,
    name: nft.name || `NFT ${nft.id}`,
    description: nft.description || '',
    image_uri: imageUri,
    metadata_uri: metadataUri,
    chapter,
    island,
    rarity,
    attributes: JSON.stringify(attributes),
    clue_data: JSON.stringify({
      transaction_hash: nft.transaction_hash || null,
      minted_at: nft.minted_at || null,
      original_token_id: nft.token_id || null,
      status: nft.status || null,
      price: nft.price ?? null,
    }),
    current_owner: owner,
    price_xrp: nft.price ?? null,
    for_sale: Number(Boolean(nft.for_sale)),
    offer_id: nft.offer_id || null,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

async function backupExistingNfts(trx) {
  const existing = await trx('nfts').orderBy('token_id', 'asc');
  if (!existing.length) {
    return null;
  }
  const backupsDir = path.resolve(__dirname, '../backups');
  await fs.mkdir(backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupsDir, `nfts-backup-${stamp}.json`);
  await fs.writeFile(backupPath, JSON.stringify(existing, null, 2), 'utf8');
  return backupPath;
}

async function updateCollectionStats(trx, count) {
  const hasStatsTable = await trx.schema.hasTable('collection_stats');
  if (!hasStatsTable) {
    logger.warn('⚠️ Skipping collection_stats update — table not found.');
    return;
  }
  const now = new Date().toISOString();
  const updateResult = await trx('collection_stats').update({
    total_nfts: count,
    minted_nfts: count,
    listed_nfts: 0,
    floor_price_xrp: null,
    total_volume_xrp: 0,
    total_sales: 0,
    last_updated: now,
  });

  if (updateResult === 0) {
    await trx('collection_stats').insert({
      total_nfts: count,
      minted_nfts: count,
      listed_nfts: 0,
      floor_price_xrp: null,
      total_volume_xrp: 0,
      total_sales: 0,
      last_updated: now,
    });
  }
}

async function loadRealCollection() {
  if (!(await fileExists(REAL_NFTS_PATH))) {
    throw new Error('Expected real_nfts.json to exist under backend but it was not found.');
  }

  const raw = await fs.readFile(REAL_NFTS_PATH, 'utf8');
  const dataset = JSON.parse(raw);

  if (!Array.isArray(dataset) || dataset.length === 0) {
    throw new Error('real_nfts.json does not contain any NFT entries to sync.');
  }

  return dataset
    .filter((item) => item && typeof item.id === 'number')
    .sort((a, b) => a.id - b.id)
    .map(buildNftRowFromRealDataset);
}

async function main() {
  const collection = await loadRealCollection();

  await db.transaction(async (trx) => {
    const backupPath = await backupExistingNfts(trx);
    if (backupPath) {
      logger.info(`💾 Backed up existing NFTs to ${backupPath}`);
    } else {
      logger.info('💾 No existing NFTs found, skipping backup.');
    }

    const hasOffers = await trx.schema.hasTable('offers');
    if (hasOffers) {
      await trx('offers').del();
    }
    await trx('nfts').del();
    logger.info('🧹 Cleared existing gallery entries.');

    for (const row of collection) {
      await trx('nfts').insert(row);
      logger.info(`✅ Inserted NFT #${row.token_id} (${row.name})`);
    }

    await updateCollectionStats(trx, collection.length);
    logger.info(`📊 Updated collection stats for ${collection.length} NFTs.`);
  });

  logger.info('🏁 Resync complete. Gallery now reflects real minted NFTs.');
}

main()
  .then(async () => {
    await db.destroy();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Failed to resync real NFTs:', error);
    await db.destroy();
    process.exit(1);
  });
