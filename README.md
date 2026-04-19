# 🌿 FarmChainX — AI-Driven Agricultural Traceability Network
### Full Stack: React + Vite + Tailwind + Node.js + Express + MongoDB Atlas

---

## 📁 Project Structure

```
FarmChainX-Complete/
├── frontend/    ← React + Vite + Tailwind CSS
└── backend/     ← Node.js + Express + MongoDB Atlas + JWT
```

---

## 🚀 Run the Project

### Step 1 — Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB Atlas Connected
FarmChainX API running on port 5000
```

### Step 2 — Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open → **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Create account |
| POST | /api/auth/login | Public | Login → JWT token |
| GET | /api/auth/me | Private | Get current user |
| PUT | /api/auth/profile | Private | Update profile |
| PUT | /api/auth/change-password | Private | Change password |
| GET | /api/products | Private | List products |
| POST | /api/products | Farmer | Add new crop |
| POST | /api/products/:id/ai-analysis | Farmer | Run AI scoring |
| PUT | /api/products/:id/transport | Supply Chain | Update stage |
| PUT | /api/products/:id/receive | Retailer | Confirm delivery |
| PUT | /api/products/:id/generate-qr | Retailer | Generate QR |
| GET | /api/products/verify/:id | Public | Consumer scan |

---

## ⚠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| MongoDB error | Check MONGO_URI in backend/.env |
| CORS error | Ensure CLIENT_URL=http://localhost:5173 in .env |
| Port in use | Change PORT=5001 in .env |
| Token error | Clear localStorage in browser and login again |

