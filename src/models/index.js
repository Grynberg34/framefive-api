const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User');

module.exports = {
  connection,
  User,
};