import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import wordRoutes from './routes/wordRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

export default app;
