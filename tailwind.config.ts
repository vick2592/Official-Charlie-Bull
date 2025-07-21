import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'creambeige': ['CreamBeige', 'sans-serif'],
        'popcat': ['Popcat', 'sans-serif'],
        'sawer': ['Sawer', 'sans-serif'],
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.25)",  // Even darker shadow
        secondary: "0 6px 10px -1px rgba(0, 0, 0, 0.35), 0 2px 5px -1px rgba(0, 0, 0, 0.2)",  // Much darker shadow
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#5A86C0",         // Darker blue primary color - no pink tint
          "primary-content": "#FFFFFF", // White text for better contrast
          secondary: "#C1D4F0",       // Darker secondary
          "secondary-content": "#212638",
          accent: "#5A86C0",          // Updated to match primary
          "accent-content": "#FFFFFF",
          neutral: "#212638",
          "neutral-content": "#FFFFFF",
          "base-100": "#CAEDF0",      // Darker background (main)
          "base-200": "#A0DFE6",      // Darker secondary background
          "base-300": "#70D0DC",      // Darker tertiary background
          "base-content": "#1d3b5e",
          info: "#4A76B0",            // Updated to match primary
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          
          "--rounded-btn": "9999rem",
        }
      },
      {
        dark: {
          primary: "#1d3b5e",
          "primary-content": "#F9FBFF",
          secondary: "#0a1422",
          "secondary-content": "#F9FBFF",
          accent: "#2a4a75",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#162d4a",
          "base-200": "#0f1e33",
          "base-300": "#0a1422",
          "base-content": "#F9FBFF",
          info: "#4A6BA3",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          
          "--rounded-btn": "9999rem",
        }
      }
    ],
  },
};

export default config;