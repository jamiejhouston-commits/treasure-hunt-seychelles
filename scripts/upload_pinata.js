import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_JWT = process.env.PINATA_JWT;
const OUTPUT_DIR = process.env.OUTPUT_DIR || './dist';
const UPLOAD_LIMIT = parseInt(process.env.UPLOAD_LIMIT) || 100;

// Color coding for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function verifyPinataAccess() {
  try {
    log('blue', '🔑 Verifying Pinata access...');
    
    if (!PINATA_JWT) {
      throw new Error('PINATA_JWT not found in environment variables');
    }
    
    log('cyan', `Token length: ${PINATA_JWT.length}`);
    
    const response = await axios.get(`${PINATA_API_URL}/data/testAuthentication`, {
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });
    
    log('green', '✅ Pinata authentication successful');
    log('cyan', `Response: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    log('red', '❌ Pinata authentication failed');
    log('red', `Error: ${error.response?.data?.error || error.message}`);
    if (error.response?.status) {
      log('red', `Status: ${error.response.status}`);
    }
    return false;
  }
}

async function uploadFileToPinata(filePath, fileName) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        project: 'levasseur-treasure',
        type: path.extname(fileName).slice(1)
      }
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0
    });
    formData.append('pinataOptions', options);
    
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    
    return {
      success: true,
      hash: response.data.IpfsHash,
      size: response.data.PinSize,
      timestamp: response.data.Timestamp
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    };
  }
}

async function uploadImagesToPinata() {
  const imagesDir = path.join(OUTPUT_DIR, 'images');
  const metadataDir = path.join(OUTPUT_DIR, 'metadata');
  
  if (!fs.existsSync(imagesDir)) {
    throw new Error(`Images directory not found: ${imagesDir}`);
  }
  
  if (!fs.existsSync(metadataDir)) {
    throw new Error(`Metadata directory not found: ${metadataDir}`);
  }
  
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.png'))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    })
    .slice(0, UPLOAD_LIMIT);
  
  log('blue', `📦 Starting upload of ${imageFiles.length} assets to Pinata...`);
  
  const manifest = {
    name: "Levasseur Treasure Collection",
    description: "NFT collection inspired by the legendary treasure of Olivier Levasseur",
    image: null,
    attributes: [],
    collection: {
      name: "Levasseur Treasure",
      family: "Seychelles Heritage"
    },
    properties: {
      files: [],
      category: "image"
    }
  };
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const tokenId = imageFile.replace('.png', '');
    const metadataFile = `${tokenId}.json`;
    
    log('cyan', `\n[${i + 1}/${imageFiles.length}] Processing ${tokenId}...`);
    
    // Upload image
    log('yellow', '  📸 Uploading image...');
    const imageResult = await uploadFileToPinata(
      path.join(imagesDir, imageFile),
      imageFile
    );
    
    if (!imageResult.success) {
      log('red', `  ❌ Image upload failed: ${imageResult.error}`);
      errorCount++;
      continue;
    }
    
    log('green', `  ✅ Image uploaded: ${imageResult.hash}`);
    
    // Upload metadata
    log('yellow', '  📝 Uploading metadata...');
    const metadataResult = await uploadFileToPinata(
      path.join(metadataDir, metadataFile),
      metadataFile
    );
    
    if (!metadataResult.success) {
      log('red', `  ❌ Metadata upload failed: ${metadataResult.error}`);
      errorCount++;
      continue;
    }
    
    log('green', `  ✅ Metadata uploaded: ${metadataResult.hash}`);
    
    // Add to manifest
    const fileEntry = {
      uri: `ipfs://${imageResult.hash}`,
      type: "image/png"
    };
    
    const metadataEntry = {
      tokenId: parseInt(tokenId.replace('treasure_', '')),
      name: `Levasseur Treasure #${tokenId.replace('treasure_', '')}`,
      image: `ipfs://${imageResult.hash}`,
      metadata: `ipfs://${metadataResult.hash}`,
      properties: {
        image_hash: imageResult.hash,
        metadata_hash: metadataResult.hash,
        image_size: imageResult.size,
        metadata_size: metadataResult.size
      }
    };
    
    manifest.properties.files.push(fileEntry);
    manifest.attributes.push(metadataEntry);
    
    // Set collection image to first uploaded image
    if (i === 0) {
      manifest.image = `ipfs://${imageResult.hash}`;
    }
    
    successCount++;
    log('magenta', `  🎯 Token ${tokenId} complete (${successCount}/${imageFiles.length})`);
    
    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Save manifest
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  log('blue', '\n📊 Upload Summary:');
  log('green', `✅ Successful uploads: ${successCount}`);
  if (errorCount > 0) {
    log('red', `❌ Failed uploads: ${errorCount}`);
  }
  log('cyan', `📄 Manifest saved: ${manifestPath}`);
  
  if (successCount > 0) {
    log('green', '\n🎉 IPFS upload completed successfully!');
    log('cyan', 'Next step: Run mint_testnet.js to mint NFTs on XRPL');
  } else {
    throw new Error('No assets were uploaded successfully');
  }
  
  return manifest;
}

async function main() {
  try {
    log('magenta', '🏴‍☠️ Levasseur Treasure - Pinata IPFS Upload');
    log('cyan', '='.repeat(50));
    
    // Verify Pinata access
    const isAuthenticated = await verifyPinataAccess();
    if (!isAuthenticated) {
      throw new Error('Pinata authentication failed');
    }
    
    // Upload assets
    await uploadImagesToPinata();
    
  } catch (error) {
    log('red', `\n💥 Upload failed: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] === __filename) {
  main();
}

export { uploadImagesToPinata, verifyPinataAccess };