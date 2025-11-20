"use client";

import * as React from "react";
import { useState } from "react";
import { Copy, LogOut, Wallet as WalletIcon, Check } from "lucide-react";
import { useWalletContext } from "@/providers/wallet.provider";
import { useWalletKit } from "@/hooks/wallet/use-wallet-kit";

export const Wallet = () => {
  const { connectWithWalletKit, disconnectWalletKit } = useWalletKit();
  const { walletAddress, walletName } = useWalletContext();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleConnect = async () => {
    try {
      await connectWithWalletKit();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWalletKit();
      setOpen(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  if (walletAddress) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 rounded border px-3 py-2 text-sm"
          onClick={() => setOpen((v) => !v)}
        >
          <WalletIcon className="h-4 w-4" />
          {walletName ? `${walletName}` : "Wallet"}
          <span className="ml-2 font-mono">{shortAddr(walletAddress)}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-64 rounded border bg-white p-3 shadow-md dark:bg-black">
            <div className="space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Connected as
              </div>
              <div className="font-mono text-sm break-all">{walletAddress}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 rounded border px-2 py-2 text-sm"
                onClick={() => copyToClipboard(walletAddress)}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 rounded border px-2 py-2 text-sm"
                onClick={handleDisconnect}
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
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
