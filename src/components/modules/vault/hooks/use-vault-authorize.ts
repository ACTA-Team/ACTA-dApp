"use client";

import { useState, useCallback } from "react";
import { useVault } from "@/components/modules/vault/hooks/use-vault";

export function useVaultAuthorize() {
  const { authorizeSelf, authorizeAddress, loading } = useVault();
  const [addressInput, setAddressInput] = useState<string>("");

  const authorizeMe = useCallback(async () => {
    return authorizeSelf();
  }, [authorizeSelf]);

  const authorizeWithInput = useCallback(async () => {
    const addr = addressInput.trim();
    if (!addr) throw new Error("Dirección requerida");
    return authorizeAddress(addr);
  }, [authorizeAddress, addressInput]);

  return {
    addressInput,
    setAddressInput,
    authorizeMe,
    authorizeWithInput,
    loading,
  };
}