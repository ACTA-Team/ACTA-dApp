'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfilePanel } from './SettingsPanel';
import { useNetwork } from '@/providers/network.provider';
import { useWalletContext } from '@/providers/wallet.provider';
import { useWalletKit } from '@/components/modules/auth/hooks/useWalletKit';

interface ProfileOverlayHostProps {
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  network?: 'testnet' | 'mainnet';
  onNetworkChange?: (network: 'testnet' | 'mainnet') => void;
  apiBaseUrl?: string;
  walletAddress?: string;
  walletName?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  appName?: string;
  appVersion?: string;
}

export function SettingsOverlayHost({
  theme,
  onThemeChange,
  network,
  onNetworkChange,
  apiBaseUrl,
  walletAddress,
  walletName,
  onConnect,
  onDisconnect,
  appName,
  appVersion,
}: ProfileOverlayHostProps) {
  const [open, setOpen] = useState(false);
  const { network: net, setNetwork, apiBaseUrl: apiUrl } = useNetwork();
  const { walletAddress: addr, walletName: wName } = useWalletContext();
  const { connectWithWalletKit, disconnectWalletKit } = useWalletKit();

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    try {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  const handleThemeChange = (t: 'light' | 'dark') => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setCurrentTheme(t);
    onThemeChange?.(t);
  };

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-settings', handler as EventListener);
    return () => window.removeEventListener('open-settings', handler as EventListener);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        showClose={false}
        className="w-full border-r border-zinc-800 bg-zinc-900 p-0 sm:max-w-[420px] md:max-w-[520px]"
      >
        <SheetHeader className="border-b border-zinc-800 p-4">
          <SheetTitle className="sr-only">Settings</SheetTitle>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-12 w-12 rounded-xl bg-zinc-800/50 hover:bg-zinc-800"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-12 w-12 rounded-xl bg-zinc-800/50 hover:bg-zinc-800"
            >
              <X className="h-5 w-5 text-white" />
            </Button>
          </div>
        </SheetHeader>
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 pretty-scrollbar">
          <ProfilePanel
            theme={theme ?? currentTheme}
            onThemeChange={handleThemeChange}
            network={network ?? net}
            onNetworkChange={onNetworkChange ?? setNetwork}
            apiBaseUrl={apiBaseUrl ?? apiUrl}
            walletAddress={walletAddress ?? addr ?? undefined}
            walletName={walletName ?? wName ?? undefined}
            onConnect={onConnect ?? connectWithWalletKit}
            onDisconnect={onDisconnect ?? disconnectWalletKit}
            appName={appName}
            appVersion={appVersion}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
