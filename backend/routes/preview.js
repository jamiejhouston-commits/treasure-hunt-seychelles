const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/preview/chapter3:
 *   get:
 *     summary: Get Chapter 3 preview NFTs for approval
 *     tags: [Preview]
 *     responses:
 *       200:
 *         description: Chapter 3 preview NFTs
 */
router.get('/chapter3', async (req, res) => {
  try {
    const previewDataPath = path.join(__dirname, '../../scripts/dist/chapter3-preview-nfts.json');
    
    // Check if preview data exists
    try {
      await fs.access(previewDataPath);
    } catch (error) {
      return res.status(404).json({ 
        error: 'Chapter 3 preview not found',
        message: 'Preview NFTs have not been generated yet'
      });
    }
    
    // Read preview data
    const previewData = JSON.parse(await fs.readFile(previewDataPath, 'utf-8'));
    
    const response = {
      nfts: previewData,
      pagination: {
        page: 1,
        limit: 20,
        total: previewData.length,
        pages: 1,
        hasNext: false,
        hasPrev: false
      },
      total: previewData.length,
      totalPages: 1,
      status: 'PREVIEW - AWAITING APPROVAL',
      chapter: 3,
      collection: 'VASA NFT Collection',
      message: '⚠️ These are PREVIEW images only. Not yet minted to blockchain.'
    };

    res.json(response);

  } catch (error) {
    logger.error('Error fetching Chapter 3 preview:', error);
    res.status(500).json({ error: 'Failed to fetch Chapter 3 preview' });
  }
});

/**
 * @swagger
 * /api/preview/chapter3/{id}:
 *   get:
 *     summary: Get specific Chapter 3 preview NFT by ID
 *     tags: [Preview]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chapter 3 preview NFT details
 *       404:
 *         description: Preview NFT not found
 */
router.get('/chapter3/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const previewDataPath = path.join(__dirname, '../../scripts/dist/chapter3-preview-nfts.json');
    
    const previewData = JSON.parse(await fs.readFile(previewDataPath, 'utf-8'));
    const nft = previewData.find(item => item.token_id === id || item.id.toString() === id);
    
    if (!nft) {
      return res.status(404).json({ error: 'Preview NFT not found' });
    }

    const response = {
      ...nft,
      status: 'PREVIEW - AWAITING APPROVAL',
      chapter: 3,
      collection: 'VASA NFT Collection',
      warning: '⚠️ This is a PREVIEW image only. Not yet minted to blockchain.',
      history: [],
      offers: []
    };

    res.json(response);

  } catch (error) {
    logger.error('Error fetching Chapter 3 preview NFT:', error);
    res.status(500).json({ error: 'Failed to fetch preview NFT' });
  }
});

module.exports = router;