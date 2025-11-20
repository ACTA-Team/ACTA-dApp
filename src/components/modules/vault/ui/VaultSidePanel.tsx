'use client';

import Link from 'next/link';
import { BalanceCard } from '@/components/ui/balance-card';
import { useVault } from '@/components/modules/vault/hooks/use-vault';
import { useWalletContext } from '@/providers/wallet.provider';
import { useNetwork } from '@/providers/network.provider';
import { useMemo, useState } from 'react';
import { IconUpload, IconShieldCheck } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function shorten(addr: string | null): string {
  if (!addr) return '-';
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-6)}` : addr;
}

export function VaultSidePanel() {
  const { walletAddress } = useWalletContext();
  const { network } = useNetwork();
  const { usdcBalance, vcIds, createVault, vaultExists, loading } = useVault();
  const { vcReadError } = useVault();
  const queryClient = useQueryClient();
  const [showDark, setShowDark] = useState(false);
  const vcCount = useMemo(() => (Array.isArray(vcIds) ? vcIds.length : 0), [vcIds]);

  const handleRefresh = async () => {
    setShowDark((v) => !v);
    try {
      await queryClient.invalidateQueries({
        queryKey: ['vault', 'dashboard', walletAddress, network],
      });
    } catch {}
  };

  return (
    <div className="w-full md:w-[360px] lg:w-[400px] xl:w-[440px] shrink-0">
      {vcReadError && (
        <div className="mb-4 rounded-xl border border-yellow-600 bg-yellow-900/30 text-yellow-200 px-4 py-3 text-sm">
          Your credentials could not be loaded (backend error). You can still create and issue
          credentials while this is being fixed.
        </div>
      )}
      <div className="relative mb-6">
        {showDark ? (
          <BalanceCard
            balance={usdcBalance ?? '-'}
            currency="USD"
            owner={shorten(walletAddress)}
            variant="dark"
            title="Balance"
            onRefresh={handleRefresh}
          />
        ) : (
          <BalanceCard
            balance={String(vcCount)}
            currency="Credentials"
            owner={shorten(walletAddress)}
            variant="blue"
            title="Vault"
            onRefresh={handleRefresh}
          />
        )}
      </div>

      {vaultExists === false && (
        <div className="mb-4">
          <Button
            onClick={async () => {
              try {
                await createVault();
                toast.success('Vault created');
              } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : 'Error creating vault';
                toast.error(msg);
              }
            }}
            disabled={loading}
            className="w-full rounded-2xl bg-[#2a2d33] hover:bg-[#343840] px-5 py-5 text-white text-base"
          >
            {loading ? 'Creating...' : 'Create Vault'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/dashboard/issue"
          className="rounded-2xl bg-[#2a2d33] hover:bg-[#343840] px-5 py-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-[#202328] grid place-items-center text-white">
              <IconUpload className="size-5" />
            </div>
            <div className="text-base">Issue</div>
          </div>
        </Link>

        {vaultExists !== false && (
          <Link
            href="/dashboard/authorize"
            className="rounded-2xl bg-[#2a2d33] hover:bg-[#343840] px-5 py-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-[#202328] grid place-items-center text-white">
                <IconShieldCheck className="size-5" />
              </div>
              <div className="text-base">Authorize</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
