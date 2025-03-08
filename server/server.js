const dotenv = require('dotenv');  // Add this line

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/adminRoutes');
const { errorHandler } = require('./src/middleware/errorMiddleware');

console.log('Current working directory:', process.cwd());
console.log('.env file path:', path.resolve(process.cwd(), '.env'));

// Ensure .env is loaded correctly
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('MONGO_URI:', process.env.MONGO_URI); // Check MONGO_URI

// Express app setup
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB URI setup
let mongoURI = process.env.MONGO_URI;

if (!mongoURI || !mongoURI.startsWith('mongodb://')) {
  console.log('MONGO_URI not properly set in .env, using fallback');//'mongodb://localhost:27017/anusha'
  mongoURI = 'mongodb://localhost:27017/'; // Local fallback
}

console.log('Attempting to connect with URI:', mongoURI);

// Check if URI is defined and valid
if (!mongoURI) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
  console.error('Invalid MONGO_URI format. It should start with mongodb:// or mongodb+srv://');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/anusha')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

// Catch-all route for undefined routes
app.use('*', (req, res) => {
  console.log(`Received request for ${req.originalUrl}`);
  res.status(404).send('Route not found');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
