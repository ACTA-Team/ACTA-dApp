import VaultPage from '@/components/modules/vault/ui/VaultDashboard';

export const metadata = {
  title: 'My Credentials',
};

export default function CredentialsPage() {
  return (
    <div className="space-y-6">
      <VaultPage />
    </div>
  );
}
