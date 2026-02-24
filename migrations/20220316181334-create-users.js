'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },

      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },

      name: { 
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: { 
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      profile_img: { 
        type: Sequelize.STRING,
        allowNull: true,
      },

      google_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },

      role: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
      },
      
      refresh_token: {
        type: Sequelize.STRING(128),
        allowNull: true
      },

      refresh_token_expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};