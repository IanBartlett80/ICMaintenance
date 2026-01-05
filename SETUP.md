# IC Maintenance - Quick Start Guide

This guide will help you get the IC Maintenance system up and running in under 10 minutes.

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] A code editor (VS Code recommended)
- [ ] A terminal/command prompt

## Installation Steps

### Step 1: Clone or Navigate to Repository

```bash
cd /workspaces/ICMaintenance
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

This installs all backend dependencies defined in package.json:
- express (web framework)
- sqlite3 (database)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- multer (file uploads)
- nodemailer (email notifications)
- And more...

### Step 3: Configure Environment Variables

```bash
# Create your environment file from the example
cp .env.example .env
```

Edit `.env` file with your settings:

```bash
# Minimal configuration for development:
NODE_ENV=development
PORT=5000
DATABASE_PATH=./database/icmaintenance.db
JWT_SECRET=your-secret-key-change-this-in-production

# Email (optional for development, required for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@icmaintenance.com
```

**Important:** Change `JWT_SECRET` to a secure random string!

### Step 4: Setup Database

```bash
npm run setup
```

This script will:
- Create the `database` folder
- Create SQLite database file
- Create all tables
- Insert default categories, priorities, and statuses
- Create the `uploads` folder

You should see:
```
✓ Database schema created successfully
✓ Default data inserted successfully
Database setup completed successfully!
```

### Step 5: Seed Test Data (Optional but Recommended)

```bash
npm run seed
```

This creates test accounts:
- Staff account
- Customer account  
- Trade specialist account
- Sample job

You should see:
```
✓ Staff user created
✓ Customer user created
✓ Trade specialist created
✓ Sample job created

Test Accounts:
Staff Account:
  Email: staff@icmaintenance.com
  Password: staff123
...
```

### Step 6: Start Backend Server

```bash
npm run dev:backend
```

You should see:
```
╔════════════════════════════════════════════════════╗
║   IC Maintenance Management API Server            ║
║   Server running on port 5000                      ║
║   Environment: development                         ║
║                                                    ║
║   API Base URL: http://localhost:5000/api          ║
║                                                    ║
║   Health Check: http://localhost:5000/api/health   ║
╚════════════════════════════════════════════════════╝
```

Test the API:
```bash
curl http://localhost:5000/api/health
```

### Step 7: Setup Customer Portal (in new terminal)

```bash
cd frontend/customer-portal
npm install
npm start
```

The customer portal will open at http://localhost:3000

### Step 8: Setup Staff Portal (in new terminal)

```bash
cd frontend/staff-portal
npm install
npm start
```

The staff portal will open at http://localhost:3001

### Step 9: Setup Trades Portal (in new terminal)

```bash
cd frontend/trades-portal
npm install
npm start
```

The trades portal will open at http://localhost:3002

## Testing the System

### Login to Each Portal

**Customer Portal** (http://localhost:3000)
- Email: `customer@example.com`
- Password: `customer123`

**Staff Portal** (http://localhost:3001)
- Email: `staff@icmaintenance.com`
- Password: `staff123`

**Trades Portal** (http://localhost:3002)
- Email: `trade@example.com`
- Password: `trade123`

### Test a Complete Workflow

1. **As Customer:**
   - Login to customer portal
   - Navigate to "New Request"
   - Fill in maintenance request form:
     - Category: Plumbing
     - Priority: High
     - Title: "Leaking bathroom sink"
     - Description: "Sink has been leaking for 2 days..."
     - Upload photo (optional)
   - Submit request
   - Note the Job Number (e.g., JOB-1234567890-ABC12)

2. **As Staff:**
   - Login to staff portal
   - View new job in dashboard
   - Click on the job
   - Assign to trade specialist
   - Change status to "Awaiting Quotes"

3. **As Trade:**
   - Login to trades portal
   - View assigned job
   - Click "Submit Quote"
   - Enter quote details:
     - Amount: $150
     - Description: "Replace sink trap and seals"
     - Estimated duration: "2 hours"
   - Submit quote

4. **As Staff:**
   - View quote comparison
   - Change status to "Pending Approval"

5. **As Customer:**
   - View job details
   - See quote
   - Click "Approve Quote"

6. **Check Notifications:**
   - Each user should have received notifications at key steps

## Common Issues and Solutions

### Issue: "EADDRINUSE: Port already in use"

**Solution:** 
```bash
# Kill process using the port (example for port 5000)
# On Linux/Mac:
lsof -i :5000
kill -9 <PID>

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "Cannot find module 'xyz'"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database errors

**Solution:**
```bash
# Recreate database
rm -rf database
npm run setup
npm run seed
```

### Issue: "JWT malformed" or authentication errors

**Solution:**
- Clear browser localStorage
- Login again
- Check that JWT_SECRET is set in .env

### Issue: File upload fails

**Solution:**
```bash
# Ensure uploads directory exists
mkdir -p uploads
chmod 755 uploads
```

## Folder Structure

```
ICMaintenance/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── jobController.js     # Job management
│   │   ├── quoteController.js   # Quote management
│   │   ├── dataController.js    # Master data
│   │   ├── notificationController.js
│   │   └── reportController.js  # Analytics
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── upload.js            # File upload config
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── quotes.js
│   │   ├── data.js
│   │   ├── notifications.js
│   │   └── reports.js
│   ├── scripts/
│   │   ├── setup-database.js    # Database schema
│   │   └── seed-data.js         # Test data
│   └── server.js                # Express app
├── frontend/
│   ├── customer-portal/         # React app for customers
│   ├── staff-portal/            # React app for staff
│   └── trades-portal/           # React app for trades
├── database/                     # SQLite database (created)
├── uploads/                      # Uploaded files (created)
├── .env                         # Environment config
├── .gitignore
├── package.json
├── README.md
├── DESIGN.md
└── SETUP.md
```

## API Endpoints Quick Reference

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get profile (requires auth)
- PUT `/api/auth/profile` - Update profile (requires auth)

### Jobs
- GET `/api/jobs` - List jobs (filtered by role)
- GET `/api/jobs/:id` - Get job details
- POST `/api/jobs` - Create job (customer/staff only)
- PUT `/api/jobs/:id` - Update job (staff only)
- POST `/api/jobs/attachments` - Upload files
- DELETE `/api/jobs/attachments/:id` - Delete file

### Quotes
- GET `/api/quotes/job/:jobId` - Get quotes for job
- POST `/api/quotes` - Create quote (trade/staff only)
- PUT `/api/quotes/:id/status` - Approve/reject quote
- GET `/api/quotes/job/:jobId/comparison` - Compare quotes (staff only)

### Data
- GET `/api/data/categories` - List categories
- POST `/api/data/categories` - Create category (staff only)
- GET `/api/data/priorities` - List priorities
- GET `/api/data/statuses` - List statuses
- GET `/api/data/trade-specialists` - List trades
- GET `/api/data/customers` - List customers (staff only)

### Reports
- GET `/api/reports/dashboard` - Dashboard stats
- GET `/api/reports/job-statistics` - Job analytics
- GET `/api/reports/financial` - Financial reports
- GET `/api/reports/performance` - Performance metrics (staff only)

### Notifications
- GET `/api/notifications` - Get notifications
- GET `/api/notifications/unread-count` - Unread count
- PUT `/api/notifications/:id/read` - Mark as read
- PUT `/api/notifications/read-all` - Mark all read

## Development Tips

### Hot Reload

The backend uses `nodemon` for automatic restart on file changes:
```bash
npm run dev:backend
```

The frontend uses `react-scripts` which automatically hot reloads.

### Debugging

Add console.log statements or use VS Code debugger:

```javascript
// In backend controllers:
console.log('Debug info:', variable);
```

### Testing API with curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@icmaintenance.com","password":"staff123"}'

# Use the token from response
TOKEN="your-jwt-token-here"

# Get jobs
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN"
```

### Testing API with Postman

1. Import the API base URL: `http://localhost:5000/api`
2. Create requests for each endpoint
3. Use Bearer Token authentication
4. Save responses for testing

## Next Steps

1. ✅ **Explore the System**
   - Try all three portals
   - Create jobs, quotes, approve workflows
   - Check notifications
   - View reports

2. ✅ **Customize**
   - Add your own categories
   - Update branding/colors
   - Modify email templates

3. ✅ **Extend**
   - Add new features
   - Integrate with other systems
   - Add AI capabilities

4. ✅ **Deploy**
   - Follow deployment guide in README.md
   - Configure production database
   - Setup SSL certificates
   - Configure email service

## Getting Help

- Read the full [README.md](README.md)
- Review [DESIGN.md](DESIGN.md) for architecture details
- Check the code comments
- Review error logs in terminal

## System Requirements

**Minimum:**
- 2 GB RAM
- 1 CPU core
- 500 MB disk space

**Recommended:**
- 4 GB RAM
- 2 CPU cores
- 2 GB disk space

## Performance Notes

- SQLite is suitable for up to 50-100 concurrent users
- For production with 50+ customers, migrate to PostgreSQL
- Consider Redis for caching in high-traffic scenarios
- Use CDN for static assets in production

---

🎉 **Congratulations!** You now have a fully functional maintenance management system running locally.

For production deployment, see the detailed deployment section in [README.md](README.md).
