import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { authMiddleware } from '../../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { problemId } = req.query;
    const { status, score, testResults } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
}

export default async function(req, res) {
  return authMiddleware(req, res, handler);
}

