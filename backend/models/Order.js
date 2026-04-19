const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: function () {
        return `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;
      },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productId: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: {
      type: Number,
      required: [true, 'Order quantity is required'],
      min: [1, 'Order quantity must be at least 1'],
    },
    unit: { type: String, default: 'unit' },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    phone: { type: String, default: '' },
    shippingAddress: { type: String, required: [true, 'Shipping address is required'] },
    status: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderId) {
    let id;
    let exists = true;

    while (exists) {
      id = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;
      exists = await mongoose.model('Order').findOne({ orderId: id });
    }

    this.orderId = id;
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
