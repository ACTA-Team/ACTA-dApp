import IssueBuilder from '@/components/modules/issue/ui/IssueBuilder';

export const metadata = {
  title: 'Issue Credentials',
};

export default function IssuePage() {
  return (
    <div className="space-y-6">
      <IssueBuilder />
    </div>
  );
}
