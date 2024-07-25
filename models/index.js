const { DataTypes } = require('sequelize');
const sequelize = require('../database/db'); // Impor koneksi dari file konfigurasi

const User = require('./user')(sequelize, DataTypes);
const Complaint = require('./complaint')(sequelize, DataTypes);
const Response = require('./response')(sequelize, DataTypes);

// Define associations
Complaint.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Complaint.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });

Response.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
Response.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });

Complaint.hasOne(Response, { foreignKey: 'complaintId', as: 'response' });

// Sinkronkan model dengan database
sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Error synchronizing database:', err));

module.exports = {
    sequelize,
    User,
    Complaint,
    Response
};