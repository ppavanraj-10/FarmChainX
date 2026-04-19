const mongoose = require('mongoose');

// ── Blockchain Entry Sub-schema ──
const blockchainEntrySchema = new mongoose.Schema(
  {
    hash: { type: String, required: true },
    event: { type: String, required: true },
    timestamp: { type: String, required: true },
    verified: { type: Boolean, default: true },
  },
  { _id: false }
);

// ── Transport Stage Sub-schema ──
const transportStageSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: ['Picked Up', 'Warehouse', 'Transit', 'Retailer'],
      required: true,
    },
    date: { type: String, default: null },
    agent: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    location: { type: String, default: '' },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

// ── AI Analysis Sub-schema ──
const aiAnalysisSchema = new mongoose.Schema(
  {
    health: { type: String, enum: ['Healthy', 'At Risk'], required: true },
    qualityScore: { type: Number, min: 0, max: 100, required: true },
    yieldPrediction: [{ type: Number }],
    pestRisk: { type: String, default: 'Low' },
    soilQuality: { type: String, default: 'Good' },
    moistureLevel: { type: String, default: '' },
    proteinContent: { type: String, default: '' },
    analyzedAt: { type: String, default: '' },
  },
  { _id: false }
);

// ── Main Product Schema ──
const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      default: function () {
        return `FCX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
      },
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    quantity: { type: String, required: [true, 'Quantity is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    harvestDate: { type: String, required: [true, 'Harvest date is required'] },
    notes: { type: String, default: '' },
    image: { type: String, default: null }, // base64 or URL

    // Farmer reference
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerName: { type: String, required: true },
    farm: { type: String, default: '' },
    farmerPhone: { type: String, default: '' },

    // Status
    status: {
      type: String,
      enum: ['Pending AI', 'Verified', 'In Transit', 'Delivered'],
      default: 'Pending AI',
    },

    // Sub-documents
    aiAnalysis: { type: aiAnalysisSchema, default: null },
    blockchain: { type: [blockchainEntrySchema], default: [] },
    transport: { type: [transportStageSchema], default: [] },

    // Flags
    qrGenerated: { type: Boolean, default: false },
    receivedByRetailer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate unique productId before save
productSchema.pre('save', async function (next) {
  if (this.isNew && !this.productId) {
    let id, exists;
    do {
      id = `FCX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      exists = await mongoose.model('Product').findOne({ productId: id });
    } while (exists);
    this.productId = id;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
