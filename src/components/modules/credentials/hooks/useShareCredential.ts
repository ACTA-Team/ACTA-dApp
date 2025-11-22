'use client';

import { useMemo, useState } from 'react';
import type { Credential, ZkStatement } from '@/@types/credentials';

export function useShareCredential(credential: Credential | null) {
  const fields = useMemo(
    () => [
      { key: 'issuer', label: 'Issuer' },
      { key: 'subject', label: 'Holder DID' },
      { key: 'type', label: 'Credential Type' },
      { key: 'issuedAt', label: 'Issued At' },
      { key: 'expirationDate', label: 'Expiration Date' },
      { key: 'status', label: 'Status' },
    ],
    []
  );

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [predicate, setPredicate] = useState<{
    kind: 'none' | 'isAdult' | 'notExpired' | 'isValid';
  }>({ kind: 'none' });
  const [proof, setProof] = useState<{
    statement: ZkStatement;
    publicSignals: string[];
    proof: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelectAll = () => {
    if (!credential) return;
    const next: Record<string, boolean> = {};
    const c = credential as unknown as Record<string, unknown>;
    for (const f of fields) {
      const val = c[f.key];
      next[f.key] = val !== undefined && val !== null && String(val) !== '';
    }
    setSelected(next);
    setCopied(false);
  };

  const onUnselectAll = () => {
    setSelected({});
    setCopied(false);
  };

  const revealedFields = useMemo(() => {
    const obj: Record<string, unknown> = {};
    if (!credential) return obj;
    const c = credential as unknown as Record<string, unknown>;
    for (const f of fields) {
      if (selected[f.key] && c[f.key] != null) {
        obj[f.key] = c[f.key] as unknown;
      }
    }
    return obj;
  }, [fields, selected, credential]);

  const shareParam = useMemo(() => {
    try {
      const payload: Record<string, unknown> = { revealedFields };
      if (credential?.id) payload.vc_id = credential.id;
      if (proof) {
        payload.statement = proof.statement as unknown;
        payload.publicSignals = proof.publicSignals as unknown;
        payload.proof = proof.proof as unknown;
      }
      const json = JSON.stringify(payload);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
      return encoded;
    } catch {
      return '';
    }
  }, [revealedFields, credential, proof]);

  const onToggle = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
    setCopied(false);
  };

  const onCopy = async () => {
    try {
      const vcId = credential?.id || '';
      const url = `${window.location.origin}/credential/${vcId}#share=${shareParam}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {}
  };

  async function onGenerateProof() {
    setLoading(true);
    setError(null);
    setProof(null);
    try {
      const kind = predicate.kind;
      if (kind === 'none') {
        setProof({ statement: 'none', publicSignals: [], proof: null });
      } else {
        if (!credential) {
          setProof({ statement: 'none', publicSignals: [], proof: null });
          return;
        }
        if (kind === 'isAdult' && !('birthDate' in credential)) {
          throw new Error('birth_date_missing');
        }
        const { generateZkProof } = await import('@/lib/zk');
        const res = await generateZkProof({
          credential: credential as unknown as Record<string, unknown>,
          revealFields: selected,
          predicate,
        });
        setProof({
          statement: res.statement as ZkStatement,
          publicSignals: res.publicSignals as string[],
          proof: res.proof,
        });
      }
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e && 'message' in e
          ? String((e as { message?: unknown }).message || '')
          : '';
      setError(msg || 'proof_error');
    } finally {
      setLoading(false);
    }
  }

  return {
    fields,
    selected,
    copied,
    revealedFields,
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
  };
}
