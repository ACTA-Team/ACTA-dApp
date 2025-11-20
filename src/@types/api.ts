export type IssueCredentialPayload =
  | {
      signedXdr: string;
      vcId: string;
    }
  | {
      owner: string;
      vcId: string;
      vcData: string;
      vaultContractId: string;
      didUri?: string;
    };

export type VaultStorePayload =
  | {
      signedXdr: string;
      vcId: string;
      owner?: string;
      vaultContractId?: string;
    }
  | {
      owner: string;
      vcId: string;
      vcData: string;
      vaultContractId: string;
      issuerDid?: string;
      issuanceContractId?: string;
    };
