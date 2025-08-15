import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - no Bearer' });
  }

  const token = auth.split(' ')[1]?.trim();

  if (!token) return res.status(401).json({ message: 'Unauthorized - token vazio' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
   
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Unauthorized - usuário não encontrado' });

    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized - jwt falhou' });
  }
}
