import { authMiddleware } from '../../../lib/auth';
import { faProblems, mcqQuizzes } from '../../../data/problemsData';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
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
    console.error('Get problem error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching problem' 
    });
  }
}

export default async function(req, res) {
  return authMiddleware(req, res, handler);
}

