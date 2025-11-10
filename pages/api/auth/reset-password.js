import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.json({ 
        success: true, 
        message: 'If that email exists, a reset link has been sent' 
      });
    }

    // In production, you would send an actual email here
    // For now, just return success
    res.json({
      success: true,
      message: 'Password reset link sent to ' + email,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing request' 
    });
  }
}

