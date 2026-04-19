const Product = require('../models/Product');

// ── Helper: generate blockchain hash ──
const genHash = () =>
  `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`;

const genTimestamp = () =>
  new Date().toISOString().replace('T', ' ').slice(0, 19);

// ── @route  GET /api/products ──
// ── @access Private ──
const getProducts = async (req, res, next) => {
  try {
    let query = {};

    // Farmers only see their own products
    if (req.user.role === 'farmer') {
      query.farmerId = req.user.id;
    }

    const products = await Product.find(query)
      .populate('farmerId', 'name email farm location phone avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/products/:id ──
// ── @access Private ──
const getProduct = async (req, res, next) => {
  try {
    // Support both MongoDB _id and custom productId (e.g. FCX-2024-001)
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null },
        { productId: req.params.id },
      ],
    }).populate('farmerId', 'name email farm location phone avatar');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/products ──
// ── @access Private (farmer only) ──
const createProduct = async (req, res, next) => {
  try {
    const { cropName, quantity, location, harvestDate, notes, image } = req.body;

    const firstBlock = {
      hash: genHash(),
      timestamp: genTimestamp(),
      event: 'Crop Registered & Harvested',
      verified: true,
    };

    const product = await Product.create({
      cropName,
      quantity,
      location,
      harvestDate,
      notes,
      image: image || null,
      farmerId: req.user.id,
      farmerName: req.user.name,
      farm: req.user.farm || `${req.user.name}'s Farm`,
      farmerPhone: req.user.phone || '',
      status: 'Pending AI',
      blockchain: [firstBlock],
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/products/:id/ai-analysis ──
// ── @access Private (farmer only) ──
const runAIAnalysis = async (req, res, next) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Only the farmer who owns it can run AI
    if (product.farmerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (product.aiAnalysis) {
      return res.status(400).json({ success: false, message: 'AI analysis already completed' });
    }

    // Simulate AI scoring
    const score = Math.floor(Math.random() * 20) + 78;
    const aiAnalysis = {
      health: score > 82 ? 'Healthy' : 'At Risk',
      qualityScore: score,
      yieldPrediction: Array.from({ length: 6 }, () => Math.floor(Math.random() * 25) + score - 15),
      pestRisk: score > 88 ? 'Very Low' : score > 80 ? 'Low' : 'Moderate',
      soilQuality: score > 90 ? 'Excellent' : score > 82 ? 'Good' : 'Fair',
      moistureLevel: `${Math.floor(Math.random() * 30) + 12}%`,
      proteinContent: `${(Math.random() * 5 + 3).toFixed(1)}g/100g`,
      analyzedAt: genTimestamp(),
    };

    const newBlock = {
      hash: genHash(),
      timestamp: genTimestamp(),
      event: 'AI Analysis Completed',
      verified: true,
    };

    product.aiAnalysis = aiAnalysis;
    product.status = 'Verified';
    product.blockchain.push(newBlock);
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/products/:id/transport ──
// ── @access Private (supply_chain only) ──
const updateTransport = async (req, res, next) => {
  try {
    const { stage } = req.body;
    const validStages = ['Picked Up', 'Warehouse', 'Transit', 'Retailer'];

    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, message: 'Invalid stage' });
    }

    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const stageEvents = {
      'Picked Up': 'Picked Up by Logistics Partner',
      'Warehouse': 'Arrived at Warehouse Distribution Hub',
      'Transit': 'Dispatched – In Transit to Retailer',
      'Retailer': 'Delivered to Retailer – Awaiting Confirmation',
    };
    const stageStatus = {
      'Picked Up': 'In Transit',
      'Warehouse': 'In Transit',
      'Transit': 'In Transit',
      'Retailer': 'Delivered',
    };

    // Update or add transport stage
    const existingIdx = product.transport.findIndex(t => t.stage === stage);
    const stageData = {
      stage,
      date: new Date().toISOString().slice(0, 10),
      agent: req.user.name || 'AgriLogistics Pro',
      vehicle: `MH-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}-XX-${Math.floor(Math.random() * 9999)}`,
      location: stage === 'Retailer' ? 'Retail Store' : `${stage} Hub`,
      completed: true,
    };

    if (existingIdx >= 0) {
      product.transport[existingIdx] = stageData;
    } else {
      product.transport.push(stageData);
    }

    // Add blockchain block
    product.blockchain.push({
      hash: genHash(),
      timestamp: genTimestamp(),
      event: stageEvents[stage],
      verified: true,
    });

    product.status = stageStatus[stage];
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/products/:id/receive ──
// ── @access Private (retailer only) ──
const markReceived = async (req, res, next) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.receivedByRetailer = true;
    product.status = 'Delivered';
    product.blockchain.push({
      hash: genHash(),
      timestamp: genTimestamp(),
      event: 'Received & Confirmed by Retailer',
      verified: true,
    });
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/products/:id/generate-qr ──
// ── @access Private (retailer only) ──
const generateQR = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.id },
      { qrGenerated: true },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/products/verify/:productId ──
// ── @access Public (consumer scan) ──
const verifyProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [
        { productId: req.params.productId },
        { productId: { $regex: req.params.productId, $options: 'i' } },
      ],
    }).populate('farmerId', 'name email farm location phone');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found. Check the ID and try again.' });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  runAIAnalysis,
  updateTransport,
  markReceived,
  generateQR,
  verifyProduct,
};
