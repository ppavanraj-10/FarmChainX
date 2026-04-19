import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Icon, StatusBadge, TransportStepper, PageWrapper, SectionHeader } from '../../components/UI.jsx';

const STAGES = ['Picked Up', 'Warehouse', 'Transit', 'Retailer'];

export default function TransportPage() {
  const { products, updateTransportStage } = useApp();
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = products.filter(p => {
    if (filter === 'active') return p.status === 'In Transit';
    if (filter === 'pending') return p.status === 'Verified';
    if (filter === 'delivered') return p.status === 'Delivered';
    return true;
  });

  const handleStageUpdate = async (productId, stage) => {
    setUpdating(`${productId}-${stage}`);
    await new Promise(r => setTimeout(r, 800));
    updateTransportStage(productId, stage);
    setUpdating(null);
  };

  const getNextStage = (transport) => {
    for (const stage of STAGES) {
      const t = transport.find(x => x.stage === stage);
      if (!t || !t.completed) return stage;
    }
    return null;
  };

  return (
    <PageWrapper>
      <SectionHeader
        title="Transport Manager"
        subtitle="Update product shipment stages and track logistics in real-time"
        action={
          <div className="flex gap-2">
            {['all', 'pending', 'active', 'delivered'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="space-y-5">
        {filtered.map(p => {
          const nextStage = getNextStage(p.transport);
          return (
            <div key={p.id} className="card p-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <div className="font-mono text-xs text-emerald-400 mb-1">{p.id}</div>
                  <h3 className="text-lg font-bold text-white">{p.cropName}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{p.quantity} · Farmer: {p.farmerName} · Origin: {p.location}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  {nextStage && p.status !== 'Delivered' && (
                    <button
                      onClick={() => handleStageUpdate(p.id, nextStage)}
                      disabled={!!updating}
                      className="btn-primary px-4 py-2 text-xs disabled:opacity-60"
                    >
                      {updating === `${p.id}-${nextStage}` ? (
                        <><div className="w-3 h-3 border border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Updating...</>
                      ) : (
                        <><Icon name="truck" size={12} /> Mark: {nextStage}</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Stepper */}
              <div className="mb-5">
                <TransportStepper
                  transport={p.transport}
                  onStageClick={(stage) => {
                    const t = p.transport.find(x => x.stage === stage);
                    if (!t?.completed) handleStageUpdate(p.id, stage);
                  }}
                  interactive={p.status !== 'Delivered'}
                />
              </div>

              {/* Stage details */}
              {p.transport.length > 0 && (
                <div className="border-t border-slate-800/40 pt-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Stage Details</div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {STAGES.map(stage => {
                      const t = p.transport.find(x => x.stage === stage);
                      return (
                        <div key={stage} className={`rounded-xl p-3 border ${t?.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/30 border-slate-700/30'}`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${t?.completed ? 'text-emerald-400' : 'text-slate-600'}`}>{stage}</div>
                          {t ? (
                            <>
                              {t.date && <div className="font-mono text-[10px] text-slate-400">{t.date}</div>}
                              {t.agent && <div className="text-[10px] text-slate-500 mt-0.5">{t.agent}</div>}
                              {t.vehicle && <div className="font-mono text-[10px] text-slate-600 mt-0.5">{t.vehicle}</div>}
                              {t.location && <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{t.location}</div>}
                            </>
                          ) : (
                            <div className="text-[10px] text-slate-700">Pending</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {p.status === 'Delivered' && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                  <Icon name="check" size={14} />
                  <span className="font-semibold">Delivery Complete</span>
                  <span className="text-emerald-400/60">— All stages verified on blockchain</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
