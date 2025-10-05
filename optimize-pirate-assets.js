const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Configuration for different asset types
const assetConfig = {
  hero_desktop: {
    width: 1920,
    height: 1080,
    quality: 85,
    maxSize: 900000, // 900KB
    description: 'Wide cinematic wallpaper for desktop hero'
  },
  hero_mobile: {
    width: 768,
    height: 1024,
    quality: 80,
    maxSize: 400000, // 400KB
    description: 'Tall portrait for mobile hero'
  },
  gallery_bg: {
    width: 1600,
    height: 1000,
    quality: 75,
    maxSize: 600000, // 600KB
    description: 'Moody background for gallery'
  },
  puzzle_banner: {
    width: 1400,
    height: 600,
    quality: 80,
    maxSize: 500000, // 500KB
    description: 'Banner for puzzle page'
  },
  about_interstitial: {
    width: 1200,
    height: 550,
    quality: 80,
    maxSize: 450000, // 450KB
    description: 'Scenic interstitial for about page'
  },
  footer_bg: {
    width: 1200,
    height: 300,
    quality: 70,
    maxSize: 200000, // 200KB
    description: 'Underwater anchor/helm silhouette'
  }
};

// Asset analysis based on typical pirate imagery keywords
const imageAnalysis = {
  // Wide cinematic scenes - good for desktop hero
  wideScenes: [1, 5, 15, 20, 25, 30, 35, 40, 45, 50],
  // Portrait orientation - good for mobile hero
  portraits: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
  // Moody/atmospheric - good for gallery bg
  atmospheric: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
  // Compass/navigation themed - good for puzzle
  navigation: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
  // Scenic/story telling - good for about
  scenic: [6, 11, 16, 21, 26, 31, 36, 41, 46],
  // Underwater/anchor themed - good for footer
  underwater: [10, 15, 20, 25, 30, 35, 40, 45, 50]
};

const sourceDir = './assets/images';
const outputDir = './frontend/public/themes/seychelles';

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function getImageDimensions(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      aspectRatio: metadata.width / metadata.height
    };
  } catch (error) {
    console.error(`Error reading ${imagePath}:`, error.message);
    return null;
  }
}

async function optimizeImage(inputPath, outputPath, config, format = 'webp') {
  try {
    let pipeline = sharp(inputPath)
      .resize(config.width, config.height, { 
        fit: 'cover', 
        position: 'center' 
      });

    if (format === 'webp') {
      pipeline = pipeline.webp({ quality: config.quality });
    } else if (format === 'avif') {
      pipeline = pipeline.avif({ quality: config.quality - 10 });
    }

    await pipeline.toFile(outputPath);
    
    const stats = await fs.stat(outputPath);
    return {
      size: stats.size,
      path: outputPath,
      withinLimit: stats.size <= config.maxSize
    };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function selectBestImage(candidates, targetAspectRatio, preference = 'wide') {
  const imageInfo = [];
  
  for (const candidate of candidates) {
    const imagePath = path.join(sourceDir, `${candidate}.png`);
    const dimensions = await getImageDimensions(imagePath);
    
    if (dimensions) {
      const aspectScore = Math.abs(dimensions.aspectRatio - targetAspectRatio);
      imageInfo.push({
        id: candidate,
        path: imagePath,
        dimensions,
        aspectScore,
        sizeScore: dimensions.width * dimensions.height // Prefer larger images
      });
    }
  }
  
  // Sort by aspect ratio match first, then by size
  imageInfo.sort((a, b) => {
    const aspectDiff = a.aspectScore - b.aspectScore;
    if (Math.abs(aspectDiff) < 0.1) {
      return b.sizeScore - a.sizeScore; // Prefer larger if aspect ratios are close
    }
    return aspectDiff;
  });
  
  return imageInfo[0] || null;
}

async function processAssets() {
  console.log('🏴‍☠️ Starting Pirate Asset Optimization...\n');
  
  await ensureDir(outputDir);
  const results = {};
  
  // Hero Desktop - Wide cinematic (16:9)
  console.log('Selecting desktop hero...');
  const desktopHero = await selectBestImage(imageAnalysis.wideScenes, 16/9, 'wide');
  if (desktopHero) {
    console.log(`  Selected: ${desktopHero.id}.png (${desktopHero.dimensions.width}x${desktopHero.dimensions.height})`);
    const webp = await optimizeImage(desktopHero.path, path.join(outputDir, 'hero_desktop.webp'), assetConfig.hero_desktop);
    const avif = await optimizeImage(desktopHero.path, path.join(outputDir, 'hero_desktop.avif'), assetConfig.hero_desktop, 'avif');
    results.hero_desktop = { source: desktopHero.id, webp, avif };
  }
  
  // Hero Mobile - Portrait (3:4)
  console.log('Selecting mobile hero...');
  const mobileHero = await selectBestImage(imageAnalysis.portraits, 3/4, 'portrait');
  if (mobileHero) {
    console.log(`  Selected: ${mobileHero.id}.png (${mobileHero.dimensions.width}x${mobileHero.dimensions.height})`);
    const webp = await optimizeImage(mobileHero.path, path.join(outputDir, 'hero_mobile.webp'), assetConfig.hero_mobile);
    const avif = await optimizeImage(mobileHero.path, path.join(outputDir, 'hero_mobile.avif'), assetConfig.hero_mobile, 'avif');
    results.hero_mobile = { source: mobileHero.id, webp, avif };
  }
  
  // Gallery Background - Wide atmospheric (16:10)
  console.log('Selecting gallery background...');
  const galleryBg = await selectBestImage(imageAnalysis.atmospheric, 16/10, 'wide');
  if (galleryBg) {
    console.log(`  Selected: ${galleryBg.id}.png (${galleryBg.dimensions.width}x${galleryBg.dimensions.height})`);
    const webp = await optimizeImage(galleryBg.path, path.join(outputDir, 'gallery_bg.webp'), assetConfig.gallery_bg);
    const avif = await optimizeImage(galleryBg.path, path.join(outputDir, 'gallery_bg.avif'), assetConfig.gallery_bg, 'avif');
    results.gallery_bg = { source: galleryBg.id, webp, avif };
  }
  
  // Puzzle Banner - Wide banner (7:3)
  console.log('Selecting puzzle banner...');
  const puzzleBanner = await selectBestImage(imageAnalysis.navigation, 7/3, 'wide');
  if (puzzleBanner) {
    console.log(`  Selected: ${puzzleBanner.id}.png (${puzzleBanner.dimensions.width}x${puzzleBanner.dimensions.height})`);
    const webp = await optimizeImage(puzzleBanner.path, path.join(outputDir, 'puzzle_banner.webp'), assetConfig.puzzle_banner);
    const avif = await optimizeImage(puzzleBanner.path, path.join(outputDir, 'puzzle_banner.avif'), assetConfig.puzzle_banner, 'avif');
    results.puzzle_banner = { source: puzzleBanner.id, webp, avif };
  }
  
  // About Interstitial - Wide scenic (22:10)
  console.log('Selecting about interstitial...');
  const aboutInterstitial = await selectBestImage(imageAnalysis.scenic, 22/10, 'wide');
  if (aboutInterstitial) {
    console.log(`  Selected: ${aboutInterstitial.id}.png (${aboutInterstitial.dimensions.width}x${aboutInterstitial.dimensions.height})`);
    const webp = await optimizeImage(aboutInterstitial.path, path.join(outputDir, 'about_interstitial.webp'), assetConfig.about_interstitial);
    const avif = await optimizeImage(aboutInterstitial.path, path.join(outputDir, 'about_interstitial.avif'), assetConfig.about_interstitial, 'avif');
    results.about_interstitial = { source: aboutInterstitial.id, webp, avif };
  }
  
  // Footer Background - Wide underwater (4:1)
  console.log('Selecting footer background...');
  const footerBg = await selectBestImage(imageAnalysis.underwater, 4/1, 'wide');
  if (footerBg) {
    console.log(`  Selected: ${footerBg.id}.png (${footerBg.dimensions.width}x${footerBg.dimensions.height})`);
    const webp = await optimizeImage(footerBg.path, path.join(outputDir, 'footer_bg.webp'), assetConfig.footer_bg);
    const avif = await optimizeImage(footerBg.path, path.join(outputDir, 'footer_bg.avif'), assetConfig.footer_bg, 'avif');
    results.footer_bg = { source: footerBg.id, webp, avif };
  }
  
  // Generate parchment texture from any map-like image
  console.log('Creating parchment texture...');
  const parchmentSource = await selectBestImage([21, 26, 31, 36, 41], 1, 'square');
  if (parchmentSource) {
    // Create a seamless parchment texture
    const texture = await sharp(parchmentSource.path)
      .resize(300, 300, { fit: 'cover' })
      .modulate({ brightness: 0.85, saturation: 0.15 }) // Desaturate and darken slightly
      .webp({ quality: 70 })
      .toFile(path.join(outputDir, 'parchment_texture.webp'));
    
    results.parchment_texture = { source: parchmentSource.id, size: (await fs.stat(path.join(outputDir, 'parchment_texture.webp'))).size };
  }
  
  console.log('\n✅ Asset optimization complete!\n');
  
  // Print summary
  for (const [key, result] of Object.entries(results)) {
    if (result.webp) {
      console.log(`${key}:`);
      console.log(`  Source: ${result.source}.png`);
      console.log(`  WebP: ${(result.webp.size / 1024).toFixed(1)}KB ${result.webp.withinLimit ? '✅' : '⚠️'}`);
      if (result.avif) {
        console.log(`  AVIF: ${(result.avif.size / 1024).toFixed(1)}KB ${result.avif.withinLimit ? '✅' : '⚠️'}`);
      }
    } else if (result.size) {
      console.log(`${key}: ${(result.size / 1024).toFixed(1)}KB`);
    }
  }
  
  return results;
}

// Run the optimization
processAssets().catch(console.error);