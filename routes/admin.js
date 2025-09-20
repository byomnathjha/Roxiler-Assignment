// routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { addUser, getUsers, addStore, getStores, getDashboard } = require('../controllers/adminController');

// Only ADMIN can access 
router.post('/users', authenticateToken, requireRole('ADMIN'), addUser);
router.get('/users', authenticateToken, requireRole('ADMIN'), getUsers);
router.get('/dashboard', authenticateToken, requireRole('ADMIN'), getDashboard);
router.post('/stores', authenticateToken, requireRole('ADMIN'), addStore);
router.get('/stores', authenticateToken, requireRole('ADMIN'), getStores);

module.exports = router;
