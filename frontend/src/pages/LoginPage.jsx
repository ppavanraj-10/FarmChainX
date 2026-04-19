import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Icon } from '../components/UI.jsx';

const DEST = {
  farmer: '/farmer/dashboard',
  supply_chain: '/supply/dashboard',
  retailer: '/retailer/dashboard',
  consumer: '/consumer/verify',
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(DEST[result.user.role] || '/');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex hex-bg">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-emerald-950/40 to-slate-950 border-r border-slate-800/40">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
            <Icon name="leaf" size={18} className="text-slate-950" />
          </div>
          <span className="font-display text-2xl text-white tracking-widest">FarmChainX</span>
        </Link>

        <div>
          <div className="font-display text-6xl text-white tracking-widest leading-tight mb-6">
            TRANSPARENT<br />
            <span className="text-emerald-400">SUPPLY</span><br />
            CHAINS
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            AI-powered crop analysis, blockchain-secured records, and real-time logistics tracking — all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { v: '98.7%', l: 'Accuracy', icon: 'brain' },
            { v: '2.4M+', l: 'Products', icon: 'package' },
            { v: '847K', l: 'Blocks', icon: 'chain' },
            { v: '187', l: 'Countries', icon: 'globe' },
          ].map(s => (
            <div key={s.l} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <Icon name={s.icon} size={16} className="text-emerald-400 mb-2" />
              <div className="font-mono text-xl text-white font-bold">{s.v}</div>
              <div className="text-xs text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
              <Icon name="leaf" size={16} className="text-slate-950" />
            </div>
            <span className="font-display text-xl text-white tracking-widest">FarmChainX</span>
          </Link>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-400 mb-6">Sign in to your FarmChainX account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="input"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="input pr-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <Icon name="eye" size={16} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <Icon name="x" size={12} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <Icon name="arrow" size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
