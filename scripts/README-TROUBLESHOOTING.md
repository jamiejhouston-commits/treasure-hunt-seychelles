Troubleshooting upload_ipfs.js

- .env loading: The script resolves its own directory and loads .env and .env.local from scripts/.
- Token: NFT_STORAGE_TOKEN is trimmed; we print masked length and preflight the token via https://api.nft.storage/user before uploading.
- Limits: Set UPLOAD_LIMIT in scripts/.env.local to restrict batch size for testing.
- Errors: Full stack traces are printed, including response status if available.
