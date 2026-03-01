import type { Metadata } from "next";
import CopyButton from "@/components/CopyButton";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Charlie Bull - Woof Paper v1.0.3 | Complete Tokenomics",
  description: "Official Woof Paper for Charlie Bull ($CHAR): 420.69 billion supply across 9 Ethereum chains. Comprehensive tokenomics, utility, and cross-chain documentation.",
};

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-creambeige">
            Charlie Bull Woof Paper
          </h1>
          <p className="text-xl text-base-content/70">
            The First Cross-Chain AI Pup on Ethereum
          </p>
          <div className="mt-6 flex justify-center gap-4 items-center">
            <span className="badge badge-primary badge-lg">Version 1.0.3</span>
            <span className="badge badge-secondary badge-lg">March 1, 2026</span>
          </div>
        </header>
        
        <div className="bg-base-200 rounded-lg shadow-lg p-8">
          {/* Table of Contents */}
          <nav className="mb-10">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer select-none list-none bg-base-100 hover:bg-primary/10 transition-colors rounded-xl px-5 py-4 font-semibold text-lg border border-base-300">
                <span>📋 Table of Contents</span>
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <ul className="mt-2 rounded-xl border border-base-300 bg-base-100 overflow-hidden divide-y divide-base-200">
                {[
                  ["#abstract", "Abstract"],
                  ["#introduction", "1. Introduction"],
                  ["#technology", "2. Technology Stack"],
                  ["#charlie-ai", "3. Charlie AI Agent"],
                  ["#tokenomics", "4. Tokenomics"],
                  ["#roadmap", "5. Roadmap"],
                  ["#team", "6. Team"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="block px-5 py-3 text-base-content hover:bg-primary/10 hover:text-primary transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
          
          {/* Abstract */}
          <section id="abstract" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Abstract</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Charlie Bull ($CHAR) represents a paradigm shift in cross-chain cryptocurrency, 
              combining advanced blockchain interoperability with character-driven community engagement. 
              Built on Ethereum with native multi-chain functionality via Axelar Network and Squid Router, 
              Charlie Bull enables seamless token transfers across nine major blockchain ecosystems while 
              providing educational resources that make cryptocurrency accessible to newcomers.
            </p>
          </section>
          
          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">1. Introduction</h2>
            <h3 className="text-xl font-semibold mb-3">1.1 Problem Statement</h3>
            <p className="mb-4">
              The cryptocurrency ecosystem suffers from significant fragmentation, with users often 
              locked into isolated blockchain networks. This fragmentation creates barriers to entry 
              for newcomers and limits the utility of digital assets across different ecosystems.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">1.2 Solution Overview</h3>
            <p className="mb-4">
              Charlie Bull addresses these challenges through a comprehensive cross-chain infrastructure 
              that enables seamless token transfers and provides tools that enable Liquidity Provisioning and supporting
              cross-chain DEX operations.
            </p>
          </section>
          
          {/* Technology Stack */}
          <section id="technology" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">2. Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Axelar Network</h3>
                <p>Provides secure cross-chain communication and asset transfers across supported networks.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Squid Router</h3>
                <p>Optimizes token swapping and bridging operations for the best user experience.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Base ↔ Solana Bridge</h3>
                <p>Enables $CHAR to bridge to Solana, unlocking deep liquidity on top Solana DEXs and expanding cross-ecosystem utility.</p>
              </div>
            </div>
          </section>

          {/* Charlie AI Agent */}
          <section id="charlie-ai" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">3. Charlie AI Agent</h2>

            <p className="mb-6">
              Charlie is an AI-powered social agent that posts, engages, and educates the community across multiple platforms. 
              He runs autonomously on a backend server (AWS EC2), posting original content twice daily and responding to community interactions in real time.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Website Chat</h3>
                <p>Chat with Charlie directly on <a href="https://charliebull.art" className="link link-info">charliebull.art</a>. Ask about tokenomics, bridges, DeFi strategies, or anything $CHAR-related.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Telegram Bot</h3>
                <p>Interact with <strong>@Charlie_Bull_bot</strong> on Telegram. Use the <code>/woof</code> command to begin interacting with Charlie.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Bluesky</h3>
                <p>Follow Charlie at <a href="https://bsky.app/profile/charliebull.art" className="link link-info" target="_blank" rel="noopener noreferrer">@charliebull.art</a> on Bluesky. Charlie posts 2x daily and <strong>automatically replies</strong> to mentions and comments.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">X / Twitter</h3>
                <p>Follow Charlie at <a href="https://x.com/charliebullart" className="link link-info" target="_blank" rel="noopener noreferrer">@CharlieBullArt</a>. Charlie posts 2x daily. 
                Auto-replies to mentions are not yet active — they require the X API Basic tier and will be enabled in a future upgrade.</p>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h3 className="text-xl font-semibold mb-4">How Charlie Posts</h3>
              <p className="mb-4 text-base-content/80">
                Charlie&apos;s posts rotate across <strong>14 topic categories</strong> and <strong>7 post structure types</strong>, 
                with a 14-post memory to prevent repetition. This ensures every post feels fresh and covers the full ecosystem.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2">📚 Topics (14 categories)</h4>
                  <ul className="text-sm text-base-content/80 space-y-1 list-disc list-inside">
                    <li>Chain spotlights (Base, Arbitrum, Ethereum…)</li>
                    <li>Tokenomics facts &amp; $CHAR TGE roadmap</li>
                    <li>$BULL Pump.fun launch &amp; graduation mechanics</li>
                    <li>1B $CHAR burn event</li>
                    <li>NFT collection on Solana</li>
                    <li>Bridge tech (Axelar Network / Squid Router)</li>
                    <li>Same contract address across 9 chains</li>
                    <li>Base L2 benefits, community airdrop (35%)</li>
                    <li>DeFi education, market perspectives, humor</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">🗂️ Post Structures (7 types)</h4>
                  <ul className="text-sm text-base-content/80 space-y-1 list-disc list-inside">
                    <li>Educational fact</li>
                    <li>Opinion</li>
                    <li>Story</li>
                    <li>Announcement</li>
                    <li>Fun / humor</li>
                    <li>Question to community</li>
                    <li>Comparison</li>
                  </ul>
                  <div className="mt-4 text-sm text-base-content/70">
                    <strong>Schedule:</strong> 8:00 AM daily + alternating 5:00 PM / 9:00 PM
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Tokenomics */}
          <section id="tokenomics" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">4. Tokenomics</h2>
            
            <p className="text-lg mb-8">
              Charlie Bull&apos;s tokenomics are designed for sustainable growth, deep liquidity, and genuine community empowerment.
            </p>

            {/* Token Overview */}
            <div id="token-overview" className="mb-8 bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Image src="/token-main.svg" alt="Charlie Bull Token" width={32} height={32} />
                Token Overview
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-base-100 p-4 rounded-lg">
                  <div className="text-sm text-base-content/60">Token Name</div>
                  <div className="text-xl font-bold">Charlie Bull</div>
                </div>
                
                <div className="bg-base-100 p-4 rounded-lg">
                  <div className="text-sm text-base-content/60">Ticker</div>
                  <div className="text-xl font-bold">$CHAR</div>
                </div>
                
                <div className="bg-base-100 p-4 rounded-lg">
                  <div className="text-sm text-base-content/60">Total Supply</div>
                  <div className="text-xl font-bold">420,690,000,000</div>
                  <div className="text-sm text-base-content/60">(420.69 Billion)</div>
                </div>
                
                <div className="bg-base-100 p-4 rounded-lg">
                  <div className="text-sm text-base-content/60">Token Standard</div>
                  <div className="text-xl font-bold">ERC-20</div>
                </div>
              </div>

              <div className="bg-base-100 p-4 rounded-lg">
                <div className="text-sm text-base-content/60 mb-2">Contract Address (Same on all 9 chains)</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-sm font-mono bg-base-300 px-3 py-2 rounded break-all flex-1">
                    0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1
                  </code>
                  <CopyButton text="0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1" />
                </div>
              </div>
            </div>

            {/* Cross-Chain Deployment */}
            <div id="cross-chain" className="mb-8 bg-secondary/5 p-6 rounded-xl border border-secondary/20">
              <h3 className="text-2xl font-bold mb-4">🔗 Cross-Chain Deployment</h3>
              
              <p className="mb-4">
                $CHAR is deployed on <strong>9 Ethereum-compatible chains</strong> with the same contract address:
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Base</div>
                  <div className="text-sm text-base-content/60">Aerodrome ⭐</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Ethereum</div>
                  <div className="text-sm text-base-content/60">Uniswap</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Arbitrum</div>
                  <div className="text-sm text-base-content/60">Uniswap</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Polygon</div>
                  <div className="text-sm text-base-content/60">QuickSwap</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Avalanche</div>
                  <div className="text-sm text-base-content/60">LFGJ</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">BNB Chain</div>
                  <div className="text-sm text-base-content/60">PancakeSwap</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Mantle</div>
                  <div className="text-sm text-base-content/60">Fusion X</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Linea</div>
                  <div className="text-sm text-base-content/60">Linea DEX</div>
                </div>
                <div className="bg-base-100 p-3 rounded-lg">
                  <div className="font-bold">Blast</div>
                  <div className="text-sm text-base-content/60">Blast DEX</div>
                </div>
              </div>
            </div>

            {/* Token Distribution Table */}
            <h3 className="text-2xl font-bold mb-4">📊 Token Distribution</h3>
            <div className="rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="table w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary/10">
                      <th className="border border-base-300">Allocation</th>
                      <th className="border border-base-300">%</th>
                      <th className="border border-base-300">Tokens (Millions)</th>
                      <th className="border border-base-300 hidden sm:table-cell">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-base-300 font-semibold">Liquidity</td>
                      <td className="border border-base-300">50%</td>
                      <td className="border border-base-300">210,345.0M</td>
                      <td className="border border-base-300 hidden sm:table-cell">DEX Liquidity Pools</td>
                    </tr>
                    <tr>
                      <td className="border border-base-300 font-semibold">Community</td>
                      <td className="border border-base-300">35%</td>
                      <td className="border border-base-300">147,241.5M</td>
                      <td className="border border-base-300 hidden sm:table-cell">Community Airdrop</td>
                    </tr>
                    <tr>
                      <td className="border border-base-300 font-semibold">Team & Dev</td>
                      <td className="border border-base-300">15%</td>
                      <td className="border border-base-300">63,103.5M</td>
                      <td className="border border-base-300 hidden sm:table-cell">IP and Project Expansion</td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Mobile Purpose Legend */}
                <div className="mt-4 sm:hidden">
                  <div className="text-sm space-y-2">
                    <div><span className="font-semibold">Liquidity:</span> DEX Liquidity Pools</div>
                    <div><span className="font-semibold">Community:</span> Community Airdrop</div>
                    <div><span className="font-semibold">Team & Dev:</span> IP and Project Expansion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Allocation Explanations */}
            <div className="mt-8 space-y-4">
              <div className="bg-accent/5 p-6 rounded-xl border border-accent/20">
                <h4 className="text-xl font-bold mb-3">🌊 50% Liquidity (210.345B $CHAR)</h4>
                <ul className="list-disc list-inside space-y-2 text-base-content/80">
                  <li>Distributed across 9 major blockchain networks</li>
                  <li>Locked liquidity on all DEXs for security and stability</li>
                  <li>Primary pool on Base via Aerodrome for optimal trading</li>
                  <li>Ensures deep liquidity and minimal slippage for all trades</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <h4 className="text-xl font-bold mb-3">🎁 35% Community (147.241B $CHAR)</h4>
                <ul className="list-disc list-inside space-y-2 text-base-content/80">
                  <li>Fair airdrop to early supporters and community members</li>
                  <li>Staking rewards for long-term holders</li>
                  <li>Community governance participation incentives</li>
                  <li>Special rewards for NFT holders and ecosystem participants</li>
                </ul>
              </div>

              <div className="bg-secondary/5 p-6 rounded-xl border border-secondary/20">
                <h4 className="text-xl font-bold mb-3">🛠️ 15% Team & Development (63.103B $CHAR)</h4>
                <ul className="list-disc list-inside space-y-2 text-base-content/80">
                  <li>Ongoing development and platform improvements</li>
                  <li>Marketing and strategic partnerships</li>
                  <li>IP development and content creation</li>
                  <li>Team compensation with vesting schedule</li>
                </ul>
              </div>
            </div>

            {/* $BULL Educational Token */}
            <div id="bull-token" className="mt-12 bg-warning/5 p-6 rounded-xl border border-warning/30">
              <h3 className="text-2xl font-bold mb-4">🎓 $BULL: The Educational Token</h3>
              
              <div className="mb-4">
                <div className="badge badge-warning mb-2">Pump.fun Launch</div>
                <p className="text-base-content/80">
                  <strong>$BULL</strong> is a 1 billion token educational experiment on Pump.fun, designed to demonstrate 
                  community-driven token mechanics and bridge to the main $CHAR ecosystem.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-base-100 p-4 rounded-lg">
                  <div className="text-sm text-base-content/60">Supply</div>
                  <div className="text-xl font-bold">1,000,000,000</div>
                  <div className="text-sm text-base-content/60">(1 Billion)</div>
                </div>
                
                <div className="bg-base-100 p-4 rounded-lg">
                  <div className="text-sm text-base-content/60">Platform</div>
                  <div className="text-xl font-bold">Pump.fun</div>
                  <div className="text-sm text-base-content/60">(Solana)</div>
                </div>
              </div>

              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-bold mb-2">🎯 $BULL Benefits:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-base-content/80">
                  <li>Community-driven liquidity growth experiment</li>
                  <li>Early access to Charlie Bull NFT collection on graduation</li>
                  <li>Educational content on tokenomics and DeFi mechanics</li>
                  <li>CHAR/BULL swap pair launched on Raydium post-graduation</li>
                  <li>Integration phases with main $CHAR ecosystem</li>
                </ul>
              </div>

              <div className="mt-4 text-sm text-base-content/70 italic">
                <strong>Note:</strong> $BULL serves as an educational tool and community engagement mechanism. 
                Upon reaching graduation milestones on Pump.fun, the 1 billion $CHAR tokens that were locked from the liquidity allocation will be permanently burned to maintain the normalized total supply. 
                A CHAR/BULL swap pair will be launched on Raydium, and $BULL holders will gain early access to the Charlie Bull NFT collection and other exclusive community benefits within the $CHAR ecosystem.
              </div>
            </div>
          </section>
          
          {/* Roadmap */}
          <section id="roadmap" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🗺️ 5. Roadmap</h2>
            
            <p className="text-lg mb-8 text-base-content/80">
              Our strategic roadmap outlines key milestones from AI integration to NFT launches and beyond.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q4 2025 — AI Integration ✅</h3>
                  <p className="text-base-content/70">Charlie AI launched across Telegram, Bluesky, and X/Twitter. Website chat live. Automated social posting goes live with real-time Bluesky reply support.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-secondary/5 p-4 rounded-lg border-l-4 border-secondary">
                <div className="w-4 h-4 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q1 2026 — AI Growth &amp; Analysis 🔄</h3>
                  <p className="text-base-content/70">
                    Server infrastructure upgrades, topic variety improvements, and AI fine-tuning based on real community engagement data. 
                    X/Twitter free tier stabilization. 14-topic rotation system and 7 post-structure types deployed. Ongoing analysis of social growth metrics across all platforms.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-accent/5 p-4 rounded-lg border-l-4 border-accent">
                <div className="w-4 h-4 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q2 2026 — Receive approval from Coingecko and Etherscan ⏳</h3>
                  <p className="text-base-content/70">
                    Submit token Update forms on Coingecko and Etherscan prior to $CHAR TGE on Base via Aerodrome.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q3 2026 — $CHAR Token TGE on Aerodrome ⏳</h3>
                  <p className="text-base-content/70">
                    Launch the initial 50% Liquidity pool on Aerodrome to enable trading and price discovery. Begin cross-chain bridging to other networks via Axelar and Squid Router, starting with Ethereum and Arbitrum.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q3-Q4 2026 — Cross-Chain Expansion ⏳</h3>
                  <p className="text-base-content/70">
                    Bridge and provide liquidity on remaining chains: Polygon (QuickSwap), BSC (PancakeSwap), Mantle (Fusion X), Linea, and Blast. 
                    Full 9-chain $CHAR deployment complete via Squid Router.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q4 2026 — $BULL Launch &amp; Token Burn ⏳</h3>
                  <p className="text-base-content/70">
                    Join Charlie Bull to trade 1B $BULL tokens on (Solana) and watch weekly podcasts from the Charlie Bull team on Pump.fun. Upon graduation: 1B $CHAR permanently burned from locked liquidity on Ethereum. 
                    $BULL holders gain exclusive early access to mint Charlie&apos;s Angels NFT collection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q1 2027 — $CHAR to $BULL SOL Bridge ⏳</h3>
                  <p className="text-base-content/70">
                    Bridge $CHAR to Solana and trade it for $BULL token and vice versa with the new  
                    CHAR/BULL swap pair launched on Raydium.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-secondary/5 p-4 rounded-lg border-l-4 border-secondary">
                <div className="w-4 h-4 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q2 2027 — NFT Launch &amp; IP Development ⏳</h3>
                  <p className="text-base-content/70">
                    Charlie&apos;s Angels NFT collection launches on Solana with exclusive benefits for $BULL graduates and token holders. 
                    Expand Charlie Bull IP through partnerships, merchandise, and multimedia content.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-accent/5 p-4 rounded-lg border-l-4 border-accent">
                <div className="w-4 h-4 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q3 2027 &amp; Beyond — Ecosystem Expansion ⏳</h3>
                  <p className="text-base-content/70">
                    Continuous development of DeFi utilities, governance implementation, strategic partnerships, 
                    and expansion of the Charlie Bull universe across Web3 platforms.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Team */}
          <section id="team" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">6. Team</h2>
            <div className="space-y-4">
              <div className="bg-base-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold">Founder</h3>
                <p className="mt-2">
                  <a href="https://www.linkedin.com/in/viktor-khachatryan-78a6a064/" target="_blank" rel="noopener noreferrer" className="link link-info">
                    Viktor Khachatryan 
                  </a>
                   <span> — Full Stack Developer.</span> 
                </p>
                <p className="mt-3">
                  The Charlie Bull team consists of experienced blockchain 
                  developers, artists, and community builders dedicated to 
                  creating the most accessible cross-chain experience in 
                  cryptocurrency.
                </p>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-base-300">
            <p className="text-sm text-base-content/60">
              This whitepaper is for informational purposes only.
            </p>
                  <div className="mt-4">
            <p className="text-sm text-base-content/60">
              © {new Date().getFullYear()} Charlie Bull.
            </p>
            </div>
            <div className="mt-4">
              <a href="/" className="btn btn-primary">
                Back to Charlie Bull
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}