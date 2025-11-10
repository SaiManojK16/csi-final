import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { authMiddleware } from '../../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { quizId } = req.query;
    const { score, answers, totalQuestions } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
}

export default async function(req, res) {
  return authMiddleware(req, res, handler);
}

