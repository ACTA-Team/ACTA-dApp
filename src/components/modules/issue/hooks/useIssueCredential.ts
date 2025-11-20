"use client";

import { useCallback, useMemo, useState } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { useNetwork } from "@/providers/network.provider";
import { getClientConfig } from "@/lib/env";
import { postPrepareStore, postVaultStore } from "@/lib/actaApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mapContractErrorToMessage } from "@/lib/utils";
import type {
  CredentialTemplate,
  TemplateField,
} from "./useCredentialTemplates";

export type IssueState = {
  template: CredentialTemplate | null;
  vcId: string;
  values: Record<string, string>;
  issuing: boolean;
  preview: any | null;
  error: string | null;
  txId: string | null;
};

export function useIssueCredential() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { apiBaseUrl, network } = useNetwork();
  const queryClient = useQueryClient();

  const [state, setState] = useState<IssueState>({
    template: null,
    vcId: "",
    values: {},
    issuing: false,
    preview: null,
    error: null,
    txId: null,
  });

  const ownerDid = useMemo(() => {
    return walletAddress
      ? `did:pkh:stellar:${
          network === "mainnet" ? "public" : "testnet"
        }:${walletAddress}`
      : undefined;
  }, [walletAddress, network]);

  const generateVcId = () => {
    try {
      return `vc-${crypto.randomUUID()}`;
    } catch {
      return `vc-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
    }
  };

  const selectTemplate = useCallback((tpl: CredentialTemplate) => {
    const newId = generateVcId();
    setState((s) => ({
      ...s,
      template: tpl,
      vcId: newId,
      values: {},
      preview: null,
      error: null,
      txId: null,
    }));
  }, []);

  const setFieldValue = useCallback((key: string, value: string) => {
    setState((s) => ({
      ...s,
      values: { ...s.values, [key]: value },
      error: null,
    }));
  }, []);

  // vcId se genera automáticamente; no expongo setter al usuario

  const buildPreview = useCallback(() => {
    const tpl = state.template;
    if (!tpl) return null;
    const nowIso = new Date().toISOString();
    const expiration = state.values["expirationDate"] || undefined;
    const rawSubject = state.values["subject"] || "";
    const toSubjectDid = (input: string) => {
      if (!input) return "";
      const trimmed = input.trim();
      if (trimmed.startsWith("did:")) return trimmed;
      const env = network === "mainnet" ? "public" : "testnet";
      return `did:pkh:stellar:${env}:${trimmed}`;
    };
    const subjectId = toSubjectDid(rawSubject);

    const credentialSubject: Record<string, any> = { id: subjectId };
    for (const [k, v] of Object.entries(state.values)) {
      if (k === "subject" || !v) continue;
      credentialSubject[k] = v;
    }

    const vc = {
      id: state.vcId,
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", tpl.vcType],
      issuer: ownerDid || "",
      issuanceDate: state.values["issueDate"] || nowIso,
      expirationDate: expiration,
      credentialSubject,
    };
    setState((s) => ({ ...s, preview: vc }));
    return vc;
  }, [state.template, state.values, ownerDid, network]);

  const validateRequired = useCallback(
    (fields: TemplateField[]) => {
      for (const f of fields) {
        if (f.required && !state.values[f.key]) {
          return `${f.label} is required`;
        }
      }
      return null;
    },
    [state.values, state.vcId]
  );

  const issue = useCallback(async () => {
    if (!walletAddress) throw new Error("Connect your wallet first");
    if (!signTransaction) throw new Error("Signer unavailable");
    const tpl = state.template;
    if (!tpl) throw new Error("Select a template first");

    const requiredErr = validateRequired(tpl.fields);
    if (requiredErr) {
      setState((s) => ({ ...s, error: requiredErr }));
      throw new Error(requiredErr);
    }

    const vc = buildPreview() || {};
    const cfg = await getClientConfig(apiBaseUrl);
    const vaultIdOverride =
      network === "mainnet"
        ? process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_MAINNET || ""
        : process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_TESTNET || "";
    const vaultContractId = vaultIdOverride || cfg.vaultContractId;
    if (!vaultContractId) throw new Error("Vault contract ID not configured");

    setState((s) => ({ ...s, issuing: true, error: null }));
    try {
      const ensuredVcId = state.vcId || generateVcId();
      if (!state.vcId) {
        setState((s) => ({ ...s, vcId: ensuredVcId }));
      }
      // 1) Prepare unsigned XDR to call Vault.store_vc signed by the issuer (user wallet)
      const prep = await postPrepareStore(apiBaseUrl, {
        owner: walletAddress,
        vcId: ensuredVcId,
        didUri: ownerDid || "",
        fields: vc as Record<string, any>,
      });
      // 2) Sign with the connected wallet
      const signedXdr = await signTransaction(prep.unsignedXdr, {
        networkPassphrase: cfg.networkPassphrase,
      });
      // 3) Submit signed transaction to Vault Store endpoint
      const res = await postVaultStore(apiBaseUrl, {
        signedXdr,
        vcId: ensuredVcId,
      });
      setState((s) => ({ ...s, issuing: false, txId: res.tx_id }));
      const explorerNet = network === "mainnet" ? "public" : "testnet";
      const expertUrl = `https://stellar.expert/explorer/${explorerNet}/tx/${res.tx_id}`;
      toast.success("Credencial emitida", {
        action: {
          label: "Ver en Stellar Expert",
          onClick: () => {
            try {
              window.open(expertUrl, "_blank");
            } catch {}
          },
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ["vault", "dashboard", walletAddress, network],
      });
      await queryClient.refetchQueries({
        queryKey: ["vault", "dashboard", walletAddress, network],
      });
      return res;
    } catch (e: any) {
      const raw = e?.message || String(e);
      let friendly = mapContractErrorToMessage(raw);
      // Custom alert for insufficient balance scenario
      if (/insufficient|no balance|fee|TRY_AGAIN_LATER|Send status: ERROR|Transaction failed/i.test(raw)) {
        friendly = "Saldo USDC insuficiente para realizar la transacción";
      }
      setState((s) => ({ ...s, issuing: false, error: friendly }));
      toast.error(friendly);
      throw new Error(friendly);
    }
  }, [
    walletAddress,
    apiBaseUrl,
    network,
    state.template,
    state.values,
    state.vcId,
    buildPreview,
    validateRequired,
    queryClient,
    ownerDid,
    signTransaction,
  ]);

  return {
    state,
    ownerDid,
    selectTemplate,
    setFieldValue,
    buildPreview,
    issue,
  };
}
