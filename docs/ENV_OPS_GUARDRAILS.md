!! ENV & OPS GUARDRAILS (DO NOT CHANGE unless the task explicitly says so)

PROJECT_DIR = /home/jayson/Development/PaceTrace
SERVICE     = pacetrace.service
PORT        = 3001

Current layout: single-package Next.js app at repo root (package.json in PROJECT_DIR).
Prisma schema (when present) lives at PROJECT_DIR/prisma/schema.prisma.

Systemd:
- User unit name MUST remain: pacetrace.service
- Do NOT create/rename/disable services.
- Do NOT change PORT or host binding.
- ExecStart MUST remain: `npm run dev -- --hostname 0.0.0.0 --port 3001` (from PROJECT_DIR)
- ExecStartPre MUST remain a guarded Prisma migrate:
  `test -f PROJECT_DIR/prisma/schema.prisma && npx prisma migrate deploy --schema PROJECT_DIR/prisma/schema.prisma || echo "[pacetrace] prisma schema missing, skipping migrate"`

Deploy script:
- Keep and do not modify: PROJECT_DIR/scripts/deploy.sh
- After changes, call: `~/bin/pacetrace-deploy` (or PROJECT_DIR/scripts/deploy.sh)

File scope for this task:
- You MAY add/edit files under: src/, app/, public/, tailwind.config.ts, postcss.config.js, tsconfig.json, README.md, docs/
- You MUST NOT touch: ~/.config/systemd/user/pacetrace.service, PROJECT_DIR/scripts/deploy.sh, .env*, runtime env files, or any system paths.

Monorepo note:
- Do NOT move the app into web/ unless I start a task titled **"Monorepo move to web/"**.
- If (and only if) that task is given, you must:
  - Create PROJECT_DIR/web with its own package.json and move app code there.
  - Keep Prisma at PROJECT_DIR/prisma (do not relocate).
  - Update systemd ExecStart to: `npm --prefix PROJECT_DIR/web run dev -- --hostname 0.0.0.0 --port 3001`
  - Leave the guarded migrate ExecStartPre as-is (absolute --schema path).
  - Ensure PROJECT_DIR/scripts/deploy.sh still works (it already auto-detects root vs web/).

Performance & UX guardrails:
- Tailwind + semantic CSS tokens only; no Emotion, no MobX.
- Keep accessibility (labels, focus, aria-live on errors) and avoid heavy deps.

Post-task smoke test (Codex must run and paste outputs):
1) `git rev-parse --short HEAD`
2) `~/bin/pacetrace-deploy`
3) `curl -fsSI http://127.0.0.1:3001/login | head -n 1`
4) `journalctl --user -n 50 -u pacetrace.service --no-pager | tail -n 20`
