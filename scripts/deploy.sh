#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/home/jayson/Development/PaceTrace"
# Default to web/ since pacetrace.service runs there; override with PACETRACE_APP_DIR if needed
APP_DIR="${PACETRACE_APP_DIR:-web}"
SERVICE="pacetrace.service"
PORT="${PORT:-3001}"

echo "==> cd to repo"
cd "$APP_ROOT"

echo "==> verify clean working tree"
git diff --quiet && git diff --cached --quiet || { echo "!! working tree not clean; commit or stash first"; exit 2; }

echo "==> git pull (ff-only)"
git pull --ff-only

# Install deps deterministically
if [ -f "$APP_ROOT/$APP_DIR/package.json" ]; then
  echo "==> npm ci ($APP_DIR/)"
  npm --prefix "$APP_ROOT/$APP_DIR" ci
elif [ -f "$APP_ROOT/package.json" ]; then
  echo "==> npm ci (root)"
  npm ci
else
  echo "!! No package.json at $APP_ROOT or $APP_ROOT/$APP_DIR; aborting."
  exit 1
fi

# Prisma (only if schema exists under the selected app dir)
if [ -f "$APP_ROOT/$APP_DIR/prisma/schema.prisma" ]; then
  echo "==> prisma generate ($APP_DIR/)"
  npx --prefix "$APP_ROOT/$APP_DIR" prisma generate
  echo "==> prisma migrate deploy ($APP_DIR/)"
  npx --prefix "$APP_ROOT/$APP_DIR" prisma migrate deploy || true
else
  echo "==> prisma schema missing; skipping generate/migrate"
fi

# Restart the user service
echo "==> restart service: $SERVICE"
systemctl --user restart "$SERVICE"

# Wait for listener
echo "==> wait for listener on :$PORT"
for i in {1..20}; do
  ss -ltnp | grep -q ":$PORT" && break || sleep 1
done
ss -ltnp | grep ":$PORT" || echo "!! no listener on :$PORT yet"

# Quick HTTP checks (health first if present)
echo "==> quick HTTP checks"
set +e
curl -fsSI "http://127.0.0.1:$PORT/api/health" | head -n1 || true
curl -fsSI "http://127.0.0.1:$PORT/"         | head -n1 || true
curl -fsSI "http://127.0.0.1:$PORT/login"    | head -n1 || true
set -e

echo "==> done"
