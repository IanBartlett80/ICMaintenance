# IC Maintenance - Local Testing Guide

## Quick Start Scripts

You now have easy-to-use scripts to start the application locally:

### Option 1: Start Backend + Customer Portal (Recommended for Testing)

```bash
./start.sh
```

This starts:
- ✅ Backend API (http://localhost:5000)
- ✅ Customer Portal (http://localhost:3000)

**Best for:** Testing the main customer workflow

---

### Option 2: Start Everything (All Portals)

```bash
./start-all.sh
```

This starts:
- ✅ Backend API (http://localhost:5000)
- ✅ Customer Portal (http://localhost:3000)
- ✅ Staff Portal (http://localhost:3001)
- ✅ Trades Portal (http://localhost:3002)

**Best for:** Complete system testing

---

## What the Scripts Do Automatically

Both scripts will:
1. ✅ Check if `.env` exists (creates it if missing)
2. ✅ Check if database exists (runs setup if missing)
3. ✅ Offer to create test accounts
4. ✅ Install dependencies if needed
5. ✅ Start all services in the background
6. ✅ Create log files for debugging
7. ✅ Display access URLs and test accounts
8. ✅ Handle graceful shutdown with Ctrl+C

---

## First Time Setup

If this is your first time, the script will prompt you:

```
⚠️  Database not found. Running setup...
Do you want to create test accounts? (y/n)
```

Type `y` to create test accounts with these credentials:
- **Staff:** staff@icmaintenance.com / staff123
- **Customer:** customer@example.com / customer123
- **Trade:** trade@example.com / trade123

---

## Manual Start (Alternative)

If you prefer to start services manually in separate terminals:

### Terminal 1 - Backend:
```bash
npm run dev:backend
```

### Terminal 2 - Customer Portal:
```bash
cd frontend/customer-portal
npm start
```

### Terminal 3 - Staff Portal (optional):
```bash
cd frontend/staff-portal
npm start
```

### Terminal 4 - Trades Portal (optional):
```bash
cd frontend/trades-portal
npm start
```

---

## Accessing the Application

### Customer Portal (http://localhost:3000)
- Submit maintenance requests
- Track job status
- Approve quotes
- View reports

**Login:** customer@example.com / customer123

### Staff Portal (http://localhost:3001)
- Manage all jobs
- Assign trade specialists
- Compare quotes
- View analytics

**Login:** staff@icmaintenance.com / staff123

### Trades Portal (http://localhost:3002)
- View assigned jobs
- Submit quotes
- Track earnings

**Login:** trade@example.com / trade123

### Backend API (http://localhost:5000)
- Health check: http://localhost:5000/api/health
- API documentation in README.md

---

## Testing the Complete Workflow

### Step 1: Submit a Job (as Customer)
1. Go to http://localhost:3000
2. Login as customer
3. Click "New Request"
4. Fill in:
   - Category: Plumbing
   - Title: "Leaking kitchen tap"
   - Description: "Tap has been leaking for 2 days"
   - Priority: High
5. Upload a photo (optional)
6. Submit

### Step 2: Assign Trade (as Staff)
1. Go to http://localhost:3001
2. Login as staff
3. View the new job
4. Assign to trade specialist
5. Change status to "Awaiting Quotes"

### Step 3: Submit Quote (as Trade)
1. Go to http://localhost:3002
2. Login as trade
3. View assigned job
4. Click "Submit Quote"
5. Enter amount: $150
6. Add description
7. Submit

### Step 4: Approve Quote (as Customer)
1. Back to http://localhost:3000
2. View job details
3. See the quote
4. Click "Approve"

### Step 5: Complete Job
1. As staff, mark job as "Scheduled"
2. Then mark as "In Progress"
3. Finally mark as "Completed"

---

## Viewing Logs

Logs are saved in the `logs/` directory:

```bash
# View backend logs
tail -f logs/backend.log

# View customer portal logs
tail -f logs/customer.log

# View staff portal logs
tail -f logs/staff.log

# View trades portal logs
tail -f logs/trades.log
```

---

## Stopping the Application

Press **Ctrl+C** in the terminal where you ran the start script.

This will gracefully stop all services.

---

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Check what's using the port
lsof -i :5000  # or :3000, :3001, :3002

# Kill the process
kill -9 <PID>
```

### Database Errors

Reset the database:

```bash
rm -rf database/
npm run setup
npm run seed
```

### Module Not Found

Reinstall dependencies:

```bash
# Backend
npm install

# Customer Portal
cd frontend/customer-portal && npm install

# Staff Portal  
cd frontend/staff-portal && npm install

# Trades Portal
cd frontend/trades-portal && npm install
```

### Clear Browser Cache

If you see old data:
1. Open browser DevTools (F12)
2. Go to Application → Storage
3. Clear localStorage
4. Refresh page

---

## API Testing with curl

Test the API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@icmaintenance.com","password":"staff123"}'

# Get jobs (requires token from login)
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Development Tips

### Hot Reload
- Backend: Automatically restarts on file changes (nodemon)
- Frontend: Automatically reloads on file changes (react-scripts)

### Debugging
- Backend: Add `console.log()` statements in controllers
- Frontend: Use browser DevTools console
- Database: Use SQLite browser or CLI

### Making Changes
1. Edit files in your code editor
2. Changes are automatically detected
3. Check logs for any errors
4. Test in browser

---

## What's Running

When you start the app, these services are running:

```
┌─────────────────────────────────────────┐
│  Backend API (Node.js/Express)          │
│  Port: 5000                             │
│  Handles: Auth, Jobs, Quotes, Reports   │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┬─────────────┐
    ▼                 ▼             ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Customer │   │  Staff   │   │  Trades  │
│  Portal  │   │  Portal  │   │  Portal  │
│   :3000  │   │   :3001  │   │   :3002  │
└──────────┘   └──────────┘   └──────────┘
```

---

## Next Steps

After testing locally:
1. ✅ Test all features
2. ✅ Customize for your needs
3. ✅ Add your branding
4. ✅ Deploy to production (see README.md)

---

## Quick Commands Reference

```bash
# Start customer portal only
./start.sh

# Start all portals
./start-all.sh

# Setup database
npm run setup

# Create test accounts
npm run seed

# View logs
tail -f logs/backend.log

# Stop all (press in terminal)
Ctrl+C
```

---

**Happy Testing! 🚀**

For more information, see:
- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Detailed setup guide
- [DESIGN.md](DESIGN.md) - System architecture
