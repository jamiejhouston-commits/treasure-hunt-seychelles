const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs-extra');
const db = require('../database/connection');
const { logger } = require('../utils/logger');

const router = express.Router();

// Store puzzle solution securely in backend (not exposed in frontend code)
const PUZZLE_SOLUTIONS = {
  'chapter1': 'TAYLOR',
  'chapter2': 'ANSE SOLEIL'
};

const PUZZLE_CONFIG = {
  chapter1: {
    title: 'Chapter 1: The Trail Begins',
    prize: '$500 USD',
    description: 'Collect clues from puzzle NFTs and decode the location',
    puzzle_nfts: [4, 5, 8, 12, 15, 17, 20],
    active: true
  },
  chapter2: {
    title: 'Chapter 2: The Hidden Cache',
    prize: '$750 USD',
    description: 'Decipher the code and locate the hidden treasure',
    puzzle_nfts: [25, 28, 32, 37],
    active: true
  }
};

/**
 * GET /api/treasure-hunt/info/:chapter
 * Get puzzle information without revealing solution
 */
router.get('/info/:chapter', async (req, res) => {
  try {
    const { chapter } = req.params;
    
    const puzzleConfig = PUZZLE_CONFIG[chapter];
    if (!puzzleConfig) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }
    
    res.json({
      chapter,
      title: puzzleConfig.title,
      prize: puzzleConfig.prize,
      description: puzzleConfig.description,
      puzzle_nfts: puzzleConfig.puzzle_nfts,
      active: puzzleConfig.active,
      hint: 'Four NFTs contain the clues you need. Look for overlay layers.'
    });
    
  } catch (error) {
    logger.error('Error fetching puzzle info:', error);
    res.status(500).json({ error: 'Failed to fetch puzzle info' });
  }
});

/**
 * POST /api/treasure-hunt/submit
 * Submit puzzle solution (no authentication for testnet)
 */
router.post('/submit', [
  body('chapter').isString().trim().notEmpty(),
  body('answer').isString().trim().notEmpty(),
  body('wallet_address').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid submission', 
        details: errors.array() 
      });
    }
    
    const { chapter, answer, wallet_address } = req.body;
    
    // Check if puzzle exists and is active
    const puzzleConfig = PUZZLE_CONFIG[chapter];
    if (!puzzleConfig) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }
    
    if (!puzzleConfig.active) {
      return res.status(400).json({ error: 'This puzzle is no longer active' });
    }
    
    // Check solution (case-insensitive, normalized)
    const correctAnswer = PUZZLE_SOLUTIONS[chapter];
    const normalizedAnswer = answer.trim().toUpperCase().replace(/\s+/g, ' ');
    const normalizedCorrect = correctAnswer.toUpperCase().replace(/\s+/g, ' ');
    
    const isCorrect = normalizedAnswer === normalizedCorrect;
    
    // Log submission
    try {
      await db('puzzle_submissions').insert({
        chapter,
        answer: answer.trim(),
        wallet_address: wallet_address || null,
        is_correct: isCorrect,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        submitted_at: new Date().toISOString()
      });
    } catch (dbError) {
      // If table doesn't exist, just log and continue
      logger.warn('Could not record puzzle submission:', dbError.message);
    }
    
    if (isCorrect) {
      return res.json({
        success: true,
        message: '🎉 CONGRATULATIONS! You solved the puzzle!',
        prize: puzzleConfig.prize,
        chapter: puzzleConfig.title,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.json({
        success: false,
        message: 'Incorrect answer. Try again! You have unlimited attempts on testnet.',
        hint: 'Make sure you have all four puzzle NFTs and decode the cipher correctly.'
      });
    }
    
  } catch (error) {
    logger.error('Error submitting puzzle solution:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

/**
 * GET /api/treasure-hunt/leaderboard/:chapter
 * Get puzzle solvers (for future use)
 */
router.get('/leaderboard/:chapter', async (req, res) => {
  try {
    const { chapter } = req.params;
    
    const submissions = await db('puzzle_submissions')
      .where({ chapter, is_correct: true })
      .orderBy('submitted_at', 'asc')
      .limit(100)
      .select('wallet_address', 'submitted_at');
    
    res.json({
      chapter,
      solvers: submissions.length,
      leaderboard: submissions
    });
    
  } catch (error) {
    // If table doesn't exist yet, return empty
    res.json({
      chapter: req.params.chapter,
      solvers: 0,
      leaderboard: []
    });
  }
});

module.exports = router;
