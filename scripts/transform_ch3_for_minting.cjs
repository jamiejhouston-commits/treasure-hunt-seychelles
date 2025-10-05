const fs = require('fs-extra');
const path = require('path');

// Transform Chapter III IPFS upload results into mint input JSON.
// Expects ./data/ipfs_upload_results_ch3.json produced by upload_chapter3_pinata.js
// JSON metadata files should follow a naming convention enabling tokenId derivation.
// Supported filename patterns:
//   ch3_001.json -> token 121 (base 120 + sequential)
//   121.json     -> token 121 (direct)
//   chapter3_001.json -> token 121

function deriveTokenId(filename) {
  const base = 120; // Chapter III starts at 121
  let m;
  if ((m = filename.match(/^ch3_(\d+)\.json$/i))) {
    return base + parseInt(m[1], 10);
  }
  if ((m = filename.match(/^chapter3_(\d+)\.json$/i))) {
    return base + parseInt(m[1], 10);
  }
  if ((m = filename.match(/^(\d+)\.json$/))) {
    const t = parseInt(m[1], 10);
    if (t >= 121 && t <= 140) return t;
  }
  return null;
}

function run() {
  console.log('🔄 Transforming Chapter III IPFS results for minting...');
  const inputPath = path.join('./data', 'ipfs_upload_results_ch3.json');
  if (!fs.existsSync(inputPath)) {
    console.error('❌ Missing input file: data/ipfs_upload_results_ch3.json');
    process.exit(1);
  }
  const raw = fs.readJsonSync(inputPath);
  const metadataFiles = raw.filter(r => r.file && r.file.endsWith('.json') && r.cid);
  const transformed = [];
  for (const f of metadataFiles) {
    const tokenId = deriveTokenId(f.file);
    if (!tokenId) {
      console.warn(`⚠️ Skipping unrecognized filename pattern: ${f.file}`);
      continue;
    }
    transformed.push({ tokenId, metadataUri: f.url });
  }

  transformed.sort((a,b) => a.tokenId - b.tokenId);
  const outFile = './data/mint_input_ch3.json';
  fs.writeJsonSync(outFile, transformed, { spaces: 2 });
  console.log(`✅ Wrote ${transformed.length} mint entries → ${outFile}`);
  console.log('📋 Sample:', transformed.slice(0,3));
}

run();
