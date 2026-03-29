# Charlie Bull — Frontend Project Context

> **Purpose of this file:** This document exists so that any AI assistant (Claude, Gemini, GPT, or future models) can be dropped into this codebase cold and immediately understand the full project, architecture, current state, and what to do next. Read this file first before touching anything.

> **Last updated:** March 29, 2026  
> **Woof Paper version:** 1.0.3  
> **Related repo:** `charlie-ai-server` (backend — has its own PROJECT_CONTEXT.md)

---

## 1. Project Overview

**Charlie Bull** is a cross-chain cryptocurrency project combining:
1. **$CHAR** — an ERC-20 token deployed on 9 Ethereum-compatible blockchains
2. **Charlie** — an autonomous AI social agent that posts and engages across Bluesky, X/Twitter, Telegram, and the project website
3. **$BULL** — an educational companion token on Pump.fun (Solana) that bridges into the $CHAR ecosystem on graduation
4. **Charlie's Angels** — a planned NFT collection on Solana for $BULL graduates

**Website:** https://charliebull.art  
**Woof Paper (docs):** https://charliebull.art/docs  
**Founder:** Viktor Khachatryan — Full Stack Developer  
LinkedIn: https://www.linkedin.com/in/viktor-khachatryan-78a6a064/

---

## 2. Repository Structure

**This repo** (`official-charlie-bull`) is the **frontend only**.

```
official-charlie-bull/
├── app/
│   ├── layout.tsx              # Root layout — fonts, theme, header/footer
│   ├── page.tsx                # Landing page
│   ├── chat/
│   │   └── page.tsx            # Dedicated chat page
│   ├── docs/
│   │   └── page.tsx            # Woof Paper v1.0.3 (full tokenomics docs)
│   └── api/
│       ├── chat/
│       │   └── route.ts        # Proxy: POST /api/chat → AI_SERVER_URL/v1/chat
│       └── healthz/
│           └── route.ts        # Proxy: GET /api/healthz → AI_SERVER_URL/healthz
├── components/
│   ├── ChatWidget.tsx          # Chat UI — sends { sessionId, message, history }
│   ├── CopyButton.tsx          # 'use client' clipboard copy — used in docs
│   ├── ConditionalLoadingScreen.tsx
│   ├── ErrorBoundary.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── IOSPerfGuard.tsx
│   ├── LandingPage.tsx
│   ├── LoadingScreen.tsx
│   ├── SquidWidgetWrapper.tsx  # Squid cross-chain bridge — wrapped in QueryClientProvider
│   ├── ThemeSwitcher.tsx
│   ├── TokenAddress.tsx
│   └── useIsLowEndIOS.ts
├── styles/
│   ├── globals.css             # ⚠️ squid.css MUST be imported BEFORE @tailwind directives
│   └── squid.css
├── public/
│   ├── manifest.json
│   └── fonts/
├── next.config.mjs             # turbopack: {}, transpilePackages: ['@0xsquid/widget']
├── tailwind.config.ts
├── tsconfig.json               # target: ES2017, jsx: react-jsx
├── package.json
└── PROJECT_CONTEXT.md          # ← you are here
```

**Backend repo:** `charlie-ai-server` — Node.js AI server on AWS EC2. Has its own PROJECT_CONTEXT.md.

---

## 3. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.0.10 |
| UI Library | React / React-DOM | 19 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 3.4.x |
| UI Components | DaisyUI | 4.7.0 |
| Bridge Widget | @0xsquid/widget | 6.3.2 |
| Query Client | @tanstack/react-query | 5.90.12 |
| Wallet | wagmi / viem | 2.13.3 / 2.21.32 |
| Icons | lucide-react | 0.544.x |
| Deployment | Vercel | auto-deploy from main |
| Linting | ESLint | 9 |

### Key Config Notes
- `next.config.mjs` uses `turbopack: {}` (no `swcMinify` — deprecated in Next 16)
- `transpilePackages: ['@0xsquid/widget']` is required for the Squid Widget to compile
- `SquidWidgetWrapper.tsx` wraps the Squid widget in `QueryClientProvider` (required for React 19 compatibility)
- `globals.css`: `@import '../styles/squid.css'` **must appear before** `@tailwind base` — reversing this breaks the build

---

## 4. Environment Variables

The frontend requires one environment variable:

| Variable | Description |
|---|---|
| `AI_SERVER_URL` | Base URL of the charlie-ai-server backend (no trailing slash) |

Set this in Vercel project settings under Environment Variables. The value points to the backend server running in `charlie-ai-server`.

---

## 5. API Routes

### `POST /api/chat`
Proxies to `AI_SERVER_URL/v1/chat`. Passes the request body through as-is with a **15-second timeout**.

**Request body:**
```json
{
  "sessionId": "string",
  "message": "string",
  "history": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ]
}
```

**ChatWidget.tsx** builds the `history` array from the last 10 messages in the conversation state before sending.

### `GET /api/healthz`
Proxies to `AI_SERVER_URL/healthz`. Returns the backend health status with a **10-second timeout**. Used to verify backend connectivity.

---

## 6. $CHAR Token

| Property | Value |
|---|---|
| Name | Charlie Bull |
| Ticker | $CHAR |
| Standard | ERC-20 |
| Total Supply | 420,690,000,000 (420.69 Billion) |
| Contract Address | `0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1` |
| Contract Consistency | **Same address on all 9 chains** |
| Bridge Technology | Axelar Network + Squid Router |

### Token Distribution
| Allocation | % | Tokens | Purpose |
|---|---|---|---|
| Liquidity | 50% | 210.345B | DEX Liquidity Pools (locked) |
| Community | 35% | 147.241B | Community Airdrop |
| Team & Dev | 15% | 63.103B | IP and Project Expansion |

### 9-Chain Deployment
| Chain | DEX |
|---|---|
| Base ⭐ | Aerodrome (primary pool) |
| Ethereum | Uniswap |
| Arbitrum | Uniswap |
| Polygon | QuickSwap |
| Avalanche | LFGJ |
| BNB Chain | PancakeSwap |
| Mantle | Fusion X |
| Linea | Linea DEX |
| Blast | Blast DEX |

---

## 7. $BULL Token

| Property | Value |
|---|---|
| Name | $BULL |
| Platform | Pump.fun (Solana) |
| Supply | 1,000,000,000 (1 Billion) |
| Purpose | Educational token + community engagement |

**Graduation mechanics:**
- When $BULL graduates on Pump.fun: **1 Billion $CHAR is permanently burned** from the locked liquidity allocation
- A **CHAR/BULL swap pair** launches on **Raydium** post-graduation
- $BULL holders gain **early access to mint Charlie's Angels NFT collection**

---

## 8. Charlie AI Agent

Charlie is an autonomous AI agent running in the `charlie-ai-server` backend. He operates across four platforms:

| Platform | Handle | Status | Notes |
|---|---|---|---|
| Bluesky | @charliebull.art | ✅ Full auto-replies active | Posts 2× daily + real-time reply to mentions/comments |
| X/Twitter | @CharlieBullArt | 🔄 Posts only | 2× daily scheduled posts. Auto-replies require X API Basic tier (not yet upgraded) |
| Telegram | @Charlie_Bull_bot | ✅ Active | Unlimited chat. Use `/woof` command to start |
| Website | charliebull.art | ✅ Active | Full conversational chat via ChatWidget |

**Posting system:**
- **14 topic categories:** Chain spotlights, tokenomics, $CHAR TGE roadmap, $BULL Pump.fun mechanics, 1B $CHAR burn event, NFT collection, bridge tech (Axelar/Squid), same contract on 9 chains, Base L2 benefits, community airdrop (35%), DeFi education, market perspectives, humor, community questions
- **7 post structure types:** Educational fact, Opinion, Story, Announcement, Fun/humor, Question to community, Comparison
- **14-post memory:** Prevents topic/structure repetition
- **Schedule:** 8:00 AM daily + alternating 5:00 PM / 9:00 PM

**AI model:** Google Gemini (configured in `charlie-ai-server`)  
**Infrastructure:** AWS EC2 (configured in `charlie-ai-server`)  
**Signature:** Every Charlie response ends with `- Charlie AI 🐾🐶`

---

## 9. Roadmap

| Quarter | Milestone | Status |
|---|---|---|
| Q4 2025 | Charlie AI launched across Telegram, Bluesky, X/Twitter. Website chat live. Bluesky auto-replies active. | ✅ Complete |
| Q1 2026 | AI growth & analysis. Server infrastructure upgrades. Topic variety improvements. 14-topic/7-structure system deployed. X/Twitter free tier stabilization. | 🔄 Current |
| Q2 2026 | Submit token update forms on CoinGecko and Etherscan prior to $CHAR TGE | ⏳ Upcoming |
| Q3 2026 | $CHAR Token Generation Event (TGE) — launch initial 50% liquidity pool on Aerodrome (Base). Begin cross-chain bridging via Axelar + Squid Router. | ⏳ Upcoming |
| Q3–Q4 2026 | Full 9-chain deployment: Polygon (QuickSwap), BSC (PancakeSwap), Mantle (Fusion X), Linea, Blast | ⏳ Upcoming |
| Q4 2026 | $BULL launch on Pump.fun (Solana). Upon graduation: 1B $CHAR permanently burned. Weekly podcasts on Pump.fun. | ⏳ Upcoming |
| Q1 2027 | Base ↔ Solana bridge. CHAR/BULL swap pair launches on Raydium. | ⏳ Upcoming |
| Q2 2027 | Charlie's Angels NFT collection launches on Solana. IP partnerships, merchandise, multimedia. | ⏳ Upcoming |
| Q3 2027+ | DeFi utilities, governance implementation, strategic partnerships, Web3 expansion. | ⏳ Future |

---

## 10. Deployment

- **Platform:** Vercel
- **Trigger:** Every push to `main` branch auto-deploys
- **Domain:** charliebull.art
- **Branch strategy:** Feature work done on separate branches (e.g. `node-js-upgrade`), merged to `main` via fast-forward when ready

### Deploy checklist
1. Ensure `AI_SERVER_URL` is set in Vercel environment variables
2. Verify `/api/healthz` returns 200 after deploy
3. Test chat widget sends/receives messages with history
4. Verify `/docs` renders Woof Paper correctly

---

## 11. Known Issues & Important Notes

### CSS Import Order (CRITICAL)
In `styles/globals.css`, the squid.css import **must come before** `@tailwind` directives:
```css
/* ✅ Correct */
@import '../styles/squid.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Reversing this order breaks the build.

### Squid Widget React 19 Compatibility
`SquidWidgetWrapper.tsx` wraps the widget in `QueryClientProvider` from `@tanstack/react-query`. This is required for React 19 — do not remove it.

### CopyButton Must Be a Client Component
`CopyButton.tsx` uses `'use client'` because it calls `navigator.clipboard.writeText()`. It cannot be inlined into `app/docs/page.tsx` (which is a Server Component). Always keep it as a separate client component.

### X/Twitter Auto-Replies
Auto-replies on X/Twitter are **not active**. They require the X API Basic tier. Do not document them as active anywhere. Bluesky auto-replies are fully active.

### Security
- **CVE-2025-55182** (Next.js RCE) was patched by upgrading from 14.2.15 → 16.0.10
- Always check for Next.js CVEs before staying on any version long-term

---

## 12. Social Links

| Platform | Link / Handle |
|---|---|
| Website | https://charliebull.art |
| Woof Paper | https://charliebull.art/docs |
| X/Twitter | https://x.com/CharlieBullArt |
| Bluesky | https://bsky.app/profile/charliebull.art |
| Telegram Bot | @Charlie_Bull_bot |
| Telegram Group | (community group — check with founder for current link) |
| Founder LinkedIn | https://www.linkedin.com/in/viktor-khachatryan-78a6a064/ |

---

## 13. Related Repository

The `charlie-ai-server` repository contains:
- Node.js REST API backend
- Google Gemini AI integration and system prompt
- Bluesky bot (auto-posting + auto-replies)
- X/Twitter scheduled post automation
- Telegram bot (session management, /woof command)
- The full knowledge base Charlie is trained on
- AWS EC2 deployment configuration

See `PROJECT_CONTEXT.md` in `charlie-ai-server` for full backend documentation.

---

*This file should be updated whenever significant architecture, roadmap, or platform status changes are made.*
