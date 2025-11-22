# ACTA dApp

A modern web dApp to issue, manage, share, and authorize verifiable credentials. Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and the ACTA SDK.

## Overview

- Issue credentials to users and manage issuer authorization
- Maintain a vault of credentials with search, share, and revoke actions
- Guided onboarding via tutorials and quick start flows
- Responsive UI with accessible components and consistent design

## Features

- Dashboard: overview and quick actions
- Issue: create and issue new credentials
- Authorize: manage authorized issuers
- Vault: list, search, share, and revoke credentials
- Tutorials: step-by-step guidance

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

## Configuration Notes

- Icons are provided by `lucide-react` for consistency and clarity
- Tailwind CSS v4 is used for styling with utility classes
- The ACTA SDK is configured via `ActaProvider`; no environment setup is required for local development

## Security

- Do not commit secrets to the repository
- Keep `.env*` files local and out of version control

## Contributing

Issues and PRs are welcome. Keep changes focused and follow the existing code style. Run `npm run lint` and `npm run build` before submitting.
