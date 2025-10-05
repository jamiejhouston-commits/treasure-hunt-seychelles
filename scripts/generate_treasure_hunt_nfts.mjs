#!/usr/bin/env node

/**
 * TREASURE HUNT NFT GENERATOR
 * 
 * Generates 20 NFTs for testnet with:
 * - Puzzle layers (4 NFTs have puzzle clues in overlay layers)
 * - Art rarity system (Common/Uncommon/Rare/Epic)
 * - Caesar cipher puzzle pointing to real Seychelles location
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input/Output paths
const ARTWORK_DIR = path.resolve(__dirname, '../Mint_batch_ii');
const OUTPUT_DIR = path.resolve(__dirname, '../content/treasure_hunt_chapter1');
const OUTPUT_IMAGES = path.join(OUTPUT_DIR, 'images');
const OUTPUT_LAYERS = path.join(OUTPUT_DIR, 'layers');
const OUTPUT_METADATA = path.join(OUTPUT_DIR, 'metadata');

// Ensure directories exist
await fs.ensureDir(OUTPUT_IMAGES);
await fs.ensureDir(OUTPUT_LAYERS);
await fs.ensureDir(OUTPUT_METADATA);

/**
 * PUZZLE SOLUTION - Caesar Cipher (shift 7)
 * Location: ANSE MAJOR TRAIL (famous hiking trail in Seychelles)
 * 
 * Puzzle Design:
 * NFT #5: Cipher Text "HUZL THQVY AYHNSI" (Layer 1)
 * NFT #12: Map fragment showing trail (Layer 2) 
 * NFT #17: Decoding Key "SHIFT BY SEVEN" (Layer 3)
 * NFT #20: Coordinates "4.6167° S, 55.4167° E" (Layer 1)
 */

const PUZZLE_SOLUTION = 'ANSE MAJOR TRAIL';
const PUZZLE_CONFIG = {
  5: {
    layer: 1,
    type: 'cipher_text',
    content: 'HUZL THQVY AYHNSI',
    description: 'Encrypted message - what does it say?'
  },
  12: {
    layer: 2,
    type: 'map_fragment',
    content: 'trail_map',
    description: 'Ancient map fragment showing a trail'
  },
  17: {
    layer: 3,
    type: 'decoding_key',
    content: 'SHIFT BY SEVEN',
    description: 'The key to unlock the cipher'
  },
  20: {
    layer: 1,
    type: 'coordinates',
    content: '4.6167° S, 55.4167° E',
    description: 'Geographic coordinates in Seychelles'
  }
};

/**
 * ART RARITY ASSIGNMENTS
 * Based on visual content and aesthetic appeal
 */
const RARITY_ASSIGNMENTS = {
  // Epic (2) - Most visually striking/unique
  1: 'Epic',
  19: 'Epic',
  
  // Rare (4) - Very high quality/interesting
  5: 'Rare',
  8: 'Rare', 
  12: 'Rare',
  17: 'Rare',
  
  // Uncommon (6) - Good quality
  2: 'Uncommon',
  7: 'Uncommon',
  11: 'Uncommon',
  14: 'Uncommon',
  16: 'Uncommon',
  20: 'Uncommon',
  
  // Common (8) - Standard quality
  3: 'Common',
  4: 'Common',
  6: 'Common',
  9: 'Common',
  10: 'Common',
  13: 'Common',
  15: 'Common',
  18: 'Common'
};

const RARITY_COLORS = {
  'Epic': { hex: '#9d4edd', rgb: [157, 78, 221] },
  'Rare': { hex: '#3a86ff', rgb: [58, 134, 255] },
  'Uncommon': { hex: '#06d6a0', rgb: [6, 214, 160] },
  'Common': { hex: '#8d99ae', rgb: [141, 153, 174] }
};

/**
 * Generate puzzle overlay layer
 */
async function generatePuzzleLayer(nftId, puzzleData, width, height) {
  const overlayPath = path.join(OUTPUT_LAYERS, `nft_${nftId}_layer_${puzzleData.layer}.png`);
  
  // Create semi-transparent overlay with puzzle content
  const svg = `
    <svg width="${width}" height="${height}">
      <defs>
        <filter id="roughPaper">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
          <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60"/>
          </feDiffuseLighting>
        </filter>
      </defs>
      
      <!-- Aged parchment background -->
      <rect width="${width}" height="${height}" fill="rgba(222, 209, 176, 0.85)" filter="url(#roughPaper)"/>
      
      <!-- Border decoration -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" 
            fill="none" stroke="rgba(101, 67, 33, 0.7)" stroke-width="3"/>
      <rect x="50" y="50" width="${width - 100}" height="${height - 100}" 
            fill="none" stroke="rgba(101, 67, 33, 0.5)" stroke-width="1"/>
      
      <!-- Content -->
      <text x="${width / 2}" y="${height / 2 - 60}" 
            font-family="Georgia, serif" font-size="32" font-weight="bold"
            text-anchor="middle" fill="rgba(80, 40, 20, 0.9)">
        ${puzzleData.type.toUpperCase().replace('_', ' ')}
      </text>
      
      <text x="${width / 2}" y="${height / 2}" 
            font-family="Courier New, monospace" font-size="48" font-weight="bold"
            text-anchor="middle" fill="rgba(139, 69, 19, 1)">
        ${puzzleData.content.split(' ')[0]}
      </text>
      
      ${puzzleData.content.split(' ').length > 1 ? `
        <text x="${width / 2}" y="${height / 2 + 60}" 
              font-family="Courier New, monospace" font-size="48" font-weight="bold"
              text-anchor="middle" fill="rgba(139, 69, 19, 1)">
          ${puzzleData.content.split(' ').slice(1).join(' ')}
        </text>
      ` : ''}
      
      <text x="${width / 2}" y="${height - 100}" 
            font-family="Georgia, serif" font-size="20" font-style="italic"
            text-anchor="middle" fill="rgba(101, 67, 33, 0.8)">
        ${puzzleData.description}
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(overlayPath);
  
  return overlayPath;
}

/**
 * Generate map fragment overlay for NFT #12
 */
async function generateMapFragment(nftId, width, height) {
  const overlayPath = path.join(OUTPUT_LAYERS, `nft_${nftId}_layer_2.png`);
  
  const svg = `
    <svg width="${width}" height="${height}">
      <!-- Aged map paper -->
      <rect width="${width}" height="${height}" fill="rgba(240, 230, 210, 0.9)"/>
      
      <!-- Map grid -->
      ${Array.from({ length: 10 }, (_, i) => `
        <line x1="0" y1="${i * height / 10}" x2="${width}" y2="${i * height / 10}" 
              stroke="rgba(139, 69, 19, 0.2)" stroke-width="1"/>
        <line x1="${i * width / 10}" y1="0" x2="${i * width / 10}" y2="${height}" 
              stroke="rgba(139, 69, 19, 0.2)" stroke-width="1"/>
      `).join('')}
      
      <!-- Trail path -->
      <path d="M ${width * 0.2} ${height * 0.7} Q ${width * 0.4} ${height * 0.5}, ${width * 0.5} ${height * 0.4} T ${width * 0.7} ${height * 0.25}" 
            fill="none" stroke="rgba(205, 92, 92, 0.8)" stroke-width="4" stroke-dasharray="10,5"/>
      
      <!-- Landmark markers -->
      <circle cx="${width * 0.2}" cy="${height * 0.7}" r="8" fill="rgba(178, 34, 34, 0.8)"/>
      <circle cx="${width * 0.7}" cy="${height * 0.25}" r="8" fill="rgba(50, 205, 50, 0.8)"/>
      
      <!-- Text labels -->
      <text x="${width * 0.5}" y="${height * 0.15}" 
            font-family="Georgia, serif" font-size="28" font-weight="bold"
            text-anchor="middle" fill="rgba(101, 67, 33, 0.9)">
        TRAIL MAP FRAGMENT
      </text>
      
      <text x="${width * 0.2}" y="${height * 0.75}" 
            font-family="Georgia, serif" font-size="18"
            text-anchor="middle" fill="rgba(80, 40, 20, 0.8)">
        START
      </text>
      
      <text x="${width * 0.7}" y="${height * 0.22}" 
            font-family="Georgia, serif" font-size="18"
            text-anchor="middle" fill="rgba(80, 40, 20, 0.8)">
        TREASURE
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(overlayPath);
  
  return overlayPath;
}

/**
 * Process single NFT
 */
async function processNFT(artworkFile, nftId) {
  console.log(`\n🎨 Processing NFT #${nftId}...`);
  
  const artworkPath = path.join(ARTWORK_DIR, artworkFile);
  const outputImagePath = path.join(OUTPUT_IMAGES, `nft_${nftId}.png`);
  
  // Get image dimensions
  const metadata = await sharp(artworkPath).metadata();
  const { width, height } = metadata;
  
  // Copy base artwork (Layer 0)
  await fs.copy(artworkPath, outputImagePath);
  console.log(`  ✓ Base artwork copied (${width}x${height})`);
  
  // Check if this NFT has a puzzle layer
  const puzzleData = PUZZLE_CONFIG[nftId];
  let layers = [
    {
      layer: 0,
      type: 'base_artwork',
      ipfs_hash: null, // Will be added during minting
      description: 'Original Seychelles artwork'
    }
  ];
  
  if (puzzleData) {
    console.log(`  🔍 Generating puzzle layer ${puzzleData.layer}...`);
    
    let overlayPath;
    if (puzzleData.type === 'map_fragment') {
      overlayPath = await generateMapFragment(nftId, width, height);
    } else {
      overlayPath = await generatePuzzleLayer(nftId, puzzleData, width, height);
    }
    
    layers.push({
      layer: puzzleData.layer,
      type: puzzleData.type,
      ipfs_hash: null, // Will be added during minting
      description: puzzleData.description,
      hint: puzzleData.content
    });
    
    console.log(`  ✓ Puzzle layer created`);
  }
  
  // Get rarity
  const rarity = RARITY_ASSIGNMENTS[nftId];
  console.log(`  ⭐ Rarity: ${rarity}`);
  
  // Generate metadata
  const nftMetadata = {
    id: nftId,
    name: `Seychelles Treasure #${nftId}`,
    description: `Chapter 1: The Trail Begins - NFT #${nftId}${puzzleData ? ' (Contains Puzzle Clue)' : ''}`,
    image: null, // Will be IPFS hash
    image_url: null, // Will be IPFS gateway URL
    attributes: [
      {
        trait_type: 'Chapter',
        value: 'Chapter 1: The Trail Begins'
      },
      {
        trait_type: 'Rarity',
        value: rarity
      },
      {
        trait_type: 'Has Puzzle',
        value: puzzleData ? 'Yes' : 'No'
      },
      {
        trait_type: 'Location',
        value: 'Seychelles Islands'
      },
      {
        trait_type: 'Series',
        value: 'Treasure Hunt Testnet'
      }
    ],
    layers: layers,
    chapter: 'Chapter 1',
    puzzle_enabled: !!puzzleData,
    rarity: {
      tier: rarity,
      color: RARITY_COLORS[rarity].hex
    }
  };
  
  // Save metadata
  const metadataPath = path.join(OUTPUT_METADATA, `nft_${nftId}.json`);
  await fs.writeJSON(metadataPath, nftMetadata, { spaces: 2 });
  console.log(`  ✓ Metadata saved`);
  
  return nftMetadata;
}

/**
 * Main generation function
 */
async function generateTreasureHuntNFTs() {
  console.log('🏴‍☠️ TREASURE HUNT NFT GENERATOR');
  console.log('═══════════════════════════════════════════════\n');
  
  // Get artwork files
  const artworkFiles = await fs.readdir(ARTWORK_DIR);
  const pngFiles = artworkFiles.filter(f => f.endsWith('.png')).sort();
  
  if (pngFiles.length < 20) {
    console.error(`❌ Need 20 PNG files in ${ARTWORK_DIR}, found ${pngFiles.length}`);
    process.exit(1);
  }
  
  console.log(`📂 Found ${pngFiles.length} artwork files`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  // Process each NFT
  const allMetadata = [];
  for (let i = 0; i < 20; i++) {
    const nftId = i + 1;
    const artworkFile = pngFiles[i];
    
    try {
      const metadata = await processNFT(artworkFile, nftId);
      allMetadata.push(metadata);
    } catch (error) {
      console.error(`❌ Error processing NFT #${nftId}:`, error.message);
      throw error;
    }
  }
  
  // Save combined metadata
  await fs.writeJSON(
    path.join(OUTPUT_DIR, 'collection_metadata.json'),
    allMetadata,
    { spaces: 2 }
  );
  
  // Generate documentation files
  await generateDocumentation();
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('✅ GENERATION COMPLETE!');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`📦 20 NFTs generated`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🔍 Puzzle NFTs: #5, #12, #17, #20`);
  console.log(`⭐ Rarity distribution:`);
  console.log(`   Epic: 2 | Rare: 4 | Uncommon: 6 | Common: 8\n`);
}

/**
 * Generate documentation files
 */
async function generateDocumentation() {
  // Puzzle solution documentation
  const puzzleSolution = `
TREASURE HUNT PUZZLE SOLUTION
═══════════════════════════════════════════════════════════

CHAPTER 1: THE TRAIL BEGINS

ANSWER: ${PUZZLE_SOLUTION}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PUZZLE PIECES:

NFT #5 (Layer 1): Cipher Text
  Content: "HUZL THQVY AYHNSI"
  Type: Encrypted message
  
NFT #12 (Layer 2): Map Fragment
  Content: Trail map showing path from START to TREASURE
  Type: Geographic clue
  
NFT #17 (Layer 3): Decoding Key  
  Content: "SHIFT BY SEVEN"
  Type: Caesar cipher key
  
NFT #20 (Layer 1): Coordinates
  Content: "4.6167° S, 55.4167° E"
  Type: Precise location

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOLUTION STEPS:

1. Find NFT #17 → Learn the cipher uses "SHIFT BY SEVEN"
2. Find NFT #5 → Get encrypted text "HUZL THQVY AYHNSI"
3. Apply Caesar cipher with shift of 7:
   H → A, U → N, Z → S, L → E, etc.
   Result: "ANSE MAJOR TRAIL"
4. Find NFT #12 → Map confirms it's a trail location
5. Find NFT #20 → Coordinates 4.6167° S, 55.4167° E confirm Seychelles
6. Google "Anse Major Trail Seychelles" → Confirms real location

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ABOUT THE LOCATION:

Anse Major Trail is a famous 2.5km hiking trail in Mahé, Seychelles.
The trail leads to Anse Major Beach, one of the most beautiful
isolated beaches accessible only by boat or this scenic trail.

Coordinates: 4.6167° S, 55.4167° E
Location: Northwest coast of Mahé Island
Difficulty: Moderate
Time: 1-1.5 hours one way

This location represents the beginning of La Vasseur's treasure journey,
where the pirate allegedly buried clues leading to his legendary treasure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIZE:
$750 USD (test reward for testnet)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'puzzle_solution.txt'),
    puzzleSolution
  );
  
  // Art rarity documentation
  let rarityDoc = `
ART RARITY ASSIGNMENTS
═══════════════════════════════════════════════════════════

CHAPTER 1: THE TRAIL BEGINS

Total NFTs: 20

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RARITY TIERS:

`;

  const rarityGroups = {
    'Epic': [],
    'Rare': [],
    'Uncommon': [],
    'Common': []
  };
  
  Object.entries(RARITY_ASSIGNMENTS).forEach(([id, rarity]) => {
    rarityGroups[rarity].push(parseInt(id));
  });
  
  Object.entries(rarityGroups).forEach(([rarity, nfts]) => {
    const color = RARITY_COLORS[rarity];
    rarityDoc += `
${rarity.toUpperCase()} (${nfts.length} NFTs)
Color: ${color.hex}
NFTs: ${nfts.sort((a, b) => a - b).map(n => `#${n}`).join(', ')}

`;
  });
  
  rarityDoc += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RARITY DISTRIBUTION:

Epic:     2 NFTs (10%)  - Exceptional artwork, unique composition
Rare:     4 NFTs (20%)  - High quality, visually striking
Uncommon: 6 NFTs (30%)  - Above average aesthetic appeal
Common:   8 NFTs (40%)  - Standard quality, still beautiful

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RARITY BONUSES:

Collect all 2 Epic NFTs:     Bonus: $500
Collect all 4 Rare NFTs:     Bonus: $200
Collect all 6 Uncommon NFTs: Bonus: $100
Complete set (all 20):       Bonus: $1,000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL INDICATORS:

Each rarity tier has a distinct color badge that appears:
- On gallery thumbnail (corner badge)
- In layer viewer (prominent display)
- In collection tracker

Epic:     Purple/Gold (#9d4edd) - Most prestigious
Rare:     Blue (#3a86ff) - Highly valuable  
Uncommon: Green (#06d6a0) - Notable quality
Common:   Gray (#8d99ae) - Standard beauty

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'art_rarity_assignments.txt'),
    rarityDoc
  );
  
  console.log('\n  ✓ puzzle_solution.txt created');
  console.log('  ✓ art_rarity_assignments.txt created');
}

// Run generator
generateTreasureHuntNFTs().catch(error => {
  console.error('\n❌ Generation failed:', error);
  process.exit(1);
});
