const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  addFunds,
  withdrawFunds
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = new User({
      name,
      email,
      password, // The password will be hashed by the pre-save hook
      username: email // Or however you want to set the username
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key', // Make sure you have a secret key set
      { expiresIn: '1h' }
    );

    // Send token back to client
    res.json({ token, userId: user._id });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

router.get('/profile', protect, getUserProfile);
router.post('/addFunds', protect, addFunds);
router.post('/withdrawFunds', protect, withdrawFunds);

module.exports = router;
