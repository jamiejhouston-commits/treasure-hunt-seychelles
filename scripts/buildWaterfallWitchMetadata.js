import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

class WaterfallWitchMetadataBuilder {
    constructor() {
        this.traitsFile = './data/waterfall_witch_traits.json';
        this.outputFile = './data/waterfall_witch_metadata.json';
        this.ipfsBaseUrl = process.env.IPFS_BASE_URL || 'https://gateway.pinata.cloud/ipfs/';
        this.collectionName = 'The Levasseur Treasure: Sauzier Waterfalls Special Edition';
        this.collectionDescription = 'Contemporary comic book art depicting the secret betrayal of pirates by the witch of Sauzier Waterfalls. Some NFTs contain real treasure location coordinates for Port Launay Church, Mahé Island.';

        // XRPL XLS-20 royalty settings
        this.royaltyRate = 0.05; // 5% royalties
        this.royaltyAddress = process.env.ROYALTY_WALLET_ADDRESS;
    }

    async buildAllMetadata() {
        console.log('🏗️  Building Waterfall Witch Special Edition Metadata...');

        // Load generated traits
        if (!await fs.pathExists(this.traitsFile)) {
            throw new Error(`Traits file not found: ${this.traitsFile}. Run generateWaterfallWitchArt.js first.`);
        }

        const traitsData = await fs.readJson(this.traitsFile);
        console.log(`📊 Loaded ${traitsData.length} NFT traits`);

        const metadata = [];
        const rarityStats = { rare: 0, epic: 0, legendary: 0, treasure_cards: 0 };

        for (const traits of traitsData) {
            const nftMetadata = this.buildSingleNFTMetadata(traits);
            metadata.push(nftMetadata);

            rarityStats[traits.rarity]++;
            if (traits.clue.is_winning_card) {
                rarityStats.treasure_cards++;
            }
        }

        // Save metadata
        await fs.writeJson(this.outputFile, metadata, { spaces: 2 });

        console.log(`✅ Generated metadata for ${metadata.length} NFTs`);
        console.log(`📋 Saved to: ${this.outputFile}`);
        console.log(`\n📈 Rarity Distribution:`);
        console.log(`   Rare: ${rarityStats.rare}`);
        console.log(`   Epic: ${rarityStats.epic}`);
        console.log(`   Legendary: ${rarityStats.legendary}`);
        console.log(`   🏆 Treasure Location Cards: ${rarityStats.treasure_cards}`);

        return metadata;
    }

    buildSingleNFTMetadata(traits) {
        const {
            tokenId,
            edition,
            rarity,
            clue,
            characters,
            scene,
            artistic_elements,
            fileName
        } = traits;

        // Build XLS-20 compliant metadata
        const metadata = {
            // Standard NFT metadata
            name: `${this.collectionName} #${tokenId}`,
            description: this.generateDescription(traits),
            image: `${this.ipfsBaseUrl}{CID}/${fileName}`, // Will be replaced with actual IPFS CID
            external_url: `https://treasureofseychelles.com/nft/${tokenId}`,

            // Collection information
            collection: {
                name: this.collectionName,
                family: 'Levasseur Treasure Hunt',
                edition: edition,
                total_supply: 150
            },

            // XLS-20 specific fields
            schema: 'ipfs://bafkreiha4w6f3p5yhmppq2gvyfwl7txn5z7xsw7r7ikzl5vvzz7mskp6oi', // XLS-20 schema
            taxon: this.calculateTaxon(tokenId),

            // XRPL royalty enforcement
            royalty: {
                rate: this.royaltyRate,
                recipient: this.royaltyAddress
            },

            // Detailed attributes for marketplaces and filtering
            attributes: this.buildAttributes(traits),

            // Story and lore
            lore: this.generateLore(traits),

            // Treasure hunt data (encoded for security)
            treasure_hunt: this.buildTreasureHuntData(clue, rarity),

            // Technical metadata
            technical: {
                generator: 'WaterfallWitchGenerator v1.0',
                canvas_size: '2048x2048',
                art_style: 'contemporary_comic_realism',
                generation_date: new Date().toISOString(),
                rarity_score: this.calculateRarityScore(traits)
            }
        };

        return metadata;
    }

    generateDescription(traits) {
        const { characters, scene, clue } = traits;

        const sceneDescriptions = {
            'cave_negotiation': `Deep within the mystical cave behind Sauzier Waterfalls, a ${characters.witch.type.replace('_', ' ')} conducts dark business with a ${characters.pirate.type.replace('_', ' ')}. The pirate seeks magical protection for their treasure, unaware of the witch's true intentions.`,

            'waterfall_approach': `At the breathtaking Sauzier Waterfalls on Mahé Island, a ${characters.pirate.type.replace('_', ' ')} cautiously approaches the legendary ${characters.witch.type.replace('_', ' ')} who dwells in the hidden cave behind the cascading waters.`,

            'secret_theft': `In the shadows of her cave, the cunning ${characters.witch.type.replace('_', ' ')} betrays the trust of sleeping pirates, secretly pilfering their precious coins and jewels to add to her growing hoard.`,

            'church_stashing': `Under cover of darkness near Port Launay Church, the ${characters.witch.type.replace('_', ' ')} buries her stolen pirate treasure, creating a cache that would remain hidden for centuries.`,

            'spell_casting': `At the sacred pool beneath Sauzier Waterfalls, the powerful ${characters.witch.type.replace('_', ' ')} weaves protective enchantments while a ${characters.pirate.type.replace('_', ' ')} watches in fearful reverence.`
        };

        let baseDescription = sceneDescriptions[scene.type] || 'A mystical encounter between witch and pirate at the legendary Sauzier Waterfalls.';

        if (clue.is_winning_card) {
            baseDescription += '\n\n🏆 SPECIAL TREASURE LOCATION CARD: This NFT contains real coordinates and clues leading to an actual treasure cache hidden behind Port Launay Church on Mahé Island, Seychelles.';
        }

        baseDescription += `\n\n🎨 Rendered in contemporary comic book style with realistic character proportions and detailed environmental storytelling. Part of the exclusive Sauzier Waterfalls Special Edition collection.`;

        return baseDescription;
    }

    buildAttributes(traits) {
        const { characters, scene, artistic_elements, rarity, clue } = traits;

        return [
            // Core rarity
            {
                trait_type: 'Rarity',
                value: rarity.charAt(0).toUpperCase() + rarity.slice(1)
            },
            {
                trait_type: 'Edition',
                value: 'Sauzier Waterfalls Special'
            },

            // Character attributes
            {
                trait_type: 'Witch Type',
                value: characters.witch.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Witch Age',
                value: characters.witch.age.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Witch Magical Aura',
                value: characters.witch.magical_aura.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Pirate Type',
                value: characters.pirate.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Pirate Age',
                value: characters.pirate.age.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Pirate Build',
                value: characters.pirate.build.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },

            // Scene attributes
            {
                trait_type: 'Scene Type',
                value: scene.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Setting',
                value: scene.setting.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Interaction',
                value: scene.interaction.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Lighting',
                value: scene.lighting.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },

            // Artistic attributes
            {
                trait_type: 'Art Style',
                value: 'Contemporary Comic Realism'
            },
            {
                trait_type: 'Detail Level',
                value: artistic_elements.detail_level.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Composition',
                value: artistic_elements.composition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },

            // Facial features (for character uniqueness)
            {
                trait_type: 'Witch Eye Color',
                value: characters.witch.facial_features.eye_color.charAt(0).toUpperCase() + characters.witch.facial_features.eye_color.slice(1)
            },
            {
                trait_type: 'Witch Face Shape',
                value: characters.witch.facial_features.face_shape.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Pirate Eye Color',
                value: characters.pirate.facial_features.eye_color.charAt(0).toUpperCase() + characters.pirate.facial_features.eye_color.slice(1)
            },
            {
                trait_type: 'Pirate Face Shape',
                value: characters.pirate.facial_features.face_shape.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },

            // Environmental details
            {
                trait_type: 'Weather',
                value: scene.atmosphere.weather.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },
            {
                trait_type: 'Visibility',
                value: scene.atmosphere.visibility.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            },

            // Special attributes
            ...(rarity === 'legendary' ? [{
                trait_type: 'Special Feature',
                value: 'Mystical Environment Effects'
            }] : []),

            ...(clue.is_winning_card ? [{
                trait_type: 'Treasure Status',
                value: '🏆 Real Treasure Location'
            }] : []),

            // Distinctive features count
            {
                trait_type: 'Witch Distinctive Features',
                value: characters.witch.facial_features.distinctive_features.length.toString()
            },
            {
                trait_type: 'Pirate Distinctive Features',
                value: characters.pirate.facial_features.distinctive_features.length.toString()
            }
        ];
    }

    generateLore(traits) {
        const { characters, scene, clue } = traits;

        const loreFragments = [
            `The ${characters.witch.type.replace('_', ' ')} of Sauzier Waterfalls was known throughout the islands for her powerful protective magic.`,

            `Pirates would journey from across the Indian Ocean to seek her enchantments, bringing chests of gold and precious gems as payment.`,

            `What they didn't know was that for every spell cast, she would secretly take a portion of their treasure, coin by coin, jewel by jewel.`,

            `Over the years, her hidden cache grew enormous, buried in a secret location behind the sacred grounds of Port Launay Church.`,

            `The ${characters.pirate.type.replace('_', ' ')} in this scene ${this.getSceneLore(scene.type, characters)}`
        ];

        let lore = loreFragments.join(' ');

        if (clue.is_winning_card) {
            lore += '\n\n🗝️ This NFT holds the key to finding the witch\'s actual treasure cache. The visual clues within the artwork, combined with the encoded coordinates, lead to a real treasure hidden on Mahé Island.';
        }

        return lore;
    }

    getSceneLore(sceneType, characters) {
        const sceneLore = {
            'cave_negotiation': `kneels before the witch, desperately offering payment for a protection spell, unaware that their trust is misplaced.`,

            'waterfall_approach': `approaches the mystical cave with both hope and trepidation, having heard whispers of the witch's power across the seven seas.`,

            'secret_theft': `sleeps peacefully, trusting in the witch's hospitality while she silently plunders their treasure chest.`,

            'church_stashing': `is nowhere to be seen as the witch conducts her secret midnight burial of stolen pirate gold.`,

            'spell_casting': `watches in awe as mystical energies swirl around the sacred waterfall pool, witnessing magic few mortals ever see.`
        };

        return sceneLore[sceneType] || 'participates in this legendary encounter that would become part of Seychelles folklore.';
    }

    buildTreasureHuntData(clue, rarity) {
        // Encode treasure hunt information securely
        const huntData = {
            clue_type: clue.type,
            cipher: clue.cipher,
            story_fragment: clue.story_fragment,
            encoded_coordinates: clue.coordinates_encoded,
            verification_hash: crypto.createHash('sha256')
                .update(`${clue.cipher}-${process.env.MASTER_CIPHER_KEY}`)
                .digest('hex')
                .substring(0, 16)
        };

        // Only include actual treasure location data for winning cards
        if (clue.is_winning_card) {
            huntData.treasure_status = 'LOCATION_CARD';
            huntData.location_hint = clue.location_hint;
            huntData.verification_elements = clue.verification_elements;
            huntData.prize_value = 'Real treasure cache at Port Launay Church, Mahé Island';
        } else {
            huntData.treasure_status = 'STORY_FRAGMENT';
            huntData.location_hint = clue.location_hint;
        }

        return huntData;
    }

    calculateTaxon(tokenId) {
        // XRPL taxon for organizing NFT collections
        // Waterfall Witch special edition gets its own taxon range
        return 2000 + (tokenId - 1001); // Starts at taxon 2000
    }

    calculateRarityScore(traits) {
        let score = 0;

        // Base rarity scores
        const rarityScores = { rare: 100, epic: 300, legendary: 1000 };
        score += rarityScores[traits.rarity] || 0;

        // Character uniqueness bonus
        score += traits.characters.witch.facial_features.distinctive_features.length * 50;
        score += traits.characters.pirate.facial_features.distinctive_features.length * 50;

        // Scene complexity bonus
        if (traits.scene.type === 'secret_theft' || traits.scene.type === 'church_stashing') {
            score += 200; // Story significance
        }

        // Art detail bonus
        const detailScores = { detailed: 0, highly_detailed: 100, masterpiece: 300 };
        score += detailScores[traits.artistic_elements.detail_level] || 0;

        // Treasure card bonus
        if (traits.clue.is_winning_card) {
            score += 5000; // Massive bonus for real treasure location
        }

        return score;
    }

    // Validate metadata against XLS-20 standard
    validateMetadata(metadata) {
        const requiredFields = ['name', 'description', 'image', 'schema', 'taxon'];
        const errors = [];

        metadata.forEach((nft, index) => {
            requiredFields.forEach(field => {
                if (!nft[field]) {
                    errors.push(`NFT ${index}: Missing required field '${field}'`);
                }
            });

            // Validate image URL format
            if (nft.image && !nft.image.includes('{CID}')) {
                errors.push(`NFT ${index}: Image URL missing {CID} placeholder`);
            }

            // Validate attributes structure
            if (!Array.isArray(nft.attributes)) {
                errors.push(`NFT ${index}: Attributes must be an array`);
            }

            // Validate royalty structure
            if (nft.royalty && (!nft.royalty.rate || !nft.royalty.recipient)) {
                errors.push(`NFT ${index}: Invalid royalty structure`);
            }
        });

        if (errors.length > 0) {
            console.error('❌ Metadata validation errors:');
            errors.forEach(error => console.error(`   ${error}`));
            throw new Error('Metadata validation failed');
        }

        console.log('✅ Metadata validation passed');
        return true;
    }

    // Generate collection summary
    generateCollectionSummary(metadata) {
        const summary = {
            name: this.collectionName,
            total_supply: metadata.length,
            description: this.collectionDescription,
            art_style: 'Contemporary Comic Book Realism',
            theme: 'Sauzier Waterfalls Witch Betrayal Story',

            rarity_distribution: {
                rare: metadata.filter(nft => nft.technical.rarity_score < 300).length,
                epic: metadata.filter(nft => nft.technical.rarity_score >= 300 && nft.technical.rarity_score < 1000).length,
                legendary: metadata.filter(nft => nft.technical.rarity_score >= 1000).length
            },

            treasure_cards: metadata.filter(nft => nft.treasure_hunt.treasure_status === 'LOCATION_CARD').length,

            unique_traits: {
                witch_types: [...new Set(metadata.map(nft =>
                    nft.attributes.find(attr => attr.trait_type === 'Witch Type')?.value
                ))].length,
                pirate_types: [...new Set(metadata.map(nft =>
                    nft.attributes.find(attr => attr.trait_type === 'Pirate Type')?.value
                ))].length,
                scene_types: [...new Set(metadata.map(nft =>
                    nft.attributes.find(attr => attr.trait_type === 'Scene Type')?.value
                ))].length
            },

            special_features: [
                'Real treasure hunt with actual prize location',
                'Professional comic book art style',
                'Realistic character proportions and facial features',
                'Detailed Seychelles environment artwork',
                'Interactive storytelling through visual narrative',
                'XLS-20 compliant with built-in royalties'
            ],

            generation_date: new Date().toISOString()
        };

        return summary;
    }
}

// Main execution
async function main() {
    try {
        const builder = new WaterfallWitchMetadataBuilder();

        console.log('🏗️  Starting Waterfall Witch metadata generation...');
        const metadata = await builder.buildAllMetadata();

        // Validate metadata
        builder.validateMetadata(metadata);

        // Generate collection summary
        const summary = builder.generateCollectionSummary(metadata);
        await fs.writeJson('./data/waterfall_witch_collection_summary.json', summary, { spaces: 2 });

        console.log('\n✅ Waterfall Witch metadata generation complete!');
        console.log(`📋 Generated ${metadata.length} XLS-20 compliant metadata entries`);
        console.log(`📊 Collection summary saved to: ./data/waterfall_witch_collection_summary.json`);
        console.log('\n🏴‍☠️ Ready for IPFS upload and XRPL minting!');

    } catch (error) {
        console.error('💥 Waterfall Witch metadata generation failed:', error);
        process.exit(1);
    }
}

// ES module check for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default WaterfallWitchMetadataBuilder;