const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

exports.authMiddleware = async (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
