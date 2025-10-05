import { PinataSDK } from 'pinata';

const sdk = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });
const proto = Object.getPrototypeOf(sdk);
console.log('PinataSDK prototype methods:', Object.getOwnPropertyNames(proto));
