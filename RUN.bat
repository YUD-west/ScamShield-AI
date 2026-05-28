@echo off
title ScamShield AI - http://localhost:3011
cd /d "%~dp0"

echo.
echo  Starting ScamShield on http://localhost:3011
echo  KEEP THIS WINDOW OPEN!
echo.
echo  Login: demo@scamshield.ai / Demo1234!
echo.

call node scripts\kill-port.cjs
call npm run dev
