  const db = require('../config/db');

  // Get all inventory items
  exports.getInventory = (req, res) => {
    const sql = 'SELECT * FROM inventory';
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  };

  // Add new inventory item
  exports.addInventory = (req, res) => {
  const { name, sku, category, quantity, price, vendor, image } = req.body;  // ✅ Add `image`
  const status = quantity > 0 ? 'In Stock' : 'Out of Stock';

  const sql = `INSERT INTO inventory (name, sku, category, quantity, price, vendor, status, image)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, sku, category, quantity, price, vendor, status, image];  // ✅ Add `image`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Inventory added successfully', id: result.insertId });
  });
};

  // Delete inventory item
  exports.deleteInventory = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM inventory WHERE id = ?';

    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Inventory deleted successfully' });
    });
  };

  exports.countinventory = (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM inventory';
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results[0].count);
    });
  };
