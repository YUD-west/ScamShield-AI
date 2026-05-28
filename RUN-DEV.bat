@echo off
cd /d "%~dp0"
title ScamShield AI - Next.js
echo.
echo  ScamShield AI SaaS
echo  Folder: %CD%
echo.
where node >nul 2>&1 || (echo Install Node.js from https://nodejs.org/ & pause & exit /b 1)
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
if not exist .env (
  echo Copying .env.example to .env
  copy .env.example .env
)
echo.
echo  ScamShield AI ONLY - http://localhost:3010
echo  (Ports 3000/3001 are other projects - do not use those)
echo  Press Ctrl+C to stop
echo.
start "" "http://localhost:3010"
call npm run dev
pause
