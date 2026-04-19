// ============================================================
// ICON COMPONENT
// ============================================================
export const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    leaf: <><path d="M17 8C8 10 5.9 16.17 3.82 19.5C5 16 7 9 17 8z" strokeWidth="2" strokeLinecap="round"/><path d="M17 8c-.5 4-2.5 7-5 9" strokeWidth="2" strokeLinecap="round"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2"/><polyline points="9,22 9,12 15,12 15,22" strokeWidth="2"/></>,
    crop: <><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/><path d="M3 9h18M9 21V9" strokeWidth="2"/></>,
    brain: <><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" strokeWidth="2"/><path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="2" strokeLinecap="round"/><path d="M9 9h.01M15 9h.01" strokeWidth="3" strokeLinecap="round"/></>,
    chain: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeWidth="2" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeWidth="2" strokeLinecap="round"/></>,
    truck: <><rect x="1" y="3" width="15" height="13" strokeWidth="2"/><path d="M16 8h4l3 3v5h-7V8z" strokeWidth="2"/><circle cx="5.5" cy="18.5" r="2.5" strokeWidth="2"/><circle cx="18.5" cy="18.5" r="2.5" strokeWidth="2"/></>,
    store: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeWidth="2"/><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/><path d="M16 10a4 4 0 01-8 0" strokeWidth="2"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></>,
    qr: <><rect x="3" y="3" width="7" height="7" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" strokeWidth="2"/><rect x="5" y="5" width="3" height="3" fill="currentColor"/><rect x="16" y="5" width="3" height="3" fill="currentColor"/><rect x="5" y="16" width="3" height="3" fill="currentColor"/><path d="M14 14h3v3M20 14v3h-3M17 20h3M14 17v3" strokeWidth="2" strokeLinecap="round"/></>,
    check: <polyline points="20,6 9,17 4,12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeWidth="2" strokeLinecap="round"/><polyline points="16,17 21,12 16,7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round"/></>,
    search: <><circle cx="11" cy="11" r="8" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" strokeWidth="2" strokeLinecap="round"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/><polyline points="12,5 19,12 12,19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" strokeWidth="2" strokeLinecap="round"/><polyline points="12,19 5,12 12,5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    camera: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeWidth="2"/><circle cx="12" cy="13" r="4" strokeWidth="2"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/></>,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeWidth="2"/>,
    globe: <><circle cx="12" cy="12" r="10" strokeWidth="2"/><line x1="2" y1="12" x2="22" y2="12" strokeWidth="2"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2"/></>,
    package: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeWidth="2"/><polyline points="3.27,6.96 12,12.01 20.73,6.96" strokeWidth="2"/><line x1="12" y1="22.08" x2="12" y2="12" strokeWidth="2"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2"/><path d="M13.73 21a2 2 0 01-3.46 0" strokeWidth="2"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2"/></>,
    upload: <><polyline points="16,16 12,12 8,16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="12" x2="12" y2="21" strokeWidth="2" strokeLinecap="round"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" strokeWidth="2"/></>,
    zap: <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" strokeWidth="2"/>,
    rose: <><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" strokeWidth="2"/></>,
    cyan: <><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      {icons[name] || icons['package']}
    </svg>
  );
};

// ============================================================
// STATUS BADGE
// ============================================================
export const StatusBadge = ({ status }) => {
  const config = {
    'Pending AI': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Verified': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'In Transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Delivered': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config[status] || config['Pending AI']}`}>
      {status}
    </span>
  );
};

// ============================================================
// STAT CARD
// ============================================================
export const StatCard = ({ label, value, icon, color = 'emerald', sub, trend }) => {
  const colors = {
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    purple: { icon: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    rose: { icon: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  };
  const c = colors[color] || colors.emerald;
  return (
    <div className="card p-5 hover:border-slate-700/60 transition-all duration-200 group page-enter">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${c.bg} ${c.border} ${c.icon} group-hover:scale-110 transition-transform`}>
        <Icon name={icon} size={18} />
      </div>
      <div className="text-2xl font-bold text-white mb-0.5 font-mono">{value}</div>
      <div className="text-sm text-slate-400 font-sans">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
      {trend && <div className={`text-xs mt-2 font-semibold ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month</div>}
    </div>
  );
};

// ============================================================
// BLOCKCHAIN TIMELINE
// ============================================================
export const BlockchainTimeline = ({ entries }) => (
  <div className="space-y-2">
    {entries.map((entry, i) => (
      <div key={i} className="flex gap-4 page-enter" style={{ animationDelay: `${i * 0.05}s` }}>
        <div className="flex flex-col items-center flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${entry.verified ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-amber-500 bg-amber-500/10 text-amber-400'}`}>
            {entry.verified ? <Icon name="check" size={13} /> : '?'}
          </div>
          {i < entries.length - 1 && <div className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-emerald-500/40 to-transparent mt-1" />}
        </div>
        <div className="flex-1 bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 mb-2 hover:border-emerald-500/20 transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span className="text-sm font-semibold text-slate-200">{entry.event}</span>
            {entry.verified && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <Icon name="shield" size={9} /> IMMUTABLE
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-emerald-400/80 break-all mb-1">{entry.hash}</div>
          <div className="text-xs text-slate-500 font-mono">{entry.timestamp}</div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================
// TRANSPORT STEPPER
// ============================================================
export const TransportStepper = ({ transport, onStageClick, interactive = false }) => {
  const stages = ['Picked Up', 'Warehouse', 'Transit', 'Retailer'];
  return (
    <div className="flex items-start gap-0 w-full overflow-x-auto pb-2">
      {stages.map((stage, i) => {
        const t = transport.find(x => x.stage === stage);
        const done = t?.completed;
        const active = !done && (i === 0 || transport.find(x => x.stage === stages[i - 1])?.completed);
        return (
          <div key={stage} className="flex items-center flex-1 min-w-[80px]">
            <div className="flex flex-col items-center">
              <button
                onClick={() => interactive && onStageClick && onStageClick(stage)}
                disabled={!interactive || done}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${done ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 cursor-default'
                    : active && interactive ? 'border-blue-500 bg-blue-500/10 text-blue-400 ring-4 ring-blue-500/20 hover:bg-blue-500/20 cursor-pointer'
                    : active ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-700 bg-slate-800/40 text-slate-600 cursor-default'}`}
              >
                {done ? <Icon name="check" size={14} /> : i + 1}
              </button>
              <div className={`text-[10px] mt-1.5 text-center font-medium leading-tight max-w-[70px] ${done ? 'text-emerald-400' : active ? 'text-blue-400' : 'text-slate-600'}`}>{stage}</div>
              {t?.date && <div className="text-[9px] text-slate-600 mt-0.5 font-mono">{t.date}</div>}
            </div>
            {i < stages.length - 1 && (
              <div className={`flex-1 h-0.5 mb-7 mx-1 transition-all duration-500 ${done ? 'bg-emerald-500/60' : 'bg-slate-700/40'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// FAKE QR CODE
// ============================================================
export const FakeQR = ({ value, size = 11 }) => {
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if ((r < 3 && c < 3) || (r < 3 && c > size - 4) || (r > size - 4 && c < 3)) return true;
      if ((r === 3 && c < 3) || (r < 3 && c === 3) || (r === 3 && c > size - 4) || (r < 3 && c === size - 4) || (r > size - 4 && c === 3) || (r === size - 4 && c < 3)) return false;
      return ((seed * (r + 1) * (c + 1)) % 7) < 3;
    })
  );
  return (
    <div className="inline-block bg-white p-3 rounded-xl qr-shimmer shadow-lg">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${size}, 14px)` }}>
        {grid.flat().map((cell, i) => (
          <div key={i} className={`w-3.5 h-3.5 rounded-sm ${cell ? 'bg-slate-900' : 'bg-white'}`} />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// PAGE WRAPPER
// ============================================================
export const PageWrapper = ({ children }) => (
  <div className="p-4 sm:p-6 lg:p-8 page-enter">{children}</div>
);

// ============================================================
// SECTION HEADER
// ============================================================
export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ============================================================
// EMPTY STATE
// ============================================================
export const EmptyState = ({ icon, title, desc, action }) => (
  <div className="text-center py-16 px-6">
    <div className="w-16 h-16 bg-slate-800/60 border border-slate-700/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
      <Icon name={icon} size={28} />
    </div>
    <h3 className="text-base font-semibold text-slate-400 mb-1">{title}</h3>
    <p className="text-sm text-slate-600 mb-4">{desc}</p>
    {action}
  </div>
);
