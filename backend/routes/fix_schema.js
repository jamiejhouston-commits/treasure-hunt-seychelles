// Fix database schema - add missing columns
const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/fix-schema', async (req, res) => {
  try {
    console.log('🔧 Fixing database schema...');

    const tableInfo = await db.raw('PRAGMA table_info(nfts)');
    const existingColumns = tableInfo.map(col => col.name);
    const results = [];

    // Add missing columns one by one
    const columnsToAdd = [
      { name: 'art_rarity', type: 'TEXT' },
      { name: 'current_owner', type: 'TEXT' },
      { name: 'for_sale', type: 'BOOLEAN', default: false },
      { name: 'price_xrp', type: 'REAL', default: 0 },
      { name: 'puzzle_enabled', type: 'BOOLEAN', default: false },
      { name: 'layers', type: 'TEXT' }
    ];

    for (const col of columnsToAdd) {
      if (!existingColumns.includes(col.name)) {
        await db.raw(`ALTER TABLE nfts ADD COLUMN ${col.name} ${col.type}${col.default !== undefined ? ` DEFAULT ${col.default}` : ''}`);
        results.push(`✅ Added ${col.name} column`);
      } else {
        results.push(`⏭️ ${col.name} already exists`);
      }
    }

    res.json({
      success: true,
      message: '✅ Schema fixed',
      changes: results
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
