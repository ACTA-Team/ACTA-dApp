'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      closeButton
      theme="dark"
      position="bottom-right"
      toastOptions={{
        className: 'bg-black border border-white text-white',
        duration: 6000,
        style: { background: '#000', color: '#fff' },
      }}
    />
  );
}
