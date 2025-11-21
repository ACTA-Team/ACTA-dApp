'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useVaultAuthorizedList } from '@/components/modules/vault/hooks/use-vault-authorized-list';
import { toast } from 'sonner';

export function AuthorizedIssuersList() {
  const { issuers, revoke, loading, revoking } = useVaultAuthorizedList();

  const onRevoke = async (addr: string) => {
    try {
      await revoke(addr);
      toast.success('Revoked');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error revoking';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Authorized Wallets</h2>
      <p className="text-sm text-zinc-400">
        List derived from issued credentials. An authorized wallet may not appear until issuance.
      </p>

      <div className="overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-[#edeed1]/20">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-medium text-zinc-400 border-b border-[#edeed1]/20">
          <div className="col-span-6">Address</div>
          <div className="col-span-5">DID</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        <div>
          {issuers.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-zinc-500">
              No authorized wallets detected.
            </div>
          )}
          {issuers.map((it) => (
            <div
              key={it.address}
              className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-t border-[#edeed1]/20 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="col-span-6 font-mono text-sm text-white truncate">{it.address}</div>
              <div className="col-span-5 text-xs text-zinc-400 truncate">{it.issuerDid || '-'}</div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => onRevoke(it.address)}
                  disabled={loading || revoking === it.address}
                  className="h-9 px-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                  aria-label="Revoke"
                >
                  {revoking === it.address ? (
                    <span className="text-xs">Revoking...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
