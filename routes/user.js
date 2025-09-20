const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { getStores, submitRating, updateRating } = require('../controllers/userController');

// GET all stores 
router.get('/stores', authenticateToken, requireRole('USER'), getStores);

// POST rating 
router.post('/stores/:storeId/rating', authenticateToken, requireRole('USER'), submitRating);

// PUT rating 
router.put('/stores/:storeId/rating', authenticateToken, requireRole('USER'), updateRating);

module.exports = router;
