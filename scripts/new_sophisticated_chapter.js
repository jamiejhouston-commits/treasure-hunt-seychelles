/**
 * NEW CHAPTER - SOPHISTICATED ETCHED-PAINTERLY NFT GENERATION
 * 
 * This creates a BRAND NEW CHAPTER using ONLY the sophisticated style 
 * from example art folder - NO MORE basic shapes or childlike bullshit
 * 
 * Style DNA (PERMANENTLY LOCKED FOR NEW CHAPTER):
 * - Etched parchment engraved map-card aesthetic
 * - Fine copperplate hatching and cross-hatching  
 * - Muted sepia (#C2B49B) + indigo shadows (#1E2F48) + teal accents (#2E6F73)
 * - Warm gold glints and bone/ivory highlights
 * - Textured layering - NO flat or empty spaces
 * - Elongated, angular, patterned figures in movement
 * - Seychelles cultural elements: tortoises, parrots, coco de mer, fishermen, markets
 * - Atmospheric depth: volumetric mist, light rays, spectral undertones
 * - Ritualistic, archaeological, haunted narrative puzzle mood
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NEW CHAPTER CONFIGURATION
const NEW_CHAPTER_CONFIG = {
  chapterNumber: 'VII',
  chapterName: 'The Sophisticated Seychellois Saga',
  totalCards: 20,
  styleGuarantee: 'ETCHED_PAINTERLY_ONLY',
  exampleArtReference: 'C:\\Users\\andre\\The Levasseur Treasure of Seychelles\\example art',
  bannedStyles: ['basic_shapes', 'childlike', 'cartoon', 'simple', 'flat_graphics']
};

// NEW CHAPTER MANIFEST - SOPHISTICATED CARDS ONLY
const newChapterManifest = [
  {
    id: "ch7_001",
    name: "Mahé Highlands: The Tortoise Oracle",
    rarity: "legendary",
    environment: "highland",
    humanPresence: "mambo_ritual",
    scene: "Ancient granite boulders crowned with mist as Maliya kneels beside a centuries-old giant tortoise, reading glyphs carved into its shell while five coco de mer pods glow with inner fire beneath cascading waterfalls.",
    props: [
      { name: "glowing_pods", value: 5, description: "Coco de mer pods with mystical inner light" },
      { name: "shell_glyphs", value: 8, description: "Ancient symbols carved on tortoise shell" },
      { name: "waterfall_streams", value: 3, description: "Cascading highland waterfalls" }
    ],
    sophisticatedElements: {
      culturalMotifs: ['giant_tortoise_oracle', 'highland_mist', 'carved_glyphs', 'mambo_priestess'],
      lightingTechnique: 'volumetric_waterfall_mist_with_golden_pod_glow',
      figureComposition: 'kneeling_ritual_posture_with_elongated_spiritual_gestures',
      textureLayering: 'moss_covered_granite_with_etched_symbols_and_misty_atmosphere'
    },
    stylePrompt: "Etched parchment engraved map-card of mist-crowned granite highlands. Maliya mambo witch in sea-green shawl kneeling beside ancient giant tortoise with carved shell glyphs. Five glowing coco de mer pods beneath cascading waterfalls. Fine copperplate hatching, muted sepia base #C2B49B, indigo shadows #1E2F48, warm gold pod glow. Volumetric mist, textured layering, elongated spiritual figures. 17th-century nautical chart + Seychellois folklore illustration, ritualistic archaeological mood.",
    negativePrompt: "basic shapes, childlike, cartoon, simple, flat shading, modern technology, photoreal, neon, oversaturated, low detail, extra limbs"
  },
  
  {
    id: "ch7_002", 
    name: "Praslin Market: The Spice Cipher",
    rarity: "rare",
    environment: "village",
    humanPresence: "market_vendors",
    scene: "Textile awnings flutter over woven baskets as seven black parrots perch among spice stalls while Naia traces ancient symbols hidden in turmeric patterns, the vendor's weathered hands pointing to four brass scales that hum with ancestral memories.",
    props: [
      { name: "black_parrots", value: 7, description: "Sacred black parrots among market stalls" },
      { name: "brass_scales", value: 4, description: "Ancient brass scales with mystical resonance" },
      { name: "spice_symbols", value: 9, description: "Hidden glyphs in spice arrangements" }
    ],
    sophisticatedElements: {
      culturalMotifs: ['creole_market', 'black_parrots', 'spice_trading', 'textile_awnings'],
      lightingTechnique: 'dappled_awning_shadow_with_brass_scale_gleam',
      figureComposition: 'market_interaction_with_pointing_gestures_and_parrot_movement',
      textureLayering: 'woven_basket_patterns_with_spice_dust_and_fluttering_fabric'
    },
    stylePrompt: "Etched parchment engraved map-card of bustling Praslin spice market. Naia cartographer in indigo scarf examining turmeric glyph patterns while weathered Creole vendor points to four brass scales. Seven black parrots perched among textile awnings and woven baskets. Fine copperplate hatching, market atmosphere with dappled shadows, muted sepia base with turmeric yellow accents. Elongated market figures in cultural dress, textured awning patterns. 17th-century trade route chart + Seychellois market folklore.",
    negativePrompt: "basic shapes, childlike, cartoon, simple, flat shading, modern technology, photoreal, neon, oversaturated, low detail"
  }
];

/**
 * NEW SOPHISTICATED CHAPTER GENERATOR
 * Creates a completely new chapter with ONLY sophisticated etched-painterly style
 */
class NewSophisticatedChapter {
  
  constructor() {
    this.chapterConfig = NEW_CHAPTER_CONFIG;
    this.manifest = newChapterManifest;
    this.outputDir = path.resolve(__dirname, `../content/ch${this.chapterConfig.chapterNumber.toLowerCase()}/output`);
  }
  
  /**
   * Generate the complete new chapter with sophisticated style
   */
  async generateNewChapter() {
    console.log('🎨 CREATING NEW CHAPTER WITH SOPHISTICATED STYLE');
    console.log(`📖 Chapter ${this.chapterConfig.chapterNumber}: ${this.chapterConfig.chapterName}`);
    console.log('✨ Style: Etched-painterly matching example art ONLY');
    console.log('🚫 BANNED: All basic shapes, childlike art, simple graphics');
    
    await fs.ensureDir(this.outputDir);
    
    const results = [];
    
    for (const card of this.manifest) {
      const artSpec = await this.generateSophisticatedCard(card);
      results.push(artSpec);
    }
    
    // Save chapter manifest
    const manifestPath = path.join(this.outputDir, 'sophisticated_chapter_manifest.json');
    await fs.writeJson(manifestPath, {
      chapter: this.chapterConfig,
      cards: results,
      styleGuarantee: 'SOPHISTICATED_ETCHED_PAINTERLY_ONLY',
      bannedStyles: this.chapterConfig.bannedStyles,
      exampleArtReference: this.chapterConfig.exampleArtReference
    }, { spaces: 2 });
    
    console.log(`✅ NEW CHAPTER CREATED: ${results.length} sophisticated cards`);
    console.log('🎭 ALL cards use etched-painterly style from example art');
    console.log('🔒 Basic shapes and childlike art PERMANENTLY BANNED from new chapter');
    
    return {
      chapter: this.chapterConfig.chapterNumber,
      totalCards: results.length,
      styleType: 'SOPHISTICATED_ETCHED_PAINTERLY',
      manifestPath
    };
  }
  
  /**
   * Generate individual sophisticated card
   */
  async generateSophisticatedCard(cardData) {
    const cardSpec = {
      id: cardData.id,
      name: cardData.name,
      chapter: this.chapterConfig.chapterNumber,
      rarity: cardData.rarity,
      
      // SOPHISTICATED STYLE SPECIFICATIONS
      styleType: 'ETCHED_PAINTERLY_SEYCHELLOIS',
      prompt: cardData.stylePrompt,
      negativePrompt: cardData.negativePrompt,
      
      // REQUIRED SOPHISTICATED ELEMENTS
      requiredElements: {
        medium: 'etched_parchment_engraved_map_card',
        lineQuality: 'fine_copperplate_hatching_cross_hatch',
        palette: 'muted_sepia_indigo_teal_bone_gold',
        lighting: 'directional_low_sun_moon_volumetric_mist',
        composition: 'textured_layering_no_flat_spaces',
        figures: 'elongated_angular_patterned_movement',
        culturalMotifs: cardData.sophisticatedElements.culturalMotifs,
        mood: 'ritualistic_archaeological_haunted_narrative'
      },
      
      // BANNED ELEMENTS (never allow these)
      bannedElements: this.chapterConfig.bannedStyles,
      
      props: cardData.props,
      scene: cardData.scene,
      environment: cardData.environment
    };
    
    // Save individual card specification
    const cardPath = path.join(this.outputDir, `${cardData.id}_sophisticated_spec.json`);
    await fs.writeJson(cardPath, cardSpec, { spaces: 2 });
    
    console.log(`🎨 Sophisticated spec created: ${cardData.name}`);
    
    return cardSpec;
  }
}

export default NewSophisticatedChapter;