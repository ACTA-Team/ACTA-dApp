export const metadata = {
  title: 'Authorize',
};

import { VaultAuthorize } from '@/components/modules/vault/ui/VaultAuthorize';
import { AuthorizedIssuersList } from '@/components/modules/vault/ui/AuthorizedIssuersList';

export default function AuthorizePage() {
  return (
    <div className="space-y-6">
      <VaultAuthorize />

      <AuthorizedIssuersList />
    </div>
  );
}
