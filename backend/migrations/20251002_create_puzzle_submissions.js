/**
 * Migration: Create puzzle_submissions table
 * Tracks user submissions for treasure hunt puzzles
 */

exports.up = function(knex) {
  return knex.schema.createTable('puzzle_submissions', function(table) {
    table.increments('id').primary();
    table.string('chapter', 50).notNullable().comment('Puzzle chapter identifier');
    table.text('answer').notNullable().comment('Submitted answer');
    table.string('wallet_address', 100).nullable().comment('User wallet address if provided');
    table.boolean('is_correct').defaultTo(false).comment('Whether answer was correct');
    table.string('ip_address', 45).nullable().comment('Submitter IP address');
    table.text('user_agent').nullable().comment('Browser user agent');
    table.timestamp('submitted_at').notNullable().comment('Submission timestamp');
    
    table.index('chapter');
    table.index('is_correct');
    table.index(['chapter', 'wallet_address']);
    table.index('submitted_at');
  }).then(() => {
    console.log('✓ Created puzzle_submissions table');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('puzzle_submissions');
};
