"use client";

import { useEffect, useRef } from "react";
import Image from "next/legacy/image";
import { TokenAddress } from "./TokenAddress";
import ErrorBoundary from "./ErrorBoundary";
import { SquidWidgetWrapper } from "./SquidWidgetWrapper";

export function LandingPage() {
  // Create separate refs for each animated section
  const homeRef = useRef<HTMLDivElement>(null);
  const howToBuyRef = useRef<HTMLDivElement>(null);
  const tokenomicsRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  
  // Individual refs for subsections that need their own fade animations
  const axelarLogoRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const chainLogosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    // Add all refs to be observed
    [
      homeRef, howToBuyRef, tokenomicsRef, roadmapRef, 
      axelarLogoRef, step1Ref, step2Ref, step3Ref, chainLogosRef
    ].forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);

        if (ref.current.getBoundingClientRect().top < window.innerHeight) {
          ref.current.classList.add("fade-in");
          observer.unobserve(ref.current);
        }
      }
    });

    return () => {
      [
        homeRef, howToBuyRef, tokenomicsRef, roadmapRef, 
        axelarLogoRef, step1Ref, step2Ref, step3Ref, chainLogosRef
      ].forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="bg-base-100 flex flex-col flex-grow">
      <section id="home" ref={homeRef} className="pt-[calc(var(--header-height)+1.5rem)] lg:pt-8">
        <div className="flex flex-col mt-7 items-center">
          {/* Chat CTA simple text + button */}
          <div className="mt-4 w-full px-4">
              <div className="mx-auto max-w-3xl text-center">
              <div className="text-4xl md:text-5xl leading-tight">
                <span className="font-creambeige font-bold">WELCOME</span>
                <br />
                <span className="text-2xl md:text-3xl">Chat with <span className="font-creambeige">Charlie</span> now!</span>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-primary btn-md chat-cta-btn"
                  aria-label="Open chat with Charlie"
                  onClick={() => { document.dispatchEvent(new Event('charlie:openChat')); }}
                >
                  Chat now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-5 mb-4">
          <Image
            src="/charlie-pant.gif"
            alt="Charlie Panting"
            width={400}
            height={400}
            className="rounded-lg h-auto"
            unoptimized
            priority
          />
        </div>
        
        <div className="flex flex-col items-center mt-4 mb-8 animate-bounce">
          <p className="text-lg font-bold mb-2">Available on 9 chains and counting!</p>
          <a 
            href="#buy-it-now" 
            onClick={(e) => {
              e.preventDefault();
              
              // Reuse the same logic from Header component
              const id = "buy-it-now";
              const element = document.getElementById(id);
              
              if (!element) return;
              
              // Find the header and get its height
              const header = document.querySelector('.header');
              const headerHeight = header ? header.getBoundingClientRect().height : 0;
              
              // Calculate position
              const rect = element.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              
              // Find the nearest hr element (border) if it exists
              const prevHr = element.previousElementSibling;
              
              // If there's an hr element before this section, scroll to it instead
              if (prevHr && prevHr.tagName.toLowerCase() === 'hr') {
                const hrRect = prevHr.getBoundingClientRect();
                const hrPosition = hrRect.top + scrollTop;
                
                window.scrollTo({
                  top: hrPosition - headerHeight,
                  behavior: 'smooth'
                });
              } else {
                const elementTop = rect.top + scrollTop;
                
                window.scrollTo({
                  top: elementTop - headerHeight,
                  behavior: 'smooth'
                });
              }
              
              // Update URL
              window.history.pushState(null, '', `#${id}`);
            }}
            className="btn btn-primary btn-md"
          >
            Get $CHAR
          </a>
          <div className="flex justify-center mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-secondary w-full" />

      <section id="buy-it-now" ref={howToBuyRef} className="pt-16 lg:pt-8">
        <div className="px-5">
          <div className="text-4xl text-center font-bold mb-7">
            <span>Buy it Now</span>
          </div>
          
          <div className="flex justify-center items-center mt-4">
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-xl font-semibold mb-3"><span className="font-creambeige">$CHAR</span> Token address:</p>
              <TokenAddress address="0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1" />
              {/* <p className="text-sm text-base-content/70 mt-2">(Click to copy)</p> */}
            </div>
          </div>
          <div id="SquidWidget" className="flex justify-center items-center p-10">
            <ErrorBoundary>
              <SquidWidgetWrapper />
            </ErrorBoundary>
          </div>
          <div className="flex justify-center items-center py-7" ref={axelarLogoRef}>
            <div className="text-3xl text-gray-600 dark:text-gray-400">Powered by</div>
            <a href="https://interchain.axelar.dev/arbitrum/0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1" target="_blank" className="mx-5" rel="noopener noreferrer">
              <Image src="/AxelarLogo.png" alt="Axelar Logo" width={75} height={75} className="rounded-lg opacity-85" />
            </a>
            <div className="text-3xl text-gray-600 dark:text-gray-400"> & </div>
            <a href="https://www.squidrouter.com/" className="mx-5" target="_blank" rel="noopener noreferrer">
              <Image src="/SquidLogo.png" alt="Squid Logo" width={75} height={75} className="rounded-lg opacity-85" />
            </a>
          </div>
        </div>
      </section>

      {/* <hr className="border-t-2 border-secondary w-full" />

      <section id="ai-integration" ref={aiRef} className="pt-20 lg:pt-10">
        <div className="px-5">
          <div className="text-4xl text-center font-bold">Charlie X AI16Z</div>
        </div>
      </section> */}

      <hr className="border-t-2 border-secondary w-full mt-8" />

      <section id="tokenomics" ref={tokenomicsRef} className="pt-16 lg:pt-8">
        <div className="text-4xl pb-8 text-center font-bold">Tokenomics</div>

        {/* Tokenomics Breakdown */}
        <div className="max-w-4xl mx-auto px-5 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            
            {/* Pie Chart */}
            <div className="relative w-80 h-80">
              <svg className="w-full h-full transform -rotate-90 transition-all duration-300" viewBox="0 0 200 200" aria-label="Tokenomics chart">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="oklch(var(--b3))"
                  strokeWidth="30"
                  opacity="0.3"
                />
                
                {/* Liquidity Pool - 50% */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="#5A86C0"
                  strokeWidth="30"
                  strokeDasharray="251.33 251.33"
                  strokeDashoffset="0"
                  className="transition-all duration-300 cursor-pointer liquidity-segment"
                  style={{ strokeLinecap: 'round' }}
                />
                
                {/* Community Airdrop - 35% */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="#C1D4F0"
                  strokeWidth="30"
                  strokeDasharray="175.93 326.73"
                  strokeDashoffset="-251.33"
                  className="transition-all duration-300 delay-300 cursor-pointer community-segment"
                  style={{ strokeLinecap: 'round' }}
                />
                
                {/* Team & Development - 15% */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="#70D0DC"
                  strokeWidth="30"
                  strokeDasharray="75.4 425.86"
                  strokeDashoffset="-427.26"
                  className="transition-all duration-300 delay-600 cursor-pointer team-segment"
                  style={{ strokeLinecap: 'round' }}
                />
                
                {/* Center token image overlay is positioned outside the SVG for Safari compatibility */}
              </svg>

              {/* Absolutely centered overlay for the spinning token (avoids SVG foreignObject on iOS Safari) */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Image
                  src="/token-main.svg"
                  alt="Charlie Token"
                  width={130}
                  height={130}
                  className="animate-spin-slow hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              
              {/* Separate hoverable elements for each segment - CORRECTED POSITIONS */}
              <div className="absolute inset-0">
                {/* Liquidity Pool hover element - 50% (RIGHT HALF - blue segment) */}
                <div 
                  className="absolute top-0 right-0 w-1/2 h-full cursor-pointer transition-all duration-300 hover:scale-102"
                  onMouseEnter={() => {
                    const legend = document.querySelector('[data-legend="liquidity"]');
                    const segment = document.querySelector('.liquidity-segment');
                    if (legend) {
                      legend.classList.add('scale-105', 'bg-primary/8', 'rounded-lg', 'p-1', '-m-1');
                    }
                    if (segment) {
                      segment.setAttribute('stroke-width', '35');
                    }
                  }}
                  onMouseLeave={() => {
                    const legend = document.querySelector('[data-legend="liquidity"]');
                    const segment = document.querySelector('.liquidity-segment');
                    if (legend) {
                      legend.classList.remove('scale-105', 'bg-primary/8', 'rounded-lg', 'p-1', '-m-1');
                    }
                    if (segment) {
                      segment.setAttribute('stroke-width', '30');
                    }
                  }}
                ></div>
                
                {/* Community Airdrop hover element - 35% (BOTTOM LEFT - light blue segment) */}
                <div 
                  className="absolute bottom-0 left-0 w-3/5 h-3/5 cursor-pointer transition-all duration-300 hover:scale-102"
                  style={{
                    clipPath: 'polygon(0% 20%, 0% 100%, 80% 100%, 100% 50%, 20% 0%)'
                  }}
                  onMouseEnter={() => {
                    const legend = document.querySelector('[data-legend="community"]');
                    const segment = document.querySelector('.community-segment');
                    if (legend) {
                      legend.classList.add('scale-105', 'bg-secondary/8', 'rounded-lg', 'p-1', '-m-1');
                    }
                    if (segment) {
                      segment.setAttribute('stroke-width', '35');
                    }
                  }}
                  onMouseLeave={() => {
                    const legend = document.querySelector('[data-legend="community"]');
                    const segment = document.querySelector('.community-segment');
                    if (legend) {
                      legend.classList.remove('scale-105', 'bg-secondary/8', 'rounded-lg', 'p-1', '-m-1');
                    }
                    if (segment) {
                      segment.setAttribute('stroke-width', '30');
                    }
                  }}
                ></div>
                
                {/* Team hover element - 15% (TOP LEFT - teal segment) */}
                <div 
                  className="absolute top-0 left-0 w-2/5 h-2/5 cursor-pointer transition-all duration-300 hover:scale-102"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 20% 100%, 0% 20%)'
                  }}
                  onMouseEnter={() => {
                    const legend = document.querySelector('[data-legend="team"]');
                    const segment = document.querySelector('.team-segment');
                    if (legend) {
                      legend.classList.add('scale-105', 'bg-accent/8', 'rounded-lg', 'p-1', '-m-1');
                    }
                    if (segment) {
                      segment.setAttribute('stroke-width', '35');
                    }
                  }}
                  onMouseLeave={() => {
                    const legend = document.querySelector('[data-legend="team"]');
                    const segment = document.querySelector('.team-segment');
                    if (legend) {
                      legend.classList.remove('scale-105', 'bg-accent/8', 'rounded-lg', 'p-1', '-m-1');
                    }
                    if (segment) {
                      segment.setAttribute('stroke-width', '30');
                    }
                  }}
                ></div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-4 text-left">
              <div 
                className="flex items-center gap-3 transition-all duration-300 cursor-pointer" 
                data-legend="liquidity"
                onMouseEnter={() => {
                  const legend = document.querySelector('[data-legend="liquidity"]');
                  const segment = document.querySelector('.liquidity-segment');
                  if (legend) {
                    legend.classList.add('scale-105', 'bg-primary/8', 'rounded-lg', 'p-1', '-m-1');
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '35');
                  }
                }}
                onMouseLeave={() => {
                  const legend = document.querySelector('[data-legend="liquidity"]');
                  const segment = document.querySelector('.liquidity-segment');
                  if (legend) {
                    legend.classList.remove('scale-105', 'bg-primary/8', 'rounded-lg', 'p-1', '-m-1');
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '30');
                  }
                }}
                onClick={() => {
                  const legend = document.querySelector('[data-legend="liquidity"]');
                  const segment = document.querySelector('.liquidity-segment');
                  if (legend) {
                    legend.classList.add('scale-105', 'bg-primary/8', 'rounded-lg', 'p-1', '-m-1');
                    setTimeout(() => {
                      legend.classList.remove('scale-105', 'bg-primary/8', 'rounded-lg', 'p-1', '-m-1');
                    }, 1000);
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '35');
                    setTimeout(() => {
                      segment.setAttribute('stroke-width', '30');
                    }, 1000);
                  }
                }}
              >
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#5A86C0'}}></div>
                <div>
                  <div className="text-xl font-bold">50% Liquidity Pool</div>
                  <div className="text-sm text-base-content/70">Deep liquidity across all chains</div>
                </div>
              </div>
              
              <div 
                className="flex items-center gap-3 transition-all duration-300 cursor-pointer" 
                data-legend="community"
                onMouseEnter={() => {
                  const legend = document.querySelector('[data-legend="community"]');
                  const segment = document.querySelector('.community-segment');
                  if (legend) {
                    legend.classList.add('scale-105', 'bg-secondary/8', 'rounded-lg', 'p-1', '-m-1');
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '35');
                  }
                }}
                onMouseLeave={() => {
                  const legend = document.querySelector('[data-legend="community"]');
                  const segment = document.querySelector('.community-segment');
                  if (legend) {
                    legend.classList.remove('scale-105', 'bg-secondary/8', 'rounded-lg', 'p-1', '-m-1');
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '30');
                  }
                }}
                onClick={() => {
                  const legend = document.querySelector('[data-legend="community"]');
                  const segment = document.querySelector('.community-segment');
                  if (legend) {
                    legend.classList.add('scale-105', 'bg-secondary/8', 'rounded-lg', 'p-1', '-m-1');
                    setTimeout(() => {
                      legend.classList.remove('scale-105', 'bg-secondary/8', 'rounded-lg', 'p-1', '-m-1');
                    }, 1000);
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '35');
                    setTimeout(() => {
                      segment.setAttribute('stroke-width', '30');
                    }, 1000);
                  }
                }}
              >
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#C1D4F0'}}></div>
                <div>
                  <div className="text-xl font-bold">35% Community Airdrop</div>
                  <div className="text-sm text-base-content/70">Includes 5% bonus for Base LP providers</div>
                </div>
              </div>
              
              <div 
                className="flex items-center gap-3 transition-all duration-300 cursor-pointer" 
                data-legend="team"
                onMouseEnter={() => {
                  const legend = document.querySelector('[data-legend="team"]');
                  const segment = document.querySelector('.team-segment');
                  if (legend) {
                    legend.classList.add('scale-105', 'bg-accent/8', 'rounded-lg', 'p-1', '-m-1');
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '35');
                  }
                }}
                onMouseLeave={() => {
                  const legend = document.querySelector('[data-legend="team"]');
                  const segment = document.querySelector('.team-segment');
                  if (legend) {
                    legend.classList.remove('scale-105', 'bg-accent/8', 'rounded-lg', 'p-1', '-m-1');
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '30');
                  }
                }}
                onClick={() => {
                  const legend = document.querySelector('[data-legend="team"]');
                  const segment = document.querySelector('.team-segment');
                  if (legend) {
                    legend.classList.add('scale-105', 'bg-accent/8', 'rounded-lg', 'p-1', '-m-1');
                    setTimeout(() => {
                      legend.classList.remove('scale-105', 'bg-accent/8', 'rounded-lg', 'p-1', '-m-1');
                    }, 1000);
                  }
                  if (segment) {
                    segment.setAttribute('stroke-width', '35');
                    setTimeout(() => {
                      segment.setAttribute('stroke-width', '30');
                    }, 1000);
                  }
                }}
              >
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#70D0DC'}}></div>
                <div>
                  <div className="text-xl font-bold">15% Team & Development</div>
                  <div className="text-sm text-base-content/70">Growth and brand development</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charlie's Reaction */}
        <div className="text-center mb-6">
          <div className="text-3xl text-center pt-4 italic text-base-content/80">Ouch, Charlie!</div>
          <div className="text-3xl text-center pb-4 italic text-base-content/80">That really hurt.</div>
        </div>
        
        {/* Properly Scaled Ouch Charlie */}
        <div className="flex justify-center">
          <div className="relative max-w-sm">
            <Image
              src="/charlie-ouch.png"
              alt="Charlie Baby"
              width={400}
              height={300}
              className="rounded-lg w-full h-auto object-contain"
              style={{ aspectRatio: '4/3' }}
            />
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-secondary w-full mt-8" />
      
      <section id="roadmap" ref={roadmapRef} className="pt-16 lg:pt-8">
        <div className="w-full px-5">
          <div className="text-4xl text-center pb-4 font-bold">Charlie&apos;s Cross-Chain Journey</div>
          <div className="text-xl text-center text-base-content/80 mb-10">Join Charlie as he travels across multiple blockchains with your help!</div>
          
          <div className="flex flex-col max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="roadmap-step flex flex-col items-center gap-6 mb-12 fade-in" ref={step1Ref}>
              <div className="step-number flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-content">1</div>
              <div className="step-content flex-grow w-full">
                <h3 className="text-2xl font-bold mb-2 text-center">Buy, HODL & Bridge $CHAR</h3>
                <p className="text-lg mb-4 text-center">Start your journey by acquiring Charlie Bull tokens and bridge them across multiple chains with Axelar.</p>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-base font-semibold text-center">How to get started:</p>
                  <p className="text-base mb-3 text-center">Use the widget in our &quot;Buy it Now&quot; section or your favorite DEX.</p>
                  <div className="flex items-center justify-center mt-2">
                    <a 
                      href="https://interchain.axelar.dev/arbitrum/0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline gap-2"
                    >
                      <Image src="/AxelarLogo.png" alt="Axelar" width={24} height={24} className="rounded-sm" />
                      Bridge with Axelar
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2 with Chain Logos */}
            <div className="roadmap-step flex flex-col items-center gap-6 mb-12 fade-in" ref={step2Ref}>
              <div className="step-number flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-content">2</div>
              <div className="step-content flex-grow w-full">
                <h3 className="text-2xl font-bold mb-2 text-center">Provide Liquidity</h3>
                <p className="text-lg mb-6 text-center">Help Charlie grow by providing liquidity on your favorite chains. YOU decide where Charlie goes next!</p>
                
                <div ref={chainLogosRef} className="chain-logos-container fade-in opacity-0">
                  <div className="flex justify-center items-center">
                    <a href="https://app.uniswap.org/positions/create/v3?currencyA=ETH&currencyB=0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/ETHLogo.png" alt="Ethereum" width={75} height={75} className="rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                    <a href="https://lfj.gg/avalanche/pool/v1/create" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/AvaxLogo.png" alt="Avalanche" width={75} height={75} className="rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                    <a href="https://app.uniswap.org/positions/create/v3?currencyA=ETH&currencyB=0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/ArbLogo.png" alt="Arbitrum" width={75} height={75} className="rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  </div>
                  
                  <div className="flex justify-center items-center mt-7">
                    <a href="https://fusionx.finance/add/MNT/0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1?chain=mantle" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/MantleLogo.png" alt="Mantle" width={75} height={75} className="rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                    <a href="https://aerodrome.finance/pools?token0=eth&token1=0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/BaseLogo.png" alt="Base" width={75} height={75} className="rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                    <a href="https://pancakeswap.finance/add/ETH/0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1?chain=linea" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/LineaLogo.png" alt="Linea" width={75} height={75} className="rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  </div>
                  
                  <div className="flex justify-center items-center mt-7">
                    <a href="https://app.thruster.finance/add" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/BlastLogo.png" alt="Blast" width={75} height={75} className="rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                    <a href="https://dapp.quickswap.exchange/pool/v2/0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1/ETH" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/PolLogo.png" alt="Polygon" width={75} height={75} className="rounded-lg opacity-75 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                    <a href="https://pancakeswap.finance/add/BNB/0x7F9532940e98eB7c2da6ba23c3f3D06315BfaAF1?chain=bsc" target="_blank" className="mx-5" rel="noopener noreferrer">
                      <Image src="/BNBLogo.png" alt="BNB Chain" width={75} height={75} className="rounded-lg opacity-75 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  </div>
                </div>
                
                <div className="bg-base-200 p-4 rounded-lg mt-7">
                  <p className="text-base font-semibold text-center">How to provide LP:</p>
                  <p className="text-base text-center"><strong>Step 1:</strong> Click on any chain logo above and visit their DEX</p>
                  <p className="text-base text-center"><strong>Step 2:</strong> Create an ETH-$CHAR liquidity pair</p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="roadmap-step flex flex-col items-center gap-6 fade-in" ref={step3Ref}>
              <div className="step-number flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-content">3</div>
              <div className="step-content flex-grow w-full">
                <h3 className="text-2xl font-bold mb-2 text-center">Spread the Word & Follow $CHAR!</h3>
                <p className="text-lg mb-4 text-center">Share Charlie with friends, grow the community, and follow for official announcements.</p>
                
                <div className="flex justify-center mt-6">
                <div className="flex flex-col items-center max-w-xs md:max-w-sm lg:max-w-md">
  
                  {/* Social Media Icons */}
                  <div className="flex justify-center w-full mb-4 mt-4">
                    <div className="flex justify-between w-full max-w-[240px] md:max-w-[280px]">
                      {/* BlueSky */}
                      <a
                        href="https://bsky.app/profile/charliebull.art"
                        target="_blank"
                        rel="noreferrer"
                        className="transform hover:scale-110 hover:-translate-y-1 transition duration-200"
                      >
                        <Image 
                          src="/BlueSkyLogo.png" 
                          alt="BlueSky Logo" 
                          width={65}
                          height={65}
                          className="rounded-lg w-[65px] h-[65px] md:w-[75px] md:h-[75px]"
                        />
                      </a>

                      {/* Twitter/X */}
                      <a
                        href="https://x.com/CharlieBullArt"
                        target="_blank"
                        rel="noreferrer"
                        className="transform hover:scale-110 hover:-translate-y-1 transition duration-200"
                      >
                        <Image 
                          src="/BlueXLogo.png" 
                          alt="TwitterX Logo" 
                          width={65}
                          height={65}
                          className="rounded-lg w-[65px] h-[65px] md:w-[75px] md:h-[75px]"
                        />
                      </a>
                      
                      {/* Telegram */}
                      <a
                        href="https://t.me/charliebullai"
                        target="_blank"
                        rel="noreferrer"
                        className="transform hover:scale-110 hover:-translate-y-1 transition duration-200"
                      >
                        <Image 
                          src="/TelegramLogo.png" 
                          alt="Telegram Logo" 
                          width={65}
                          height={65}
                          className="rounded-lg w-[65px] h-[65px] md:w-[75px] md:h-[75px]"
                        />
                      </a>
                    </div>
                  </div>

                  {/* Whitepaper Button */}
                  <div className="flex justify-center w-full mb-4">
                    <a
                      href="/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-lg gap-2 transform hover:scale-105 transition duration-200 shadow-lg"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                      Charlie&apos;s Woof Paper
                    </a>
                  </div>

                  <div className="text-3xl text-center p-4 italic font-bold">Lmabo Sooooon!</div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}