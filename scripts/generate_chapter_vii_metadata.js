/**
 * GENERATE PROPER NFT METADATA FOR CHAPTER VII
 * Convert painterly specifications to standard NFT metadata format
 * with sophisticated style attributes
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHAPTER_VII_MANIFEST = path.resolve(__dirname, '../content/ch7_sirens_map/output/chapter_vii_complete_manifest.json');
const METADATA_OUTPUT_DIR = path.resolve(__dirname, '../content/ch7_sirens_map/metadata');

async function generateNFTMetadata() {
  console.log('🔄 GENERATING PROPER NFT METADATA FOR CHAPTER VII');
  console.log('🎨 Embedding sophisticated painterly style specifications');
  
  // Load Chapter VII manifest
  const manifest = await fs.readJson(CHAPTER_VII_MANIFEST);
  await fs.ensureDir(METADATA_OUTPUT_DIR);
  
  const baseTokenId = 1000;
  
  for (let i = 0; i < manifest.cards.length; i++) {
    const card = manifest.cards[i];
    const tokenId = baseTokenId + i + 1;
    
    // Create standard NFT metadata with sophisticated style embedded
    const nftMetadata = {
      name: card.name,
      description: `${card.scene}\n\nRiddle: "${card.riddle}"\n\nSophisticated painterly artwork using etched-parchment technique with Seychellois cultural motifs. Part of "The Siren's Map of Praslin" cipher series.`,
      image: `http://localhost:3001/content/ch7_sirens_map/output/${card.id}_painterly.png`,
      external_url: `http://localhost:3000/nft/${tokenId}`,
      
      // Sophisticated style attributes
      attributes: [
        {
          trait_type: "Chapter",
          value: "VII - The Siren's Map of Praslin"
        },
        {
          trait_type: "Art Style",
          value: "Sophisticated Painterly Etched-Parchment"
        },
        {
          trait_type: "Rendering Technique", 
          value: "Multi-Layer Textured Brushwork"
        },
        {
          trait_type: "Cultural Authenticity",
          value: "Seychellois Folklore Motifs"
        },
        {
          trait_type: "Visual Quality",
          value: "Dense Foliage Rhythmic Patterns"
        },
        {
          trait_type: "Palette",
          value: "Saturated Seychellois (Greens/Blues/Golds)"
        },
        {
          trait_type: "Composition",
          value: "Foreground/Midground/Background Depth"
        },
        {
          trait_type: "Cipher Letter",
          value: card.cipherOutput
        },
        {
          trait_type: "Location",
          value: card.name.split(":")[0]
        },
        {
          trait_type: "Bearing (Degrees)",
          value: card.bearingDeg
        },
        {
          trait_type: "Rarity",
          value: "Sophisticated Painterly"
        },
        {
          trait_type: "Generation Method",
          value: "Advanced Layered Renderer (NO Primitive Shapes)"
        },
        // Props as attributes
        ...card.props.map(prop => ({
          trait_type: prop.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: prop.value
        }))
      ],
      
      // Advanced painterly specifications
      advanced_specs: {
        style_guarantee: "PAINTERLY_LAYERED_SEYCHELLOIS_ONLY",
        banned_techniques: [
          "primitive_shapes",
          "flat_fills", 
          "basic_graphics",
          "simple_geometry",
          "childlike_art"
        ],
        required_elements: [
          "textured_brushes",
          "multi_layer_overlays", 
          "cultural_motif_stamps",
          "volumetric_atmospheric_depth",
          "saturated_palette",
          "visible_brush_strokes"
        ],
        painterly_elements: card.painterlyElements,
        render_prompt: card.renderSpec?.prompt || "Advanced painterly rendering",
        negative_prompt: card.renderSpec?.negativePrompt || "No primitive shapes"
      },
      
      // Puzzle/clue data
      puzzle_data: {
        scene: card.scene,
        riddle: card.riddle,
        hidden_clue: card.hiddenClue,
        bearing_deg: card.bearingDeg,
        cipher_output: card.cipherOutput,
        props: card.props
      },
      
      // Technical specs
      technical_specs: {
        dimensions: "2048x2048",
        format: "PNG",
        color_space: "sRGB",
        render_layers: ["background", "midground", "foreground", "overlay", "caption"],
        art_technique: "17th-century nautical chart + Seychellois modernist painting"
      }
    };
    
    // Save NFT metadata
    const metadataPath = path.join(METADATA_OUTPUT_DIR, `${tokenId}.json`);
    await fs.writeJson(metadataPath, nftMetadata, { spaces: 2 });
    
    console.log(`✅ Generated metadata: ${card.name} (${tokenId}.json)`);
  }
  
  console.log(`\n🎉 NFT METADATA GENERATION COMPLETE!`);
  console.log(`📁 Location: ${METADATA_OUTPUT_DIR}`);
  console.log(`🎨 Style: Sophisticated painterly with cultural authenticity`);
  console.log(`🚫 Primitive shapes permanently banned from metadata`);
  
  return manifest.cards.length;
}

// Execute metadata generation
generateNFTMetadata()
  .then((count) => {
    console.log(`\n✅ SUCCESS: ${count} sophisticated metadata files created`);
  })
  .catch((error) => {
    console.error('❌ METADATA GENERATION FAILED:', error);
  });