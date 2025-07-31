const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/', salesController.getAllSalesOrders);
router.post('/', salesController.createSalesOrder);
router.delete('/:id', salesController.deleteSalesOrder);
router.get('/:id', salesController.getSalesOrderById);
router.patch('/:id', salesController.updateSalesOrderStatus);

module.exports = router;
