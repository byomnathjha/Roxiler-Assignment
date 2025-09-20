const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  storeId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
}, { tableName: 'ratings', timestamps: true });

module.exports = Rating;
