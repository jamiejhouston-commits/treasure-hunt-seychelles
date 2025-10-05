/**
 * Add treasure hunt support to database
 * Run this to add layer and rarity columns to existing nfts table
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🏴‍☠️ Adding treasure hunt columns to database...\n');

db.serialize(() => {
  // Add layers column
  db.run(`ALTER TABLE nfts ADD COLUMN layers TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding layers column:', err.message);
    } else if (!err) {
      console.log('✓ Added layers column');
    }
  });
  
  // Add puzzle_enabled column
  db.run(`ALTER TABLE nfts ADD COLUMN puzzle_enabled INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding puzzle_enabled column:', err.message);
    } else if (!err) {
      console.log('✓ Added puzzle_enabled column');
    }
  });
  
  // Add puzzle_layer column
  db.run(`ALTER TABLE nfts ADD COLUMN puzzle_layer INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding puzzle_layer column:', err.message);
    } else if (!err) {
      console.log('✓ Added puzzle_layer column');
    }
  });
  
  // Add art_rarity column
  db.run(`ALTER TABLE nfts ADD COLUMN art_rarity TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding art_rarity column:', err.message);
    } else if (!err) {
      console.log('✓ Added art_rarity column');
    }
  });
  
  // Add rarity_color column
  db.run(`ALTER TABLE nfts ADD COLUMN rarity_color TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding rarity_color column:', err.message);
    } else if (!err) {
      console.log('✓ Added rarity_color column');
    }
  });
  
  // Create puzzle_submissions table
  db.run(`
    CREATE TABLE IF NOT EXISTS puzzle_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter TEXT NOT NULL,
      answer TEXT NOT NULL,
      wallet_address TEXT,
      is_correct INTEGER DEFAULT 0,
      ip_address TEXT,
      user_agent TEXT,
      submitted_at TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating puzzle_submissions table:', err.message);
    } else {
      console.log('✓ Created puzzle_submissions table');
    }
  });
  
  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_puzzle_chapter ON puzzle_submissions(chapter)`, (err) => {
    if (err) {
      console.error('Error creating index:', err.message);
    } else {
      console.log('✓ Created puzzle indexes');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('\n❌ Database error:', err.message);
    process.exit(1);
  }
  console.log('\n✅ Database updated successfully!');
  console.log('Ready for treasure hunt NFTs.\n');
});
