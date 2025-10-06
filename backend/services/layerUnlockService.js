/**
 * Timed Layer Unlock Service
 * Controls when puzzle layers become visible based on chapter revenue
 * Uses 4X multiplier rule: puzzle solvable at 4X the prize amount
 */

const db = require('../database/connection');

class LayerUnlockService {
  constructor() {
    this.nftPrice = 200; // $200 per NFT

    // Chapter configurations with 4X multiplier rule
    this.chapterConfigs = {
      1: {
        prize: 500,
        solvableAt: 2000, // 4X multiplier
        layerThresholds: {
          5: 600,    // NFT #5 (D) - unlocks at 20% profit minimum
          8: 600,    // NFT #8 (A) - unlocks at 20% profit minimum
          12: 1000,  // NFT #12 (N) - unlocks second phase
          15: 1000,  // NFT #15 (Z) - unlocks second phase
          17: 1500,  // NFT #17 (I) - unlocks third phase (now solvable)
          20: 1500,  // NFT #20 (L) - unlocks third phase (now solvable)
          3: 2000    // NFT #3 (FAKE) - unlocks last (adds confusion)
        }
      },
      2: {
        prize: 750,
        solvableAt: 3000, // 4X multiplier
        layerThresholds: {
          25: 900,   // NFT #25 cipher - unlocks at 20% profit minimum
          32: 1500,  // NFT #32 real map - unlocks second phase
          37: 2250,  // NFT #37 KEY - unlocks LAST (makes puzzle solvable!)
          28: 3000   // NFT #28 fake map - unlocks after solvable (adds confusion)
        }
      },
      3: {
        prize: 1000,
        solvableAt: 4000, // 4X multiplier
        layerThresholds: {} // To be configured when Chapter 3 is ready
      }
    };
  }

  /**
   * Get current revenue for a chapter
   */
  async getChapterRevenue(chapter) {
    let startId, endId;

    switch(chapter) {
      case 1:
        startId = 1;
        endId = 20;
        break;
      case 2:
        startId = 21;
        endId = 40;
        break;
      case 3:
        startId = 41;
        endId = 60;
        break;
      default:
        return 0;
    }

    // Count sold NFTs (those with current_owner)
    const result = await db('nfts')
      .whereBetween('token_id', [startId, endId])
      .whereNotNull('current_owner')
      .count('* as sold')
      .first();

    return (result.sold || 0) * this.nftPrice;
  }

  /**
   * Check if a specific layer is unlocked
   */
  async isLayerUnlocked(tokenId, layerNumber) {
    // Layer 0 (base artwork) is always unlocked
    if (layerNumber === 0) return true;

    // Determine chapter
    const chapter = tokenId <= 20 ? 1 : tokenId <= 40 ? 2 : 3;
    const config = this.chapterConfigs[chapter];

    if (!config || !config.layerThresholds[tokenId]) {
      return false; // No threshold configured = locked
    }

    const currentRevenue = await this.getChapterRevenue(chapter);
    const threshold = config.layerThresholds[tokenId];

    return currentRevenue >= threshold;
  }

  /**
   * Get layer status for an NFT
   */
  async getLayerStatus(tokenId) {
    const nft = await db('nfts').where('token_id', tokenId).first();
    if (!nft) return null;

    const layers = JSON.parse(nft.layers || '[]');
    const chapter = tokenId <= 20 ? 1 : tokenId <= 40 ? 2 : 3;
    const currentRevenue = await this.getChapterRevenue(chapter);
    const config = this.chapterConfigs[chapter];

    // Process each layer
    const layerStatuses = await Promise.all(layers.map(async (layer) => {
      if (layer.layer === 0) {
        // Base artwork always unlocked
        return {
          ...layer,
          isLocked: false,
          unlockThreshold: 0,
          unlockMessage: null
        };
      }

      const threshold = config.layerThresholds[tokenId] || 999999;
      const isLocked = currentRevenue < threshold;
      const amountNeeded = Math.max(0, threshold - currentRevenue);

      return {
        ...layer,
        isLocked,
        unlockThreshold: threshold,
        unlockMessage: isLocked
          ? `Unlocks at $${threshold.toLocaleString()} community sales (Need $${amountNeeded} more)`
          : null
      };
    }));

    return {
      tokenId,
      chapter,
      currentRevenue,
      layers: layerStatuses,
      isPuzzleSolvable: currentRevenue >= config.solvableAt
    };
  }

  /**
   * Get chapter progress info
   */
  async getChapterProgress(chapter) {
    const config = this.chapterConfigs[chapter];
    if (!config) return null;

    const currentRevenue = await this.getChapterRevenue(chapter);
    const soldNFTs = Math.floor(currentRevenue / this.nftPrice);

    // Find next unlock threshold
    let nextUnlock = null;
    let nextUnlockNFT = null;

    for (const [nftId, threshold] of Object.entries(config.layerThresholds)) {
      if (currentRevenue < threshold) {
        if (!nextUnlock || threshold < nextUnlock) {
          nextUnlock = threshold;
          nextUnlockNFT = nftId;
        }
      }
    }

    return {
      chapter,
      currentRevenue,
      soldNFTs,
      totalNFTs: 20,
      prizeAmount: config.prize,
      solvableAt: config.solvableAt,
      isPuzzleSolvable: currentRevenue >= config.solvableAt,
      profitSoFar: currentRevenue - config.prize,
      nextUnlockThreshold: nextUnlock,
      nextUnlockNFT,
      amountToNextUnlock: nextUnlock ? nextUnlock - currentRevenue : 0,
      amountUntilSolvable: Math.max(0, config.solvableAt - currentRevenue),
      progressPercent: Math.min(100, (currentRevenue / config.solvableAt) * 100)
    };
  }

  /**
   * Update layer data in database with lock status
   */
  async updateLayerLockStatus() {
    // Process Chapter 1
    for (const tokenId of [3, 5, 8, 12, 15, 17, 20]) {
      const layerStatus = await this.getLayerStatus(tokenId);
      if (!layerStatus) continue;

      const nft = await db('nfts').where('token_id', tokenId).first();
      const layers = JSON.parse(nft.layers || '[]');

      // Update each layer with lock status
      const updatedLayers = layers.map((layer, idx) => {
        const status = layerStatus.layers[idx];
        return {
          ...layer,
          isLocked: status.isLocked,
          unlockThreshold: status.unlockThreshold
        };
      });

      await db('nfts')
        .where('token_id', tokenId)
        .update({ layers: JSON.stringify(updatedLayers) });
    }

    // Process Chapter 2
    for (const tokenId of [25, 28, 32, 37]) {
      const layerStatus = await this.getLayerStatus(tokenId);
      if (!layerStatus) continue;

      const nft = await db('nfts').where('token_id', tokenId).first();
      const layers = JSON.parse(nft.layers || '[]');

      const updatedLayers = layers.map((layer, idx) => {
        const status = layerStatus.layers[idx];
        return {
          ...layer,
          isLocked: status.isLocked,
          unlockThreshold: status.unlockThreshold
        };
      });

      await db('nfts')
        .where('token_id', tokenId)
        .update({ layers: JSON.stringify(updatedLayers) });
    }

    console.log('✅ Updated layer lock statuses');
  }
}

module.exports = new LayerUnlockService();