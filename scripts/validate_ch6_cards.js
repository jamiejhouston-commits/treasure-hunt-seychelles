import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname,'../content/ch6/ch6_cards.json');

async function main(){
  const cards = await fs.readJson(DATA_PATH);
  const errors=[]; const letters=[];
  for(const c of cards){
    if(typeof c.bearingDeg !== 'number' || c.bearingDeg < 0 || c.bearingDeg > 360){
      errors.push(`${c.id} invalid bearing ${c.bearingDeg}`);
    }
    if(!c.cipherOutput || typeof c.cipherOutput !== 'string'){
      errors.push(`${c.id} missing cipherOutput`);
    } else {
      letters.push(c.cipherOutput);
    }
    if(!c.hiddenClueFormula){ errors.push(`${c.id} missing hiddenClueFormula`); }
    if(!c.scene || c.scene.length < 30){ errors.push(`${c.id} scene too short`); }
  }
  const phrase = letters.join('');
  console.log('Cipher phrase built:', phrase);
  if(phrase.replace(/\s+/g,'') !== 'REVER?' && phrase.length !== letters.length){ /* placeholder check */ }
  // Expected phrase (with spaces) REVENANT MASK MAHE ISLE => letters sequence no spaces
  const expected = 'REVENANTMASKMAHEISLE';
  const compact = phrase.replace(/\s+/g,'');
  if(compact !== expected){
    console.warn('WARNING: Cipher phrase mismatch. Expected', expected, 'got', compact);
  } else {
    console.log('Cipher phrase matches expected.');
  }
  if(errors.length){
    console.error('Validation errors:');
    errors.forEach(e=>console.error(' -',e));
    process.exitCode = 1;
  } else {
    console.log('All cards structurally valid.');
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
