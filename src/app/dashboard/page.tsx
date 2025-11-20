export const metadata = {
  title: "ACTA dApp",
};

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Choose an action or follow the quick start to begin.
        </p>
      </div>

      {/* Main actions */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ActionCard
          title="My Credentials"
          description="View your real credentials stored in your vault"
          href="/dashboard/credentials"
        />
        <ActionCard
          title="Issue"
          description="Create and issue new credentials (issuer)"
          href="/dashboard/issue"
        />
        <ActionCard
          title="Vault"
          description="Create and manage your personal vault"
          href="/dashboard/vault"
        />
        <ActionCard
          title="Authorize"
          description="Authorize wallets to issue in your vault"
          href="/dashboard/authorize"
        />
      </div>

      <QuickStartCard />
    </div>
  );
}

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="p-6 flex flex-col">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 flex-1">
        {description}
      </p>
      <Button asChild className="mt-4 rounded-md">
        <Link href={href}>Go to {title}</Link>
      </Button>
    </Card>
  );
}

function QuickStartCard() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">Quick start</h3>
      <ol className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300 list-decimal list-inside">
        <li>
          Connect your wallet in the top bar and choose a network
          (Testnet/Mainnet).
        </li>
        <li>Go to "Vault" and create your personal vault.</li>
        <li>In "Authorize", enable your own wallet or add another address.</li>
        <li>Use "Issue" to create and publish signed credentials.</li>
        <li>View everything from "My Credentials".</li>
      </ol>
    </Card>
  );
}
