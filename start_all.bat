@echo off
setlocal ENABLEEXTENSIONS

REM One-click launcher for Treasure of Seychelles (Windows)
REM - Installs deps if missing
REM - Starts backend (port 3001) and frontend (port 3000) in separate PowerShell windows
REM - Opens browser to http://localhost:3000

REM Resolve repo root and key paths (handle spaces)
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

echo.
echo ==============================================
echo   Treasure of Seychelles - One Click Start
echo ==============================================
echo Root: "%ROOT%"
echo Backend: "%BACKEND%"
echo Frontend: "%FRONTEND%"
echo.

REM Sanity checks
if not exist "%BACKEND%\package.json" (
  echo [ERROR] Backend package.json not found at "%BACKEND%\package.json"
  echo Make sure you are running this script from the project root.
  pause
  exit /b 1
)

if not exist "%FRONTEND%\package.json" (
  echo [ERROR] Frontend package.json not found at "%FRONTEND%\package.json"
  echo Make sure you are running this script from the project root.
  pause
  exit /b 1
)

REM Install backend dependencies if missing
if not exist "%BACKEND%\node_modules" (
  echo [SETUP] Installing backend dependencies...
  pushd "%BACKEND%"
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed in backend.
    popd
    pause
    exit /b 1
  )
  popd
)

REM Install frontend dependencies if missing
if not exist "%FRONTEND%\node_modules" (
  echo [SETUP] Installing frontend dependencies...
  pushd "%FRONTEND%"
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed in frontend.
    popd
    pause
    exit /b 1
  )
  popd
)

REM Start backend in a new PowerShell window
echo [START] Launching backend (port 3001)...
start "Treasure Backend" powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location '%BACKEND%'; npm run dev"

REM Give backend a moment to boot
timeout /t 2 /nobreak >nul

REM Start frontend in a new PowerShell window
echo [START] Launching frontend (port 3000)...
start "Treasure Frontend" powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location '%FRONTEND%'; npm start"

REM Open the app in default browser
echo [OPEN] http://localhost:3000
start "" http://localhost:3000

echo.
echo [INFO] Two new windows were opened: Backend and Frontend.
echo        Close those windows to stop the servers.
echo.
echo Done.
timeout /t 1 >nul
exit /b 0
