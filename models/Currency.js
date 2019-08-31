const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true
  },
  symbol: {
    type: String
  },
  country: {
    type: String
  }
});

module.exports = Currency = mongoose.model('currency', CurrencySchema);
