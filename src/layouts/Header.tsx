"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet } from "@/components/auth/Wallet";

export function HeaderHome() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold">Stellar House</span>
        </Link>
        <div className="flex items-center gap-2">
          <Wallet />
        </div>
      </div>
    </header>
  );
}
