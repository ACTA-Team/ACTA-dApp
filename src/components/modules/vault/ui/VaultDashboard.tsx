"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useVault } from "@/components/modules/vault/hooks/use-vault";
import { VaultAuthorize } from "@/components/modules/vault/ui/VaultAuthorize";

export function VaultDashboard() {
  const { ownerDid, xlmBalance, vcIds, vcs, ownerCreatedAt } = useVault();

  const createdAtLabel = ownerCreatedAt
    ? new Date(ownerCreatedAt).toLocaleString()
    : "No disponible"; // El contrato no guarda timestamp de creación
  const credsCount = vcIds?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Vault de usuario</h1>
          {ownerDid && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{ownerDid}</div>
          )}
        </div>
      </div>

      {/* Resumen */}
      <Card className="p-4 bg-neutral-950 text-white border border-white/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-neutral-400">Balance XLM</div>
            <div className="text-lg font-medium">{xlmBalance ?? "-"}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-400">Credenciales</div>
            <div className="text-lg font-medium">{credsCount}</div>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Autorización (sección inferior a ancho completo) */}
      <div className="flex items-center w-full">
        <VaultAuthorize />
      </div>

      {/* Se eliminó la lista de credenciales del dashboard del Vault */}
    </div>
  );
}