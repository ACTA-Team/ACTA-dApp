"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVault } from "@/components/modules/vault/hooks/use-vault";
import { toast } from "sonner";
import { BeamToast } from "@/components/ui/beam-toast";
import { VaultDashboard } from "./VaultDashboard";

export function VaultSection() {
  const { loading, createVault, ownerDid, vaultExists } = useVault();

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

  if (vaultExists) {
    return <VaultDashboard />;
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Crear Vault</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Se genera a partir de tu wallet y red actual.
        </p>
        {ownerDid && (
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono truncate">
            DID: {ownerDid}
          </p>
        )}
        <div className="mt-4">
          <Button onClick={onCreateVault} disabled={loading || !ownerDid} className="w-full">
            {loading ? "Procesando..." : "Crear Vault"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
