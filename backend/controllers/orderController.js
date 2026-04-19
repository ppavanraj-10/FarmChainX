const Order = require('../models/Order');
const Product = require('../models/Product');

const extractUnit = (quantityText = '') => {
  const parts = quantityText.trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(' ') : 'unit';
};

const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, shippingAddress, phone, notes } = req.body;

    if (!productId || !quantity || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Product, quantity, and shipping address are required',
      });
    }

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!['Delivered', 'Verified', 'In Transit'].includes(product.status)) {
      return res.status(400).json({
        success: false,
        message: 'This product is not available for purchase yet',
      });
    }

    if (!product.qrGenerated && product.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'This product is not consumer-ready yet',
      });
    }

    const order = await Order.create({
      product: product._id,
      productId: product.productId,
      cropName: product.cropName,
      quantity: Number(quantity),
      unit: extractUnit(product.quantity),
      buyer: req.user.id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      phone: phone || req.user.phone || '',
      shippingAddress: shippingAddress.trim(),
      notes: notes || '',
    });

    product.blockchain.push({
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      event: `Consumer order placed (${order.orderId})`,
      verified: true,
    });
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders };
