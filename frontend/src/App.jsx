import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { DashboardLayout } from './components/Layout.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx';
import AddCropPage from './pages/farmer/AddCropPage.jsx';
import AIAnalysisPage from './pages/farmer/AIAnalysisPage.jsx';

// Shared pages
import BlockchainPage from './pages/shared/BlockchainPage.jsx';

// Supply Chain pages
import SupplyDashboard from './pages/supply/SupplyDashboard.jsx';
import TransportPage from './pages/supply/TransportPage.jsx';

// Retailer pages
import RetailerDashboard from './pages/retailer/RetailerDashboard.jsx';
import QRPage from './pages/retailer/QRPage.jsx';
import ProductHistoryPage from './pages/retailer/ProductHistoryPage.jsx';

// Consumer pages
import ConsumerVerifyPage from './pages/consumer/ConsumerVerifyPage.jsx';

// ============================================================
// ROUTE GUARDS
// ============================================================
function RequireAuth({ children, role }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    const defaultRoutes = {
      farmer: '/farmer/dashboard',
      supply_chain: '/supply/dashboard',
      retailer: '/retailer/dashboard',
      consumer: '/consumer/verify',
    };
    return <Navigate to={defaultRoutes[user.role] || '/login'} replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}

function RedirectIfAuth() {
  const { user } = useApp();
  if (!user) return null;
  const routes = {
    farmer: '/farmer/dashboard',
    supply_chain: '/supply/dashboard',
    retailer: '/retailer/dashboard',
    consumer: '/consumer/verify',
  };
  return <Navigate to={routes[user.role] || '/login'} replace />;
}

// ============================================================
// MAIN APP
// ============================================================
function AppRoutes() {
  const { user } = useApp();

  const defaultDash = user ? {
    farmer: '/farmer/dashboard',
    supply_chain: '/supply/dashboard',
    retailer: '/retailer/dashboard',
    consumer: '/consumer/verify',
  }[user.role] : '/login';

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<><RedirectIfAuth /><LoginPage /></>} />
      <Route path="/register" element={<><RedirectIfAuth /><RegisterPage /></>} />

      {/* Farmer */}
      <Route path="/farmer/dashboard" element={<RequireAuth role="farmer"><FarmerDashboard /></RequireAuth>} />
      <Route path="/farmer/add-crop" element={<RequireAuth role="farmer"><AddCropPage /></RequireAuth>} />
      <Route path="/farmer/ai-analysis" element={<RequireAuth role="farmer"><AIAnalysisPage /></RequireAuth>} />
      <Route path="/farmer/blockchain" element={<RequireAuth role="farmer"><BlockchainPage /></RequireAuth>} />

      {/* Supply Chain */}
      <Route path="/supply/dashboard" element={<RequireAuth role="supply_chain"><SupplyDashboard /></RequireAuth>} />
      <Route path="/supply/transport" element={<RequireAuth role="supply_chain"><TransportPage /></RequireAuth>} />
      <Route path="/supply/blockchain" element={<RequireAuth role="supply_chain"><BlockchainPage /></RequireAuth>} />

      {/* Retailer */}
      <Route path="/retailer/dashboard" element={<RequireAuth role="retailer"><RetailerDashboard /></RequireAuth>} />
      <Route path="/retailer/qr" element={<RequireAuth role="retailer"><QRPage /></RequireAuth>} />
      <Route path="/retailer/history" element={<RequireAuth role="retailer"><ProductHistoryPage /></RequireAuth>} />
      <Route path="/retailer/blockchain" element={<RequireAuth role="retailer"><BlockchainPage /></RequireAuth>} />

      {/* Consumer */}
      <Route path="/consumer/verify" element={<RequireAuth role="consumer"><ConsumerVerifyPage /></RequireAuth>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? defaultDash : '/'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
