"use client";

import { cn } from "@/lib/utils";

export function NetworkToggle({
  checked,
  onCheckedChange,
  label,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn("inline-flex items-center gap-2 select-none", className)}
    >
      <span
        className={cn(
          "relative inline-flex items-center h-6 w-11 rounded-full transition-colors",
          checked ? "bg-gray-600" : "bg-neutral-300 dark:bg-neutral-700"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
      <span className="text-sm text-foreground">
        {label ?? (checked ? "Testnet" : "Mainnet")}
      </span>
    </button>
  );
}
