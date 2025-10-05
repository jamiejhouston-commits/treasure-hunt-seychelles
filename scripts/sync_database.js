import fetch from 'node-fetch';

async function syncDatabase() {
  console.log('🔄 Syncing minted NFT data to database...');
  
  try {
    const response = await fetch('http://localhost:3001/api/admin/sync-nfts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Database sync successful!');
      console.log('📊 Sync results:', result);
      return result;
    } else {
      const error = await response.text();
      console.log('❌ Database sync failed:', response.status, error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error during sync:', error.message);
    return null;
  }
}

syncDatabase();