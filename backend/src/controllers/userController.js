import User from '../models/User.js';
import History from '../models/History.js';
import Favorite from '../models/Favorite.js';

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
}

export async function history(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const query = { userId: req.user.id };

    const totalDocs = await History.countDocuments(query);
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const results = await History.find(query)
      .sort({ added: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      results: results.map(r => ({ word: r.word, added: r.added })),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  } catch (err) {
    next(err);
  }
}

export async function favorites(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const query = { userId: req.user.id };

    const totalDocs = await Favorite.countDocuments(query);
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const results = await Favorite.find(query)
      .sort({ added: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      results: results.map(r => ({ word: r.word, added: r.added })),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  } catch (err) {
    next(err);
  }
}
