const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = path.join(__dirname, 'assets', 'images');
const outputDir = path.join(__dirname, 'frontend', 'public', 'themes', 'home_v1');

const selections = {
  heroDesktop: '1.png',
  heroMobile: '2.png',
  watermarkSource: '4.png',
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createHero = async (filename, width, height, name) => {
  const basePath = path.join(sourceDir, filename);
  const target = path.join(outputDir, `${name}.webp`);
  const target2x = path.join(outputDir, `${name}@2x.webp`);

  await sharp(basePath)
    .resize({ width, height, fit: 'cover', position: 'center' })
    .webp({ quality: 82 })
    .toFile(target);

  await sharp(basePath)
    .resize({ width: width * 2, height: height * 2, fit: 'cover', position: 'center' })
    .webp({ quality: 82 })
    .toFile(target2x);
};

const createWatermark = async (filename) => {
  const basePath = path.join(sourceDir, filename);
  const target = path.join(outputDir, 'watermark_compass.png');

  await sharp(basePath)
    .resize({ width: 600 })
    .extractChannel('green')
    .negate()
    .linear(1, 0)
    .toColourspace('b-w')
    .tint('#D9B45B')
    .png({ compressionLevel: 9 })
    .toFile(target);
};

const createFog = async () => {
  const target = path.join(outputDir, 'fog.png');
  const width = 1600;
  const height = 600;

  const gradient = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = Math.round(40 + 30 * Math.sin((x / width) * Math.PI) * Math.cos((y / height) * Math.PI));
      gradient[idx] = 255;
      gradient[idx + 1] = 255;
      gradient[idx + 2] = 255;
      gradient[idx + 3] = alpha;
    }
  }

  await sharp(gradient, { raw: { width, height, channels: 4 } })
    .blur(25)
    .png({ compressionLevel: 9 })
    .toFile(target);
};

const createGrain = async () => {
  const target = path.join(outputDir, 'grain.png');
  const size = 64;
  const raw = Buffer.alloc(size * size);

  for (let i = 0; i < raw.length; i++) {
    raw[i] = Math.floor(Math.random() * 80) + 40;
  }

  await sharp(raw, { raw: { width: size, height: size, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(target);
};

const main = async () => {
  ensureDir(outputDir);
  await createHero(selections.heroDesktop, 1440, 810, 'hero_desktop');
  await createHero(selections.heroMobile, 720, 1080, 'hero_mobile');
  await createWatermark(selections.watermarkSource);
  await createFog();
  await createGrain();
  console.log('Home assets generated in', outputDir);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
