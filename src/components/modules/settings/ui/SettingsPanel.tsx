'use client';

import { Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      {walletAddress && (
        <div className="mb-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="mb-1 text-xs font-medium text-zinc-400">Wallet Address</h3>
              <p className="break-all font-mono text-sm text-white">{walletAddress}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 p-4 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">Network</h3>
          <p className="text-xs text-zinc-400">Select environment</p>
        </div>
        <div className="inline-flex rounded-full bg-zinc-800 p-0.5">
          <Button
            size="sm"
            variant={network === 'testnet' ? 'default' : 'ghost'}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              network === 'testnet'
                ? 'bg-zinc-700 text-white'
                : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            onClick={() => onNetworkChange?.('testnet')}
          >
            Testnet
          </Button>
          <Button
            size="sm"
            variant={network === 'mainnet' ? 'default' : 'ghost'}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              network === 'mainnet'
                ? 'bg-zinc-700 text-white'
                : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            onClick={() => onNetworkChange?.('mainnet')}
          >
            Mainnet
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-bold text-white">Wallet</h2>
        {walletAddress ? (
          <Button
            variant="outline"
            className="w-full justify-center rounded-full border-zinc-800 bg-zinc-900/80 px-5 py-4 text-red-400 transition-colors hover:bg-red-950/30 hover:border-red-900 hover:text-red-300"
            onClick={onDisconnect}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="text-sm font-semibold">Disconnect Wallet</span>
          </Button>
        ) : (
          <Button
            className="w-full rounded-full text-black bg-white py-4 text-sm font-semibold hover:bg-zinc-100"
            onClick={onConnect}
          >
            Connect wallet
          </Button>
        )}
      </div>

      <div className="mt-3">
        <h2 className="mb-3 text-xl font-bold text-white">About</h2>
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/50 p-4 backdrop-blur-sm">
          <h3 className="mb-1 text-base font-semibold text-white">{appName}</h3>
          <p className="text-xs text-zinc-400">Version {appVersion}</p>
        </div>
      </div>
    </div>
  );
}
