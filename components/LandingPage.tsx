"use client";

import { useEffect, useRef } from "react";
import Image from "next/legacy/image";
import { TokenAddress } from "./TokenAddress";
import ErrorBoundary from "./ErrorBoundary";
import { SquidWidgetWrapper } from "./SquidWidgetWrapper";

export function LandingPage() {
  const homeRef = useRef<HTMLDivElement>(null);
  const howToBuyRef = useRef<HTMLDivElement>(null);
  const tokenomicsRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);

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

    [homeRef, howToBuyRef, tokenomicsRef, roadmapRef, logoContainerRef].forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);

        if (ref.current.getBoundingClientRect().top < window.innerHeight) {
          ref.current.classList.add("fade-in");
          observer.unobserve(ref.current);
        }
      }
    });

    return () => {
      [homeRef, howToBuyRef, tokenomicsRef, roadmapRef, logoContainerRef].forEach(ref => {
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
          <h1 className="text-center rounded-lg">
            <span className="font-creambeige font-bold leading-tight text-5xl">$CHAR</span>
          </h1>
          <div className="mx-3 md:mx-20 p-3 text-center">
            <div className="text-4xl text-center m-1">Welcome to Charlie Bull,</div>
            <div className="text-4xl text-center font-bold">The first Cross-Chain pup on Ethereum!</div>
          </div>
        </div>

        <div className="flex justify-center px-5 mb-8">
          <Image
            src="/PantingCharlie2.gif"
            alt="Charlie Panting"
            width={400}
            height={400}
            className="rounded-lg h-auto"
            unoptimized
          />
        </div>

        <div className="flex justify-center items-center" ref={logoContainerRef}>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/ETHLogo.png" alt="Ethereum Logo" width={75} height={75} className="rounded-lg opacity-60" />
          </a>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/AvaxLogo.png" alt="Avalanche Logo" width={75} height={75} className="rounded-lg opacity-60" />
          </a>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/ArbLogo.png" alt="Arbitrum Logo" width={75} height={75} className="rounded-lg opacity-60" />
          </a>
        </div>
        <div className="flex justify-center items-center mt-7" ref={logoContainerRef}>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/MantleLogo.png" alt="Mantle Logo" width={75} height={75} className="rounded-lg opacity-60" />
          </a>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/BaseLogo.png" alt="Base Logo" width={75} height={75} className="rounded-lg mx-5 opacity-60" />
          </a>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/LineaLogo.png" alt="Linea Logo" width={75} height={75} className="rounded-lg opacity-60" />
          </a>
        </div>
        <div className="flex justify-center items-center mt-7 mb-16" ref={logoContainerRef}>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/BlastLogo.png" alt="Blast Logo" width={75} height={75} className="rounded-lg opacity-60" />
          </a>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image src="/PolLogo.png" alt="Polygon Logo" width={75} height={75} className="rounded-lg opacity-75" />
          </a>
          <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
            <Image
              src="/BNBLogo.png"
              alt="Binance Chain Logo"
              width={75} 
              height={75}
              className="rounded-lg opacity-75"
            />
          </a>
        </div>
      </section>

      <hr className="border-t-2 border-secondary w-full" />

      <section id="buy-it-now" ref={howToBuyRef} className="pt-16 lg:pt-8">
        <div className="px-5">
          <div className="text-4xl text-center font-bold mb-7">Buy it Now</div>
          
          <div className="flex justify-center items-center mt-4">
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-xl font-semibold mb-3">Charlie Bull Token address:</p>
              <TokenAddress address="0x5FbDB2315678afecb367f032d93F642f64180aa3" />
              {/* <p className="text-sm text-base-content/70 mt-2">(Click to copy)</p> */}
            </div>
          </div>
          <div id="SquidWidget" className="flex justify-center items-center p-10">
            <ErrorBoundary>
              <SquidWidgetWrapper />
            </ErrorBoundary>
          </div>
          <div className="flex justify-center items-center py-7" ref={logoContainerRef}>
            <div className="text-3xl text-gray-600 dark:text-gray-300">Powered by</div>
            <a href="https://google.com" target="_blank" className="mx-5" rel="noopener noreferrer">
              <Image src="/AxelarLogo.png" alt="Axelar Logo" width={75} height={75} className="rounded-lg opacity-85" />
            </a>
            <div className="text-3xl text-gray-600 dark:text-gray-300"> & </div>
            <a href="https://google.com" className="mx-5" target="_blank" rel="noopener noreferrer">
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
        <div className="text-4xl pb-4 text-center font-bold">Tokenomics</div>
        <div className="flex justify-center mt-4">
          <Image
            src="/Tokenomics.png"
            alt="Tokenomics"
            width={600}
            height={600}
            className="rounded-lg w-full h-auto max-w-md"
          />
        </div>
        <div className="text-4xl text-center pt-4 italic">Ouch, Charlie!</div>
        <div className="text-4xl text-center pb-4 italic">That really hurt.</div>
        <div className="flex justify-center mt-2">
          <Image
            src="/OuchCharlie.png"
            alt="Charlie Baby"
            width={600}
            height={600}
            className="rounded-lg w-full h-auto max-w-md"
          />
        </div>
      </section>

      <hr className="border-t-2 border-secondary w-full mt-8" />
      
      <section id="roadmap" ref={roadmapRef} className="pt-16 lg:pt-8">
        <div className="w-full px-5">
          <div className="text-4xl text-center pb-4 font-bold">Journey 2025</div>
          <div className="text-4xl text-center p-4 italic">Q1: Buy and HODL</div>
          <div className="text-4xl text-center p-4 italic">Q2: Help Charlie grow LPs on Ethereum</div>
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mt-2">
            <div className="flex flex-col items-center">
              <Image
                src="/WaggingCharlie.gif"
                alt="Charlie Bull Wagging Tail"
                width={600}
                height={600}
                className="rounded-lg w-full h-auto max-w-md"
                unoptimized
              />
              <div className="text-4xl text-center p-4 italic">Q3: Lambo!</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}