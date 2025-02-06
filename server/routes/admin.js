import express from 'express';
import User from '../models/User.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find(
      { role: 'user' },
      'username email balance deposits withdrawals pendingDeposits createdAt'
    ).sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
});

// Delete user (admin only)
router.delete('/users/:userId', authenticateToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// Update user balance (admin only)
router.patch('/users/:userId/balance', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { balance: req.body.balance },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating balance',
      error: error.message
    });
  }
});

// Approve deposit (admin only)
router.post('/deposits/:depositId/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ 'pendingDeposits._id': req.params.depositId });
    if (!user) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    const deposit = user.pendingDeposits.id(req.params.depositId);
    user.balance += deposit.amount;
    user.deposits.push({
      amount: deposit.amount,
      date: new Date()
    });
    user.pendingDeposits.pull(deposit);
    
    await user.save();
    res.json({ message: 'Deposit approved successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error approving deposit',
      error: error.message
    });
  }
});

export default router;