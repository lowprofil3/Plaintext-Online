import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'PlainText Online',
  description: 'A text-based life simulation MMO set in a persistent modern city.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${plexMono.variable}`} suppressHydrationWarning>
      <body className="font-mono bg-terminal-background">
        {children}
      </body>
    </html>
  );
}
