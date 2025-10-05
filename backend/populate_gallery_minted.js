/**
 * Populate ONLY the minted gallery with the user-specified chapters:
 *  - Chapter 1: token IDs 1-100 (100 NFTs)
 *  - Chapter 3: token IDs 121-130 (10 NFTs)  (per user instruction)
 *  - Chapter IV: token IDs 141-160 (20 NFTs)
 *  - Chapter VI: token IDs 181-200 (20 NFTs) ("last 20 minted")
 *
 * Excluded / left empty:
 *  - 101-120 (Chapter 2)
 *  - 131-140 (gap / reserved)
 *  - 161-180 (gap / reserved)
 *  - Any other chapters (V, specials, etc.)
 *
 * Every inserted NFT is considered minted by providing a non-null nftoken_id and
 * assigning the specified wallet as current_owner.
 */
const fs = require('fs');
const path = require('path');
const db = require('./database/connection');
const WALLET = 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH';

async function backupIfAny() {
  const existing = await db('nfts').select('token_id').limit(1);
  if (!existing.length) return null;
  const all = await db('nfts').orderBy('token_id');
  const backupsDir = path.resolve(__dirname, '../backups');
  fs.mkdirSync(backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(backupsDir, `nfts-backup-minted-gallery-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(all, null, 2), 'utf8');
  return file;
}

function baseRow({ token_id, chapter, name, description, image_uri, metadata_uri, rarity = 'common', attributes = [], clue = {} , nftoken_id }) {
  return {
    token_id,
    nftoken_id,
    name,
    description,
    image_uri,
    metadata_uri,
    chapter,
    island: 'Seychelles',
    rarity: rarity.toLowerCase(),
    attributes: JSON.stringify(attributes),
    clue_data: JSON.stringify(clue),
    current_owner: WALLET,
    price_xrp: null,
    for_sale: 0,
    offer_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function buildChapter1() {
  const rows = [];
  for (let id = 1; id <= 100; id++) {
    rows.push(baseRow({
      token_id: id,
      chapter: 'Chapter 1',
      name: `Chapter 1 Artifact #${String(id).padStart(3,'0')}`,
      description: `Chapter 1 minted artifact ${id}.`,
      image_uri: `ipfs://placeholder/ch1/${id}.png`,
      metadata_uri: `/metadata/ch1/${id}.json`,
      rarity: 'common',
      attributes: [
        { trait_type: 'Chapter', value: '1' },
        { trait_type: 'Index', value: id }
      ],
      nftoken_id: `ch1_${String(id).padStart(3,'0')}`
    }));
  }
  return rows;
}

function buildChapter3() {
  const rows = [];
  for (let i = 0; i < 10; i++) {
    const tokenId = 121 + i; // 121-130 inclusive
    rows.push(baseRow({
      token_id: tokenId,
      chapter: 'Chapter 3',
      name: `Chapter 3 Relic #${String(i+1).padStart(2,'0')}`,
      description: `Chapter 3 minted relic ${i+1}.`,
      image_uri: `ipfs://placeholder/ch3/${i+1}.png`,
      metadata_uri: `/metadata/ch3/${i+1}.json`,
      rarity: 'uncommon',
      attributes: [
        { trait_type: 'Chapter', value: '3' },
        { trait_type: 'Relic', value: i+1 }
      ],
      nftoken_id: `ch3_${String(i+1).padStart(3,'0')}`
    }));
  }
  return rows;
}

function buildChapter4() {
  const rows = [];
  for (let i = 0; i < 20; i++) {
    const tokenId = 141 + i; // 141-160
    rows.push(baseRow({
      token_id: tokenId,
      chapter: 'Chapter IV',
      name: `Chapter IV Chronicle #${String(i+1).padStart(2,'0')}`,
      description: `Chapter IV minted chronicle ${i+1}.`,
      image_uri: `ipfs://placeholder/ch4/${i+1}.png`,
      metadata_uri: `/metadata/ch4/${i+1}.json`,
      rarity: i % 5 === 0 ? 'epic' : 'rare',
      attributes: [
        { trait_type: 'Chapter', value: 'IV' },
        { trait_type: 'Chronicle', value: i+1 }
      ],
      nftoken_id: `ch4_${String(i+1).padStart(3,'0')}`
    }));
  }
  return rows;
}

function buildChapter6() {
  const baseDir = path.resolve(__dirname, '../content/ch6/output');
  let files = [];
  try {
    files = fs.readdirSync(baseDir).filter(f => f.endsWith('.json')).sort();
  } catch (e) {
    console.warn('⚠️ Chapter 6 output directory missing or unreadable; using placeholders.');
  }
  const rows = [];
  const startToken = 181; // 181-200
  for (let i = 0; i < 20; i++) {
    const tokenId = startToken + i;
    let meta = null;
    if (files[i]) {
      try {
        meta = JSON.parse(fs.readFileSync(path.join(baseDir, files[i]), 'utf8'));
      } catch (e) {
        console.warn('Failed to read Chapter 6 meta', files[i], e.message);
      }
    }
    const name = meta?.name || `Chapter VI Cipher #${String(i+1).padStart(2,'0')}`;
    const description = meta?.description || `Chapter VI minted cipher card ${i+1}.`;
    const attributes = Array.isArray(meta?.attributes) ? meta.attributes : [
      { trait_type: 'Chapter', value: 'VI' },
      { trait_type: 'Index', value: i+1 }
    ];
    rows.push(baseRow({
      token_id: tokenId,
      chapter: 'Chapter VI',
      name,
      description,
      image_uri: meta?.image ? `/ch6/images/${meta.image.replace('./','')}` : `ipfs://placeholder/ch6/${i+1}.png`,
      metadata_uri: `/ch6/metadata/${files[i] || `ch6_${String(i+1).padStart(3,'0')}.json`}`,
      rarity: 'legendary',
      attributes,
      clue: meta ? {
        bearingDeg: meta.bearingDeg ?? null,
        cipherOutput: meta.cipherOutput ?? null,
        cipherIndex: meta.cipherIndex ?? null
      } : {},
      nftoken_id: `ch6_${String(i+1).padStart(3,'0')}`
    }));
  }
  return rows;
}

async function main() {
  console.log('🏁 Populating minted gallery with selected chapters only...');
  const backup = await backupIfAny();
  if (backup) console.log('💾 Backed up previous data to', backup);

  await db('nfts').del();
  console.log('🧹 Cleared nfts table.');

  const chapters = [
    buildChapter1(),
    buildChapter3(),
    buildChapter4(),
    buildChapter6()
  ];
  const flat = chapters.flat();

  for (const row of flat) {
    await db('nfts').insert(row);
  }
  console.log(`✅ Inserted ${flat.length} NFTs (expected 150).`);

  const mintedCount = await db('nfts').whereNotNull('nftoken_id').count('* as c').first();
  console.log('📊 Minted count:', mintedCount.c);

  const ranges = await db('nfts').select('token_id').orderBy('token_id');
  console.log('First token:', ranges[0]?.token_id, 'Last token:', ranges[ranges.length-1]?.token_id);
}

main().then(()=>db.destroy()).catch(err=>{console.error('❌ Failed:', err); db.destroy(); process.exit(1);});
