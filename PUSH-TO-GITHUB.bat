@echo off
cd /d "%~dp0"
echo Close dev server first if open...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
node scripts\git-push.cjs
pause
