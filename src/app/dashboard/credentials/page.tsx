import CredentialsList from "@/components/modules/credentials/CredentialsList";
import Link from "next/link";

export const metadata = {
  title: "My Credentials",
};

export default function CredentialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
          My Credentials
        </h1>
        <Link
          href="/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        These are your real credentials fetched from your vault.
        You can filter and search them while keeping the same design.
      </p>

      <CredentialsList />
    </div>
  );
}
