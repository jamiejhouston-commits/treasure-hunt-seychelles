const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Check what tables exist
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('📊 Tables in database:', tables.map(t => t.name));

// Check nfts table schema if it exists
try {
  const schema = db.prepare("PRAGMA table_info(nfts)").all();
  console.log('📋 NFTs table schema:', schema);
} catch (e) {
  console.log('❌ No nfts table found');
}

db.close();