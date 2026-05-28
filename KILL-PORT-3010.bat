@echo off
echo Stopping anything on port 3010...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3010 ^| findstr LISTENING') do (
  echo Killing PID %%a
  taskkill /F /PID %%a 2>nul
)
echo Done. Run: npm run dev
pause
