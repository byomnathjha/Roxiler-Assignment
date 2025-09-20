const { Store, Rating } = require('../models');
const { Op } = require('sequelize');

async function getStores(req, res) {
  try {
    const { name, address, ownerId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    
    let where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (ownerId) where.ownerId = ownerId;

    // Fetch stores
    const { rows: stores, count: total } = await Store.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    // Fetch ratings separately
    const storeIds = stores.map(store => store.id);
    const allRatings = await Rating.findAll({
      where: { storeId: storeIds }
    });

    // Map ratings
    const data = stores.map(store => {
      const storeRatings = allRatings.filter(r => r.storeId === store.id);
      const userRatingObj = storeRatings.find(r => r.userId === req.user.id);

      const overallRating =
        storeRatings.length > 0
          ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating,
        userRating: userRatingObj ? userRatingObj.rating : null
      };
    });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// Submit a new rating
async function submitRating(req, res) {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check store exists
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Check if user already rated
    const existingRating = await Rating.findOne({ where: { storeId, userId } });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this store. Use update instead.' });
    }

    const newRating = await Rating.create({ storeId, userId, rating });

    res.json({ message: 'Rating submitted', rating: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateRating(req, res) {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the existing rating
    const existingRating = await Rating.findOne({ where: { storeId, userId } });
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found. Submit first.' });
    }

    // Update the rating
    existingRating.rating = rating;
    await existingRating.save();

    res.json({ message: 'Rating updated', rating: existingRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { getStores,submitRating, updateRating };
