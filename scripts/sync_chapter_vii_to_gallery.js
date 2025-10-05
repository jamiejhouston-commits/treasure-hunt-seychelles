/**
 * SYNC CHAPTER VII TO PRE-MINTED GALLERY
 * Upload the sophisticated painterly cards to the existing app gallery
 */

import fs from 'fs-extra';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../backend/database.sqlite');
const CHAPTER_VII_MANIFEST = path.resolve(__dirname, '../content/ch7_sirens_map/output/chapter_vii_complete_manifest.json');

async function syncChapterVIIToDatabase() {
  console.log('🔄 SYNCING CHAPTER VII TO PRE-MINTED GALLERY');
  console.log('🎨 Sophisticated painterly cards → App database');
  
  // Load Chapter VII manifest
  const manifest = await fs.readJson(CHAPTER_VII_MANIFEST);
  console.log(`📋 Loaded ${manifest.cards.length} sophisticated cards`);
  
  // Open database connection
  const db = new sqlite3.Database(DB_PATH);
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('📄 Inserting Chapter VII cards into NFTs table...');
      
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO nfts (
          token_id, name, description, image_uri, metadata_uri, 
          chapter, island, rarity, attributes, clue_data, 
          current_owner, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      let insertCount = 0;
      const baseTokenId = 1000; // Start Chapter VII at token_id 1000
      
      manifest.cards.forEach((card, index) => {
        const tokenId = baseTokenId + index + 1;
        const imageUri = `/content/ch7_sirens_map/output/${card.id}_painterly.png`;
        const metadataUri = `/content/ch7_sirens_map/output/${card.id}_painterly_complete.json`;
        
        const attributes = [
          { trait_type: "Chapter", value: "VII" },
          { trait_type: "Location", value: card.name.split(":")[0] },
          { trait_type: "Cipher Letter", value: card.cipherOutput },
          { trait_type: "Bearing", value: card.bearingDeg },
          { trait_type: "Render Style", value: "Painterly Layered Seychellois" },
          { trait_type: "Art Technique", value: "Etched Parchment" },
          ...card.props.map(prop => ({
            trait_type: prop.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: prop.value
          }))
        ];
        
        const clueData = {
          scene: card.scene,
          props: card.props,
          riddle: card.riddle,
          hiddenClue: card.hiddenClue,
          bearingDeg: card.bearingDeg,
          cipherOutput: card.cipherOutput,
          painterlyElements: card.painterlyElements
        };
        
        stmt.run([
          tokenId,
          card.name,
          `${card.scene} Riddle: "${card.riddle}"`,
          imageUri,
          metadataUri,
          'Chapter VII',
          'Praslin',
          'rare', // All Chapter VII cards are sophisticated/rare
          JSON.stringify(attributes),
          JSON.stringify(clueData),
          'pre_minted', // Mark as pre-minted for gallery
          new Date().toISOString(),
          new Date().toISOString()
        ], function(err) {
          if (err) {
            console.error(`❌ Error inserting ${card.name}:`, err);
          } else {
            insertCount++;
            console.log(`✅ ${insertCount}/20: ${card.name} (Token ${tokenId})`);
          }
        });
      });
      
      stmt.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`\n🎉 CHAPTER VII SYNC COMPLETE!`);
          console.log(`📊 Inserted: ${insertCount} sophisticated painterly cards`);
          console.log(`🎭 Style: Etched-painterly Seychellois`);
          console.log(`📱 Available in: Pre-minted gallery`);
          console.log(`🔗 Access via: http://localhost:3000/gallery (pre-minted filter)`);
          resolve(insertCount);
        }
      });
    });
    
    db.close();
  });
}

// Execute the sync
syncChapterVIIToDatabase()
  .then((count) => {
    console.log(`\n✅ SUCCESS: ${count} Chapter VII cards synced to pre-minted gallery`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ SYNC FAILED:', error);
    process.exit(1);
  });