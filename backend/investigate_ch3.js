const Database = require('better-sqlite3');

console.log('🔍 === CHAPTER 3 INVESTIGATION ===');

const db = new Database('database.sqlite');

console.log('\n📊 All chapters in database:');
const chapters = db.prepare('SELECT DISTINCT chapter, COUNT(*) as count FROM nfts GROUP BY chapter ORDER BY chapter').all();
chapters.forEach(ch => {
    console.log(`  ${ch.chapter}: ${ch.count} NFTs`);
});

console.log('\n🔍 Looking for Chapter 3 specifically:');
const ch3_search = db.prepare(`
    SELECT token_id, nftoken_id, name, chapter, current_owner 
    FROM nfts 
    WHERE chapter LIKE '%3%' OR chapter = 'Chapter 3' OR chapter = 'Chapter III'
    ORDER BY token_id 
    LIMIT 15
`).all();

if (ch3_search.length > 0) {
    console.log('  ✅ Found Chapter 3 NFTs:');
    ch3_search.forEach(nft => {
        console.log(`    Token ${nft.token_id}: ${nft.name} (Chapter: ${nft.chapter}) Owner: ${nft.current_owner}`);
    });
} else {
    console.log('  ❌ No Chapter 3 NFTs found!');
}

console.log('\n🔍 Checking for any NFTs with token_id in Chapter 3 range (121-130):');
const ch3_range = db.prepare(`
    SELECT token_id, nftoken_id, name, chapter, current_owner 
    FROM nfts 
    WHERE token_id BETWEEN 121 AND 130
    ORDER BY token_id
`).all();

if (ch3_range.length > 0) {
    console.log('  ✅ Found NFTs in Chapter 3 token range:');
    ch3_range.forEach(nft => {
        console.log(`    Token ${nft.token_id}: ${nft.name} (Chapter: ${nft.chapter}) Owner: ${nft.current_owner}`);
    });
} else {
    console.log('  ❌ No NFTs found in Chapter 3 token range!');
}

console.log('\n🔍 Sample of all NFTs to see what chapters exist:');
const sample = db.prepare('SELECT token_id, name, chapter FROM nfts ORDER BY token_id LIMIT 10').all();
sample.forEach(nft => {
    console.log(`  Token ${nft.token_id}: ${nft.chapter}`);
});

db.close();
console.log('\n🏴‍☠️ Investigation complete!');