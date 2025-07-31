const mysql = require('mysql2');
require('dotenv').config();

// Use a connection pool instead of a single connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('MySQL pool created.');

module.exports = db;
