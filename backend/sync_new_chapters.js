const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true
});

const fs = require('fs');
const path = require('path');

async function syncAllNewChapters() {
  console.log('🔄 Syncing all new chapters to database...');
  
  // Map the generated chapters to proper database structure
  const chaptersToSync = [
    { 
      dir: '../content/mah__manuscripts', 
      chapter: 'Mahé Manuscripts', 
      startId: 301,
      urlPath: 'mahe_manuscripts'
    },
    { 
      dir: '../content/praslin_s_prophecy', 
      chapter: "Praslin's Prophecy", 
      startId: 401,
      urlPath: 'praslin_prophecy'
    },
    { 
      dir: '../content/la_digue_s_secrets', 
      chapter: "La Digue's Secrets", 
      startId: 501,
      urlPath: 'la_digue_secrets'
    },
    { 
      dir: '../content/outer_islands_revelation', 
      chapter: 'Outer Islands Revelation', 
      startId: 601,
      urlPath: 'outer_islands'
    }
  ];
  
  for (const chapterInfo of chaptersToSync) {
    const chapterPath = path.resolve(__dirname, chapterInfo.dir);
    const metadataPath = path.join(chapterPath, 'metadata');
    
    if (!fs.existsSync(metadataPath)) {
      console.log(`⚠️ Skipping ${chapterInfo.chapter} - no metadata folder found at ${metadataPath}`);
      continue;
    }
    
    const metadataFiles = fs.readdirSync(metadataPath)
      .filter(file => file.endsWith('.json'))
      .sort();
    
    console.log(`📁 Processing ${chapterInfo.chapter}: ${metadataFiles.length} cards`);
    
    for (let i = 0; i < metadataFiles.length; i++) {
      const file = metadataFiles[i];
      const filePath = path.join(metadataPath, file);
      
      try {
        const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const tokenId = chapterInfo.startId + i;
        
        // Check if token already exists
        const existing = await knex('nfts').where('token_id', tokenId).first();
        
        // Build image URL for serving
        const imageFileName = file.replace('.json', '.png');
        const imageUrl = `/${chapterInfo.urlPath}/images/${imageFileName}`; // relative path served by express
        const metadataUrl = `/${chapterInfo.urlPath}/metadata/${file}`;

        // Normalize attributes array -> store as JSON string for attributes column
        let attributesArray = metadata.attributes || [];
        if (!Array.isArray(attributesArray)) {
          attributesArray = [];
        }

        const nftData = {
          token_id: tokenId,
          name: metadata.name || `${chapterInfo.chapter} #${tokenId}`,
            description: metadata.description || `${chapterInfo.chapter} collectible`,
          image_uri: imageUrl,
          metadata_uri: metadataUrl,
          chapter: chapterInfo.chapter,
          island: metadata.island || metadata.location?.island || 'Unknown',
          rarity: (metadata.rarity || 'Common').toLowerCase(),
          attributes: JSON.stringify(attributesArray),
          clue_data: null,
          current_owner: null,
          for_sale: 0,
          price_xrp: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        if (existing) {
          await knex('nfts').where('token_id', tokenId).update(nftData);
          console.log(`✅ Updated token ${tokenId}: ${metadata.name}`);
        } else {
          await knex('nfts').insert(nftData);
          console.log(`➕ Inserted token ${tokenId}: ${metadata.name}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  }
  
  // Get final count by chapter
  const chapterCounts = await knex('nfts')
    .select('chapter')
    .count('* as count')
    .groupBy('chapter')
    .orderBy('chapter');
    
  console.log('\n📊 NFT Count by Chapter:');
  chapterCounts.forEach(row => {
    console.log(`   ${row.chapter}: ${row.count} NFTs`);
  });
  
  const totalCount = await knex('nfts').count('* as count').first();
  console.log(`\n🎉 Sync complete! Total NFTs in database: ${totalCount.count}`);
  
  await knex.destroy();
  process.exit(0);
}

syncAllNewChapters().catch(error => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});