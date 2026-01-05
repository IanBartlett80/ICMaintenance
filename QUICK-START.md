# IC Maintenance - Quick Start Guide

## 🚀 Getting Started

### System Status
✅ **Backend API**: Running on http://localhost:5000  
✅ **Customer Portal**: Running on http://localhost:3000  
✅ **Database**: SQLite configured and seeded

---

## 🌐 Access the Application

### Customer Portal
Open your browser and navigate to:
```
http://localhost:3000
```

### Demo Credentials
Use these credentials to test the application:

**Customer Account**:
- Email: `customer@example.com`
- Password: `customer123`

**Staff Account** (when portal is built):
- Email: `staff@example.com`
- Password: `staff123`

**Trade Account** (when portal is built):
- Email: `trade@example.com`
- Password: `trade123`

---

## 📱 Customer Portal Features

### 1. Landing Page (`/`)
- View platform overview
- Learn about services
- See organization types
- Read FAQ
- Click "Get Started" to register
- Click "Sign In" to login

### 2. Registration (`/register`)
- Fill out 3-step form:
  1. Organization details
  2. Location information
  3. Admin account
- Submit to create account
- Check email for verification (simulated)
- Login with new credentials

### 3. Login (`/login`)
- Enter email and password
- Use demo credentials for quick access
- Click "Sign In"
- Automatically redirected to dashboard

### 4. Dashboard (`/dashboard`)
Once logged in, you'll see:
- **Statistics**: Total jobs, active jobs, completed jobs
- **Quick Actions**: Create new request or view reports
- **Recent Jobs**: Last 5 maintenance requests
- **Navigation**: Links to all major sections

### 5. View All Jobs (`/jobs`)
- See complete list of maintenance requests
- Filter by status (All, New, In Progress, Completed)
- Search by job number, title, or category
- Click any job number to view details (coming soon)
- Click "+ New Request" to create job

### 6. Create New Job (`/jobs/new`)
- Fill required fields:
  - Title (min 5 characters)
  - Description (min 20 characters)
  - Category (select from dropdown)
  - Priority (defaults to Normal)
  - Location
- Upload files:
  - Images: JPG, PNG, GIF
  - Documents: PDF
  - Max 5MB per file
- Click "Submit Request"
- View created job

---

## 🧪 Testing the Application

### Test Scenario 1: New User Registration
1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill out all 3 steps
4. Submit registration
5. See success message
6. Go to login page
7. Login with new credentials

### Test Scenario 2: Create Maintenance Request
1. Login as customer
2. Click "New Request" from dashboard or navigation
3. Fill out form:
   - Title: "Leaking faucet in unit 201"
   - Description: "The kitchen faucet has been leaking for 2 days. Water is dripping constantly even when fully closed."
   - Category: Select "Plumbing"
   - Priority: Select "High"
   - Location: "Building A, Unit 201, Kitchen"
4. (Optional) Upload photos
5. Click "Submit Request"
6. See job in list

### Test Scenario 3: Browse and Filter Jobs
1. Go to "My Jobs" from navigation
2. Click different status filters
3. Use search box to find specific jobs
4. Notice count badges update
5. Click "View" to see details (coming soon)

### Test Scenario 4: Dashboard Overview
1. Login and land on dashboard
2. Review stat cards (should show your jobs)
3. See recent jobs in table
4. Click job number to view details (coming soon)
5. Use quick action cards

---

## 🛠️ Development Commands

### Start Everything
From project root:
```bash
./start.sh
```

This starts:
- Backend API (port 5000)
- Customer Portal (port 3000)
- Staff Portal (port 3001) - not built yet
- Trades Portal (port 3002) - not built yet

### Start Individual Services

**Backend Only**:
```bash
cd /workspaces/ICMaintenance
npm run dev
# or
nodemon backend/server.js
```

**Customer Portal Only**:
```bash
cd /workspaces/ICMaintenance/frontend/customer-portal
npm start
```

**Staff Portal** (when built):
```bash
cd /workspaces/ICMaintenance/frontend/staff-portal
npm start
```

**Trades Portal** (when built):
```bash
cd /workspaces/ICMaintenance/frontend/trades-portal
npm start
```

### Stop Services
Press `Ctrl+C` in each terminal

### Restart Services
If ports are occupied:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Then restart
./start.sh
```

---

## 📊 Database Management

### View Database
```bash
sqlite3 database/ic_maintenance.db
```

### Common SQL Commands
```sql
-- View all tables
.tables

-- View organizations
SELECT * FROM organizations;

-- View users
SELECT * FROM users;

-- View jobs
SELECT * FROM jobs;

-- Exit
.quit
```

### Reseed Database
If you need fresh data:
```bash
cd /workspaces/ICMaintenance
node backend/scripts/seed-data.js
```

---

## 🔍 API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"customer123"}'

# Get user profile (replace TOKEN with actual token)
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Test Jobs API
```bash
# Get all jobs (replace TOKEN)
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TOKEN"

# Create new job (replace TOKEN)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job",
    "description": "This is a test maintenance request",
    "location": "Building A",
    "category_id": 1,
    "priority_id": 2
  }'
```

---

## 📁 Project Structure

```
/workspaces/ICMaintenance/
├── backend/
│   ├── server.js              # Express server
│   ├── config/
│   │   └── database.js        # Database connection
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth, validation
│   ├── routes/                # API endpoints
│   └── scripts/               # Setup & seed scripts
├── database/
│   └── ic_maintenance.db      # SQLite database
├── frontend/
│   └── customer-portal/
│       ├── public/
│       └── src/
│           ├── App.js         # Main app component
│           ├── index.js       # React entry point
│           ├── index.css      # Global styles
│           ├── components/    # React components
│           │   ├── LandingPage.js
│           │   ├── RegisterPage.js
│           │   ├── JobsPage.js
│           │   └── NewJobPage.js
│           └── services/
│               └── api.js     # API client
├── logs/                      # Application logs
├── uploads/                   # Uploaded files
└── *.md                       # Documentation
```

---

## 🎨 Customization

### Change Primary Color
Edit `/workspaces/ICMaintenance/frontend/customer-portal/src/index.css`:
```css
:root {
  --primary: #0066CC;     /* Change this */
  --primary-light: #0080FF;
  --primary-dark: #0052A3;
}
```

### Add New Category
```sql
sqlite3 database/ic_maintenance.db
INSERT INTO categories (name, description) 
VALUES ('New Category', 'Description here');
```

### Change Logo
Replace text in navigation with image:
- Edit `App.js`
- Find `<h1>IC Maintenance</h1>`
- Replace with `<img src="/logo.png" alt="Logo" />`
- Add logo.png to `public/` folder

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database Locked
```bash
# Check for processes using database
fuser database/ic_maintenance.db

# If needed, restart backend
```

### Module Not Found
```bash
cd frontend/customer-portal
npm install
```

### API Not Responding
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check backend logs
tail -f logs/app.log
```

### Blank Page in Browser
1. Check browser console (F12) for errors
2. Verify API URL in browser network tab
3. Check that backend is running
4. Try clearing browser cache

---

## 📚 Documentation

### Design & Architecture
- [DESIGN.md](DESIGN.md) - System design specifications
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [PROJECT-OVERVIEW.md](PROJECT-OVERVIEW.md) - Project overview

### Implementation Details
- [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md) - What's been built
- [UI-GUIDE.md](UI-GUIDE.md) - UI/UX guidelines
- [SETUP.md](SETUP.md) - Installation instructions

### Development Guides
- [START-GUIDE.md](START-GUIDE.md) - Getting started
- [NEXT-STEPS.md](NEXT-STEPS.md) - Future enhancements
- [SUMMARY.md](SUMMARY.md) - Project summary

---

## ✅ Current Status

### ✅ Completed
- Landing page with full features
- Multi-step registration
- Modern login page
- Dashboard with statistics
- Jobs list with filtering and search
- New job creation form
- File upload functionality
- Responsive design
- Authentication system
- API integration

### 🚧 In Progress
- Job detail page
- Quote management
- Reports dashboard

### 📋 Pending
- Email notifications
- Real-time updates
- Staff portal
- Trades portal
- Payment integration
- Advanced analytics

---

## 🎯 Next Steps

1. **Test the application** using demo credentials
2. **Create some sample jobs** to populate the dashboard
3. **Review the UI** and provide feedback
4. **Check mobile responsiveness** on different devices
5. **Plan next features** from NEXT-STEPS.md

---

## 💡 Tips

### For Development
- Use React DevTools browser extension
- Check Network tab for API calls
- Use console.log for debugging
- Keep backend terminal visible for errors

### For Testing
- Use demo credentials for quick access
- Try edge cases (empty fields, long text)
- Test file uploads with different types
- Test on different screen sizes

### For Production
- Change all demo credentials
- Enable HTTPS
- Set up proper email service
- Configure proper file storage
- Add error monitoring
- Enable analytics

---

## 🆘 Need Help?

### Common Questions
1. **Q**: How do I add a new user?  
   **A**: Use the registration page or insert directly into database

2. **Q**: Where are uploaded files stored?  
   **A**: `/workspaces/ICMaintenance/uploads/` directory

3. **Q**: How do I reset the database?  
   **A**: Run `node backend/scripts/seed-data.js`

4. **Q**: Can I change the port?  
   **A**: Yes, edit `package.json` and backend `server.js`

5. **Q**: Is this production ready?  
   **A**: Customer portal Phase 1 is ready, but needs security hardening

### Resources
- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- SQLite Docs: https://sqlite.org/docs.html

---

## 🎉 Success!

Your IC Maintenance customer portal is now running with a world-class UI!

**Access it at**: http://localhost:3000

Enjoy building the future of maintenance management! 🚀
