import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authMiddleware, userController.me);
router.get('/me/history', authMiddleware, userController.history);
router.get('/me/favorites', authMiddleware, userController.favorites);

export default router;
