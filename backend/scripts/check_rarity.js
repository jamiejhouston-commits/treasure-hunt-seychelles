const db = require('../database/connection');

async function checkRarity() {
  const rows = await db('nfts')
    .where('chapter', 'Chapter 1')
    .select('art_rarity', 'price_xrp');

  const counts = {};
  rows.forEach(r => {
    counts[r.art_rarity] = (counts[r.art_rarity] || 0) + 1;
  });

  console.log('\nRarity Distribution (20 NFTs total):');
  Object.entries(counts).sort((a,b) => b[1] - a[1]).forEach(([r,c]) => {
    const pct = ((c/20)*100).toFixed(0);
    console.log(`  ${r}: ${c} NFTs (${pct}%)`);
  });

  process.exit(0);
}

checkRarity();
