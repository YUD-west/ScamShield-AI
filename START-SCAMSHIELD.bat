@echo off
title ScamShield AI - Port 3010
color 0B
cd /d "%~dp0"

echo.
echo  ============================================
echo    SCAMSHIELD AI - http://localhost:3010
echo  ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing packages...
  call npm install
)

if not exist .env (
  copy /Y .env.example .env
)

echo Checking database...
docker compose up -d postgres >nul 2>&1
timeout /t 4 /nobreak >nul
call node scripts\ensure-db.cjs

echo Login: demo@scamshield.ai / Demo1234!
echo.
echo Starting server - keep this window OPEN.
echo.

start "" "http://localhost:3010"
call npm run dev
pause
