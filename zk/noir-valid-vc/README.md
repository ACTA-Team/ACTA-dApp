# Noir ACTA — Valid Credential of Type Proof

This circuit proves: “I have a valid credential of type X” without revealing the document.

## Circuit

- `src/main.nr`
  - Inputs: `type_hash: Field`, `expected_hash: Field`, `valid: u8`
  - Output: `bool` → true if type matches and `valid == 1`

## How to Run (Windows PowerShell)

```powershell
cd "C:\Users\Josué Brenes\Downloads\Argentina\hackathon\zk\noir-valid-vc"
# Compile and check
nargo compile
nargo check
# Configure inputs (example)
Set-Content -Path .\Prover.toml -Value "type_hash = 123`nexpected_hash = 123`nvalid = 1"
# Execute to create witness
nargo execute
# Prove
bb prove -b ./target/noir_valid_vc.json -w ./target/noir_valid_vc.gz -o ./target
# Write verification key
bb write_vk -b ./target/noir_valid_vc.json -o ./target
# Verify
bb verify -k ./target/vk -p ./target/proof -i ./target/public_inputs
```

## Artifacts

- `./target/noir_valid_vc.json` — compiled circuit
- `./target/noir_valid_vc.gz` — witness
- `./target/proof` and `./target/public_inputs` — proof and public inputs
- `./target/vk` — verification key

## Integration Notes

- Hash the credential type off‑chain and pass as `type_hash`.
- Compute `valid` off‑chain (e.g., not expired, not revoked) and set to `1`.
- Publish `circuit.wasm`, `circuit_final.zkey`, and `vkey.json` under your web `/public/zk/validType/` to integrate with `generateZkProof` (`Web/@main/acta-dapp/src/lib/zk.ts:1-5,29-40`).
