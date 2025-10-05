const fs = require('fs');
const path = require('path');
const db = require('./database/connection');

async function loadS3Metadata() {
  const dir = path.resolve(__dirname, '../scripts/dist/metadata/s3');
  const result = [];
  for (let i = 1; i <= 20; i++) {
    const code = `S3-${String(i).padStart(2, '0')}`;
    const file = path.join(dir, `${code}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`⚠️ Missing metadata for ${code}`);
      continue;
    }
    try {
      const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
      result.push({ code, meta, index: i });
    } catch (e) {
      console.error(`❌ Failed to parse ${code}.json:`, e.message);
    }
  }
  return result;
}

function normalizeRarity(attrs) {
  const r = (attrs || []).find(a => a.trait_type === 'Rarity')?.value || 'Common';
  return String(r).toLowerCase();
}

async function importS3() {
  console.log('🏴‍☠️ Importing S3 minted set into gallery (IDs 141–160)');
  const items = await loadS3Metadata();
  if (items.length === 0) {
    console.error('❌ No S3 metadata found. Aborting.');
    process.exit(1);
  }

  // Prepare rows
  const rows = items.map(({ code, meta, index }) => {
    const id = 140 + index; // 141..160
    return {
      id,
      token_id: id,
      name: meta.name || code,
      description: meta.description || '',
      image_uri: `/preview/chapter3/${code}.png`,
      metadata_uri: `/minted/${id}.json`,
      chapter: 'Series 3 — The Pirate’s Trail',
      island: (meta.attributes || []).find(a => a.trait_type === 'Place')?.value?.split('(')?.pop()?.replace(')', '') || null,
      rarity: normalizeRarity(meta.attributes),
      attributes: JSON.stringify(meta.attributes || []),
      clue_data: JSON.stringify({
        series: 'S3',
        code,
        card_number: index,
      }),
      current_owner: 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH', // placeholder owner to mark as minted
      price_xrp: null,
      for_sale: 0,
      offer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  try {
    // Upsert behavior: delete any existing IDs 141..160, then insert fresh
    await db('nfts').whereBetween('id', [141, 160]).del();
    let inserted = 0;
    for (const r of rows) {
      await db('nfts').insert(r);
      inserted++;
      console.log(`✅ Inserted ${r.name} (ID ${r.id})`);
    }

    const total = await db('nfts').count('* as c').first();
    console.log(`\n📊 Done. Inserted ${inserted} S3 NFTs. Total in DB: ${total.c}`);
    process.exit(0);
  } catch (e) {
    console.error('💥 Error importing S3:', e);
    process.exit(1);
  }
}

importS3();
