import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PinataSDK } from 'pinata';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PINATA_JWT = process.env.PINATA_JWT;
const IMAGES_DIR = path.join(__dirname, 'dist', 'images');
const METADATA_DIR = path.join(__dirname, 'dist', 'metadata');
const MANIFEST_PATH = path.join(__dirname, 'dist', 'manifest.json');

if (!PINATA_JWT) {
    console.error('❌ PINATA_JWT not found in environment variables');
    process.exit(1);
}

// Initialize Pinata SDK
const pinata = new PinataSDK({
    pinataJwt: PINATA_JWT,
    pinataGateway: "gateway.pinata.cloud" // Default gateway
});

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

// Test Pinata authentication
async function testPinataAuth() {
    try {
        log('blue', '🔑 Testing Pinata authentication...');
        
        // Test by uploading a small test file
        const testFile = new File(["test"], "test.txt", { type: "text/plain" });
        const testUpload = await pinata.upload.public.file(testFile);
        
        log('green', '✅ Pinata authentication successful');
        log('cyan', `Test file uploaded with CID: ${testUpload.cid}`);
        return true;
    } catch (error) {
        log('red', `❌ Pinata authentication failed: ${error.message}`);
        return false;
    }
}

// Upload a file to Pinata
async function uploadFile(filePath, fileName, type) {
    try {
        const fileBuffer = await fs.readFile(filePath);
        const file = new File([fileBuffer], fileName, {
            type: type === 'image' ? 'image/png' : 'application/json'
        });

        const upload = await pinata.upload.public.file(file);

        log('green', `✅ Uploaded ${fileName}: ${upload.cid}`);
        
        return {
            name: fileName,
            cid: upload.cid,
            size: upload.size,
            type: type,
            localPath: filePath
        };
    } catch (error) {
        log('red', `❌ Error uploading ${fileName}: ${error.message}`);
        throw error;
    }
}

// Upload all files in a directory
async function uploadDirectory(dirPath, type) {
    log('blue', `📁 Uploading ${type}s from ${dirPath}...`);
    
    const files = await fs.readdir(dirPath);
    const uploads = [];
    
    let count = 0;
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
            count++;
            log('cyan', `[${count}/${files.length}] Uploading ${file}...`);
            
            try {
                const result = await uploadFile(filePath, file, type);
                uploads.push(result);
            } catch (error) {
                log('red', `Failed to upload ${file}: ${error.message}`);
                throw error;
            }
        }
    }
    
    return uploads;
}

// Main upload function
async function uploadToIPFS() {
    log('magenta', '🏴‍☠️ Levasseur Treasure - Pinata IPFS Upload (Official SDK)');
    log('cyan', '='.repeat(60));

    // Test authentication first
    const authSuccess = await testPinataAuth();
    if (!authSuccess) {
        process.exit(1);
    }

    const manifest = {
        timestamp: new Date().toISOString(),
        service: 'Pinata SDK',
        uploads: {
            images: [],
            metadata: []
        },
        summary: {
            totalFiles: 0,
            totalSize: 0,
            imageCount: 0,
            metadataCount: 0
        }
    };

    try {
        // Upload images
        log('blue', '\n📸 Uploading images...');
        const imageUploads = await uploadDirectory(IMAGES_DIR, 'image');
        manifest.uploads.images = imageUploads;
        manifest.summary.imageCount = imageUploads.length;

        // Upload metadata
        log('blue', '\n📋 Uploading metadata...');
        const metadataUploads = await uploadDirectory(METADATA_DIR, 'metadata');
        manifest.uploads.metadata = metadataUploads;
        manifest.summary.metadataCount = metadataUploads.length;

        // Calculate totals
        const allUploads = [...imageUploads, ...metadataUploads];
        manifest.summary.totalFiles = allUploads.length;
        manifest.summary.totalSize = allUploads.reduce((sum, upload) => sum + (upload.size || 0), 0);

        // Save manifest
        await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        log('green', `✅ Manifest saved to ${MANIFEST_PATH}`);

        // Print summary
        log('blue', '\n📊 Upload Summary:');
        log('cyan', `   Images: ${manifest.summary.imageCount} files`);
        log('cyan', `   Metadata: ${manifest.summary.metadataCount} files`);
        log('cyan', `   Total: ${manifest.summary.totalFiles} files`);
        log('cyan', `   Total Size: ${(manifest.summary.totalSize / 1024 / 1024).toFixed(2)} MB`);

        log('green', '\n🎉 All files uploaded to IPFS via Pinata successfully!');
        
        return manifest;

    } catch (error) {
        log('red', `\n💥 Upload failed: ${error.message}`);
        process.exit(1);
    }
}

// Run if called directly
if (process.argv[1] === __filename) {
    uploadToIPFS();
}

export default uploadToIPFS;