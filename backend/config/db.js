const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // Add if Railway uses non-default port (e.g., 12345)
  ssl: {
    rejectUnauthorized: true, // Needed for Railway
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('MySQL pool created.');

module.exports = db;
