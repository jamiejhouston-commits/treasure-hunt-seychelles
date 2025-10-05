# The Treasure of Seychelles - Deployment Guide

## 🚀 Production Deployment Pipeline

This guide covers the complete deployment process for the Treasure of Seychelles NFT collection on XRPL Mainnet.

## Prerequisites

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Required API Keys & Configuration
```env
# XRPL Mainnet Configuration
XRPL_NETWORK=wss://s1.ripple.com
XRPL_WALLET_SEED=your_mainnet_wallet_seed_here
XRPL_ISSUER_ACCOUNT=rYourMainnetAccountHere

# IPFS Configuration
NFT_STORAGE_TOKEN=your_nft_storage_token
# Alternative: Pinata
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret

# Collection Settings
TOTAL_SUPPLY=1000
ROYALTY_PERCENTAGE=500
COLLECTION_NAME=Treasure of Seychelles
COLLECTION_SYMBOL=TOS
```

### 3. Wallet Preparation

**Mainnet Wallet Requirements:**
- Minimum 2000 XRP for minting operations
- Additional 1000 XRP for transaction fees and reserves
- Account must be activated and funded

**Security Checklist:**
- [ ] Use a dedicated minting wallet
- [ ] Store seed phrase securely (hardware wallet recommended)
- [ ] Enable multi-signing for production wallet (optional)
- [ ] Test all operations on Testnet first

## Deployment Steps

### Phase 1: Asset Generation
```bash
# Generate all 1000 NFT images
npm run generate

# Verify generation completed
ls -la assets/images/ | wc -l  # Should show 1000 files
```

**Expected Output:**
- 1000 unique PNG files in `assets/images/`
- `data/generated_traits.json` with complete trait data
- Generation time: ~30-45 minutes

### Phase 2: Metadata Creation
```bash
# Build metadata for all NFTs
npm run metadata

# Verify metadata structure
node -e "console.log(Object.keys(require('./data/complete_metadata.json')[0]))"
```

**Expected Output:**
- Individual metadata files in `data/metadata/`
- Complete metadata collection in `data/complete_metadata.json`
- XLS-20 compliant JSON structure

### Phase 3: IPFS Upload
```bash
# Upload all assets to IPFS
npm run upload

# Verify uploads
node -e "const r = require('./data/ipfs_upload_results.json'); console.log(\`Uploaded \${r.length} NFTs\`);"
```

**Expected Output:**
- All images uploaded to IPFS via nft.storage
- Metadata updated with IPFS image hashes
- `data/ipfs_upload_results.json` with CIDs

**IPFS Verification:**
```bash
# Test random samples
curl -I https://ipfs.io/ipfs/QmYourImageHashHere
curl https://ipfs.io/ipfs/QmYourMetadataHashHere
```

### Phase 4: XRPL Minting

**⚠️ CRITICAL: Switch to Mainnet**
```env
# Update .env file
XRPL_NETWORK=wss://s1.ripple.com
```

**Pre-mint Checklist:**
- [ ] Wallet has sufficient XRP balance (3000+ XRP recommended)
- [ ] All IPFS assets are accessible
- [ ] Testnet validation completed successfully
- [ ] Backup of all data files created

```bash
# Execute mainnet minting
npm run mint

# Monitor progress
tail -f logs/mint_$(date +%Y%m%d).log
```

**Expected Timeline:**
- Batch size: 5 NFTs per batch
- Delay between batches: 3 seconds
- Total time: ~45-60 minutes for 1000 NFTs
- Total fees: ~10-15 XRP

### Phase 5: Verification
```bash
# Verify all mints
node scripts/batchMint.js --verify-only

# Generate final report
node -e "
const stats = require('./data/mint_results.json');
const successful = stats.filter(s => !s.failed);
console.log(\`✅ Successfully minted: \${successful.length}/1000 NFTs\`);
"
```

## Production Monitoring

### Real-time Monitoring
```bash
# Watch minting progress
watch -n 10 "grep -c '✅' logs/mint_$(date +%Y%m%d).log"

# Monitor XRPL account
xrpl-cli account_nfts rYourAccountAddress
```

### Error Handling
```bash
# Check for failed mints
node -e "
const results = require('./data/mint_results.json');
const failed = results.filter(r => r.failed);
if(failed.length > 0) {
  console.log('❌ Failed mints:', failed.length);
  failed.forEach(f => console.log(\`NFT #\${f.tokenId}: \${f.error}\`));
}
"

# Retry failed mints
node scripts/retryFailedMints.js
```

### Health Checks
```javascript
// Verify random samples
const verifyNFT = async (nftokenID) => {
  const client = new xrpl.Client('wss://s1.ripple.com');
  await client.connect();
  
  const response = await client.request({
    command: 'nft_info', 
    nft_id: nftokenID
  });
  
  console.log('NFT verified:', response.result);
  await client.disconnect();
};
```

## Mainnet vs Testnet Differences

| Component | Testnet | Mainnet |
|-----------|---------|---------|
| Network URL | `wss://s.altnet.rippletest.net:51233` | `wss://s1.ripple.com` |
| XRP Cost | Free (faucet) | Real XRP required |
| Transaction Fees | ~0.00001 XRP | ~0.00001 XRP |
| Finality | 3-5 seconds | 3-5 seconds |
| Reliability | 99%+ | 99.9%+ |

## Security Considerations

### Wallet Security
- **Cold Storage**: Keep minting wallet offline when not in use
- **Multi-sig**: Consider multi-signature setup for high-value operations  
- **Monitoring**: Set up alerts for unexpected transactions
- **Backup**: Multiple encrypted backups of wallet seed

### IPFS Security
- **Pinning**: Use multiple IPFS providers (nft.storage + Pinata)
- **Verification**: Regularly check IPFS gateway accessibility
- **Backup**: Keep local copies of all uploaded content
- **CDN**: Consider IPFS-enabled CDN for better performance

### Smart Contract Risks
- **Native NFTs**: XRPL's native NFT implementation eliminates smart contract risks
- **Royalties**: Built-in royalty enforcement via TransferFee
- **No Upgrades**: Immutable NFT properties once minted

## Post-Deployment Checklist

### Immediate (Within 1 hour)
- [ ] Verify mint completion (1000/1000 NFTs)
- [ ] Test random IPFS accessibility 
- [ ] Confirm NFT metadata displays correctly
- [ ] Check XRPL explorer for account NFTs
- [ ] Backup all production data

### Short-term (Within 24 hours)  
- [ ] Set up marketplace listings
- [ ] Deploy community platform
- [ ] Launch social media campaigns
- [ ] Monitor IPFS gateway performance
- [ ] Establish customer support channels

### Long-term (Within 1 week)
- [ ] Puzzle mechanics go live
- [ ] Community treasure hunting begins
- [ ] Secondary market monitoring
- [ ] Royalty collection verification
- [ ] Performance analytics setup

## Troubleshooting

### Common Issues

**1. IPFS Upload Failures**
```bash
# Check nft.storage status
curl -H "Authorization: Bearer $NFT_STORAGE_TOKEN" https://api.nft.storage/

# Alternative upload via Pinata
node scripts/uploadIPFS.js --provider pinata
```

**2. XRPL Connection Issues**
```bash
# Test network connectivity
xrpl-cli ping wss://s1.ripple.com

# Check account info
xrpl-cli account_info rYourAccount --network mainnet
```

**3. Insufficient XRP Balance**
```bash
# Check current balance
xrpl-cli balance rYourAccount

# Calculate required XRP
node -e "console.log('Required XRP:', (1000 * 0.00001) + 2000)"
```

**4. Metadata Validation Errors**
```javascript
// Validate metadata schema
const metadata = require('./data/complete_metadata.json')[0];
const required = ['name', 'description', 'image', 'attributes'];
required.forEach(field => {
  if (!metadata[field]) throw new Error(`Missing ${field}`);
});
```

## Support & Resources

### XRPL Resources
- **Documentation**: https://xrpl.org/
- **Explorer**: https://livenet.xrpl.org/
- **Status**: https://status.ripple.com/

### IPFS Resources  
- **NFT.Storage**: https://nft.storage/
- **IPFS Gateway**: https://ipfs.io/
- **Pinata**: https://pinata.cloud/

### Community
- **Discord**: #treasure-of-seychelles
- **GitHub**: https://github.com/seychelles-treasure
- **Website**: https://treasureofseychelles.com

## Emergency Procedures

### Critical Issues
1. **Halt Operations**: Stop all minting immediately
2. **Assess Impact**: Check how many NFTs affected
3. **Community Notice**: Transparent communication
4. **Technical Fix**: Address root cause
5. **Resume**: Continue once validated

### Contact Information
- **Technical Lead**: tech@treasureofseychelles.com
- **Community Manager**: community@treasureofseychelles.com  
- **Emergency**: emergency@treasureofseychelles.com

---

*This deployment guide ensures professional-grade execution of the Treasure of Seychelles NFT launch. Follow each step carefully and verify results before proceeding to the next phase.*