import { PinataSDK } from 'pinata';

const sdk = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });
console.log('SDK keys:', Object.keys(sdk));
if (sdk.upload) {
  console.log('upload namespace keys:', Object.keys(sdk.upload));
}
if (sdk.pinning) {
  console.log('pinning namespace keys:', Object.keys(sdk.pinning));
}