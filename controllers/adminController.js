// controllers/adminController.js
const { User, Store, Rating } = require('../models');
const bcrypt = require('bcrypt');
const { Op, fn, col } = require('sequelize');

// Add a user (ADMIN only)
async function addUser(req, res) {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: hashed,
      role: role || 'USER',
    });

    res.status(201).json({ message: "User created by admin", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get all users (filter by name, email, address, role, pagination)
async function getUsers(req, res) {
  try {
    const { name, email, address, role, page = 1, limit = 10 } = req.query;
    const where = {};

    if (role) where.role = role.toUpperCase();
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const users = await User.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({ total: users.count, page: parseInt(page), limit: parseInt(limit), data: users.rows });
  } catch (err) {
    console.error("Get Users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Add a store (ADMIN only)
async function addStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name || !ownerId) return res.status(400).json({ message: "Missing name or ownerId" });

    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json({ message: "Store created", store });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get all stores (filter, search, pagination)
async function getStores(req, res) {
  try {
    const { ownerId, name, email, address, page = 1, limit = 10 } = req.query;
    const where = {};

    if (ownerId) where.ownerId = ownerId;
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAndCountAll({
      where,
      offset: (page - 1) * parseInt(limit),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Rating,
          as: 'ratings', 
          attributes: ['rating'],
        },
      ],
    });

    // Add overallRating for each store
    const storesWithRating = stores.rows.map((s) => {
      const ratings = s.ratings || [];
      const overallRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : null;
      return { ...s.toJSON(), overallRating };
    });

    res.json({ total: stores.count, page: parseInt(page), limit: parseInt(limit), data: storesWithRating });
  } catch (err) {
    console.error("Get Stores error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Dashboard (Admin only)
async function getDashboard(req, res) {
  try {
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { role: 'ADMIN' } });
    const totalOwners = await User.count({ where: { role: 'OWNER' } });
    const totalNormalUsers = await User.count({ where: { role: 'USER' } });

    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    const avgRatingResult = await Rating.findAll({
      attributes: [[fn('AVG', col('rating')), 'avgRating']],
    });
    const avgRating = parseFloat(avgRatingResult[0].get('avgRating')) || 0;

    res.json({
      users: {
        total: totalUsers,
        admins: totalAdmins,
        owners: totalOwners,
        normalUsers: totalNormalUsers,
      },
      stores: totalStores,
      ratings: {
        total: totalRatings,
        average: avgRating.toFixed(2),
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { addUser, getUsers, addStore, getStores, getDashboard };
