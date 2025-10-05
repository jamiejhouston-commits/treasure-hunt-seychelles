// Validate Chapter VI premint assets: ensure each output JSON has matching PNG and counts align.
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname,'../content/ch6/output');
if(!fs.existsSync(OUT_DIR)) { console.error('Missing output directory:', OUT_DIR); process.exit(1); }

const jsonFiles = fs.readdirSync(OUT_DIR).filter(f=>/^ch6_\d{3}\.json$/i.test(f));
let ok=0, warn=0;
for(const jf of jsonFiles){
  const num = jf.match(/(\d{3})/)[1];
  const png = `ch6_${num}.png`;
  const pngPath = path.join(OUT_DIR,png);
  if(!fs.existsSync(pngPath)) { console.warn('⚠️ Missing image for', jf, 'expected', png); warn++; continue; }
  const data = JSON.parse(fs.readFileSync(path.join(OUT_DIR,jf),'utf8'));
  // Basic numeric prop validation (attributes that are numbers)
  const numericAttrs = (data.attributes||[]).filter(a=>typeof a.value==='number');
  const zeroOrPositive = numericAttrs.every(a=>a.value>=0);
  if(!zeroOrPositive){ console.warn('⚠️ Negative numeric attribute in', jf); warn++; continue; }
  ok++;
}
console.log(`Inspection complete: OK=${ok} WARN=${warn} Total=${jsonFiles.length}`);
if(warn>0) process.exitCode=1;
