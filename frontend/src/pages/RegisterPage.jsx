import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Icon } from '../components/UI.jsx';

const ROLES = [
  { id: 'farmer', label: 'Farmer', icon: 'leaf', desc: 'Register & manage your crops', color: 'emerald' },
  { id: 'supply_chain', label: 'Supply Chain', icon: 'truck', desc: 'Manage logistics & transport', color: 'blue' },
  { id: 'retailer', label: 'Retailer', icon: 'store', desc: 'Receive & verify products', color: 'purple' },
  { id: 'consumer', label: 'Consumer', icon: 'user', desc: 'Verify product authenticity', color: 'amber' },
];

const ROLE_COLORS = {
  emerald: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  blue: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  purple: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
  amber: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
};

const DEST = {
  farmer: '/farmer/dashboard',
  supply_chain: '/supply/dashboard',
  retailer: '/retailer/dashboard',
  consumer: '/consumer/verify',
};

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', role: '',
    farm: '', company: '', store: '', location: '', phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useApp();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    const e = {};
    if (!form.role) e.role = 'Please select your role';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    const result = await register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      farm: form.farm,
      company: form.company,
      store: form.store,
      location: form.location,
      phone: form.phone,
    });
    if (result.success) {
      navigate(DEST[result.user.role]);
    } else {
      setErrors({ submit: result.error || 'Registration failed. Please try again.' });
      setLoading(false);
    }
  };

  // Role-specific extra field
  const roleExtraField = {
    farmer: { label: 'Farm Name', key: 'farm', placeholder: 'e.g. Green Valley Organics' },
    supply_chain: { label: 'Company Name', key: 'company', placeholder: 'e.g. AgriLogistics Pro' },
    retailer: { label: 'Store Name', key: 'store', placeholder: 'e.g. FreshMart Superstore' },
  }[form.role];

  return (
    <div className="min-h-screen bg-slate-950 hex-bg flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
            <Icon name="leaf" size={18} className="text-slate-950" />
          </div>
          <span className="font-display text-2xl text-white tracking-widest">FarmChainX</span>
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2].map(n => (
            <div key={n} className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all
                ${step >= n ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-600'}`}>
                {step > n ? <Icon name="check" size={13} /> : n}
              </div>
              <div className={`text-xs font-medium ${step >= n ? 'text-slate-300' : 'text-slate-600'}`}>
                {n === 1 ? 'Choose Role' : 'Account Details'}
              </div>
              {n < 2 && <div className={`flex-1 h-px ${step > n ? 'bg-emerald-500/60' : 'bg-slate-700/60'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {step === 1 ? (
            <>
              <h2 className="text-xl font-bold text-white mb-1">Choose Your Role</h2>
              <p className="text-sm text-slate-400 mb-6">Select how you'll use FarmChainX</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => set('role', r.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all
                      ${form.role === r.id ? ROLE_COLORS[r.color] + ' border-2' : 'border-slate-700/60 bg-slate-800/30 hover:border-slate-600 text-slate-400'}`}
                  >
                    <Icon name={r.icon} size={20} className="mb-2" />
                    <div className="text-sm font-bold">{r.label}</div>
                    <div className="text-xs opacity-70 mt-0.5 leading-tight">{r.desc}</div>
                  </button>
                ))}
              </div>

              {errors.role && <p className="text-xs text-red-400 mb-4">{errors.role}</p>}

              <button onClick={handleNext} className="btn-primary w-full py-3 text-sm">
                Continue <Icon name="arrow" size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setStep(1); setErrors({}); }} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-5 transition-colors">
                <Icon name="arrowLeft" size={14} /> Back
              </button>
              <h2 className="text-xl font-bold text-white mb-1">Account Details</h2>
              <p className="text-sm text-slate-400 mb-6">
                Registering as{' '}
                <span className="text-emerald-400 font-semibold capitalize">{form.role.replace('_', ' ')}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Your full name" className="input" autoFocus />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com" className="input" />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>

                {roleExtraField && (
                  <div>
                    <label className="label">{roleExtraField.label}</label>
                    <input type="text" value={form[roleExtraField.key]}
                      onChange={e => set(roleExtraField.key, e.target.value)}
                      placeholder={roleExtraField.placeholder} className="input" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Location</label>
                    <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                      placeholder="City, Country" className="input" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+91 98765 43210" className="input" />
                  </div>
                </div>

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={form.password}
                      onChange={e => set('password', e.target.value)}
                      placeholder="Minimum 6 characters" className="input pr-11" />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      <Icon name="eye" size={16} />
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="label">Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                    placeholder="Repeat your password" className="input" />
                  {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
                </div>
              </div>

              {errors.submit && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                  {errors.submit}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading}
                className="btn-primary w-full py-3 text-sm mt-6 disabled:opacity-60">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Creating Account...</>
                ) : (
                  <>Create Account <Icon name="check" size={16} /></>
                )}
              </button>
            </>
          )}

          <p className="text-center text-xs text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
