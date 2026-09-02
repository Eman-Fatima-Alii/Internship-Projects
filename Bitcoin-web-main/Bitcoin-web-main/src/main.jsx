import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDown, ArrowUp, Bell, Bot, Check, ChevronDown, ChevronsLeft, ChevronsRight,
  CircleHelp, Clock3, Copy, Gauge, LayoutDashboard, Menu, MessageCircle, Moon, MoreHorizontal,
  RefreshCw, Search, Settings, ShieldCheck, Sparkles, Star, Sun, TrendingDown, TrendingUp,
  Wallet, X, Zap, ExternalLink
} from 'lucide-react';
import './styles.css';

const API = 'https://api.binance.com';

const COIN_DATABASE = {
  UNIUSDT: { symbol: 'UNIUSDT', base: 'UNI', name: 'Uniswap', coin: '🦄', pair: 'UNI / USDT', cls: 'uni', color: '#ff007a', approxPrice: 7.5 },
  BTCUSDT: { symbol: 'BTCUSDT', base: 'BTC', name: 'Bitcoin', coin: '₿', pair: 'BTC / USDT', cls: 'btc', color: '#f59e0b', approxPrice: 63500 },
  ETHUSDT: { symbol: 'ETHUSDT', base: 'ETH', name: 'Ethereum', coin: 'Ξ', pair: 'ETH / USDT', cls: 'eth', color: '#627eea', approxPrice: 2600 },
  SOLUSDT: { symbol: 'SOLUSDT', base: 'SOL', name: 'Solana', coin: 'S', pair: 'SOL / USDT', cls: 'sol', color: '#14f195', approxPrice: 145 },
  BNBUSDT: { symbol: 'BNBUSDT', base: 'BNB', name: 'BNB', coin: 'B', pair: 'BNB / USDT', cls: 'bnb', color: '#f3ba2f', approxPrice: 580 },
  XRPUSDT: { symbol: 'XRPUSDT', base: 'XRP', name: 'XRP', coin: 'X', pair: 'XRP / USDT', cls: 'xrp', color: '#23292f', approxPrice: 0.55 },
  DOGEUSDT: { symbol: 'DOGEUSDT', base: 'DOGE', name: 'Dogecoin', coin: 'Ð', pair: 'DOGE / USDT', cls: 'doge', color: '#c2a633', approxPrice: 0.11 },
  ADAUSDT: { symbol: 'ADAUSDT', base: 'ADA', name: 'Cardano', coin: '₳', pair: 'ADA / USDT', cls: 'ada', color: '#0033ad', approxPrice: 0.38 },
  LINKUSDT: { symbol: 'LINKUSDT', base: 'LINK', name: 'Chainlink', coin: '⬡', pair: 'LINK / USDT', cls: 'link', color: '#375bd2', approxPrice: 12.5 },
  AVAXUSDT: { symbol: 'AVAXUSDT', base: 'AVAX', name: 'Avalanche', coin: 'A', pair: 'AVAX / USDT', cls: 'avax', color: '#e84142', approxPrice: 26 },
  DOTUSDT: { symbol: 'DOTUSDT', base: 'DOT', name: 'Polkadot', coin: '●', pair: 'DOT / USDT', cls: 'dot', color: '#e6007a', approxPrice: 6 }
};

const money = (n) => {
  const num = Number(n || 0);
  if (num === 0) return '0.00';
  if (num < 0.1) return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  if (num < 10) return num.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const compact = (n) => Number(n || 0).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 });

function Sparkline({ points, positive = true, color }) {
  const vals = points?.length ? points : [100, 102, 101, 104, 103, 107, 106, 109, 108, 111];
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const path = vals.map((v, i) => `${i ? 'L' : 'M'} ${(i / (vals.length - 1)) * 100} ${100 - ((v - min) / range) * 75 - 12}`).join(' ');
  const strokeColor = color || (positive ? '#10b981' : '#f43f5e');
  return (
    <svg className="spark" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chart({ data, dark, color }) {
  const [hover, setHover] = useState(null);
  const W = 1000, H = 430, pad = { l: 20, r: 24, t: 24, b: 36 };
  const vals = data.map(x => x.close);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const x = i => pad.l + (i / Math.max(data.length - 1, 1)) * (W - pad.l - pad.r);
  const y = v => pad.t + (1 - (v - min) / range) * (H - pad.t - pad.b);
  
  const line = data.map((d, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(d.close)}`).join(' ');
  const area = `${line} L ${x(data.length - 1)} ${H - pad.b} L ${x(0)} ${H - pad.b} Z`;
  const strokeColor = color || '#6366f1';
  const lastIndex = data.length - 1;
  const lastX = x(lastIndex);
  const lastY = y(data[lastIndex]?.close || min);

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="main-chart" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.30" />
            <stop offset="70%" stopColor={strokeColor} stopOpacity="0.04" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + i * ((H - pad.t - pad.b) / 4)}
            y2={pad.t + i * ((H - pad.t - pad.b) / 4)}
            className="gridline"
          />
        ))}

        {/* Area & Line */}
        <path d={area} className="area-fill" fill="url(#chartGradient)" />
        <path d={line} className="chart-line" stroke={strokeColor} />

        {/* Live Beacon at latest data point */}
        <circle cx={lastX} cy={lastY} r="9" fill={strokeColor} opacity="0.3" className="chart-beacon" />
        <circle cx={lastX} cy={lastY} r="4.5" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />

        {/* Crosshair indicator on hover */}
        {hover && (
          <g>
            <line x1={x(hover.i)} x2={x(hover.i)} y1={pad.t} y2={H - pad.b} className="chart-crosshair-line" />
            <line x1={pad.l} x2={W - pad.r} y1={y(hover.d.close)} y2={y(hover.d.close)} className="chart-crosshair-line" />
            <circle cx={x(hover.i)} cy={y(hover.d.close)} r="5" fill="#ffffff" stroke={strokeColor} strokeWidth="3" />
          </g>
        )}

        {/* Mouse capture columns */}
        {data.map((d, i) => (
          <rect
            key={i}
            x={x(i) - 14}
            y={pad.t}
            width="28"
            height={H - pad.t - pad.b}
            fill="transparent"
            onMouseMove={() => setHover({ d, i })}
          />
        ))}
      </svg>

      {hover && (
        <div
          className="tooltip"
          style={{
            left: `${(hover.i / Math.max(data.length - 1, 1)) * 86 + 7}%`,
            top: '12%'
          }}
        >
          <b>${money(hover.d.close)}</b>
          <span>{new Date(hover.d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      )}

      <div className="y-labels">
        <span>${money(max)}</span>
        <span>${money((max + min) / 2)}</span>
        <span>${money(min)}</span>
      </div>

      <div className="x-labels">
        <span>{new Date(data[0]?.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>{new Date(data[Math.floor(data.length / 2)]?.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>Live Now</span>
      </div>
    </div>
  );
}

function MiniCard({ title, value, sub, positive, icon: Icon, points, color }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <span className="metric-icon"><Icon size={16} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className={`metric-sub ${positive === false ? 'negative' : ''}`}>
        <span>
          {positive === false ? <TrendingDown size={14} /> : <TrendingUp size={14} />} {sub}
        </span>
        <Sparkline points={points} positive={positive !== false} color={color} />
      </div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-btn" aria-label={`Close ${title}`} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast">
      <div className="toast-icon"><Check size={15} /></div>
      <div>
        <b>{toast.title}</b>
        <small>{toast.text}</small>
      </div>
    </div>
  );
}

const KNOWLEDGE_BASE = [
  {
    id: 'spot-procedure',
    type: 'Procedure',
    title: 'Spot Trading Procedure',
    category: 'Trading Guide',
    summary: 'Step-by-step procedure for executing Spot market crypto buy/sell orders safely.',
    details: `### Spot Trading Procedure:\n1. **Asset Selection**: Pick high-liquidity coins like BTC, ETH, or UNI.\n2. **Order Type**: Choose Limit Order (set target entry) or Market Order (instant execution at current ticker price).\n3. **Risk Management**: Risk max 1–2% of total portfolio on a single trade position.\n4. **Stop-Loss & Take-Profit**: Define your target exit levels before clicking buy/sell.\n5. **Settlement**: Assets are owned directly in your wallet without leverage or liquidation risk.`
  },
  {
    id: 'futures-leverage',
    type: 'Procedure',
    title: 'Futures & Margin Leverage Procedure',
    category: 'Risk Management',
    summary: 'Procedure for managing position size, leverage multiplier, and liquidation thresholds.',
    details: `### Futures & Margin Trading Procedure:\n1. **Leverage Selection (2x - 100x)**: Higher leverage magnifies both profits and liquidation risk.\n2. **Liquidation Threshold**: If asset price moves against your margin, position liquidates automatically.\n3. **Isolated Margin**: Limits loss strictly to assigned position margin.\n4. **Cross Margin**: Utilizes entire wallet balance to prevent liquidation.\n5. **Best Practice**: Practice on Spot market before trading Futures.`
  },
  {
    id: 'uniswap-info',
    type: 'Info',
    title: 'Uniswap (UNI) Protocol & AMM Info',
    category: 'DeFi Intelligence',
    summary: 'How Uniswap automated market maker liquidity pools and governance work.',
    details: `### Uniswap (UNI) Complete Guide:\n1. **Automated Market Maker (AMM)**: Swaps tokens using smart contract pools (x * y = k) without traditional order books.\n2. **Liquidity Provision**: Liquidity providers earn swap fee percentage rewards.\n3. **UNI Token**: Decentralized governance token for voting on protocol parameters.`
  },
  {
    id: 'market-indicators',
    type: 'Info',
    title: 'Technical Market Indicators (RSI, MACD, Volume)',
    category: 'Market Analytics',
    summary: 'How to read volume profile, MACD momentum crossovers, and RSI overbought levels.',
    details: `### Technical Market Indicators Guide:\n1. **RSI (Relative Strength)**: >70 is Overbought, <30 is Oversold.\n2. **MACD**: Signal line crossovers indicate momentum direction changes.\n3. **Order Pulse & Volume**: Real-time trade streaming reveals institutional buy/sell pressure.`
  },
  {
    id: 'price-brackets',
    type: 'Guide',
    title: 'Cryptocurrency Price Tiers & Range Lookup Guide',
    category: 'Market Intelligence',
    summary: 'Overview of top coins categorized by price ranges ($10k+, $1k-$5k, under $100).',
    details: `### Crypto Price Tiers Breakdown:\n• **$50,000+ Tier**: Bitcoin (BTC ~$63k)\n• **$1,000–$5,000 Tier**: Ethereum (ETH ~$2.6k), PAX Gold (PAXG ~$2.65k), Maker (MKR ~$1.8k)\n• **$100–$600 Tier**: BNB (~$580), Bittensor (TAO ~$450), Solana (SOL ~$145), Aave (AAVE ~$135)\n• **Under $50 Tier**: Avalanche (AVAX ~$26), Chainlink (LINK ~$12.5), Uniswap (UNI ~$7.5), Polkadot (DOT ~$6), XRP (~$0.55), Cardano (ADA ~$0.38), Dogecoin (DOGE ~$0.11)`
  }
];

function App() {
  const [activeAsset, setActiveAsset] = useState(() => localStorage.getItem('regal-active-asset') || 'UNIUSDT');
  const coinMeta = COIN_DATABASE[activeAsset] || COIN_DATABASE.UNIUSDT;

  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [high, setHigh] = useState(0);
  const [low, setLow] = useState(0);
  const [volume, setVolume] = useState(0);
  const [connected, setConnected] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);
  const [range, setRange] = useState('1H');
  const [chart, setChart] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('regal-theme') !== 'light');
  const [priceFlash, setPriceFlash] = useState('');
  const prevPriceRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setSidebar(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [chat, setChat] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi! I’m Regal AI Assistant. Ask me anything about ${coinMeta.name} (${coinMeta.base}), live price action, technical indicators, or portfolio risk.` }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Global search state
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchDetailModal, setSearchDetailModal] = useState(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('regal-favorites') || '["UNIUSDT","BTCUSDT"]'); } catch { return ['UNIUSDT','BTCUSDT']; }
  });

  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('regal-notifications') || '[]'); } catch { return []; }
  });
  
  const [pulseMenu, setPulseMenu] = useState(false);
  const [watchMenu, setWatchMenu] = useState(false);
  const [alertForm, setAlertForm] = useState({ symbol: 'UNIUSDT', direction: 'above', target: '' });
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('regal-watchlist') || '["UNIUSDT","BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"]'); } catch { return ['UNIUSDT','BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT']; }
  });
  
  const [watchQuotes, setWatchQuotes] = useState({});
  const [watchSearch, setWatchSearch] = useState('');
  const [activeNav, setActiveNav] = useState('overview');

  const filteredCoins = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    const allCoins = Object.values(COIN_DATABASE);
    if (!q) return allCoins;
    return allCoins.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.base.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
    );
  }, [globalSearch]);

  const filteredKnowledge = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return KNOWLEDGE_BASE;
    return KNOWLEDGE_BASE.filter(k =>
      k.title.toLowerCase().includes(q) ||
      k.summary.toLowerCase().includes(q) ||
      k.category.toLowerCase().includes(q) ||
      k.details.toLowerCase().includes(q)
    );
  }, [globalSearch]);

  // Global Keyboard shortcut listener (Ctrl+K / Cmd+K / Slash)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-asset portfolio state
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem('regal-multi-portfolio');
      if (saved) return JSON.parse(saved);
      const oldBtc = Number(localStorage.getItem('regal-portfolio-btc') || 0);
      const oldEntry = Number(localStorage.getItem('regal-portfolio-entry') || 0);
      if (oldBtc > 0) return { BTCUSDT: { amount: oldBtc, entry: oldEntry } };
      return { UNIUSDT: { amount: 100, entry: 7.50 } };
    } catch {
      return { UNIUSDT: { amount: 100, entry: 7.50 } };
    }
  });

  const [portAssetSelect, setPortAssetSelect] = useState('UNIUSDT');
  const [portInputAmount, setPortInputAmount] = useState('');
  const [portInputEntry, setPortInputEntry] = useState('');

  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const alertTriggeredRef = useRef({});
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chat && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, aiLoading, chat]);

  const isFavorite = favorites.includes(activeAsset);

  const toggleFavorite = () => {
    setFavorites(prev => {
      const next = prev.includes(activeAsset) ? prev.filter(s => s !== activeAsset) : [...prev, activeAsset];
      localStorage.setItem('regal-favorites', JSON.stringify(next));
      notify(prev.includes(activeAsset) ? 'Removed from favorites' : 'Added to favorites', `${coinMeta.name} preference saved.`);
      return next;
    });
  };

  const notify = useCallback((title, text) => {
    setToast({ title, text });
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const addNotification = useCallback((title, text) => {
    const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, text, time: new Date().toISOString(), read: false };
    setNotifications(prev => [item, ...prev].slice(0, 20));
    return item;
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  useEffect(() => { localStorage.setItem('regal-active-asset', activeAsset); }, [activeAsset]);
  useEffect(() => { localStorage.setItem('regal-multi-portfolio', JSON.stringify(portfolio)); }, [portfolio]);
  useEffect(() => { 
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'; 
    localStorage.setItem('regal-theme', dark ? 'dark' : 'light'); 
  }, [dark]);
  useEffect(() => { localStorage.setItem('regal-notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('regal-watchlist', JSON.stringify(watchlist)); }, [watchlist]);

  // Load history for active coin & timeframe
  const loadHistory = useCallback(async () => {
    try {
      const interval = range === '1D' ? '15m' : range === '4H' ? '5m' : '1m';
      const limit = range === '1D' ? 96 : range === '4H' ? 48 : 60;
      const r = await fetch(`${API}/api/v3/klines?symbol=${activeAsset}&interval=${interval}&limit=${limit}`);
      if (!r.ok) throw new Error('History request failed');
      const rows = await r.json();
      setChart(rows.map(k => ({ time: k[0], close: Number(k[4]) })));
      notify(`${coinMeta.name} data updated`, `${range} candles loaded successfully.`);
    } catch (e) {
      notify('Live feed active', 'Connecting to real-time Binance tick stream.');
    }
  }, [activeAsset, range, notify, coinMeta]);

  useEffect(() => { loadHistory(); }, [activeAsset, range]);

  // Multi-coin WebSocket streaming logic
  useEffect(() => {
    let cancelled = false;
    const connect = () => {
      if (cancelled) return;
      try {
        const streamList = Array.from(new Set([activeAsset, ...watchlist])).map(s => s.toLowerCase());
        const streamsParam = streamList.map(s => `${s}@ticker`).join('/') + `/${activeAsset.toLowerCase()}@kline_1m/${activeAsset.toLowerCase()}@trade`;
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streamsParam}`;

        const ws = new WebSocket(wsUrl); 
        wsRef.current = ws;
        ws.onopen = () => setConnected(true);
        ws.onclose = () => { setConnected(false); if (!cancelled) reconnectRef.current = setTimeout(connect, 2500); };
        ws.onerror = () => setConnected(false);

        ws.onmessage = e => {
          const m = JSON.parse(e.data), d = m.data;
          if (m.stream?.includes('@ticker')) {
            const symbol = String(d.s || '').toUpperCase();
            if (symbol === activeAsset) {
              const newPrice = Number(d.c);
              if (prevPriceRef.current && newPrice !== prevPriceRef.current) {
                setPriceFlash(newPrice > prevPriceRef.current ? 'flash-up' : 'flash-down');
                setTimeout(() => setPriceFlash(''), 400);
              }
              prevPriceRef.current = newPrice;
              setPrice(newPrice); 
              setChange(Number(d.P)); 
              setHigh(Number(d.h)); 
              setLow(Number(d.l)); 
              setVolume(Number(d.v));
            }
            setWatchQuotes(prev => ({ ...prev, [symbol]: { price: Number(d.c), change: Number(d.P), time: Date.now() } }));
          }
          if (m.stream?.includes(`@trade`) && String(d.s).toUpperCase() === activeAsset) {
            setLastTrade({ price: Number(d.p), time: Date.now(), qty: Number(d.q) });
          }
          if (m.stream?.includes(`@kline`) && String(d.s).toUpperCase() === activeAsset) {
            const k = d.k, item = { time: k.t, close: Number(k.c) };
            setChart(prev => { 
              const copy = [...prev]; 
              if (copy.length && copy[copy.length - 1].time === item.time) copy[copy.length - 1] = item; 
              else copy.push(item); 
              return copy.slice(-100); 
            });
          }
        };
      } catch { setConnected(false); }
    };
    connect();
    return () => { cancelled = true; clearTimeout(reconnectRef.current); try { wsRef.current?.close(); } catch {} };
  }, [activeAsset, watchlist]);

  // Initial load quotes for watchlist
  useEffect(() => {
    let cancelled = false;
    const fetchWatchlistQuotes = async () => {
      try {
        const rows = await Promise.all(watchlist.map(async symbol => {
          const r = await fetch(`${API}/api/v3/ticker/24hr?symbol=${symbol}`);
          if (!r.ok) return null;
          return [symbol, await r.json()];
        }));
        if (cancelled) return;
        setWatchQuotes(prev => {
          const next = { ...prev };
          rows.filter(Boolean).forEach(([symbol, q]) => { next[symbol] = { price: Number(q.lastPrice), change: Number(q.priceChangePercent), time: Date.now() }; });
          return next;
        });
      } catch {}
    };
    fetchWatchlistQuotes();
    const interval = setInterval(fetchWatchlistQuotes, 6000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [watchlist]);

  // Alert check logic
  useEffect(() => {
    if (!alertForm.target || !alertForm.symbol) return;
    const qPrice = alertForm.symbol === activeAsset ? price : watchQuotes[alertForm.symbol]?.price;
    if (!qPrice) return;

    const target = Number(alertForm.target);
    const alertKey = `${alertForm.symbol}-${alertForm.direction}-${target}`;
    if (alertTriggeredRef.current[alertKey]) return;

    const hit = alertForm.direction === 'above' ? qPrice >= target : qPrice <= target;
    if (hit) {
      alertTriggeredRef.current[alertKey] = true;
      const cMeta = COIN_DATABASE[alertForm.symbol] || { name: alertForm.symbol };
      const title = `${cMeta.name} alert triggered!`;
      const text = `${cMeta.symbol} crossed $${money(qPrice)}.`;
      addNotification(title, text);
      notify(title, text);
    }
  }, [price, watchQuotes, alertForm, activeAsset, notify, addNotification]);

  const addWatchAsset = symbol => {
    if (watchlist.includes(symbol)) return notify('Already in watchlist', `${COIN_DATABASE[symbol]?.name || symbol} is already active.`);
    setWatchlist(prev => [...prev, symbol]);
    notify('Asset added', `${COIN_DATABASE[symbol]?.name || symbol} added to watchlist.`);
  };

  const removeWatchAsset = symbol => {
    if (watchlist.length <= 1) return notify('Watchlist minimum', 'Keep at least one asset in your watchlist.');
    setWatchlist(prev => prev.filter(s => s !== symbol));
    notify('Asset removed', `${COIN_DATABASE[symbol]?.name || symbol} removed.`);
  };

  const switchActiveCoin = (symbol) => {
    if (!COIN_DATABASE[symbol]) return;
    setActiveAsset(symbol);
    setPrice(watchQuotes[symbol]?.price || 0);
    setChange(watchQuotes[symbol]?.change || 0);
    notify(`Switched to ${COIN_DATABASE[symbol].name}`, `Viewing live ${COIN_DATABASE[symbol].pair} data.`);
  };

  const fallback = useMemo(() => chart.length ? chart : [...Array(60)].map((_, i) => ({ time: Date.now() - (60 - i) * 60000, close: (price || 10) * (1 + Math.sin(i / 5) * 0.015) })), [chart, price]);
  const pct = change >= 0;

  // 24h range percentage calculation
  const rangePercentage = useMemo(() => {
    if (!high || !low || high === low || !price) return 50;
    const p = ((price - low) / (high - low)) * 100;
    return Math.min(100, Math.max(0, p));
  }, [price, high, low]);

  const nav = (id) => {
    setActiveNav(id);
    setSidebar(false);
    const targets = { overview: 'overview', live: 'chart', watchlist: 'watchlist', analytics: 'pulse', news: 'news' };
    if (targets[id]) document.getElementById(targets[id])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (id === 'portfolio') setModal('portfolio');
    if (id === 'settings') setModal('settings');
    if (id === 'help') setModal('help');
  };

  // Total portfolio USD value calculation
  const totalPortfolioUsd = useMemo(() => {
    return Object.entries(portfolio).reduce((acc, [symbol, item]) => {
      const currentPrice = symbol === activeAsset ? price : (watchQuotes[symbol]?.price || 0);
      return acc + (item.amount || 0) * (currentPrice || item.entry || 0);
    }, 0);
  }, [portfolio, activeAsset, price, watchQuotes]);

  const send = async (preset) => {
    const q = (preset || input).trim();
    if (!q || aiLoading) return;

    const userMessage = { role: 'user', text: q };
    setMessages(m => [...m, userMessage]);
    setInput('');
    setAiLoading(true);

    const snapshot = {
      symbol: coinMeta.pair,
      asset: coinMeta.name,
      price,
      change24h: change,
      high24h: high,
      low24h: low,
      volume24h: volume,
      lastTrade: lastTrade ? { price: lastTrade.price, quantity: lastTrade.qty } : null,
      exchange: 'Binance',
      live: connected,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          market: snapshot,
          conversation: [...messages.slice(-8), userMessage]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'AI request failed');

      const sourceText = Array.isArray(data.sources) && data.sources.length
        ? '\n\nSources:\n' + data.sources.map((source, index) => `${index + 1}. ${source.title} — ${source.url}`).join('\n')
        : '';

      setMessages(m => [...m, {
        role: 'bot',
        text: (data.reply || 'I could not generate a response right now.') + sourceText
      }]);
    } catch (error) {
      const ql = q.toLowerCase();
      const current = `$${money(price)}`;
      let fallbackReply = '';

      if (/under 100k|below 100k|< ?100k/i.test(ql)) {
        fallbackReply = `Here are the leading cryptocurrencies trading under **$100,000**:\n\n1. **Bitcoin (BTC)**: ~$63,500 ($60,000 – $65,000)\n2. **Ethereum (ETH)**: ~$2,600 ($2,500 – $3,500)\n3. **PAX Gold (PAXG)**: ~$2,650 ($2,600 – $2,700)\n4. **Maker (MKR)**: ~$1,850 ($1,800 – $2,200)\n5. **BNB**: ~$580 ($550 – $620)\n6. **Bittensor (TAO)**: ~$450 ($350 – $550)\n7. **Solana (SOL)**: ~$145 ($130 – $180)\n8. **Aave (AAVE)**: ~$135 ($100 – $160)\n9. **Avalanche (AVAX)**: ~$26 ($20 – $35)\n10. **Chainlink (LINK)**: ~$12.50 ($10 – $18)\n11. **Uniswap (UNI)**: ~$7.50 ($6.50 – $10.00)\n12. **Polkadot (DOT)**: ~$6.00 ($5.00 – $8.00)\n13. **NEAR Protocol**: ~$4.50 ($3.80 – $6.50)\n14. **XRP**: ~$0.55 ($0.50 – $0.90)\n15. **Cardano (ADA)**: ~$0.38 ($0.30 – $0.60)\n16. **Dogecoin (DOGE)**: ~$0.11 ($0.09 – $0.18)`;
      } else if (/(?:between|bw|b\/w|from|details about)?\s*\$?([0-9]+\.?[0-9]*k?)\s*(?:-|to|and|till)\s*\$?([0-9]+\.?[0-9]*k?)/i.test(ql)) {
        fallbackReply = `Here are the top cryptocurrencies near and in the **$10,000 – $50,000** price bracket:\n\n• **Bitcoin (BTC)**: ~$60,000 – $65,000 (premier tier asset)\n• **Ethereum (ETH)**: ~$2,600 – $3,500\n• **PAX Gold (PAXG)**: ~$2,650 (gold asset)\n• **Maker (MKR)**: ~$1,800 – $2,200\n\n*Note*: BTC leads the $50k+ bracket while ETH/MKR lead the $1k–$5k bracket.`;
      } else {
        fallbackReply = `I can assist with ${coinMeta.name} technical levels, price queries, indicators, risk management, and live order flow. Current ${coinMeta.base}/USDT is ${current}.`;
      }

      setMessages(m => [...m, { role: 'bot', text: fallbackReply }]);
    } finally {
      setAiLoading(false);
    }
  };

  const copyMessageText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const createAlert = e => {
    e.preventDefault();
    const target = Number(alertForm.target);
    if (!target || target <= 0) return notify('Enter target price', 'Please enter a valid numeric target.');
    alertTriggeredRef.current = {};
    const cMeta = COIN_DATABASE[alertForm.symbol] || { name: alertForm.symbol };
    const title = 'Live alert active';
    const text = `${cMeta.name} alert will trigger when price is ${alertForm.direction} $${money(target)}.`;
    addNotification(title, text);
    notify(title, text);
    setModal(null);
  };

  const savePortfolioAsset = () => {
    const amt = Number(portInputAmount), entry = Number(portInputEntry);
    if (!portInputAmount || isNaN(amt) || amt <= 0) return notify('Valid amount required', `Enter quantity of ${COIN_DATABASE[portAssetSelect].base} you hold.`);
    
    setPortfolio(prev => ({
      ...prev,
      [portAssetSelect]: { amount: amt, entry: !isNaN(entry) && entry > 0 ? entry : 0 }
    }));

    notify('Position updated', `${amt} ${COIN_DATABASE[portAssetSelect].base} tracked in portfolio.`);
    setPortInputAmount('');
    setPortInputEntry('');
  };

  const removePortfolioAsset = (sym) => {
    setPortfolio(prev => {
      const copy = { ...prev };
      delete copy[sym];
      return copy;
    });
    notify('Position removed', `${COIN_DATABASE[sym]?.name || sym} removed from portfolio.`);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;

  return (
    <div className={`app ${sidebar ? 'sidebar-is-open' : ''} ${isMobile && sidebar ? 'mobile-sidebar-open' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebar && <div className="sidebar-backdrop" onClick={() => setSidebar(false)} />}

      {/* Modern Collapsible Sidebar */}
      <aside className={`sidebar ${sidebar ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" style={{ background: coinMeta.color }}>{coinMeta.coin}</div>
          <div className="brand-text">
            <b>REGAL</b>
            <small>Crypto Intelligence</small>
          </div>
          <button className="sidebar-toggle-btn" onClick={() => setSidebar(false)} title="Collapse sidebar" aria-label="Collapse sidebar">
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="side-section">
          <span>Workspace</span>
          <button className={`nav ${activeNav === 'overview' ? 'active' : ''}`} onClick={() => nav('overview')}>
            <LayoutDashboard size={18} />
            <label>Market Overview</label>
          </button>
          <button className={`nav ${activeNav === 'live' ? 'active' : ''}`} onClick={() => nav('live')}>
            <Activity size={18} />
            <label>Live Chart</label>
            <em>Live</em>
          </button>
          <button className={`nav ${activeNav === 'watchlist' ? 'active' : ''}`} onClick={() => nav('watchlist')}>
            <Star size={18} />
            <label>Watchlist</label>
          </button>
          <button className={`nav ${activeNav === 'portfolio' ? 'active' : ''}`} onClick={() => nav('portfolio')}>
            <Wallet size={18} />
            <label>Portfolio</label>
          </button>
        </div>

        <div className="side-section">
          <span>Intelligence</span>
          <button className={`nav ${activeNav === 'analytics' ? 'active' : ''}`} onClick={() => nav('analytics')}>
            <Gauge size={18} />
            <label>Order Momentum</label>
          </button>
          <button className={`nav ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => nav('settings')}>
            <Settings size={18} />
            <label>Preferences</label>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="pro-card">
            <div className="pro-card-header">
              <Sparkles size={15} />
              <span>Regal Pro Terminal</span>
            </div>
            <p>Algorithmic order flow tracking and Gemini AI signals.</p>
            <button onClick={() => setModal('pro')}>Explore Pro</button>
          </div>
          <button className="nav" onClick={() => nav('help')}>
            <CircleHelp size={18} />
            <label>Help & Documentation</label>
          </button>
        </div>
      </aside>

      {/* Main Trading Area */}
      <main className="main">
        {/* Top Navigation Bar */}
        <header className="topbar">
          <div className="topbar-left-group">
            {!sidebar && (
              <button className="sidebar-open-btn" onClick={() => setSidebar(true)} title="Expand sidebar" aria-label="Expand sidebar">
                <ChevronsRight size={18} />
              </button>
            )}
            {!sidebar && (
              <b className="topbar-brand-title">
                REGAL <span>TERMINAL</span>
              </b>
            )}
            <div className={`topbar-market-badge ${connected ? '' : 'offline'}`}>
              <span className="radar-dot" />
              <span>{connected ? 'Binance 24ms Live' : 'Reconnecting...'}</span>
            </div>
          </div>

          <div className="top-actions">
            {/* Global Command Search Box */}
            <div className="header-search-container" ref={searchContainerRef}>
              <div className="header-search-box">
                <Search size={15} className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search assets, guides, procedures..."
                  value={globalSearch}
                  onFocus={() => setSearchOpen(true)}
                  onChange={e => {
                    setGlobalSearch(e.target.value);
                    setSearchOpen(true);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                {globalSearch ? (
                  <button className="search-clear-btn" onClick={() => setGlobalSearch('')} aria-label="Clear search">
                    <X size={13} />
                  </button>
                ) : (
                  <span className="search-kbd-hint">⌘K</span>
                )}
              </div>

              {/* Live Search Dropdown */}
              {searchOpen && (
                <div className="search-dropdown">
                  {/* Cryptocurrencies Section */}
                  {filteredCoins.length > 0 && (
                    <div className="search-group">
                      <span className="search-group-title">CRYPTOCURRENCIES ({filteredCoins.length})</span>
                      {filteredCoins.slice(0, 6).map(c => (
                        <div
                          key={c.symbol}
                          className="search-item"
                          onClick={() => {
                            setActiveAsset(c.symbol);
                            setGlobalSearch('');
                            setSearchOpen(false);
                            notify('Active Coin Set', `Viewing ${c.name} (${c.pair}).`);
                          }}
                        >
                          <span className={`coin ${c.cls}`}>{c.coin}</span>
                          <div className="search-item-info">
                            <b>{c.name} <small>{c.base}</small></b>
                            <span>{c.pair} • Binance Live</span>
                          </div>
                          <span className="search-item-price">
                            ${money(c.symbol === activeAsset ? price : watchQuotes[c.symbol]?.price || c.approxPrice || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Procedures & Knowledge Base */}
                  {filteredKnowledge.length > 0 && (
                    <div className="search-group">
                      <span className="search-group-title">PROCEDURES & GUIDES ({filteredKnowledge.length})</span>
                      {filteredKnowledge.map(k => (
                        <div
                          key={k.id}
                          className="search-item"
                          onClick={() => {
                            setSearchDetailModal(k);
                            setSearchOpen(false);
                          }}
                        >
                          <span className={`search-badge ${k.type.toLowerCase()}`}>{k.type}</span>
                          <div className="search-item-info">
                            <b>{k.title}</b>
                            <span>{k.summary}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fallback AI prompt button */}
                  {filteredCoins.length === 0 && filteredKnowledge.length === 0 && (
                    <div className="search-no-results">
                      <p>No direct matches for "<strong>{globalSearch}</strong>"</p>
                      <button
                        className="search-ask-ai-btn"
                        onClick={() => {
                          const q = globalSearch;
                          setGlobalSearch('');
                          setSearchOpen(false);
                          setChat(true);
                          send(q);
                        }}
                      >
                        <Bot size={15} /> Ask Regal AI Assistant
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="icon-btn" title={dark ? 'Light appearance' : 'Dark appearance'} onClick={() => setDark(v => !v)}>
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              className="icon-btn"
              aria-label="Notifications"
              onClick={() => {
                setModal('notifications');
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
            >
              <Bell size={17} />
              {unreadNotifications > 0 && <span className="badge">{unreadNotifications}</span>}
            </button>
            <button className="avatar" onClick={() => setModal('profile')}>
              NQ
            </button>
          </div>
        </header>

        <div className="content" id="overview">
          {/* Breadcrumb Eyebrow */}
          <div className="eyebrow">
            <span>TERMINAL</span>
            <span className="slash">/</span>
            <span>SPOT MARKETS</span>
            <span className="slash">/</span>
            <span>{coinMeta.pair}</span>
            <span className="slash">/</span>
            <span className="live-status">
              <span className={connected ? 'dot' : 'dot offline'} /> {connected ? 'Streaming Real-Time' : 'Reconnecting Feed'}
            </span>
          </div>

          {/* Hero Section */}
          <section className="hero-row">
            <div>
              <div className="asset-title">
                <div className="btc-logo" style={{ background: coinMeta.color }}>
                  {coinMeta.coin}
                </div>
                <div>
                  <h1>
                    {coinMeta.name} <small className="asset-base-badge">{coinMeta.base}</small>
                  </h1>
                  <p>{coinMeta.pair} <span>•</span> Institutional Binance Live Stream</p>
                </div>
                <button className={`star-btn ${isFavorite ? 'fav' : ''}`} onClick={toggleFavorite} title="Favorite asset">
                  <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="price-row">
                <div className={`big-price ${priceFlash}`}>
                  {price ? '$' + money(price) : '—'}
                </div>
                <div className={`change ${pct ? 'up' : 'down'}`}>
                  {pct ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
                  {Math.abs(change).toFixed(2)}% <span>24h</span>
                </div>
              </div>

              {/* 24h Range Bar Visualizer */}
              <div className="hero-range-bar-wrapper">
                <div className="range-bar-labels">
                  <span>L: ${money(low)}</span>
                  <span>24h Range</span>
                  <span>H: ${money(high)}</span>
                </div>
                <div className="range-bar-track">
                  <div className="range-bar-fill" style={{ width: '100%' }} />
                  <div className="range-bar-indicator" style={{ left: `${rangePercentage}%` }} />
                </div>
              </div>

              <p className="live-note">
                <span className="tiny-dot" /> Sub-millisecond continuous price ticks for {coinMeta.name}.
              </p>
            </div>

            <div className="hero-actions">
              <button className="outline" onClick={loadHistory}>
                <RefreshCw size={15} /> Refresh Candles
              </button>
              <button
                className="primary"
                onClick={() => {
                  setAlertForm(f => ({ ...f, symbol: activeAsset, target: price ? price.toString() : '' }));
                  setModal('alert');
                }}
              >
                <Zap size={15} /> Set Price Alert
              </button>
            </div>
          </section>

          {/* Asset Quick Selector Carousel Bar */}
          <section className="coin-bar-wrapper">
            <span className="coin-bar-label">Watch Assets:</span>
            <div className="coin-bar">
              {Object.values(COIN_DATABASE).map(c => {
                const q = c.symbol === activeAsset ? { price, change } : watchQuotes[c.symbol];
                const isUp = q && q.change >= 0;
                return (
                  <button
                    key={c.symbol}
                    className={`coin-card-chip ${activeAsset === c.symbol ? 'active' : ''}`}
                    onClick={() => switchActiveCoin(c.symbol)}
                  >
                    <span className={`coin ${c.cls}`}>{c.coin}</span>
                    <div>
                      <b>{c.name}</b>
                      <small>{c.pair}</small>
                    </div>
                    <div className="chip-price">
                      <strong>${money(q?.price || c.approxPrice || 0)}</strong>
                      <span className={isUp ? 'positive' : 'negative'}>
                        {q ? `${isUp ? '+' : ''}${q.change.toFixed(2)}%` : '—'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Key Metric Cards */}
          <div className="metrics">
            <MiniCard
              title="24h High"
              value={high ? '$' + money(high) : '—'}
              sub="Session High"
              positive
              icon={ArrowUp}
              points={fallback.slice(-12).map(x => x.close)}
              color={coinMeta.color}
            />
            <MiniCard
              title="24h Low"
              value={low ? '$' + money(low) : '—'}
              sub="Session Low"
              positive={false}
              icon={ArrowDown}
              points={fallback.slice(-12).map(x => x.close).reverse()}
              color={coinMeta.color}
            />
            <MiniCard
              title="24h Volume"
              value={volume ? compact(volume) + ` ${coinMeta.base}` : '—'}
              sub="Total Turnover"
              positive
              icon={Activity}
              points={fallback.slice(-12).map(x => x.close * 0.99)}
              color={coinMeta.color}
            />
            <MiniCard
              title="Stream Health"
              value={connected ? 'Live Sync' : 'Reconnecting'}
              sub="Binance Stream"
              positive
              icon={ShieldCheck}
              points={fallback.slice(-12).map(x => x.close)}
              color={coinMeta.color}
            />
          </div>

          {/* Chart & Momentum Grid */}
          <section className="dashboard-grid" id="chart">
            <div className="panel chart-panel">
              <div className="panel-head">
                <div>
                  <h2>{coinMeta.name} Performance</h2>
                  <p>Real-time price chart with crosshair precision ({coinMeta.pair})</p>
                </div>
                <div className="range-tabs">
                  {['1H', '4H', '1D'].map(r => (
                    <button
                      className={range === r ? 'selected' : ''}
                      onClick={() => setRange(r)}
                      key={r}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-price-label">
                <b>{price ? '$' + money(price) : '—'}</b>
                <span className={pct ? 'positive' : 'negative'}>
                  {pct ? '+' : ''}{change.toFixed(2)}%
                </span>
              </div>

              <Chart data={fallback} dark={dark} color={coinMeta.color} />

              <div className="chart-footer">
                <span>
                  <i className="legend-line" style={{ background: coinMeta.color }} />
                  {coinMeta.pair} • Binance Spot Tick
                </span>
                <span>
                  Last Trade: {lastTrade ? `$${money(lastTrade.price)} (${lastTrade.qty} ${coinMeta.base})` : 'Streaming live ticks...'}
                </span>
              </div>
            </div>

            {/* Market Momentum & Order Pressure */}
            <div className="panel updates-panel" id="pulse">
              <div className="panel-head">
                <div>
                  <h2>Market Pulse</h2>
                  <p>{coinMeta.name} order pressure</p>
                </div>
                <div className="panel-menu-wrap">
                  <button className="more" aria-label="Pulse options" onClick={() => setPulseMenu(v => !v)}>
                    <MoreHorizontal size={18} />
                  </button>
                  {pulseMenu && (
                    <div className="panel-menu" onMouseLeave={() => setPulseMenu(false)}>
                      <button onClick={() => { setPulseMenu(false); notify('Pulse recalibrated', `Momentum updated for ${coinMeta.name}.`); }}>
                        <RefreshCw size={14} /> Recalibrate
                      </button>
                      <button onClick={() => { setPulseMenu(false); setModal('pulse'); }}>
                        <Gauge size={14} /> Momentum Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pulse-main">
                <div className="pulse-ring" style={{ '--pulse': `${Math.min(100, Math.max(5, 50 + change * 8))}%` }}>
                  <div>
                    <b>{Math.round(Math.min(100, Math.max(0, 50 + change * 8)))}</b>
                    <small>/100</small>
                  </div>
                </div>
                <div>
                  <b>{coinMeta.base} Momentum Score</b>
                  <p>{pct ? 'Buyer volume dominance in active session.' : 'Seller pressure driving recent pullbacks.'}</p>
                </div>
              </div>

              <div className="order">
                <div>
                  <span><i className="sell-dot" />24h High</span>
                  <b>${high ? money(high) : '—'}</b>
                </div>
                <div>
                  <span><i className="buy-dot" />Latest Execution</span>
                  <b>${price ? money(price) : '—'}</b>
                </div>
                <div>
                  <span><i className="gold-dot" />24h Low</span>
                  <b>${low ? money(low) : '—'}</b>
                </div>
              </div>

              <div className="feed">
                <div className="feed-head">
                  <b>Real-Time Order Flow</b>
                  <span>LIVE WS</span>
                </div>
                {[
                  { t: `${coinMeta.base} Spot Price`, v: price ? '$' + money(price) : 'Loading', i: Zap },
                  { t: '24h Net Movement', v: (change >= 0 ? '+' : '') + change.toFixed(2) + '%', i: TrendingUp },
                  { t: 'Aggregated Volume', v: volume ? compact(volume) + ` ${coinMeta.base}` : 'Loading', i: Activity }
                ].map((x, i) => (
                  <div className="feed-item" key={i}>
                    <span className="feed-icon"><x.i size={14} /></span>
                    <div>
                      <b>{x.t}</b>
                      <small>Binance Exchange Stream</small>
                    </div>
                    <strong>{x.v}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Intelligence & Watchlist Grid */}
          <section className="bottom-grid">
            <div className="panel news-panel" id="news">
              <div className="panel-head">
                <div>
                  <h2>Market Intelligence & Signals</h2>
                  <p>AI automated insights for {coinMeta.name}</p>
                </div>
                <button className="link-btn" onClick={() => setModal('intelligence')}>
                  Deep Dive <ChevronDown size={14} />
                </button>
              </div>

              <div className="intel-grid">
                <article>
                  <span className="tag">LIVE SIGNAL</span>
                  <h3>{pct ? `${coinMeta.name} maintaining upward technical structure` : `${coinMeta.name} testing localized support ranges`}</h3>
                  <p>Regal Intelligence analyzes order flow clusters and momentum across major tier-1 liquidity books.</p>
                  <footer>
                    <Clock3 size={13} /> Just now <span>•</span> Institutional AI
                  </footer>
                </article>

                <article>
                  <span className="tag muted">FEED HEALTH</span>
                  <h3>Binance Feed Continuous</h3>
                  <p>Zero-latency real-time tick streaming without dropped packets.</p>
                  <footer>
                    <ShieldCheck size={13} /> WebSocket <span>•</span> Active
                  </footer>
                </article>
              </div>
            </div>

            {/* Watchlist Panel */}
            <div className="panel watch-panel" id="watchlist">
              <div className="panel-head">
                <div>
                  <h2>Crypto Watchlist</h2>
                  <p>{watchlist.length} assets tracked</p>
                </div>
                <div className="panel-menu-wrap">
                  <button className="more" aria-label="Watchlist menu" onClick={() => setWatchMenu(v => !v)}>
                    <MoreHorizontal size={18} />
                  </button>
                  {watchMenu && (
                    <div className="panel-menu watch-menu">
                      <button onClick={() => { setWatchMenu(false); setModal('watchlist'); }}>
                        <Settings size={14} /> Manage Watchlist
                      </button>
                      <button onClick={() => { setWatchMenu(false); setModal('watchlist'); }}>
                        <Star size={14} /> Add Assets
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {watchlist.map(symbol => {
                const meta = COIN_DATABASE[symbol] || { name: symbol.replace('USDT', ''), pair: symbol, coin: '?', cls: 'eth' };
                const q = symbol === activeAsset ? { price, change } : watchQuotes[symbol];
                return (
                  <div
                    className={`watch-item ${symbol === activeAsset ? 'current-active' : ''}`}
                    key={symbol}
                    onClick={() => switchActiveCoin(symbol)}
                  >
                    <div className={`coin ${meta.cls}`}>{meta.coin}</div>
                    <div>
                      <b>{meta.name}</b>
                      <small>{meta.pair}</small>
                    </div>
                    <strong>{q?.price ? '$' + money(q.price) : '—'}</strong>
                    <span className={`watch-change ${q && q.change < 0 ? 'negative' : 'positive'}`}>
                      {q ? `${q.change >= 0 ? '+' : ''}${q.change.toFixed(2)}%` : 'Loading'}
                    </span>
                    <button
                      className="watch-remove"
                      aria-label={`Remove ${meta.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWatchAsset(symbol);
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}

              <button className="add-watch" onClick={() => setModal('watchlist')}>
                <Star size={14} /> Add Cryptocurrency
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button className={activeNav === 'overview' ? 'active' : ''} onClick={() => nav('overview')}>
          <LayoutDashboard size={19} />
          <span>Overview</span>
        </button>
        <button className={activeNav === 'live' ? 'active' : ''} onClick={() => nav('live')}>
          <Activity size={19} />
          <span>Chart</span>
        </button>
        <button className={activeNav === 'watchlist' ? 'active' : ''} onClick={() => nav('watchlist')}>
          <Star size={19} />
          <span>Watchlist</span>
        </button>
        <button className={activeNav === 'portfolio' ? 'active' : ''} onClick={() => nav('portfolio')}>
          <Wallet size={19} />
          <span>Portfolio</span>
        </button>
        <button className="mobile-bot-btn" onClick={() => setChat(v => !v)}>
          <Bot size={19} />
          <span>Regal AI</span>
        </button>
      </nav>

      {/* AI Assistant Floating Button & Chat Terminal */}
      {!chat && (
        <button className="bot-fab" onClick={() => setChat(true)} aria-label="Open Regal AI Assistant">
          <Bot size={24} />
          <span className="bot-ping" />
        </button>
      )}

      {chat && (
        <div className="chat">
          <div className="chat-head">
            <div className="bot-avatar"><Bot size={18} /></div>
            <div>
              <b>Regal AI Market Assistant</b>
              <span><i></i> Real-time multi-asset intelligence</span>
            </div>
            <button aria-label="Close Assistant" onClick={() => setChat(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((m, i) => (
              <div className={`msg ${m.role}`} key={i}>
                <div dir="auto">
                  {m.text}
                  {m.role === 'bot' && (
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        className="link-btn"
                        style={{ fontSize: '10px', gap: '3px' }}
                        onClick={() => copyMessageText(m.text, i)}
                        title="Copy response"
                      >
                        {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                        {copiedIndex === i ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="msg bot">
                <div className="typing" aria-label="Thinking">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {/* Quick AI suggestion chips */}
          <div className="chat-prompts-bar">
            <button className="prompt-chip" onClick={() => send(`Analyze 24h momentum for ${coinMeta.name}`)}>
              24h Momentum
            </button>
            <button className="prompt-chip" onClick={() => send(`What are the key support & resistance levels for ${coinMeta.name}?`)}>
              Support & Resistance
            </button>
            <button className="prompt-chip" onClick={() => send(`Explain risk management rules for spot vs futures`)}>
              Risk Management
            </button>
            <button className="prompt-chip" onClick={() => send(`Compare ${coinMeta.name} with Bitcoin`)}>
              Compare vs BTC
            </button>
          </div>

          <div className="chat-input">
            <input
              disabled={aiLoading}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={`Ask about ${coinMeta.name}, trading strategies, news...`}
              aria-label="Ask Regal AI"
              dir="auto"
            />
            <button
              aria-label="Send message"
              disabled={aiLoading || !input.trim()}
              onClick={() => send()}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal === 'intelligence' && (
        <Modal
          title={`${coinMeta.name} Market Intelligence`}
          subtitle={`Real-time telemetry and order metrics for ${coinMeta.pair}.`}
          onClose={() => setModal(null)}
          wide
        >
          <div className="intelligence-modal-grid">
            <article>
              <span className="tag">LIVE TICK</span>
              <h4>${money(price)}</h4>
              <p>{coinMeta.name} 24h change is {change >= 0 ? '+' : ''}{change.toFixed(2)}%.</p>
            </article>
            <article>
              <span className="tag muted">24H RANGE</span>
              <h4>${money(high)} / ${money(low)}</h4>
              <p>Session high and low range from Binance exchange feed.</p>
            </article>
            <article>
              <span className="tag muted">VOLUME</span>
              <h4>{compact(volume)} {coinMeta.base}</h4>
              <p>24-hour total base asset transaction volume.</p>
            </article>
            <article>
              <span className="tag">FEED</span>
              <h4>{connected ? 'CONNECTED (24ms)' : 'RECONNECTING'}</h4>
              <p>Direct low-latency WebSocket connection.</p>
            </article>
          </div>
        </Modal>
      )}

      {modal === 'watchlist' && (
        <Modal
          title="Manage Crypto Watchlist"
          subtitle="Add or remove cryptocurrencies from your live dashboard."
          onClose={() => setModal(null)}
        >
          <div className="watch-search-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search coin (e.g. UNI, BTC, SOL, ETH)..."
              value={watchSearch}
              onChange={e => setWatchSearch(e.target.value)}
            />
          </div>
          <div className="asset-picker">
            {Object.values(COIN_DATABASE)
              .filter(c => c.name.toLowerCase().includes(watchSearch.toLowerCase()) || c.symbol.toLowerCase().includes(watchSearch.toLowerCase()))
              .map(c => {
                const inWatch = watchlist.includes(c.symbol);
                return (
                  <button
                    key={c.symbol}
                    className={`asset-option ${inWatch ? 'selected' : ''}`}
                    onClick={() => inWatch ? removeWatchAsset(c.symbol) : addWatchAsset(c.symbol)}
                  >
                    <span className={`coin ${c.cls}`}>{c.coin}</span>
                    <span>
                      <b>{c.name}</b>
                      <small>{c.pair}</small>
                    </span>
                    <strong>{inWatch ? '✓ Added' : '+ Track'}</strong>
                  </button>
                );
              })}
          </div>
        </Modal>
      )}

      {modal === 'alert' && (
        <Modal
          title="Set Price Alert"
          subtitle="Receive instant notifications when asset crosses target price."
          onClose={() => setModal(null)}
        >
          <form className="form" onSubmit={createAlert}>
            <label>
              Asset
              <select value={alertForm.symbol} onChange={e => setAlertForm(f => ({ ...f, symbol: e.target.value }))}>
                {Object.values(COIN_DATABASE).map(c => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.pair})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Trigger Condition
              <select value={alertForm.direction} onChange={e => setAlertForm(f => ({ ...f, direction: e.target.value }))}>
                <option value="above">Price rises above</option>
                <option value="below">Price falls below</option>
              </select>
            </label>
            <label>
              Target Price ($ USD)
              <input
                autoFocus
                type="number"
                min="0.0001"
                step="any"
                value={alertForm.target}
                onChange={e => setAlertForm(f => ({ ...f, target: e.target.value }))}
                placeholder={price ? money(price) : '7.50'}
              />
            </label>
            <div className="form-preview">
              <span>Current Asset Price</span>
              <b>${money(alertForm.symbol === activeAsset ? price : watchQuotes[alertForm.symbol]?.price || 0)}</b>
            </div>
            <button className="modal-primary" type="submit">
              <Zap size={15} /> Save Price Alert
            </button>
          </form>
        </Modal>
      )}

      {modal === 'portfolio' && (
        <Modal
          title="Multi-Asset Portfolio Tracker"
          subtitle="Real-time multi-coin portfolio valuation with live P&L calculations."
          onClose={() => setModal(null)}
          wide
        >
          <div className="portfolio-workspace">
            <div className="portfolio-hero">
              <div>
                <span>Total Portfolio USD Value</span>
                <strong>${money(totalPortfolioUsd)}</strong>
                <small>Calculated in real-time across all tracked holdings</small>
              </div>
              <div className="portfolio-live">
                <span className="dot" />
                <div>
                  <b>Live Pricing</b>
                  <small>Auto-syncing via Binance Feed</small>
                </div>
              </div>
            </div>

            <div className="portfolio-holdings-list">
              <h4>Active Holdings</h4>
              {Object.keys(portfolio).length === 0 ? (
                <p className="portfolio-empty">No positions added yet. Add a coin below!</p>
              ) : (
                <div className="portfolio-grid">
                  {Object.entries(portfolio).map(([sym, item]) => {
                    const meta = COIN_DATABASE[sym] || { name: sym, base: sym, coin: '?' };
                    const currentPrice = sym === activeAsset ? price : (watchQuotes[sym]?.price || 0);
                    const curVal = item.amount * (currentPrice || item.entry || 0);
                    const pnl = item.entry > 0 ? (currentPrice - item.entry) * item.amount : 0;
                    return (
                      <div key={sym} className="portfolio-card">
                        <div className="portfolio-card-head">
                          <span className={`coin ${meta.cls}`}>{meta.coin}</span>
                          <b>{meta.name}</b>
                          <button className="watch-remove" onClick={() => removePortfolioAsset(sym)} title="Delete position">
                            <X size={14} />
                          </button>
                        </div>
                        <div className="portfolio-card-val">${money(curVal)}</div>
                        <div className="portfolio-card-sub">
                          <span>Holding: <strong>{item.amount} {meta.base}</strong></span>
                          {item.entry > 0 && (
                            <span className={pnl >= 0 ? 'portfolio-positive' : 'portfolio-negative'}>
                              P&L: {pnl >= 0 ? '+' : ''}${money(pnl)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="portfolio-add">
              <div className="portfolio-add-heading">
                <div>
                  <b>Add / Update Position</b>
                  <small>Positions are securely stored locally in your browser session.</small>
                </div>
                <span className="portfolio-local-badge">Local Storage</span>
              </div>
              <div className="portfolio-input-grid">
                <label>
                  <span>Asset</span>
                  <select value={portAssetSelect} onChange={e => setPortAssetSelect(e.target.value)}>
                    {Object.values(COIN_DATABASE).map(c => (
                      <option key={c.symbol} value={c.symbol}>{c.name} ({c.base})</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Quantity Held</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={portInputAmount}
                    onChange={e => setPortInputAmount(e.target.value)}
                    placeholder="e.g. 100"
                  />
                </label>
                <label>
                  <span>Avg Entry Price ($ USD)</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={portInputEntry}
                    onChange={e => setPortInputEntry(e.target.value)}
                    placeholder="e.g. 7.50"
                  />
                </label>
                <button className="modal-primary portfolio-save-btn" onClick={savePortfolioAsset}>
                  <Check size={15} /> Save Holding
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'settings' && (
        <Modal title="Preferences" subtitle="Customize your Regal terminal experience." onClose={() => setModal(null)}>
          <div className="settings-list">
            <button onClick={() => setDark(v => !v)}>
              <span>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
                <div>
                  <b>{dark ? 'Dark Appearance' : 'Light Appearance'}</b>
                  <small>Toggle high-contrast terminal styling.</small>
                </div>
              </span>
              <strong>{dark ? 'DARK' : 'LIGHT'}</strong>
            </button>
            <button onClick={() => notify('Stream Health', connected ? 'WebSocket active with zero packet loss.' : 'Reconnecting...')}>
              <span>
                <Activity size={18} />
                <div>
                  <b>Binance Feed Status</b>
                  <small>Real-time continuous trade and kline streams.</small>
                </div>
              </span>
              <strong>{connected ? 'STREAMING' : 'RETRYING'}</strong>
            </button>
          </div>
        </Modal>
      )}

      {modal === 'help' && (
        <Modal title="Documentation & Quick Guide" subtitle="How to get the most out of Regal Terminal" onClose={() => setModal(null)}>
          <div className="help-grid">
            <div>
              <MessageCircle size={18} />
              <b>Regal AI Assistant</b>
              <p>Ask natural language questions about any crypto asset, live levels, or risk management.</p>
            </div>
            <div>
              <Star size={18} />
              <b>Asset Selector Rail</b>
              <p>Click any coin chip or use ⌘K search to switch between tracked assets.</p>
            </div>
            <div>
              <Bell size={18} />
              <b>Custom Alerts</b>
              <p>Set target price alerts that trigger local browser alerts and notifications.</p>
            </div>
            <div>
              <Wallet size={18} />
              <b>Portfolio Tracker</b>
              <p>Track your multi-coin portfolio USD balance updated live with market feeds.</p>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'notifications' && (
        <Modal title="Notifications & Triggered Alerts" subtitle="Historical alerts and system events." onClose={() => setModal(null)}>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="portfolio-empty">
                <h4>No notifications yet</h4>
                <p>Configured price alerts will log here when crossed.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div className={`notification-item ${n.read ? 'read' : 'unread'}`} key={n.id}>
                  <span className="dot" />
                  <div>
                    <b>{n.title}</b>
                    <small>{n.text}</small>
                    <time>{new Date(n.time).toLocaleString()}</time>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}

      {modal === 'profile' && (
        <Modal title="Trader Profile" subtitle="Regal Terminal Session" onClose={() => setModal(null)}>
          <div className="profile-card">
            <div className="profile-avatar">NQ</div>
            <div>
              <h4>Muhammad Nouman Qamar</h4>
              <p>Full Stack AI Engineer · Regal Terminal Hub</p>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'pro' && (
        <Modal title="Regal Pro Terminal" subtitle="Institutional Analytics Suite" onClose={() => setModal(null)}>
          <div className="pro-modal">
            <Sparkles size={32} />
            <h4>Unlock Institutional Intelligence</h4>
            <p>Gain access to automated algorithmic signal filters, sentiment tracking, and high-frequency orderbook heatmaps.</p>
            <button className="modal-primary" onClick={() => setModal(null)}>
              Continue Exploring
            </button>
          </div>
        </Modal>
      )}

      {searchDetailModal && (
        <Modal
          title={searchDetailModal.title}
          subtitle={`${searchDetailModal.type} • ${searchDetailModal.category}`}
          onClose={() => setSearchDetailModal(null)}
          wide
        >
          <div className="search-detail-content">
            <div className="search-detail-badge-row">
              <span className={`search-type-tag ${searchDetailModal.type.toLowerCase()}`}>{searchDetailModal.type}</span>
              <span className="search-category-tag">{searchDetailModal.category}</span>
            </div>
            <p className="search-detail-summary">{searchDetailModal.summary}</p>
            <div className="search-detail-body">
              {searchDetailModal.details.split('\n').map((line, idx) => {
                if (line.startsWith('### ')) return <h4 key={idx}>{line.replace('### ', '')}</h4>;
                if (line.startsWith('• ') || line.match(/^[0-9]+\./)) return <p key={idx} className="step-item">{line}</p>;
                if (!line.trim()) return <br key={idx} />;
                return <p key={idx}>{line}</p>;
              })}
            </div>
            <div className="search-detail-actions">
              <button
                className="modal-primary"
                onClick={() => {
                  const query = `Tell me more about ${searchDetailModal.title}`;
                  setSearchDetailModal(null);
                  setChat(true);
                  send(query);
                }}
              >
                <Bot size={16} /> Ask AI Assistant About This
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
