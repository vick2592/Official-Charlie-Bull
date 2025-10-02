"use client";

import { useEffect, useState } from "react";

// Heuristic detector for older/slower iOS devices that struggle with heavy filters/animations
export function useIsLowEndIOS() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    try {
      const ua = navigator.userAgent || "";
      const isIOS = /(iPhone|iPad|iPod)/i.test(ua);
      if (!isIOS) {
        setIsLowEnd(false);
        return;
      }

      // Extract iOS major version from "OS 12_4 like Mac OS X"
      const m = ua.match(/OS (\d+)_/);
      const major = m ? parseInt(m[1], 10) : undefined;

      // Some quick hardware-ish heuristics
      const smallScreen = Math.min(window.screen.width, window.screen.height) <= 375;
      const lowDPR = window.devicePixelRatio && window.devicePixelRatio <= 2;
  const devMem = (navigator as unknown as { deviceMemory?: number }).deviceMemory; // rarely present on iOS

      const isOldIOS = typeof major === 'number' ? major <= 14 : false; // iOS 14 and below
      const looksLowSpec = (smallScreen && lowDPR) || (typeof devMem === 'number' && devMem <= 2);

      setIsLowEnd(Boolean(isIOS && (isOldIOS || looksLowSpec)));
    } catch {
      setIsLowEnd(false);
    }
  }, []);

  return isLowEnd;
}
