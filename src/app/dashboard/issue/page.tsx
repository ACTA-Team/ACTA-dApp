import Link from "next/link";
import IssueBuilder from "@/components/modules/issue/ui/IssueBuilder";

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
        <Link
          href="/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Select a template and issue a real credential via the API. The form
        adapts to the template and shows a live preview.
      </p>

      <IssueBuilder />
    </div>
  );
}
