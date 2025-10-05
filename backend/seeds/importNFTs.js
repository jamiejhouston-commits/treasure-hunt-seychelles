const fs = require('fs');
const path = require('path');
const db = require('../database/connection');

function pickTrait(attributes, traitType) {
  try {
    const arr = Array.isArray(attributes) ? attributes : [];
    const hit = arr.find((t) => (t.trait_type || t.type) === traitType);
    return hit ? hit.value : null;
  } catch {
    return null;
  }
}

async function importNFTs() {
  const jsonPath = path.resolve(__dirname, '..', 'real_nfts.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Cannot find real_nfts.json at', jsonPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const items = JSON.parse(raw);
  console.log(`📦 Importing ${items.length} NFTs from real_nfts.json ...`);

  const trx = await db.transaction();
  try {
    // Clear table
    await trx('nfts').del();

    let inserted = 0;
    for (const it of items) {
      const id = Number(it.id);
      const tokenId = Number.isFinite(Number(it.token_id)) ? Number(it.token_id) : id;
      const chapter = it.chapter || pickTrait(it.attributes, 'Chapter') || 'Mahé Manuscripts';
      const island = it.island || pickTrait(it.attributes, 'Island') || 'Mahé';
      const rarity = (it.rarity || pickTrait(it.attributes, 'Rarity') || 'common').toString().toLowerCase();
      const attrs = Array.isArray(it.attributes) ? it.attributes : [];
      const now = new Date().toISOString();

      const row = {
        id, // keep sequence aligned to asset id
        token_id: tokenId,
        nftoken_id: it.nftoken_id || null,
        name: it.name || `Fragment #${String(id).padStart(3, '0')}`,
        description: it.description || '',
        image_uri: it.image_uri || it.image_url || `/real/images/${id}.png`,
        metadata_uri: it.metadata_uri || it.metadata_url || `/minted/${id}.json`,
        chapter,
        island,
        rarity,
        attributes: JSON.stringify(attrs),
        clue_data: JSON.stringify(it.clue_data || {}),
        current_owner: it.owner_address || null,
        price_xrp: it.price ?? null,
        for_sale: 0,
        offer_id: null,
        created_at: it.created_at || now,
        updated_at: it.updated_at || now
      };

      await trx('nfts').insert(row);
      inserted++;
    }

    await trx.commit();
    console.log(`✅ Imported ${inserted} NFTs into database`);
    process.exit(0);
  } catch (e) {
    await trx.rollback();
    console.error('💥 Import failed:', e.message);
    process.exit(1);
  }
}

if (require.main === module) {
  importNFTs();
}

module.exports = { importNFTs };
