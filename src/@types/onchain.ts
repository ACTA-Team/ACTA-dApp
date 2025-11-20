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
