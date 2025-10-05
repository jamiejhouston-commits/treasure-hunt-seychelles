const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const xrpl = require('xrpl');
const db = require('../database/connection');
const { logger } = require('../utils/logger');
const { authenticateApiKey } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/puzzle/submit:
 *   post:
 *     summary: Submit a puzzle solution
 *     tags: [Puzzle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - submitterAccount
 *               - solutionData
 *               - clueReferences
 *             properties:
 *               submitterAccount:
 *                 type: string
 *               solutionData:
 *                 type: string
 *               clueReferences:
 *                 type: array
 *                 items:
 *                   type: integer
 *               coordinates:
 *                 type: string
 *     responses:
 *       201:
 *         description: Solution submitted successfully
 *       400:
 *         description: Invalid submission
 */
router.post('/submit', [
  body('submitterAccount').matches(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/),
  body('solutionData').isLength({ min: 10, max: 10000 }),
  body('clueReferences').isArray({ min: 1, max: 100 }),
  body('coordinates').optional().matches(/^-?\d+\.\d+,-?\d+\.\d+$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid submission data', 
        details: errors.array() 
      });
    }

    const { submitterAccount, solutionData, clueReferences, coordinates } = req.body;

    // Check if puzzle is already solved
    const stats = await db('collection_stats').first();
    if (stats.puzzle_solved) {
      return res.status(409).json({ 
        error: 'Puzzle has already been solved',
        winner: stats.treasure_winner_account
      });
    }

    // Verify submitter owns referenced NFTs
    const ownedNFTs = await db('nfts')
      .whereIn('token_id', clueReferences)
      .where('current_owner', submitterAccount)
      .pluck('token_id');

    if (ownedNFTs.length !== clueReferences.length) {
      return res.status(403).json({ 
        error: 'You must own all referenced NFTs to submit a solution' 
      });
    }

    // Generate submission ID and verification hash
    const submissionId = crypto.randomBytes(32).toString('hex');
    const verificationHash = crypto
      .createHash('sha256')
      .update(submitterAccount + solutionData + JSON.stringify(clueReferences))
      .digest('hex');

    // Save submission to database
    const submission = {
      submission_id: submissionId,
      submitter_account: submitterAccount,
      solution_data: solutionData,
      clue_references: JSON.stringify(clueReferences),
      verification_hash: verificationHash,
      status: 'pending'
    };

    await db('puzzle_submissions').insert(submission);

    // Automatically verify solution (in production, this might be manual review)
    const isCorrect = await verifySolution(solutionData, clueReferences, coordinates);

    if (isCorrect) {
      // Award the treasure NFT
      const treasureResult = await awardTreasureNFT(submitterAccount, submissionId);
      
      // Update submission status
      await db('puzzle_submissions')
        .where('submission_id', submissionId)
        .update({
          status: 'verified',
          is_correct: true,
          treasure_nft_id: treasureResult.nftokenID
        });

      // Update collection stats
      await db('collection_stats')
        .update({
          puzzle_solved: true,
          treasure_winner_account: submitterAccount,
          last_updated: new Date()
        });

      logger.info(`🎉 PUZZLE SOLVED! Winner: ${submitterAccount}, Submission: ${submissionId}`);

      res.status(201).json({
        message: '🎉 CONGRATULATIONS! You have solved the treasure puzzle!',
        submission: {
          id: submissionId,
          status: 'verified',
          is_correct: true,
          treasure_nft: treasureResult
        },
        prize: {
          treasure_nft_id: treasureResult.nftokenID,
          transaction_hash: treasureResult.transactionHash,
          explorer_url: `https://livenet.xrpl.org/nft/${treasureResult.nftokenID}`
        }
      });

    } else {
      await db('puzzle_submissions')
        .where('submission_id', submissionId)
        .update({
          status: 'rejected',
          is_correct: false,
          admin_notes: 'Solution verification failed'
        });

      res.status(201).json({
        message: 'Solution submitted but verification failed. Keep trying!',
        submission: {
          id: submissionId,
          status: 'rejected',
          is_correct: false
        },
        hint: 'Ensure you have all clues from each chapter and the correct coordinates.'
      });
    }

  } catch (error) {
    logger.error('Error submitting puzzle solution:', error);
    res.status(500).json({ 
      error: 'Failed to submit solution',
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /api/puzzle/submissions:
 *   get:
 *     summary: Get puzzle submissions (admin only)
 *     tags: [Puzzle]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/submissions', authenticateApiKey, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, submitter } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db('puzzle_submissions')
      .select(
        'submission_id',
        'submitter_account',
        'status',
        'is_correct',
        'treasure_nft_id',
        'created_at'
      );

    if (status) query = query.where('status', status);
    if (submitter) query = query.where('submitter_account', submitter);

    const total = await query.clone().count('* as count').first();
    const submissions = await query
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(offset);

    res.json({
      submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

/**
 * @swagger
 * /api/puzzle/status:
 *   get:
 *     summary: Get puzzle solving status
 *     tags: [Puzzle]
 */
router.get('/status', async (req, res) => {
  try {
    const stats = await db('collection_stats').first();
    const totalSubmissions = await db('puzzle_submissions').count('* as count').first();
    
    const recentSubmissions = await db('puzzle_submissions')
      .select('submitter_account', 'created_at', 'is_correct')
      .orderBy('created_at', 'desc')
      .limit(10);

    res.json({
      puzzle_solved: stats.puzzle_solved,
      winner: stats.treasure_winner_account,
      total_submissions: totalSubmissions.count,
      recent_submissions: recentSubmissions,
      puzzle_info: {
        total_nfts: stats.total_nfts,
        chapters: 4,
        description: 'Combine clues from all four chapters to discover the treasure location',
        hint: 'Each NFT contains part of the solution. You need clues from Mahé, La Digue, Praslin, and the Outer Islands.'
      }
    });

  } catch (error) {
    logger.error('Error fetching puzzle status:', error);
    res.status(500).json({ error: 'Failed to fetch puzzle status' });
  }
});

/**
 * @swagger
 * /api/puzzle/hints:
 *   get:
 *     summary: Get puzzle solving hints
 *     tags: [Puzzle]
 */
router.get('/hints', async (req, res) => {
  try {
    const { account } = req.query;
    
    let hints = [
      {
        chapter: 1,
        title: 'Mahé Manuscripts',
        hint: 'Navigate by the ancient compass rose. The granite peaks hold the first bearing.',
        required_nfts: 1
      },
      {
        chapter: 2,
        title: 'La Digue\'s Secrets',
        hint: 'When Sirius aligns with the Southern Cross, the celestial path reveals itself.',
        required_nfts: 1
      },
      {
        chapter: 3,
        title: 'Praslin\'s Prophecy',
        hint: 'The sacred coco de mer whispers nature\'s cipher to those who understand.',
        required_nfts: 1
      },
      {
        chapter: 4,
        title: 'Outer Islands Revelation',
        hint: 'Where endless azure meets infinity, mathematical precision guides the final steps.',
        required_nfts: 1
      }
    ];

    // If account provided, show progress
    if (account) {
      const ownedByChapter = await db('nfts')
        .select('chapter')
        .count('* as count')
        .where('current_owner', account)
        .groupBy('chapter');

      const progress = ownedByChapter.reduce((acc, item) => {
        acc[item.chapter] = item.count;
        return acc;
      }, {});

      hints = hints.map(hint => ({
        ...hint,
        owned_count: progress[hint.title] || 0,
        unlocked: (progress[hint.title] || 0) >= hint.required_nfts
      }));
    }

    res.json({
      hints,
      solving_guide: {
        step1: 'Collect at least one NFT from each chapter',
        step2: 'Decode the cipher in each clue_data field',
        step3: 'Combine the coordinates and bearings', 
        step4: 'Calculate the final treasure location',
        step5: 'Submit your solution with supporting evidence'
      }
    });

  } catch (error) {
    logger.error('Error fetching hints:', error);
    res.status(500).json({ error: 'Failed to fetch hints' });
  }
});

// Verify puzzle solution
async function verifySolution(solutionData, clueReferences, coordinates) {
  try {
    // Get all clue data for referenced NFTs
    const nfts = await db('nfts')
      .select('clue_data', 'chapter')
      .whereIn('token_id', clueReferences);

    // Extract master cipher key from environment
    const masterKey = process.env.MASTER_CIPHER_KEY;
    
    // Simple verification logic - in production this would be more sophisticated
    const hasAllChapters = new Set(nfts.map(n => n.chapter)).size === 4;
    const hasValidCoordinates = coordinates && coordinates.includes('-4.') && coordinates.includes('55.');
    const hasValidSolution = solutionData.toLowerCase().includes('levasseur') || 
                           solutionData.toLowerCase().includes('treasure') ||
                           solutionData.toLowerCase().includes('seychelles');

    return hasAllChapters && hasValidCoordinates && hasValidSolution;
    
  } catch (error) {
    logger.error('Error verifying solution:', error);
    return false;
  }
}

// Award the legendary treasure NFT
async function awardTreasureNFT(winnerAccount, submissionId) {
  try {
    // Initialize XRPL connection
    const client = new xrpl.Client(process.env.XRPL_NETWORK);
    await client.connect();
    const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_WALLET_SEED);

    // Create treasure NFT metadata
    const treasureMetadata = {
      name: 'The Levasseur Treasure - Ultimate Prize',
      description: 'The legendary treasure NFT awarded to the first solver of Olivier Levasseur\'s 300-year-old cryptogram. This unique 1/1 NFT grants exclusive rights and eternal glory.',
      image: 'ipfs://QmTreasureImageHash', // Would be uploaded separately
      attributes: [
        { trait_type: 'Type', value: 'Legendary Treasure' },
        { trait_type: 'Rarity', value: 'Unique (1/1)' },
        { trait_type: 'Winner', value: winnerAccount },
        { trait_type: 'Solution Date', value: new Date().toISOString() },
        { trait_type: 'Submission ID', value: submissionId }
      ],
      properties: {
        winner_account: winnerAccount,
        solved_date: new Date().toISOString(),
        submission_id: submissionId,
        royalty_share: 50 // 50% of future royalties
      }
    };

    // Upload metadata to IPFS (simplified - would use actual IPFS service)
    const metadataUri = 'ipfs://QmTreasureMetadataHash';

    // Mint the treasure NFT
    const mintTx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      URI: Buffer.from(metadataUri, 'utf8').toString('hex').toUpperCase(),
      Flags: 8, // Transferable
      TransferFee: 5000, // 50% royalty to winner
      NFTokenTaxon: 1 // Special taxon for treasure
    };

    const prepared = await client.autofill(mintTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Treasure NFT minting failed: ${result.result.meta.TransactionResult}`);
    }

    // Extract NFTokenID
    const nftokenID = extractNFTokenIDFromTx(result.result.meta);

    // Transfer to winner
    const transferTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.address,
      NFTokenID: nftokenID,
      Destination: winnerAccount,
      Amount: '0', // Free transfer
      Flags: 1 // Sell offer
    };

    const transferPrepared = await client.autofill(transferTx);
    const transferSigned = wallet.sign(transferPrepared);
    const transferResult = await client.submitAndWait(transferSigned.tx_blob);

    await client.disconnect();

    // Log the treasure award
    await db('transaction_logs').insert({
      transaction_hash: result.result.hash,
      transaction_type: 'treasure_award',
      account: winnerAccount,
      nftoken_id: nftokenID,
      transaction_data: JSON.stringify({
        submission_id: submissionId,
        treasure_awarded: true,
        winner: winnerAccount
      }),
      status: 'success',
      fee_xrp: xrpl.dropsToXrp(result.result.Fee)
    });

    return {
      nftokenID,
      transactionHash: result.result.hash,
      metadataUri,
      winner: winnerAccount
    };

  } catch (error) {
    logger.error('Error awarding treasure NFT:', error);
    throw error;
  }
}

// Helper to extract NFTokenID from transaction
function extractNFTokenIDFromTx(meta) {
  if (!meta.AffectedNodes) return null;

  for (const node of meta.AffectedNodes) {
    if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
      const nftPage = node.CreatedNode.NewFields || node.CreatedNode.FinalFields;
      if (nftPage.NFTokens && nftPage.NFTokens.length > 0) {
        return nftPage.NFTokens[0].NFToken.NFTokenID;
      }
    }
  }
  return null;
}

module.exports = router;