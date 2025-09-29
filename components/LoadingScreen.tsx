"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window { __CHARLIE_SITE_LOADED__?: boolean }
}
import Image from "next/legacy/image";

export function LoadingScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  interface CharlieGlobal extends Global {
    __charlieLoadRef?: { current: boolean }
  }
  const g = globalThis as unknown as CharlieGlobal;
  if (!g.__charlieLoadRef) g.__charlieLoadRef = { current: false };
  const completedRef = g.__charlieLoadRef;

  useEffect(() => {
    // If already loaded previously, do not show or modify scroll
    if (window.__CHARLIE_SITE_LOADED__) {
      setIsComplete(true);
      return;
    }
    const startTime = Date.now();
    const minDisplayTime = 2500; // Minimum 2.5 seconds display time
    
    // Use const instead of let since progressInterval is never reassigned
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Smooth progress increment with slight randomness
        const increment = prev < 80 ? Math.random() * 8 + 2 : Math.random() * 2 + 1;
        const newProgress = prev + increment;
        return newProgress > 95 ? 95 : newProgress; // Cap at 95% until everything is loaded
      });
    }, 150); // Slightly faster updates for smoother progress

    // Check if all content is loaded including images and scripts
    const checkAllContentLoaded = () => {
      // Check for critical images (excluding chain logos which can load later)
      const criticalImages = document.querySelectorAll('img[priority], img[src*="Charlie"], img[src*="Wagging"]');
      const criticalImagesLoaded = Array.from(criticalImages).every((img) => (img as HTMLImageElement).complete);
      
      // Check if enough time has passed
      const timeElapsed = Date.now() - startTime;
      const minTimeReached = timeElapsed >= minDisplayTime;
      
      // Set loading complete when critical content is loaded
      if (criticalImagesLoaded && minTimeReached && !completedRef.current) {
        completedRef.current = true;
        setLoadingProgress(100);
        clearInterval(progressInterval);
        // Add a short delay for smooth transition
        setTimeout(() => {
          window.__CHARLIE_SITE_LOADED__ = true;
          setIsComplete(true);
          document.body.style.overflow = '';
          // Do NOT force scroll position; preserve user's scroll if they moved.
          document.dispatchEvent(new CustomEvent('charlie:siteLoaded'));
        }, 400);
      } else {
        // Check again after a short delay
        setTimeout(checkAllContentLoaded, 300);
      }
    };
    
    // Start checking once document is ready
    if (document.readyState === "complete") {
      checkAllContentLoaded();
    } else {
      window.addEventListener("load", () => {
        checkAllContentLoaded();
      });
    }

    // Safety timeout - eventually hide loading screen even if something fails to load
    const safetyTimeout = setTimeout(() => {
      if (completedRef.current) return;
      console.log("Safety timeout triggered for loading screen");
      completedRef.current = true;
      setLoadingProgress(100);
      setTimeout(() => {
        window.__CHARLIE_SITE_LOADED__ = true;
        setIsComplete(true);
        document.body.style.overflow = '';
        document.dispatchEvent(new CustomEvent('charlie:siteLoaded'));
      }, 300);
    }, 10000); // 10 seconds maximum

    // lock scroll while loading but unlock if user attempts to scroll (for better UX)
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const earlyScrollUnlock = () => {
      if (!completedRef.current) {
        document.body.style.overflow = prevOverflow;
      }
      window.removeEventListener('wheel', earlyScrollUnlock);
      window.removeEventListener('touchmove', earlyScrollUnlock);
    };
    window.addEventListener('wheel', earlyScrollUnlock, { passive: true });
    window.addEventListener('touchmove', earlyScrollUnlock, { passive: true });

    return () => {
        clearInterval(progressInterval);
        clearTimeout(safetyTimeout);
            // Only restore if still locked (in case completion already restored it)
            if (document.body.style.overflow === 'hidden') {
              document.body.style.overflow = prevOverflow;
            }
            window.removeEventListener('wheel', earlyScrollUnlock);
            window.removeEventListener('touchmove', earlyScrollUnlock);
        };
  // We intentionally want this effect only once (mount). completedRef is stable via global stash.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isComplete) return null;

  return (
    <div className={`fixed inset-0 bg-base-100 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${loadingProgress === 100 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-64 h-64 relative mb-4">
        <Image
          src="/charlie-wag.gif"
          alt="Charlie Bull Wagging Tail"
          width={450}
          height={450}
          className="rounded-lg w-full h-auto md:w-[350px] lg:w-[400px]"
          unoptimized
        />
      </div>
      
      <div className="text-4xl font-bold mb-6 font-creambeige">$CHAR</div>
      
      <div className="w-64 bg-base-200 rounded-full h-3 mb-2">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      
      <div className="text-sm text-base-content/70">
        {loadingProgress < 95 
          ? "Loading Charlie Bull..." 
          : "Almost there..."}
      </div>
    </div>
  );
}