import WaterfallWitchMetadataBuilder from './buildWaterfallWitchMetadata.js';

async function main() {
    try {
        const builder = new WaterfallWitchMetadataBuilder();
        console.log('🏗️  Starting quick metadata build...');
        const metadata = await builder.buildAllMetadata();
        console.log('✅ Metadata build complete!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();