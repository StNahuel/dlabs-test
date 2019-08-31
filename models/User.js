const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accounts: [
    {
      bankAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bankAccount'
      }
    }
  ]
});

module.exports = User = mongoose.model('user', UserSchema);
