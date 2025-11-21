'use client';

import { useCredentialsList } from '@/components/modules/credentials/hooks/useCredentialsList';
import ShareCredentialModal from './ShareCredentialModal';
import { Trash2, Share2 } from 'lucide-react';

export default function CredentialsList() {
  const { query, setQuery, filter, setFilter, items, shareOpen, toShare, openShare, closeShare, onRevoke, revokingId } =
    useCredentialsList();

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          placeholder="Search by title, type, or issuer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search credentials"
          className="w-full mt-4 md:w-2/3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="valid">Valid</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      <div className="space-y-4">
        {items.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border-l-4 border-l-blue-500 bg-zinc-900/50 p-4 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white mb-1">{c.title}</h3>
                <p className="text-xs text-zinc-400">{c.type}</p>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor:
                    c.status === 'valid'
                      ? 'rgb(34 197 94 / 0.1)'
                      : c.status === 'expired'
                        ? 'rgb(234 179 8 / 0.1)'
                        : 'rgb(239 68 68 / 0.1)',
                  color:
                    c.status === 'valid'
                      ? 'rgb(34 197 94)'
                      : c.status === 'expired'
                        ? 'rgb(234 179 8)'
                        : 'rgb(239 68 68)',
                }}
              >
                {c.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between gap-3 min-w-0">
                <span className="text-zinc-400 shrink-0">Issuer</span>
                <span className="font-medium text-white break-all ml-4 min-w-0">{c.issuer}</span>
              </div>
              <div className="flex items-center justify-between gap-3 min-w-0">
                <span className="text-zinc-400 shrink-0">Subject</span>
                <span className="font-medium text-white break-all ml-4 min-w-0">{c.subject}</span>
              </div>
              <div className="flex items-center justify-between gap-3 min-w-0">
                <span className="text-zinc-400 shrink-0">Issued At</span>
                <span className="font-medium text-white">
                  {new Date(c.issuedAt).toLocaleDateString()}
                </span>
              </div>
              {c.expirationDate && (
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <span className="text-zinc-400 shrink-0">Expires</span>
                  <span className="font-medium text-white">
                    {new Date(c.expirationDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => openShare(c)}
                className="h-9 w-9 rounded-lg border border-[#edeed1]/30 bg-[#edeed1]/10 text-white hover:bg-[#edeed1]/20 flex items-center justify-center"
                title="Share"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRevoke(c.id)}
                disabled={revokingId === c.id}
                className={`h-9 w-9 rounded-lg border flex items-center justify-center ${revokingId === c.id ? 'cursor-not-allowed opacity-60' : 'hover:bg-red-800/30'} border-red-700/60 bg-red-900/30 text-red-300`}
                title="Revoke"
                aria-label="Revoke"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-zinc-500 text-center py-8">No credentials found.</div>
        )}
        {shareOpen && (
          <ShareCredentialModal open={shareOpen} credential={toShare} onClose={closeShare} />
        )}
      </div>
    </div>
  );
}
