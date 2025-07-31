const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');

// Routes
router.get('/', purchaseOrderController.getAllPurchaseOrders);
router.post('/', purchaseOrderController.createPurchaseOrder);
router.delete('/:id', purchaseOrderController.deletePurchaseOrder); 
router.put('/:id/receive', purchaseOrderController.markAsReceived);


module.exports = router;
