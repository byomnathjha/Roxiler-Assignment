// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token (user not found)' });
    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired', error: err.message });
  }
}

module.exports = { authenticateToken };
