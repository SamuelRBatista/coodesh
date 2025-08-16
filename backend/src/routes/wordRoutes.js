import express from 'express';
import * as entriesController from '../controllers/entriesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/en',  authMiddleware, entriesController.listWords);

router.get('/en/:word',  authMiddleware, entriesController.getWord);

router.post('/en/:word/favorite', authMiddleware, entriesController.favoriteWord);
router.delete('/en/:word/unfavorite', authMiddleware, entriesController.unfavoriteWord);

export default router;
