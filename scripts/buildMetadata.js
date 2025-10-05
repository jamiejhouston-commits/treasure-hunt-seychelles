const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

class MetadataBuilder {
    constructor() {
        this.collectionName = process.env.COLLECTION_NAME || "Treasure of Seychelles";
        this.collectionSymbol = process.env.COLLECTION_SYMBOL || "TOS";
        this.royaltyPercentage = parseInt(process.env.ROYALTY_PERCENTAGE) || 500; // 5%
        this.issuerAccount = process.env.XRPL_ISSUER_ACCOUNT;
        this.baseUri = "https://treasureofseychelles.com/fragment/";
        
        this.metadataDir = './data/metadata';
        this.outputFile = './data/complete_metadata.json';
    }

    // Build metadata following XLS-20 standard from Prompt 1
    buildNFTMetadata(nftData, ipfsImageHash, ipfsMetadataHash = null) {
        const { tokenId, chapter, island, rarity, clue, attributes, fileName } = nftData;
        
        const metadata = {
            schema: "ipfs://QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51",
            nftokenID: null, // Will be populated after minting
            name: `Fragment #${tokenId.toString().padStart(3, '0')} – ${this.getFragmentTitle(chapter, rarity)}`,
            description: this.generateDescription(tokenId, chapter, island, clue, rarity),
            image: `ipfs://${ipfsImageHash}`,
            external_url: `${this.baseUri}${tokenId}`,
            attributes: this.buildAttributes(nftData),
            properties: {
                clue_type: clue.type,
                clue_data: {
                    cipher: clue.cipher,
                    coordinates: clue.coordinates,
                    puzzle_piece: clue.puzzle_piece,
                    verification_hash: clue.verification_hash
                },
                chapter_progress: {
                    chapter_number: this.getChapterNumber(chapter),
                    total_chapters: 4,
                    completion_weight: 0.25
                }
            },
            collection: {
                name: this.collectionName,
                family: "Pirate Legends",
                symbol: this.collectionSymbol,
                royalties: {
                    royaltyPercentage: this.royaltyPercentage,
                    royaltyAccount: this.issuerAccount
                }
            },
            // XRPL specific fields
            xrpl: {
                transferFee: this.royaltyPercentage,
                flags: 8, // Transferable
                issuer: this.issuerAccount
            }
        };

        return metadata;
    }

    getFragmentTitle(chapter, rarity) {
        const titles = {
            "Mahé Manuscripts": {
                common: "The Navigator's Chart",
                rare: "The Captain's Compass", 
                epic: "The Sacred Bearing",
                legendary: "Levasseur's True North"
            },
            "La Digue's Secrets": {
                common: "The Astronomer's Tool",
                rare: "The Celestial Map",
                epic: "The Star Prophet's Vision", 
                legendary: "The Cosmic Key"
            },
            "Praslin's Prophecy": {
                common: "The Botanist's Code",
                rare: "The Sacred Grove Mystery",
                epic: "The Coco de Mer Oracle",
                legendary: "The Garden of Eden Cipher"
            },
            "Outer Islands Revelation": {
                common: "The Final Coordinates",
                rare: "The Ultimate Bearing",
                epic: "The Treasure's True Location",
                legendary: "Levasseur's Final Secret"
            }
        };

        return titles[chapter]?.[rarity] || titles["Mahé Manuscripts"][rarity];
    }

    generateDescription(tokenId, chapter, island, clue, rarity) {
        const loreFragments = {
            "Mahé Manuscripts": [
                "Beneath the mist-shrouded peaks of Mahé, where ancient granite pierces tropical clouds,",
                "lies a fragment of Levasseur's navigation charts. The weathered compass rose bears",
                "mystical symbols that point not to magnetic north, but to something far more precious."
            ],
            "La Digue's Secrets": [
                "Among the colossal granite boulders of La Digue, where coco de mer palms whisper",
                "secrets of ages past, astronomical instruments await discovery. When Sirius aligns",
                "with the Southern Cross, the true path shall be revealed to those who understand."
            ],
            "Praslin's Prophecy": [
                "Within the primeval Vallée de Mai, where endemic palms guard ancient mysteries,",
                "botanical codes were carved into living monuments. The sacred coco de mer holds",
                "the key to Levasseur's greatest secret, waiting for nature's chosen interpreter."
            ],
            "Outer Islands Revelation": [
                "Where endless azure meets coral sanctuaries, the final coordinates emerge from",
                "mathematical sequences hidden in plain sight. Here, at the edge of infinity,",
                "Olivier Levasseur's billion-dollar treasure awaits its destined discoverer."
            ]
        };

        const baseLore = loreFragments[chapter] || loreFragments["Mahé Manuscripts"];
        const clueHint = this.getClueHint(clue.type);
        
        let description = baseLore.join(" ");
        description += ` ${clueHint}`;
        
        if (rarity === 'legendary') {
            description += " This legendary fragment pulses with the very essence of Levasseur's final curse.";
        } else if (rarity === 'epic') {
            description += " Ancient power emanates from this rare artifact.";
        }

        description += ` - Fragment ${tokenId} of Levasseur's Lost Chronicle`;
        
        return description;
    }

    getClueHint(clueType) {
        const hints = {
            compass_bearing: "The brass compass needle quivers with supernatural magnetism.",
            star_chart: "Celestial alignments reveal pathways through time and space.", 
            botanical_code: "Nature's own cipher grows in patterns only the wise can read.",
            coordinate_sequence: "Mathematical precision guides the final steps to glory."
        };
        return hints[clueType] || hints.compass_bearing;
    }

    getChapterNumber(chapterName) {
        const mapping = {
            "Mahé Manuscripts": 1,
            "La Digue's Secrets": 2, 
            "Praslin's Prophecy": 3,
            "Outer Islands Revelation": 4
        };
        return mapping[chapterName] || 1;
    }

    buildAttributes(nftData) {
        const { chapter, island, rarity, attributes } = nftData;
        
        const metadataAttributes = [
            { trait_type: "Chapter", value: chapter },
            { trait_type: "Island", value: island },
            { trait_type: "Background", value: this.formatTraitValue(attributes.background) },
            { trait_type: "Terrain", value: this.formatTraitValue(attributes.terrain) },
            { trait_type: "Navigation Tool", value: this.formatTraitValue(attributes.navigation_tool) },
            { trait_type: "Wildlife", value: this.formatTraitValue(attributes.wildlife) },
            { trait_type: "Rarity Tier", value: this.capitalizeFirst(rarity) }
        ];

        // Add optional attributes based on rarity
        if (attributes.weather) {
            metadataAttributes.push({
                trait_type: "Weather",
                value: this.formatTraitValue(attributes.weather)
            });
        }

        if (attributes.mystical) {
            metadataAttributes.push({
                trait_type: "Mystical Element", 
                value: this.formatTraitValue(attributes.mystical)
            });
        }

        return metadataAttributes;
    }

    formatTraitValue(value) {
        return value.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Generate metadata for all NFTs
    async buildAllMetadata(traitsFile = './data/generated_traits.json') {
        console.log('🏗️  Building metadata for all NFT fragments...');

        // Load generated traits
        const allTraits = await fs.readJson(traitsFile);
        console.log(`📊 Loaded traits for ${allTraits.length} NFTs`);

        await fs.ensureDir(this.metadataDir);
        
        const allMetadata = [];
        let metadataCount = { common: 0, rare: 0, epic: 0, legendary: 0 };

        for (const nftData of allTraits) {
            // For now, use placeholder IPFS hash (will be updated in IPFS upload step)
            const placeholderHash = `QmPlaceholder${nftData.tokenId.toString().padStart(4, '0')}`;
            
            const metadata = this.buildNFTMetadata(nftData, placeholderHash);
            
            // Save individual metadata file
            const metadataFileName = `${nftData.tokenId.toString().padStart(4, '0')}.json`;
            const metadataFilePath = path.join(this.metadataDir, metadataFileName);
            await fs.writeJson(metadataFilePath, metadata, { spaces: 2 });

            allMetadata.push({
                tokenId: nftData.tokenId,
                fileName: nftData.fileName,
                filePath: nftData.filePath,
                metadataPath: metadataFilePath,
                metadata
            });

            metadataCount[nftData.rarity]++;
        }

        // Save complete metadata collection
        await fs.writeJson(this.outputFile, allMetadata, { spaces: 2 });

        console.log('✅ Metadata generation complete!');
        console.log(`📁 Individual files: ${this.metadataDir}`);
        console.log(`📋 Complete collection: ${this.outputFile}`);
        console.log('📊 Rarity distribution:');
        console.log(`   Common: ${metadataCount.common}`);
        console.log(`   Rare: ${metadataCount.rare}`);
        console.log(`   Epic: ${metadataCount.epic}`);  
        console.log(`   Legendary: ${metadataCount.legendary}`);

        return allMetadata;
    }

    // Validate metadata schema
    validateMetadata(metadata) {
        const requiredFields = ['name', 'description', 'image', 'attributes'];
        const requiredXRPLFields = ['transferFee', 'flags', 'issuer'];
        
        for (const field of requiredFields) {
            if (!metadata[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        for (const field of requiredXRPLFields) {
            if (!metadata.xrpl[field]) {
                throw new Error(`Missing required XRPL field: ${field}`);
            }
        }

        if (!metadata.properties?.clue_data) {
            throw new Error('Missing puzzle clue data');
        }

        return true;
    }

    // Update metadata with actual IPFS hashes after upload
    async updateIPFSHashes(metadataArray, ipfsResults) {
        console.log('🔄 Updating metadata with actual IPFS hashes...');
        
        const updatedMetadata = [];

        for (let i = 0; i < metadataArray.length; i++) {
            const metadata = { ...metadataArray[i] };
            const ipfsResult = ipfsResults[i];

            if (ipfsResult?.imageHash) {
                metadata.metadata.image = `ipfs://${ipfsResult.imageHash}`;
            }

            if (ipfsResult?.metadataHash) {
                metadata.ipfsMetadataHash = ipfsResult.metadataHash;
                metadata.metadata.external_url = `https://ipfs.io/ipfs/${ipfsResult.metadataHash}`;
            }

            updatedMetadata.push(metadata);
        }

        // Save updated metadata
        await fs.writeJson(this.outputFile, updatedMetadata, { spaces: 2 });
        console.log('✅ Metadata updated with IPFS hashes');

        return updatedMetadata;
    }
}

// Main execution
async function main() {
    try {
        const builder = new MetadataBuilder();
        const allMetadata = await builder.buildAllMetadata();
        
        // Validate a sample
        console.log('🔍 Validating metadata schema...');
        builder.validateMetadata(allMetadata[0].metadata);
        console.log('✅ Metadata validation passed');
        
        console.log('\n📦 Sample metadata for Fragment #1:');
        console.log(JSON.stringify(allMetadata[0].metadata, null, 2));
        
    } catch (error) {
        console.error('💥 Metadata generation failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = MetadataBuilder;