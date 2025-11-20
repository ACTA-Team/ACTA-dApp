'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Copy, LogOut, Wallet as WalletIcon, Check, ChevronDown, RefreshCcw } from 'lucide-react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useWalletKit } from '@/components/modules/auth/hooks/useWalletKit';
import { useNetwork } from '@/providers/network.provider';

export const Wallet = () => {
  const { connectWithWalletKit, disconnectWalletKit } = useWalletKit();
  const { walletAddress, walletName } = useWalletContext();
  const { network } = useNetwork();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const horizonUrl = useMemo(
    () =>
      network === 'mainnet' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org',
    [network]
  );

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleConnect = async () => {
    try {
      await connectWithWalletKit();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWalletKit();
      setOpen(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const refreshBalance = useCallback(async () => {
    if (!walletAddress) return setUsdcBalance('0.00');
    try {
      setLoadingBalance(true);
      const resp = await fetch(`${horizonUrl}/accounts/${walletAddress}`);
      if (!resp.ok) throw new Error('account fetch failed');
      const json = await resp.json();
      const balances: Array<{ asset_type?: string; asset_code?: string; balance?: string }> =
        Array.isArray(json?.balances) ? json.balances : [];
      const total = balances
        .filter(
          (b) =>
            (b.asset_type === 'credit_alphanum4' || b.asset_type === 'credit_alphanum12') &&
            b.asset_code === 'USDC'
        )
        .reduce((sum: number, b) => sum + parseFloat(b.balance || '0'), 0);
      const formatted = Number.isFinite(total)
        ? Math.floor(total).toLocaleString(undefined, { maximumFractionDigits: 0 })
        : '0';
      setUsdcBalance(formatted);
    } catch (e) {
      console.warn('USDC balance fetch failed', e);
      setUsdcBalance('0');
    } finally {
      setLoadingBalance(false);
    }
  }, [walletAddress, horizonUrl]);

  useEffect(() => {
    // refresh when dropdown opens or when network/address changes
    if (open) {
      refreshBalance();
    }
  }, [open, refreshBalance]);

  useEffect(() => {
    // background refresh when wallet/network changes
    refreshBalance();
  }, [walletAddress, network, refreshBalance]);

  if (walletAddress) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
        >
          <WalletIcon className="h-4 w-4" />
          <span className="font-medium">{walletName ? `${walletName}` : 'Wallet'}</span>
          <span className="ml-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
            {shortAddr(walletAddress)}
          </span>
          <ChevronDown className="h-4 w-4 ml-1 text-neutral-500" />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-card shadow-lg dark:bg-neutral-900">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{walletName || 'Wallet'}</div>
                <span className="text-xs px-2 py-0.5 rounded-md border bg-muted text-neutral-700 dark:text-neutral-300">
                  {network === 'mainnet' ? 'Mainnet' : 'Testnet'}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-md border px-3 py-2">
                <div className="text-sm">
                  <span className="font-medium">USDC</span>
                  <span className="ml-2">{usdcBalance}</span>
                </div>
                <button
                  className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                  onClick={refreshBalance}
                  aria-label="Refresh balance"
                >
                  <RefreshCcw className={`h-4 w-4 ${loadingBalance ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="mt-3">
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Address</div>
                <div className="rounded-md border bg-background px-3 py-2 font-mono text-xs break-all">
                  {walletAddress}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-blue-50 text-blue-700 dark:text-blue-400"
                  onClick={() => copyToClipboard(walletAddress)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={handleDisconnect}
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 rounded border px-3 py-2 text-sm"
    >
      <WalletIcon className="h-4 w-4" />
      Connect Wallet
    </button>
  );
};

export default Wallet;
