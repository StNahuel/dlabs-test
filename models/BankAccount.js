const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  balance: {
    type: Number
  },
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'currency'
  }
});

module.exports = BankAccount = mongoose.model('bankAccount', BankAccountSchema);
