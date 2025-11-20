import type { Metadata } from 'next';
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/providers/wallet.provider';
import { NetworkProvider } from '@/providers/network.provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query.provider';
import GlobalHeaderHost from '@/layouts/header/GlobalHeaderHost';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-cabinet',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'ACTA',
  description: 'ACTA dApp - Decentralized Application for ACTA',
  icons: {
    icon: [
      { url: '/black.png', media: '(prefers-color-scheme: light)' },
      { url: '/logo.png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: ['/black.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem("theme");const isDark = s ? s === "dark" : true;document.documentElement.classList.toggle("dark", isDark);}catch(e){document.documentElement.classList.add("dark");}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <NetworkProvider>
            <WalletProvider>
              <GlobalHeaderHost />
              {children}
              <Toaster />
            </WalletProvider>
          </NetworkProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
