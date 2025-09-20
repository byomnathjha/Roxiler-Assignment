const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const { sequelize } = require('./models');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const ownerRoutes = require('./routes/owner');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'Roxiler backend running...' }));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    await sequelize.sync({ alter: true }); 
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ DB connection error:', err);
  }
}

start();
