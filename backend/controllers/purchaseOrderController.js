const db = require('../config/db');

// Get all purchase orders with vendor name and their items
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    // Fetch basic PO details with vendor name
    const [orders] = await db.promise().query(`
      SELECT 
        po.id, 
        po.po_number, 
        po.date, 
        po.status, 
        v.name AS vendorName
      FROM purchase_orders po
      JOIN vendors v ON po.vendor_id = v.id
      ORDER BY po.id DESC
    `);

    // Fetch items for all POs
    const [items] = await db.promise().query(`
      SELECT * FROM purchase_order_items
    `);

    // Attach items to corresponding purchase order
    const result = orders.map(order => {
  const orderItems = items.filter(i => i.purchase_order_id === order.id);
  const total = orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return {
    ...order,
    items: orderItems,
    totalCost: total.toFixed(2),
  };
});


    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Server error while fetching purchase orders' });
  }
};

// Create a new purchase order
exports.createPurchaseOrder = async (req, res) => {
  const { vendor, items } = req.body;

  if (!vendor || !items || items.length === 0) {
    return res.status(400).json({ error: 'Vendor and at least one item are required' });
  }

  try {
    // Get vendor ID
    const [vendorResult] = await db.promise().query(
      'SELECT id FROM vendors WHERE name = ? LIMIT 1',
      [vendor]
    );

    if (vendorResult.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const vendorId = vendorResult[0].id;

    // Generate unique PO number
    const poNumber = `PO-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];

    // Insert purchase order
    const [poResult] = await db.promise().query(
      'INSERT INTO purchase_orders (po_number, vendor_id, date, status) VALUES (?, ?, ?, ?)',
      [poNumber, vendorId, date, 'Pending']
    );

    const purchaseOrderId = poResult.insertId;

    // Insert all items
    // Insert all items
    const itemInserts = items.map(item => {
      return db.promise().query(
        'INSERT INTO purchase_order_items (purchase_order_id, item_name, quantity, category, price, image) VALUES (?, ?, ?, ?, ?, ?)',
        [purchaseOrderId, item.name, item.quantity, item.category, item.price, item.image || null]
      );
    });
    await Promise.all(itemInserts); 

    // Respond with the created PO info
    res.status(201).json({
      message: 'Purchase order created successfully',
      po_number: poNumber,
      vendor: vendor,
      total_items: items.length
    });

  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Server error while creating purchase order' });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // First delete the items
    await db.promise().query(
      'DELETE FROM purchase_order_items WHERE purchase_order_id = ?',
      [id]
    );

    // Then delete the order
    await db.promise().query(
      'DELETE FROM purchase_orders WHERE id = ?',
      [id]
    );

    res.json({ success: true, message: 'Purchase order deleted successfully' });
  } catch (err) {
    console.error('Delete PO Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const generateSKU = (name, category) => {
  const nameCode = name.slice(0, 3).toUpperCase();
  const categoryCode = (category || 'GEN').slice(0, 3).toUpperCase();
  const unique = Date.now(); // Or use UUID if preferred
  return `${nameCode}-${categoryCode}-${unique}`;
};
// Mark Purchase Order as Received and Add Items to Inventory
exports.markAsReceived = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Update the PO status to Received
    await db.promise().query(
      `UPDATE purchase_orders SET status = 'Received' WHERE id = ?`,
      [id]
    );

    // Step 2: Fetch the PO and related items
    const [[poResult]] = await db.promise().query(
      `SELECT v.name as vendorName
       FROM purchase_orders po
       JOIN vendors v ON po.vendor_id = v.id
       WHERE po.id = ?`,
      [id]
    );

    const [items] = await db.promise().query(
      `SELECT * FROM purchase_order_items WHERE purchase_order_id = ?`,
      [id]
    );

    // Step 3: Insert items into inventory
    const insertPromises = items.map(item => {
  const sku = generateSKU(item.item_name, item.category); // category optional
  const status = item.quantity > 0 ? 'In Stock' : 'Out of Stock';
  const category = item.category || 'General';
  const price = item.price || 0;

  return db.promise().query(
    `INSERT INTO inventory (name, sku, category, quantity, price, vendor, status, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.item_name,
      sku,
      category,
      item.quantity,
      price,
      poResult.vendorName,
      status,
      item.image || null,
    ]
  );
});
    await Promise.all(insertPromises);

    res.status(200).json({ success: true, message: 'Purchase Order marked as received and inventory updated.' });
  } catch (err) {
    console.error('Mark as Received Error:', err);
    res.status(500).json({ error: 'Server error while marking order as received.' });
  }
};