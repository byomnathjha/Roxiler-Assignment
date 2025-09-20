const { Store, Rating, User } = require('../models');

async function getStoreRatings(req, res) {
  try {
    const ownerId = req.user.id;

    
    const stores = await Store.findAll({ where: { ownerId } });

    if (stores.length === 0)
      return res.status(404).json({ message: 'No stores found for this owner' });

    const storeIds = stores.map(s => s.id);

    
    const ratings = await Rating.findAll({
      where: { storeId: storeIds },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    // Map ratings by store
    const data = stores.map(store => {
      const storeRatings = ratings
        .filter(r => r.storeId === store.id)
        .map(r => ({
          userId: r.user.id,
          userName: r.user.name,
          userEmail: r.user.email,
          rating: r.rating,
        }));

      const averageRating =
        storeRatings.length > 0
          ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length
          : 0;

      return {
        storeId: store.id,
        storeName: store.name,
        averageRating,
        ratings: storeRatings,
      };
    });

    res.json({ totalStores: stores.length, data });
  } catch (err) {
    console.error("Owner getStoreRatings error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { getStoreRatings };
