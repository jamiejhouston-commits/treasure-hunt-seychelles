const knex = require('knex');
const path = require('path');
require('dotenv').config();

// Use the single sqlite file at the backend root so scripts and API share data
const sqliteFile = path.resolve(__dirname, '../database.sqlite');

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: sqliteFile
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '../migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, '../seeds')
    }
  },
  production: {
    client: process.env.DATABASE_CLIENT || 'sqlite3',
    connection: process.env.DATABASE_URL || {
      filename: sqliteFile
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '../migrations')
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    console.log('📊 Database connection successful');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

module.exports = db;