import "../styles/globals.css";
import type { Metadata } from "next";
import { FixedThemeSwitcher } from "../components/ThemeSwitcher";
import { ConditionalLoadingScreen } from "../components/ConditionalLoadingScreen";

export const metadata: Metadata = {
  title: "Charlie Bull | Cross-Chain AI Pup on Ethereum",
  description: "The first Cross-Chain AI pup on Ethereum!",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: [
      { url: "/favicon.png" }
    ],
    shortcut: [
      { url: "/favicon.png" }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mydark">
      <body>
        <ConditionalLoadingScreen />
        {children}
        <FixedThemeSwitcher />
      </body>
    </html>
  );
}