const db = require('../database/connection');

async function setupDatabase() {
  console.log('🏗️  Setting up Treasure of Seychelles database...');

  try {
    // NFTs table
    await db.schema.createTable('nfts', (table) => {
      table.increments('id').primary();
      table.integer('token_id').unique().notNullable();
      table.string('nftoken_id', 64).unique();
      table.string('name').notNullable();
      table.text('description');
      table.string('image_uri').notNullable();
      table.string('metadata_uri').notNullable();
      table.string('chapter').notNullable();
      table.string('island').notNullable();
      table.string('rarity').notNullable();
      table.json('attributes');
      table.json('clue_data');
      table.string('current_owner', 34);
      table.decimal('price_xrp', 10, 6);
      table.boolean('for_sale').defaultTo(false);
      table.string('offer_id', 64);
      table.timestamps(true, true);
      
      table.index(['token_id']);
      table.index(['nftoken_id']);
      table.index(['current_owner']);
      table.index(['chapter']);
      table.index(['rarity']);
      table.index(['for_sale']);
    });

    // Offers table
    await db.schema.createTable('offers', (table) => {
      table.increments('id').primary();
      table.string('offer_id', 64).unique().notNullable();
      table.integer('nft_token_id').notNullable();
      table.string('nftoken_id', 64).notNullable();
      table.string('seller_account', 34).notNullable();
      table.string('buyer_account', 34);
      table.decimal('price_xrp', 10, 6).notNullable();
      table.string('status').defaultTo('active'); // active, accepted, cancelled, expired
      table.string('transaction_hash', 64);
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('expires_at');
      table.timestamp('accepted_at');
      
      table.foreign('nft_token_id').references('token_id').inTable('nfts');
      table.index(['offer_id']);
      table.index(['seller_account']);
      table.index(['buyer_account']);
      table.index(['status']);
    });

    // Puzzle submissions table
    await db.schema.createTable('puzzle_submissions', (table) => {
      table.increments('id').primary();
      table.string('submission_id', 64).unique().notNullable();
      table.string('submitter_account', 34).notNullable();
      table.text('solution_data').notNullable();
      table.json('clue_references'); // Array of NFT token IDs used
      table.string('verification_hash', 64);
      table.boolean('is_correct').defaultTo(false);
      table.string('status').defaultTo('pending'); // pending, verified, rejected
      table.string('treasure_nft_id', 64);
      table.text('admin_notes');
      table.timestamps(true, true);
      
      table.index(['submitter_account']);
      table.index(['is_correct']);
      table.index(['status']);
    });

    // Collection stats table
    await db.schema.createTable('collection_stats', (table) => {
      table.increments('id').primary();
      table.integer('total_nfts').defaultTo(1000);
      table.integer('minted_nfts').defaultTo(0);
      table.integer('listed_nfts').defaultTo(0);
      table.decimal('floor_price_xrp', 10, 6);
      table.decimal('total_volume_xrp', 15, 6).defaultTo(0);
      table.integer('total_sales').defaultTo(0);
      table.boolean('puzzle_solved').defaultTo(false);
      table.string('treasure_winner_account', 34);
      table.timestamp('last_updated').defaultTo(db.fn.now());
      
      table.index(['last_updated']);
    });

    // Admin users table
    await db.schema.createTable('admin_users', (table) => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
      table.string('role').defaultTo('admin'); // admin, moderator
      table.json('permissions');
      table.string('api_key', 64).unique();
      table.boolean('active').defaultTo(true);
      table.timestamp('last_login');
      table.timestamps(true, true);
      
      table.index(['username']);
      table.index(['email']);
      table.index(['api_key']);
    });

    // Transaction logs table
    await db.schema.createTable('transaction_logs', (table) => {
      table.increments('id').primary();
      table.string('transaction_hash', 64).notNullable();
      table.string('transaction_type').notNullable(); // mint, offer_create, offer_accept, transfer
      table.string('account', 34).notNullable();
      table.string('nftoken_id', 64);
      table.integer('nft_token_id');
      table.json('transaction_data');
      table.string('status').notNullable(); // success, failed, pending
      table.decimal('fee_xrp', 10, 6);
      table.timestamp('created_at').defaultTo(db.fn.now());
      
      table.index(['transaction_hash']);
      table.index(['transaction_type']);
      table.index(['account']);
      table.index(['status']);
    });

    // Initialize collection stats
    await db('collection_stats').insert({
      total_nfts: 1000,
      minted_nfts: 0,
      listed_nfts: 0,
      floor_price_xrp: 400.0,
      total_volume_xrp: 0,
      total_sales: 0,
      puzzle_solved: false
    });

    console.log('✅ Database tables created successfully');
    
    // Create indexes for performance
    await db.raw('CREATE INDEX IF NOT EXISTS idx_nfts_composite ON nfts(chapter, rarity, for_sale)');
    await db.raw('CREATE INDEX IF NOT EXISTS idx_offers_composite ON offers(status, created_at)');
    
    console.log('✅ Database indexes created successfully');
    console.log('📊 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Database migration complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = setupDatabase;