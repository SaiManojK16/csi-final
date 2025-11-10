import { authMiddleware } from '../../../lib/auth';
import { faProblems, mcqQuizzes } from '../../../data/problemsData';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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
    console.error('Get problems error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching problems' 
    });
  }
}

export default async function(req, res) {
  return authMiddleware(req, res, handler);
}

