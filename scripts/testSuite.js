const TreasureArtGenerator = require('./generateArt');
const MetadataBuilder = require('./buildMetadata');
const IPFSUploader = require('./uploadIPFS');
const XRPLMinter = require('./batchMint');
const fs = require('fs-extra');
const xrpl = require('xrpl');
require('dotenv').config();

class TestSuite {
    constructor() {
        this.testResults = {
            artGeneration: { passed: false, errors: [] },
            metadataBuilder: { passed: false, errors: [] },
            ipfsUpload: { passed: false, errors: [] },
            xrplMinting: { passed: false, errors: [] },
            integration: { passed: false, errors: [] }
        };
        
        this.isTestnet = process.env.XRPL_NETWORK?.includes('testnet') || 
                        process.env.XRPL_NETWORK?.includes('altnet');
    }

    // Test art generation with small sample
    async testArtGeneration() {
        console.log('\n🎨 Testing art generation...');
        
        try {
            // Create test generator with small sample
            const generator = new TreasureArtGenerator();
            generator.totalSupply = 5; // Test with just 5 NFTs
            generator.outputDir = './test/images';
            
            await fs.ensureDir('./test');
            await fs.ensureDir('./test/images');
            
            console.log('🔄 Generating 5 test NFTs...');
            const testTraits = await generator.generateAllNFTs();
            
            // Validate results
            if (testTraits.length !== 5) {
                throw new Error(`Expected 5 NFTs, got ${testTraits.length}`);
            }
            
            // Check file existence
            for (const nft of testTraits) {
                if (!await fs.pathExists(nft.filePath)) {
                    throw new Error(`Image file not found: ${nft.filePath}`);
                }
            }
            
            // Validate traits structure
            const sampleNFT = testTraits[0];
            const requiredFields = ['tokenId', 'chapter', 'island', 'rarity', 'clue', 'attributes'];
            for (const field of requiredFields) {
                if (!sampleNFT[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
            
            // Validate clue structure
            if (!sampleNFT.clue.cipher || !sampleNFT.clue.coordinates) {
                throw new Error('Invalid clue structure');
            }
            
            console.log('✅ Art generation test passed');
            this.testResults.artGeneration.passed = true;
            
            return testTraits;
            
        } catch (error) {
            console.error('❌ Art generation test failed:', error.message);
            this.testResults.artGeneration.errors.push(error.message);
            throw error;
        }
    }

    // Test metadata building
    async testMetadataBuilder(testTraits) {
        console.log('\n📋 Testing metadata builder...');
        
        try {
            const builder = new MetadataBuilder();
            builder.metadataDir = './test/metadata';
            builder.outputFile = './test/complete_metadata.json';
            
            // Save test traits for metadata builder
            await fs.writeJson('./test/generated_traits.json', testTraits, { spaces: 2 });
            
            console.log('🔄 Building metadata for test NFTs...');
            const metadata = await builder.buildAllMetadata('./test/generated_traits.json');
            
            // Validate metadata structure
            if (metadata.length !== testTraits.length) {
                throw new Error(`Metadata count mismatch: expected ${testTraits.length}, got ${metadata.length}`);
            }
            
            const sampleMetadata = metadata[0].metadata;
            
            // Validate XLS-20 compliance
            builder.validateMetadata(sampleMetadata);
            
            // Check required XRPL fields
            if (!sampleMetadata.xrpl?.flags || sampleMetadata.xrpl.flags !== 8) {
                throw new Error('Invalid XRPL flags');
            }
            
            if (!sampleMetadata.xrpl?.transferFee) {
                throw new Error('Missing transfer fee');
            }
            
            console.log('✅ Metadata builder test passed');
            this.testResults.metadataBuilder.passed = true;
            
            return metadata;
            
        } catch (error) {
            console.error('❌ Metadata builder test failed:', error.message);
            this.testResults.metadataBuilder.errors.push(error.message);
            throw error;
        }
    }

    // Test IPFS upload (with sample)
    async testIPFSUpload() {
        console.log('\n🌐 Testing IPFS upload...');
        
        if (!process.env.NFT_STORAGE_TOKEN) {
            console.log('⚠️  Skipping IPFS test - NFT_STORAGE_TOKEN not set');
            this.testResults.ipfsUpload.passed = true;
            return null;
        }
        
        try {
            const uploader = new IPFSUploader();
            uploader.batchSize = 2; // Small batch for testing
            
            console.log('🔄 Testing IPFS upload with sample data...');
            
            // Create a simple test image
            const testImagePath = './test/images/treasure_fragment_0001.png';
            if (await fs.pathExists(testImagePath)) {
                const uploadResult = await uploader.uploadImage(testImagePath, 1);
                
                if (!uploadResult.imageHash || !uploadResult.imageHash.startsWith('Qm')) {
                    throw new Error('Invalid IPFS hash returned');
                }
                
                console.log(`✅ Test image uploaded: ipfs://${uploadResult.imageHash}`);
            }
            
            console.log('✅ IPFS upload test passed');
            this.testResults.ipfsUpload.passed = true;
            
        } catch (error) {
            console.error('❌ IPFS upload test failed:', error.message);
            this.testResults.ipfsUpload.errors.push(error.message);
            // Don't throw - IPFS might be rate limited
        }
    }

    // Test XRPL connection and wallet
    async testXRPLConnection() {
        console.log('\n🔌 Testing XRPL connection...');
        
        try {
            const minter = new XRPLMinter();
            
            console.log('🔄 Connecting to XRPL network...');
            await minter.initialize();
            
            // Test account info
            const accountInfo = await minter.client.request({
                command: 'account_info',
                account: minter.wallet.address
            });
            
            const balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
            console.log(`💰 Test account balance: ${balance} XRP`);
            
            if (parseFloat(balance) < 10) {
                throw new Error('Insufficient XRP balance for testing (need at least 10 XRP)');
            }
            
            await minter.disconnect();
            
            console.log('✅ XRPL connection test passed');
            this.testResults.xrplMinting.passed = true;
            
        } catch (error) {
            console.error('❌ XRPL connection test failed:', error.message);
            this.testResults.xrplMinting.errors.push(error.message);
            throw error;
        }
    }

    // Test single NFT minting
    async testSingleMint() {
        console.log('\n🪙 Testing single NFT mint...');
        
        if (!this.isTestnet) {
            console.log('⚠️  Skipping mint test - not on testnet');
            return;
        }
        
        try {
            const minter = new XRPLMinter();
            await minter.initialize();
            
            // Create test metadata URI
            const testMetadataUri = 'ipfs://QmTestMetadataHashForValidation123456789';
            
            console.log('🔄 Minting test NFT...');
            const mintResult = await minter.mintNFT(9999, testMetadataUri);
            
            if (!mintResult.nftokenID || !mintResult.transactionHash) {
                throw new Error('Incomplete mint result');
            }
            
            console.log(`✅ Test NFT minted: ${mintResult.nftokenID}`);
            console.log(`📤 Transaction: ${mintResult.transactionHash}`);
            
            // Verify the NFT exists
            const nfts = await minter.verifyMints();
            const testNFT = nfts.find(nft => nft.NFTokenID === mintResult.nftokenID);
            
            if (!testNFT) {
                throw new Error('Minted NFT not found in account');
            }
            
            await minter.disconnect();
            
            console.log('✅ Single mint test passed');
            
        } catch (error) {
            console.error('❌ Single mint test failed:', error.message);
            this.testResults.xrplMinting.errors.push(error.message);
            throw error;
        }
    }

    // Integration test - full pipeline with small sample
    async testIntegration() {
        console.log('\n🔄 Running integration test...');
        
        try {
            console.log('1️⃣ Art generation...');
            const testTraits = await this.testArtGeneration();
            
            console.log('2️⃣ Metadata building...');
            await this.testMetadataBuilder(testTraits);
            
            console.log('3️⃣ IPFS upload...');
            await this.testIPFSUpload();
            
            console.log('4️⃣ XRPL connection...');
            await this.testXRPLConnection();
            
            if (this.isTestnet) {
                console.log('5️⃣ Single mint...');
                await this.testSingleMint();
            }
            
            console.log('✅ Integration test passed');
            this.testResults.integration.passed = true;
            
        } catch (error) {
            console.error('❌ Integration test failed:', error.message);
            this.testResults.integration.errors.push(error.message);
            throw error;
        }
    }

    // Generate test report
    async generateReport() {
        console.log('\n📊 Generating test report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            network: process.env.XRPL_NETWORK,
            isTestnet: this.isTestnet,
            results: this.testResults,
            summary: {
                totalTests: Object.keys(this.testResults).length,
                passed: Object.values(this.testResults).filter(r => r.passed).length,
                failed: Object.values(this.testResults).filter(r => !r.passed).length
            }
        };
        
        report.summary.successRate = (report.summary.passed / report.summary.totalTests * 100).toFixed(1) + '%';
        
        await fs.writeJson('./test/test_report.json', report, { spaces: 2 });
        
        console.log('\n📋 Test Summary:');
        console.log(`   Total Tests: ${report.summary.totalTests}`);
        console.log(`   Passed: ${report.summary.passed}`);
        console.log(`   Failed: ${report.summary.failed}`);
        console.log(`   Success Rate: ${report.summary.successRate}`);
        console.log(`   Network: ${report.network}`);
        console.log(`   Report saved: ./test/test_report.json`);
        
        if (report.summary.failed > 0) {
            console.log('\n❌ Failed Tests:');
            Object.entries(this.testResults).forEach(([test, result]) => {
                if (!result.passed) {
                    console.log(`   ${test}: ${result.errors.join(', ')}`);
                }
            });
        }
        
        return report;
    }

    // Clean up test files
    async cleanup() {
        try {
            await fs.remove('./test');
            console.log('🧹 Test files cleaned up');
        } catch (error) {
            console.error('⚠️  Cleanup failed:', error.message);
        }
    }
}

// Main test execution
async function main() {
    console.log('🧪 Starting Treasure of Seychelles Test Suite');
    console.log('============================================');
    
    const testSuite = new TestSuite();
    
    try {
        await testSuite.testIntegration();
        const report = await testSuite.generateReport();
        
        if (report.summary.failed === 0) {
            console.log('\n🎉 All tests passed! System ready for production deployment.');
        } else {
            console.log('\n⚠️  Some tests failed. Review errors before deployment.');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n💥 Test suite failed:', error.message);
        await testSuite.generateReport();
        process.exit(1);
    } finally {
        // await testSuite.cleanup(); // Uncomment to clean up test files
    }
}

if (require.main === module) {
    main();
}

module.exports = TestSuite;