'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useVault } from '../hooks/use-vault';
import { useCredentialsList } from '@/components/modules/credentials/hooks/useCredentialsList';

export function useVaultDashboard() {
  const { vaultExists, createVault } = useVault();
  const { query, setQuery, items, shareOpen, toShare, openShare, closeShare } =
    useCredentialsList();

  const onCreateVault = useCallback(async () => {
    try {
      const { txId } = await createVault();
      toast.success('Vault created');
      return txId;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
      return null;
    }
  }, [createVault]);

  return {
    vaultExists,
    onCreateVault,
    query,
    setQuery,
    items,
    shareOpen,
    toShare,
    openShare,
    closeShare,
  };
}
