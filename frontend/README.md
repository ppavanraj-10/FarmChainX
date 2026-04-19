# FarmChainX 🌿
### AI-Driven Agricultural Traceability Network

A full-stack-styled React frontend application for agricultural supply chain tracking with role-based dashboards, AI analysis simulation, blockchain ledger visualization, and QR code generation.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 🌾 Farmer | farmer@demo.com | demo123 |
| 🚚 Supply Chain | supply@demo.com | demo123 |
| 🏪 Retailer | retailer@demo.com | demo123 |
| 👤 Consumer | consumer@demo.com | demo123 |

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx          # Global state management
├── data/
│   └── dummy.js                # All dummy data
├── components/
│   ├── UI.jsx                  # Reusable UI components
│   └── Layout.jsx              # Sidebar, Topbar, DashboardLayout
├── pages/
│   ├── LandingPage.jsx         # Public landing page
│   ├── LoginPage.jsx           # Login with quick-demo buttons
│   ├── RegisterPage.jsx        # 2-step registration
│   ├── farmer/
│   │   ├── FarmerDashboard.jsx # Crop overview & management
│   │   ├── AddCropPage.jsx     # Register new crop with image upload
│   │   └── AIAnalysisPage.jsx  # AI results with charts
│   ├── supply/
│   │   ├── SupplyDashboard.jsx # Logistics overview
│   │   └── TransportPage.jsx   # Stage-by-stage transport manager
│   ├── retailer/
│   │   ├── RetailerDashboard.jsx
│   │   ├── QRPage.jsx          # QR code generator
│   │   └── ProductHistoryPage.jsx
│   ├── shared/
│   │   └── BlockchainPage.jsx  # Blockchain ledger (shared across roles)
│   └── consumer/
│       └── ConsumerVerifyPage.jsx # Product verification portal
└── App.jsx                     # Router with role-based guards
```

---

## 🎨 Tech Stack

- **React 18** — UI framework
- **React Router v6** — Client-side routing with role guards
- **Tailwind CSS v3** — Utility-first styling
- **Recharts** — AI yield prediction charts
- **Vite** — Build tool & dev server
- **Google Fonts** — Bebas Neue, Syne, JetBrains Mono

---

## ✨ Features

### 🌾 Farmer Dashboard
- Register crops with image upload
- Run AI analysis (simulated with random scores)
- View product table with live status badges
- Blockchain ledger view

### 🚚 Supply Chain Dashboard
- Visual 4-stage transport tracker (Picked Up → Warehouse → Transit → Retailer)
- Click to mark stages complete (updates blockchain automatically)
- Real-time activity feed
- Network health monitoring

### 🏪 Retailer Hub
- Confirm product receipt
- Generate SVG-based QR codes
- Full product history with blockchain + transport timelines

### 👤 Consumer Verification
- Search by Product ID or crop name
- Tabbed view: Overview / AI Report / Transport / Blockchain
- Complete traceability display
- Verified badge with blockchain proof

---

## 🔧 Customization

- Edit `/src/data/dummy.js` to change sample products or users
- Edit `tailwind.config.js` to modify the color scheme
- Add new pages in `/src/pages/` and register routes in `App.jsx`

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```
