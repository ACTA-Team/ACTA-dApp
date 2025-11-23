'use client';

import { ISupportedWallet } from '@creit.tech/stellar-wallets-kit';
import { useWalletContext } from '@/providers/wallet.provider';
import { toast } from 'sonner';

export const useWalletKit = () => {
  const { setWalletInfo, clearWalletInfo, walletKit } = useWalletContext();

  const connectWithWalletKit = async () => {
    if (!walletKit) throw new Error('WalletKit not available');
    await walletKit.openModal({
      modalTitle: 'Connect your Stellar wallet',
      onWalletSelected: (option: ISupportedWallet) => {
        walletKit.setWallet(option.id);
        void (async () => {
          try {
            const { address } = await walletKit.getAddress();
            const { name } = option;
            await setWalletInfo(address, name);
          } catch {
            toast.error('Failed to retrieve wallet address');
          }
        })();
      },
    });
  };

  const disconnectWalletKit = async () => {
    await walletKit?.disconnect();
    clearWalletInfo();
  };

  return { connectWithWalletKit, disconnectWalletKit };
};
