import IssueBuilder from '@/components/modules/issue/ui/IssueBuilder';

export const metadata = {
  title: 'Issue Credentials',
};

export default function IssuePage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Issue</h1>
                <p className="text-base text-white/50 mt-1">Create new credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <IssueBuilder />
      </div>
    </div>
  );
}
