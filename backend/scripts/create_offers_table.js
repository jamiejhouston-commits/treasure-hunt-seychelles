const db = require('../database/connection');

async function createOffersTable() {
  try {
    console.log('Creating offers table...');

    const exists = await db.schema.hasTable('offers');
    if (exists) {
      console.log('⚠️  offers table already exists');
      process.exit(0);
    }

    await db.schema.createTable('offers', (table) => {
      table.increments('id').primary();

      // NFT being offered for
      table.integer('nft_token_id').notNullable();

      // Offer details
      table.string('from_wallet', 64).notNullable(); // Buyer making offer
      table.string('to_wallet', 64).notNullable(); // Current NFT owner

      // Offer type: 'xrp' (cash) or 'trade' (NFT swap)
      table.string('offer_type', 20).notNullable().defaultTo('xrp');

      // XRP amount offered (if offer_type = 'xrp' or mixed)
      table.decimal('xrp_amount', 10, 2).defaultTo(0);

      // Trade NFT offered (if offer_type = 'trade' or mixed)
      table.integer('trade_nft_token_id').nullable();

      // Status
      table.string('status', 20).notNullable().defaultTo('pending');
      // pending, accepted, declined, countered, expired, cancelled

      // Counter-offer chain
      table.integer('parent_offer_id').nullable(); // If this is a counter-offer

      // Optional message
      table.text('message').nullable();

      // Timestamps
      table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
      table.timestamp('expires_at').nullable(); // Optional expiration
      table.timestamp('responded_at').nullable(); // When accepted/declined

      // Indexes
      table.index('nft_token_id');
      table.index('from_wallet');
      table.index('to_wallet');
      table.index('status');
      table.index(['to_wallet', 'status']); // For "offers received"
      table.index(['from_wallet', 'status']); // For "offers sent"
    });

    console.log('✅ offers table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create offers table:', error);
    process.exit(1);
  }
}

createOffersTable();
