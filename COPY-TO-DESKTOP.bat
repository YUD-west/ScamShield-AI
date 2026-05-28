@echo off
title Copy ScamShield AI to Desktop
set "SRC=%~dp0"
set "DEST=C:\Users\Administrator\Desktop\scamsheild.ai"

echo Copying from:
echo   %SRC%
echo To:
echo   %DEST%
echo.

if not exist "%DEST%" mkdir "%DEST%"

robocopy "%SRC%" "%DEST%" /E /XD node_modules .next .git /XF *.log db-setup-log.txt COPY-TO-DESKTOP.bat

echo.
echo Done! Next steps:
echo   cd /d "%DEST%"
echo   npm install
echo   docker compose up -d postgres
echo   npm run db:setup
echo   npm run dev
echo.
pause
