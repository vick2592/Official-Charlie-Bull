"use client";

import { useState } from "react";

interface TokenAddressProps {
  address: string;
}

export function TokenAddress({ address }: TokenAddressProps) {
  const [copied, setCopied] = useState(false);
  
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  
  return (
    <button 
      onClick={copyToClipboard}
      className="flex items-center gap-2 bg-base-200 hover:bg-base-300 px-4 py-2 rounded-lg transition-colors"
    >
      <span className="font-mono">{shortAddress}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {copied ? (
          <>
            <path d="M20 6L9 17l-5-5"></path>
          </>
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </>
        )}
      </svg>
    </button>
  );
}