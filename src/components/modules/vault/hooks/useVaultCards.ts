'use client';

import { useMemo, useState } from 'react';
import type { Credential as ActaCredential } from '@/@types/credentials';
import type { VaultItem } from '@/@types/vault';
import { toast } from 'sonner';
import { useVaultDashboard } from './useVaultDashboard';

export function useVaultCards() {
  const { items, query } = useVaultDashboard();

  const actaCredentials = useMemo<ActaCredential[]>(() => items, [items]);
  const actaById = useMemo(() => new Map(actaCredentials.map((c) => [c.id, c])), [actaCredentials]);

  const getWalletFromDid = (subject: string) => {
    try {
      const parts = String(subject).split(':');
      return parts[parts.length - 1] || subject;
    } catch {
      return subject;
    }
  };

  const [extras] = useState<VaultItem[]>([]);
  const credentials = useMemo<VaultItem[]>(() => {
    const base = actaCredentials.map((c) => ({
      id: c.id,
      name: c.title,
      username: c.subject,
      password: 'encrypted',
      url: '',
      category: c.type,
      createdAt: new Date(c.issuedAt),
    }));
    return [...base, ...extras];
  }, [actaCredentials, extras]);

  const filteredCredentials = useMemo(() => {
    const q = (query || '').toLowerCase();
    return credentials.filter(
      (cred) =>
        cred.name.toLowerCase().includes(q) ||
        cred.username.toLowerCase().includes(q) ||
        cred.category.toLowerCase().includes(q)
    );
  }, [credentials, query]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return {
    actaById,
    getWalletFromDid,
    filteredCredentials,
    copyToClipboard,
  };
}
