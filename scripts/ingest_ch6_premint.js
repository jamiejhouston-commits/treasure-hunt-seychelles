// Ingest Chapter VI Pre-Mint card metadata into the shared SQLite DB
// Each card JSON lives beside its PNG in content/ch6/output/*.json (same basename as image)
// We store them in nfts table with synthetic token_id range (6001+cardId) to avoid collision.
// Fields required by schema but not relevant yet (rarity, island, price_xrp, etc.) receive placeholder values.

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import module from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve better-sqlite3 from backend node_modules (since dependency lives there)
const requireBackend = module.createRequire(path.resolve(__dirname,'../backend/package.json'));
const Database = requireBackend('better-sqlite3');

const OUTPUT_DIR = path.resolve(__dirname, '../content/ch6/output');
const DB_PATH = path.resolve(__dirname, '../backend/database.sqlite');

// Token ID strategy: reserve 6001-6020 for Chapter VI premint cards (not on-chain yet)
const TOKEN_OFFSET = 6000;

function loadMetadataFiles() {
  if (!fs.existsSync(OUTPUT_DIR)) throw new Error('Output directory does not exist: ' + OUTPUT_DIR);
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => ({ file: f, full: path.join(OUTPUT_DIR, f) }));
}

function main() {
  console.log('🔎 Scanning Chapter VI premint metadata...');
  const metas = loadMetadataFiles();
  if (!metas.length) {
    console.log('No metadata files found. Run generate_ch6_premint.js first.');
    return;
  }
  const db = new Database(DB_PATH);
  console.log('💾 Connected to DB:', DB_PATH);

  const insert = db.prepare(`INSERT OR REPLACE INTO nfts (
    token_id, nftoken_id, name, description, image_uri, metadata_uri, chapter, island, rarity, attributes, clue_data, current_owner, price_xrp, for_sale, offer_id, created_at, updated_at
  ) VALUES (
    @token_id, @nftoken_id, @name, @description, @image_uri, @metadata_uri, @chapter, @island, @rarity, @attributes, @clue_data, @current_owner, @price_xrp, @for_sale, @offer_id, COALESCE(@created_at, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP
  )`);

  const now = new Date().toISOString();
  let count = 0;
  for (const m of metas) {
    const data = fs.readJsonSync(m.full);
    // Derive cardId: prefer explicit field; else extract digits from filename like ch6_012.json
    let cardIdRaw = data.cardId || data.card_id;
    if (typeof cardIdRaw === 'string') {
      const matchMeta = cardIdRaw.match(/(\d{3})$/);
      if (matchMeta) cardIdRaw = parseInt(matchMeta[1],10); else cardIdRaw = NaN;
    }
    if (!cardIdRaw || isNaN(cardIdRaw)) {
      const matchFile = path.basename(m.file).match(/ch6_(\d{3})/i);
      if (matchFile) cardIdRaw = parseInt(matchFile[1], 10); else cardIdRaw = NaN;
    }
    const cardId = cardIdRaw;
    if (isNaN(cardId)) {
      console.warn('Skipping file with unresolvable cardId:', m.file);
      continue;
    }
    const token_id = TOKEN_OFFSET + cardId;
    // Prefer padded filename ch6_###.png (matches concept + output convention). If absent, fallback to legacy {n}.png
    const padded = String(cardId).padStart(3,'0');
    const preferredImage = `ch6_${padded}.png`;
    const legacyImage = `${cardId}.png`;
    const preferredPath = path.join(OUTPUT_DIR, preferredImage);
    let imageFile;
    if (fs.existsSync(preferredPath)) {
      imageFile = preferredImage;
    } else if (fs.existsSync(path.join(OUTPUT_DIR, legacyImage))) {
      imageFile = legacyImage;
      console.warn(`⚠️ Using legacy image filename ${legacyImage} for card ${cardId}; consider renaming to ${preferredImage}`);
    } else {
      console.warn(`❌ No image found for card ${cardId} (looked for ${preferredImage} and ${legacyImage}) — skipping.`);
      continue;
    }
    // We serve images/metadata via /ch6_premint static route; metadata_uri relative path for future reference
    const record = {
      token_id,
      nftoken_id: null, // not minted yet
      name: data.name || `Chapter VI Card ${cardId}`,
      description: data.description || '',
  image_uri: `/ch6_premint/${imageFile}`,
      metadata_uri: `/ch6_premint/${m.file}`,
      chapter: 'VI',
      island: 'Mahe', // thematic anchor
      rarity: 'common', // uniform for puzzle cards pre-mint
      attributes: JSON.stringify(data.attributes || []),
      clue_data: JSON.stringify({
        bearingDeg: data.bearingDeg,
        cipherOutput: data.cipherOutput,
        cipherIndex: data.cipherIndex,
        hiddenClueFormula: data.hiddenClueFormula,
        collectionPhase: data.collectionPhase || 'premint'
      }),
      current_owner: null,
      price_xrp: null,
      for_sale: 0,
      offer_id: null,
      created_at: now,
      updated_at: now
    };
    insert.run(record);
    count++;
    console.log(`✓ Ingested Card ${cardId} -> token_id ${token_id}`);
  }

  console.log(`✅ Completed ingestion. Total cards ingested: ${count}`);
  db.close();
}

main();
