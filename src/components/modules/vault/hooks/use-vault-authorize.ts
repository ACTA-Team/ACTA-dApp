'use client';

import { useState, useCallback, useEffect } from 'react';
import { useVault } from '@/components/modules/vault/hooks/use-vault';

export function useVaultAuthorize() {
  const { authorizeSelf, authorizeAddress, loading, checkSelfAuthorized } = useVault();
  const [addressInput, setAddressInput] = useState<string>('');
  const [isSelfAuthorized, setIsSelfAuthorized] = useState<boolean>(false);

  const authorizeMe = useCallback(async () => {
    const res = await authorizeSelf();
    setIsSelfAuthorized(true);
    return res;
  }, [authorizeSelf]);

  const authorizeWithInput = useCallback(async () => {
    const addr = addressInput.trim();
    if (!addr) throw new Error('Address required');
    return authorizeAddress(addr);
  }, [authorizeAddress, addressInput]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const already = await checkSelfAuthorized();
        if (mounted) setIsSelfAuthorized(!!already);
      } catch {
        if (mounted) setIsSelfAuthorized(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [checkSelfAuthorized]);

  return {
    addressInput,
    setAddressInput,
    authorizeMe,
    authorizeWithInput,
    loading,
    isSelfAuthorized,
  };
}
