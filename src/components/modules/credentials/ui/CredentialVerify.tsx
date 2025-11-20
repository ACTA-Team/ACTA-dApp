"use client";

import { useEffect, useState } from "react";
import { useNetwork } from "@/providers/network.provider";
import { getVerifyStatus, postVaultVerify } from "@/lib/actaApi";
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

  useEffect(() => {
    const run = async () => {
      try {
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
  }, [vcId, apiBaseUrl, network, walletAddress]);

  return (
    <div className="w-full flex items-center justify-center py-6">
      <CredentialVerifyCard
        vcId={verify?.vc_id || vcId}
        status={verify?.status}
        since={verify?.since ?? null}
      />
    </div>
  );
}
