const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, './database.sqlite');
const META_DIR = path.resolve(__dirname, '../scripts/dist/metadata');

function readMeta(tokenId) {
  const p = path.join(META_DIR, `${tokenId}.json`);
  if (!fs.existsSync(p)) throw new Error(`Missing metadata file: ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function getAttr(meta, key) {
  const f = meta.attributes?.find(a => a.trait_type === key);
  return f ? f.value : null;
}

async function main() {
  console.log('🔧 Updating Chapter 3 (121–140) from dist/metadata...');
  const db = new sqlite3.Database(DB_PATH);

  const stmt = db.prepare(`
    UPDATE nfts SET 
      name = ?,
      description = ?,
      image_uri = ?,
      metadata_uri = ?,
      chapter = ?,
      island = ?,
      rarity = ?,
      attributes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE token_id = ?
  `);

  await new Promise((resolve, reject) => {
    let done = 0;
    for (let tokenId = 121; tokenId <= 140; tokenId++) {
      try {
        const meta = readMeta(tokenId);
        const chapterName = getAttr(meta, 'Chapter') || 'Chapter 3 — The Landing at Anse Gaulette';
        const rarity = getAttr(meta, 'Rarity') || 'Rare';
        const location = getAttr(meta, 'Location') || 'Seychelles';

        stmt.run([
          meta.name,
          meta.description,
          `/real/images/${tokenId}.png`,
          `local-metadata://${tokenId}`,
          chapterName,
          location,
          rarity,
          JSON.stringify(meta.attributes),
          tokenId
        ], (err) => {
          if (err) {
            console.error(`❌ Update failed for ${tokenId}:`, err.message);
          } else {
            console.log(`✅ Updated DB for token ${tokenId}: ${meta.name}`);
          }
          done++;
          if (done === 20) {
            stmt.finalize((e) => e ? reject(e) : resolve());
          }
        });
      } catch (e) {
        console.error(`❌ ${e.message}`);
        done++;
        if (done === 20) {
          stmt.finalize((err) => err ? reject(err) : resolve());
        }
      }
    }
  });

  db.close();
  console.log('🎯 Chapter 3 metadata sync complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
