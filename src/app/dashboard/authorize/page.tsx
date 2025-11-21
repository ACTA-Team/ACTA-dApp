export const metadata = {
  title: 'Authorize',
};

import { VaultAuthorize } from '@/components/modules/vault/ui/VaultAuthorize';
import { AuthorizedIssuersList } from '@/components/modules/vault/ui/AuthorizedIssuersList';

export default function AuthorizePage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Authorize</h1>
                <p className="text-base text-white/50 mt-1">Grant wallets to issue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <VaultAuthorize />

        <AuthorizedIssuersList />
      </div>
    </div>
  );
}
