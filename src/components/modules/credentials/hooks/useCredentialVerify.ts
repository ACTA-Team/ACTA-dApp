'use client';

import { useEffect, useMemo, useState } from 'react';
import { useNetwork } from '@/providers/network.provider';
import { useVaultApi, useActaClient } from '@acta-team/acta-sdk';
import { verifyOnChain } from '@/lib/actaOnChain';
import { useWalletContext } from '@/providers/wallet.provider';

type VerifyResult = {
  vc_id: string;
  status: string | null;
  since?: string | null;
};

export function useCredentialVerify(vcId: string) {
  const { network } = useNetwork();
  const { walletAddress } = useWalletContext();
  const [verify, setVerify] = useState<VerifyResult | null>(null);
  const [revealed, setRevealed] = useState<Record<string, unknown> | null>(null);
  const { verifyInVault } = useVaultApi();
  const client = useActaClient();
  const shareParam = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const sp = new URLSearchParams(window.location.search);
      const raw = sp.get('share');
      if (!raw) return null;
      const json = decodeURIComponent(escape(atob(decodeURIComponent(raw))));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const cfg = client.getDefaults();
        const vaultIdOverride = cfg.vaultContractId || '';
        if (shareParam) {
          setRevealed(shareParam.revealedFields || null);
        }

        if (vcId && walletAddress) {
          try {
            const v = await verifyInVault({
              owner: walletAddress,
              vcId,
              vaultContractId: vaultIdOverride || undefined,
            });
            const norm = (v?.status || '').toLowerCase();
            if (norm === 'valid' || norm === 'revoked') {
              setVerify(v);
              return;
            }
          } catch {}
        }

        const issuanceId = cfg.issuanceContractId || '';
        if (vcId && issuanceId) {
          try {
            const r = await verifyOnChain({
              rpcUrl: cfg.rpcUrl,
              networkPassphrase: cfg.networkPassphrase,
              issuanceContractId: issuanceId,
              vcId,
            });
            const norm = (r?.status || '').toLowerCase();
            if (norm === 'valid' || norm === 'revoked') {
              setVerify(r);
              return;
            }
          } catch {}
        }

        setVerify({ vc_id: vcId, status: 'not_verified' });
      } catch {
        setVerify({ vc_id: vcId, status: 'not_verified' });
      }
    };
    run();
  }, [vcId, network, walletAddress, shareParam, verifyInVault, client]);

  return { verify, revealed };
}
