import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'ParkSense AI — Smart Parking Management',
  description: 'AI-powered smart parking for smarter cities. Real-time monitoring, instant booking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-ps-bg text-white antialiased">{children}</body>
    </html>
  );
}
