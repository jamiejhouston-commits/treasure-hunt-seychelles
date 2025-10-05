import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) {
  console.error('❌ PINATA_JWT missing in .env – cannot upload to IPFS.');
  process.exit(1);
}

const PINATA_UPLOAD_ENDPOINT = 'https://uploads.pinata.cloud/v3/files';

async function uploadBufferToPinata(buffer, filename) {
  try {
    const blob = new Blob([buffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, filename);

    const response = await fetch(PINATA_UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.cid;
  } catch (error) {
    console.error(`Failed to upload ${filename}:`, error.message);
    throw error;
  }
}

async function uploadChapterToIPFS(chapterDir) {
  const chapterName = path.basename(chapterDir);
  const imagesDir = path.join(chapterDir, 'images');
  const metadataDir = path.join(chapterDir, 'metadata');

  if (!await fs.pathExists(imagesDir) || !await fs.pathExists(metadataDir)) {
    throw new Error(`Chapter directory structure invalid: ${chapterDir}`);
  }

  console.log(`🏝️ Uploading ${chapterName} to IPFS...`);

  // Get all image and metadata files
  const imageFiles = (await fs.readdir(imagesDir)).filter(f => f.endsWith('.png'));
  const metadataFiles = (await fs.readdir(metadataDir)).filter(f => f.endsWith('.json'));

  console.log(`📊 Found ${imageFiles.length} images and ${metadataFiles.length} metadata files`);

  const cidMap = {};
  const metadataIndex = {};

  // Upload images first
  for (const imageFile of imageFiles) {
    const slug = path.basename(imageFile, '.png');
    const imagePath = path.join(imagesDir, imageFile);
    
    console.log(`📤 Uploading image: ${imageFile}...`);
    
    const imageBuffer = await fs.readFile(imagePath);
    const imageCid = await uploadBufferToPinata(imageBuffer, imageFile);
    
    cidMap[slug] = { image: imageCid };
    
    // Update metadata with IPFS URI
    const metadataPath = path.join(metadataDir, `${slug}.json`);
    if (await fs.pathExists(metadataPath)) {
      const metadata = await fs.readJson(metadataPath);
      metadata.image = `ipfs://${imageCid}`;
      await fs.writeJson(metadataPath, metadata, { spaces: 2 });
      
      console.log(`📝 Updated metadata: ${slug}.json`);
    }
  }

  // Upload updated metadata files
  for (const metadataFile of metadataFiles) {
    const slug = path.basename(metadataFile, '.json');
    const metadataPath = path.join(metadataDir, metadataFile);
    
    console.log(`📤 Uploading metadata: ${metadataFile}...`);
    
    const metadataBuffer = await fs.readFile(metadataPath);
    const metadataCid = await uploadBufferToPinata(metadataBuffer, metadataFile);
    
    if (cidMap[slug]) {
      cidMap[slug].metadata = metadataCid;
    } else {
      cidMap[slug] = { metadata: metadataCid };
    }

    const metadata = await fs.readJson(metadataPath);
    metadataIndex[slug] = {
      name: metadata.name,
      tokenId: metadata.properties?.tokenId,
      imageCid: cidMap[slug].image,
      metadataCid: metadataCid,
      chapter: metadata.chapter
    };

    console.log(`✅ ${slug} ready (image: ${cidMap[slug].image}, metadata: ${metadataCid})`);
  }

  // Save CID mappings
  const cidMapPath = path.join(chapterDir, 'cid-map.json');
  await fs.writeJson(cidMapPath, cidMap, { spaces: 2 });

  const metadataIndexPath = path.join(chapterDir, 'metadata-index.json');
  await fs.writeJson(metadataIndexPath, metadataIndex, { spaces: 2 });

  console.log(`📄 Saved CID map and metadata index for ${chapterName}`);
  console.log(`✅ ${chapterName} upload complete! (${Object.keys(cidMap).length} assets)`);

  return { cidMap, metadataIndex, chapterName };
}

async function deployAllChapters() {
  const contentDir = path.resolve(__dirname, '../content');
  const chapters = await fs.readdir(contentDir);
  
  console.log('🚀 DEPLOYING ALL CHAPTERS TO IPFS');
  console.log('================================\n');

  const results = {};

  for (const chapter of chapters) {
    const chapterPath = path.join(contentDir, chapter);
    const stat = await fs.stat(chapterPath);
    
    if (stat.isDirectory()) {
      try {
        const result = await uploadChapterToIPFS(chapterPath);
        results[chapter] = result;
        console.log(`🎉 ${chapter} deployed successfully!\n`);
      } catch (error) {
        console.error(`❌ Failed to deploy ${chapter}:`, error.message);
        console.log(''); // Empty line for readability
      }
    }
  }

  console.log('📊 DEPLOYMENT SUMMARY:');
  console.log('======================');
  Object.keys(results).forEach(chapter => {
    const count = Object.keys(results[chapter].cidMap).length;
    console.log(`✅ ${chapter}: ${count} assets deployed`);
  });

  console.log(`\n🎉 Total chapters deployed: ${Object.keys(results).length}`);
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    // Deploy specific chapter
    const chapterName = args[0];
    const contentDir = path.resolve(__dirname, '../content');
    const chapterPath = path.join(contentDir, chapterName);

    if (await fs.pathExists(chapterPath)) {
      await uploadChapterToIPFS(chapterPath);
    } else {
      console.error(`❌ Chapter directory not found: ${chapterPath}`);
      process.exit(1);
    }
  } else {
    // Deploy all chapters
    await deployAllChapters();
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(err => {
    console.error('❌ Deployment failed:', err);
    process.exit(1);
  });
}

export { uploadChapterToIPFS, deployAllChapters };