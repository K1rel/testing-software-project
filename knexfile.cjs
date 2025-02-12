// Update knexfile.js for different environments
require('dotenv').config();
module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'eCommerce_dev'
      },
      migrations: {
        directory: './migrations'
      },
      seeds: {
        directory: './seeds'
      }
    },
    test: {
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'eCommerce_test'
      },
      migrations: {
        directory: './tests/migrations'
      },
      seeds: {
        directory: './tests/seeds'
      }
    }
  };


