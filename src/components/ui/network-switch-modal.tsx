'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
};

export function NetworkSwitchModal({ open, onOpenChange, onConfirm }: Props) {
  useEffect(() => {
    const cls = 'modal-sidebar-transparent';
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[440px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto pretty-scrollbar',
            'rounded-2xl border border-zinc-800 shadow-2xl',
            'bg-zinc-900/95 backdrop-blur-md text-white'
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <Dialog.Title className="text-lg font-semibold text-white">
              Switch to Mainnet
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-3 px-5 py-4">
            <div className="rounded-xl border border-orange-900/50 bg-orange-950/30 p-3">
              <div className="text-sm font-semibold text-orange-400">Important Notice</div>
              <ul className="mt-2 space-y-1.5 pl-5 text-xs text-orange-200/90 list-disc">
                <li>Mainnet uses real XLM and assets with financial implications.</li>
                <li>All transactions are permanent and irreversible.</li>
                <li>You are using real funds, not test tokens.</li>
                <li>Ensure your wallet is connected to the correct network.</li>
                <li>In ACTA, issued credentials will be recorded in your Vault.</li>
                <li>If you encounter issues switching, disconnect and reconnect your wallet.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-800/50 p-3">
              <div className="text-sm font-semibold text-white">What is Mainnet?</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                Mainnet is Stellar's production network where real transactions occur. Unlike
                testnet, all operations are effective and may have economic impact. Make sure you
                understand the risks before continuing.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-800 px-5 py-3">
            <Dialog.Close asChild>
              <button className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Switch to Mainnet
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
