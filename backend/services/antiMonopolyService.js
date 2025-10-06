/**
 * Anti-Monopoly Service
 * Prevents single wallets from hoarding all puzzle pieces
 * Redistributes puzzle coordinates when monopoly is detected
 */

const db = require('../database/connection');

class AntiMonopolyService {
  constructor() {
    // Monopoly thresholds per chapter
    this.monopolyThresholds = {
      1: 4, // Chapter 1: Lock if wallet owns 4+ out of 7 puzzle NFTs
      2: 3  // Chapter 2: Lock if wallet owns 3+ out of 4 puzzle NFTs
    };

    // Puzzle NFT assignments
    this.puzzleNFTs = {
      1: [3, 5, 8, 12, 15, 17, 20], // Chapter 1 puzzle cards
      2: [25, 28, 32, 37]            // Chapter 2 puzzle cards
    };

    // Relocation targets (non-puzzle NFTs to receive duplicate coordinates)
    this.relocationTargets = {
      1: [7, 11],  // Chapter 1: NFT #7 and #11 become backup puzzle holders
      2: [29, 35]  // Chapter 2: NFT #29 and #35 become backup puzzle holders
    };
  }

  /**
   * Check if a wallet has a monopoly on puzzle pieces
   */
  async checkMonopoly(walletAddress, chapter) {
    if (!walletAddress || !chapter) return false;

    const puzzleNFTs = this.puzzleNFTs[chapter];
    if (!puzzleNFTs) return false;

    // Count how many puzzle NFTs this wallet owns
    const ownedCount = await db('nfts')
      .whereIn('token_id', puzzleNFTs)
      .where('current_owner', walletAddress)
      .count('* as count')
      .first();

    const threshold = this.monopolyThresholds[chapter];
    const hasMonopoly = (ownedCount.count || 0) >= threshold;

    if (hasMonopoly) {
      console.log(`⚠️ Anti-monopoly triggered: Wallet ${walletAddress} owns ${ownedCount.count}/${puzzleNFTs.length} puzzle pieces in Chapter ${chapter}`);
    }

    return hasMonopoly;
  }

  /**
   * Lock puzzle layers for a monopoly wallet
   */
  async lockPuzzleLayers(walletAddress, chapter) {
    const puzzleNFTs = this.puzzleNFTs[chapter];
    if (!puzzleNFTs) return false;

    // Get all puzzle NFTs owned by this wallet
    const ownedNFTs = await db('nfts')
      .whereIn('token_id', puzzleNFTs)
      .where('current_owner', walletAddress)
      .select('token_id', 'layers');

    // Mark layers as monopoly-locked
    for (const nft of ownedNFTs) {
      const layers = JSON.parse(nft.layers || '[]');
      const updatedLayers = layers.map(layer => ({
        ...layer,
        monopolyLocked: true,
        monopolyMessage: '⚠️ Anti-monopoly protection active. Puzzle pieces have been redistributed.'
      }));

      await db('nfts')
        .where('token_id', nft.token_id)
        .update({
          layers: JSON.stringify(updatedLayers),
          monopoly_locked: true
        });
    }

    console.log(`🔒 Locked ${ownedNFTs.length} puzzle layers for wallet ${walletAddress}`);
    return true;
  }

  /**
   * Relocate puzzle pieces to non-puzzle NFTs
   */
  async relocatePuzzlePieces(chapter) {
    const targets = this.relocationTargets[chapter];
    if (!targets || targets.length < 2) return false;

    // For Chapter 1: Duplicate coordinates from NFT #12 and #17 to NFT #7 and #11
    // For Chapter 2: Duplicate coordinates from NFT #25 and #32 to NFT #29 and #35
    const sourceNFTs = chapter === 1 ? [12, 17] : [25, 32];

    for (let i = 0; i < sourceNFTs.length; i++) {
      const sourceId = sourceNFTs[i];
      const targetId = targets[i];

      // Get source NFT layers
      const sourceNFT = await db('nfts').where('token_id', sourceId).first();
      if (!sourceNFT) continue;

      const sourceLayers = JSON.parse(sourceNFT.layers || '[]');
      const puzzleLayer = sourceLayers.find(l => l.layer > 0);

      if (puzzleLayer) {
        // Get target NFT
        const targetNFT = await db('nfts').where('token_id', targetId).first();
        if (!targetNFT) continue;

        const targetLayers = JSON.parse(targetNFT.layers || '[]');

        // Add relocated puzzle layer
        targetLayers.push({
          ...puzzleLayer,
          relocated: true,
          description: `Relocated from NFT #${sourceId} (Anti-monopoly protection)`
        });

        await db('nfts')
          .where('token_id', targetId)
          .update({ layers: JSON.stringify(targetLayers) });

        console.log(`📦 Relocated puzzle piece from NFT #${sourceId} to NFT #${targetId}`);
      }
    }

    return true;
  }

  /**
   * Reverse monopoly lock if wallet sells down puzzle pieces
   */
  async reverseMonopoly(walletAddress, chapter) {
    const puzzleNFTs = this.puzzleNFTs[chapter];
    if (!puzzleNFTs) return false;

    // Check if wallet still has monopoly
    const hasMonopoly = await this.checkMonopoly(walletAddress, chapter);
    if (hasMonopoly) {
      return false; // Still has too many pieces
    }

    // Get all NFTs that were locked for this wallet
    const lockedNFTs = await db('nfts')
      .whereIn('token_id', puzzleNFTs)
      .where('current_owner', walletAddress)
      .where('monopoly_locked', true)
      .select('token_id', 'layers');

    // Unlock layers
    for (const nft of lockedNFTs) {
      const layers = JSON.parse(nft.layers || '[]');
      const updatedLayers = layers.map(layer => {
        const { monopolyLocked, monopolyMessage, ...cleanLayer } = layer;
        return cleanLayer;
      });

      await db('nfts')
        .where('token_id', nft.token_id)
        .update({
          layers: JSON.stringify(updatedLayers),
          monopoly_locked: false
        });
    }

    // Remove relocated pieces (optional - keep them for fairness)
    // const targets = this.relocationTargets[chapter];
    // ... (implementation if needed)

    console.log(`🔓 Unlocked ${lockedNFTs.length} puzzle layers for wallet ${walletAddress}`);
    return true;
  }

  /**
   * Get monopoly status for a wallet in a chapter
   */
  async getMonopolyStatus(walletAddress, chapter) {
    if (!walletAddress || !chapter) return null;

    const hasMonopoly = await this.checkMonopoly(walletAddress, chapter);
    const puzzleNFTs = this.puzzleNFTs[chapter];

    const ownedCount = await db('nfts')
      .whereIn('token_id', puzzleNFTs)
      .where('current_owner', walletAddress)
      .count('* as count')
      .first();

    return {
      chapter,
      walletAddress,
      hasMonopoly,
      ownedPuzzlePieces: ownedCount.count || 0,
      totalPuzzlePieces: puzzleNFTs.length,
      monopolyThreshold: this.monopolyThresholds[chapter],
      message: hasMonopoly
        ? '⚠️ You own too many puzzle pieces. Anti-monopoly protection is active.'
        : null
    };
  }
}

module.exports = new AntiMonopolyService();
