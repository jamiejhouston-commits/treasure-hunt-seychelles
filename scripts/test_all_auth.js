import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

dotenv.config();

const PINATA_TOKEN = process.env.PINATA_JWT;

console.log('Testing Pinata authentication methods...');
console.log(`Token: ${PINATA_TOKEN}`);
console.log(`Token length: ${PINATA_TOKEN.length}\n`);

// Test 1: JWT Bearer token
async function testJWTBearer() {
    console.log('--- Test 1: JWT Bearer Token ---');
    try {
        const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PINATA_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ SUCCESS with JWT Bearer:', result);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ FAILED JWT Bearer:', error);
        }
    } catch (error) {
        console.log('❌ ERROR JWT Bearer:', error.message);
    }
    return false;
}

// Test 2: Direct Authorization header
async function testDirectAuth() {
    console.log('\n--- Test 2: Direct Authorization ---');
    try {
        const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
            method: 'GET',
            headers: {
                'Authorization': PINATA_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ SUCCESS with Direct Auth:', result);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ FAILED Direct Auth:', error);
        }
    } catch (error) {
        console.log('❌ ERROR Direct Auth:', error.message);
    }
    return false;
}

// Test 3: As API Key in custom header
async function testCustomHeader() {
    console.log('\n--- Test 3: Custom Header ---');
    try {
        const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
            method: 'GET',
            headers: {
                'pinata-api-key': PINATA_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ SUCCESS with Custom Header:', result);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ FAILED Custom Header:', error);
        }
    } catch (error) {
        console.log('❌ ERROR Custom Header:', error.message);
    }
    return false;
}

// Test 4: Try file upload with Bearer
async function testFileUpload() {
    console.log('\n--- Test 4: File Upload Test ---');
    try {
        const formData = new FormData();
        formData.append('file', Buffer.from('test content'), {
            filename: 'test.txt',
            contentType: 'text/plain'
        });

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_TOKEN}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ SUCCESS with File Upload:', result);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ FAILED File Upload:', error);
        }
    } catch (error) {
        console.log('❌ ERROR File Upload:', error.message);
    }
    return false;
}

// Run all tests
async function runTests() {
    const methods = [
        testJWTBearer,
        testDirectAuth,
        testCustomHeader,
        testFileUpload
    ];

    for (const method of methods) {
        const success = await method();
        if (success) {
            console.log('\n🎉 Found working authentication method!');
            return;
        }
    }

    console.log('\n❌ All authentication methods failed. The token may need to be regenerated or may require additional credentials.');
}

runTests();