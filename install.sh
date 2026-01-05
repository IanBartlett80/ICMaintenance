#!/bin/bash

# IC Maintenance - Installation Script
# This script automates the complete setup process

set -e  # Exit on any error

echo "╔════════════════════════════════════════════════════════╗"
echo "║     IC Maintenance Management System                   ║"
echo "║     Automated Installation Script                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install
echo "✅ Backend dependencies installed"
echo ""

# Setup environment
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created (please update with your settings)"
else
    echo "✅ .env file already exists"
fi
echo ""

# Setup database
echo "🗄️  Setting up database..."
npm run setup
echo "✅ Database setup complete"
echo ""

# Seed test data
read -p "Do you want to create test accounts? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding test data..."
    npm run seed
    echo "✅ Test data created"
fi
echo ""

# Setup customer portal
echo "🎨 Setting up Customer Portal..."
cd frontend/customer-portal
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Customer Portal dependencies installed"
else
    echo "✅ Customer Portal dependencies already installed"
fi
cd ../..
echo ""

# Setup staff portal
echo "🎨 Setting up Staff Portal..."
cd frontend/staff-portal
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Staff Portal dependencies installed"
else
    echo "✅ Staff Portal dependencies already installed"
fi
cd ../..
echo ""

# Setup trades portal
echo "🎨 Setting up Trades Portal..."
cd frontend/trades-portal
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Trades Portal dependencies installed"
else
    echo "✅ Trades Portal dependencies already installed"
fi
cd ../..
echo ""

# Complete
echo "╔════════════════════════════════════════════════════════╗"
echo "║     Installation Complete! 🎉                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "To start the system, run these commands in separate terminals:"
echo ""
echo "1. Backend API:"
echo "   npm run dev:backend"
echo ""
echo "2. Customer Portal:"
echo "   cd frontend/customer-portal && npm start"
echo ""
echo "3. Staff Portal:"
echo "   cd frontend/staff-portal && npm start"
echo ""
echo "4. Trades Portal:"
echo "   cd frontend/trades-portal && npm start"
echo ""
echo "Test accounts (if you seeded data):"
echo "  Staff:    staff@icmaintenance.com / staff123"
echo "  Customer: customer@example.com / customer123"
echo "  Trade:    trade@example.com / trade123"
echo ""
echo "For more information, see:"
echo "  README.md - Complete documentation"
echo "  SETUP.md  - Detailed setup guide"
echo "  DESIGN.md - System design document"
echo ""
echo "Happy coding! 🚀"
