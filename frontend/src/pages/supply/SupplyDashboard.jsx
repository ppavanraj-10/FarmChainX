import { useApp } from '../../context/AppContext.jsx';
import { StatCard, StatusBadge, TransportStepper, PageWrapper, SectionHeader, EmptyState, Icon } from '../../components/UI.jsx';

export default function SupplyDashboard() {
  const { products, loadingProducts, user } = useApp();

  const stats = {
    active: products.filter(p => p.status === 'In Transit').length,
    delivered: products.filter(p => p.status === 'Delivered').length,
    pending: products.filter(p => p.status === 'Verified').length,
    total: products.length,
  };

  const recentBlocks = products
    .flatMap(p => (p.blockchain || []).map(b => ({ ...b, product: p.cropName, productId: p.id })))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 6);

  return (
    <PageWrapper>
      <SectionHeader
        title="Supply Chain Dashboard"
        subtitle={`${user.company || 'Logistics Operations'} · Live overview`}
        action={
          <div className="flex items-center gap-2 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {stats.active} Active Shipment{stats.active !== 1 ? 's' : ''}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Shipments" value={stats.active} icon="truck" color="blue" />
        <StatCard label="Delivered" value={stats.delivered} icon="check" color="emerald" />
        <StatCard label="Awaiting Pickup" value={stats.pending} icon="package" color="amber" />
        <StatCard label="Total Managed" value={stats.total} icon="globe" color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-white">All Shipments</h2>
          {loadingProducts ? (
            <div className="card flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="card">
              <EmptyState icon="truck" title="No shipments yet" desc="Products will appear here once farmers register crops and they are verified" />
            </div>
          ) : (
            products.map(p => (
              <div key={p.id} className="card p-5 hover:border-slate-700/60 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="font-mono text-xs text-emerald-400 mb-0.5">{p.id}</div>
                    <div className="text-base font-bold text-white">{p.cropName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.quantity} · {p.farmerName} · {p.location}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <TransportStepper transport={p.transport || []} />
                {p.status === 'Delivered' && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <Icon name="check" size={12} /> Delivered successfully
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Recent Blockchain Activity</h2>
          <div className="card overflow-hidden">
            {recentBlocks.length === 0 ? (
              <EmptyState icon="chain" title="No activity yet" desc="Blockchain events will appear here" />
            ) : (
              <div className="divide-y divide-slate-800/30">
                {recentBlocks.map((a, i) => (
                  <div key={i} className="p-4 hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="chain" size={12} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-300 leading-tight">{a.event}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{a.product}</div>
                        <div className="font-mono text-[10px] text-slate-600 mt-0.5">{a.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
