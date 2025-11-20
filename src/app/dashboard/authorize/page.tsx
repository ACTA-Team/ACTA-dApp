export const metadata = {
  title: "Authorize",
};

import { VaultAuthorize } from "@/components/modules/vault/ui/VaultAuthorize";
import { AuthorizedIssuersList } from "@/components/modules/vault/ui/AuthorizedIssuersList";

export default function AuthorizePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
        Authorize
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Move the vault authorization section to this page and show below the list of allowed wallets with a revoke button.
      </p>

      <VaultAuthorize />

      <AuthorizedIssuersList />
    </div>
  );
}