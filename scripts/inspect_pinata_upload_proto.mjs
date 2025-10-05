import 'dotenv/config';
import { PinataSDK } from 'pinata';

const sdk = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });
const proto = Object.getPrototypeOf(sdk.upload);
console.log('upload proto methods:', Object.getOwnPropertyNames(proto));
const publicProto = Object.getPrototypeOf(sdk.upload.public);
console.log('upload.public proto methods:', Object.getOwnPropertyNames(publicProto));