'use client';

import { Copy, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useVerifyCard } from '@/components/modules/credentials/hooks/useVerifyCard';

type Props = {
  vcId: string;
  status?: string | null;
  since?: string | null;
  revealed?: Record<string, unknown> | null;
  zkValid?: boolean | null;
  zkStatement?: any | null;
};

export function CredentialVerifyCard({ vcId, status, since, revealed, zkValid, zkStatement }: Props) {
  const { displayStatus, statusDisplay, formatRevealed, copy } = useVerifyCard(status);
  const StatusIcon =
    displayStatus === 'Revoked'
      ? XCircle
      : displayStatus === 'Expired'
        ? AlertCircle
        : CheckCircle2;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="relative rounded-2xl w-full max-w-4xl bg-linear-to-br from-gray-950 via-zinc-950 to-black shadow-2xl overflow-hidden border-2 border-blue-500/40">
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 Q150,120 300,100 T600,100 L600,200 L0,200 Z"
              fill="url(#waveGradient)"
              transform="translate(0, 80)"
            />
            <path
              d="M0,120 Q200,140 400,120 T800,120 L800,250 L0,250 Z"
              fill="url(#waveGradient)"
              transform="translate(0, 120)"
            />
          </svg>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <Image
            src="/logo.png"
            alt=""
            width={320}
            height={320}
            className="w-80 h-80 object-contain"
          />
        </div>

        <div className="relative z-10 p-8 space-y-6 text-white">
          <div className="flex items-start justify-between pb-6 border-b border-blue-500/30">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Credential</h2>
              <p className="text-sm text-gray-400/70">
                {(revealed?.type as string) || 'UniversityDegreeCredential'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-400 tracking-tight mb-3">ACTA</div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${statusDisplay.bg} ${statusDisplay.color} backdrop-blur-sm`}
              >
                <StatusIcon className="w-4 h-4" />
                {displayStatus}
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-zinc-900/40 backdrop-blur-sm rounded-xl p-5 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-300">VC ID</span>
              <span className="text-xs text-gray-400/60">Verification On-chain</span>
            </div>
            <div className="font-mono text-sm text-gray-200/90 break-all leading-relaxed">
              {vcId || '-'}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-300">ZK Proof</span>
              <span className={`text-xs px-2 py-1 rounded-lg ${zkValid ? 'bg-green-700 text-white' : zkValid === false ? 'bg-red-700 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                {zkValid == null ? 'Not provided' : zkValid ? 'Passed' : 'Failed'}
              </span>
            </div>
            {zkStatement?.kind === 'typeEq' && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-300">Is Valid</span>
                <span className={`text-xs px-2 py-1 rounded-lg ${zkStatement?.isValid ? 'bg-green-700 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                  {zkStatement?.isValid ? 'true' : 'false'}
                </span>
              </div>
            )}
            {zkStatement?.kind === 'isAdult' && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-300">Is Adult</span>
                <span className={`text-xs px-2 py-1 rounded-lg ${zkStatement?.isAdult ? 'bg-green-700 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                  {zkStatement?.isAdult ? 'true' : 'false'}
                </span>
              </div>
            )}
          </div>

          {revealed && (
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-semibold text-blue-300">Revealed fields</h3>
              <div className="space-y-3">
                {Object.entries(revealed).map(([k, v]) => {
                  const { text, raw, isWallet } = formatRevealed(k, v);

                  return (
                    <div
                      key={k}
                      className="flex items-start justify-between gap-6 py-3 border-b border-zinc-800/50 last:border-0"
                    >
                      <span className="text-sm font-medium text-blue-300 capitalize min-w-[120px]">
                        {k}
                      </span>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-sm text-gray-200/90 text-right break-all font-mono">
                          {text}
                        </span>
                        {isWallet && (
                          <button
                            onClick={() => copy(raw)}
                            className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors shrink-0"
                            title="Copy"
                            aria-label="Copy wallet"
                          >
                            <Copy className="w-4 h-4 text-blue-400" />
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
            <div className="pt-4 border-t border-blue-500/30">
              <div className="text-sm text-red-400 font-medium">Revoked: {since}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
