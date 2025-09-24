Here’s a clean, ready-to-commit **README.md** for your new repo. It matches our stack, layering rules, perf budgets, and near-term priorities.

---

# PaceTrace — RC Race Engineering

Data-driven RC racing: laps, telemetry, and coaching insights.
Multi-tenant web app for importing LiveRC events, comparing laps, and visualising telemetry—built with Next.js, Tailwind, Prisma, and PostgreSQL.

## Why PaceTrace?

Teams go faster when they can see, compare, and iterate. PaceTrace turns raw lap data and (later) on-car sensors into actionable feedback—so drivers improve, setups converge, and decisions are accountable.

---

## Features (MVP)

* **Auth & tenancy**: Email/password auth (Argon2id on server), secure HTTP-only cookies, multi-tenant accounts.
* **LiveRC ingestion**: Import an event or a single session; per-user quotas.
* **Lap compare**: Overlay personal vs competitor laps across practice/qual/main; lightweight charts.
* **Admin basics**: Users/accounts CRUD with usage/storage/audit summaries.
* **Ops endpoints**: `/api/health`, `/api/ready`, `/api/version` (readiness gated by applied migrations).

> **Non-goals (MVP):** Coach AI, commentators’ panel, automatic date-range ingestion, advanced marketing. Tracked in `docs/backlog.md`.

---

## Tech Stack & Principles

* **Frontend:** Next.js 14 (App Router), TypeScript (strict), Tailwind + shadcn/ui, semantic CSS tokens (no hard-coded hex).
* **Backend:** Next.js route handlers; Prisma ORM; PostgreSQL.
* **Layering:** UI (`web/`) → API endpoints; no direct infra calls from UI.
* **Perf budgets:** UI P50 ≤ 300 ms, P95 ≤ 800 ms. API reads P95 ≤ 400 ms.
* **Telemetry:** Structured logs, request timings, anonymised IDs, key domain events (90-day aggregates; 7-day raw).
* **Docs/ADRs:** Significant choices recorded under `docs/adr/`.

---

## Quickstart

> **Prereqs:** Node 20+ (or 22 LTS), pnpm or npm, PostgreSQL 14+, OpenSSL. On RHEL/Rocky, ensure `firewalld`, `chrony` are configured.

```bash
# Clone & install
git clone https://github.com/<you>/<repo>.git
cd <repo>
npm --prefix web install

# Environment
cp .env.example .env
# Edit .env -> set DATABASE_URL=postgresql://user:pass@host:5432/pacetrace?schema=public

# Database (if prisma schema exists)
npx prisma migrate deploy --schema prisma/schema.prisma || echo "prisma schema not present yet"

# Dev server
npm --prefix web run dev -- --hostname 0.0.0.0 --port 3001
# Visit http://localhost:3001/login
```

---

## Configuration

* **Port:** `3001` (Next binds `0.0.0.0:3001`).
* **Env:** `.env` in repo root (loaded for both dev and unit service).
* **Semantic colours:** define tokens in `web/src/styles/tokens.css`, e.g.
  `--color-bg`, `--color-fg`, `--color-card`, `--color-accent`, `--color-muted`, `--ring`.

---

## Service (systemd user) — dev profile

A unit that (a) **guards migrations** if Prisma isn’t present yet and (b) starts Next from `web/`:

```
~/.config/systemd/user/rcraceengineer.service

[Unit]
Description=PaceTrace - Next.js (dev)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
EnvironmentFile=%h/Development/PaceTrace/.env
WorkingDirectory=%h/Development/PaceTrace
# Only run migrate if schema exists (safe on fresh scaffolds)
ExecStartPre=/usr/bin/bash -lc 'test -f %h/Development/PaceTrace/prisma/schema.prisma && \
  /usr/bin/npx prisma migrate deploy --schema %h/Development/PaceTrace/prisma/schema.prisma || \
  echo "[pacetrace] prisma schema missing, skipping migrate"'
Environment=NODE_ENV=development
Environment=PORT=3001
Environment=NEXT_TELEMETRY_DISABLED=1
ExecStart=/usr/bin/npm --prefix %h/Development/PaceTrace/web run dev -- --hostname 0.0.0.0 --port 3001
Restart=on-failure
RestartSec=2
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

> **Why:** Keeps the service resilient during early UI-only work while maintaining readiness gating once migrations land.

---

## Project layout

```
.
├── web/                     # Next.js app (App Router)
│   ├── app/                 # Routes (/login, /register, /dashboard, /api/*)
│   ├── src/components/      # UI components (AuthCard, forms, etc.)
│   ├── src/lib/telemetry.ts # Client-side telemetry emitter (no-op safe)
│   └── src/styles/tokens.css# Semantic CSS variables
├── prisma/                  # Prisma schema + migrations (when added)
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   ├── backlog.md           # Non-goals + future items
│   └── ...
├── scripts/                 # Ops scripts (sanity checks, evidence capture, etc.)
└── README.md
```

---

## Health, Readiness, Version

* `GET /api/health` → lightweight liveness (process is up).
* `GET /api/ready` → **false** if migrations pending or DB unreachable.
* `GET /api/version` → git SHA, build time, app version.

> **Why:** Decouple deploy/proc success from *serving readiness*. CI/CD and load balancers hit these to decide rollout.

---

## Telemetry & Logging

* **Client events:** `auth:login_submit|success|error`, `auth:register_*` (no PII).
* **Server logs:** request timing, route name, anonymised session/user ID, error traces.
* **Retention:** raw logs 7 days; aggregated metrics 90 days (tweak later).

---

## Roadmap (high-level)

* **MVP (current):** Auth, LiveRC import, lap compare, admin basics, health/ready/version.
* **Next:** Dashboard polish, session timeline, basic annotations, per-tenant quotas.
* **Coach & Telemetry:** On-car sensor ingestion (GPS/IMU), real-time viewer (uPlot), coaching models, session quality scoring.
* **Charts:** ApexCharts for dashboards; uPlot for high-volume, real-time traces.

---

## Contributing

* **Standards:** strict TS, small diffs, minimal deps, conventional commits.
* **PRs:** keep shippable; record significant choices in `docs/adr/`.
* **Checks:** ensure Prisma migrations + release notes when schema changes; `/api/ready` must fail when migrations are pending.

**Conventional commits examples**

* `feat(auth): redesign login/register with centered card`
* `chore(ci): add readiness probe to healthcheck`
* `docs(adr): choose uPlot for high-volume telemetry`

---

## Security

* Passwords hashed with **Argon2id** (server-side).
* Session cookies: **secure, HTTP-only**.
* No PII in client telemetry; avoid logging credentials anywhere.
* Report vulnerabilities privately (create a Security advisory on GitHub).

---

## License

MIT © Jayson + The Brainy One

---

## Credits

* Built with Next.js, Tailwind, Prisma, PostgreSQL.
* Thanks to the RC community and open-source maintainers powering the stack.

---

> Have five minutes to set up CI or want a templated ADR to lock in charting choices? Say the word and I’ll draft them.
