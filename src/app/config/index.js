'use strict';
const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DB_URL || '',
};

module.exports = config;
