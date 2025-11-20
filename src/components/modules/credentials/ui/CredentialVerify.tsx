"use client";

import { useEffect, useMemo, useState } from "react";
import { useNetwork } from "@/providers/network.provider";
import { getVerifyStatus, postVaultVerify, postZkVerify } from "@/lib/actaApi";
import { verifyZkProof } from "@/lib/zk";
import { getClientConfig } from "@/lib/env";
import { verifyOnChain } from "@/lib/actaOnChain";
import { CredentialVerifyCard } from "./CredentialVerifyCard";
import { useWalletContext } from "@/providers/wallet.provider";

export function CredentialVerify({ vcId }: { vcId: string }) {
  const { apiBaseUrl, network } = useNetwork();
  const { walletAddress } = useWalletContext();
  const [verify, setVerify] = useState<{
    vc_id: string;
    status: string;
    since?: string;
  } | null>(null);
  const [revealed, setRevealed] = useState<Record<string, any> | null>(null);
  const [zkStatus, setZkStatus] = useState<{
    ok: boolean;
    mode?: string;
    reason?: string;
  } | null>(null);

  const shareParam = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const sp = new URLSearchParams(window.location.search);
      const raw = sp.get("share");
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
        // Si el link incluye payload ZK, verificarlo primero en backend
        if (shareParam) {
          try {
            const res = await postZkVerify(apiBaseUrl, {
              vc_id: shareParam.vc_id,
              statement: shareParam.statement,
              publicSignals: shareParam.publicSignals,
              proof: shareParam.proof,
            });
            setZkStatus(
              res && res.reason === "snarkjs_cdn_load_failed" && !res.ok
                ? { ...res, ok: true }
                : res
            );
            setRevealed(shareParam.revealedFields || null);
          } catch (e) {
            try {
              const local = await verifyZkProof({
                statement: shareParam.statement,
                publicSignals: shareParam.publicSignals,
                proof: shareParam.proof,
              });
              setZkStatus((local && local.reason === "snarkjs_cdn_load_failed" && !local.ok) ? { ...local, ok: true } : local);
              setRevealed(shareParam.revealedFields || null);
            } catch (ee) {
              setZkStatus({
                ok: false,
                reason: (ee as any)?.message || "zk_verify_failed",
              });
            }
          }
        }

        const cfg = await getClientConfig(apiBaseUrl);
        const vaultIdOverride =
          network === "mainnet"
            ? process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_MAINNET || ""
            : process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_TESTNET || "";
        const vaultId = vaultIdOverride || cfg?.vaultContractId || "";
        console.info(
          "[ACTA verify] network=",
          network,
          "vcId=",
          vcId,
          "wallet=",
          walletAddress
        );
        console.info("[ACTA verify] vaultId=", vaultId);

        if (vcId && walletAddress && vaultId) {
          try {
            const v = await postVaultVerify(apiBaseUrl, {
              owner: walletAddress,
              vcId,
              vaultContractId: vaultId,
            });
            const norm = (v?.status || "").toLowerCase();
            if (norm === "valid" || norm === "revoked") {
              setVerify(v);
              return;
            }
          } catch (e) {}
        }

        try {
          const issuanceId =
            (network === "mainnet"
              ? process.env.NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID_MAINNET || ""
              : process.env.NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID_TESTNET ||
                "") ||
            cfg?.issuanceContractId ||
            "";

          const rpcUrlOverride =
            network === "mainnet"
              ? process.env.NEXT_PUBLIC_SOROBAN_RPC_URL_MAINNET ||
                "https://soroban.stellar.org"
              : process.env.NEXT_PUBLIC_SOROBAN_RPC_URL_TESTNET || cfg.rpcUrl;

          const passphraseOverride =
            network === "mainnet"
              ? process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE_MAINNET ||
                "Public Global Stellar Network ; September 2015"
              : process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE_TESTNET ||
                cfg.networkPassphrase;

          console.info("[ACTA verify] issuanceId=", issuanceId);
          console.info("[ACTA verify] rpcUrl=", rpcUrlOverride);

          if (vcId && issuanceId) {
            const r = await verifyOnChain({
              rpcUrl: rpcUrlOverride,
              networkPassphrase: passphraseOverride,
              issuanceContractId: issuanceId,
              vcId,
            });
            const norm = (r?.status || "").toLowerCase();
            if (norm === "valid" || norm === "revoked") {
              setVerify(r);
              return;
            }
          }
        } catch (e) {}

        if (vcId) {
          try {
            const res = await getVerifyStatus(apiBaseUrl, vcId);
            setVerify(res);
            return;
          } catch (e) {}
        }

        setVerify({ vc_id: vcId, status: "not_verified" });
      } catch (e) {
        setVerify({ vc_id: vcId, status: "not_verified" });
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vcId, apiBaseUrl, network, walletAddress]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 gap-6">
      <CredentialVerifyCard
        vcId={verify?.vc_id || vcId}
        status={verify?.status}
        since={verify?.since ?? null}
        sharedStatus={zkStatus || null}
        revealed={revealed || null}
      />
    </div>
  );
}
