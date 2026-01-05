#!/bin/bash

# IC Maintenance - Local Development Startup Script
# This script starts all components of the system for local testing

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     IC Maintenance Management System                   ║"
echo "║     Starting Local Development Environment            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your settings if needed."
    echo ""
fi

# Check if database exists
if [ ! -f database/icmaintenance.db ]; then
    echo "⚠️  Database not found. Running setup..."
    npm run setup
    echo ""
    
    read -p "Do you want to create test accounts? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run seed
    fi
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    echo ""
fi

# Check frontend dependencies
if [ ! -d frontend/customer-portal/node_modules ]; then
    echo "📦 Installing customer portal dependencies..."
    cd frontend/customer-portal
    npm install
    cd ../..
    echo ""
fi

echo "🚀 Starting services..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start backend server
echo "▶️  Starting Backend API on http://localhost:5000"
npm run dev:backend > logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start customer portal
echo "▶️  Starting Customer Portal on http://localhost:3000"
cd frontend/customer-portal
PORT=3000 npm start > ../../logs/customer.log 2>&1 &
CUSTOMER_PID=$!
cd ../..

# Wait a moment
sleep 2

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║     All Services Started! 🎉                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Services running at:"
echo "   Backend API:      http://localhost:5000"
echo "   Customer Portal:  http://localhost:3000"
echo ""
echo "📋 Test Accounts:"
echo "   Staff:    staff@icmaintenance.com / staff123"
echo "   Customer: customer@example.com / customer123"
echo "   Trade:    trade@example.com / trade123"
echo ""
echo "📁 Logs are being written to:"
echo "   Backend:  logs/backend.log"
echo "   Customer: logs/customer.log"
echo ""
echo "💡 Tips:"
echo "   - Press Ctrl+C to stop all services"
echo "   - Customer portal will open in your browser automatically"
echo "   - Check logs if you encounter any issues"
echo ""
echo "⏳ Services are running... (Press Ctrl+C to stop)"
echo ""

# Wait for all background processes
wait
