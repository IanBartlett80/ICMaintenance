#!/bin/bash

# IC Maintenance - Start All Portals Script
# This script starts backend + all three portals for complete testing

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     IC Maintenance Management System                   ║"
echo "║     Starting ALL Portals (Customer, Staff, Trades)    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
fi

if [ ! -f database/icmaintenance.db ]; then
    echo "⚠️  Database not found. Running setup..."
    npm run setup
    npm run seed
    echo ""
fi

# Install dependencies if needed
if [ ! -d node_modules ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

for portal in customer-portal staff-portal trades-portal; do
    if [ ! -d "frontend/$portal/node_modules" ]; then
        echo "📦 Installing $portal dependencies..."
        cd "frontend/$portal"
        npm install
        cd ../..
    fi
done

echo ""
echo "🚀 Starting all services..."
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Create logs directory
mkdir -p logs

# Start backend
echo "▶️  Backend API:      http://localhost:5000"
npm run dev:backend > logs/backend.log 2>&1 &
sleep 3

# Start customer portal
echo "▶️  Customer Portal:  http://localhost:3000"
cd frontend/customer-portal
PORT=3000 npm start > ../../logs/customer.log 2>&1 &
cd ../..
sleep 2

# Start staff portal
echo "▶️  Staff Portal:     http://localhost:3001"
cd frontend/staff-portal
PORT=3001 npm start > ../../logs/staff.log 2>&1 &
cd ../..
sleep 2

# Start trades portal
echo "▶️  Trades Portal:    http://localhost:3002"
cd frontend/trades-portal
PORT=3002 npm start > ../../logs/trades.log 2>&1 &
cd ../..

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║     All Services Running! 🎉                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Access your portals:"
echo "   🔧 Backend API:      http://localhost:5000/api/health"
echo "   👤 Customer Portal:  http://localhost:3000"
echo "   👔 Staff Portal:     http://localhost:3001"
echo "   🔨 Trades Portal:    http://localhost:3002"
echo ""
echo "📋 Test Accounts:"
echo "   Staff:    staff@icmaintenance.com / staff123"
echo "   Customer: customer@example.com / customer123"
echo "   Trade:    trade@example.com / trade123"
echo ""
echo "📁 Logs: logs/backend.log, logs/customer.log, logs/staff.log, logs/trades.log"
echo ""
echo "⏳ All services running... (Press Ctrl+C to stop all)"
echo ""

wait
