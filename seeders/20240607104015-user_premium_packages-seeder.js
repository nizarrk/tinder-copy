"use strict";
const moment = require('moment');

module.exports = {
    async up(queryInterface, Sequelize) {

        // Generating dummy data
        const dummyData = [];
        const now = moment();
        const numberOfUsers = 50; // Half of total dummy user

        for (let i = 0; i < numberOfUsers; i++) {
          dummyData.push({
            user_id: i + 1,
            premium_package_id: i % 2 === 0 ? 1 : 2, // Alternate between package_id 1 and 2 for demonstration
            start_date: now.toDate(),
            end_date: i % 2 === 0 ? now.clone().add(30, 'days').toDate() : now.clone().add(60, 'days').toDate(), // Set end_date based on condition
            created_at: new Date(),
            updated_at: new Date(),
          });
        }

        // Inserting the dummy data into the user_premium_packages table
        await queryInterface.bulkInsert("user_premium_packages", dummyData);
    },

    async down(queryInterface, Sequelize) {
        // Deleting all records from the user_premium_packages table
        await queryInterface.bulkDelete("user_premium_packages", null, {});
    },
};
