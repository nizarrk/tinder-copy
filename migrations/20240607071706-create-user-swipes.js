'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('premium_features', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    swiper_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    swiped_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    action: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
    }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_swipes');
  }
};