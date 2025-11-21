'use client';

import { useMemo, useState } from 'react';
import { useVault } from '@/components/modules/vault/hooks/use-vault';
import type { Credential } from '@/@types/credentials';

function adaptVcToCredential(vc: unknown): Credential {
  const obj = (vc ?? {}) as Record<string, unknown>;
  let parsed: unknown = null;
  try {
    parsed = typeof obj.data === 'string' ? JSON.parse(obj.data as string) : (obj.data ?? null);
  } catch {
    parsed = null;
  }

  const p = (parsed ?? {}) as Record<string, unknown>;
  const cs = (p.credentialSubject ?? {}) as Record<string, unknown>;
  const title = (p.title as string) || (p.name as string) || (cs.name as string) || 'Credential';
  const issuer =
    (obj.issuer_did as string) || (p.issuer as string) || (p.issuerName as string) || '-';
  const subject = (p.subject as string) || (p.subjectDID as string) || (cs.id as string) || '-';
  const rawType = (p.type as unknown) ?? (p.credentialType as unknown) ?? 'VC';
  let type: string;
  if (Array.isArray(rawType)) {
    const filtered = rawType
      .map((t) => String(t))
      .filter((t) => t.toLowerCase() !== 'verifiablecredential');
    type = filtered.join(', ') || 'Credential';
  } else {
    const parts = String(rawType)
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && s.toLowerCase() !== 'verifiablecredential');
    type = parts.join(', ') || 'Credential';
  }
  const issuedAt = (p.issuedAt as string) || (p.issuanceDate as string) || new Date().toISOString();
  const expirationDate =
    (p.expirationDate as string) ||
    (p.validUntil as string) ||
    (cs.expirationDate as string) ||
    null;
  const birthDate = (cs.birthDate as string) || (p.birthDate as string) || undefined;

  return {
    id: String(obj.id ?? 'unknown'),
    title: String(title),
    issuer: String(issuer),
    subject: String(subject),
    type: String(type),
    issuedAt: String(issuedAt),
    expirationDate: expirationDate ? String(expirationDate) : null,
    status: 'valid',
    birthDate: birthDate ? String(birthDate) : undefined,
  };
}

export function useCredentialsList() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const { vcs } = useVault();

  const source = useMemo<Credential[]>(() => {
    const list = Array.isArray(vcs) ? (vcs as unknown[]).map((vc) => adaptVcToCredential(vc)) : [];
    return list;
  }, [vcs]);

  const [shareOpen, setShareOpen] = useState(false);
  const [toShare, setToShare] = useState<Credential | null>(null);

  const items = useMemo(() => {
    return source.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.type.toLowerCase().includes(query.toLowerCase()) ||
        c.issuer.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'all' ? true : c.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter, source]);

  const openShare = (c: Credential) => {
    setToShare(c);
    setShareOpen(true);
  };

  const closeShare = () => {
    setShareOpen(false);
    setToShare(null);
  };

  return {
    query,
    setQuery,
    filter,
    setFilter,
    items,
    shareOpen,
    toShare,
    openShare,
    closeShare,
  };
}
