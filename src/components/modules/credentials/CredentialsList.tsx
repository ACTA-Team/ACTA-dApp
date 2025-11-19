"use client";

import { useMemo, useState } from "react";

type Credential = {
  id: string;
  title: string;
  issuer: string;
  subject: string;
  type: string;
  issuedAt: string;
  status: "valid" | "expired" | "revoked";
};

const MOCK_CREDENTIALS: Credential[] = [
  {
    id: "cred-001",
    title: "University Degree",
    issuer: "did:example:university-abc",
    subject: "did:example:user123",
    type: "UniversityDegree",
    issuedAt: "2024-06-01T12:00:00Z",
    status: "valid",
  },
  {
    id: "cred-002",
    title: "KYC Verification",
    issuer: "did:example:kyc-provider",
    subject: "did:example:user123",
    type: "KYC",
    issuedAt: "2023-11-15T08:30:00Z",
    status: "expired",
  },
  {
    id: "cred-003",
    title: "Membership Card",
    issuer: "did:example:acta-club",
    subject: "did:example:user123",
    type: "Membership",
    issuedAt: "2025-01-10T09:00:00Z",
    status: "valid",
  },
];

export default function CredentialsList() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const items = useMemo(() => {
    return MOCK_CREDENTIALS.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.type.toLowerCase().includes(query.toLowerCase()) ||
        c.issuer.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" ? true : c.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

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
              <div className="opacity-70">Issued</div>
              <div className="font-medium">
                {new Date(c.issuedAt).toLocaleString()}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="rounded-full bg-black text-white px-4 py-1 text-sm">
                View
              </button>
              <button className="rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-1 text-sm">
                Share
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-neutral-500">No credentials found.</div>
        )}
      </div>
    </div>
  );
}