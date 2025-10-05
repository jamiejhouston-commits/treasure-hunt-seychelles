const express = require('express');
const { authenticateApiKey, requireRole } = require('../middleware/auth');
const db = require('../database/connection');
const { logger } = require('../utils/logger');
const path = require('path');
const { spawn } = require('child_process');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateApiKey);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get comprehensive admin statistics
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/stats', requireRole(['admin']), async (req, res) => {
  try {
    const [
      collectionStats,
      totalOffers,
      totalSubmissions,
      recentTransactions
    ] = await Promise.all([
      db('collection_stats').first(),
      db('offers').count('* as count').first(),
      db('puzzle_submissions').count('* as count').first(),
      db('transaction_logs')
        .select('transaction_type')
        .count('* as count')
        .groupBy('transaction_type')
    ]);

    const stats = {
      collection: collectionStats,
      offers: {
        total: totalOffers.count,
        active: await db('offers').where('status', 'active').count('* as count').first().then(r => r.count)
      },
      puzzle: {
        total_submissions: totalSubmissions.count,
        solved: collectionStats.puzzle_solved,
        winner: collectionStats.treasure_winner_account
      },
      transactions: recentTransactions.reduce((acc, tx) => {
        acc[tx.transaction_type] = tx.count;
        return acc;
      }, {})
    };

    res.json(stats);

  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * @swagger
 * /api/admin/verify:
 *   get:
 *     summary: Verify admin API key
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/verify', async (req, res) => {
  try {
    res.json({ ok: true, user: { id: req.admin.id, username: req.admin.username, role: req.admin.role } });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get recent application logs
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/logs', requireRole(['admin']), async (req, res) => {
  try {
    const logs = await db('transaction_logs')
      .select('id', 'transaction_type', 'account', 'nftoken_id', 'nft_token_id', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(200);

    res.json({ logs });
  } catch (error) {
    logger.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Helper to run a script in scripts/ with streaming capture
function runScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(__dirname, '../../scripts');
    const child = spawn('node', [scriptName, ...args], { cwd, env: process.env, shell: process.platform === 'win32' });
    let output = '';
    child.stdout.on('data', (d) => { output += d.toString(); });
    child.stderr.on('data', (d) => { output += d.toString(); });
    child.on('close', (code) => {
      if (code === 0) resolve({ code, output });
      else reject(new Error(output || `Exited with code ${code}`));
    });
  });
}

// Minting pipeline endpoints
router.post('/mint/generate', requireRole(['admin']), async (req, res) => {
  try {
    const result = await runScript('generate_art.js');
    res.json({ ok: true, step: 'generate', output: result.output });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/mint/metadata', requireRole(['admin']), async (req, res) => {
  try {
    const result = await runScript('build_metadata.js');
    res.json({ ok: true, step: 'metadata', output: result.output });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/mint/ipfs', requireRole(['admin']), async (req, res) => {
  try {
    const result = await runScript('upload_ipfs.js');
    res.json({ ok: true, step: 'ipfs', output: result.output });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/mint/testnet', requireRole(['admin']), async (req, res) => {
  try {
    const result = await runScript('mint_testnet.js');
    res.json({ ok: true, step: 'mint', output: result.output });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * @swagger
 * /api/admin/sync-nfts:
 *   post:
 *     summary: Sync NFT data from minting results
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/sync-nfts', requireRole(['admin']), async (req, res) => {
  try {
    const fs = require('fs-extra');
    const distDir = path.resolve(__dirname, '../../scripts/dist');
    const mintedPath = path.join(distDir, 'minted.json');
    const manifestPath = path.join(distDir, 'manifest.json');
    const artManifestPath = path.join(distDir, 'art-manifest.json');

    const existsMinted = await fs.pathExists(mintedPath);
    const existsManifest = await fs.pathExists(manifestPath);
    if (!existsMinted || !existsManifest) {
      return res.status(400).json({ error: 'Missing required files in scripts/dist', missing: {
        minted: existsMinted,
        manifest: existsManifest
      }});
    }

    const minted = await fs.readJson(mintedPath);
    const manifest = await fs.readJson(manifestPath);
    const artManifest = (await fs.pathExists(artManifestPath)) ? await fs.readJson(artManifestPath) : { items: [] };

    let syncedCount = 0;
    let errors = [];

    const mintedItems = Array.isArray(minted.items) ? minted.items : Array.isArray(minted) ? minted : [];
    const manifestItems = Array.isArray(manifest.items) ? manifest.items : Array.isArray(manifest) ? manifest : [];
    const artItems = Array.isArray(artManifest.items) ? artManifest.items : [];

    const findById = (arr, id) => arr.find((x) => x.id === id || x.sequence === id || x.tokenId === id);

    for (const mint of mintedItems.filter(m => !m.failed)) {
      try {
        const id = mint.id ?? mint.sequence ?? mint.tokenId ?? mint.token_id;
        const meta = id != null ? (findById(manifestItems, id) || {}) : {};
        const art = id != null ? (findById(artItems, id) || {}) : {};

        if (id == null) {
          errors.push('Missing token id in minted item');
          continue;
        }

        // Check if NFT already exists
        const existing = await db('nfts').where('token_id', id).first();
        
        const nftData = {
          token_id: id,
          nftoken_id: mint.nftokenID || mint.nftokenId || mint.NFTokenID || null,
          name: meta.name || `Fragment #${String(id).padStart(3, '0')} – ${getFragmentTitle(art.chapter || meta.chapter || 'Mahé Manuscripts', (meta.rarity || art.rarity || 'common').toLowerCase())}`,
          description: meta.description || generateDescription({ chapter: art.chapter || meta.chapter || 'Mahé Manuscripts', tokenId: id }),
          image_uri: meta.image || meta.image_uri || null,
          metadata_uri: meta.metadata || meta.meta_uri || mint.uri || null,
          chapter: meta.chapter || art.chapter || 'Mahé Manuscripts',
          island: meta.island || art.island || 'Mahé',
          rarity: (meta.rarity || art.rarity || 'common').toLowerCase(),
          attributes: JSON.stringify(meta.attributes || art.attributes || []),
          clue_data: JSON.stringify(meta.clue || art.clue || {}),
          current_owner: process.env.XRPL_ISSUER_ACCOUNT, // Initially owned by issuer
          for_sale: false
        };

        if (existing) {
          await db('nfts').where('token_id', id).update(nftData);
        } else {
          await db('nfts').insert(nftData);
        }

        syncedCount++;

      } catch (error) {
        errors.push(`Error syncing NFT ${mint.tokenId ?? mint.id}: ${error.message}`);
      }
    }

    // Update collection stats
    await db('collection_stats').update({
      minted_nfts: syncedCount,
      last_updated: new Date()
    });

    logger.info(`Admin sync completed: ${syncedCount} NFTs synced`);

    res.json({
      message: 'NFT sync completed',
      synced: syncedCount,
      errors: errors.length,
      error_details: errors.slice(0, 10) // Limit error details
    });

  } catch (error) {
    logger.error('Error syncing NFTs:', error);
    res.status(500).json({ error: 'Failed to sync NFTs' });
  }
});

/**
 * @swagger
 * /api/admin/puzzle/verify:
 *   post:
 *     summary: Manually verify a puzzle submission
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/puzzle/verify/:submissionId', requireRole(['admin']), async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { isCorrect, adminNotes } = req.body;

    const submission = await db('puzzle_submissions')
      .where('submission_id', submissionId)
      .first();

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    await db('puzzle_submissions')
      .where('submission_id', submissionId)
      .update({
        is_correct: isCorrect,
        status: isCorrect ? 'verified' : 'rejected',
        admin_notes: adminNotes
      });

    res.json({ message: 'Submission updated successfully' });

  } catch (error) {
    logger.error('Error verifying submission:', error);
    res.status(500).json({ error: 'Failed to verify submission' });
  }
});

// Helper functions (simplified versions of the ones in metadata builder)
function getFragmentTitle(chapter, rarity) {
  const titles = {
    "Mahé Manuscripts": {
      common: "The Navigator's Chart",
      rare: "The Captain's Compass", 
      epic: "The Sacred Bearing",
      legendary: "Levasseur's True North"
    },
    "La Digue's Secrets": {
      common: "The Astronomer's Tool",
      rare: "The Celestial Map",
      epic: "The Star Prophet's Vision", 
      legendary: "The Cosmic Key"
    },
    "Praslin's Prophecy": {
      common: "The Botanist's Code",
      rare: "The Sacred Grove Mystery",
      epic: "The Coco de Mer Oracle",
      legendary: "The Garden of Eden Cipher"
    },
    "Outer Islands Revelation": {
      common: "The Final Coordinates",
      rare: "The Ultimate Bearing",
      epic: "The Treasure's True Location",
      legendary: "Levasseur's Final Secret"
    }
  };

  return titles[chapter]?.[rarity] || titles["Mahé Manuscripts"][rarity];
}

function generateDescription(traits) {
  const loreFragments = {
    "Mahé Manuscripts": "Beneath the mist-shrouded peaks of Mahé, where ancient granite pierces tropical clouds, lies a fragment of Levasseur's navigation charts.",
    "La Digue's Secrets": "Among the colossal granite boulders of La Digue, where coco de mer palms whisper secrets of ages past, astronomical instruments await discovery.",
    "Praslin's Prophecy": "Within the primeval Vallée de Mai, where endemic palms guard ancient mysteries, botanical codes were carved into living monuments.",
    "Outer Islands Revelation": "Where endless azure meets coral sanctuaries, the final coordinates emerge from mathematical sequences hidden in plain sight."
  };

  return loreFragments[traits.chapter] + ` - Fragment ${traits.tokenId} of Levasseur's Lost Chronicle`;
}

module.exports = router;