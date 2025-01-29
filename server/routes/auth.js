import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/emailService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    // Generate referral code
    const referralCode = `${username}-${Math.random().toString(36).substring(7)}`;

    // Create new user
    const user = new User({
      username,
      email,
      password,
      referralCode,
      balance: 0,
      isVerified: true, // Since we're not implementing email verification yet
      role: 'user'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
});

// Other existing routes...

export default router;