import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 5173);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '128kb' }));

function money(value) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function compact(value) {
  return Number(value || 0).toLocaleString('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2
  });
}

const TOP_CRYPTO_DB = [
  { symbol: 'BTC', name: 'Bitcoin', approxPrice: 63500, priceStr: '$60,000 – $65,000', desc: 'The premier cryptocurrency by market capitalization.',
    howItWorks: 'A decentralized, peer-to-peer digital currency secured by Proof-of-Work mining — miners compete to validate transactions and add blocks, with a fixed max supply of 21 million coins.',
    useCase: 'Widely used as a long-term store of value ("digital gold") and as the benchmark asset the rest of the crypto market tends to follow.',
    tip: 'Because BTC moves the whole market, watching its trend first often gives context before trading smaller altcoins.' },
  { symbol: 'ETH', name: 'Ethereum', approxPrice: 2600, priceStr: '$2,500 – $3,500', desc: 'Leading smart contract & decentralized application platform.',
    howItWorks: 'Runs smart contracts — self-executing code — on a Proof-of-Stake blockchain, letting developers build DeFi apps, NFTs, and other on-chain programs.',
    useCase: 'Powers most of the DeFi and NFT ecosystem; ETH is also used to pay "gas fees" for transactions on the network.',
    tip: 'ETH often has higher volatility than BTC — good liquidity, but size positions accordingly.' },
  { symbol: 'PAXG', name: 'PAX Gold', approxPrice: 2650, priceStr: '$2,600 – $2,700', desc: 'Physical gold-backed digital token.',
    howItWorks: 'Each PAXG token represents one fine troy ounce of physical gold held in professional vaults, redeemable and audited regularly.',
    useCase: 'Used by traders wanting gold-like price stability with crypto-style settlement speed.',
    tip: 'Price tracks gold spot price closely, so it moves very differently from BTC/ETH — useful for diversification.' },
  { symbol: 'MKR', name: 'Maker', approxPrice: 1850, priceStr: '$1,800 – $2,200', desc: 'Governance token for the MakerDAO / Sky ecosystem.',
    howItWorks: 'MKR holders vote on risk parameters and collateral types backing the DAI/USDS stablecoin system.',
    useCase: 'Core DeFi governance asset — value is tied to the health and fees of the lending/stablecoin protocol it governs.',
    tip: 'A more advanced/DeFi-native asset; understand the protocol before trading it.' },
  { symbol: 'BNB', name: 'BNB (Binance Coin)', approxPrice: 580, priceStr: '$550 – $620', desc: 'Utility token for BNB Chain and Binance ecosystem.',
    howItWorks: 'Used to pay trading fee discounts on Binance and as gas for the BNB Smart Chain, with periodic supply burns.',
    useCase: 'Popular for lower-fee trading and as the native gas token across BNB Chain DeFi apps.',
    tip: 'Exchange-tied tokens can react to exchange-specific news, not just broad market moves.' },
  { symbol: 'TAO', name: 'Bittensor', approxPrice: 450, priceStr: '$350 – $550', desc: 'Decentralized AI subnet network token.',
    howItWorks: 'Rewards machine-learning contributors across specialized "subnets" that compete to produce the best AI outputs, verified on-chain.',
    useCase: 'A bet on decentralized AI infrastructure — higher risk/reward, smaller and more volatile market than BTC/ETH.',
    tip: 'Newer, thinner-liquidity asset — expect bigger price swings than large caps.' },
  { symbol: 'SOL', name: 'Solana', approxPrice: 145, priceStr: '$130 – $180', desc: 'High-speed, low-cost layer-1 blockchain.',
    howItWorks: 'Combines Proof-of-Stake with "Proof-of-History" timestamps to process thousands of transactions per second at low fees.',
    useCase: 'Popular for trading apps, NFTs, and consumer crypto apps that need speed and cheap fees.',
    tip: 'Historically volatile with periods of network congestion — good for active traders comfortable with swings.' },
  { symbol: 'AAVE', name: 'Aave', approxPrice: 135, priceStr: '$100 – $160', desc: 'Leading decentralized liquidity & lending protocol.',
    howItWorks: 'Lets users lend crypto to earn interest or borrow against collateral, all managed by smart contracts (no bank involved).',
    useCase: 'A core DeFi "money market" — AAVE token holders also get governance rights and fee-sharing.',
    tip: 'Understand liquidation risk before using the lending side of the protocol, not just holding the token.' },
  { symbol: 'AVAX', name: 'Avalanche', approxPrice: 26, priceStr: '$20 – $35', desc: 'Scalable smart contract platform.',
    howItWorks: 'Uses multiple interoperable blockchains ("subnets") under one network for fast finality and custom app-specific chains.',
    useCase: 'Aimed at enterprises and dApps needing custom, high-throughput chains.',
    tip: 'Mid-cap altcoin — more volatile than BTC/ETH, less than smaller-cap tokens.' },
  { symbol: 'LINK', name: 'Chainlink', approxPrice: 12.5, priceStr: '$10 – $18', desc: 'Industry-standard decentralized oracle network.',
    howItWorks: 'Feeds real-world data (like price feeds) onto blockchains through a decentralized network of node operators, since smart contracts can\'t access outside data on their own.',
    useCase: 'Nearly all major DeFi protocols rely on Chainlink price feeds — it\'s critical infrastructure rather than a consumer app.',
    tip: 'Value is tied to overall DeFi/on-chain activity growing, since more dApps = more oracle demand.' },
  { symbol: 'UNI', name: 'Uniswap', approxPrice: 7.5, priceStr: '$6.50 – $10.00', desc: 'Largest decentralized automated market maker (DEX).',
    howItWorks: 'Uses liquidity pools and a constant-product formula (x·y=k) instead of an order book — anyone can supply tokens to a pool and earn a cut of swap fees.',
    useCase: 'The go-to decentralized exchange for swapping ERC-20 tokens without a centralized intermediary; UNI is its governance token.',
    tip: 'If you provide liquidity yourself, learn about "impermanent loss" before depositing — holding the token and providing liquidity are different things.' },
  { symbol: 'DOT', name: 'Polkadot', approxPrice: 6.0, priceStr: '$5.00 – $8.00', desc: 'Multi-chain interoperability protocol.',
    howItWorks: 'Connects independent blockchains ("parachains") to a shared relay chain so they can communicate and share security.',
    useCase: 'Aimed at projects that want their own custom blockchain while still tapping into shared network security.',
    tip: 'A more infrastructure-focused, longer-horizon type of asset than consumer-facing tokens.' },
  { symbol: 'NEAR', name: 'NEAR Protocol', approxPrice: 4.5, priceStr: '$3.80 – $6.50', desc: 'Developer-friendly sharded blockchain.',
    howItWorks: 'Uses "Nightshade" sharding to split transaction processing across the network, aiming for scalability with simpler developer tooling.',
    useCase: 'Popular for building consumer apps and, more recently, AI-agent-related projects.',
    tip: 'Mid-cap with moderate liquidity — check volume before placing large orders.' },
  { symbol: 'XRP', name: 'XRP', approxPrice: 0.55, priceStr: '$0.50 – $0.90', desc: 'Cross-border digital settlement network.',
    howItWorks: 'Uses its own consensus protocol (not mining) to settle transactions in seconds, designed originally for cross-border bank/payment settlement.',
    useCase: 'Marketed toward payment providers and banks needing fast, low-cost international settlement.',
    tip: 'Price has historically been sensitive to regulatory/legal news specific to Ripple — keep an eye on that context.' },
  { symbol: 'ADA', name: 'Cardano', approxPrice: 0.38, priceStr: '$0.30 – $0.60', desc: 'Proof-of-stake smart contract platform.',
    howItWorks: 'Built through a peer-reviewed, research-driven development process on a Proof-of-Stake consensus called Ouroboros.',
    useCase: 'Smart contract platform aimed at emerging markets, identity, and supply-chain use cases.',
    tip: 'Development is slower/more methodical than some competitors — useful context when comparing roadmaps.' },
  { symbol: 'DOGE', name: 'Dogecoin', approxPrice: 0.11, priceStr: '$0.09 – $0.18', desc: 'Popular decentralized peer-to-peer meme currency.',
    howItWorks: 'A Proof-of-Work coin forked from Litecoin, with no fixed max supply — new coins are minted continuously.',
    useCase: 'Mostly used for tipping, small payments, and as a highly liquid "meme" trading asset driven heavily by sentiment.',
    tip: 'Price is largely sentiment/news-driven rather than fundamentals-driven — expect sharp, fast moves.' }
];

function isGreeting(text) {
  return /^(hi|hello|hey|heyy|hiya|salam|salaam|assalam[- ]o[- ]alaikum|aoa|good\s+(morning|afternoon|evening|night)|hola|bonjour|hallo|مرحبا|سلام|ہیلو|नमस्ते|你好|こんにちは|안녕하세요)\s*[!.?]*$/iu.test(
    String(text || '').trim()
  );
}

function isAllCoinsQuery(text) {
  return /\b(all\s*coins?|all\s*crypto(currencies)?|all\s*price|all\s*market|full\s*market|market\s*overview|market\s*summary|every\s*coin|list\s*(of\s*)?(all\s*)?coins?|top\s*coins?|top\s*crypto|leading\s*crypto|سارے|تمام|سب کے|all crypto market|show.*all|all.*price)\b/i.test(text);
}

function isNewsQuestion(text) {
  return /\b(latest|news|headline|headlines|breaking|update|updates|what happened|today|recent|current news|خبر|اخبار|تازہ|آج|न्यूज़|समाचार|últimas noticias|noticias|actualités|nachrichten|новости|新闻|ニュース|뉴스)\b/i.test(text);
}

// Finds which coin (if any) from TOP_CRYPTO_DB the user is actually asking about.
// This is what lets "what is UNI" get UNI's own data instead of whatever coin
// happens to be on screen.
function findCoinMention(text) {
  const l = String(text || '').toLowerCase();
  return TOP_CRYPTO_DB.find(c => {
    const symRe = new RegExp(`\\b${c.symbol.toLowerCase()}\\b`);
    const firstWord = c.name.toLowerCase().split(/[\s(]/)[0];
    const nameRe = new RegExp(`\\b${firstWord}\\b`);
    return symRe.test(l) || nameRe.test(l);
  }) || null;
}

function isExplainQuestion(text) {
  return /\b(what is|what's|whats|explain|tell me about|how does .* work|info (on|about)|about)\b/i.test(text || '');
}

function isInstantLocalQuery(text) {
  const q = String(text || '').trim().toLowerCase();
  if (isGreeting(q)) return true;
  if (isAllCoinsQuery(q)) return true;
  if (/^(price|trend|volume|24h range|24h|range|uni info)$/i.test(q)) return true;
  if (/(?:between|bw|b\/w|from|details about)?\s*\$?([0-9]+\.?[0-9]*k?)\s*(?:-|to|and|till)\s*\$?([0-9]+\.?[0-9]*k?)/i.test(q)) return true;
  if (/(?:under|below|less than|< )\s*\$?([0-9]+\.?[0-9]*k?)/i.test(q)) return true;
  if (/(?:above|greater than|more than|> )\s*\$?([0-9]+\.?[0-9]*k?)/i.test(q)) return true;
  if (isExplainQuestion(q) && findCoinMention(q)) return true;
  return false;
}

function parseNum(valStr) {
  if (!valStr) return 0;
  let clean = String(valStr).toLowerCase().replace(/[\$,]/g, '').trim();
  if (clean.endsWith('k')) return parseFloat(clean) * 1000;
  if (clean.endsWith('m')) return parseFloat(clean) * 1000000;
  return parseFloat(clean);
}

function formatCoinsInRange(min, max, activeMarket) {
  const matching = TOP_CRYPTO_DB.filter(c => c.approxPrice >= min && c.approxPrice <= max);

  if (matching.length > 0) {
    let res = `Here are the leading cryptocurrencies trading in the **$${money(min)} – $${money(max)}** range:\n\n`;
    matching.forEach((c, idx) => {
      res += `${idx + 1}. **${c.name} (${c.symbol})**: ${c.priceStr} — ${c.desc}\n`;
    });
    return res;
  }

  let res = `Here are the top cryptocurrencies near the **$${money(min)} – $${money(max)}** price tier:\n\n`;
  res += `1. **Bitcoin (BTC)**: Currently trading around **$60,000 – $65,000** (the #1 cryptocurrency by market cap).\n`;
  res += `2. **Ethereum (ETH)**: ~$2,500 – $3,500 (leading smart contract platform).\n`;
  res += `3. **PAX Gold (PAXG)**: ~$2,600 – $2,700 (gold-backed asset).\n`;
  res += `4. **Maker (MKR)**: ~$1,800 – $2,200 (DeFi governance asset).\n`;
  res += `5. **BNB**: ~$550 – $620 (utility token for BNB chain).\n\n`;
  res += `*Summary*: Bitcoin (BTC) dominates the $50k+ bracket, while Ethereum (ETH) and PAXG lead the $1,000–$5,000 bracket right below it.`;
  if (activeMarket?.symbol) {
    res += `\n\nCurrent active viewed coin: **${activeMarket.symbol}** at **$${money(activeMarket.price)}**.`;
  }
  return res;
}

function formatAllCoinsTable(market) {
  const sym = market?.symbol || '';
  const activeTicker = String(sym).split('/')[0].trim().toUpperCase();
  let res = `## 📊 Full Crypto Market Overview\n\nHere are the top cryptocurrencies tracked on Regal with their current approximate prices:\n\n`;
  res += `| # | Coin | Symbol | Price Range | Category |\n`;
  res += `|---|------|--------|-------------|----------|\n`;
  TOP_CRYPTO_DB.forEach((c, i) => {
    const isActive = activeTicker && c.symbol === activeTicker;
    const price = isActive && market?.price ? `**$${money(market.price)}** *(live)*` : c.priceStr;
    res += `| ${i + 1} | ${c.name} | **${c.symbol}** | ${price} | ${c.desc.split('.')[0]} |\n`;
  });
  res += `\n> 💡 **Tip**: Click any coin in the sidebar to view its live chart and full analytics. Ask me *"what is [coin name]"* for a deep-dive on any specific coin.`;
  if (market?.price) {
    res += `\n\n**Currently viewing**: ${sym} at **$${money(market.price)}** (${Number(market.change24h || 0) >= 0 ? '+' : ''}${Number(market.change24h || 0).toFixed(2)}% 24h).`;
  }
  return res;
}

function fallback(message, market) {
  const q = String(message || '').trim();
  const l = q.toLowerCase();
  const sym = market?.symbol || 'Crypto';
  const assetName = market?.asset || 'Cryptocurrency';
  const p = money(market?.price);
  const ch = Number(market?.change24h || 0).toFixed(2);
  const high = money(market?.high24h);
  const low = money(market?.low24h);
  const vol = compact(market?.volume24h);

  // ── Greeting ──────────────────────────────────────────────────────────────
  if (isGreeting(q)) {
    return `👋 **Hey! Welcome to Regal AI.**\n\nI'm your expert crypto intelligence assistant. Here's what I can help you with:\n\n• 📈 **Live prices & market data** — real-time quotes for all tracked coins\n• 🔍 **Coin deep-dives** — fundamentals, use-cases, risk notes (ask "what is BTC")\n• 💹 **Trading guidance** — spot vs futures, order types, risk management\n• 🏦 **DeFi & staking** — how to earn yield, liquidity provision, risks\n• 📊 **Technical analysis** — RSI, MACD, volume, support/resistance\n• 🔐 **Wallets & security** — hot vs cold wallets, seed phrases, best practices\n• 💰 **Price range lookups** — "coins under $100", "coins between $1k–$5k"\n• 🌐 **Market sentiment** — fear & greed, bull/bear signals\n\nWhat would you like to explore today?`;
  }

  // ── All-coins price table ──────────────────────────────────────────────────
  if (isAllCoinsQuery(l)) {
    return formatAllCoinsTable(market);
  }

  // ── Price range queries ───────────────────────────────────────────────────
  const rangeMatch = l.match(/(?:between|bw|b\/w|from|about|details about)?\s*\$?([0-9]+\.?[0-9]*k?)\s*(?:-|to|and|till)\s*\$?([0-9]+\.?[0-9]*k?)/i);
  if (rangeMatch) {
    let min = parseNum(rangeMatch[1]);
    let max = parseNum(rangeMatch[2]);
    if (min > max) [min, max] = [max, min];
    if (min >= 0 && max > 0) return formatCoinsInRange(min, max, market);
  }

  const underMatch = l.match(/(?:under|less than|below|<)\s*\$?([0-9]+\.?[0-9]*k?)/i);
  if (underMatch) return formatCoinsInRange(0, parseNum(underMatch[1]), market);

  const aboveMatch = l.match(/(?:above|greater than|more than|>)\s*\$?([0-9]+\.?[0-9]*k?)/i);
  if (aboveMatch) return formatCoinsInRange(parseNum(aboveMatch[1]), 1_000_000, market);

  // ── Coin explain ──────────────────────────────────────────────────────────
  if (isExplainQuestion(l)) {
    const coin = findCoinMention(l);
    if (coin) {
      const marketSymbolUpper = String(market?.symbol || '').toUpperCase();
      const isActiveCoin = marketSymbolUpper.includes(coin.symbol);
      const priceLine = isActiveCoin
        ? `**Current price**: $${p} (${ch >= 0 ? '+' : ''}${ch}% in 24h) — 24h range $${low} – $${high}.`
        : `**Typical price range**: ${coin.priceStr}. You're currently viewing **${sym}** (**$${p}**) — switch coins from the sidebar to see ${coin.symbol}'s live chart.`;
      return `## ${coin.name} (${coin.symbol})\n\n`
        + `**What it is**: ${coin.desc}\n\n`
        + `**How it works**: ${coin.howItWorks}\n\n`
        + `**What it's used for**: ${coin.useCase}\n\n`
        + `**⚠️ Good to know**: ${coin.tip}\n\n`
        + `---\n${priceLine}`;
    }
  }

  // ── How to start trading ──────────────────────────────────────────────────
  if (/how\s*(do|can)\s*i\s*(start|begin)|how\s*to\s*(start|do|trade)|start\s*trading|trading\s*(kaise|kaisay|kese|shuru)|trade\s*(kaise|kaisay|kese)|trading\s*shuru/i.test(l)) {
    return `## 🚀 Getting Started with Crypto Trading\n\n`
      + `**Step 1 — Choose a reputable exchange**: Binance, Coinbase, or Kraken are good starting points. Verify your identity (KYC) before depositing.\n\n`
      + `**Step 2 — Start with liquid, large-cap coins**: BTC or ETH first. High liquidity = tighter spreads + easier exits.\n\n`
      + `**Step 3 — Understand order types**:\n`
      + `• *Market order* — fills instantly at current market price.\n`
      + `• *Limit order* — only executes when the price reaches your set level.\n`
      + `• *Stop-loss* — automatically sells to limit your downside.\n\n`
      + `**Step 4 — Manage risk before clicking buy**:\n`
      + `• Define your entry, stop-loss, and take-profit before placing a trade.\n`
      + `• Risk maximum **1–2% of your portfolio** per trade.\n`
      + `• Use the Risk/Reward ratio — aim for at least 1:2 (risk $1 to potentially gain $2).\n\n`
      + `**Step 5 — Learn technical analysis basics**: Support/resistance levels, RSI, and volume are your best friends.\n\n`
      + `**Step 6 — Start on Spot, NOT Futures**: Spot = you own the actual coin with zero liquidation risk.\n\n`
      + `> 💡 Once you're profitable on Spot for 3+ months, *then* consider learning Futures with 2x–3x leverage only.`;
  }

  // ── Spot vs Futures / Leverage / Margin ──────────────────────────────────
  if (/spot\s*(vs|and|or|versus)\s*futures|futures.*spot|spot.*futures|leverage|liquidation|margin|long\s*short|long position|short position/i.test(l)) {
    return `## ⚡ Spot vs Futures Trading\n\n`
      + `### 🟢 Spot Trading\n`
      + `You buy and directly **own** the actual cryptocurrency. Max loss = your invested amount. No expiry. No liquidation. Best for beginners and long-term holders.\n\n`
      + `### 🔴 Futures / Margin Trading\n`
      + `You trade a **contract** tracking the price with borrowed leverage (2x to 125x). Amplifies both profits AND losses.\n\n`
      + `| Feature | Spot | Futures |\n`
      + `|---------|------|---------|\n`
      + `| Own the asset | ✅ Yes | ❌ No (contract) |\n`
      + `| Liquidation risk | ❌ None | ✅ YES — can lose entire margin |\n`
      + `| Leverage | 1x only | Up to 125x |\n`
      + `| Best for | Beginners & HODLers | Experienced traders |\n`
      + `| Expiry | None | Perpetual or dated |\n\n`
      + `### ⚠️ Liquidation Explained\n`
      + `At 10x leverage, a 10% adverse move **wipes your entire margin**. Many exchanges auto-liquidate before that point. Always use stop-losses on leveraged positions.\n\n`
      + `> 💡 **Recommendation**: Build 3–6 months of consistent Spot profitability before touching Futures. Start with 2x–3x max.`;
  }

  // ── Risk Management ───────────────────────────────────────────────────────
  if (/risk\s*management|risk|position\s*size|sizing|stop.?loss|take.?profit|portfolio\s*risk|drawdown/i.test(l)) {
    return `## 🛡️ Crypto Risk Management Guide\n\n`
      + `**1. The 1–2% Rule**: Never risk more than 1–2% of your total portfolio on a single trade. If your portfolio is $10,000, max risk per trade = $100–$200.\n\n`
      + `**2. Always Set a Stop-Loss**: Define your exit point *before* entering. Emotional trading without a stop-loss is the #1 cause of blown accounts.\n\n`
      + `**3. Risk/Reward Ratio**: Only take trades where potential profit is at least 2× your risk (1:2 R/R minimum, 1:3 is ideal).\n\n`
      + `**4. Diversify**: Don't put 100% into one coin. Spread across BTC, ETH, and select altcoins.\n\n`
      + `**5. Position Sizing Formula**:\n`
      + `> Position Size = (Portfolio × Risk%) ÷ (Entry Price − Stop Loss Price)\n\n`
      + `**6. Never Trade with Money You Can't Afford to Lose**: Crypto is highly volatile. Only use disposable capital.\n\n`
      + `**7. Avoid Over-Leveraging**: High leverage on Futures can liquidate your position in minutes on a normal market move.\n\n`
      + `**8. Keep a Trading Journal**: Record every trade — entry, exit, reason, and outcome. This is how pros improve.\n\n`
      + `> Currently viewing: **${sym}** at **$${p}** (${ch >= 0 ? '+' : ''}${ch}% 24h).`;
  }

  // ── DeFi / Yield Farming / Liquidity ─────────────────────────────────────
  if (/\b(defi|decentralized finance|yield farm|liquidity pool|lp token|amm|automated market|aave|compound|uniswap.*protocol|sushiswap|pancake|dex|decentralized exchange|impermanent loss|liquidity provision|earn.*crypto|passive.*income.*crypto|staking.*earn)\b/i.test(l)) {
    return `## 🏦 DeFi — Decentralized Finance Explained\n\n`
      + `**What is DeFi?** DeFi replaces traditional financial intermediaries (banks, brokers) with self-executing smart contracts on blockchains like Ethereum.\n\n`
      + `### 💰 How to Earn in DeFi\n\n`
      + `**1. Lending & Borrowing** (Aave, Compound):\n`
      + `• Deposit crypto → earn interest (typically 2–8% APY).\n`
      + `• Borrow against your crypto collateral without selling it.\n`
      + `• Risk: if collateral value drops below threshold, your position gets liquidated.\n\n`
      + `**2. Liquidity Provision** (Uniswap, SushiSwap):\n`
      + `• Deposit a pair of tokens into a pool (e.g. ETH + USDC).\n`
      + `• Earn a % of all swap fees from traders using that pool.\n`
      + `• ⚠️ Risk: **Impermanent Loss** — if the price ratio between your two tokens changes significantly, you may end up with less value than simply holding them.\n\n`
      + `**3. Yield Farming**:\n`
      + `• Stake LP tokens in a protocol to earn additional reward tokens on top of swap fees.\n`
      + `• Higher APY = higher risk. Research the protocol's audit status before depositing.\n\n`
      + `### ⚠️ DeFi Risks\n`
      + `• Smart contract bugs (even audited protocols have been hacked)\n`
      + `• Rug pulls (anonymous team abandons project with funds)\n`
      + `• Token price volatility in high-APY farms\n`
      + `• Gas fees on Ethereum can eat into small positions\n\n`
      + `> 💡 Start with established protocols (Aave, Uniswap v3) and small amounts before committing large capital.`;
  }

  // ── Staking ───────────────────────────────────────────────────────────────
  if (/\b(staking|stake|pos|proof.of.stake|validator|delegate|earn.*rewards|staking.*rewards|eth.*staking|sol.*staking|ada.*staking)\b/i.test(l)) {
    return `## 🔒 Crypto Staking Guide\n\n`
      + `**What is Staking?** Locking your crypto in a Proof-of-Stake blockchain to help validate transactions. In return, you earn staking rewards (like interest).\n\n`
      + `### Popular Staking Options\n\n`
      + `| Coin | Est. APY | Min. Stake | Lock-up |\n`
      + `|------|----------|------------|---------|\n`
      + `| Ethereum (ETH) | ~3–5% | 32 ETH (solo) / any (via Lido) | Variable |\n`
      + `| Solana (SOL) | ~6–7% | ~0.01 SOL | None (liquid) |\n`
      + `| Cardano (ADA) | ~3–5% | No minimum | None (liquid) |\n`
      + `| Polkadot (DOT) | ~12–15% | ~120 DOT | 28 days unbonding |\n`
      + `| Avalanche (AVAX) | ~8–10% | 25 AVAX | 14 days |\n\n`
      + `### Types of Staking\n`
      + `• **Native staking**: Run a validator node yourself (technical, higher rewards)\n`
      + `• **Delegated staking**: Delegate to a validator pool (easiest, no lock-up on most chains)\n`
      + `• **Liquid staking**: Protocols like Lido give you stETH — you earn rewards while keeping liquidity\n`
      + `• **Exchange staking**: Stake via Binance/Coinbase (convenient but you don't control keys)\n\n`
      + `### ⚠️ Risks\n`
      + `• Price volatility can outweigh staking APY if coin drops sharply\n`
      + `• Slashing: misbehaving validators lose a portion of staked funds\n`
      + `• Lock-up periods mean you can't sell during a crash\n`
      + `• Exchange staking = you don't hold your private keys\n\n`
      + `> 💡 **Rule of thumb**: Only stake coins you plan to HODL long-term regardless. Don't stake purely for yield if you'd sell on a 20% dip.`;
  }

  // ── NFTs ──────────────────────────────────────────────────────────────────
  if (/\b(nft|non.fungible|opensea|nfts|digital art|collectible.*crypto|crypto.*art|mint.*nft|nft.*trading)\b/i.test(l)) {
    return `## 🎨 NFTs — Non-Fungible Tokens Explained\n\n`
      + `**What is an NFT?** A unique digital asset recorded on a blockchain. Unlike BTC/ETH (fungible — each unit is identical), each NFT is one-of-a-kind and can represent art, music, gaming items, domain names, or real-world assets.\n\n`
      + `### How NFTs Work\n`
      + `1. A creator **mints** (creates) an NFT by publishing metadata + a smart contract on-chain (usually Ethereum or Solana).\n`
      + `2. Ownership is stored on the blockchain — transparent and publicly verifiable.\n`
      + `3. NFTs are bought/sold on marketplaces like **OpenSea**, **Blur**, or **Magic Eden** (Solana).\n`
      + `4. Creators can earn **royalties** (typically 5–10%) on every secondary sale.\n\n`
      + `### NFT Use Cases\n`
      + `• Digital art & collectibles (profile pictures, generative art)\n`
      + `• Gaming items (in-game skins, land, characters with real ownership)\n`
      + `• Music & event tickets\n`
      + `• Real-world asset tokenization (real estate, luxury goods)\n`
      + `• Domain names (ENS — Ethereum Name Service)\n\n`
      + `### ⚠️ NFT Risks\n`
      + `• Highly speculative — 95%+ of NFT collections lose value over time\n`
      + `• No guaranteed buyers for your NFT (illiquidity risk)\n`
      + `• Wash trading inflates volume on many collections\n`
      + `• Smart contract exploits and phishing scams are common\n\n`
      + `> 💡 Only invest in NFTs what you're 100% comfortable losing entirely. Research the team, utility, and community before minting.`;
  }

  // ── Wallets & Security ────────────────────────────────────────────────────
  if (/\b(wallet|cold wallet|hot wallet|hardware wallet|ledger|trezor|metamask|seed phrase|private key|secure.*crypto|store.*crypto|custody|self.custody|non.custodial)\b/i.test(l)) {
    return `## 🔐 Crypto Wallets & Security Guide\n\n`
      + `### Types of Wallets\n\n`
      + `**🔥 Hot Wallets** (connected to internet):\n`
      + `• MetaMask, Trust Wallet, Phantom (browser/mobile)\n`
      + `• Convenient for daily trading and DeFi\n`
      + `• ⚠️ Vulnerable to phishing, malware, and exchange hacks\n\n`
      + `**🧊 Cold Wallets** (offline hardware):\n`
      + `• Ledger Nano X/S+, Trezor Model T\n`
      + `• Private keys never touch the internet\n`
      + `• Best for long-term storage of significant holdings\n`
      + `• Cost: $60–$200 (worth it if you hold $1,000+ in crypto)\n\n`
      + `### 🔑 Seed Phrase (12/24 words)\n`
      + `• Your seed phrase = **master key** to your entire wallet\n`
      + `• Write it on **paper** (or steel) — NEVER store digitally\n`
      + `• NEVER share it with anyone — no legitimate service will ask for it\n`
      + `• Store in multiple secure offline locations (fireproof safe ideal)\n\n`
      + `### ✅ Security Best Practices\n`
      + `1. Use a hardware wallet for amounts > $500\n`
      + `2. Enable 2FA (use an authenticator app, NOT SMS)\n`
      + `3. Use unique, strong passwords per exchange\n`
      + `4. Bookmark official exchange URLs — don't click email links\n`
      + `5. Never approve unlimited token allowances in DeFi without research\n`
      + `6. Regularly revoke unused token approvals (use revoke.cash)\n`
      + `7. Keep software/firmware updated on hardware wallets\n\n`
      + `> ⚠️ **"Not your keys, not your coins."** Exchange-held crypto can be frozen, hacked, or lost (see: FTX collapse).`;
  }

  // ── Tax ───────────────────────────────────────────────────────────────────
  if (/\b(tax|taxes|taxable|capital gain|irs|hmrc|crypto tax|tax.*crypto|report.*crypto|crypto.*report|koinly|taxbit|cointracker)\b/i.test(l)) {
    return `## 💸 Crypto Tax Guide (General Overview)\n\n`
      + `> ⚠️ *This is general educational information, not tax advice. Consult a qualified tax professional for your specific situation.*\n\n`
      + `### How Crypto is Taxed (General Principles)\n`
      + `In most countries (US, UK, EU), crypto is treated as **property/capital asset** — not currency.\n\n`
      + `### Taxable Events\n`
      + `| Event | Taxable? |\n`
      + `|-------|----------|\n`
      + `| Selling crypto for fiat | ✅ Yes (capital gain/loss) |\n`
      + `| Trading crypto for crypto | ✅ Yes (in most jurisdictions) |\n`
      + `| Receiving staking/mining rewards | ✅ Yes (income tax) |\n`
      + `| Buying crypto with fiat | ❌ No |\n`
      + `| Transferring between your own wallets | ❌ No |\n`
      + `| Gifting crypto (varies by country) | ⚠️ Sometimes |\n\n`
      + `### Capital Gains: Short vs Long Term (US Example)\n`
      + `• Held **< 1 year**: Short-term gains taxed as ordinary income (up to 37%)\n`
      + `• Held **> 1 year**: Long-term rates of 0%, 15%, or 20% depending on income\n\n`
      + `### Crypto Tax Tools\n`
      + `• **Koinly** — imports from 300+ exchanges, auto-calculates gains\n`
      + `• **CoinTracker** — integrates with TurboTax\n`
      + `• **TaxBit** — enterprise-grade, used by major exchanges\n\n`
      + `> 💡 Keep detailed records of every transaction: date, amount, USD value at time of trade.`;
  }

  // ── Technical Analysis ────────────────────────────────────────────────────
  if (/\b(rsi|macd|bollinger|ema|sma|moving average|support|resistance|technical analysis|ta|candlestick|chart pattern|fibonacci|volume profile|order flow|indicator|overbought|oversold)\b/i.test(l)) {
    return `## 📊 Technical Analysis (TA) — Crypto Trading Guide\n\n`
      + `### 📈 Key Indicators\n\n`
      + `**RSI — Relative Strength Index** (0–100)\n`
      + `• > 70: **Overbought** — potential reversal or pullback signal\n`
      + `• < 30: **Oversold** — potential bounce or reversal signal\n`
      + `• 40–60: Neutral range — no strong directional bias\n\n`
      + `**MACD — Moving Average Convergence/Divergence**\n`
      + `• MACD line crossing **above** signal line = bullish momentum\n`
      + `• MACD line crossing **below** signal line = bearish momentum\n`
      + `• Histogram bars show strength of the move\n\n`
      + `**EMA — Exponential Moving Average**\n`
      + `• 20 EMA: short-term trend\n`
      + `• 50 EMA: medium-term trend\n`
      + `• 200 EMA: long-term trend (golden cross = 50 crosses above 200 = major bull signal)\n\n`
      + `**Bollinger Bands**\n`
      + `• Price touching upper band = potentially overbought\n`
      + `• Price touching lower band = potentially oversold\n`
      + `• Squeeze (bands narrowing) = big move incoming, direction uncertain\n\n`
      + `**Support & Resistance**\n`
      + `• Support: price level where buyers have historically stepped in\n`
      + `• Resistance: price level where sellers have historically dominated\n`
      + `• Breakout above resistance (with high volume) = bullish\n`
      + `• Breakdown below support = bearish\n\n`
      + `**Volume Analysis**\n`
      + `• Price up + volume up = strong, confirmed move\n`
      + `• Price up + volume down = weak move, possible fakeout\n`
      + `• Volume spike on a reversal candle = significant signal\n\n`
      + `> 💡 No indicator is perfect. Use 2–3 confirming signals before entering a trade. Current ${sym}: $${p} | 24h: ${ch >= 0 ? '+' : ''}${ch}%.`;
  }

  // ── Market Sentiment / Fear & Greed ──────────────────────────────────────
  if (/\b(sentiment|fear.*greed|greed.*fear|market.*sentiment|bull.*market|bear.*market|crypto.*cycle|bull run|halving|bitcoin.*cycle|market.*psychology|fomo|fud)\b/i.test(l)) {
    return `## 🧠 Crypto Market Sentiment & Psychology\n\n`
      + `### Fear & Greed Index (0–100)\n`
      + `| Score | Sentiment | What it Often Means |\n`
      + `|-------|-----------|---------------------|\n`
      + `| 0–25 | 😱 Extreme Fear | Potential buying opportunity |\n`
      + `| 26–45 | 😟 Fear | Market selling off, caution advised |\n`
      + `| 46–55 | 😐 Neutral | No strong signal |\n`
      + `| 56–75 | 😀 Greed | Market rallying, watch for corrections |\n`
      + `| 76–100 | 🤑 Extreme Greed | Often precedes major corrections |\n\n`
      + `> *"Be fearful when others are greedy, and greedy when others are fearful."* — Warren Buffett\n\n`
      + `### Bitcoin Market Cycles\n`
      + `• **Accumulation**: Informed buyers quietly buy after a crash\n`
      + `• **Markup (Bull Run)**: Price rises, retail FOMO kicks in\n`
      + `• **Distribution**: Early buyers sell to late retail investors at the top\n`
      + `• **Markdown (Bear Market)**: Price collapses, despair phase\n\n`
      + `### Bitcoin Halving\n`
      + `Every ~4 years, Bitcoin's block reward halves (~50% supply reduction). Historically, bull runs have followed 6–18 months after each halving (2012, 2016, 2020). Next halving: **April 2028**.\n\n`
      + `### Common Pitfalls\n`
      + `• **FOMO** (Fear Of Missing Out): Buying at the top after a big rally\n`
      + `• **FUD** (Fear, Uncertainty, Doubt): Panic selling at the bottom\n`
      + `• **Revenge trading**: Doubling down after a loss to "make it back"\n`
      + `• **Overtrading**: Taking too many positions, compounding losses on fees\n\n`
      + `> 💡 Successful traders manage emotions as much as charts. Stick to your plan.`;
  }

  // ── Bitcoin specifically ──────────────────────────────────────────────────
  if (/\b(bitcoin|btc|satoshi|nakamoto|btc.*price|price.*btc|bitcoin.*worth|bitcoin.*value)\b/i.test(l) && !isExplainQuestion(l)) {
    const isActiveBtc = String(market?.symbol || '').toUpperCase().includes('BTC');
    const btcPrice = isActiveBtc ? `**$${p}** *(live)*` : `~$60,000–$65,000 (reference)`;
    return `## ₿ Bitcoin (BTC) — Market Intelligence\n\n`
      + `**Current Price**: ${btcPrice}\n`
      + (isActiveBtc ? `**24h Change**: ${ch >= 0 ? '+' : ''}${ch}% | **High**: $${high} | **Low**: $${low} | **Volume**: ${vol}\n\n` : '\n')
      + `### Key Bitcoin Stats\n`
      + `• **Max Supply**: 21,000,000 BTC (fixed forever)\n`
      + `• **Circulating Supply**: ~19.7 million BTC\n`
      + `• **Market Dominance**: ~50–55% of total crypto market cap\n`
      + `• **Block Time**: ~10 minutes\n`
      + `• **Last Halving**: April 2024 (reward: 3.125 BTC/block)\n`
      + `• **Next Halving**: ~April 2028\n\n`
      + `### Why BTC Leads the Market\n`
      + `Bitcoin is the benchmark asset. When BTC rises, altcoins often follow. When BTC drops sharply, most altcoins drop harder (higher beta). Always watch BTC's trend first.\n\n`
      + `> Ask me **"what is BTC"** for a full fundamental breakdown, or **"BTC technical analysis"** for TA signals.`;
  }

  // ── Price (active coin) ───────────────────────────────────────────────────
  if (/price|rate|worth|value|qeemat|keemat|قیمت|ریٹ|precio|prix|preis/i.test(l)) {
    const baseTicker = String(sym).split('/')[0].trim() || sym;
    return `## ${assetName} (${sym}) — Live Price\n\n`
      + `• **Price**: $${p} (${ch >= 0 ? '+' : ''}${ch}% in 24h)\n`
      + `• **24h High**: $${high}\n`
      + `• **24h Low**: $${low}\n`
      + `• **24h Volume**: ${vol}\n\n`
      + `${Number(ch) >= 0 ? '📈 It\'s trading higher over the last 24 hours.' : '📉 It\'s trading lower over the last 24 hours.'}\n\n`
      + `> Ask me *"what is ${baseTicker}"* for fundamentals, or *"${baseTicker} trend"* for momentum analysis.`;
  }

  // ── Trend / Momentum ──────────────────────────────────────────────────────
  if (/trend|momentum|bull|bear|direction|market trend|تجزیہ|ٹرینڈ/i.test(l)) {
    const direction = Number(ch) >= 2 ? '📈 trending upward with solid momentum'
      : Number(ch) >= 0.5 ? '📈 slightly bullish'
      : Number(ch) <= -2 ? '📉 trending downward with bearish pressure'
      : Number(ch) <= -0.5 ? '📉 slightly bearish'
      : '➡️ relatively flat / range-bound';
    return `## ${assetName} (${sym}) — Trend Analysis\n\n`
      + `• **24h Change**: ${ch >= 0 ? '+' : ''}${ch}% — ${direction}\n`
      + `• **24h High / Low**: $${high} / $${low} (intraday range: $${money(Number(market?.high24h || 0) - Number(market?.low24h || 0))})\n`
      + `• **24h Volume**: ${vol}\n\n`
      + `### Reading This Signal\n`
      + `${Number(ch) >= 1 ? '• Rising price with (ideally) rising volume suggests the move has conviction.' : Number(ch) <= -1 ? '• Falling price — check volume. High sell volume confirms the bearish move; low volume may mean it\'s a temporary dip.' : '• Range-bound action — traders often wait for a clear breakout above resistance or breakdown below support before committing.'}\n\n`
      + `> ⚠️ *24h data is a short-term snapshot. Always confirm with a multi-timeframe view (4H, daily chart) before trading.*`;
  }

  // ── Volume ────────────────────────────────────────────────────────────────
  if (/volume|حجم|volumen/i.test(l)) {
    return `## ${assetName} (${sym}) — Volume Analysis\n\n`
      + `**24h Volume**: **${vol}**\n\n`
      + `### What Volume Tells You\n`
      + `• **Volume confirms price moves**: A breakout or breakdown on high volume is more reliable than the same move on thin volume.\n`
      + `• **Rising volume + rising price** = strong bullish conviction\n`
      + `• **Rising volume + falling price** = strong bearish selling pressure\n`
      + `• **Low volume moves** are more likely to reverse quickly (fakeouts)\n`
      + `• **Volume spikes** around news events often mark local tops or bottoms\n\n`
      + `> 💡 Compare today's volume against the 20-day average volume for context.`;
  }

  // ── High / Low / Range ────────────────────────────────────────────────────
  if (/high|low|range|ہائی|لو|رینج/i.test(l)) {
    const midpoint = ((Number(market?.high24h || 0) + Number(market?.low24h || 0)) / 2);
    const posInRange = market?.price && market?.high24h && market?.low24h
      ? Math.round(((market.price - market.low24h) / (market.high24h - market.low24h)) * 100)
      : null;
    return `## ${sym} — 24h Price Range\n\n`
      + `• **24h High**: $${high}\n`
      + `• **24h Low**: $${low}\n`
      + `• **Midpoint**: $${money(midpoint)}\n`
      + `• **Current**: $${p}${posInRange !== null ? ` (${posInRange}% of today's range)` : ''}\n\n`
      + `### How to Use This\n`
      + `• Price near the **24h low**: Support zone — buyers have stepped in here. Could be a value zone, but watch for continued breakdown.\n`
      + `• Price near the **24h high**: Resistance zone — sellers previously dominated. A breakout above with volume = bullish signal.\n`
      + `• Price at the **midpoint**: Neutral — no immediate directional edge from range alone.`;
  }

  // ── Default / Help ────────────────────────────────────────────────────────
  return `## 🤖 Regal AI — What Can I Help You With?\n\n`
    + `Here are the topics I can cover in depth:\n\n`
    + `| Category | Example Questions |\n`
    + `|----------|-------------------|\n`
    + `| 📊 **Live Prices** | "All coin prices", "Price of BTC", "Market overview" |\n`
    + `| 🔍 **Coin Deep-Dives** | "What is Ethereum?", "Explain Solana", "Tell me about LINK" |\n`
    + `| 💰 **Price Ranges** | "Coins under $100", "Coins between $1k–$5k" |\n`
    + `| 📈 **Trading Guidance** | "How to start trading", "Spot vs Futures", "Position sizing" |\n`
    + `| 🛡️ **Risk Management** | "How to set stop-loss", "Risk management strategies" |\n`
    + `| 🏦 **DeFi & Staking** | "How does DeFi work?", "How to stake ETH?" |\n`
    + `| 🎨 **NFTs** | "What are NFTs?", "How to buy an NFT?" |\n`
    + `| 🔐 **Wallets & Security** | "Hot vs cold wallet", "How to secure my crypto" |\n`
    + `| 📊 **Technical Analysis** | "RSI explained", "What is MACD?", "Support and resistance" |\n`
    + `| 🧠 **Market Sentiment** | "What is Fear & Greed index?", "Bull vs Bear market" |\n`
    + `| 💸 **Crypto Tax** | "Is crypto taxable?", "How are crypto gains taxed?" |\n\n`
    + `**Currently viewing**: ${sym} at **$${p}** (${ch >= 0 ? '+' : ''}${ch}% 24h).\n\n`
    + `> Just type your question naturally — I understand English, Roman Urdu, and Urdu.`;
}

function buildSystemPrompt(market, newsQuestion) {
  return `You are Regal AI — a senior-level cryptocurrency analyst, trader, and educator with 10+ years of experience.
You operate inside Regal, a premium real-time crypto intelligence SaaS dashboard. You are direct, confident, deeply knowledgeable, and always give mature, substantive responses.

═══════════════════════════════════════════════════════
YOUR EXPERTISE COVERS:
• Live market data & price analysis
• Coin fundamentals (technology, tokenomics, use-cases)
• Trading strategies (spot, futures, swing, scalp, DCA)
• Technical analysis (RSI, MACD, EMA, Bollinger, S/R levels, volume profile)
• Risk management & position sizing
• DeFi protocols, staking, yield farming, liquidity provision
• NFTs, metaverse, and Web3 ecosystems
• Wallet security (hot vs cold, seed phrases, self-custody)
• Market sentiment, cycles, halving effects
• Crypto tax principles (general education, not legal advice)
• Regulatory landscape overview
• Portfolio construction & diversification
═══════════════════════════════════════════════════════

CRITICAL RESPONSE RULES:

1. NEVER give one-liner responses to substantive questions. Every answer must be thorough, structured, and genuinely useful.

2. STRUCTURE ALL RESPONSES with:
   • Clear headers (## for major sections, ### for subsections)
   • Bullet points and numbered lists for multi-step content
   • Tables where comparative data is involved
   • A practical tip or risk note at the end of every educational answer

3. COMPLETENESS IS MANDATORY. Never truncate mid-sentence. Complete all lists, tables, and explanations fully.

4. DO NOT MIX UP COIN PRICES. The LIVE MARKET SNAPSHOT below is ONLY for the coin currently on screen (market.symbol = ${market?.symbol || 'unknown'}). If the user asks about a DIFFERENT coin, use your knowledge of its typical price range and clearly label it as approximate — never attribute one coin's live price to another.

5. ALL-COINS PRICE QUERY: If asked for "all prices", "all coins", or "market overview", respond with a complete formatted table of all major cryptocurrencies with their approximate prices and brief descriptions. Cover at minimum: BTC, ETH, PAXG, MKR, BNB, TAO, SOL, AAVE, AVAX, LINK, UNI, DOT, NEAR, XRP, ADA, DOGE.

6. PRICE RANGE QUERIES: When asked for coins in a range ("under $100", "between $1k–$5k", "above $10k"), list ALL qualifying coins with price, symbol, and a 1-line description.

7. TRADING & RISK QUESTIONS: Give concrete, actionable advice — real position sizing formulas, real R/R ratios, real step-by-step guidance. Not vague summaries.

8. LANGUAGE MATCHING: If user writes in Roman Urdu or Urdu, respond in the same language with the same structured depth. Never switch to a shorter or lazier format just because of the language.

9. MARKET NEWS: When asked about latest crypto news, use Google Search grounding to retrieve real current headlines. Summarize the top 3–5 most relevant stories with source attribution.

10. TONE: Professional, confident, and educational — like a senior analyst explaining to an intelligent client. No fluff. No disclaimers repeated ad nauseam. A single risk note where appropriate is enough.

═══════════════════════════════════════════════════════
LIVE MARKET SNAPSHOT — CURRENT VIEWED COIN (${market?.symbol || 'unknown'}):
${JSON.stringify(market, null, 2)}
═══════════════════════════════════════════════════════

News question: ${newsQuestion ? 'YES — use Google Search grounding for real headlines.' : 'NO — answer from knowledge.'}\n
If you don't have enough real-time data for a specific question, say so clearly and provide the best approximate answer from your training knowledge rather than refusing to answer.`;
}

function normalizeHistory(conversation) {
  return (Array.isArray(conversation) ? conversation : [])
    .slice(-8)
    .map(item => ({
      role: item?.role === 'bot' ? 'model' : 'user',
      parts: [{ text: String(item?.text || '') }]
    }))
    .filter(item => item.parts[0].text.trim());
}

async function callGemini(message, market, conversation) {
  const trimmed = String(message || '').trim();

  if (isGreeting(trimmed)) {
    return { reply: 'Hi! How can I help you with crypto trading or market data today?', sources: [] };
  }

  const newsQuestion = isNewsQuestion(trimmed);
  const contents = [
    ...normalizeHistory(conversation),
    { role: 'user', parts: [{ text: trimmed }] }
  ];

  const body = {
    systemInstruction: {
      parts: [{ text: buildSystemPrompt(market, newsQuestion) }]
    },
    contents,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048
    }
  };

  if (newsQuestion) body.tools = [{ google_search: {} }];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify(body)
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.error?.message || `Gemini request failed with ${response.status}`);
  }

  const reply = json?.candidates?.[0]?.content?.parts
    ?.map(part => part.text || '')
    .join('')
    .trim();

  if (!reply) throw new Error('Gemini returned an empty response.');

  const grounding = json?.candidates?.[0]?.groundingMetadata;
  const sources = (grounding?.groundingChunks || [])
    .map(chunk => chunk?.web)
    .filter(Boolean)
    .slice(0, 3)
    .map(web => ({ title: web.title || 'Source', url: web.uri || '' }))
    .filter(source => source.url);

  return { reply, sources };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: Boolean(GEMINI_API_KEY), model: GEMINI_MODEL });
});

app.post('/api/ai', async (req, res) => {
  const { message, market, conversation = [] } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (isInstantLocalQuery(message)) {
    return res.json({
      reply: fallback(message, market),
      provider: 'fast-local'
    });
  }

  if (!GEMINI_API_KEY) {
    return res.json({
      reply: fallback(message, market),
      provider: 'local-fallback',
      warning: 'GEMINI_API_KEY is not configured.'
    });
  }

  try {
    const result = await callGemini(message, market, conversation);
    return res.json({ ...result, provider: 'gemini', model: GEMINI_MODEL });
  } catch (error) {
    console.error('Gemini error:', error?.message || error);
    return res.json({
      reply: fallback(message, market),
      provider: 'local-fallback',
      warning: error?.message || 'Gemini unavailable.'
    });
  }
});

const distPath = path.join(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

if (isProduction && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const vite = await createViteServer({
    root: __dirname,
    server: { middlewareMode: true, hmr: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`Regal Multi-Crypto Hub running at http://localhost:${PORT}`);
  console.log(
    GEMINI_API_KEY
      ? `Regal AI enabled: ${GEMINI_MODEL}`
      : 'Regal AI fallback active — add GEMINI_API_KEY to .env'
  );
  if (GEMINI_API_KEY && !/^AIzaSy/.test(GEMINI_API_KEY)) {
    console.warn(
      'WARNING: GEMINI_API_KEY does not look like a standard Google AI Studio key ' +
      '(those normally start with "AIzaSy..."). If the AI assistant keeps answering ' +
      'with generic local replies instead of full AI responses, check the terminal ' +
      'logs for "Gemini error:" lines — that confirms the key/model is being rejected, ' +
      'and you can generate a fresh key at https://aistudio.google.com/apikey.'
    );
  }
});
