@echo off
title ScamShield — Database Setup
cd /d "%~dp0"

echo.
echo  Starting PostgreSQL (Docker)...
docker compose up -d postgres
timeout /t 6 /nobreak >nul

echo.
echo  Pushing schema and seeding...
call npx prisma generate
if errorlevel 1 goto fail
call npx prisma db push
if errorlevel 1 goto fail
call npm run db:seed
if errorlevel 1 goto fail

echo.
echo  Done! Demo accounts:
echo    demo@scamshield.ai / Demo1234!
echo    admin@scamshield.ai / Admin1234!
echo.
pause
exit /b 0

:fail
echo.
echo  Setup failed. Install Docker Desktop and try again.
pause
exit /b 1
