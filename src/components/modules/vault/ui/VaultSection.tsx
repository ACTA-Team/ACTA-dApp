"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useVault } from "@/components/modules/vault/hooks/use-vault";
import { toast } from "sonner";
import { BeamToast } from "@/components/ui/beam-toast";
import { VaultDashboard } from "./VaultDashboard";

export function VaultSection() {
  const { loading, createVault, authorizeSelf, authorizeAddress, ownerDid, vaultExists } =
    useVault();
  const [addr, setAddr] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const onCreateVault = async () => {
    try {
      const res = await createVault();
      toast.custom(() => (
        <BeamToast title="Vault creado" description={`TX: ${res.txId}`} />
      ));
    } catch (e: any) {
      const msg = e?.message || String(e);
      toast.custom(() => <BeamToast title={msg} />);
    }
  };

  const onAuthorizeSelf = async () => {
    try {
      const res = await authorizeSelf();
      toast.custom(() => (
        <BeamToast title="Wallet autorizada" description={`TX: ${res.txId}`} />
      ));
    } catch (e: any) {
      const msg = e?.message || String(e);
      toast.custom(() => <BeamToast title={msg} />);
    }
  };

  const onAuthorizeAddress = async () => {
    try {
      const res = await authorizeAddress(addr.trim());
      toast.custom(() => (
        <BeamToast title="Wallet autorizada" description={`TX: ${res.txId}`} />
      ));
    } catch (e: any) {
      const msg = e?.message || String(e);
      toast.custom(() => <BeamToast title={msg} />);
    }
  };

  if (vaultExists) {
    return <VaultDashboard />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Crear Vault</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          El DID se calcula automáticamente según tu wallet y red actual.
        </p>
        {ownerDid && (
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            DID: {ownerDid}
          </div>
        )}
        <div className="mt-3">
          <Button onClick={onCreateVault} disabled={loading || !ownerDid}>
            {loading ? "Procesando..." : "Crear"}
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold">Autorizar Wallets</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Puedes autorizarte a ti mismo o autorizar otra dirección.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Button
            onClick={onAuthorizeSelf}
            disabled={loading}
            variant="secondary"
          >
            {loading ? "Procesando..." : "Autorizarme"}
          </Button>
          <Input
            placeholder="Dirección Stellar (G...)"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={onAuthorizeAddress}
            disabled={loading || !addr.trim()}
          >
            {loading ? "Procesando..." : "Autorizar dirección"}
          </Button>
        </div>
      </div>

      {/* Errores y éxitos ahora se muestran como toasts (Sonner) */}
    </div>
  );
}
