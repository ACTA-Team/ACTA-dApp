'use client';

import { ISupportedWallet } from '@creit.tech/stellar-wallets-kit';
import { useWalletContext } from '@/providers/wallet.provider';
import { toast } from 'sonner';

export const useWalletKit = () => {
  const { setWalletInfo, clearWalletInfo, walletKit } = useWalletContext();
  const createOverlay = () => {
    try {
      const existing = document.querySelector('[data-swk-overlay="true"]') as HTMLElement | null;
      if (existing) return existing;
      const el = document.createElement('div');
      el.setAttribute('data-swk-overlay', 'true');
      el.style.position = 'fixed';
      el.style.inset = '0';
      el.style.background = 'rgba(0,0,0,0.6)';
      el.style.zIndex = '980';
      el.style.pointerEvents = 'auto';
      document.body.appendChild(el);
      return el;
    } catch {
      return null;
    }
  };
  const removeOverlay = () => {
    try {
      const el = document.querySelector('[data-swk-overlay="true"]');
      if (el) el.remove();
    } catch {}
  };

  const connectWithWalletKit = async () => {
    try {
      if (!walletKit) throw new Error('WalletKit not available');
      createOverlay();
      await walletKit.openModal({
        modalTitle: 'Connect your Stellar wallet',
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            walletKit.setWallet(option.id);
            const { address } = await walletKit.getAddress();
            const { name } = option;
            await setWalletInfo(address, name);
            removeOverlay();
          } catch {
            toast.error('Failed to retrieve wallet address');
          }
        },
      });
      removeOverlay();
    } catch {
      toast.error('Failed to open WalletConnect', {
        description: 'Make sure you have a wallet app installed and up to date.',
      });
      removeOverlay();
    }
  };

  const disconnectWalletKit = async () => {
    try {
      await walletKit?.disconnect();
      clearWalletInfo();
    } catch {
      toast.error('Failed to disconnect wallet');
    }
  };

  return { connectWithWalletKit, disconnectWalletKit };
};
