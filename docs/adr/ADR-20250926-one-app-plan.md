# ADR 2025-09-26 – One-App Plan Consolidation

## Status
Accepted

## Context
The repository historically hosted two Next.js workspaces: the production runtime at the repo root and a temporary `web/` workspace that carried Prisma, API routes, Storybook, and mailer utilities during early prototyping. This split complicated deploys (Prisma lived outside the production app), forced path alias duplication, and caused confusion about which runtime owned `/api/*` endpoints. Deployment tooling (`pacetrace-deploy` + systemd) referenced the root app, so keeping critical server code in `web/` risked drift and outages.

## Decision
Adopt the One-App Plan: promote Prisma, server utilities, API routes, and the register UI into the root Next.js application so a single runtime owns production responsibilities. Storybook and design experimentation can return later as an optional workspace, but it must not own database access or API routes. The deployment pipeline continues to operate from the repo root, ensuring `npx prisma migrate deploy` runs before systemd starts the service.

## Alternatives considered
- **Retain the dual workspace** – rejected because it duplicated dependencies, required special casing in deploy scripts, and risked unintentional divergence between production and design code.
- **Move production into `web/`** – rejected because systemd, automation scripts, and documentation are anchored to the root app. Migrating them would be higher risk than consolidating into the existing production target.
- **Introduce a full monorepo toolchain (turborepo/nx)** – unnecessary overhead for a single deployed runtime and would increase build complexity without solving the ownership ambiguity.

## Consequences
- Prisma schema, migrations, and generated client now live at `./prisma`, and all server code imports from `@/server/*`.
- Deployment scripts and docs emphasize that `pacetrace-deploy` is authoritative and must run guarded Prisma migrations before starting the service.
- `/api/health`, `/api/ready`, and `/api/version` ship from the root runtime, giving ops a single surface for probes.
- The `web/` directory has been removed. If Storybook returns, it must mount at the root without owning persistence or API routes.
