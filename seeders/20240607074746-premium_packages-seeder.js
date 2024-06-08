// For premium_packages-seeder.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('premium_packages', [
      { name: 'Gold Package', price: 100000, duration_days: 30 },
      { name: 'Platinum Package', price: 250000, duration_days: 60 }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('premium_packages', null, {});
  }
};
