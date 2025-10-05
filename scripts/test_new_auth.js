import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

console.log('🔐 Testing Pinata Authentication Methods');
console.log('='.repeat(50));
console.log(`API Key: ${PINATA_API_KEY}`);
console.log(`API Secret: ${PINATA_API_SECRET?.substring(0, 20)}...`);
console.log(`JWT: ${PINATA_JWT?.substring(0, 50)}...`);
console.log('');

// Method 1: JWT Bearer Token
async function testJWT() {
    console.log('🧪 Test 1: JWT Bearer Token');
    try {
        const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ JWT SUCCESS:', data);
            return true;
        } else {
            const error = await response.text();
            console.log('❌ JWT Error:', response.status, error);
            return false;
        }
    } catch (error) {
        console.log('❌ JWT Exception:', error.message);
        return false;
    }
}

// Method 2: API Key + Secret in headers
async function testApiKeyHeaders() {
    console.log('\n🧪 Test 2: API Key + Secret in headers');
    try {
        const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
            method: 'GET',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_API_SECRET,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API KEY SUCCESS:', data);
            return true;
        } else {
            const error = await response.text();
            console.log('❌ API Key Error:', response.status, error);
            return false;
        }
    } catch (error) {
        console.log('❌ API Key Exception:', error.message);
        return false;
    }
}

// Method 3: Upload test with JWT
async function testUploadJWT() {
    console.log('\n🧪 Test 3: Upload test with JWT');
    try {
        const formData = new FormData();
        const testContent = Buffer.from('Hello Pinata!');
        
        formData.append('file', testContent, {
            filename: 'test.txt',
            contentType: 'text/plain'
        });

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ JWT UPLOAD SUCCESS:', data.IpfsHash);
            return true;
        } else {
            const error = await response.text();
            console.log('❌ JWT Upload Error:', response.status, error);
            return false;
        }
    } catch (error) {
        console.log('❌ JWT Upload Exception:', error.message);
        return false;
    }
}

// Method 4: Upload test with API Key + Secret
async function testUploadApiKey() {
    console.log('\n🧪 Test 4: Upload test with API Key + Secret');
    try {
        const formData = new FormData();
        const testContent = Buffer.from('Hello Pinata with API Key!');
        
        formData.append('file', testContent, {
            filename: 'test-api.txt',
            contentType: 'text/plain'
        });

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_API_SECRET,
                ...formData.getHeaders()
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API KEY UPLOAD SUCCESS:', data.IpfsHash);
            return true;
        } else {
            const error = await response.text();
            console.log('❌ API Key Upload Error:', response.status, error);
            return false;
        }
    } catch (error) {
        console.log('❌ API Key Upload Exception:', error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    const jwtAuth = await testJWT();
    const apiKeyAuth = await testApiKeyHeaders();
    const jwtUpload = await testUploadJWT();
    const apiKeyUpload = await testUploadApiKey();

    console.log('\n📊 Summary:');
    console.log(`JWT Auth: ${jwtAuth ? '✅' : '❌'}`);
    console.log(`API Key Auth: ${apiKeyAuth ? '✅' : '❌'}`);
    console.log(`JWT Upload: ${jwtUpload ? '✅' : '❌'}`);
    console.log(`API Key Upload: ${apiKeyUpload ? '✅' : '❌'}`);

    if (jwtAuth || jwtUpload) {
        console.log('\n🎉 JWT authentication is working! Use JWT Bearer token method.');
    } else if (apiKeyAuth || apiKeyUpload) {
        console.log('\n🎉 API Key authentication is working! Use API Key + Secret method.');
    } else {
        console.log('\n❌ No authentication method worked. Check your credentials.');
    }
}

runAllTests();