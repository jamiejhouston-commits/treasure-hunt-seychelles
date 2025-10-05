import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncSE2ToDatabase() {
  console.log('🔄 Syncing SE2 NFTs to Backend Database');
  console.log('======================================');
  
  // Load SE2 minted data
  const se2MintedPath = path.join(__dirname, 'dist', 'minted', 'minted_se2.json');
  const se2Minted = JSON.parse(await fs.readFile(se2MintedPath, 'utf8'));
  
  // Load existing backend database
  const backendDbPath = path.join(__dirname, '..', 'backend', 'real_nfts.json');
  const existingNFTs = JSON.parse(await fs.readFile(backendDbPath, 'utf8'));
  
  console.log(`📊 Existing NFTs in database: ${existingNFTs.length}`);
  console.log(`📊 New SE2 NFTs to add: ${se2Minted.length}`);
  
  // SE2 Card definitions with full metadata
  const SE2_CARDS = [
    {
      index: 1, name: "SE2-01 — THE SHOREFALL LANDING", place: "Baie Lazare (Anse Gaulettes / Lazare Picault, Mahé)",
      hiddenLetter: "B", bearingToNext: "Ros Sodyer (Rock Pool, Anse Takamaka)", starCount: 0,
      clue: "Where Picault first kissed shore, the moon drew a silver line.\\nFollow it south, when the tide leaves a bowl of glass."
    },
    {
      index: 2, name: "SE2-02 — TIDE-BASIN RUNES", place: "Ros Sodyer Rock Pool (Anse Takamaka, Mahé)",
      hiddenLetter: "A", bearingToNext: "Anse Boileau", starCount: 3,
      clue: "When the ocean exhales, stone remembers.\\nRead the runes in the pool; they point by night, not day."
    },
    {
      index: 3, name: "SE2-03 — THE HOLLOW AT BOILEAU", place: "Anse Boileau, Mahé",
      hiddenLetter: "I", bearingToNext: "Morne Blanc", starCount: 0,
      clue: "In Boileau's hollow, a blade once bit the map.\\nLift the stone; the hillside whispers where to climb."
    },
    {
      index: 4, name: "SE2-04 — MIST OF MORNE BLANC", place: "Morne Blanc (Sans Souci ridge, Mahé)",
      hiddenLetter: "E", bearingToNext: "Copolia", starCount: 5,
      clue: "Above the bay, the mist keeps counsel.\\nCount the five lights that survive the cloud."
    },
    {
      index: 5, name: "SE2-05 — LANTERN ON COPOLIA", place: "Copolia Trail granite dome, Mahé",
      hiddenLetter: "L", bearingToNext: "Cascade Waterfall", starCount: 0,
      clue: "On Copolia's stone, light bends the reef.\\nArc the rope where the shoreline turns."
    },
    {
      index: 6, name: "SE2-06 — BEHIND THE CASCADE", place: "Cascade Waterfall (east interior, Mahé)",
      hiddenLetter: "A", bearingToNext: "Sauzier Waterfall (Port Glaud)", starCount: 0,
      clue: "Step behind the veil; water hides what stone declares.\\nCoins of light pay passage west."
    },
    {
      index: 7, name: "SE2-07 — SAUZIER'S WHISPER", place: "Sauzier Waterfall (Port Glaud / near Port Launay, Mahé)",
      hiddenLetter: "Z", bearingToNext: "Anse Major Trail (Bel Ombre)", starCount: 0,
      clue: "Where the westward fall sings, follow the echo.\\nIts measure climbs the coast to a hidden path."
    },
    {
      index: 8, name: "SE2-08 — THE HIDDEN PATH OF MAJOR", place: "Anse Major Trail (Bel Ombre, Mahé)",
      hiddenLetter: "A", bearingToNext: "Anse Georgette (Praslin)", starCount: 0,
      clue: "A path with teeth and sea below.\\nCount the cuts; they bite the heading east."
    },
    {
      index: 9, name: "SE2-09 — VACHE SENTINEL", place: "Vache Island (Île aux Vaches Marines)",
      hiddenLetter: "R", bearingToNext: "Anse Georgette (Praslin)", starCount: 7,
      clue: "A cow by name, a sentinel by duty.\\nCount the seven lights that never drink."
    },
    {
      index: 10, name: "SE2-10 — TEETH OF GEORGETTE", place: "Anse Georgette (Praslin)",
      hiddenLetter: "E", bearingToNext: "Lady Denison-Pender Shoal", starCount: 0,
      clue: "Among the teeth, a corner of night.\\nThe feather points where the reef denies depth."
    },
    {
      index: 11, name: "SE2-11 — NIGHT AT INTENDANCE", place: "Anse Intendance, Mahé",
      hiddenLetter: "P", bearingToNext: "Anse Royale", starCount: 0,
      clue: "Where the sea writes in thunder, the sand keeps one coin.\\nTurn its scar toward the gentler shore."
    },
    {
      index: 12, name: "SE2-12 — ROYALE LANTERN", place: "Anse Royale, Mahé",
      hiddenLetter: "I", bearingToNext: "Mission Lodge (Sans Souci)", starCount: 2,
      clue: "Royale rests with two small lights.\\nLoop the rope and climb to council."
    },
    {
      index: 13, name: "SE2-13 — COUNCIL OF MISSION LODGE", place: "Mission Lodge (Sans Souci, Mahé)",
      hiddenLetter: "C", bearingToNext: "La Misère Viewpoint", starCount: 0,
      clue: "Stones that watched the island's heart\\ncast shadows pointing to the high road."
    },
    {
      index: 14, name: "SE2-14 — MISÈRE LOOKOUT", place: "La Misère Viewpoint, Mahé",
      hiddenLetter: "A", bearingToNext: "Baie Ternay / Port Launay", starCount: 0,
      clue: "From hardship's ridge, count two knots of wind.\\nThe lights below betray the turn."
    },
    {
      index: 15, name: "SE2-15 — TERNAY'S QUIET", place: "Baie Ternay / Port Launay Marine Park",
      hiddenLetter: "U", bearingToNext: "Anse Major (return)", starCount: 0,
      clue: "In a bay that refuses storm,\\nthe coral fingers name a number."
    },
    {
      index: 16, name: "SE2-16 — MAJOR'S RETURN", place: "Anse Major headland (return), Mahé",
      hiddenLetter: "L", bearingToNext: "Baie Lazare", starCount: 4,
      clue: "Four lights on the cliff's brow\\nsend you back along the wound."
    },
    {
      index: 17, name: "SE2-17 — GAULETTES MARK", place: "Anse Gaulettes (Baie Lazare district), Mahé",
      hiddenLetter: "T", bearingToNext: "Baie Lazare beach", starCount: 0,
      clue: "By the marked stone where roads lean to the sea,\\nscratch the sign and follow the feather."
    },
    {
      index: 18, name: "SE2-18 — BAY OF COINS", place: "Baie Lazare beach (wide)",
      hiddenLetter: "B", bearingToNext: "Lady Denison-Pender Shoal", starCount: 0,
      clue: "The bay keeps what the sea returns.\\nSpiral the rope to test your course."
    },
    {
      index: 19, name: "SE2-19 — REEF GATE (DENISON)", place: "Lady Denison-Pender Shoal (outer)",
      hiddenLetter: "A", bearingToNext: "Baie Lazare (close loop)", starCount: 6,
      clue: "Six lights at the gate pretend to open.\\nTurn your bow—home holds the lock."
    },
    {
      index: 20, name: "SE2-20 — THE FIRST SHORE'S KEY", place: "Baie Lazare (return), Mahé",
      hiddenLetter: "Y", bearingToNext: "(CLOSE LOOP)", starCount: 0,
      clue: "The loop returns where it began.\\nThe first shore keeps the last key."
    }
  ];
  
  // Convert SE2 to backend format
  const newNFTs = [];
  let nextId = Math.max(...existingNFTs.map(nft => nft.id)) + 1;
  
  for (const mintedNFT of se2Minted) {
    const cardData = SE2_CARDS.find(card => card.index === mintedNFT.index);
    
    if (cardData && mintedNFT.nftoken_id) {
      const newNFT = {
        id: nextId++,
        token_id: mintedNFT.nftoken_id,
        name: cardData.name,
        description: `Chapter II — The Landing at Baie Lazare (Lazare Picault). ${cardData.place}. ${cardData.clue}`,
        image_url: `ipfs://${mintedNFT.image_cid}`,
        metadata_url: mintedNFT.uri,
        attributes: [
          { trait_type: "Chapter", value: "Chapter II — The Landing at Baie Lazare" },
          { trait_type: "Edition", value: "Special" },
          { trait_type: "Place", value: cardData.place },
          { trait_type: "Symbol", value: "Levasseur Cipher" },
          { trait_type: "ClueType", value: "Cartographic Fragment" },
          { trait_type: "HiddenLetter", value: cardData.hiddenLetter },
          { trait_type: "BearingToNext", value: cardData.bearingToNext },
          { trait_type: "StarCount", value: cardData.starCount }
        ],
        rarity: "Special Edition",
        price: 50, // SE2 premium pricing
        owner_address: "r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH",
        transaction_hash: mintedNFT.tx_hash,
        minted_at: mintedNFT.timestamp,
        created_at: mintedNFT.timestamp,
        updated_at: mintedNFT.timestamp
      };
      
      newNFTs.push(newNFT);
      console.log(`✅ Added ${cardData.name} (ID: ${newNFT.id})`);
    }
  }
  
  // Merge with existing database
  const updatedDatabase = [...existingNFTs, ...newNFTs];
  
  // Backup the original
  const backupPath = path.join(__dirname, '..', 'backups', 'real_nfts_before_se2.json');
  await fs.writeFile(backupPath, JSON.stringify(existingNFTs, null, 2));
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Save updated database
  await fs.writeFile(backendDbPath, JSON.stringify(updatedDatabase, null, 2));
  
  console.log('\\n🎉 DATABASE SYNC COMPLETE!');
  console.log('===========================');
  console.log(`📊 Previous NFTs: ${existingNFTs.length}`);
  console.log(`📊 New SE2 NFTs: ${newNFTs.length}`);
  console.log(`📊 Total NFTs: ${updatedDatabase.length}`);
  console.log(`💰 SE2 Price: 50 coins each (premium)`);
  console.log(`🔢 Hidden Letters: BAIE LAZARE + PICAULT BAY`);
  console.log(`⭐ Star Offset: 357246`);
  
  // Quick verification
  const se2Count = updatedDatabase.filter(nft => nft.name.startsWith('SE2-')).length;
  console.log(`\\n🔍 Verification: ${se2Count}/20 SE2 NFTs in database`);
  
  return updatedDatabase.length;
}

syncSE2ToDatabase().catch(console.error);