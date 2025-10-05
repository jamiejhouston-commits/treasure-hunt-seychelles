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

// Try uploading one file with more detailed error handling
async function testSingleUpload() {
    log('blue', '🧪 Testing single file upload with detailed error handling...');
    
    try {
        // Create a simple test file
        const testContent = 'Hello from Levasseur Treasure IPFS test!';
        const testBuffer = Buffer.from(testContent);
        
        const formData = new FormData();
        formData.append('file', testBuffer, {
            filename: 'levasseur-test.txt',
            contentType: 'text/plain'
        });

        // Add metadata
        const pinataMetadata = JSON.stringify({
            name: 'Levasseur Test File',
            keyvalues: {
                project: 'Levasseur Treasure',
                type: 'test'
            }
        });
        formData.append('pinataMetadata', pinataMetadata);

        // Add options
        const pinataOptions = JSON.stringify({
            cidVersion: 1,
            wrapWithDirectory: false
        });
        formData.append('pinataOptions', pinataOptions);

        log('cyan', 'Sending upload request...');
        
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        const responseText = await response.text();
        
        if (response.ok) {
            const result = JSON.parse(responseText);
            log('green', `✅ Upload successful!`);
            log('cyan', `   CID: ${result.IpfsHash}`);
            log('cyan', `   Size: ${result.PinSize} bytes`);
            log('cyan', `   Timestamp: ${result.Timestamp}`);
            log('cyan', `   URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
            return result;
        } else {
            log('red', `❌ Upload failed with status: ${response.status}`);
            log('red', `   Response: ${responseText}`);
            
            // Try to parse error details
            try {
                const errorData = JSON.parse(responseText);
                if (errorData.error) {
                    log('yellow', `   Error reason: ${errorData.error.reason}`);
                    log('yellow', `   Error details: ${errorData.error.details}`);
                }
            } catch (parseError) {
                log('yellow', `   Raw response: ${responseText}`);
            }
            
            return null;
        }
    } catch (error) {
        log('red', `❌ Exception during upload: ${error.message}`);
        return null;
    }
}

// If single upload works, try uploading a few files
async function testBatchUpload() {
    log('blue', '\n📁 Testing batch upload of first 3 images...');
    
    try {
        const files = await fs.readdir(IMAGES_DIR);
        const imageFiles = files.slice(0, 3); // Just test first 3
        
        const results = [];
        
        for (let i = 0; i < imageFiles.length; i++) {
            const fileName = imageFiles[i];
            const filePath = path.join(IMAGES_DIR, fileName);
            
            log('cyan', `[${i + 1}/3] Uploading ${fileName}...`);
            
            try {
                const fileBuffer = await fs.readFile(filePath);
                const formData = new FormData();
                
                formData.append('file', fileBuffer, {
                    filename: fileName,
                    contentType: 'image/png'
                });

                const pinataMetadata = JSON.stringify({
                    name: fileName,
                    keyvalues: {
                        project: 'Levasseur Treasure',
                        type: 'treasure-map'
                    }
                });
                formData.append('pinataMetadata', pinataMetadata);

                const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${PINATA_JWT}`,
                        ...formData.getHeaders()
                    },
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    log('green', `✅ ${fileName}: ${result.IpfsHash}`);
                    results.push({
                        name: fileName,
                        cid: result.IpfsHash,
                        size: result.PinSize
                    });
                } else {
                    const errorText = await response.text();
                    log('red', `❌ ${fileName} failed: ${response.status} ${errorText}`);
                }
                
                // Small delay between uploads
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (fileError) {
                log('red', `❌ Error with ${fileName}: ${fileError.message}`);
            }
        }
        
        if (results.length > 0) {
            log('green', `\n🎉 Successfully uploaded ${results.length} files!`);
            return true;
        } else {
            log('red', '\n❌ No files were uploaded successfully');
            return false;
        }
        
    } catch (error) {
        log('red', `❌ Batch upload error: ${error.message}`);
        return false;
    }
}

async function main() {
    log('magenta', '🏴‍☠️ Levasseur Treasure - Pinata Upload Test');
    log('cyan', '='.repeat(50));
    
    if (!PINATA_JWT) {
        log('red', '❌ PINATA_JWT not found in environment');
        process.exit(1);
    }
    
    log('cyan', `JWT Token: ${PINATA_JWT.substring(0, 50)}...`);
    
    // Test single upload first
    const singleResult = await testSingleUpload();
    
    if (singleResult) {
        log('green', '\n🎉 Single upload successful! Proceeding with batch test...');
        const batchResult = await testBatchUpload();
        
        if (batchResult) {
            log('green', '\n🚀 Ready to upload all files! The credentials are working properly.');
        }
    } else {
        log('red', '\n❌ Single upload failed. Check API key permissions.');
        log('yellow', '\n💡 Make sure your Pinata API key has these permissions:');
        log('yellow', '   - Pin Files to IPFS');
        log('yellow', '   - Unpin Files from IPFS');
        log('yellow', '   - View Pin List');
    }
}

main();