'use client';

import React from 'react';
import { ActaConfig, testNet, mainNet } from '@acta-team/acta-sdk';
import { useNetwork } from '@/providers/network.provider';

interface ActaProviderProps {
  children: React.ReactNode;
}

export function ActaProvider({ children }: ActaProviderProps) {
  const { network } = useNetwork();
  const apiKeyTestnet = process.env.NEXT_PUBLIC_ESCROW_MANAGER_API_KEY_TESTNET || '';
  const baseURL = network === 'mainnet' ? mainNet : testNet;

  return (
    <ActaConfig baseURL={baseURL} apiKey={apiKeyTestnet}>
      {children as any}
    </ActaConfig>
  );
}
