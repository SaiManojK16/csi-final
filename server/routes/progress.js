const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const User = require('../models/User');

// GET /api/progress - Get user progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      progress: user.progress,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching progress' 
    });
  }
});

// POST /api/progress/fa/:problemId - Update FA problem progress
router.post('/fa/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status, score, testResults } = req.body;

    const user = await User.findById(req.user._id);
    
    // Find or create problem progress
    let problemProgress = user.progress.faSimulation.problems.find(
      p => p.problemId === problemId
    );

    if (!problemProgress) {
      problemProgress = {
        problemId,
        status: 'attempted',
        attempts: 0,
        bestScore: 0,
      };
      user.progress.faSimulation.problems.push(problemProgress);
    }

    // Update progress
    problemProgress.attempts += 1;
    problemProgress.lastAttempt = new Date();
    
    if (score !== undefined) {
      problemProgress.bestScore = Math.max(problemProgress.bestScore || 0, score);
    }

    if (status === 'solved' || (score && score >= 100)) {
      problemProgress.status = 'solved';
      
      // Update overall FA progress
      const solvedCount = user.progress.faSimulation.problems.filter(
        p => p.status === 'solved'
      ).length;
      
      user.progress.faSimulation.solved = solvedCount;
      user.progress.faSimulation.percentage = Math.round(
        (solvedCount / user.progress.faSimulation.total) * 100
      );
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated',
      progress: user.progress,
    });
  } catch (error) {
    console.error('Update FA progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating progress' 
    });
  }
});

// POST /api/progress/quiz/:quizId - Update quiz progress
router.post('/quiz/:quizId', authMiddleware, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { score, answers, totalQuestions } = req.body;

    const user = await User.findById(req.user._id);
    
    // Find or create quiz progress
    let quizProgress = user.progress.mcqs.quizzes.find(
      q => q.quizId === quizId
    );

    if (!quizProgress) {
      quizProgress = {
        quizId,
        status: 'attempted',
        attempts: 0,
        bestScore: 0,
      };
      user.progress.mcqs.quizzes.push(quizProgress);
    }

    // Update progress
    quizProgress.attempts += 1;
    quizProgress.lastAttempt = new Date();
    quizProgress.answers = answers || quizProgress.answers;
    
    if (score !== undefined) {
      quizProgress.bestScore = Math.max(quizProgress.bestScore || 0, score);
    }

    if (score >= 70) { // 70% to consider completed
      quizProgress.status = 'completed';
      
      // Update overall MCQ progress
      const completedCount = user.progress.mcqs.quizzes.filter(
        q => q.status === 'completed'
      ).length;
      
      user.progress.mcqs.solved = completedCount;
      user.progress.mcqs.percentage = Math.round(
        (completedCount / user.progress.mcqs.total) * 100
      );
    }

    await user.save();

    res.json({
      success: true,
      message: 'Quiz progress updated',
      progress: user.progress,
    });
  } catch (error) {
    console.error('Update quiz progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating quiz progress' 
    });
  }
});

module.exports = router;

