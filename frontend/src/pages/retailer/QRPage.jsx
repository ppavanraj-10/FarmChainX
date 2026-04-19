import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Icon, FakeQR, StatusBadge, PageWrapper, SectionHeader } from '../../components/UI.jsx';

export default function QRPage() {
  const { products, generateQR } = useApp();
  const [selected, setSelected] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async (p) => {
    setSelected(p);
    setGenerating(true);
    setGenerated(false);
    await new Promise(r => setTimeout(r, 1200));
    generateQR(p.id);
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <PageWrapper>
      <SectionHeader title="QR Code Generator" subtitle="Generate verifiable QR codes for consumer product authentication" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product list */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Select Product</h2>
          {products.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className={`card p-5 cursor-pointer transition-all hover:border-slate-600 ${selected?.id === p.id ? 'border-emerald-500/40 bg-emerald-500/5' : ''}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-mono text-xs text-emerald-400 mb-0.5">{p.id}</div>
                  <div className="text-sm font-bold text-white">{p.cropName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.quantity} · {p.farmerName} · {p.harvestDate}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={p.status} />
                  {p.qrGenerated && (
                    <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Icon name="qr" size={9} /> Generated
                    </span>
                  )}
                </div>
              </div>

              {/* Quality bar */}
              {p.aiAnalysis && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                      style={{ width: `${p.aiAnalysis.qualityScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{p.aiAnalysis.qualityScore}%</span>
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); handleGenerate(p); }}
                className={`mt-3 w-full py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5
                  ${p.qrGenerated
                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30'
                    : 'bg-slate-700/60 border-slate-600/60 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400'
                  }`}
              >
                <Icon name="qr" size={12} />
                {p.qrGenerated ? 'Regenerate QR Code' : 'Generate QR Code'}
              </button>
            </div>
          ))}
        </div>

        {/* QR Display */}
        <div className="card p-6 flex flex-col">
          {generating ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-slate-400">Generating secure QR code...</p>
                <p className="text-xs text-slate-600 mt-1">Embedding blockchain verification</p>
              </div>
            </div>
          ) : selected ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-base font-bold text-white mb-1">{selected.cropName}</h3>
                <p className="font-mono text-xs text-emerald-400">{selected.id}</p>
                {generated && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mt-2">
                    <Icon name="check" size={11} /> QR Code Generated Successfully
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <FakeQR value={selected.id} size={13} />
                  {selected.qrGenerated && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Icon name="check" size={13} className="text-slate-950" />
                    </div>
                  )}
                </div>
              </div>

              {/* Product info card */}
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Product ID</span>
                  <span className="font-mono text-emerald-400">{selected.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop</span>
                  <span className="text-slate-300 font-semibold">{selected.cropName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer</span>
                  <span className="text-slate-300">{selected.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farm</span>
                  <span className="text-slate-300">{selected.farm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Harvest Date</span>
                  <span className="font-mono text-slate-300">{selected.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quality Score</span>
                  <span className={`font-bold ${selected.aiAnalysis ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {selected.aiAnalysis ? `${selected.aiAnalysis.qualityScore}%` : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Blockchain</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Icon name="shield" size={10} /> Verified ({selected.blockchain.length} blocks)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="btn-secondary py-2.5 text-xs">
                  <Icon name="upload" size={13} /> Export PNG
                </button>
                <button className="btn-primary py-2.5 text-xs">
                  <Icon name="qr" size={13} /> Print QR
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-slate-600">
              <div>
                <Icon name="qr" size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Select a product to generate its QR code</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
