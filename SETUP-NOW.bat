@echo off
title ScamShield AI - Quick Setup
color 0B
cd /d "%~dp0"

echo.
echo  [1/4] Copying full project from scamshield-ai...
set "SRC=C:\Users\Administrator\scamshield-ai"
if not exist "%SRC%\src" (
  echo ERROR: Source not found at %SRC%
  pause
  exit /b 1
)
robocopy "%SRC%" "%~dp0" /E /XD node_modules .next .git /XF SETUP-NOW.bat copy-from-source.js /NFL /NDL /NJH /NJS

echo.
echo  [2/4] Installing packages...
call npm install
if errorlevel 1 goto fail

echo.
echo  [3/4] Database setup...
docker compose up -d postgres 2>nul
timeout /t 5 /nobreak >nul
call npm run db:setup

echo.
echo  [4/4] Starting app...
echo.
echo  Open: http://localhost:3010
echo  Login: demo@scamshield.ai / Demo1234!
echo.
start "" "http://localhost:3010"
call npm run dev
goto end

:fail
echo Setup failed. Install Node.js from https://nodejs.org
pause
exit /b 1

:end
pause
