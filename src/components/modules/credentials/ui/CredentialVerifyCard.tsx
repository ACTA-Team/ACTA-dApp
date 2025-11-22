'use client';

import { Copy, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useVerifyCard } from '@/components/modules/credentials/hooks/useVerifyCard';
import type { CredentialVerifyProps } from '@/@types/credentials';

export function CredentialVerifyCard({
  vcId,
  status,
  since,
  revealed,
  zkValid,
  zkStatement,
  hasVerified,
}: CredentialVerifyProps) {
  const { displayStatus, formatRevealed, copy } = useVerifyCard(status);
  const kind =
    zkStatement && typeof zkStatement === 'object'
      ? (zkStatement as { kind?: string }).kind
      : undefined;
  const testName =
    kind === 'isAdult'
      ? 'Age ≥ 18'
      : kind === 'notExpired'
        ? 'Not expired'
        : kind === 'isValid'
          ? 'Status is valid'
          : undefined;
  const StatusIcon =
    displayStatus === 'Revoked'
      ? XCircle
      : displayStatus === 'Expired'
        ? AlertCircle
        : CheckCircle2;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="relative rounded-2xl w-full max-w-4xl bg-black shadow-2xl overflow-hidden border border-[#edeed1]/20">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Image
            src={"/acta.png"}
            alt=""
            width={1024}
            height={1024}
            className={'w-[1024px] h-[1024px] object-contain'}
          />
        </div>

        <div className="relative z-10 p-8 space-y-6 text-white">
          <div className="flex items-start justify-between pb-6 border-b border-[#edeed1]/20">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Credential</h2>
              <p className="text-sm text-zinc-400">
                {(revealed?.type as string) || 'VerifiableCredential'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white tracking-tight mb-3">ACTA</div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${
                  displayStatus === 'Revoked'
                    ? 'bg-red-950/50 border-red-500/30 text-red-400'
                    : displayStatus === 'Expired'
                      ? 'bg-yellow-950/50 border-yellow-500/30 text-yellow-400'
                      : 'bg-green-950/50 border-green-500/30 text-green-400'
                }`}
              >
                <StatusIcon className="w-4 h-4" />
                {displayStatus}
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-zinc-900/40 backdrop-blur-sm rounded-xl p-5 border border-[#edeed1]/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">VC ID</span>
              <span className="text-xs text-zinc-500">Verification On-chain</span>
            </div>
            <div className="font-mono text-sm text-zinc-300 break-all leading-relaxed">
              {vcId || '-'}
            </div>
            {hasVerified && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">ZK Proof</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-lg border ${
                      zkValid
                        ? 'bg-green-950/50 border-green-500/30 text-green-400'
                        : zkValid === false
                          ? 'bg-red-950/50 border-red-500/30 text-red-400'
                          : 'bg-zinc-900 border-white/10 text-zinc-400'
                    }`}
                  >
                    {zkValid == null ? 'Not provided' : zkValid ? 'Passed' : 'Failed'}
                  </span>
                </div>
                {testName && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Test</span>
                    <span
                      className={
                        kind === 'isValid'
                          ? 'text-xs px-2 py-1 rounded-lg border bg-zinc-900 border-green-500/30 text-green-400'
                          : 'text-xs px-2 py-1 rounded-lg border bg-zinc-900 border-white/10 text-zinc-400'
                      }
                    >
                      {testName}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-xs text-zinc-400">
                  Verification uses the provided zero-knowledge proof; no private data is revealed.
                </div>
              </>
            )}
          </div>

          {revealed && (
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-semibold text-white">Revealed fields</h3>
              <div className="space-y-3">
                {Object.entries(revealed).map(([k, v]) => {
                  const { text, raw, isWallet } = formatRevealed(k, v);

                  return (
                    <div
                      key={k}
                      className="flex items-start justify-between gap-6 py-3 border-b border-[#edeed1]/10 last:border-0"
                    >
                      <span className="text-sm font-medium text-white capitalize min-w-[120px]">
                        {k}
                      </span>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-sm text-zinc-300 text-right break-all font-mono">
                          {text}
                        </span>
                        {isWallet && (
                          <button
                            onClick={() => copy(raw)}
                            className="p-2 rounded-lg hover:bg-[#edeed1]/10 transition-colors shrink-0 border border-[#edeed1]/30"
                            title="Copy"
                            aria-label="Copy wallet"
                          >
                            <Copy className="w-4 h-4 text-[#edeed1]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {displayStatus === 'Revoked' && since && (
            <div className="pt-4 border-t border-[#edeed1]/20">
              <div className="text-sm text-red-400 font-medium">Revoked: {since}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
