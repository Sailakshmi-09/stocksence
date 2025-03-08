const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  action: { type: String, required: true },
  paymentMode: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
