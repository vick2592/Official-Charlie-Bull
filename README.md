# 🐶 Charlie Bull

<h4 align="center">
  <a href="https://charliebull.art">Website</a>
</h4>

🦮 Welcome to Charlie Bull, the most lovable meme coin on the Ethereum blockchain! Charlie Bull is here to bring joy and fun to the world of decentralized applications (dapps). With Charlie Bull, you can easily take apart of our awesome community and swap any of your tokens on any EVM chain within our awesome network.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Meme Coin Overload**: Your frontend auto-adapts to Charlie as you HODL it.

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart for Local Testing

To get started with Charlie Bull, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd official-charlie-bull
yarn install


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

2. Running Charlie Bull locally:

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Contributing to Charlie Bull

We welcome contributions to Charlie Bull!

Reach out to @CharlieBullArt on X or @NBigOnIsig on Instagram.

## AI Server Proxy

The frontend calls internal API routes which proxy to the external Charlie AI server.

- Configure the backend URL via `.env.local` (not checked into git):

```
AI_SERVER_URL=<YOUR_AI_SERVER_URL>
```

- Routes (App Router):
  - `GET /api/healthz` → proxies to `${AI_SERVER_URL}/healthz`
  - `POST /api/chat` → proxies to `${AI_SERVER_URL}/v1/chat`

Notes:
- We preserve upstream status codes and return `application/json`.
- Timeouts: 10s for health, 15s for chat.
- Do not prefix with `NEXT_PUBLIC_`; the URL stays server-side only.