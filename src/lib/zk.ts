import { Buffer } from 'buffer';
type Predicate = { kind: 'none' | 'typeEq' | 'isAdult' | 'notExpired' | 'isValid'; value?: string };

function strToField(s: string): string {
  const enc = new TextEncoder().encode(s);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < enc.length; i++) {
    h ^= enc[i];
    h = Math.imul(h, 16777619);
    h >>>= 0;
  }
  return String(h);
}

function isValidStatus(status: unknown): boolean {
  const v = String(status || '').toLowerCase();
  return v === 'valid';
}

function notExpired(expiration: unknown): boolean {
  if (!expiration) return true;
  const t = typeof expiration === 'string' ? Date.parse(expiration) : Number(expiration);
  if (!Number.isFinite(t)) return true;
  return Date.now() < t;
}

async function loadNoir(acirUrl: string) {
  const { Noir } = await import('@noir-lang/noir_js');
  const { UltraHonkBackend } = await import('@aztec/bb.js');
  const resp = await fetch(acirUrl);
  if (!resp.ok) throw new Error('acir_not_found');
  const acir = await resp.json();
  const noir = new Noir(acir);
  const backend = new UltraHonkBackend(acir.bytecode);
  return { noir, backend };
}

export async function generateZkProof({
  credential,
  revealFields,
  predicate,
}: {
  credential: Record<string, unknown>;
  revealFields: Record<string, boolean>;
  predicate: Predicate;
}) {
  const kind = predicate.kind;
  const selectedKeys = Object.keys(revealFields || {}).filter((k) => !!revealFields[k]);
  if (kind === 'none') return { statement: 'none', publicSignals: [], proof: null };
  if (kind === 'typeEq') {
    const typeStr = String(credential.type || '');
    const expected = String(predicate.value || typeStr);
    const typeHash = strToField(typeStr);
    const expectedHash = strToField(expected);
    const validFlag =
      isValidStatus(credential.status) && notExpired(credential.expirationDate) ? '1' : '0';
    const { noir, backend } = await loadNoir('/zk/noir_valid_vc.json');
    const execRes = await noir.execute({
      type_hash: typeHash,
      expected_hash: expectedHash,
      valid: validFlag,
    });
    const proofData = await backend.generateProof(execRes.witness);
    const verified = await backend.verifyProof(proofData);
    const rv: unknown = (execRes as { returnValue?: unknown })?.returnValue;
    const isValid = rv === true || rv === '1' || rv === 1;
    const proof = JSON.stringify({
      publicInputs: proofData.publicInputs,
      proof: Buffer.from(proofData.proof).toString('base64'),
    });
    return {
      statement: { kind, selectedKeys, isValid, typeHash, expectedHash, valid: validFlag },
      publicSignals: proofData.publicInputs,
      proof,
      ok: verified,
    };
  }
  if (kind === 'isAdult') {
    const dob = String((credential as Record<string, unknown>)['birthDate'] || '');
    if (!dob) throw new Error('birth_date_missing');
    const t = Date.parse(dob);
    if (!Number.isFinite(t)) throw new Error('birth_date_invalid');
    const now = Date.now();
    const ageYears = Math.max(0, Math.floor((now - t) / (365.25 * 24 * 60 * 60 * 1000)));
    const { noir, backend } = await loadNoir('/zk/noir_workshop.json');
    const execRes = await noir.execute({ age: ageYears });
    const proofData = await backend.generateProof(execRes.witness);
    const verified = await backend.verifyProof(proofData);
    const rv: unknown = (execRes as { returnValue?: unknown })?.returnValue;
    const isAdult = rv === true || rv === '1' || rv === 1;
    const proof = JSON.stringify({
      publicInputs: proofData.publicInputs,
      proof: Buffer.from(proofData.proof).toString('base64'),
    });
    return {
      statement: { kind, selectedKeys, isAdult },
      publicSignals: [isAdult ? '1' : '0'],
      proof,
      ok: verified,
    };
  }
  if (kind === 'notExpired') {
    const exp = (credential as Record<string, unknown>)['expirationDate'];
    if (!exp) throw new Error('expiration_date_missing');
    const t = typeof exp === 'string' ? Date.parse(exp) : Number(exp);
    if (!Number.isFinite(t)) throw new Error('expiration_date_invalid');
    const now = Date.now();
    const { noir, backend } = await loadNoir('/zk/noir_not_expired.json');
    const execRes = await noir.execute({ expiry_ts: Math.floor(t), now_ts: Math.floor(now) });
    const proofData = await backend.generateProof(execRes.witness);
    const verified = await backend.verifyProof(proofData);
    const rv: unknown = (execRes as { returnValue?: unknown })?.returnValue;
    const notExpired = rv === true || rv === '1' || rv === 1;
    const proof = JSON.stringify({
      publicInputs: proofData.publicInputs,
      proof: Buffer.from(proofData.proof).toString('base64'),
    });
    return {
      statement: { kind, selectedKeys, notExpired },
      publicSignals: [notExpired ? '1' : '0'],
      proof,
      ok: verified,
    };
  }
  if (kind === 'isValid') {
    const status = (credential as Record<string, unknown>)['status'];
    const flag = String(isValidStatus(status) ? '1' : '0');
    const { noir, backend } = await loadNoir('/zk/noir_valid_status.json');
    const execRes = await noir.execute({ valid: flag });
    const proofData = await backend.generateProof(execRes.witness);
    const verified = await backend.verifyProof(proofData);
    const rv: unknown = (execRes as { returnValue?: unknown })?.returnValue;
    const isValid = rv === true || rv === '1' || rv === 1;
    const proof = JSON.stringify({
      publicInputs: proofData.publicInputs,
      proof: Buffer.from(proofData.proof).toString('base64'),
    });
    return {
      statement: { kind, selectedKeys, isValid },
      publicSignals: [flag],
      proof,
      ok: verified,
    };
  }
  return { statement: 'none', publicSignals: [], proof: null };
}

export async function verifyZkProof(
  payload: {
    statement?: { kind?: string; typeHash?: string; expectedHash?: string; valid?: string };
    publicSignals?: string[];
    proof?: string;
  } | null
): Promise<boolean> {
  if (!payload || !payload.statement || !payload.proof) return false;
  const st = payload.statement;
  if (st.kind === 'typeEq') {
    const { backend } = await loadNoir('/zk/noir_valid_vc.json');
    const p = JSON.parse(String(payload.proof || '{}')) as {
      publicInputs?: string[];
      proof?: string;
    };
    if (!p || !p.proof || !p.publicInputs) return false;
    const proofData: { publicInputs: string[]; proof: Uint8Array } = {
      publicInputs: p.publicInputs,
      proof: Buffer.from(p.proof, 'base64'),
    };
    const ok = await backend.verifyProof(proofData);
    return !!ok;
  }
  if (st.kind === 'isAdult') {
    const { backend } = await loadNoir('/zk/noir_workshop.json');
    const p = JSON.parse(String(payload.proof || '{}')) as {
      publicInputs?: string[];
      proof?: string;
    };
    if (!p || !p.proof || !p.publicInputs) return false;
    const proofData: { publicInputs: string[]; proof: Uint8Array } = {
      publicInputs: p.publicInputs,
      proof: Buffer.from(p.proof, 'base64'),
    };
    const ok = await backend.verifyProof(proofData);
    return !!ok;
  }
  if (st.kind === 'notExpired') {
    const { backend } = await loadNoir('/zk/noir_not_expired.json');
    const p = JSON.parse(String(payload.proof || '{}')) as {
      publicInputs?: string[];
      proof?: string;
    };
    if (!p || !p.proof || !p.publicInputs) return false;
    const proofData: { publicInputs: string[]; proof: Uint8Array } = {
      publicInputs: p.publicInputs,
      proof: Buffer.from(p.proof, 'base64'),
    };
    const ok = await backend.verifyProof(proofData);
    return !!ok;
  }
  if (st.kind === 'isValid') {
    const { backend } = await loadNoir('/zk/noir_valid_status.json');
    const p = JSON.parse(String(payload.proof || '{}')) as {
      publicInputs?: string[];
      proof?: string;
    };
    if (!p || !p.proof || !p.publicInputs) return false;
    const proofData: { publicInputs: string[]; proof: Uint8Array } = {
      publicInputs: p.publicInputs,
      proof: Buffer.from(p.proof, 'base64'),
    };
    const ok = await backend.verifyProof(proofData);
    return !!ok;
  }
  return false;
}
