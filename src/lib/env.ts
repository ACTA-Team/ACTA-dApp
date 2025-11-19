export type EnvDefaults = {
  apiBaseUrl: string;
  rpcUrl: string;
  networkPassphrase: string;
  issuanceContractId: string;
  vaultContractId: string;
};

export function getEnvDefaults(apiBaseUrlOverride?: string): EnvDefaults {
  const apiBaseUrl =
    apiBaseUrlOverride ||
    process.env.NEXT_PUBLIC_ACTA_API_URL_TESTNET ||
    process.env.NEXT_PUBLIC_ACTA_API_URL ||
    "https://api.testnet.acta.build";
  const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
  const networkPassphrase =
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
  const issuanceContractId = process.env.NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID || "";
  const vaultContractId = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID || "";
  return { apiBaseUrl, rpcUrl, networkPassphrase, issuanceContractId, vaultContractId };
}

let cachedConfig: EnvDefaults | null = null;
let cachedBaseUrl: string | null = null;

export async function getClientConfig(apiBaseUrlOverride?: string): Promise<EnvDefaults> {
  // Invalidate cache if base URL changes
  if (cachedConfig && cachedBaseUrl === (apiBaseUrlOverride || null)) return cachedConfig;

  const defaults = getEnvDefaults(apiBaseUrlOverride);
  try {
    const resp = await fetch(`${defaults.apiBaseUrl}/config`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!resp.ok) throw new Error(`config_http_${resp.status}`);
    const json = (await resp.json()) as Partial<EnvDefaults>;
    const merged: EnvDefaults = {
      apiBaseUrl: defaults.apiBaseUrl,
      rpcUrl: json.rpcUrl || defaults.rpcUrl,
      networkPassphrase: json.networkPassphrase || defaults.networkPassphrase,
      issuanceContractId: json.issuanceContractId || defaults.issuanceContractId,
      vaultContractId: json.vaultContractId || defaults.vaultContractId,
    };
    cachedConfig = merged;
    cachedBaseUrl = apiBaseUrlOverride || null;
    return merged;
  } catch {
    cachedConfig = defaults;
    cachedBaseUrl = apiBaseUrlOverride || null;
    return defaults;
  }
}