const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { getStoreRatings } = require('../controllers/ownerController');

// Only OWNER can access
router.get('/stores/ratings', authenticateToken, requireRole('OWNER'), getStoreRatings);

module.exports = router;
