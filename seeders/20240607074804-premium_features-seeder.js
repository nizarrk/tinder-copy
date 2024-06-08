// For premium_features-seeder.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('premium_features', [
      { name: 'Unlimited Swipes', premium_package_id: 1 },
      { name: 'Unlimited Swipes', premium_package_id: 2 },
      { name: 'Verified Label', premium_package_id: 2 },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('premium_features', null, {});
  }
};
