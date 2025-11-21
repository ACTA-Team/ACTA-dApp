'use client';

import { CredentialVerifyCard } from './CredentialVerifyCard';
import { useCredentialVerify } from '@/components/modules/credentials/hooks/useCredentialVerify';

export function CredentialVerify({ vcId }: { vcId: string }) {
  const { verify, revealed, zkValid, zkStatement } = useCredentialVerify(vcId);

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 gap-6">
      <CredentialVerifyCard
        vcId={verify?.vc_id || vcId}
        status={verify?.status}
        since={verify?.since ?? null}
        revealed={revealed || null}
        zkValid={zkValid ?? null}
        zkStatement={zkStatement || null}
      />
    </div>
  );
}
