@echo off
REM 🏴‍☠️ The Treasure of Seychelles - Quick Start Script (Windows)
REM This script sets up and runs both backend and frontend

echo 🏴‍☠️ Welcome to The Treasure of Seychelles!
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Check if directories exist
if not exist "backend" (
    echo ❌ Backend directory not found. Are you in the project root?
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Frontend directory not found. Are you in the project root?
    pause
    exit /b 1
)

echo.
echo 🔧 Setting up Backend...
echo ========================

REM Setup backend
cd backend

REM Check if .env exists, if not copy from example
if not exist ".env" (
    echo 📄 Creating .env file from template...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ⚠️  Please edit backend\.env with your configuration before continuing.
        echo    Required: XUMM_API_KEY, XUMM_API_SECRET, XRPL_WALLET_SEED
        pause
    ) else (
        echo ❌ .env.example not found in backend directory
        pause
        exit /b 1
    )
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Run database migrations
echo 🗄️  Setting up database...
call npm run migrate 2>nul
if %ERRORLEVEL% equ 0 (
    echo ✅ Database initialized
) else (
    echo ⚠️  Database migration failed or already exists
)

REM Start backend in background
echo 🚀 Starting backend server...
start "Backend Server" cmd /c "npm run dev"

REM Give backend time to start
timeout /t 3 /nobreak >nul

cd ..

echo.
echo 🎨 Setting up Frontend...
echo =========================

REM Setup frontend  
cd frontend

REM Check if .env.local exists, if not copy from example
if not exist ".env.local" (
    echo 📄 Creating .env.local file from template...
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo ⚠️  Please edit frontend\.env.local with your configuration.
        echo    Required: REACT_APP_XUMM_API_KEY, REACT_APP_XUMM_API_SECRET
        pause
    ) else (
        echo ❌ .env.example not found in frontend directory
        pause
        exit /b 1
    )
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Start frontend
echo 🚀 Starting frontend application...
start "Frontend App" cmd /c "npm start"

echo.
echo 🎉 Applications are starting up!
echo ================================
echo.
echo 📊 Backend API:      http://localhost:3001
echo 🌐 Frontend App:     http://localhost:3000
echo 📚 API Docs:         http://localhost:3001/api-docs
echo.
echo 💡 Tips:
echo    - Make sure you have XUMM wallet app installed on your phone
echo    - Get testnet XRP from: https://xrpl.org/xrp-testnet-faucet.html
echo    - Check the README.md for detailed configuration
echo.
echo Both applications should open automatically in new windows.
echo Close those windows to stop the servers.
echo.

REM Wait for frontend to be ready then open browser
timeout /t 10 /nobreak >nul
start http://localhost:3000

echo Press any key to exit this window...
pause >nul