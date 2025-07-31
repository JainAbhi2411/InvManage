const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/InventoryController');

// Routes
router.get('/', inventoryController.getInventory);
router.post('/', inventoryController.addInventory);
router.delete('/:id', inventoryController.deleteInventory);
router.get('/count', inventoryController.countinventory);

module.exports = router;
