'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Network = 'testnet' | 'mainnet';

type NetworkContextType = {
  network: Network;
  setNetwork: (n: Network) => void;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<Network>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('network') : null;
      if (stored === 'mainnet' || stored === 'testnet') return stored as Network;
    } catch {}
    return 'testnet';
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('network', network);
      }
    } catch {}
  }, [network]);

  const value = useMemo(() => ({ network, setNetwork }), [network]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}
