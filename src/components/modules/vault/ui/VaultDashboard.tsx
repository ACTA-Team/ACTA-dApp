'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, Search, Copy, Key, Lock, Share2 } from 'lucide-react';
import { useVaultDashboard } from '@/components/modules/vault/hooks/useVaultDashboard';
import { useVaultCards } from '@/components/modules/vault/hooks/useVaultCards';
import ShareCredentialModal from '@/components/modules/credentials/ui/ShareCredentialModal';

export default function VaultPage() {
  const { vaultExists, onCreateVault, query, setQuery, shareOpen, toShare, openShare, closeShare } =
    useVaultDashboard();
  const { actaById, getWalletFromDid, filteredCredentials, copyToClipboard } = useVaultCards();

  if (vaultExists === false) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-8">
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
      {/* Main Content */}
      <div>
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">Vault</h1>
                  <p className="text-base text-white/50 mt-1">Manage your credentials securely</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary">
                <Key className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total credentials</p>
                <p className="text-2xl font-bold">{actaById.size}</p>
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-3">
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
                        <span className="text-sm text-muted-foreground min-w-[80px]">Wallet:</span>
                        <span className="text-sm font-mono">
                          {getWalletFromDid(credential.username)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(getWalletFromDid(credential.username), 'Wallet')
                          }
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const ac = actaById.get(credential.id);
                        if (ac) openShare(ac);
                      }}
                      title="Share"
                      aria-label="Share"
                      className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      {shareOpen && (
        <ShareCredentialModal open={shareOpen} credential={toShare} onClose={closeShare} />
      )}
    </div>
  );
}
