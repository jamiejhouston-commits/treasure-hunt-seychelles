// Utility to map freshly generated S3 previews to token IDs 121-140 for app preview.
// Copies PNG + JSON from images/s3 & metadata/s3 into dist/images and dist/metadata using numeric filenames.
// Also adjusts metadata.image URI to `/real/images/{tokenId}.png` and preserves other fields.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_IMG_DIR = path.join(__dirname, 'dist', 'images', 's3');
const SRC_META_DIR = path.join(__dirname, 'dist', 'metadata', 's3');
const DEST_IMG_DIR = path.join(__dirname, 'dist', 'images');
const DEST_META_DIR = path.join(__dirname, 'dist', 'metadata');

const mapping = Array.from({ length: 20 }, (_, idx) => {
  const codeNumber = String(idx + 1).padStart(2, '0');
  return {
    code: `S3-${codeNumber}`,
    tokenId: 121 + idx
  };
});

function ensureDirs() {
  [DEST_IMG_DIR, DEST_META_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function apply() {
  ensureDirs();
  mapping.forEach(({ code, tokenId }) => {
    const srcImg = path.join(SRC_IMG_DIR, `${code}.png`);
    const destImg = path.join(DEST_IMG_DIR, `${tokenId}.png`);
    const srcMeta = path.join(SRC_META_DIR, `${code}.json`);
    const destMeta = path.join(DEST_META_DIR, `${tokenId}.json`);

    if (!fs.existsSync(srcImg) || !fs.existsSync(srcMeta)) {
      throw new Error(`Missing source asset for ${code}`);
    }

    fs.copyFileSync(srcImg, destImg);

    const meta = JSON.parse(fs.readFileSync(srcMeta, 'utf8'));
    meta.image = `/real/images/${tokenId}.png`;
    fs.writeFileSync(destMeta, JSON.stringify(meta, null, 2));

    console.log(`🔁 Applied ${code} -> token ${tokenId}`);
  });
  console.log('✅ S3 assets mapped to numeric tokens for preview.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  apply();
}

export { apply };
