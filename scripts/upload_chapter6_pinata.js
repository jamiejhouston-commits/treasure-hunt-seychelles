import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';

const pinataToken = process.env.PINATA_JWT;
if (!pinataToken) {
  console.error('❌ PINATA_JWT missing in .env – cannot upload Chapter VI assets.');
  process.exit(1);
}

if (typeof Blob === 'undefined' || typeof FormData === 'undefined' || typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js v18.0+ with global fetch/FormData/Blob support.');
  process.exit(1);
}

const PINATA_UPLOAD_ENDPOINT = process.env.PINATA_UPLOAD_URL || 'https://uploads.pinata.cloud/v3/files';

const rootDir = path.resolve(process.cwd(), '../content/ch6/output');

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
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  const response = await fetch(PINATA_UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pinataToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata upload failed (${response.status}): ${errorText}`);
  }

  return await response.json();
}

async function uploadChapter6() {
  console.log('🚀 Starting Chapter VI asset upload to Pinata...');
  
  if (!fs.existsSync(rootDir)) {
    console.error(`❌ Chapter VI output directory not found: ${rootDir}`);
    process.exit(1);
  }

  const results = [];
  const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.png') || f.endsWith('.json'));
  
  console.log(`📁 Found ${files.length} files to upload`);

  for (const file of files) {
    try {
      const filePath = path.join(rootDir, file);
      const buffer = fs.readFileSync(filePath);
      
      console.log(`⬆️  Uploading ${file}...`);
      
      const metadata = {
        name: file,
        keyvalues: {
          chapter: '6',
          type: file.endsWith('.png') ? 'image' : 'metadata'
        }
      };

      const result = await uploadBufferToPinata(buffer, file, metadata);
      
      results.push({
        file: file,
        cid: result.data.cid,
        url: `https://gateway.pinata.cloud/ipfs/${result.data.cid}`,
        pinata_url: result.data.pinataURL || result.data.url,
        size: buffer.length
      });

      console.log(`✅ ${file} → ${result.data.cid}`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
      results.push({
        file: file,
        error: error.message
      });
    }
  }

  // Save upload results
  const outputPath = './ipfs_upload_results.json';
  fs.writeJsonSync(outputPath, results, { spaces: 2 });
  
  console.log(`📊 Upload complete! Results saved to ${outputPath}`);
  console.log(`✅ Successful: ${results.filter(r => r.cid).length}`);
  console.log(`❌ Failed: ${results.filter(r => r.error).length}`);
  
  return results;
}

uploadChapter6().catch(console.error);