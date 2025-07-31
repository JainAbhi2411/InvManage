const db = require('../config/db');

const Vendor = {
  getAll: (callback) => {
    db.query('SELECT * FROM vendors', callback);
  },

  add: (vendor, callback) => {
    db.query('INSERT INTO vendors SET ?', vendor, callback);
  },

  update: (id, vendor, callback) => {
    db.query('UPDATE vendors SET ? WHERE id = ?', [vendor, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM vendors WHERE id = ?', [id], callback);
  },
  count: (callback) => {
    db.query('SELECT COUNT(*) AS count FROM vendors', callback);
  },
};

module.exports = Vendor;
