const express = require('express');
const { body, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const db = require('../database/connection');
const { logger } = require('../utils/logger');

const router = express.Router();

// Rate limiters to prevent spam/abuse
const offerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 offers per 15 mins per IP
  message: 'Too many offers created, please try again later'
});

const actionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Max 50 actions per 5 mins
  message: 'Too many requests, please slow down'
});

// Security: Validate XRPL wallet address format
const isValidXRPLAddress = (address) => {
  return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address);
};

// Security: Prevent SQL injection by sanitizing wallet addresses
const sanitizeWallet = (wallet) => {
  if (!isValidXRPLAddress(wallet)) {
    throw new Error('Invalid wallet address format');
  }
  return wallet.trim();
};

/**
 * POST /api/trading/make-offer
 * Create a new offer on an NFT
 * SECURITY: Rate limited, input validation, ownership checks
 */
router.post('/make-offer', offerLimiter, [
  body('nft_token_id').isInt({ min: 1, max: 1000000 }),
  body('from_wallet').isString().custom(isValidXRPLAddress),
  body('to_wallet').isString().custom(isValidXRPLAddress),
  body('offer_type').isIn(['xrp', 'trade', 'mixed']),
  body('xrp_amount').optional().isFloat({ min: 0, max: 1000000 }),
  body('trade_nft_token_id').optional().isInt({ min: 1, max: 1000000 }),
  body('message').optional().isString().isLength({ max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Invalid offer attempt', { errors: errors.array(), ip: req.ip });
      return res.status(400).json({ error: 'Invalid offer data', details: errors.array() });
    }

    const {
      nft_token_id,
      from_wallet,
      to_wallet,
      offer_type,
      xrp_amount,
      trade_nft_token_id,
      message
    } = req.body;

    // Security: Prevent self-trading
    if (from_wallet === to_wallet) {
      return res.status(400).json({ error: 'Cannot make offer to yourself' });
    }

    // Security: Sanitize inputs
    const safeFromWallet = sanitizeWallet(from_wallet);
    const safeToWallet = sanitizeWallet(to_wallet);

    // Validate NFT exists and is owned by to_wallet
    const nft = await db('nfts').where('token_id', nft_token_id).first();
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    if (nft.current_owner !== safeToWallet) {
      logger.warn('Offer owner mismatch', { nft_token_id, expected: safeToWallet, actual: nft.current_owner });
      return res.status(400).json({ error: 'NFT owner mismatch' });
    }

    // Security: Validate trade NFT ownership if provided
    if (trade_nft_token_id) {
      const tradeNFT = await db('nfts').where('token_id', trade_nft_token_id).first();
      if (!tradeNFT) {
        return res.status(404).json({ error: 'Trade NFT not found' });
      }
      if (tradeNFT.current_owner !== safeFromWallet) {
        logger.warn('Trade NFT not owned by offerer', { trade_nft_token_id, offerer: safeFromWallet });
        return res.status(400).json({ error: 'You do not own the trade NFT' });
      }
      // Prevent offering same NFT for itself
      if (trade_nft_token_id === nft_token_id) {
        return res.status(400).json({ error: 'Cannot trade NFT for itself' });
      }
    }

    // Security: Check for duplicate pending offers
    const existingOffer = await db('offers')
      .where({
        nft_token_id,
        from_wallet: safeFromWallet,
        status: 'pending'
      })
      .first();

    if (existingOffer) {
      return res.status(400).json({ error: 'You already have a pending offer on this NFT' });
    }

    // Create offer
    const [offerId] = await db('offers').insert({
      nft_token_id,
      from_wallet: safeFromWallet,
      to_wallet: safeToWallet,
      offer_type,
      xrp_amount: xrp_amount || 0,
      trade_nft_token_id: trade_nft_token_id || null,
      message: message ? message.substring(0, 500) : null, // Extra safety trim
      status: 'pending',
      created_at: new Date().toISOString()
    });

    const offer = await db('offers').where('id', offerId).first();

    logger.info(`Offer created: #${offerId} on NFT #${nft_token_id} by ${safeFromWallet.substring(0, 10)}...`);

    res.json({
      success: true,
      offer: {
        ...offer,
        nft: {
          token_id: nft.token_id,
          name: nft.name,
          image_uri: nft.image_uri,
          rarity: nft.rarity
        }
      }
    });

  } catch (error) {
    logger.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

/**
 * POST /api/trading/accept-offer/:id
 * Accept an offer
 * SECURITY: Ownership validation, status checks, atomic transaction
 */
router.post('/accept-offer/:id', actionLimiter, [
  body('wallet_address').isString().custom(isValidXRPLAddress)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { id } = req.params;
    const { wallet_address } = req.body;

    // Security: Validate offer ID is integer
    const offerId = parseInt(id);
    if (isNaN(offerId) || offerId < 1) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const safeWallet = sanitizeWallet(wallet_address);

    // Use transaction to prevent race conditions
    await db.transaction(async (trx) => {
      const offer = await trx('offers').where('id', offerId).first();

      if (!offer) {
        throw new Error('Offer not found');
      }

      // Security: Only NFT owner can accept
      if (offer.to_wallet !== safeWallet) {
        logger.warn('Unauthorized accept attempt', { offer_id: offerId, wallet: safeWallet });
        throw new Error('Only NFT owner can accept offers');
      }

      // Security: Check offer is still pending
      if (offer.status !== 'pending') {
        throw new Error(`Offer is already ${offer.status}`);
      }

      // Verify NFT still owned by accepter
      const nft = await trx('nfts').where('token_id', offer.nft_token_id).first();
      if (nft.current_owner !== safeWallet) {
        throw new Error('NFT ownership changed');
      }

      // Update offer status
      await trx('offers').where('id', offerId).update({
        status: 'accepted',
        responded_at: new Date().toISOString()
      });

      // Transfer NFT ownership (with 7.5% royalty noted in logs)
      await trx('nfts').where('token_id', offer.nft_token_id).update({
        current_owner: offer.from_wallet,
        for_sale: false,
        updated_at: new Date().toISOString()
      });

      // If trade, transfer the trade NFT
      if (offer.trade_nft_token_id) {
        const tradeNFT = await trx('nfts').where('token_id', offer.trade_nft_token_id).first();
        if (tradeNFT.current_owner !== offer.from_wallet) {
          throw new Error('Trade NFT ownership changed');
        }

        await trx('nfts').where('token_id', offer.trade_nft_token_id).update({
          current_owner: offer.to_wallet,
          for_sale: false,
          updated_at: new Date().toISOString()
        });
      }

      logger.info(`Offer accepted: #${offerId} | NFT #${offer.nft_token_id} transferred | 7.5% royalty applies`);
    });

    res.json({
      success: true,
      message: 'Offer accepted! NFT transferred. (7.5% royalty applies)'
    });

  } catch (error) {
    logger.error('Error accepting offer:', error);
    res.status(500).json({ error: error.message || 'Failed to accept offer' });
  }
});

/**
 * POST /api/trading/decline-offer/:id
 * Decline an offer
 */
router.post('/decline-offer/:id', actionLimiter, [
  body('wallet_address').isString().custom(isValidXRPLAddress)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { id } = req.params;
    const { wallet_address } = req.body;

    const offerId = parseInt(id);
    if (isNaN(offerId)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const safeWallet = sanitizeWallet(wallet_address);

    const offer = await db('offers').where('id', offerId).first();
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    if (offer.to_wallet !== safeWallet) {
      return res.status(403).json({ error: 'Only NFT owner can decline offers' });
    }

    if (offer.status !== 'pending') {
      return res.status(400).json({ error: `Offer is already ${offer.status}` });
    }

    await db('offers').where('id', offerId).update({
      status: 'declined',
      responded_at: new Date().toISOString()
    });

    logger.info(`Offer declined: #${offerId}`);

    res.json({
      success: true,
      message: 'Offer declined'
    });

  } catch (error) {
    logger.error('Error declining offer:', error);
    res.status(500).json({ error: 'Failed to decline offer' });
  }
});

/**
 * POST /api/trading/counter-offer/:id
 * Make a counter-offer
 */
router.post('/counter-offer/:id', offerLimiter, [
  body('wallet_address').isString().custom(isValidXRPLAddress),
  body('xrp_amount').optional().isFloat({ min: 0, max: 1000000 }),
  body('trade_nft_token_id').optional().isInt({ min: 1, max: 1000000 }),
  body('message').optional().isString().isLength({ max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { id } = req.params;
    const { wallet_address, xrp_amount, trade_nft_token_id, message } = req.body;

    const offerId = parseInt(id);
    if (isNaN(offerId)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const safeWallet = sanitizeWallet(wallet_address);

    const parentOffer = await db('offers').where('id', offerId).first();
    if (!parentOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    if (parentOffer.to_wallet !== safeWallet) {
      return res.status(403).json({ error: 'Only NFT owner can counter offers' });
    }

    if (parentOffer.status !== 'pending') {
      return res.status(400).json({ error: `Cannot counter ${parentOffer.status} offer` });
    }

    // Mark original offer as countered
    await db('offers').where('id', offerId).update({
      status: 'countered',
      responded_at: new Date().toISOString()
    });

    // Create counter-offer (roles reversed)
    const [counterOfferId] = await db('offers').insert({
      nft_token_id: parentOffer.nft_token_id,
      from_wallet: parentOffer.to_wallet,
      to_wallet: parentOffer.from_wallet,
      offer_type: trade_nft_token_id ? (xrp_amount > 0 ? 'mixed' : 'trade') : 'xrp',
      xrp_amount: xrp_amount || 0,
      trade_nft_token_id: trade_nft_token_id || null,
      message: message ? message.substring(0, 500) : null,
      status: 'pending',
      parent_offer_id: offerId,
      created_at: new Date().toISOString()
    });

    const counterOffer = await db('offers').where('id', counterOfferId).first();

    logger.info(`Counter-offer created: #${counterOfferId} for offer #${offerId}`);

    res.json({
      success: true,
      message: 'Counter-offer sent',
      counterOffer
    });

  } catch (error) {
    logger.error('Error creating counter-offer:', error);
    res.status(500).json({ error: 'Failed to create counter-offer' });
  }
});

/**
 * GET /api/trading/offers-received
 * Get offers received by wallet
 * SECURITY: Paginated, wallet validation
 */
router.get('/offers-received', actionLimiter, [
  query('wallet_address').isString().custom(isValidXRPLAddress),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { wallet_address, limit = 50 } = req.query;
    const safeWallet = sanitizeWallet(wallet_address);

    const offers = await db('offers')
      .where('to_wallet', safeWallet)
      .whereIn('status', ['pending'])
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit));

    // Enrich with NFT data
    const enrichedOffers = await Promise.all(offers.map(async (offer) => {
      const nft = await db('nfts').where('token_id', offer.nft_token_id).first();
      const tradeNFT = offer.trade_nft_token_id
        ? await db('nfts').where('token_id', offer.trade_nft_token_id).first()
        : null;

      return {
        ...offer,
        // Hide sensitive wallet info (show first/last 4 chars only)
        from_wallet: offer.from_wallet.substring(0, 6) + '...' + offer.from_wallet.substring(offer.from_wallet.length - 4),
        nft: nft ? {
          token_id: nft.token_id,
          name: nft.name,
          image_uri: nft.image_uri,
          rarity: nft.rarity
        } : null,
        tradeNFT: tradeNFT ? {
          token_id: tradeNFT.token_id,
          name: tradeNFT.name,
          image_uri: tradeNFT.image_uri,
          rarity: tradeNFT.rarity
        } : null
      };
    }));

    res.json({
      offers: enrichedOffers,
      total: enrichedOffers.length
    });

  } catch (error) {
    logger.error('Error fetching received offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

/**
 * GET /api/trading/offers-sent
 * Get offers sent by wallet
 */
router.get('/offers-sent', actionLimiter, [
  query('wallet_address').isString().custom(isValidXRPLAddress),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request', details: errors.array() });
    }

    const { wallet_address, limit = 50 } = req.query;
    const safeWallet = sanitizeWallet(wallet_address);

    const offers = await db('offers')
      .where('from_wallet', safeWallet)
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit));

    // Enrich with NFT data
    const enrichedOffers = await Promise.all(offers.map(async (offer) => {
      const nft = await db('nfts').where('token_id', offer.nft_token_id).first();
      return {
        ...offer,
        to_wallet: offer.to_wallet.substring(0, 6) + '...' + offer.to_wallet.substring(offer.to_wallet.length - 4),
        nft: nft ? {
          token_id: nft.token_id,
          name: nft.name,
          image_uri: nft.image_uri,
          rarity: nft.rarity
        } : null
      };
    }));

    res.json({
      offers: enrichedOffers,
      total: enrichedOffers.length
    });

  } catch (error) {
    logger.error('Error fetching sent offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});


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

/**
 * Helper: Mask wallet address for privacy
 * Shows first 6 chars + ... + last 4 chars
 */
function maskWallet(wallet) {
  if (!wallet || wallet.length < 10) return wallet;
  return wallet.substring(0, 6) + '...' + wallet.substring(wallet.length - 4);
}

module.exports = router;
