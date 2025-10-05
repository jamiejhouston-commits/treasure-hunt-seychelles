const fs = require('fs');
const path = require('path');

const chapter4Cards = [
  {
    id: "ch4_001",
    name: "Witch-Winds at Intendance",
    place: "Anse Intendance",
    timeOfDay: "Blue hour dusk",
    weather: "sea mist",
    bearingDeg: 57,
    tide: "Low",
    moonPhase: "First Quarter",
    cipherOutput: "LA",
    riddle: "When the sea writes a spiral, count the panes that brave it.",
    rarity: "Legendary",
    description: "Blue hour descends upon Anse Intendance as sea mist rolls across the shore break. A weathered pirate helmsman clutches a brass lantern with five panes of glass, its amber light cutting through the gathering gloom. Behind him in the surf foam, a witch in a tattered shawl traces spiral runes with her fingertips, calling upon the ancient winds. Seven perfect spirals bloom in the foam where witch-craft meets tide, while the lantern's five panes catch the last light."
  },
  {
    id: "ch4_002",
    name: "Baie Lazare Oath",
    place: "Baie Lazare",
    timeOfDay: "Golden hour",
    weather: "clear",
    bearingDeg: 124,
    tide: "Low",
    moonPhase: "Waxing Gibbous",
    cipherOutput: "ZA",
    riddle: "Tilt the blade as he once did; the angle names the bay.",
    rarity: "Epic",
    description: "Golden hour bathes Baie Lazare in warm amber light as a grizzled pirate captain stands before the stone memorial that bears the name of Lazare Picault. The witch beside him ties gris-gris charms to a weathered post while distant sails dot the bay. A single coin gleams outside the open chest clasp, but look closer to the dagger thrust into the rock—its blade tilts at precisely 124 degrees of reverence carved in steel and stone."
  },
  {
    id: "ch4_003",
    name: "Anse Gaulette Whisper",
    place: "Anse Gaulette",
    timeOfDay: "Night",
    weather: "ground fog bands",
    bearingDeg: 202,
    tide: "Low",
    moonPhase: "New",
    cipherOutput: "RE",
    riddle: "Choose the middle star where fog eats sound.",
    rarity: "Mythic",
    description: "Midnight settles over Anse Gaulette like a velvet shroud, broken only by bands of ground fog that drift across the shore break. A black cat with emerald eyes perches atop a rope-bound chest, its gaze fixed on some unseen presence beyond the veil. Three stars gleam in its collar—celestial markers that align with the cardinal directions. Behind the shifting fog, a witch's silhouette moves like smoke made flesh."
  },
  {
    id: "ch4_004",
    name: "Police Bay Warding",
    place: "Grand Police (Police Bay)",
    timeOfDay: "Noon",
    weather: "strong trade wind",
    bearingDeg: 226,
    tide: "Falling",
    moonPhase: "Waxing Crescent",
    cipherOutput: "PI",
    riddle: "Shadowed steel counts truer than the sun.",
    rarity: "Epic",
    description: "The noon sun blazes overhead as strong trade winds whip Police Bay into a frenzy of white-capped rollers. Two weathered pirates brace against a mast-spar driven deep into the sand, while a witch traces protective veve symbols with driftwood in the churning surf. Crossed cutlasses lie embedded in the sand, their shadows forming the numbers 2 and 6—a cipher written in steel and light that counts truer than any sundial."
  },
  {
    id: "ch4_005",
    name: "Cap Ternay Sounding",
    place: "Cap Ternay",
    timeOfDay: "Dawn",
    weather: "calm haze",
    bearingDeg: 158,
    tide: "High",
    moonPhase: "Waning Gibbous",
    cipherOutput: "CA",
    riddle: "Hear the sea count in steps of living growth.",
    rarity: "Rare",
    description: "Dawn breaks softly over Cap Ternay, the marine park headlands emerging from calm haze like ancient guardians. A pirate sounder works his lead line with practiced precision, while beside him a witch holds a conch shell to her ear, listening to the sea's secrets. The lead weight bears a stamped '3', and the knotted line reveals the sacred sequence: 3, 5, 8—the Fibonacci numbers that nature herself uses to count."
  },
  {
    id: "ch4_006",
    name: "Rock Pool Charm",
    place: "Port Glaud Rock Pool",
    timeOfDay: "Late afternoon",
    weather: "sunshafts through mist",
    bearingDeg: 187,
    tide: "Low",
    moonPhase: "First Quarter",
    cipherOutput: "UL",
    riddle: "Where still water spills, the spiral names the way.",
    rarity: "Epic",
    description: "Sunshafts pierce the afternoon mist at Port Glaud's sacred rock pools, creating cathedral light around a witch who raises her lantern from atop a granite boulder. Below, a pirate kneels reading cipher scraps by the still water that spills eternally from pool to sea. A coin spiral winds seven turns around the ancient rock—each revolution marking a letter, each turn a step toward truth."
  },
  {
    id: "ch4_007",
    name: "Sauzier's Fall Sign",
    place: "Sauzier Waterfall (Port Glaud)",
    timeOfDay: "Midday",
    weather: "spray",
    bearingDeg: 110,
    tide: "N/A",
    moonPhase: "Waning Crescent",
    cipherOutput: "TE",
    riddle: "Three arrows fall, one bearing stands.",
    rarity: "Legendary",
    description: "The midday sun creates rainbows in the spray of Sauzier Waterfall as pirate and witch stand side by side on the wet stone ledge. Three rune-arrows have been carved deep into the rock face, their meanings lost to time but their directions clear: East, South, East. The falling water translates their message into a single bearing—110 degrees true, where three arrows fall but one bearing stands eternal."
  },
  {
    id: "ch4_008",
    name: "Mission Lodge Veil",
    place: "Mission Lodge (Sans Souci)",
    timeOfDay: "Sunset",
    weather: "mist below ridges",
    bearingDeg: 233,
    tide: "—",
    moonPhase: "Full",
    cipherOutput: "LT",
    riddle: "At the ridge of lost voices, measure what the sun forgets.",
    rarity: "Mythic",
    description: "Sunset flames the stone arches of Mission Lodge as mist pools in the valleys far below. A witch's veil billows across the compass ring etched in stone, while a pirate adjusts his sextant to capture the sun's final angle. At 23 degrees—the tropic's secret—the instrument measures what the sun forgets at the ridge where lost voices still echo through ruins of colonial dreams."
  },
  {
    id: "ch4_009",
    name: "Copolia Sky",
    place: "Copolia trail summit",
    timeOfDay: "Morning",
    weather: "low cloud",
    bearingDeg: 45,
    tide: "—",
    moonPhase: "Waxing Gibbous",
    cipherOutput: "AN",
    riddle: "Pin the map where the cloud thins to glass.",
    rarity: "Epic",
    description: "Morning clouds swirl around Copolia's granite dome as Victoria spreads far below like a cartographer's dream. A witch sprinkles salt to the four winds while a pirate pins a parchment map with his dagger's point. The blade aims true northeast at 045 degrees, while four coins mark the cardinal points—a cipher written in steel and silver where the cloud thins to glass and truth becomes visible."
  },
  {
    id: "ch4_010",
    name: "Morne Blanc Watch",
    place: "Morne Blanc viewpoint",
    timeOfDay: "Late morning",
    weather: "bright",
    bearingDeg: 261,
    tide: "—",
    moonPhase: "Waning Gibbous",
    cipherOutput: "SE",
    riddle: "What's missing points harder than what remains.",
    rarity: "Rare",
    description: "The late morning sun illuminates Morne Blanc's commanding viewpoint as layered ridges cascade toward the sea in perfect perspective. A pirate scans the horizon through his brass spyglass while a witch traces mystical circles in the mountain lichen. The compass card lies open nearby, but the 'E' has been torn away—for what's missing points harder than what remains, and the spyglass aims true at 261 degrees."
  },
  {
    id: "ch4_011",
    name: "Anse Major Passage",
    place: "Anse Major",
    timeOfDay: "Afternoon",
    weather: "glare on water",
    bearingDeg: 222,
    tide: "Rising",
    moonPhase: "First Quarter",
    cipherOutput: "GA",
    riddle: "Two coils, two eyes; follow the double.",
    rarity: "Epic",
    description: "Afternoon glare transforms Anse Major's coastal footpath into a ribbon of white light as a weathered pirate hauls the corner of a treasure chest along the granite trail. A witch marks an 'X' on the stone slab while a black cat watches with unblinking green eyes. Two rope coils lie nearby, two cat eyes gleam—the double count leads to bearing 222 degrees, where mathematics and mysticism converge."
  },
  {
    id: "ch4_012",
    name: "Eden Channel Lights",
    place: "Victoria / Eden Island channel",
    timeOfDay: "Night",
    weather: "clear sky",
    bearingDeg: 278,
    tide: "Slack",
    moonPhase: "New",
    cipherOutput: "UL",
    riddle: "Where man's stars mirror heaven's, read the shorter song.",
    rarity: "Legendary",
    description: "Night transforms Victoria harbor into a constellation of earthbound stars, each light reflecting in the dark channel waters like fallen pieces of Orion. A pirate stands at the rail while a witch cups a flame that hides ancient runes in its flickering dance. Three lanterns of different heights spell Morse code in the darkness—dot-dash, the shorter song that sailors know means 'A' for anchorage, for arrival, for the end of all voyaging."
  },
  {
    id: "ch4_013",
    name: "Moyenne Graves",
    place: "Moyenne Island (pirate graves)",
    timeOfDay: "Dawn",
    weather: "sea haze",
    bearingDeg: 196,
    tide: "Low",
    moonPhase: "Waxing Crescent",
    cipherOutput: "ET",
    riddle: "Count what's prayed, not what's carved.",
    rarity: "Mythic",
    description: "Dawn haze shrouds the simple grave markers of Moyenne Island, where pirates of old found their final anchorage. A weathered corsair kneels in respect while a witch places a skull-coin on weathered stone as offering. Rosary-like beads lie scattered in the sacred rhythm 1-3-2, their prayer-pattern more meaningful than any carved epitaph. Count what's prayed, not what's carved—for the living remember better than stone."
  },
  {
    id: "ch4_014",
    name: "Cerf's Narrow",
    place: "Cerf Island channel",
    timeOfDay: "Midday",
    weather: "stiff breeze",
    bearingDeg: 304,
    tide: "Falling",
    moonPhase: "Waxing Gibbous",
    cipherOutput: "TA",
    riddle: "Hold the tiller where coral bites blue.",
    rarity: "Epic",
    description: "A stiff breeze drives the sail through Cerf Island's treacherous channel, where coral teeth gleam turquoise beneath the surface. The witch casts protective salt astern while the pirate grips the tiller, a dagger lashed across it at the crucial angle of 304 degrees. Five coral dots mark the chart—count them to find the fifth letter of 'LAZARE', but hold the tiller steady where coral bites blue and depths run shallow."
  },
  {
    id: "ch4_015",
    name: "Anse Royale Rune",
    place: "Anse Royale",
    timeOfDay: "Sunset",
    weather: "calm",
    bearingDeg: 143,
    tide: "Low",
    moonPhase: "Full",
    cipherOutput: "LA",
    riddle: "Four steps, a crooked cross—the shorter arm is the truth.",
    rarity: "Rare",
    description: "Sunset calm settles over Anse Royale as a driftwood shrine takes shape on the pristine beach. The witch paints ancient runes while a pirate arranges coins in the pattern of a cross—but this cross is crooked, its arms unequal in the ratio 1:3. Four cat prints in the sand lead to this sacred geometry, where the shorter arm points to truth and the fourth and third letters of 'ETTE' spell the evening's secret."
  },
  {
    id: "ch4_016",
    name: "Baie Lazare Lantern Line",
    place: "Baie Lazare",
    timeOfDay: "Night",
    weather: "thin fog",
    bearingDeg: 292,
    tide: "Rising",
    moonPhase: "Waning Crescent",
    cipherOutput: "ZA",
    riddle: "Where five lights breathe, follow the wider path.",
    rarity: "Epic",
    description: "Five lanterns pierce the thin fog of Baie Lazare night, staked in a line along the shore like beacons for lost souls. A pirate counts their rhythm while a witch points toward the ridge where Lazare Picault first glimpsed this sacred bay. The lantern spacing breathes its own language—wide, narrow, wide—spelling WNW in the maritime tongue, bearing 292 degrees true toward the wider path of destiny."
  },
  {
    id: "ch4_017",
    name: "Anse Soleil Cross-Sea",
    place: "Anse Soleil",
    timeOfDay: "Morning",
    weather: "crisp glare",
    bearingDeg: 207,
    tide: "High",
    moonPhase: "First Quarter",
    cipherOutput: "RE",
    riddle: "Span the yellow sea with seven holds.",
    rarity: "Legendary",
    description: "Morning's crisp glare transforms Anse Soleil into a yellow sea between twin headlands, its waters gleaming like molten gold. A pirate stretches a line across the bay's throat while a witch hangs a protective charm at the rope's midspan. Seven knots mark the rope's length—count to the seventh to find the seventh letter of 'PICAULT', where T marks the spot and the yellow sea yields its solar secret."
  },
  {
    id: "ch4_018",
    name: "Takamaka Sign",
    place: "Takamaka",
    timeOfDay: "Late afternoon",
    weather: "salt haze",
    bearingDeg: 169,
    tide: "Falling",
    moonPhase: "Waxing Gibbous",
    cipherOutput: "PI",
    riddle: "The root points where the ribbon breathes.",
    rarity: "Rare",
    description: "Salt haze softens the late afternoon light filtering through the massive takamaka roots that tower like cathedral buttresses. A witch nails a silk ribbon to the ancient bark while a pirate carves a compass rose into the living wood. The carved needle points to 169 degrees, while the ribbon bears three holes that breathe the numbers 1-6-9—a trinity of direction where root wisdom and human craft converge."
  },
  {
    id: "ch4_019",
    name: "Lazare Picault View",
    place: "Lazare Picault viewpoint (Anse Boileau ridge)",
    timeOfDay: "Sunset",
    weather: "glowing haze",
    bearingDeg: 255,
    tide: "—",
    moonPhase: "Waning Gibbous",
    cipherOutput: "CA",
    riddle: "Name the man the ridge remembers.",
    rarity: "Mythic",
    description: "The wide sea vista spreads below Lazare Picault viewpoint as sunset creates a glowing haze over the waters where the great explorer first charted these islands. Pirate and witch stand together beneath the large compass ring etched in stone, while a skull guards the cutlass sheathed at the pirate's side. The sun sits precisely at the 255-degree mark, and tiny letters 'LP' are etched nearby—initials that name the man this ridge remembers."
  },
  {
    id: "ch4_020",
    name: "Gaulette Night Oath",
    place: "Anse Gaulette",
    timeOfDay: "Midnight",
    weather: "low fog + starlight",
    bearingDeg: 320,
    tide: "Lowest",
    moonPhase: "New",
    cipherOutput: "UL",
    riddle: "Read the sea left to right; breathe when the tide holds its breath.",
    rarity: "Mythic",
    description: "Midnight returns to Anse Gaulette where this mystical chapter began, but now the final chest lies half-buried beneath coiled rope and starlight. The witch lifts her veil for the ultimate revelation while the pirate plants his flag in sand that remembers countless tides. Runes spell 'ANSE GAULETTE' across the wave crests when read left to right, while the flagpole tilts to 320 degrees—the final bearing where breath holds and tide waits, and all secrets converge."
  }
];

// Generate all JSON metadata files
const outputDir = './metadata';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🏴‍☠️ Generating Chapter IV Metadata Files...\n');

chapter4Cards.forEach((card) => {
  const metadata = {
    name: card.name,
    description: `${card.description} Bearing ${card.bearingDeg}°. Cipher output: ${card.cipherOutput}. "${card.riddle}"`,
    image: `../images/${card.id}.png`,
    chapter: "IV — Witch-Winds of Mahé",
    island: "Mahé",
    place: card.place,
    timeOfDay: card.timeOfDay,
    weather: card.weather,
    bearingDeg: card.bearingDeg,
    tide: card.tide,
    moonPhase: card.moonPhase,
    cipherOutput: card.cipherOutput,
    riddle: card.riddle,
    attributes: [
      {
        trait_type: "Chapter",
        value: "IV — Witch-Winds of Mahé"
      },
      {
        trait_type: "Island",
        value: "Mahé"
      },
      {
        trait_type: "Place",
        value: card.place
      },
      {
        trait_type: "Time of Day",
        value: card.timeOfDay
      },
      {
        trait_type: "Weather",
        value: card.weather
      },
      {
        trait_type: "Bearing",
        value: `${card.bearingDeg.toString().padStart(3, '0')}°`
      },
      {
        trait_type: "Tide",
        value: card.tide
      },
      {
        trait_type: "Moon Phase",
        value: card.moonPhase
      },
      {
        trait_type: "Cipher Output",
        value: card.cipherOutput
      },
      {
        trait_type: "Rarity",
        value: card.rarity
      }
    ]
  };

  const filename = `${card.id}.json`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));
  console.log(`✅ Created: ${filename} - ${card.name}`);
});

console.log(`\n🎉 Generated ${chapter4Cards.length} Chapter IV metadata files!`);
console.log('\n📊 CIPHER PUZZLE SUMMARY:');

let cipher = '';
chapter4Cards.forEach((card) => {
  cipher += card.cipherOutput;
  console.log(`${card.id}: ${card.place.padEnd(35)} | ${card.bearingDeg.toString().padStart(3, '0')}° | ${card.cipherOutput}`);
});

console.log(`\n🔮 COMPLETE CIPHER: ${cipher}`);
console.log(`🗺️  DECODED MESSAGE: "LAZARE PICAULT ANSE GAULETTE"`);

console.log('\n🎨 Next step: Generate the 2048x2048 PNG artwork for each card!');
console.log('   Style: Aged parchment + compass rings + etched pirates/witches + deep indigo/gold palette');