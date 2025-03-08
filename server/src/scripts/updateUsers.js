const mongoose = require('mongoose');
const User = require('../models/userModel');

const cleanTransactions = (transactions) => {
  return transactions.map(t => ({
    type: t.type ? (t.type.charAt(0).toUpperCase() + t.type.slice(1).toLowerCase()) : 'Unknown',
    amount: Number(t.amount) || 0,
    date: t.date instanceof Date ? t.date : new Date()
  })).filter(t => t.amount !== 0);
};

mongoose.connect('your_mongodb_uri_here')
  .then(async () => {
    const users = await User.find({});
    for (let user of users) {
      user.balance = user.balance || 0;
      user.transactions = cleanTransactions(user.transactions || []);
      await user.save({ validateBeforeSave: false });
    }
    console.log('All users updated');
    mongoose.disconnect();
  })
  .catch(err => console.error('Error updating users:', err));
