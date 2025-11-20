'use client';

import { useShareCredential } from '@/components/modules/credentials/hooks/useShareCredential';

import type { Credential } from '@/@types/credentials';

export default function ShareCredentialModal({
  open,
  credential,
  onClose,
}: {
  open: boolean;
  credential: Credential | null;
  onClose: () => void;
}) {
  const { fields, selected, copied, shareParam, onSelectAll, onUnselectAll, onToggle, onCopy } =
    useShareCredential(credential);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[520px] rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl mx-4 overflow-x-hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-white font-semibold">Share Credential</div>
            <div className="text-xs text-zinc-400">Select which fields to include</div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onSelectAll}
            className="text-xs px-2 py-1 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
          >
            Select all
          </button>
          <button
            onClick={onUnselectAll}
            className="text-xs px-2 py-1 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
          >
            Unselect
          </button>
        </div>

        <div className="space-y-2">
          {fields.map((f) => (
            <label
              key={f.key}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/30 px-3 py-2 cursor-pointer hover:bg-zinc-800/50 transition-colors"
            >
              <div className="text-white text-xs font-medium">{f.label}</div>
              <input
                type="checkbox"
                checked={!!selected[f.key]}
                onChange={() => onToggle(f.key)}
                className="w-4 h-4 border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-600 cursor-pointer"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onCopy}
            disabled={!shareParam}
            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy Share Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
