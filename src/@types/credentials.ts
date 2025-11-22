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
  hasVerified?: boolean;
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

export type ZkNotExpiredStatement = {
  kind: 'notExpired';
  selectedKeys: string[];
  notExpired: boolean;
};

export type ZkIsValidStatement = {
  kind: 'isValid';
  selectedKeys: string[];
  isValid: boolean;
};

export type ZkStatement =
  | 'none'
  | ZkTypeEqStatement
  | ZkIsAdultStatement
  | ZkNotExpiredStatement
  | ZkIsValidStatement;

export type CredentialCardProps = {
  name: string;
  category: string;
  wallet: string;
  url?: string;
  status?: string;
  onCopy?: (text: string, label: string) => void;
  onShare?: () => void;
  onRevoke?: () => void;
};
