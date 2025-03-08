const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('YOUR_MONGO_URI', { useNewUrlParser: true, useUnifiedTopology: true });

// User Model
const User = mongoose.model('User', {
  username: { type: String, unique: true },
  password: String,
  accountBalance: { type: Number, default: 0 },
  transactions: [{
    amount: Number,
    action: String,
    paymentMode: String,
    time: Date
  }]
});

// Middleware to check JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, 'yourSecretKey', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user; // Store user info from the token for use in routes
    next();
  });
};

// Register route (Sign up)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// Login route (Authenticate user and issue JWT)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ error: 'Invalid username or password' });

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, 'yourSecretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in user.' });
  }
});

// Fetch user data (protected route)
app.get('/api/user-data', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Add funds (protected route)
app.post('/api/add-funds', authenticateJWT, async (req, res) => {
  const { amount, paymentMethod } = req.body;

  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.accountBalance += Number(amount);
    user.transactions.push({
      amount: Number(amount),
      action: 'Deposit',
      paymentMode: paymentMethod,
      time: new Date()
    });

    await user.save();
    res.json({ newBalance: user.accountBalance, transactions: user.transactions });
  } catch (err) {
    res.status(500).json({ error: 'Error adding funds' });
  }
});

// Withdraw funds (protected route)
app.post('/api/withdraw', authenticateJWT, async (req, res) => {
  const { amount, paymentMethod } = req.body;

  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.accountBalance >= Number(amount)) {
      user.accountBalance -= Number(amount);
      user.transactions.push({
        amount: Number(amount),
        action: 'Withdraw',
        paymentMode: paymentMethod,
        time: new Date()
      });

      await user.save();
      res.json({ newBalance: user.accountBalance, transactions: user.transactions });
    } else {
      res.status(400).json({ error: 'Insufficient funds' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error withdrawing funds' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
