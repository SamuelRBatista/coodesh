import Word from '../models/Word.js';
import History from '../models/History.js';
import Favorite from '../models/Favorite.js';
import { fetchWord } from '../services/dictionaryService.js'; 
import redis from '../config/redis.js';

const TTL = parseInt(process.env.CACHE_TTL_SECONDS || '86400', 10);

export async function listWords(req, res, next) {
  debugger;
  try {
    const search = (req.query.search || '').trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    let filter = search
      ? { word: { $regex: `^${search}`, $options: 'i' } }
      : {};

    let totalDocs = await Word.countDocuments(filter);
    let totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    let results = await Word.find(filter)
      .sort({ word: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Se não encontrou nada no DB, buscar na API
    if (results.length === 0 && search) {
      const apiData = await fetchWord(search);
      if (apiData && Array.isArray(apiData)) {
        // Salvar a palavra no Mongo
        await Word.create({ word: search, data: apiData });
        // Retornar a palavra para o frontend
        results = [{ word: search }];
        totalDocs = 1;
        totalPages = 1;
      }
    }

    res.json({
      results: results.map(r => r.word), // sempre retorna lista de strings
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (err) {
    console.error('Erro no listWords:', err);
    res.status(500).json({ error: 'Erro ao buscar palavra' });
  }
}

export async function getWord(req, res, next) {
  try {
    const { word } = req.params;
    const key = `word:${word.toLowerCase()}`;
    const start = Date.now();

    let cached = null;
    try {
      cached = await redis.get(key);
    } catch (e) {
      console.warn('Redis get failed', e.message);
    }

    if (cached) {
      await History.create({ userId: req.user.id, word });
      res.setHeader('x-cache', 'HIT');
      res.setHeader('x-response-time', `${Date.now() - start}`);
      return res.json(JSON.parse(cached));
    }

    const body = await fetchWord(word);
    if (!body) return res.status(404).json({ message: 'Word not found' });

    try {
      await redis.set(key, JSON.stringify(body), 'EX', TTL);
    } catch (e) {
      console.warn('Redis set failed', e.message);
    }

    await History.create({ userId: req.user.id, word });

    res.setHeader('x-cache', 'MISS');
    res.setHeader('x-response-time', `${Date.now() - start}`);
    res.json(body);
  } catch (err) {
    next(err);
  }
}

export async function favoriteWord(req, res, next) {
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
}

export async function unfavoriteWord(req, res, next) {
  try {
    const { word } = req.params;
    await Favorite.deleteOne({ userId: req.user.id, word });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
