"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVault } from "@/components/modules/vault/hooks/use-vault";
import { toast } from "sonner";
import { VaultDashboard } from "./VaultDashboard";

export function VaultSection() {
  const { loading, createVault, ownerDid, vaultExists } = useVault();

  const onCreateVault = async () => {
    try {
      const res = await createVault();
      toast.success("Vault created");
    } catch (e: any) {
      const msg = e?.message || String(e);
      toast.error(msg);
    }
  };

  if (vaultExists) {
    return <VaultDashboard />;
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Create Vault</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Generated from your current wallet and network.
        </p>
        {ownerDid && (
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono truncate">
            DID: {ownerDid}
          </p>
        )}
        <div className="mt-4">
          <Button onClick={onCreateVault} disabled={loading || !ownerDid} className="w-full">
            {loading ? "Processing..." : "Create Vault"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
