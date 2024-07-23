// src/app/ServerLayout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import React from "react";
import "./globals.css";
import ClientWrapper from "./rootLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Co Finance",
  description: "The next gen DeFi Earning Platform",
};

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
