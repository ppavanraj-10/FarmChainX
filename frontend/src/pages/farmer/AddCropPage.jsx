import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Icon, PageWrapper, SectionHeader } from '../../components/UI.jsx';

export default function AddCropPage() {
  const { user, addProduct } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cropName: '', quantity: '', unit: 'kg', location: '', harvestDate: '', notes: '', imagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => set('imagePreview', reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.cropName.trim()) e.cropName = 'Required';
    if (!form.quantity || isNaN(form.quantity)) e.quantity = 'Valid number required';
    if (!form.location.trim()) e.location = 'Required';
    if (!form.harvestDate) e.harvestDate = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newProduct = {
      id: `FCX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      cropName: form.cropName,
      quantity: `${form.quantity} ${form.unit}`,
      location: form.location,
      harvestDate: form.harvestDate,
      farmerId: user.id,
      farmerName: user.name,
      farm: user.farm || `${user.name}'s Farm`,
      farmerPhone: user.phone || '',
      status: 'Pending AI',
      image: form.imagePreview,
      aiAnalysis: null,
      blockchain: [
        {
          hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          event: 'Crop Registered & Harvested',
          verified: true,
        },
      ],
      transport: [],
      qrGenerated: false,
      receivedByRetailer: false,
    };

    addProduct(newProduct);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/farmer/dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center page-enter">
            <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 glow-green">
              <Icon name="check" size={36} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Crop Registered!</h2>
            <p className="text-slate-400 mb-2">Your crop has been recorded on the blockchain.</p>
            <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SectionHeader title="Add New Crop" subtitle="Register your harvest on the FarmChainX blockchain" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Crop Name *</label>
              <input
                type="text"
                value={form.cropName}
                onChange={e => set('cropName', e.target.value)}
                placeholder="e.g. Organic Basmati Rice"
                className="input"
              />
              {errors.cropName && <p className="text-xs text-red-400 mt-1">{errors.cropName}</p>}
            </div>
            <div>
              <label className="label">Location / Farm *</label>
              <input
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="e.g. Punjab, India"
                className="input"
              />
              {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Quantity *</label>
              <input
                type="number"
                value={form.quantity}
                onChange={e => set('quantity', e.target.value)}
                placeholder="500"
                className="input"
                min="1"
              />
              {errors.quantity && <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="label">Unit</label>
              <select value={form.unit} onChange={e => set('unit', e.target.value)} className="input">
                {['kg', 'tons', 'quintals', 'boxes', 'crates', 'liters', 'pieces'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Harvest Date *</label>
            <input
              type="date"
              value={form.harvestDate}
              onChange={e => set('harvestDate', e.target.value)}
              className="input"
              max={new Date().toISOString().slice(0, 10)}
            />
            {errors.harvestDate && <p className="text-xs text-red-400 mt-1">{errors.harvestDate}</p>}
          </div>

          <div>
            <label className="label">Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Cultivation method, certifications, special characteristics..."
              className="input resize-none h-20"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm disabled:opacity-60"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Recording on Blockchain...</>
            ) : (
              <><Icon name="plus" size={16} /> Register Crop</>
            )}
          </button>
        </div>

        {/* Image upload + info */}
        <div className="space-y-4">
          <div className="card p-5">
            <label className="label mb-3 block">Crop Image</label>
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              <div className="border-2 border-dashed border-slate-700/60 rounded-xl overflow-hidden hover:border-emerald-500/40 transition-colors">
                {form.imagePreview ? (
                  <div className="relative group">
                    <img src={form.imagePreview} alt="crop preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-600">
                    <Icon name="upload" size={28} className="mb-2 opacity-50" />
                    <p className="text-xs font-medium">Click to upload</p>
                    <p className="text-[10px] mt-0.5">JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">What happens next?</div>
            <div className="space-y-3">
              {[
                { icon: 'chain', text: 'Crop hash recorded on blockchain', color: 'text-emerald-400' },
                { icon: 'brain', text: 'AI analysis queued for quality scoring', color: 'text-blue-400' },
                { icon: 'shield', text: 'Immutable record created permanently', color: 'text-purple-400' },
                { icon: 'truck', text: 'Supply chain tracking enabled', color: 'text-amber-400' },
              ].map(s => (
                <div key={s.text} className="flex items-start gap-2.5">
                  <Icon name={s.icon} size={14} className={`mt-0.5 flex-shrink-0 ${s.color}`} />
                  <span className="text-xs text-slate-400">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Icon name="shield" size={14} />
              <span className="text-xs font-semibold">Blockchain Secured</span>
            </div>
            <p className="text-xs text-slate-500">
              Once registered, this record cannot be altered or deleted. Every update creates a new verifiable block.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
