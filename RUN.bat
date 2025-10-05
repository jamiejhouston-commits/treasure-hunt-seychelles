@echo off
title Treasure of Seychelles - Quick Start

echo Starting Treasure of Seychelles...
echo.

REM Kill any existing node processes
taskkill /F /IM node.exe /T >nul 2>&1

REM Start backend
echo Starting backend...
start "Backend" cmd /k "cd /d \"%~dp0backend\" && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start frontend  
echo Starting frontend...
start "Frontend" cmd /k "cd /d \"%~dp0frontend\" && npm start"

REM Wait 10 seconds then open browser
timeout /t 10 /nobreak >nul
start http://localhost:3000

echo.
echo Both servers are starting...
echo Frontend will open at: http://localhost:3000
echo Backend API is at: http://localhost:3001
echo.
echo Close this window when done.
pause