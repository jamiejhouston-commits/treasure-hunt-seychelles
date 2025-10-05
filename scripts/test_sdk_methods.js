import { PinataSDK } from 'pinata';
import dotenv from 'dotenv';

dotenv.config();

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: "gateway.pinata.cloud"
});

console.log('SDK Methods:');
console.log('pinata:', Object.keys(pinata));
console.log('pinata.upload:', Object.keys(pinata.upload));
console.log('pinata.upload.public:', Object.keys(pinata.upload.public));

// Try different method formats
console.log('\nTesting methods...');

try {
    const testFile = new File(["test"], "test.txt", { type: "text/plain" });
    
    // Method 1: pinata.upload.public.file()
    try {
        console.log('Trying: pinata.upload.public.file()');
        const result1 = await pinata.upload.public.file(testFile);
        console.log('✅ Success with pinata.upload.public.file():', result1);
    } catch (e) {
        console.log('❌ Failed pinata.upload.public.file():', e.message);
    }
    
    // Method 2: pinata.upload.file()
    try {
        console.log('Trying: pinata.upload.file()');
        const result2 = await pinata.upload.file(testFile);
        console.log('✅ Success with pinata.upload.file():', result2);
    } catch (e) {
        console.log('❌ Failed pinata.upload.file():', e.message);
    }

} catch (error) {
    console.error('Error:', error.message);
}