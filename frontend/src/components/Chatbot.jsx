import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Icon } from './UI.jsx';

// ============================================================
// ROLE-SPECIFIC SYSTEM PROMPTS
// ============================================================
const ROLE_CONFIG = {
  farmer: {
    name: 'AgriBot',
    subtitle: 'Your Farming Assistant',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    bubbleBg: 'bg-emerald-500/15 border-emerald-500/20',
    icon: 'leaf',
    placeholder: 'Ask about crops, soil, harvest timing...',
    suggestions: [
      'What crops grow best in Punjab in April?',
      'How do I improve my soil quality score?',
      'When is the best time to harvest Basmati rice?',
      'What does a quality score of 94% mean?',
      'How can I reduce pest risk on my farm?',
    ],
    systemPrompt: `You are AgriBot, an expert agricultural assistant for FarmChainX — an AI-driven agricultural traceability platform. You are speaking with a FARMER.

Your expertise includes:
- Crop cultivation, soil management, irrigation, and pest control
- Understanding AI quality scores and what they mean for crop value
- Blockchain traceability — explaining how immutable records benefit farmers
- Harvest timing, yield optimization, and post-harvest handling
- Organic farming practices and certifications
- Market pricing and what retailers look for in produce quality

Platform context:
- Farmers register crops and get AI quality scores (0-100%)
- Status flow: Pending AI → Verified → In Transit → Delivered
- Every supply chain event creates an immutable blockchain block
- Quality scores: 90%+ = Grade A+, 80-90% = Grade A, below 80% = Grade B

Keep responses concise (2-4 sentences max per point), practical, and farmer-friendly. Use simple language. When relevant, tie advice back to the FarmChainX platform features like AI analysis scores, blockchain records, or supply chain tracking. Always be encouraging and supportive.`,
  },

  supply_chain: {
    name: 'LogiBot',
    subtitle: 'Logistics Intelligence',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    accent: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    bubbleBg: 'bg-blue-500/15 border-blue-500/20',
    icon: 'truck',
    placeholder: 'Ask about routes, cold chain, compliance...',
    suggestions: [
      'What is the optimal route from Punjab to Bangalore?',
      'Cold chain requirements for Alphonso mangoes?',
      'How do I handle a delayed shipment?',
      'What documents are needed for interstate transport?',
      'How does blockchain improve logistics trust?',
    ],
    systemPrompt: `You are LogiBot, an expert logistics and supply chain assistant for FarmChainX — an AI-driven agricultural traceability platform. You are speaking with a SUPPLY CHAIN OPERATOR.

Your expertise includes:
- Agricultural logistics, cold chain management, and temperature requirements
- Route optimization, vehicle selection, and transit time estimation
- Food safety compliance, FSSAI regulations, and interstate transport laws
- Warehouse management, loading/unloading best practices
- Blockchain-based proof of delivery and audit trails
- Handling exceptions: delays, damaged goods, route changes
- Last-mile delivery to retail stores

Platform context:
- Supply chain operators update 4 transport stages: Picked Up → Warehouse → Transit → Retailer
- Each stage update creates an immutable blockchain block automatically
- Products have AI quality scores — high-quality produce needs careful cold chain handling
- Real-time status visible to farmers and retailers on the platform

Keep responses precise, operationally focused, and professional. Mention specific temperatures, timeframes, and compliance requirements where relevant. Reference FarmChainX platform features when helpful.`,
  },

  retailer: {
    name: 'RetailBot',
    subtitle: 'Retail Intelligence',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    accent: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    bubbleBg: 'bg-purple-500/15 border-purple-500/20',
    icon: 'store',
    placeholder: 'Ask about inventory, QR codes, shelf life...',
    suggestions: [
      'How do I verify a product before accepting delivery?',
      'What does a QR code contain for consumers?',
      'Shelf life recommendations for fresh produce?',
      'How to handle a product with low quality score?',
      'What blockchain data can I show customers?',
    ],
    systemPrompt: `You are RetailBot, an expert retail operations assistant for FarmChainX — an AI-driven agricultural traceability platform. You are speaking with a RETAILER.

Your expertise includes:
- Fresh produce quality assessment and acceptance criteria
- QR code marketing and consumer transparency strategies
- Shelf life management, FIFO rotation, and storage conditions
- Product sourcing decisions based on AI quality scores
- Consumer trust building through blockchain traceability
- Handling disputes with suppliers about product quality
- Retail pricing strategies for traceable, AI-verified produce
- Food safety compliance and labeling requirements

Platform context:
- Retailers receive products and confirm delivery on the platform
- QR codes are generated containing: farmer info, harvest date, AI quality score, blockchain verification
- Products with 90%+ quality scores can be marketed as premium
- Full blockchain history is available for every product
- Consumers can scan QR codes to verify the entire supply chain

Keep responses business-focused, practical, and consumer-minded. Give specific advice on leveraging the traceability data as a marketing advantage. Reference FarmChainX features like QR generation and product history.`,
  },

  consumer: {
    name: 'TrustBot',
    subtitle: 'Food Transparency Guide',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    bubbleBg: 'bg-amber-500/15 border-amber-500/20',
    icon: 'user',
    placeholder: 'Ask about food safety, nutrition, verification...',
    suggestions: [
      'How do I verify if a product is genuine?',
      'What does a quality score of 97% mean?',
      'Is blockchain verification reliable for food?',
      'What information is in a product QR code?',
      'How do I know if my food is organic?',
    ],
    systemPrompt: `You are TrustBot, a friendly food transparency assistant for FarmChainX — an AI-driven agricultural traceability platform. You are speaking with a CONSUMER.

Your expertise includes:
- Explaining food traceability in simple, understandable terms
- What AI quality scores mean for food safety and nutrition
- How blockchain verification works and why it matters for food trust
- Understanding product labels, certifications, and quality grades
- Nutritional aspects of common agricultural products
- Food storage tips at home to maintain freshness
- How to read and understand QR code verification results
- Organic vs conventional farming differences

Platform context:
- Consumers can verify any product by entering its Product ID
- They see: farmer details, crop info, AI quality report, transport history, blockchain proof
- Quality scores: 90%+ = Grade A+, 80-90% = Grade A, below 80% = Grade B
- "Healthy" AI health status means crop passed all quality parameters
- Blockchain "IMMUTABLE" badge means the record has never been altered

Be warm, reassuring, and educational. Use simple language — avoid technical jargon. Help consumers understand what the data means for their food choices. Be honest and transparent.`,
  },
};

// ============================================================
// MESSAGE BUBBLE
// ============================================================
const MessageBubble = ({ message, config }) => {
  const isBot = message.role === 'assistant';
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {isBot && (
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg`}>
          <Icon name={config.icon} size={13} className="text-white" />
        </div>
      )}
      <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed border ${
          isUser
            ? 'bg-slate-700/80 border-slate-600/40 text-slate-100 rounded-tr-sm'
            : `${config.bubbleBg} text-slate-200 rounded-tl-sm`
        }`}>
          {message.content}
        </div>
        <span className="text-[10px] text-slate-600 px-1">{message.time}</span>
      </div>
    </div>
  );
};

// ============================================================
// TYPING INDICATOR
// ============================================================
const TypingIndicator = ({ config }) => (
  <div className="flex gap-2.5 mb-4">
    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
      <Icon name={config.icon} size={13} className="text-white" />
    </div>
    <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border ${config.bubbleBg}`}>
      <div className="flex gap-1 items-center h-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${config.accent.replace('text-', 'bg-')} opacity-60`}
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// MAIN CHATBOT COMPONENT
// ============================================================
export default function Chatbot() {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const config = ROLE_CONFIG[user?.role] || ROLE_CONFIG.consumer;

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Greeting message when first opened
  useEffect(() => {
    if (isOpen && !hasGreeted && user) {
      setHasGreeted(true);
      const greetings = {
        farmer: `Hey ${user.name}! 👋 I'm AgriBot, your farming assistant. I can help you with crop advice, understanding your AI quality scores, soil health, harvest timing, and anything about your FarmChainX products. What's on your mind today?`,
        supply_chain: `Hello ${user.name}! 🚚 I'm LogiBot, your logistics intelligence assistant. I can help with route planning, cold chain requirements, compliance questions, and optimizing your supply chain operations. How can I assist?`,
        retailer: `Hi ${user.name}! 🏪 I'm RetailBot, your retail intelligence assistant. I can help with product verification, QR code strategies, shelf life management, and how to leverage FarmChainX traceability data for your store. What do you need?`,
        consumer: `Hi there! 👋 I'm TrustBot, your food transparency guide. I can help you understand what your food's quality scores mean, how blockchain verification works, and how to verify any product's journey from farm to your plate. Ask me anything!`,
      };
      setTimeout(() => {
        setMessages([{
          role: 'assistant',
          content: greetings[user.role] || greetings.consumer,
          time: now(),
        }]);
      }, 300);
    }
  }, [isOpen, hasGreeted, user]);

  const sendMessage = async (text = input.trim()) => {
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build conversation history for API (exclude time field)
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: config.systemPrompt,
          messages: [...history, { role: 'user', content: text }],
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm sorry, I couldn't process that. Please try again.";

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        time: now(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your connection and try again.",
        time: now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setHasGreeted(false);
    setIsOpen(false);
    setTimeout(() => setIsOpen(true), 50);
  };

  if (!user) return null;

  return (
    <>
      {/* Bounce keyframe injection */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .chat-window { animation: chatSlideUp 0.25s ease-out; }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: inherit;
          animation: pulseRing 2s ease-out infinite;
        }
      `}</style>

      {/* ── CHAT WINDOW ── */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-5 sm:right-6 z-50 w-[calc(100vw-40px)] sm:w-[380px] chat-window
            bg-slate-900 border ${config.border} rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden`}
          style={{ maxHeight: isMinimized ? '56px' : '560px', transition: 'max-height 0.3s ease' }}
        >
          {/* Header */}
          <div className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${config.gradient} flex-shrink-0`}>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name={config.icon} size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white leading-none">{config.name}</div>
              <div className="text-[10px] text-white/70 mt-0.5 leading-none">{config.subtitle}</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
              <span className="text-[10px] text-white/70 mr-2">Online</span>
              <button
                onClick={clearChat}
                title="Clear chat"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors text-[10px]"
              >
                ↺
              </button>
              <button
                onClick={() => setIsMinimized(m => !m)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <span className="text-base leading-none">{isMinimized ? '▲' : '▼'}</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-0" style={{ minHeight: 0 }}>
                {messages.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                      <Icon name={config.icon} size={22} className="text-white" />
                    </div>
                    <div className={`text-sm font-bold ${config.accent} mb-1`}>{config.name}</div>
                    <div className="text-xs text-slate-500">{config.subtitle}</div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} config={config} />
                ))}

                {loading && <TypingIndicator config={config} />}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions (only when no messages except greeting) */}
              {messages.length <= 1 && !loading && (
                <div className="px-4 pb-2">
                  <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Suggested Questions</div>
                  <div className="flex flex-col gap-1.5">
                    {config.suggestions.slice(0, 3).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        className={`text-left text-xs px-3 py-2 rounded-xl border ${config.border} ${config.bg} ${config.accent} hover:opacity-80 transition-opacity leading-snug`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-slate-800/60 flex-shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={config.placeholder}
                    rows={1}
                    disabled={loading}
                    className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 resize-none transition-colors disabled:opacity-50"
                    style={{ maxHeight: '80px' }}
                    onInput={e => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22,2 15,22 11,13 2,9" />
                    </svg>
                  </button>
                </div>
                <div className="text-[9px] text-slate-700 text-center mt-1.5">
                  Powered by Claude AI · Role: <span className={config.accent}>{user?.role?.replace('_', ' ')}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── FAB BUTTON ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`fixed bottom-5 right-5 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br ${config.gradient}
          flex items-center justify-center shadow-2xl transition-all duration-300
          hover:scale-110 active:scale-95 relative pulse-ring`}
        title={`Open ${config.name}`}
      >
        {isOpen ? (
          <Icon name="x" size={22} className="text-white" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}

        {/* Unread indicator */}
        {!isOpen && messages.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-slate-950">
            {messages.filter(m => m.role === 'assistant').length}
          </div>
        )}
      </button>
    </>
  );
}
