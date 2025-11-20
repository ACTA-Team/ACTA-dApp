"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVault } from "@/components/modules/vault/hooks/use-vault";

export function VaultDashboard() {
  const { ownerDid, xlmBalance, vcIds, ownerCreatedAt } = useVault();

  const createdAtLabel = ownerCreatedAt
    ? new Date(ownerCreatedAt).toLocaleString()
    : "Not available";
  const credsCount = vcIds?.length ?? 0;

  return (
    <div className="space-y-8">
      {ownerDid && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono truncate">
          {ownerDid}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Balance XLM
          </div>
          <div className="mt-2 text-2xl font-semibold">{xlmBalance ?? "-"}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Credentials
          </div>
          <div className="mt-2 text-2xl font-semibold">{credsCount}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Created
          </div>
          <div className="mt-2 text-lg font-medium">{createdAtLabel}</div>
        </Card>
      </div>
    </div>
  );
}
