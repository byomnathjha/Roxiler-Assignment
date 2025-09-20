const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: true },
  address: { type: DataTypes.STRING(400), allowNull: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'stores', timestamps: true });

module.exports = Store;
