// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Memuat variabel lingkungan dari .env
const path = require('path');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: console.log,
  });

module.exports = sequelize;
