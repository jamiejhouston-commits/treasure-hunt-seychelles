import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { NFTStorage, File } from 'nft.storage';

// Resolve scripts directory and load its .env files explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
const localEnvPath = path.join(__dirname, '.env.local');
dotenv.config({ path: envPath });
dotenv.config({ path: localEnvPath, override: true });

// Diagnostics: confirm env load and sanitize token
const cwd = process.cwd();
const tokenRaw = process.env.NFT_STORAGE_TOKEN;
let token = typeof tokenRaw === 'string' ? tokenRaw.trim() : '';
if (!tokenRaw) {
  console.error(`ENV check: NFT_STORAGE_TOKEN is not set. CWD=${cwd} scriptsEnvExists=${fs.existsSync(envPath)} localEnvExists=${fs.existsSync(localEnvPath)}`);
} else {
  const masked = token.length > 8 ? `${token.slice(0, 4)}…${token.slice(-4)}` : '****';
  console.log(`ENV check: loaded NFT_STORAGE_TOKEN (len=${token.length}, masked=${masked}) from scripts/.env`);
}

const outDir = path.resolve(process.env.OUTPUT_DIR || path.join(__dirname, 'dist'));
const imagesDir = path.resolve(process.env.IMAGES_DIR || path.join(outDir, 'images'));

async function toFile(fp, type) {
  const data = await fs.readFile(fp);
  const name = path.basename(fp);
  return new File([data], name, { type });
}

(async function preflight() {
  try {
    if (typeof fetch !== 'function') {
      console.warn('Global fetch not available in this Node version');
    } else {
      const resp = await fetch('https://api.nft.storage/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await resp.text();
      console.log('NFT.Storage /user status:', resp.status);
      console.log('NFT.Storage /user body:', text);
      if (resp.status !== 200) {
        console.error('❌ Token preflight failed. Aborting before upload.');
        process.exit(1);
      }
    }
  } catch (e) {
    console.error('❌ Preflight /user request failed');
    console.error(e?.stack || e?.message || e);
    process.exit(1);
  }
})();

function logErrorDetailed(err) {
  console.error(err?.stack || err?.message || err);
  if (err?.cause) {
    console.error('Cause:', err.cause?.stack || err.cause?.message || err.cause);
  }
  if (err?.response) {
    console.error('Response status:', err.response?.status);
  }
}

(async () => {
  const metaDir = path.join(outDir, 'metadata');
  const indexPath = path.join(outDir, 'metadata-index.json');
  if (!await fs.pathExists(indexPath)) {
    console.error('Missing metadata-index.json. Run build_metadata first.');
    process.exit(1);
  }
  let index = await fs.readJson(indexPath);
  const uploadLimit = parseInt(process.env.UPLOAD_LIMIT || process.env.LIMIT || '0', 10);
  if (uploadLimit && Number.isFinite(uploadLimit) && uploadLimit > 0) {
    index = index.slice(0, uploadLimit);
    console.log(`⚠️ Limiting upload to first ${index.length} items due to UPLOAD_LIMIT`);
  }

  if (!token) {
    console.error('❌ NFT_STORAGE_TOKEN is missing after trim. Ensure scripts/.env contains NFT_STORAGE_TOKEN=...');
    console.error('Checked exists:', envPath, fs.existsSync(envPath), 'and', localEnvPath, fs.existsSync(localEnvPath));
    process.exit(1);
  }

  const client = new NFTStorage({ token });

  // Upload images directory as a directory
  try {
    const imageFiles = await Promise.all(index.map(x => toFile(path.join(imagesDir, x.image), 'image/png')));
    var imagesCid = await client.storeDirectory(imageFiles);
    console.log('📦 Images CID:', imagesCid);
  } catch (err) {
    console.error('❌ Failed to upload images directory to NFT.Storage');
    logErrorDetailed(err);
    process.exit(1);
  }

  // Update metadata with real ipfs:// URIs and upload
  const metaFiles = [];
  for (const item of index) {
    const p = path.join(metaDir, item.metadata);
    const json = await fs.readJson(p);
    json.image = `ipfs://${imagesCid}/${item.image}`;
    await fs.writeJson(p, json, { spaces: 2 });
    const f = await toFile(p, 'application/json');
    metaFiles.push(f);
  }

  let metaCid;
  try {
    metaCid = await client.storeDirectory(metaFiles);
    console.log('📦 Metadata CID:', metaCid);
  } catch (err) {
    console.error('❌ Failed to upload metadata directory to NFT.Storage');
    logErrorDetailed(err);
    process.exit(1);
  }

  const manifest = { imagesCid, metaCid, items: index.map(x => ({ id: x.id, image: `ipfs://${imagesCid}/${x.image}`, metadata: `ipfs://${metaCid}/${x.metadata}` })) };
  await fs.ensureDir(outDir);
  await fs.writeJson(path.join(outDir, 'manifest.json'), manifest, { spaces: 2 });
  console.log('✅ IPFS upload complete. Manifest written to dist/manifest.json');
})();
