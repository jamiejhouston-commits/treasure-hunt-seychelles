import { PinataSDK } from 'pinata';

const sdk = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });
console.dir(sdk.upload, { depth: 4 });