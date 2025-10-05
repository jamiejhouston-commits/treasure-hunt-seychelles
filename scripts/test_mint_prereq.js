import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';

async function test() {
  console.log('🧪 Testing minting prerequisites...');
  
  const seed = process.env.XRPL_TESTNET_SEED;
  const outDir = path.resolve(process.env.OUTPUT_DIR || './dist');
  const manifestPath = path.join(outDir, 'manifest.json');

  console.log('Environment check:');
  console.log(`  SEED: ${seed ? 'Set' : 'Missing'}`);
  console.log(`  TRANSFER_FEE: ${process.env.TRANSFER_FEE}`);
  console.log(`  NFT_TAXON: ${process.env.NFT_TAXON}`);
  
  console.log('File check:');
  console.log(`  Output dir: ${outDir}`);
  console.log(`  Manifest path: ${manifestPath}`);
  console.log(`  Manifest exists: ${await fs.pathExists(manifestPath)}`);
  
  if (await fs.pathExists(manifestPath)) {
    const manifest = await fs.readJson(manifestPath);
    console.log(`  Items in manifest: ${manifest.items ? manifest.items.length : 'No items array'}`);
    if (manifest.items && manifest.items.length > 0) {
      console.log(`  First item:`, manifest.items[0]);
    }
  }
}

test().catch(console.error);