# Prompt 2 Toolchain (Art, Metadata, IPFS, XRPL)

## Prereqs
- Node 18+
- Windows PowerShell (your default)

## Setup
```powershell
cd scripts
copy .env.example .env  # then edit with your values
npm install
```

Required env in `.env`:
- `SUPPLY` – how many to generate for this run (e.g., 50)
- `IMAGES_DIR` – ../assets/images
- `OUTPUT_DIR` – ./out
- `NFT_STORAGE_TOKEN` – from https://nft.storage (optional; if missing, upload runs dry mode)
- `XRPL_NETWORK` – wss://s.altnet.rippletest.net:51233
- `XRPL_SEED` – testnet seed (fund with the faucet)
- `TRANSFER_FEE_BPS` – 500 for 5%

## Generate Artwork
```powershell
npm run gen:art
```
Outputs `assets/images/<n>.png` and `out/art-manifest.json`.

## Build Metadata
```powershell
npm run build:meta
```
Outputs `out/metadata/*.json` and `out/metadata-index.json`.

## Upload to IPFS (nft.storage)
```powershell
npm run ipfs:upload
```
Writes `out/cids/cid-map.json` with image+metadata URIs. If token missing, writes a dry-run file.

## Mint on XRPL Testnet
```powershell
# Using cid-map produced above
node mint_from_cids.js --limit 5
```
Outputs `out/cids/mint-results.json`.

## Verify on Testnet
- Use https://testnet.xrpl.org and check your account’s NFTs via `account_nfts`.

## Switch to Mainnet
- Set `XRPL_NETWORK=wss://xrplcluster.com` and use a mainnet-funded seed.
- Keep `TRANSFER_FEE_BPS=500` to retain 5% royalty.

## Notes
- The generator is deterministic with `seed`; rerun with same `SUPPLY` and seed to reproduce outputs.
- You can safely scale `SUPPLY` to 1000 after smoke testing with 10–50.
