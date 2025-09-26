!! ENV & OPS GUARDRAILS (DO NOT CHANGE unless the task explicitly says so)

PROJECT_DIR = /home/jayson/Development/PaceTrace
SERVICE     = pacetrace.service
PORT        = 3001

## Repository layout
- **Production app**: single-package Next.js project at the repo root (package.json in PROJECT_DIR). This is what systemd launches in production today.
- **Optional Storybook sandbox**: if reintroduced, it must live at the repo root (not `web/`) and cannot own Prisma, database migrations, or API routes.
- Prisma schema (when present) lives at `PROJECT_DIR/prisma/schema.prisma` and is shared by all tooling.

> Legacy references to a `web/` workspace are historical; production code and Prisma now live exclusively under the root app.

## Systemd (production runtime)
- User unit name MUST remain: pacetrace.service
- Do NOT create/rename/disable services.
- Do NOT change PORT or host binding.
- ExecStart MUST remain: `npm run dev -- --hostname 0.0.0.0 --port 3001` (from PROJECT_DIR)
- ExecStartPre MUST remain a guarded Prisma migrate:
  `test -f PROJECT_DIR/prisma/schema.prisma && npx prisma migrate deploy --schema PROJECT_DIR/prisma/schema.prisma || echo "[pacetrace] prisma schema missing, skipping migrate"`

Why these constraints?
- The root app is the only code path packaged for production, so the service command must stay rooted at `PROJECT_DIR` until the sanctioned migration task lands.
- Guarded migrations keep the unit idempotent on machines that do not ship Prisma (local sandboxes) while still applying migrations in environments that do.
- The fixed port and binding match existing firewall rules and nginx proxies; drifting would break health checks.

## Deployment helper
- Keep and do not modify: PROJECT_DIR/scripts/deploy.sh
- After changes, call: `~/bin/pacetrace-deploy` (or PROJECT_DIR/scripts/deploy.sh)
- `pacetrace-deploy` is authoritative for live rollouts and is responsible for invoking the guarded `ExecStartPre` (`npx prisma migrate deploy --schema PROJECT_DIR/prisma/schema.prisma`) before systemd starts the service.

> `~/bin/pacetrace-deploy` is provisioned on the target server and simply shells out to the repo script above. The helper is **not** committed to this repository.

File scope for this task:
- You MAY add/edit files under: src/, app/, public/, tailwind.config.ts, postcss.config.js, tsconfig.json, README.md, docs/
- You MUST NOT touch: ~/.config/systemd/user/pacetrace.service, PROJECT_DIR/scripts/deploy.sh, .env*, runtime env files, or any system paths.

## Monorepo note
- Do NOT resurrect the legacy `web/` workspace unless explicitly tasked to do so.
- Any future multi-app layout must keep Prisma at `PROJECT_DIR/prisma`, maintain the guarded migrate `ExecStartPre`, and preserve the production service command shape documented above.

Performance & UX guardrails:
- Tailwind + semantic CSS tokens only; no Emotion, no MobX.
- Keep accessibility (labels, focus, aria-live on errors) and avoid heavy deps.

## Post-task smoke test (Codex must run and paste outputs)
1) `git rev-parse --short HEAD`
2) `~/bin/pacetrace-deploy`
3) `curl -fsSI http://127.0.0.1:3001/login | head -n 1`
4) `journalctl --user -n 50 -u pacetrace.service --no-pager | tail -n 20`
