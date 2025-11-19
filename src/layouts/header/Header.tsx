"use client";

import { Wallet } from "@/components/auth/Wallet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNetwork } from "@/providers/network.provider";

export function HeaderHome() {
  const { network, setNetwork } = useNetwork();
  return (
    <header className=" mt-2 mb-2 *:w-full bg-background border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border px-1 py-1">
            <Button
              size="sm"
              variant={network === "testnet" ? "default" : "ghost"}
              onClick={() => setNetwork("testnet")}
            >
              Testnet
            </Button>
            <Button
              size="sm"
              variant={network === "mainnet" ? "default" : "ghost"}
              onClick={() => setNetwork("mainnet")}
            >
              Mainnet
            </Button>
          </div>
          <Wallet />
        </div>
      </div>
    </header>
  );
}
