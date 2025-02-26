import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WBSOProvider } from '@/lib/context/WBSOContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WBSO Aanvraag Assistent 2025',
  description: 'Vereenvoudig je WBSO-aanvraag met onze stap-voor-stap tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <WBSOProvider>{children}</WBSOProvider>
      </body>
    </html>
  );
}