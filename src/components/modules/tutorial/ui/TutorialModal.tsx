'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function TutorialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 z-9998" onClick={onClose} />
      <div className="relative z-9999 w-full max-w-3xl rounded-3xl border border-zinc-800/50 bg-black p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white font-semibold text-lg">Welcome</div>
            <div className="text-sm text-zinc-400">
              Watch this short tutorial. How to connect your wallet:
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/50"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        <div className="rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900/30">
          <video
            ref={videoRef}
            src="/videos/tutorials/wallet.mp4"
            controls
            muted
            playsInline
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
