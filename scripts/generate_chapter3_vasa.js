import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import xrpl from 'xrpl';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chapter 3 VASA Collection - 20 NFTs
const CHAPTER3_CARDS = [
  {
    index: 1,
    name: "Chapter 3 – Card 01: Landing at Anse Gaulette",
    description: "The pirates have finally reached the legendary landing site. A weathered ship anchors in the turquoise waters as crew members unload mysterious crates under cover of dawn mist.",
    location: "Anse Gaulette, Mahé",
    symbol: "Buried Chest",
    rarity: "Epic",
    storyFragment: "The sacred landing where Levasseur's crew first touched Seychelles soil",
    visualElements: [
      "Pirate ship anchored offshore in turquoise water",
      "Pirates unloading wooden crates onto beach",
      "Hidden treasure chest buried near palm trees",
      "Dawn mist rolling over the bay",
      "Skull and crossbones flag on ship mast",
      "Compass rose carved in beach sand"
    ],
    metadataClue: "Coordinates: -4.7333, 55.5167 - Where the journey begins"
  },
  {
    index: 2,
    name: "Chapter 3 – Card 02: The Carved Rock",
    description: "Ancient granite bears the scars of pirate blades. Strange symbols and numbers tell a story only the initiated can read, carved deep by those who came before.",
    location: "Granite Formations, Mahé",
    symbol: "Cipher Markings",
    rarity: "Rare",
    storyFragment: "Cryptic messages left by Levasseur's advance scouts",
    visualElements: [
      "Weathered granite rock face",
      "Deep-carved pirate symbols and numbers",
      "Moss and lichen partially covering carvings",
      "Tropical vegetation framing the rock",
      "Skull motif carved prominently",
      "Compass direction arrows in stone"
    ],
    metadataClue: "Cipher Fragment: 'XIII + VII = XX, follow the rising sun'"
  },
  {
    index: 3,
    name: "Chapter 3 – Card 03: Fog at Lazare Picault",
    description: "The mountain peak shrouds its secrets in ethereal mist. Through the fog, a compass rose glows with supernatural light, guiding those brave enough to climb.",
    location: "Lazare Picault Viewpoint, Mahé",
    symbol: "Glowing Compass",
    rarity: "Legendary",
    storyFragment: "The mystical viewpoint where directions become clear",
    visualElements: [
      "Mountain peak shrouded in thick mist",
      "Glowing compass rose floating in fog",
      "Silhouettes of twisted trees",
      "Ocean vista barely visible through clouds",
      "Ethereal light beams through mist",
      "Pirate hat abandoned on rocky outcrop"
    ],
    metadataClue: "Directional Riddle: 'When mist clears at dawn, follow the golden ray northwest'"
  },
  {
    index: 4,
    name: "Chapter 3 – Card 04: The Hidden Waterfall",
    description: "Behind cascading waters lies more than stone. The shadow of treasure chest haunts the misty veil, promising riches to those who dare step beyond the fall.",
    location: "Sans Souci Waterfall, Mahé",
    symbol: "Waterfall Chest",
    rarity: "Epic",
    storyFragment: "Nature's vault conceals the crew's emergency cache",
    visualElements: [
      "Cascading waterfall with mist spray",
      "Dark shadow of treasure chest behind water curtain",
      "Lush tropical vegetation around falls",
      "Rainbow in waterfall mist",
      "Pirate rope ladder hanging from cliff",
      "Skull carved into cliff face"
    ],
    metadataClue: "Numerical Pattern: 3-7-11-? (Count the falls to find the next)"
  },
  {
    index: 5,
    name: "Chapter 3 – Card 05: The Pirate's Parrot",
    description: "Polly knows more than she squawks. Perched on a broken mast, she clutches a scroll fragment that may hold the key to everything the crew seeks.",
    location: "Shipwreck Site, Mahé Coast",
    symbol: "Scroll Fragment",
    rarity: "Rare",
    storyFragment: "The captain's faithful companion guards crucial intelligence",
    visualElements: [
      "Colorful parrot perched on broken ship mast",
      "Torn scroll fragment in parrot's talon",
      "Shipwreck debris scattered on beach",
      "Tropical sunset in background",
      "Pirate hat floating in tide pool",
      "Message bottle half-buried in sand"
    ],
    metadataClue: "Torn Map Piece: '...cave entrance marked by three palms...'"
  },
  {
    index: 6,
    name: "Chapter 3 – Card 06: Cave of Echoes",
    description: "Torchlight flickers against ancient walls where pirates carved their deepest secrets. Every whisper echoes with the promise of gold and the threat of death.",
    location: "Hidden Cave System, Mahé",
    symbol: "Torch Carvings",
    rarity: "Epic",
    storyFragment: "The crew's secret meeting place where plans were made",
    visualElements: [
      "Dark cave entrance with flickering torches",
      "Pirate symbols carved deep in stone walls",
      "Shadows dancing in torchlight",
      "Skull and crossbones motifs on walls",
      "Mysterious passages leading deeper",
      "Pirate cutlass embedded in cave wall"
    ],
    metadataClue: "Coordinate Digits: 'VII-V hidden in wall symbols, seek the southern passage'"
  },
  {
    index: 7,
    name: "Chapter 3 – Card 07: The Compass in the Sand",
    description: "Half-buried by time and tide, the brass compass still points true. Its needle seeks northwest, toward secrets that lie beyond the horizon.",
    location: "Anse Gaulette Beach, Mahé",
    symbol: "Buried Compass",
    rarity: "Rare",
    storyFragment: "Navigation tool left as breadcrumb for the next crew",
    visualElements: [
      "Brass compass half-buried in white sand",
      "Compass needle pointing northwest",
      "Seashells and coral fragments around compass",
      "Tide marks in sand showing recent water",
      "Palm tree shadow falling across compass",
      "Pirate coin partially visible in sand"
    ],
    metadataClue: "Partial Direction: 'Northwest 47 degrees, count the waves to shore'"
  },
  {
    index: 8,
    name: "Chapter 3 – Card 08: Port Launay Shadows",
    description: "Under moonlight, ghostly ships sail again in this haunted bay. The shadows of vessels long sunk dance on waters that remember every secret they've carried.",
    location: "Port Launay Marine Park, Mahé",
    symbol: "Ghost Ship",
    rarity: "Legendary",
    storyFragment: "Phantom vessels guard the marine sanctuary's darkest secret",
    visualElements: [
      "Moonlit bay with calm waters",
      "Ghostly transparent ship silhouettes",
      "Misty ethereal atmosphere",
      "Mangrove shadows on water surface",
      "Pirate lantern glowing on ghost ship",
      "Skull reflection in moonlit water"
    ],
    metadataClue: "Tide Riddle: 'When moon is full and tide is high, the phantom cargo comes to light'"
  },
  {
    index: 9,
    name: "Chapter 3 – Card 09: The Rock Pool Secret",
    description: "Still waters run deep with secrets. The pool's reflection reveals what the eye cannot see - a skull pattern that points to treasure beyond imagination.",
    location: "Tidal Rock Pools, Mahé",
    symbol: "Skull Reflection",
    rarity: "Epic",
    storyFragment: "Natural mirror reveals hidden truths to the observant",
    visualElements: [
      "Circular tidal rock pool with crystal clear water",
      "Skull pattern reflected in water surface",
      "Tropical fish swimming beneath reflection",
      "Coral formations around pool edges",
      "Pirate dagger pointing toward pool",
      "Mysterious runes carved in pool rim"
    ],
    metadataClue: "Cipher Key Fragment: 'Reflection shows truth: A=1, S=19, K=11'"
  },
  {
    index: 10,
    name: "Chapter 3 – Card 10: The Watcher's Skull",
    description: "Death stands sentinel on a weathered pole, warning travelers of the price of greed. This marker divides the true path from the false, for those wise enough to read its meaning.",
    location: "Jungle Trail, Mahé Interior",
    symbol: "Warning Skull",
    rarity: "Rare",
    storyFragment: "Pirate marker warning of false trails and true dangers",
    visualElements: [
      "Human skull mounted on wooden pole",
      "Jungle vines growing around pole",
      "Two diverging paths in dense vegetation",
      "Warning symbols carved into pole",
      "Pirate bandana tied to pole",
      "Mysterious fog swirling around base"
    ],
    metadataClue: "Path Riddle: 'Left leads to death, right to gold, choose wisely bold'"
  },
  {
    index: 11,
    name: "Chapter 3 – Card 11: Map Fragment I",
    description: "Time and salt have torn this precious document, but what remains shows half the coastline that leads to untold riches. The other half awaits discovery.",
    location: "Pirate Camp, Mahé",
    symbol: "Torn Parchment",
    rarity: "Epic",
    storyFragment: "First half of the master map, carefully preserved",
    visualElements: [
      "Torn parchment map showing coastline",
      "Aged yellow paper with brown edges",
      "Red X marking treasure location",
      "Compass rose in corner of map",
      "Pirate writing in faded ink",
      "Wax seal partially visible"
    ],
    metadataClue: "Half Coordinate: 'S 4° 44' -- E 55° 31' (western fragment)'"
  },
  {
    index: 12,
    name: "Chapter 3 – Card 12: The Crossed Blades",
    description: "Two cutlasses driven deep into sacred ground mark where gold lies buried. The Latin inscription speaks of honor among thieves and death to betrayers.",
    location: "Sacred Grove, Mahé",
    symbol: "Crossed Cutlasses",
    rarity: "Legendary",
    storyFragment: "Burial site of the crew's most precious treasure",
    visualElements: [
      "Two pirate cutlasses crossed and driven into ground",
      "Latin inscription carved in nearby stone",
      "Treasure chest partially visible beneath blades",
      "Sacred grove with ancient trees",
      "Mystical light filtering through canopy",
      "Pirate coins scattered around blades"
    ],
    metadataClue: "Latin Phrase: 'Fideles usque ad mortem' - Faithful unto death"
  },
  {
    index: 13,
    name: "Chapter 3 – Card 13: Coconut Grove Ambush",
    description: "In paradise lurks treachery. Pirates emerge from coconut shadows with treasure bags, their eyes gleaming with the madness that gold brings to desperate men.",
    location: "Coconut Plantation, Mahé",
    symbol: "Betrayal Mark",
    rarity: "Rare",
    storyFragment: "Where greed turned brother against brother",
    visualElements: [
      "Pirates lurking behind coconut palms",
      "Treasure bags bulging with gold coins",
      "Coconuts scattered on ground",
      "Menacing expressions on pirate faces",
      "Cutlasses drawn and ready",
      "Blood red sunset through palm fronds"
    ],
    metadataClue: "Betrayal Symbol: 'Trust no man when gold is near - marked by crossed daggers'"
  },
  {
    index: 14,
    name: "Chapter 3 – Card 14: The Sunken Chest",
    description: "Beneath crystal waters lies a fortune guarded by creatures of the deep. The chest waits patiently for one brave enough to claim its waterlogged treasures.",
    location: "Underwater Cave, Mahé Coast",
    symbol: "Submerged Treasure",
    rarity: "Epic",
    storyFragment: "Emergency cache hidden beneath the waves",
    visualElements: [
      "Treasure chest on sandy ocean floor",
      "Tropical fish swimming around chest",
      "Coral growing on chest edges",
      "Sunlight filtering down through water",
      "Pirate skeleton reaching toward chest",
      "Gold coins spilling from chest"
    ],
    metadataClue: "Hidden Sequence: '7-3-11-9 - depths where treasure lies'"
  },
  {
    index: 15,
    name: "Chapter 3 – Card 15: Torch of Secrets",
    description: "Fire reveals what daylight hides. As the torch burns bright, mysterious writing appears on the cave wall, spelling out secrets that could change everything.",
    location: "Secret Cave Chamber, Mahé",
    symbol: "Revealed Text",
    rarity: "Legendary",
    storyFragment: "Hidden chamber where the final secret was recorded",
    visualElements: [
      "Pirate holding burning torch high",
      "Ancient writing becoming visible on stone wall",
      "Shadows dancing in torchlight",
      "Mysterious symbols and numbers on wall",
      "Pirate's face illuminated by flame",
      "Spider webs in dark corners"
    ],
    metadataClue: "Cryptogram Fragment: 'WKHUH OLHV WKH WUHDVXUH RI OHYDVVHXU'"
  },
  {
    index: 16,
    name: "Chapter 3 – Card 16: The False Trail",
    description: "Footprints in sand tell a story of deception. Two paths diverge into jungle darkness, but only one leads to treasure - the other to certain doom.",
    location: "Jungle Crossroads, Mahé",
    symbol: "Diverging Paths",
    rarity: "Rare",
    storyFragment: "Where the crew split to confuse pursuers",
    visualElements: [
      "Two sets of footprints leading different directions",
      "Dense jungle vegetation at path split",
      "Ominous shadows in both directions",
      "Warning signs carved in trees",
      "Pirate hat abandoned at crossroads",
      "Mysterious mist obscuring true path"
    ],
    metadataClue: "Choice Riddle: 'Follow the parrot's call, not the skull's stare'"
  },
  {
    index: 17,
    name: "Chapter 3 – Card 17: Map Fragment II",
    description: "The missing piece completes the puzzle. This torn parchment shows the eastern coastline and, when joined with its twin, reveals the exact location of Levasseur's greatest treasure.",
    location: "Hidden Cache, Mahé",
    symbol: "Completed Map",
    rarity: "Legendary",
    storyFragment: "The final piece that makes the treasure map whole",
    visualElements: [
      "Torn parchment showing eastern coastline",
      "Map edges that clearly match Fragment I",
      "Detailed treasure location marked with X",
      "Compass directions clearly visible",
      "Pirate captain's signature at bottom",
      "Wax seal with skull and crossbones"
    ],
    metadataClue: "Complete Coordinate: 'S 4° 44' 12\" - E 55° 31' 27\" (eastern fragment)'"
  },
  {
    index: 18,
    name: "Chapter 3 – Card 18: The Pirate's Ghost",
    description: "Death could not silence his duty to the treasure. The spectral pirate points toward the inland mountains, his ghostly finger indicating where the final cache awaits.",
    location: "Haunted Clearing, Mahé",
    symbol: "Spectral Guide",
    rarity: "Legendary",
    storyFragment: "The captain's spirit guides the worthy to the final destination",
    visualElements: [
      "Translucent ghostly pirate figure",
      "Spectral hand pointing toward mountains",
      "Ethereal mist surrounding ghost",
      "Faint skull and crossbones on ghost's chest",
      "Mountain silhouette in background",
      "Otherworldly blue glow around spirit"
    ],
    metadataClue: "Ghostly Riddle: 'Beyond the mist, where eagles nest, lies what you seek'"
  },
  {
    index: 19,
    name: "Chapter 3 – Card 19: The Final Cave",
    description: "Deep in the mountain's heart, golden light outlines the shape of ultimate treasure. This cavern holds what Levasseur's crew died to protect, waiting for the worthy.",
    location: "Mountain Cave, Mahé Interior",
    symbol: "Golden Glow",
    rarity: "Mythic",
    storyFragment: "The final chamber where Chapter 3 reaches its climax",
    visualElements: [
      "Deep cavern with golden light in depths",
      "Treasure chest outline glowing faintly",
      "Ancient cave paintings on walls",
      "Stalactites forming natural cathedral",
      "Pirate skeleton guarding entrance",
      "Mystical golden aura filling chamber"
    ],
    metadataClue: "Chapter 3 Cipher: 'In depths of stone, where light does glow, the final truth at last you'll know'"
  },
  {
    index: 20,
    name: "Chapter 3 – Card 20: Chapter Finale – Torn Map Piece",
    description: "Flames have scarred this final clue, marking the end of this chapter's quest. The remnants suggest the treasure hunt continues beyond these waters, toward distant horizons.",
    location: "Burnt Treasure Cache, Mahé",
    symbol: "Chapter Conclusion",
    rarity: "Mythic",
    storyFragment: "Chapter finale - the adventure reaches its conclusion",
    visualElements: [
      "Partially burned map fragment",
      "Final mystery revealed",
      "Praslin island outline visible on map",
      "Scorch marks from fire damage",
      "Emergency cache box still smoldering",
      "Conclusive symbols marking chapter end"
    ],
    metadataClue: "Chapter Finale: 'The quest concludes here, but legends suggest more treasures await in distant waters'"
  }
];

// Create output directories
const distDir = path.join(__dirname, 'dist');
const imagesDir = path.join(distDir, 'chapter3');

async function ensureDirectories() {
  await fs.mkdir(distDir, { recursive: true });
  await fs.mkdir(imagesDir, { recursive: true });
}

// Generate cinematic pirate artwork for each card
async function generateChapter3Image(card) {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');

  // Background - Seychelles atmosphere
  const gradient = ctx.createRadialGradient(400, 400, 50, 400, 400, 400);
  gradient.addColorStop(0, '#4a5568');
  gradient.addColorStop(1, '#1a202c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);

  // Add misty/foggy atmosphere
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 800, Math.random() * 800, Math.random() * 30, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Water effects for coastal scenes
  if (card.location.includes('Bay') || card.location.includes('Coast') || card.location.includes('Beach')) {
    const waterGradient = ctx.createLinearGradient(0, 600, 0, 800);
    waterGradient.addColorStop(0, 'rgba(0, 100, 150, 0.7)');
    waterGradient.addColorStop(1, 'rgba(0, 50, 100, 0.9)');
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, 600, 800, 200);
    
    // Wave patterns
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 650 + i * 30);
      ctx.quadraticCurveTo(200, 640 + i * 30, 400, 650 + i * 30);
      ctx.quadraticCurveTo(600, 660 + i * 30, 800, 650 + i * 30);
      ctx.stroke();
    }
  }

  // Main visual element based on card type
  ctx.fillStyle = '#d4af37'; // Gold color for treasure elements
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'center';

  switch (card.index) {
    case 1: // Landing at Anse Gaulette
      // Ship silhouette
      drawPirateShip(ctx, 400, 300);
      // Treasure chest on beach
      drawTreasureChest(ctx, 200, 650);
      break;
    case 2: // Carved Rock
      drawRockWithCarvings(ctx, 400, 400);
      break;
    case 3: // Fog at Lazare Picault
      drawGlowingCompass(ctx, 400, 400);
      break;
    case 4: // Hidden Waterfall
      drawWaterfall(ctx, 400, 200);
      drawTreasureChest(ctx, 450, 600);
      break;
    case 5: // Pirate's Parrot
      drawParrotWithScroll(ctx, 400, 300);
      break;
    case 6: // Cave of Echoes
      drawCaveEntrance(ctx, 400, 400);
      break;
    case 7: // Compass in Sand
      drawBuriedCompass(ctx, 400, 500);
      break;
    case 8: // Port Launay Shadows
      drawGhostShip(ctx, 400, 300);
      break;
    case 9: // Rock Pool Secret
      drawSkullReflection(ctx, 400, 400);
      break;
    case 10: // Watcher's Skull
      drawSkullOnPole(ctx, 400, 300);
      break;
    case 11: // Map Fragment I
    case 17: // Map Fragment II
      drawMapFragment(ctx, 400, 400, card.index === 11);
      break;
    case 12: // Crossed Blades
      drawCrossedSwords(ctx, 400, 400);
      break;
    case 13: // Coconut Grove Ambush
      drawPiratesInGrove(ctx, 400, 400);
      break;
    case 14: // Sunken Chest
      drawUnderwaterChest(ctx, 400, 400);
      break;
    case 15: // Torch of Secrets
      drawTorchRevealingText(ctx, 400, 400);
      break;
    case 16: // False Trail
      drawDivergingPaths(ctx, 400, 400);
      break;
    case 18: // Pirate's Ghost
      drawGhostlyPirate(ctx, 400, 400);
      break;
    case 19: // Final Cave
      drawGoldenCave(ctx, 400, 400);
      break;
    case 20: // Chapter Finale
      drawBurntMap(ctx, 400, 400);
      break;
  }

  // Add atmospheric effects
  addPirateAtmosphere(ctx);

  // Card title
  ctx.fillStyle = '#f7fafc';
  ctx.font = 'bold 20px serif';
  ctx.fillText(card.name.split(' – ')[1], 400, 50);

  // Save image
  const buffer = canvas.toBuffer('image/png');
  const imagePath = path.join(imagesDir, `chapter3-${card.index.toString().padStart(2, '0')}.png`);
  await fs.writeFile(imagePath, buffer);
  
  console.log(`✅ Generated: ${card.name}`);
  return imagePath;
}

// Drawing helper functions
function drawPirateShip(ctx, x, y) {
  ctx.fillStyle = '#8b4513';
  // Ship hull
  ctx.beginPath();
  ctx.ellipse(x, y + 50, 80, 20, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Masts
  ctx.fillStyle = '#654321';
  ctx.fillRect(x - 10, y - 50, 4, 100);
  ctx.fillRect(x + 10, y - 30, 4, 80);
  
  // Sails
  ctx.fillStyle = 'rgba(240, 240, 240, 0.8)';
  ctx.fillRect(x - 40, y - 40, 60, 30);
  ctx.fillRect(x - 20, y - 20, 40, 25);
  
  // Skull and crossbones flag
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 15, y - 45, 20, 15);
  ctx.fillStyle = '#ffffff';
  ctx.font = '8px serif';
  ctx.fillText('☠', x + 25, y - 35);
}

function drawTreasureChest(ctx, x, y) {
  // Chest body
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x - 30, y - 20, 60, 40);
  
  // Chest lid
  ctx.fillStyle = '#654321';
  ctx.fillRect(x - 32, y - 25, 64, 10);
  
  // Gold trim
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 30, y - 20, 60, 40);
  ctx.strokeRect(x - 32, y - 25, 64, 10);
  
  // Lock
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(x, y - 10, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawRockWithCarvings(ctx, x, y) {
  // Rock surface
  ctx.fillStyle = '#696969';
  ctx.beginPath();
  ctx.ellipse(x, y, 100, 80, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Carved symbols
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.font = 'bold 16px serif';
  ctx.fillStyle = '#000000';
  ctx.fillText('☠', x - 20, y - 10);
  ctx.fillText('XIII', x + 20, y);
  ctx.fillText('⚔', x, y + 20);
}

function drawGlowingCompass(ctx, x, y) {
  // Glow effect
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
  glowGradient.addColorStop(0, 'rgba(212, 175, 55, 0.8)');
  glowGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(x, y, 60, 0, 2 * Math.PI);
  ctx.fill();
  
  // Compass body
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Compass needle
  ctx.fillStyle = '#dc143c';
  ctx.beginPath();
  ctx.moveTo(x, y - 25);
  ctx.lineTo(x - 5, y);
  ctx.lineTo(x, y + 25);
  ctx.lineTo(x + 5, y);
  ctx.fill();
  
  // Compass points
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 12px serif';
  ctx.fillText('N', x, y - 40);
  ctx.fillText('S', x, y + 50);
  ctx.fillText('E', x + 40, y);
  ctx.fillText('W', x - 40, y);
}

function drawWaterfall(ctx, x, y) {
  // Water cascade
  const waterGradient = ctx.createLinearGradient(x - 30, y, x + 30, y + 200);
  waterGradient.addColorStop(0, 'rgba(173, 216, 230, 0.8)');
  waterGradient.addColorStop(1, 'rgba(100, 149, 237, 0.6)');
  ctx.fillStyle = waterGradient;
  ctx.fillRect(x - 15, y, 30, 200);
  
  // Rock cliff
  ctx.fillStyle = '#696969';
  ctx.fillRect(x - 50, y - 50, 100, 60);
  
  // Mist effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(x + (Math.random() - 0.5) * 60, y + 150 + Math.random() * 50, Math.random() * 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawParrotWithScroll(ctx, x, y) {
  // Parrot body
  ctx.fillStyle = '#dc143c';
  ctx.beginPath();
  ctx.ellipse(x, y, 25, 35, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Wing
  ctx.fillStyle = '#228b22';
  ctx.beginPath();
  ctx.ellipse(x - 10, y, 15, 25, -0.3, 0, 2 * Math.PI);
  ctx.fill();
  
  // Beak
  ctx.fillStyle = '#ffa500';
  ctx.beginPath();
  ctx.moveTo(x + 20, y - 5);
  ctx.lineTo(x + 30, y);
  ctx.lineTo(x + 20, y + 5);
  ctx.fill();
  
  // Scroll in talon
  ctx.fillStyle = '#f5deb3';
  ctx.fillRect(x + 10, y + 25, 30, 8);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 10, y + 25, 30, 8);
}

function drawCaveEntrance(ctx, x, y) {
  // Cave opening
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(x, y, 80, 60, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Rock surrounding
  ctx.fillStyle = '#696969';
  ctx.beginPath();
  ctx.ellipse(x, y, 120, 90, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(x, y, 80, 60, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Torch light
  drawTorch(ctx, x - 60, y - 20);
  drawTorch(ctx, x + 60, y - 20);
}

function drawTorch(ctx, x, y) {
  // Torch handle
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x - 2, y, 4, 30);
  
  // Flame
  const flameGradient = ctx.createRadialGradient(x, y - 10, 5, x, y - 20, 15);
  flameGradient.addColorStop(0, '#ffa500');
  flameGradient.addColorStop(1, '#dc143c');
  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.ellipse(x, y - 10, 8, 15, 0, 0, 2 * Math.PI);
  ctx.fill();
}

// Add more drawing functions...
function drawBuriedCompass(ctx, x, y) {
  // Sand
  ctx.fillStyle = '#f4e4bc';
  ctx.fillRect(0, y, 800, 300);
  
  // Compass partially buried
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y - 10, 25, 0, Math.PI); // Half circle above sand
  ctx.stroke();
  
  // Compass needle visible
  ctx.fillStyle = '#dc143c';
  ctx.beginPath();
  ctx.moveTo(x, y - 25);
  ctx.lineTo(x - 3, y - 10);
  ctx.lineTo(x + 3, y - 10);
  ctx.fill();
}

function drawGhostShip(ctx, x, y) {
  ctx.save();
  ctx.globalAlpha = 0.3;
  drawPirateShip(ctx, x, y);
  ctx.restore();
  
  // Ethereal glow
  const ghostGradient = ctx.createRadialGradient(x, y, 20, x, y, 100);
  ghostGradient.addColorStop(0, 'rgba(173, 216, 230, 0.4)');
  ghostGradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
  ctx.fillStyle = ghostGradient;
  ctx.beginPath();
  ctx.arc(x, y, 100, 0, 2 * Math.PI);
  ctx.fill();
}

function drawSkullReflection(ctx, x, y) {
  // Rock pool
  ctx.fillStyle = '#4682b4';
  ctx.beginPath();
  ctx.arc(x, y, 60, 0, 2 * Math.PI);
  ctx.fill();
  
  // Skull reflection in water
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px serif';
  ctx.fillText('☠', x, y + 10);
  ctx.restore();
}

function drawSkullOnPole(ctx, x, y) {
  // Wooden pole
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x - 5, y, 10, 200);
  
  // Skull
  ctx.fillStyle = '#f5f5dc';
  ctx.font = 'bold 50px serif';
  ctx.fillText('☠', x, y - 20);
  
  // Warning symbols on pole
  ctx.fillStyle = '#000000';
  ctx.font = '12px serif';
  ctx.fillText('⚠', x, y + 50);
}

function drawMapFragment(ctx, x, y, isFirstFragment) {
  // Parchment background
  ctx.fillStyle = '#f5deb3';
  ctx.fillRect(x - 80, y - 60, 160, 120);
  
  // Torn edges
  ctx.fillStyle = '#daa520';
  ctx.beginPath();
  if (isFirstFragment) {
    ctx.moveTo(x + 80, y - 60);
    ctx.lineTo(x + 60, y - 40);
    ctx.lineTo(x + 80, y - 20);
    ctx.lineTo(x + 70, y);
    ctx.lineTo(x + 80, y + 20);
    ctx.lineTo(x + 60, y + 40);
    ctx.lineTo(x + 80, y + 60);
  } else {
    ctx.moveTo(x - 80, y - 60);
    ctx.lineTo(x - 60, y - 40);
    ctx.lineTo(x - 80, y - 20);
    ctx.lineTo(x - 70, y);
    ctx.lineTo(x - 80, y + 20);
    ctx.lineTo(x - 60, y + 40);
    ctx.lineTo(x - 80, y + 60);
  }
  ctx.stroke();
  
  // Map details
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  // Coastline
  ctx.beginPath();
  ctx.moveTo(x - 60, y - 20);
  ctx.quadraticCurveTo(x - 20, y - 40, x + 20, y - 20);
  ctx.quadraticCurveTo(x + 60, y, x + 40, y + 40);
  ctx.stroke();
  
  // X marks the spot
  ctx.fillStyle = '#dc143c';
  ctx.font = 'bold 20px serif';
  ctx.fillText('✕', x, y);
}

function drawCrossedSwords(ctx, x, y) {
  ctx.strokeStyle = '#c0c0c0';
  ctx.lineWidth = 4;
  
  // First sword
  ctx.beginPath();
  ctx.moveTo(x - 40, y - 40);
  ctx.lineTo(x + 40, y + 40);
  ctx.stroke();
  
  // Second sword
  ctx.beginPath();
  ctx.moveTo(x - 40, y + 40);
  ctx.lineTo(x + 40, y - 40);
  ctx.stroke();
  
  // Sword hilts
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(x - 30, y - 30, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 30, y + 30, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 30, y + 30, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 30, y - 30, 8, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPiratesInGrove(ctx, x, y) {
  // Coconut palms
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x - 100, y + 100);
  ctx.lineTo(x - 80, y - 50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 100, y + 100);
  ctx.lineTo(x + 80, y - 50);
  ctx.stroke();
  
  // Palm fronds
  ctx.strokeStyle = '#228b22';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(x - 80, y - 50);
    ctx.lineTo(x - 80 + Math.cos(angle) * 40, y - 50 + Math.sin(angle) * 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 80, y - 50);
    ctx.lineTo(x + 80 + Math.cos(angle) * 40, y - 50 + Math.sin(angle) * 40);
    ctx.stroke();
  }
  
  // Pirate silhouettes
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x - 60, y + 20, 15, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillRect(x - 67, y + 30, 14, 40);
  
  ctx.beginPath();
  ctx.arc(x + 60, y + 20, 15, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillRect(x + 53, y + 30, 14, 40);
}

function drawUnderwaterChest(ctx, x, y) {
  // Water background
  const waterGradient = ctx.createLinearGradient(0, 0, 0, 800);
  waterGradient.addColorStop(0, 'rgba(0, 100, 150, 0.8)');
  waterGradient.addColorStop(1, 'rgba(0, 50, 100, 0.9)');
  ctx.fillStyle = waterGradient;
  ctx.fillRect(0, 0, 800, 800);
  
  // Sunlight rays
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 20;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(300 + i * 40, 0);
    ctx.lineTo(350 + i * 40, 800);
    ctx.stroke();
  }
  
  // Treasure chest on sea floor
  drawTreasureChest(ctx, x, y + 100);
  
  // Tropical fish
  drawFish(ctx, x - 100, y - 50);
  drawFish(ctx, x + 80, y - 30);
  drawFish(ctx, x - 50, y + 50);
}

function drawFish(ctx, x, y) {
  ctx.fillStyle = '#ffa500';
  ctx.beginPath();
  ctx.ellipse(x, y, 15, 8, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Tail
  ctx.beginPath();
  ctx.moveTo(x - 15, y);
  ctx.lineTo(x - 25, y - 5);
  ctx.lineTo(x - 25, y + 5);
  ctx.fill();
}

function drawTorchRevealingText(ctx, x, y) {
  // Cave wall
  ctx.fillStyle = '#696969';
  ctx.fillRect(0, 0, 800, 800);
  
  // Pirate holding torch
  ctx.fillStyle = '#8b4513';
  ctx.beginPath();
  ctx.arc(x - 100, y, 20, 0, 2 * Math.PI); // Head
  ctx.fill();
  ctx.fillRect(x - 107, y + 15, 14, 50); // Body
  
  // Torch
  drawTorch(ctx, x - 80, y - 20);
  
  // Revealed text on wall
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 16px serif';
  ctx.fillText('TREASURE', x + 50, y - 20);
  ctx.fillText('LIES WITHIN', x + 50, y);
  ctx.fillText('THE CAVE', x + 50, y + 20);
}

function drawDivergingPaths(ctx, x, y) {
  // Ground
  ctx.fillStyle = '#8b7355';
  ctx.fillRect(0, y + 100, 800, 300);
  
  // Jungle vegetation
  ctx.fillStyle = '#228b22';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 800, y - 50 + Math.random() * 100, Math.random() * 30 + 10, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Two paths
  ctx.fillStyle = '#daa520';
  // Left path
  ctx.beginPath();
  ctx.moveTo(x, y + 100);
  ctx.lineTo(x - 150, y + 300);
  ctx.lineTo(x - 130, y + 300);
  ctx.lineTo(x + 20, y + 100);
  ctx.fill();
  
  // Right path
  ctx.beginPath();
  ctx.moveTo(x, y + 100);
  ctx.lineTo(x + 150, y + 300);
  ctx.lineTo(x + 170, y + 300);
  ctx.lineTo(x + 20, y + 100);
  ctx.fill();
  
  // Footprints
  ctx.fillStyle = '#654321';
  for (let i = 0; i < 5; i++) {
    // Left path footprints
    ctx.beginPath();
    ctx.ellipse(x - 30 - i * 25, y + 120 + i * 35, 8, 12, -0.5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Right path footprints
    ctx.beginPath();
    ctx.ellipse(x + 30 + i * 25, y + 120 + i * 35, 8, 12, 0.5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawGhostlyPirate(ctx, x, y) {
  // Ethereal background
  const ghostGradient = ctx.createRadialGradient(x, y, 50, x, y, 150);
  ghostGradient.addColorStop(0, 'rgba(173, 216, 230, 0.4)');
  ghostGradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
  ctx.fillStyle = ghostGradient;
  ctx.beginPath();
  ctx.arc(x, y, 150, 0, 2 * Math.PI);
  ctx.fill();
  
  // Ghost pirate figure
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#e6e6fa';
  
  // Head
  ctx.beginPath();
  ctx.arc(x, y - 50, 25, 0, 2 * Math.PI);
  ctx.fill();
  
  // Body
  ctx.fillRect(x - 15, y - 20, 30, 60);
  
  // Pointing arm
  ctx.beginPath();
  ctx.moveTo(x + 15, y - 10);
  ctx.lineTo(x + 60, y - 30);
  ctx.lineWidth = 8;
  ctx.stroke();
  
  // Pirate hat
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x, y - 65, 30, Math.PI, 2 * Math.PI);
  ctx.fill();
  
  ctx.restore();
}

function drawGoldenCave(ctx, x, y) {
  // Cave entrance
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(x, y, 120, 90, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Golden glow from within
  const goldGradient = ctx.createRadialGradient(x, y + 50, 30, x, y + 50, 100);
  goldGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
  goldGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = goldGradient;
  ctx.beginPath();
  ctx.ellipse(x, y + 50, 100, 70, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Treasure chest silhouette in the glow
  ctx.save();
  ctx.globalAlpha = 0.4;
  drawTreasureChest(ctx, x, y + 80);
  ctx.restore();
  
  // Cave stalactites
  ctx.fillStyle = '#696969';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 100 + i * 50, y - 90);
    ctx.lineTo(x - 95 + i * 50, y - 40);
    ctx.lineTo(x - 105 + i * 50, y - 40);
    ctx.fill();
  }
}

function drawBurntMap(ctx, x, y) {
  // Partially burnt parchment
  ctx.fillStyle = '#f5deb3';
  ctx.beginPath();
  ctx.moveTo(x - 100, y - 80);
  ctx.lineTo(x + 80, y - 80);
  ctx.lineTo(x + 100, y - 40);
  ctx.lineTo(x + 60, y);
  ctx.lineTo(x + 80, y + 40);
  ctx.lineTo(x - 60, y + 80);
  ctx.lineTo(x - 100, y + 40);
  ctx.fill();
  
  // Burnt edges
  ctx.fillStyle = '#8b4513';
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 60, y);
  ctx.quadraticCurveTo(x + 80, y - 20, x + 100, y - 40);
  ctx.stroke();
  
  // Arrow pointing to new island
  ctx.strokeStyle = '#dc143c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x + 40, y - 30);
  ctx.stroke();
  
  // Arrow head
  ctx.beginPath();
  ctx.moveTo(x + 40, y - 30);
  ctx.lineTo(x + 30, y - 25);
  ctx.moveTo(x + 40, y - 30);
  ctx.lineTo(x + 35, y - 40);
  ctx.stroke();
  
  // "Praslin" text
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px serif';
  ctx.fillText('PRASLIN', x + 45, y - 10);
}

function addPirateAtmosphere(ctx) {
  // Add some atmospheric pirate elements
  
  // Scattered coins
  ctx.fillStyle = '#d4af37';
  for (let i = 0; i < 5; i++) {
    const coinX = Math.random() * 800;
    const coinY = Math.random() * 800;
    ctx.beginPath();
    ctx.arc(coinX, coinY, 4, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Rope texture in corners
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
  ctx.lineWidth = 3;
  // Top left corner
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(50, 50, 20 + i * 10, 0, Math.PI / 2);
    ctx.stroke();
  }
  
  // Bottom right corner
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(750, 750, 20 + i * 10, Math.PI, 3 * Math.PI / 2);
    ctx.stroke();
  }
}

// Generate metadata for each NFT
async function generateChapter3Metadata(card, imageCid) {
  const metadata = {
    name: card.name,
    description: card.description,
    image: `ipfs://${imageCid}`,
    external_url: "https://treasureofseychelles.com",
    attributes: [
      {
        trait_type: "Chapter",
        value: "Chapter 3 - VASA Expedition"
      },
      {
        trait_type: "Location",
        value: card.location
      },
      {
        trait_type: "Symbol",
        value: card.symbol
      },
      {
        trait_type: "Rarity",
        value: card.rarity
      },
      {
        trait_type: "StoryFragment",
        value: card.storyFragment
      },
      {
        trait_type: "CardIndex",
        value: card.index
      }
    ],
    properties: {
      clue: card.metadataClue,
      visualElements: card.visualElements,
      chapter: 3,
      collection: "VASA NFT Collection"
    }
  };
  
  return metadata;
}

// Main generation function - GENERATE ONLY, DO NOT MINT
async function generateChapter3() {
  console.log('🏴‍☠️ CHAPTER 3 - VASA NFT COLLECTION GENERATION');
  console.log('================================================');
  console.log('⚠️  GENERATION PHASE ONLY - NO MINTING ⚠️');
  console.log('');
  console.log('Creating 20 cinematic pirate NFTs tied to Seychelles geography...');
  console.log('');
  
  await ensureDirectories();
  
  const generatedItems = [];
  
  // Phase 1: Generate all images
  console.log('🎨 Phase 1: Generating 20 Cinematic Images...');
  for (const card of CHAPTER3_CARDS) {
    const imagePath = await generateChapter3Image(card);
    
    // Generate metadata (without CID for now)
    const metadata = await generateChapter3Metadata(card, 'PLACEHOLDER_CID');
    
    generatedItems.push({
      card,
      imagePath,
      metadata
    });
    
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ All 20 images generated successfully!');
  console.log('');
  
  // Phase 2: Save metadata files
  console.log('📝 Phase 2: Generating Metadata Files...');
  for (let i = 0; i < generatedItems.length; i++) {
    const item = generatedItems[i];
    const metadataPath = path.join(imagesDir, `chapter3-${(i + 1).toString().padStart(2, '0')}-metadata.json`);
    await fs.writeFile(metadataPath, JSON.stringify(item.metadata, null, 2));
    console.log(`✅ Metadata: ${item.card.name}`);
  }
  
  console.log('');
  console.log('📋 GENERATION COMPLETE - REVIEW REQUIRED');
  console.log('========================================');
  console.log('');
  console.log('All 20 Chapter 3 NFTs have been generated:');
  console.log(`Images saved to: ${imagesDir}`);
  console.log('');
  console.log('🔍 PLEASE REVIEW:');
  console.log('- Check all 20 images for quality and pirate theme');
  console.log('- Verify metadata contains correct Seychelles locations');
  console.log('- Confirm storyline progression makes sense');
  console.log('- Ensure Chapter finale is appropriate');
  console.log('');
  console.log('⚠️  WAITING FOR EXPLICIT APPROVAL BEFORE MINTING ⚠️');
  console.log('');
  console.log('Generated items summary:');
  generatedItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.card.name} - ${item.card.location}`);
  });
  
  // Save generation report
  const report = {
    timestamp: new Date().toISOString(),
    chapter: 3,
    collection: 'VASA NFT Collection',
    totalGenerated: generatedItems.length,
    status: 'AWAITING_APPROVAL',
    items: generatedItems.map(item => ({
      name: item.card.name,
      location: item.card.location,
      rarity: item.card.rarity,
      imagePath: item.imagePath,
      clue: item.card.metadataClue
    }))
  };
  
  const reportPath = path.join(distDir, 'chapter3-generation-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 Generation report saved: ${reportPath}`);
  console.log('');
  console.log('🛑 GENERATION PHASE COMPLETE - NO MINTING PERFORMED');
  console.log('Ready for your approval to proceed with minting phase.');
}

// Only run generation if called directly
console.log('Script starting...');

// Check if this is the main module
const isMainModule = import.meta.url.startsWith('file://') && process.argv[1] && process.argv[1].endsWith('generate_chapter3_vasa.js');

console.log('isMainModule:', isMainModule);

if (isMainModule) {
  console.log('Running generation...');
  generateChapter3().catch(error => {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  });
} else {
  console.log('Not running - not main module');
}

export { generateChapter3, CHAPTER3_CARDS };