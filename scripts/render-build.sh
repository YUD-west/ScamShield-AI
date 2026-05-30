#!/usr/bin/env bash
set -e

echo "[render-build] Installing dependencies..."
npm install

echo "[render-build] Generating Prisma client..."
npx prisma generate

echo "[render-build] Waiting for database..."
for i in $(seq 1 30); do
  npx prisma db push --accept-data-loss 2>/dev/null && break
  echo "  attempt $i failed, retrying in 2s..."
  sleep 2
done

echo "[render-build] Building Next.js..."
npm run build

echo "[render-build] Build complete."
