import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Icon, PageWrapper, SectionHeader, StatusBadge, BlockchainTimeline } from '../../components/UI.jsx';

export default function BlockchainPage() {
  const { products } = useApp();
  const [selected, setSelected] = useState(products[0]);
  const [search, setSearch] = useState('');

  const totalBlocks = products.reduce((a, p) => a + p.blockchain.length, 0);
  const verifiedBlocks = products.reduce((a, p) => a + p.blockchain.filter(b => b.verified).length, 0);

  const filtered = products.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.cropName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <SectionHeader
        title="Blockchain Ledger"
        subtitle="Immutable supply chain records — cryptographically secured and tamper-proof"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg font-mono">
              <Icon name="shield" size={12} />
              {verifiedBlocks}/{totalBlocks} Verified
            </div>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Blocks', value: totalBlocks, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Verified', value: verifiedBlocks, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Products', value: products.length, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Chain Height', value: '847,231', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.bg}`}>
            <div className={`font-mono text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Product list */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-slate-800/60">
            <div className="relative">
              <Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input pl-9 py-2 text-xs"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-800/30 overflow-y-auto max-h-[600px]">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left p-4 transition-all ${selected?.id === p.id ? 'bg-emerald-500/10 border-r-2 border-emerald-500' : 'hover:bg-slate-800/30'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] text-emerald-400">{p.id}</span>
                  <StatusBadge status={p.status} />
                </div>
                <div className="text-sm font-semibold text-slate-200 mb-1">{p.cropName}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Icon name="chain" size={10} /> {p.blockchain.length} blocks</span>
                  <span>{p.farmerName}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Blockchain entries */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-5 border-b border-slate-800/40">
                <div>
                  <div className="font-mono text-xs text-slate-500 mb-1">{selected.id}</div>
                  <h2 className="text-lg font-bold text-white">{selected.cropName}</h2>
                  <div className="text-xs text-slate-400 mt-1">{selected.farmerName} · {selected.location}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono">
                    <Icon name="shield" size={10} /> BLOCKCHAIN VERIFIED
                  </span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              {/* Chain stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Blocks', value: selected.blockchain.length },
                  { label: 'Verified', value: selected.blockchain.filter(b => b.verified).length },
                  { label: 'First Block', value: selected.harvestDate },
                ].map(s => (
                  <div key={s.label} className="bg-slate-800/40 rounded-xl p-3 text-center">
                    <div className="font-mono text-base font-bold text-white">{s.value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <BlockchainTimeline entries={selected.blockchain} />
            </div>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <div className="text-center text-slate-600">
                <Icon name="chain" size={40} className="mx-auto mb-3 opacity-30" />
                <p>Select a product to view its blockchain</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
