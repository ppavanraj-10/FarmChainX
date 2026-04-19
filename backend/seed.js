require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected for seeding');
};

const genHash = () =>
  `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`;

const seedUsers = async () => {
  await User.deleteMany({});
  console.log('🗑  Cleared users');

  const users = await User.create([
    {
      name: 'Arjun Patel',
      email: 'farmer@demo.com',
      password: 'demo123',
      role: 'farmer',
      farm: 'Green Valley Organics',
      location: 'Ludhiana, Punjab',
      phone: '+91 98765 43210',
      avatar: 'AP',
    },
    {
      name: 'Sarah Chen',
      email: 'supply@demo.com',
      password: 'demo123',
      role: 'supply_chain',
      company: 'AgriLogistics Pro',
      location: 'Mumbai, Maharashtra',
      phone: '+91 87654 32109',
      avatar: 'SC',
    },
    {
      name: 'Marcus Webb',
      email: 'retailer@demo.com',
      password: 'demo123',
      role: 'retailer',
      store: 'FreshMart Superstore',
      location: 'Bangalore, Karnataka',
      phone: '+91 76543 21098',
      avatar: 'MW',
    },
    {
      name: 'Priya Singh',
      email: 'consumer@demo.com',
      password: 'demo123',
      role: 'consumer',
      location: 'Hyderabad, Telangana',
      phone: '+91 65432 10987',
      avatar: 'PS',
    },
  ]);

  console.log(`✅ Created ${users.length} demo users`);
  return users;
};

const seedProducts = async (farmer) => {
  await Product.deleteMany({});
  console.log('🗑  Cleared products');

  const products = await Product.create([
    {
      productId: 'FCX-2024-001',
      cropName: 'Organic Basmati Rice',
      quantity: '500 kg',
      location: 'Ludhiana, Punjab',
      harvestDate: '2024-03-15',
      farmerId: farmer._id,
      farmerName: farmer.name,
      farm: farmer.farm,
      farmerPhone: farmer.phone,
      status: 'Delivered',
      aiAnalysis: {
        health: 'Healthy',
        qualityScore: 94,
        yieldPrediction: [82, 88, 91, 94, 90, 87],
        pestRisk: 'Low',
        soilQuality: 'Excellent',
        moistureLevel: '18%',
        proteinContent: '8.2g/100g',
        analyzedAt: '2024-03-16 10:45:32',
      },
      blockchain: [
        { hash: genHash(), timestamp: '2024-03-15 08:23:14', event: 'Crop Registered & Harvested', verified: true },
        { hash: genHash(), timestamp: '2024-03-16 10:45:32', event: 'AI Analysis Completed', verified: true },
        { hash: genHash(), timestamp: '2024-03-17 14:12:07', event: 'Picked Up by Logistics Partner', verified: true },
        { hash: genHash(), timestamp: '2024-03-19 09:33:51', event: 'Arrived at Warehouse Distribution Hub', verified: true },
        { hash: genHash(), timestamp: '2024-03-21 16:22:18', event: 'Dispatched – In Transit to Retailer', verified: true },
        { hash: genHash(), timestamp: '2024-03-23 11:05:44', event: 'Delivered to Retailer – Awaiting Confirmation', verified: true },
        { hash: genHash(), timestamp: '2024-03-23 14:30:00', event: 'Received & Confirmed by Retailer', verified: true },
      ],
      transport: [
        { stage: 'Picked Up', date: '2024-03-17', agent: 'Rajesh Kumar', vehicle: 'TN-09-AB-1234', location: 'Green Valley Farm Gate', completed: true },
        { stage: 'Warehouse', date: '2024-03-19', agent: 'Hub Manager', vehicle: '', location: 'Amritsar Central Hub', completed: true },
        { stage: 'Transit', date: '2024-03-21', agent: 'Express Freight', vehicle: 'DL-01-CD-5678', location: 'Punjab → Delhi → Mumbai', completed: true },
        { stage: 'Retailer', date: '2024-03-23', agent: 'Delivery Staff', vehicle: 'KA-02-EF-9012', location: 'FreshMart Superstore, Bangalore', completed: true },
      ],
      qrGenerated: true,
      receivedByRetailer: true,
    },
    {
      productId: 'FCX-2024-002',
      cropName: 'Alphonso Mangoes',
      quantity: '200 kg',
      location: 'Ratnagiri, Maharashtra',
      harvestDate: '2024-04-02',
      farmerId: farmer._id,
      farmerName: farmer.name,
      farm: farmer.farm,
      farmerPhone: farmer.phone,
      status: 'In Transit',
      aiAnalysis: {
        health: 'Healthy',
        qualityScore: 97,
        yieldPrediction: [75, 83, 89, 97, 95, 92],
        pestRisk: 'Very Low',
        soilQuality: 'Premium',
        moistureLevel: '82%',
        proteinContent: '0.6g/100g',
        analyzedAt: '2024-04-03 11:30:00',
      },
      blockchain: [
        { hash: genHash(), timestamp: '2024-04-02 07:15:00', event: 'Crop Registered & Harvested', verified: true },
        { hash: genHash(), timestamp: '2024-04-03 11:30:00', event: 'AI Analysis Completed', verified: true },
        { hash: genHash(), timestamp: '2024-04-05 09:00:00', event: 'Picked Up by Logistics Partner', verified: true },
        { hash: genHash(), timestamp: '2024-04-07 14:00:00', event: 'Arrived at Warehouse Distribution Hub', verified: true },
      ],
      transport: [
        { stage: 'Picked Up', date: '2024-04-05', agent: 'Suresh Nair', vehicle: 'MH-06-CD-5678', location: 'Farm Gate, Ratnagiri', completed: true },
        { stage: 'Warehouse', date: '2024-04-07', agent: 'Hub Manager', vehicle: '', location: 'Pune Distribution Center', completed: true },
        { stage: 'Transit', date: '2024-04-09', agent: 'Express Freight', vehicle: 'MH-12-GH-3456', location: 'Pune → Hyderabad', completed: false },
        { stage: 'Retailer', date: null, agent: null, vehicle: null, location: 'FreshMart Superstore, Bangalore', completed: false },
      ],
      qrGenerated: false,
      receivedByRetailer: false,
    },
    {
      productId: 'FCX-2024-003',
      cropName: 'Red Wheat Grade A',
      quantity: '1000 kg',
      location: 'Karnal, Haryana',
      harvestDate: '2024-04-10',
      farmerId: farmer._id,
      farmerName: farmer.name,
      farm: farmer.farm,
      farmerPhone: farmer.phone,
      status: 'Pending AI',
      blockchain: [
        { hash: genHash(), timestamp: '2024-04-10 06:45:00', event: 'Crop Registered & Harvested', verified: true },
      ],
      transport: [],
      qrGenerated: false,
      receivedByRetailer: false,
    },
    {
      productId: 'FCX-2024-004',
      cropName: 'Turmeric Fingers',
      quantity: '150 kg',
      location: 'Erode, Tamil Nadu',
      harvestDate: '2024-04-18',
      farmerId: farmer._id,
      farmerName: farmer.name,
      farm: farmer.farm,
      farmerPhone: farmer.phone,
      status: 'Verified',
      aiAnalysis: {
        health: 'Healthy',
        qualityScore: 89,
        yieldPrediction: [70, 78, 85, 89, 86, 82],
        pestRisk: 'Low',
        soilQuality: 'Good',
        moistureLevel: '10%',
        proteinContent: '3.1g/100g',
        analyzedAt: '2024-04-19 08:20:00',
      },
      blockchain: [
        { hash: genHash(), timestamp: '2024-04-18 07:00:00', event: 'Crop Registered & Harvested', verified: true },
        { hash: genHash(), timestamp: '2024-04-19 08:20:00', event: 'AI Analysis Completed', verified: true },
      ],
      transport: [],
      qrGenerated: false,
      receivedByRetailer: false,
    },
  ]);

  console.log(`✅ Created ${products.length} demo products`);
};

const seed = async () => {
  try {
    await connectDB();
    const users = await seedUsers();
    const farmer = users.find(u => u.role === 'farmer');
    await seedProducts(farmer);
    console.log('\n🌱 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Demo Credentials:');
    console.log('  farmer@demo.com   / demo123');
    console.log('  supply@demo.com   / demo123');
    console.log('  retailer@demo.com / demo123');
    console.log('  consumer@demo.com / demo123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
