const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  runAIAnalysis,
  updateTransport,
  markReceived,
  generateQR,
  verifyProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// ── Public ──
router.get('/verify/:productId', verifyProduct);

// ── Private ──
router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);

// Farmer only
router.post('/', protect, authorize('farmer'), createProduct);
router.post('/:id/ai-analysis', protect, authorize('farmer'), runAIAnalysis);

// Supply Chain only
router.put('/:id/transport', protect, authorize('supply_chain'), updateTransport);

// Retailer only
router.put('/:id/receive', protect, authorize('retailer'), markReceived);
router.put('/:id/generate-qr', protect, authorize('retailer'), generateQR);

module.exports = router;
