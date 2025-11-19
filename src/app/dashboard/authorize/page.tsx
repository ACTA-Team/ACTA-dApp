export const metadata = {
  title: "Autorizar",
};

import { VaultAuthorize } from "@/components/modules/vault/ui/VaultAuthorize";
import { AuthorizedIssuersList } from "@/components/modules/vault/ui/AuthorizedIssuersList";

export default function AuthorizePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
        Autorizar
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Saca la sección de autorización de la Vault a esta página y añade abajo la lista de wallets permitidas con botón de revocar.
      </p>

      <VaultAuthorize />

      <AuthorizedIssuersList />
    </div>
  );
}