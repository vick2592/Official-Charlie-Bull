"use client";

import { usePathname } from 'next/navigation';
import { LoadingScreen } from './LoadingScreen';

export function ConditionalLoadingScreen() {
  const pathname = usePathname();
  
  // Show loading screen ONLY on the home page
  if (pathname === '/' || pathname === '/#home') {
    return <LoadingScreen />;
  }
  return null;
}