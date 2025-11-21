'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Search, Eye, EyeOff, Copy, Edit, Trash2, Key, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useVaultDashboard } from '@/components/modules/vault/hooks/useVaultDashboard';
import ShareCredentialModal from '@/components/modules/credentials/ui/ShareCredentialModal';
import type { Credential as ActaCredential } from '@/@types/credentials';

interface VaultItem {
  id: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  category: string;
  createdAt: Date;
}

export default function VaultPage() {
  const {
    vaultExists,
    onCreateVault,
    query,
    setQuery,
    items,
    shareOpen,
    toShare,
    openShare,
    closeShare,
  } = useVaultDashboard();
  const [extras, setExtras] = useState<VaultItem[]>([]);
  const adaptVcToActaCredential = (vc: unknown): ActaCredential => {
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
    const issuedAt =
      (p.issuedAt as string) || (p.issuanceDate as string) || new Date().toISOString();
    const expirationDate =
      (p.expirationDate as string) ||
      (p.validUntil as string) ||
      (cs.expirationDate as string) ||
      null;
    return {
      id: String(obj.id ?? 'unknown'),
      title: String(title),
      issuer: String(issuer),
      subject: String(subject),
      type: String(type),
      issuedAt: String(issuedAt),
      expirationDate: expirationDate ? String(expirationDate) : null,
      status: 'valid',
    };
  };
  const actaCredentials = useMemo<ActaCredential[]>(() => {
    return items;
  }, [items]);
  const actaById = useMemo(() => {
    return new Map(actaCredentials.map((c) => [c.id, c]));
  }, [actaCredentials]);
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
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCredential, setNewCredential] = useState({
    name: '',
    username: '',
    password: '',
    url: '',
    category: '',
  });

  const filteredCredentials = useMemo(() => {
    const q = (query || '').toLowerCase();
    return credentials.filter(
      (cred) =>
        cred.name.toLowerCase().includes(q) ||
        cred.username.toLowerCase().includes(q) ||
        cred.category.toLowerCase().includes(q)
    );
  }, [credentials, query]);

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleAddCredential = () => {
    if (!newCredential.name || !newCredential.username || !newCredential.password) {
      toast.error('Please fill all required fields');
      return;
    }

    const credential: VaultItem = {
      id: Date.now().toString(),
      name: newCredential.name,
      username: newCredential.username,
      password: newCredential.password,
      url: newCredential.url,
      category: newCredential.category,
      createdAt: new Date(),
    };

    setExtras((prev) => [...prev, credential]);
    setNewCredential({ name: '', username: '', password: '', url: '', category: '' });
    setIsAddingNew(false);
    toast.success('Credential added');
  };

  const handleDeleteCredential = (id: string) => {
    setExtras((prev) => prev.filter((cred) => cred.id !== id));
    toast.success('Credential deleted');
  };

  if (vaultExists === false) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="ml-16 p-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-5xl font-bold tracking-tight">Vault</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Create your vault to view your credentials
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Button
              onClick={onCreateVault}
              className="w-full md:w-1/2 h-12 bg-white hover:bg-white/90 text-black font-semibold shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 rounded-xl"
            >
              Create Vault
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 border-r border-border bg-card flex flex-col items-center py-6 gap-6">
        <Shield className="w-6 h-6 text-primary" />
        <div className="flex-1" />
        <Lock className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-5xl font-bold tracking-tight">Vault</h1>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New credential
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">Manage your credentials securely</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search credentials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary">
                <Key className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total credentials</p>
                <p className="text-2xl font-bold">{actaCredentials.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary">
                <Shield className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Security</p>
                <p className="text-2xl font-bold">High</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary">
                <Lock className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Encryption</p>
                <p className="text-2xl font-bold">AES-256</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Credentials List */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold mb-4">Saved credentials</h2>
          {filteredCredentials.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {query
                  ? 'No credentials found'
                  : 'No saved credentials. Add your first credential.'}
              </p>
            </Card>
          ) : (
            filteredCredentials.map((credential) => (
              <Card
                key={credential.id}
                className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{credential.name}</h3>
                      <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                        {credential.category}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground min-w-[80px]">User:</span>
                        <span className="text-sm font-mono">{credential.username}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(credential.username, 'User')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground min-w-[80px]">
                          Password:
                        </span>
                        <span className="text-sm font-mono">
                          {showPassword[credential.id] ? credential.password : '••••••••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(credential.id)}
                          className="h-6 w-6 p-0"
                        >
                          {showPassword[credential.id] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(credential.password, 'Password')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      {credential.url && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">URL:</span>
                          <a
                            href={credential.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {credential.url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const ac = actaById.get(credential.id);
                        if (ac) openShare(ac);
                      }}
                      className="h-8 px-3"
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Credential Dialog */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>New credential</DialogTitle>
            <DialogDescription>Add a new credential to your secure vault</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g. GitHub"
                value={newCredential.name}
                onChange={(e) => setNewCredential({ ...newCredential, name: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username / Email *</Label>
              <Input
                id="username"
                placeholder="e.g. user@example.com"
                value={newCredential.username}
                onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={newCredential.password}
                onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL (optional)</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={newCredential.url}
                onChange={(e) => setNewCredential({ ...newCredential, url: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Development, Cloud, Database"
                value={newCredential.category}
                onChange={(e) => setNewCredential({ ...newCredential, category: e.target.value })}
                className="bg-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNew(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCredential} className="bg-primary">
              Save credential
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {shareOpen && (
        <ShareCredentialModal open={shareOpen} credential={toShare} onClose={closeShare} />
      )}
    </div>
  );
}
