@echo off
cd /d "%~dp0"
call FIX-ALL.bat
if errorlevel 1 exit /b 1
call RUN.bat
