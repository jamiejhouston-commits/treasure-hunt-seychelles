import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';

const pinataToken = process.env.PINATA_JWT;
if (!pinataToken) {
  console.error('❌ PINATA_JWT missing in scripts/.env – cannot upload Chapter V assets.');
  process.exit(1);
}

if (typeof Blob === 'undefined' || typeof FormData === 'undefined' || typeof fetch === 'undefined') {
  console.error('❌ This script requires a Node runtime with global fetch/FormData/Blob support (v18.0+ recommended).');
  process.exit(1);
}

const PINATA_UPLOAD_ENDPOINT = process.env.PINATA_UPLOAD_URL || 'https://uploads.pinata.cloud/v3/files';

const rootDir = path.resolve(process.cwd(), '../content/ch5');
const imagesDir = path.join(rootDir, 'images');
const metadataDir = path.join(rootDir, 'metadata');
const indexPath = path.join(rootDir, 'metadata-index.json');
const cidMapPath = path.join(rootDir, 'cid-map.json');

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
  const cid =
    result.IpfsHash ||
    result.cid ||
    result.CID ||
    result.hash ||
    result.value?.cid ||
    result.value?.Hash ||
    result.data?.cid ||
    result.data?.IpfsHash;

  if (!cid) {
    throw new Error(`Unexpected Pinata response format: ${JSON.stringify(result)}`);
  }

  return { cid, raw: result };
}

async function loadChapter5Entries() {
  const [imagesExists, metadataExists] = await Promise.all([
    fs.pathExists(imagesDir),
    fs.pathExists(metadataDir)
  ]);

  if (!imagesExists || !metadataExists) {
    throw new Error('Chapter V images or metadata directory missing.');
  }

  const files = (await fs.readdir(metadataDir)).filter(file => file.endsWith('.json'));
  if (files.length === 0) {
    throw new Error('No Chapter V metadata files found.');
  }

  const entries = [];
  for (const file of files) {
    const metadataPath = path.join(metadataDir, file);
    const metadataJson = await fs.readJson(metadataPath);
    const tokenId = metadataJson.properties?.tokenId ?? metadataJson.tokenId;
    if (!tokenId) {
      throw new Error(`Metadata ${file} missing properties.tokenId.`);
    }
    const imageField = metadataJson.image;
    const imageName = imageField ? path.basename(imageField) : `${path.parse(file).name}.png`;
    const imagePath = path.join(imagesDir, imageName);
    if (!await fs.pathExists(imagePath)) {
      throw new Error(`Missing image file for token ${tokenId}: ${imageName}`);
    }
    entries.push({
      id: Number(tokenId),
      image: imageName,
      metadata: file,
      metadataPath,
      imagePath
    });
  }

  entries.sort((a, b) => a.id - b.id);
  const indexEntries = entries.map(({ id, image, metadata }) => ({ id, image, metadata }));
  await fs.writeJson(indexPath, indexEntries, { spaces: 2 });
  return entries;
}

async function uploadChapter5() {
  const entries = await loadChapter5Entries();
  console.log(`🏝️ Uploading ${entries.length} Chapter V cards to Pinata...`);

  const manifestItems = [];

  for (const entry of entries) {
    const { id: tokenId, image, metadata, imagePath, metadataPath } = entry;

    console.log(`📤 Uploading image for token ${tokenId} (${image})...`);
    const imageBuffer = await fs.readFile(imagePath);
    const imageResp = await uploadBufferToPinata(imageBuffer, image, {
      name: image,
      keyvalues: {
        chapter: 'V',
        tokenId: String(tokenId),
        type: 'chapter5_image'
      }
    });
    const imageIpfs = `ipfs://${imageResp.cid}`;

    console.log(`📝 Updating metadata ${metadata}...`);
    const metadataJson = await fs.readJson(metadataPath);
    metadataJson.image = imageIpfs;
    metadataJson.properties = {
      ...(metadataJson.properties || {}),
      chapter: 'V — Cerf Island Shadows',
      tokenId
    };

    const metadataBuffer = Buffer.from(JSON.stringify(metadataJson, null, 2));
    console.log(`📤 Uploading metadata for token ${tokenId}...`);
    const metadataResp = await uploadBufferToPinata(metadataBuffer, metadata, {
      name: metadata,
      keyvalues: {
        chapter: 'V',
        tokenId: String(tokenId),
        type: 'chapter5_metadata'
      }
    });
    const metadataIpfs = `ipfs://${metadataResp.cid}`;

    await fs.writeJson(metadataPath, metadataJson, { spaces: 2 });

    manifestItems.push({
      id: tokenId,
      image: imageIpfs,
      metadata: metadataIpfs
    });

    console.log(`✅ Token ${tokenId} ready (image ${imageResp.cid}, metadata ${metadataResp.cid})`);
  }

  const manifest = {
    timestamp: new Date().toISOString(),
    source: 'pinata.chapter5',
    items: manifestItems
  };

  await fs.writeJson(cidMapPath, manifest, { spaces: 2 });
  console.log(`📄 Wrote CID map to ${cidMapPath}`);
}

uploadChapter5().catch(err => {
  console.error('❌ Chapter V Pinata upload failed:', err.message);
  process.exit(1);
});
