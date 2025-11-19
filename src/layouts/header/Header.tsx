"use client";

import { Wallet } from "@/components/auth/Wallet";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function HeaderHome() {
  return (
    <header className=" mt-2 mb-2 *:w-full bg-background border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-2">
          <Wallet />
        </div>
      </div>
    </header>
  );
}
