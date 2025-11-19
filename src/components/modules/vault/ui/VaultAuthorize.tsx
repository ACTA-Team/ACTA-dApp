"use client";

import { useVaultAuthorize } from "@/components/modules/vault/hooks/use-vault-authorize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function VaultAuthorize() {
  const { addressInput, setAddressInput, authorizeMe, authorizeWithInput, loading } = useVaultAuthorize();

  const onAuthorizeMe = async () => {
    try {
      const res = await authorizeMe();
      toast.success(`Autorizado. TX: ${res.txId}`);
    } catch (e: any) {
      toast.error(e?.message || "Error al autorizarme");
    }
  };

  const onAuthorizeAddress = async () => {
    try {
      const res = await authorizeWithInput();
      toast.success(`Dirección autorizada. TX: ${res.txId}`);
    } catch (e: any) {
      toast.error(e?.message || "Error al autorizar dirección");
    }
  };

  return (
    <div className="flex w-full gap-2 items-center">
      <Button onClick={onAuthorizeMe} disabled={loading} className="rounded-md">
        {loading ? "Autorizando..." : "Autorizarme"}
      </Button>
      <Input
        placeholder="Dirección a autorizar (G...)"
        value={addressInput}
        onChange={(e) => setAddressInput(e.target.value)}
        className="flex-1 min-w-0"
      />
      <Button onClick={onAuthorizeAddress} disabled={loading} className="rounded-md">
        {loading ? "Autorizando..." : "Autorizar"}
      </Button>
    </div>
  );
}