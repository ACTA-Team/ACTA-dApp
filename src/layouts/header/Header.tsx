"use client";

import { Wallet } from "@/components/auth/Wallet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NetworkToggle } from "@/components/ui/network-toggle";
import { useNetwork } from "@/providers/network.provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useState } from "react";
import { NetworkSwitchModal } from "@/components/ui/network-switch-modal";

export function HeaderHome() {
  const { network, setNetwork } = useNetwork();
  const [openConfirm, setOpenConfirm] = useState(false);
  return (
    <header className=" mt-2 mb-2 *:w-full bg-background border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-3">
          <NetworkToggle
            checked={network === "testnet"}
            onCheckedChange={(checked) =>
              checked ? setNetwork("testnet") : setOpenConfirm(true)
            }
            className="scale-90"
          />
          <div className="scale-75">
            <AnimatedThemeToggler />
          </div>
          <Wallet />
        </div>
      </div>
      <NetworkSwitchModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        onConfirm={() => setNetwork("mainnet")}
      />
    </header>
  );
}
