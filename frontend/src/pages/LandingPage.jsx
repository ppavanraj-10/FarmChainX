import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/UI.jsx';
import { FEATURES, HOW_IT_WORKS } from '../data/dummy.js';

const FEATURE_ICONS = { emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20', purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20', amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20', rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20', cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
              <Icon name="leaf" size={16} className="text-slate-950" />
            </div>
            <span className="font-display text-xl tracking-widest text-white">FarmChainX</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 hex-bg" />
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-semibold mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by AI + Blockchain Technology
          </div>

          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] text-white leading-[0.9] tracking-widest mb-8">
            FARM TO TABLE<br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
              VERIFIED ON CHAIN
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            FarmChainX connects farmers, logistics partners, retailers, and consumers through an AI-driven blockchain network — ensuring food safety, authenticity, and complete supply chain transparency.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <button onClick={() => navigate('/register')} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm transition-all hover:scale-105 shadow-xl shadow-emerald-500/25 glow-green">
              Launch Platform <Icon name="arrow" size={16} />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})} className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all border border-slate-700 hover:border-slate-500">
              Explore Features <Icon name="arrow" size={16} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { v: '12,450+', l: 'Farmers Onboarded' },
              { v: '98.7%', l: 'Verification Accuracy' },
              { v: '2.4M+', l: 'Products Traced' },
              { v: '187', l: 'Countries Covered' },
            ].map(s => (
              <div key={s.l} className="card p-4 text-center">
                <div className="font-display text-3xl text-emerald-400 tracking-widest">{s.v}</div>
                <div className="text-xs text-slate-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-3">Platform Features</div>
            <h2 className="font-display text-5xl text-white tracking-widest mb-4">BUILT FOR TRUST</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every tool needed to build transparency across the agricultural supply chain</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card p-6 hover:border-emerald-500/30 hover:glow-green transition-all duration-300 group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${FEATURE_ICONS[f.color]} group-hover:scale-110 transition-transform`}>
                  <Icon name={f.icon} size={18} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-slate-900/20 border-y border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-3">Process Flow</div>
            <h2 className="font-display text-5xl text-white tracking-widest mb-4">HOW IT WORKS</h2>
            <p className="text-slate-400">Six steps from harvest to verified consumption</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.num} className="card p-6 hover:border-emerald-500/20 transition-all group">
                <div className="font-display text-5xl text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors tracking-widest mb-4">{s.num}</div>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl text-white tracking-widest mb-4">BUILT FOR EVERYONE</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'Farmer', icon: 'leaf', desc: 'Register crops, get AI analysis, track your produce from field to retail', color: 'from-emerald-500 to-green-600' },
              { role: 'Supply Chain', icon: 'truck', desc: 'Manage transport stages, update logistics, view complete journey timelines', color: 'from-blue-500 to-cyan-600' },
              { role: 'Retailer', icon: 'store', desc: 'Receive verified products, generate QR codes, manage product history', color: 'from-purple-500 to-violet-600' },
              { role: 'Consumer', icon: 'user', desc: 'Verify any product\'s full origin and supply chain history with one scan', color: 'from-amber-500 to-orange-600' },
            ].map(r => (
              <button
                key={r.role}
                onClick={() => navigate('/register')}
                className="card p-6 text-left hover:border-slate-600 transition-all group hover:scale-105"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${r.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon name={r.icon} size={18} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{r.role}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="card p-12 glow-green-strong">
            <h2 className="font-display text-5xl text-white tracking-widest mb-4">READY TO START?</h2>
            <p className="text-slate-400 mb-8">Join thousands of farmers, logistics operators, and retailers building a transparent food system.</p>
            <button onClick={() => navigate('/register')} className="btn-primary px-10 py-4 text-sm mx-auto">
              Create Free Account <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/40 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
              <Icon name="leaf" size={14} className="text-slate-950" />
            </div>
            <span className="font-display text-lg text-slate-400 tracking-widest">FarmChainX</span>
          </div>
          <p className="text-xs text-slate-700">© 2024 FarmChainX. AI-Driven Agricultural Traceability Network. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-slate-600">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
