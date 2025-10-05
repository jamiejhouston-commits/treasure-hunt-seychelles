import { PinataSDK } from 'pinata';

const sdk = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });
console.log('upload.public keys:', Object.keys(sdk.upload.public));