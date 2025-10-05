const fs = require('fs');
const path = require('path');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true
});

console.log('🏝️ SYNCING CHAPTER V TO APP GALLERY...\n');

async function syncChapter5() {
  try {
    const metadataDir = path.resolve(__dirname, '../content/ch5/metadata');
    const metadataFiles = fs
      .readdirSync(metadataDir)
      .filter(file => file.startsWith('ch5_') && file.endsWith('.json'))
      .sort();

    if (metadataFiles.length === 0) {
      throw new Error('No Chapter V metadata files found.');
    }

    console.log(`📋 Found ${metadataFiles.length} Chapter V metadata files`);

    const chapter5NFTs = [];

    for (const filename of metadataFiles) {
      const filepath = path.join(metadataDir, filename);
      const metadata = JSON.parse(fs.readFileSync(filepath, 'utf8'));

      const tokenId = metadata.properties?.tokenId || metadata.tokenId;
      if (!tokenId) {
        throw new Error(`Metadata ${filename} missing tokenId.`);
      }

      const cardId = filename.replace('.json', '');
      const clueData = {
        place: metadata.place,
        timeOfDay: metadata.timeOfDay,
        weather: metadata.weather,
        bearingDeg: metadata.bearingDeg,
        tide: metadata.tide,
        moonPhase: metadata.moonPhase,
        cipherOutput: metadata.cipherOutput,
        riddle: metadata.riddle
      };

      const nftData = {
        token_id: tokenId,
        nftoken_id: `ch5_${String(tokenId - 200).padStart(3, '0')}`,
        name: metadata.name,
        description: metadata.description,
        image_uri: `/ch5/images/${cardId}.png`,
        metadata_uri: `/ch5/metadata/${filename}`,
        chapter: metadata.chapter || 'V — Cerf Island Shadows',
        island: metadata.island || 'Cerf Island',
        rarity: metadata.attributes?.find(attr => attr.trait_type === 'Rarity')?.value || 'Legendary',
        attributes: JSON.stringify(metadata.attributes || []),
        clue_data: JSON.stringify(clueData),
        current_owner: null,
        price_xrp: null,
        for_sale: false,
        offer_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      chapter5NFTs.push(nftData);
      console.log(`✅ Prepared: ${tokenId} - ${metadata.name}`);
    }

    console.log('\n💾 Inserting Chapter V NFTs into database...');

    for (const nft of chapter5NFTs) {
      await knex('nfts')
        .insert(nft)
        .onConflict('token_id')
        .merge();
    }

    console.log(`🎉 Successfully synced ${chapter5NFTs.length} Chapter V NFTs!`);

    const totalNFTs = await knex('nfts').count('token_id as count').first();
    const chapter5Count = await knex('nfts')
      .where('chapter', 'V — Cerf Island Shadows')
      .count('token_id as count')
      .first();

    console.log(`\n📊 DATABASE STATUS:`);
    console.log(`   Total NFTs: ${totalNFTs.count}`);
    console.log(`   Chapter V NFTs: ${chapter5Count.count}`);
    console.log(`   Token ID range expected: 201-220`);

    console.log('\n🎯 CIPHER VERIFICATION:');
    const ch5NFTs = await knex('nfts')
      .select('token_id', 'name', 'clue_data')
      .where('chapter', 'V — Cerf Island Shadows')
      .orderBy('token_id');

    let cipher = '';
    ch5NFTs.forEach(nft => {
      try {
        const parsed = JSON.parse(nft.clue_data || '{}');
        const output = parsed.cipherOutput || '??';
        cipher += output;
        console.log(`   ${nft.token_id}: ${nft.name.substring(0, 25).padEnd(25)} -> ${output}`);
      } catch (error) {
        console.log(`   ${nft.token_id}: Error parsing clue data`);
        cipher += '??';
      }
    });

    console.log(`   Complete cipher: ${cipher}`);
    console.log('   Should spell: CERFISLANDHIDESTHEKEY');
    console.log(`   ✅ Cipher ${cipher === 'CERFISLANDHIDESTHEKEY' ? 'CORRECT' : 'NEEDS CHECKING'}`);
  } catch (error) {
    console.error('❌ Error syncing Chapter V:', error.message);
  } finally {
    await knex.destroy();
  }
}

syncChapter5();
