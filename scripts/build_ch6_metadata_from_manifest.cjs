const fs = require('fs');
const path = require('path');

const manifest = require('./ch6_revenant_manifest');

const OUTPUT_DIR = path.resolve(__dirname, '../content/ch6/output');
const CONCEPT_DIR = path.resolve(__dirname, '../content/ch6/concept_specs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(CONCEPT_DIR)) {
  fs.mkdirSync(CONCEPT_DIR, { recursive: true });
}

const cipherPhrase = 'REVENANT MASK MAHE ISLE';

function toTitleCaseFromKey(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function buildAttributes(card) {
  const attrs = [
    { trait_type: 'Chapter', value: 'VI' },
    { trait_type: 'Collection Phase', value: 'Pre-Mint' },
    { trait_type: 'Bearing', value: card.bearingDeg },
    { trait_type: 'Cipher Letter', value: card.cipherOutput },
    { trait_type: 'Cipher Index', value: card.cipherIndex }
  ];

  if (Array.isArray(card.props)) {
    for (const prop of card.props) {
      attrs.push({
        trait_type: toTitleCaseFromKey(prop.name),
        value: prop.value
      });
    }
  }
  return attrs;
}

function wrapText(text, lineLength = 120) {
  if (!text) return '';
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > lineLength) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines.join('\n');
}

let count = 0;
for (const card of manifest) {
  const attributes = buildAttributes(card);
  const sceneDescription = card.scene.trim();

  const conceptData = {
    cardId: card.id,
    name: card.name,
    description: sceneDescription,
    bearingDeg: card.bearingDeg,
    cipherOutput: card.cipherOutput,
    cipherIndex: card.cipherIndex,
    hiddenClue: card.hiddenClue,
    riddle: card.riddle,
    scene: sceneDescription,
    props: card.props,
    attributes,
    prompt: wrapText(
      `Etched parchment, engraved map-card aesthetic, muted sepia with indigo, teal, and bone highlights. ${sceneDescription} Props: ${card.props
        .map((p) => `${p.value} ${toTitleCaseFromKey(p.name)}`)
        .join(', ')}. Cipher letter ${card.cipherOutput}, bearing ${card.bearingDeg}°. Mood: haunting, ritualistic, revenant folklore.`
    )
  };

  const outputData = {
    cardId: card.id,
    name: card.name,
    title: card.name,
    chapter: 6,
    chapterId: 'VI',
    collectionPhase: 'premint',
    cipherPhrase,
    bearingDeg: card.bearingDeg,
    cipherOutput: card.cipherOutput,
    cipherIndex: card.cipherIndex,
    hiddenClueFormula: card.hiddenClue,
    riddle: card.riddle,
    scene: sceneDescription,
    props: card.props,
    description: sceneDescription,
    attributes,
    image: `./${card.id}.png`
  };

  const outFile = path.join(OUTPUT_DIR, `${card.id}.json`);
  const conceptFile = path.join(CONCEPT_DIR, `${card.id}.json`);

  fs.writeFileSync(outFile, JSON.stringify(outputData, null, 2), 'utf8');
  fs.writeFileSync(conceptFile, JSON.stringify(conceptData, null, 2), 'utf8');

  count++;
}

console.log(`✅ Wrote ${count} Chapter VI metadata files from manifest.`);
