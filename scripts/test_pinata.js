import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const PINATA_JWT = process.env.PINATA_JWT;

console.log('Testing Pinata JWT:', PINATA_JWT);
console.log('Token length:', PINATA_JWT.length);

async function testAuth() {
    // Test 1: As JWT Bearer token
    console.log('\n--- Testing as JWT Bearer token ---');
    try {
        const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ JWT Success:', response.status);
        console.log('Response:', response.data);
        return;
    } catch (error) {
        console.log('❌ JWT Error:', error.response?.status);
        console.log('JWT Error data:', error.response?.data);
    }

    // Test 2: As API Key in headers
    console.log('\n--- Testing as API Key ---');
    try {
        const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
            headers: {
                'pinata_api_key': PINATA_JWT,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ API Key Success:', response.status);
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ API Key Error:', error.response?.status);
        console.log('API Key Error data:', error.response?.data);
    }
}

testAuth();