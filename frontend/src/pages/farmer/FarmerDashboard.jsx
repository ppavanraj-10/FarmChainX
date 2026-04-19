import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { StatCard, StatusBadge, PageWrapper, SectionHeader, EmptyState, Icon } from '../../components/UI.jsx';

export default function FarmerDashboard() {
  const { user, products, loadingProducts, runAIAnalysis } = useApp();
  const navigate = useNavigate();

  const myProducts = products.filter(p => p.farmerId === user.id || p.farmerId?._id === user.id || p.farmerId === user._id);

  const stats = {
    total: myProducts.length,
    verified: myProducts.filter(p => ['Verified', 'In Transit', 'Delivered'].includes(p.status)).length,
    inTransit: myProducts.filter(p => p.status === 'In Transit').length,
    delivered: myProducts.filter(p => p.status === 'Delivered').length,
  };

  const avgQuality = myProducts.filter(p => p.aiAnalysis).length > 0
    ? (myProducts.filter(p => p.aiAnalysis).reduce((s, p) => s + p.aiAnalysis.qualityScore, 0) /
       myProducts.filter(p => p.aiAnalysis).length).toFixed(1)
    : '—';

  return (
    <PageWrapper>
      <SectionHeader
        title="Farmer Dashboard"
        subtitle={`Welcome, ${user.name}${user.farm ? ' · ' + user.farm : ''}`}
        action={
          <button onClick={() => navigate('/farmer/add-crop')} className="btn-primary px-4 py-2.5 text-sm">
            <Icon name="plus" size={15} /> Add Crop
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Crops" value={stats.total} icon="crop" color="emerald" />
        <StatCard label="AI Verified" value={stats.verified} icon="brain" color="blue" />
        <StatCard label="In Transit" value={stats.inTransit} icon="truck" color="amber" />
        <StatCard label="Avg Quality" value={avgQuality === '—' ? '—' : `${avgQuality}%`} icon="star" color="purple" />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Run AI Analysis', desc: 'Analyze pending crops', icon: 'brain', color: 'emerald', to: '/farmer/ai-analysis' },
          { label: 'Blockchain Ledger', desc: 'View immutable records', icon: 'chain', color: 'blue', to: '/farmer/blockchain' },
          { label: 'Add New Crop', desc: 'Register a harvest', icon: 'plus', color: 'purple', to: '/farmer/add-crop' },
        ].map(a => (
          <button key={a.label} onClick={() => navigate(a.to)}
            className="card p-5 text-left hover:border-slate-600 transition-all group hover:glow-green">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-${a.color}-400 bg-${a.color}-500/10 border border-${a.color}-500/20 group-hover:scale-110 transition-transform`}>
              <Icon name={a.icon} size={16} />
            </div>
            <div className="text-sm font-bold text-white">{a.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Products table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">My Products</h2>
            <p className="text-xs text-slate-500 mt-0.5">All registered crops and their status</p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700/60 px-3 py-1 rounded-full font-mono">
            {myProducts.length} crop{myProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loadingProducts ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : myProducts.length === 0 ? (
          <EmptyState
            icon="crop"
            title="No crops registered yet"
            desc="Start by adding your first crop to get it on the blockchain"
            action={
              <button onClick={() => navigate('/farmer/add-crop')} className="btn-primary px-5 py-2.5 text-sm mx-auto">
                <Icon name="plus" size={14} /> Add Your First Crop
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {['Product ID', 'Crop Name', 'Quantity', 'Location', 'Harvest Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {myProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-emerald-400 whitespace-nowrap">{p.id}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-slate-200">{p.cropName}</div>
                      <div className="text-xs text-slate-500">{p.farm}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">{p.quantity}</td>
                    <td className="px-5 py-4 text-sm text-slate-400 whitespace-nowrap">{p.location}</td>
                    <td className="px-5 py-4 text-sm text-slate-400 font-mono whitespace-nowrap">{p.harvestDate}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-4">
                      {p.status === 'Pending AI' && (
                        <button onClick={() => runAIAnalysis(p.id)}
                          className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors whitespace-nowrap">
                          Run AI
                        </button>
                      )}
                      {p.aiAnalysis && (
                        <button onClick={() => navigate('/farmer/ai-analysis')}
                          className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors">
                          View Report
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
