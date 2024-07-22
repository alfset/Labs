import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "../components/ConnectButton"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Co Finance",
  description: "The next gen DeFi Earning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="relative w-full flex flex-col min-h-screen">
          <Navbar />
          <div className="fixed top-10 right-4 z-50"> {/* Positioning matches Navbar */}
            <ConnectWalletButton />
          </div>
          <main className="flex-grow pt-20"> {/* Ensure main content doesn't overlap with fixed Navbar */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
