import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { authMiddleware } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
}

export default async function(req, res) {
  return authMiddleware(req, res, handler);
}

