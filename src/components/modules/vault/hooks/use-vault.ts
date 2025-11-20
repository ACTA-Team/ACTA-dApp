"use client";

import * as StellarSdk from "@stellar/stellar-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientConfig } from "@/lib/env";
import { useWalletContext } from "@/providers/wallet.provider";
import { useNetwork } from "@/providers/network.provider";
import { mapContractErrorToMessage } from "@/lib/utils";

async function waitForTx(
  server: StellarSdk.rpc.Server,
  hash: string
): Promise<void> {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await server.getTransaction(hash);
      const status = (res as { status: string }).status;
      if (status === "SUCCESS") return;
      if (status === "FAILED") throw new Error("FAILED");
    } catch {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
}

export function useVault() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { apiBaseUrl, network } = useNetwork();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<{
    rpcUrl: string;
    networkPassphrase: string;
    vaultContractId: string;
  } | null>(null);
  const [vaultExists, setVaultExists] = useState<boolean | null>(null);
  const [vcIds, setVcIds] = useState<string[] | null>(null);
  const [vcs, setVcs] = useState<any[] | null>(null);
  const horizonUrl = useMemo(
    () =>
      network === "mainnet"
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org",
    [network]
  );
  const [xlmBalance, setXlmBalance] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [ownerCreatedAt, setOwnerCreatedAt] = useState<string | null>(null);

  const ensureConfig = useCallback(async () => {
    if (config) return config;
    const cfg = await getClientConfig(apiBaseUrl);
    const vIdOverride =
      network === "mainnet"
        ? process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_MAINNET || ""
        : process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_TESTNET || "";
    const picked = {
      rpcUrl: cfg.rpcUrl,
      networkPassphrase: cfg.networkPassphrase,
      vaultContractId: vIdOverride || cfg.vaultContractId,
    };
    setConfig(picked);
    return picked;
  }, [config, apiBaseUrl, network]);

  const ownerDid = walletAddress
    ? `did:pkh:stellar:${
        network === "mainnet" ? "public" : "testnet"
      }:${walletAddress}`
    : null;

  const checkVaultExists = useCallback(async () => {
    if (!walletAddress) return false;
    const { rpcUrl, networkPassphrase, vaultContractId } = await ensureConfig();
    if (!vaultContractId) return false;
    try {
      const server = new StellarSdk.rpc.Server(rpcUrl);
      const sourceAccount = await server.getAccount(walletAddress);
      const account = new StellarSdk.Account(
        walletAddress,
        sourceAccount.sequenceNumber()
      );
      const contract = new StellarSdk.Contract(vaultContractId);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE.toString(),
        networkPassphrase,
      })
        .addOperation(
          contract.call(
            "initialize",
            StellarSdk.Address.fromString(walletAddress).toScVal(),
            StellarSdk.xdr.ScVal.scvString(ownerDid || "")
          )
        )
        .setTimeout(60)
        .build();

      const sim = await server.simulateTransaction(tx);
      const err: any = (sim as any).error;
      if (err && typeof err === "string") {
        const friendly = mapContractErrorToMessage(err);
        if (/initialized/i.test(friendly)) return true; // "Vault already initialized"
        return false;
      }
      // If no error, vault not initialized yet
      return false;
    } catch (e) {
      return false;
    }
  }, [walletAddress, ensureConfig, ownerDid]);

  const fetchVcIdsDirect = useCallback(async () => {
    if (!walletAddress) return [] as string[];
    const cfg = await ensureConfig();
    const resp = await fetch(`${apiBaseUrl}/vault/list_vc_ids_direct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: walletAddress,
        vaultContractId: cfg.vaultContractId,
      }),
    });
    if (!resp.ok) throw new Error(`read_vc_ids_http_${resp.status}`);
    const json = await resp.json();
    const ids: string[] = Array.isArray(json?.vc_ids)
      ? json.vc_ids
      : Array.isArray(json?.result)
      ? json.result
      : [];
    return ids;
  }, [walletAddress, ensureConfig, apiBaseUrl]);

  const fetchVcDirect = useCallback(
    async (vcId: string) => {
      if (!walletAddress) return null;
      const cfg = await ensureConfig();
      const resp = await fetch(`${apiBaseUrl}/vault/get_vc_direct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: walletAddress,
          vcId,
          vaultContractId: cfg.vaultContractId,
        }),
      });
      if (!resp.ok) throw new Error(`get_vc_http_${resp.status}`);
      const json = await resp.json();
      return json?.vc ?? json?.result ?? null;
    },
    [walletAddress, ensureConfig, apiBaseUrl]
  );

  const fetchXlmBalance = useCallback(async () => {
    if (!walletAddress) return null;
    try {
      const resp = await fetch(`${horizonUrl}/accounts/${walletAddress}`, {
        method: "GET",
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      const bal = Array.isArray(json?.balances)
        ? json.balances.find((b: any) => b.asset_type === "native")?.balance
        : null;
      // capture owner account created_at for approximate vault creation
      if (json?.created_at) {
        setOwnerCreatedAt(String(json.created_at));
      }
      return bal || null;
    } catch {
      return null;
    }
  }, [walletAddress, horizonUrl]);

  const fetchUsdcBalance = useCallback(async () => {
    if (!walletAddress) return null;
    try {
      const resp = await fetch(`${horizonUrl}/accounts/${walletAddress}`, {
        method: "GET",
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      const balances: any[] = Array.isArray(json?.balances) ? json.balances : [];
      const total = balances
        .filter(
          (b: any) =>
            (b.asset_type === "credit_alphanum4" || b.asset_type === "credit_alphanum12") &&
            b.asset_code === "USDC"
        )
        .reduce((sum: number, b: any) => sum + parseFloat(b.balance || "0"), 0);
      if (json?.created_at) {
        setOwnerCreatedAt(String(json.created_at));
      }
      const formatted = Number.isFinite(total)
        ? Math.floor(total).toLocaleString(undefined, { maximumFractionDigits: 0 })
        : null;
      return formatted;
    } catch {
      return null;
    }
  }, [walletAddress, horizonUrl]);

  const readDashboard = useCallback(async () => {
    if (!walletAddress) {
      return {
        vaultExists: null as boolean | null,
        xlmBalance: null as string | null,
        usdcBalance: null as string | null,
        vcIds: null as string[] | null,
        vcs: null as any[] | null,
        ownerCreatedAt: ownerCreatedAt as string | null,
      };
    }
    try {
      const exists = await checkVaultExists();
      const balXlm = await fetchXlmBalance();
      const balUsdc = await fetchUsdcBalance();
      const ids = await fetchVcIdsDirect();
      const items = [] as any[];
      for (const id of ids) {
        try {
          const vc = await fetchVcDirect(id);
          if (vc) items.push({ id, ...vc });
        } catch (e) {
          console.warn("get_vc_direct failed", e);
        }
      }
      return {
        vaultExists: exists,
        xlmBalance: balXlm,
        usdcBalance: balUsdc,
        vcIds: ids,
        vcs: items,
        ownerCreatedAt,
      };
    } catch (e) {
      console.warn("vault dashboard load failed", e);
      return {
        vaultExists: false,
        xlmBalance: null,
        usdcBalance: null,
        vcIds: [],
        vcs: [],
        ownerCreatedAt,
      };
    }
  }, [
    walletAddress,
    checkVaultExists,
    fetchXlmBalance,
    fetchUsdcBalance,
    fetchVcIdsDirect,
    fetchVcDirect,
    ownerCreatedAt,
  ]);

  const dashboardQuery = useQuery<{
    vaultExists: boolean | null;
    xlmBalance: string | null;
    usdcBalance: string | null;
    vcIds: string[] | null;
    vcs: any[] | null;
    ownerCreatedAt: string | null;
  }>({
    queryKey: ["vault", "dashboard", walletAddress, network],
    queryFn: readDashboard,
    enabled: !!walletAddress,
    staleTime: 10_000,
  });

  useEffect(() => {
    const data = dashboardQuery.data;
    if (!data) {
      setVaultExists(null);
      setXlmBalance(null);
      setVcIds(null);
      setVcs(null);
      return;
    }
    setVaultExists(data.vaultExists);
    setXlmBalance(data.xlmBalance);
    setUsdcBalance(data.usdcBalance);
    setVcIds(data.vcIds);
    setVcs(data.vcs);
  }, [dashboardQuery.data]);

  const createVault = useCallback(async () => {
    if (!walletAddress) throw new Error("Connect your wallet first");
    const { rpcUrl, networkPassphrase, vaultContractId } = await ensureConfig();
    if (!vaultContractId) throw new Error("Vault contract ID not configured");
    if (!signTransaction) throw new Error("Signer unavailable");
    if (!ownerDid) throw new Error("Could not compute owner DID");

    setLoading(true);
    try {
      const server = new StellarSdk.rpc.Server(rpcUrl);
      const sourceAccount = await server.getAccount(walletAddress);
      const account = new StellarSdk.Account(
        walletAddress,
        sourceAccount.sequenceNumber()
      );
      const contract = new StellarSdk.Contract(vaultContractId);

      let tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE.toString(),
        networkPassphrase,
      })
        .addOperation(
          contract.call(
            "initialize",
            StellarSdk.Address.fromString(walletAddress).toScVal(),
            StellarSdk.xdr.ScVal.scvString(ownerDid)
          )
        )
        .setTimeout(60)
        .build();
      tx = await server.prepareTransaction(tx);
      const signedXdr = await signTransaction(tx.toXDR(), {
        networkPassphrase,
      });
      const signed = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        networkPassphrase
      );
      const send = await server.sendTransaction(signed);
      if (
        send.status === "PENDING" ||
        send.status === "DUPLICATE" ||
        send.status === "TRY_AGAIN_LATER"
      ) {
        await waitForTx(server, send.hash!);
      } else if (send.status === "ERROR") {
        throw new Error("ERROR");
      }
      const txId = send.hash!;

      queryClient.setQueryData(
        ["vault", "dashboard", walletAddress, network],
        (prev: any) => ({ ...(prev ?? {}), vaultExists: true })
      );
      await queryClient.invalidateQueries({
        queryKey: ["vault", "dashboard", walletAddress, network],
      });
      await queryClient.refetchQueries({
        queryKey: ["vault", "dashboard", walletAddress, network],
      });
      return { txId };
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e && "message" in (e as any)
          ? String((e as any).message)
          : String(e);
      const friendly = mapContractErrorToMessage(msg);
      throw new Error(friendly);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, signTransaction, ensureConfig, ownerDid, queryClient]);

  const checkSelfAuthorized = useCallback(async (): Promise<boolean> => {
    if (!walletAddress) return false;
    const { rpcUrl, networkPassphrase, vaultContractId } = await ensureConfig();
    if (!vaultContractId) return false;
    try {
      const server = new StellarSdk.rpc.Server(rpcUrl);
      const sourceAccount = await server.getAccount(walletAddress);
      const account = new StellarSdk.Account(
        walletAddress,
        sourceAccount.sequenceNumber()
      );
      const contract = new StellarSdk.Contract(vaultContractId);

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE.toString(),
        networkPassphrase,
      })
        .addOperation(
          contract.call(
            "authorize_issuer",
            StellarSdk.Address.fromString(walletAddress).toScVal(),
            StellarSdk.Address.fromString(walletAddress).toScVal()
          )
        )
        .setTimeout(60)
        .build();

      const sim = await server.simulateTransaction(tx);
      const err: any = (sim as any).error;
      if (err && typeof err === "string") {
        const friendly = mapContractErrorToMessage(err);
        if (/already authorized/i.test(friendly)) return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [walletAddress, ensureConfig]);

  const authorizeSelf = useCallback(async () => {
    if (!walletAddress) throw new Error("Connect your wallet first");
    const { rpcUrl, networkPassphrase, vaultContractId } = await ensureConfig();
    if (!vaultContractId) throw new Error("Vault contract ID not configured");
    if (!signTransaction) throw new Error("Signer unavailable");
    setLoading(true);
    try {
      const server = new StellarSdk.rpc.Server(rpcUrl);
      const sourceAccount = await server.getAccount(walletAddress);
      const account = new StellarSdk.Account(
        walletAddress,
        sourceAccount.sequenceNumber()
      );
      const contract = new StellarSdk.Contract(vaultContractId);

      let tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE.toString(),
        networkPassphrase,
      })
        .addOperation(
          contract.call(
            "authorize_issuer",
            StellarSdk.Address.fromString(walletAddress).toScVal(),
            StellarSdk.Address.fromString(walletAddress).toScVal()
          )
        )
        .setTimeout(60)
        .build();

      tx = await server.prepareTransaction(tx);
      const signedXdr = await signTransaction(tx.toXDR(), {
        networkPassphrase,
      });
      const signed = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        networkPassphrase
      );
      const send = await server.sendTransaction(signed);
      if (
        send.status === "PENDING" ||
        send.status === "DUPLICATE" ||
        send.status === "TRY_AGAIN_LATER"
      ) {
        await waitForTx(server, send.hash!);
      } else if (send.status === "ERROR") {
        throw new Error("ERROR");
      }
      const txId = send.hash!;
      await queryClient.invalidateQueries({
        queryKey: ["vault", "dashboard", walletAddress, network],
      });
      await queryClient.refetchQueries({
        queryKey: ["vault", "dashboard", walletAddress, network],
      });
      return { txId };
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e && "message" in (e as any)
          ? String((e as any).message)
          : String(e);
      const friendly = mapContractErrorToMessage(msg);
      throw new Error(friendly);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, signTransaction, ensureConfig, queryClient]);

  const authorizeAddress = useCallback(
    async (address: string) => {
      if (!walletAddress) throw new Error("Connect your wallet first");
      const { rpcUrl, networkPassphrase, vaultContractId } =
        await ensureConfig();
      if (!vaultContractId) throw new Error("Vault contract ID not configured");
      if (!signTransaction) throw new Error("Signer unavailable");
      if (!address) throw new Error("Address required");
      setLoading(true);
      try {
        const server = new StellarSdk.rpc.Server(rpcUrl);
        const sourceAccount = await server.getAccount(walletAddress);
        const account = new StellarSdk.Account(
          walletAddress,
          sourceAccount.sequenceNumber()
        );
        const contract = new StellarSdk.Contract(vaultContractId);

        let tx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE.toString(),
          networkPassphrase,
        })
          .addOperation(
            contract.call(
              "authorize_issuer",
              StellarSdk.Address.fromString(walletAddress).toScVal(),
              StellarSdk.Address.fromString(address).toScVal()
            )
          )
          .setTimeout(60)
          .build();

        tx = await server.prepareTransaction(tx);
        const signedXdr = await signTransaction(tx.toXDR(), {
          networkPassphrase,
        });
        const signed = StellarSdk.TransactionBuilder.fromXDR(
          signedXdr,
          networkPassphrase
        );
        const send = await server.sendTransaction(signed);
        if (
          send.status === "PENDING" ||
          send.status === "DUPLICATE" ||
          send.status === "TRY_AGAIN_LATER"
        ) {
          await waitForTx(server, send.hash!);
        } else if (send.status === "ERROR") {
          throw new Error("ERROR");
        }
        const txId = send.hash!;
        await queryClient.invalidateQueries({
          queryKey: ["vault", "dashboard", walletAddress, network],
        });
        await queryClient.refetchQueries({
          queryKey: ["vault", "dashboard", walletAddress, network],
        });
        return { txId };
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === "object" && e && "message" in (e as any)
            ? String((e as any).message)
            : String(e);
        const friendly = mapContractErrorToMessage(msg);
        throw new Error(friendly);
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, signTransaction, ensureConfig, queryClient]
  );

  const revokeAddress = useCallback(
    async (address: string) => {
      if (!walletAddress) throw new Error("Connect your wallet first");
      const { rpcUrl, networkPassphrase, vaultContractId } =
        await ensureConfig();
      if (!vaultContractId) throw new Error("Vault contract ID not configured");
      if (!signTransaction) throw new Error("Signer unavailable");
      if (!address) throw new Error("Address required");
      setLoading(true);
      try {
        const server = new StellarSdk.rpc.Server(rpcUrl);
        const sourceAccount = await server.getAccount(walletAddress);
        const account = new StellarSdk.Account(
          walletAddress,
          sourceAccount.sequenceNumber()
        );
        const contract = new StellarSdk.Contract(vaultContractId);

        let tx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE.toString(),
          networkPassphrase,
        })
          .addOperation(
            contract.call(
              "revoke_issuer",
              StellarSdk.Address.fromString(walletAddress).toScVal(),
              StellarSdk.Address.fromString(address).toScVal()
            )
          )
          .setTimeout(60)
          .build();

        tx = await server.prepareTransaction(tx);
        const signedXdr = await signTransaction(tx.toXDR(), {
          networkPassphrase,
        });
        const signed = StellarSdk.TransactionBuilder.fromXDR(
          signedXdr,
          networkPassphrase
        );
        const send = await server.sendTransaction(signed);
        if (
          send.status === "PENDING" ||
          send.status === "DUPLICATE" ||
          send.status === "TRY_AGAIN_LATER"
        ) {
          await waitForTx(server, send.hash!);
        } else if (send.status === "ERROR") {
          throw new Error("ERROR");
        }
        const txId = send.hash!;
        await queryClient.invalidateQueries({
          queryKey: ["vault", "dashboard", walletAddress, network],
        });
        await queryClient.refetchQueries({
          queryKey: ["vault", "dashboard", walletAddress, network],
        });
        return { txId };
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === "object" && e && "message" in (e as any)
            ? String((e as any).message)
            : String(e);
        const friendly = mapContractErrorToMessage(msg);
        throw new Error(friendly);
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, signTransaction, ensureConfig, queryClient]
  );

  return {
    dashboardStatus: dashboardQuery.status,
    loading,
    createVault,
    checkSelfAuthorized,
    authorizeSelf,
    authorizeAddress,
    revokeAddress,
    ownerDid,
    vaultExists,
    vcIds,
    vcs,
    xlmBalance,
    usdcBalance,
    ownerCreatedAt,
  };
}
