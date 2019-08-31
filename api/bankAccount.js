const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');

const BankAccount = require('../models/BankAccount');
const Currency = require('../models/Currency');
const User = require('../models/User');

//Save bank account
router.post('/', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;

  const { balance, coin } = req.body;

  const bankAccountData = {};
  (bankAccountData.user = userId), (bankAccountData.balance = balance);

  const currencyData = {};
  currencyData.coin = coin;

  let newCurrency;

  try {
    let currency = await Currency.findOne({ coin: coin });

    if (currency) {
      newCurrency = currency;
    } else {
      newCurrency = new Currency(currencyData);
    }

    bankAccountData.currency = newCurrency;

    let newBankAccount = new BankAccount(bankAccountData);
    let user = await User.findOne({ _id: req.user.id });

    await newCurrency.save();
    await newBankAccount.save();
    user.accounts.push(newBankAccount);
    await user.save();

    res.json(newBankAccount);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
