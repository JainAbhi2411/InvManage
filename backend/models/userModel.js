const db = require('../config/db');

const createUser = (user, callback) => {
  const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [user.name, user.email, user.password, user.role], callback);
};

const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};

module.exports = { createUser, findUserByEmail };
