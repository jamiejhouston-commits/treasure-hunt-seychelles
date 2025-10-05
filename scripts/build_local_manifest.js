import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
const localEnvPath = path.join(__dirname, '.env.local');
dotenv.config({ path: envPath });
dotenv.config({ path: localEnvPath, override: true });

async function main() {
  const outDir = path.resolve(process.env.OUTPUT_DIR || path.join(__dirname, 'dist'));
  const indexPath = path.join(outDir, 'metadata-index.json');
  const base = process.env.LOCAL_BASE || 'http://localhost:3001';
  if (!await fs.pathExists(indexPath)) {
    console.error('Missing metadata-index.json. Run build_metadata first.');
    process.exit(1);
  }
  const index = await fs.readJson(indexPath);
  const items = index.map(x => ({
    id: x.id,
    image: `${base}/minted/images/${x.image}`,
    metadata: `${base}/minted/metadata/${x.metadata}`
  }));
  const manifest = { imagesCid: null, metaCid: null, items };
  await fs.ensureDir(outDir);
  await fs.writeJson(path.join(outDir, 'manifest.json'), manifest, { spaces: 2 });
  console.log('✅ Local manifest written to', path.join(outDir, 'manifest.json'));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { console.error(err); process.exit(1); });
}
import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';

(async () => {
  const outDir = path.resolve(process.env.OUTPUT_DIR || './dist');
  const baseUrl = process.env.LOCAL_ASSET_BASE || 'http://localhost:3001/minted';
  const indexPath = path.join(outDir, 'metadata-index.json');
  if (!await fs.pathExists(indexPath)) {
    console.error('Missing metadata-index.json. Run build_metadata first.');
    process.exit(1);
  }
  const index = await fs.readJson(indexPath);
  const items = index.map(x => ({
    id: x.id,
    image: `${baseUrl}/images/${x.image}`,
    metadata: `${baseUrl}/metadata/${x.metadata}`
  }));
  await fs.ensureDir(outDir);
  await fs.writeJson(path.join(outDir, 'manifest.json'), { items }, { spaces: 2 });
  console.log('✅ Local manifest written to dist/manifest.json using base', baseUrl);
})();
