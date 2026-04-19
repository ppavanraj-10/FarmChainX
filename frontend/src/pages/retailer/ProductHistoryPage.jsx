import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Icon, StatusBadge, BlockchainTimeline, TransportStepper, PageWrapper, SectionHeader } from '../../components/UI.jsx';

export default function ProductHistoryPage() {
  const { products } = useApp();
  const [selected, setSelected] = useState(products.find(p => p.status === 'Delivered') || products[0]);

  return (
    <PageWrapper>
      <SectionHeader title="Product History" subtitle="Complete traceability records for all products" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-widest">Products</div>
          <div className="divide-y divide-slate-800/30">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left p-4 transition-all ${selected?.id === p.id ? 'bg-emerald-500/10 border-r-2 border-emerald-500' : 'hover:bg-slate-800/30'}`}
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-mono text-[10px] text-emerald-400">{p.id}</span>
                  <StatusBadge status={p.status} />
                </div>
                <div className="text-sm font-semibold text-slate-200 leading-tight">{p.cropName}</div>
                <div className="text-xs text-slate-500 mt-1">{p.farmerName} · {p.harvestDate}</div>
                <div className="text-[10px] text-slate-600 mt-1">{p.blockchain.length} blockchain records</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-5">
          {selected && (
            <>
              {/* Summary card */}
              <div className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="font-mono text-xs text-slate-500 mb-1">{selected.id}</div>
                    <h2 className="text-xl font-bold text-white">{selected.cropName}</h2>
                    <div className="text-sm text-slate-400 mt-1">{selected.quantity} · {selected.location}</div>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Farmer', value: selected.farmerName },
                    { label: 'Farm', value: selected.farm },
                    { label: 'Harvest', value: selected.harvestDate },
                    { label: 'AI Score', value: selected.aiAnalysis ? `${selected.aiAnalysis.qualityScore}%` : 'N/A' },
                  ].map(i => (
                    <div key={i.label} className="bg-slate-800/40 rounded-xl p-3">
                      <div className="text-[10px] text-slate-500 mb-1">{i.label}</div>
                      <div className="text-xs font-semibold text-slate-200">{i.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport journey */}
              {selected.transport.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Transport Journey</h3>
                  <TransportStepper transport={selected.transport} />

                  <div className="mt-5 space-y-3">
                    {selected.transport.filter(t => t.completed).map(t => (
                      <div key={t.stage} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl">
                        <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name="check" size={12} className="text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-300">{t.stage}</div>
                          {t.date && <div className="font-mono text-[10px] text-slate-500 mt-0.5">{t.date}</div>}
                          {t.agent && <div className="text-[10px] text-slate-600">{t.agent} · {t.vehicle}</div>}
                          {t.location && <div className="text-[10px] text-slate-600">{t.location}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI analysis summary */}
              {selected.aiAnalysis && (
                <div className="card p-6">
                  <h3 className="text-sm font-bold text-white mb-4">AI Analysis Report</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Health', value: selected.aiAnalysis.health, color: selected.aiAnalysis.health === 'Healthy' ? 'text-emerald-400' : 'text-red-400' },
                      { label: 'Quality Score', value: `${selected.aiAnalysis.qualityScore}%`, color: 'text-emerald-400' },
                      { label: 'Pest Risk', value: selected.aiAnalysis.pestRisk, color: 'text-blue-400' },
                      { label: 'Soil Quality', value: selected.aiAnalysis.soilQuality, color: 'text-amber-400' },
                      { label: 'Moisture', value: selected.aiAnalysis.moistureLevel, color: 'text-purple-400' },
                      { label: 'Protein', value: selected.aiAnalysis.proteinContent, color: 'text-slate-300' },
                    ].map(m => (
                      <div key={m.label} className="bg-slate-800/30 rounded-xl p-3">
                        <div className="text-[10px] text-slate-500 mb-1">{m.label}</div>
                        <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blockchain */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Blockchain Ledger</h3>
                  <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Icon name="shield" size={10} /> {selected.blockchain.length} Blocks
                  </span>
                </div>
                <BlockchainTimeline entries={selected.blockchain} />
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
