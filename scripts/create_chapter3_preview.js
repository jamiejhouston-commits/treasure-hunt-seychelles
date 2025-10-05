import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create preview data for Chapter 3 NFTs
async function createChapter3Preview() {
  console.log('📋 Creating Chapter 3 Preview Data...');
  
  const chapter3Dir = path.join(__dirname, 'dist', 'chapter3');
  const reportPath = path.join(__dirname, 'dist', 'chapter3-generation-report.json');
  
  // Read the generation report
  const reportData = JSON.parse(await fs.readFile(reportPath, 'utf-8'));
  
  // Create preview NFTs for the app to display
  const previewNFTs = [];
  
  for (let i = 0; i < reportData.items.length; i++) {
    const item = reportData.items[i];
    const cardNumber = i + 1;
    
    const previewNFT = {
      id: 1000 + cardNumber, // Use 1000+ IDs for preview
      token_id: `PREVIEW_CH3_${cardNumber.toString().padStart(2, '0')}`,
      nftoken_id: `PREVIEW_CH3_${cardNumber}`,
      name: item.name,
      description: `[PREVIEW] ${item.name.split(': ')[1]} - ${item.location}. This is a preview for approval - NOT YET MINTED.`,
      image_uri: `http://localhost:3001/preview/chapter3/chapter3-${cardNumber.toString().padStart(2, '0')}.png`,
      chapter: "Chapter 3 - VASA Expedition [PREVIEW]",
      island: "Mahé",
      rarity: item.rarity,
      attributes: [
        { trait_type: "Status", value: "PREVIEW - AWAITING APPROVAL" },
        { trait_type: "Chapter", value: "Chapter 3 - VASA Expedition" },
        { trait_type: "Location", value: item.location },
        { trait_type: "Rarity", value: item.rarity },
        { trait_type: "CardIndex", value: cardNumber }
      ],
      current_owner: "PREVIEW",
      price_xrp: 0,
      for_sale: 0,
      created_at: new Date().toISOString(),
      image_url: `http://localhost:3001/preview/chapter3/chapter3-${cardNumber.toString().padStart(2, '0')}.png?v=${Date.now()}`,
      marketplace_url: `http://localhost:3000/nft/preview-ch3-${cardNumber}`,
      clue: item.clue
    };
    
    previewNFTs.push(previewNFT);
  }
  
  // Save preview data
  const previewDataPath = path.join(__dirname, 'dist', 'chapter3-preview-nfts.json');
  await fs.writeFile(previewDataPath, JSON.stringify(previewNFTs, null, 2));
  
  console.log(`✅ Created ${previewNFTs.length} preview NFTs`);
  console.log(`📁 Saved to: ${previewDataPath}`);
  console.log('');
  console.log('🖼️ Preview Images Available:');
  previewNFTs.forEach((nft, index) => {
    console.log(`${index + 1}. ${nft.name}`);
    console.log(`   URL: ${nft.image_url}`);
  });
  console.log('');
  console.log('⚠️ These are PREVIEW ONLY - waiting for approval before minting');
  
  return previewNFTs;
}

// Run if called directly
if (import.meta.url.startsWith('file://') && process.argv[1] && process.argv[1].endsWith('create_chapter3_preview.js')) {
  createChapter3Preview().catch(error => {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  });
}

export { createChapter3Preview };