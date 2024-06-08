"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Define structure of Users table
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            birthdate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            location: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            bio: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            profile_picture: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
            },
            updated_at: {
                type: Sequelize.DATE,
            }
        });

        // You can also add additional columns or constraints here
    },

    async down(queryInterface, Sequelize) {
        // Remove the Users table if migration is rolled back
        await queryInterface.dropTable("users");
    },
};
