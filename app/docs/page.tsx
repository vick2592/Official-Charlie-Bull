import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charlie Bull - Whitepaper",
  description: "Official whitepaper for Charlie Bull, the first cross-chain AI pup on Ethereum",
};

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-creambeige">
            Charlie Bull Whitepaper
          </h1>
          <p className="text-xl text-base-content/70">
            The First Cross-Chain AI Pup on Ethereum
          </p>
          <div className="mt-6">
            <span className="badge badge-primary badge-lg">Version 1.0</span>
          </div>
        </header>
        
        <div className="bg-base-200 rounded-lg shadow-lg p-8">
          {/* Table of Contents */}
          <nav className="mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              <li><a href="#abstract" className="link link-info no-underline">Abstract</a></li>
              <li><a href="#introduction" className="link link-info no-underline">1. Introduction</a></li>
              <li><a href="#technology" className="link link-info no-underline">2. Technology Stack</a></li>
              <li><a href="#tokenomics" className="link link-info no-underline">3. Tokenomics</a></li>
              <li><a href="#roadmap" className="link link-info no-underline">4. Roadmap</a></li>
              <li><a href="#team" className="link link-info no-underline">5. Team</a></li>
            </ul>
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
            </div>
          </section>
          
          {/* Tokenomics */}
          <section id="tokenomics" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">3. Tokenomics</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Allocation</th>
                    <th>Percentage</th>
                    <th>Tokens</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Liquidity</td>
                    <td>50%</td>
                    <td>210,345,000,000,000</td>
                    <td>DEX Liquidity Pools</td>
                  </tr>
                  <tr>
                    <td>Community</td>
                    <td>35%</td>
                    <td>147,241,500,000,000</td>
                    <td>Community Rewards & Airdrops</td>
                  </tr>
                  <tr>
                    <td>Team & Development</td>
                    <td>15%</td>
                    <td>63,103,500,000,000</td>
                    <td>IP and Project Expansion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Roadmap */}
          <section id="roadmap" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">4. Roadmap</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q3 2025 - Token Generation Event</h3>
                  <p className="text-base-content/70">Launch $CHAR token with initial liquidity on Base L2</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q3 - Q4 2025 - Cross-Chain Expansion</h3>
                  <p className="text-base-content/70">Bridge and Provide Liquidity on Arbitrum, Ethereum, 
                  Avalanche and other supported networks on Axelar.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">End Q4 2025 - AI integration</h3>
                  <p className="text-base-content/70">Launch an interactive Charlie&apos;s AI character on Telegram and BlueSky</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-lg">Q1 2026 and Beyond - NFT launch and IP Developments</h3>
                  <p className="text-base-content/70">Launch Charlie&apos;s Angels NFT collection and 
                  develop Charlie Bull&apos;s IP.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Team */}
          <section id="team" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">5. Team</h2>
            <p className="mb-4">
              The Charlie Bull team consists of experienced blockchain developers, 
              artists, and community builders dedicated to creating the most accessible 
              cross-chain experience in cryptocurrency.
            </p>
          </section>
          
          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-base-300">
            <p className="text-sm text-base-content/60">
              This whitepaper is for informational purposes only.
            </p>
                  <div className="mt-4">
            <p className="text-sm text-base-content/60">
              © 2025 Charlie Bull.
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