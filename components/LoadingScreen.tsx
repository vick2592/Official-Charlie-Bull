"use client";

"use client";

import { useState, useEffect } from "react";
import Image from "next/legacy/image";

export function LoadingScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  // Remove the unused state variable
  // const [fullyLoaded, setFullyLoaded] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDisplayTime = 2500; // Minimum 2.5 seconds display time
    
    // Use const instead of let since progressInterval is never reassigned
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Slow down progress as it gets closer to 100%
        const increment = prev < 70 ? Math.random() * 10 : Math.random() * 3;
        const newProgress = prev + increment;
        return newProgress > 95 ? 95 : newProgress; // Cap at 95% until everything is loaded
      });
    }, 200);

    // Check if all content is loaded including images and scripts
    const checkAllContentLoaded = () => {
      // Check for images
      const allImages = document.querySelectorAll('img');
      const allImagesLoaded = Array.from(allImages).every((img) => {
        if (img.complete) return true;
        return false;
      });
      
      // Check for Squid widget
      const squidWidgetLoaded = document.querySelector('#SquidWidget iframe') !== null;
      
      // Check if enough time has passed
      const timeElapsed = Date.now() - startTime;
      const minTimeReached = timeElapsed >= minDisplayTime;
      
      // Set loading complete when conditions are met
      if (allImagesLoaded && (squidWidgetLoaded || timeElapsed > 5000) && minTimeReached) {
        // Remove this line since we removed the state variable
        // setFullyLoaded(true);
        
        setLoadingProgress(100);
        clearInterval(progressInterval);
        
        // Add a short delay for smooth transition
        setTimeout(() => {
          setIsComplete(true);
        }, 500);
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
      console.log("Safety timeout triggered for loading screen");
      setLoadingProgress(100);
      setTimeout(() => setIsComplete(true), 500);
    }, 10000); // 10 seconds maximum

    return () => {
        clearInterval(progressInterval);
        clearTimeout(safetyTimeout);
        };
    }, []);

  if (isComplete) return null;

  return (
    <div className={`fixed inset-0 bg-base-100 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${loadingProgress === 100 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-64 h-64 relative mb-4">
        <Image
          src="/PantingCharlie3.gif"
          alt="Charlie Bull Loading"
          layout="fill"
          objectFit="contain"
          priority
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