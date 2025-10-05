import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';

// Chapter III upload script (tokens 121–140) — expects final rendered output assets (PNGs + JSON metadata) in ../content/ch3/output
// Mirrors Chapter VI uploader, with chapter-specific token math.

const pinataToken = process.env.PINATA_JWT;
if (!pinataToken) {
  console.error('❌ PINATA_JWT missing in .env – cannot upload Chapter III assets.');
  process.exit(1);
}

if (typeof Blob === 'undefined' || typeof FormData === 'undefined' || typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js v18.0+ with global fetch/FormData/Blob support.');
  process.exit(1);
}

const PINATA_UPLOAD_ENDPOINT = process.env.PINATA_UPLOAD_URL || 'https://uploads.pinata.cloud/v3/files';

// Allow override to support staging directories
const rootDir = path.resolve(process.cwd(), process.env.CH3_OUTPUT_DIR || '../content/ch3/output');

function resolveMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

async function uploadBufferToPinata(buffer, name, metadata) {
  const contentType = resolveMimeType(name);
  const blob = buffer instanceof Blob ? buffer : new Blob([buffer], { type: contentType });
  const formData = new FormData();
  formData.append('file', blob, name);
  if (metadata) formData.append('metadata', JSON.stringify(metadata));

  const response = await fetch(PINATA_UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${pinataToken}` },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata upload failed (${response.status}): ${errorText}`);
  }
  return await response.json();
}

async function uploadChapter3() {
  console.log('🚀 Starting Chapter III asset upload to Pinata...');
  if (!fs.existsSync(rootDir)) {
    console.error(`❌ Chapter III output directory not found: ${rootDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(rootDir).filter(f => f.match(/\.(png|json)$/i));
  console.log(`📁 Found ${files.length} files to upload`);

  const results = [];
  for (const file of files) {
    try {
      const filePath = path.join(rootDir, file);
      const buffer = fs.readFileSync(filePath);
      console.log(`⬆️  Uploading ${file}...`);

      const metadata = {
        name: file,
        keyvalues: {
          chapter: '3',
          type: file.endsWith('.png') ? 'image' : 'metadata'
        }
      };

      const result = await uploadBufferToPinata(buffer, file, metadata);
      results.push({
        file,
        cid: result.data.cid,
        url: `https://gateway.pinata.cloud/ipfs/${result.data.cid}`,
        pinata_url: result.data.pinataURL || result.data.url,
        size: buffer.length
      });
      console.log(`✅ ${file} → ${result.data.cid}`);
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error(`❌ Failed ${file}: ${err.message}`);
      results.push({ file, error: err.message });
    }
  }

  const outDir = './data';
  fs.ensureDirSync(outDir);
  const outputPath = path.join(outDir, 'ipfs_upload_results_ch3.json');
  fs.writeJsonSync(outputPath, results, { spaces: 2 });
  console.log(`📊 Upload complete. Saved: ${outputPath}`);
  console.log(`✅ Success: ${results.filter(r => r.cid).length} | ❌ Failed: ${results.filter(r => r.error).length}`);
  return results;
}

uploadChapter3().catch(e => { console.error(e); process.exit(1); });
