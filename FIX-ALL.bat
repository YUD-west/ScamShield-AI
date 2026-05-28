@echo off
title ScamShield AI - Setup
cd /d "%~dp0"

echo Setup only (does NOT start server)...
call node scripts\kill-port.cjs
call node scripts\fix-package-json.cjs
call node scripts\validate.cjs
if errorlevel 1 pause & exit /b 1

(
echo AUTH_SECRET=scamshield-dev-secret-min-32-characters-long
echo AUTH_URL=http://localhost:3011
echo NEXTAUTH_URL=http://localhost:3011
echo AUTH_TRUST_HOST=true
echo NEXT_PUBLIC_APP_URL=http://localhost:3011
echo DATABASE_URL=file:./prisma/scamshield.db
) > .env

call node scripts\setup-db.cjs
if exist .next rmdir /s /q .next 2>nul

echo.
echo Setup done. Now run:  RUN.bat
echo Then open: http://localhost:3011
echo.
pause
