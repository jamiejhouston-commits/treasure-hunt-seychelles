const Database = require('better-sqlite3');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

class WaterfallWitchSync {
    constructor() {
        this.dbPath = path.join(__dirname, 'data.db');
        this.db = new Database(this.dbPath);
        this.traitsFile = path.join(__dirname, '../scripts/data/waterfall_witch_traits.json');
        this.metadataFile = path.join(__dirname, '../scripts/data/waterfall_witch_metadata.json');
        this.imageDir = path.join(__dirname, '../scripts/assets/waterfall_edition');

        // Special edition configuration
        this.edition = {
            name: 'Sauzier Waterfalls Special Edition',
            description: 'Contemporary comic book art depicting the secret betrayal of pirates by the witch of Sauzier Waterfalls',
            startTokenId: 1001,
            endTokenId: 1150,
            totalSupply: 150,
            chapter: 'special_waterfall_witch',
            theme: 'Witch Cave Betrayal Story'
        };
    }

    async syncWaterfallWitchNFTs() {
        console.log('🧙‍♀️ Syncing Waterfall Witch Special Edition to database...');

        try {
            // Ensure database table exists
            this.createNFTsTable();

            // Load generated traits data
            if (!await fs.pathExists(this.traitsFile)) {
                throw new Error(`Traits file not found: ${this.traitsFile}. Generate art first with generateWaterfallWitchArt.js`);
            }

            const traitsData = await fs.readJson(this.traitsFile);
            console.log(`📊 Loading ${traitsData.length} Waterfall Witch NFTs...`);

            // Process each NFT
            const syncResults = {
                inserted: 0,
                updated: 0,
                skipped: 0,
                errors: 0
            };

            for (const nftData of traitsData) {
                try {
                    const result = await this.syncSingleNFT(nftData);
                    syncResults[result]++;

                    if ((syncResults.inserted + syncResults.updated) % 10 === 0) {
                        console.log(`   📋 Processed ${syncResults.inserted + syncResults.updated}/${traitsData.length} NFTs...`);
                    }
                } catch (error) {
                    console.error(`❌ Error syncing NFT #${nftData.tokenId}:`, error.message);
                    syncResults.errors++;
                }
            }

            console.log('\n✅ Waterfall Witch sync complete!');
            console.log(`📈 Results:`);
            console.log(`   • Inserted: ${syncResults.inserted}`);
            console.log(`   • Updated: ${syncResults.updated}`);
            console.log(`   • Skipped: ${syncResults.skipped}`);
            console.log(`   • Errors: ${syncResults.errors}`);

            // Update collection stats
            await this.updateCollectionStats();

            return syncResults;

        } catch (error) {
            console.error('💥 Waterfall Witch sync failed:', error);
            throw error;
        }
    }

    createNFTsTable() {
        // Create NFTs table if it doesn't exist
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS nfts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token_id TEXT UNIQUE NOT NULL,
                sequence INTEGER,
                name TEXT,
                description TEXT,
                image_url TEXT,
                image_uri TEXT,
                ipfs_image TEXT,
                metadata TEXT,
                rarity TEXT,
                chapter TEXT,
                theme TEXT,
                edition TEXT,
                status TEXT DEFAULT 'available',
                price REAL,
                currency TEXT DEFAULT 'XRP',
                owner_address TEXT,
                nft_token_id TEXT,
                txn_hash TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_special_edition BOOLEAN DEFAULT 0,
                treasure_hunt_data TEXT,
                story_fragment TEXT,
                character_data TEXT,
                scene_data TEXT,
                coordinates TEXT,
                is_treasure_location BOOLEAN DEFAULT 0
            )
        `);

        // Add special edition columns if they don't exist
        const addColumns = [
            'ALTER TABLE nfts ADD COLUMN is_special_edition BOOLEAN DEFAULT 0',
            'ALTER TABLE nfts ADD COLUMN treasure_hunt_data TEXT',
            'ALTER TABLE nfts ADD COLUMN story_fragment TEXT',
            'ALTER TABLE nfts ADD COLUMN character_data TEXT',
            'ALTER TABLE nfts ADD COLUMN scene_data TEXT',
            'ALTER TABLE nfts ADD COLUMN coordinates TEXT',
            'ALTER TABLE nfts ADD COLUMN is_treasure_location BOOLEAN DEFAULT 0'
        ];

        addColumns.forEach(sql => {
            try {
                this.db.exec(sql);
            } catch (error) {
                // Column probably already exists, ignore
            }
        });
    }

    async syncSingleNFT(nftData) {
        const {
            tokenId,
            edition,
            rarity,
            clue,
            characters,
            scene,
            artistic_elements,
            fileName,
            filePath
        } = nftData;

        // Check if NFT already exists
        const existing = this.db.prepare('SELECT id FROM nfts WHERE token_id = ?').get(tokenId.toString());

        // Prepare image URL (relative path for serving)
        const imageUrl = `/real/images/waterfall_edition/${fileName}`;

        // Create comprehensive metadata object
        const metadata = {
            name: `${this.edition.name} #${tokenId}`,
            description: this.generateNFTDescription(nftData),
            image: imageUrl,
            edition: edition,
            rarity: rarity,
            attributes: this.buildNFTAttributes(nftData),
            lore: this.generateNFTLore(nftData),
            technical: {
                generator: 'WaterfallWitchGenerator v1.0',
                art_style: 'contemporary_comic_realism',
                generation_date: new Date().toISOString()
            }
        };

        // Prepare database record
        const dbData = {
            token_id: tokenId.toString(),
            sequence: tokenId,
            name: metadata.name,
            description: metadata.description,
            image_url: imageUrl,
            image_uri: imageUrl,
            ipfs_image: null, // Will be updated after IPFS upload
            metadata: JSON.stringify(metadata),
            rarity: this.capitalizeRarity(rarity),
            chapter: 'special_waterfall_witch',
            theme: 'Witch Cave Betrayal Story',
            edition: this.edition.name,
            status: 'available',
            price: this.calculateNFTPrice(rarity),
            currency: 'XRP',
            is_special_edition: 1,
            treasure_hunt_data: JSON.stringify(clue),
            story_fragment: clue.story_fragment,
            character_data: JSON.stringify(characters),
            scene_data: JSON.stringify(scene),
            coordinates: clue.coordinates_encoded,
            is_treasure_location: clue.is_winning_card ? 1 : 0
        };

        if (existing) {
            // Update existing record
            const updateSql = `
                UPDATE nfts SET
                    name = ?, description = ?, image_url = ?, image_uri = ?, metadata = ?,
                    rarity = ?, chapter = ?, theme = ?, edition = ?, price = ?,
                    is_special_edition = ?, treasure_hunt_data = ?, story_fragment = ?,
                    character_data = ?, scene_data = ?, coordinates = ?, is_treasure_location = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE token_id = ?
            `;

            this.db.prepare(updateSql).run(
                dbData.name, dbData.description, dbData.image_url, dbData.image_uri,
                dbData.metadata, dbData.rarity, dbData.chapter, dbData.theme,
                dbData.edition, dbData.price, dbData.is_special_edition,
                dbData.treasure_hunt_data, dbData.story_fragment, dbData.character_data,
                dbData.scene_data, dbData.coordinates, dbData.is_treasure_location,
                dbData.token_id
            );

            return 'updated';
        } else {
            // Insert new record
            const insertSql = `
                INSERT INTO nfts (
                    token_id, sequence, name, description, image_url, image_uri,
                    metadata, rarity, chapter, theme, edition, status, price, currency,
                    is_special_edition, treasure_hunt_data, story_fragment,
                    character_data, scene_data, coordinates, is_treasure_location
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            this.db.prepare(insertSql).run(
                dbData.token_id, dbData.sequence, dbData.name, dbData.description,
                dbData.image_url, dbData.image_uri, dbData.metadata, dbData.rarity,
                dbData.chapter, dbData.theme, dbData.edition, dbData.status,
                dbData.price, dbData.currency, dbData.is_special_edition,
                dbData.treasure_hunt_data, dbData.story_fragment, dbData.character_data,
                dbData.scene_data, dbData.coordinates, dbData.is_treasure_location
            );

            return 'inserted';
        }
    }

    generateNFTDescription(nftData) {
        const { characters, scene, clue } = nftData;

        const sceneDescriptions = {
            'cave_negotiation': `Deep within the mystical cave behind Sauzier Waterfalls, a ${characters.witch.type.replace(/_/g, ' ')} conducts dark business with a ${characters.pirate.type.replace(/_/g, ' ')}. The pirate seeks magical protection for their treasure, unaware of the witch's true intentions.`,

            'waterfall_approach': `At the breathtaking Sauzier Waterfalls on Mahé Island, a ${characters.pirate.type.replace(/_/g, ' ')} cautiously approaches the legendary ${characters.witch.type.replace(/_/g, ' ')} who dwells in the hidden cave behind the cascading waters.`,

            'secret_theft': `In the shadows of her cave, the cunning ${characters.witch.type.replace(/_/g, ' ')} betrays the trust of sleeping pirates, secretly pilfering their precious coins and jewels to add to her growing hoard.`,

            'church_stashing': `Under cover of darkness near Port Launay Church, the ${characters.witch.type.replace(/_/g, ' ')} buries her stolen pirate treasure, creating a cache that would remain hidden for centuries.`,

            'spell_casting': `At the sacred pool beneath Sauzier Waterfalls, the powerful ${characters.witch.type.replace(/_/g, ' ')} weaves protective enchantments while a ${characters.pirate.type.replace(/_/g, ' ')} watches in fearful reverence.`
        };

        let baseDescription = sceneDescriptions[scene.type] || 'A mystical encounter between witch and pirate at the legendary Sauzier Waterfalls.';

        if (clue.is_winning_card) {
            baseDescription += '\n\n🏆 SPECIAL TREASURE LOCATION CARD: This NFT contains real coordinates and clues leading to an actual treasure cache hidden behind Port Launay Church on Mahé Island, Seychelles.';
        }

        baseDescription += '\n\n🎨 Rendered in contemporary comic book style with realistic character proportions and detailed environmental storytelling.';

        return baseDescription;
    }

    buildNFTAttributes(nftData) {
        const { characters, scene, artistic_elements, rarity, clue } = nftData;

        return [
            { trait_type: 'Rarity', value: this.capitalizeRarity(rarity) },
            { trait_type: 'Edition', value: 'Sauzier Waterfalls Special' },
            { trait_type: 'Witch Type', value: this.formatTraitValue(characters.witch.type) },
            { trait_type: 'Witch Age', value: this.formatTraitValue(characters.witch.age) },
            { trait_type: 'Pirate Type', value: this.formatTraitValue(characters.pirate.type) },
            { trait_type: 'Pirate Age', value: this.formatTraitValue(characters.pirate.age) },
            { trait_type: 'Scene Type', value: this.formatTraitValue(scene.type) },
            { trait_type: 'Setting', value: this.formatTraitValue(scene.setting) },
            { trait_type: 'Art Style', value: 'Contemporary Comic Realism' },
            { trait_type: 'Detail Level', value: this.formatTraitValue(artistic_elements.detail_level) },
            ...(clue.is_winning_card ? [{ trait_type: 'Treasure Status', value: '🏆 Real Treasure Location' }] : []),
            { trait_type: 'Story Fragment', value: clue.story_fragment ? 'Present' : 'None' }
        ];
    }

    generateNFTLore(nftData) {
        const { characters, scene, clue } = nftData;

        let lore = `The ${characters.witch.type.replace(/_/g, ' ')} of Sauzier Waterfalls was known throughout the islands for her powerful protective magic. Pirates would journey from across the Indian Ocean to seek her enchantments, bringing chests of gold and precious gems as payment. What they didn't know was that for every spell cast, she would secretly take a portion of their treasure, coin by coin, jewel by jewel.`;

        if (clue.is_winning_card) {
            lore += '\n\n🗝️ This NFT holds the key to finding the witch\'s actual treasure cache. The visual clues within the artwork, combined with the encoded coordinates, lead to a real treasure hidden on Mahé Island.';
        }

        return lore;
    }

    formatTraitValue(value) {
        return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    capitalizeRarity(rarity) {
        return rarity.charAt(0).toUpperCase() + rarity.slice(1);
    }

    calculateNFTPrice(rarity) {
        // Premium pricing for special edition
        const basePrices = {
            'rare': 500,      // 500 XRP
            'epic': 750,      // 750 XRP
            'legendary': 1200 // 1200 XRP (treasure location cards)
        };

        return basePrices[rarity] || 400;
    }

    async updateCollectionStats() {
        console.log('📊 Updating collection statistics...');

        // Create or update collection stats table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS collection_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stat_name TEXT UNIQUE NOT NULL,
                stat_value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Calculate stats for Waterfall Witch edition
        const stats = this.db.prepare(`
            SELECT
                COUNT(*) as total_count,
                COUNT(CASE WHEN rarity = 'Rare' THEN 1 END) as rare_count,
                COUNT(CASE WHEN rarity = 'Epic' THEN 1 END) as epic_count,
                COUNT(CASE WHEN rarity = 'Legendary' THEN 1 END) as legendary_count,
                COUNT(CASE WHEN is_treasure_location = 1 THEN 1 END) as treasure_location_count
            FROM nfts WHERE chapter = 'special_waterfall_witch'
        `).get();

        // Update stats
        const updateStat = this.db.prepare(`
            INSERT OR REPLACE INTO collection_stats (stat_name, stat_value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
        `);

        updateStat.run('waterfall_witch_total', stats.total_count.toString());
        updateStat.run('waterfall_witch_rare', stats.rare_count.toString());
        updateStat.run('waterfall_witch_epic', stats.epic_count.toString());
        updateStat.run('waterfall_witch_legendary', stats.legendary_count.toString());
        updateStat.run('waterfall_witch_treasure_cards', stats.treasure_location_count.toString());
        updateStat.run('waterfall_witch_last_sync', new Date().toISOString());

        console.log(`   ✅ Collection stats updated:`);
        console.log(`      • Total Waterfall Witch NFTs: ${stats.total_count}`);
        console.log(`      • Rare: ${stats.rare_count}`);
        console.log(`      • Epic: ${stats.epic_count}`);
        console.log(`      • Legendary: ${stats.legendary_count}`);
        console.log(`      • Treasure Location Cards: ${stats.treasure_location_count}`);
    }

    async ensureImageDirectory() {
        // Ensure waterfall edition images are accessible to the server
        const serverImagePath = path.join(__dirname, '../scripts/dist/images/waterfall_edition');

        if (!await fs.pathExists(serverImagePath)) {
            await fs.ensureDir(path.dirname(serverImagePath));

            if (await fs.pathExists(this.imageDir)) {
                // Copy images to server directory
                await fs.copy(this.imageDir, serverImagePath);
                console.log('📁 Copied Waterfall Witch images to server directory');
            } else {
                console.warn('⚠️  Waterfall Witch image directory not found, images may not display correctly');
            }
        }
    }

    async getCollectionSummary() {
        const summary = this.db.prepare(`
            SELECT
                rarity,
                COUNT(*) as count,
                AVG(price) as avg_price,
                COUNT(CASE WHEN is_treasure_location = 1 THEN 1 END) as treasure_cards
            FROM nfts
            WHERE chapter = 'special_waterfall_witch'
            GROUP BY rarity
            ORDER BY
                CASE rarity
                    WHEN 'Legendary' THEN 3
                    WHEN 'Epic' THEN 2
                    WHEN 'Rare' THEN 1
                    ELSE 0
                END DESC
        `).all();

        return summary;
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

// Main execution function
async function main() {
    const sync = new WaterfallWitchSync();

    try {
        console.log('🧙‍♀️ Starting Waterfall Witch Special Edition Database Sync...');
        console.log('🎨 Contemporary comic book art with real treasure hunt integration\n');

        // Ensure image directory is set up for server
        await sync.ensureImageDirectory();

        // Sync NFTs to database
        const results = await sync.syncWaterfallWitchNFTs();

        // Display collection summary
        console.log('\n📋 Collection Summary:');
        const summary = await sync.getCollectionSummary();
        summary.forEach(item => {
            console.log(`   ${item.rarity}: ${item.count} NFTs, Avg Price: ${item.avg_price.toFixed(0)} XRP${item.treasure_cards > 0 ? ` (${item.treasure_cards} treasure location cards)` : ''}`);
        });

        console.log('\n🎉 Waterfall Witch Special Edition is now available in the app gallery!');
        console.log('🏴‍☠️ Users can browse, filter, and discover the witch\'s betrayal story');
        console.log('🗝️  Treasure hunters can search for the legendary location cards');

        return results;

    } catch (error) {
        console.error('💥 Database sync failed:', error);
        process.exit(1);
    } finally {
        sync.close();
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = WaterfallWitchSync;