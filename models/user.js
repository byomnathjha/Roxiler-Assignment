const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(60), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING(400), allowNull: true },
  role: {
    type: DataTypes.ENUM('ADMIN', 'USER', 'OWNER'),
    defaultValue: 'USER',
    allowNull: false
  }
}, { tableName: 'users', timestamps: true });

module.exports = User;
