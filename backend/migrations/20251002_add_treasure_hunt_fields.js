/**
 * Migration: Add treasure hunt fields to nfts table
 * Adds support for layered NFTs, art rarity, and puzzle configuration
 */

exports.up = function(knex) {
  return knex.schema.table('nfts', function(table) {
    // Add layers JSON column for multi-layer NFTs
    table.json('layers').nullable().comment('JSON array of layer metadata for puzzle NFTs');
    
    // Add puzzle configuration
    table.boolean('puzzle_enabled').defaultTo(false).comment('Whether this NFT contains puzzle clues');
    table.integer('puzzle_layer').nullable().comment('Which layer contains the puzzle (1-3)');
    
    // Art rarity system (independent of puzzle)
    table.string('art_rarity', 20).nullable().comment('Art rarity tier: Common/Uncommon/Rare/Epic');
    table.string('rarity_color', 7).nullable().comment('Hex color code for rarity badge');
  }).then(() => {
    console.log('✓ Added treasure hunt columns to nfts table');
  });
};

exports.down = function(knex) {
  return knex.schema.table('nfts', function(table) {
    table.dropColumn('layers');
    table.dropColumn('puzzle_enabled');
    table.dropColumn('puzzle_layer');
    table.dropColumn('art_rarity');
    table.dropColumn('rarity_color');
  });
};
