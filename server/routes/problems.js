const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const logger = require('../utils/logger');

// Import problem data (you can move this to database later)
const { faProblems, mcqQuizzes } = require('../../src/data/problemsData');

// GET /api/problems - Get all problems
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, difficulty, status } = req.query;

    let problems = [...faProblems];
    let quizzes = [...mcqQuizzes];

    // Filter by type
    if (type === 'fa') {
      quizzes = [];
    } else if (type === 'mcq') {
      problems = [];
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      problems = problems.filter(p => p.difficulty === difficulty);
      quizzes = quizzes.filter(q => q.difficulty === difficulty);
    }

    // Merge and add type info
    const allProblems = [
      ...problems.map(p => ({ ...p, type: 'fa' })),
      ...quizzes.map(q => ({ ...q, type: 'mcq' }))
    ];

    res.json({
      success: true,
      problems: allProblems,
      count: allProblems.length,
    });
  } catch (error) {
    logger.error('Get problems error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching problems' 
    });
  }
});

// GET /api/problems/:id - Get specific problem
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const problem = faProblems.find(p => p.id === id) || 
                   mcqQuizzes.find(q => q.id === id);

    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Problem not found' 
      });
    }

    res.json({
      success: true,
      problem,
    });
  } catch (error) {
    logger.error('Get problem error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching problem' 
    });
  }
});

module.exports = router;

