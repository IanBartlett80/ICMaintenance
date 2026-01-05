#!/bin/bash

# IC Maintenance - Complete Application Startup Script
# This script starts all three portals and the backend server

echo "🚀 Starting IC Maintenance Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is already running
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Backend already running on port 5000${NC}"
else
    echo -e "${BLUE}📡 Starting Backend Server (port 5000)...${NC}"
    cd /workspaces/ICMaintenance && npm run dev:backend > logs/backend.log 2>&1 &
    echo "Backend PID: $!"
fi

sleep 2

# Check and start Customer Portal
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Customer Portal already running on port 3000${NC}"
else
    echo -e "${BLUE}👥 Starting Customer Portal (port 3000)...${NC}"
    cd /workspaces/ICMaintenance/frontend/customer-portal && npm start > ../../logs/customer-portal.log 2>&1 &
    echo "Customer Portal PID: $!"
fi

sleep 2

# Check and start Staff Portal
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Staff Portal already running on port 3001${NC}"
else
    echo -e "${BLUE}🏢 Starting Staff Portal (port 3001)...${NC}"
    cd /workspaces/ICMaintenance/frontend/staff-portal && npm start > ../../logs/staff-portal.log 2>&1 &
    echo "Staff Portal PID: $!"
fi

sleep 2

# Check and start Trades Portal
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Trades Portal already running on port 3002${NC}"
else
    echo -e "${BLUE}🔧 Starting Trades Portal (port 3002)...${NC}"
    cd /workspaces/ICMaintenance/frontend/trades-portal && npm start > ../../logs/trades-portal.log 2>&1 &
    echo "Trades Portal PID: $!"
fi

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "📍 Access URLs:"
echo "  🏠 Landing Page:     http://localhost:3000"
echo "  👥 Customer Portal:  http://localhost:3000/dashboard"
echo "  🏢 Staff Portal:     http://localhost:3001"
echo "  🔧 Trades Portal:    http://localhost:3002"
echo "  📡 Backend API:      http://localhost:5000"
echo ""
echo "🔐 Test Accounts (after running: npm run seed)"
echo "  Staff:    staff@icmaintenance.com / staff123"
echo "  Customer: customer@example.com / customer123"
echo "  Trade:    trade@example.com / trade123"
echo ""
echo "📋 View logs:"
echo "  tail -f logs/backend.log"
echo "  tail -f logs/customer-portal.log"
echo "  tail -f logs/staff-portal.log"
echo "  tail -f logs/trades-portal.log"
echo ""
echo "🛑 To stop all services:"
echo "  pkill -f 'node.*server.js'"
echo "  pkill -f 'react-scripts'"
echo ""
