import CredentialsList from '@/components/modules/credentials/ui/CredentialsList';

export const metadata = {
  title: 'My Credentials',
};

export default function CredentialsPage() {
  return (
    <div className="space-y-6">
      <CredentialsList />
    </div>
  );
}
