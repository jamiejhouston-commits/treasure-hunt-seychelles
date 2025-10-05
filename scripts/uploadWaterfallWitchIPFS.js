import fs from 'fs-extra';
import path from 'path';
import { PinataSDK } from 'pinata';
import dotenv from 'dotenv';

dotenv.config();

class WaterfallWitchIPFSUploader {
    constructor() {
        this.pinata = new PinataSDK({
            pinataJwt: process.env.PINATA_JWT,
            pinataGateway: process.env.PINATA_GATEWAY || 'gateway.pinata.cloud'
        });

        this.imageDir = '../assets/waterfall_edition';
        this.metadataFile = '../data/waterfall_witch_metadata.json';
        this.traitsFile = '../data/waterfall_witch_traits.json';
        this.uploadResultsFile = '../data/waterfall_witch_ipfs_results.json';

        this.uploadResults = {
            images: {},
            metadata: {},
            collection_metadata: null,
            upload_date: new Date().toISOString(),
            total_files: 0,
            successful_uploads: 0,
            failed_uploads: 0
        };
    }

    async uploadWaterfallWitchCollection() {
        console.log('🌊 Starting Waterfall Witch IPFS Upload...');
        console.log('🎨 Uploading contemporary comic book art to IPFS\n');

        try {
            // Test Pinata connection
            await this.testConnection();

            // Load metadata and traits
            const metadata = await this.loadMetadata();
            const traits = await this.loadTraits();

            // Upload images first
            console.log('🖼️  Uploading NFT images...');
            await this.uploadImages(traits);

            // Update metadata with IPFS image URLs
            console.log('📋 Updating metadata with IPFS URLs...');
            const updatedMetadata = await this.updateMetadataWithIPFS(metadata);

            // Upload individual NFT metadata
            console.log('📄 Uploading NFT metadata...');
            await this.uploadMetadata(updatedMetadata);

            // Upload collection metadata
            console.log('📚 Uploading collection metadata...');
            await this.uploadCollectionMetadata(updatedMetadata, traits);

            // Save results
            await this.saveUploadResults();

            this.printUploadSummary();

            return this.uploadResults;

        } catch (error) {
            console.error('💥 IPFS upload failed:', error);
            throw error;
        }
    }

    async testConnection() {
        try {
            const testData = await this.pinata.testAuthentication();
            console.log('✅ Pinata connection successful');
        } catch (error) {
            throw new Error(`Pinata connection failed: ${error.message}`);
        }
    }

    async loadMetadata() {
        if (!await fs.pathExists(this.metadataFile)) {
            throw new Error(`Metadata file not found: ${this.metadataFile}. Run buildWaterfallWitchMetadata.js first.`);
        }

        const metadata = await fs.readJson(this.metadataFile);
        console.log(`📊 Loaded metadata for ${metadata.length} NFTs`);
        return metadata;
    }

    async loadTraits() {
        if (!await fs.pathExists(this.traitsFile)) {
            throw new Error(`Traits file not found: ${this.traitsFile}. Generate art first.`);
        }

        const traits = await fs.readJson(this.traitsFile);
        console.log(`🎭 Loaded traits for ${traits.length} NFTs`);
        return traits;
    }

    async uploadImages(traits) {
        console.log(`🖼️  Uploading ${traits.length} Waterfall Witch images...`);

        let uploadedCount = 0;
        let failedCount = 0;

        for (const nft of traits) {
            try {
                const imagePath = path.resolve(this.imageDir, nft.fileName);

                if (!await fs.pathExists(imagePath)) {
                    console.warn(`⚠️  Image not found: ${imagePath}`);
                    failedCount++;
                    continue;
                }

                console.log(`   📸 Uploading ${nft.fileName}...`);

                const imageFile = await fs.readFile(imagePath);

                const uploadResponse = await this.pinata.upload.file(imageFile, {
                    name: nft.fileName,
                    keyvalues: {
                        tokenId: nft.tokenId.toString(),
                        rarity: nft.rarity,
                        edition: 'waterfall_witch_special',
                        witch_type: nft.characters.witch.type,
                        pirate_type: nft.characters.pirate.type,
                        scene: nft.scene.type,
                        is_treasure_card: nft.clue.is_winning_card.toString()
                    }
                });

                this.uploadResults.images[nft.tokenId] = {
                    fileName: nft.fileName,
                    ipfsHash: uploadResponse.IpfsHash,
                    ipfsUrl: `ipfs://${uploadResponse.IpfsHash}`,
                    gatewayUrl: `https://${process.env.PINATA_GATEWAY}/ipfs/${uploadResponse.IpfsHash}`,
                    size: uploadResponse.PinSize,
                    timestamp: uploadResponse.Timestamp
                };

                uploadedCount++;

                // Progress update every 10 uploads
                if (uploadedCount % 10 === 0) {
                    console.log(`   📊 Uploaded ${uploadedCount}/${traits.length} images...`);
                }

            } catch (error) {
                console.error(`   ❌ Failed to upload ${nft.fileName}:`, error.message);
                failedCount++;
            }
        }

        console.log(`✅ Image upload complete: ${uploadedCount} successful, ${failedCount} failed\n`);
        this.uploadResults.successful_uploads += uploadedCount;
        this.uploadResults.failed_uploads += failedCount;
    }

    async updateMetadataWithIPFS(metadata) {
        console.log('🔗 Updating metadata with IPFS image URLs...');

        const updatedMetadata = metadata.map(nft => {
            const tokenId = this.extractTokenId(nft.name);
            const imageData = this.uploadResults.images[tokenId];

            if (imageData) {
                return {
                    ...nft,
                    image: imageData.ipfsUrl,
                    image_gateway: imageData.gatewayUrl,
                    ipfs_metadata: {
                        image_hash: imageData.ipfsHash,
                        image_size: imageData.size,
                        upload_timestamp: imageData.timestamp
                    }
                };
            } else {
                console.warn(`⚠️  No IPFS image data for token ${tokenId}`);
                return nft;
            }
        });

        console.log(`✅ Updated ${updatedMetadata.length} metadata entries with IPFS URLs\n`);
        return updatedMetadata;
    }

    extractTokenId(nftName) {
        // Extract token ID from NFT name like "Sauzier Waterfalls Special Edition #1001"
        const match = nftName.match(/#(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    async uploadMetadata(metadata) {
        console.log(`📄 Uploading ${metadata.length} NFT metadata files...`);

        let uploadedCount = 0;
        let failedCount = 0;

        for (const nft of metadata) {
            try {
                const tokenId = this.extractTokenId(nft.name);

                if (!tokenId) {
                    console.warn(`⚠️  Could not extract token ID from: ${nft.name}`);
                    failedCount++;
                    continue;
                }

                console.log(`   📝 Uploading metadata for token #${tokenId}...`);

                const metadataBlob = new Blob([JSON.stringify(nft, null, 2)], {
                    type: 'application/json'
                });

                const uploadResponse = await this.pinata.upload.file(metadataBlob, {
                    name: `waterfall_witch_${tokenId}_metadata.json`,
                    keyvalues: {
                        tokenId: tokenId.toString(),
                        type: 'nft_metadata',
                        edition: 'waterfall_witch_special',
                        rarity: nft.technical?.rarity_score > 1000 ? 'legendary' : 'standard'
                    }
                });

                this.uploadResults.metadata[tokenId] = {
                    fileName: `waterfall_witch_${tokenId}_metadata.json`,
                    ipfsHash: uploadResponse.IpfsHash,
                    ipfsUrl: `ipfs://${uploadResponse.IpfsHash}`,
                    gatewayUrl: `https://${process.env.PINATA_GATEWAY}/ipfs/${uploadResponse.IpfsHash}`,
                    size: uploadResponse.PinSize,
                    timestamp: uploadResponse.Timestamp
                };

                uploadedCount++;

                // Progress update every 20 uploads
                if (uploadedCount % 20 === 0) {
                    console.log(`   📊 Uploaded ${uploadedCount}/${metadata.length} metadata files...`);
                }

            } catch (error) {
                console.error(`   ❌ Failed to upload metadata for ${nft.name}:`, error.message);
                failedCount++;
            }
        }

        console.log(`✅ Metadata upload complete: ${uploadedCount} successful, ${failedCount} failed\n`);
        this.uploadResults.successful_uploads += uploadedCount;
        this.uploadResults.failed_uploads += failedCount;
    }

    async uploadCollectionMetadata(metadata, traits) {
        console.log('📚 Creating and uploading collection metadata...');

        const collectionMeta = {
            name: 'The Levasseur Treasure: Sauzier Waterfalls Special Edition',
            description: 'Contemporary comic book art depicting the secret betrayal of pirates by the witch of Sauzier Waterfalls. Some NFTs contain real treasure location coordinates for Port Launay Church, Mahé Island, Seychelles.',

            collection_info: {
                total_supply: metadata.length,
                start_token_id: 1001,
                end_token_id: 1150,
                edition_type: 'Special Limited Edition',
                art_style: 'Contemporary Comic Book Realism',
                theme: 'Witch Cave Betrayal Story',
                location: 'Sauzier Waterfalls, Mahé Island, Seychelles'
            },

            rarity_distribution: this.calculateRarityDistribution(traits),

            treasure_hunt: {
                total_treasure_cards: traits.filter(nft => nft.clue.is_winning_card).length,
                treasure_location: 'Port Launay Church, Mahé Island, Seychelles',
                treasure_description: 'Real treasure cache hidden behind the church among takamaka tree roots',
                coordinates_encoded: true,
                verification_required: true
            },

            characters: {
                witch_types: [...new Set(traits.map(nft => nft.characters.witch.type))],
                pirate_types: [...new Set(traits.map(nft => nft.characters.pirate.type))],
                total_character_combinations: this.calculateCharacterCombinations(traits)
            },

            scenes: {
                scene_types: [...new Set(traits.map(nft => nft.scene.type))],
                storytelling_progression: this.getStoryProgression(traits)
            },

            technical: {
                generator: 'WaterfallWitchGenerator v1.0',
                canvas_size: '2048x2048',
                generation_date: new Date().toISOString(),
                ipfs_upload_date: this.uploadResults.upload_date
            },

            nfts: metadata.map(nft => ({
                tokenId: this.extractTokenId(nft.name),
                name: nft.name,
                rarity: nft.attributes.find(attr => attr.trait_type === 'Rarity')?.value,
                metadata_ipfs: this.uploadResults.metadata[this.extractTokenId(nft.name)]?.ipfsUrl,
                image_ipfs: this.uploadResults.images[this.extractTokenId(nft.name)]?.ipfsUrl,
                is_treasure_card: nft.treasure_hunt?.treasure_status === 'LOCATION_CARD'
            }))
        };

        try {
            const collectionBlob = new Blob([JSON.stringify(collectionMeta, null, 2)], {
                type: 'application/json'
            });

            const uploadResponse = await this.pinata.upload.file(collectionBlob, {
                name: 'waterfall_witch_collection_metadata.json',
                keyvalues: {
                    type: 'collection_metadata',
                    edition: 'waterfall_witch_special',
                    total_nfts: metadata.length.toString(),
                    treasure_cards: collectionMeta.treasure_hunt.total_treasure_cards.toString()
                }
            });

            this.uploadResults.collection_metadata = {
                fileName: 'waterfall_witch_collection_metadata.json',
                ipfsHash: uploadResponse.IpfsHash,
                ipfsUrl: `ipfs://${uploadResponse.IpfsHash}`,
                gatewayUrl: `https://${process.env.PINATA_GATEWAY}/ipfs/${uploadResponse.IpfsHash}`,
                size: uploadResponse.PinSize,
                timestamp: uploadResponse.Timestamp
            };

            console.log('✅ Collection metadata uploaded successfully\n');

        } catch (error) {
            console.error('❌ Failed to upload collection metadata:', error.message);
            this.uploadResults.failed_uploads++;
        }
    }

    calculateRarityDistribution(traits) {
        const distribution = traits.reduce((acc, nft) => {
            acc[nft.rarity] = (acc[nft.rarity] || 0) + 1;
            return acc;
        }, {});

        return {
            rare: distribution.rare || 0,
            epic: distribution.epic || 0,
            legendary: distribution.legendary || 0,
            total: traits.length
        };
    }

    calculateCharacterCombinations(traits) {
        const combinations = new Set();

        traits.forEach(nft => {
            const combo = `${nft.characters.witch.type}_${nft.characters.pirate.type}`;
            combinations.add(combo);
        });

        return combinations.size;
    }

    getStoryProgression(traits) {
        const storyMoments = traits.reduce((acc, nft) => {
            const moment = nft.scene.story_moment;
            acc[moment] = (acc[moment] || 0) + 1;
            return acc;
        }, {});

        return {
            moments: storyMoments,
            narrative_flow: [
                'discovery_of_witch',
                'pirates_paying_witch',
                'protection_spell_casting',
                'witch_stealing_treasure',
                'hiding_stolen_treasure'
            ]
        };
    }

    async saveUploadResults() {
        console.log('💾 Saving upload results...');

        this.uploadResults.total_files = Object.keys(this.uploadResults.images).length +
                                        Object.keys(this.uploadResults.metadata).length +
                                        (this.uploadResults.collection_metadata ? 1 : 0);

        await fs.writeJson(this.uploadResultsFile, this.uploadResults, { spaces: 2 });
        console.log(`📄 Upload results saved to: ${this.uploadResultsFile}`);
    }

    printUploadSummary() {
        console.log('\n🌊 WATERFALL WITCH IPFS UPLOAD COMPLETE! 🌊');
        console.log('===============================================\n');

        console.log('📊 Upload Summary:');
        console.log(`   • Total Files: ${this.uploadResults.total_files}`);
        console.log(`   • Successful Uploads: ${this.uploadResults.successful_uploads}`);
        console.log(`   • Failed Uploads: ${this.uploadResults.failed_uploads}`);
        console.log(`   • Success Rate: ${((this.uploadResults.successful_uploads / this.uploadResults.total_files) * 100).toFixed(1)}%\n`);

        console.log('🖼️  Image Uploads:');
        console.log(`   • Images: ${Object.keys(this.uploadResults.images).length}`);
        const treasureImages = Object.values(this.uploadResults.images)
            .filter((_, index) => {
                const tokenId = Object.keys(this.uploadResults.images)[index];
                return tokenId >= 1136; // Legendary tokens with treasure locations
            }).length;
        console.log(`   • Treasure Location Cards: ${treasureImages}\n`);

        console.log('📄 Metadata Uploads:');
        console.log(`   • Individual NFT Metadata: ${Object.keys(this.uploadResults.metadata).length}`);
        console.log(`   • Collection Metadata: ${this.uploadResults.collection_metadata ? '1' : '0'}\n`);

        if (this.uploadResults.collection_metadata) {
            console.log('🔗 Collection IPFS URLs:');
            console.log(`   • Collection Metadata: ${this.uploadResults.collection_metadata.ipfsUrl}`);
            console.log(`   • Gateway URL: ${this.uploadResults.collection_metadata.gatewayUrl}\n`);
        }

        console.log('🏆 Special Features Uploaded:');
        console.log('   • Contemporary comic book art style');
        console.log('   • Realistic character proportions and facial features');
        console.log('   • Detailed Sauzier Waterfalls environment');
        console.log('   • Interactive witch-pirate storylines');
        console.log('   • Real treasure location clues for Port Launay Church\n');

        console.log('✅ Your Waterfall Witch Special Edition is now decentralized on IPFS!');
        console.log('🎨 Ready for minting on XRPL with professional art quality');
    }
}

// Main execution
async function main() {
    try {
        const uploader = new WaterfallWitchIPFSUploader();
        await uploader.uploadWaterfallWitchCollection();
    } catch (error) {
        console.error('💥 IPFS upload failed:', error);
        process.exit(1);
    }
}

// Run main function when script is executed directly
main().catch(console.error);

export default WaterfallWitchIPFSUploader;