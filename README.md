# ACTA dApp

A modern web dApp to issue, manage, share, and authorize verifiable credentials. Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and the ACTA SDK.

## Overview

- Issue credentials to users and manage issuer authorization
- Maintain a vault of credentials with search, share, and revoke actions
- Guided onboarding via tutorials and quick start flows
- Responsive UI with accessible components and consistent design

## Tech Stack

- Framework: Next.js 16 (App Router, Turbopack)
- UI: React 19, TypeScript, Tailwind CSS v4, Radix UI
- Icons: `lucide-react`
- State & Data: TanStack Query
- SDKs: `@acta-team/acta-sdk`, Stellar Wallets Kit

## Prerequisites

- Node.js 18 or newer
- npm (or your preferred package manager)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run in development:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000/`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
- `npm run format` — format with Prettier

## Build & Deploy

1. Build the app:

   ```bash
   npm run build
   ```

2. Start the server:

   ```bash
   npm run start
   ```

Deploy to any Node-compatible environment. Static and dynamic routes are handled by Next.js.

## Project Structure

- `src/app` — App Router pages and layouts
  - `dashboard/` — home, authorize, credentials, issue, tutorials
  - `credential/[id]` — dynamic credential page
- `src/components/modules` — domain components
  - `dashboard/` — quick start and dashboard UI
  - `credentials/` — credential list, card, share modal
  - `vault/` — vault dashboard and issuer management
- `src/components/ui` — shared UI (buttons, cards, effects)
- `src/layouts` — application layout and sidebar
- `src/providers` — app-wide context providers (network, wallet, ACTA SDK)

## Zero-Knowledge Proofs (ZK)

### Overview

- The app supports sharing credentials with an attached zero-knowledge proof (ZK) that validates a predicate without revealing private data.
- ZK proofs are generated client-side and verified client-side using Noir and bb.js backends.

### Available Tests

- Age ≥ 18 (`isAdult`)
- Not expired (`notExpired`)
- Status is valid (`isValid`)

### Generation Flow (Share Modal)

- Select the fields to reveal, pick a ZK predicate, and click `Generate ZK Proof`.
- The share link payload includes:
  - `revealedFields`: only the selected public fields
  - `statement`: the selected predicate and public parameters
  - `publicSignals` and `proof`: proof artifacts required for verification
- Encoding of the payload occurs in the share hook: `src/components/modules/credentials/hooks/useShareCredential.ts:62–77`.

### Verification Flow (Public Link)

- The credential page decodes the `share` payload and shows revealed fields.
- The ZK section ("ZK Proof", "Test", and privacy message) is hidden until the user clicks `Verify Proof`.
- On click, the app verifies the proof using the appropriate circuit and updates the UI:
  - Verification trigger and state: `src/components/modules/credentials/hooks/useCredentialVerify.ts:125–144`
  - ZK section gating in the card: `src/components/modules/credentials/ui/CredentialVerifyCard.tsx:120–149`

### Circuits

- ACIR JSON files are served under `public/zk/`:
  - `noir_workshop.json` — Age ≥ 18
  - `noir_not_expired.json` — Not expired
  - `noir_valid_status.json` — Status is valid
- Circuit loading and proof generation happen in `src/lib/zk.ts`.

### Security Notes

- Verification relies on `backend.verifyProof` — not on Noir `returnValue`.
- Only selected fields are revealed; no private inputs are shared.
- The ZK section remains hidden until explicit user verification to improve transparency.

### UI Texts

- All public-facing texts in the ZK flow are in English.

## Configuration Notes

- Icons are provided by `lucide-react` for consistency and clarity
- Tailwind CSS v4 is used for styling with utility classes
- The ACTA SDK is configured via `ActaProvider`; no environment setup is required for local development

## Security

- Do not commit secrets to the repository
- Keep `.env*` files local and out of version control

## Contributing

Issues and PRs are welcome. Keep changes focused and follow the existing code style. Run `npm run lint` and `npm run build` before submitting.
