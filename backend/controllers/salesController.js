const db = require('../config/db');

// Generate unique SO number
const generateSONumber = () => `SO-${Date.now()}`;

// Get all sales orders with basic info
exports.getAllSalesOrders = async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
      SELECT id, so_number, customer_name, date, total, status
      FROM sales_orders
      ORDER BY id DESC
    `);

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching sales orders:', err);
    res.status(500).json({ error: 'Server error while fetching sales orders' });
  }
};

// Get single sales order with items
exports.getSalesOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const [[order]] = await db.promise().query(
      `SELECT * FROM sales_orders WHERE id = ?`,
      [id]
    );

    const [items] = await db.promise().query(
      `SELECT * FROM sales_order_items WHERE sales_order_id = ?`,
      [id]
    );

    res.status(200).json({ ...order, items });
  } catch (err) {
    console.error('Error getting sales order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create sales order
exports.createSalesOrder = async (req, res) => {
  const { customer, items } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer and items are required' });
  }

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const soNumber = generateSONumber();
    const date = new Date().toISOString().split('T')[0];
    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO sales_orders (so_number, customer_name, date, total) VALUES (?, ?, ?, ?)`,
      [soNumber, customer, date, total]
    );
    const salesOrderId = orderResult.insertId;

    // Insert items & update inventory
    for (const item of items) {
      const { name, quantity, price } = item;

      // Insert order item
      await connection.query(
        `INSERT INTO sales_order_items (sales_order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)`,
        [salesOrderId, name, quantity, price]
      );

      // Update inventory quantity
      const [invResult] = await connection.query(
        `UPDATE inventory SET quantity = quantity - ? WHERE name = ? AND quantity >= ?`,
        [quantity, name, quantity]
      );

      if (invResult.affectedRows === 0) {
        throw new Error(`Insufficient stock for item: ${name}`);
      }
    }

    await connection.commit();
    res.status(201).json({
      message: 'Sales order created and inventory updated successfully',
      so_number: soNumber,
      total_items: items.length
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating sales order with inventory update:', err);
    res.status(500).json({ error: 'Server error while creating sales order or updating inventory' });
  } finally {
    connection.release();
  }
};

// Delete sales order
exports.deleteSalesOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query(`DELETE FROM sales_order_items WHERE sales_order_id = ?`, [id]);
    await db.promise().query(`DELETE FROM sales_orders WHERE id = ?`, [id]);

    res.json({ success: true, message: 'Sales order deleted successfully' });
  } catch (err) {
    console.error('Error deleting sales order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
// Update sales order status (e.g. Delivered)
exports.updateSalesOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const [result] = await db.promise().query(
      `UPDATE sales_orders SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Server error while updating order status' });
  }
};
