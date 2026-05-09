import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pathfinder — Credential Translation for Immigrants & Refugees',
  description: 'Map your foreign credentials to US equivalents and build a SMART recertification plan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
