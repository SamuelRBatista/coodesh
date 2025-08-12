const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/me', authMiddleware, userController.me);
router.get('/me/history', authMiddleware, userController.history);
router.get('/me/favorites', authMiddleware, userController.favorites);

module.exports = router;
