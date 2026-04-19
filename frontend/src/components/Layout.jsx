import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Icon } from './UI.jsx';
import Chatbot from './Chatbot.jsx';

const NAV_ITEMS = {
  farmer: [
    { to: '/farmer/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/farmer/add-crop', label: 'Add New Crop', icon: 'plus' },
    { to: '/farmer/ai-analysis', label: 'AI Analysis', icon: 'brain' },
    { to: '/farmer/blockchain', label: 'Blockchain Ledger', icon: 'chain' },
  ],
  supply_chain: [
    { to: '/supply/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/supply/transport', label: 'Transport Manager', icon: 'truck' },
    { to: '/supply/blockchain', label: 'Blockchain Ledger', icon: 'chain' },
  ],
  retailer: [
    { to: '/retailer/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/retailer/qr', label: 'QR Generator', icon: 'qr' },
    { to: '/retailer/history', label: 'Product History', icon: 'eye' },
    { to: '/retailer/blockchain', label: 'Blockchain Ledger', icon: 'chain' },
  ],
  consumer: [
    { to: '/consumer/verify', label: 'Verify Product', icon: 'search' },
  ],
};

const ROLE_INFO = {
  farmer: { label: 'Farmer Portal', color: 'from-emerald-500 to-green-600', badge: 'bg-emerald-500/20 text-emerald-400' },
  supply_chain: { label: 'Supply Chain', color: 'from-blue-500 to-cyan-600', badge: 'bg-blue-500/20 text-blue-400' },
  retailer: { label: 'Retailer Hub', color: 'from-purple-500 to-violet-600', badge: 'bg-purple-500/20 text-purple-400' },
  consumer: { label: 'Consumer', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-500/20 text-amber-400' },
};

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const items = NAV_ITEMS[user?.role] || [];
  const roleInfo = ROLE_INFO[user?.role] || ROLE_INFO.consumer;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-950 border-r border-slate-800/60 z-30
        flex flex-col transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 bg-gradient-to-br ${roleInfo.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
              <Icon name="leaf" size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display text-lg text-white tracking-widest leading-none">FarmChainX</div>
              <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${roleInfo.badge}`}>{roleInfo.label}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 py-2 mt-1">Navigation</div>
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'nav-active bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Network status */}
        <div className="px-3 py-3 border-t border-slate-800/40">
          <div className="bg-slate-800/40 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">Network Status</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500">Blocks:</span> <span className="text-emerald-400 font-mono">847,231</span></div>
              <div><span className="text-slate-500">Nodes:</span> <span className="text-emerald-400 font-mono">1,204</span></div>
            </div>
          </div>

          {/* User card */}
          <div className="flex items-center gap-3 px-2">
            <div className={`w-9 h-9 bg-gradient-to-br ${roleInfo.color} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
              {user?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-200 truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
            >
              <Icon name="logout" size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// TOP BAR
// ============================================================
export function Topbar({ onMenuClick }) {
  const { user, products } = useApp();
  const pendingAI = products.filter(p => p.status === 'Pending AI').length;

  return (
    <header className="h-14 border-b border-slate-800/60 flex items-center px-4 gap-4 bg-slate-950/90 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white transition-colors w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="flex-1" />

      {/* Notifications */}
      {pendingAI > 0 && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 text-xs text-amber-400">
          <Icon name="bell" size={12} />
          <span>{pendingAI} awaiting AI</span>
        </div>
      )}

      {/* Live indicator */}
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] text-emerald-400 font-mono font-semibold hidden sm:block">LIVE</span>
      </div>

      {/* User avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
        {user?.avatar}
      </div>
    </header>
  );
}

// ============================================================
// DASHBOARD LAYOUT
// ============================================================
export function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 hex-bg">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
