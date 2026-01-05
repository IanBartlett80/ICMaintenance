# 🚀 Quick Start Guide - ICMaintenance Platform

## Start the Application

```bash
cd /workspaces/ICMaintenance
./start-all.sh
```

## Access Portals

| Portal | URL | Purpose |
|--------|-----|---------|
| **Customer** | http://localhost:3000 | Customer-facing: Submit jobs, approve quotes |
| **Staff** | http://localhost:3001 | Internal CRM: Manage operations |
| **Trades** | http://localhost:3002 | Trade specialists: View jobs, submit quotes |
| **API** | http://localhost:5000 | Backend REST API |

## Test Credentials

### Customer Portal
```
Email: john.smith@techcorp.com
Password: Password123!
```

### Staff Portal
```
Email: admin@icmaintenance.com
Password: Admin123!
```

### Trades Portal
```
Email: mike@qualityelectric.com
Password: Trade123!
```

## Available Features

### Customer Portal (localhost:3000)
- ✅ Landing page with world-class design
- ✅ Create jobs with photo upload
- ✅ View and compare quotes
- ✅ Approve/reject quotes
- ✅ Analytics dashboard with charts
- ✅ Notifications center
- ✅ Profile management

### Staff Portal (localhost:3001)
- ✅ Dashboard with 8 key metrics
- ✅ Job management and assignment
- ✅ Customer CRM with history
- ✅ Trade specialist directory
- ✅ Category management
- ✅ Reports and analytics

### Trades Portal (localhost:3002)
- ✅ Dashboard showing assigned work
- ✅ View assigned jobs
- ✅ Submit detailed quotes with line items
- ✅ Profile and company management

## Manual Start (Alternative)

If you prefer to start services individually:

```bash
# Terminal 1 - Backend API
cd /workspaces/ICMaintenance/backend
node server.js

# Terminal 2 - Customer Portal
cd /workspaces/ICMaintenance/frontend/customer-portal
npm run dev

# Terminal 3 - Staff Portal
cd /workspaces/ICMaintenance/frontend/staff-portal
npm run dev

# Terminal 4 - Trades Portal
cd /workspaces/ICMaintenance/frontend/trades-portal
npm run dev
```

## Stop All Services

Press `Ctrl+C` in the terminal running `start-all.sh`

Or manually:
```bash
pkill -f "node.*backend/server.js"
pkill -f "vite.*customer-portal"
pkill -f "vite.*staff-portal"
pkill -f "vite.*trades-portal"
```

## Logs

View application logs:
```bash
tail -f /workspaces/ICMaintenance/logs/backend.log
tail -f /workspaces/ICMaintenance/logs/customer-portal.log
tail -f /workspaces/ICMaintenance/logs/staff-portal.log
tail -f /workspaces/ICMaintenance/logs/trades-portal.log
```

## Tech Stack

- **Frontend:** React 18 + TypeScript + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** SQLite (development)
- **Authentication:** JWT with role-based access
- **Charts:** Recharts
- **Icons:** Emoji-based

## File Structure

```
/workspaces/ICMaintenance/
├── backend/               # Node.js API server
│   ├── server.js         # Main server file
│   ├── config/           # Database config
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth, upload
│   └── routes/           # API routes
├── frontend/
│   ├── customer-portal/  # Port 3000
│   ├── staff-portal/     # Port 3001
│   └── trades-portal/    # Port 3002
├── database/             # SQLite database
└── start-all.sh         # Startup script
```

## Database Location

SQLite database: `/workspaces/ICMaintenance/database/icmaintenance.db`

## Common Tasks

### Create new customer account:
1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Fill registration form
4. Login with credentials

### Assign job to trade specialist (Staff):
1. Login to Staff Portal
2. Go to Jobs page
3. Click "Manage" on a job
4. Select trade from dropdown
5. Click "Assign"

### Submit quote (Trade):
1. Login to Trades Portal
2. Go to Quotes page
3. Select job
4. Add line items
5. Submit quote

## Support

For questions or issues, refer to:
- **DESIGN.md** - Original design specifications
- **ARCHITECTURE.md** - System architecture
- **FINAL-IMPLEMENTATION-REPORT.md** - Complete feature list

---

**Status:** ✅ Production Ready
**Last Updated:** December 2024
