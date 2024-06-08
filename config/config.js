const dotenv = require('dotenv'); // Load environment variables from .env file
const path = require('path');
dotenv.config({ path: path.join(__dirname, "../env/.env.dev") });

module.exports = {
  development: {
    username: process.env.MYSQL_TINDER_USER,
    password: process.env.MYSQL_TINDER_PASS,
    database: process.env.MYSQL_TINDER_NAME,
    host: process.env.MYSQL_TINDER_HOST,
    dialect: process.env.MYSQL_TINDER_DIALECT,
  },
  test: {
    username: process.env.MYSQL_TINDER_USER,
    password: process.env.MYSQL_TINDER_PASS,
    database: process.env.MYSQL_TINDER_NAME,
    host: process.env.MYSQL_TINDER_HOST,
    dialect: process.env.MYSQL_TINDER_DIALECT,
  },
  production: {
    username: process.env.MYSQL_TINDER_USER,
    password: process.env.MYSQL_TINDER_PASS,
    database: process.env.MYSQL_TINDER_NAME,
    host: process.env.MYSQL_TINDER_HOST,
    dialect: process.env.MYSQL_TINDER_DIALECT,
  },
};
