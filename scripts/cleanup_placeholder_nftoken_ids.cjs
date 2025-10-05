#!/usr/bin/env node
/**
 * cleanup_placeholder_nftoken_ids.cjs
 *
 * Purpose:
 *   Remove placeholder / fake nftoken_id values (e.g., TEMP_*, MINTED_CH6_*, ch4_*)
 *   leaving only real XRPL NFToken IDs (64 hex chars) and normalizing any with embedded whitespace.
 *
 * XRPL NFToken ID format: 64 hex characters. We treat any value that, after stripping whitespace, does not match /^[0-9A-Fa-f]{64}$/ as invalid.
 *
 * Actions:
 *   - For any row with nftoken_id NULL: untouched.
 *   - For rows where sanitized nftoken_id (remove all whitespace) matches 64 hex: update to sanitized (strip whitespace) if changed.
 *   - For rows where nftoken_id matches known placeholder patterns (TEMP_*, MINTED_CH6_*, ch4_*, ch5_* etc) OR fails validation: set nftoken_id = NULL.
 *
 * Safety:
 *   - Creates a JSON backup of affected rows before modification: backups/nftoken_id_cleanup_<timestamp>.json
 *   - Summarizes counts.
 */

const fs = require('fs');
const path = require('path');
const db = require('../backend/database/connection');

const PLACEHOLDER_PATTERNS = [
  /^TEMP_/i,
  /^MINTED_CH6_/i,
  /^ch4_/i,
  /^ch5_/i,
  /^ch6_/i
];

function sanitize(id) {
  if (!id) return id;
  return id.replace(/\s+/g, '');
}

function isHex64(id) {
  return /^[0-9A-Fa-f]{64}$/.test(id);
}

function isPlaceholder(id) {
  return PLACEHOLDER_PATTERNS.some(rx => rx.test(id));
}

(async () => {
  const start = Date.now();
  const rows = await db('nfts').select('id','token_id','nftoken_id');
  const affected = [];
  let toNull = 0, toSanitize = 0;

  for (const r of rows) {
    if (!r.nftoken_id) continue;
    const original = r.nftoken_id;
    const trimmed = sanitize(original);
    const placeholder = isPlaceholder(original) || isPlaceholder(trimmed);
    const valid = isHex64(trimmed);
    if (placeholder || !valid) {
      // Null it out if it's not a valid 64-hex ID.
      affected.push({ action: 'NULL', id: r.id, token_id: r.token_id, original });
      toNull++;
    } else if (original !== trimmed) {
      affected.push({ action: 'SANITIZE', id: r.id, token_id: r.token_id, original, sanitized: trimmed });
      toSanitize++;
    }
  }

  if (!affected.length) {
    console.log('No placeholder or malformed nftoken_id values found. Nothing to do.');
    await db.destroy();
    return;
  }

  // Backup before changes
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `nftoken_id_cleanup_${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(backupPath, JSON.stringify({ generatedAt: new Date().toISOString(), affected }, null, 2));
  console.log(`Backup written: ${backupPath}`);

  // Execute updates in a transaction
  await db.transaction(async trx => {
    for (const a of affected) {
      if (a.action === 'NULL') {
        await trx('nfts').where('id', a.id).update({ nftoken_id: null });
      } else if (a.action === 'SANITIZE') {
        await trx('nfts').where('id', a.id).update({ nftoken_id: a.sanitized });
      }
    }
  });

  const durationMs = Date.now() - start;
  console.log(JSON.stringify({ summary: { scanned: rows.length, updated: affected.length, nulled: toNull, sanitized: toSanitize, durationMs }}, null, 2));

  await db.destroy();
})();
