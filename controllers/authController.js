// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { nameValid, addressValid, passwordValid, emailValid } = require('../utils/validators');
require('dotenv').config();

const saltRounds = 10;

async function signup(req, res) {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    if (!nameValid(name)) return res.status(400).json({ message: 'Name must be 20-60 characters' });
    if (!emailValid(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!addressValid(address)) return res.status(400).json({ message: 'Address too long' });
    if (!passwordValid(password)) return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and special char' });

    const exists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      address,
      role: role ? role.toUpperCase() : 'USER'
    });

    return res.status(201).json({
      message: 'User created',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('signup error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updatePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Provide old and new password' });
    if (!passwordValid(newPassword)) return res.status(400).json({ message: 'New password rules failed' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Old password incorrect' });

    const hashed = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashed;
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('updatePassword error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { signup, login, updatePassword };
