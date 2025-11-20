'use client';

import { useEffect, useMemo, useState } from 'react';
import { useNetwork } from '@/providers/network.provider';
import { getVerifyStatus, postVaultVerify } from '@/lib/actaApi';
import { getClientConfig } from '@/lib/env';
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
  const { apiBaseUrl: baseUrl } = useNetwork();
  const apiBaseUrl = baseUrl;
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
        const cfg = await getClientConfig(apiBaseUrl);
        if (shareParam) {
          setRevealed(shareParam.revealedFields || null);
        }

        if (vcId && walletAddress) {
          try {
            const v = await postVaultVerify(apiBaseUrl, {
              owner: walletAddress,
              vcId,
              vaultContractId: cfg.vaultContractId || undefined,
            });
            const norm = (v?.status || '').toLowerCase();
            if (norm === 'valid' || norm === 'revoked') {
              setVerify(v);
              return;
            }
          } catch {}
        }

        if (vcId && cfg.issuanceContractId) {
          try {
            const r = await verifyOnChain({
              rpcUrl: cfg.rpcUrl,
              networkPassphrase: cfg.networkPassphrase,
              issuanceContractId: cfg.issuanceContractId,
              vcId,
            });
            const norm = (r?.status || '').toLowerCase();
            if (norm === 'valid' || norm === 'revoked') {
              setVerify(r);
              return;
            }
          } catch {}
        }

        try {
          const res = await getVerifyStatus(apiBaseUrl, vcId);
          setVerify(res);
          return;
        } catch {}

        setVerify({ vc_id: vcId, status: 'not_verified' });
      } catch {
        setVerify({ vc_id: vcId, status: 'not_verified' });
      }
    };
    run();
  }, [vcId, apiBaseUrl, network, walletAddress, shareParam]);

  return { verify, revealed };
}
