"use strict";
const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface, Sequelize) {
        // Hashing the password
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Generating dummy data
        const dummyData = [];
        const numberOfUsers = 100;

        for (let i = 0; i < numberOfUsers; i++) {
            dummyData.push({
                first_name: `User${i + 1}`,
                last_name: `Doe${i + 1}`,
                username: `user${i + 1}`,
                email: `user${i + 1}@example.com`,
                password: hashedPassword,
                gender: i % 2 === 0 ? "male" : "female",
                birthdate: new Date(1990 + i, 0, 1), // Varying birthdates from 1990-01-01 to 2089-01-01
                location: "New York",
                bio: `Hello, I'm User${i + 1}.`,
                profile_picture: 'https://source.unsplash.com/200x300',
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        // Inserting the dummy data into the users table
        await queryInterface.bulkInsert("users", dummyData);
    },

    async down(queryInterface, Sequelize) {
        // Deleting all records from the users table
        await queryInterface.bulkDelete("users", null, {});
    },
};
