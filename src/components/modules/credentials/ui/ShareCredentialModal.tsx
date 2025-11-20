"use client";

import { useMemo, useState } from "react";
import { generateZkProof } from "@/lib/zk";
import { toast } from "sonner";

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

export default function ShareCredentialModal({
  open,
  credential,
  onClose,
}: {
  open: boolean;
  credential: Credential | null;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    title: true,
    issuer: true,
    type: true,
    issuedAt: false,
    subject: false,
    status: false,
  });

  const [predicate, setPredicate] = useState<{
    kind: "none" | "issuerEq" | "subjectEq" | "typeEq" | "notExpired";
    value?: string;
  }>({ kind: "none" });

  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);


  const selectedView = useMemo(() => {
    if (!credential) return {};
    const out: Record<string, string> = {};
    Object.entries(selected).forEach(([k, v]) => {
      if (v) out[k] = (credential as any)[k];
    });
    return out;
  }, [selected, credential]);

  const fieldLabels: Record<keyof Credential, string> = {
    id: "ID",
    title: "Title",
    issuer: "Issuer",
    subject: "Subject",
    type: "Type",
    issuedAt: "Issued At",
    expirationDate: "Expires",
    status: "Status",
  };

  if (!open || !credential) return null;

  const onToggle = (key: keyof Credential) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = (value: boolean) => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      Object.keys(prev).forEach((k) => {
        next[k] = value;
      });
      return next;
    });
  };

  const onSelectAll = () => toggleAll(true);
  const onDeselectAll = () => toggleAll(false);

  const onGenerateProof = async () => {
    setLoading(true);
    setError(null);
    setProof(null);
    try {
      if (predicate.kind === "none") {
        const res = {
          statement: "none",
          publicSignals: [],
          proof: null,
        };
        setProof(res);
        toast.success("Link Ready. Only Selected Information Will Be Visible.");
      } else {
        const res = await generateZkProof({
          credential,
          revealFields: selected,
          predicate,
        });
        setProof(res);
        toast.success("Your Proof Was Generated. Only Selected Information Will Be Visible.");
      }
    } catch (e: any) {
      setError(e?.message || "Error Generating Proof");
    } finally {
      setLoading(false);
    }
  };

  const sharePayload = useMemo(() => {
    if (!proof) return null;
    return {
      vc_id: credential.id,
      // New flow: statement is the predicate kind (string)
      statement: typeof proof.statement === "string" ? proof.statement : predicate.kind,
      publicSignals: proof.publicSignals,
      proof: proof.proof,
      // New flow: renamed to revealedFields
      revealedFields: selectedView,
    };
  }, [proof, selectedView, credential, predicate]);

  const shareUrl = useMemo(() => {
    if (!sharePayload || typeof window === "undefined") return "";
    try {
      const origin = window.location.origin;
      const encoded = encodeURIComponent(
        btoa(unescape(encodeURIComponent(JSON.stringify(sharePayload))))
      );
      return `${origin}/credential/${encodeURIComponent(
        credential.id
      )}?share=${encoded}`;
    } catch {
      return "";
    }
  }, [sharePayload, credential]);

  // Predicados disponibles según el tipo de credencial
  const availablePredicates = useMemo(() => {
    const list: {
      kind: "none" | "issuerEq" | "subjectEq" | "typeEq" | "notExpired";
      label: string;
      hint?: string;
    }[] = [
      { kind: "none", label: "Show Selected Fields Only", hint: "No cryptographic proof" },
      { kind: "issuerEq", label: "Prove Who Issued This Credential", hint: "Verify issuer DID matches expected" },
      { kind: "subjectEq", label: "Prove You Are The Credential Holder", hint: "Verify your DID matches expected" },
      { kind: "typeEq", label: "Confirm Credential Type", hint: "For example: certificate, diploma, etc." },
    ];
    // Show notExpired only if we have an expiration date in summary
    const hasExp = Boolean((credential as any)?.expirationDate);
    if (hasExp) {
      list.push({
        kind: "notExpired",
        label: "Prove It Is Still Valid",
        hint: "Confirm the credential has not expired",
      });
    }
    return list;
  }, [credential]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl rounded-lg bg-white dark:bg-neutral-900 p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold">Share Credential</h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Select What You Want To Share. You Can Optionally Add Cryptographic Proofs To Protect Your Privacy.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border px-2 py-1 text-xs"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">What You Want To Share</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs"
                  title="Select all fields to reveal in the shared view"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={onDeselectAll}
                  className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs"
                  title="Deselect all fields to hide from the shared view"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "title",
                  "issuer",
                  "type",
                  "issuedAt",
                  "subject",
                  "status",
                ] as (keyof Credential)[]
              ).map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!selected[k]}
                    onChange={() => onToggle(k)}
                  />
                  <span title={`Include ${fieldLabels[k]} in the shared view.`}>{fieldLabels[k]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <div className="font-medium mb-2">Privacy And Verification Options</div>
            <div className="grid grid-cols-1 gap-2">
              {availablePredicates.map((p) => (
                <label
                  key={p.kind}
                  className="flex items-center justify-between rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 bg-white/50 dark:bg-neutral-900/50"
                >
                  <div>
                    <div className="font-medium">{p.label}</div>
                    {p.hint && (
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        {p.hint}
                      </div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="predicate"
                    checked={predicate.kind === p.kind}
                    onChange={() => setPredicate({ kind: p.kind })}
                  />
                </label>
              ))}
            </div>
            {/* Inputs removed: proof configuration happens internally; verification is public */}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGenerateProof}
              disabled={loading}
              className="rounded-full bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {loading ? "Generating..." : "Create Secure Link"}
            </button>
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  try {
                    if (shareUrl) {
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("Link Copied To Clipboard");
                    }
                  } catch {}
                }}
                disabled={!shareUrl}
                className="rounded-full border px-3 py-1 text-sm disabled:opacity-50"
              >
                Copy Link
              </button>
              {shareUrl && (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-black text-white px-3 py-1 text-sm"
                >
                  Open Shared View
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
