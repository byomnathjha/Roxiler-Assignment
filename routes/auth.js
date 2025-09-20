// routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/update-password', authenticateToken, updatePassword);

module.exports = router;
