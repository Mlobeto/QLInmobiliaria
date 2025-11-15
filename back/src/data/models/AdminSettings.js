const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../data');

const AdminSettings = sequelize.define('AdminSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  signatureUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'admin_settings',
  timestamps: true,
});

module.exports = AdminSettings;
