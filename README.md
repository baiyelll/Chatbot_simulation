# HKT Website 🔷

A modern one-page website for HKT — built with **React** (Vite), featuring a typewriter hero animation and an AI-ready chatbot widget.

---

## Project Structure

```
hkt-website/
├── src/
│   ├── App.jsx        ← Main page (Nav, Hero, Cards, Footer)
│   ├── ChatBot.jsx    ← Chatbot widget + hardcoded responses
│   └── styles.css     ← Global styles & animations
├── index.html
├── package.json
└── vite.config.js
```

---

## Prerequisites

- **Node.js** ≥ 18  →  https://nodejs.org
- **npm** ≥ 9 (bundled with Node)

---

## 1 — Install & Run Locally

```bash
# 1. Clone or unzip the project
cd hkt-website

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

> To build for production: `npm run build` → output lands in `dist/`

---

## 2 — How the Chatbot Works Right Now

The chatbot is **fully hardcoded** — no API calls are made. All responses live in `src/ChatBot.jsx` inside the `CHAT_CONTENT` object:

```js
// src/ChatBot.jsx  (top of file)
export const CHAT_CONTENT = {
  root: { ... },           // greeting + 3 option buttons
  "security-eng": { ... }, // Security Engineering description
  cybersecurity:  { ... }, // Cybersecurity description
  "it-solutions": { ... }, // IT Solutions description
};
```

Edit any `title` or `body` string there to change what the chatbot says.

---

## 3 — Connecting a Real AI (Anthropic Claude)

### Step 1 — Get an API Key

1. Sign up at **https://console.anthropic.com**
2. Go to **API Keys** and create a new key
3. Copy the key (starts with `sk-ant-...`)

### Step 2 — Add the API Key

At the top of `src/ChatBot.jsx`, replace the placeholder:

```js
// src/ChatBot.jsx  — line 6
const API_KEY   = "PLACEHOLDER_REPLACE_WITH_YOUR_ANTHROPIC_API_KEY";
const API_MODEL = "claude-sonnet-4-20250514";
```

⚠️ **Never commit a real API key to git.** For local dev, use a `.env` file:

```bash
# .env  (create in project root)
VITE_ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
```

Then reference it in code:

```js
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
```

Add `.env` to `.gitignore`:

```
# .gitignore
.env
.env.local
```

### Step 3 — Wire Up the API Call

Replace the `handleOption` function in `ChatBot.jsx` with a live API call:

```js
const handleOption = async (option) => {
  // Show the user's choice immediately
  setMessages((prev) => [...prev, { id: Date.now(), type: "user", text: option.label }]);

  // Call the Anthropic API
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: API_MODEL,
      max_tokens: 1024,
      system: "You are HKT's helpful AI assistant specialising in Security Engineering, Cybersecurity, and IT Solutions. Keep answers concise and professional.",
      messages: [{ role: "user", content: option.label }],
    }),
  });

  const data = await response.json();
  const reply = data.content?.[0]?.text ?? "Sorry, I couldn't get a response.";

  setMessages((prev) => [...prev, { id: Date.now() + 1, type: "bot", text: reply, showBack: true }]);
};
```

> **Note:** Direct browser-to-API calls expose your key in the client. For production, proxy the request through your own backend (Next.js API route, Express server, Cloudflare Worker, etc.).

### Step 4 — Multi-turn Conversations (optional)

To give the bot memory across the session, maintain a `conversationHistory` array in state and append each user/assistant pair before every API call — then pass the full array as the `messages` field.

---

## 4 — Deployment

| Platform | Command |
|----------|---------|
| Vercel   | `vercel --prod` (auto-detects Vite) |
| Netlify  | `netlify deploy --dir dist` |
| GitHub Pages | `npm run build` then push `dist/` |

For Vercel/Netlify, set `VITE_ANTHROPIC_API_KEY` as an **environment variable** in their dashboard — never in the source code.

---

## 5 — Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 (Vite) |
| Routing (next step) | React Router or Remix |
| Fonts | Syne · DM Sans · Space Mono (Google Fonts) |
| AI backend (future) | Anthropic Claude API |

---

## License

MIT — feel free to customise for HKT's needs.
