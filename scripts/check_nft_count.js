import 'dotenv/config';
import xrpl from 'xrpl';

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
await client.connect();

const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_TESTNET_SEED);
const nfts = await client.request({
  command: 'account_nfts',
  account: wallet.address
});

console.log('Current NFTs in wallet:', nfts.result.account_nfts?.length || 0);
console.log('Wallet address:', wallet.address);

if (nfts.result.account_nfts?.length > 0) {
  console.log('Sample NFTokenID:', nfts.result.account_nfts[0].NFTokenID);
}

await client.disconnect();