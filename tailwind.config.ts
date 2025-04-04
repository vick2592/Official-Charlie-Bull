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
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
        secondary: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#212638",
          "base-100": "#E0F7FA",
          "base-200": "#B2EBF2",
          "base-300": "#80DEEA",
          "base-content": "#1d3b5e",
          info: "#93BBFB",
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
          info: "#385183",
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

