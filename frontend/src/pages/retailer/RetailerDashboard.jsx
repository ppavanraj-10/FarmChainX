import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { StatCard, StatusBadge, TransportStepper, PageWrapper, SectionHeader, EmptyState, Icon } from '../../components/UI.jsx';

export default function RetailerDashboard() {
  const { products, markReceived, loadingProducts, user } = useApp();
  const navigate = useNavigate();

  const incoming = products.filter(p => p.status === 'In Transit');
  const received = products.filter(p => p.status === 'Delivered' && p.receivedByRetailer);
  const withQR = products.filter(p => p.qrGenerated);

  return (
    <PageWrapper>
      <SectionHeader
        title="Retailer Hub"
        subtitle={`${user.store || 'Your Store'} · Product management`}
        action={
          <button onClick={() => navigate('/retailer/qr')} className="btn-primary px-4 py-2.5 text-sm">
            <Icon name="qr" size={15} /> QR Generator
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Incoming" value={incoming.length} icon="truck" color="blue" />
        <StatCard label="Received" value={received.length} icon="check" color="emerald" />
        <StatCard label="QR Codes" value={withQR.length} icon="qr" color="purple" />
        <StatCard label="Total Products" value={products.length} icon="package" color="amber" />
      </div>

      {incoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white mb-4">
            Incoming Shipments
            <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">{incoming.length}</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {incoming.map(p => (
              <div key={p.id} className="card p-5 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="font-mono text-xs text-emerald-400 mb-0.5">{p.id}</div>
                    <div className="text-base font-bold text-white">{p.cropName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.quantity} · {p.farmerName}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mb-4">
                  <TransportStepper transport={p.transport || []} />
                </div>
                <button onClick={() => markReceived(p.id)} className="btn-primary w-full py-2.5 text-xs">
                  <Icon name="check" size={14} /> Confirm Receipt
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Product Inventory</h2>
        </div>

        {loadingProducts ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState icon="store" title="No products yet" desc="Products will appear here once they are dispatched by farmers and supply chain" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {['Product ID', 'Crop', 'Farmer', 'Quantity', 'Quality', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-emerald-400 whitespace-nowrap">{p.id}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-slate-200">{p.cropName}</div>
                      <div className="text-xs text-slate-600">{p.farm}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">{p.farmerName}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{p.quantity}</td>
                    <td className="px-5 py-4">
                      {p.aiAnalysis ? (
                        <span className={`text-sm font-bold ${p.aiAnalysis.qualityScore > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {p.aiAnalysis.qualityScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {p.status === 'In Transit' && (
                          <button onClick={() => markReceived(p.id)}
                            className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors whitespace-nowrap">
                            Receive
                          </button>
                        )}
                        <button onClick={() => navigate('/retailer/qr')}
                          className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-1.5 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-1">
                          <Icon name="qr" size={10} /> QR
                        </button>
                        <button onClick={() => navigate('/retailer/history')}
                          className="text-xs bg-slate-700/60 text-slate-400 border border-slate-700/60 px-2.5 py-1.5 rounded-lg hover:bg-slate-700 transition-colors">
                          History
                        </button>
                      </div>
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
