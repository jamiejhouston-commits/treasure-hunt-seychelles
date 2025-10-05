const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Updating layer URLs to local...\n');

const baseUrl = 'http://localhost:3001';

db.serialize(() => {
    db.all('SELECT id, token_id, name, layers, puzzle_enabled FROM nfts WHERE chapter = ?', ['Chapter 1'], (err, rows) => {
        if (err) {
            console.error('❌ Error:', err);
            db.close();
            return;
        }
        
        const stmt = db.prepare('UPDATE nfts SET layers = ? WHERE id = ?');
        
        rows.forEach(nft => {
            if (!nft.layers) return;
            
            try {
                const layers = JSON.parse(nft.layers);
                
                // Update IPFS URLs to local URLs
                const updatedLayers = layers.map(layer => {
                    if (layer.ipfs_hash && layer.type !== 'base_artwork') {
                        const layerNum = layer.layer;
                        return {
                            ...layer,
                            url: `${baseUrl}/treasure_hunt/chapter1/layers/puzzle_layer_${layerNum}.png`
                        };
                    }
                    return layer;
                });
                
                const updatedLayersJson = JSON.stringify(updatedLayers);
                
                stmt.run(updatedLayersJson, nft.id, (err) => {
                    if (err) {
                        console.error(`❌ Error updating ${nft.name}:`, err);
                    } else {
                        if (nft.puzzle_enabled) {
                            console.log(`✅ ${nft.name} - Updated puzzle layers`);
                        }
                    }
                });
                
            } catch (e) {
                console.error(`❌ Error parsing layers for ${nft.name}:`, e);
            }
        });
        
        stmt.finalize(() => {
            console.log('\n✅ Layer URLs updated to local server\n');
            db.close();
        });
    });
});
