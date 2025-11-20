import {
  Account,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  scValToNative,
  xdr,
  rpc,
  Keypair,
} from "@stellar/stellar-sdk";

export type VerifyOnChainParams = {
  rpcUrl: string;
  networkPassphrase: string;
  issuanceContractId: string;
  sourcePublicKey?: string;
  vcId: string;
};

export type VerifyOnChainResult = {
  vc_id: string;
  status: string;
  since?: string;
};

export async function verifyOnChain({
  rpcUrl,
  networkPassphrase,
  issuanceContractId,
  sourcePublicKey,
  vcId,
}: VerifyOnChainParams): Promise<VerifyOnChainResult> {
  const server = new rpc.Server(rpcUrl);
  // Use provided source account if available; otherwise, use a temporary key with sequence "0"
  const tempPublic = sourcePublicKey || Keypair.random().publicKey();
  const account = new Account(tempPublic, "0");

  const contract = new Contract(issuanceContractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contract.call("verify", xdr.ScVal.scvString(vcId)))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  const retval = (sim as any)?.result?.retval;
  if (!retval) {
    throw new Error("simulation_no_retval");
  }

  const native = scValToNative(retval) as any;
  const status: string = native?.status ?? native?.value ?? "unknown";
  const since = native?.since;

  return { vc_id: vcId, status, since };
}
