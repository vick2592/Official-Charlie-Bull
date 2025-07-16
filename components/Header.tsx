"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Menu links data
const menuLinks = [
  { label: "Home", href: "#home" },
  { label: "Buy it Now", href: "#buy-it-now" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Roadmap", href: "#roadmap" },
];

// Improved scroll function with better alignment
function scrollToElement(elementId: string) {
  const id = elementId.replace(/^#/, '');
  const element = document.getElementById(id);
  
  if (!element) {
    console.error(`Element with ID "${id}" not found`);
    return false;
  }
  
  // Find the header and get its height
  const header = document.querySelector('.header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  console.log(`Header height: ${headerHeight}px for element: #${id}`);
  
  // Calculate the exact position of the element
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Find the nearest hr element (border) if it exists
  const prevHr = element.previousElementSibling;
  
  // If there's an hr element before this section, scroll to it instead
  if (prevHr && prevHr.tagName.toLowerCase() === 'hr') {
    const hrRect = prevHr.getBoundingClientRect();
    const hrPosition = hrRect.top + scrollTop;
    
    console.log(`Scrolling to HR above #${id} at position ${hrPosition - headerHeight}`);
    window.scrollTo({
      top: hrPosition - headerHeight,
      behavior: 'smooth'
    });
  } else {
    // Otherwise, scroll to the section with a small offset
    const elementTop = rect.top + scrollTop;
    
    console.log(`Scrolling to #${id} at position ${elementTop - headerHeight}`);
    window.scrollTo({
      top: elementTop - headerHeight,
      behavior: 'smooth'
    });
  }
  
  // Update URL
  window.history.pushState(null, '', `#${id}`);
  return true;
}

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLUListElement>(null);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const processingClickRef = useRef(false);
  
  // Set header height on mount and resize
  useEffect(() => {
    const setHeaderHeight = () => {
      const header = document.querySelector(".header");
      if (header) {
        const headerHeight = header.getBoundingClientRect().height;
        document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
        console.log(`Set header height to ${headerHeight}px`);
      }
    };

    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);

    return () => window.removeEventListener("resize", setHeaderHeight);
  }, []);

  // For mobile navigation: handle pending navigation after drawer closes
  useEffect(() => {
    if (!isDrawerOpen && pendingNavigation) {
      const timeoutId = setTimeout(() => {
        console.log(`Executing pending navigation to ${pendingNavigation}`);
        scrollToElement(pendingNavigation);
        setPendingNavigation(null);
        processingClickRef.current = false;
      }, 20); // Slightly reduced for faster response
      
      return () => clearTimeout(timeoutId);
    }
  }, [isDrawerOpen, pendingNavigation]);

  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    processingClickRef.current = true;
    
    console.log(`Navigation click detected for ${href}`);
    
    // For desktop (no drawer) or logo click when drawer is closed, navigate immediately
    if (window.innerWidth >= 1024 || !isDrawerOpen) {
      console.log(`Direct navigation to ${href}`);
      scrollToElement(href);
      processingClickRef.current = false;
      return;
    }
    
    // For mobile with open drawer, set pending navigation and close drawer
    console.log(`Setting pending navigation to ${href} and closing drawer`);
    setPendingNavigation(href);
    setIsDrawerOpen(false);
  };

  // Hook for detecting clicks outside the burger menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // If we're handling a navigation click, don't interfere
      if (processingClickRef.current) {
        return;
      }
      
      // Check if click is inside the menu links
      if (menuLinksRef.current && menuLinksRef.current.contains(target)) {
        return;
      }
      
      // Check if click is inside the burger menu
      if (burgerMenuRef.current && !burgerMenuRef.current.contains(target)) {
        setIsDrawerOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [burgerMenuRef]);

  return (
    <div className="header fixed lg:sticky top-0 left-0 right-0 bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar">
        <div className="navbar-start w-auto lg:w-1/2">
          <a 
            href="#home" 
            className="flex items-center gap-2 shrink-0"
            onClick={(e) => handleNavClick(e, '#home')}
          >
            <div className="flex relative w-20 h-20">
              <Image 
                alt="Charlie" 
                className="cursor-pointer" 
                width={80}
                height={80}
                src="/logo.svg" 
                onError={(e) => {
                  const imgElement = e.currentTarget as HTMLImageElement;
                  imgElement.onerror = null;
                  imgElement.src = "/CharlieBull.png";
                }}
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-creambeige font-bold leading-tight text-3xl">Charlie</span>
            </div>
          </a>
          <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2 ml-4">
            {menuLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="hover:bg-secondary hover:shadow-md py-1.5 px-3 text-lg rounded-full"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end flex-grow mr-4">
          <div className="lg:hidden" ref={burgerMenuRef}>
            <label
              tabIndex={0}
              className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
              onClick={() => setIsDrawerOpen(prevIsOpenState => !prevIsOpenState)}
            >
              <div className="w-10 h-10 relative">
                {/* Burger icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-10 w-10 transition-all ${
                    isDrawerOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                
                {/* X icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-10 w-10 transition-all absolute top-0 left-0 ${
                    isDrawerOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div
        className={`
          fixed left-0 right-0
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${isDrawerOpen ? "h-auto opacity-100" : "h-0 opacity-0"}
          top-[var(--header-height)]
          bg-base-100 shadow-lg z-30
          lg:hidden
        `}
      >
        <ul ref={menuLinksRef} className="menu menu-compact w-full p-4 items-center text-center">
          {menuLinks.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="hover:bg-secondary hover:shadow-md py-1.5 px-3 text-lg rounded-full"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}