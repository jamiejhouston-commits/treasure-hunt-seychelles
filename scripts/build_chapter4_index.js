import fs from 'fs-extra';
import path from 'path';

const metadataDir = path.resolve(process.cwd(), '../content/ch4/metadata');
const outputDir = path.resolve(process.cwd(), '../content/ch4');

async function main() {
  if (!await fs.pathExists(metadataDir)) {
    console.error('Missing content/ch4/metadata directory.');
    process.exit(1);
  }

  const files = (await fs.readdir(metadataDir))
    .filter(name => name.startsWith('ch4_') && name.endsWith('.json'))
    .sort();

  if (!files.length) {
    console.error('No Chapter IV metadata files found.');
    process.exit(1);
  }

  const baseTokenId = 140;
  const index = files.map((filename, idx) => {
    const num = filename.replace('ch4_', '').replace('.json', '');
    const tokenId = baseTokenId + idx + 1; // 141-160
    return {
      id: tokenId,
      image: `ch4_${num}.png`,
      metadata: filename
    };
  });

  const outPath = path.join(outputDir, 'metadata-index.json');
  await fs.writeJson(outPath, index, { spaces: 2 });
  console.log(`✅ Wrote Chapter IV metadata index to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});