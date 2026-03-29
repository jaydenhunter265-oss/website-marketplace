import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'FuturiMarket — Digital Asset Marketplace',
  description: 'A futuristic marketplace for buying and selling websites, SaaS, apps, and digital businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
