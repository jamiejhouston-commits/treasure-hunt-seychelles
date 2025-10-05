/**
 * Migration: Create rarity_claims table
 * Tracks users who claim prizes for collecting complete rarity sets
 */

exports.up = function(knex) {
  return knex.schema.createTable('rarity_claims', (table) => {
    table.increments('id').primary();
    table.string('wallet_address', 64).notNullable();
    table.string('chapter', 100).notNullable().defaultTo('Chapter 1');
    table.json('nft_token_ids').notNullable(); // Array of 4 NFT token IDs [common, uncommon, rare, epic]
    table.decimal('prize_amount', 10, 2).notNullable();
    table.integer('rank').notNullable(); // 1 = 1st place ($300), 2 = 2nd place ($150)
    table.string('tx_hash', 128); // Optional: payment transaction hash
    table.string('payment_status', 20).defaultTo('pending'); // pending, paid, rejected
    table.timestamp('claimed_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('paid_at');

    // Indexes
    table.index('wallet_address');
    table.index('chapter');
    table.index(['chapter', 'rank']);

    // Constraints
    table.unique(['wallet_address', 'chapter']); // One claim per wallet per chapter
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('rarity_claims');
};
