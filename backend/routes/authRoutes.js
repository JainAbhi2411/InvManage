const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const vendorController = require('../controllers/vendorController');

router.post('/register', register);
router.post('/login', login);
router.get('/', vendorController.getVendors);
router.post('/', vendorController.addVendor);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;
