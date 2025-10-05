// Build production-ready metadata JSON files for Chapter VI from concept specs
// Copies prompt-derived fields but strips internal prompt (or keeps under devPrompt)
const fs = require('fs');
const path = require('path');

const CONCEPT_DIR = path.resolve(__dirname,'../content/ch6/concept_specs');
const OUTPUT_DIR = path.resolve(__dirname,'../content/ch6/output');
if(!fs.existsSync(CONCEPT_DIR)) throw new Error('Missing concept specs directory');
if(!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR,{recursive:true});

const files = fs.readdirSync(CONCEPT_DIR).filter(f=>f.endsWith('.json'));
let count=0;
for(const f of files){
  const raw = JSON.parse(fs.readFileSync(path.join(CONCEPT_DIR,f),'utf8'));
  // Derive numeric cardId
  const m = f.match(/ch6_(\d{3})/i);
  if(!m) { console.warn('Skip (no id):', f); continue; }
  const num = parseInt(m[1],10);
  const publicData = {
    cardId: raw.cardId || `ch6_${m[1]}`,
    name: raw.name,
    description: raw.description,
    bearingDeg: raw.bearingDeg,
    cipherOutput: raw.cipherOutput,
    hiddenClue: raw.hiddenClue,
    attributes: raw.attributes,
    devPrompt: raw.prompt // keep for regeneration; remove if you want secrecy
  };
  const outName = `ch6_${m[1]}.json`;
  fs.writeFileSync(path.join(OUTPUT_DIR,outName), JSON.stringify(publicData,null,2),'utf8');
  count++;
}
console.log(`✅ Wrote ${count} output metadata files to ${OUTPUT_DIR}`);
