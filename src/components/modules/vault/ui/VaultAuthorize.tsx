"use client";

import { useVaultAuthorize } from "@/components/modules/vault/hooks/use-vault-authorize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="p-6 space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Autorizarme</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Te habilita como emisor autorizado en tu vault.
          </p>
        </div>
        <Button onClick={onAuthorizeMe} disabled={loading} className="w-full rounded-md">
          {loading ? "Autorizando..." : "Autorizarme"}
        </Button>
      </Card>

      <Card className="p-6 space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Autorizar dirección</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Ingresa una wallet Stellar (G...) para autorizarla.
          </p>
        </div>
        <div className="flex w-full gap-2 items-center">
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
      </Card>
    </div>
  );
}