import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapContractErrorToMessage(err: unknown): string {
  const raw = typeof err === 'string' ? err : err instanceof Error ? err.message : String(err)
  const s = raw || ''

  const codeMatch = s.match(/Error\(Contract,\s*#(\d+)\)/) || s.match(/#(\d+)/)
  const code = codeMatch ? codeMatch[1] : undefined

  if (code === '1' || /AlreadyInitialized/i.test(s)) {
    return 'Vault ya fue inicializado'
  }
  if (code === '2' || /IssuerNotAuthorized/i.test(s)) {
    return 'Issuer no autorizado en este vault'
  }
  if (code === '3' || /IssuerAlreadyAuthorized/i.test(s)) {
    return 'Issuer ya autorizado'
  }
  if (code === '4' || /VaultRevoked/i.test(s)) {
    return 'Vault revocado'
  }
  if (code === '5' || /VCSAlreadyMigrated/i.test(s)) {
    return 'Credenciales ya migradas'
  }

  if (/FAILED/i.test(s)) return 'Transacción fallida'
  if (/ERROR/i.test(s)) return 'Error en la transacción'
  if (/Please set the wallet first/i.test(s)) return 'Primero conecta tu wallet'

  if (/Connect your wallet first/i.test(s)) return 'Primero conecta tu wallet'
  if (/Signer unavailable/i.test(s)) return 'Firmador no disponible'
  if (/Missing NEXT_PUBLIC_VAULT_CONTRACT_ID/i.test(s)) return 'ID de contrato Vault no configurado'

  if (s.trim()) return `Error inesperado: ${s.trim()}`

  return 'Error inesperado'
}
