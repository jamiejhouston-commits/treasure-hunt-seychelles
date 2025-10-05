import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage, registerFont } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chapter 3 NFT Specifications - EXACT as provided by user
const CHAPTER3_CARDS = [
  {
    id: 1,
    name: "Chapter 3 – Card 01: Landing at Anse Gaulette",
    description: "The pirates anchor offshore at Anse Gaulette, unloading mysterious crates under moonlight. A chest lies buried near palm trees, marking the beginning of Levasseur's inland journey. The coordinates whisper of treasures yet to come.",
    location: "Anse Gaulette, Mahé",
    symbol: "Buried Chest",
    rarity: "Legendary",
    storyFragment: "The landing begins",
    metadataClue: "Coordinates: -4.7378°, 55.4419° - Anse Gaulette landing site",
    visualDescription: "Ship anchored offshore at night, pirates unloading wooden crates on beach, hidden chest buried near palm trees, moonlight on water, fog rolling in from ocean, skull and crossbones flag on ship mast, compass rose in sand"
  },
  {
    id: 2,
    name: "Chapter 3 – Card 02: The Carved Rock",
    description: "Ancient granite bears the scars of pirate chisels, strange symbols and numbers carved deep into weathered stone. These cryptic markings hold secrets that only the initiated can decode. The rock remembers what men forget.",
    location: "Granite outcrops, Mahé interior",
    symbol: "Cipher Carvings",
    rarity: "Epic",
    storyFragment: "Symbols in stone",
    metadataClue: "Cipher fragment: L-7-V-12-R - decode with moon phases",
    visualDescription: "Weathered granite rock face with deep carved pirate symbols, numbers etched in stone, moss growing over ancient markings, pirate cutlass stuck in crevice, parrot perched nearby, mysterious glyphs and compass directions"
  },
  {
    id: 3,
    name: "Chapter 3 – Card 03: Fog at Lazare Picault",
    description: "The mountain peak vanishes into ghostly mist, while a compass rose glows faintly through the fog. From this vantage point, Levasseur surveyed his kingdom and planned his final deception. The mist hides more than it reveals.",
    location: "Lazare Picault viewpoint, Mahé",
    symbol: "Glowing Compass",
    rarity: "Rare",
    storyFragment: "Direction in mist",
    metadataClue: "Directional riddle: When fog lifts at dawn, follow the compass true north",
    visualDescription: "Mountain peak shrouded in thick fog, glowing compass rose floating in mist, ghostly ship silhouettes in distance, pirate telescope on wooden tripod, treasure map pinned to tree, mysterious light through clouds"
  },
  {
    id: 4,
    name: "Chapter 3 – Card 04: The Hidden Waterfall",
    description: "Behind cascading waters at Sans Souci, shadows hint at buried treasure. The waterfall's roar masks the secrets carved into the cavern walls. What lies behind the veil of water has waited centuries to be discovered.",
    location: "Sans Souci waterfalls, Mahé",
    symbol: "Shadow Chest",
    rarity: "Epic",
    storyFragment: "Behind the veil",
    metadataClue: "Numerical pattern: 3-7-11-19 - prime numbers point to treasure depth",
    visualDescription: "Cascading waterfall with mist, dark shadow of treasure chest behind water curtain, carved symbols on wet rock face, pirate lantern glowing through spray, rope ladder hanging from cliff, mysterious cave entrance"
  },
  {
    id: 5,
    name: "Chapter 3 – Card 05: The Pirate's Parrot",
    description: "A scarlet parrot perches on a broken mast, clutching a torn map fragment in its talons. This faithful companion guards the secrets of its departed master. The scroll holds coordinates to the next clue in Levasseur's puzzle.",
    location: "Shipwreck remnants, Anse Gaulette",
    symbol: "Map Fragment",
    rarity: "Rare",
    storyFragment: "Faithful guardian",
    metadataClue: "Torn map piece: ...SE corner of island, 15 paces from twisted palm...",
    visualDescription: "Scarlet parrot on broken ship mast, holding torn parchment scroll, shipwreck remnants on beach, treasure chest partially buried in sand, pirate hat on driftwood, skull embedded in broken timber"
  },
  {
    id: 6,
    name: "Chapter 3 – Card 06: Cave of Echoes",
    description: "Torchlight flickers across pirate carvings in this hidden cavern, where every whisper echoes with the voices of the past. The walls bear witness to Levasseur's secret meetings and coded messages etched in stone.",
    location: "Hidden caves, Mahé interior",
    symbol: "Echo Carvings",
    rarity: "Epic",
    storyFragment: "Voices in darkness",
    metadataClue: "Coordinate digits hidden in wall symbols: 4°-47'-22'' S",
    visualDescription: "Dark cave interior with flickering torches, pirate symbols carved in stone walls, treasure chests in shadows, skull decorations, compass rose etched in floor, mysterious echoing chamber with stalactites"
  },
  {
    id: 7,
    name: "Chapter 3 – Card 07: The Compass in the Sand",
    description: "Half-buried in the shifting sands, an ornate compass points steadfastly northwest toward unknown treasures. Time and tide have claimed much, but this brass instrument still holds true to its purpose.",
    location: "Anse Gaulette beach",
    symbol: "Buried Compass",
    rarity: "Rare",
    storyFragment: "True direction",
    metadataClue: "Partial direction: NW 315° - follow to next landmark at high tide",
    visualDescription: "Ornate brass compass half-buried in sand, pointing northwest, waves washing over it, pirate coins scattered nearby, seashells and coral, footprints leading inland, ship anchor in background"
  },
  {
    id: 8,
    name: "Chapter 3 – Card 08: Port Launay Shadows",
    description: "Under the pale moonlight, ghostly ship silhouettes dance across the tranquil waters of Port Launay. These spectral vessels carry the souls of Levasseur's crew, forever bound to guard their captain's treasure.",
    location: "Port Launay Marine Park",
    symbol: "Ghost Ships",
    rarity: "Legendary",
    storyFragment: "Spectral guardians",
    metadataClue: "Riddle tied to tides: When moon is full and tide runs low, the spirits show the way to go",
    visualDescription: "Moonlit bay with ghostly transparent ship silhouettes on water, pale moonlight reflecting on waves, spectral pirates on deck, fog rolling across harbor, mysterious lights on ghost ships, peaceful marine park setting"
  },
  {
    id: 9,
    name: "Chapter 3 – Card 09: The Rock Pool Secret",
    description: "In the still waters of the rock pool, a skull pattern emerges in the reflection, visible only to those who know where to look. This natural mirror holds the key to deciphering Levasseur's most guarded cipher.",
    location: "Rock Pool, Anse Takamaka",
    symbol: "Skull Reflection",
    rarity: "Epic",
    storyFragment: "Mirror of truth",
    metadataClue: "Cipher key fragment: SKULL-REFLECTION-DECODE-3X7",
    visualDescription: "Circular rock pool with clear water, skull pattern reflection visible in water surface, pirate bones at pool edge, compass rose ripples in water, carved symbols on pool rim, mysterious underwater glow"
  },
  {
    id: 10,
    name: "Chapter 3 – Card 10: The Watcher's Skull",
    description: "A skull mounted on a weathered pole serves as both warning and guide to passing treasure hunters. This grim sentinel marks the boundary between false paths and true treasure routes.",
    location: "Trail junction, Mahé interior",
    symbol: "Warning Skull",
    rarity: "Rare",
    storyFragment: "Grim warning",
    metadataClue: "False path vs true path: Left leads to death, right leads to wealth",
    visualDescription: "Skull mounted on wooden pole at trail crossroads, weathered bone gleaming in moonlight, two diverging paths, pirate warning signs, scattered bones around pole base, ominous atmosphere with fog"
  },
  {
    id: 11,
    name: "Chapter 3 – Card 11: Map Fragment I",
    description: "This torn parchment reveals half of a crucial coastline, its edges burned and weathered by time. The remaining piece holds secrets that complete the puzzle of Levasseur's hidden route to unimaginable wealth.",
    location: "Various Mahé locations",
    symbol: "Torn Parchment",
    rarity: "Legendary",
    storyFragment: "Half the truth",
    metadataClue: "Half coordinate: -4.7378°, 55.44__ (missing eastern digits)",
    visualDescription: "Torn parchment map showing half a coastline, burned and weathered edges, compass rose in corner, pirate navigation symbols, wax seal partially intact, candlelight illuminating ancient paper"
  },
  {
    id: 12,
    name: "Chapter 3 – Card 12: The Crossed Blades",
    description: "Two cutlasses driven deep into the earth mark a sacred spot where treasure hunters dare not tread. The Latin inscription warns of curses while revealing clues to those brave enough to decipher its meaning.",
    location: "Secret burial ground, Mahé",
    symbol: "Crossed Cutlasses",
    rarity: "Epic",
    storyFragment: "Sacred warning",
    metadataClue: "Latin phrase: 'Hic iacet thesaurus' - Here lies the treasure",
    visualDescription: "Two crossed cutlasses driven into ground, Latin inscription carved in stone beneath, treasure markings around blade intersection, skull decorations, candlelit ritual circle, mysterious fog swirling"
  },
  {
    id: 13,
    name: "Chapter 3 – Card 13: Coconut Grove Ambush",
    description: "Pirates lurk among the coconut palms with bulging treasure bags, ready to strike or hide depending on who approaches. This grove has witnessed betrayals, alliances, and the division of Levasseur's legendary hoard.",
    location: "Coconut plantation, Mahé",
    symbol: "Betrayal Mark",
    rarity: "Rare",
    storyFragment: "Trust no one",
    metadataClue: "Symbol for betrayal: Dagger through heart - marks false allies",
    visualDescription: "Pirates hiding among tall coconut palms, bulging treasure bags at their feet, cutlasses drawn, moonlight filtering through palm fronds, buried chests visible in background, atmosphere of suspicion and danger"
  },
  {
    id: 14,
    name: "Chapter 3 – Card 14: The Sunken Chest",
    description: "Beneath crystal-clear waters lies a treasure chest, its contents protected by curious fish that seem to guard this aquatic vault. The numbers carved on its surface reveal a sequence known only to Levasseur's inner circle.",
    location: "Underwater cave, Port Launay",
    symbol: "Aquatic Vault",
    rarity: "Epic",
    storyFragment: "Underwater guardian",
    metadataClue: "Hidden number sequence: 1-4-1-5-9-2-6 (pi digits reversed)",
    visualDescription: "Treasure chest underwater in clear blue water, tropical fish swimming around it as guardians, numbers carved on chest surface, coral formations, sunlight streaming through water, diver's skeleton nearby"
  },
  {
    id: 15,
    name: "Chapter 3 – Card 15: Torch of Secrets",
    description: "A pirate holds his torch high, its flame revealing cryptic writing carved into the cavern wall. These secret symbols have remained hidden in darkness for centuries, waiting for the right light to illuminate their meaning.",
    location: "Secret chamber, Mahé caves",
    symbol: "Illuminated Script",
    rarity: "Rare",
    storyFragment: "Light reveals truth",
    metadataClue: "Cryptogram fragment: FIRE-LIGHT-REVEALS-HIDDEN-PATH",
    visualDescription: "Pirate in tricorn hat holding flaming torch high, cryptic symbols revealed on stone wall by firelight, treasure chest in shadows, ancient writing glowing in torch flame, mysterious atmosphere in cave chamber"
  },
  {
    id: 16,
    name: "Chapter 3 – Card 16: The False Trail",
    description: "Footprints diverge into two distinct paths, one leading to fortune and one to doom. The wise treasure hunter must choose carefully, for Levasseur delighted in creating traps for the greedy and unwary.",
    location: "Mountain trails, Mahé",
    symbol: "Diverging Paths",
    rarity: "Rare",
    storyFragment: "Critical choice",
    metadataClue: "Riddle about choices: The right path leads up, the wrong path leads down",
    visualDescription: "Two sets of footprints diverging at mountain trail junction, one path leading upward to light, other downward into darkness, compass arrow pointing between paths, skull warning at wrong path entrance"
  },
  {
    id: 17,
    name: "Chapter 3 – Card 17: Map Fragment II",
    description: "The second half of the torn coastline parchment completes the puzzle, revealing the full coordinates that have eluded treasure hunters for generations. Together with its companion piece, it unlocks Levasseur's greatest secret.",
    location: "Various Mahé locations",
    symbol: "Completed Map",
    rarity: "Legendary",
    storyFragment: "The full truth",
    metadataClue: "Completes coordinate: -4.7378°, 55.4419° (full location revealed)",
    visualDescription: "Second half of torn parchment map, edges perfectly matching first fragment, complete coastline now visible, compass rose complete, wax seal intact, candlelight showing joined map pieces"
  },
  {
    id: 18,
    name: "Chapter 3 – Card 18: The Pirate's Ghost",
    description: "A spectral figure points toward the inland mountains, his ghostly form flickering between the world of the living and the realm of the dead. This phantom guide knows secrets that died with Levasseur's crew.",
    location: "Mountain viewpoint, Mahé",
    symbol: "Spectral Guide",
    rarity: "Legendary",
    storyFragment: "Beyond the veil",
    metadataClue: "Ghostly riddle: Follow where the dead man points, to where the living fear to go",
    visualDescription: "Translucent ghost of pirate captain pointing toward mountain peaks, ethereal glow around spectral figure, mountain landscape in background, ghostly ship in clouds, otherworldly mist and supernatural atmosphere"
  },
  {
    id: 19,
    name: "Chapter 3 – Card 19: The Final Cave",
    description: "Deep within the earth, a cavern glows with the faint outline of ultimate treasure. This chamber represents the culmination of Chapter 3's journey, where all clues converge in preparation for the final revelation.",
    location: "Deep caves, Mahé interior",
    symbol: "Ultimate Vault",
    rarity: "Legendary",
    storyFragment: "Journey's end",
    metadataClue: "Chapter 3 closing cipher: THE-CAVE-HOLDS-KEYS-TO-CHAPTER-FOUR",
    visualDescription: "Deep cavern with glowing treasure outline on walls, mysterious golden light emanating from cave depths, stalactites and stalagmites forming natural cathedral, ancient pirate artifacts scattered throughout"
  },
  {
    id: 20,
    name: "Chapter 3 – Card 20: Chapter Finale – Torn Map Piece",
    description: "A partially burned map fragment reveals an arrow pointing toward a distant island, teasing the next chapter of Levasseur's saga. This final piece of Chapter 3 promises even greater adventures and treasures await in uncharted waters.",
    location: "Final revelation chamber",
    symbol: "Chapter Conclusion",
    rarity: "Mythical",
    storyFragment: "The End",
    metadataClue: "Chapter 3 Conclusion: The treasure hunt reaches its final moment - adventure complete",
    visualDescription: "Partially burned parchment marking the end of the quest, map edges singed but revealing the ultimate secret, compass rose pointing to completion, treasure chest finally revealed, marking the successful conclusion of this chapter"
  }
];

// Create images generation function
async function generateChapter3Image(card) {
  console.log(`🎨 Generating artwork for: ${card.name}`);
  
  // Canvas setup for cinematic pirate artwork
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');

  // Background - ocean/cave/jungle based on location
  const gradient = ctx.createLinearGradient(0, 0, 0, 800);
  
  // Location-specific backgrounds
  if (card.location.includes('beach') || card.location.includes('Anse')) {
    // Ocean/beach scene
    gradient.addColorStop(0, '#1a1a2e'); // Dark sky
    gradient.addColorStop(0.5, '#16213e'); // Horizon
    gradient.addColorStop(1, '#0f3460'); // Deep ocean
  } else if (card.location.includes('cave') || card.location.includes('chamber')) {
    // Cave scene
    gradient.addColorStop(0, '#0d0d0d'); // Cave ceiling
    gradient.addColorStop(0.5, '#1a1a1a'); // Cave walls
    gradient.addColorStop(1, '#0f0f0f'); // Cave floor
  } else {
    // Mountain/jungle scene
    gradient.addColorStop(0, '#2c1810'); // Dark sky
    gradient.addColorStop(0.5, '#1f2014'); // Mountain/jungle
    gradient.addColorStop(1, '#1a1a0f'); // Ground
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);

  // Add fog/mist layer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 200, 800, 200);

  // Pirate-themed elements based on card content
  ctx.fillStyle = '#d4af37'; // Gold color for treasure elements
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'center';
  
  // Main symbol in center
  ctx.fillStyle = '#8b4513'; // Brown for wooden elements
  ctx.fillRect(300, 300, 200, 200); // Treasure chest base
  
  // Add metallic details
  ctx.fillStyle = '#c0c0c0'; // Silver for metal
  ctx.fillRect(290, 290, 20, 220); // Chest corner
  ctx.fillRect(490, 290, 20, 220); // Chest corner
  
  // Skull and crossbones
  ctx.fillStyle = '#f5f5dc'; // Bone color
  ctx.beginPath();
  ctx.arc(400, 200, 30, 0, Math.PI * 2); // Skull
  ctx.fill();
  
  // Eye sockets
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(390, 190, 8, 0, Math.PI * 2);
  ctx.arc(410, 190, 8, 0, Math.PI * 2);
  ctx.fill();

  // Crossbones
  ctx.fillStyle = '#f5f5dc';
  ctx.fillRect(350, 220, 100, 8); // Horizontal bone
  ctx.fillRect(396, 174, 8, 100); // Vertical bone

  // Add compass rose
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(400, 600, 80, 0, Math.PI * 2);
  ctx.stroke();
  
  // Compass points
  const points = ['N', 'E', 'S', 'W'];
  const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 20px serif';
  
  for (let i = 0; i < 4; i++) {
    const x = 400 + Math.cos(angles[i] - Math.PI/2) * 60;
    const y = 600 + Math.sin(angles[i] - Math.PI/2) * 60;
    ctx.fillText(points[i], x, y);
  }

  // Add atmospheric effects
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 800;
    const y = Math.random() * 800;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Card title
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 28px serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.name.split(':')[1] || card.name, 400, 100);

  // Location subtitle
  ctx.fillStyle = '#c0c0c0';
  ctx.font = '18px serif';
  ctx.fillText(card.location, 400, 750);

  // Save image
  const buffer = canvas.toBuffer('image/png');
  const filename = `chapter3_${card.id.toString().padStart(2, '0')}.png`;
  const filepath = path.join(__dirname, 'dist', 'images', 'chapter3', filename);
  
  // Ensure directory exists
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, buffer);
  
  console.log(`✅ Generated: ${filename}`);
  return filename;
}

// Create metadata for each card
function generateChapter3Metadata(card, imageCid) {
  return {
    name: card.name,
    description: card.description,
    image: `ipfs://${imageCid}`,
    external_url: "https://treasureofseychelles.com",
    attributes: [
      { trait_type: "Chapter", value: "Chapter 3" },
      { trait_type: "Location", value: card.location },
      { trait_type: "Symbol", value: card.symbol },
      { trait_type: "Rarity", value: card.rarity },
      { trait_type: "StoryFragment", value: card.storyFragment },
      { trait_type: "MetadataClue", value: card.metadataClue }
    ],
    properties: {
      chapter: 3,
      card_number: card.id,
      story_arc: "The Landing and Exploration",
      treasure_hunt_tier: "Advanced"
    }
  };
}

// Main pipeline function
async function main() {
  console.log('🏴‍☠️ CHAPTER 3 - VASA NFT COLLECTION');
  console.log('=====================================');
  console.log('Generating 20 cinematic pirate NFTs...');
  console.log('⚠️  GENERATING FOR APPROVAL ONLY - NOT MINTING YET ⚠️');
  console.log('');

  const generatedImages = [];
  const generatedMetadata = [];

  // Phase 1: Generate all 20 images
  console.log('🎨 Phase 1: Generating Chapter 3 Images...');
  for (const card of CHAPTER3_CARDS) {
    const filename = await generateChapter3Image(card);
    generatedImages.push({
      card: card,
      filename: filename,
      filepath: path.join(__dirname, 'dist', 'images', 'chapter3', filename)
    });
  }
  console.log('✅ All 20 images generated');

  // Phase 2: Generate metadata (without IPFS CIDs for now)
  console.log('📝 Phase 2: Generating Chapter 3 Metadata...');
  for (const card of CHAPTER3_CARDS) {
    const metadata = generateChapter3Metadata(card, 'PLACEHOLDER_CID');
    generatedMetadata.push({
      card: card,
      metadata: metadata
    });
  }
  console.log('✅ All 20 metadata files generated');

  // Save summary for review
  const summary = {
    chapter: 3,
    total_cards: 20,
    theme: "The Landing and Exploration at Anse Gaulette",
    status: "GENERATED FOR APPROVAL - NOT MINTED",
    cards: CHAPTER3_CARDS.map(card => ({
      id: card.id,
      name: card.name,
      location: card.location,
      symbol: card.symbol,
      rarity: card.rarity,
      clue: card.metadataClue
    })),
    generated_files: {
      images: generatedImages.map(img => img.filename),
      metadata_ready: true
    },
    next_steps: [
      "1. Review all generated images",
      "2. Review all metadata content", 
      "3. Get explicit approval from user",
      "4. ONLY THEN proceed to IPFS upload and minting"
    ]
  };

  const summaryPath = path.join(__dirname, 'dist', 'chapter3_generation_summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

  console.log('');
  console.log('🎯 CHAPTER 3 GENERATION COMPLETE');
  console.log('================================');
  console.log(`📁 Images saved to: ${path.join(__dirname, 'dist', 'images', 'chapter3')}`);
  console.log(`📋 Summary saved to: ${summaryPath}`);
  console.log('');
  console.log('⚠️  WAITING FOR YOUR APPROVAL ⚠️');
  console.log('Please review all 20 images and metadata before minting!');
  console.log('');
}

// Execute if run directly
if (import.meta.url === `file://${__filename}`) {
  main().catch(console.error);
}

export { CHAPTER3_CARDS, generateChapter3Image, generateChapter3Metadata };