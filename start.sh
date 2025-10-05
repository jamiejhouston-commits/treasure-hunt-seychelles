#!/bin/bash

# 🏴‍☠️ The Treasure of Seychelles - Quick Start Script
# This script sets up and runs both backend and frontend

set -e  # Exit on any error

echo "🏴‍☠️ Welcome to The Treasure of Seychelles!"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Function to check if directory exists
check_directory() {
    if [ ! -d "$1" ]; then
        echo "❌ Directory $1 not found. Are you in the project root?"
        exit 1
    fi
}

# Check if we're in the right directory
check_directory "backend"
check_directory "frontend"

echo ""
echo "🔧 Setting up Backend..."
echo "========================"

# Setup backend
cd backend

# Check if .env exists, if not copy from example
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "⚠️  Please edit backend/.env with your configuration before continuing."
        echo "   Required: XUMM_API_KEY, XUMM_API_SECRET, XRPL_WALLET_SEED"
        read -p "Press Enter after updating .env file..."
    else
        echo "❌ .env.example not found in backend directory"
        exit 1
    fi
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Run database migrations
echo "🗄️  Setting up database..."
if npm run migrate 2>/dev/null; then
    echo "✅ Database initialized"
else
    echo "⚠️  Database migration failed or already exists"
fi

# Start backend in background
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Give backend time to start
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend server started (PID: $BACKEND_PID)"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

cd ..

echo ""
echo "🎨 Setting up Frontend..."
echo "========================="

# Setup frontend
cd frontend

# Check if .env.local exists, if not copy from example
if [ ! -f ".env.local" ]; then
    echo "📄 Creating .env.local file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "⚠️  Please edit frontend/.env.local with your configuration."
        echo "   Required: REACT_APP_XUMM_API_KEY, REACT_APP_XUMM_API_SECRET"
        read -p "Press Enter after updating .env.local file..."
    else
        echo "❌ .env.example not found in frontend directory"
        exit 1
    fi
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo "👋 Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start frontend
echo "🚀 Starting frontend application..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Applications are starting up!"
echo "================================"
echo ""
echo "📊 Backend API:      http://localhost:3001"
echo "🌐 Frontend App:     http://localhost:3000"
echo "📚 API Docs:         http://localhost:3001/api-docs"
echo ""
echo "💡 Tips:"
echo "   - Make sure you have XUMM wallet app installed on your phone"
echo "   - Get testnet XRP from: https://xrpl.org/xrp-testnet-faucet.html"
echo "   - Check the README.md for detailed configuration"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for frontend to be ready
sleep 10

# Open browser (works on macOS and Linux)
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
fi

# Keep script running
wait