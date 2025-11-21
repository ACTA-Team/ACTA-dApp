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
  zkStatement?: ZkStatement | null;
};

export type ZkTypeEqStatement = {
  kind: 'typeEq';
  selectedKeys: string[];
  isValid: boolean;
  typeHash: string;
  expectedHash: string;
  valid: string;
};

export type ZkIsAdultStatement = {
  kind: 'isAdult';
  selectedKeys: string[];
  isAdult: boolean;
};

export type ZkStatement = 'none' | ZkTypeEqStatement | ZkIsAdultStatement;

export type CredentialCardProps = {
  name: string;
  category: string;
  wallet: string;
  url?: string;
  onCopy?: (text: string, label: string) => void;
  onShare?: () => void;
};
