#!/usr/bin/env node

/**
 * TREASURE HUNT CHAPTER 2 NFT GENERATOR
 *
 * Generates 20 NFTs (token IDs 21-40) for testnet with:
 * - Puzzle layers (4 NFTs have puzzle clues in overlay layers)
 * - Art rarity system (Common/Uncommon/Rare/Epic)
 * - Caesar +9 cipher puzzle pointing to Anse Soleil, Seychelles
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input/Output paths
const RANDOM_ARTWORK_DIR = path.resolve(__dirname, '../chp_2_mint');
const RARE_ARTWORK_DIR = path.resolve(__dirname, '../rare Locations paintings');
const MAP_PATH = path.resolve(__dirname, '../MAPS/ANSE_SOLEIL.png');
const OUTPUT_DIR = path.resolve(__dirname, '../content/treasure_hunt_chapter2');
const OUTPUT_IMAGES = path.join(OUTPUT_DIR, 'images');
const OUTPUT_LAYERS = path.join(OUTPUT_DIR, 'layers');
const OUTPUT_METADATA = path.join(OUTPUT_DIR, 'metadata');

// Ensure directories exist
await fs.ensureDir(OUTPUT_IMAGES);
await fs.ensureDir(OUTPUT_LAYERS);
await fs.ensureDir(OUTPUT_METADATA);

/**
 * PUZZLE SOLUTION - Caesar +9 Cipher
 * Location: ANSE SOLEIL (Beautiful secluded beach on southwest Mahé)
 *
 * Puzzle Design:
 * NFT #25: Cipher Text "JWBN BXUNRU" (Layer 1) - Epic rarity
 * NFT #32: Map fragment showing Anse Soleil (Layer 2) - Rare rarity
 * NFT #37: Decoding Riddle (Layer 3) - Uncommon rarity
 * NFT #40: Coordinates "4.7253° S, 55.4892° E" (Layer 1) - Common rarity
 */

const PUZZLE_SOLUTION = 'ANSE SOLEIL';
const PUZZLE_CONFIG = {
  25: {
    layer: 1,
    type: 'cipher_text',
    content: 'JWBN BXUNRU',
    description: 'Encrypted message - what does it say?'
  },
  32: {
    layer: 2,
    type: 'map_fragment',
    content: 'anse_soleil_map',
    description: 'Ancient map fragment showing a hidden location'
  },
  37: {
    layer: 3,
    type: 'decoding_key',
    content: `SHIFT NINE PACES FORWARD
WHEN THE PATH ENDS, IT BEGINS ANEW`,
    description: 'The riddle to unlock the cipher'
  },
  40: {
    layer: 1,
    type: 'coordinates',
    content: '4.7253° S, 55.4892° E',
    description: 'GPS coordinates in Seychelles'
  }
};

/**
 * ART RARITY ASSIGNMENTS
 * 5 Common, 5 Uncommon, 5 Rare, 5 Epic
 * 4 special rare location paintings distributed across rarities
 */
const RARITY_ASSIGNMENTS = {
  // Epic (5) - Including puzzle NFT #25 and rare paintings
  21: 'Epic',    // dan koko.png
  25: 'Epic',    // Puzzle cipher - random image
  28: 'Epic',    // kote ou ete.png
  33: 'Epic',    // Random image
  38: 'Epic',    // nou kreater.png

  // Rare (5) - Including puzzle NFT #32 and rare painting
  23: 'Rare',    // Random image
  27: 'Rare',    // zoli zil.png
  32: 'Rare',    // Puzzle map - random image
  35: 'Rare',    // Random image
  39: 'Rare',    // Random image

  // Uncommon (5) - Including puzzle NFT #37
  22: 'Uncommon', // Random image
  26: 'Uncommon', // Random image
  31: 'Uncommon', // Random image
  37: 'Uncommon', // Puzzle riddle key - random image
  40: 'Uncommon', // Puzzle coordinates - random image (NOTE: Changed from Common to balance distribution)

  // Common (5)
  24: 'Common',  // Random image
  29: 'Common',  // Random image
  30: 'Common',  // Random image
  34: 'Common',  // Random image
  36: 'Common'   // Random image
};

/**
 * IMAGE ASSIGNMENTS
 * Maps token IDs to specific artwork files
 */
const IMAGE_ASSIGNMENTS = {
  // Epic rare paintings
  21: 'dan koko.png',
  28: 'kote ou ete.png',
  38: 'nou kreater.png',

  // Rare rare painting
  27: 'zoli zil.png',

  // All other IDs get random images from chp_2_mint (will be auto-assigned)
};

const RARITY_COLORS = {
  'Epic': { hex: '#9d4edd', rgb: [157, 78, 221] },
  'Rare': { hex: '#3a86ff', rgb: [58, 134, 255] },
  'Uncommon': { hex: '#06d6a0', rgb: [6, 214, 160] },
  'Common': { hex: '#8d99ae', rgb: [141, 153, 174] }
};

/**
 * Generate puzzle text overlay layer
 */
async function generatePuzzleLayer(nftId, puzzleData, width, height) {
  const overlayPath = path.join(OUTPUT_LAYERS, `nft_${nftId}_layer_${puzzleData.layer}.png`);

  // Handle multi-line content
  const lines = puzzleData.content.split('\n').filter(l => l.trim());
  const isMultiLine = lines.length > 1;

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

      <!-- Content type header -->
      <text x="${width / 2}" y="${isMultiLine ? height / 2 - 120 : height / 2 - 60}"
            font-family="Georgia, serif" font-size="32" font-weight="bold"
            text-anchor="middle" fill="rgba(80, 40, 20, 0.9)">
        ${puzzleData.type.toUpperCase().replace('_', ' ')}
      </text>

      ${isMultiLine ? `
        <!-- Multi-line content (riddle) -->
        <text x="${width / 2}" y="${height / 2 - 40}"
              font-family="Georgia, serif" font-size="36" font-weight="bold"
              text-anchor="middle" fill="rgba(139, 69, 19, 1)">
          ${lines[0]}
        </text>
        <text x="${width / 2}" y="${height / 2 + 20}"
              font-family="Georgia, serif" font-size="28" font-style="italic"
              text-anchor="middle" fill="rgba(139, 69, 19, 0.9)">
          ${lines[1]}
        </text>
      ` : `
        <!-- Single line content -->
        <text x="${width / 2}" y="${height / 2}"
              font-family="Courier New, monospace" font-size="48" font-weight="bold"
              text-anchor="middle" fill="rgba(139, 69, 19, 1)">
          ${puzzleData.content}
        </text>
      `}

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
 * Generate map fragment overlay for NFT #32 using the user's map
 */
async function generateMapFragment(nftId, width, height) {
  const overlayPath = path.join(OUTPUT_LAYERS, `nft_${nftId}_layer_2.png`);

  // Load the user's Anse Soleil map
  const mapImage = await sharp(MAP_PATH)
    .resize(width, height, { fit: 'contain', background: { r: 240, g: 230, b: 210, alpha: 0.9 } })
    .toBuffer();

  // Save the map as the overlay
  await sharp(mapImage)
    .toFile(overlayPath);

  console.log(`  ✓ Map overlay created from user's ANSE_SOLEIL.png`);

  return overlayPath;
}

/**
 * Generate coordinates overlay
 */
async function generateCoordinatesLayer(nftId, puzzleData, width, height) {
  const overlayPath = path.join(OUTPUT_LAYERS, `nft_${nftId}_layer_${puzzleData.layer}.png`);

  const svg = `
    <svg width="${width}" height="${height}">
      <!-- Aged parchment background -->
      <rect width="${width}" height="${height}" fill="rgba(222, 209, 176, 0.85)"/>

      <!-- Border -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}"
            fill="none" stroke="rgba(101, 67, 33, 0.7)" stroke-width="3"/>

      <!-- GPS icon -->
      <circle cx="${width / 2}" cy="${height / 2 - 60}" r="40"
              fill="none" stroke="rgba(255, 100, 100, 0.8)" stroke-width="4"/>
      <circle cx="${width / 2}" cy="${height / 2 - 60}" r="15"
              fill="rgba(255, 100, 100, 0.8)"/>

      <!-- Coordinates -->
      <text x="${width / 2}" y="${height / 2 + 40}"
            font-family="Courier New, monospace" font-size="48" font-weight="bold"
            text-anchor="middle" fill="rgba(0, 150, 0, 1)">
        ${puzzleData.content}
      </text>

      <!-- Label -->
      <text x="${width / 2}" y="${height / 2 + 100}"
            font-family="Georgia, serif" font-size="28"
            text-anchor="middle" fill="rgba(101, 67, 33, 0.8)">
        GPS COORDINATES
      </text>

      <text x="${width / 2}" y="${height - 80}"
            font-family="Georgia, serif" font-size="20" font-style="italic"
            text-anchor="middle" fill="rgba(101, 67, 33, 0.7)">
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
 * Process single NFT
 */
async function processNFT(artworkFile, nftId, isRarePainting = false) {
  console.log(`\n🎨 Processing NFT #${nftId}...`);

  const artworkDir = isRarePainting ? RARE_ARTWORK_DIR : RANDOM_ARTWORK_DIR;
  const artworkPath = path.join(artworkDir, artworkFile);
  const outputImagePath = path.join(OUTPUT_IMAGES, `nft_${nftId}.png`);

  // Get image dimensions
  const metadata = await sharp(artworkPath).metadata();
  const { width, height } = metadata;

  // Copy base artwork (Layer 0)
  await fs.copy(artworkPath, outputImagePath);
  console.log(`  ✓ Base artwork copied (${width}x${height})${isRarePainting ? ' [RARE LOCATION PAINTING]' : ''}`);

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
    } else if (puzzleData.type === 'coordinates') {
      overlayPath = await generateCoordinatesLayer(nftId, puzzleData, width, height);
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
    name: `Seychelles Treasure #${nftId}`,
    description: `Chapter 2: The Hidden Cache - NFT #${nftId}${puzzleData ? ' (Contains Puzzle Clue)' : ''}`,
    image: null, // Will be IPFS hash
    attributes: [
      {
        trait_type: 'Chapter',
        value: 'Chapter 2: The Hidden Cache'
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
    properties: {
      chapter: 'Chapter 2',
      puzzle_enabled: !!puzzleData,
      art_rarity: rarity,
      rarity_color: RARITY_COLORS[rarity].hex,
      layers: layers
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
async function generateTreasureHuntChapter2() {
  console.log('🏴‍☠️ TREASURE HUNT CHAPTER 2 NFT GENERATOR');
  console.log('═══════════════════════════════════════════════\n');

  // Get random artwork files
  const randomArtworkFiles = await fs.readdir(RANDOM_ARTWORK_DIR);
  const randomPngFiles = randomArtworkFiles.filter(f => f.endsWith('.png')).sort();

  if (randomPngFiles.length < 16) {
    console.error(`❌ Need 16 PNG files in ${RANDOM_ARTWORK_DIR}, found ${randomPngFiles.length}`);
    process.exit(1);
  }

  // Get rare location paintings
  const rareArtworkFiles = await fs.readdir(RARE_ARTWORK_DIR);
  const rarePngFiles = rareArtworkFiles.filter(f => f.endsWith('.png')).sort();

  if (rarePngFiles.length < 4) {
    console.error(`❌ Need 4 rare location paintings, found ${rarePngFiles.length}`);
    process.exit(1);
  }

  console.log(`📂 Found ${randomPngFiles.length} random artwork files`);
  console.log(`🎨 Found ${rarePngFiles.length} rare location paintings`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  // Process each NFT (IDs 21-40)
  const allMetadata = [];
  let randomImageIndex = 0;

  for (let nftId = 21; nftId <= 40; nftId++) {
    try {
      // Check if this NFT gets a specific rare painting
      let artworkFile;
      let isRarePainting = false;

      if (IMAGE_ASSIGNMENTS[nftId]) {
        artworkFile = IMAGE_ASSIGNMENTS[nftId];
        isRarePainting = true;
      } else {
        // Use next random image
        artworkFile = randomPngFiles[randomImageIndex];
        randomImageIndex++;
      }

      const metadata = await processNFT(artworkFile, nftId, isRarePainting);
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

  console.log('\n═══════════════════════════════════════════════');
  console.log('✅ GENERATION COMPLETE!');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`📦 20 NFTs generated (Token IDs 21-40)`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🔍 Puzzle NFTs: #25, #32, #37, #40`);
  console.log(`⭐ Rarity distribution:`);
  console.log(`   Epic: 5 | Rare: 5 | Uncommon: 5 | Common: 5`);
  console.log(`🎨 Rare location paintings: #21, #27, #28, #38\n`);
}

// Run generator
generateTreasureHuntChapter2().catch(error => {
  console.error('\n❌ Generation failed:', error);
  process.exit(1);
});
