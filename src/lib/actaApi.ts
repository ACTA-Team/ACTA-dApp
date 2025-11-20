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

export async function postIssueCredential(
  apiBaseUrl: string,
  payload: IssueCredentialPayload
) {
  const resp = await fetch(`${apiBaseUrl}/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = (json && json.message) || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return json as { vc_id: string; tx_id: string };
}

export async function postPrepareStore(
  apiBaseUrl: string,
  args: {
    owner: string;
    vcId: string;
    didUri: string;
    fields: Record<string, any>;
    vaultContractId?: string;
    issuer?: string;
  }
) {
  const resp = await fetch(`${apiBaseUrl}/tx/prepare/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(args),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = (json && json.message) || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return json as { unsignedXdr: string };
}

export async function postPrepareIssue(
  apiBaseUrl: string,
  args: {
    owner: string;
    vcId: string;
    vcData: string;
    vaultContractId?: string;
    issuer?: string;
    issuerDid?: string;
  }
) {
  const resp = await fetch(`${apiBaseUrl}/tx/prepare/issue`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(args),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = (json && json.message) || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return json as { unsignedXdr: string };
}

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

export async function postVaultStore(apiBaseUrl: string, payload: VaultStorePayload) {
  const resp = await fetch(`${apiBaseUrl}/vault/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = (json && json.message) || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return json as {
    vc_id: string;
    tx_id: string;
    issue_tx_id?: string;
    verification?: { status?: string; since?: string };
  };
}

export async function getVerifyStatus(
  apiBaseUrl: string,
  vcId: string
) {
  const resp = await fetch(`${apiBaseUrl}/verify/${encodeURIComponent(vcId)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = (json && json.message) || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return json as { vc_id: string; status: string; since?: string };
}

export async function postVaultVerify(
  apiBaseUrl: string,
  args: { owner: string; vcId: string; vaultContractId?: string }
) {
  const resp = await fetch(`${apiBaseUrl}/vault/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(args),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = (json && json.message) || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return json as { vc_id: string; status: string; since?: string };
}
