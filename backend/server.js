const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const inventoryRoutes = require('./routes/InventoryRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const salesRoutes = require('./routes/salesRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vendors' , vendorRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchaseOrder' , purchaseOrderRoutes);
app.use('/api/sales',salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
