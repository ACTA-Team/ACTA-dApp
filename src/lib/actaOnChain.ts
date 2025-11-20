import {
  Account,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  scValToNative,
  xdr,
  rpc,
  Keypair,
} from '@stellar/stellar-sdk';
import type { VerifyOnChainParams, VerifyOnChainResult } from '@/@types/onchain';

export async function verifyOnChain({
  rpcUrl,
  networkPassphrase,
  issuanceContractId,
  sourcePublicKey,
  vcId,
}: VerifyOnChainParams): Promise<VerifyOnChainResult> {
  const server = new rpc.Server(rpcUrl);
  const tempPublic = sourcePublicKey || Keypair.random().publicKey();
  const account = new Account(tempPublic, '0');

  const contract = new Contract(issuanceContractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contract.call('verify', xdr.ScVal.scvString(vcId)))
    .setTimeout(30)
    .build();

  const sim = (await server.simulateTransaction(tx)) as {
    result?: { retval?: xdr.ScVal };
  };
  const retval = sim?.result?.retval;
  if (!retval) {
    throw new Error('simulation_no_retval');
  }

  const native = scValToNative(retval) as {
    status?: string;
    value?: string;
    since?: string;
  };
  const status: string = native?.status ?? native?.value ?? 'unknown';
  const since = native?.since;

  return { vc_id: vcId, status, since };
}
