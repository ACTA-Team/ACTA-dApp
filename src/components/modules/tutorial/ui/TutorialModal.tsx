'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function TutorialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      try {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          try {
            videoRef.current?.play()?.catch(() => {});
          } catch {}
        }, 1000);
      } catch {}
    } else {
      try {
        if (timerRef.current) clearTimeout(timerRef.current);
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
      } catch {}
    }
    return () => {
      try {
        if (timerRef.current) clearTimeout(timerRef.current);
      } catch {}
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 z-9998" onClick={onClose} />
      <div className="relative z-9999 w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl mx-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white font-semibold">Welcome</div>
            <div className="text-xs text-zinc-400">
              Watch this short tutorial. How to connect your wallet:
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-12 w-12 rounded-xl bg-zinc-800/50 hover:bg-zinc-800"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        <div className="rounded-xl overflow-hidden border border-zinc-800">
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
