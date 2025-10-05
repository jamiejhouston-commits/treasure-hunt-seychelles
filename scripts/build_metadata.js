import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .option('supply', { type: 'number', default: parseInt(process.env.SUPPLY || '100', 10) })
  .option('imagesDir', { type: 'string', default: process.env.IMAGES_DIR || './dist/images' })
  .option('outDir', { type: 'string', default: process.env.OUTPUT_DIR || './dist' })
  .option('collection', { type: 'string', default: process.env.COLLECTION_NAME || 'Treasure of Seychelles' })
  .help().argv;

(async () => {
  const outDir = path.resolve(argv.outDir);
  const imagesDir = path.resolve(argv.imagesDir);
  const metaOut = path.join(outDir, 'metadata');
  await fs.ensureDir(metaOut);

  const manifestPath = path.join(outDir, 'art-manifest.json');
  if (!await fs.pathExists(manifestPath)) {
    console.error('Missing art-manifest.json. Run `npm run gen:art` first.');
    process.exit(1);
  }
  const manifest = await fs.readJson(manifestPath);

  const index = [];
  for (const item of manifest) {
    const id = item.tokenId;
    const subtitle = item.island === 'Mahé' ? 'Mahé Manuscript' : item.island === 'La Digue' ? "La Digue's Secret" : item.island === 'Praslin' ? "Praslin's Prophecy" : 'Outer Islands Revelation';
    const name = `Levasseur Fragment #${String(id).padStart(3,'0')} — ${subtitle}`;
    const description = `A Seychelles cartographic fragment. Island ${item.island}; Chapter ${item.chapter}. Bearing ${item.bearing}°, coords ${item.coordinates}.`;
    const attributes = [
      { trait_type: 'Island', value: item.island },
      { trait_type: 'Rarity', value: item.rarity },
      { trait_type: 'Bearing', value: `${item.bearing}°` },
      { trait_type: 'Chapter', value: item.chapter },
      ...item.overlays.map(o => ({ trait_type: 'Overlay', value: o }))
    ];
    const metadata = {
      name,
      description,
      image: `ipfs://PLACEHOLDER/${id}.png`,
      attributes,
      clue: { type: item.clue.type, value: item.clue.value, hint: item.clue.hint },
      external_url: `https://treasureofseychelles.com/nft/${id}`,
      collection: { name: argv.collection, chapter: item.chapter }
    };
    const filepath = path.join(metaOut, `${id}.json`);
    await fs.writeJson(filepath, metadata, { spaces: 2 });
    index.push({ id, image: `${id}.png`, metadata: `${id}.json` });
  }

  await fs.writeJson(path.join(outDir, 'metadata-index.json'), index, { spaces: 2 });
  console.log(`✅ Built metadata for ${index.length} items in ${metaOut}`);
})();
