const express = require('express');
const { body, validationResult } = require('express-validator');
const xrpl = require('xrpl');
const crypto = require('crypto');
const db = require('../database/connection');
const { logger } = require('../utils/logger');
const { authenticateApiKey } = require('../middleware/auth');

const router = express.Router();

// Initialize XRPL client
let xrplClient;
let issuerWallet;

async function initializeXRPL() {
  if (!xrplClient) {
    xrplClient = new xrpl.Client(process.env.XRPL_NETWORK);
    await xrplClient.connect();
    issuerWallet = xrpl.Wallet.fromSeed(process.env.XRPL_WALLET_SEED);
    logger.info('XRPL client initialized');
  }
  return { client: xrplClient, wallet: issuerWallet };
}

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create a sell offer for an NFT
 *     tags: [Offers]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nftTokenId
 *               - priceXRP
 *               - sellerAccount
 *             properties:
 *               nftTokenId:
 *                 type: integer
 *               priceXRP:
 *                 type: number
 *               sellerAccount:
 *                 type: string
 *               expirationDays:
 *                 type: integer
 *                 default: 30
 *     responses:
 *       201:
 *         description: Sell offer created successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: NFT not found
 */
router.post('/', [
  authenticateApiKey,
  body('nftTokenId').isInt({ min: 1 }),
  body('priceXRP').isFloat({ min: 0.000001 }),
  body('sellerAccount').matches(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/),
  body('expirationDays').optional().isInt({ min: 1, max: 365 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: errors.array() 
      });
    }

    const { nftTokenId, priceXRP, sellerAccount, expirationDays = 30 } = req.body;

    // Verify NFT exists and seller owns it
    const nft = await db('nfts')
      .where('token_id', nftTokenId)
      .first();

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    if (nft.current_owner !== sellerAccount) {
      return res.status(403).json({ error: 'Only the owner can create sell offers' });
    }

    // Initialize XRPL connection
    const { client, wallet } = await initializeXRPL();

    // Create XRPL sell offer
    const sellOfferTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.address,
      NFTokenID: nft.nftoken_id,
      Amount: xrpl.xrpToDrops(priceXRP.toString()),
      Flags: 1, // tfSellNFToken
      Destination: sellerAccount // Optional: restrict buyer
    };

    const prepared = await client.autofill(sellOfferTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`XRPL transaction failed: ${result.result.meta.TransactionResult}`);
    }

    // Extract offer ID from transaction metadata
    const offerId = extractOfferIdFromTx(result.result.meta);
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    // Save offer to database
    const offerData = {
      offer_id: offerId,
      nft_token_id: nftTokenId,
      nftoken_id: nft.nftoken_id,
      seller_account: sellerAccount,
      price_xrp: priceXRP,
      status: 'active',
      expires_at: expiresAt
    };

    const [offerId_db] = await db('offers').insert(offerData).returning('id');

    // Update NFT status
    await db('nfts')
      .where('token_id', nftTokenId)
      .update({
        for_sale: true,
        price_xrp: priceXRP,
        offer_id: offerId
      });

    // Log transaction
    await db('transaction_logs').insert({
      transaction_hash: result.result.hash,
      transaction_type: 'offer_create',
      account: sellerAccount,
      nftoken_id: nft.nftoken_id,
      nft_token_id: nftTokenId,
      transaction_data: JSON.stringify({
        offer_id: offerId,
        price_xrp: priceXRP,
        expires_at: expiresAt
      }),
      status: 'success',
      fee_xrp: xrpl.dropsToXrp(result.result.Fee)
    });

    logger.info(`Sell offer created: NFT ${nftTokenId} for ${priceXRP} XRP by ${sellerAccount}`);

    res.status(201).json({
      message: 'Sell offer created successfully',
      offer: {
        id: offerId_db,
        offer_id: offerId,
        nft_token_id: nftTokenId,
        price_xrp: priceXRP,
        seller_account: sellerAccount,
        status: 'active',
        expires_at: expiresAt,
        transaction_hash: result.result.hash
      }
    });

  } catch (error) {
    logger.error('Error creating sell offer:', error);
    res.status(500).json({ 
      error: 'Failed to create sell offer',
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /api/offers/{offerId}/accept:
 *   post:
 *     summary: Accept a sell offer (buy NFT)
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyerAccount
 *             properties:
 *               buyerAccount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Offer accepted successfully
 *       404:
 *         description: Offer not found
 *       409:
 *         description: Offer no longer available
 */
router.post('/:offerId/accept', [
  body('buyerAccount').matches(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid buyer account', 
        details: errors.array() 
      });
    }

  const { offerId } = req.params;
  const { buyerAccount } = req.body;

    // Get offer details
    const offer = await db('offers')
      .where('offer_id', offerId)
      .where('status', 'active')
      .first();

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found or no longer active' });
    }

    // Check if offer has expired
    if (offer.expires_at && new Date() > new Date(offer.expires_at)) {
      await db('offers').where('offer_id', offerId).update({ status: 'expired' });
      return res.status(409).json({ error: 'Offer has expired' });
    }

    // Initialize XRPL connection  
    const { client, wallet } = await initializeXRPL();

    // Create XRPL buy offer (accept sell offer)
    const buyOfferTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.address, // Using issuer wallet as intermediary
      NFTokenID: offer.nftoken_id,
      Amount: xrpl.xrpToDrops(offer.price_xrp.toString()),
      Owner: offer.seller_account // Reference to sell offer
    };

    const prepared = await client.autofill(buyOfferTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`XRPL transaction failed: ${result.result.meta.TransactionResult}`);
    }

    // Update offer status
    await db('offers')
      .where('offer_id', offerId)
      .update({
        status: 'accepted',
        buyer_account: buyerAccount,
        accepted_at: new Date(),
        transaction_hash: result.result.hash
      });

    // Update NFT ownership
    await db('nfts')
      .where('nft_token_id', offer.nft_token_id)
      .update({
        current_owner: buyerAccount,
        for_sale: false,
        price_xrp: null,
        offer_id: null
      });

    // Update collection stats
    await db('collection_stats')
      .increment('total_volume_xrp', offer.price_xrp)
      .increment('total_sales', 1);

    // Log transaction
    await db('transaction_logs').insert({
      transaction_hash: result.result.hash,
      transaction_type: 'offer_accept',
      account: buyerAccount,
      nftoken_id: offer.nftoken_id,
      nft_token_id: offer.nft_token_id,
      transaction_data: JSON.stringify({
        offer_id: offerId,
        seller: offer.seller_account,
        buyer: buyerAccount,
        price_xrp: offer.price_xrp
      }),
      status: 'success',
      fee_xrp: xrpl.dropsToXrp(result.result.Fee)
    });

    logger.info(`Offer accepted: NFT ${offer.nft_token_id} sold for ${offer.price_xrp} XRP to ${buyerAccount}`);

    res.json({
      message: 'Offer accepted successfully',
      sale: {
        nft_token_id: offer.nft_token_id,
        seller: offer.seller_account,
        buyer: buyerAccount,
        price_xrp: offer.price_xrp,
        transaction_hash: result.result.hash
      }
    });

  } catch (error) {
    logger.error('Error accepting offer:', error);
    res.status(500).json({ 
      error: 'Failed to accept offer',
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /api/offers:
 *   get:
 *     summary: Get active offers with pagination
 *     tags: [Offers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: seller
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      seller,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db('offers')
      .select(
        'offers.*',
        'nfts.name as nft_name',
        'nfts.image_uri',
        'nfts.chapter',
        'nfts.rarity'
      )
      .join('nfts', 'offers.nft_token_id', 'nfts.token_id')
      .where('offers.status', 'active')
      .where('offers.expires_at', '>', new Date());

    // Apply filters
    if (seller) query = query.where('offers.seller_account', seller);
    if (minPrice) query = query.where('offers.price_xrp', '>=', parseFloat(minPrice));
    if (maxPrice) query = query.where('offers.price_xrp', '<=', parseFloat(maxPrice));

    // Count total
    const totalQuery = query.clone();
    const total = await totalQuery.count('* as count').first();
    const totalCount = total.count;

    // Apply sorting and pagination
    const validSortFields = ['price_xrp', 'created_at', 'expires_at'];
    const sortField = validSortFields.includes(sortBy) ? `offers.${sortBy}` : 'offers.created_at';
    const order = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

    query = query.orderBy(sortField, order).limit(parseInt(limit)).offset(offset);

    const offers = await query;

    res.json({
      offers: offers.map(offer => ({
        ...offer,
        image_url: offer.image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/'),
        time_remaining: Math.max(0, new Date(offer.expires_at) - new Date())
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

/**
 * @swagger
 * /api/offers/{offerId}/cancel:
 *   post:
 *     summary: Cancel a sell offer
 *     tags: [Offers]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/:offerId/cancel', authenticateApiKey, async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await db('offers')
      .where('offer_id', offerId)
      .where('status', 'active')
      .first();

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Cancel offer on XRPL
    const { client, wallet } = await initializeXRPL();

    const cancelTx = {
      TransactionType: 'NFTokenCancelOffer',
      Account: wallet.address,
      NFTokenOffers: [offerId]
    };

    const prepared = await client.autofill(cancelTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`XRPL cancellation failed: ${result.result.meta.TransactionResult}`);
    }

    // Update database
    await db('offers')
      .where('offer_id', offerId)
      .update({ status: 'cancelled' });

    await db('nfts')
      .where('token_id', offer.nft_token_id)
      .update({
        for_sale: false,
        price_xrp: null,
        offer_id: null
      });

    res.json({ message: 'Offer cancelled successfully' });

  } catch (error) {
    logger.error('Error cancelling offer:', error);
    res.status(500).json({ error: 'Failed to cancel offer' });
  }
});

// Helper function to extract offer ID from transaction metadata
function extractOfferIdFromTx(meta) {
  if (!meta.AffectedNodes) return null;

  for (const node of meta.AffectedNodes) {
    if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenOffer') {
      return node.CreatedNode.LedgerIndex;
    }
  }
  return null;
}

module.exports = router;