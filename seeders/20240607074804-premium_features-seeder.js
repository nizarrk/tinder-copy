// For premium_features-seeder.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('premium_features', [
      { name: 'Unlimited Swipes', premium_package_id: 1, description: 'Swipe as much as you want without any limits.' },
      { name: 'Unlimited Swipes', premium_package_id: 2, description: 'Swipe as much as you want without any limits.' },
      { name: 'Verified Label', premium_package_id: 2, description: 'Get a verified label on your profile.' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('premium_features', null, {});
  }
};
