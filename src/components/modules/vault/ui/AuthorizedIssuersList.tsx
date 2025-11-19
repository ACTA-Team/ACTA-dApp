"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVaultAuthorizedList } from "@/components/modules/vault/hooks/use-vault-authorized-list";
import { toast } from "sonner";

export function AuthorizedIssuersList() {
  const { issuers, revoke, loading, revoking } = useVaultAuthorizedList();

  const onRevoke = async (addr: string) => {
    try {
      const res = await revoke(addr);
      toast.success(`Revocado. TX: ${res.txId}`);
    } catch (e: any) {
      toast.error(e?.message || "Error al revocar");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Wallets autorizadas</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Lista derivada de credenciales emitidas. Puede que una wallet autorizada no aparezca hasta emitir.
      </p>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="col-span-6">Dirección</div>
          <div className="col-span-5">DID</div>
          <div className="col-span-1 text-right">Acción</div>
        </div>
        <div>
          {issuers.length === 0 && (
            <div className="px-4 py-6 text-sm text-neutral-500 dark:text-neutral-400">No hay wallets autorizadas detectadas.</div>
          )}
          {issuers.map((it) => (
            <div key={it.address} className="grid grid-cols-12 items-center px-4 py-3 border-t">
              <div className="col-span-6 font-mono text-sm truncate">{it.address}</div>
              <div className="col-span-5 text-xs text-neutral-600 dark:text-neutral-400 truncate">
                {it.issuerDid || "-"}
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => onRevoke(it.address)}
                  disabled={loading || revoking === it.address}
                  className="rounded-md"
                >
                  {revoking === it.address ? "Revocando..." : "Revocar"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}