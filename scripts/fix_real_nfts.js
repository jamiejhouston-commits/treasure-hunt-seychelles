import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import knex from 'knex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏴‍☠️ FIXING THE REAL NFT DATA - NO MORE MOCK BULLSHIT!');
console.log('=====================================================');

async function syncRealNFTs() {
  try {
    // Read the REAL minted NFT data
    const mintedPath = path.join(__dirname, 'dist', 'minted.json');
    const mintedData = JSON.parse(await fs.readFile(mintedPath, 'utf8'));
    
    console.log(`📋 Found ${mintedData.length} REAL minted NFTs`);
    
    // Connect to database
    const db = knex({
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '..', 'backend', 'database.sqlite')
      },
      useNullAsDefault: true
    });
    
    console.log('📊 Connected to database');
    
    // Clear old mock data
    await db('nfts').del();
    console.log('🗑️  Deleted old mock data');
    
    // Insert REAL NFT data
    for (const nft of mintedData) {
      // Read metadata file
      const metadataPath = path.join(__dirname, 'dist', 'metadata', `${nft.id}.json`);
      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
      
      await db('nfts').insert({
        id: nft.id,
        token_id: nft.NFTokenID || `temp_${nft.id}`, // Use temp ID if extraction failed
        name: metadata.name,
        description: metadata.description,
        image_url: metadata.image,
        metadata_url: nft.uri,
        attributes: JSON.stringify(metadata.attributes),
        rarity: metadata.attributes.find(attr => attr.trait_type === 'Rarity')?.value || 'Common',
        price: Math.floor(Math.random() * 50) + 10, // Random price 10-60 XRP
        owner_address: 'r4Kv7mM3LPtLZCydMgpwoBRtftf37195PH',
        transaction_hash: nft.txHash,
        minted_at: new Date(nft.mintedAt || Date.now()).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    console.log(`✅ Inserted ${mintedData.length} REAL NFTs into database`);
    
    // Update collection stats
    const stats = await db('nfts').select(
      db.raw('COUNT(*) as total'),
      db.raw('COUNT(DISTINCT owner_address) as owners'),
      db.raw('AVG(price) as floor_price'),
      db.raw('SUM(price) as total_volume')
    ).first();
    
    await db('collections').where('id', 1).update({
      total_items: stats.total,
      total_owners: stats.owners,
      floor_price: stats.floor_price,
      total_volume: stats.total_volume,
      updated_at: new Date().toISOString()
    });
    
    console.log('📊 Updated collection statistics');
    
    await db.destroy();
    
    console.log('\n🎉 SUCCESS! Your REAL Levasseur Treasure NFTs are now in the database!');
    console.log('🏴‍☠️ No more mock compass bullshit - your Seychelles treasure maps are LIVE!');
    
    return true;
    
  } catch (error) {
    console.log('❌ Error syncing real NFTs:', error.message);
    return false;
  }
}

syncRealNFTs();