import Word from '../models/Word.js';
import History from '../models/History.js';
import Favorite from '../models/Favorite.js';
import { fetchWord } from '../services/dictionaryService.js';
import redis from '../config/redis.js';

const TTL = parseInt(process.env.CACHE_TTL_SECONDS || '86400', 10);

export async function listWords(req, res, next) {
  try {
    const search = (req.query.search || '').trim().toLowerCase();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
   
    if (!search || /[^a-z0-9]/.test(search)) {
      return res.status(400).json({ error: 'Termo de busca inválido' });
    }
  
    let filter = search
      ? { word: { $regex: `^${search}`, $options: 'i' } }
      : {};

    console.log('Filtro MongoDB:', filter);

    let totalDocs = await Word.countDocuments(filter);
    console.log('Total de documentos:', totalDocs);

    let totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    let results = await Word.find(filter)
      .sort({ word: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
 

    if (results.length === 0 && search) {
      
      const apiData = await fetchWord(search);
    
      if (apiData && Array.isArray(apiData)) {
        try {
          await Word.updateOne(
            { word: search.toLowerCase() },
            { $set: { word: search.toLowerCase(), data: apiData } },
            { upsert: true }
          );
         
          results = [{ word: search, data: apiData }];
          totalDocs = 1;
          totalPages = 1;
        } catch (updateError) {
          console.error('Erro ao salvar no banco:', updateError);
          return res.json({
            results: [],
            totalDocs: 0,
            page,
            totalPages: 1,
            hasNext: false,
            hasPrev: page > 1
          });
        }
      } else {
        
        return res.json({
          results: [],
          totalDocs: 0,
          page,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1
        });
      }
    }

    res.json({
      results: results.map(r => ({ word: r.word, data: r.data })),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (err) {
    console.error('Erro no listWords:', {
      message: err.message,
      stack: err.stack,
      search,
      limit,
      page
    });
    res.status(500).json({ error: 'Erro ao buscar palavra', details: err.message });
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
      await History.updateOne(
        { userId: req.user.id, word },
        { $set: { userId: req.user.id, word, lastSearchedAt: new Date() } },
        { upsert: true }
      );

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

    await History.updateOne(
      { userId: req.user.id, word },
      { $set: { userId: req.user.id, word, lastSearchedAt: new Date() } },
      { upsert: true }
    );

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