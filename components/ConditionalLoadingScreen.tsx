"use client";

import { usePathname } from 'next/navigation';
import { LoadingScreen } from './LoadingScreen';

export function ConditionalLoadingScreen() {
  const pathname = usePathname();
  
  // Don't show loading screen for docs pages
  if (pathname?.startsWith('/docs')) {
    return null;
  }
  
  return <LoadingScreen />;
}