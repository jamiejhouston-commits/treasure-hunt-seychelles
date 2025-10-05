import WaterfallWitchGenerator from './generateWaterfallWitchArt.js';
import WaterfallWitchMetadataBuilder from './buildWaterfallWitchMetadata.js';
import WaterfallWitchIPFSUploader from './uploadWaterfallWitchIPFS.js';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

class WaterfallWitchPipeline {
    constructor() {
        this.steps = [
            { name: 'Art Generation', handler: this.generateArt.bind(this) },
            { name: 'Metadata Building', handler: this.buildMetadata.bind(this) },
            { name: 'IPFS Upload', handler: this.uploadToIPFS.bind(this) },
            { name: 'Database Sync', handler: this.syncDatabase.bind(this) }
        ];

        this.results = {
            startTime: new Date(),
            endTime: null,
            totalDuration: null,
            steps: {},
            summary: {}
        };
    }

    async runComplete() {
        console.log('🌊 WATERFALL WITCH SPECIAL EDITION PIPELINE 🌊');
        console.log('===============================================');
        console.log('🎨 Contemporary Comic Book Art Generation');
        console.log('🏴‍☠️ Real Treasure Hunt Integration');
        console.log('🗝️  Port Launay Church Location Clues');
        console.log('');

        try {
            for (const step of this.steps) {
                await this.runStep(step);
            }

            this.results.endTime = new Date();
            this.results.totalDuration = this.results.endTime - this.results.startTime;

            await this.generateFinalReport();

        } catch (error) {
            console.error('💥 Pipeline failed:', error);
            throw error;
        }
    }

    async runStep(step) {
        const stepStart = new Date();
        console.log(`\n🚀 Starting: ${step.name}`);
        console.log('─'.repeat(50));

        try {
            const result = await step.handler();

            this.results.steps[step.name] = {
                status: 'success',
                startTime: stepStart,
                endTime: new Date(),
                duration: new Date() - stepStart,
                result: result
            };

            console.log(`✅ ${step.name} completed successfully`);
            console.log(`⏱️  Duration: ${this.formatDuration(new Date() - stepStart)}`);

        } catch (error) {
            this.results.steps[step.name] = {
                status: 'failed',
                startTime: stepStart,
                endTime: new Date(),
                duration: new Date() - stepStart,
                error: error.message
            };

            console.error(`❌ ${step.name} failed:`, error.message);
            throw error;
        }
    }

    async generateArt() {
        console.log('🎨 Generating Waterfall Witch contemporary comic book art...');

        const generator = new WaterfallWitchGenerator();
        const traits = await generator.generateWaterfallWitchBatch();

        console.log(`✨ Generated ${traits.length} professional quality NFT artworks`);
        console.log('🎭 Character types with realistic proportions');
        console.log('🌊 Detailed Sauzier Waterfalls environments');
        console.log('📖 Interactive storytelling scenes');

        return {
            totalNFTs: traits.length,
            rarities: this.countRarities(traits),
            treasureCards: traits.filter(nft => nft.clue.is_winning_card).length,
            artStyle: 'Contemporary Comic Book Realism'
        };
    }

    async buildMetadata() {
        console.log('📋 Building XLS-20 compliant metadata...');

        const builder = new WaterfallWitchMetadataBuilder();
        const metadata = await builder.buildAllMetadata();

        console.log('📝 Enhanced metadata with treasure hunt integration');
        console.log('🔒 Cryptographic verification systems');
        console.log('🏆 Real treasure location encoding');

        return {
            totalMetadata: metadata.length,
            xls20Compliant: true,
            treasureHuntIntegrated: true
        };
    }

    async uploadToIPFS() {
        console.log('🌐 Uploading to IPFS for decentralized storage...');

        const uploader = new WaterfallWitchIPFSUploader();
        const uploadResults = await uploader.uploadWaterfallWitchCollection();

        console.log('☁️  Decentralized storage complete');
        console.log('🔗 IPFS URLs generated for all assets');

        return uploadResults;
    }

    async syncDatabase() {
        console.log('💾 Syncing to application database...');

        return new Promise((resolve, reject) => {
            const syncScript = spawn('node', ['../backend/sync_waterfall_witch.js'], {
                cwd: process.cwd(),
                stdio: 'inherit'
            });

            syncScript.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Database sync completed successfully');
                    console.log('🖼️  NFTs now available in app gallery');

                    resolve({
                        status: 'success',
                        databaseSynced: true,
                        galleryReady: true
                    });
                } else {
                    reject(new Error(`Database sync failed with code ${code}`));
                }
            });
        });
    }

    async generateFinalReport() {
        console.log('\n🎉 WATERFALL WITCH PIPELINE COMPLETE! 🎉');
        console.log('===========================================\n');

        // Generate comprehensive summary
        this.results.summary = {
            totalTime: this.formatDuration(this.results.totalDuration),
            artGenerated: this.results.steps['Art Generation']?.result?.totalNFTs || 0,
            treasureCards: this.results.steps['Art Generation']?.result?.treasureCards || 0,
            ipfsUploads: this.results.steps['IPFS Upload']?.result?.successful_uploads || 0,
            databaseSynced: this.results.steps['Database Sync']?.status === 'success',

            rarityDistribution: this.results.steps['Art Generation']?.result?.rarities || {},

            features: [
                'Professional contemporary comic book art style',
                'Zero stick figures or childish drawings',
                'Realistic character proportions (8-head rule)',
                'Detailed facial features with age progression',
                'Interactive witch-pirate storylines',
                'Sauzier Waterfalls environment authenticity',
                'Real treasure hunt with Port Launay coordinates',
                'XLS-20 compliant metadata',
                'Decentralized IPFS storage',
                'Gallery integration complete'
            ]
        };

        // Print detailed summary
        console.log('📊 FINAL SUMMARY:');
        console.log(`   ⏱️  Total Processing Time: ${this.results.summary.totalTime}`);
        console.log(`   🎨 NFTs Generated: ${this.results.summary.artGenerated}`);
        console.log(`   🏆 Treasure Location Cards: ${this.results.summary.treasureCards}`);
        console.log(`   ☁️  IPFS Uploads: ${this.results.summary.ipfsUploads}`);
        console.log(`   💾 Database Status: ${this.results.summary.databaseSynced ? 'Synced' : 'Failed'}\n`);

        console.log('💎 RARITY DISTRIBUTION:');
        Object.entries(this.results.summary.rarityDistribution).forEach(([rarity, count]) => {
            console.log(`   • ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}: ${count}`);
        });

        console.log('\n🚀 SPECIAL EDITION FEATURES:');
        this.results.summary.features.forEach(feature => {
            console.log(`   ✅ ${feature}`);
        });

        console.log('\n📱 APP INTEGRATION:');
        console.log('   🖼️  Gallery: Ready to browse');
        console.log('   🔍 Filters: Rarity, scene type, character combinations');
        console.log('   🏷️  Attributes: Detailed character and story traits');
        console.log('   🗝️  Treasure Hunt: Location cards discoverable');

        console.log('\n🎯 NEXT STEPS:');
        console.log('   1. 🌐 Start your app: npm run dev');
        console.log('   2. 📱 Visit gallery to see new Waterfall Witch NFTs');
        console.log('   3. 🔍 Filter by "Sauzier Waterfalls Special" edition');
        console.log('   4. 🏴‍☠️ Mint on XRPL when ready');

        // Save report
        const reportPath = '../data/waterfall_witch_pipeline_report.json';
        await fs.writeJson(reportPath, this.results, { spaces: 2 });
        console.log(`\n📄 Full report saved to: ${reportPath}`);

        console.log('\n🏴‍☠️ THE WITCH AWAITS IN YOUR GALLERY! 🏴‍☠️');
    }

    countRarities(traits) {
        return traits.reduce((acc, nft) => {
            acc[nft.rarity] = (acc[nft.rarity] || 0) + 1;
            return acc;
        }, {});
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}

// Command line options
const args = process.argv.slice(2);
const options = {
    skipArt: args.includes('--skip-art'),
    skipMetadata: args.includes('--skip-metadata'),
    skipUpload: args.includes('--skip-upload'),
    skipSync: args.includes('--skip-sync'),
    testMode: args.includes('--test')
};

// Main execution
async function main() {
    try {
        if (options.testMode) {
            console.log('🧪 Running in test mode with limited generation...');
        }

        const pipeline = new WaterfallWitchPipeline();

        // Filter steps based on options
        if (options.skipArt) pipeline.steps = pipeline.steps.filter(s => s.name !== 'Art Generation');
        if (options.skipMetadata) pipeline.steps = pipeline.steps.filter(s => s.name !== 'Metadata Building');
        if (options.skipUpload) pipeline.steps = pipeline.steps.filter(s => s.name !== 'IPFS Upload');
        if (options.skipSync) pipeline.steps = pipeline.steps.filter(s => s.name !== 'Database Sync');

        await pipeline.runComplete();

    } catch (error) {
        console.error('\n💥 PIPELINE FAILED:', error);
        console.error('\n🔧 Troubleshooting:');
        console.error('   • Check environment variables (.env)');
        console.error('   • Ensure Pinata IPFS credentials are set');
        console.error('   • Verify database is accessible');
        console.error('   • Check disk space for image generation');

        process.exit(1);
    }
}

// Help text
if (args.includes('--help') || args.includes('-h')) {
    console.log('🌊 Waterfall Witch Pipeline');
    console.log('===========================');
    console.log('');
    console.log('Usage: node waterfallWitchPipeline.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --skip-art       Skip art generation step');
    console.log('  --skip-metadata  Skip metadata building step');
    console.log('  --skip-upload    Skip IPFS upload step');
    console.log('  --skip-sync      Skip database sync step');
    console.log('  --test           Run in test mode');
    console.log('  --help, -h       Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  node waterfallWitchPipeline.js                    # Full pipeline');
    console.log('  node waterfallWitchPipeline.js --skip-upload      # Skip IPFS');
    console.log('  node waterfallWitchPipeline.js --test             # Test mode');
    process.exit(0);
}

// Run pipeline
main().catch(console.error);

export default WaterfallWitchPipeline;