const sequelize = require('../config/db');
const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

// Associations
User.hasMany(Store, { foreignKey: 'ownerId', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'userRatings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Store, Rating };
