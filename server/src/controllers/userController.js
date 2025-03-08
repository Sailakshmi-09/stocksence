const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Received registration request:', { name, email, password: '****' });

  if (!name || !email || !password) {
    console.log('Missing required fields');
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log('User already exists');
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with hashed password
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    console.log("Login attempt for email:", req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      console.log("Invalid password for user:", req.body.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Get portfolio
// @route   GET /api/users/portfolio
// @access  Private
const getPortfolio = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      transactions: user.transactions
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add funds
// @route   POST /api/users/addFunds
// @access  Private
const addFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  console.log('Add funds request received:', { userId: req.user.id, amount });

  const user = await User.findById(req.user.id);
  if (!user) {
    console.log('User not found:', req.user.id);
    res.status(404);
    throw new Error('User not found');
  }

  if (amount <= 0) {
    console.log('Invalid amount:', amount);
    res.status(400);
    throw new Error('Amount must be greater than 0');
  }

  user.balance += parseFloat(amount);
  user.transactions.push({ type: 'deposit', amount: parseFloat(amount), date: new Date() });
  await user.save();

  console.log('Funds added successfully:', { userId: user._id, newBalance: user.balance });
  res.json({ message: 'Funds added successfully', user });
});

// @desc    Withdraw funds
// @route   POST /api/users/withdrawFunds
// @access  Private
const withdrawFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  console.log('Withdraw funds request received:', { userId: req.user.id, amount });

  const user = await User.findById(req.user.id);
  if (!user) {
    console.log('User not found:', req.user.id);
    res.status(404);
    throw new Error('User not found');
  }

  if (amount <= 0) {
    console.log('Invalid amount:', amount);
    res.status(400);
    throw new Error('Amount must be greater than 0');
  }

  if (user.balance < amount) {
    console.log('Insufficient funds:', { balance: user.balance, withdrawAmount: amount });
    res.status(400);
    throw new Error('Insufficient funds');
  }

  user.balance -= parseFloat(amount);
  user.transactions.push({ type: 'withdrawal', amount: parseFloat(amount), date: new Date() });
  await user.save();

  console.log('Funds withdrawn successfully:', { userId: user._id, newBalance: user.balance });
  res.json({ message: 'Funds withdrawn successfully', user });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // Assuming req.user is set by the auth middleware
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getPortfolio,
  addFunds,
  withdrawFunds,
  getUserProfile
};
