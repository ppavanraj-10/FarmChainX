import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Icon, BlockchainTimeline, TransportStepper, FakeQR, PageWrapper } from '../../components/UI.jsx';

export default function ConsumerVerifyPage() {
  const { user, verifyProduct, placeOrder, orders } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview');
  const [checkout, setCheckout] = useState({
    quantity: 1,
    phone: user?.phone || '',
    shippingAddress: user?.location || '',
    notes: '',
  });
  const [orderState, setOrderState] = useState({ loading: false, error: '', success: '' });

  const canBuy = !!result && (result.status === 'Delivered' || result.qrGenerated);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setOrderState({ loading: false, error: '', success: '' });
    const response = await verifyProduct(q.trim());
    if (response.success) {
      setResult(response.product);
      setTab('overview');
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  const handleOrder = async () => {
    if (!result) return;
    if (!checkout.shippingAddress.trim()) {
      setOrderState({ loading: false, error: 'Shipping address is required', success: '' });
      return;
    }

    setOrderState({ loading: true, error: '', success: '' });
    const response = await placeOrder({
      productId: result.id,
      quantity: Number(checkout.quantity),
      phone: checkout.phone,
      shippingAddress: checkout.shippingAddress,
      notes: checkout.notes,
    });

    if (response.success) {
      const refreshed = await verifyProduct(result.id);
      setOrderState({
        loading: false,
        error: '',
        success: `${response.order.orderId} placed successfully`,
      });
      if (refreshed.success) {
        setResult(refreshed.product);
      }
    } else {
      setOrderState({ loading: false, error: response.error, success: '' });
    }
  };

  const recentOrder = result ? orders.find(order => order.productId === result.id) : null;

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="text-center mb-10 page-enter">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 glow-green">
          <Icon name="search" size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Verify Your Food</h1>
        <p className="text-slate-400 max-w-md mx-auto">Enter a Product ID or crop name to trace its complete journey from farm to your plate</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="FCX-2024-001 or Alphonso Mangoes"
              className="input pl-11 py-3.5 text-sm"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-primary px-6 py-3.5 text-sm disabled:opacity-60 flex-shrink-0"
          >
            {loading ? <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : 'Verify'}
          </button>
        </div>
        </div>

      {/* Not found */}
      {notFound && (
        <div className="max-w-xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
          <Icon name="x" size={16} className="inline mr-2" />
          Product not found. Please check the ID and try again.
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="page-enter">
          {/* Verified banner */}
          <div className="card p-5 border-emerald-500/30 bg-emerald-500/5 mb-6 glow-green">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-400">
                <Icon name="shield" size={22} />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-emerald-400 mb-0.5">✓ Blockchain Verified Product</div>
                <div className="text-xs text-slate-400">This product's journey has been immutably recorded — {result.blockchain.length} blocks verified</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-slate-500">Product ID</div>
                <div className="font-mono text-sm text-emerald-400 font-bold">{result.id}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-800/60 mb-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: 'package' },
              { id: 'ai_report', label: 'AI Report', icon: 'brain' },
              { id: 'transport', label: 'Transport', icon: 'truck' },
              { id: 'blockchain', label: 'Blockchain', icon: 'chain' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t.id ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                <Icon name={t.icon} size={13} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {tab === 'overview' && (
            <div className="grid xl:grid-cols-[2fr,1fr] gap-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Farmer */}
                <div className="card p-5">
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                  <Icon name="leaf" size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Farmer</span>
                </div>
                <div className="text-base font-bold text-white mb-1">{result.farmerName}</div>
                <div className="text-xs text-slate-500">{result.farm}</div>
                <div className="text-xs text-slate-500 mt-0.5">{result.location}</div>
                {result.farmerPhone && <div className="text-xs text-slate-600 mt-0.5">{result.farmerPhone}</div>}
                </div>

              {/* Crop */}
                <div className="card p-5">
                <div className="flex items-center gap-2 mb-3 text-blue-400">
                  <Icon name="crop" size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Crop</span>
                </div>
                <div className="text-base font-bold text-white mb-1">{result.cropName}</div>
                <div className="text-xs text-slate-500">Qty: {result.quantity}</div>
                <div className="text-xs text-slate-500 mt-0.5">Harvested: {result.harvestDate}</div>
                </div>

              {/* AI Status */}
                <div className="card p-5">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Icon name="brain" size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">AI Quality</span>
                </div>
                {result.aiAnalysis ? (
                  <>
                    <div className={`text-base font-bold mb-1 ${result.aiAnalysis.health === 'Healthy' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.aiAnalysis.health}
                    </div>
                    <div className="text-xs text-slate-500">Score: {result.aiAnalysis.qualityScore}%</div>
                    <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.aiAnalysis.qualityScore}%` }} />
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-amber-400">Pending Analysis</div>
                )}
                </div>

              {/* Delivery status */}
                <div className="card p-5">
                <div className="flex items-center gap-2 mb-3 text-amber-400">
                  <Icon name="package" size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Status</span>
                </div>
                <div className="text-base font-bold text-white mb-2">{result.status}</div>
                <div className="text-xs text-slate-500">{result.blockchain.length} chain records</div>
                {result.qrGenerated && (
                  <div className="mt-3">
                    <FakeQR value={result.id} size={7} />
                  </div>
                )}
                </div>
              </div>

              <div className="card p-5 border-emerald-500/20">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Buy This Product</h3>
                    <p className="text-xs text-slate-500 mt-1">Turn verification into a direct consumer purchase flow.</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${canBuy ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-slate-700 text-slate-500 bg-slate-800/40'}`}>
                    {canBuy ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                {recentOrder && (
                  <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-300">
                    Latest order: <span className="font-mono text-blue-400">{recentOrder.orderId}</span> · {recentOrder.status}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={checkout.quantity}
                      onChange={(e) => setCheckout(prev => ({ ...prev, quantity: e.target.value }))}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Phone</label>
                    <input
                      type="text"
                      value={checkout.phone}
                      onChange={(e) => setCheckout(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Shipping Address</label>
                    <textarea
                      value={checkout.shippingAddress}
                      onChange={(e) => setCheckout(prev => ({ ...prev, shippingAddress: e.target.value }))}
                      placeholder="House no, street, city, state, postal code"
                      className="input h-24 resize-none"
                    />
                  </div>

                  <div>
                    <label className="label">Order Notes</label>
                    <textarea
                      value={checkout.notes}
                      onChange={(e) => setCheckout(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Preferred delivery slot, packaging needs, etc."
                      className="input h-20 resize-none"
                    />
                  </div>

                  {orderState.error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                      {orderState.error}
                    </div>
                  )}

                  {orderState.success && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                      {orderState.success}
                    </div>
                  )}

                  <button
                    onClick={handleOrder}
                    disabled={!canBuy || orderState.loading}
                    className="btn-primary w-full py-3 text-sm disabled:opacity-60"
                  >
                    {orderState.loading ? 'Placing Order...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Report tab */}
          {tab === 'ai_report' && (
            result.aiAnalysis ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`card p-5 lg:col-span-3 border-2 ${result.aiAnalysis.health === 'Healthy' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${result.aiAnalysis.health === 'Healthy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className={`text-lg font-bold ${result.aiAnalysis.health === 'Healthy' ? 'text-emerald-400' : 'text-red-400'}`}>
                      AI Health Assessment: {result.aiAnalysis.health}
                    </span>
                    <span className="text-xs text-slate-500 ml-auto">Analyzed: {result.aiAnalysis.analyzedAt}</span>
                  </div>
                </div>
                {[
                  { label: 'Quality Score', value: `${result.aiAnalysis.qualityScore}%`, color: 'emerald', bar: result.aiAnalysis.qualityScore },
                  { label: 'Pest Risk Level', value: result.aiAnalysis.pestRisk, color: 'blue' },
                  { label: 'Soil Quality', value: result.aiAnalysis.soilQuality, color: 'amber' },
                  { label: 'Moisture Level', value: result.aiAnalysis.moistureLevel, color: 'purple' },
                  { label: 'Protein Content', value: result.aiAnalysis.proteinContent, color: 'cyan' },
                  { label: 'AI Confidence', value: '92.4%', color: 'rose' },
                ].map(m => (
                  <div key={m.label} className="card p-4">
                    <div className={`text-xs font-semibold mb-2 text-${m.color}-400`}>{m.label}</div>
                    <div className="text-xl font-bold text-white">{m.value}</div>
                    {m.bar && (
                      <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-${m.color}-500 rounded-full`} style={{ width: `${m.bar}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center text-slate-600">
                <Icon name="brain" size={40} className="mx-auto mb-3 opacity-30" />
                <p>AI analysis not yet completed for this product</p>
              </div>
            )
          )}

          {/* Transport tab */}
          {tab === 'transport' && (
            <div className="space-y-5">
              {result.transport.length > 0 ? (
                <>
                  <div className="card p-6">
                    <h3 className="text-sm font-bold text-white mb-5">Supply Chain Journey</h3>
                    <TransportStepper transport={result.transport} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.transport.map(t => (
                      <div key={t.stage} className={`card p-5 ${t.completed ? 'border-emerald-500/20' : ''}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${t.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                            {t.completed ? <Icon name="check" size={13} /> : <Icon name="truck" size={13} />}
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider ${t.completed ? 'text-emerald-400' : 'text-slate-600'}`}>{t.stage}</span>
                        </div>
                        {t.date && <div className="font-mono text-xs text-slate-400 mb-1">{t.date}</div>}
                        {t.agent && <div className="text-xs text-slate-500">{t.agent}</div>}
                        {t.vehicle && <div className="font-mono text-xs text-slate-600 mt-0.5">{t.vehicle}</div>}
                        {t.location && <div className="text-xs text-slate-500 mt-0.5">{t.location}</div>}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="card p-12 text-center text-slate-600">
                  <Icon name="truck" size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No transport activity recorded yet</p>
                </div>
              )}
            </div>
          )}

          {/* Blockchain tab */}
          {tab === 'blockchain' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Immutable Blockchain Records</h3>
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full font-mono flex items-center gap-1.5">
                  <Icon name="shield" size={11} /> {result.blockchain.length} BLOCKS
                </span>
              </div>
              <BlockchainTimeline entries={result.blockchain} />
            </div>
          )}
        </div>
      )}

      {/* Info section when nothing searched */}
      {!result && !notFound && !loading && (
        <div className="max-w-2xl mx-auto mt-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: 'shield', title: 'Blockchain Verified', desc: 'Every record is cryptographically secured and immutable' },
              { icon: 'brain', title: 'AI Quality Score', desc: 'Machine learning analyzes crop quality and health in real-time' },
              { icon: 'globe', title: 'Full Traceability', desc: 'Track from GPS farm coordinates to your retail store shelf' },
            ].map(c => (
              <div key={c.title} className="card p-5 text-center hover:border-emerald-500/20 transition-colors">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <Icon name={c.icon} size={18} />
                </div>
                <div className="text-sm font-bold text-white mb-1">{c.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
