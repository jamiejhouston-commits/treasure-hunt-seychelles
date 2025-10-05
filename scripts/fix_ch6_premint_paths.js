// Fix Chapter VI premint image_uri values to match actual filenames ch6_XXX.png
const Database = require('../backend/node_modules/better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname,'../backend/database.sqlite');
const db = new Database(dbPath);
for(let i=1;i<=20;i++){
  const tokenId = 6000 + i;
  const padded = String(i).padStart(3,'0');
  const img = `/ch6_premint/ch6_${padded}.png`;
  db.prepare('UPDATE nfts SET image_uri=? WHERE token_id=?').run(img, tokenId);
}
const rows = db.prepare('SELECT token_id,image_uri FROM nfts WHERE token_id BETWEEN 6001 AND 6020').all();
console.log(rows);
console.log('✅ Updated image_uri values for premint set');
