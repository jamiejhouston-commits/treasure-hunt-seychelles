import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  const token = (process.env.NFT_STORAGE_TOKEN || '').trim();
  
  console.log('=== NFT_STORAGE_TOKEN Verification ===');
  console.log('Length:', token.length);
  console.log('Dots count:', (token.match(/\./g) || []).length);
  console.log('Token:', token);
  
  console.log('\n=== Testing /user endpoint ===');
  try {
    const resp = await fetch('https://api.nft.storage/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Status:', resp.status, resp.statusText);
    const body = await resp.text();
    console.log('Raw JSON:', body);
    
    if (resp.ok) {
      const json = JSON.parse(body);
      console.log('✅ Token valid for user:', json?.user?.email || json?.user?.name || 'Unknown');
    } else {
      console.log('❌ Token rejected by server');
    }
  } catch (e) {
    console.error('❌ Request failed:', e.message);
  }
}

main().catch(console.error);