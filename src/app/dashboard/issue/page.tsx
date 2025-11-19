import Link from "next/link";
import IssueForm from "@/components/modules/issue/IssueForm";

export const metadata = {
  title: "Issue Credentials",
};

export default function IssuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Issue Credentials
        </h1>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Fill in the fields to generate a mock Verifiable Credential. This is a
        UI mockup; it does not issue to any network.
      </p>

      <IssueForm />
    </div>
  );
}