const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Transaction = require('../models/Transaction');

// Get all users
router.get('/users', async (req, res) => {
  console.log('Fetching users');
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all transactions
router.get('/transactions', async (req, res) => {
  console.log('Fetching transactions');
  try {
    const users = await User.find({});
    const transactions = users.flatMap(user => user.transactions || []);
    res.json(transactions);
    
    // If you have a separate Transaction model, use this instead:
    // const transactions = await Transaction.find({});
    // res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

module.exports = router;
