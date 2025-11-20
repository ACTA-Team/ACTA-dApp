"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
};

export function NetworkSwitchModal({ open, onOpenChange, onConfirm }: Props) {
  // Add/remove a body class so the sidebar becomes transparent only when this modal is open
  useEffect(() => {
    const cls = "modal-sidebar-transparent";
    if (open) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => {
      document.body.classList.remove(cls);
    };
  }, [open]);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border shadow-lg",
            "bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
          )}
        >
          <div className="flex items-center justify-between px-4 pt-4">
            <Dialog.Title className="text-lg font-semibold">Switch to Mainnet</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div className="rounded-lg border p-4 bg-orange-50 text-orange-900 dark:bg-orange-900/20 dark:text-orange-200">
              <div className="font-semibold">Important Notice</div>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                <li>Mainnet uses real XLM and assets with financial implications.</li>
                <li>All transactions are permanent and irreversible.</li>
                <li>You are using real funds, not test tokens.</li>
                <li>Ensure your wallet is connected to the correct network.</li>
                <li>In ACTA, issued credentials will be recorded in your Vault.</li>
                <li>If you encounter issues switching, disconnect and reconnect your wallet.</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4 bg-neutral-50 dark:bg-neutral-900">
              <div className="font-semibold">What is Mainnet?</div>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                Mainnet is Stellar's production network where real transactions occur. Unlike testnet, all operations are effective and may have economic impact. Make sure you understand the risks before continuing.
              </p>
            </div>
          </div>
          <div className="px-4 pb-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            </Dialog.Close>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
            >
              Switch to Mainnet
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}