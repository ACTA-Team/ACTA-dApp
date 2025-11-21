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
  const {
    fields,
    selected,
    copied,
    shareParam,
    onSelectAll,
    onUnselectAll,
    onToggle,
    onCopy,
    predicate,
    setPredicate,
    loading,
    error,
    onGenerateProof,
  } = useShareCredential(credential);
  const hasDob = !!credential?.birthDate;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[520px] max-h-[90vh] rounded-2xl border border-white/10 bg-black shadow-xl mx-4 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-white font-semibold text-lg">Share Credential</div>
              <div className="text-xs text-zinc-400">Select which fields to include</div>
            </div>
            <button
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={onSelectAll}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              Select all
            </button>
            <button
              onClick={onUnselectAll}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              Unselect
            </button>
          </div>

          <div className="space-y-2">
            {fields.map((f) => (
              <label
                key={f.key}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-3 cursor-pointer hover:border-white/20 transition-colors"
              >
                <div className="text-white text-sm font-medium">{f.label}</div>
                <input
                  type="checkbox"
                  checked={!!selected[f.key]}
                  onChange={() => onToggle(f.key)}
                  className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-white focus:ring-white/50 focus:ring-offset-0 cursor-pointer"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-sm text-white font-medium">ZK Predicate</div>
            <div className="flex items-center gap-2">
              <select
                value={predicate.kind}
                onChange={(e) =>
                  setPredicate({ kind: e.target.value as any, value: predicate.value })
                }
                className="flex-1 rounded-lg border border-white/10 bg-zinc-900 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/20"
              >
                <option value="none">none</option>
                <option value="typeEq">type equals</option>
                {hasDob && <option value="isAdult">age ≥ 18</option>}
              </select>
              {predicate.kind === 'typeEq' && (
                <input
                  value={predicate.value || ''}
                  onChange={(e) => setPredicate({ kind: predicate.kind, value: e.target.value })}
                  placeholder="expected value"
                  className="flex-1 rounded-lg border border-white/10 bg-zinc-900 text-white text-sm px-3 py-2 placeholder:text-zinc-500 focus:outline-none focus:border-white/20"
                />
              )}
              <button
                onClick={onGenerateProof}
                disabled={loading || (predicate.kind === 'isAdult' && !hasDob)}
                className="rounded-lg border border-white/20 bg-transparent hover:bg-white/5 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating…' : 'Generate ZK Proof'}
              </button>
            </div>
            {error && <div className="text-sm text-red-400">{error}</div>}
            {predicate.kind === 'isAdult' && !hasDob && (
              <div className="text-sm text-zinc-400">
                Birth date required in KYC to enable age proof.
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={onCopy}
              disabled={!shareParam}
              className="flex-1 rounded-lg border border-white/20 bg-transparent hover:bg-white/5 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Share Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
