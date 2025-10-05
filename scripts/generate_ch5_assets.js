import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';
import seedrandom from 'seedrandom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_SIZE = 2048;
const imageDir = path.resolve(__dirname, '../content/ch5/images');
const metadataDir = path.resolve(__dirname, '../content/ch5/metadata');

const palette = {
  parchmentLight: '#f8e3c0',
  parchmentMid: '#dcb484',
  parchmentDark: '#b98754',
  inkMidnight: '#081529',
  inkDeep: '#121d36',
  inkShadow: '#020914',
  indigo: '#294a8d',
  indigoBright: '#3b5db4',
  indigoFaint: '#6a7bb8',
  gold: '#e8c36a',
  ember: '#ff7b4f',
  moss: '#9bcf6d',
  surf: '#6fd1c7',
  coral: '#f25c5c'
};

const cards = [
  {
    tokenId: 201,
    slug: 'ch5_001',
    seed: 'ch5_001',
    name: 'Cerf Landing',
    place: 'Western beach',
    timeOfDay: 'Dawn',
    weather: 'Low tide haze',
    tide: 'Low',
    moonPhase: 'Waning Crescent',
    bearingDeg: 31,
    cipherOutput: 'CE',
    riddle: 'Count the coils where land first holds the oar.',
    scene: {
      sky: ['#edb762', '#fe9152', '#b85e5d'],
      ocean: ['#18324d', '#214a68'],
      glowPosition: { x: 1100, y: 620 },
      characters: [
        { type: 'pirate', x: 780, y: 1260, scale: 1.15, hueShift: 10 },
        { type: 'witch', x: 980, y: 1200, scale: 1.05, hueShift: -15 }
      ],
      props: [
        { type: 'anchorRope', x: 1080, y: 1460, scale: 1.1, coils: 3 },
        { type: 'skullToken', x: 860, y: 1350, scale: 0.38 }
      ],
      birds: 0,
      map: { coastlineSeed: 1, reefSeed: 2 }
    },
    description: `Rowboats grind onto Cerf Island’s western strand as the lagoon exhales its dawn mist. A witch pours a salt circle around the anchor while a pirate drags the hull clear, sunrise blazing through haze and rope spray.

Reef flats sketch the background in cold indigo, skull token and triple coils marking the first letters of the island’s hidden truth.`,
  },
  {
    tokenId: 202,
    slug: 'ch5_002',
    seed: 'ch5_002',
    name: 'Grave of the Reef',
    place: 'Coral shallows',
    timeOfDay: 'Noon',
    weather: 'Blazing sun',
    tide: 'Low',
    moonPhase: 'First Quarter',
    bearingDeg: 45,
    cipherOutput: 'RF',
    riddle: 'Where coral bites wood, follow the shadow’s cross.',
    scene: {
      sky: ['#ffcf75', '#ff9a47', '#ff7c4f'],
      ocean: ['#1b4f6f', '#257f9a'],
      glowPosition: { x: 1120, y: 520 },
      characters: [
        { type: 'witch', x: 1240, y: 1080, scale: 1.18, hueShift: 25 },
        { type: 'pirateDiver', x: 960, y: 1500, scale: 1.2, hueShift: -10 }
      ],
      props: [
        { type: 'wreckRibs', x: 820, y: 1620, scale: 1.1 },
        { type: 'chestCracked', x: 1200, y: 1440, scale: 0.9, angle: 45 },
        { type: 'parrotShadow', x: 1180, y: 980, scale: 1.2 }
      ],
      birds: 3,
      map: { coastlineSeed: 2, reefSeed: 6 }
    },
    description: `At the reef’s jagged grave, noon light burns across skeletal timbers and chanting silhouettes. A pirate plunges among wreck ribs as the witch’s spell shapes the shore into gilded notation.

A parrot’s shadow slices the chest lid at a precise angle, letting coral and sun agree on the bearing that unlocks the next letters.`,
  },
  {
    tokenId: 203,
    slug: 'ch5_003',
    seed: 'ch5_003',
    name: 'Mangrove Veil',
    place: 'Inner lagoon mangroves',
    timeOfDay: 'Afternoon',
    weather: 'Humid mist',
    tide: 'High',
    moonPhase: 'Waxing Gibbous',
    bearingDeg: 88,
    cipherOutput: 'IS',
    riddle: 'The roots hoard what the tide forgets.',
    scene: {
      sky: ['#fbcf8a', '#c38f73', '#6c4b69'],
      ocean: ['#1d3f59', '#2c6575'],
      glowPosition: { x: 820, y: 580 },
      characters: [
        { type: 'witch', x: 920, y: 1320, scale: 1.1, hueShift: -12 },
        { type: 'pirateSpy', x: 640, y: 1260, scale: 1.05, hueShift: 18 }
      ],
      props: [
        { type: 'mangroveRoots', x: 980, y: 1420, scale: 1.25 },
        { type: 'coinsCluster', x: 1020, y: 1360, scale: 0.5, count: 4 },
        { type: 'heron', x: 1450, y: 820, scale: 0.8 }
      ],
      birds: 0,
      map: { coastlineSeed: 5, reefSeed: 7 }
    },
    description: `Humidity drapes the mangroves while runes swirl through their mirrored water. The witch stirs tidal sigils as a pirate peers through tangled roots, green light catching each coin the current abandoned.

Cerf’s inner lagoon surfaces as engraved parchment, revealing the letters the mangroves keep for those who follow the fourth gleam.`,
  },
  {
    tokenId: 204,
    slug: 'ch5_004',
    seed: 'ch5_004',
    name: 'Old Anchorage',
    place: 'Anchorage stones',
    timeOfDay: 'Evening',
    weather: 'Sea breeze',
    tide: 'Rising',
    moonPhase: 'Full',
    bearingDeg: 120,
    cipherOutput: 'LA',
    riddle: 'Light split in two points to the ring that holds.',
    scene: {
      sky: ['#fca95a', '#de794e', '#6a3260'],
      ocean: ['#1a3a58', '#27526f'],
      glowPosition: { x: 1260, y: 640 },
      characters: [
        { type: 'pirateHammer', x: 820, y: 1320, scale: 1.1, hueShift: -5 },
        { type: 'witchTalisman', x: 1160, y: 1280, scale: 1.12, hueShift: 14 }
      ],
      props: [
        { type: 'mooringRing', x: 960, y: 1500, scale: 1.15 },
        { type: 'lanternTwinFlame', x: 1180, y: 1120, scale: 0.85 },
        { type: 'skullRelief', x: 920, y: 1410, scale: 0.55 }
      ],
      birds: 0,
      map: { coastlineSeed: 7, reefSeed: 1 }
    },
    description: `Evening surge collides with the anchorage while iron rings bite into volcanic stone. Twin tongues of lantern fire stretch apart as charms flutter on sea breeze lines etched across the parchment.

The carved skull witnesses anchor and flame converge, sketching the cipher drawn by the tide itself.`,
  },
  {
    tokenId: 205,
    slug: 'ch5_005',
    seed: 'ch5_005',
    name: 'Parrot’s Cry',
    place: 'Coconut grove',
    timeOfDay: 'Morning',
    weather: 'Sunshafts',
    tide: 'Slack',
    moonPhase: 'Waning Crescent',
    bearingDeg: 147,
    cipherOutput: 'ND',
    riddle: 'Feathers number the secret cry.',
    scene: {
      sky: ['#ffe49b', '#f4ad6d', '#d1667c'],
      ocean: ['#174259', '#236579'],
      glowPosition: { x: 900, y: 520 },
      characters: [
        { type: 'pirateBlade', x: 760, y: 1340, scale: 1.05, hueShift: 5 },
        { type: 'witchParrot', x: 980, y: 1200, scale: 1.08, hueShift: 18 }
      ],
      props: [
        { type: 'parrotRelease', x: 980, y: 960, scale: 1.1 },
        { type: 'featherSpiral', x: 1020, y: 1100, scale: 1.05, count: 7 },
        { type: 'beltSkull', x: 780, y: 1320, scale: 0.4 }
      ],
      birds: 5,
      map: { coastlineSeed: 9, reefSeed: 3 }
    },
    description: `Sunbeams carve the coconut grove into golden slats while a pirate sharpens his blade and a witch unleashes a screaming parrot. Indigo palms bend like inked glyphs across Cerf’s shoreline in the frame.

Seven feathers spiral through the warm air, landing as a counted sign for those tracing the hidden phrase.`,
  },
  {
    tokenId: 206,
    slug: 'ch5_006',
    seed: 'ch5_006',
    name: 'Witch’s Pool',
    place: 'Tidepool hollow',
    timeOfDay: 'Midnight',
    weather: 'Clear starlight',
    tide: 'Low',
    moonPhase: 'New',
    bearingDeg: 175,
    cipherOutput: 'HI',
    riddle: 'The pool repeats the sky if counted five.',
    scene: {
      sky: ['#0c162d', '#142443', '#213b66'],
      ocean: ['#0b273b', '#10384a'],
      glowPosition: { x: 1040, y: 640 },
      characters: [
        { type: 'witchStargazer', x: 980, y: 1260, scale: 1.12, hueShift: 32 },
        { type: 'pirateLantern', x: 760, y: 1280, scale: 1.04, hueShift: -12 }
      ],
      props: [
        { type: 'tidePool', x: 1020, y: 1500, scale: 1.0, coinCount: 5 },
        { type: 'catReflection', x: 1120, y: 1420, scale: 0.75 }
      ],
      birds: 0,
      map: { coastlineSeed: 11, reefSeed: 4 }
    },
    description: `Midnight hush drapes the tidepool hollow in deep indigo. The witch traces constellations across mirrored water while a pirate steadies a lantern, star glow bleeding into the shoreline engravings around them.

Five coins orbit the pool to repeat the heavens, mapping the cipher letters that ride the pentagram current.`,
  },
  {
    tokenId: 207,
    slug: 'ch5_007',
    seed: 'ch5_007',
    name: 'Shark Channel',
    place: 'Eastern reef channel',
    timeOfDay: 'Midday',
    weather: 'Rough swell',
    tide: 'Falling',
    moonPhase: 'Waxing Gibbous',
    bearingDeg: 206,
    cipherOutput: 'DE',
    riddle: 'Knots mark the teeth of the tide.',
    scene: {
      sky: ['#ffc973', '#fa8b53', '#d14c63'],
      ocean: ['#113659', '#1f5872'],
      glowPosition: { x: 1300, y: 720 },
      characters: [
        { type: 'pirateHarpoon', x: 840, y: 1340, scale: 1.1, hueShift: -20 },
        { type: 'witchChant', x: 1240, y: 1220, scale: 1.06, hueShift: 20 }
      ],
      props: [
        { type: 'ropeKnots', x: 900, y: 1480, scale: 1.1, count: 6 },
        { type: 'daggerTilt', x: 980, y: 1420, scale: 0.85, angle: 35 },
        { type: 'sharkFin', x: 1180, y: 1500, scale: 1.2 }
      ],
      birds: 0,
      map: { coastlineSeed: 13, reefSeed: 8 }
    },
    description: `Swell tears through the eastern channel as harpoons and spells brace against the tide. Foaming spray sketches Cerf’s reefs in vivid strokes across the parchment border.

Six rope knots and a dagger angled with the current etch the next pair of letters into the channel’s roar.`,
  },
  {
    tokenId: 208,
    slug: 'ch5_008',
    seed: 'ch5_008',
    name: 'Hermit’s Cave',
    place: 'Limestone cave',
    timeOfDay: 'Sunset',
    weather: 'Bats stirring',
    tide: 'Calm',
    moonPhase: 'Full',
    bearingDeg: 233,
  cipherOutput: 'S',
    riddle: 'Where shadows multiply, nine stand guard.',
    scene: {
      sky: ['#f79c5c', '#cf5b5f', '#502d56'],
      ocean: ['#102642', '#1d3a56'],
      glowPosition: { x: 900, y: 580 },
      characters: [
        { type: 'pirateLantern', x: 860, y: 1250, scale: 1.08, hueShift: 12 },
        { type: 'witchRune', x: 1180, y: 1140, scale: 1.06, hueShift: -18 }
      ],
      props: [
        { type: 'skullPile', x: 920, y: 1500, scale: 1.0, count: 6 },
        { type: 'runeCircle', x: 1200, y: 1420, scale: 0.95, count: 9 },
        { type: 'coinTrail', x: 1120, y: 1480, scale: 1.0 }
      ],
      birds: 4,
      map: { coastlineSeed: 4, reefSeed: 15 }
    },
    description: `Lantern fire splashes the cave walls while bats whirl through the dusk. Runes coil around limestone spires, each etched stroke mirrored on the parchment frame like secret cartography.

Nine runes burn brightest near the coin trail, guarding the letters whispered by Cerf’s hidden guardians.`,
  },
  {
    tokenId: 209,
    slug: 'ch5_009',
    seed: 'ch5_009',
    name: 'Sandbar Signal',
    place: 'Sand spit',
    timeOfDay: 'Dawn',
    weather: 'Mist',
    tide: 'Low',
    moonPhase: 'First Quarter',
    bearingDeg: 278,
  cipherOutput: 'TH',
    riddle: 'Mark the spit where birds trace letters.',
    scene: {
      sky: ['#f6d091', '#d28f7c', '#634478'],
      ocean: ['#17395a', '#235b78'],
      glowPosition: { x: 760, y: 520 },
      characters: [
        { type: 'pirateFlag', x: 960, y: 1260, scale: 1.1, hueShift: 8 },
        { type: 'witchSignal', x: 1180, y: 1140, scale: 1.02, hueShift: 18 }
      ],
      props: [
        { type: 'flagPole', x: 1080, y: 1240, scale: 1.2, angle: 278 },
        { type: 'birdSwarm', x: 1380, y: 960, scale: 1.1, count: 5 }
      ],
      birds: 7,
      map: { coastlineSeed: 14, reefSeed: 10 }
    },
    description: `Mist-draped dawn paints the sandbar while a standard slants toward the reef. A witch guides seabirds whose arcs scratch letters into the clouds above Cerf’s engraved silhouette.

Flag and flight intersect to reveal the solitary cipher for navigators watching the spit.`,
  },
  {
    tokenId: 210,
    slug: 'ch5_010',
    seed: 'ch5_010',
    name: 'Driftwood Shrine',
    place: 'Northern drift piles',
    timeOfDay: 'Noon',
    weather: 'Bright',
    tide: 'High',
    moonPhase: 'Waxing Gibbous',
    bearingDeg: 303,
  cipherOutput: 'E',
    riddle: 'Three planks speak louder than one.',
    scene: {
      sky: ['#ffe3a6', '#f4aa73', '#b86a76'],
      ocean: ['#18445c', '#246278'],
      glowPosition: { x: 840, y: 560 },
      characters: [
        { type: 'witchShrine', x: 1040, y: 1180, scale: 1.02, hueShift: -8 },
        { type: 'pirateKneel', x: 780, y: 1360, scale: 1.08, hueShift: 6 }
      ],
      props: [
        { type: 'driftPlanks', x: 1040, y: 1260, scale: 1.1, count: 3 },
        { type: 'altarSkull', x: 1040, y: 1310, scale: 0.5 }
      ],
      birds: 0,
      map: { coastlineSeed: 3, reefSeed: 12 }
    },
    description: `Bright noon crowns the driftwood altar with heat shimmer as sigils burn into bleached planks. A skull offering glows beneath the rope frame while Cerf’s northern reef fans across the parchment margin.

The triple pillars stand as mute witnesses for coded travelers reading between the beams.`,
  },
  {
    tokenId: 211,
    slug: 'ch5_011',
    seed: 'ch5_011',
    name: 'Cliff Echo',
    place: 'Cerf cliff face',
    timeOfDay: 'Afternoon',
    weather: 'Hot wind',
    tide: 'Rising',
    moonPhase: 'First Quarter',
    bearingDeg: 27,
  cipherOutput: 'KE',
    riddle: 'The echo answers in doubles.',
    scene: {
      sky: ['#ffcf81', '#ec955a', '#8d4562'],
      ocean: ['#16395a', '#235678'],
      glowPosition: { x: 1220, y: 520 },
      characters: [
        { type: 'pirateCall', x: 840, y: 1260, scale: 1.1, hueShift: -14 },
        { type: 'witchShell', x: 1120, y: 1200, scale: 1.08, hueShift: 12 }
      ],
      props: [
        { type: 'cliffFace', x: 920, y: 1180, scale: 1.3 },
        { type: 'ropeLoops', x: 940, y: 1460, scale: 1.1, count: 2 }
      ],
      birds: 0,
      map: { coastlineSeed: 16, reefSeed: 6 }
    },
    description: `Wind scorches the cliff as shouting silhouettes bounce echoes through hollow stone. Ropes loop twice across etched ledges while seawave glyphs ripple outward over Cerf’s cartographic border.

Double lines answer each call, promising the pattern to those who listen without speaking.`,
  },
  {
    tokenId: 212,
    slug: 'ch5_012',
    seed: 'ch5_012',
    name: 'Hidden Spring',
    place: 'Freshwater seep',
    timeOfDay: 'Evening',
    weather: 'Dripping',
    tide: 'Calm',
    moonPhase: 'Full',
    bearingDeg: 41,
  cipherOutput: 'Y',
    riddle: 'Cross what flows unseen.',
    scene: {
      sky: ['#f2c78c', '#c98666', '#5e3d6b'],
      ocean: ['#13324d', '#205470'],
      glowPosition: { x: 820, y: 620 },
      characters: [
        { type: 'witchWater', x: 960, y: 1300, scale: 1.1, hueShift: 18 },
        { type: 'pirateMark', x: 760, y: 1360, scale: 1.06, hueShift: -8 }
      ],
      props: [
        { type: 'springRune', x: 980, y: 1400, scale: 1.05 },
        { type: 'waterGlow', x: 980, y: 1480, scale: 1.1 }
      ],
      birds: 0,
      map: { coastlineSeed: 20, reefSeed: 9 }
    },
    description: `Evening shadows hide the freshwater seam that cuts through Cerf’s rock. Water glows turquoise as hooked runes score the stone, light refracting through the rope border like a secret tributary.

Every arm of the carved cross points to a hidden flow for those who can trace unseen currents.`,
  },
  {
    tokenId: 213,
    slug: 'ch5_013',
    seed: 'ch5_013',
    name: 'Turtle Nest',
    place: 'Beach dune',
    timeOfDay: 'Night',
    weather: 'Starlit',
    tide: 'Low',
    moonPhase: 'New',
    bearingDeg: 73,
    cipherOutput: '—',
    riddle: 'The tide counts in shells.',
    scene: {
      sky: ['#0a0f24', '#162a46', '#2a4a68'],
      ocean: ['#07192d', '#0e2c3c'],
      glowPosition: { x: 1200, y: 560 },
      characters: [
        { type: 'witchSand', x: 960, y: 1400, scale: 1.08, hueShift: 18 },
        { type: 'pirateGuard', x: 780, y: 1360, scale: 1.02, hueShift: -14 }
      ],
      props: [
        { type: 'turtleEggs', x: 980, y: 1500, scale: 0.9, count: 8 },
        { type: 'starSpray', x: 1080, y: 600, scale: 1.2 }
      ],
      birds: 0,
      map: { coastlineSeed: 18, reefSeed: 14 }
    },
    description: `Moonless night turns the dune into a field of luminous sand. A pirate shields the nest while charms scatter in silver arcs, the coastline glittering as etched constellations.

Eight eggs align in tiers for those who read the tide’s own ledger.`,
  },
  {
    tokenId: 214,
    slug: 'ch5_014',
    seed: 'ch5_014',
    name: 'Seagrass Rune',
    place: 'Lagoon seagrass',
    timeOfDay: 'Morning',
    weather: 'Calm',
    tide: 'High',
    moonPhase: 'Waning Crescent',
    bearingDeg: 99,
    cipherOutput: '—',
    riddle: 'The net drags what grows.',
    scene: {
      sky: ['#f6e099', '#e7a977', '#b0616d'],
      ocean: ['#17485f', '#266d7c'],
      glowPosition: { x: 880, y: 560 },
      characters: [
        { type: 'pirateNet', x: 740, y: 1280, scale: 1.08, hueShift: -10 },
        { type: 'witchStone', x: 1100, y: 1220, scale: 1.1, hueShift: 18 }
      ],
      props: [
        { type: 'runeStoneO', x: 1180, y: 1320, scale: 1.1 },
        { type: 'seagrass', x: 860, y: 1520, scale: 1.2 }
      ],
      birds: 2,
      map: { coastlineSeed: 6, reefSeed: 17 }
    },
    description: `Still morning varnishes the lagoon while nets trail luminous seagrass. The witch hauls a rune stone that glows with twin arms, matching the braided reef lines etched into the frame.

Those who watch the forked gleam will know which letter grows beneath the tide.`,
  },
  {
    tokenId: 215,
    slug: 'ch5_015',
    seed: 'ch5_015',
    name: 'Twin Palms',
    place: 'Islet grove',
    timeOfDay: 'Afternoon',
    weather: 'Breeze',
    tide: 'Rising',
    moonPhase: 'Waxing Gibbous',
    bearingDeg: 127,
    cipherOutput: '—',
    riddle: 'Two stand where one sways.',
    scene: {
      sky: ['#ffd78b', '#e29663', '#924c63'],
      ocean: ['#153a54', '#224f6d'],
      glowPosition: { x: 1020, y: 640 },
      characters: [
        { type: 'pirateCarve', x: 840, y: 1320, scale: 1.06, hueShift: -6 },
        { type: 'witchBanner', x: 1160, y: 1200, scale: 1.04, hueShift: 16 }
      ],
      props: [
        { type: 'twinPalms', x: 1020, y: 1260, scale: 1.3 },
        { type: 'shadowGlyph', x: 1040, y: 1400, scale: 0.9 }
      ],
      birds: 0,
      map: { coastlineSeed: 12, reefSeed: 5 }
    },
    description: `Breezes tangle cloth strips between two leaning palms as tally marks notch the sand. Cerf’s smaller keys unspool along the parchment edge like rope braids.

Twin shadows fall in parallel, a promise to seekers who already hold the earlier letters.`,
  },
  {
    tokenId: 216,
    slug: 'ch5_016',
    seed: 'ch5_016',
    name: 'Broken Mast',
    place: 'Old wreck mast',
    timeOfDay: 'Sunset',
    weather: 'Glowing surf',
    tide: 'Falling',
    moonPhase: 'Full',
    bearingDeg: 190,
    cipherOutput: '—',
    riddle: 'Wood tilts, bearing its last course.',
    scene: {
      sky: ['#ffb36b', '#e07452', '#803c5c'],
      ocean: ['#13385a', '#1f5673'],
      glowPosition: { x: 1360, y: 580 },
      characters: [
        { type: 'pirateWatch', x: 960, y: 1260, scale: 1.08, hueShift: -12 },
        { type: 'witchIncense', x: 1240, y: 1180, scale: 1.05, hueShift: 20 }
      ],
      props: [
        { type: 'brokenMast', x: 1100, y: 1340, scale: 1.25, angle: 190 },
        { type: 'incenseSmoke', x: 1240, y: 1320, scale: 1.1 }
      ],
      birds: 2,
      map: { coastlineSeed: 8, reefSeed: 13 }
    },
    description: `Sunset burns along the wreck mast jutting from Cerf’s surf. Smoke ribbons curl into the parchment sky while waves crash in lines that double as map contours.

Even broken timber remembers its course for readers of the shore.`,
  },
  {
    tokenId: 217,
    slug: 'ch5_017',
    seed: 'ch5_017',
    name: 'Skull Stack',
    place: 'Inland shrine',
    timeOfDay: 'Midnight',
    weather: 'Fog',
    tide: 'Calm',
    moonPhase: 'Waning Gibbous',
    bearingDeg: 214,
    cipherOutput: '—',
    riddle: 'Five watchers, one flame.',
    scene: {
      sky: ['#0a1324', '#16263c', '#243a55'],
      ocean: ['#071b2f', '#0d2c41'],
      glowPosition: { x: 1040, y: 540 },
      characters: [
        { type: 'witchStack', x: 1100, y: 1220, scale: 1.04, hueShift: 16 },
        { type: 'pirateTorch', x: 860, y: 1260, scale: 1.08, hueShift: -14 }
      ],
      props: [
        { type: 'skullColumn', x: 1020, y: 1400, scale: 0.95, count: 5 },
        { type: 'torchFlame', x: 860, y: 1140, scale: 0.9 }
      ],
      birds: 0,
      map: { coastlineSeed: 17, reefSeed: 18 }
    },
    description: `Fog curls through the inland shrine as skulls stack into a narrow tower. Torchlight flickers across rune-laced stone while Cerf’s ridgeline ghosts through the border.

Five hollow faces watch the cipher already spoken in earlier scenes.`,
  },
  {
    tokenId: 218,
    slug: 'ch5_018',
    seed: 'ch5_018',
    name: 'Beacon Rock',
    place: 'Tall reef boulder',
    timeOfDay: 'Dawn',
    weather: 'Haze',
    tide: 'Rising',
    moonPhase: 'Crescent',
    bearingDeg: 242,
    cipherOutput: '—',
    riddle: 'The stone calls the star.',
    scene: {
      sky: ['#f7d282', '#d89466', '#7c4364'],
      ocean: ['#15395a', '#24607a'],
      glowPosition: { x: 1280, y: 540 },
      characters: [
        { type: 'pirateSpyglass', x: 940, y: 1260, scale: 1.08, hueShift: -8 },
        { type: 'witchGlyph', x: 1200, y: 1200, scale: 1.06, hueShift: 18 }
      ],
      props: [
        { type: 'starRune', x: 1200, y: 1240, scale: 1.1 },
        { type: 'beaconRock', x: 1100, y: 1300, scale: 1.25 }
      ],
      birds: 1,
      map: { coastlineSeed: 10, reefSeed: 19 }
    },
    description: `Hazy dawn lights Beacon Rock where silhouettes balance between reef and sky. Star runes blaze across stone, mirrored by the etched archipelago wrapping the parchment frame.

The alignment reiterates the celestial letters already claimed by Cerf’s cipher.`,
  },
  {
    tokenId: 219,
    slug: 'ch5_019',
    seed: 'ch5_019',
    name: 'Lagoon Cross',
    place: 'Inner lagoon',
    timeOfDay: 'Noon',
    weather: 'Bright calm',
    tide: 'High',
    moonPhase: 'Full',
    bearingDeg: 268,
    cipherOutput: '—',
    riddle: 'Cross what sinks.',
    scene: {
      sky: ['#fff0a5', '#f6b876', '#be6c75'],
      ocean: ['#175066', '#2a7c88'],
      glowPosition: { x: 860, y: 620 },
      characters: [
        { type: 'pirateRow', x: 880, y: 1360, scale: 1.1, hueShift: -8 },
        { type: 'witchCoin', x: 1080, y: 1180, scale: 1.08, hueShift: 16 }
      ],
      props: [
        { type: 'coinSplash', x: 1140, y: 1420, scale: 1.1 },
        { type: 'lagoonRipples', x: 1000, y: 1460, scale: 1.15 }
      ],
      birds: 0,
      map: { coastlineSeed: 19, reefSeed: 11 }
    },
    description: `Bright noon stills the lagoon as ripple rings carve crosshairs into the mirrored water. Cerf’s interior reefs appear as translucent ink, balancing the boat’s glide and the witch’s offering.

The splash draws a perfect cross, affirming what the cipher already spells.`,
  },
  {
    tokenId: 220,
    slug: 'ch5_020',
    seed: 'ch5_020',
    name: 'Final Flame',
    place: 'Cerf shrine clearing',
    timeOfDay: 'Sunset',
    weather: 'Still',
    tide: 'Low',
    moonPhase: 'Waning Crescent',
    bearingDeg: 299,
    cipherOutput: '—',
    riddle: 'The last flame splits thrice.',
    scene: {
      sky: ['#ffb774', '#d1725a', '#6f3458'],
      ocean: ['#143f5b', '#215f74'],
      glowPosition: { x: 960, y: 620 },
      characters: [
        { type: 'witchLantern', x: 980, y: 1180, scale: 1.08, hueShift: 12 },
        { type: 'pirateDagger', x: 760, y: 1280, scale: 1.04, hueShift: -10 },
        { type: 'parrotPerch', x: 1220, y: 1160, scale: 0.9 }
      ],
      props: [
        { type: 'tripleFlame', x: 980, y: 1100, scale: 1.05 },
        { type: 'altarDagger', x: 780, y: 1360, scale: 0.9 }
      ],
      birds: 2,
      map: { coastlineSeed: 21, reefSeed: 16 }
    },
    description: `Sunset hush settles on the shrine as the final lantern ignites. A dagger roots into sacred stone while a parrot watches from a rope perch, the surrounding forest rendered in etched silhouettes.

Three tongues of flame rise as one, sealing the message Cerf has already whispered.`,
  }
];

const baseCharacterShapes = {
  pirate: [
    ['moveTo', -80, -40],
    ['bezierCurveTo', -120, -200, 60, -220, 80, -40],
    ['bezierCurveTo', 160, 60, 120, 200, 20, 260],
    ['bezierCurveTo', -60, 320, -160, 200, -140, 80],
    ['closePath']
  ],
  witch: [
    ['moveTo', -60, -60],
    ['bezierCurveTo', -100, -220, 80, -260, 120, -80],
    ['bezierCurveTo', 180, 120, 40, 280, -40, 260],
    ['bezierCurveTo', -120, 220, -140, 80, -60, -60],
    ['closePath']
  ],
  pirateDiver: [
    ['moveTo', -50, -20],
    ['bezierCurveTo', -120, -140, 40, -200, 120, -60],
    ['bezierCurveTo', 180, 40, 120, 160, 20, 200],
    ['bezierCurveTo', -80, 160, -130, 60, -50, -20],
    ['closePath']
  ],
  pirateHammer: [
    ['moveTo', -90, -70],
    ['bezierCurveTo', -140, -220, 80, -240, 140, -40],
    ['bezierCurveTo', 200, 120, 80, 260, -20, 260],
    ['bezierCurveTo', -160, 220, -160, 60, -90, -70],
    ['closePath']
  ],
  pirateBlade: [
    ['moveTo', -70, -40],
    ['bezierCurveTo', -120, -180, 60, -200, 120, -40],
    ['bezierCurveTo', 160, 100, 80, 240, -30, 260],
    ['bezierCurveTo', -150, 200, -140, 60, -70, -40],
    ['closePath']
  ],
  pirateLantern: [
    ['moveTo', -80, -50],
    ['bezierCurveTo', -120, -200, 80, -220, 140, -20],
    ['bezierCurveTo', 220, 160, 60, 280, -20, 260],
    ['bezierCurveTo', -160, 200, -140, 40, -80, -50],
    ['closePath']
  ],
  pirateHarpoon: [
    ['moveTo', -90, -60],
    ['bezierCurveTo', -150, -220, 100, -240, 160, -20],
    ['bezierCurveTo', 220, 160, 80, 300, -40, 260],
    ['bezierCurveTo', -200, 200, -150, 40, -90, -60],
    ['closePath']
  ]
};

const characterShapes = {
  ...baseCharacterShapes,
  witchChant: baseCharacterShapes.witch,
  witchRune: baseCharacterShapes.witch,
  witchTalisman: baseCharacterShapes.witch,
  witchParrot: baseCharacterShapes.witch,
  witchStargazer: baseCharacterShapes.witch,
  pirateSpy: baseCharacterShapes.pirate,
  pirateFlag: baseCharacterShapes.pirate,
  witchSignal: baseCharacterShapes.witch,
  witchShrine: baseCharacterShapes.witch,
  pirateKneel: baseCharacterShapes.pirate,
  pirateCall: baseCharacterShapes.pirate,
  witchShell: baseCharacterShapes.witch,
  witchWater: baseCharacterShapes.witch,
  pirateMark: baseCharacterShapes.pirate,
  witchSand: baseCharacterShapes.witch,
  pirateGuard: baseCharacterShapes.pirate,
  pirateNet: baseCharacterShapes.pirate,
  witchStone: baseCharacterShapes.witch,
  pirateCarve: baseCharacterShapes.pirate,
  witchBanner: baseCharacterShapes.witch,
  pirateWatch: baseCharacterShapes.pirate,
  witchIncense: baseCharacterShapes.witch,
  witchStack: baseCharacterShapes.witch,
  pirateTorch: baseCharacterShapes.pirate,
  pirateSpyglass: baseCharacterShapes.pirate,
  witchGlyph: baseCharacterShapes.witch,
  pirateRow: baseCharacterShapes.pirate,
  witchCoin: baseCharacterShapes.witch,
  witchLantern: baseCharacterShapes.witch,
  pirateDagger: baseCharacterShapes.pirate,
  parrotPerch: null
};

function drawBackground(ctx, scene, rng) {
  const gradient = ctx.createLinearGradient(0, 0, 0, OUTPUT_SIZE);
  gradient.addColorStop(0, scene.sky[0]);
  gradient.addColorStop(0.5, scene.sky[1]);
  gradient.addColorStop(1, scene.sky[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  const oceanGradient = ctx.createLinearGradient(0, OUTPUT_SIZE * 0.55, 0, OUTPUT_SIZE);
  oceanGradient.addColorStop(0, scene.ocean[0]);
  oceanGradient.addColorStop(1, scene.ocean[1]);
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, OUTPUT_SIZE * 0.55, OUTPUT_SIZE, OUTPUT_SIZE * 0.45);

  const glow = ctx.createRadialGradient(
    scene.glowPosition.x,
    scene.glowPosition.y,
    10,
    scene.glowPosition.x,
    scene.glowPosition.y,
    420
  );
  glow.addColorStop(0, 'rgba(255, 210, 150, 0.55)');
  glow.addColorStop(0.7, 'rgba(255, 150, 80, 0.15)');
  glow.addColorStop(1, 'rgba(255, 120, 60, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  for (let i = 0; i < 1200; i++) {
    const x = rng() * OUTPUT_SIZE;
    const y = rng() * OUTPUT_SIZE;
    const alpha = 0.04 + rng() * 0.05;
    const size = 2 + rng() * 4;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoastline(ctx, map, rng) {
  ctx.save();
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'rgba(255, 220, 150, 0.55)';
  ctx.beginPath();
  const startY = OUTPUT_SIZE * 0.55 + 80;
  ctx.moveTo(160, startY);
  let y = startY;
  for (let x = 160; x <= OUTPUT_SIZE - 160; x += 64) {
    const offset = Math.sin((x + map.coastlineSeed * 120) / 140) * 60 + (rng() - 0.5) * 90;
    y = startY + offset;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(90, 200, 200, 0.55)';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    const startOffset = 100 + i * 60;
    ctx.moveTo(200, startY + startOffset);
    for (let x = 200; x < OUTPUT_SIZE - 200; x += 48) {
      const offset = Math.sin((x + map.reefSeed * 140 + i * 60) / 110) * 40 + (rng() - 0.5) * 70;
      ctx.lineTo(x, startY + startOffset + offset);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function applyBorder(ctx, rng) {
  const margin = 120;
  ctx.save();
  ctx.lineWidth = 26;
  ctx.strokeStyle = 'rgba(120, 85, 40, 0.8)';
  ctx.strokeRect(margin, margin, OUTPUT_SIZE - margin * 2, OUTPUT_SIZE - margin * 2);

  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(235, 210, 150, 0.8)';
  ctx.strokeRect(margin + 32, margin + 32, OUTPUT_SIZE - (margin + 32) * 2, OUTPUT_SIZE - (margin + 32) * 2);

  ctx.setLineDash([16, 22]);
  ctx.strokeStyle = 'rgba(255, 224, 150, 0.4)';
  ctx.strokeRect(margin + 16, margin + 16, OUTPUT_SIZE - (margin + 16) * 2, OUTPUT_SIZE - (margin + 16) * 2);
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(255, 222, 173, 0.25)';
  for (let i = 0; i < 160; i++) {
    const angle = (Math.PI * 2 * i) / 160;
    const radius = OUTPUT_SIZE / 2 - margin - 30;
    const x = OUTPUT_SIZE / 2 + Math.cos(angle) * radius;
    const y = OUTPUT_SIZE / 2 + Math.sin(angle) * radius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const width = 18;
    const height = 42;
    ctx.beginPath();
    ctx.moveTo(-width / 2, -height / 2);
    ctx.lineTo(width / 2, -height / 2);
    ctx.lineTo(width / 3, height / 2);
    ctx.lineTo(-width / 3, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawShape(ctx, shape, x, y, scale, color, shadow = true) {
  if (!shape || shape.length === 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (shadow) {
    ctx.shadowColor = 'rgba(5, 5, 10, 0.45)';
    ctx.shadowBlur = 24;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  for (const command of shape) {
    const [type, ...args] = command;
    switch (type) {
      case 'moveTo':
        ctx.moveTo(...args);
        break;
      case 'lineTo':
        ctx.lineTo(...args);
        break;
      case 'bezierCurveTo':
        ctx.bezierCurveTo(...args);
        break;
      case 'quadraticCurveTo':
        ctx.quadraticCurveTo(...args);
        break;
      case 'closePath':
        ctx.closePath();
        break;
      default:
        break;
    }
  }
  ctx.fill('evenodd');
  ctx.restore();
}

function hueShift(hex, shift) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  const hsl = rgbToHsl(r, g, b);
  hsl[0] = (hsl[0] + shift / 360) % 1;
  if (hsl[0] < 0) hsl[0] += 1;
  const [nr, ng, nb] = hslToRgb(...hsl);
  return `rgba(${nr}, ${ng}, ${nb}, 0.92)`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function drawCharacters(ctx, scene) {
  for (const character of scene.characters) {
    if (character.type === 'parrotPerch') {
      drawParrot(ctx, character.x, character.y, character.scale || 1, palette.coral);
      continue;
    }
    const baseShape = characterShapes[character.type] || baseCharacterShapes.pirate;
    const color = hueShift('#0e182c', character.hueShift || 0);
    drawShape(ctx, baseShape, character.x, character.y, 3.6 * character.scale, color);
  }
}

function drawParrot(ctx, x, y, scale, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.1, scale * 1.1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-40, -20);
  ctx.bezierCurveTo(-100, -80, 80, -120, 120, -20);
  ctx.bezierCurveTo(160, 40, 60, 120, -20, 100);
  ctx.bezierCurveTo(-110, 60, -60, 20, -40, -20);
  ctx.fill();
  ctx.fillStyle = '#ffe27a';
  ctx.beginPath();
  ctx.arc(80, -40, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1b1b1b';
  ctx.beginPath();
  ctx.arc(94, -46, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawProps(ctx, props, rng) {
  for (const prop of props) {
    switch (prop.type) {
      case 'anchorRope':
        drawAnchor(ctx, prop.x, prop.y, prop.scale, prop.coils || 3);
        break;
      case 'skullToken':
        drawSkull(ctx, prop.x, prop.y, prop.scale, true);
        break;
      case 'wreckRibs':
        drawWreck(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'chestCracked':
        drawChest(ctx, prop.x, prop.y, prop.scale, prop.angle || 45);
        break;
      case 'parrotShadow':
        drawParrotShadow(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'mangroveRoots':
        drawMangroves(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'coinsCluster':
        drawCoins(ctx, prop.x, prop.y, prop.scale, prop.count || 4);
        break;
      case 'heron':
        drawHeron(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'mooringRing':
        drawRing(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'lanternTwinFlame':
        drawLantern(ctx, prop.x, prop.y, prop.scale, 2);
        break;
      case 'skullRelief':
        drawSkull(ctx, prop.x, prop.y, prop.scale, false);
        break;
      case 'parrotRelease':
        drawParrot(ctx, prop.x, prop.y, prop.scale, '#ff8c5a');
        break;
      case 'featherSpiral':
        drawFeathers(ctx, prop.x, prop.y, prop.scale, prop.count || 7);
        break;
      case 'beltSkull':
        drawSkull(ctx, prop.x, prop.y, prop.scale, true);
        break;
      case 'tidePool':
        drawTidePool(ctx, prop.x, prop.y, prop.scale, prop.coinCount || 5);
        break;
      case 'catReflection':
        drawCatEyes(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'ropeKnots':
        drawRope(ctx, prop.x, prop.y, prop.scale, prop.count || 6);
        break;
      case 'daggerTilt':
        drawDagger(ctx, prop.x, prop.y, prop.scale, prop.angle || 30);
        break;
      case 'sharkFin':
        drawSharkFin(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'skullPile':
        drawSkullPile(ctx, prop.x, prop.y, prop.scale, prop.count || 6);
        break;
      case 'runeCircle':
        drawRuneCircle(ctx, prop.x, prop.y, prop.scale, prop.count || 9);
        break;
      case 'coinTrail':
        drawCoinTrail(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'flagPole':
        drawFlag(ctx, prop.x, prop.y, prop.scale, prop.angle || 270);
        break;
      case 'birdSwarm':
        drawBirds(ctx, prop.x, prop.y, prop.scale, prop.count || 4);
        break;
      case 'driftPlanks':
        drawPlanks(ctx, prop.x, prop.y, prop.scale, prop.count || 3);
        break;
      case 'altarSkull':
        drawSkull(ctx, prop.x, prop.y, prop.scale, false);
        break;
      case 'cliffFace':
        drawCliff(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'ropeLoops':
        drawRope(ctx, prop.x, prop.y, prop.scale, prop.count || 2, true);
        break;
      case 'springRune':
        drawRuneCross(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'waterGlow':
        drawWaterGlow(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'turtleEggs':
        drawEggs(ctx, prop.x, prop.y, prop.scale, prop.count || 8);
        break;
      case 'starSpray':
        drawStarSpray(ctx, prop.x, prop.y, prop.scale, rng);
        break;
      case 'runeStoneO':
        drawRuneStone(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'seagrass':
        drawSeagrass(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'twinPalms':
        drawPalms(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'shadowGlyph':
        drawShadowGlyph(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'brokenMast':
        drawBrokenMast(ctx, prop.x, prop.y, prop.scale, prop.angle || 180);
        break;
      case 'incenseSmoke':
        drawSmoke(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'skullColumn':
        drawSkullColumn(ctx, prop.x, prop.y, prop.scale, prop.count || 5);
        break;
      case 'torchFlame':
        drawLantern(ctx, prop.x, prop.y, prop.scale, 1, true);
        break;
      case 'starRune':
        drawStarRune(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'beaconRock':
        drawBeaconRock(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'coinSplash':
        drawCoinSplash(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'lagoonRipples':
        drawRipples(ctx, prop.x, prop.y, prop.scale);
        break;
      case 'tripleFlame':
        drawLantern(ctx, prop.x, prop.y, prop.scale, 3);
        break;
      case 'altarDagger':
        drawDagger(ctx, prop.x, prop.y, prop.scale, -50);
        break;
      default:
        break;
    }
  }
}

function drawAnchor(ctx, x, y, scale, coils) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(255, 210, 170, 0.85)';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(0, -100, 70, Math.PI, Math.PI * 2);
  ctx.moveTo(-70, -100);
  ctx.lineTo(-70, 160);
  ctx.moveTo(70, -100);
  ctx.lineTo(70, 160);
  ctx.moveTo(-70, 160);
  ctx.quadraticCurveTo(0, 220, 70, 160);
  ctx.stroke();
  ctx.lineWidth = 12;
  ctx.beginPath();
  for (let i = 0; i < coils; i++) {
    ctx.arc(-90 + i * 45, -120 + i * 18, 30 + i * 6, 0, Math.PI * 2);
  }
  ctx.stroke();
  ctx.restore();
}

function drawSkull(ctx, x, y, scale, dark) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 80, scale * 80);
  ctx.fillStyle = dark ? 'rgba(34, 38, 60, 0.8)' : 'rgba(240, 220, 190, 0.7)';
  ctx.beginPath();
  ctx.arc(0, 0, 1, Math.PI, Math.PI * 2);
  ctx.bezierCurveTo(1.4, 0.6, 0.3, 1.8, 0, 2.4);
  ctx.bezierCurveTo(-0.3, 1.8, -1.4, 0.6, -1, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = dark ? 'rgba(190, 200, 255, 0.6)' : 'rgba(40, 40, 60, 0.7)';
  ctx.beginPath();
  ctx.arc(-0.45, -0.2, 0.28, 0, Math.PI * 2);
  ctx.arc(0.45, -0.2, 0.28, 0, Math.PI * 2);
  ctx.fill('evenodd');
  ctx.fillStyle = ctx.fillStyle;
  ctx.beginPath();
  ctx.moveTo(-0.2, 0.6);
  ctx.lineTo(0.2, 0.6);
  ctx.lineTo(0, 0.95);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWreck(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(240, 200, 150, 0.7)';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(-200, 0);
  ctx.lineTo(-100, -160);
  ctx.lineTo(0, -200);
  ctx.lineTo(80, -140);
  ctx.lineTo(160, 0);
  ctx.stroke();
  ctx.restore();
}

function drawChest(ctx, x, y, scale, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(scale * 1.2, scale * 1.2);
  ctx.fillStyle = 'rgba(90, 50, 40, 0.8)';
  ctx.fillRect(-120, -80, 240, 120);
  ctx.fillStyle = 'rgba(220, 180, 90, 0.8)';
  ctx.fillRect(-120, -80, 240, 30);
  ctx.strokeStyle = 'rgba(255, 200, 120, 0.9)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(-110, -50);
  ctx.lineTo(110, 10);
  ctx.stroke();
  ctx.restore();
}

function drawParrotShadow(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.3, scale * 1.3);
  ctx.fillStyle = 'rgba(10, 10, 20, 0.25)';
  ctx.beginPath();
  ctx.moveTo(-120, -60);
  ctx.bezierCurveTo(-200, -140, 200, -160, 120, 20);
  ctx.bezierCurveTo(60, 140, -40, 160, -100, 40);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMangroves(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(40, 100, 80, 0.6)';
  ctx.lineWidth = 12;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 80, 140);
    ctx.quadraticCurveTo(i * 50, 40, i * 60 + 20, -80);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCoins(ctx, x, y, scale, count) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 120, scale * 120);
  for (let i = 0; i < count; i++) {
    const offX = Math.cos((Math.PI * 2 * i) / count) * 0.5;
    const offY = Math.sin((Math.PI * 2 * i) / count) * 0.5;
    const gradient = ctx.createRadialGradient(offX, offY, 0.02, offX, offY, 0.2);
    gradient.addColorStop(0, 'rgba(255, 220, 120, 0.9)');
    gradient.addColorStop(1, 'rgba(200, 140, 60, 0.6)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(offX, offY, 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHeron(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 0.8, scale * 0.8);
  ctx.fillStyle = 'rgba(230, 230, 240, 0.7)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-40, -80, 40, -140, 80, -40);
  ctx.bezierCurveTo(120, 40, 40, 120, -20, 60);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawRing(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 160, scale * 160);
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = 'rgba(230, 190, 100, 0.8)';
  ctx.beginPath();
  ctx.arc(0, 0, 0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 0.06;
  ctx.beginPath();
  ctx.arc(0, 0, 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawLantern(ctx, x, y, scale, flames = 1, isTorch = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 120, scale * 120);
  ctx.fillStyle = 'rgba(40, 40, 60, 0.7)';
  ctx.fillRect(-0.4, -0.8, 0.8, 1.4);
  ctx.strokeStyle = 'rgba(255, 205, 140, 0.8)';
  ctx.lineWidth = 0.06;
  ctx.strokeRect(-0.45, -0.85, 0.9, 1.5);
  for (let i = 0; i < flames; i++) {
    const offset = (i - (flames - 1) / 2) * 0.28;
    const gradient = ctx.createLinearGradient(0, -0.3, 0, 0.4);
    gradient.addColorStop(0, 'rgba(255, 240, 190, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 120, 60, 0.7)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(offset, -0.3);
    ctx.quadraticCurveTo(offset + 0.12, -0.7, offset + 0.28, -0.15);
    ctx.quadraticCurveTo(offset + 0.05, 0.4, offset, 0.4);
    ctx.closePath();
    ctx.fill();
  }
  if (isTorch) {
    ctx.fillStyle = 'rgba(80, 40, 20, 0.8)';
    ctx.fillRect(-0.06, 0.4, 0.12, 1.4);
  }
  ctx.restore();
}

function drawFeathers(ctx, x, y, scale, count) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 110, scale * 110);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    ctx.save();
    ctx.rotate(angle);
    const gradient = ctx.createLinearGradient(0, -0.5, 0, 0.6);
    gradient.addColorStop(0, 'rgba(255, 200, 120, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 80, 80, 0.6)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, -0.5);
    ctx.quadraticCurveTo(0.4, 0, 0, 0.6);
    ctx.quadraticCurveTo(-0.4, 0, 0, -0.5);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawTidePool(ctx, x, y, scale, coinCount) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.1, scale * 1.1);
  const gradient = ctx.createRadialGradient(0, 0, 20, 0, 0, 260);
  gradient.addColorStop(0, 'rgba(40, 120, 160, 0.7)');
  gradient.addColorStop(1, 'rgba(10, 30, 50, 0.8)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, 260, 160, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < coinCount; i++) {
    const angle = (Math.PI * 2 * i) / coinCount;
    const cx = Math.cos(angle) * 150;
    const cy = Math.sin(angle) * 90;
    ctx.fillStyle = 'rgba(255, 220, 130, 0.85)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCatEyes(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 100, scale * 100);
  ctx.fillStyle = 'rgba(20, 40, 60, 0.7)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.6, 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(120, 255, 120, 0.9)';
  ctx.beginPath();
  ctx.ellipse(-0.6, 0, 0.5, 0.3, 0, 0, Math.PI * 2);
  ctx.ellipse(0.6, 0, 0.5, 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(12, 20, 40, 0.9)';
  ctx.fillRect(-0.7, -0.3, 0.14, 0.6);
  ctx.fillRect(0.56, -0.3, 0.14, 0.6);
  ctx.restore();
}

function drawRope(ctx, x, y, scale, count, loops = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 80, scale * 80);
  ctx.lineWidth = 0.18;
  ctx.strokeStyle = 'rgba(210, 170, 110, 0.8)';
  ctx.beginPath();
  if (loops) {
    for (let i = 0; i < count; i++) {
      ctx.ellipse(i * 1.2, 0, 0.9, 0.6, 0, 0, Math.PI * 2);
    }
  } else {
    for (let i = 0; i < count; i++) {
      ctx.arc(i * 0.9, 0, 0.6, 0, Math.PI * 2);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawDagger(ctx, x, y, scale, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(scale * 140, scale * 140);
  ctx.fillStyle = 'rgba(220, 220, 230, 0.9)';
  ctx.beginPath();
  ctx.moveTo(0, -1.2);
  ctx.lineTo(0.25, 0.9);
  ctx.lineTo(-0.25, 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(120, 60, 40, 0.9)';
  ctx.fillRect(-0.3, 0.9, 0.6, 0.5);
  ctx.restore();
}

function drawSharkFin(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.2, scale);
  ctx.fillStyle = 'rgba(40, 80, 120, 0.8)';
  ctx.beginPath();
  ctx.moveTo(-80, 120);
  ctx.quadraticCurveTo(40, -140, 100, 120);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSkullPile(ctx, x, y, scale, count) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const offsetX = x + (i % 3) * 60 - 60;
    const offsetY = y - Math.floor(i / 3) * 60;
    drawSkull(ctx, offsetX, offsetY, scale * 0.5, false);
  }
  ctx.restore();
}

function drawRuneCircle(ctx, x, y, scale, count) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 120, scale * 120);
  ctx.strokeStyle = 'rgba(230, 210, 160, 0.6)';
  ctx.lineWidth = 0.05;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 190, 120, 0.75)';
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const rx = Math.cos(angle);
    const ry = Math.sin(angle);
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(angle);
    ctx.fillRect(-0.12, -0.4, 0.24, 0.8);
    ctx.restore();
  }
  ctx.restore();
}

function drawCoinTrail(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = 'rgba(255, 220, 140, 0.8)';
    ctx.beginPath();
    ctx.ellipse(i * 60, i * -40, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFlag(ctx, x, y, scale, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((-angle * Math.PI) / 180);
  ctx.scale(scale * 1.2, scale * 1.2);
  ctx.fillStyle = 'rgba(80, 60, 40, 0.9)';
  ctx.fillRect(-10, -160, 20, 320);
  ctx.fillStyle = 'rgba(255, 150, 80, 0.85)';
  ctx.beginPath();
  ctx.moveTo(10, -160);
  ctx.quadraticCurveTo(210, -140, 210, -40);
  ctx.quadraticCurveTo(210, 60, 10, -20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBirds(ctx, x, y, scale, count) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(240, 240, 250, 0.7)';
  ctx.lineWidth = 6;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const bx = Math.cos(angle) * 160;
    const by = Math.sin(angle) * 90;
    ctx.beginPath();
    ctx.moveTo(bx - 40, by);
    ctx.quadraticCurveTo(bx, by - 40, bx + 40, by);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlanks(ctx, x, y, scale, count) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = 'rgba(140, 90, 50, 0.8)';
    ctx.fillRect(-40 + i * 40, -200, 40, 260);
    ctx.strokeStyle = 'rgba(255, 210, 150, 0.7)';
    ctx.lineWidth = 6;
    ctx.strokeRect(-40 + i * 40, -200, 40, 260);
  }
  ctx.restore();
}

function drawCliff(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(40, 40, 60, 0.65)';
  ctx.beginPath();
  ctx.moveTo(-200, 200);
  ctx.lineTo(-180, -160);
  ctx.lineTo(140, -220);
  ctx.lineTo(180, 180);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawRuneCross(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 120, scale * 120);
  ctx.strokeStyle = 'rgba(230, 200, 140, 0.9)';
  ctx.lineWidth = 0.12;
  ctx.beginPath();
  ctx.moveTo(-0.9, 0);
  ctx.lineTo(0.9, 0);
  ctx.moveTo(0, -0.8);
  ctx.lineTo(0, 0.8);
  ctx.stroke();
  ctx.restore();
}

function drawWaterGlow(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.4, scale * 1.4);
  const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(80, 200, 200, 0.6)');
  gradient.addColorStop(1, 'rgba(40, 80, 100, 0.2)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, 200, 140, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEggs(ctx, x, y, scale, count) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 80, scale * 80);
  ctx.fillStyle = 'rgba(240, 240, 220, 0.85)';
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    ctx.beginPath();
    ctx.ellipse(col * 0.9 - 1.35, row * -0.9 + 1.1, 0.4, 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawStarSpray(ctx, x, y, scale, rng) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.2, scale * 1.2);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = 'rgba(240, 240, 255, 0.8)';
    ctx.beginPath();
    ctx.arc((rng() - 0.5) * 400, (rng() - 0.5) * 200, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawRuneStone(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.2, scale * 1.2);
  ctx.fillStyle = 'rgba(90, 80, 60, 0.7)';
  ctx.beginPath();
  ctx.moveTo(-120, 80);
  ctx.lineTo(-100, -140);
  ctx.lineTo(100, -160);
  ctx.lineTo(120, 60);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 210, 150, 0.8)';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(-50, -80);
  ctx.lineTo(0, 20);
  ctx.lineTo(50, -80);
  ctx.stroke();
  ctx.restore();
}

function drawSeagrass(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.2, scale * 1.2);
  ctx.strokeStyle = 'rgba(120, 200, 150, 0.6)';
  ctx.lineWidth = 14;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 40, 200);
    ctx.quadraticCurveTo(i * 30, 80, i * 60, -120);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPalms(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(80, 50, 30, 0.8)';
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.moveTo(-40, 200);
  ctx.quadraticCurveTo(-20, 80, 20, -140);
  ctx.moveTo(60, 200);
  ctx.quadraticCurveTo(40, 60, -20, -160);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(70, 140, 90, 0.8)';
  ctx.lineWidth = 22;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(20, -140);
    ctx.quadraticCurveTo(220, -160 + i * 18, 40, -40 + i * 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-20, -160);
    ctx.quadraticCurveTo(-220, -180 + i * 18, -40, -60 + i * 12);
    ctx.stroke();
  }
  ctx.restore();
}

function drawShadowGlyph(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(-120, -40, 240, 80);
  ctx.restore();
}

function drawBrokenMast(ctx, x, y, scale, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(140, 90, 50, 0.8)';
  ctx.fillRect(-40, -240, 80, 500);
  ctx.fillStyle = 'rgba(255, 210, 140, 0.7)';
  ctx.fillRect(-40, -240, 80, 60);
  ctx.restore();
}

function drawSmoke(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(220, 180, 120, 0.6)');
  gradient.addColorStop(1, 'rgba(60, 40, 60, 0.2)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-60, -120, 80, -220, 40, -320);
  ctx.bezierCurveTo(-20, -420, 120, -520, 60, -620);
  ctx.lineTo(140, -620);
  ctx.bezierCurveTo(200, -460, 40, -260, 120, -120);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSkullColumn(ctx, x, y, scale, count) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    drawSkull(ctx, x, y - i * 70, scale * 0.55, false);
  }
  ctx.restore();
}

function drawStarRune(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 1.2, scale * 1.2);
  ctx.strokeStyle = 'rgba(255, 230, 150, 0.9)';
  ctx.lineWidth = 18;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const nx = Math.cos(angle) * 140;
    const ny = Math.sin(angle) * 140;
    ctx.lineTo(nx, ny);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawBeaconRock(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(32, 55, 82, 0.8)';
  ctx.beginPath();
  ctx.moveTo(-160, 220);
  ctx.lineTo(-100, -220);
  ctx.lineTo(180, -180);
  ctx.lineTo(160, 220);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCoinSplash(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(255, 220, 140, 0.85)';
  ctx.lineWidth = 16;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 120 + i * 40, 60 + i * 30, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRipples(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(120, 200, 210, 0.55)';
  ctx.lineWidth = 12;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 180 + i * 40, 90 + i * 20, 0.2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRuneGlyph(ctx, rng) {
  ctx.save();
  ctx.strokeStyle = 'rgba(220, 190, 140, 0.35)';
  ctx.lineWidth = 6;
  for (let i = 0; i < 40; i++) {
    const x = 150 + rng() * (OUTPUT_SIZE - 300);
    const y = 150 + rng() * (OUTPUT_SIZE - 300);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + rng() * 80 - 40, y + rng() * 80 - 40);
    ctx.stroke();
  }
  ctx.restore();
}

async function generateImage(card) {
  const rng = seedrandom(card.seed);
  const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, card.scene, rng);
  drawCoastline(ctx, card.scene.map, rng);
  drawRuneGlyph(ctx, rng);
  drawCharacters(ctx, card.scene);
  drawProps(ctx, card.scene.props, rng);
  applyBorder(ctx, rng);

  ctx.save();
  ctx.fillStyle = 'rgba(255, 220, 160, 0.45)';
  ctx.font = 'bold 120px "Cinzel"';
  ctx.textAlign = 'center';
  ctx.fillText(card.name, OUTPUT_SIZE / 2, 220);
  ctx.restore();

  const buffer = canvas.toBuffer('image/png');
  const imagePath = path.join(imageDir, `${card.slug}.png`);
  await fs.writeFile(imagePath, buffer);
}

function buildAttributes(card) {
  return [
    { trait_type: 'Chapter', value: 'V — Cerf Island Shadows' },
    { trait_type: 'Island', value: 'Cerf Island' },
    { trait_type: 'Place', value: card.place },
    { trait_type: 'Time of Day', value: card.timeOfDay },
    { trait_type: 'Weather', value: card.weather },
    { trait_type: 'Tide', value: card.tide },
    { trait_type: 'Moon Phase', value: card.moonPhase },
    { trait_type: 'Bearing', value: `${card.bearingDeg.toString().padStart(3, '0')}°` },
    { trait_type: 'Cipher Output', value: card.cipherOutput }
  ];
}

async function buildMetadata(card) {
  const metadata = {
    name: card.name,
    description: card.description,
    image: `/ch5/images/${card.slug}.png`,
    chapter: 'V — Cerf Island Shadows',
    island: 'Cerf Island',
    place: card.place,
    timeOfDay: card.timeOfDay,
    weather: card.weather,
    bearingDeg: card.bearingDeg,
    tide: card.tide,
    moonPhase: card.moonPhase,
    cipherOutput: card.cipherOutput,
    riddle: card.riddle,
    attributes: buildAttributes(card),
    properties: {
      chapter: 'V — Cerf Island Shadows',
      tokenId: card.tokenId
    }
  };

  const metadataPath = path.join(metadataDir, `${card.slug}.json`);
  await fs.writeJson(metadataPath, metadata, { spaces: 2 });
}

async function main() {
  await fs.ensureDir(imageDir);
  await fs.ensureDir(metadataDir);

  for (const card of cards) {
    await generateImage(card);
    await buildMetadata(card);
    console.log(`🎨 Generated ${card.slug}`);
  }
  console.log('\n✅ Chapter V artwork and metadata regenerated.');
}

main().catch(err => {
  console.error('❌ Failed to generate Chapter V assets:', err);
  process.exit(1);
});
