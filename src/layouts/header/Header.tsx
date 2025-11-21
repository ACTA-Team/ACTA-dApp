'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NetworkToggle } from '@/components/ui/network-toggle';
import { useNetwork } from '@/providers/network.provider';
import { useState } from 'react';
import { NetworkSwitchModal } from '@/components/ui/network-switch-modal';
import { usePathname } from 'next/navigation';

export function HeaderHome() {
  const { network, setNetwork } = useNetwork();
  const [openConfirm, setOpenConfirm] = useState(false);
  const pathname = usePathname();
  const inDashboard = pathname?.startsWith('/dashboard');
  return (
    <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 ">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3" />

        <div className="flex items-center gap-4">
          <NetworkToggle
            checked={network === 'testnet'}
            onCheckedChange={(checked) => (checked ? setNetwork('testnet') : setOpenConfirm(true))}
          />
        </div>
      </div>
      <NetworkSwitchModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        onConfirm={() => setNetwork('mainnet')}
      />
    </header>
  );
}
