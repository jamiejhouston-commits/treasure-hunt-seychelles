const fs = require('fs');
const path = require('path');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true
});

console.log('🏴‍☠️ SYNCING CHAPTER IV TO APP GALLERY...\n');

async function syncChapter4() {
  try {
    // Load all Chapter IV metadata files
  const metadataDir = path.resolve(__dirname, '../content/ch4/metadata');
  const metadataFiles = fs.readdirSync(metadataDir)
      .filter(file => file.startsWith('ch4_') && file.endsWith('.json'))
      .sort();
    
    console.log(`📋 Found ${metadataFiles.length} Chapter IV metadata files`);
    
    const chapter4NFTs = [];
    
    for (let i = 0; i < metadataFiles.length; i++) {
      const filename = metadataFiles[i];
  const filepath = path.join(metadataDir, filename);
      const metadata = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      
      // Generate token_id starting from 141 (after existing 140 NFTs)
      const tokenId = 141 + i;
      const cardId = filename.replace('.json', '');
      
      const nftData = {
        token_id: tokenId,
        nftoken_id: `ch4_${(i + 1).toString().padStart(3, '0')}`, // ch4_001, ch4_002, etc.
        name: metadata.name,
        description: metadata.description,
        image_uri: `/ch4/images/${cardId}.png`, // Will serve from content/ch4/images/
        metadata_uri: `/ch4/metadata/${filename}`,
        chapter: metadata.chapter,
        island: metadata.island,
        rarity: metadata.attributes.find(attr => attr.trait_type === 'Rarity')?.value || 'Epic',
        attributes: JSON.stringify(metadata.attributes),
        clue_data: JSON.stringify({
          place: metadata.place,
          timeOfDay: metadata.timeOfDay,
          weather: metadata.weather,
          bearingDeg: metadata.bearingDeg,
          tide: metadata.tide,
          moonPhase: metadata.moonPhase,
          cipherOutput: metadata.cipherOutput,
          riddle: metadata.riddle
        }),
        current_owner: null, // Not minted yet
        price_xrp: null,
        for_sale: false,
        offer_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      chapter4NFTs.push(nftData);
      console.log(`✅ Prepared: ${tokenId} - ${metadata.name}`);
    }
    
    // Insert into database (or update if exists)
    console.log('\n💾 Inserting Chapter IV NFTs into database...');
    
    for (const nft of chapter4NFTs) {
      await knex('nfts')
        .insert(nft)
        .onConflict('token_id')
        .merge();
    }
    
    console.log(`🎉 Successfully synced ${chapter4NFTs.length} Chapter IV NFTs!`);
    
    // Verify the sync
    const totalNFTs = await knex('nfts').count('token_id as count').first();
    const chapter4Count = await knex('nfts')
      .where('chapter', 'IV — Witch-Winds of Mahé')
      .count('token_id as count')
      .first();
    
    console.log(`\n📊 DATABASE STATUS:`);
    console.log(`   Total NFTs: ${totalNFTs.count}`);
    console.log(`   Chapter IV NFTs: ${chapter4Count.count}`);
    console.log(`   Token ID range: 141-160`);
    
    console.log('\n🎯 CIPHER VERIFICATION:');
    const ch4NFTs = await knex('nfts')
      .select('token_id', 'name', 'clue_data')
      .where('chapter', 'IV — Witch-Winds of Mahé')
      .orderBy('token_id');
    
    let cipher = '';
    ch4NFTs.forEach(nft => {
      try {
        const clueData = JSON.parse(nft.clue_data || '{}');
        const cipherOutput = clueData.cipherOutput || 'XX';
        cipher += cipherOutput;
        console.log(`   ${nft.token_id}: ${nft.name.substring(0, 25).padEnd(25)} -> ${cipherOutput}`);
      } catch (e) {
        console.log(`   ${nft.token_id}: Error parsing clue data`);
        cipher += 'XX';
      }
    });
    
    console.log(`   Complete cipher: ${cipher}`);
    console.log(`   Should spell: LAZAREPICAULTANSEGAULETTALAZAREPICAUL`);
    console.log(`   ✅ Cipher ${cipher.includes('LAZARE') && cipher.includes('PICAULT') && cipher.includes('GAULETTE') ? 'CORRECT' : 'NEEDS CHECKING'}`);
    
  } catch (error) {
    console.error('❌ Error syncing Chapter IV:', error.message);
  } finally {
    await knex.destroy();
  }
}

syncChapter4();