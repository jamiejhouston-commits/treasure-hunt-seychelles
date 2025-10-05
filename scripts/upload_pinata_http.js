import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PINATA_JWT = process.env.PINATA_JWT;
const IMAGES_DIR = path.join(__dirname, 'dist', 'images');
const METADATA_DIR = path.join(__dirname, 'dist', 'metadata');
const MANIFEST_PATH = path.join(__dirname, 'dist', 'manifest.json');
const PINATA_TOKENS = process.env.PINATA_TOKENS || '';

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

function parseTokenFilter(input) {
    if (!input) {
        return null;
    }

    const tokens = new Set();
    const parts = input.split(',').map(part => part.trim()).filter(Boolean);

    for (const part of parts) {
        if (part.includes('-')) {
            const [rawStart, rawEnd] = part.split('-').map(s => s.trim());
            const start = Number.parseInt(rawStart, 10);
            const end = Number.parseInt(rawEnd, 10);
            if (Number.isFinite(start) && Number.isFinite(end)) {
                const step = start <= end ? 1 : -1;
                for (let value = start; step > 0 ? value <= end : value >= end; value += step) {
                    tokens.add(String(value));
                }
            }
        } else {
            const numeric = Number.parseInt(part, 10);
            if (Number.isFinite(numeric)) {
                tokens.add(String(numeric));
            }
        }
    }

    return tokens.size > 0 ? tokens : null;
}

const tokenFilter = parseTokenFilter(PINATA_TOKENS);

// Upload file using direct HTTP API
async function uploadFile(filePath, fileName, type) {
    try {
        const formData = new FormData();
        const fileBuffer = await fs.readFile(filePath);
        
        formData.append('file', fileBuffer, {
            filename: fileName,
            contentType: type === 'image' ? 'image/png' : 'application/json'
        });

        const pinataMetadata = JSON.stringify({
            name: fileName,
            keyvalues: {
                type: type,
                collection: 'Levasseur Treasure'
            }
        });
        formData.append('pinataMetadata', pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 1
        });
        formData.append('pinataOptions', pinataOptions);

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        log('green', `✅ Uploaded ${fileName}: ${result.IpfsHash}`);
        
        return {
            name: fileName,
            cid: result.IpfsHash,
            size: result.PinSize,
            type: type,
            localPath: filePath,
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
        };
    } catch (error) {
        log('red', `❌ Error uploading ${fileName}: ${error.message}`);
        throw error;
    }
}

// Upload directory contents
async function uploadDirectory(dirPath, type) {
    log('blue', `\n📁 Uploading ${type}s from ${dirPath}...`);

    const entries = await fs.readdir(dirPath);
    const uploads = [];
    const candidates = [];

    for (const entry of entries) {
        const extension = path.extname(entry).toLowerCase();
        if (type === 'image' && extension !== '.png') {
            continue;
        }
        if (type === 'metadata' && extension !== '.json') {
            continue;
        }

        const baseName = path.parse(entry).name;
        if (tokenFilter) {
            if (/^\d+$/.test(baseName)) {
                if (!tokenFilter.has(String(Number.parseInt(baseName, 10)))) {
                    continue;
                }
            } else {
                // When a filter is active we ignore non-numeric filenames
                continue;
            }
        }

        const filePath = path.join(dirPath, entry);
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) {
            continue;
        }

        candidates.push({
            file: entry,
            filePath,
            tokenId: /^\d+$/.test(baseName) ? String(Number.parseInt(baseName, 10)) : null
        });
    }

    candidates.sort((a, b) => {
        const aNum = a.tokenId !== null ? Number.parseInt(a.tokenId, 10) : Number.NaN;
        const bNum = b.tokenId !== null ? Number.parseInt(b.tokenId, 10) : Number.NaN;
        if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
            return a.file.localeCompare(b.file);
        }
        return aNum - bNum;
    });

    const total = candidates.length;
    let index = 0;
    for (const candidate of candidates) {
        index += 1;
        log('cyan', `[${index}/${total}] Uploading ${candidate.file}...`);

        try {
            const result = await uploadFile(candidate.filePath, candidate.file, type);
            if (candidate.tokenId) {
                result.tokenId = candidate.tokenId;
            }
            uploads.push(result);
        } catch (error) {
            log('red', `Failed to upload ${candidate.file}: ${error.message}`);
            throw error;
        }
    }

    if (total === 0) {
        log('yellow', '⚠️  No files matched the current filter.');
    }

    return uploads;
}

async function updateMetadataImages(imageUploads) {
    if (!imageUploads.length) {
        return [];
    }

    const updates = [];
    for (const upload of imageUploads) {
        const tokenId = upload.tokenId || path.parse(upload.name).name;
        if (!tokenId) {
            continue;
        }

        const metadataPath = path.join(METADATA_DIR, `${tokenId}.json`);
        try {
            const metadataRaw = await fs.readFile(metadataPath, 'utf8');
            const metadata = JSON.parse(metadataRaw);
            const newUri = `ipfs://${upload.cid}`;
            if (metadata.image !== newUri) {
                metadata.image = newUri;
                await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
            }
            log('magenta', `  ✏️ Updated metadata ${tokenId}.json image -> ${newUri}`);
            updates.push({ tokenId, image: newUri });
        } catch (error) {
            log('red', `  ❌ Failed to update metadata for token ${tokenId}: ${error.message}`);
            throw error;
        }
    }

    return updates;
}

// Main upload function
async function uploadToIPFS() {
    log('magenta', '🏴‍☠️ Levasseur Treasure - Pinata IPFS Upload (HTTP API)');
    log('cyan', '='.repeat(60));

    if (!PINATA_JWT) {
        log('red', '❌ PINATA_JWT not found in environment variables');
        process.exit(1);
    }

    log('cyan', `Using JWT token (length: ${PINATA_JWT.length})`);
    if (tokenFilter) {
        const orderedTokens = Array.from(tokenFilter).map(Number).sort((a, b) => a - b);
        log('yellow', `🎯 Token filter active: ${orderedTokens.join(', ')}`);
    }

    const manifest = {
        timestamp: new Date().toISOString(),
        service: 'Pinata HTTP API',
        uploads: {
            images: [],
            metadata: []
        },
        summary: {
            totalFiles: 0,
            totalSize: 0,
            imageCount: 0,
            metadataCount: 0,
            metadataImagesUpdated: 0
        }
    };

    try {
        // Upload images
        log('blue', '\n📸 Uploading images...');
        const imageUploads = await uploadDirectory(IMAGES_DIR, 'image');
        manifest.uploads.images = imageUploads;
        manifest.summary.imageCount = imageUploads.length;

        if (imageUploads.length) {
            log('blue', '\n🛠️ Updating metadata image URIs before upload...');
            const imageUpdates = await updateMetadataImages(imageUploads);
            manifest.summary.metadataImagesUpdated = imageUpdates.length;
            manifest.uploads.imageUpdates = imageUpdates;
        }

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
        log('green', `\n✅ Manifest saved to ${MANIFEST_PATH}`);

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