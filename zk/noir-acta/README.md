# Noir Acta — Commands for ZK Age Proof (Adult Check)

## Sequence

- `git checkout complete`
- `nargo compile`
- `nargo check`
- Edit `Prover.toml` with `age = <your_age>`
- `nargo execute`
- `bb prove -b ./target/noir_workshop.json -w ./target/noir_workshop.gz -o ./target`
- `bb write_vk -b ./target/noir_workshop.json -o ./target`
- `bb verify -k ./target/vk -p ./target/proof -i ./target/public_inputs`

## Windows PowerShell

```
cd "C:\Users\Josué Brenes\Downloads\Argentina\hackathon\zk\noir-acta"
git checkout complete
nargo compile
nargo check
# Change age (example 19)
Set-Content -Path .\Prover.toml -Value "age = 19"
# Execute to generate the witness
nargo execute
# Generate proof
bb prove -b ./target/noir_workshop.json -w ./target/noir_workshop.gz -o ./target
# Write verification key
bb write_vk -b ./target/noir_workshop.json -o ./target
# Verify
bb verify -k ./target/vk -p ./target/proof -i ./target/public_inputs
```

## WSL/Linux

```
cd "/mnt/c/Users/Josué Brenes/Downloads/Argentina/hackathon/zk/noir-acta"
git checkout complete
nargo compile
nargo check
# Change age (example 19)
echo 'age = 19' > Prover.toml
# Execute to generate the witness
nargo execute
# Generate proof
bb prove -b ./target/noir_workshop.json -w ./target/noir_workshop.gz -o ./target
# Write verification key
bb write_vk -b ./target/noir_workshop.json -o ./target
# Verify
bb verify -k ./target/vk -p ./target/proof -i ./target/public_inputs
```

## Artifact Cleanup (optional)

- Windows PowerShell:

```
Remove-Item -Force .\target\proof, .\target\public_inputs
```

- WSL/Linux:

```
rm -f ./target/proof ./target/public_inputs
```

## Expected Outputs

- `./target/noir_workshop.json` compiled circuit
- `./target/noir_workshop.gz` witness
- `./target/proof` and `./target/public_inputs` proof and public inputs
- `./target/vk` verification key
