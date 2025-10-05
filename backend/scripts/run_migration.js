const db = require('../database/connection');

async function runMigration() {
  try {
    console.log('Running migration...');
    await db.migrate.latest();
    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
