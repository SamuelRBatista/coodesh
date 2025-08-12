const User = require('../models/User');
const History = require('../models/History');
const Favorite = require('../models/Favorite');

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
};

exports.history = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const query = { userId: req.user.id };

    const totalDocs = await History.countDocuments(query);
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const results = await History.find(query).sort({ added: -1 }).skip((page - 1) * limit).limit(limit).lean();

    res.json({
      results: results.map(r => ({ word: r.word, added: r.added })),
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

exports.favorites = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const query = { userId: req.user.id };

    const totalDocs = await Favorite.countDocuments(query);
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const results = await Favorite.find(query).sort({ added: -1 }).skip((page - 1) * limit).limit(limit).lean();

    res.json({
      results: results.map(r => ({ word: r.word, added: r.added })),
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
