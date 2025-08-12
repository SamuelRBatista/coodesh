const Word = require('../models/Word');
const History = require('../models/History');
const Favorite = require('../models/Favorite');
const dictionaryService = require('../services/dictionaryService');
const redis = require('../config/redis');

const TTL = parseInt(process.env.CACHE_TTL_SECONDS || '86400', 10);

// GET /entries/en?search=&limit=&page=
exports.listWords = async (req, res, next) => {
  try {
    const search = (req.query.search || '').trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const filter = search ? { word: { $regex: `^${search}`, $options: 'i' } } : {};
    const totalDocs = await Word.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const results = await Word.find(filter).sort({ word: 1 }).skip((page - 1) * limit).limit(limit).lean();

    res.setHeader('x-cache', 'MISS');
    res.setHeader('x-response-time', '0');

    res.json({
      results: results.map(r => r.word),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (err) {
    next(err);
  }
};

// GET /entries/en/:word
exports.getWord = async (req, res, next) => {
  try {
    const { word } = req.params;
    const key = `word:${word.toLowerCase()}`;
    const start = Date.now();

    // try cache
    let cached = null;
    try { cached = await redis.get(key); } catch (e) { console.warn('Redis get failed', e.message); }

    if (cached) {
      // register history
      await History.create({ userId: req.user.id, word });
      res.setHeader('x-cache', 'HIT');
      res.setHeader('x-response-time', `${Date.now() - start}`);
      return res.json(JSON.parse(cached));
    }

    // fetch from external API
    const body = await dictionaryService.fetchWord(word);
    if (!body) return res.status(404).json({ message: 'Word not found' });

    // cache
    try { await redis.set(key, JSON.stringify(body), 'EX', TTL); } catch (e) { console.warn('Redis set failed', e.message); }

    // save history
    await History.create({ userId: req.user.id, word });

    res.setHeader('x-cache', 'MISS');
    res.setHeader('x-response-time', `${Date.now() - start}`);
    res.json(body);
  } catch (err) {
    next(err);
  }
};

exports.favoriteWord = async (req, res, next) => {
  try {
    const { word } = req.params;
    await Favorite.updateOne(
      { userId: req.user.id, word },
      { $set: { userId: req.user.id, word, added: new Date() } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Favorited' });
  } catch (err) {
    next(err);
  }
};

exports.unfavoriteWord = async (req, res, next) => {
  try {
    const { word } = req.params;
    await Favorite.deleteOne({ userId: req.user.id, word });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
