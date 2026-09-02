# Regal — Bitcoin Intelligence SaaS

Premium Bitcoin trading dashboard using the Regal palette from the supplied reference.

## AI assistant — fixed

Regal AI now uses **Google Gemini** server-side instead of the old OpenAI/local-summary logic.

- Model: `gemini-3.5-flash`
- Live BTC/USDT snapshot is sent with every question.
- The assistant answers the **actual user question first**.
- Trading education: spot, futures, leverage, liquidation, RSI, MACD, support/resistance, entries, exits, stop-loss, take-profit, position sizing and risk/reward.
- Beginner question such as **"how do I start trading?"** gets a proper step-by-step answer.
- Same-language responses: English, Urdu, Roman Urdu, Hindi, Arabic, Spanish, French, German, Russian, Chinese, Japanese, Korean and Bengali.
- Latest/current Bitcoin news uses Gemini Google Search grounding when the question is a news/current-event request.
- API key stays on the Node server and is never placed in React code.
- Typing indicator and responsive chat UI included.

Google's current Gemini API supports `gemini-3.5-flash`, `generateContent`, and Google Search grounding. See the official docs linked below.

## Setup

1. Install Node.js 18+.
2. Open this folder in VS Code terminal.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file beside `package.json`:

```env
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.5-flash
PORT=5173
```

5. Start:

```bash
npm run dev
```

6. Open:

```text
http://localhost:5173
```

## Important

Do **not** put `GEMINI_API_KEY` in `src/main.jsx`, `VITE_*` variables, or any frontend file. The React app calls `/api/ai`; the Node server calls Gemini securely.

## Live market

BTC price, ticker, trades and candles continue to come from Binance's public live endpoints.
