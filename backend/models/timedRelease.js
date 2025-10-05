/**
 * Timed Release System for NFT Chapters
 * Controls when NFTs become available based on revenue thresholds
 * Ensures puzzles cannot be solved until costs are covered + profit made
 */

const db = require('../database/connection');

class TimedReleaseSystem {
  constructor() {
    // Chapter 1 configuration ($500 prize)
    this.chapter1Config = {
      prizeAmount: 500,
      minProfitRequired: 500, // We want at least $500 profit
      phases: [
        {
          phase: 1,
          nftRange: [1, 7],     // NFTs 1-7
          revenueThreshold: 0,   // Available immediately
          description: 'Initial release - puzzle unsolvable'
        },
        {
          phase: 2,
          nftRange: [8, 14],    // NFTs 8-14
          revenueThreshold: 1000, // Unlock after $1,000 revenue
          description: 'Mid release - getting closer'
        },
        {
          phase: 3,
          nftRange: [15, 20],   // NFTs 15-20
          revenueThreshold: 2000, // Unlock after $2,000 revenue
          description: 'Final release - puzzle now solvable'
        }
      ]
    };

    // Chapter 2 configuration ($750 prize)
    this.chapter2Config = {
      prizeAmount: 750,
      minProfitRequired: 750,
      phases: [
        {
          phase: 1,
          nftRange: [21, 27],   // NFTs 21-27 (has cipher #25 but no key)
          revenueThreshold: 0,   // Available immediately
          description: 'Initial release - missing key pieces'
        },
        {
          phase: 2,
          nftRange: [28, 35],   // NFTs 28-35 (has map #32 but still no key)
          revenueThreshold: 1500, // Unlock after $1,500 revenue
          description: 'Mid release - still missing critical pieces'
        },
        {
          phase: 3,
          nftRange: [36, 40],   // NFTs 36-40 (key #37 finally available!)
          revenueThreshold: 2500, // Unlock after $2,500 revenue
          description: 'Final release - all pieces available'
        }
      ]
    };

    this.nftPrice = 200; // $200 per NFT
  }

  /**
   * Get current revenue for a chapter
   */
  async getChapterRevenue(chapter) {
    const startId = chapter === 1 ? 1 : 21;
    const endId = chapter === 1 ? 20 : 40;

    const result = await db('nfts')
      .whereBetween('token_id', [startId, endId])
      .whereNotNull('current_owner')
      .count('* as sold')
      .first();

    return (result.sold || 0) * this.nftPrice;
  }

  /**
   * Get available NFTs based on current revenue
   */
  async getAvailableNFTs(chapter) {
    const revenue = await this.getChapterRevenue(chapter);
    const config = chapter === 1 ? this.chapter1Config : this.chapter2Config;

    const availableIds = [];

    for (const phase of config.phases) {
      if (revenue >= phase.revenueThreshold) {
        // Add all NFTs in this phase
        for (let id = phase.nftRange[0]; id <= phase.nftRange[1]; id++) {
          availableIds.push(id);
        }
      }
    }

    return availableIds;
  }

  /**
   * Check if a specific NFT is currently available for purchase
   */
  async isNFTAvailable(tokenId) {
    const chapter = tokenId <= 20 ? 1 : 2;
    const availableIds = await this.getAvailableNFTs(chapter);
    return availableIds.includes(tokenId);
  }

  /**
   * Get current phase information for a chapter
   */
  async getChapterPhaseInfo(chapter) {
    const revenue = await this.getChapterRevenue(chapter);
    const config = chapter === 1 ? this.chapter1Config : this.chapter2Config;

    let currentPhase = 1;
    let nextThreshold = null;
    let unlockedNFTs = [];
    let lockedNFTs = [];

    for (let i = 0; i < config.phases.length; i++) {
      const phase = config.phases[i];

      if (revenue >= phase.revenueThreshold) {
        currentPhase = phase.phase;
        // Add to unlocked
        for (let id = phase.nftRange[0]; id <= phase.nftRange[1]; id++) {
          unlockedNFTs.push(id);
        }
      } else {
        if (!nextThreshold) {
          nextThreshold = phase.revenueThreshold;
        }
        // Add to locked
        for (let id = phase.nftRange[0]; id <= phase.nftRange[1]; id++) {
          lockedNFTs.push(id);
        }
      }
    }

    return {
      chapter,
      currentPhase,
      currentRevenue: revenue,
      nextThreshold,
      revenueToNextPhase: nextThreshold ? nextThreshold - revenue : 0,
      unlockedNFTs,
      lockedNFTs,
      prizeAmount: config.prizeAmount,
      profitSoFar: revenue - config.prizeAmount,
      isPuzzleSolvable: currentPhase === 3 // Only solvable in final phase
    };
  }

  /**
   * Mark NFTs as locked/unlocked in database
   */
  async updateNFTAvailability() {
    // Chapter 1
    const chapter1Available = await this.getAvailableNFTs(1);
    await db('nfts')
      .whereBetween('token_id', [1, 20])
      .update({ is_locked: true });

    if (chapter1Available.length > 0) {
      await db('nfts')
        .whereIn('token_id', chapter1Available)
        .update({ is_locked: false });
    }

    // Chapter 2
    const chapter2Available = await this.getAvailableNFTs(2);
    await db('nfts')
      .whereBetween('token_id', [21, 40])
      .update({ is_locked: true });

    if (chapter2Available.length > 0) {
      await db('nfts')
        .whereIn('token_id', chapter2Available)
        .update({ is_locked: false });
    }

    console.log(`✅ Updated NFT availability - Ch1: ${chapter1Available.length}/20, Ch2: ${chapter2Available.length}/20 unlocked`);
  }
}

module.exports = new TimedReleaseSystem();