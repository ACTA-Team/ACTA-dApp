'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ZkStatement } from '@/@types/credentials';
import { useNetwork } from '@/providers/network.provider';
import { useVaultApi, useActaClient } from '@acta-team/acta-sdk';
import { verifyOnChain } from '@/lib/actaOnChain';
import { useWalletContext } from '@/providers/wallet.provider';
import { verifyZkProof } from '@/lib/zk';

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
  const [zkValid, setZkValid] = useState<boolean | null>(null);
  const [zkStatement, setZkStatement] = useState<ZkStatement | null>(null);
  const { verifyInVault } = useVaultApi();
  const client = useActaClient();
  const shareParam = useMemo((): unknown => {
    if (typeof window === 'undefined') return null;
    try {
      let raw: string | null = null;
      const hs = String(window.location.hash || '');
      if (hs.startsWith('#share=')) {
        raw = hs.slice('#share='.length);
      } else if (hs.includes('share=')) {
        const idx = hs.indexOf('share=');
        raw = hs.slice(idx + 6);
      }
      if (!raw) {
        const sp = new URLSearchParams(window.location.search);
        raw = sp.get('share');
      }
      if (!raw) return null;
      const json = decodeURIComponent(escape(atob(decodeURIComponent(raw))));
      return JSON.parse(json) as unknown;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const cfg = client.getDefaults();
        const vaultIdOverride = cfg.vaultContractId || '';
        if (shareParam && typeof shareParam === 'object') {
          const sp = shareParam as {
            revealedFields?: Record<string, unknown>;
            statement?: unknown;
            proof?: string;
          };
          setRevealed(sp.revealedFields || null);
          try {
            const ok = await verifyZkProof(
              sp as unknown as {
                statement?: {
                  kind?: string;
                  typeHash?: string;
                  expectedHash?: string;
                  valid?: string;
                };
                publicSignals?: string[];
                proof?: string;
              } | null
            );
            setZkValid(ok);
            const st = sp.statement;
            if (st === 'none' || (typeof st === 'object' && st && 'kind' in st)) {
              setZkStatement(st as ZkStatement);
            } else {
              setZkStatement(null);
            }
          } catch {}
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

  return { verify, revealed, zkValid, zkStatement };
}
