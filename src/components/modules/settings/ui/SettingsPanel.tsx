'use client';

import { Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ProfilePanelProps {
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;

  network?: 'testnet' | 'mainnet';
  onNetworkChange?: (network: 'testnet' | 'mainnet') => void;

  walletAddress?: string;
  walletName?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;

  appName?: string;
  appVersion?: string;
}

export function ProfilePanel({
  network = 'testnet',
  onNetworkChange,
  walletAddress,
  onConnect,
  onDisconnect,
  appName = 'ACTA dApp',
  appVersion = '1.0.0',
}: ProfilePanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
      </div>

      {walletAddress && (
        <div className="mb-6 rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="mb-2 text-base font-medium text-zinc-300">Wallet Address</h3>
              <p className="break-all font-mono text-sm text-white">{walletAddress}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-white">Network</h3>
          <p className="text-xs text-zinc-400">Select environment</p>
        </div>
        <div className="inline-flex rounded-lg border border-zinc-700 overflow-hidden">
          <Button
            size="sm"
            variant={network === 'testnet' ? 'default' : 'ghost'}
            className="rounded-none bg-transparent hover:bg-zinc-700 text-white"
            onClick={() => onNetworkChange?.('testnet')}
          >
            Testnet
          </Button>
          <Separator orientation="vertical" className="bg-zinc-700" />
          <Button
            size="sm"
            variant={network === 'mainnet' ? 'default' : 'ghost'}
            className="rounded-none bg-transparent hover:bg-zinc-700 text-white"
            onClick={() => onNetworkChange?.('mainnet')}
          >
            Mainnet
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-white">Wallet</h2>
        {walletAddress ? (
          <Button
            variant="outline"
            className="w-full justify-start rounded-2xl border-zinc-700/50 bg-zinc-800/50 px-6 py-7 text-red-500 transition-colors hover:bg-zinc-800/70 hover:text-red-400"
            onClick={onDisconnect}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="text-base font-medium">Disconnect Wallet</span>
          </Button>
        ) : (
          <Button
            className="w-full rounded-2xl text-white bg-blue-600 py-7 text-base font-medium hover:bg-blue-700"
            onClick={onConnect}
          >
            Connect wallet
          </Button>
        )}
      </div>

      <div className="mt-4">
        <h2 className="mb-3 text-xl font-semibold text-white">About</h2>
        <div className="rounded-2xl bg-zinc-800/50 mb-4 p-6 backdrop-blur-sm">
          <h3 className="mb-1 text-lg font-semibold text-white">{appName}</h3>
          <p className="text-sm text-zinc-400">Version {appVersion}</p>
        </div>
      </div>
    </div>
  );
}
