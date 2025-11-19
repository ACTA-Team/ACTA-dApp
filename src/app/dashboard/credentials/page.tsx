import Link from "next/link";
import CredentialsList from "@/components/modules/credentials/CredentialsList";

export const metadata = {
  title: "My Credentials",
};

export default function CredentialsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
          My Credentials
        </h1>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        This is a mockup list of your verifiable credentials. Use it to
        visualize how credentials might appear in the app.
      </p>

      <CredentialsList />
    </div>
  );
}