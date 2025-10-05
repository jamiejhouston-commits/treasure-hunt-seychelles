const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
  // Create the table
  db.exec(`
    CREATE TABLE IF NOT EXISTS nfts (
      id INTEGER PRIMARY KEY,
      token_id INTEGER UNIQUE NOT NULL,
      nftoken_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      image_uri TEXT NOT NULL,
      metadata_uri TEXT NOT NULL,
      chapter TEXT NOT NULL,
      island TEXT NOT NULL,
      rarity TEXT NOT NULL,
      attributes TEXT,
      clue_data TEXT,
      current_owner TEXT,
      price_xrp REAL,
      for_sale INTEGER DEFAULT 0,
      offer_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Table created successfully');
  
  // Check tables again
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📊 Tables now:', tables.map(t => t.name));
  
} catch (error) {
  console.log('❌ Error:', error.message);
}

db.close();