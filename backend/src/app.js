const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const wordRoutes = require('./routes/wordRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middlewares/errorHandler');


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.get('/', (req, res) => {
  res.json({ message: 'Fullstack Challenge 🏅 - Dictionary' });
});

app.use('/auth', authRoutes);
app.use('/entries', wordRoutes);
app.use('/user', userRoutes);

app.use(errorHandler);

module.exports = app;
