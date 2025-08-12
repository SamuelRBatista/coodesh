const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entriesController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// List words (public)
router.get('/en', entriesController.listWords);

// Word detail (records history) — requires auth
router.get('/en/:word', authMiddleware, entriesController.getWord);

// Favorite / unfavorite
router.post('/en/:word/favorite', authMiddleware, entriesController.favoriteWord);
router.delete('/en/:word/unfavorite', authMiddleware, entriesController.unfavoriteWord);

module.exports = router;
