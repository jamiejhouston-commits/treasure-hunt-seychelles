const axios = require('axios');
require('dotenv').config({ path: './.env' });

const PINATA_JWT = process.env.PINATA_JWT;
console.log('🔑 Testing Pinata JWT...');
console.log('Token length:', PINATA_JWT?.length || 'UNDEFINED');

if (!PINATA_JWT) {
  console.log('❌ PINATA_JWT not found');
  process.exit(1);
}

axios.get('https://api.pinata.cloud/data/testAuthentication', {
  headers: { 'Authorization': `Bearer ${PINATA_JWT}` }
}).then(response => {
  console.log('✅ Pinata authentication successful');
  console.log('Response:', JSON.stringify(response.data, null, 2));
}).catch(error => {
  console.log('❌ Authentication failed');
  console.log('Status:', error.response?.status);
  console.log('Error:', error.response?.data || error.message);
});