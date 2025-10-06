// Setup script to add Chapter 1 & 2 NFTs to live database
const db = require('better-sqlite3')('database.sqlite');

console.log('Setting up live database with Chapter 1 & 2 NFTs...');

// Run Chapter 1 setup
console.log('Adding Chapter 1 NFTs...');
require('./add_chapter1_nfts.js');

// Run Chapter 2 setup
console.log('Adding Chapter 2 NFTs...');
require('./add_chapter2_to_gallery.js');

console.log('✅ Database setup complete! 40 NFTs added.');
