/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
        directory: './db/migrations',
      },
    seeds: {
        directory: './db/seeds',
      },
  },
  ci: {
    client: 'pg',
    connection: {
      host: 'postgres', 
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  }

};