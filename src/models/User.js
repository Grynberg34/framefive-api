const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const User = connection.define('User', {

  id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },

  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true
  },

  name: { 
    type: DataTypes.STRING,
    allowNull: true,
  },

  email: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  profile_img: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  google_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user'
  },
  refresh_token: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  refresh_token_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

},{
  tableName: 'users',
  timestamps: true
});

module.exports = User;