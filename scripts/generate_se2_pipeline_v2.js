import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import xrpl from 'xrpl';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SE2 Data Structure (same as before)
const SE2_CARDS = [
  // SET A (BAIE LAZARE)
  {
    index: 1,
    name: "SE2-01 — THE SHOREFALL LANDING",
    place: "Baie Lazare (Anse Gaulettes / Lazare Picault, Mahé)",
    hiddenLetter: "B",
    bearingToNext: "Ros Sodyer (Rock Pool, Anse Takamaka)",
    starCount: 0,
    visual: "Moonlit surf curls into Baie Lazare. Low galleon silhouette in the shallows. Foreground: tricorn hat on rope coil; faint skull-and-sabers watermark; lantern glow on wet granite. Weathered roadside stone/marker hinted in brush (Picault).",
    cipher: "thin compass ring in shore foam; tiny runes on wet rock.",
    clue: "Where Picault first kissed shore, the moon drew a silver line.\nFollow it south, when the tide leaves a bowl of glass."
  },
  {
    index: 2,
    name: "SE2-02 — TIDE-BASIN RUNES",
    place: "Ros Sodyer Rock Pool (Anse Takamaka, Mahé)",
    hiddenLetter: "A",
    bearingToNext: "Anse Boileau",
    starCount: 3,
    visual: "Circular tide pool at low tide; faint runes under water. Pirate hand + cutlass reflected; parrot feather on driftwood. Constellation of three stars traced in ripples.",
    cipher: "runes form an arc aligned to a bearing notch; tri-star overlay.",
    clue: "When the ocean exhales, stone remembers.\nRead the runes in the pool; they point by night, not day."
  },
  {
    index: 3,
    name: "SE2-03 — THE HOLLOW AT BOILEAU",
    place: "Anse Boileau, Mahé",
    hiddenLetter: "I",
    bearingToNext: "Morne Blanc",
    starCount: 0,
    visual: "Stream through mangrove; a hollow stone with scratch marks; dagger pommel in sand; coin spill in lantern gold; low fog.",
    cipher: "notches around the hollow align with ridge silhouette.",
    clue: "In Boileau's hollow, a blade once bit the map.\nLift the stone; the hillside whispers where to climb."
  },
  {
    index: 4,
    name: "SE2-04 — MIST OF MORNE BLANC",
    place: "Morne Blanc (Sans Souci ridge, Mahé)",
    hiddenLetter: "E",
    bearingToNext: "Copolia",
    starCount: 5,
    visual: "Cloud forest boards; ridge posts; five faint star points in mist; rope forms a compass arc; pirate shadow in fog.",
    cipher: "five-point constellation overlays a bearing ring.",
    clue: "Above the bay, the mist keeps counsel.\nCount the five lights that survive the cloud."
  },
  {
    index: 5,
    name: "SE2-05 — LANTERN ON COPOLIA",
    place: "Copolia Trail granite dome, Mahé",
    hiddenLetter: "L",
    bearingToNext: "Cascade Waterfall",
    starCount: 0,
    visual: "Lantern on polished granite; coastline arcs below; map parchment pinned with cutlass; parrot feather points along reef line.",
    cipher: "rope laid as precise arc; reef silhouette as protractor.",
    clue: "On Copolia's stone, light bends the reef.\nArc the rope where the shoreline turns."
  },
  {
    index: 6,
    name: "SE2-06 — BEHIND THE CASCADE",
    place: "Cascade Waterfall (east interior, Mahé)",
    hiddenLetter: "A",
    bearingToNext: "Sauzier Waterfall (Port Glaud)",
    starCount: 0,
    visual: "Water curtain; carved mark behind; coin sparkles in spray; skull emblem faint on wet rock; gloved hand reaches behind the fall.",
    cipher: "carved tick equals bearing; coin alignment gives direction.",
    clue: "Step behind the veil; water hides what stone declares.\nCoins of light pay passage west."
  },
  {
    index: 7,
    name: "SE2-07 — SAUZIER'S WHISPER",
    place: "Sauzier Waterfall (Port Glaud / near Port Launay, Mahé)",
    hiddenLetter: "Z",
    bearingToNext: "Anse Major Trail (Bel Ombre)",
    starCount: 0,
    visual: "Lush fall; rope-ladder fragment; echo lines like music staff; chest handle half-buried; a parrot on branch.",
    cipher: "echo 'bars' mark an angle; chest handle points seaward.",
    clue: "Where the westward fall sings, follow the echo.\nIts measure climbs the coast to a hidden path."
  },
  {
    index: 8,
    name: "SE2-08 — THE HIDDEN PATH OF MAJOR",
    place: "Anse Major Trail (Bel Ombre, Mahé)",
    hiddenLetter: "A",
    bearingToNext: "Anse Georgette (Praslin)",
    starCount: 0,
    visual: "Cliffside path; granite teeth; distant ship under cloud break; map scrap pinned by dagger to stump.",
    cipher: "dagger-hilt notches encode the heading.",
    clue: "A path with teeth and sea below.\nCount the cuts; they bite the heading east."
  },
  {
    index: 9,
    name: "SE2-09 — VACHE SENTINEL",
    place: "Vache Island (Île aux Vaches Marines)",
    hiddenLetter: "R",
    bearingToNext: "Anse Georgette (Praslin)",
    starCount: 7,
    visual: "Bare granite islet; sentinel mood; seven faint stars above; skull watermark in foam; rope coil on rock.",
    cipher: "seven-point star overlay; rope indicates bearing fork.",
    clue: "A cow by name, a sentinel by duty.\nCount the seven lights that never drink."
  },
  {
    index: 10,
    name: "SE2-10 — TEETH OF GEORGETTE",
    place: "Anse Georgette (Praslin)",
    hiddenLetter: "E",
    bearingToNext: "Lady Denison-Pender Shoal",
    starCount: 0,
    visual: "Granite teeth frame turquoise cove; treasure-chest corner in sand; parrot feather pointing offshore; coin trail into surf.",
    cipher: "tooth spacing → compass ticks toward the shoal.",
    clue: "Among the teeth, a corner of night.\nThe feather points where the reef denies depth."
  },
  // SET B (PICAULT BAY)
  {
    index: 11,
    name: "SE2-11 — NIGHT AT INTENDANCE",
    place: "Anse Intendance, Mahé",
    hiddenLetter: "P",
    bearingToNext: "Anse Royale",
    starCount: 0,
    visual: "Wild surf; pirate hat on driftwood; skull-coin in sand; storm glow offshore.",
    cipher: "coin notch aligns with shoreline sweep.",
    clue: "Where the sea writes in thunder, the sand keeps one coin.\nTurn its scar toward the gentler shore."
  },
  {
    index: 12,
    name: "SE2-12 — ROYALE LANTERN",
    place: "Anse Royale, Mahé",
    hiddenLetter: "I",
    bearingToNext: "Mission Lodge (Sans Souci)",
    starCount: 2,
    visual: "Calm bay; lantern reflection; rope forms a figure-2 loop; parrot on signpost.",
    cipher: "two star glints; rope loop = numeric offset.",
    clue: "Royale rests with two small lights.\nLoop the rope and climb to council."
  },
  {
    index: 13,
    name: "SE2-13 — COUNCIL OF MISSION LODGE",
    place: "Mission Lodge (Sans Souci, Mahé)",
    hiddenLetter: "C",
    bearingToNext: "La Misère Viewpoint",
    starCount: 0,
    visual: "Old arches; clouds over ridge; cutlass crossed with spyglass; sealed parchment.",
    cipher: "arch shadows align to heading; seal wax hides letter.",
    clue: "Stones that watched the island's heart\ncast shadows pointing to the high road."
  },
  {
    index: 14,
    name: "SE2-14 — MISÈRE LOOKOUT",
    place: "La Misère Viewpoint, Mahé",
    hiddenLetter: "A",
    bearingToNext: "Baie Ternay / Port Launay",
    starCount: 0,
    visual: "Night panorama; ship lights at anchor; faint skull in sky; rope knotted twice.",
    cipher: "double knot = two-step bearing change.",
    clue: "From hardship's ridge, count two knots of wind.\nThe lights below betray the turn."
  },
  {
    index: 15,
    name: "SE2-15 — TERNAY'S QUIET",
    place: "Baie Ternay / Port Launay Marine Park",
    hiddenLetter: "U",
    bearingToNext: "Anse Major (return)",
    starCount: 0,
    visual: "Calm marine park; chest silhouette under water; parrot feather in coral.",
    cipher: "coral branches form a degree mark.",
    clue: "In a bay that refuses storm,\nthe coral fingers name a number."
  },
  {
    index: 16,
    name: "SE2-16 — MAJOR'S RETURN",
    place: "Anse Major headland (return), Mahé",
    hiddenLetter: "L",
    bearingToNext: "Baie Lazare",
    starCount: 4,
    visual: "Headland curve; four faint stars; dagger in rope coil; torn map corner.",
    cipher: "four-star overlay; rope points SW (homeward).",
    clue: "Four lights on the cliff's brow\nsend you back along the wound."
  },
  {
    index: 17,
    name: "SE2-17 — GAULETTES MARK",
    place: "Anse Gaulettes (Baie Lazare district), Mahé",
    hiddenLetter: "T",
    bearingToNext: "Baie Lazare beach",
    starCount: 0,
    visual: "Roadside stone/marker silhouette (Picault zone); faint skull etch; coin in crack; feather points to bay.",
    cipher: "etching hides letter; coin notch aligns home.",
    clue: "By the marked stone where roads lean to the sea,\nscratch the sign and follow the feather."
  },
  {
    index: 18,
    name: "SE2-18 — BAY OF COINS",
    place: "Baie Lazare beach (wide)",
    hiddenLetter: "B",
    bearingToNext: "Lady Denison-Pender Shoal",
    starCount: 0,
    visual: "Wide crescent; coins spill to surf; rope spiral; chest shadow in dunes.",
    cipher: "spiral = azimuth spiral back-bearing test.",
    clue: "The bay keeps what the sea returns.\nSpiral the rope to test your course."
  },
  {
    index: 19,
    name: "SE2-19 — REEF GATE (DENISON)",
    place: "Lady Denison-Pender Shoal (outer)",
    hiddenLetter: "A",
    bearingToNext: "Baie Lazare (close loop)",
    starCount: 6,
    visual: "Sounding lines; reef shadow; ship turning; six faint stars.",
    cipher: "six-star overlay; bearing flips home.",
    clue: "Six lights at the gate pretend to open.\nTurn your bow—home holds the lock."
  },
  {
    index: 20,
    name: "SE2-20 — THE FIRST SHORE'S KEY",
    place: "Baie Lazare (return), Mahé",
    hiddenLetter: "Y",
    bearingToNext: "(CLOSE LOOP)",
    starCount: 0,
    visual: "Same bay at dawn; chest partly unearthed; skull-and-sabers watermark; lantern glow on sand; compass ring closing.",
    cipher: "key sigil in foam; ring completes the loop.",
    clue: "The loop returns where it began.\nThe first shore keeps the last key."
  }
];

// Create placeholder SVG images instead of using canvas
async function generateSE2PlaceholderImage(card) {
  console.log(`🎨 Creating SE2-${card.index.toString().padStart(2, '0')} placeholder...`);
  
  // Create SVG content
  const svgContent = `
<svg width="2048" height="2048" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#133C55;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0D1B2A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0A1830;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="2048" height="2048" fill="url(#bgGradient)"/>
  
  <!-- Title -->
  <text x="1024" y="150" text-anchor="middle" fill="#EAE7DC" font-family="serif" font-size="48" font-weight="bold">${card.name}</text>
  
  <!-- Place -->
  <text x="1024" y="220" text-anchor="middle" fill="#D9B45B" font-family="serif" font-size="32">${card.place.split(',')[0]}</text>
  
  <!-- Hidden Letter (very faint) -->
  <text x="1024" y="1200" text-anchor="middle" fill="#133C55" font-family="serif" font-size="400" font-weight="bold" opacity="0.3">${card.hiddenLetter}</text>
  
  <!-- Compass Ring -->
  <circle cx="1024" cy="1024" r="300" fill="none" stroke="#D9B45B" stroke-width="8"/>
  
  <!-- Star overlay if needed -->
  ${card.starCount > 0 ? Array.from({length: card.starCount}, (_, i) => {
    const angle = (i * Math.PI * 2) / card.starCount;
    const x = 1024 + Math.cos(angle) * 150;
    const y = 400 + Math.sin(angle) * 100;
    return `<polygon points="${x},${y-15} ${x+5},${y-5} ${x+15},${y-5} ${x+8},${y+2} ${x+10},${y+12} ${x},${y+8} ${x-10},${y+12} ${x-8},${y+2} ${x-15},${y-5} ${x-5},${y-5}" fill="#EAE7DC"/>`;
  }).join('\n') : ''}
  
  <!-- Clue text -->
  <text x="1024" y="1700" text-anchor="middle" fill="#EAE7DC" font-family="serif" font-size="24">${card.clue.split('\n')[0]}</text>
  <text x="1024" y="1750" text-anchor="middle" fill="#EAE7DC" font-family="serif" font-size="24">${card.clue.split('\n')[1] || ''}</text>
  
  <!-- Visual description -->
  <text x="100" y="1900" fill="#D9B45B" font-family="serif" font-size="20">${card.visual.substring(0, 80)}...</text>
</svg>`;

  // Convert SVG to base64 data URL (for now, we'll save as SVG)
  const filename = `se2-${card.index.toString().padStart(2, '0')}.svg`;
  const imagePath = path.join(__dirname, 'dist', 'images', 'se2', filename);
  await fs.writeFile(imagePath, svgContent);
  
  return filename;
}

async function generateSE2Metadata(card, imageCid) {
  const metadata = {
    name: card.name,
    description: `Chapter II — The Landing at Baie Lazare (Lazare Picault). ${card.place}. ${card.clue}`,
    image: `ipfs://${imageCid}`,
    attributes: [
      { trait_type: "Chapter", value: "Chapter II — The Landing at Baie Lazare" },
      { trait_type: "Edition", value: "Special" },
      { trait_type: "Place", value: card.place },
      { trait_type: "Symbol", value: "Levasseur Cipher" },
      { trait_type: "ClueType", value: "Cartographic Fragment" },
      { trait_type: "HiddenLetter", value: card.hiddenLetter },
      { trait_type: "BearingToNext", value: card.bearingToNext },
      { trait_type: "StarCount", value: card.starCount }
    ],
    external_url: "https://levasseur-treasure.seychelles.io",
    animation_url: null,
    properties: {
      cipher: card.cipher,
      clue: card.clue,
      visual_description: card.visual
    }
  };
  
  const filename = `se2-${card.index.toString().padStart(2, '0')}.json`;
  const metadataPath = path.join(__dirname, 'dist', 'metadata', 'se2', filename);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  
  return { metadata, filename };
}

async function uploadToPinata(type, data, filename) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) throw new Error('PINATA_JWT not found in environment');
  
  let response;
  
  if (type === 'file') {
    // Upload file (image)
    const formData = new FormData();
    const blob = new Blob([data], { type: 'image/svg+xml' });
    formData.append('file', blob, filename);
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
    formData.append('pinataMetadata', JSON.stringify({ name: filename }));
    
    response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}` },
      body: formData
    });
  } else {
    // Upload JSON
    response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataOptions: { cidVersion: 1 },
        pinataMetadata: { name: filename }
      })
    });
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  return result.IpfsHash;
}

async function mintNFTOnXRPL(uri, index, card) {
  console.log(`🏴‍☠️ Minting SE2-${index.toString().padStart(2, '0')} on XRPL...`);
  
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_TESTNET_SEED);
  
  const tx = {
    TransactionType: 'NFTokenMint',
    Account: wallet.address,
    URI: Buffer.from(uri, 'utf8').toString('hex').toUpperCase(),
    Flags: 8, // tfTransferable
    TransferFee: parseInt(process.env.TRANSFER_FEE || '50000'),
    NFTokenTaxon: parseInt(process.env.NFT_TAXON || '7777')
  };
  
  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const response = await client.submitAndWait(signed.tx_blob);
  
  if (response.result.meta.TransactionResult !== 'tesSUCCESS') {
    throw new Error(`Mint failed: ${response.result.meta.TransactionResult}`);
  }
  
  // Extract NFTokenID
  let nfTokenID = null;
  for (const node of response.result.meta.AffectedNodes) {
    if (node.CreatedNode?.LedgerEntryType === 'NFTokenPage') {
      const tokens = node.CreatedNode.NewFields.NFTokens;
      if (tokens && tokens.length > 0) {
        nfTokenID = tokens[tokens.length - 1].NFToken.NFTokenID;
        break;
      }
    }
  }
  
  await client.disconnect();
  
  return {
    nfTokenID,
    txHash: signed.hash,
    ledgerIndex: response.result.ledger_index,
    timestamp: new Date().toISOString()
  };
}

async function main() {
  console.log('🏴‍☠️ Levasseur Treasure SE2 — Chapter II Pipeline');
  console.log('===============================================');
  console.log('Chapter: The Landing at Baie Lazare (Lazare Picault)');
  console.log('NFTs: 20 Special-Edition tokens (SE2-01 to SE2-20)');
  console.log('');
  
  const manifest = [];
  const mintedRecords = [];
  
  // Phase 1: Generate SVG Images
  console.log('🎨 Phase 1: Generating 20 SE2 SVG Images...');
  for (const card of SE2_CARDS) {
    await generateSE2PlaceholderImage(card);
  }
  console.log('✅ SVG Images generated');
  
  // Phase 2: Upload Images to Pinata
  console.log('📤 Phase 2: Uploading Images to IPFS...');
  const imageCids = {};
  for (const card of SE2_CARDS) {
    const filename = `se2-${card.index.toString().padStart(2, '0')}.svg`;
    const imagePath = path.join(__dirname, 'dist', 'images', 'se2', filename);
    const imageData = await fs.readFile(imagePath, 'utf8');
    const cid = await uploadToPinata('file', imageData, filename);
    imageCids[card.index] = cid;
    console.log(`  SE2-${card.index.toString().padStart(2, '0')}: ${cid}`);
  }
  console.log('✅ Images uploaded to IPFS');
  
  // Phase 3: Generate and Upload Metadata
  console.log('📋 Phase 3: Generating and Uploading Metadata...');
  for (const card of SE2_CARDS) {
    const imageCid = imageCids[card.index];
    const { metadata, filename } = await generateSE2Metadata(card, imageCid);
    const metadataCid = await uploadToPinata('json', metadata, filename);
    
    manifest.push({
      index: card.index,
      filename: `se2-${card.index.toString().padStart(2, '0')}.svg`,
      image_cid: imageCid,
      metadata_cid: metadataCid,
      uri: `ipfs://${metadataCid}`
    });
    
    console.log(`  SE2-${card.index.toString().padStart(2, '0')}: ipfs://${metadataCid}`);
  }
  
  // Save manifest
  const manifestPath = path.join(__dirname, 'dist', 'manifest_se2.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Metadata generated and uploaded');
  
  // Phase 4: Mint NFTs on XRPL
  console.log('⚓ Phase 4: Minting NFTs on XRPL Testnet...');
  for (const card of SE2_CARDS) {
    const manifestEntry = manifest.find(m => m.index === card.index);
    
    try {
      const mintResult = await mintNFTOnXRPL(manifestEntry.uri, card.index, card);
      
      const record = {
        index: card.index,
        name: card.name,
        place: card.place,
        uri: manifestEntry.uri,
        nftoken_id: mintResult.nfTokenID,
        tx_hash: mintResult.txHash,
        ledger_index: mintResult.ledgerIndex,
        timestamp: mintResult.timestamp
      };
      
      mintedRecords.push(record);
      console.log(`  ✅ SE2-${card.index.toString().padStart(2, '0')}: ${mintResult.nfTokenID}`);
      
      // Small delay between mints
      await new Promise(r => setTimeout(r, 2000));
      
    } catch (error) {
      console.log(`  ❌ SE2-${card.index.toString().padStart(2, '0')}: ${error.message}`);
      const record = {
        index: card.index,
        name: card.name,
        place: card.place,
        uri: manifestEntry.uri,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      mintedRecords.push(record);
    }
  }
  
  // Save minted records
  const mintedPath = path.join(__dirname, 'dist', 'minted', 'minted_se2.json');
  await fs.writeFile(mintedPath, JSON.stringify(mintedRecords, null, 2));
  console.log('✅ Minting process completed');
  
  // Phase 5: Generate README
  const readme = `# SE2 — Chapter II: The Landing at Baie Lazare

## Hidden Letters
Set A (01-10): ${SE2_CARDS.slice(0, 10).map(c => c.hiddenLetter).join('')}
Set B (11-20): ${SE2_CARDS.slice(10).map(c => c.hiddenLetter).join('')}

## Star Counts (Vault Offset)
${SE2_CARDS.filter(c => c.starCount > 0).map(c => `SE2-${c.index.toString().padStart(2, '0')}: ${c.starCount}`).join('\n')}
Offset Sequence: ${SE2_CARDS.filter(c => c.starCount > 0).map(c => c.starCount).join('')}

## All NFTs
${mintedRecords.map(r => `${r.name}: ${r.uri}`).join('\n')}
`;
  
  const readmePath = path.join(__dirname, 'dist', 'metadata', 'se2', 'README.md');
  await fs.writeFile(readmePath, readme);
  
  // Final Report
  console.log('\n🎉 SE2 PIPELINE COMPLETE!');
  console.log('========================');
  console.log(`✅ Processed 20 Special-Edition NFTs for Chapter II — The Landing at Baie Lazare`);
  
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_TESTNET_SEED);
  console.log(`📍 Wallet: ${wallet.address}`);
  
  const starOffset = SE2_CARDS.filter(c => c.starCount > 0).map(c => c.starCount).join('');
  console.log(`🔢 Star Offset: ${starOffset}`);
  
  const successfulMints = mintedRecords.filter(r => r.nftoken_id);
  console.log(`📊 Successful mints: ${successfulMints.length}/20`);
  
  if (successfulMints.length > 0) {
    console.log(`📊 First 3 NFTokenIDs:`);
    successfulMints.slice(0, 3).forEach(r => {
      console.log(`   ${r.name.split(' ')[0]}: ${r.nftoken_id}`);
    });
    
    console.log(`📊 Last 3 NFTokenIDs:`);
    successfulMints.slice(-3).forEach(r => {
      console.log(`   ${r.name.split(' ')[0]}: ${r.nftoken_id}`);
    });
  }
  
  console.log(`\n🌐 All records saved to: ${mintedPath}`);
  console.log(`📋 Manifest saved to: ${manifestPath}`);
  console.log(`📖 README saved to: ${readmePath}`);
}

main().catch(console.error);