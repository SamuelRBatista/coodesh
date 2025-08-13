import express from 'express';
import * as entriesController from '../controllers/entriesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// List words (public)
router.get('/en', entriesController.listWords);

// Word detail (records history) — requires auth
router.get('/en/:word', authMiddleware, entriesController.getWord);

// Favorite / unfavorite
router.post('/en/:word/favorite', authMiddleware, entriesController.favoriteWord);
router.delete('/en/:word/unfavorite', authMiddleware, entriesController.unfavoriteWord);

export default router;
