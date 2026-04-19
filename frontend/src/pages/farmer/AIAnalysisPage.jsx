import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Icon, PageWrapper, SectionHeader, EmptyState } from '../../components/UI.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs">
        <div className="text-slate-400">{label}</div>
        <div className="text-emerald-400 font-bold">{payload[0].value} q/acre</div>
      </div>
    );
  }
  return null;
};

export default function AIAnalysisPage() {
  const { products, runAIAnalysis } = useApp();
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(null);

  const analyzed = products.filter(p => p.aiAnalysis);
  const pending = products.filter(p => !p.aiAnalysis);
  const activeProduct = selected || analyzed[0];

  const handleRunAnalysis = async (id) => {
    setRunning(id);
    await new Promise(r => setTimeout(r, 2000)); // simulate AI processing
    runAIAnalysis(id);
    setRunning(null);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const chartData = activeProduct?.aiAnalysis
    ? months.map((month, i) => ({ month, yield: activeProduct.aiAnalysis.yieldPrediction[i] }))
    : [];

  return (
    <PageWrapper>
      <SectionHeader
        title="AI Analysis"
        subtitle="Machine learning-powered crop quality and health assessment"
        action={
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Engine Online
          </div>
        }
      />

      {/* Pending AI crops */}
      {pending.length > 0 && (
        <div className="card p-5 mb-6 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="brain" size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-amber-400">{pending.length} Crop{pending.length > 1 ? 's' : ''} Awaiting AI Analysis</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {pending.map(p => (
              <div key={p.id} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-slate-500">{p.id}</div>
                  <div className="text-sm font-semibold text-slate-200">{p.cropName}</div>
                  <div className="text-xs text-slate-500">{p.quantity} · {p.harvestDate}</div>
                </div>
                <button
                  onClick={() => handleRunAnalysis(p.id)}
                  disabled={running === p.id}
                  className="btn-primary px-4 py-2 text-xs flex-shrink-0 disabled:opacity-60"
                >
                  {running === p.id ? (
                    <><div className="w-3 h-3 border border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Analyzing...</>
                  ) : (
                    <><Icon name="brain" size={12} /> Run AI</>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {analyzed.length === 0 ? (
        <EmptyState icon="brain" title="No analyzed products yet" desc="Run AI analysis on your registered crops to see results" />
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Product selector */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-widest">Analyzed Products</div>
            <div className="divide-y divide-slate-800/30">
              {analyzed.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left p-4 transition-colors ${activeProduct?.id === p.id ? 'bg-emerald-500/10 border-r-2 border-emerald-500' : 'hover:bg-slate-800/30'}`}
                >
                  <div className="font-mono text-[10px] text-emerald-400 mb-1">{p.id}</div>
                  <div className="text-sm font-semibold text-slate-200 leading-tight">{p.cropName}</div>
                  <div className={`text-[10px] mt-1.5 font-semibold ${p.aiAnalysis.health === 'Healthy' ? 'text-emerald-400' : 'text-red-400'}`}>
                    ● {p.aiAnalysis.health} · {p.aiAnalysis.qualityScore}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis results */}
          <div className="lg:col-span-3 space-y-5">
            {activeProduct && (
              <>
                {/* Header card */}
                <div className="card p-6">
                  <div className="flex flex-wrap items-start gap-5">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900/40 to-green-900/40 border border-slate-700/40 flex items-center justify-center flex-shrink-0">
                      {activeProduct.image ? (
                        <img src={activeProduct.image} alt={activeProduct.cropName} className="w-full h-full object-cover" />
                      ) : (
                        <Icon name="crop" size={32} className="text-slate-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-mono text-xs text-slate-500 mb-1">{activeProduct.id}</div>
                      <h2 className="text-xl font-bold text-white mb-1">{activeProduct.cropName}</h2>
                      <div className="text-sm text-slate-400 mb-3">{activeProduct.quantity} · {activeProduct.location}</div>

                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border ${activeProduct.aiAnalysis.health === 'Healthy' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border-red-500/30 text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${activeProduct.aiAnalysis.health === 'Healthy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {activeProduct.aiAnalysis.health} — AI Health Assessment
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-1">Analyzed</div>
                      <div className="font-mono text-[11px] text-slate-400">{activeProduct.aiAnalysis.analyzedAt}</div>
                    </div>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Quality Score', value: `${activeProduct.aiAnalysis.qualityScore}%`, color: 'emerald', icon: 'star', bar: activeProduct.aiAnalysis.qualityScore },
                    { label: 'Pest Risk', value: activeProduct.aiAnalysis.pestRisk, color: 'blue', icon: 'shield' },
                    { label: 'Soil Quality', value: activeProduct.aiAnalysis.soilQuality, color: 'amber', icon: 'crop' },
                    { label: 'Moisture', value: activeProduct.aiAnalysis.moistureLevel, color: 'purple', icon: 'globe' },
                  ].map(m => (
                    <div key={m.label} className="card p-4">
                      <div className={`text-xs font-semibold mb-2 text-${m.color}-400`}>{m.label}</div>
                      <div className="text-lg font-bold text-white mb-2">{m.value}</div>
                      {m.bar && (
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full bg-${m.color}-500 rounded-full transition-all duration-700`}
                            style={{ width: `${m.bar}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Yield prediction chart */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-white">Yield Prediction Model</h3>
                      <p className="text-xs text-slate-500 mt-0.5">6-month forecast (quintals/acre) · AI confidence: 92.4%</p>
                    </div>
                    <div className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg">
                      Peak: {Math.max(...(activeProduct.aiAnalysis.yieldPrediction || []))} q/acre
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={2} fill="url(#yieldGrad)" dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#4ade80' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Additional insights */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="card p-5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Nutritional Profile</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Protein Content</span>
                        <span className="text-xs font-mono text-white">{activeProduct.aiAnalysis.proteinContent}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Moisture Level</span>
                        <span className="text-xs font-mono text-white">{activeProduct.aiAnalysis.moistureLevel}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Overall Grade</span>
                        <span className={`text-xs font-bold ${activeProduct.aiAnalysis.qualityScore > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {activeProduct.aiAnalysis.qualityScore > 90 ? 'Grade A+' : activeProduct.aiAnalysis.qualityScore > 80 ? 'Grade A' : 'Grade B'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card p-5 border-emerald-500/20 bg-emerald-500/5">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">AI Recommendation</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeProduct.aiAnalysis.health === 'Healthy'
                        ? `This crop shows excellent characteristics with a quality score of ${activeProduct.aiAnalysis.qualityScore}%. Recommended for premium market listing. Optimal harvest window confirmed.`
                        : `This crop shows some indicators of stress. Recommend additional inspection before supply chain dispatch. Consider soil amendment treatments.`
                      }
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
