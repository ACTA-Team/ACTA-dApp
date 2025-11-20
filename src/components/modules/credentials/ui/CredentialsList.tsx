"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useVault } from "@/components/modules/vault/hooks/use-vault";
import ShareCredentialModal from "./ShareCredentialModal";

type Credential = {
  id: string;
  title: string;
  issuer: string;
  subject: string;
  type: string;
  issuedAt: string;
  expirationDate?: string | null;
  status: "valid" | "expired" | "revoked";
};

function adaptVcToCredential(vc: any): Credential {
  let parsed: any = null;
  try {
    parsed =
      typeof vc?.data === "string" ? JSON.parse(vc.data) : vc?.data || null;
  } catch {
    parsed = null;
  }

  const title =
    parsed?.title ||
    parsed?.name ||
    parsed?.credentialSubject?.name ||
    "Credential";
  const issuer = vc?.issuer_did || parsed?.issuer || parsed?.issuerName || "-";
  const subject =
    parsed?.subject ||
    parsed?.subjectDID ||
    parsed?.credentialSubject?.id ||
    "-";
  const rawType = parsed?.type || parsed?.credentialType || "VC";
  let type: string;
  if (Array.isArray(rawType)) {
    const filtered = rawType
      .map((t: any) => String(t))
      .filter((t: string) => t.toLowerCase() !== "verifiablecredential");
    type = filtered.join(", ") || "Credential";
  } else {
    const parts = String(rawType)
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s.toLowerCase() !== "verifiablecredential");
    type = parts.join(", ") || "Credential";
  }
  const issuedAt =
    parsed?.issuedAt || parsed?.issuanceDate || new Date().toISOString();
  const expirationDate =
    parsed?.expirationDate || parsed?.validUntil || parsed?.credentialSubject?.expirationDate || null;

  return {
    id: String(vc?.id ?? "unknown"),
    title: String(title),
    issuer: String(issuer),
    subject: String(subject),
    type: String(type),
    issuedAt: String(issuedAt),
    expirationDate: expirationDate ? String(expirationDate) : null,
    status: "valid",
  };
}

export default function CredentialsList() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const { vcs } = useVault();

  const [source, setSource] = useState<Credential[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [toShare, setToShare] = useState<Credential | null>(null);

  useEffect(() => {
    const mapped = Array.isArray(vcs)
      ? vcs.map((vc: any) => adaptVcToCredential(vc))
      : [];
    setSource(mapped);
  }, [vcs]);

  const items = useMemo(() => {
    return source.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.type.toLowerCase().includes(query.toLowerCase()) ||
        c.issuer.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" ? true : c.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter, source]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          placeholder="Search by title, type, or issuer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-2/3 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
        >
          <option value="all">All</option>
          <option value="valid">Valid</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor:
                    c.status === "valid"
                      ? "#DCFCE7"
                      : c.status === "expired"
                      ? "#FDE68A"
                      : "#FECACA",
                  color:
                    c.status === "valid"
                      ? "#065F46"
                      : c.status === "expired"
                      ? "#92400E"
                      : "#7F1D1D",
                }}
              >
                {c.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="opacity-70">Type</div>
              <div className="font-medium">{c.type}</div>
              <div className="opacity-70">Issuer</div>
              <div className="font-medium truncate">{c.issuer}</div>
              <div className="opacity-70">Subject</div>
              <div className="font-medium truncate">{c.subject}</div>
              <div className="opacity-70">Issued At</div>
              <div className="font-medium">
                {new Date(c.issuedAt).toLocaleString()}
              </div>
              {c.expirationDate && (
                <>
                  <div className="opacity-70">Expires</div>
                  <div className="font-medium">
                    {new Date(c.expirationDate).toLocaleString()}
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setToShare(c);
                  setShareOpen(true);
                }}
                className="rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-1 text-sm"
              >
                Share (ZK)
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-neutral-500">No credentials found.</div>
        )}
        {shareOpen && (
          <ShareCredentialModal
            open={shareOpen}
            credential={toShare}
            onClose={() => {
              setShareOpen(false);
              setToShare(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
