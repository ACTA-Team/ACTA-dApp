export type MockCredential = {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: { id: string } & Record<string, unknown>;
};

export type Credential = {
  id: string;
  title: string;
  issuer: string;
  subject: string;
  type: string;
  issuedAt: string;
  expirationDate: string | null;
  status: 'valid' | 'expired' | 'revoked';
  birthDate?: string;
};

export type CredentialVerifyProps = {
  vcId: string;
  status?: string | null;
  since?: string | null;
  revealed?: Record<string, unknown> | null;
  zkValid?: boolean | null;
  zkStatement?: any | null;
};
