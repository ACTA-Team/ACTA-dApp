export const metadata = {
  title: "Vault",
};

import { VaultSection } from "@/components/modules/vault/ui/VaultSection";

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
        Vault
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Create your vault and authorize wallets to issue.
      </p>
      <VaultSection />
    </div>
  );
}