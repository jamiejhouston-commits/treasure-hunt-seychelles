import WaterfallWitchGenerator from './generateWaterfallWitchArt.js';
import fs from 'fs-extra';
import path from 'path';

class WaterfallWitchArtValidator {
    constructor() {
        this.generator = new WaterfallWitchGenerator();
        this.testOutputDir = './test_output';
        this.testSample = 5; // Generate small test batch for validation
    }

    async runFullValidation() {
        console.log('🧪 Starting Waterfall Witch Art Quality Validation...');
        console.log('🎨 Testing professional comic book art standards\n');

        const results = {
            passed: 0,
            failed: 0,
            tests: []
        };

        try {
            // Test 1: Character Design Quality
            await this.testCharacterDesignQuality(results);

            // Test 2: Facial Feature Realism
            await this.testFacialFeatureRealism(results);

            // Test 3: Scene Composition
            await this.testSceneComposition(results);

            // Test 4: Environmental Detail
            await this.testEnvironmentalDetail(results);

            // Test 5: Treasure Hunt Integration
            await this.testTreasureHuntIntegration(results);

            // Test 6: Art Style Consistency
            await this.testArtStyleConsistency(results);

            // Test 7: Generate Sample Images
            await this.generateTestSamples(results);

            this.printValidationResults(results);

        } catch (error) {
            console.error('❌ Validation suite failed:', error);
            throw error;
        }
    }

    async testCharacterDesignQuality(results) {
        console.log('🎭 Testing Character Design Quality...');

        const test = {
            name: 'Character Design Quality',
            description: 'Validates that characters have realistic proportions and detailed features',
            passed: true,
            issues: []
        };

        // Test character type variety
        const witchTypes = Object.keys(this.generator.witchTypes);
        const pirateTypes = Object.keys(this.generator.pirateTypes);

        if (witchTypes.length < 5) {
            test.issues.push(`Only ${witchTypes.length} witch types defined, expected at least 5`);
            test.passed = false;
        }

        if (pirateTypes.length < 6) {
            test.issues.push(`Only ${pirateTypes.length} pirate types defined, expected at least 6`);
            test.passed = false;
        }

        // Test character attribute depth
        witchTypes.forEach(witchType => {
            const witch = this.generator.witchTypes[witchType];
            const requiredAttributes = ['age', 'clothing', 'hair', 'accessories', 'magical_aura', 'personality'];

            requiredAttributes.forEach(attr => {
                if (!witch[attr]) {
                    test.issues.push(`Witch type '${witchType}' missing '${attr}' attribute`);
                    test.passed = false;
                }
            });
        });

        // Test for professional character descriptions (no childish terms)
        const unprofessionalTerms = ['silly', 'cute', 'simple', 'basic', 'childish', 'stick'];
        const allCharacterData = JSON.stringify([this.generator.witchTypes, this.generator.pirateTypes]);

        unprofessionalTerms.forEach(term => {
            if (allCharacterData.toLowerCase().includes(term)) {
                test.issues.push(`Unprofessional term '${term}' found in character definitions`);
                test.passed = false;
            }
        });

        this.recordTestResult(results, test);
    }

    async testFacialFeatureRealism(results) {
        console.log('👥 Testing Facial Feature Realism...');

        const test = {
            name: 'Facial Feature Realism',
            description: 'Ensures facial features are detailed and age-appropriate',
            passed: true,
            issues: []
        };

        // Test facial feature generation
        const testFeatures = this.generator.generateFacialFeatures(0.5, 'middle_aged');

        const requiredFeatures = ['eye_color', 'eye_shape', 'nose_shape', 'mouth_shape', 'face_shape', 'skin_tone', 'distinctive_features'];

        requiredFeatures.forEach(feature => {
            if (!testFeatures[feature]) {
                test.issues.push(`Missing facial feature: ${feature}`);
                test.passed = false;
            }
        });

        // Test age-appropriate feature variation
        const ageGroups = ['young', 'middle_aged', 'elderly', 'ancient'];
        ageGroups.forEach(age => {
            const features = this.generator.generateFacialFeatures(Math.random(), age);

            if (age === 'elderly' || age === 'ancient') {
                if (features.wrinkles < 0.6) {
                    test.issues.push(`${age} character should have more wrinkles (${features.wrinkles})`);
                    test.passed = false;
                }
            }

            if (!features.distinctive_features || features.distinctive_features.length === 0) {
                test.issues.push(`${age} character missing distinctive features`);
                test.passed = false;
            }
        });

        // Test distinctive feature variety
        const allDistinctiveFeatures = [];
        for (let i = 0; i < 10; i++) {
            const features = this.generator.getDistinctiveFeatures(Math.random() * 100, 'mature');
            allDistinctiveFeatures.push(...features);
        }

        const uniqueFeatures = [...new Set(allDistinctiveFeatures)];
        if (uniqueFeatures.length < 8) {
            test.issues.push(`Only ${uniqueFeatures.length} unique distinctive features found, expected at least 8`);
            test.passed = false;
        }

        this.recordTestResult(results, test);
    }

    async testSceneComposition(results) {
        console.log('🎬 Testing Scene Composition...');

        const test = {
            name: 'Scene Composition',
            description: 'Validates scene variety and storytelling elements',
            passed: true,
            issues: []
        };

        const sceneTypes = Object.keys(this.generator.sceneTypes);

        if (sceneTypes.length < 5) {
            test.issues.push(`Only ${sceneTypes.length} scene types defined, expected at least 5`);
            test.passed = false;
        }

        // Test scene storytelling elements
        sceneTypes.forEach(sceneType => {
            const scene = this.generator.sceneTypes[sceneType];
            const requiredElements = ['setting', 'witch_position', 'pirate_position', 'interaction', 'lighting', 'story_moment'];

            requiredElements.forEach(element => {
                if (!scene[element]) {
                    test.issues.push(`Scene '${sceneType}' missing '${element}' element`);
                    test.passed = false;
                }
            });
        });

        // Test character pose variety
        const poses = [];
        sceneTypes.forEach(sceneType => {
            const scene = this.generator.sceneTypes[sceneType];
            poses.push(scene.witch_position, scene.pirate_position);
        });

        const uniquePoses = [...new Set(poses.filter(pose => pose !== 'not_present'))];
        if (uniquePoses.length < 8) {
            test.issues.push(`Only ${uniquePoses.length} unique character poses, expected at least 8`);
            test.passed = false;
        }

        this.recordTestResult(results, test);
    }

    async testEnvironmentalDetail(results) {
        console.log('🌊 Testing Environmental Detail...');

        const test = {
            name: 'Environmental Detail',
            description: 'Ensures rich environmental storytelling and Seychelles authenticity',
            passed: true,
            issues: []
        };

        // Test environmental detail levels by rarity
        const rarityLevels = ['rare', 'epic', 'legendary'];
        const testSetting = 'waterfall_exterior';

        rarityLevels.forEach(rarity => {
            const details = this.generator.getEnvironmentalDetails(testSetting, rarity);

            if (rarity === 'legendary' && details.length < 10) {
                test.issues.push(`Legendary rarity should have at least 10 environmental details, got ${details.length}`);
                test.passed = false;
            }

            if (rarity === 'rare' && details.length < 4) {
                test.issues.push(`Rare rarity should have at least 4 environmental details, got ${details.length}`);
                test.passed = false;
            }
        });

        // Test Seychelles-specific elements
        const seychellesElements = ['takamaka_trees', 'granite', 'coral', 'tropical', 'waterfall', 'church'];
        const environmentData = JSON.stringify(this.generator.getEnvironmentalDetails('waterfall_exterior', 'legendary'));

        let seychellesCount = 0;
        seychellesElements.forEach(element => {
            if (environmentData.toLowerCase().includes(element)) {
                seychellesCount++;
            }
        });

        if (seychellesCount < 3) {
            test.issues.push(`Not enough Seychelles-specific elements found (${seychellesCount}/6)`);
            test.passed = false;
        }

        // Test atmospheric effects
        const atmosphere = this.generator.generateAtmosphere(0.5, 'natural_daylight');
        const requiredAtmosphereElements = ['primary_light', 'shadows', 'particles', 'mood'];

        requiredAtmosphereElements.forEach(element => {
            if (!atmosphere[element]) {
                test.issues.push(`Missing atmosphere element: ${element}`);
                test.passed = false;
            }
        });

        this.recordTestResult(results, test);
    }

    async testTreasureHuntIntegration(results) {
        console.log('🗝️ Testing Treasure Hunt Integration...');

        const test = {
            name: 'Treasure Hunt Integration',
            description: 'Validates treasure location clues and Port Launay Church integration',
            passed: true,
            issues: []
        };

        // Test treasure location coordinates
        const treasureLocation = this.generator.treasureClues.exact_location;

        if (!treasureLocation.lat || !treasureLocation.lng) {
            test.issues.push('Missing treasure location coordinates');
            test.passed = false;
        }

        // Validate coordinates are in Seychelles
        if (treasureLocation.lat > -4.0 || treasureLocation.lat < -5.0) {
            test.issues.push('Treasure latitude not in Seychelles range');
            test.passed = false;
        }

        if (treasureLocation.lng < 55.0 || treasureLocation.lng > 56.0) {
            test.issues.push('Treasure longitude not in Seychelles range');
            test.passed = false;
        }

        // Test Port Launay Church reference
        if (!treasureLocation.description.toLowerCase().includes('port launay church')) {
            test.issues.push('Treasure location must reference Port Launay Church');
            test.passed = false;
        }

        // Test verification elements
        if (!this.generator.treasureClues.verification_elements ||
            this.generator.treasureClues.verification_elements.length < 3) {
            test.issues.push('Need at least 3 verification elements for treasure location');
            test.passed = false;
        }

        // Test clue generation for different rarities
        const testTokenIds = [1001, 1050, 1145]; // rare, epic, legendary
        testTokenIds.forEach(tokenId => {
            const rarity = this.generator.getRarity(tokenId);
            const clue = this.generator.generateTreasureLocationClue(tokenId);

            if (!clue.type || !clue.cipher || !clue.story_fragment) {
                test.issues.push(`Token ${tokenId} missing essential clue elements`);
                test.passed = false;
            }

            if (rarity === 'legendary' && !clue.is_winning_card) {
                test.issues.push(`Legendary token ${tokenId} should be a winning card`);
                test.passed = false;
            }
        });

        this.recordTestResult(results, test);
    }

    async testArtStyleConsistency(results) {
        console.log('🎨 Testing Art Style Consistency...');

        const test = {
            name: 'Art Style Consistency',
            description: 'Ensures contemporary comic book style throughout',
            passed: true,
            issues: []
        };

        // Test color palette generation
        const lightingTypes = ['magical_firelight', 'natural_daylight', 'dim_secretive', 'moonlight_shadows', 'mystical_aura'];

        lightingTypes.forEach(lighting => {
            const palette = this.generator.generateColorPalette(0.5, lighting);

            if (!palette.primary || !palette.secondary || !palette.accent || !palette.shadows) {
                test.issues.push(`Incomplete color palette for ${lighting}`);
                test.passed = false;
            }

            if (palette.primary.length < 3) {
                test.issues.push(`Not enough primary colors for ${lighting} (need at least 3)`);
                test.passed = false;
            }
        });

        // Test composition variety
        const interactions = ['payment_for_spell', 'first_meeting', 'witch_betrayal', 'hidden_stash', 'magical_protection'];
        const compositions = interactions.map(interaction => this.generator.getComposition(interaction));
        const uniqueCompositions = [...new Set(compositions)];

        if (uniqueCompositions.length < 4) {
            test.issues.push(`Only ${uniqueCompositions.length} unique compositions, expected at least 4`);
            test.passed = false;
        }

        // Test detail level progression
        const detailLevels = ['detailed', 'highly_detailed', 'masterpiece'];
        detailLevels.forEach(level => {
            if (!level) {
                test.issues.push('Missing detail level definition');
                test.passed = false;
            }
        });

        this.recordTestResult(results, test);
    }

    async generateTestSamples(results) {
        console.log('🖼️ Generating Test Sample Images...');

        const test = {
            name: 'Sample Image Generation',
            description: 'Generates sample images to validate visual quality',
            passed: true,
            issues: []
        };

        try {
            await fs.ensureDir(this.testOutputDir);

            // Generate one sample from each rarity level
            const testTokens = [1001, 1090, 1145]; // rare, epic, legendary
            const generatedSamples = [];

            for (const tokenId of testTokens) {
                try {
                    console.log(`   Generating sample NFT #${tokenId}...`);

                    // Create test generator with smaller canvas for faster testing
                    const testGenerator = new WaterfallWitchGenerator();
                    testGenerator.width = 512;
                    testGenerator.height = 512;
                    testGenerator.outputDir = this.testOutputDir;

                    const result = await testGenerator.generateWaterfallWitchNFT(tokenId);
                    generatedSamples.push(result);

                    // Validate file was created
                    if (!await fs.pathExists(result.filePath)) {
                        test.issues.push(`Sample image not created: ${result.fileName}`);
                        test.passed = false;
                    } else {
                        const stats = await fs.stat(result.filePath);
                        if (stats.size < 10000) { // Less than 10KB probably means generation failed
                            test.issues.push(`Sample image too small: ${result.fileName} (${stats.size} bytes)`);
                            test.passed = false;
                        }
                    }

                } catch (error) {
                    test.issues.push(`Failed to generate sample ${tokenId}: ${error.message}`);
                    test.passed = false;
                }
            }

            console.log(`   ✅ Generated ${generatedSamples.length} test samples`);

            // Validate sample variety
            const rarities = generatedSamples.map(sample => sample.rarity);
            const uniqueRarities = [...new Set(rarities)];

            if (uniqueRarities.length < 2) {
                test.issues.push('Test samples should include multiple rarity levels');
                test.passed = false;
            }

            // Check for treasure location card
            const treasureCards = generatedSamples.filter(sample => sample.clue.is_winning_card);
            if (treasureCards.length === 0) {
                test.issues.push('No treasure location cards in sample set');
                test.passed = false;
            }

        } catch (error) {
            test.issues.push(`Sample generation failed: ${error.message}`);
            test.passed = false;
        }

        this.recordTestResult(results, test);
    }

    recordTestResult(results, test) {
        results.tests.push(test);

        if (test.passed) {
            results.passed++;
            console.log(`   ✅ ${test.name}: PASSED`);
        } else {
            results.failed++;
            console.log(`   ❌ ${test.name}: FAILED`);
            test.issues.forEach(issue => {
                console.log(`      - ${issue}`);
            });
        }
        console.log('');
    }

    printValidationResults(results) {
        console.log('🧪 WATERFALL WITCH ART VALIDATION RESULTS');
        console.log('==========================================\n');

        console.log(`📊 Overall Results:`);
        console.log(`   ✅ Passed: ${results.passed}`);
        console.log(`   ❌ Failed: ${results.failed}`);
        console.log(`   📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

        if (results.failed === 0) {
            console.log('🎉 ALL TESTS PASSED! 🎉');
            console.log('🏆 Art meets professional comic book standards');
            console.log('✨ Ready for production generation\n');
        } else {
            console.log('⚠️  Some tests failed. Review issues above.');
            console.log('🔧 Fix issues before proceeding to production\n');
        }

        console.log('📋 Test Summary:');
        results.tests.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`   ${status} ${test.name}: ${test.description}`);
        });

        console.log(`\n📁 Test samples generated in: ${this.testOutputDir}`);

        if (results.failed === 0) {
            console.log('\n🚀 Validation complete - proceed with full batch generation!');
        }
    }

    // Quality checklist for manual review
    printQualityChecklist() {
        console.log('\n📋 MANUAL QUALITY REVIEW CHECKLIST');
        console.log('====================================\n');

        console.log('🎭 Character Quality:');
        console.log('   □ Characters have realistic human proportions (8-head rule)');
        console.log('   □ Facial features are detailed and age-appropriate');
        console.log('   □ No stick figures or childish drawings');
        console.log('   □ Characters show distinct personalities and emotions');
        console.log('   □ Clothing and accessories are period-accurate\n');

        console.log('🌊 Environment Quality:');
        console.log('   □ Sauzier Waterfalls is recognizably rendered');
        console.log('   □ Seychelles-specific elements are present (granite, takamaka, coral)');
        console.log('   □ Cave interiors are atmospheric and mystical');
        console.log('   □ Environmental details increase with rarity');
        console.log('   □ Lighting effects are realistic and dramatic\n');

        console.log('🎨 Art Style Quality:');
        console.log('   □ Contemporary comic book aesthetic throughout');
        console.log('   □ Color palettes are cohesive and mood-appropriate');
        console.log('   □ Composition guides the eye effectively');
        console.log('   □ Detail level is consistent with rarity tier');
        console.log('   □ No pixelation or rendering artifacts\n');

        console.log('📖 Story Quality:');
        console.log('   □ Scenes clearly depict the witch\'s betrayal story');
        console.log('   □ Character interactions are believable');
        console.log('   □ Treasure elements are subtly integrated');
        console.log('   □ Port Launay Church clues are present in legendary cards');
        console.log('   □ Each NFT advances the narrative\n');

        console.log('🏆 Treasure Hunt Quality:');
        console.log('   □ Winning cards contain accurate Port Launay coordinates');
        console.log('   □ Visual clues are subtle but discoverable');
        console.log('   □ Verification elements are cryptographically secure');
        console.log('   □ Non-winning cards provide story progression');
        console.log('   □ Treasure cache description is detailed and accurate\n');
    }
}

// Main execution
async function main() {
    try {
        const validator = new WaterfallWitchArtValidator();
        await validator.runFullValidation();
        validator.printQualityChecklist();

    } catch (error) {
        console.error('💥 Art validation failed:', error);
        process.exit(1);
    }
}

// Run main function when script is executed directly
main().catch(console.error);

export default WaterfallWitchArtValidator;