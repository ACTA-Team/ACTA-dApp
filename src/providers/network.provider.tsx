"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Network = "testnet" | "mainnet";

type NetworkContextType = {
  network: Network;
  setNetwork: (n: Network) => void;
  apiBaseUrl: string;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  // Start with a deterministic default to avoid SSR/CSR hydration mismatches.
  const [network, setNetwork] = useState<Network>("testnet");

  // After mount, sync with localStorage if a value exists.
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("network");
        if (stored === "mainnet" || stored === "testnet") {
          setNetwork(stored as Network);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("network", network);
      }
    } catch {}
  }, [network]);

  const apiBaseUrl = useMemo(() => {
    const testnet = process.env.NEXT_PUBLIC_ACTA_API_URL_TESTNET || "https://api.testnet.acta.build";
    const mainnet = process.env.NEXT_PUBLIC_ACTA_API_URL_MAINNET || "https://api.mainnet.acta.build";
    return network === "mainnet" ? mainnet : testnet;
  }, [network]);

  const value = useMemo(
    () => ({ network, setNetwork, apiBaseUrl }),
    [network, apiBaseUrl]
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}