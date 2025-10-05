const db = require('../database/connection');

async function checkMinted() {
  const nfts = await db('nfts')
    .where('chapter', 'Chapter 1: The Trail Begins')
    .select('token_id', 'name', 'nftoken_id', 'current_owner')
    .orderBy('token_id');

  console.log(`Total NFTs: ${nfts.length}`);
  console.log(`Minted: ${nfts.filter(n => n.nftoken_id && !n.nftoken_id.startsWith('MINTED_TESTNET')).length}`);

  nfts.forEach(nft => {
    const status = nft.nftoken_id && !nft.nftoken_id.startsWith('MINTED_TESTNET') ? '✅ MINTED' : '❌ NOT MINTED';
    console.log(`  #${nft.token_id}: ${status}`);
  });

  process.exit(0);
}

checkMinted();
