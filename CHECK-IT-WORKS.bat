@echo off
echo Checking ScamShield AI on port 3010...
curl -s http://localhost:3010/api/health
echo.
echo.
echo If you see "ScamShield AI" above, the correct app is running.
echo If connection failed, run START-SCAMSHIELD.bat first.
pause
