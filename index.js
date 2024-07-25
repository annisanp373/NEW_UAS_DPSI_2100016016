// routes/index.js

const express = require('express');
const serverless = require('serverless-http');
const router = express.Router();
const { sequelize } = require('../models/index'); // Import Sequelize instance dan model

// Middleware untuk parsing JSON
router.use(express.json());

// Rute utama
router.get('/', function(req, res, next) {
  res.json({ message: 'Welcome to Express' });
});

// Sinkronkan database ketika aplikasi dimulai
sequelize.sync()
  .then(() => console.log('Database synchronized with Sequelize'))
  .catch(err => console.error('Error synchronizing database with Sequelize:', err));

// Buat server Express dan gunakan router
const app = express();
app.use('/', router);

// Export handler untuk serverless function
module.exports.handler = serverless(app);
