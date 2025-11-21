'use client';

import { useCallback, useMemo, useState } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useNetwork } from '@/providers/network.provider';
import {
  useTxPrepare,
  useVaultStore,
  useActaClient,
  useCreateCredential,
} from '@acta-team/acta-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mapContractErrorToMessage } from '@/lib/utils';
import { useVault } from '@/components/modules/vault/hooks/use-vault';
import type { CredentialTemplate, TemplateField } from '@/@types/templates';
import type { IssueState } from '@/@types/issue';
import type { MockCredential } from '@/@types/credentials';

export function useIssueCredential() {
  const { walletAddress, walletName, signTransaction, walletKit, setWalletInfo } =
    useWalletContext();
  const { network } = useNetwork();
  const client = useActaClient();
  const { prepareStore, prepareIssue } = useTxPrepare();
  const { vaultStore } = useVaultStore();
  const { createCredential } = useCreateCredential();

  const queryClient = useQueryClient();
  const { checkSelfAuthorized, authorizeSelf } = useVault();

  const [state, setState] = useState<IssueState>({
    template: null,
    vcId: '',
    values: {},
    issuing: false,
    preview: null,
    error: null,
    txId: null,
  });

  const ownerDid = useMemo(() => {
    return walletAddress
      ? `did:pkh:stellar:${network === 'mainnet' ? 'public' : 'testnet'}:${walletAddress}`
      : undefined;
  }, [walletAddress, network]);

  const generateVcId = () => {
    try {
      return `vc-${crypto.randomUUID()}`;
    } catch {
      return `vc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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

  // vcId is generated automatically; do not expose a setter to the user

  const buildPreview = useCallback(() => {
    const tpl = state.template;
    if (!tpl) return null;
    const nowIso = new Date().toISOString();
    const expiration = state.values['expirationDate'] || undefined;
    const rawSubject = state.values['subject'] || '';
    const toSubjectDid = (input: string) => {
      if (!input) return '';
      const trimmed = input.trim();
      if (trimmed.startsWith('did:')) return trimmed;
      const env = network === 'mainnet' ? 'public' : 'testnet';
      return `did:pkh:stellar:${env}:${trimmed}`;
    };
    const subjectId = toSubjectDid(rawSubject);

    const credentialSubject: Record<string, string> = { id: subjectId };
    for (const [k, v] of Object.entries(state.values)) {
      if (k === 'subject' || !v) continue;
      credentialSubject[k] = v;
    }

    const vc = {
      id: state.vcId,
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', tpl.vcType],
      issuer: ownerDid || '',
      issuanceDate: state.values['issueDate'] || nowIso,
      expirationDate: expiration,
      credentialSubject,
    };
    setState((s) => ({ ...s, preview: vc }));
    return vc;
  }, [state.template, state.values, ownerDid, network, state.vcId]);

  // Removed unused helper to satisfy lint rules

  const validateRequired = useCallback(
    (fields: TemplateField[]) => {
      for (const f of fields) {
        if (f.required && !state.values[f.key]) {
          return `${f.label} is required`;
        }
      }
      return null;
    },
    [state.values]
  );

  const issue = useCallback(async () => {
    if (!walletAddress) throw new Error('Connect your wallet first');
    if (!signTransaction) throw new Error('Signer unavailable');
    const tpl = state.template;
    if (!tpl) throw new Error('Select a template first');

    const requiredErr = validateRequired(tpl.fields);
    if (requiredErr) {
      setState((s) => ({ ...s, error: requiredErr }));
      throw new Error(requiredErr);
    }

    // Synchronize with the ACTIVE account from the wallet provider
    let activeAddress = walletAddress;
    try {
      const addr = await walletKit?.getAddress();
      if (addr?.address && addr.address !== walletAddress) {
        await setWalletInfo(addr.address, walletName || 'Wallet');
        activeAddress = addr.address;
      }
    } catch {}

    const vc = buildPreview() || {};
    const cfg = client.getDefaults();
    const vaultContractId = cfg.vaultContractId;
    if (!vaultContractId) throw new Error('Vault contract ID not configured');

    setState((s) => ({ ...s, issuing: true, error: null }));
    try {
      const ensuredVcId = state.vcId || generateVcId();
      if (!state.vcId) {
        setState((s) => ({ ...s, vcId: ensuredVcId }));
      }
      const ownerG = activeAddress!;
      if (ownerG === walletAddress) {
        try {
          const isAuth = await checkSelfAuthorized();
          if (!isAuth) {
            await authorizeSelf();
          }
        } catch {}
      }
      const ownerDidLocal = `did:pkh:stellar:${
        network === 'mainnet' ? 'public' : 'testnet'
      }:${ownerG}`;
      const prep = await prepareStore({
        owner: ownerG,
        vcId: ensuredVcId,
        didUri: ownerDidLocal,
        fields: vc as Record<string, unknown>,
        vaultContractId,
        issuer: ownerG,
      });
      const { signedTxXdr: signedXdr } = await walletKit!.signTransaction(prep.unsignedXdr, {
        address: ownerG,
        networkPassphrase: cfg.networkPassphrase,
      });
      const res = await vaultStore({
        signedXdr,
        vcId: ensuredVcId,
        owner: ownerG,
        vaultContractId,
      });
      setState((s) => ({ ...s, issuing: false, txId: res.tx_id }));
      const explorerNet = network === 'mainnet' ? 'public' : 'testnet';
      const expertUrl = `https://stellar.expert/explorer/${explorerNet}/tx/${res.tx_id}`;
      toast.success('Credential issued', {
        action: {
          label: 'View in Stellar Expert',
          onClick: () => {
            try {
              window.open(expertUrl, '_blank');
            } catch {}
          },
        },
      });

      const vcDataStr = JSON.stringify(vc);
      const prepIssue = await prepareIssue({
        owner: ownerG,
        vcId: ensuredVcId,
        vcData: vcDataStr,
        vaultContractId,
        issuer: ownerG,
        issuerDid: ownerDidLocal,
      });
      const { signedTxXdr: signedIssueXdr } = await walletKit!.signTransaction(
        prepIssue.unsignedXdr,
        {
          address: ownerG,
          networkPassphrase: cfg.networkPassphrase,
        }
      );
      const issueRes = await createCredential({ signedXdr: signedIssueXdr, vcId: ensuredVcId });
      const issueUrl = `https://stellar.expert/explorer/${explorerNet}/tx/${issueRes.tx_id}`;
      toast.success('Issuance executed', {
        action: {
          label: 'View issuance',
          onClick: () => {
            try {
              window.open(issueUrl, '_blank');
            } catch {}
          },
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['vault', 'dashboard', walletAddress, network],
      });
      await queryClient.refetchQueries({
        queryKey: ['vault', 'dashboard', walletAddress, network],
      });
      return { store: res, issue: issueRes };
    } catch (e: unknown) {
      const raw = (
        e && typeof e === 'object' && 'message' in (e as Record<string, unknown>)
          ? String((e as Record<string, unknown>).message)
          : String(e)
      ) as string;
      let friendly = mapContractErrorToMessage(raw);
      if (
        /insufficient|no balance|fee|TRY_AGAIN_LATER|Send status: ERROR|Transaction failed/i.test(
          raw
        )
      ) {
        friendly = 'Insufficient USDC balance to perform the transaction';
      }
      if (/Error\(Contract,\s*#2\)|IssuerNotAuthorized/i.test(raw)) {
        let ownerG = walletAddress!;
        try {
          const addr = await walletKit?.getAddress();
          if (addr?.address) ownerG = addr.address;
        } catch {}
        if (ownerG === walletAddress) {
          try {
            await authorizeSelf();

            const ensuredVcId = state.vcId || generateVcId();
            if (!state.vcId) {
              setState((s) => ({ ...s, vcId: ensuredVcId }));
            }
            const vcRetry = buildPreview() || {};
            const cfg = client.getDefaults();
            const vaultIdOverride =
              network === 'mainnet'
                ? process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_MAINNET || ''
                : process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID_TESTNET || '';
            const vaultContractId = vaultIdOverride;

            const ownerDidLocal2 = `did:pkh:stellar:${
              network === 'mainnet' ? 'public' : 'testnet'
            }:${ownerG}`;
            const prep2 = await prepareStore({
              owner: ownerG,
              vcId: ensuredVcId,
              didUri: ownerDidLocal2,
              fields: vcRetry as Record<string, unknown>,
              vaultContractId,
              issuer: ownerG,
            });
            const { signedTxXdr: signedXdr2 } = await walletKit!.signTransaction(
              prep2.unsignedXdr,
              {
                address: ownerG,
                networkPassphrase: cfg.networkPassphrase,
              }
            );
            const res2 = await vaultStore({
              signedXdr: signedXdr2,
              vcId: ensuredVcId,
              owner: ownerG,
              vaultContractId,
            });

            const vcDataStr2 = JSON.stringify(vcRetry);
            const prepIssue2 = await prepareIssue({
              owner: ownerG,
              vcId: ensuredVcId,
              vcData: vcDataStr2,
              vaultContractId,
              issuer: ownerG,
              issuerDid: ownerDidLocal2,
            });
            const { signedTxXdr: signedIssueXdr2 } = await walletKit!.signTransaction(
              prepIssue2.unsignedXdr,
              {
                address: ownerG,
                networkPassphrase: cfg.networkPassphrase,
              }
            );
            const issueRes2 = await createCredential({
              signedXdr: signedIssueXdr2,
              vcId: ensuredVcId,
            });

            toast.success('Issuer automatically authorized and issuance retried.');
            await queryClient.invalidateQueries({
              queryKey: ['vault', 'dashboard', walletAddress, network],
            });
            await queryClient.refetchQueries({
              queryKey: ['vault', 'dashboard', walletAddress, network],
            });
            setState((s) => ({
              ...s,
              issuing: false,
              error: null,
              txId: res2.tx_id,
            }));
            return { store: res2, issue: issueRes2 };
          } catch (retryErr: unknown) {
            const rmsg =
              retryErr &&
              typeof retryErr === 'object' &&
              'message' in (retryErr as Record<string, unknown>)
                ? String((retryErr as Record<string, unknown>).message)
                : String(retryErr);
            friendly = mapContractErrorToMessage(rmsg);
          }
        } else {
          friendly =
            `The issuer is not authorized in the owner's vault. ` +
            `Request authorization from the owner (${ownerG}) for your wallet (${walletAddress}). ` +
            `Use the 'Authorize' section in the dashboard.`;
        }
      }
      setState((s) => ({ ...s, issuing: false, error: friendly }));
      toast.error(friendly);
      throw new Error(friendly);
    }
  }, [
    walletAddress,
    walletName,
    network,
    state.template,
    state.vcId,
    buildPreview,
    validateRequired,
    queryClient,
    signTransaction,
    checkSelfAuthorized,
    authorizeSelf,
    walletKit,
    setWalletInfo,
    client,
    prepareStore,
    vaultStore,
    prepareIssue,
    createCredential,
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

export function buildMockCredential(params: {
  issuer: string;
  subject: string;
  type: string;
  attributesJson: string;
  expires: string;
}): MockCredential {
  let attrs: Record<string, unknown> = {};
  const raw = params.attributesJson || '{}';
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      attrs = parsed as Record<string, unknown>;
    }
  } catch {
    throw new Error('Attributes JSON is not valid');
  }

  return {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', params.type],
    issuer: params.issuer,
    issuanceDate: new Date().toISOString(),
    expirationDate: params.expires || undefined,
    credentialSubject: {
      id: params.subject,
      ...attrs,
    },
  };
}
