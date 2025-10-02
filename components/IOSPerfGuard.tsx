"use client";

import { useEffect } from "react";
import { useIsLowEndIOS } from "./useIsLowEndIOS";

export function IOSPerfGuard() {
  const isLowEnd = useIsLowEndIOS();
  useEffect(() => {
    const cls = 'ios-low-end';
    if (isLowEnd) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => { document.body.classList.remove(cls); };
  }, [isLowEnd]);
  return null;
}
