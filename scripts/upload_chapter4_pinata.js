import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';

const pinataToken = process.env.PINATA_JWT;
if (!pinataToken) {
  console.error('❌ PINATA_JWT missing in scripts/.env – cannot upload Chapter IV assets.');
  process.exit(1);
}

if (typeof Blob === 'undefined' || typeof FormData === 'undefined' || typeof fetch === 'undefined') {
  console.error('❌ This script requires a Node runtime with global fetch/FormData/Blob support (v18.0+ recommended).');
  process.exit(1);
}

const PINATA_UPLOAD_ENDPOINT = process.env.PINATA_UPLOAD_URL || 'https://uploads.pinata.cloud/v3/files';

const rootDir = path.resolve(process.cwd(), '../content/ch4');
const imagesDir = path.join(rootDir, 'images');
const metadataDir = path.join(rootDir, 'metadata');
const indexPath = path.join(rootDir, 'metadata-index.json');
const outputPath = path.join(rootDir, 'cid-map.json');

function resolveMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.json':
      return 'application/json';
    default:
      return 'application/octet-stream';
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
      Authorization: `Bearer ${pinataToken}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Pinata upload failed (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const cid = result.IpfsHash || result.cid || result.CID || result.hash || result.value?.cid || result.data?.cid || result.data?.IpfsHash;
  if (!cid) {
    throw new Error(`Unexpected Pinata response format: ${JSON.stringify(result)}`);
  }
  return { cid, raw: result };
}

async function ensureFiles() {
  const exists = await fs.pathExists(indexPath);
  if (!exists) {
    throw new Error('Missing content/ch4/metadata-index.json. Run build_chapter4_index.js first.');
  }
  const imagesOk = await fs.pathExists(imagesDir);
  const metaOk = await fs.pathExists(metadataDir);
  if (!imagesOk || !metaOk) {
    throw new Error('Chapter IV images or metadata directory missing.');
  }
}

async function uploadChapter4() {
  await ensureFiles();
  const entries = await fs.readJson(indexPath);
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('Chapter IV metadata index is empty.');
  }

  console.log(`🏴‍☠️ Uploading ${entries.length} Chapter IV cards to Pinata...`);

  const manifestItems = [];
  const imageCache = new Map();

  for (const entry of entries) {
    const tokenId = entry.id;
    const imageFile = path.join(imagesDir, entry.image);
    const metadataFile = path.join(metadataDir, entry.metadata);

    if (!await fs.pathExists(imageFile)) {
      throw new Error(`Missing image file: ${imageFile}`);
    }
    if (!await fs.pathExists(metadataFile)) {
      throw new Error(`Missing metadata file: ${metadataFile}`);
    }

    console.log(`📤 Uploading token ${tokenId} image (${entry.image})...`);
    const imageBuffer = await fs.readFile(imageFile);
    const imageResp = await uploadBufferToPinata(imageBuffer, entry.image, {
      name: entry.image,
      keyvalues: {
        chapter: 'IV',
        tokenId: String(tokenId),
        type: 'chapter4_image'
      }
    });
    const imageIpfs = `ipfs://${imageResp.cid}`;
    imageCache.set(tokenId, imageIpfs);

    console.log(`📝 Updating metadata ${entry.metadata}...`);
    const metadataJson = await fs.readJson(metadataFile);
    metadataJson.image = imageIpfs;
    metadataJson.properties = {
      ...(metadataJson.properties || {}),
      chapter: 'IV — Witch-Winds of Mahé',
      tokenId
    };
    // Persist updated metadata locally
    await fs.writeJson(metadataFile, metadataJson, { spaces: 2 });

    const metadataBuffer = Buffer.from(JSON.stringify(metadataJson, null, 2));
    console.log(`📤 Uploading metadata for token ${tokenId}...`);
    const metadataResp = await uploadBufferToPinata(metadataBuffer, entry.metadata, {
      name: entry.metadata,
      keyvalues: {
        chapter: 'IV',
        tokenId: String(tokenId),
        type: 'chapter4_metadata'
      }
    });
    const metadataIpfs = `ipfs://${metadataResp.cid}`;

    manifestItems.push({
      id: tokenId,
      image: imageIpfs,
      metadata: metadataIpfs
    });

    console.log(`✅ Token ${tokenId} ready (image ${imageResp.cid}, metadata ${metadataResp.cid})`);
  }

  const manifest = {
    timestamp: new Date().toISOString(),
    source: 'pinata.chapter4',
    items: manifestItems
  };
  await fs.writeJson(outputPath, manifest, { spaces: 2 });
  console.log(`📄 Wrote CID map to ${outputPath}`);
}

uploadChapter4().catch(err => {
  console.error('❌ Chapter IV Pinata upload failed:', err.message);
  process.exit(1);
});