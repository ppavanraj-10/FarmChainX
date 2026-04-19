const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('consumer'), createOrder);
router.get('/my-orders', protect, authorize('consumer'), getMyOrders);

module.exports = router;
