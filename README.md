# IC Maintenance Management System

A comprehensive SaaS solution for managing building maintenance operations with end-to-end workflow support for customers, internal staff, and trade specialists.

## 🏗️ System Overview

IC Maintenance is a full-stack maintenance management platform designed for residential properties, property management companies, and sporting organizations. The system provides:

- **Customer Portal** - Submit and track maintenance requests with live status updates
- **Staff Portal** - CRM-style management of jobs, quotes, and scheduling
- **Trades Portal** - View assigned jobs and submit competitive quotes
- **Automated Workflows** - From request submission through to job completion
- **Quote Management** - Compare and approve quotes with automated selection tools
- **Reporting & Analytics** - Financial metrics, job statistics, and performance tracking

## 🚀 Key Features

### For Customers
- ✅ Simple maintenance request submission with photo uploads
- ✅ Live tracking of maintenance request status
- ✅ Quote approval workflow
- ✅ Financial reporting and job history
- ✅ Email and in-app notifications
- ✅ Secure access to own data only

### For Internal Staff
- ✅ Complete CRM functionality for managing customers
- ✅ Job assignment and scheduling
- ✅ Automated quote comparison
- ✅ Trade specialist directory management
- ✅ Custom category management
- ✅ Comprehensive reporting dashboard
- ✅ Performance metrics and analytics
- ✅ Full access to all customer data

### For Trade Specialists
- ✅ View assigned jobs
- ✅ Submit detailed quotes with line items
- ✅ Track job completion
- ✅ Rating system
- ✅ Earnings tracking

## 📋 Maintenance Categories

The system comes pre-configured with industry-standard categories:

- Electrical
- Plumbing
- HVAC (Air Conditioning & Heating)
- Carpentry
- Painting
- Roofing
- Tiling
- Landscaping
- Pest Control
- Cleaning
- Locksmith
- Glass & Glazing
- Flooring
- General Repairs

**Note:** Staff can add additional custom categories as needed.

## 🏛️ System Architecture

### Technology Stack

**Backend:**
- Node.js with Express.js
- SQLite (development) / PostgreSQL-ready (production)
- JWT authentication
- Role-based access control
- RESTful API design

**Frontend:**
- React 18
- React Router for navigation
- Axios for API communication
- Responsive design

**Database:**
- Comprehensive relational schema
- Foreign key constraints
- Audit trail (job_history table)
- Optimized indexes

### Database Schema

#### Core Tables
- `users` - All user accounts (customers, staff, trades)
- `customers` - Customer organization details
- `trade_specialists` - Trade company information
- `jobs` - Maintenance requests
- `quotes` - Trade specialist quotes
- `categories` - Maintenance service categories
- `priority_levels` - Job priority classification
- `job_statuses` - Workflow status tracking
- `notifications` - In-app and email notifications
- `job_history` - Complete audit trail
- `job_attachments` - Photo and document storage

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/IanBartlett80/ICMaintenance.git
   cd ICMaintenance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `JWT_SECRET` - Change to a secure random string
   - `EMAIL_*` - Configure your SMTP settings

4. **Setup database**
   ```bash
   npm run setup
   ```
   
   This creates the SQLite database and all tables.

5. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```
   
   Creates test accounts for development.

6. **Start the backend server**
   ```bash
   npm run dev:backend
   ```
   
   Server runs on http://localhost:5000

7. **Install and start frontend (in separate terminals)**
   
   **Customer Portal:**
   ```bash
   cd frontend/customer-portal
   npm install
   npm start
   ```
   Runs on http://localhost:3000
   
   **Staff Portal:**
   ```bash
   cd frontend/staff-portal
   npm install
   npm start
   ```
   Runs on http://localhost:3001
   
   **Trades Portal:**
   ```bash
   cd frontend/trades-portal
   npm install
   npm start
   ```
   Runs on http://localhost:3002

## 👥 Test Accounts

After running `npm run seed`, you can login with:

### Staff Account
- **Email:** staff@icmaintenance.com
- **Password:** staff123
- **Access:** Full system access

### Customer Account
- **Email:** customer@example.com
- **Password:** customer123
- **Access:** Customer portal only

### Trade Account
- **Email:** trade@example.com
- **Password:** trade123
- **Access:** Trades portal only

## 📊 Workflow Overview

### Job Lifecycle

1. **New** - Customer submits maintenance request
2. **Under Review** - Staff reviews and categorizes
3. **Awaiting Quotes** - Trade specialists are assigned
4. **Quotes Received** - Quotes submitted and compared
5. **Pending Approval** - Customer reviews and approves quote
6. **Approved** - Quote approved, ready to schedule
7. **Scheduled** - Job date/time confirmed
8. **In Progress** - Work being performed
9. **Completed** - Job finished successfully
10. **Cancelled** - Job cancelled (if needed)

### Priority Levels

- **Critical** - Emergency/safety hazard (2-hour response)
- **High** - Urgent issue (24-hour response)
- **Medium** - Important but not urgent (72-hour response)
- **Low** - Routine maintenance (7-day response)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Customer data isolation
- SQL injection prevention
- File upload validation
- CORS configuration
- Environment variable protection

## 📈 Reporting Capabilities

### Customer Reports
- Total spending
- Job statistics
- Spending by category
- Job completion history

### Staff Reports
- Revenue analytics
- Job statistics by status/priority/category
- Customer analysis
- Performance metrics
- Average time to completion
- Quote comparison analytics
- Top performing trades

### Trade Reports
- Earnings tracking
- Completed jobs
- Quote approval rate
- Performance ratings

## 🔧 API Documentation

### Authentication Endpoints

```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile
PUT /api/auth/profile - Update profile
POST /api/auth/change-password - Change password
```

### Job Endpoints

```
GET /api/jobs - List jobs (filtered by role)
GET /api/jobs/:id - Get job details
POST /api/jobs - Create new job
PUT /api/jobs/:id - Update job
POST /api/jobs/attachments - Upload files
DELETE /api/jobs/attachments/:id - Delete attachment
```

### Quote Endpoints

```
GET /api/quotes/job/:jobId - Get quotes for job
POST /api/quotes - Create quote
PUT /api/quotes/:id/status - Approve/reject quote
PUT /api/quotes/:id/withdraw - Withdraw quote
GET /api/quotes/job/:jobId/comparison - Compare quotes (staff only)
```

### Data Endpoints

```
GET /api/data/categories - List categories
POST /api/data/categories - Create category (staff)
GET /api/data/priorities - List priority levels
GET /api/data/statuses - List job statuses
GET /api/data/trade-specialists - List trades
GET /api/data/customers - List customers (staff)
```

### Report Endpoints

```
GET /api/reports/dashboard - Dashboard statistics
GET /api/reports/job-statistics - Job analytics
GET /api/reports/financial - Financial reports
GET /api/reports/performance - Performance metrics (staff)
```

### Notification Endpoints

```
GET /api/notifications - Get user notifications
GET /api/notifications/unread-count - Unread count
PUT /api/notifications/:id/read - Mark as read
PUT /api/notifications/read-all - Mark all read
DELETE /api/notifications/:id - Delete notification
```

## 🚀 Deployment to Digital Ocean

### Preparation

1. Update `.env` for production:
   - Set `NODE_ENV=production`
   - Change `JWT_SECRET` to secure value
   - Update database to PostgreSQL
   - Configure production email settings

2. Build frontend applications:
   ```bash
   cd frontend/customer-portal && npm run build
   cd frontend/staff-portal && npm run build
   cd frontend/trades-portal && npm run build
   ```

### Digital Ocean Deployment Options

1. **App Platform** (Recommended for beginners)
   - Automatic deployments from GitHub
   - Managed PostgreSQL database
   - SSL certificates included
   - Auto-scaling

2. **Droplet** (More control)
   - Ubuntu 22.04 LTS
   - Install Node.js, PostgreSQL, Nginx
   - Configure PM2 for process management
   - Setup SSL with Let's Encrypt

3. **Docker** (Containerized)
   - Create Dockerfile
   - Use Docker Compose for services
   - Deploy to App Platform or Kubernetes

## 📝 Development Notes

### Adding New Features

1. **New API Endpoint:**
   - Create controller in `/backend/controllers/`
   - Add route in `/backend/routes/`
   - Update API service in frontend

2. **New Database Table:**
   - Update `/backend/scripts/setup-database.js`
   - Add indexes for performance
   - Consider foreign keys and cascades

3. **New Frontend Page:**
   - Create component in `/src/pages/`
   - Add route in App.js
   - Update navigation

### Best Practices

- All database queries use parameterized statements
- Authentication required on all protected routes
- File uploads validated for type and size
- Error handling with try-catch blocks
- Logging for debugging and auditing
- Regular database backups

## 🎯 Future Enhancements

This system is designed to easily integrate:

- AI-powered job categorization and priority detection
- Chatbot for customer support (using ChatGPT API)
- MCP (Model Context Protocol) integration
- SMS notifications
- Mobile applications (React Native)
- Calendar integration
- Payment processing (Stripe/PayPal)
- Multi-language support
- Document generation (invoices, work orders)
- Advanced analytics and forecasting
- Trade specialist bidding system
- Preventive maintenance scheduling

## 🤝 Support

For questions or issues:
1. Check the documentation
2. Review error logs
3. Test with demo accounts
4. Contact support

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with modern web technologies and industry best practices for building maintenance management.
ICMaintenance 
