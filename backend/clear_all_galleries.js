// CLEAR ALL GALLERIES - DELETE EVERYTHING
const Database = require('better-sqlite3');

console.log('🗑️ CLEARING ALL GALLERIES - DELETING EVERYTHING!');

const db = new Database('./database.sqlite');

const beforeCount = db.prepare('SELECT COUNT(*) as count FROM nfts').get().count;
console.log('NFTs before deletion:', beforeCount);

db.prepare('DELETE FROM nfts').run();

const afterCount = db.prepare('SELECT COUNT(*) as count FROM nfts').get().count;
console.log('NFTs after deletion:', afterCount);

console.log('✅ ALL GALLERIES CLEARED - EVERYTHING DELETED!');
console.log('💀 MISSION ACCOMPLISHED - ALL NFTs GONE!');

db.close();