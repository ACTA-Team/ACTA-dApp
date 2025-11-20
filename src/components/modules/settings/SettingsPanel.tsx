"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/components/modules/settings/settings/use-settings";
import { useState } from "react";
import { NetworkSwitchModal } from "@/components/ui/network-switch-modal";
import { toast } from "sonner";

export function SettingsPanel() {
  const {
    theme,
    applyTheme,
    network,
    setNetwork,
    apiBaseUrl,
    walletAddress,
    walletName,
    connect,
    disconnect,
  } = useSettings();
  const [openConfirm, setOpenConfirm] = useState(false);

  const onConnect = async () => {
    try {
      await connect();
      toast.success("Wallet connected");
    } catch (e: any) {
      toast.error(e?.message || "Could not connect wallet");
    }
  };

  const onDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (e: any) {
      toast.error(e?.message || "Could not disconnect wallet");
    }
  };

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <CardContent className="px-6 py-5">
          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-12 md:col-span-4">
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Light or dark
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="inline-flex rounded-md border overflow-hidden">
                <Button
                  size="sm"
                  variant={theme === "light" ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => applyTheme("light")}
                >
                  Light
                </Button>
                <Separator orientation="vertical" />
                <Button
                  size="sm"
                  variant={theme === "dark" ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => applyTheme("dark")}
                >
                  Dark
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-12 md:col-span-4">
              <div className="text-sm font-medium">Network</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Select environment
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="inline-flex rounded-md border overflow-hidden">
                <Button
                  size="sm"
                  variant={network === "testnet" ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => setNetwork("testnet")}
                >
                  Testnet
                </Button>
                <Separator orientation="vertical" />
                <Button
                  size="sm"
                  variant={network === "mainnet" ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => setOpenConfirm(true)}
                >
                  Mainnet
                </Button>
              </div>
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Current API:{" "}
                <span className="font-mono break-all">{apiBaseUrl}</span>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-12 md:col-span-4">
              <div className="text-sm font-medium">Wallet</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Connect your wallet
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              {walletAddress ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2 py-1 rounded-md border font-mono text-xs">
                    {walletName || "Wallet"}
                  </span>
                  <span className="font-mono break-all text-xs text-neutral-600 dark:text-neutral-400">
                    {walletAddress}
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onConnect}
                >
                  Connect wallet
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <NetworkSwitchModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        onConfirm={() => setNetwork("mainnet")}
      />
    </>
  );
}
