# IC Maintenance - System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         IC MAINTENANCE SYSTEM                        │
│                    Building Maintenance Management SaaS              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  Customer Portal │  │   Staff Portal   │  │  Trades Portal  │  │
│  │   Port: 3000     │  │   Port: 3001     │  │   Port: 3002    │  │
│  ├──────────────────┤  ├──────────────────┤  ├─────────────────┤  │
│  │ - Submit Jobs    │  │ - CRM            │  │ - View Jobs     │  │
│  │ - Track Status   │  │ - Assign Jobs    │  │ - Submit Quotes │  │
│  │ - Approve Quotes │  │ - Quote Compare  │  │ - Track Work    │  │
│  │ - View Reports   │  │ - Analytics      │  │ - Earnings      │  │
│  │ - Notifications  │  │ - Full Access    │  │ - Ratings       │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬────────┘  │
│           │                     │                      │            │
│           └─────────────────────┼──────────────────────┘            │
│                                 │                                   │
└─────────────────────────────────┼───────────────────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │    HTTPS/JWT    │
                         │  Authentication │
                         └────────┬────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────┐
│                           API LAYER                                  │
├─────────────────────────────────┼───────────────────────────────────┤
│                                 │                                    │
│         ┌───────────────────────▼───────────────────────┐           │
│         │       Express.js REST API (Port 5000)         │           │
│         │              Node.js Backend                   │           │
│         └───────────────────────┬───────────────────────┘           │
│                                 │                                    │
│    ┌────────────────────────────┼────────────────────────────┐     │
│    │                            │                             │     │
│    ▼                            ▼                             ▼     │
│ ┌──────────┐            ┌──────────────┐             ┌─────────┐  │
│ │   Auth   │            │     Jobs     │             │  Quotes │  │
│ │ /api/auth│            │  /api/jobs   │             │/api/quotes│ │
│ └──────────┘            └──────────────┘             └─────────┘  │
│                                                                     │
│    ▼                            ▼                             ▼     │
│ ┌──────────┐            ┌──────────────┐             ┌─────────┐  │
│ │   Data   │            │    Reports   │             │ Notify  │  │
│ │/api/data │            │ /api/reports │             │/api/notif│ │
│ └──────────┘            └──────────────┘             └─────────┘  │
│                                                                     │
│         ┌───────────────────────────────────────────┐             │
│         │         Middleware Layer                  │             │
│         ├───────────────────────────────────────────┤             │
│         │ • JWT Verification                        │             │
│         │ • Role-based Authorization                │             │
│         │ • File Upload Handling                    │             │
│         │ • Error Handling                          │             │
│         │ • Request Validation                      │             │
│         └───────────────────────┬───────────────────┘             │
│                                 │                                   │
└─────────────────────────────────┼───────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────┼───────────────────────────────────┐
│                        DATABASE LAYER                                │
├─────────────────────────────────┼───────────────────────────────────┤
│                                 │                                    │
│                    ┌────────────▼───────────┐                       │
│                    │    SQLite / PostgreSQL  │                       │
│                    │    (icmaintenance.db)   │                       │
│                    └────────────┬───────────┘                       │
│                                 │                                    │
│  ┌──────────────────────────────┼───────────────────────────────┐  │
│  │                              │                                │  │
│  │  ┌───────┐  ┌──────────┐  ┌────┐  ┌────────┐  ┌──────────┐ │  │
│  │  │ users │  │customers │  │jobs│  │ quotes │  │  trades  │ │  │
│  │  └───┬───┘  └────┬─────┘  └─┬──┘  └───┬────┘  └────┬─────┘ │  │
│  │      │           │           │          │            │        │  │
│  │      └───────────┴───────────┼──────────┴────────────┘        │  │
│  │                              │                                │  │
│  │  ┌────────────┐  ┌──────────▼─────┐  ┌─────────────────┐   │  │
│  │  │categories  │  │  job_history   │  │  notifications  │   │  │
│  │  └────────────┘  └────────────────┘  └─────────────────┘   │  │
│  │                                                              │  │
│  │  ┌────────────┐  ┌────────────────┐  ┌─────────────────┐  │  │
│  │  │priorities  │  │  job_statuses  │  │ job_attachments │  │  │
│  │  └────────────┘  └────────────────┘  └─────────────────┘  │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      STORAGE & SERVICES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────┐              ┌─────────────────────┐        │
│  │   File Storage     │              │  Email Service      │        │
│  │   (./uploads/)     │              │  (Nodemailer)       │        │
│  ├────────────────────┤              ├─────────────────────┤        │
│  │ • Job Photos       │              │ • Job Notifications │        │
│  │ • Documents        │              │ • Status Updates    │        │
│  │ • Attachments      │              │ • Quote Alerts      │        │
│  │ Organized by Job   │              │ • Welcome Emails    │        │
│  └────────────────────┘              └─────────────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Job Creation Flow

```
┌─────────────┐
│  CUSTOMER   │
│   PORTAL    │
└──────┬──────┘
       │
       │ 1. Submit Job Request
       │    (POST /api/jobs)
       │
       ▼
┌──────────────────┐
│   API SERVER     │
│  authController  │──── Verify JWT
│  jobController   │──── Validate Data
└──────┬───────────┘
       │
       │ 2. Create Job Record
       │
       ▼
┌──────────────────┐
│    DATABASE      │
│ INSERT INTO jobs │
└──────┬───────────┘
       │
       │ 3. Job Created
       │
       ├────────────────────────────────────┐
       │                                    │
       ▼                                    ▼
┌──────────────────┐              ┌──────────────────┐
│  job_history     │              │  notifications   │
│  (audit trail)   │              │  (to customer    │
│                  │              │   and staff)     │
└──────────────────┘              └──────────────────┘
       │                                    │
       │                                    │
       └─────────────┬──────────────────────┘
                     │
                     │ 4. Notifications Sent
                     │
                     ▼
              ┌──────────────┐
              │    EMAIL     │
              │   SERVICE    │
              └──────────────┘
```

### Quote Approval Flow

```
┌───────────┐     ┌──────────┐     ┌───────────┐
│   TRADE   │────▶│  STAFF   │────▶│ CUSTOMER  │
│  PORTAL   │     │  PORTAL  │     │  PORTAL   │
└───────────┘     └──────────┘     └───────────┘
     │                 │                  │
     │ 1. Submit       │ 2. Review &      │ 3. Approve
     │    Quote        │    Compare       │    Quote
     │                 │                  │
     ▼                 ▼                  ▼
┌────────────────────────────────────────────┐
│              API SERVER                     │
└───────────────┬────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│           DATABASE                        │
│                                           │
│  quotes ──┬── status: pending             │
│           ├── status: pending             │
│           └── status: approved ✓          │
│                                           │
│  jobs ──── status: Approved               │
│                                           │
└──────────────────────────────────────────┘
                │
                │
                ▼
┌──────────────────────────────────────────┐
│         NOTIFICATIONS                     │
│                                           │
│  • Trade: Quote approved                  │
│  • Customer: Ready to schedule            │
│  • Staff: Job approved                    │
└──────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

1. Authentication Layer
   ┌──────────────────────────────────────────┐
   │  • JWT Token Generation                  │
   │  • bcrypt Password Hashing (10 rounds)   │
   │  • Token Expiry (7 days)                 │
   │  • Login Rate Limiting (Future)          │
   └──────────────────────────────────────────┘

2. Authorization Layer
   ┌──────────────────────────────────────────┐
   │  • Role-Based Access Control (RBAC)      │
   │  • Customer Data Isolation               │
   │  • Route-Level Permissions               │
   │  • Resource-Level Permissions            │
   └──────────────────────────────────────────┘

3. Data Security
   ┌──────────────────────────────────────────┐
   │  • SQL Injection Prevention              │
   │  • Parameterized Queries                 │
   │  • Input Validation                      │
   │  • XSS Protection                        │
   │  • CORS Configuration                    │
   └──────────────────────────────────────────┘

4. File Security
   ┌──────────────────────────────────────────┐
   │  • File Type Validation                  │
   │  • Size Limits (10MB)                    │
   │  • Unique Filenames                      │
   │  • Path Traversal Prevention             │
   └──────────────────────────────────────────┘
```

## Role-Based Access Matrix

```
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┓
┃   Resource    ┃ Customer ┃ Staff  ┃ Trade  ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━┩
│ Own Jobs      │   CRUD   │  CRUD  │  R     │
│ All Jobs      │   ✗      │  CRUD  │  ✗     │
│ Own Quotes    │   R      │  CRUD  │  CRUD  │
│ All Quotes    │   ✗      │  CRUD  │  ✗     │
│ Customers     │   R (own)│  CRUD  │  ✗     │
│ Trades        │   R      │  CRUD  │  R(own)│
│ Categories    │   R      │  CRUD  │  R     │
│ Reports       │   R (own)│  R(all)│  R(own)│
│ Notifications │   RUD    │  RUD   │  RUD   │
└───────────────┴──────────┴────────┴────────┘

Legend:
C = Create, R = Read, U = Update, D = Delete, ✗ = No Access
```

## Technology Stack Details

```
Frontend Stack
├── React 18.2.0
│   ├── React Router 6.20.0 (Navigation)
│   ├── Axios 1.6.2 (HTTP Client)
│   └── CSS3 (Styling)
│
Backend Stack
├── Node.js v16+
│   ├── Express 4.18.2 (Web Framework)
│   ├── SQLite3 5.1.6 (Database - Dev)
│   ├── PostgreSQL (Database - Production)
│   ├── JWT 9.0.2 (Authentication)
│   ├── bcryptjs 2.4.3 (Password Hashing)
│   ├── Multer 1.4.5 (File Upload)
│   ├── Nodemailer 6.9.7 (Email)
│   └── UUID 9.0.1 (Unique IDs)
│
Development Tools
├── Nodemon 3.0.2 (Auto-restart)
├── dotenv 16.3.1 (Environment)
└── CORS 2.8.5 (Cross-origin)
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                    DIGITAL OCEAN                             │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    App Platform / Droplet                   │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              NGINX Reverse Proxy                     │ │
│  │              (SSL Termination)                       │ │
│  └───┬──────────────────┬───────────────────┬──────────┘ │
│      │                  │                   │             │
│      ▼                  ▼                   ▼             │
│  ┌────────┐       ┌────────┐         ┌────────┐         │
│  │Customer│       │ Staff  │         │ Trades │         │
│  │ Portal │       │ Portal │         │ Portal │         │
│  │(Static)│       │(Static)│         │(Static)│         │
│  └────────┘       └────────┘         └────────┘         │
│      │                  │                   │             │
│      └──────────────────┼───────────────────┘             │
│                         │                                 │
│                         ▼                                 │
│              ┌──────────────────────┐                     │
│              │   Node.js API        │                     │
│              │   (PM2 Managed)      │                     │
│              └──────────┬───────────┘                     │
│                         │                                 │
└─────────────────────────┼─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Managed PostgreSQL Database                     │
│              (Automated Backups)                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Spaces (Object Storage)                       │
│                (File Uploads)                                │
└─────────────────────────────────────────────────────────────┘
```

This architecture provides a comprehensive view of how all components of the IC Maintenance system work together!
