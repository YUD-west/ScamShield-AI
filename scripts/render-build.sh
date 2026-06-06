#!/usr/bin/env bash
set -euo pipefail

MAX_DB_ATTEMPTS="${MAX_DB_ATTEMPTS:-30}"
DB_RETRY_SECONDS="${DB_RETRY_SECONDS:-2}"

echo "[render-build] Installing dependencies..."
npm install

echo "[render-build] Generating Prisma client..."
npx prisma generate

echo "[render-build] Waiting for database..."
db_ready=0
for attempt in $(seq 1 "$MAX_DB_ATTEMPTS"); do
  if npx prisma db push --accept-data-loss; then
    db_ready=1
    echo "[render-build] Database schema synced."
    break
  fi

  echo "[render-build] Database attempt $attempt/$MAX_DB_ATTEMPTS failed; retrying in ${DB_RETRY_SECONDS}s..."
  sleep "$DB_RETRY_SECONDS"
done

if [ "$db_ready" != "1" ]; then
  echo "[render-build] Database was not ready after $MAX_DB_ATTEMPTS attempts."
  exit 1
fi

echo "[render-build] Building Next.js..."
npx next build

echo "[render-build] Build complete."
