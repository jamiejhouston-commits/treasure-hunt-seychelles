// Generate structured concept JSON files for redesigned Chapter VI cards
// These include enhanced prompt + attributes for art regeneration.
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname,'../content/ch6/concept_specs');
if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR,{recursive:true});

/** Helper to build attribute array */
function attrs(list){
  return list.map(([trait_type,value])=>({trait_type,value}));
}

const cards = [
  {
    id: 'ch6_001', title: 'Port Launay: The Fisherman\'s Warning',
    scene: 'Dusk at Port Launay. Fisherman Tibo warns Naia (indigo scarf, compass), Kassim (scarred, shark-tooth necklace, pearl-guard cutlass), and Maliya (copper bangles, sea-green shawl, bone runes). Fruit bats arc across crescent moon. Four rusted anchors in shallows. Lantern with cracked pane glows faint. Tone: foreboding maritime omen.',
    props: { anchors:4, bats:3, crackedLanternPanes:1 },
    hiddenClue: '4 + 3 = 43°', bearingDeg:43, cipherOutput:'R',
    riddle: 'Four teeth in the tide, three wings in the night — steer where iron kisses moonlight.'
  },
  { id:'ch6_002', title:'Cap Ternay: The Veil of Sacrifice', scene:'Haunted cove. Mangroves clutch shore; blackened wax circles on rock. Skulls etched with spiral runes half-buried. Naia sketches symbols, Kassim stands guard (black cat with emerald eyes), Maliya reading blood glyphs. Two glyphs true, seven decoys. Candles flicker without flame.', props:{ waxCircles:6, trueRunes:2, decoyGlyphs:7 }, hiddenClue:'(6 − 7) × 2 = −2 → 358°', bearingDeg:358, cipherOutput:'E', riddle:'Count what endures, subtract what lies — the truth points where the wind does not.' },
  { id:'ch6_003', title:'Granite Fissure: First Shard', scene:'Granite ridge split; bone-iron shard glints in fissure. Naia wedges compass, Maliya chants with clove and salt, Kassim pries shard with dagger. Nine fruit bats wheel above; seven chalk tallies at crack.', props:{ shard:1, tallies:7, bats:9 }, hiddenClue:'7 + 9 = 16 → 160°', bearingDeg:160, cipherOutput:'V', riddle:'When stone remembers, wings agree.' },
  { id:'ch6_004', title:'Plantation Bell Tower: Chains that Toll', scene:'Coral-lime leaning tower without bell; swaying chains. Kassim grips iron recalling past. Maliya senses warmth in wall. Naia maps cracks forming triangle pointing upslope. Nine chain links stamped with crosses.', props:{ niche:1, chains:5, markedLinks:9 }, hiddenClue:'1 + 5 + 9 = 15 → 150°', bearingDeg:150, cipherOutput:'E', riddle:'What tolls without a bell still counts the hour.' },
  { id:'ch6_005', title:'Forest Drum Circle: Rhythms of the Ancestors', scene:'Clearing under takamaka. Five hand-drums; eight clusters of fireflies pulse in rhythm. Maliya plays, Naia maps beats, Kassim emotional. Two ashy concentric ground rings.', props:{ drums:5, fireflyClusters:8, rings:2 }, hiddenClue:'5 + 8 + 2 = 15 → 150°', bearingDeg:150, cipherOutput:'N', riddle:'If you can hear the fire, you can see the path.' },
  { id:'ch6_006', title:'Anse Major: House of Smoke', scene:'Plantation ruin. Nine smoke curls from chimney form skull. Two nailed leather straps under a step. Seven scorched letters on lintel. Phantom figure crosses cracked window.', props:{ smokeCurls:9, straps:2, letters:7 }, hiddenClue:'(9 + 2) × 1 = 11 → 110°', bearingDeg:110, cipherOutput:'A', riddle:'The house that burns without flame counts its own breath.' },
  { id:'ch6_007', title:'Sans Souci Pass: The Whispering Stones', scene:'Dense fog. Seven stones carved with dots; Naia charcoal rub reveals arrow. Two lanterns (one dim). Three fern fronds. Kassim hears chain-on-stone; Maliya warns presence.', props:{ lanterns:2, stones:7, fronds:3 }, hiddenClue:'7 − 1 + 1 = 7 → 70°', bearingDeg:70, cipherOutput:'N', riddle:'What points without pointing is still a sign.' },
  { id:'ch6_008', title:'Copolia Heights: Flight of the Fruit Bats', scene:'Granite dome twilight. Bats surge from cave dividing into three braids then rejoin above red-lit shard. Seven chalk ticks at cave lip. Kassim climbs, scars silver.', props:{ braids:3, ticks:7, shard:1 }, hiddenClue:'3 × 7 + 1 = 22 → 220°', bearingDeg:220, cipherOutput:'T', riddle:'When the night divides and joins, the sum becomes your road.' },
  { id:'ch6_009', title:'Black River Crossing: Ferry of Shadows', scene:'Dark river; rope-tethered ferry. Four notch pairs on oar. Seven pale fish circle like stars. Maliya candle flame bends inland. Naia traces fish constellation.', props:{ notchPairs:4, fish:7, bentFlame:1 }, hiddenClue:'8 + 7 + 1 = 16 → 160°', bearingDeg:160, cipherOutput:'M', riddle:'Even water counts, if you ask it softly.' },
  { id:'ch6_010', title:'Mission Ruins: Dance of the Bound', scene:'Ivy-choked mission. Moonlight frescoes of six masked dancers. Three cracked crosses on floor. Two distant owl calls. Maliya mirrors steps; Naia counts; Kassim listens.', props:{ dancers:6, crosses:3, owlCalls:2 }, hiddenClue:'6 + 3 + 2 = 11 → 110°', bearingDeg:110, cipherOutput:'A', riddle:'Steps remember what tongues forget.' },
  { id:'ch6_011', title:'The Revenant\'s Hunt', scene:'Forest chase. Revenant with bone-iron half mask (teeth like nails) behind Kassim. Cat hisses on Naia\'s arm. Maliya casts two salt circles. Eight tree scars. Mask gleam once.', props:{ scars:8, maskGleam:1, saltCircles:2 }, hiddenClue:'8 × 1 + 2 = 10 → 100°', bearingDeg:100, cipherOutput:'S', riddle:'When hunger wears a face, count the wounds in the trees.' },
  { id:'ch6_012', title:'Upper Sans Souci: Stones that Breathe', scene:'Granite throat wind alive. Five petroglyph carvings. Six bat clusters roosting. One abandoned stick leaning. Naia rubs symbols; Maliya feels stone; Kassim listens.', props:{ carvings:5, batClusters:6, stick:1 }, hiddenClue:'5 + 6 − 1 = 10 → 100°', bearingDeg:100, cipherOutput:'K', riddle:'Not every guide is a friend; take away the liar to find the sum.' },
  { id:'ch6_013', title:'Eden Beach: The Dragging Chains', scene:'Beach sand scored by unseen chains forming seven loops. Four barefoot prints with two-step pause. Three silent gulls. Team documenting.', props:{ loops:7, prints:4, gulls:3 }, hiddenClue:'7 + 4 + 3 = 14 → 140°', bearingDeg:140, cipherOutput:'M', riddle:'Ink is not the only thing that writes.' },
  { id:'ch6_014', title:'Tea Plantation Shade: Leaves that Count', scene:'Two cracked tea chests. Board carved with nine leaves (three double-veined = six). Hidden shard beneath. Naia counts; Maliya lifts shard; Kassim watch trees shift.', props:{ chests:2, veinedLeaves:6, shard:1 }, hiddenClue:'2 + 6 + 1 = 9 → 90°', bearingDeg:90, cipherOutput:'A', riddle:'A leaf with two rivers drinks twice.' },
  { id:'ch6_015', title:'Grand Anse Waterfall: The Key of Silence', scene:'Roaring waterfall. Eight candles gutter, three extinguished. Alcove iron key on stone tongue. Four etched tallies. Kassim waist-deep rope-tied; Naia signaling; Maliya blessing.', props:{ candles:8, key:1, tallies:4 }, hiddenClue:'3 + 1 + 4 = 8 → 80°', bearingDeg:80, cipherOutput:'H', riddle:'What roars most hides what speaks least.' },
  { id:'ch6_016', title:'Cemetery Gate: The Quiet Arithmetic', scene:'Coral arch with lichen. Three animal skulls mortared. Eight candles guttering. Iron key on step casting long shadow. False dates faint.', props:{ skulls:3, candles:8, key:1 }, hiddenClue:'3 + 8 = 11 → 110°', bearingDeg:110, cipherOutput:'E', riddle:'The dead don\'t lie, but they do subtract.' },
  { id:'ch6_017', title:'Bel Ombre Tidepools: Mirror of Shards', scene:'Moonlit tidepools like coins. Submerged shard reflects faces older. Five rune shells ring pool; nine reef spines; two bats sip. Clothing wet edges.', props:{ shells:5, spines:9, bats:2 }, hiddenClue:'5 + 9 + 2 = 16 → 160°', bearingDeg:160, cipherOutput:'I', riddle:'To read a mirror, count what it refuses to keep.' },
  { id:'ch6_018', title:'Roche Caiman: The Split Rune', scene:'Lightning-split boulder rune carved then struck. Four cracks radiate. Two rune halves. One chalk circle uniting them. Key pressed; measurements taken.', props:{ cracks:4, halves:2, circle:1 }, hiddenClue:'4 × 2 + 1 = 9 → 90°', bearingDeg:90, cipherOutput:'S', riddle:'When a word is broken, its pieces still add up.' },
  { id:'ch6_019', title:'Morne Seychellois Cavern: The Hidden Lock', scene:'Breathing mountain cave. Bas-relief altar teeth and waves. Five shards placed; five candles unlit. Key entering lock; fragments arranged.', props:{ shards:5, candles:5 }, hiddenClue:'5 + 5 = 10 → 100°', bearingDeg:100, cipherOutput:'L', riddle:'A door you cannot see still knows its key.' },
  { id:'ch6_020', title:'Mask Reforged: The Revenant\'s Vow', scene:'Reforged mask with ten iron teeth, five golden runes glowing. Revenant kneels eyes hollow focused on Kassim. River of bats at cave mouth. Compass rose on altar.', props:{ teeth:10, runes:5, compassRose:1 }, hiddenClue:'10 + 5 = 15 → 150°', bearingDeg:150, cipherOutput:'E', riddle:'Count the bite and read the light; where the sea swallows the number, dig.' }
];

function buildPrompt(c){
  return [
    'Etched parchment engraved map-card, muted sepia + indigo + teal + faint gold highlights',
    'Ritual haunting atmosphere, layered symbolic composition',
    c.scene,
    `Key props numeric: ${Object.entries(c.props).map(([k,v])=>`${v} ${k}`).join(', ')}`,
    `Cipher letter: ${c.cipherOutput} Bearing: ${c.bearingDeg}°`,
    'Intricate line engraving, subtle volumetric mist, painterly etched hybrid'
  ].join('. ');
}

for(const card of cards){
  const attributes = [
    { trait_type:'Chapter', value:'VI' },
    { trait_type:'Cipher Output', value: card.cipherOutput },
    { trait_type:'Bearing Deg', value: card.bearingDeg },
    { trait_type:'Hidden Clue', value: card.hiddenClue }
  ];
  // Add numeric props as attributes
  for(const [k,v] of Object.entries(card.props)){
    attributes.push({ trait_type: k, value: v });
  }
  const data = {
    cardId: card.id,
    name: card.title,
    description: card.scene + ' Riddle: ' + card.riddle,
    bearingDeg: card.bearingDeg,
    cipherOutput: card.cipherOutput,
    hiddenClue: card.hiddenClue,
    prompt: buildPrompt(card),
    attributes
  };
  const filename = path.join(OUT_DIR, card.id + '.json');
  fs.writeFileSync(filename, JSON.stringify(data,null,2),'utf8');
}
console.log('✅ Generated concept spec JSON files in', OUT_DIR);
