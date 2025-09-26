# PaceTrace

PaceTrace is a multi-tenant telemetry and coaching platform for RC racing teams. The repository now ships a **single Next.js runtime** from the repo root. This app owns the production UI, registration APIs, Prisma schema, and mailer utilities that previously lived under the temporary `web/` workspace.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate the Prisma client and sync migrations against the database referenced by `DATABASE_URL`:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
3. Run the development server (port 3001 keeps parity with production bindings):
   ```bash
   npm run dev -- --hostname 0.0.0.0 --port 3001
   ```
4. Open [http://localhost:3001](http://localhost:3001) to explore the marketing shell and navigate to `/login` or `/register` for the authentication flows.

Environment variables required for local development live in `.env.example`. Copy it to `.env` (or `.env.local`) and fill in:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `EMAIL_FROM`

Optional SMTP variables enable transactional email delivery. Without them the mailer falls back to console logging.

## API surface

The root app serves the following routes:

- `POST /api/register` – creates a pending user, emits approval tokens, and notifies admins.
- `GET /api/approvals/[token]` – approves or denies a pending user based on the token action.
- `GET /api/health` – lightweight readiness probe returning `{ ok: true }` when the server is up.
- `GET /api/ready` – returns 200 only when required env vars are present, Prisma can connect, and all migrations are applied.
- `GET /api/version` – exposes the package version for observability hooks.
- `GET/POST /api/auth/[...nextauth]` – NextAuth credential provider.

### Troubleshooting `/api/register`

If the registration form responds with HTTP 500 and the UI shows "We couldn't process that request," Prisma failed to connect to the database. Verify the environment and migrations:

1. Copy `.env.example` to your active environment file and provide a valid Postgres `DATABASE_URL`.
2. Ensure the referenced database is reachable from your machine or container.
3. Apply migrations from the root Prisma schema:
   ```bash
   npx prisma migrate deploy --schema prisma/schema.prisma
   ```
4. Restart the Next.js server to pick up the updated environment variables.

## Available scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Starts the local dev server with hot reloading. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Runs the production build. |
| `npm run lint` | Lints the project with Next.js/ESLint defaults. |

## Project structure

```
prisma/                 # Prisma schema and migrations (single source of truth)
src/
  app/
    api/                # Next.js App Router API handlers (register, approvals, auth, health, ready, version)
    globals.css         # Tailwind setup + imports semantic design tokens
    layout.tsx          # Root layout, fonts, and metadata
    login/              # Sign-in screen + client form logic
    register/           # Registration form promoted from Storybook workspace
  components/auth/      # Token-driven building blocks (buttons, forms, screens)
  server/               # Prisma client and mailer utilities shared across routes
```

Design tokens now live at `src/styles/tokens.css` and are imported by `src/app/globals.css`. Tailwind exposes semantic utilities (background, accent, muted, etc.) that map to those variables so UI code avoids hard-coded hex values.

## Operations

- Deployments remain orchestrated by `~/bin/pacetrace-deploy`, which wraps `scripts/deploy.sh`. The helper performs `npm ci`, runs `npx prisma migrate deploy`, and then restarts the systemd unit.
- The systemd reference unit (`docs/systemd/pacetrace.service`) issues the same guarded migrate as an `ExecStartPre` step before starting `npm run dev -- --hostname 0.0.0.0 --port 3001`.
- Health probes should target `/api/health`. Readiness and rollout automation should poll `/api/ready` before accepting traffic.

## Visual workflow

Storybook is currently offline; the approved auth components now live directly in the production app under `src/components/auth/`. Future design explorations can reintroduce Storybook at the root without owning routes or Prisma. Keep the components token-driven and aligned with the flows documented in `docs/authentication.md` and `PaceTrace — Auth Wireframes → Mid-fi + Storybook Chromatic.md`.

## Observability hooks

Structured logging and telemetry helpers live in `src/lib/logging.ts` and `src/lib/telemetry.ts`. Authentication flows and protected layouts publish events so backend services can ingest them as the platform matures.
