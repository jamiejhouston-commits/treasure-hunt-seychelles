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

/**
 * GET /api/progress/puzzle
 * Get user's puzzle completion progress
 * Shows which puzzle pieces they have and which are missing
 */
router.get('/puzzle', actionLimiter, [
  query('wallet_address').isString().custom(isValidXRPLAddress),
  query('chapter').optional().isString().isLength({ max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { wallet_address, chapter = 'Chapter 1' } = req.query;
    const safeWallet = sanitizeWallet(wallet_address);

    // Get user's NFTs in this chapter
    const ownedNFTs = await db('nfts')
      .where('current_owner', safeWallet)
      .where('chapter', chapter)
      .select('token_id', 'name', 'rarity', 'image_uri', 'clue_data', 'attributes');

    // Filter to puzzle NFTs only
    const puzzleNFTs = ownedNFTs.filter(nft => {
      try {
        const attrs = typeof nft.attributes === 'string' ? JSON.parse(nft.attributes) : nft.attributes;
        return attrs && attrs.some(attr => attr.trait_type === 'Has Puzzle' && attr.value === 'Yes');
      } catch {
        return false;
      }
    });

    // Organize by clue type
    const piecesByType = {
      cipher: null,
      map: null,
      key: null,
      coordinates: null
    };

    puzzleNFTs.forEach(nft => {
      try {
        const clueData = typeof nft.clue_data === 'string' ? JSON.parse(nft.clue_data) : nft.clue_data;
        if (clueData && clueData.type) {
          piecesByType[clueData.type] = {
            token_id: nft.token_id,
            name: nft.name,
            rarity: nft.rarity,
            image_uri: nft.image_uri,
            clue_type: clueData.type
          };
        }
      } catch {}
    });

    const ownedCount = Object.values(piecesByType).filter(p => p !== null).length;
    const totalPieces = 4;
    const canSubmit = ownedCount === totalPieces;

    res.json({
      chapter,
      pieces: piecesByType,
      progress: {
        owned: ownedCount,
        total: totalPieces,
        percentage: Math.round((ownedCount / totalPieces) * 100),
        can_submit: canSubmit
      }
    });

  } catch (error) {
    logger.error('Error fetching puzzle progress:', error);
    res.status(500).json({ error: 'Failed to fetch puzzle progress' });
  }
});

/**
 * GET /api/progress/rarity
 * Get user's rarity collection progress
 * Shows which rarities they have and which are missing
 */
router.get('/rarity', actionLimiter, [
  query('wallet_address').isString().custom(isValidXRPLAddress),
  query('chapter').optional().isString().isLength({ max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { wallet_address, chapter = 'Chapter 1' } = req.query;
    const safeWallet = sanitizeWallet(wallet_address);

    // Get user's NFTs in this chapter
    const ownedNFTs = await db('nfts')
      .where('current_owner', safeWallet)
      .where('chapter', chapter)
      .select('token_id', 'name', 'rarity', 'image_uri');

    // Organize by rarity (one example of each)
    const rarityCollection = {
      Common: [],
      Uncommon: [],
      Rare: [],
      Epic: []
    };

    ownedNFTs.forEach(nft => {
      if (rarityCollection[nft.rarity]) {
        rarityCollection[nft.rarity].push({
          token_id: nft.token_id,
          name: nft.name,
          rarity: nft.rarity,
          image_uri: nft.image_uri
        });
      }
    });

    const ownedRarities = Object.keys(rarityCollection).filter(r => rarityCollection[r].length > 0);
    const totalRarities = 4;
    const canClaim = ownedRarities.length === totalRarities;

    res.json({
      chapter,
      collection: rarityCollection,
      progress: {
        owned_rarities: ownedRarities.length,
        total_rarities: totalRarities,
        percentage: Math.round((ownedRarities.length / totalRarities) * 100),
        can_claim_reward: canClaim,
        reward: canClaim ? '50% discount on Chapter 2' : null
      }
    });

  } catch (error) {
    logger.error('Error fetching rarity progress:', error);
    res.status(500).json({ error: 'Failed to fetch rarity progress' });
  }
});

/**
 * GET /api/progress/overview
 * Get complete overview of user's collection and progress
 */
router.get('/overview', actionLimiter, [
  query('wallet_address').isString().custom(isValidXRPLAddress)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { wallet_address } = req.query;
    const safeWallet = sanitizeWallet(wallet_address);

    // Get all NFTs owned by user
    const allNFTs = await db('nfts')
      .where('current_owner', safeWallet)
      .select('token_id', 'name', 'chapter', 'rarity', 'image_uri', 'clue_data', 'attributes');

    // Count by chapter
    const byChapter = {};
    allNFTs.forEach(nft => {
      if (!byChapter[nft.chapter]) {
        byChapter[nft.chapter] = [];
      }
      byChapter[nft.chapter].push(nft);
    });

    // Check puzzle submission status
    const submissions = await db('puzzle_submissions')
      .where('wallet_address', safeWallet)
      .orderBy('submitted_at', 'desc')
      .limit(5)
      .select('chapter', 'is_correct', 'submitted_at');

    res.json({
      total_nfts: allNFTs.length,
      chapters: Object.keys(byChapter).map(chapter => ({
        chapter,
        nft_count: byChapter[chapter].length
      })),
      recent_submissions: submissions,
      wallet: safeWallet.substring(0, 6) + '...' + safeWallet.substring(safeWallet.length - 4)
    });

  } catch (error) {
    logger.error('Error fetching progress overview:', error);
    res.status(500).json({ error: 'Failed to fetch progress overview' });
  }
});

module.exports = router;
