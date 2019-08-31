const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

app.use(cors());

//Connect DB
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

//Routes
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));
app.use('/api/bank', require('./api/bankAccount'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
