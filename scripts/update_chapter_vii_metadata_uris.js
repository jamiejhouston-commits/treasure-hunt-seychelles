/**
 * UPDATE CHAPTER VII DATABASE WITH PROPER METADATA URIS
 * Fix metadata paths and ensure sophisticated style is embedded
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../backend/database.sqlite');

async function updateChapterVIIMetadata() {
  console.log('🔄 UPDATING CHAPTER VII METADATA URIS IN DATABASE');
  console.log('🎨 Ensuring sophisticated painterly style is properly referenced');
  
  const db = new sqlite3.Database(DB_PATH);
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('📄 Updating metadata URIs for tokens 1001-1020...');
      
      const updateStmt = db.prepare(`
        UPDATE nfts SET 
          metadata_uri = ?,
          image_uri = ?,
          description = ?,
          updated_at = ?
        WHERE token_id = ?
      `);
      
      let updateCount = 0;
      const baseTokenId = 1000;
      
      // Update all 20 Chapter VII tokens
      for (let i = 1; i <= 20; i++) {
        const tokenId = baseTokenId + i;
        const metadataUri = `/content/ch7_sirens_map/metadata/${tokenId}.json`;
        const imageUri = `/content/ch7_sirens_map/output/ch7_${String(i).padStart(3, '0')}_painterly.png`;
        const description = `Sophisticated painterly NFT from Chapter VII: The Siren's Map of Praslin. Features etched-parchment technique with Seychellois cultural motifs, multi-layer textured brushwork, and saturated palette. NO primitive shapes - advanced layered rendering only.`;
        
        updateStmt.run([
          metadataUri,
          imageUri, 
          description,
          new Date().toISOString(),
          tokenId
        ], function(err) {
          if (err) {
            console.error(`❌ Error updating token ${tokenId}:`, err);
          } else {
            updateCount++;
            console.log(`✅ Updated token ${tokenId}: Sophisticated metadata URI`);
          }
        });
      }
      
      updateStmt.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`\n🎉 METADATA UPDATE COMPLETE!`);
          console.log(`📊 Updated: ${updateCount} tokens with sophisticated metadata`);
          console.log(`🎭 Style: Painterly layered Seychellois (embedded in metadata)`);
          console.log(`📁 Metadata: /content/ch7_sirens_map/metadata/`);
          console.log(`🖼️ Images: /content/ch7_sirens_map/output/`);
          resolve(updateCount);
        }
      });
    });
    
    db.close();
  });
}

// Execute the metadata update
updateChapterVIIMetadata()
  .then((count) => {
    console.log(`\n✅ SUCCESS: ${count} tokens updated with sophisticated metadata`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ METADATA UPDATE FAILED:', error);
    process.exit(1);
  });