const path = require('path');
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: path.resolve(__dirname, 'database.sqlite') },
  useNullAsDefault: true
});

console.log('🧹 Purging Chapter V (Comic) entries from gallery...');

async function purge() {
  try {
    const before = await knex('nfts').count('token_id as c').first();
    const del = await knex('nfts')
      .where('chapter', 'V — Comic Legends of Seychelles')
      .orWhereBetween('token_id', [161, 180])
      .del();
    const after = await knex('nfts').count('token_id as c').first();

    console.log(`🗑️  Deleted ${del} rows.`);
    console.log(`📊 Total before: ${before.c}, after: ${after.c}`);
  } catch (err) {
    console.error('❌ Error purging Chapter V:', err.message);
  } finally {
    await knex.destroy();
  }
}

purge();
