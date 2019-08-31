const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const BankAccount = require('../models/BankAccount');
const Currency = require('../models/Currency');

//Register User
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Include a valid email').isEmail(),
    check('password', 'Enter a password with 6 or more characters').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).send('Server Error: ' + error);
    }
  }
);

//Transfer to other user
router.post(
  '/transfer',
  [
    auth,
    check('targetUser', 'User to transfer is required')
      .not()
      .isEmpty(),
    check('amount', 'Include an amount to transfer')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { targetUser, amount } = req.body;

    try {
      let fromAccount = await BankAccount.findOne({ user: userId });
      let toAccount = await BankAccount.findOne({ user: targetUser });
      let fromCurrency = await Currency.findOne({ _id: fromAccount.currency });
      let toCurrency = await Currency.findOne({ _id: toAccount.currency });

      if (fromAccount.balance < amount) {
        return res.status(400).json({
          errors: [{ msg: 'Insufficient amount to make the transaction' }]
        });
      } else {
        fromAccount.balance -= amount;
        if (fromCurrency.coin === toCurrency.coin) {
          toAccount.balance += amount;
        } else {
          //Exchange money
        }
        fromAccount.save();
        toAccount.save();
        res.json({ status: 'success', newBalance: fromAccount.balance });
      }
    } catch (error) {
      res.status(500).send('Server Error: ' + error);
    }
  }
);

module.exports = router;
