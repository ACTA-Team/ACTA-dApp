"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";
import { useNetwork } from "@/providers/network.provider";

type WalletContextType = {
  walletAddress: string | null;
  walletName: string | null;
  authMethod: "wallet" | null;
  setWalletInfo: (address: string, name: string) => Promise<void>;
  clearWalletInfo: () => void;
  signTransaction:
    | ((xdr: string, options: { networkPassphrase: string }) => Promise<string>)
    | null;
  walletKit: StellarWalletsKit | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<"wallet" | null>(null);
  const [walletKit, setWalletKit] = useState<StellarWalletsKit | null>(null);
  const { network } = useNetwork();

  useEffect(() => {
    const storedAddress = typeof window !== "undefined" ? localStorage.getItem("walletAddress") : null;
    const storedName = typeof window !== "undefined" ? localStorage.getItem("walletName") : null;
    if (storedAddress) setWalletAddress(storedAddress);
    if (storedName) setWalletName(storedName);
    if (storedAddress) setAuthMethod("wallet");
  }, []);

  // Recreate kit when network changes to ensure proper signing context
  useEffect(() => {
    if (typeof window !== "undefined") {
      const net = network === "mainnet" ? WalletNetwork.PUBLIC : WalletNetwork.TESTNET;
      const kit = new StellarWalletsKit({
        network: net,
        selectedWalletId: FREIGHTER_ID,
        modules: allowAllModules(),
      });
      setWalletKit(kit);
    }
  }, [network]);

  const setWalletInfo = async (address: string, name: string) => {
    setWalletAddress(address);
    setWalletName(name);
    setAuthMethod("wallet");
    if (typeof window !== "undefined") {
      localStorage.setItem("walletAddress", address);
      localStorage.setItem("walletName", name);
    }
  };

  const clearWalletInfo = () => {
    setWalletAddress(null);
    setWalletName(null);
    setAuthMethod(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("walletName");
    }
  };

  const signTransaction = async (xdr: string, options: { networkPassphrase: string }) => {
    if (!walletKit) throw new Error("Wallet kit not initialized");
    const { signedTxXdr } = await walletKit.signTransaction(xdr, {
      address: walletAddress || undefined,
      networkPassphrase: options.networkPassphrase,
    });
    return signedTxXdr;
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletName,
        authMethod,
        setWalletInfo,
        clearWalletInfo,
        signTransaction: walletAddress ? signTransaction : null,
        walletKit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used within WalletProvider");
  return ctx;
};