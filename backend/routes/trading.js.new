const express = require('express');
const { query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const db = require('../database/connection');
const { logger } = require('../utils/logger');

const router = express.Router();

// Rate limiter
const actionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: 'Too many requests, please slow down'
});

// Validate XRPL wallet address format
const isValidXRPLAddress = (address) => {
  return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address);
};

// Sanitize wallet addresses
const sanitizeWallet = (wallet) => {
  if (!isValidXRPLAddress(wallet)) {
    throw new Error('Invalid wallet address format');
  }
  return wallet.trim();
};

// Mask wallet address for privacy
function maskWallet(wallet) {
  if (!wallet || wallet.length < 10) return wallet;
  return wallet.substring(0, 6) + '...' + wallet.substring(wallet.length - 4);
}

/**
 * GET /api/trading/find-missing-pieces
 * Find NFTs user needs to complete puzzle or rarity collection
 * SECURITY: Rate limited, wallet validation, privacy-protected
 */
router.get('/find-missing-pieces', actionLimiter, [
  query('wallet_address').isString().custom(isValidXRPLAddress),
  query('search_type').isIn(['puzzle', 'rarity']),
  query('chapter').optional().isString().isLength({ max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { wallet_address, search_type, chapter = 'Chapter 1' } = req.query;
    const safeWallet = sanitizeWallet(wallet_address);

    // Get NFTs owned by user in this chapter
    const ownedNFTs = await db('nfts')
      .where('current_owner', safeWallet)
      .where('chapter', chapter)
      .select('token_id', 'rarity', 'clue_data');

    // Get all NFTs in this chapter
    const allChapterNFTs = await db('nfts')
      .where('chapter', chapter)
      .select('token_id', 'name', 'rarity', 'current_owner', 'image_uri', 'clue_data', 'attributes');

    let missingPieces = [];
    let summary = {
      owned_count: ownedNFTs.length,
      missing_count: 0,
      completion_percent: 0
    };

    if (search_type === 'puzzle') {
      // Puzzle pieces: Cipher, Map, Key, Coordinates
      const puzzleNFTs = allChapterNFTs.filter(nft => {
        try {
          const attrs = typeof nft.attributes === 'string' ? JSON.parse(nft.attributes) : nft.attributes;
          return attrs && attrs.some(attr => attr.trait_type === 'Has Puzzle' && attr.value === 'Yes');
        } catch {
          return false;
        }
      });

      // Determine clue types owned by user
      const ownedClueTypes = new Set();
      ownedNFTs.forEach(nft => {
        try {
          const clueData = typeof nft.clue_data === 'string' ? JSON.parse(nft.clue_data) : nft.clue_data;
          if (clueData && clueData.type) {
            ownedClueTypes.add(clueData.type);
          }
        } catch {}
      });

      // Find missing puzzle pieces
      const allPuzzleTypes = ['cipher', 'map', 'key', 'coordinates'];
      const missingTypes = allPuzzleTypes.filter(type => !ownedClueTypes.has(type));

      missingPieces = puzzleNFTs
        .filter(nft => {
          if (nft.current_owner === safeWallet) return false; // Already own it
          try {
            const clueData = typeof nft.clue_data === 'string' ? JSON.parse(nft.clue_data) : nft.clue_data;
            return clueData && missingTypes.includes(clueData.type);
          } catch {
            return false;
          }
        })
        .map(nft => {
          const clueData = typeof nft.clue_data === 'string' ? JSON.parse(nft.clue_data) : nft.clue_data;
          return {
            token_id: nft.token_id,
            name: nft.name,
            rarity: nft.rarity,
            current_owner: maskWallet(nft.current_owner),
            current_owner_full: nft.current_owner,
            puzzle_enabled: true,
            clue_type: clueData.type,
            image_uri: nft.image_uri,
            can_make_offer: true
          };
        });

      summary.owned_count = ownedClueTypes.size;
      summary.missing_count = missingTypes.length;
      summary.completion_percent = Math.round((ownedClueTypes.size / allPuzzleTypes.length) * 100);

    } else if (search_type === 'rarity') {
      // Rarity collection: Common, Uncommon, Rare, Epic
      const ownedRarities = new Set(ownedNFTs.map(nft => nft.rarity));
      const allRarities = ['Common', 'Uncommon', 'Rare', 'Epic'];
      const missingRarities = allRarities.filter(r => !ownedRarities.has(r));

      missingPieces = allChapterNFTs
        .filter(nft => {
          if (nft.current_owner === safeWallet) return false; // Already own it
          return missingRarities.includes(nft.rarity);
        })
        .map(nft => ({
          token_id: nft.token_id,
          name: nft.name,
          rarity: nft.rarity,
          current_owner: maskWallet(nft.current_owner),
          current_owner_full: nft.current_owner,
          puzzle_enabled: false,
          image_uri: nft.image_uri,
          can_make_offer: true
        }));

      summary.owned_count = ownedRarities.size;
      summary.missing_count = missingRarities.length;
      summary.completion_percent = Math.round((ownedRarities.size / allRarities.length) * 100);
    }

    res.json({
      missing_pieces: missingPieces,
      summary
    });

  } catch (error) {
    logger.error('Error finding missing pieces:', error);
    res.status(500).json({ error: 'Failed to find missing pieces' });
  }
});

module.exports = router;
