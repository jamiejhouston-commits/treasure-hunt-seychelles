#!/usr/bin/env node

/**
 * Deployment orchestration script for Treasure of Seychelles NFT Collection
 * Manages the complete pipeline from art generation to XRPL minting
 */

const { spawn, exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

class DeploymentOrchestrator {
    constructor() {
        this.startTime = Date.now();
        this.isTestnet = process.env.XRPL_NETWORK?.includes('testnet') || 
                        process.env.XRPL_NETWORK?.includes('altnet');
        this.logFile = `./logs/deployment_${new Date().toISOString().split('T')[0]}.log`;
        
        // Ensure logs directory exists
        fs.ensureDirSync('./logs');
    }

    async log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        console.log(message);
        await fs.appendFile(this.logFile, logEntry);
    }

    async runCommand(command, description) {
        await this.log(`🔄 ${description}...`);
        
        return new Promise((resolve, reject) => {
            const child = spawn('npm', ['run', command], {
                stdio: 'inherit',
                shell: true
            });

            child.on('close', (code) => {
                if (code === 0) {
                    this.log(`✅ ${description} completed successfully`);
                    resolve();
                } else {
                    this.log(`❌ ${description} failed with code ${code}`);
                    reject(new Error(`${description} failed`));
                }
            });
        });
    }

    async validateEnvironment() {
        await this.log('🔍 Validating environment configuration...');
        
        const requiredVars = [
            'XRPL_NETWORK',
            'XRPL_WALLET_SEED', 
            'XRPL_ISSUER_ACCOUNT',
            'NFT_STORAGE_TOKEN'
        ];

        const missing = requiredVars.filter(varName => !process.env[varName]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }

        await this.log(`📡 Network: ${process.env.XRPL_NETWORK}`);
        await this.log(`💰 Issuer: ${process.env.XRPL_ISSUER_ACCOUNT}`);
        await this.log(`🌐 Mode: ${this.isTestnet ? 'TESTNET' : 'MAINNET'}`);

        if (!this.isTestnet) {
            await this.log('⚠️  MAINNET DEPLOYMENT - Ensure sufficient XRP balance!');
        }
    }

    async preDeploymentChecks() {
        await this.log('🔍 Running pre-deployment checks...');
        
        // Check if directories exist
        const requiredDirs = ['./assets', './data', './scripts'];
        for (const dir of requiredDirs) {
            await fs.ensureDir(dir);
        }

        // Validate package.json scripts
        const packageJson = await fs.readJson('./package.json');
        const requiredScripts = ['generate', 'metadata', 'upload', 'mint'];
        
        const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
        if (missingScripts.length > 0) {
            throw new Error(`Missing npm scripts: ${missingScripts.join(', ')}`);
        }

        await this.log('✅ Pre-deployment checks passed');
    }

    async deploymentPipeline() {
        const steps = [
            { command: 'generate', description: 'Art Generation', estimatedTime: '30-45 minutes' },
            { command: 'metadata', description: 'Metadata Building', estimatedTime: '5-10 minutes' },
            { command: 'upload', description: 'IPFS Upload', estimatedTime: '15-30 minutes' },
            { command: 'mint', description: 'XRPL Minting', estimatedTime: '45-60 minutes' }
        ];

        await this.log(`🚀 Starting deployment pipeline (${steps.length} steps)`);
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepStart = Date.now();
            
            await this.log(`\n📋 Step ${i + 1}/${steps.length}: ${step.description}`);
            await this.log(`⏱️  Estimated time: ${step.estimatedTime}`);
            
            try {
                await this.runCommand(step.command, step.description);
                
                const stepTime = ((Date.now() - stepStart) / 1000 / 60).toFixed(1);
                await this.log(`⏱️  Completed in ${stepTime} minutes`);
                
                // Validate step completion
                await this.validateStepCompletion(step.command);
                
            } catch (error) {
                await this.log(`💥 Pipeline failed at step: ${step.description}`);
                await this.log(`🔍 Error: ${error.message}`);
                throw error;
            }
        }
    }

    async validateStepCompletion(step) {
        switch (step) {
            case 'generate':
                const images = await fs.readdir('./assets/images');
                const expectedCount = parseInt(process.env.TOTAL_SUPPLY) || 1000;
                
                if (images.length < expectedCount) {
                    throw new Error(`Art generation incomplete: ${images.length}/${expectedCount} images`);
                }
                
                await this.log(`✅ Generated ${images.length} NFT images`);
                break;

            case 'metadata':
                if (!await fs.pathExists('./data/complete_metadata.json')) {
                    throw new Error('Metadata file not found');
                }
                
                const metadata = await fs.readJson('./data/complete_metadata.json');
                await this.log(`✅ Built metadata for ${metadata.length} NFTs`);
                break;

            case 'upload':
                if (!await fs.pathExists('./data/ipfs_upload_results.json')) {
                    throw new Error('IPFS upload results not found');
                }
                
                const ipfsResults = await fs.readJson('./data/ipfs_upload_results.json');
                await this.log(`✅ Uploaded ${ipfsResults.length} assets to IPFS`);
                break;

            case 'mint':
                if (!await fs.pathExists('./data/mint_results.json')) {
                    throw new Error('Mint results not found');
                }
                
                const mintResults = await fs.readJson('./data/mint_results.json');
                const successful = mintResults.filter(r => !r.failed);
                await this.log(`✅ Minted ${successful.length} NFTs on XRPL`);
                break;
        }
    }

    async generateFinalReport() {
        await this.log('\n📊 Generating deployment report...');
        
        const totalTime = ((Date.now() - this.startTime) / 1000 / 60).toFixed(1);
        
        const report = {
            timestamp: new Date().toISOString(),
            network: process.env.XRPL_NETWORK,
            isTestnet: this.isTestnet,
            totalTime: `${totalTime} minutes`,
            statistics: {}
        };

        // Collect statistics from each phase
        try {
            if (await fs.pathExists('./data/generated_traits.json')) {
                const traits = await fs.readJson('./data/generated_traits.json');
                report.statistics.artGeneration = {
                    totalNFTs: traits.length,
                    rarityBreakdown: this.getRarityBreakdown(traits)
                };
            }

            if (await fs.pathExists('./data/ipfs_upload_results.json')) {
                const ipfs = await fs.readJson('./data/ipfs_upload_results.json');
                report.statistics.ipfsUpload = {
                    totalFiles: ipfs.length * 2, // image + metadata
                    sampleImageUri: ipfs[0]?.imageUri,
                    sampleMetadataUri: ipfs[0]?.metadataUri
                };
            }

            if (await fs.pathExists('./data/mint_results.json')) {
                const mints = await fs.readJson('./data/mint_results.json');
                const successful = mints.filter(r => !r.failed);
                const totalFees = successful.reduce((sum, r) => sum + parseFloat(r.fee || 0), 0);
                
                report.statistics.xrplMinting = {
                    totalNFTs: mints.length,
                    successful: successful.length,
                    failed: mints.length - successful.length,
                    totalFeesXRP: totalFees.toFixed(6),
                    successRate: ((successful.length / mints.length) * 100).toFixed(1) + '%',
                    sampleNFTokenID: successful[0]?.nftokenID
                };
            }

        } catch (error) {
            await this.log(`⚠️  Warning: Could not collect all statistics: ${error.message}`);
        }

        // Save report
        await fs.writeJson('./data/deployment_report.json', report, { spaces: 2 });
        
        // Display summary
        await this.log('\n🎉 DEPLOYMENT COMPLETE!');
        await this.log('================================');
        await this.log(`⏱️  Total Time: ${totalTime} minutes`);
        await this.log(`📡 Network: ${process.env.XRPL_NETWORK}`);
        await this.log(`📁 Report: ./data/deployment_report.json`);
        
        if (report.statistics.xrplMinting) {
            const stats = report.statistics.xrplMinting;
            await this.log(`✅ Minted: ${stats.successful}/${stats.totalNFTs} NFTs`);
            await this.log(`💰 Total Fees: ${stats.totalFeesXRP} XRP`);
            await this.log(`📊 Success Rate: ${stats.successRate}`);
        }

        await this.log('\n🏴‍☠️ The Treasure of Seychelles collection is now live!');
        
        if (this.isTestnet) {
            await this.log('🧪 TESTNET deployment complete. Ready for mainnet migration.');
        } else {
            await this.log('🌟 MAINNET deployment complete. Collection is now live for trading!');
        }

        return report;
    }

    getRarityBreakdown(traits) {
        const breakdown = { common: 0, rare: 0, epic: 0, legendary: 0 };
        traits.forEach(trait => {
            if (breakdown.hasOwnProperty(trait.rarity)) {
                breakdown[trait.rarity]++;
            }
        });
        return breakdown;
    }

    async cleanup() {
        // Optional: clean up temporary files
        await this.log('🧹 Cleaning up temporary files...');
        
        try {
            // Remove any .tmp files
            const tmpFiles = await fs.glob('./**/*.tmp');
            for (const file of tmpFiles) {
                await fs.remove(file);
            }
            
            await this.log('✅ Cleanup complete');
        } catch (error) {
            await this.log(`⚠️  Cleanup warning: ${error.message}`);
        }
    }
}

// Main deployment execution
async function main() {
    const orchestrator = new DeploymentOrchestrator();
    
    try {
        await orchestrator.log('🏴‍☠️ TREASURE OF SEYCHELLES DEPLOYMENT');
        await orchestrator.log('=====================================');
        
        await orchestrator.validateEnvironment();
        await orchestrator.preDeploymentChecks();
        await orchestrator.deploymentPipeline();
        
        const report = await orchestrator.generateFinalReport();
        await orchestrator.cleanup();
        
        // Exit with success
        process.exit(0);
        
    } catch (error) {
        await orchestrator.log(`💥 DEPLOYMENT FAILED: ${error.message}`);
        await orchestrator.log('Check logs for detailed error information');
        await orchestrator.log(`📁 Log file: ${orchestrator.logFile}`);
        
        // Exit with error
        process.exit(1);
    }
}

// Handle process signals gracefully
process.on('SIGINT', async () => {
    console.log('\n🛑 Deployment interrupted by user');
    process.exit(130);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Deployment terminated');
    process.exit(143);
});

if (require.main === module) {
    main();
}

module.exports = DeploymentOrchestrator;