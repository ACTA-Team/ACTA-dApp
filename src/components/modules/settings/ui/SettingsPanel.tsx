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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Profile</h1>
      </div>

      {walletAddress && (
        <div className="mb-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="mb-2 text-sm font-medium text-zinc-400">Wallet Address</h3>
              <p className="break-all font-mono text-base text-white">{walletAddress}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/50 p-6 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Network</h3>
          <p className="text-sm text-zinc-400">Select environment</p>
        </div>
        <div className="inline-flex rounded-full bg-zinc-800 p-1">
          <Button
            size="sm"
            variant={network === 'testnet' ? 'default' : 'ghost'}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
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
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
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
        <h2 className="mb-4 text-2xl font-bold text-white">Wallet</h2>
        {walletAddress ? (
          <Button
            variant="outline"
            className="w-full justify-center rounded-full border-zinc-800 bg-zinc-900/80 px-6 py-6 text-red-400 transition-colors hover:bg-red-950/30 hover:border-red-900 hover:text-red-300"
            onClick={onDisconnect}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="text-base font-semibold">Disconnect Wallet</span>
          </Button>
        ) : (
          <Button
            className="w-full rounded-full text-black bg-white py-6 text-base font-semibold hover:bg-zinc-100"
            onClick={onConnect}
          >
            Connect wallet
          </Button>
        )}
      </div>

      <div className="mt-4">
        <h2 className="mb-4 text-2xl font-bold text-white">About</h2>
        <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800/50 p-6 backdrop-blur-sm">
          <h3 className="mb-1 text-lg font-semibold text-white">{appName}</h3>
          <p className="text-sm text-zinc-400">Version {appVersion}</p>
        </div>
      </div>
    </div>
  );
}
