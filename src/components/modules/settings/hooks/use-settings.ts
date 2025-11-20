'use client';

import { useEffect, useState } from 'react';
import { useNetwork } from '@/providers/network.provider';
import { useWalletContext } from '@/providers/wallet.provider';
import { useWalletKit } from '@/components/modules/auth/hooks/useWalletKit';

export function useSettings() {
  const { network, setNetwork } = useNetwork();
  const { walletAddress, walletName } = useWalletContext();
  const { connectWithWalletKit, disconnectWalletKit } = useWalletKit();

  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {}
  }, [theme]);

  const applyTheme = (next: 'light' | 'dark') => {
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
    } catch {}
  };

  const connect = async () => {
    await connectWithWalletKit();
  };

  const disconnect = async () => {
    await disconnectWalletKit();
  };

  return {
    // Tema
    theme,
    applyTheme,
    // Red
    network,
    setNetwork,
    // Billetera
    walletAddress,
    walletName,
    connect,
    disconnect,
  };
}
